"""Lateral rotordynamic analysis with API 617-style evaluation.

Criteria values come from ``Criteria`` in the project model. The formulas
implemented follow the structure of API 617 8th ed. (2014) para. 2.6 /
API 684, and MUST be checked against the edition specified for the job.
This module reports results against those criteria; it does not certify
compliance.
"""

from __future__ import annotations

import math

import numpy as np

from compsuite.core.trace import record
from compsuite.core.units import G0
from compsuite.rotordynamics import fe


def required_separation(af: float, below_min: bool) -> float | None:
    """API 617 required separation margin (% of speed) for a critical with amplification factor af."""
    if math.isfinite(af) and af < 2.5:
        return None
    base = 17.0 * (1 - 1 / (af - 1.5)) if math.isfinite(af) else 17.0
    return min(16.0, base) if below_min else min(26.0, 10.0 + base)


def amplitude_limit_um(mcs_rpm: float, cap: float) -> float:
    return min(25.4 * math.sqrt(12000.0 / mcs_rpm), cap)


def _lobes(shape: np.ndarray, z: np.ndarray, z_lo: float, z_hi: float) -> list[tuple[float, float]]:
    """Locations and signs of the maxima of each lobe of a real mode shape."""
    s = np.real(shape)
    out = []
    start = 0
    for i in range(1, len(s) + 1):
        if i == len(s) or np.sign(s[i]) != np.sign(s[start]) and abs(s[i]) > 1e-6:
            seg = range(start, i)
            k = max(seg, key=lambda j: abs(s[j]))
            if abs(s[k]) > 0.2 * np.max(np.abs(s)):
                out.append((float(z[k]), float(np.sign(s[k]))))
            start = i
    return out


