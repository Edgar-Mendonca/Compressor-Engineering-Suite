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

import logging

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
        except Exception as exc:  # noqa: BLE001 - phase solver may fail near critical; report as unknown
            logging.getLogger(__name__).warning("fallback at seals.py:75: %s", exc)
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


def _stage_steps(rec, i, st, imp, d_eye, c, p_up, eye, inter, d_sh, q, m, omega, sd, mw, gas) -> None:
    if i == 0:
        rec.sym(**{"D_1": ("Impeller eye diameter", "m"), "D_e": ("Eye seal diameter", "m"), "D": ("Seal diameter", "m"), "c": ("Radial seal clearance", "m"),
                   "A": ("Leakage area", "m²"), "C_d": ("Discharge coefficient", "-"), r"\gamma": ("Carry-over factor", "-"),
                   "p_u": ("Upstream pressure", "Pa"), "p_d": ("Downstream pressure", "Pa"), "T_u": ("Upstream temperature", "K"),
                   "Z": ("Compressibility factor upstream", "-"), "R_s": ("Specific gas constant", "J/(kg K)"), "N": ("Number of teeth", "-"),
                   "s": ("Tooth pitch", "m"), r"\dot m": ("Leakage mass flow", "kg/s"), r"\dot m_c": ("Compressor mass flow", "kg/s"),
                   "P_{in}": ("Stage inlet pressure", "Pa"), "P_{out}": ("Stage outlet pressure", "Pa"), "B_c": ("Wachel constant", "-"),
                   "P_s": ("Stage power", "W"), r"\omega": ("Shaft angular speed", "rad/s"), "D_c": ("Impeller tip diameter", "m"),
                   "H_c": ("Impeller tip width", "m"), r"\rho_d": ("Stage outlet density", "kg/m³"), r"\rho_s": ("Stage inlet density", "kg/m³"),
                   "q": ("Aerodynamic cross-coupled stiffness", "N/m"), "q_i": ("Stage cross-coupled stiffness", "N/m"),
                   "q_{seal}": ("Extra cross-coupling given for the seals", "N/m"), "Q_a": ("Total cross-coupled stiffness", "N/m"),
                   "d_h": ("Impeller hub diameter", "m"), "c_{user}": ("Clearance set by the user", "m")})
    rs = R / (mw / 1000.0)
    T = st["T_out_c"] + 273.15
    rec.step("Eye seal diameter", r"D_e = 1.05\,D_1", {"D_1": (imp["D1_eye_mm"] / 1e3, "m")}, d_eye * 1e3, "mm", "D_e", row=i, ui="Eye Ø mm")
    if sd.labyrinth_clearance_mm:
        rec.step("Eye seal clearance", "c = c_{user}", {}, c * 1e3, "mm", "c", row=i, ui="Clearance mm")
    else:
        rec.step("Eye seal clearance", r"c = \tfrac{1}{2}\,(0.0025\,D + 0.1\ \mathrm{mm})", {"D": (d_eye, "m")}, c * 1e3, "mm", "c", row=i, ui="Clearance mm")
    rec.step("Eye seal leakage", r"\dot m = C_d\,\gamma\,\pi D c\,\frac{p_u}{\sqrt{Z\,R_s\,T_u}}\,\sqrt{\frac{1 - (p_d/p_u)^2}{N - \ln(p_d/p_u)}},\quad"
             r" \gamma = \left(1 - \frac{N-1}{N}\,\frac{c/s}{c/s + 0.02}\right)^{-1/2}",
             {"C_d": 0.71, "D": (d_eye, "m"), "c": (c, "m"), "p_u": (p_up, "Pa"), "p_d": (st["P_in_bara"] * 1e5, "Pa"), "T_u": (T, "K"),
              "Z": gas.z(T, p_up), "R_s": (rs, "J/(kg K)"), "N": sd.labyrinth_teeth, "s": (sd.labyrinth_pitch_mm / 1e3, "m"),
              r"\gamma": eye["carry_over"], r"\dot m_c": (m, "kg/s")}, 100 * eye["mass_flow_kg_s"] / m, "%", r"\dot m", row=i,
             note=f"{eye['mass_flow_kg_s']:.4f} kg/s; upstream pressure = inlet + 60 % of the stage rise (impeller shroud side)", ui="Eye leak %")
    rec.step("Interstage leakage", r"\dot m = C_d\,\gamma\,\pi D c\,\frac{p_u}{\sqrt{Z\,R_s\,T_u}}\,\sqrt{\frac{1 - (p_d/p_u)^2}{N - \ln(p_d/p_u)}}",
             {"D": (d_sh, "m"), "p_u": (st["P_out_bara"] * 1e5, "Pa"), "p_d": (st["P_in_bara"] * 1e5, "Pa"), r"\gamma": inter["carry_over"],
              "A": (inter["area_m2"], "m²")}, inter["mass_flow_kg_s"], "kg/s", r"\dot m", row=i, note="Shaft seal at the hub diameter, stage outlet to inlet", ui="Interstage kg/s")
    rec.step("Stage cross-coupled stiffness", r"q = B_c\,\frac{P_s/\omega}{D_c\,H_c}\,\frac{\rho_d}{\rho_s}",
             {"B_c": 3.0, "P_s": (st["power_kw"] * 1e3, "W"), r"\omega": (omega, "rad/s"), "D_c": (imp["D2_mm"] / 1e3, "m"),
              "H_c": (imp["b2_mm"] / 1e3, "m"), r"\rho_d": (st["rho_out"], "kg/m³"), r"\rho_s": (st["rho_in"], "kg/m³")}, q / 1e6, "MN/m", "q", row=i, ui="Wachel q MN/m")


