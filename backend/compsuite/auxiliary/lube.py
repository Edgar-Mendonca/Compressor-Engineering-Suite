"""Lube-oil system sizing (API 614 considerations).

Oil flow from the bearing losses and the design temperature rise, pump
rating with margin, hydraulic and motor power, cooler duty and area (LMTD,
counter-flow), reservoir working capacity from retention time, filter and
supply-line pressure budget.
"""

from __future__ import annotations

import math

from compsuite.bearings.journal import oil_cp, oil_density, oil_dynamic_viscosity, oil_kinematic_viscosity_cst
from compsuite.core.trace import record


def thrust_bearing_loss(load_n: float, collar_d: float, inner_d: float, omega: float, mu: float, film: float = 30e-6) -> float:
    """Tilting-pad thrust bearing loss: Couette shear over 80 % pad coverage."""
    r_o, r_i = collar_d / 2, inner_d / 2
    return 0.8 * mu * omega**2 * math.pi / 2 * (r_o**4 - r_i**4) / film


def lube_system(bearing_rows: list[dict], thrust: dict, omega: float, project, seal_type: str) -> dict:
    lb, bd = project.lube, project.bearings
    rec = record("auxiliary.lube", "Heat-balance oil flow, LMTD cooler, retention-time reservoir", [lb, bd],
                 assumptions=["Bearing losses from the journal-bearing model at rated speed",
                              "Thrust loss: Couette shear, 30 um film, 80 % pad coverage",
                              f"Oil temperature rise {bd.oil_temperature_rise_c} degC", "Counter-flow oil cooler; area includes 15 % fouling margin",
                              f"Pump margin {lb.pump_margin}; reservoir retention {lb.reservoir_retention_min} min",
                              "Oil-film shaft seals not modelled" if seal_type == "oil_film" else "Dry gas seals: no seal oil"],
                 references=["API 614 5th ed. Ch. 2 (special-purpose oil systems)"])
    T_in = bd.oil_supply_temperature_c
    dT = bd.oil_temperature_rise_c
    rho, cp = oil_density(T_in + dT / 2), oil_cp(T_in + dT / 2)
    mu = oil_dynamic_viscosity(bd.oil_grade, T_in + dT)
    journal_loss = sum(r["power_loss_kw"] for r in bearing_rows) * 1e3
    tl = thrust_bearing_loss(thrust["thrust_bearing_load_n"], thrust["collar_diameter_m"], thrust.get("inner_diameter_m", thrust["collar_diameter_m"] * 0.55),
                             omega, mu)
    total_loss = journal_loss + tl
    q_bear = total_loss / (rho * cp * dT)  # m3/s
    q_normal = q_bear + lb.control_oil_allowance_l_min / 60000
    q_pump = q_normal * lb.pump_margin
    dp_pump = (lb.pump_discharge_pressure_barg - 0.0) * 1e5
    hyd = q_pump * dp_pump
    shaft_kw = hyd / lb.pump_efficiency / 1e3
    # Cooler: oil from T_in + dT to T_in; water from Tw_in to Tw_in + rise.
    duty = total_loss
    t_hi, t_lo = T_in + dT, T_in
    tw_i, tw_o = lb.cooling_water_inlet_c, lb.cooling_water_inlet_c + lb.cooling_water_rise_c
    d1, d2 = t_hi - tw_o, t_lo - tw_i
    if d1 <= 0 or d2 <= 0:
        rec.warn("Cooling water too warm for the oil supply temperature (temperature cross)")
        lmtd = float("nan")
    else:
        lmtd = (d1 - d2) / math.log(d1 / d2) if abs(d1 - d2) > 1e-9 else d1
    area = duty / (lb.cooler_u_w_m2k * lmtd) if lmtd == lmtd else float("nan")
    water = duty / (4180 * lb.cooling_water_rise_c)
    reservoir = q_normal * 60 * lb.reservoir_retention_min
    rec.sym(**{"P_j": ("Journal bearing losses", "W"), "P_{j,k}": ("Loss of one journal bearing", "W"), "P_t": ("Thrust bearing loss", "W"),
               "P_{tot}": ("Total bearing loss", "W"), r"\mu": ("Oil dynamic viscosity at drain temperature", "Pa·s"), r"\omega": ("Shaft angular speed", "rad/s"),
               "r_o": ("Collar outer radius", "m"), "r_i": ("Pad inner radius", "m"), "h_f": ("Thrust film thickness", "m"),
               r"\rho": ("Oil density at mean temperature", "kg/m³"), "c_p": ("Oil specific heat at mean temperature", "J/(kg K)"),
               r"\Delta T": ("Oil temperature rise", "K"), "Q_b": ("Bearing oil flow", "m³/s"), "Q_c": ("Control oil allowance", "L/min"),
               "Q_n": ("Normal oil flow", "m³/s"), "Q_p": ("Pump rated flow", "m³/s"), "k_p": ("Pump flow margin", "-"),
               r"\Delta p": ("Pump discharge pressure", "Pa"), r"\eta_p": ("Pump efficiency", "-"), "P_p": ("Pump shaft power", "W"),
               r"\Phi": ("Cooler duty", "W"), r"\Delta T_1": ("Hot-end temperature difference", "K"), r"\Delta T_2": ("Cold-end temperature difference", "K"),
               r"\Delta T_{lm}": ("Log mean temperature difference", "K"), "U": ("Cooler overall heat transfer coefficient", "W/(m² K)"),
               "A": ("Cooler area", "m²"), r"\Delta T_w": ("Cooling water temperature rise", "K"), "c_w": ("Water specific heat", "J/(kg K)"),
               r"\dot m_w": ("Cooling water flow", "kg/s"), "t_r": ("Retention time", "min"), "V_r": ("Reservoir working volume", "m³"),
               r"\nu": ("Oil kinematic viscosity", "cSt"), "T_d": ("Oil drain temperature", "°C"), "T_s": ("Oil supply temperature", "°C"),
               "T_{w,in}": ("Cooling water inlet temperature", "°C"), "T_{w,out}": ("Cooling water outlet temperature", "°C"),
               "T": ("Absolute oil temperature", "K"), "a": ("Oil grade constant", "-"), "b": ("Oil grade slope", "-")})
    rec.step("Journal bearing losses", r"P_j = \sum P_{j,k}", {}, journal_loss / 1e3, "kW", "P_j", note="Sum of the journal bearing losses at rated speed",
             ui="Journal losses")
    rec.step("Thrust bearing loss", r"P_t = 0.8\,\mu\,\omega^2\,\frac{\pi}{2}\,\frac{r_o^4 - r_i^4}{h_f}",
             {r"\mu": (mu, "Pa·s"), r"\omega": (omega, "rad/s"), "r_o": (thrust["collar_diameter_m"] / 2, "m"),
              "r_i": (thrust.get("inner_diameter_m", thrust["collar_diameter_m"] * 0.55) / 2, "m"), "h_f": (30e-6, "m")}, tl / 1e3, "kW", "P_t",
             note="Shear of a 30 µm film over 80 % of the collar face", ui="Thrust loss")
    rec.step("Normal oil flow", r"Q_n = \frac{P_j + P_t}{\rho\,c_p\,\Delta T} + Q_c",
             {"P_j": (journal_loss, "W"), "P_t": (tl, "W"), r"\rho": (rho, "kg/m³"), "c_p": (cp, "J/(kg K)"), r"\Delta T": (dT, "K"),
              "Q_c": (lb.control_oil_allowance_l_min, "L/min")}, q_normal * 60000, "L/min", "Q_n")
    rec.step("Pump rated flow", r"Q_p = k_p\,Q_n", {"k_p": lb.pump_margin, "Q_n": (q_normal, "m³/s")}, q_pump * 60000, "L/min", "Q_p")
    rec.step("Pump shaft power", r"P_p = \frac{Q_p\,\Delta p}{\eta_p}", {"Q_p": (q_pump, "m³/s"), r"\Delta p": (dp_pump, "Pa"), r"\eta_p": lb.pump_efficiency},
             shaft_kw, "kW", "P_p")
    rec.step("Cooler duty", r"\Phi = P_j + P_t", {"P_j": (journal_loss, "W"), "P_t": (tl, "W")}, duty / 1e3, "kW", r"\Phi",
             note="All bearing heat goes to the cooling water")
    rec.step("Cooler LMTD", r"\Delta T_{lm} = \frac{\Delta T_1 - \Delta T_2}{\ln(\Delta T_1/\Delta T_2)},\quad \Delta T_1 = T_d - T_{w,out},\ \Delta T_2 = T_s - T_{w,in}",
             {"T_d": (t_hi, "°C"), "T_s": (t_lo, "°C"), "T_{w,in}": (tw_i, "°C"), "T_{w,out}": (tw_o, "°C"), r"\Delta T_1": (d1, "K"), r"\Delta T_2": (d2, "K")},
             lmtd, "°C", r"\Delta T_{lm}", note="Counter-flow cooler")
    rec.step("Cooler area", r"A = 1.15\,\frac{\Phi}{U\,\Delta T_{lm}}", {r"\Phi": (duty, "W"), "U": (lb.cooler_u_w_m2k, "W/(m² K)"), r"\Delta T_{lm}": (lmtd, "K")},
             area * 1.15, "m²", "A", note="15 % extra area for fouling", ui="Cooler area (incl. fouling)")
    rec.step("Cooling water", r"\dot m_w = \frac{\Phi}{c_w\,\Delta T_w}", {r"\Phi": (duty, "W"), "c_w": (4180, "J/(kg K)"), r"\Delta T_w": (lb.cooling_water_rise_c, "K")},
             water / 1000 * 3600, "m³/h", r"\dot m_w", note="Water taken as 1000 kg/m³")
    rec.step("Reservoir working volume", r"V_r = Q_n\,t_r", {"Q_n": (q_normal, "m³/s"), "t_r": (lb.reservoir_retention_min, "min")}, reservoir * 1000, "L", "V_r")
    rec.step("Oil viscosity at drain", r"\log\log(\nu + 0.7) = a - b\,\log T", {"T_d": (T_in + dT, "°C")},
             oil_kinematic_viscosity_cst(bd.oil_grade, T_in + dT), "cSt", r"\nu", note=f"{bd.oil_grade}: line through the 40 °C and 100 °C grade values")
    return {"journal_loss_kw": journal_loss / 1e3, "thrust_loss_kw": tl / 1e3, "total_loss_kw": total_loss / 1e3,
            "oil_viscosity_cst_at_drain": oil_kinematic_viscosity_cst(bd.oil_grade, T_in + dT),
            "normal_flow_l_min": q_normal * 60000, "pump_rated_flow_l_min": q_pump * 60000,
            "pump_hydraulic_kw": hyd / 1e3, "pump_shaft_kw": shaft_kw, "cooler_duty_kw": duty / 1e3,
            "cooler_lmtd_c": lmtd, "cooler_area_m2": area * 1.15, "cooling_water_m3_h": water / 1000 * 3600,
            "reservoir_working_l": reservoir * 1000, "filter_dp_bar": lb.filter_pressure_drop_bar,
            "supply_pressure_barg": lb.supply_pressure_barg, "trace": rec}
