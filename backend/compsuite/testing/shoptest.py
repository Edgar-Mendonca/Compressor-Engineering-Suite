"""API 617 shop-test simulator: balancing, residual unbalance check, high-speed (influence
coefficient) balancing, mechanical running test and the impeller overspeed test record.

Allowable residual unbalance: API 617 U = 6350 W / N  (g.mm, W kg per plane, N max continuous rpm);
handbook rule 4 W / N (oz.in, W lb). Residual unbalance check: trial weight at 6+ angles,
|V|^2 = a + 2 b cos t + 2 c sin t fitted by least squares gives the residual unbalance.
Running test vibration limit: A = 25.4 sqrt(12000 / N) um pk-pk, not above 25.4 um.
"""

from __future__ import annotations

import math

import numpy as np

from compsuite.core.trace import record

OZIN_TO_GMM = 28.3495 * 25.4


def allowable_unbalance(w_kg: float, n_rpm: float) -> dict:
    api = 6350 * w_kg / n_rpm
    hb = 4 * (w_kg / 0.45359237) / n_rpm * OZIN_TO_GMM
    return {"api617_g_mm": api, "handbook_g_mm": hb, "governing_g_mm": min(api, hb), "eccentricity_um": api / w_kg / 1e3 * 1e3}


def residual_unbalance_check(angles_deg: list[float], amplitudes: list[float], trial_g_mm: float, allowable_g_mm: float) -> dict:
    t = np.radians(angles_deg)
    A = np.column_stack([np.ones_like(t), 2 * np.cos(t), 2 * np.sin(t)])
    (a, b, c), *_ = np.linalg.lstsq(A, np.asarray(amplitudes) ** 2, rcond=None)
    q = math.hypot(b, c)
    disc = max(a * a - 4 * q * q, 0.0)
    x = (a + math.sqrt(disc)) / (2 * trial_g_mm**2)            # h^2 (sensitivity^2), root with |U0| < trial
    u0 = q / (x * trial_g_mm) if x > 0 else float("nan")
    ang = math.degrees(math.atan2(c, b)) % 360
    tt = np.linspace(0, 2 * math.pi, 73)
    fit = np.sqrt(np.maximum(a + 2 * b * np.cos(tt) + 2 * c * np.sin(tt), 0))
    return {"residual_g_mm": u0, "residual_angle_deg": ang, "sensitivity_per_g_mm": math.sqrt(x), "allowable_g_mm": allowable_g_mm,
            "ratio": u0 / allowable_g_mm, "status": "pass" if u0 <= allowable_g_mm else "fail",
            "fit": {"angle_deg": np.degrees(tt).round(1).tolist(), "amplitude": fit.round(4).tolist()},
            "trial_ok": allowable_g_mm <= trial_g_mm <= 2.5 * allowable_g_mm, "trial_g_mm": trial_g_mm}


def _c(amp, ph):
    return amp * np.exp(1j * np.radians(ph))


def influence_balance(initial: list[dict], trials: list[dict]) -> dict:
    """initial: [{probe, amp, phase}] ; trials: [{plane, weight_g_mm, angle_deg, readings: [{probe, amp, phase}]}].
    Least-squares correction weights W = -pinv(A) V0 with influence coefficients a = (V_t - V0) / W_t."""
    V0 = np.array([_c(r["amp"], r["phase"]) for r in initial])
    cols = []
    for tr in trials:
        Wt = _c(tr["weight_g_mm"], tr["angle_deg"])
        Vt = np.array([_c(r["amp"], r["phase"]) for r in tr["readings"]])
        cols.append((Vt - V0) / Wt)
    A = np.column_stack(cols)
    W = -np.linalg.pinv(A) @ V0
    Vr = V0 + A @ W
    return {"corrections": [{"plane": tr["plane"], "weight_g_mm": float(abs(w)), "angle_deg": float(np.degrees(np.angle(w)) % 360)}
                            for tr, w in zip(trials, W)],
            "influence": [[{"amp": float(abs(a)), "phase": float(np.degrees(np.angle(a)) % 360)} for a in row] for row in A],
            "initial": [{"probe": r["probe"], "amp": float(abs(v))} for r, v in zip(initial, V0)],
            "predicted": [{"probe": r["probe"], "amp": float(abs(v)), "phase": float(np.degrees(np.angle(v)) % 360)} for r, v in zip(initial, Vr)]}


def vibration_limit_um(n_mcs: float) -> float:
    return min(25.4 * math.sqrt(12000 / n_mcs), 25.4)


