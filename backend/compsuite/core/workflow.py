"""Integrated engineering workflow.

Runs the modules in dependency order on one Project so every result
responds to every input:

  gas properties -> case compression -> sizing / stage design -> map and
  operating points -> materials -> impellers -> rotor assembly ->
  bearings -> shaft integrity -> seals -> lateral rotordynamics ->
  impeller stress -> torsional train -> lube system -> piping ->
  verification checklist

``level`` controls the cost: "full" (all analyses), "fast" (coarser
bearing tables, no Campbell/maps refinement) for optimisation loops.
"""

from __future__ import annotations

import math
import time

import numpy as np

from compsuite import __version__
from compsuite.aero.performance import operating_point, performance_map
from compsuite.aero.sizing import size_compressor
from compsuite.auxiliary.lube import lube_system
from compsuite.bearings.journal import bearing_performance, bearing_tables, size_journal
from compsuite.compression.process import evaluate_case
from compsuite.core.trace import input_hash, record
from compsuite.core.units import k_to_c
from compsuite.impeller.geometry import impeller_set
from compsuite.materials.database import at_temperature, screen_materials
from compsuite.mechanical.rotor import build_rotor, fe_model
from compsuite.mechanical.shaft import shaft_integrity
from compsuite.piping.flow import piping_analysis
from compsuite.rotordynamics import fe
from compsuite.rotordynamics.lateral import lateral_analysis
from compsuite.seals.seals import seal_analysis
from compsuite.standards.checklist import build_checklist
from compsuite.structural.disk import impeller_stress
from compsuite.thermo.backends import make_gas
from compsuite.torsional.train import build_train, torsional_analysis


def _gas_summary(gas, project) -> dict:
    case = project.design_case()
    st = gas.state(case.suction_temperature_c + 273.15, case.suction_pressure_bara * 1e5)
    dews = []
    try:
        dews = gas.dew_points(case.suction_pressure_bara * 1e5)
    except Exception:  # noqa: BLE001 - phase solver failures are reported as unknown
        pass
    return {"composition": gas.composition, "mw": gas.mw(), "engine": getattr(gas, "engine", "built-in"),
            "suction_state": st, "hydrocarbon_dew_point_c": k_to_c(max(dews)) if dews else None,
            "ph2s_suction_bar": gas.composition.get("H2S", 0.0) * case.suction_pressure_bara,
            "pco2_suction_bar": gas.composition.get("CO2", 0.0) * case.suction_pressure_bara}


def _supports_from_tables(tables: dict, rotor: dict, speeds_rad: np.ndarray) -> list[fe.Support]:
    out = []
    for (label, tab), z in zip(tables["bearings"].items(), rotor["bearing_z_m"]):
        rows = tab["rows"]
        table = {k: np.array([r[k] for r in rows]) for k in fe.COEF_KEYS}
        out.append(fe.Support(label, z, fe.tabulated_support(speeds_rad, table), "bearing"))
    return out