def lateral_analysis(model: fe.RotorModel, rotor: dict, sizing: dict, project, wachel_q: float, bearing_cases: list[dict] | None = None,
                     stages: list[dict] | None = None, impellers: list[dict] | None = None, seals: dict | None = None) -> dict:
    db, cr = project.design_basis, project.criteria
    N = sizing["speed_rpm"]
    n_min, n_mcs, n_trip = N * db.min_operating_speed_pct / 100, N * db.max_continuous_speed_pct / 100, N * db.trip_speed_pct / 100
    w_mcs = n_mcs * math.pi / 30
    rec = record("rotordynamics.lateral", "Timoshenko beam FE, complex eigenanalysis, synchronous unbalance response",
                 [rotor["sections"], rotor["masses"], n_mcs, wachel_q],
                 assumptions=[f"Criteria: {cr.edition}",
                              f"Unbalance per mode lobe = {cr.unbalance_multiplier:g} x {cr.unbalance_g_mm_factor:g} W/N g mm "
                              "(W = static load of the nearest journal)",
                              "Bearing coefficients interpolated in speed (held constant outside the tabulated 30-135 % MCS range); "
                              "seals other than user-entered values not modelled",
                              "Response peaks below 10 % of the largest response are not evaluated",
                              "Level I stability: modified Wachel cross-coupling lumped at the impeller centre of mass"],
                 references=["API 617 8th ed. (2014) 2.6", "API 684 2nd ed. (2005)", "ROSS (Petrobras) - cross-check engine"])
    structural = model.assemble_structural()
    # Ritz reduction (40 modes) for the repeated solves; checked against the
    # full model in tests (< 0.5 % on frequency, < 1 % on log dec).
    basis = model.reduction_basis(w_mcs, 40, structural)
    mp = model.mass_properties()
    bearings = [s for s in model.supports if s.kind == "bearing"]
    loads = model.static_bearing_loads()

    # Campbell diagram.
    speeds = np.linspace(0.0, 1.25 * n_trip, 27) * math.pi / 30
    camp = fe.campbell(model, speeds, n_modes=8, structural=structural, basis=basis)

    # Undamped critical speed map.
    ucs = fe.undamped_critical_speed_map(model, np.geomspace(1e7, 1e10, 31), n_modes=4)

    # Damped modes at MCS.
    md = fe.modal(model, w_mcs, n_modes=8, structural=structural)
    modes = []
    for m in md["modes"]:
        modes.append({k: m[k] for k in ("freq_hz", "freq_cpm", "logdec", "damping_ratio", "whirl")} |
                     {"shape": _signed_major(m["shape_x"], m["shape_y"]).tolist()})

    # Unbalance cases: one per forward mode below 1.25 x trip.
    z = model.nodes
    zb = [b.z for b in bearings]
    probes = sorted(set(zb + [c["z_m"] for c in rotor["close_clearance_locations"]]))
    sweep = np.linspace(0.1 * n_min, 1.25 * n_trip, 160) * math.pi / 30
    cases = []
    fwd_modes = [m for m in md["modes"] if m["whirl"] != "backward"]
    for mi, m in enumerate(fwd_modes[:3]):
        if m["freq_cpm"] > 1.4 * n_trip:
            break
        lobes = _lobes(_signed_major(m["shape_x"], m["shape_y"]), z, zb[0], zb[-1])
        ubs = []
        for zl, sign in lobes:
            nearest = min(bearings, key=lambda b: abs(b.z - zl))
            W_kg = loads[nearest.label] / G0
            ub_gmm = cr.unbalance_multiplier * cr.unbalance_g_mm_factor * W_kg / n_mcs
            ubs.append({"z": zl, "me": ub_gmm * 1e-6, "phase_deg": 0.0 if sign > 0 else 180.0, "g_mm": ub_gmm})
        resp = fe.unbalance_response(model, sweep, ubs, probes, structural=structural, basis=basis)
        # Cluster peak speeds over all probes, then refine each cluster once
        # (all probes in the same sweep) so the half-power points are resolved.
        a_max = max(max(resp["probes"][f"{p:.4f}"]["major_um"]) for p in probes)
        coarse = sorted(((pk["speed_rpm"], pk["af"], p) for p in probes
                         for pk in fe.find_peaks_af(resp["speeds_rpm"], resp["probes"][f"{p:.4f}"]["major_um"])
                         if pk["amplitude_um"] >= 0.1 * a_max), key=lambda t: t[0])
        clusters = []
        for sp, af, p in coarse:
            if not clusters or sp > clusters[-1][-1][0] * 1.03:
                clusters.append([(sp, af, p)])
            else:
                clusters[-1].append((sp, af, p))
        peaks = []
        for cl in clusters:
            # Coarse AF well below 2.5 needs no separation margin: keep the coarse value.
            if all(math.isfinite(a) and a < 1.8 for _, a, _ in cl):
                for sp, af, p in cl:
                    k = int(np.argmin(np.abs(np.asarray(resp["speeds_rpm"]) - sp)))
                    peaks.append({"speed_rpm": sp, "af": af, "amplitude_um": resp["probes"][f"{p:.4f}"]["major_um"][k],
                                  "n1_rpm": None, "n2_rpm": None, "probe_z_m": p, "af_method": "coarse sweep"})
                continue
            c0 = sum(t[0] for t in cl) / len(cl)
            found = []
            for width in (0.12, 0.35):
                fine = np.linspace(c0 * (1 - width), c0 * (1 + width), 241) * math.pi / 30
                r2 = fe.unbalance_response(model, fine, ubs, probes, structural=structural, basis=basis)
                found = []
                for p in probes:
                    for pk2 in fe.find_peaks_af(r2["speeds_rpm"], r2["probes"][f"{p:.4f}"]["major_um"]):
                        if pk2["amplitude_um"] >= 0.1 * a_max:
                            found.append({**pk2, "probe_z_m": p, "af_method": "half-power"})
                if found and all(math.isfinite(f["af"]) for f in found):
                    break
            peaks.extend(found)
        # Keep the largest peak per critical speed (within 3 %).
        peaks.sort(key=lambda d: -d["amplitude_um"])
        unique = []
        for pk in peaks:
            if all(abs(pk["speed_rpm"] - u["speed_rpm"]) > 0.03 * u["speed_rpm"] for u in unique):
                unique.append(pk)
        evaluated = []
        for pk in sorted(unique, key=lambda d: d["speed_rpm"]):
            nc, af = pk["speed_rpm"], pk["af"]
            if not math.isfinite(af):
                # Half-power points not resolvable (overlapping modes): use the
                # damped eigenvalue nearest the peak, AF = 1 / (2 zeta).
                mds = fe.modal(model, nc * math.pi / 30, 8, structural=structural, basis=basis)["modes"]
                near = min((m for m in mds if m["whirl"] != "backward"), key=lambda m: abs(m["freq_cpm"] - nc), default=None)
                if near and near["damping_ratio"] > 0:
                    af = 1 / (2 * near["damping_ratio"])
                    pk = {**pk, "af": af, "af_method": "eigenvalue 1/(2 zeta)"}
            if nc < n_min:
                actual, below = 100 * (n_min - nc) / n_min, True
            elif nc > n_mcs:
                actual, below = 100 * (nc - n_mcs) / n_mcs, False
            else:
                actual, below = 0.0, nc < N
            req = required_separation(af, below)
            ok = req is None or actual >= req
            if not ok:
                rec.warn(f"Critical speed {nc:.0f} rpm (AF {af:.1f}) separation {actual:.1f} % < required {req:.1f} %")
            evaluated.append({**pk, "separation_pct": actual, "required_separation_pct": req, "pass": ok})
        # Amplitude at MCS and clearance checks.
        k_mcs = int(np.argmin(np.abs(np.asarray(resp["speeds_rpm"]) - n_mcs)))
        limit = amplitude_limit_um(n_mcs, cr.amplitude_limit_um_cap)
        amp_checks = []
        for b in bearings:
            a_pp = 2 * resp["probes"][f"{b.z:.4f}"]["major_um"][k_mcs] / cr.unbalance_multiplier
            amp_checks.append({"location": b.label, "pk_pk_um_1x_unbalance": a_pp, "limit_um": limit, "pass": a_pp <= limit})
        clr = []
        for c in rotor["close_clearance_locations"]:
            amps = resp["probes"][f"{c['z_m']:.4f}"]["major_um"]
            k_range = [i for i, s in enumerate(resp["speeds_rpm"]) if s <= n_trip]
            a_max = 2 * max(amps[i] for i in k_range)
            radial_clr = (0.0025 * c["diameter_m"] + 1e-4) / 2 * 1e6
            dia_clr = 2 * radial_clr
            clr.append({"location": c["label"], "max_pk_pk_um": a_max, "diametral_clearance_um": dia_clr,
                        "ratio": a_max / dia_clr, "pass": a_max <= cr.clearance_ratio_limit * dia_clr})
        cases.append({"mode": mi + 1, "unbalances": ubs, "response": {"speeds_rpm": resp["speeds_rpm"], "probes": resp["probes"]},
                      "peaks": evaluated, "amplitude_checks": amp_checks, "clearance_checks": clr,
                      "deflected_shape_at_mcs_um": resp["deflected_shapes_um"][k_mcs]})

    stability = level1_stability(model, rotor, w_mcs, wachel_q, structural, cr, basis)
    if stability["logdec_with_qa"] < cr.lateral_logdec_min:
        rec.warn(f"Level I: log dec with Qa = {stability['logdec_with_qa']:.3f} < {cr.lateral_logdec_min}; Level II analysis required")
    # Rigid-support first critical for CSR.
    stiff = [fe.Support(b.label, b.z, fe.constant_support(kxx=1e12, kyy=1e12)) for b in bearings]
    rigid = fe.RotorModel(model.sections, model.masses, stiff, model.E, model.G, model.rho, model.max_element_length)
    n1_rigid = fe.modal(rigid, 0.0, 2)["modes"][0]["freq_cpm"]
    stability["critical_speed_ratio"] = n_mcs / n1_rigid
    stability["first_critical_rigid_rpm"] = n1_rigid

    # API 617-2022 evaluation per bearing case, then Level I / II stability.
    from compsuite.rotordynamics.stability import stability_analysis
    sp = {"min_rpm": n_min, "rated_rpm": N, "mcs_rpm": n_mcs, "trip_rpm": n_trip}
    v2 = []
    for bc in bearing_cases or [None]:
        mc = _case_model(model, rotor, bc)
        case = bc or {"key": "nominal", "label": "Nominal clearance / nominal oil inlet temperature",
                      "oil_inlet_c": project.bearings.oil_supply_temperature_c}
        v2.append(api617_case(mc, rotor, sp, cr, clearance_stations(mc, rotor, seals, project, bc), ucs, case, rec))
    stab2 = stability_analysis([{"key": c["key"], "label": c["label"], "model": c.pop("_model"), "structural": c.pop("_structural"),
                                 "basis": c.pop("_basis")} for c in v2], rotor, stages, impellers, seals, project, N, n_mcs, n1_rigid, wachel_q)
    for r in stab2["level2"]:
        if not r["pass_api"] or r["pass_dep"] is False:
            rec.warn(f"Level II ({r['label']}): final log dec {r['delta_f']:.3f} below the required value")
    concl = [{"item": f"{c['label']}: separation margins, amplitudes and clearances", "pass": c["pass"]} for c in v2] + \
        [{"item": f"Level I stability ({r['label']}): Q0/QA {r['q0_over_qa'] or math.inf:.2f}, deltaA {r['delta_a']:.3f}, region {r['region']}",
          "pass": not r["level2_required"]} for r in stab2["level1"]] + \
        [{"item": f"Level II stability ({r['label']}): delta_f {r['delta_f']:.3f}", "pass": r["pass_api"] and r["pass_dep"] is not False}
         for r in stab2["level2"]]
    rec.assumptions.append("API 617-2022 cases: Ua = 2 Ur (Ur = 6350 W/Nmc), coupling unbalance 2 x max(K1 W/Nmc, K2 W, K3), "
                           "Scc = min(6, Avl/Amax), clearance check at 75 % of the minimum diametral clearance")
    rec.assumptions.append("Stability: qA per impeller (Bc = 3, C = 9.55) at mid-span; Level II labyrinth coefficients by a "
                           "one-control-volume bulk-flow estimate (replace with vendor seal data)")

    all_pass = all(p["pass"] for c in cases for p in c["peaks"]) and all(a["pass"] for c in cases for a in c["amplitude_checks"]) \
        and all(a["pass"] for c in cases for a in c["clearance_checks"])
    return {"mass_properties": mp, "bearing_static_loads_n": loads, "campbell": camp, "undamped_critical_map": ucs,
            "modes_at_mcs": modes, "z_m": z.tolist(), "unbalance_cases": cases, "stability": stability,
            "speeds": {"min_rpm": n_min, "rated_rpm": N, "mcs_rpm": n_mcs, "trip_rpm": n_trip},
            "amplitude_limit_um": amplitude_limit_um(n_mcs, cr.amplitude_limit_um_cap),
            "separation_and_amplitude_pass": all_pass, "bearing_cases": v2, "unbalance_table": v2[0]["unbalance"] and
            [{k: u[k] for k in ("case", "label", "unbalances")} for u in v2[0]["unbalance"]],
            "stability_api617": stab2, "conclusion": {"items": concl, "pass": all(i["pass"] or "Level I" in i["item"] for i in concl)},
            "trace": rec}