def running_test(speeds: dict, lateral: dict, readings: list[dict] | None = None) -> dict:
    n = speeds["mcs_rpm"]
    lim = vibration_limit_um(n)
    plan = [{"step": 1, "activity": "Run up, record Bode / polar through the critical speeds", "speed_rpm": n, "duration": "run-up"},
            {"step": 2, "activity": "Trip speed run", "speed_rpm": speeds.get("trip_rpm", 1.05 * n), "duration": "15 min"},
            {"step": 3, "activity": "Mechanical run at maximum continuous speed", "speed_rpm": n, "duration": "4 h"},
            {"step": 4, "activity": "Coast down, record Bode / polar", "speed_rpm": 0, "duration": "coast-down"}]
    pred = []
    for uc in lateral.get("unbalance_cases", []):
        resp = uc["response"]
        for z, d in resp["probes"].items():
            pred.append({"case": f"Mode {uc.get('mode', '')} unbalance", "probe": z, "speeds_rpm": resp["speeds_rpm"],
                         "amplitude_um": [2 * a for a in d["major_um"]], "phase_deg": d.get("x_phase_deg")})
    evals = []
    for r in readings or []:
        evals.append({**r, "limit_um": lim, "status": "pass" if r["amplitude_um"] <= lim else "fail"})
    return {"limit_um": lim, "plan": plan, "predicted": pred, "evaluation": evals,
            "status": "pass" if evals and all(e["status"] == "pass" for e in evals) else ("fail" if evals else "review")}


def rotor_class(n_mcs: float, first_critical_rpm: float) -> dict:
    ratio = n_mcs / first_critical_rpm
    flexible = ratio > 0.7
    return {"ratio_mcs_to_first_critical": ratio, "class": "flexible" if flexible else "rigid",
            "recommendation": "Low-speed component + assembly balance; high-speed (at-speed) balance recommended" if flexible
            else "Low-speed two-plane balance is sufficient"}


def overspeed_record(predicted_um: dict, measured: list[dict] | None, allowable: dict | None = None) -> dict:
    """measured: [{location, before_mm, after_mm}] ; allowable um per location (default bore 0.05 % D? given in um)."""
    allow = {"Bore": 25.0, "Eye": 50.0, "Tip": 50.0, "Shroud OD": 50.0, **(allowable or {})}
    rows = []
    for m in measured or []:
        d_um = (m["after_mm"] - m["before_mm"]) * 1e3 / 2 if m.get("diameter", True) else (m["after_mm"] - m["before_mm"]) * 1e3
        lim = allow.get(m["location"], 50.0)
        rows.append({**m, "radial_change_um": d_um, "predicted_um": predicted_um.get(m["location"]), "allowable_um": lim,
                     "status": "pass" if abs(d_um) <= lim else "fail"})
    return {"predicted_um": predicted_um, "allowable_um": allow, "rows": rows,
            "status": "pass" if rows and all(r["status"] == "pass" for r in rows) else ("fail" if rows else "review")}


