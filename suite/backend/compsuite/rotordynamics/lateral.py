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


def lateral_analysis(model: fe.RotorModel, rotor: dict, sizing: dict, project, wachel_q: float) -> dict:
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

    all_pass = all(p["pass"] for c in cases for p in c["peaks"]) and all(a["pass"] for c in cases for a in c["amplitude_checks"]) \
        and all(a["pass"] for c in cases for a in c["clearance_checks"])
    return {"mass_properties": mp, "bearing_static_loads_n": loads, "campbell": camp, "undamped_critical_map": ucs,
            "modes_at_mcs": modes, "z_m": z.tolist(), "unbalance_cases": cases, "stability": stability,
            "speeds": {"min_rpm": n_min, "rated_rpm": N, "mcs_rpm": n_mcs, "trip_rpm": n_trip},
            "amplitude_limit_um": amplitude_limit_um(n_mcs, cr.amplitude_limit_um_cap),
            "separation_and_amplitude_pass": all_pass, "trace": rec}


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