def _end_steps(rec, end, sd, P1, P_d, T_d, d_ps, gas) -> None:
    cond = end["conditioning"]
    rec.sym(**{"p_{seal}": ("Pressure at the shaft-end seal", "Pa"), "P_1": ("Suction pressure", "Pa"), "Q_{ref}": ("Vendor reference leakage", "Nm³/h"),
               "p_{ref}": ("Vendor reference pressure", "Pa"), "Q_l": ("Primary leakage per seal", "Nm³/h"), r"\rho_n": ("Gas density at 0 °C, 1.013 bar", "kg/m³"),
               r"\rho_{seal}": ("Gas density at seal pressure", "kg/m³"), "d_{ps}": ("Process-side labyrinth diameter", "m"),
               r"\dot m_{sg}": ("Seal gas supply mass flow", "kg/s"), "T_{dew}": ("Hydrocarbon dew temperature", "°C"), "T_{sup}": ("Seal gas supply temperature", "°C"),
               "P_d": ("Discharge (seal gas supply) pressure", "Pa"), "p_v": ("Seal vent pressure", "Pa"), "T_{exp}": ("Temperature after expansion", "°C"),
               r"\Delta T_{sh}": ("Superheat margin", "K"), "h": ("Gas enthalpy", "J/kg"), "T": ("Gas temperature along the expansion", "°C"), "P": ("Pressure", "Pa")})
    rec.step("Seal pressure", r"p_{seal} = P_1", {"P_1": (P1, "Pa")}, end["seal_pressure_bara"], "bara", "p_{seal}",
             note="End seals sit behind the balance line, which is held at suction pressure")
    rec.step("Primary leakage per seal", r"Q_l = Q_{ref}\,\left(\frac{p_{seal}}{p_{ref}}\right)^{1.5}",
             {"Q_{ref}": (sd.dgs_reference_leakage_nm3_h, "Nm³/h"), "p_{seal}": (P1, "Pa"), "p_{ref}": (sd.dgs_reference_pressure_bara * 1e5, "Pa")},
             end["primary_leakage_nm3_h_per_seal"], "Nm³/h", "Q_l")
    rec.step("Seal gas supply (total)", r"\dot m_{sg} = 2\left(\frac{Q_l\,\rho_n}{3600} + 5\ \mathrm{m/s}\cdot \pi\,d_{ps}\,c\,\rho_{seal}\right)",
             {"Q_l": (end["primary_leakage_nm3_h_per_seal"], "Nm³/h"), r"\rho_n": (gas.density(273.15, 101325.0), "kg/m³"),
              "d_{ps}": (d_ps, "m"), "c": (labyrinth_clearance(d_ps), "m"), r"\rho_{seal}": (gas.density(T_d, P1), "kg/m³")},
             end["seal_gas_supply_nm3_h_total"], "Nm³/h", r"\dot m_{sg}", note="Primary leakage plus 5 m/s inward flow through the process-side labyrinth, two seals")
    if cond["hydrocarbon_dew_point_c"] is not None:
        rec.step("Hydrocarbon dew point at supply", r"T_{dew} = \max_{p_v \le P \le P_d} T_{dew}(P)", {"P_d": (P_d, "Pa"), "p_v": (sd.seal_vent_pressure_bara * 1e5, "Pa")},
                 cond["hydrocarbon_dew_point_c"], "°C", "T_{dew}", note="Dew points from the phase-envelope solver at 8 pressures between supply and vent")
    rec.step("Temperature after expansion (JT)", r"h(T_{exp}, p_v) = h(T_{sup}, P_d)",
             {"T_{sup}": (cond["supply_temperature_c"], "°C"), "P_d": (P_d, "Pa"), "p_v": (max(sd.seal_vent_pressure_bara * 1e5, 1.05e5), "Pa")},
             cond["temperature_after_expansion_c"], "°C", "T_{exp}", note="Constant-enthalpy expansion across the seal faces, solved on the real-gas model")
    if cond["superheat_margin_c"] is not None:
        rec.step("Superheat margin", r"\Delta T_{sh} = \min_P \left(T(P) - T_{dew}(P)\right)", {}, cond["superheat_margin_c"], "K", r"\Delta T_{sh}",
                 note=f"Smallest margin along the expansion path (also checked against the water dew point); required {sd.seal_gas_superheat_margin_c:.0f} K")


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
        _stage_steps(rec, len(lab), st, imp, d_eye, c, p_up, eye, inter, d_shaft, q, m, omega, sd, mw, gas)
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
    rec.step("Balance piston leakage", r"\dot m = C_d\,\gamma\,A\,\frac{p_u}{\sqrt{Z\,R_s\,T_u}}\,\sqrt{\frac{1 - (p_d/p_u)^2}{N - \ln(p_d/p_u)}}",
             {"C_d": 0.71, r"\gamma": bp["carry_over"], "A": (bp["area_m2"], "m²"), "p_u": (P_d, "Pa"), "p_d": (P1, "Pa"), "T_u": (T_d, "K"),
              "N": sd.balance_piston_teeth, "Z": gas.z(T_d, P_d), "R_s": (R / (mw / 1000.0), "J/(kg K)")}, bp_pct, "%", r"\dot m",
             note=f"{bp['mass_flow_kg_s']:.3f} kg/s as a share of the compressor flow; discharge to suction across the piston")
    rec.step("Total cross-coupled stiffness", r"Q_a = \sum q_i + q_{seal}", {"q_{seal}": (sd.seal_cross_coupling_n_m, "N/m")}, total_q / 1e6, "MN/m", "Q_a", ui="Total Qa")
    if "conditioning" in end:
        _end_steps(rec, end, sd, P1, P_d, T_d, rotor_geom["seal_diameter_m"], gas)
    return {"labyrinths": lab, "balance_piston": {**bp, "diameter_mm": d_bp * 1e3, "clearance_mm": c_bp * 1e3,
                                                  "leakage_pct": bp_pct},
            "end_seals": end, "total_wachel_q_n_m": total_q, "internal_recirculation_kg_s": total_recirc + bp["mass_flow_kg_s"],
            "trace": rec}
