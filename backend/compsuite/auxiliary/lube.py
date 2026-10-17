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
    return {"journal_loss_kw": journal_loss / 1e3, "thrust_loss_kw": tl / 1e3, "total_loss_kw": total_loss / 1e3,
            "oil_viscosity_cst_at_drain": oil_kinematic_viscosity_cst(bd.oil_grade, T_in + dT),
            "normal_flow_l_min": q_normal * 60000, "pump_rated_flow_l_min": q_pump * 60000,
            "pump_hydraulic_kw": hyd / 1e3, "pump_shaft_kw": shaft_kw, "cooler_duty_kw": duty / 1e3,
            "cooler_lmtd_c": lmtd, "cooler_area_m2": area * 1.15, "cooling_water_m3_h": water / 1000 * 3600,
            "reservoir_working_l": reservoir * 1000, "filter_dp_bar": lb.filter_pressure_drop_bar,
            "supply_pressure_barg": lb.supply_pressure_barg, "trace": rec}
