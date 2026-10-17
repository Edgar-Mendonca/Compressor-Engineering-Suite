"""Rotor axial thrust: impellers, balance piston, coupling friction and thrust-bearing checks.

Impeller thrust (simple method): stage pressure rise acting on the annulus between
the eye seal and the shaft, plus the inlet momentum, F = dp * pi/4 (D_eye^2 - d^2) + m c1.
Gear-coupling friction thrust: Fa = mu * 2 T / D_pitch with mu 0.15-0.30 (locks under torque).
Thrust bearing: load <= 50 % of rating, collar peripheral speed <= 190 m/s.
Diaphragm differential pressure per stage, with the last diaphragms usually the highest.
"""

from __future__ import annotations

import math

from compsuite.core.trace import record


def impeller_thrust(dp_pa: float, d_eye_seal_m: float, d_shaft_m: float, m_dot: float = 0.0, c1: float = 0.0) -> float:
    return dp_pa * math.pi / 4 * (d_eye_seal_m**2 - d_shaft_m**2) + m_dot * c1


def coupling_friction_thrust(torque_nm: float, pitch_d_m: float, mu: tuple[float, float] = (0.15, 0.30)) -> tuple[float, float]:
    ft = 2 * torque_nm / pitch_d_m
    return mu[0] * ft, mu[1] * ft


def thrust_analysis(rotor: dict, impellers: list[dict], stages: list[dict], speeds: dict, m_dot: float,
                    coupling_type: str = "disc", rating_n: float | None = None) -> dict:
    rec = record("mechanical.thrust", "Axial thrust: impellers, balance piston, coupling friction, thrust bearing",
                 [rotor["thrust"], coupling_type],
                 assumptions=["Impeller thrust: stage pressure rise on the eye-seal annulus plus inlet momentum",
                              "Gear coupling locks under torque: friction thrust mu 0.15-0.30; disc/diaphragm couplings ~0",
                              "Thrust-bearing rating = pad area x allowable unit load"],
                 references=["Hanlon, Compressor Handbook (2001) ch. 3, thrust balance and couplings", "API 617 8th ed., thrust bearings"])
    d = rotor["shaft_diameter_impellers_m"]
    rows, total = [], 0.0
    for imp, st in zip(impellers, stages):
        dp = (st["P_out_bara"] - st["P_in_bara"]) * 1e5
        F = impeller_thrust(dp, imp["D1_eye_mm"] / 1e3 * 1.02, d, m_dot, imp.get("inlet_cm_m_s", 0.0))
        total += F
        rows.append({"impeller": imp["index"] + 1, "dp_bar": dp / 1e5, "eye_seal_mm": imp["D1_eye_mm"] * 1.02, "thrust_kn": F / 1e3,
                     "diaphragm_dp_bar": dp / 1e5})
    T = rotor["casing_torque_nm"]
    d_cpl = rotor["coupling_diameter_m"]
    fa = coupling_friction_thrust(T, 1.6 * d_cpl) if coupling_type == "gear" else (0.0, 0.0)
    th = rotor["thrust"]
    residual = th["residual_n"]
    rating = rating_n or th["pad_area_m2"] * 2.4e6 * 2  # pad area sized for the design load at 50 %
    load = abs(residual) + th["design_swing_n"] + fa[1]
    collar_speed = math.pi * th["collar_diameter_m"] * speeds["mcs_rpm"] / 60
    checks = [{"check": "Thrust bearing load / rating", "criterion": "<= 0.50", "value": load / rating, "status": "pass" if load / rating <= 0.5 else "fail"},
              {"check": "Thrust collar peripheral speed", "criterion": "<= 190 m/s", "value": collar_speed,
               "status": "pass" if collar_speed <= 190 else "fail"}]
    for c in checks:
        if c["status"] == "fail":
            rec.warn(f"{c['check']}: {c['value']:.2f} ({c['criterion']})")
    return {"impellers": rows, "gross_simple_kn": total / 1e3, "gross_model_kn": th["gross_impeller_n"] / 1e3,
            "balance_piston_kn": th["balance_piston_n"] / 1e3, "residual_kn": residual / 1e3, "swing_kn": th["design_swing_n"] / 1e3,
            "coupling_type": coupling_type, "coupling_friction_kn": [fa[0] / 1e3, fa[1] / 1e3], "bearing_load_kn": load / 1e3,
            "bearing_rating_kn": rating / 1e3, "load_ratio": load / rating, "collar_speed_m_s": collar_speed,
            "max_diaphragm_dp_bar": max(r["diaphragm_dp_bar"] for r in rows), "checks": checks, "trace": rec}
