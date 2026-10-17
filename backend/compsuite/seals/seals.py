"""Seal calculations.

* Labyrinth leakage: Martin (1908) formula with Hodkinson (1939)
  carry-over factor and an orifice discharge coefficient; last-tooth
  choking check.
* Aerodynamic cross-coupling per stage: modified Wachel formula as used for
  API 617 Level I screening, q = Bc * T / (Dc * Hc) * (rho_d / rho_s), with
  T the stage torque (equivalent to Bc*C*P/(Dc*Hc*N) in API units).
* Dry gas seals: leakage scaled from a vendor reference point
  (leakage ~ p^1.5 is typical of spiral-groove seals; replace with vendor
  curves), and seal-gas conditioning checks: superheat margin above the
  hydrocarbon/water dew point and Joule-Thomson cooling across the seal
  faces (isenthalpic expansion on the real-gas model).
"""

from __future__ import annotations

import math

from compsuite.core.trace import record
from compsuite.core.units import R


def hodkinson_carry_over(n_teeth: int, clearance: float, pitch: float) -> float:
    ratio = (n_teeth - 1) / n_teeth * (clearance / pitch) / ((clearance / pitch) + 0.02)
    return 1.0 / math.sqrt(1.0 - ratio)


def labyrinth_clearance(diameter: float) -> float:
    """Typical radial clearance: (0.0025 x D + 0.1 mm) / 2 (diametral rule of thumb halved)."""
    return (0.0025 * diameter + 1e-4) / 2


def labyrinth_leakage(p_up: float, p_down: float, T_up: float, mw: float, Z: float, diameter: float, clearance: float,
                      n_teeth: int, pitch: float, cd: float = 0.71) -> dict:
    area = math.pi * diameter * clearance
    rs = R / (mw / 1000.0)
    pr = p_down / p_up
    martin = math.sqrt((1 - pr**2) / (n_teeth - math.log(pr)))
    gamma = hodkinson_carry_over(n_teeth, clearance, pitch)
    m_dot = cd * gamma * area * p_up / math.sqrt(Z * rs * T_up) * martin
    # Choking check at the last tooth (Egli): critical ratio from the isentropic limit (k ~ 1.3).
    choked = pr < 0.55 and n_teeth <= 4
    return {"mass_flow_kg_s": m_dot, "area_m2": area, "carry_over": gamma, "martin_factor": martin, "last_tooth_choked": choked}


def wachel_cross_coupling(power_w: float, omega: float, dc: float, hc: float, rho_d: float, rho_s: float,
                          bc: float = 3.0) -> float:
    torque = power_w / omega
    return bc * torque / (dc * hc) * (rho_d / rho_s)


def dgs_leakage(p_seal: float, ref_leak_nm3_h: float, ref_p: float, speed_ratio: float = 1.0) -> float:
    return ref_leak_nm3_h * (p_seal / ref_p) ** 1.5 * speed_ratio**0.3


