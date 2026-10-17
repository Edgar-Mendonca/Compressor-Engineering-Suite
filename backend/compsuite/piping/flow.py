"""Piping and flow engineering.

* Pipe sizing on velocity and rho v^2 limits over a standard NPS table.
* Friction: Colebrook-White (solved iteratively), Darcy-Weisbach.
* Compressible isothermal flow over a line length plus fitting K values.
* Control (recycle / anti-surge) valve sizing to IEC 60534-2-1 for gas.
* Orifice flowmeter: ISO 5167-2 (Reader-Harris/Gallagher, flange taps).
* System curve vs. compressor curve at rated speed.

When the ``fluids`` package is installed the friction factor is
cross-checked against fluids.friction.Colebrook.
"""

from __future__ import annotations

import math

from scipy.optimize import brentq

from compsuite.core.trace import record

# NPS: (OD mm, wall mm) - schedule 40 / STD up to 24", XS shown where STD is common practice.
NPS = {2: (60.3, 3.91), 3: (88.9, 5.49), 4: (114.3, 6.02), 6: (168.3, 7.11), 8: (219.1, 8.18), 10: (273.1, 9.27),
       12: (323.8, 9.53), 14: (355.6, 9.53), 16: (406.4, 9.53), 18: (457.2, 9.53), 20: (508.0, 9.53), 24: (609.6, 9.53),
       30: (762.0, 12.7), 36: (914.4, 12.7), 42: (1066.8, 12.7), 48: (1219.2, 12.7)}


def colebrook(re: float, rel_rough: float) -> float:
    if re < 2300:
        return 64.0 / max(re, 1e-9)
    f = 0.25 / math.log10(rel_rough / 3.7 + 5.74 / re**0.9) ** 2  # Swamee-Jain start
    for _ in range(50):
        f_new = (-2.0 * math.log10(rel_rough / 3.7 + 2.51 / (re * math.sqrt(f)))) ** -2
        if abs(f_new - f) < 1e-12:
            break
        f = f_new
    return f


def size_pipe(m_dot: float, rho: float, v_limit: float, rho_v2_limit: float) -> dict:
    for nps, (od, wt) in sorted(NPS.items()):
        d = (od - 2 * wt) / 1000
        v = m_dot / rho / (math.pi / 4 * d**2)
        if v <= v_limit and rho * v**2 <= rho_v2_limit:
            return {"nps_in": nps, "id_m": d, "velocity_m_s": v, "rho_v2_pa": rho * v**2}
    nps, (od, wt) = max(NPS.items())
    d = (od - 2 * wt) / 1000
    v = m_dot / rho / (math.pi / 4 * d**2)
    return {"nps_in": nps, "id_m": d, "velocity_m_s": v, "rho_v2_pa": rho * v**2, "exceeds_table": True}


def isothermal_pressure_drop(p1: float, m_dot: float, d: float, length: float, k_fittings: float, T: float, Z: float,
                             mw: float, mu: float, roughness: float) -> dict:
    """Isothermal compressible line flow: p1^2 - p2^2 = G^2 Z R T / M (f L/D + K + 2 ln(p1/p2))."""
    area = math.pi / 4 * d**2
    G = m_dot / area
    re = G * d / mu
    f = colebrook(re, roughness / d)
    rs = 8.314462618 / (mw / 1000) * Z * T
    def res(p2):
        return p1**2 - p2**2 - G**2 * rs * (f * length / d + k_fittings + 2 * math.log(p1 / p2))
    p2 = brentq(res, 0.05 * p1, p1 * (1 - 1e-12))
    return {"p2_pa": p2, "dp_pa": p1 - p2, "friction_factor": f, "reynolds": re, "mass_flux": G}


def control_valve_cv(m_dot_kg_h: float, p1_bar: float, p2_bar: float, rho1: float, k: float, xt: float) -> dict:
    """IEC 60534-2-1 compressible flow: W = N6 Fp Cv Y sqrt(x p1 rho1), N6 = 27.3 (Cv, kg/h, bar, kg/m3)."""
    x = (p1_bar - p2_bar) / p1_bar
    f_gamma = k / 1.40
    x_choked = f_gamma * xt
    choked = x >= x_choked
    x_eff = min(x, x_choked)
    Y = max(1 - x_eff / (3 * f_gamma * xt), 2 / 3)
    cv = m_dot_kg_h / (27.3 * Y * math.sqrt(x_eff * p1_bar * rho1))
    return {"cv": cv, "kv": cv / 1.156, "x": x, "x_choked": x_choked, "choked": choked, "Y": Y}


