"""Off-design performance by stage stacking.

Each impeller keeps its design flow and head coefficients from the sizing
and follows the generic normalised stage curves in ``aero.stage``. For any
speed and mass flow the gas is marched through every stage on the real-gas
model, so density changes, intercooling and stage mismatching appear
naturally in the overall map.

Surge is flagged when any stage falls below r = phi/phi_d = R_SURGE and
stonewall when any stage exceeds R_STONEWALL. Mach-number effects on the
stage curves are not modelled.
"""

from __future__ import annotations

import math

import numpy as np
from scipy.optimize import brentq

from compsuite.aero import stage as sc
from compsuite.aero.sizing import _poly_step
from compsuite.compression.process import mass_flow
from compsuite.core.trace import record
from compsuite.core.units import c_to_k, bar_to_pa, k_to_c


def stack(gas, sizing, db, m: float, T1: float, P1: float, speed_frac: float) -> dict:
    D2 = sizing["impeller_diameter_m"]
    U2 = sizing["tip_speed_m_s"] * speed_frac
    area = math.pi / 4 * D2**2
    T, P = T1, P1
    head_tot = dh_tot = 0.0
    r_min, r_max = 9.0, 0.0
    prev_section = 0
    stage_pts = []
    for st in sizing["stages"]:
        if st["section"] != prev_section:
            T = c_to_k(db.intercooler_outlet_temperature_c)
            P = P - bar_to_pa(db.intercooler_pressure_drop_bar)
            prev_section = st["section"]
        rho = gas.density(T, P)
        phi = m / rho / (area * U2)
        r = phi / st["phi"]
        r_min, r_max = min(r_min, r), max(r_max, r)
        psi = st["psi"] * sc.psi_ratio(r)
        eta = st["eta"] * sc.eta_ratio(r)
        head = psi * U2**2
        if head <= 0:
            return {"valid": False, "stonewall": True, "surge": False, "r_min": r_min, "r_max": r_max}
        T, P = _poly_step(gas, T, P, head, eta)
        head_tot += head
        dh_tot += head / eta
        stage_pts.append({"r": r, "phi": phi, "psi": psi, "eta": eta})
    return {"valid": True, "P2": P, "T2": T, "head": head_tot, "eta": head_tot / dh_tot, "power_kw": m * dh_tot / 1e3,
            "surge": r_min < sc.R_SURGE, "stonewall": r_max > sc.R_STONEWALL, "r_min": r_min, "r_max": r_max,
            "stages": stage_pts}


def performance_map(gas, sizing, project, speeds=(0.70, 0.80, 0.90, 1.00, 1.05), n_points: int = 16) -> dict:
    db = project.design_basis
    case = project.design_case()
    T1, P1 = c_to_k(case.suction_temperature_c), bar_to_pa(case.suction_pressure_bara)
    rho1 = gas.density(T1, P1)
    m_d = sizing["mass_flow_kg_s"]
    lines, surge_line, stonewall_line = [], [], []
    for s in speeds:
        # Bound the valid flow range at this speed by the stage limits.
        m_lo = _limit_flow(gas, sizing, db, T1, P1, s, m_d, "surge")
        m_hi = _limit_flow(gas, sizing, db, T1, P1, s, m_d, "stonewall")
        pts = []
        for m in np.linspace(m_lo, m_hi, n_points):
            res = stack(gas, sizing, db, m, T1, P1, s)
            if not res["valid"]:
                continue
            pts.append({"mass_flow_kg_s": m, "q_am3_h": m / rho1 * 3600, "head_kj_kg": res["head"] / 1e3,
                        "pressure_ratio": res["P2"] / P1, "discharge_bara": res["P2"] / 1e5, "eta_p": res["eta"],
                        "power_kw": res["power_kw"], "discharge_c": k_to_c(res["T2"])})
        if pts:
            lines.append({"speed_frac": s, "speed_rpm": sizing["speed_rpm"] * s, "points": pts})
            surge_line.append(pts[0])
            stonewall_line.append(pts[-1])
    rec = record("aero.performance", "Stage stacking with generic normalised stage curves", [sizing["stages"], speeds],
                 assumptions=[f"Surge at phi/phi_d < {sc.R_SURGE} in any stage; stonewall at > {sc.R_STONEWALL}",
                              "Map at design-case suction conditions; Mach effects on curves neglected",
                              "Generic stage curves - replace with vendor or test curves for guarantees"])
    return {"lines": lines, "surge_line": surge_line, "stonewall_line": stonewall_line,
            "suction_conditions": {"T_c": case.suction_temperature_c, "P_bara": case.suction_pressure_bara},
            "trace": _map_steps(rec, sizing, speeds, n_points, lines)}