def _signed_major(x: np.ndarray, y: np.ndarray) -> np.ndarray:
    maj = fe._major_axis(x, y)
    ref = np.real(x) if np.max(np.abs(np.real(x))) >= np.max(np.abs(np.real(y))) else np.real(y)
    sign = np.where(ref >= 0, 1.0, -1.0)
    out = maj * sign
    return out / max(np.max(np.abs(out)), 1e-30)


def level1_stability(model, rotor, w_mcs, qa, structural, cr, basis=None) -> dict:
    imp = [m for m in rotor["masses"] if m["kind"] == "impeller"]
    z_q = sum(m["z_m"] * m["mass_kg"] for m in imp) / sum(m["mass_kg"] for m in imp) if imp else \
        0.5 * sum(rotor["bearing_z_m"])

    def first_forward_logdec(q):
        ex = [fe.Support("Q", z_q, fe.constant_support(kxy=q, kyx=-q), "cross_coupling")]
        res = fe.modal(model, w_mcs, 8, ex, structural, basis)
        fw = [m for m in res["modes"] if m["whirl"] == "forward"] or res["modes"]
        return min(fw[:2], key=lambda m: m["logdec"])

    m0 = first_forward_logdec(0.0)
    ma = first_forward_logdec(qa)
    # Q0: cross-coupling giving zero log dec (bisection).
    lo, hi = 0.0, max(qa, 1e5)
    while first_forward_logdec(hi)["logdec"] > 0 and hi < 1e10:
        hi *= 2
    q0 = None
    if first_forward_logdec(hi)["logdec"] <= 0:
        for _ in range(40):
            mid = 0.5 * (lo + hi)
            if first_forward_logdec(mid)["logdec"] > 0:
                lo = mid
            else:
                hi = mid
            if hi - lo < 1e-2 * hi:
                break
        q0 = 0.5 * (lo + hi)
    sweep = [(float(q), first_forward_logdec(q)["logdec"]) for q in np.linspace(0, max(2 * qa, (q0 or qa) * 1.2), 9)]
    return {"location_z_m": z_q, "qa_n_m": qa, "logdec_no_qa": m0["logdec"], "freq_no_qa_cpm": m0["freq_cpm"],
            "logdec_with_qa": ma["logdec"], "q0_n_m": q0, "qa_over_q0": (qa / q0) if q0 else None,
            "level1_pass": ma["logdec"] >= cr.lateral_logdec_min, "logdec_vs_q": sweep}