def orifice_iso5167(m_target: float, D: float, beta: float, rho: float, mu: float, kappa: float, p1: float) -> dict:
    """Differential pressure for a flange-tap orifice at a target mass flow (ISO 5167-2:2003)."""
    d = beta * D
    L1 = L2 = 0.0254 / D

    def C_of(re):
        A = (19000 * beta / re) ** 0.8
        M2 = 2 * L2 / (1 - beta)
        c = (0.5961 + 0.0261 * beta**2 - 0.216 * beta**8 + 0.000521 * (1e6 * beta / re) ** 0.7
             + (0.0188 + 0.0063 * A) * beta**3.5 * (1e6 / re) ** 0.3
             + (0.043 + 0.080 * math.exp(-10 * L1) - 0.123 * math.exp(-7 * L1)) * (1 - 0.11 * A) * beta**4 / (1 - beta**4)
             - 0.031 * (M2 - 0.8 * M2**1.1) * beta**1.3)
        if D < 0.07112:
            c += 0.011 * (0.75 - beta) * (2.8 - D / 0.0254)
        return c

    re = 4 * m_target / (math.pi * D * mu)
    C = C_of(re)

    def mass(dp):
        eps = 1 - (0.351 + 0.256 * beta**4 + 0.93 * beta**8) * (1 - ((p1 - dp) / p1) ** (1 / kappa))
        return C / math.sqrt(1 - beta**4) * eps * math.pi / 4 * d**2 * math.sqrt(2 * dp * rho)
    dp = brentq(lambda x: mass(x) - m_target, 1.0, 0.5 * p1)
    eps = 1 - (0.351 + 0.256 * beta**4 + 0.93 * beta**8) * (1 - ((p1 - dp) / p1) ** (1 / kappa))
    return {"bore_m": d, "beta": beta, "C": C, "expansibility": eps, "dp_pa": dp, "reynolds": re,
            "permanent_loss_pa": dp * (math.sqrt(1 - beta**4 * (1 - C**2)) - C * beta**2) /
                                 (math.sqrt(1 - beta**4 * (1 - C**2)) + C * beta**2)}


def piping_analysis(gas, comp_design: dict, perf_map: dict, project) -> dict:
    pd = project.piping
    rec = record("piping", "NPS sizing, Colebrook + isothermal compressible flow, IEC 60534 valve, ISO 5167 orifice", pd,
                 assumptions=["Isothermal line flow at line inlet temperature", "Standard-weight pipe table",
                              "Recycle valve sized for design flow from discharge to suction pressure",
                              f"System curve: {pd.system_static_pressure_fraction:.0%} static + friction ~ Q^2"],
                 references=["Crane TP-410", "IEC 60534-2-1:2011", "ISO 5167-2:2003"])
    cd = project.design_case()
    s, d = comp_design["suction"], comp_design["discharge"]
    m = comp_design["mass_flow_kg_s"]
    out = {}
    for name, st, L, K, vlim in (("suction", s, pd.suction_length_m, pd.suction_fittings_k, pd.suction_velocity_limit_m_s),
                                 ("discharge", d, pd.discharge_length_m, pd.discharge_fittings_k, pd.discharge_velocity_limit_m_s)):
        size = size_pipe(m, st.rho, vlim, pd.rho_v2_limit_pa)
        dp = isothermal_pressure_drop(st.P, m, size["id_m"], L, K, st.T, st.Z, st.mw, st.mu, pd.roughness_mm / 1000)
        try:
            from fluids.friction import Colebrook as fluids_colebrook
            dp["friction_factor_fluids"] = fluids_colebrook(dp["reynolds"], pd.roughness_mm / 1000 / size["id_m"])
        except ImportError:
            pass
        if size.get("exceeds_table"):
            rec.warn(f"{name} line exceeds the largest tabulated pipe size")
        out[name] = {**size, **dp, "dp_bar": dp["dp_pa"] / 1e5, "mach": size["velocity_m_s"] / st.sound}
    valve = control_valve_cv(m * 3600, d.P / 1e5, s.P / 1e5, d.rho, d.k, pd.recycle_valve_xt)
    meter = orifice_iso5167(m, out["suction"]["id_m"], pd.orifice_beta, s.rho, s.mu, s.k, s.P)
    # System curve against the rated speed line.
    sys_curve = []
    line = next((l for l in perf_map["lines"] if abs(l["speed_frac"] - 1.0) < 1e-9), perf_map["lines"][-1] if perf_map["lines"] else None)
    rated_head = comp_design["polytropic_head_j_kg"] / 1e3
    q_r = m / s.rho * 3600
    if line:
        for p in line["points"]:
            q = p["q_am3_h"]
            sys_curve.append({"q_am3_h": q, "system_head_kj_kg": rated_head * (pd.system_static_pressure_fraction +
                                                                              (1 - pd.system_static_pressure_fraction) * (q / q_r) ** 2),
                              "compressor_head_kj_kg": p["head_kj_kg"]})
    out.update({"recycle_valve": valve, "flowmeter": meter, "system_curve": sys_curve, "trace": rec})
    return out
