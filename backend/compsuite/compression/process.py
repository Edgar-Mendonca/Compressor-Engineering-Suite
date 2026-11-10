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


def evaluate_case(gas, case, eta_p: float, mech_loss_fraction: float, row: int | None = None) -> dict:
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
    _steps(rec, out, T1, P1, P2, mech_loss_fraction, row)
    out["case"] = case.name
    out["trace"] = rec
    return out


def _steps(rec, o: dict, T1: float, P1: float, P2: float, loss: float, row: int | None) -> None:
    def step(*a, **k):
        rec.step(*a, row=row, **k)
    s1, s2, sc = o["suction"], o["discharge"], o["schultz"]
    m = o["mass_flow_kg_s"]
    rec.sym(**{"P_1": ("Suction pressure", "Pa"), "v_1": ("Suction specific volume", "m³/kg"), "v_2": ("Discharge specific volume", "m³/kg"), "P_2": ("Discharge pressure", "Pa"), "T_1": ("Suction temperature", "K"),
               "T_2": ("Discharge temperature", "K"), "Z_1": ("Compressibility factor at suction", "-"),
               "M": ("Molecular weight", "kg/kmol"), "R_u": ("Universal gas constant", "J/(kmol K)"),
               r"\rho_1": ("Suction density", "kg/m³"), "r": ("Pressure ratio", "-"), "v": ("Specific volume", "m³/kg"),
               r"\eta_p": ("Polytropic efficiency", "-"), r"\eta_s": ("Isentropic efficiency", "-"),
               "H_p": ("Polytropic head", "J/kg"), "H_s": ("Isentropic head", "J/kg"), r"\Delta h": ("Enthalpy rise", "J/kg"),
               "n": ("Polytropic volume exponent", "-"), "f": ("Schultz polytropic head factor", "-"),
               "H_{p,S}": ("Polytropic head by the Schultz method", "J/kg"), r"\eta_{p,S}": ("Polytropic efficiency by the Schultz method", "-"),
               r"\dot m": ("Mass flow", "kg/s"), "Q_1": ("Actual suction volume flow", "m³/s"),
               "P_g": ("Gas power", "W"), "P_{sh}": ("Shaft power", "W"), "k_m": ("Mechanical loss fraction", "-")})
    step("Suction density", r"\rho_1 = \frac{P_1\,M}{Z_1\,R_u\,T_1}",
             {"P_1": (P1, "Pa"), "M": (s1.mw, "kg/kmol"), "Z_1": s1.Z, "R_u": (8314.46, "J/(kmol K)"), "T_1": (T1, "K")},
             s1.rho, "kg/m³", r"\rho_1", ui="Density suction")
    step("Actual suction volume flow", r"Q_1 = \dot m / \rho_1", {r"\dot m": (m, "kg/s"), r"\rho_1": (s1.rho, "kg/m³")},
             o["suction_volume_flow_m3_s"] * 3600, "m³/h", "Q_1", note="× 3600 for m³/h", ui="Q1 Am³/h")
    step("Pressure ratio", "r = P_2 / P_1", {"P_2": (P2, "Pa"), "P_1": (P1, "Pa")}, o["pressure_ratio"], "", "r", ui="PR")
    step("Polytropic head", r"H_p = \int_{P_1}^{P_2} v\,dP,\quad dh = \frac{v\,dP}{\eta_p}",
             {"P_1": (P1, "Pa"), "P_2": (P2, "Pa"), r"\eta_p": o["polytropic_efficiency"]}, o["polytropic_head_j_kg"] / 1e3, "kJ/kg",
             "H_p", ui="Hp kJ/kg", note="Integrated on the real-gas model in 40 equal log-pressure steps; v from the equation of state at each step")
    step("Enthalpy rise", r"\Delta h = H_p / \eta_p", {"H_p": (o["polytropic_head_j_kg"], "J/kg"), r"\eta_p": o["polytropic_efficiency"]},
             o["enthalpy_rise_j_kg"] / 1e3, "kJ/kg", r"\Delta h")
    step("Discharge temperature", r"h(T_2, P_2) = h_1 + \Delta h", {r"\Delta h": (o["enthalpy_rise_j_kg"], "J/kg"), "P_2": (P2, "Pa")},
             s2.T - 273.15, "°C", "T_2", ui="Td °C", note="T₂ solved from the equation of state so that the enthalpy matches")
    step("Polytropic exponent (Schultz)", r"n = \frac{\ln(P_2/P_1)}{\ln(v_1/v_2)}",
             {"P_1": (P1, "Pa"), "P_2": (P2, "Pa"), "v_1": (s1.v, "m³/kg"), "v_2": (s2.v, "m³/kg")}, sc["n"], "", "n")
    step("Polytropic head (Schultz check)", r"H_p = f\,\frac{n}{n-1}\,(P_2 v_2 - P_1 v_1)",
             {"f": sc["f"], "n": sc["n"], "P_1": (P1, "Pa"), "v_1": (s1.v, "m³/kg"), "P_2": (P2, "Pa"), "v_2": (s2.v, "m³/kg")},
             sc["head"] / 1e3, "kJ/kg", "H_p")
    step("Polytropic efficiency (Schultz check)", r"\eta_{p,S} = H_{p,S} / \Delta h", {"H_{p,S}": (sc["head"], "J/kg"),
         r"\Delta h": (o["enthalpy_rise_j_kg"], "J/kg")}, sc["eta_p"], "", r"\eta_{p,S}", ui="ηp Schultz")
    step("Isentropic efficiency", r"\eta_s = H_s / \Delta h", {"H_s": (o["isentropic_head_j_kg"], "J/kg"),
             r"\Delta h": (o["enthalpy_rise_j_kg"], "J/kg")}, o["isentropic_efficiency"], "", r"\eta_s", ui="ηs",
             note="H_s = h(T₂s, P₂) − h₁ along constant entropy")
    step("Gas power", r"P_g = \dot m\,\Delta h", {r"\dot m": (m, "kg/s"), r"\Delta h": (o["enthalpy_rise_j_kg"], "J/kg")},
             o["gas_power_kw"], "kW", "P_g", ui="Gas kW")
    step("Shaft power", r"P_{sh} = P_g\,(1 + k_m)", {"P_g": (o["gas_power_kw"] * 1e3, "W"), "k_m": loss}, o["shaft_power_kw"], "kW", "P_{sh}", ui="Shaft kW")