# ---------------------------------------------------------------- API 617-2022 (9th ed.) evaluation
UR_K_LOW, UR_K_HIGH = 6350.0, 3937.0  # Ur = K W / Nmc g mm (W kg); K_HIGH for Nmc >= 25000 rpm
CPL_K1, CPL_K2, CPL_K3 = 63500.0, 12.7, 72.0


def residual_unbalance_g_mm(w_kg: float, nmc: float) -> float:
    """API 617-2022 6.8.2.7 maximum allowable residual unbalance Ur (g mm)."""
    return (UR_K_LOW if nmc < 25000 else UR_K_HIGH) * w_kg / nmc


def coupling_unbalance_g_mm(w_kg: float, nmc: float) -> float:
    """Coupling unbalance: 2 x the largest assembly check value (K1 W / Nmc, K2 W, K3)."""
    return 2 * max(CPL_K1 * w_kg / nmc, CPL_K2 * w_kg, CPL_K3)


def scale_factor_scc(avl_um: float, amax_um: float) -> float:
    """Scc = Avl / Amax or 6, whichever is less."""
    return 6.0 if amax_um <= 0 else min(6.0, avl_um / amax_um)


def bearing_cases(jb: dict, speeds_rad: np.ndarray, design) -> list[dict]:
    """Bearing tables for (a) min clearance + min oil inlet temperature and
    (b) max clearance + max oil inlet temperature. Tilting pads keep the
    machined pad clearance, so the preload follows the assembled clearance."""
    import dataclasses
    from compsuite.bearings.journal import bearing_tables
    tol = getattr(design, "clearance_tolerance_fraction", 0.11)
    dt = getattr(design, "oil_supply_tolerance_c", 5.0)
    out = []
    for key, f, sgn, label in (("min", 1 - tol, -1, "Min clearance / min oil inlet temperature"),
                               ("max", 1 + tol, 1, "Max clearance / max oil inlet temperature")):
        t_oil = design.oil_supply_temperature_c + sgn * dt
        jbc = {}
        for lb, (b, W) in jb.items():
            pre = b.preload if b.kind == "plain_cylindrical" else 1 - f * (1 - b.preload)
            jbc[lb] = (dataclasses.replace(b, clearance=b.clearance * f, preload=pre), W)
        tabs = bearing_tables(jbc, speeds_rad, design.model_copy(update={"oil_supply_temperature_c": t_oil}))
        out.append({"key": key, "label": label, "oil_inlet_c": t_oil, "tables": tabs})
    return out