def seal_gas_conditioning(gas, p_supply: float, T_supply: float, p_vent: float, margin_c: float, n: int = 8) -> dict:
    """Dew point and Joule-Thomson checks for primary seal gas along the
    isenthalpic expansion path from supply to vent pressure.

    Above the cricondenbar no dew point exists at supply pressure, so the
    limiting value is the highest dew temperature found between vent and
    supply pressure (API 692 practice: keep margin to the phase envelope
    along the whole expansion path).
    """
    import numpy as np
    h = gas.h(T_supply, p_supply)
    path = []
    T_guess = T_supply
    for P in np.geomspace(p_supply, max(p_vent, 1.05e5), n):
        T = gas.T_from_hP(h, P, T_guess)
        T_guess = T
        try:
            dews = gas.dew_points(P)
        except Exception:  # noqa: BLE001 - phase solver may fail near critical; report as unknown
            dews = []
        dew = max(dews) if dews else None
        path.append({"P_bara": P / 1e5, "T_c": T - 273.15, "dew_c": dew - 273.15 if dew else None,
                     "margin_c": (T - dew) if dew else None})
    wdp = gas.water_dew_point(p_supply) if hasattr(gas, "water_dew_point") else None
    margins = [pt["margin_c"] for pt in path if pt["margin_c"] is not None]
    hc_dew = max((pt["dew_c"] for pt in path if pt["dew_c"] is not None), default=None)
    out = {"supply_pressure_bara": p_supply / 1e5, "supply_temperature_c": T_supply - 273.15,
           "temperature_after_expansion_c": path[-1]["T_c"], "hydrocarbon_dew_point_c": hc_dew,
           "water_dew_point_c": wdp - 273.15 if wdp else None, "expansion_path": path}
    limiting = max([d for d in (hc_dew, out["water_dew_point_c"]) if d is not None], default=None)
    min_path_margin = min(margins) if margins else None
    if out["water_dew_point_c"] is not None:
        wm = out["supply_temperature_c"] - out["water_dew_point_c"]
        min_path_margin = wm if min_path_margin is None else min(min_path_margin, wm)
    out["required_supply_temperature_c"] = (limiting + margin_c) if limiting is not None else None
    out["superheat_margin_c"] = min_path_margin
    out["heater_required"] = bool(min_path_margin is not None and min_path_margin < margin_c)
    out["condensation_risk_after_expansion"] = bool(min_path_margin is not None and min_path_margin < 0)
    return out


