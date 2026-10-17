"""Compression process calculations: flow conversions, polytropic and
isentropic compression, head, power and efficiency back-calculation.

The polytropic path is integrated numerically on the real-gas property
model (dh = v dP / eta_p in small pressure steps). This is the reference
approach that ASME PTC 10 / ISO 5389 approximate with the Schultz method,
which is also reported for comparison.
"""

from __future__ import annotations

import math

import numpy as np
from scipy.optimize import brentq

from compsuite.core.trace import record
from compsuite.core.units import P_ATM, NORMAL_T, STANDARD_T, c_to_k, bar_to_pa, k_to_c

FT3 = 0.028316846592
T_60F = 288.7056
P_14_696 = 101325.0


def mass_flow(gas, case) -> float:
    """Convert the case flow to kg/s."""
    v, u = case.flow_value, case.flow_unit
    if u == "kg/s":
        return v
    if u == "kg/h":
        return v / 3600.0
    if u == "Am3/h":
        return v / 3600.0 * gas.density(c_to_k(case.suction_temperature_c), bar_to_pa(case.suction_pressure_bara))
    if u == "Nm3/h":
        return v / 3600.0 * gas.density(NORMAL_T, P_ATM)
    if u == "Sm3/h":
        return v / 3600.0 * gas.density(STANDARD_T, P_ATM)
    if u == "MMSCFD":
        return v * 1e6 * FT3 / 86400.0 * gas.density(T_60F, P_14_696)
    raise ValueError(f"Unknown flow unit {u}")


def polytropic_path(gas, T1: float, P1: float, P2: float, eta_p: float, steps: int = 40) -> dict:
    """Integrate a polytropic compression path. Returns discharge state and head."""
    Ps = np.geomspace(P1, P2, steps + 1)
    T, h = T1, gas.h(T1, P1)
    v = 1.0 / gas.density(T1, P1)
    head = 0.0
    path = [(T1, P1)]
    for k in range(steps):
        dP = Ps[k + 1] - Ps[k]
        T_new, v_new = T * (Ps[k + 1] / Ps[k]) ** 0.25, v
        for _ in range(4):
            v_avg = 0.5 * (v + v_new)
            h_new = h + v_avg * dP / eta_p
            T_new = gas.T_from_hP(h_new, Ps[k + 1], T_new)
            v_new = 1.0 / gas.density(T_new, Ps[k + 1])
        head += 0.5 * (v + v_new) * dP
        T, h, v = T_new, h_new, v_new
        path.append((T, Ps[k + 1]))
    return {"T2": T, "h2": h, "head": head, "dh": h - gas.h(T1, P1), "path": path}


def isentropic(gas, T1: float, P1: float, P2: float) -> dict:
    s1, h1 = gas.s(T1, P1), gas.h(T1, P1)
    T2s = gas.T_from_sP(s1, P2, T1 * (P2 / P1) ** 0.25)
    return {"T2s": T2s, "head": gas.h(T2s, P2) - h1}


def schultz(gas, T1, P1, T2, P2) -> dict:
    """Schultz (1962) polytropic head from end states (ASME PTC 10 method)."""
    v1, v2 = 1 / gas.density(T1, P1), 1 / gas.density(T2, P2)
    s1 = gas.s(T1, P1)
    T2s = gas.T_from_sP(s1, P2, T2)
    v2s = 1 / gas.density(T2s, P2)
    ns = math.log(P2 / P1) / math.log(v1 / v2s)
    hs = gas.h(T2s, P2) - gas.h(T1, P1)
    f = hs / (ns / (ns - 1) * (P2 * v2s - P1 * v1))
    n = math.log(P2 / P1) / math.log(v1 / v2)
    hp = f * n / (n - 1) * (P2 * v2 - P1 * v1)
    dh = gas.h(T2, P2) - gas.h(T1, P1)
    return {"n": n, "ns": ns, "f": f, "head": hp, "eta_p": hp / dh}


def efficiency_from_discharge(gas, T1, P1, P2, T2) -> float:
    """Back-calculate polytropic efficiency from a measured discharge temperature."""
    g = lambda eta: polytropic_path(gas, T1, P1, P2, eta, steps=20)["T2"] - T2
    return brentq(g, 0.3, 0.999, xtol=1e-5)


def compress(gas, T1: float, P1: float, P2: float, m_dot: float, eta_p: float,
             mech_loss_fraction: float = 0.015) -> dict:
    s1 = gas.state(T1, P1)
    poly = polytropic_path(gas, T1, P1, P2, eta_p)
    s2 = gas.state(poly["T2"], P2)
    isen = isentropic(gas, T1, P1, P2)
    sch = schultz(gas, T1, P1, poly["T2"], P2)
    gas_power = m_dot * poly["dh"]
    shaft_power = gas_power * (1 + mech_loss_fraction)
    return {
        "suction": s1, "discharge": s2,
        "pressure_ratio": P2 / P1,
        "polytropic_head_j_kg": poly["head"],
        "isentropic_head_j_kg": isen["head"],
        "enthalpy_rise_j_kg": poly["dh"],
        "polytropic_efficiency": eta_p,
        "isentropic_efficiency": isen["head"] / poly["dh"],
        "isentropic_discharge_temperature_c": k_to_c(isen["T2s"]),
        "schultz": sch,
        "mass_flow_kg_s": m_dot,
        "suction_volume_flow_m3_s": m_dot / s1.rho,
        "discharge_volume_flow_m3_s": m_dot / s2.rho,
        "gas_power_kw": gas_power / 1e3,
        "shaft_power_kw": shaft_power / 1e3,
        "path": [(k_to_c(T), P / 1e5) for T, P in poly["path"]],
    }


def evaluate_case(gas, case, eta_p: float, mech_loss_fraction: float) -> dict:
    T1, P1, P2 = c_to_k(case.suction_temperature_c), bar_to_pa(case.suction_pressure_bara), bar_to_pa(case.discharge_pressure_bara)
    rec = record("compression", "Real-gas polytropic path integration (40 log-pressure steps)", case,
                 assumptions=["Single uncooled compression section unless the stage design adds intercooling",
                              "Mechanical losses as a fraction of gas power"],
                 references=["ASME PTC 10-1997 (Schultz method shown for comparison)", "ISO 5389:2005"],
                 engine=getattr(gas, "engine", "built-in"))
    if case.measured_discharge_temperature_c is not None:
        eta_p = efficiency_from_discharge(gas, T1, P1, P2, c_to_k(case.measured_discharge_temperature_c))
        rec.assumptions.append("Efficiency back-calculated from the measured discharge temperature")
    m = mass_flow(gas, case)
    out = compress(gas, T1, P1, P2, m, eta_p, mech_loss_fraction)
    if abs(out["schultz"]["eta_p"] - eta_p) > 0.01:
        rec.warn("Schultz and path-integration efficiencies differ by more than 1 point; check real-gas behaviour")
    out["case"] = case.name
    out["trace"] = rec
    return out