def _case_model(model: fe.RotorModel, rotor: dict, bc: dict | None) -> fe.RotorModel:
    if bc is None:
        return model
    sup = []
    for (label, tab), z in zip(bc["tables"]["bearings"].items(), rotor["bearing_z_m"]):
        w = np.asarray(tab["speeds_rpm"]) * math.pi / 30
        sup.append(fe.Support(label, z, fe.tabulated_support(w, {k: np.array([r[k] for r in tab["rows"]]) for k in fe.COEF_KEYS})))
    return fe.RotorModel(model.sections, model.masses, sup, model.E, model.G, model.rho, model.max_element_length)


def clearance_stations(model, rotor: dict, seals: dict | None, project, bc: dict | None) -> list[dict]:
    """Close-clearance stations with the minimum diametral running clearance."""
    from compsuite.seals.seals import labyrinth_clearance
    sd = project.seals
    out = []
    for b in (s for s in model.supports if s.kind == "bearing"):
        geo = (bc["tables"]["bearings"][b.label]["geometry"] if bc else None) or {}
        rc = geo.get("radial_clearance_um") or (project.bearings.radial_clearance_ratio * rotor["journal_diameter_m"] / 2 * 1e6)
        out.append({"label": b.label, "z_m": b.z, "diametral_clearance_um": 2 * rc})
    eye = {f"Impeller {l['stage']}": l["eye_clearance_mm"] for l in (seals or {}).get("labyrinths", [])}
    for c in rotor["close_clearance_locations"]:
        rc_mm = eye.get(c["label"])
        if c["label"].startswith("Balance") and seals:
            rc_mm = seals["balance_piston"]["clearance_mm"]
        if rc_mm is None:
            rc_mm = sd.labyrinth_clearance_mm or labyrinth_clearance(c["diameter_m"]) * 1e3
        out.append({"label": c["label"], "z_m": c["z_m"], "diametral_clearance_um": 2 * rc_mm * 1e3})
    for s in out:
        s["node"] = model.node_at(s["z_m"]) + 1
    return out