def run_project(project, level: str = "full") -> dict:
    t0 = time.time()
    res: dict = {"project": project.name, "revision": project.revision, "software_version": __version__,
                 "input_hash": input_hash(project), "level": level}
    gas = make_gas(project.gas.components, project.gas.backend)
    res["gas"] = _gas_summary(gas, project)

    # Step 4: selection and stage design on the design case.
    sizing = size_compressor(gas, project)
    res["sizing"] = sizing
    # Step 3: every operating case on the real-gas model; efficiency from the map when not given.
    ops = [operating_point(gas, sizing, project, c) for c in project.cases]
    res["operating_points"] = ops
    cases = []
    for c, op in zip(project.cases, ops):
        eta = c.polytropic_efficiency or op.get("eta_p") or sizing["polytropic_efficiency_overall"]
        out = evaluate_case(gas, c, float(eta), project.design_basis.mechanical_loss_fraction)
        if sizing["n_sections"] > 1:
            out["trace"].warn("Intercooled design: single-section case evaluation shown for reference; "
                              "see sizing sections and the operating point for the intercooled result")
        cases.append(out)
    res["cases"] = cases
    res["performance_map"] = performance_map(gas, sizing, project, n_points=16 if level == "full" else 8) \
        if level == "full" else {"lines": [], "surge_line": [], "stonewall_line": []}

    # Materials (screening) at the hottest condition.
    t_max = max(s["T_out_c"] for s in sizing["stages"])
    t_min = min(min(c.suction_temperature_c for c in project.cases), -10.0)
    ph2s = res["gas"]["ph2s_suction_bar"] * max(c.discharge_pressure_bara for c in project.cases) / project.design_case().suction_pressure_bara
    wet = "H2O" in project.gas.components
    shaft_mat = at_temperature(project.shaft.material, t_max)
    imp_mat = at_temperature(project.shaft.impeller_material, t_max)
    mats = {}
    for use, key, req in (("shaft", project.shaft.material, None), ("impeller", project.shaft.impeller_material, None),
                          ("casing", project.casing_material, None)):
        scr = screen_materials(use, t_max, t_min, ph2s, wet, req)
        sel = next((c for c in scr["candidates"] if c["key"] == key), None)
        if sel is None:
            m = at_temperature(key, t_max)
            sel = {"key": key, "checks": {"listed_for_use": False}, "suitable": False, "usable_yield_mpa": m["yield_mpa"]}
        scr["selected"] = sel
        mats[use] = scr
    res["materials"] = mats

    # Steps 5-11 per casing.
    casings = []
    speed = sizing["speed_rpm"]
    omega = speed * math.pi / 30
    db = project.design_basis
    n_mcs = speed * db.max_continuous_speed_pct / 100
    n_bear = 8 if level == "full" else 4
    speeds_rad = np.linspace(0.3, 1.35, n_bear) * n_mcs * math.pi / 30
    for ci, idxs in enumerate(sizing["casings"]):
        stages = [sizing["stages"][i] for i in idxs]
        power_w = sum(s["power_kw"] for s in stages) * 1e3 * (1 + db.mechanical_loss_fraction)
        sub = dict(sizing, stages=stages)
        torque = power_w / omega
        d0 = (16 * torque * project.shaft.torque_transient_factor / (math.pi * 0.15 * shaft_mat["yield_mpa"] * 1e6)) ** (1 / 3)
        imps = impeller_set(sub, gas, max(d0, 0.06), imp_mat, project.criteria)
        rotor = build_rotor(project, sizing, stages, imps["impellers"], power_w, shaft_mat, imp_mat)
        imps = impeller_set(sub, gas, rotor["shaft_diameter_impellers_m"], imp_mat, project.criteria)
        rotor = build_rotor(project, sizing, stages, imps["impellers"], power_w, shaft_mat, imp_mat)

        # Bearings: static loads from a provisional model on stiff supports.
        stiff = [fe.Support(f"Bearing {i + 1}", z, fe.constant_support(kxx=1e9, kyy=1e9)) for i, z in enumerate(rotor["bearing_z_m"])]
        prov = fe_model(rotor, shaft_mat, stiff)
        loads = prov.static_bearing_loads()
        if project.bearings.journal_type == "user" and project.bearings.user_coefficients:
            uc = project.bearings.user_coefficients.model_dump()
            supports = [fe.Support(f"Bearing {i + 1}", z, fe.constant_support(**uc)) for i, z in enumerate(rotor["bearing_z_m"])]
            tables = {"bearings": {s.label: {"geometry": {"type": "user"}, "speeds_rpm": [], "rows": []} for s in supports},
                      "trace": record("bearings", "User-supplied coefficients", uc)}
            rated = {s.label: {"h_min_m": float("nan"), "babbitt_temperature_est_c": float("nan"), "unit_load_mpa": float("nan"),
                               "power_loss_kw": 0.0} for s in supports}
        else:
            jb = {label: (size_journal(W, rotor["journal_diameter_m"], project.bearings), max(W, 100.0)) for label, W in loads.items()}
            tables = bearing_tables(jb, speeds_rad, project.bearings)
            supports = _supports_from_tables(tables, rotor, speeds_rad)
            bd = project.bearings
            rated = {label: bearing_performance(b, W, omega * db.max_continuous_speed_pct / 100, bd.oil_grade,
                                                bd.oil_supply_temperature_c, bd.oil_temperature_rise_c)
                     for label, (b, W) in jb.items()}
        model = fe_model(rotor, shaft_mat, supports)
        static = fe.static_deflection(model, omega)
        shaft = shaft_integrity(model, rotor, shaft_mat, project, [s["power_kw"] * 1e3 for s in stages], omega, static)
        seals = seal_analysis(gas, sub, imps["impellers"], project, rotor)
        lateral = lateral_analysis(model, rotor, sizing, project, seals["total_wachel_q_n_m"]) if level == "full" else \
            _lateral_fast(model, rotor, sizing, project, seals["total_wachel_q_n_m"])
        stress = impeller_stress(imps["impellers"], stages, imp_mat, lateral["speeds"], project.criteria)
        casings.append({"stages": idxs, "impellers": imps, "rotor": rotor, "bearings": tables, "bearing_rated": rated,
                        "static": static, "shaft": shaft, "seals": seals, "lateral": lateral, "impeller_stress": stress,
                        "mass_properties": model.mass_properties(), "_model": model, "_shaft_material": shaft_mat})
    res["casings"] = casings
    res["_gas"] = gas

    # Step 10: torsional train (driver + first casing).
    cas0 = casings[0]
    train = build_train(project, cas0["rotor"], sizing, shaft_mat)
    res["torsional"] = torsional_analysis(project, train, sizing, shaft_mat)
    if len(casings) > 1:
        res["torsional"]["trace"].warn("Multi-casing train: torsional model includes the driver and casing 1 only")

    # Step 12: auxiliaries.
    rated_rows = [r for c in casings for r in c["bearing_rated"].values()]
    res["lube"] = lube_system(rated_rows, {**cas0["rotor"]["thrust"], "inner_diameter_m": cas0["rotor"]["journal_diameter_m"] * 1.1},
                              omega, project, project.seals.shaft_end_seal)
    design_idx = next((i for i, c in enumerate(project.cases) if c.is_design), 0)
    res["piping"] = piping_analysis(gas, cases[design_idx], res["performance_map"], project)

    # Step 14: verification.
    res["checklist"] = build_checklist(project, res)
    res["summary"] = summary(res)
    res["elapsed_s"] = time.time() - t0
    return res