def seal_analysis(gas, sizing: dict, impellers: list[dict], project, rotor_geom: dict) -> dict:
    sd = project.seals
    rec = record("seals", "Martin/Hodkinson labyrinth leakage, modified Wachel cross-coupling, DGS conditioning",
                 [sd, sizing["stages"]],
                 assumptions=["Labyrinth discharge coefficient 0.71", "Balance piston upstream = discharge, downstream = suction",
                              "Wachel Bc = 3 (API 617 Level I)", "DGS leakage scaled ~ p^1.5 from the vendor reference point",
                              "Seal gas taken from compressor discharge and filtered",
                              "Superheat margin evaluated along the isenthalpic expansion path to vent pressure"],
                 references=["Martin (1908); Hodkinson (1939); Egli (1935)", "API 617 8th ed. 2.6.5 Level I (modified Wachel)",
                             "API 692 (dry gas seal systems)", "API 614 Ch. 4 (seal gas modules)"])
    stages = sizing["stages"]
    omega = sizing["speed_rpm"] * math.pi / 30
    m = sizing["mass_flow_kg_s"]
    mw = gas.mw()
    T1 = stages[0]["T_in_c"] + 273.15
    P1 = stages[0]["P_in_bara"] * 1e5
    P_d = stages[-1]["P_out_bara"] * 1e5
    T_d = stages[-1]["T_out_c"] + 273.15

    # Eye seals and interstage seals per impeller.
    lab = []
    total_recirc = 0.0
    for st, imp in zip(stages, impellers):
        d_eye = imp["D1_eye_mm"] / 1e3 * 1.05
        c = (sd.labyrinth_clearance_mm / 1e3) if sd.labyrinth_clearance_mm else labyrinth_clearance(d_eye)
        p_up = st["P_in_bara"] * 1e5 + 0.6 * (st["P_out_bara"] - st["P_in_bara"]) * 1e5
        eye = labyrinth_leakage(p_up, st["P_in_bara"] * 1e5, st["T_out_c"] + 273.15, mw,
                                gas.z(st["T_out_c"] + 273.15, p_up), d_eye, c, sd.labyrinth_teeth, sd.labyrinth_pitch_mm / 1e3)
        d_shaft = imp["hub_mm"] / 1e3
        c_s = (sd.labyrinth_clearance_mm / 1e3) if sd.labyrinth_clearance_mm else labyrinth_clearance(d_shaft)
        inter = labyrinth_leakage(st["P_out_bara"] * 1e5, st["P_in_bara"] * 1e5, st["T_out_c"] + 273.15, mw,
                                  gas.z(st["T_out_c"] + 273.15, st["P_out_bara"] * 1e5), d_shaft, c_s,
                                  sd.labyrinth_teeth, sd.labyrinth_pitch_mm / 1e3)
        q = wachel_cross_coupling(st["power_kw"] * 1e3, omega, imp["D2_mm"] / 1e3, imp["b2_mm"] / 1e3,
                                  st["rho_out"], st["rho_in"])
        total_recirc += eye["mass_flow_kg_s"]
        lab.append({"stage": st["index"] + 1, "eye_diameter_mm": d_eye * 1e3, "eye_clearance_mm": c * 1e3,
                    "eye_leakage_kg_s": eye["mass_flow_kg_s"], "eye_leakage_pct": 100 * eye["mass_flow_kg_s"] / m,
                    "interstage_diameter_mm": d_shaft * 1e3, "interstage_leakage_kg_s": inter["mass_flow_kg_s"],
                    "wachel_q_n_m": q})

    # Balance piston.
    d_bp = rotor_geom["balance_piston_diameter_m"]
    c_bp = (sd.labyrinth_clearance_mm / 1e3) if sd.labyrinth_clearance_mm else labyrinth_clearance(d_bp)
    bp = labyrinth_leakage(P_d, P1, T_d, mw, gas.z(T_d, P_d), d_bp, c_bp, sd.balance_piston_teeth, sd.labyrinth_pitch_mm / 1e3)
    bp_pct = 100 * bp["mass_flow_kg_s"] / m
    if bp_pct > 3.0:
        rec.warn(f"Balance piston leakage {bp_pct:.1f} % of flow: consider damper/hole-pattern seal or more teeth")

    # Shaft-end seals.
    end = {"type": sd.shaft_end_seal}
    seal_p = P1 * 1.0  # end seals see balance-line (suction) pressure
    if sd.shaft_end_seal.startswith("dry_gas"):
        leak = dgs_leakage(seal_p, sd.dgs_reference_leakage_nm3_h, sd.dgs_reference_pressure_bara * 1e5)
        rho_n = gas.density(273.15, 101325.0)
        # Process-side labyrinth: seal gas must flow inward at >= 5 m/s (common API 692 practice).
        d_ps = rotor_geom["seal_diameter_m"]
        c_ps = labyrinth_clearance(d_ps)
        area = math.pi * d_ps * c_ps
        rho_seal = gas.density(T_d, seal_p)
        lab_flow = 5.0 * area * rho_seal
        supply = 2 * (leak * rho_n / 3600 + lab_flow)
        cond = seal_gas_conditioning(gas, P_d, T_d, sd.seal_vent_pressure_bara * 1e5, sd.seal_gas_superheat_margin_c)
        if cond["heater_required"]:
            rec.warn("Seal gas superheat margin along the expansion path below requirement: heater / conditioning required")
        if cond["condensation_risk_after_expansion"]:
            rec.warn("Seal gas crosses the dew curve during expansion across the seal faces (JT cooling)")
        end.update({"seal_pressure_bara": seal_p / 1e5, "primary_leakage_nm3_h_per_seal": leak,
                    "primary_vent_total_nm3_h": 2 * leak, "process_labyrinth_flow_kg_s_per_seal": lab_flow,
                    "seal_gas_supply_kg_s_total": supply, "seal_gas_supply_nm3_h_total": supply / rho_n * 3600,
                    "conditioning": cond})
    total_q = sum(x["wachel_q_n_m"] for x in lab) + sd.seal_cross_coupling_n_m
    return {"labyrinths": lab, "balance_piston": {**bp, "diameter_mm": d_bp * 1e3, "clearance_mm": c_bp * 1e3,
                                                  "leakage_pct": bp_pct},
            "end_seals": end, "total_wachel_q_n_m": total_q, "internal_recirculation_kg_s": total_recirc + bp["mass_flow_kg_s"],
            "trace": rec}