def unbalance_distributions(model, rotor: dict, modes: list[dict], loads: dict, nmc: float, ua_over_ur: float = 2.0) -> list[dict]:
    """API 617-2022 unbalance placement: 1st mode at the mid-span maximum
    (W = total journal load), 2nd mode at the two lobe maxima 180 deg apart
    (W = nearest journal), 3rd case at the coupling (coupling unbalance)."""
    z = model.nodes
    brg = sorted((s for s in model.supports if s.kind == "bearing"), key=lambda s: s.z)
    inside = (z >= brg[0].z - 1e-9) & (z <= brg[-1].z + 1e-9)
    w_of = lambda zz: loads[min(brg, key=lambda b: abs(b.z - zz)).label] / G0
    ub = lambda zz, w, gmm, ph, src: {"z": float(zz), "node": model.node_at(zz) + 1, "W_kg": w, "g_mm": gmm,
                                     "me": gmm * 1e-6, "phase_deg": ph, "basis": src}
    out = []
    s1 = np.abs(modes[0]["shape"]) * inside
    w_tot = sum(loads.values()) / G0
    out.append({"case": 1, "label": "1st mode", "unbalances": [ub(z[int(np.argmax(s1))], w_tot, ua_over_ur * residual_unbalance_g_mm(w_tot, nmc),
                                                                0.0, "Ua = 2 Ur, W = total journal load")]})
    if len(modes) > 1:
        s2 = np.asarray(modes[1]["shape"])
        kp, kn = int(np.argmax(np.where(inside, s2, -np.inf))), int(np.argmin(np.where(inside, s2, np.inf)))
        pair = sorted((kp, kn), key=lambda k: z[k])
        out.append({"case": 2, "label": "2nd mode", "unbalances": [
            ub(z[k], w_of(z[k]), ua_over_ur * residual_unbalance_g_mm(w_of(z[k]), nmc), ph, "Ua = 2 Ur, W = nearest journal load")
            for k, ph in zip(pair, (0.0, 180.0))]})
    cpl = [m for m in rotor["masses"] if m["kind"] == "coupling"]
    if cpl:
        m = max(cpl, key=lambda m: m["mass_kg"])
        out.append({"case": 3, "label": "Coupling / overhang", "unbalances": [
            ub(m["z_m"], m["mass_kg"], coupling_unbalance_g_mm(m["mass_kg"], nmc), 0.0, "2 x max(K1 W/Nmc, K2 W, K3), W = coupling half")]})
    elif len(modes) > 2:
        s3 = np.abs(modes[2]["shape"]) * ~inside
        k = int(np.argmax(s3 if s3.max() > 0 else np.abs(modes[2]["shape"])))
        out.append({"case": 3, "label": "3rd mode (overhang)", "unbalances": [
            ub(z[k], w_of(z[k]), ua_over_ur * residual_unbalance_g_mm(w_of(z[k]), nmc), 0.0, "Ua = 2 Ur, W = nearest journal load")]})
    return out


def _ucs_intersections(ucs: dict, speeds_rpm: list, kxx: list, kyy: list, n_hi: float) -> list[dict]:
    lk = np.log(ucs["k_n_m"])
    crit = np.asarray(ucs["critical_speeds_rpm"])
    grid = np.linspace(100.0, n_hi, 600)
    out = []
    for j in range(crit.shape[1]):
        row = {"mode": j + 1}
        for name, kk in (("kxx", kxx), ("kyy", kyy)):
            g = np.interp(np.log(np.interp(grid, speeds_rpm, kk)), lk, crit[:, j]) - grid
            idx = np.where(np.sign(g[:-1]) != np.sign(g[1:]))[0]
            row[f"{name}_rpm"] = float(grid[idx[0]] - g[idx[0]] * (grid[idx[0] + 1] - grid[idx[0]]) / (g[idx[0] + 1] - g[idx[0]])) if idx.size else None
        out.append(row)
    return out