_SYM = {r"\dot m": ("Mass flow", "kg/s"), r"\rho": ("Stage inlet density", "kg/m³"), "D_2": ("Impeller tip diameter", "m"),
        "U_2": ("Tip speed at this speed", "m/s"), "U_{2,d}": ("Design tip speed", "m/s"), "s": ("Speed fraction of design", "-"),
        r"\phi": ("Stage flow coefficient", "-"), r"\phi_d": ("Stage design flow coefficient", "-"), "r": ("Flow ratio phi/phi_d", "-"),
        r"\psi": ("Stage head coefficient", "-"), r"\psi_d": ("Stage design head coefficient", "-"), r"\eta": ("Stage efficiency", "-"),
        r"\eta_d": ("Stage design efficiency", "-"), "H": ("Stage polytropic head", "J/kg"), r"f_\psi": ("Normalised head curve", "-"),
        r"f_\eta": ("Normalised efficiency curve", "-"), "r_s": ("Surge flow ratio", "-"), "r_c": ("Stonewall flow ratio", "-"),
        "N": ("Speed", "rpm"), "N_d": ("Design speed", "rpm"), r"\eta_p": ("Overall polytropic efficiency", "-"),
        "P_d": ("Discharge pressure", "Pa"), "P_{d,req}": ("Required discharge pressure", "Pa"), "T_d": ("Discharge temperature", "K"),
        "P": ("Power", "W"), "SM": ("Surge margin", "-"), r"\dot m_s": ("Surge mass flow at this speed", "kg/s"),
        "n_s": ("Number of speed lines", "-"), "n_q": ("Points per speed line", "-"), "Q_1": ("Suction volume flow", "m³/h"),
        "H_{st}": ("Stage polytropic head", "J/kg"), r"\eta_i": ("Stage efficiency", "-"), "H_p": ("Total polytropic head", "J/kg"), r"\Delta h": ("Total enthalpy rise", "J/kg")}


def _map_steps(rec, sizing, speeds, n_points, lines):
    rec.sym(**_SYM)
    rec.step("Stage flow coefficient", r"\phi = \frac{\dot m/\rho}{(\pi/4)\,D_2^2\,U_2},\quad U_2 = s\,U_{2,d}",
             {"D_2": (sizing["impeller_diameter_m"], "m"), "U_{2,d}": (sizing["tip_speed_m_s"], "m/s")}, "per stage", "", r"\phi",
             note="Each stage sees its own inlet density, so the stages drift apart off design")
    rec.step("Stage curves", r"\psi = \psi_d\,f_\psi(r),\quad \eta = \eta_d\,f_\eta(r),\quad r = \phi/\phi_d", {}, "per stage", "", r"\psi",
             note="Generic normalised curves around each stage's design point; heads summed stage by stage on the real-gas model")
    rec.step("Surge limit", r"\min_i r_i = r_s", {"r_s": sc.R_SURGE}, sc.R_SURGE, "", "r_s",
             note="Lowest flow at each speed found by halving the flow interval (to 0.01 % of design flow)")
    rec.step("Stonewall", r"\max_i r_i = r_c", {"r_c": sc.R_STONEWALL}, sc.R_STONEWALL, "", "r_c", note="Found the same way at the high-flow end")
    rec.step("Performance map", r"N = s\,N_d", {"n_s": len(speeds), "n_q": n_points, "N_d": (sizing["speed_rpm"], "rpm")},
             sum(len(l["points"]) for l in lines), "points", "", note="Equal flow steps between the surge and stonewall flow on each speed line")
    d = next((l for l in lines if abs(l["speed_frac"] - 1.0) < 1e-9), None)
    if d:
        rec.step("Surge flow at design speed", r"Q_1(\min_i r_i = r_s)", {"r_s": sc.R_SURGE}, d["points"][0]["q_am3_h"], "m³/h", "Q_1")
    op = sizing.get("_op_rec")
    if op is not None:
        rec.steps.extend(sorted(op.steps, key=lambda x: x["row"]))
    return rec


def _limit_flow(gas, sizing, db, T1, P1, s, m_d, kind):
    """Bisect the mass flow at which the first stage reaches the surge or stonewall ratio."""
    lo, hi = (0.2 * m_d * s, m_d * s) if kind == "surge" else (m_d * s, 2.5 * m_d * s)
    def bad(m):
        res = stack(gas, sizing, db, m, T1, P1, s)
        return (res["surge"] if kind == "surge" else (res["stonewall"] or not res["valid"]))
    # Surge: bad below the limit (lo bad, hi good). Stonewall: lo good, hi bad.
    good_end, bad_end = (hi, lo) if kind == "surge" else (lo, hi)
    if not bad(bad_end):
        return bad_end
    for _ in range(30):
        mid = 0.5 * (good_end + bad_end)
        if bad(mid):
            bad_end = mid
        else:
            good_end = mid
        if abs(good_end - bad_end) < 1e-4 * m_d:
            break
    return good_end