def shop_trace(out: dict):
    """Calculation steps of the /api/shoptest result (balancing limits, rotor class, residual check, influence balance, overspeed)."""
    rec = record("testing.shoptest", "Shop balancing limits, residual unbalance check, influence-coefficient balancing, overspeed record",
                 assumptions=["Allowable unbalance per plane from the static journal load; per impeller from its mass",
                              "Residual check: trial weight at six or more angles, least-squares fit of amplitude squared"])
    n = out["speeds"]["mcs_rpm"]
    rec.sym(**{"U": ("Allowable residual unbalance", "g·mm"), "W": ("Mass (impeller) or journal static load", "kg"), "N_{mc}": ("Maximum continuous speed", "rpm"),
               "U_h": ("Handbook allowable unbalance (4 W/N in oz·in)", "g·mm"), "W_{lb}": ("Mass in pounds", "lb"), "e": ("Allowable mass eccentricity", "µm"),
               "N_{c1}": ("First critical speed on rigid supports", "rpm"), "r_N": ("Speed ratio MCS / first critical", "-"), "F": ("Static journal load", "N"),
               "g": ("Gravity", "m/s²"), r"\theta": ("Trial weight angle", "°"), "V": ("Vibration reading", "µm or mm/s"), "a": ("Fitted mean of V²", "-"),
               "b": ("Fitted cosine term", "-"), "c": ("Fitted sine term", "-"), "U_0": ("Residual unbalance", "g·mm"), "U_t": ("Trial weight", "g·mm"),
               "h": ("Sensitivity (reading per g·mm)", "-"), r"\mathbf{A}": ("Influence coefficients (reading change per trial weight)", "-"),
               r"\mathbf{V}_0": ("Initial readings (amplitude and phase)", "-"), r"\mathbf{V}_t": ("Readings with a trial weight", "-"),
               r"\mathbf{W}": ("Correction weights", "g·mm"), r"\mathbf{W}_t": ("Trial weights", "g·mm"), r"\mathbf{V}_r": ("Predicted readings after correction", "-"),
               "D_0": ("Diameter before the overspeed run", "mm"), "D_1": ("Diameter after the overspeed run", "mm"), r"\Delta r": ("Permanent radial change", "µm"),
               "A_{vl}": ("Running-test vibration limit", "µm pk-pk")})
    st = rec.step
    for i, q in enumerate(out["component_balance"]):
        st("Component allowable unbalance", r"U = \frac{6350\,W}{N_{mc}}", {"W": (q["mass_kg"], "kg"), "N_{mc}": (n, "rpm")}, q["api617_g_mm"], "g·mm", "U",
           row=i, note=q["component"], ui="API 617 g·mm")
        st("Handbook allowable unbalance", r"U_h = \frac{4\,W_{lb}}{N_{mc}} \times 720.08", {"W_{lb}": (q["mass_kg"] / 0.45359237, "lb"), "N_{mc}": (n, "rpm")},
           q["handbook_g_mm"], "g·mm", "U_h", row=i, note="720.08 g·mm per oz·in", ui="Handbook 4W/N g·mm")
        st("Allowable eccentricity", r"e = U / W", {"U": (q["api617_g_mm"], "g·mm"), "W": (q["mass_kg"], "kg")}, q["eccentricity_um"], "µm", "e", row=i,
           ui="Eccentricity µm")
    for i, q in enumerate(out["rotor_balance"]):
        st("Journal static load as mass", r"W = F / g", {"F": (q["static_load_kg"] * 9.81, "N"), "g": (9.81, "m/s²")}, q["static_load_kg"], "kg", "W", row=i,
           ui="Static load kg")
        st("Allowable unbalance per plane", r"U = \min\!\left(\frac{6350\,W}{N_{mc}},\ U_h\right)", {"W": (q["static_load_kg"], "kg"), "N_{mc}": (n, "rpm"),
           "U_h": (q["handbook_g_mm"], "g·mm")}, q["governing_g_mm"], "g·mm", "U", row=i, note=q["plane"],
           ui=["Allowable g·mm", "Allowable unbalance / plane"] if i == 0 else "Allowable g·mm")
    rc = out["rotor_class"]
    st("Rotor class", r"r_N = N_{mc} / N_{c1}", {"N_{mc}": (n, "rpm"), "N_{c1}": (n / rc["ratio_mcs_to_first_critical"], "rpm")},
       rc["ratio_mcs_to_first_critical"], "", "r_N", note=f"Above 0.7 the rotor is treated as flexible: {rc['class']}")
    rt = out["running_test"]
    st("Running-test vibration limit", r"A_{vl} = \min\!\left(25.4\sqrt{12000/N_{mc}},\ 25.4\right)", {"N_{mc}": (n, "rpm")}, rt["limit_um"], "µm pk-pk", "A_{vl}")
    r = out.get("residual_check")
    if r:
        st("Residual unbalance", r"V^2 = a + 2b\cos\theta + 2c\sin\theta,\quad U_0 = \frac{\sqrt{b^2+c^2}}{h^2\,U_t},\quad h^2 = \frac{a + \sqrt{a^2 - 4(b^2+c^2)}}{2\,U_t^2}",
           {"U_t": (r["trial_g_mm"], "g·mm"), "h": r["sensitivity_per_g_mm"]}, r["residual_g_mm"], "g·mm", "U_0",
           note=f"Least-squares fit over the readings; heavy spot at {r['residual_angle_deg']:.0f}°")
        st("Residual to allowable ratio", "U_0 / U", {"U_0": (r["residual_g_mm"], "g·mm"), "U": (r["allowable_g_mm"], "g·mm")}, r["ratio"], "", ui="Ratio")
    f = out.get("influence")
    if f:
        st("Influence coefficients", r"\mathbf{A}_{:,j} = \frac{\mathbf{V}_t - \mathbf{V}_0}{\mathbf{W}_t}", {}, len(f["corrections"]), "planes",
           note="One trial run per plane; complex amplitudes (amplitude ∠ phase)")
        for i, q in enumerate(f["corrections"]):
            st("Correction weight", r"\mathbf{W} = -\mathbf{A}^{+}\,\mathbf{V}_0", {}, f"{q['weight_g_mm']:.0f} ∠ {q['angle_deg']:.0f}°", "g·mm", row=i,
               note=f"{q['plane']}; least squares (pseudo-inverse) when probes outnumber planes", ui="Correction")
        for i, q in enumerate(f["predicted"]):
            st("Predicted reading after correction", r"\mathbf{V}_r = \mathbf{V}_0 + \mathbf{A}\,\mathbf{W}", {}, q["amp"], "", row=i, note=q["probe"],
               ui="Predicted after")
    for i, q in enumerate(out["overspeed"]["rows"]):
        st("Permanent radial change", r"\Delta r = \frac{D_1 - D_0}{2}", {"D_0": (q["before_mm"], "mm"), "D_1": (q["after_mm"], "mm")}, q["radial_change_um"], "µm",
           r"\Delta r", row=i, note=f"{q['location']}; allowable {q['allowable_um']:g} µm", ui="Change µm (radial)")
    return rec