def _peak_eval(nc, af, n_min, n_mcs):
    if nc < n_min:
        actual, below = 100 * (n_min - nc) / n_min, True
    elif nc > n_mcs:
        actual, below = 100 * (nc - n_mcs) / n_mcs, False
    else:
        actual, below = 0.0, True
    req = required_separation(af, below) if af is not None else None
    return actual, req, req is None or actual >= req


def api617_case(m: fe.RotorModel, rotor: dict, sp: dict, cr, stations: list[dict], ucs: dict, case: dict, rec) -> dict:
    n_min, n_mcs, n_trip = sp["min_rpm"], sp["mcs_rpm"], sp["trip_rpm"]
    w_mcs = n_mcs * math.pi / 30
    S = m.assemble_structural()
    B = m.reduction_basis(w_mcs, 40, S)
    brg = [s for s in m.supports if s.kind == "bearing"]
    loads = m.static_bearing_loads()
    co = [b.coefficients(w_mcs) for b in brg]
    k_mcs = float(np.mean([0.5 * (c["kxx"] + c["kyy"]) for c in co]))
    modes = fe.undamped_modes(m, k_mcs, 4, S)
    upper = max(1.25 * n_trip, 1.8 * n_mcs)
    # Bearing stiffness curves for the critical speed map (mean of the bearings).
    if case.get("tables"):
        tabs = list(case["tables"]["bearings"].values())
        sp_rpm = tabs[0]["speeds_rpm"]
        kcurve = {k: np.mean([[r[k] for r in t["rows"]] for t in tabs], axis=0).tolist() for k in ("kxx", "kyy")}
        coeff_tables = {lb: {"geometry": t["geometry"], "rows": [{"speed_rpm": s, **{k: r[k] for k in fe.COEF_KEYS},
                                                                    "eccentricity": r.get("eccentricity"), "h_min_um": r.get("h_min_m", math.nan) * 1e6}
                                                                   for s, r in zip(t["speeds_rpm"], t["rows"])]}
                        for lb, t in case["tables"]["bearings"].items()}
    else:
        sp_rpm = np.linspace(0.3, 1.35, 8) * n_mcs
        cc = [[b.coefficients(s * math.pi / 30) for b in brg] for s in sp_rpm]
        kcurve = {k: [float(np.mean([c[k] for c in row])) for row in cc] for k in ("kxx", "kyy")}
        sp_rpm = sp_rpm.tolist()
        coeff_tables = {}
    dists = unbalance_distributions(m, rotor, modes, loads, n_mcs, getattr(cr, "unbalance_ua_over_ur", 2.0))
    probes = sorted({round(b.z, 6) for b in brg} | {round(s["z_m"], 6) for s in stations})
    pk = lambda z: f"{z:.4f}"
    sweep = np.linspace(0.1 * n_min, upper, 181) * math.pi / 30
    avl = amplitude_limit_um(n_mcs, cr.amplitude_limit_um_cap)
    results = []
    for d in dists:
        ubs = d["unbalances"]
        r = fe.unbalance_response(m, sweep, ubs, probes, structural=S, basis=B)
        spd = np.asarray(r["speeds_rpm"])
        pp = {p: 2 * np.asarray(r["probes"][pk(p)]["major_um"]) for p in probes}
        a_ref = max(pp[round(b.z, 6)].max() for b in brg)
        crit = []
        for b in brg:
            for c0 in fe.find_peaks_af(spd.tolist(), pp[round(b.z, 6)].tolist()):
                if c0["amplitude_um"] < 0.1 * a_ref:
                    continue
                fine = np.linspace(0.85 * c0["speed_rpm"], 1.15 * c0["speed_rpm"], 91) * math.pi / 30
                r2 = fe.unbalance_response(m, fine, ubs, [b.z], structural=S, basis=B)
                pk2 = fe.find_peaks_af(r2["speeds_rpm"], (2 * np.asarray(r2["probes"][pk(b.z)]["major_um"])).tolist())
                c1 = max(pk2, key=lambda q: q["amplitude_um"]) if pk2 else c0
                af = c1["af"] if math.isfinite(c1["af"]) else None
                method = "half-power"
                if af is None:
                    mds = fe.modal(m, c1["speed_rpm"] * math.pi / 30, 8, structural=S, basis=B)["modes"]
                    near = min((q for q in mds if q["whirl"] != "backward"), key=lambda q: abs(q["freq_cpm"] - c1["speed_rpm"]), default=None)
                    if near and near["damping_ratio"] > 0:
                        af, method = 1 / (2 * near["damping_ratio"]), "eigenvalue 1/(2 zeta)"
                actual, req, ok = _peak_eval(c1["speed_rpm"], af, n_min, n_mcs)
                crit.append({"location": b.label, "speed_rpm": c1["speed_rpm"], "af": af, "af_method": method,
                             "amplitude_pp_um": c1["amplitude_um"], "n1_rpm": c1.get("n1_rpm"), "n2_rpm": c1.get("n2_rpm"),
                             "sm_actual_pct": actual, "sm_required_pct": req, "pass": ok})
        uniq = []
        for c in sorted(crit, key=lambda c: -c["amplitude_pp_um"]):
            if all(c["location"] != u["location"] or abs(c["speed_rpm"] - u["speed_rpm"]) > 0.03 * u["speed_rpm"] for u in uniq):
                uniq.append(c)
        crit = sorted(uniq, key=lambda c: (c["location"], c["speed_rpm"]))
        for c in (c for c in crit if not c["pass"]):
            rec.warn(f"{case['label']}, {d['label']} unbalance: {c['location']} critical {c['speed_rpm']:.0f} rpm "
                     f"(AF {c['af']:.2f}) SM {c['sm_actual_pct']:.1f} % < {c['sm_required_pct']:.1f} %")
        band = (spd >= n_min) & (spd <= n_mcs)
        amax = max(float(pp[round(b.z, 6)][band].max()) for b in brg) if band.any() else a_ref
        scc = scale_factor_scc(avl, amax)
        to_trip = spd <= n_trip
        clr = []
        for s in stations:
            ap = float(pp[round(s["z_m"], 6)][to_trip].max())
            lim = cr.clearance_ratio_limit * s["diametral_clearance_um"]
            clr.append({**s, "ap_um": ap, "corrected_um": scc * ap, "limit_um": lim, "qualified": scc * ap <= lim})
            if scc * ap > lim:
                rec.warn(f"{case['label']}, {d['label']}: {s['label']} corrected amplitude {scc * ap:.1f} um > 75 % clearance {lim:.1f} um")
        shape_speeds = sorted({round(c["speed_rpm"]) for c in crit if c["speed_rpm"] <= upper}) + [n_mcs]
        rs = fe.unbalance_response(m, np.asarray(shape_speeds) * math.pi / 30, ubs, [], structural=S, basis=B)
        shapes = [{"speed_rpm": float(v), "label": "Nmc" if i == len(shape_speeds) - 1 else "critical",
                   "shape_um": rs["deflected_shapes_um"][i]} for i, v in enumerate(shape_speeds)]
        bode = {b.label: {"amp_pp_um": pp[round(b.z, 6)].tolist(), "phase_deg": r["probes"][pk(b.z)]["x_phase_deg"]} for b in brg}
        results.append({**d, "speeds_rpm": spd.tolist(), "bode": bode, "criticals": crit, "amax_um": amax, "avl_um": avl, "scc": scc,
                        "clearance": clr, "deflected_shapes": shapes,
                        "pass": all(c["pass"] for c in crit) and all(c["qualified"] for c in clr)})
    return {"key": case["key"], "label": case["label"], "oil_inlet_c": case.get("oil_inlet_c"),
            "bearing_coefficients": coeff_tables, "stiffness_curve": {"speeds_rpm": list(sp_rpm), **kcurve},
            "k_at_mcs_n_m": k_mcs, "undamped_modes": modes, "undamped_criticals": _ucs_intersections(ucs, list(sp_rpm), kcurve["kxx"], kcurve["kyy"], upper),
            "bearing_loads_n": loads, "unbalance": results, "pass": all(u["pass"] for u in results),
            "_model": m, "_structural": S, "_basis": B}