def _lateral_fast(model, rotor, sizing, project, q):
    """Reduced lateral analysis for optimisation loops: damped modes and
    Level I stability at MCS, no unbalance sweeps."""
    from compsuite.rotordynamics.lateral import level1_stability
    db = project.design_basis
    N = sizing["speed_rpm"]
    sp = {"min_rpm": N * db.min_operating_speed_pct / 100, "rated_rpm": N, "mcs_rpm": N * db.max_continuous_speed_pct / 100,
          "trip_rpm": N * db.trip_speed_pct / 100}
    w = sp["mcs_rpm"] * math.pi / 30
    structural = model.assemble_structural()
    basis = model.reduction_basis(w, 40, structural)
    md = fe.modal(model, w, 6, structural=structural, basis=basis)
    stab = level1_stability(model, rotor, w, q, structural, project.criteria, basis)
    fwd = [m for m in md["modes"] if m["whirl"] != "backward"]
    margins = [abs(m["freq_cpm"] - sp["mcs_rpm"]) / sp["mcs_rpm"] for m in fwd]
    return {"speeds": sp, "modes_at_mcs": [{k: m[k] for k in ("freq_cpm", "logdec", "whirl")} for m in md["modes"]],
            "stability": stab, "unbalance_cases": [], "min_mode_separation": min(margins) if margins else None,
            "mass_properties": model.mass_properties()}


def summary(res: dict) -> dict:
    sz = res["sizing"]
    cas = res["casings"][0]
    lat = cas["lateral"]
    tor = res.get("torsional", {})
    crit = sorted({round(p["speed_rpm"]) for c in lat.get("unbalance_cases", []) for p in c["peaks"] if p["af"] >= 2.5})
    return {
        "configuration": sz["configuration"], "type": sz["type_selection"]["recommended"],
        "speed_rpm": sz["speed_rpm"], "impeller_diameter_mm": sz["impeller_diameter_m"] * 1e3,
        "tip_speed_m_s": sz["tip_speed_m_s"], "stages": sz["n_stages"], "casings": sz["n_casings"],
        "polytropic_efficiency": sz["polytropic_efficiency_overall"], "shaft_power_kw": sz["shaft_power_kw"],
        "driver_rating_kw": sz["driver_rating_kw"], "discharge_temperature_c": sz["stages"][-1]["T_out_c"],
        "rotor_mass_kg": cas["mass_properties"]["mass_kg"], "bearing_span_mm": cas["rotor"]["bearing_span_m"] * 1e3,
        "shaft_diameter_mm": cas["rotor"]["shaft_diameter_impellers_m"] * 1e3,
        "journal_diameter_mm": cas["rotor"]["journal_diameter_m"] * 1e3,
        "critical_speeds_rpm": crit,
        "logdec_with_qa": lat["stability"]["logdec_with_qa"], "qa_n_m": lat["stability"]["qa_n_m"],
        "torsional_modes_hz": [m["freq_hz"] for m in tor.get("natural", {}).get("modes", [])][:4],
        "min_shaft_fatigue_safety": cas["shaft"]["min_fatigue_safety"],
        "checklist": res["checklist"]["counts"],
        "warnings": sorted({w for w in _all_warnings(res)}),
    }


def _all_warnings(obj):
    if isinstance(obj, dict):
        tr = obj.get("trace")
        if tr is not None and hasattr(tr, "warnings"):
            for w in tr.warnings:
                yield f"[{tr.module}] {w}"
        for k, v in obj.items():
            if k != "trace":
                yield from _all_warnings(v)
    elif isinstance(obj, list):
        for v in obj:
            yield from _all_warnings(v)


def collect_traces(obj, out=None) -> list:
    out = [] if out is None else out
    if isinstance(obj, dict):
        tr = obj.get("trace")
        if tr is not None and hasattr(tr, "module") and all(t is not tr for t in out):
            out.append(tr)
        for k, v in obj.items():
            if k != "trace":
                collect_traces(v, out)
    elif isinstance(obj, list):
        for v in obj:
            collect_traces(v, out)
    return out
