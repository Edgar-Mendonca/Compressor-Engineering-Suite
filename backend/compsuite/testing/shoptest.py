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
            "trial_ok": allowable_g_mm <= trial_g_mm <= 2.5 * allowable_g_mm}


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