def operating_point(gas, sizing, project, case) -> dict:
    """Locate a case on the map: required speed (variable speed) or achieved
    discharge pressure (fixed speed), efficiency and surge margin."""
    db = project.design_basis
    T1, P1, P2 = c_to_k(case.suction_temperature_c), bar_to_pa(case.suction_pressure_bara), bar_to_pa(case.discharge_pressure_bara)
    m = mass_flow(gas, case)
    fixed = db.driver_type == "fixed_speed_motor_gearbox"
    notes = []
    if fixed:
        s, notes_it = 1.0, "Fixed-speed driver: 100 % speed"
    else:
        f = lambda sp: (stack(gas, sizing, db, m, T1, P1, sp).get("P2", 0.0) - P2)
        try:
            s, conv = brentq(f, 0.4, 1.3, xtol=1e-4, full_output=True)
            notes_it = f"Speed found by root search between 40 % and 130 % ({conv.iterations} iterations, to 0.0001)"
        except ValueError:
            s = float("nan")
            notes.append("Required discharge pressure not reachable between 40 % and 130 % speed")
    if not math.isfinite(s):
        return {"case": case.name, "feasible": False, "notes": notes}
    res = stack(gas, sizing, db, m, T1, P1, s)
    m_surge = _limit_flow(gas, sizing, db, T1, P1, s, sizing["mass_flow_kg_s"], "surge")
    margin = (m - m_surge) / m
    in_range = db.min_operating_speed_pct / 100 - 1e-6 <= s <= db.max_continuous_speed_pct / 100 + 1e-6
    if not in_range:
        notes.append(f"Required speed {s * 100:.1f} % outside the operating range "
                     f"{db.min_operating_speed_pct:.0f}-{db.max_continuous_speed_pct:.0f} %")
    if res.get("surge"):
        notes.append("Operating point is inside the surge region")
    if fixed and res.get("P2", 0) > P2:
        notes.append("Fixed speed: excess discharge pressure must be throttled or recycled")
    out = {"case": case.name, "feasible": res["valid"] and not res["surge"] and in_range,
            "speed_frac": s, "speed_rpm": s * sizing["speed_rpm"], "eta_p": res.get("eta"),
            "discharge_bara": res.get("P2", 0) / 1e5, "discharge_c": k_to_c(res["T2"]) if res.get("valid") else None,
            "power_kw": res.get("power_kw"), "q_am3_h": m / gas.density(T1, P1) * 3600, "mass_flow_kg_s": m,
            "head_kj_kg": res.get("head", 0) / 1e3, "surge_margin": margin, "notes": notes}
    if res.get("valid"):
        _op_steps(sizing, project.cases.index(case) if case in project.cases else 0, out, res, m, m_surge, P2, notes_it)
    return out


def _op_steps(sizing, row, o, res, m, m_surge, P2, how):
    rec = sizing.get("_op_rec") or record("aero.performance", "Operating points")
    sizing["_op_rec"] = rec
    rec.steps = [x for x in rec.steps if x["row"] != row]
    rec.sym(**_SYM)
    s, dh = o["speed_frac"], res["head"] / res["eta"]
    rec.step("Operating speed", "s = 1" if how.startswith("Fixed") else r"P_d(s) = P_{d,req}", {"P_{d,req}": (P2, "Pa")}, s * 100, "%", "s", row, note=how, ui="Speed %")
    rec.step("Operating speed in rpm", r"N = s\,N_d", {"s": s, "N_d": (sizing["speed_rpm"], "rpm")}, o["speed_rpm"], "rpm", "N", row, ui="rpm")
    rec.step("Polytropic efficiency", r"\eta_p = \frac{\sum H_{st}}{\sum H_{st}/\eta_i}", {"H_p": (res["head"], "J/kg"), r"\Delta h": (dh, "J/kg")}, o["eta_p"], "", r"\eta_p", row,
             note="Heads and enthalpy rises summed over all stages", ui="ηp")
    rec.step("Discharge pressure", r"P_d = \text{stage stacking at } (\dot m,\ s)", {r"\dot m": (m, "kg/s"), "s": s}, o["discharge_bara"], "bara", "P_d", row,
             note="Gas marched through every stage and cooler", ui="Pd bara")
    rec.step("Discharge temperature", r"T_d = \text{stage stacking at } (\dot m,\ s)", {r"\dot m": (m, "kg/s"), "s": s}, o["discharge_c"], "°C", "T_d", row, ui="Td °C")
    rec.step("Gas power", r"P = \dot m \sum H_{st}/\eta_i", {r"\dot m": (m, "kg/s"), r"\Delta h": (dh, "J/kg")}, o["power_kw"], "kW", "P", row,
             note="Gas power, without mechanical losses", ui="Power kW")
    rec.step("Surge margin", r"SM = \frac{\dot m - \dot m_s}{\dot m}", {r"\dot m": (m, "kg/s"), r"\dot m_s": (m_surge, "kg/s")},
             o["surge_margin"] * 100, "%", "SM", row, ui="Surge margin %")
