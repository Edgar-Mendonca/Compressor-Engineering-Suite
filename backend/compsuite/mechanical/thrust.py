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


def _steps(rec, rows, impellers, stages, d, m_dot, total, th, fa, T, d_cpl, ctype, load, rating, rating_n, v_c, n_mcs) -> None:
    rec.sym(**{r"\Delta p": ("Stage pressure rise", "Pa"), "P_{in}": ("Stage inlet pressure", "Pa"), "P_{out}": ("Stage outlet pressure", "Pa"),
               "D_1": ("Impeller eye diameter", "m"), "D_s": ("Eye seal diameter", "m"), "d": ("Shaft diameter at the impellers", "m"),
               r"\dot m": ("Mass flow", "kg/s"), "c_1": ("Inlet meridional velocity", "m/s"), "F_i": ("Impeller thrust", "N"),
               "F_g": ("Gross impeller thrust", "N"), "F_{bp}": ("Balance piston force", "N"), "F_r": ("Residual thrust", "N"),
               "F_{sw}": ("Thrust swing allowance", "N"), r"\mu": ("Coupling tooth friction coefficient", "-"), "T": ("Casing torque", "N·m"),
               "D_p": ("Gear coupling pitch diameter", "m"), "d_c": ("Coupling hub diameter", "m"), "F_a": ("Coupling friction thrust", "N"),
               "F_L": ("Thrust bearing load", "N"), "F_R": ("Thrust bearing rating", "N"), "A_p": ("Thrust pad area", "m²"),
               "D_c": ("Thrust collar diameter", "m"), "N": ("Maximum continuous speed", "rpm"), "v_c": ("Collar peripheral speed", "m/s"),
               "d_{bp}": ("Balance piston diameter", "m"), "d_s": ("Seal sleeve diameter", "m"), "F_{a,max}": ("Upper coupling friction thrust", "N"),
               "F_{R,user}": ("Rating set by the user", "N"), r"\Delta p_i": ("Pressure rise across diaphragm i", "Pa")})
    for i, (r, imp, st) in enumerate(zip(rows, impellers, stages)):
        dp = r["dp_bar"] * 1e5
        rec.step("Stage pressure rise", r"\Delta p = P_{out} - P_{in}", {"P_{out}": (st["P_out_bara"] * 1e5, "Pa"), "P_{in}": (st["P_in_bara"] * 1e5, "Pa")},
                 r["dp_bar"], "bar", r"\Delta p", row=i, ui="Δp bar")
        rec.step("Eye seal diameter", r"D_s = 1.02\,D_1", {"D_1": (imp["D1_eye_mm"] / 1e3, "m")}, r["eye_seal_mm"], "mm", "D_s", row=i, ui="Eye seal mm")
        rec.step("Impeller thrust", r"F_i = \Delta p\,\frac{\pi}{4}\,(D_s^2 - d^2) + \dot m\,c_1",
                 {r"\Delta p": (dp, "Pa"), "D_s": (r["eye_seal_mm"] / 1e3, "m"), "d": (d, "m"), r"\dot m": (m_dot, "kg/s"),
                  "c_1": (imp.get("inlet_cm_m_s", 0.0), "m/s")}, r["thrust_kn"], "kN", "F_i", row=i, ui="Thrust kN")
    rec.step("Gross impeller thrust", r"F_g = \sum F_i", {}, total / 1e3, "kN", "F_g",
             note=f"Simple sum of the impeller table; the rotor layout uses {th['gross_impeller_n'] / 1e3:.1f} kN from the impeller design", ui="Gross impeller thrust (simple / model)")
    rec.step("Balance piston force", r"F_{bp} = \Delta p\,\frac{\pi}{4}\,(d_{bp}^2 - d_s^2)", {}, th["balance_piston_n"] / 1e3, "kN", "F_{bp}",
             note="From the rotor layout (discharge minus suction pressure on the piston annulus)", ui="Balance piston")
    rec.step("Residual thrust", r"F_r = F_g - F_{bp},\quad F_{sw} = 0.3\,|F_g|",
             {"F_g": (th["gross_impeller_n"], "N"), "F_{bp}": (th["balance_piston_n"], "N")}, th["residual_n"] / 1e3, "kN", "F_r",
             note=f"Design swing {th['design_swing_n'] / 1e3:.1f} kN", ui="Residual / design swing")
    if ctype == "gear":
        rec.step("Coupling friction thrust", r"F_a = \mu\,\frac{2\,T}{D_p},\quad D_p = 1.6\,d_c,\quad \mu = 0.15 \ldots 0.30",
                 {"T": (T, "N·m"), "d_c": (d_cpl, "m")}, fa[1] / 1e3, "kN", "F_a", note=f"Range {fa[0] / 1e3:.1f} to {fa[1] / 1e3:.1f} kN; upper value used", ui="Coupling friction")
    else:
        rec.step("Coupling friction thrust", "F_a = 0", {}, 0.0, "kN", "F_a", note="Disc and diaphragm couplings pass almost no thrust", ui="Coupling friction")
    rec.step("Thrust bearing load", r"F_L = |F_r| + F_{sw} + F_{a,max}",
             {"F_r": (th["residual_n"], "N"), "F_{sw}": (th["design_swing_n"], "N"), "F_a": (fa[1], "N")}, load / 1e3, "kN", "F_L", ui="Bearing load / rating")
    if rating_n:
        rec.step("Thrust bearing rating", "F_R = F_{R,user}", {}, rating / 1e3, "kN", "F_R", note="Set by the user")
    else:
        rec.step("Thrust bearing rating", r"F_R = A_p \cdot 4.8\ \mathrm{MPa}", {"A_p": (th["pad_area_m2"], "m²")}, rating / 1e3, "kN", "F_R",
                 note="Pad area sized for the design load at half the rating")
    rec.step("Thrust bearing load ratio", "F_L / F_R", {"F_L": (load, "N"), "F_R": (rating, "N")}, load / rating, "", "", ui="Thrust bearing load / rating")
    rec.step("Collar peripheral speed", r"v_c = \frac{\pi\,D_c\,N}{60}", {"D_c": (th["collar_diameter_m"], "m"), "N": (n_mcs, "rpm")}, v_c, "m/s", "v_c",
             ui=["Collar speed", "Thrust collar peripheral speed"])
    k = max(range(len(rows)), key=lambda j: rows[j]["diaphragm_dp_bar"])
    rec.step("Largest diaphragm pressure difference", r"\max_i \Delta p_i", {}, rows[k]["diaphragm_dp_bar"], "bar", r"\Delta p", note=f"Stage {k + 1}", ui="Max diaphragm Δp")


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
    _steps(rec, rows, impellers, stages, d, m_dot, total, th, fa, T, d_cpl, coupling_type, load, rating, rating_n, collar_speed, speeds["mcs_rpm"])
    for c in checks:
        if c["status"] == "fail":
            rec.warn(f"{c['check']}: {c['value']:.2f} ({c['criterion']})")
    return {"impellers": rows, "gross_simple_kn": total / 1e3, "gross_model_kn": th["gross_impeller_n"] / 1e3,
            "balance_piston_kn": th["balance_piston_n"] / 1e3, "residual_kn": residual / 1e3, "swing_kn": th["design_swing_n"] / 1e3,
            "coupling_type": coupling_type, "coupling_friction_kn": [fa[0] / 1e3, fa[1] / 1e3], "bearing_load_kn": load / 1e3,
            "bearing_rating_kn": rating / 1e3, "load_ratio": load / rating, "collar_speed_m_s": collar_speed,
            "max_diaphragm_dp_bar": max(r["diaphragm_dp_bar"] for r in rows), "checks": checks, "trace": rec}
