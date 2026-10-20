"""Shop performance test to ASME PTC 10-2022 (Type 1 / Type 2).

Test design: for every compression section the specified point is reproduced
on a test gas by equal specific-volume ratio and flow coefficient; the test
speed follows from equal head coefficient. Every test-gas / suction-pressure
combination is screened against PTC 10 Table 3-2.1-2 (volume ratio +-5 %,
flow coefficient +-4 %, machine Mach and Reynolds limits), the stand limits
(discharge temperature, pressure, power), critical-speed margins and the
phase envelope. Data reduction: ISO 5167 orifice, static-to-total
conversion, polytropic head by Sandberg-Colby, Schultz or path integration,
casing heat loss; conversion to specified conditions by similarity
(q ~ N, H ~ N^2, equal efficiency), optional speed adjustment
(API 617 Part 2 8.3.5.5), PTC 19.1 uncertainty by numerical sensitivity and
API 617 acceptance (head 0 % negative tolerance, power <= 104 %, surge flow
not above prediction).

The Mach and Reynolds limit lines are linear fits of PTC 10 Figs 3-2.1-1 and
3-2.1-3 for centrifugal machines; verify against the licensed edition.
"""

from __future__ import annotations

import logging

import math

import numpy as np
from scipy.optimize import brentq

from compsuite.compression.process import polytropic_path
from compsuite.core.units import bar_to_pa, c_to_k, k_to_c
from compsuite.thermo.backends import make_gas

TEST_GASES = {
    "CO2": {"CO2": 100.0},
    "N2": {"N2": 100.0},
    "R134a": {"R134a": 100.0},
    "CO2/N2 70/30": {"CO2": 70.0, "N2": 30.0},
    "He/N2 30/70": {"He": 30.0, "N2": 70.0},
}
TYPE1_LIMITS = {"Inlet pressure": 5.0, "Inlet temperature": 8.0, "Speed": 2.0, "Molecular weight": 2.0, "Capacity (inlet volume flow)": 4.0}
# Sutherland viscosity (mu0 Pa s at 273.15 K, S K) for the test gases; others from the state model.
SUTHERLAND = {"CO2": (1.370e-5, 222.0), "N2": (1.663e-5, 107.0), "He": (1.870e-5, 79.4), "R134a": (1.07e-5, 330.0),
              "Ar": (2.125e-5, 144.0), "O2": (1.919e-5, 139.0), "CH4": (1.03e-5, 198.0)}
INSTRUMENTS = [
    ("Platinum resistance thermometer Pt100 class A", "t1, t2, tu", "+-(0.15 + 0.002|t|) C", "4 per flange, 90 deg apart"),
    ("Pressure transmitter", "p1, p2, pu", "0.10 % of reading", "4 taps per flange, 90 deg apart"),
    ("Differential-pressure transmitter", "orifice dp, seal / loop balance dp", "0.10 %", "2 per orifice"),
    ("Digital barometer", "pa, ta", "0.10 %", "1"),
    ("Speed pickup", "N", "0.10 %", "1"),
    ("Orifice plate ISO 5167-2", "q", "C +-0.5 %", "1 per section inlet + balance lines"),
    ("Gas chromatograph / analyser", "test-gas purity", ">= 98 % (CO2 / N2)", "sample before, near guarantee point, end"),
]
STABILITY = [("Inlet pressure", "2.0 %"), ("Inlet temperature", "0.3 %"), ("Discharge pressure", "2.0 %"),
             ("Inlet volume flow", "0.5 %"), ("Speed", "0.5 %"), ("Polytropic efficiency (max - min over >= 5 min)", "0.5 %")]
FLUCT = [("fl_p1", "Inlet pressure", 2.0), ("fl_t1", "Inlet temperature", 0.3), ("fl_p2", "Discharge pressure", 2.0),
         ("fl_q", "Inlet volume flow", 0.5), ("fl_n", "Speed", 0.5), ("fl_eta", "Polytropic efficiency", 0.5)]
PIPE_IN = [4, 6, 8, 10, 12, 14, 16, 18, 20, 24, 28, 30, 36, 42, 48]


def mach_limits(m_sp: float) -> tuple[float, float]:
    """Allowed test - specified machine Mach number difference (fit of PTC 10 Fig. 3-2.1-1, centrifugal)."""
    return -min(m_sp, max(0.0, 0.2661 - 0.26 * m_sp)), max(0.0, 0.2845 - 0.2485 * m_sp)


def reynolds_limits(re_sp: float) -> tuple[float, float]:
    """Allowed Re_test / Re_specified (fit of PTC 10 Fig. 3-2.1-3)."""
    if re_sp >= 1e6:
        return 0.1, 100.0
    x = (math.log10(max(re_sp, 9e4)) - math.log10(9e4)) / (6 - math.log10(9e4))
    return 0.1 + 0.4 * (1 - x), 10 ** (1 + x)


def _mu(comp: dict, T: float, st) -> float:
    if all(k in SUTHERLAND for k in comp):
        tot = sum(comp.values())
        num = den = 0.0
        from compsuite.thermo.components import COMPONENTS
        for k, y in comp.items():
            mu0, S = SUTHERLAND[k]
            mu = mu0 * (T / 273.15) ** 1.5 * (273.15 + S) / (T + S)
            w = y / tot * math.sqrt(COMPONENTS[k].mw)
            num, den = num + w * mu, den + w
        return num / den
    return float(st.mu)


def _pipe(q_m3_s: float, v: float = 25.0) -> float:
    d = math.sqrt(4 * q_m3_s / (math.pi * v)) / 0.0254
    return next((p for p in PIPE_IN if p >= d), PIPE_IN[-1]) * 0.0254 * 0.94


def _head_to_p2(gas, T1, P1, head, eta, steps=12):
    f = lambda p2: polytropic_path(gas, T1, P1, p2, eta, steps)["head"] - head  # noqa: E731
    hi = P1 * 2
    while f(hi) < 0 and hi < P1 * 60:
        hi *= 1.8
    p2 = brentq(f, P1 * 1.0001, hi, xtol=P1 * 1e-5)
    return p2, polytropic_path(gas, T1, P1, p2, eta, steps)


def _rv_to_p2(gas, T1, P1, rv, eta, steps=12):
    v1 = 1 / gas.density(T1, P1)

    def f(p2):
        pp = polytropic_path(gas, T1, P1, p2, eta, steps)
        return v1 * gas.density(pp["T2"], p2) - rv
    hi = P1 * 2
    while f(hi) < 0 and hi < P1 * 60:
        hi *= 1.8
    p2 = brentq(f, P1 * 1.0001, hi, xtol=P1 * 1e-5)
    return p2, polytropic_path(gas, T1, P1, p2, eta, steps)


def _dimless(gas, comp, T1, P1, T2, P2, qv, N, D2, b2):
    s1 = gas.state(T1, P1)
    U = math.pi * D2 * N / 60
    mu = _mu(comp, T1, s1)
    return {"U_m_s": U, "mach": U / s1.sound, "reynolds": U * b2 * s1.rho / mu, "phi": qv / (math.pi / 4 * D2**2 * U),
            "rv": gas.density(T2, P2) / s1.rho, "mw": s1.mw, "sound_m_s": s1.sound, "mu_pa_s": mu, "rho1": s1.rho}


# ---------------------------------------------------------------- specified sections
def specified_sections(project, res: dict) -> list[dict]:
    sz = res["sizing"]
    gas = res.get("_gas") or make_gas(project.gas.components, project.gas.backend)
    imp = {}
    for cas, idxs in zip(res["casings"], sz["casings"]):
        for k, i in enumerate(idxs):
            imp[i] = cas["impellers"]["impellers"][k]
    out = []
    m = sz["mass_flow_kg_s"]
    for j, sec in enumerate(sz["sections"]):
        st0 = next(i for i, s in enumerate(sz["stages"]) if s["section"] == j)
        im = imp[st0]
        T1, P1, P2 = sec["T_in"], sec["P_in"], sec["P_out"]
        eta = float(sz["section_efficiency"][j])
        pp = polytropic_path(gas, T1, P1, P2, eta, 30)
        qv = m / gas.density(T1, P1)
        D2, b2 = im["D2_mm"] / 1e3, im["b2_mm"] / 1e3
        d = _dimless(gas, project.gas.components, T1, P1, pp["T2"], P2, qv, sz["speed_rpm"], D2, b2)
        out.append({"section": j + 1, "T1": T1, "P1": P1, "P2": P2, "T2": pp["T2"], "m": m, "qv": qv, "eta": eta, "head": pp["head"],
                    "dh": pp["dh"], "power_kw": m * pp["dh"] / 1e3 * (1 + project.design_basis.mechanical_loss_fraction),
                    "N": sz["speed_rpm"], "D2": D2, "b2": b2, "n_stages": sum(1 for s in sz["stages"] if s["section"] == j),
                    "D1_pipe_m": _pipe(qv), "D2_pipe_m": _pipe(m / gas.density(pp["T2"], P2)), **d})
    return out


def _criticals(res: dict) -> list[float]:
    cs = []
    for b in res["casings"][0]["lateral"].get("bearing_cases") or []:
        for u in b["unbalance"]:
            cs += [c["speed_rpm"] for c in u["criticals"] if c.get("af", 0) >= 2.5]
    out = []
    for c in sorted(cs):
        if all(abs(c - o) > 0.05 * o for o in out):
            out.append(c)
    return out


# ---------------------------------------------------------------- test design
def design_combination(sp: dict, spec_gas, test_gas, comp: dict, T1t: float, P1t: float) -> dict:
    p2, pp = _rv_to_p2(test_gas, T1t, P1t, sp["rv"], sp["eta"])
    ratio = math.sqrt(pp["head"] / sp["head"])
    Nt = sp["N"] * ratio
    qv = sp["qv"] * ratio
    rho1 = test_gas.density(T1t, P1t)
    d = _dimless(test_gas, comp, T1t, P1t, pp["T2"], p2, qv, Nt, sp["D2"], sp["b2"])
    m = qv * rho1
    return {"N_rpm": Nt, "speed_ratio": ratio, "qv_m3_h": qv * 3600, "m_kg_s": m, "P1_bara": P1t / 1e5, "T1_c": k_to_c(T1t),
            "P2_bara": p2 / 1e5, "T2_c": k_to_c(pp["T2"]), "head_kj_kg": pp["head"] / 1e3, "power_kw": m * pp["dh"] / 1e3, **d}


def design_fixed_speed(sp: dict, test_gas, comp: dict, T1t: float, P1t: float, Nt: float) -> dict:
    """User-chosen test speed: head from equal head coefficient, volume ratio follows (checked against +-5 %)."""
    ratio = Nt / sp["N"]
    p2, pp = _head_to_p2(test_gas, T1t, P1t, sp["head"] * ratio**2, sp["eta"])
    qv = sp["qv"] * ratio
    d = _dimless(test_gas, comp, T1t, P1t, pp["T2"], p2, qv, Nt, sp["D2"], sp["b2"])
    m = qv * d["rho1"]
    return {"N_rpm": Nt, "speed_ratio": ratio, "qv_m3_h": qv * 3600, "m_kg_s": m, "P1_bara": P1t / 1e5, "T1_c": k_to_c(T1t),
            "P2_bara": p2 / 1e5, "T2_c": k_to_c(pp["T2"]), "head_kj_kg": pp["head"] / 1e3, "power_kw": m * pp["dh"] / 1e3, **d}


def _limits(project, res, opts):
    db = project.design_basis
    return {"t": float(opts.get("max_test_temperature_c", 200.0)),
            "p": float(opts.get("max_test_pressure_bara") or max(c.discharge_pressure_bara for c in project.cases)),
            "w": float(opts.get("test_driver_kw") or res["sizing"]["driver_rating_kw"]),
            "margin": float(opts.get("critical_margin_pct", 10.0)) / 100,
            "fr": (db.min_operating_speed_pct / 100, db.max_continuous_speed_pct / 100)}


def qualify(sp: dict, c: dict, lim: dict, crit: list[float]) -> dict:
    mlo, mhi = mach_limits(sp["mach"])
    rlo, rhi = reynolds_limits(sp["reynolds"])
    dm, rr = c["mach"] - sp["mach"], c["reynolds"] / sp["reynolds"]
    fr, margin = lim["fr"], lim["margin"]
    n_lo, n_hi = c["N_rpm"] * fr[0], c["N_rpm"] * fr[1]
    near = [x for x in crit if n_lo * (1 - margin) < x < n_hi * (1 + margin)]
    pw = c["power_kw"] * fr[1] ** 3
    chk = [
        ("Specific volume ratio rv,t / rv,sp", c["rv"] / sp["rv"], "0.95 - 1.05", 0.95 <= c["rv"] / sp["rv"] <= 1.05),
        ("Flow coefficient phi,t / phi,sp", c["phi"] / sp["phi"], "0.96 - 1.04", 0.96 <= c["phi"] / sp["phi"] <= 1.04),
        ("Machine Mach Mm,t - Mm,sp", dm, f"{mlo:.3f} - +{mhi:.3f}", mlo <= dm <= mhi),
        ("Machine Reynolds Rem,t / Rem,sp", rr, f"{rlo:.2f} - {rhi:.0f}", rlo <= rr <= rhi),
        ("Discharge temperature C", c["T2_c"], f"<= {lim['t']:.0f}", c["T2_c"] <= lim["t"]),
        ("Discharge pressure bara", c["P2_bara"], f"<= {lim['p']:.1f}", c["P2_bara"] <= lim["p"]),
        ("Test power kW (at MCS)", pw, f"<= {lim['w']:.0f}", pw <= lim["w"]),
        ("Test speed range clear of criticals", f"{n_lo:.0f}-{n_hi:.0f}", f"+-{margin * 100:.0f} % of {', '.join(f'{x:.0f}' for x in crit) or 'none'}", not near),
    ]
    checks = [{"check": a, "value": v, "limit": l, "pass": bool(ok)} for a, v, l, ok in chk]
    fails = [x["check"] for x in checks if not x["pass"]]
    return {"qualified": not fails, "reason": "; ".join(fails) or "All PTC 10 / stand criteria met", "checks": checks}


def screen(project, res: dict, sp: dict, opts: dict, crit: list[float]) -> list[dict]:
    """All Type 2 combinations (test gas x suction pressure) for one section, with the qualification checks."""
    spec_gas = res["_gas"]
    t1 = c_to_k(float(opts.get("test_suction_temperature_c", 35.0)))
    pressures = opts.get("test_suction_pressures_bara") or [1.2, 3.0, 5.0, 8.0, 12.0]
    gases = list(opts.get("test_gases") or TEST_GASES) + (["Custom"] if opts.get("custom_gas") else [])
    lim = _limits(project, res, opts)
    rows = []
    for g in gases:
        comp = opts.get("custom_gas") if g == "Custom" else TEST_GASES.get(g)
        if not comp:
            continue
        tg = make_gas(comp, "pr")
        for p in pressures:
            P1 = bar_to_pa(float(p))
            try:
                dew = tg.dew_points(P1, 150.0, t1 + 60, 40)
            except Exception as exc:  # noqa: BLE001
                logging.getLogger(__name__).warning("fallback at ptc10.py:232: %s", exc)
                dew = []
            tdew = max(dew) if dew else None
            if tdew is not None and tdew > t1 - 5:
                rows.append({"gas": g, "P1_bara": p, "qualified": False, "reason": f"Two-phase at suction (dew point {k_to_c(tdew):.0f} C)", "checks": []})
                continue
            try:
                c = design_combination(sp, spec_gas, tg, comp, t1, P1)
            except (ValueError, RuntimeError) as exc:
                rows.append({"gas": g, "P1_bara": p, "qualified": False, "reason": f"No solution ({exc})", "checks": []})
                continue
            rows.append({"gas": g, "P1_bara": p, "dew_c": k_to_c(tdew) if tdew else None, **c, **qualify(sp, c, lim, crit)})
    return rows


def type1_check(project, res: dict, sp: dict, t1: dict) -> dict:
    """Type 1: actual gas at (near) specified conditions, PTC 10 Table 3-1 deviations."""
    gas = res["_gas"]
    P1, T1 = bar_to_pa(float(t1.get("P1_bara") or sp["P1"] / 1e5)), c_to_k(float(t1.get("T1_c") if t1.get("T1_c") is not None else k_to_c(sp["T1"])))
    N = float(t1.get("N_rpm") or sp["N"])
    mw = float(t1.get("mw") or sp["mw"])
    rho = gas.density(T1, P1)
    qv = sp["qv"] * N / sp["N"]
    vals = {"Inlet pressure": P1 / sp["P1"], "Inlet temperature": T1 / sp["T1"], "Speed": N / sp["N"], "Molecular weight": mw / sp["mw"],
            "Capacity (inlet volume flow)": qv / sp["qv"]}
    checks = [{"check": k, "value": (v - 1) * 100, "limit": f"+-{TYPE1_LIMITS[k]:.0f} %", "pass": abs(v - 1) * 100 <= TYPE1_LIMITS[k]} for k, v in vals.items()]
    dens = rho / (sp["m"] / sp["qv"]) * (N / sp["N"]) ** 2
    checks.append({"check": "Density x speed^2 (power similarity)", "value": (dens - 1) * 100, "limit": "+-8 %", "pass": abs(dens - 1) <= 0.08})
    p2, pp = _head_to_p2(gas, T1, P1, sp["head"] * (N / sp["N"]) ** 2, sp["eta"])
    return {"gas": "Specified gas", "type": 1, "N_rpm": N, "P1_bara": P1 / 1e5, "T1_c": k_to_c(T1), "P2_bara": p2 / 1e5, "T2_c": k_to_c(pp["T2"]),
            "qv_m3_h": qv * 3600, "m_kg_s": qv * rho, "head_kj_kg": pp["head"] / 1e3, "power_kw": qv * rho * pp["dh"] / 1e3, "speed_ratio": N / sp["N"],
            "checks": checks, "qualified": all(c["pass"] for c in checks),
            **_dimless(gas, project.gas.components, T1, P1, pp["T2"], p2, qv, N, sp["D2"], sp["b2"])}


# ---------------------------------------------------------------- orifice and data reduction
def orifice_mass_flow(d: float, D: float, dp: float, p1: float, rho: float, mu: float, kappa: float, detail: bool = False):
    """ISO 5167-2 orifice, corner taps, Reader-Harris/Gallagher C, expansibility eps."""
    beta = d / D
    eps = 1 - (0.351 + 0.256 * beta**4 + 0.93 * beta**8) * (1 - ((p1 - dp) / p1) ** (1 / kappa))
    E = 1 / math.sqrt(1 - beta**4)
    m, C = 0.0, 0.6
    for _ in range(6):
        m = C * E * eps * math.pi / 4 * d * d * math.sqrt(2 * dp * rho)
        Re = 4 * m / (math.pi * D * mu)
        A = (19000 * beta / Re) ** 0.8
        C = 0.5961 + 0.0261 * beta**2 - 0.216 * beta**8 + 0.000521 * (1e6 * beta / Re) ** 0.7 + (0.0188 + 0.0063 * A) * beta**3.5 * (1e6 / Re) ** 0.3
    if detail:
        return {"m": m, "beta": beta, "C": C, "eps": eps, "E": E, "Re_D": Re, "dp": dp, "p1": p1, "rho": rho}
    return m


def size_orifice(m: float, D: float, rho: float, mu: float, kappa: float, p1: float, dp: float = 25e3) -> float:
    f = lambda d: orifice_mass_flow(d, D, dp, p1, rho, mu, kappa) - m  # noqa: E731
    try:
        return brentq(f, 0.2 * D, 0.75 * D)
    except ValueError:
        return (0.75 if f(0.75 * D) < 0 else 0.2) * D


def _total(gas, T, P, m, D):
    """Static flange reading to total conditions (velocity head)."""
    rho = gas.density(T, P)
    c = m / (rho * math.pi / 4 * D * D)
    h0 = gas.h(T, P) + c * c / 2
    P0 = P + rho * c * c / 2
    T0 = gas.T_from_hP(h0, P0, T + c * c / 2 / 1000)
    return T0, P0, c


def heat_loss_estimate(setup: dict, T01: float, T02: float) -> float:
    """Casing heat loss (W) by natural convection + radiation, h about 9 W/m2K, from an equivalent bare casing."""
    D, L = setup.get("casing_D_m", 1.0), setup.get("casing_L_m", 1.5)
    return 9.0 * math.pi * D * L * max(0.5 * (T01 + T02) - c_to_k(setup.get("t_amb_c", 25.0)), 0.0)


def reduce_point(gas, comp, pt: dict, setup: dict, method: str = "sandberg_colby") -> dict:
    T1, P1 = c_to_k(pt["t1_c"]), bar_to_pa(pt["p1_bara"])
    T2, P2 = c_to_k(pt["t2_c"]), bar_to_pa(pt["p2_bara"])
    N = pt["n_rpm"]
    orf = None
    if pt.get("m_kg_s"):
        m = float(pt["m_kg_s"])
    else:
        Tu, Pu = c_to_k(pt.get("tu_c", pt["t1_c"])), bar_to_pa(pt.get("pu_bara", pt["p1_bara"]))
        su = gas.state(Tu, Pu)
        orf = orifice_mass_flow(setup["orifice_d_m"], setup["orifice_D_m"], pt["dp_kpa"] * 1e3, Pu, su.rho, _mu(comp, Tu, su), float(su.k), detail=True)
        m = orf["m"]
    T01, P01, c1 = _total(gas, T1, P1, m, setup["D1_pipe_m"])
    T02, P02, c2 = _total(gas, T2, P2, m, setup["D2_pipe_m"])
    h1, h2, s1, s2 = gas.h(T01, P01), gas.h(T02, P02), gas.s(T01, P01), gas.s(T02, P02)
    dh = h2 - h1
    if method == "schultz":
        from compsuite.compression.process import schultz
        hp = schultz(gas, T01, P01, T02, P02)["head"]
    elif method == "path":
        from compsuite.compression.process import efficiency_from_discharge
        hp = efficiency_from_discharge(gas, T01, P01, P02, T02) * dh
    else:  # Sandberg-Colby: T ds integrated with a log-mean temperature
        hp = dh - (s2 - s1) * (T02 - T01) / math.log(T02 / T01)
    est = pt.get("heat_loss_kw") in (None, "")
    q_loss = heat_loss_estimate(setup, T01, T02) if est else float(pt["heat_loss_kw"]) * 1e3
    w = dh + q_loss / m                                       # work input = enthalpy rise + casing heat loss
    # Leakage: balance-piston leakage returns to suction, so the impellers carry m (1 + leak) while the orifice
    # reads the through-flow m; the seal (DGS primary vent) leakage leaves the loop.
    m_bal = m * float(setup.get("balance_leak_pct", 0.0)) / 100
    m_seal = float(setup.get("seal_leak_kg_s", 0.0))
    m_imp = m + m_bal
    rho1 = gas.density(T01, P01)
    qv = m_imp / rho1
    d = _dimless(gas, comp, T01, P01, T02, P02, qv, N, setup["D2"], setup["b2"])
    mech = float(setup.get("mech_loss_kw", 0.0)) * (N / setup["N_ref"]) ** 2.5
    return {"m_kg_s": m, "m_imp_kg_s": m_imp, "m_balance_kg_s": m_bal, "m_seal_kg_s": m_seal, "qv_m3_h": qv * 3600, "qv_flange_m3_h": m / rho1 * 3600,
            "T01_c": k_to_c(T01), "P01_bara": P01 / 1e5, "T02_c": k_to_c(T02), "P02_bara": P02 / 1e5,
            "c1_m_s": c1, "c2_m_s": c2, "h1": h1, "h2": h2, "s1": s1, "s2": s2, "head_kj_kg": hp / 1e3, "work_kj_kg": w / 1e3,
            "eta_p": hp / w, "gas_power_kw": m_imp * w / 1e3, "shaft_power_kw": m_imp * w / 1e3 + mech, "mech_loss_kw": mech,
            "heat_loss_kw": q_loss / 1e3, "heat_loss_estimated": est, "orifice": orf,
            "psi": hp / d["U_m_s"] ** 2, "pressure_ratio": P02 / P01, "n_rpm": N, **d}


def reynolds_correction(re_t: float, re_sp: float, b2_m: float, rough_in: float = 125e-6) -> float:
    """PTC 10 machine Reynolds number correction: (1 - eta_sp) / (1 - eta_t) = (RA_sp / RA_t) (RB_sp / RB_t), with
    RA = 0.066 + 0.934 (4.8e6 b / Re)^C, C = 0.988 / Re^0.243, RB = log(0.000125 + 13.67 / Re) / log(eps + 13.67 / Re)
    (b in ft, roughness eps in inches)."""
    b = b2_m / 0.3048

    def RA(re):
        return 0.066 + 0.934 * (4.8e6 * b / re) ** (0.988 / re**0.243)

    def RB(re):
        return math.log10(0.000125 + 13.67 / re) / math.log10(rough_in + 13.67 / re)
    return (RA(re_sp) / RA(re_t)) * (RB(re_sp) / RB(re_t))


def convert_point(red: dict, sp: dict, spec_gas, N_target: float, re_correction: bool = False, mech_kw: float = 0.0, leak_frac: float = 0.0) -> dict:
    r = N_target / red["n_rpm"]
    eta = red["eta_p"]
    f_re = 1.0
    if re_correction:
        f_re = reynolds_correction(red["reynolds"], sp["reynolds"] * N_target / sp["N"], sp["b2"])
        eta = 1 - (1 - eta) * f_re
    qv = red["qv_m3_h"] / 3600 * r
    hp = red["head_kj_kg"] * 1e3 * r * r
    m = qv * sp["rho1"]                       # impeller flow at specified conditions
    p2, pp = _head_to_p2(spec_gas, sp["T1"], sp["P1"], hp, eta)
    return {"qv_m3_h": qv * 3600 / (1 + leak_frac), "qv_imp_m3_h": qv * 3600, "m_kg_s": m / (1 + leak_frac), "head_kj_kg": hp / 1e3, "eta_p": eta,
            "eta_test": red["eta_p"], "re_factor": f_re, "P2_bara": p2 / 1e5, "T2_c": k_to_c(pp["T2"]),
            "pressure_ratio": p2 / sp["P1"], "gas_power_kw": m * pp["dh"] / 1e3, "rv": spec_gas.density(pp["T2"], p2) / sp["rho1"], "mech_loss_kw": mech_kw * (N_target / sp["N"]) ** 2.5,
            "shaft_power_kw": m * pp["dh"] / 1e3 + mech_kw * (N_target / sp["N"]) ** 2.5, "n_rpm": N_target}


UNC = {"p1_bara": ("rel", 0.001), "p2_bara": ("rel", 0.001), "t1_c": ("pt100", 0), "t2_c": ("pt100", 0), "dp_kpa": ("rel", 0.001), "n_rpm": ("rel", 0.001)}


def uncertainty(gas, comp, pt, setup, method, base, sp, spec_gas, N_target):
    """PTC 19.1 style: RSS of the result change for each 95 % instrument uncertainty (uncorrelated)."""
    keys = ("qv_m3_h", "head_kj_kg", "eta_p", "shaft_power_kw")
    acc = dict.fromkeys(keys, 0.0)
    for k, (kind, v) in UNC.items():
        if k not in pt or (k == "dp_kpa" and pt.get("m_kg_s")):
            continue
        q = dict(pt)
        q[k] = pt[k] * (1 + v) if kind == "rel" else pt[k] + 0.15 + 0.002 * abs(pt[k])
        r = reduce_point(gas, comp, q, setup, method)
        for kk in keys:
            acc[kk] += ((r[kk] - base[kk]) / base[kk]) ** 2
    acc["qv_m3_h"] += 0.005**2  # discharge coefficient
    acc["head_kj_kg"] += 0.0038**2 if method == "sandberg_colby" else 0.005**2  # method uncertainty
    acc["eta_p"] += 0.0038**2 if method == "sandberg_colby" else 0.005**2
    return {k: 100 * math.sqrt(v) for k, v in acc.items()}


# ---------------------------------------------------------------- simulated test log (example data)
def simulate_log(design: dict, sp: dict, spec_line_points: list, setup: dict, test_gas, comp, frac: float, opts: dict, seed: int) -> list[dict]:
    """Five readings per speed line from the predicted curve mapped to test conditions, with a small machine
    deviation and instrument scatter. Example data - replace with the measured log."""
    rng = np.random.default_rng(seed)
    hb, eb = 1 + float(opts.get("sim_head_bias_pct", 1.5)) / 100, float(opts.get("sim_eta_bias_pts", 0.5)) / 100
    r = design["speed_ratio"]
    T1, P1 = c_to_k(design["T1_c"]), bar_to_pa(design["P1_bara"])
    rho1 = test_gas.density(T1, P1)
    st = test_gas.state(T1, P1)
    idx = np.linspace(0, len(spec_line_points) - 1, 5).round().astype(int)
    out = []
    for k, i in enumerate(idx[::-1]):     # overload -> surge, as run in the shop
        p = spec_line_points[i]
        surge = k == len(idx) - 1
        qv = p["q_sp_m3_s"] * r * (1 - float(opts.get("sim_surge_margin_pct", 3.0)) / 100 if surge else 1)
        m = qv * rho1
        eta = min(p["eta_p"] + eb, 0.95)
        hp = p["head_kj_kg"] * 1e3 * r * r * hb
        p2, pp = _head_to_p2(test_gas, T1, P1, hp, eta)
        T2 = pp["T2"]
        # flange readings are static: remove the velocity head from the total states
        c1 = m / (rho1 * math.pi / 4 * setup["D1_pipe_m"] ** 2)
        rho2 = test_gas.density(T2, p2)
        c2 = m / (rho2 * math.pi / 4 * setup["D2_pipe_m"] ** 2)
        cp1 = float(st.cp)
        dp = 0.0
        pu = P1 * 1.002
        f = lambda x: orifice_mass_flow(setup["orifice_d_m"], setup["orifice_D_m"], x, pu, rho1, _mu(comp, T1, st), float(st.k)) - m  # noqa: E731
        try:
            dp = brentq(f, 1.0, 0.5 * pu)
        except ValueError:
            dp = 25e3
        n = lambda s: 1 + rng.normal(0, s)  # noqa: E731
        out.append({"point": f"P{k + 1}", "n_rpm": round(design["N_rpm"] * frac * n(0.0003), 0),
                    "p1_bara": round((P1 - rho1 * c1 * c1 / 2) / 1e5 * n(0.0005), 4), "t1_c": round(k_to_c(T1 - c1 * c1 / 2 / cp1) + rng.normal(0, 0.05), 2),
                    "p2_bara": round((p2 - rho2 * c2 * c2 / 2) / 1e5 * n(0.0005), 4), "t2_c": round(k_to_c(T2 - c2 * c2 / 2 / cp1) + rng.normal(0, 0.08), 2),
                    "dp_kpa": round(dp / 1e3 * n(0.001), 3), "pu_bara": round(pu / 1e5, 4), "tu_c": round(k_to_c(T1) + 0.1, 2),
                    "heat_loss_kw": None, "surge": surge,
                    **{k: round(abs(rng.normal(0.35, 0.12)) * lim_ / 2 * (1.6 if surge else 1), 3) for k, _, lim_ in FLUCT}})
    return out


def _coastdown(res: dict, design: dict, opts: dict) -> dict:
    """Coast-down from the test speed with the loop vented to about 2 barg: aero torque ~ w^2 plus constant
    bearing / seal drag (single-train inertia referred to the compressor shaft)."""
    T = res.get("torsional", {})
    st = T.get("train", {}).get("stations", [])
    J = sum(s["inertia"] * s.get("ratio", 1.0) ** 2 for s in st) or res["casings"][0]["mass_properties"].get("ip_kgm2", 1.0)
    w0 = design["N_rpm"] * math.pi / 30
    p_mech = float(res["sizing"]["shaft_power_kw"] - res["sizing"]["gas_power_kw"]) * 1e3 * (design["speed_ratio"] ** 2.5)
    p_aero = 0.04 * design["power_kw"] * 1e3 * (3.0 / max(design["P1_bara"], 1.0))
    t, w, dt, tr = 0.0, w0, 0.05, []
    while w > 0.02 * w0 and t < 3600:
        tq = p_mech * 0.4 / w0 + p_aero / w0 * (w / w0) ** 2 + p_mech * 0.6 / w0 * (w / w0)
        w -= tq / J * dt
        t += dt
        if not tr or t - tr[-1][0] >= 2:
            tr.append((round(t, 1), round(w * 30 / math.pi)))
    meas = opts.get("coastdown_measured_s")
    return {"inertia_kgm2": J, "predicted_s": t, "trace": tr, "measured_s": meas,
            "rundown_tank_s": opts.get("rundown_tank_s"),
            "status": "review" if meas is None else ("pass" if not opts.get("rundown_tank_s") or float(meas) <= float(opts["rundown_tank_s"]) else "fail")}


# ---------------------------------------------------------------- analysis
def ptc10_analysis(project, res: dict, options: dict | None = None, logs: dict | None = None) -> dict:
    o = options or {}
    spec_gas = res["_gas"]
    db = project.design_basis
    secs = specified_sections(project, res)
    crit = _criticals(res)
    test_type = int(o.get("test_type", 2))
    method = o.get("method", "sandberg_colby")
    adj = float(o.get("speed_adjust_pct", 0.0)) / 100
    fracs = o.get("speed_fracs") or sorted({db.min_operating_speed_pct / 100, 0.9, 1.0, db.max_continuous_speed_pct / 100})
    from compsuite.aero.performance import stack
    sections = []
    for sp in secs:
        combos = screen(project, res, sp, o, crit) if test_type == 2 else []
        if test_type == 2:
            want = (o.get("selection") or {}).get(str(sp["section"])) or {}
            sel = next((c for c in combos if c["gas"] == want.get("gas") and float(c["P1_bara"]) == float(want.get("P1_bara", -1))), None) \
                or next((c for c in combos if c["qualified"] and c["gas"] == "CO2"), None) or next((c for c in combos if c["qualified"]), None) \
                or next((c for c in combos if "N_rpm" in c), None)
            comp = (o.get("custom_gas") if sel and sel["gas"] == "Custom" else TEST_GASES.get(sel["gas"] if sel else "CO2")) or TEST_GASES["CO2"]
            if sel and (want.get("N_rpm") or want.get("T1_c") is not None):   # user-set speed / suction temperature
                c = design_fixed_speed(sp, make_gas(comp, "pr"), comp, c_to_k(float(want.get("T1_c", sel["T1_c"]))), bar_to_pa(sel["P1_bara"]),
                                       float(want.get("N_rpm") or sel["N_rpm"]))
                sel = {**sel, **c, **qualify(sp, c, _limits(project, res, o), crit), "user_set": True}
        else:
            sel = type1_check(project, res, sp, o.get("type1") or {})
            comp = project.gas.components
        if sel is None or "N_rpm" not in sel:
            sections.append({"spec": sp, "combinations": combos, "selected": None})
            continue
        test_gas = make_gas(comp, "pr") if test_type == 2 else spec_gas
        T1t, P1t = c_to_k(sel["T1_c"]), bar_to_pa(sel["P1_bara"])
        st1 = test_gas.state(T1t, P1t)
        D = sp["D1_pipe_m"]
        setup = {"D1_pipe_m": D, "D2_pipe_m": sp["D2_pipe_m"], "orifice_D_m": D, "D2": sp["D2"], "b2": sp["b2"], "N_ref": sel["N_rpm"],
                 "mech_loss_kw": sp["power_kw"] - sp["m"] * sp["dh"] / 1e3, "balance_leak_pct": float(o.get("balance_leak_pct", 0.0)),
                 "seal_leak_kg_s": float(o.get("seal_leak_kg_s", 0.002)), "casing_D_m": float(o.get("casing_od_m") or 2.4 * sp["D2"]),
                 "casing_L_m": float(o.get("casing_length_m") or (0.55 * sp["n_stages"] + 1.0) * sp["D2"] * 2), "t_amb_c": float(o.get("ambient_c", 25.0))}
        setup["orifice_d_m"] = size_orifice(sel["m_kg_s"], D, st1.rho, _mu(comp, T1t, st1), float(st1.k), P1t)
        setup["beta"] = setup["orifice_d_m"] / D
        # Predicted (specified) speed lines and their test-condition equivalents.
        lines = []
        for fr in fracs:
            pts = []
            m_d = sp["m"]
            for x in np.linspace(0.62, 1.32, 12):
                try:
                    r_ = stack(spec_gas, dict(res["sizing"], stages=[s for s in res["sizing"]["stages"] if s["section"] == sp["section"] - 1]),
                               db, m_d * x * fr, sp["T1"], sp["P1"], fr)
                except Exception as exc:  # noqa: BLE001
                    logging.getLogger(__name__).warning("fallback at ptc10.py:519: %s", exc)
                    continue
                if r_.get("valid"):
                    pts.append({"q_sp_m3_s": m_d * x * fr / sp["rho1"], "qv_m3_h": m_d * x * fr / sp["rho1"] * 3600, "head_kj_kg": r_["head"] / 1e3,
                                "eta_p": r_["eta"], "power_kw": r_["power_kw"] * (1 + db.mechanical_loss_fraction), "P2_bara": r_["P2"] / 1e5})
            if len(pts) >= 3:
                lines.append({"speed_frac": fr, "N_sp_rpm": sp["N"] * fr, "N_test_rpm": sel["N_rpm"] * fr, "predicted": pts,
                              "predicted_test": [{"qv_m3_h": p["qv_m3_h"] * sel["speed_ratio"], "head_kj_kg": p["head_kj_kg"] * sel["speed_ratio"] ** 2,
                                                  "eta_p": p["eta_p"]} for p in pts]})
        # Test log: entered readings or the simulated example.
        key = str(sp["section"])
        recorr = bool(o.get("reynolds_correction", True))
        sp_psi = sp["head"] / sp["U_m_s"] ** 2
        sim = not (logs or {}).get(key)
        log = (logs or {}).get(key) or {}
        for i, ln in enumerate(lines):
            readings = log.get(f"{ln['speed_frac']:.3f}") if not sim else simulate_log(sel, sp, ln["predicted"], setup, test_gas, comp, ln["speed_frac"], o, 7 + i)
            ln["readings"] = readings or []
            rows = []
            for pt in ln["readings"]:
                try:
                    red = reduce_point(test_gas, comp, pt, setup, method)
                    N_t = sp["N"] * ln["speed_frac"] * (pt["n_rpm"] / ln["N_test_rpm"])
                    lk = setup["balance_leak_pct"] / 100
                    conv = convert_point(red, sp, spec_gas, N_t, recorr, setup["mech_loss_kw"], lk)
                    conv_a = convert_point(red, sp, spec_gas, N_t * (1 + adj), recorr, setup["mech_loss_kw"], lk) if adj else None
                    unc = uncertainty(test_gas, comp, pt, setup, method, red, sp, spec_gas, N_t)
                    # each point against its equivalent specified point: same phi, volume ratio of the converted point, Mach and
                    # Reynolds of the specified machine at the equivalent speed
                    fe_ = N_t / sp["N"]
                    sim_chk = {"rv": red["rv"] / conv["rv"], "phi": red["phi"] / sp["phi"], "mach": red["mach"] - sp["mach"] * fe_,
                               "re": red["reynolds"] / (sp["reynolds"] * fe_), "psi": red["psi"] / sp_psi}
                    mlo, mhi = mach_limits(sp["mach"] * fe_)
                    rlo, rhi = reynolds_limits(sp["reynolds"] * fe_)
                    sim_ok = {"rv": 0.95 <= sim_chk["rv"] <= 1.05, "mach": mlo <= sim_chk["mach"] <= mhi, "re": rlo <= sim_chk["re"] <= rhi}
                    stab = [{"key": k, "item": lab, "value": pt.get(k), "limit": lim_, "pass": pt.get(k) is None or float(pt[k]) <= lim_} for k, lab, lim_ in FLUCT]
                    rows.append({"point": pt.get("point"), "surge": bool(pt.get("surge")), "test": red, "converted": conv, "adjusted": conv_a,
                                 "uncertainty_pct": unc, "similarity": sim_chk, "similarity_ok": sim_ok, "stability": stab,
                                 "stable": all(x["pass"] for x in stab), "measured_stability": any(x["value"] is not None for x in stab)})
                except (ValueError, ZeroDivisionError, KeyError, RuntimeError) as exc:
                    rows.append({"point": pt.get("point"), "error": str(exc)})
            ln["results"] = rows
        acc = acceptance(sp, lines, adj, o)
        basis = "adjusted" if adj else "converted"
        surge_line, dev = [], []
        for ln in lines:
            rs = sorted([r[basis] for r in ln["results"] if r.get(basis)], key=lambda r: r["qv_m3_h"])
            if not rs:
                continue
            surge_line.append({"speed_frac": ln["speed_frac"], "qv_m3_h": rs[0]["qv_m3_h"], "head_kj_kg": rs[0]["head_kj_kg"], "P2_bara": rs[0]["P2_bara"]})
            pr = sorted(ln["predicted"], key=lambda p: p["qv_m3_h"])
            qg = sp["qv"] * 3600 * ln["speed_frac"]
            if len(rs) >= 2 and rs[0]["qv_m3_h"] <= qg <= rs[-1]["qv_m3_h"]:
                q_ = [r["qv_m3_h"] for r in rs]
                qp = [p["qv_m3_h"] for p in pr]
                row_ = {"speed_frac": ln["speed_frac"], "qv_m3_h": qg}
                for k_, pk_, sc in (("head_kj_kg", "head_kj_kg", 1), ("eta_p", "eta_p", 100), ("shaft_power_kw", "power_kw", 1), ("P2_bara", "P2_bara", 1)):
                    t_ = float(np.interp(qg, q_, [r[k_] for r in rs])) * sc
                    p_ = float(np.interp(qg, qp, [p[pk_] for p in pr])) * sc
                    row_[k_] = {"test": t_, "predicted": p_, "deviation_pct": (t_ / p_ - 1) * 100 if p_ else None}
                dev.append(row_)
        def _props(g, cmp_, T, P):
            st = g.state(T, P)
            return {"mw": float(st.mw), "k": float(st.k), "z": P * float(st.mw) / (float(st.rho) * 8314.462 * T), "cp": float(st.cp), "rho": float(st.rho),
                    "sound": float(st.sound), "mu": _mu(cmp_, T, st), "T_c": k_to_c(T), "P_bara": P / 1e5}
        props = {"specified": _props(res["_gas"], project.gas.components, sp["T1"], sp["P1"]), "test": _props(test_gas, comp, T1t, P1t)}
        sections.append({"spec": sp, "combinations": combos, "selected": sel, "test_gas": comp, "setup": setup, "lines": lines,
                         "simulated": sim, "acceptance": acc, "coastdown": _coastdown(res, sel, o), "surge_line": surge_line, "deviation": dev,
                         "gas_properties": props, "reynolds_correction": recorr, "basis": basis,
                         "seal_gas": {"primary": "Test gas (" + ("/".join(comp) if test_type == 2 else "process gas") + ")",
                                      "secondary": "N2", "buffer": "N2", "separation": "N2 / instrument air"},
                         "valves": [{"tag": "A", "name": "Loop balance valve A", "s1": "open", "s2": "closed"},
                                    {"tag": "B", "name": "Loop balance valve B", "s1": "closed", "s2": "open"},
                                    {"tag": "C", "name": "Seal balance valve C", "s1": "closed", "s2": "open"}] if len(secs) > 1 else []})
    stat = [a["status"] for s in sections for a in (s.get("acceptance") or {}).get("checks", [])]
    s0 = next((x for x in sections if x.get("selected")), None)
    scope = (f"Type 2 test on {'/'.join((s0 or {}).get('test_gas') or ['substitute gas'])}: the specified gas cannot be run safely or economically on the "
             "shop loop at the specified pressure, temperature and power, so the test reproduces the specified flow coefficient, volume ratio, Mach and "
             "Reynolds numbers on a substitute gas and converts the results by similarity (PTC 10 Table 3-2.1-2)."
             if test_type == 2 else "Type 1 test on the specified gas near the specified conditions (PTC 10 Table 3-1 limits); results are corrected for the "
             "small deviations from the specified inlet conditions and speed.")
    return {"test_type": test_type, "method": method, "speed_adjust_pct": adj * 100, "speed_fracs": fracs, "criticals_rpm": crit, "scope": scope,
            "property_method": {"pr": "Peng-Robinson equation of state", "coolprop": "CoolProp (reference multiparameter equations of state)"}.get(project.gas.backend, project.gas.backend),
            "specified_gas": project.gas.components, "reynolds_correction": bool(o.get("reynolds_correction", True)),
            "sections": sections, "instruments": INSTRUMENTS, "stability": STABILITY, "type1_limits": TYPE1_LIMITS,
            "status": "fail" if "fail" in stat else ("pass" if stat and all(s == "pass" for s in stat) else "review"),
            "procedure": PROCEDURE(test_type, len(secs))}


def acceptance(sp: dict, lines: list, adj: float, o: dict) -> dict:
    """API 617 variable-speed acceptance at the rated (100 %) line: head 0 % negative, power <= 104 %, surge not higher."""
    ln = min(lines, key=lambda l: abs(l["speed_frac"] - 1.0)) if lines else None
    if not ln or not ln.get("results"):
        return {"checks": [], "line": None}
    key = "adjusted" if adj else "converted"
    rs = sorted([r[key] for r in ln["results"] if key in r and r[key]], key=lambda r: r["qv_m3_h"])
    if len(rs) < 2:
        return {"checks": [], "line": ln["speed_frac"]}
    q = [r["qv_m3_h"] for r in rs]
    qg = sp["qv"] * 3600
    h = float(np.interp(qg, q, [r["head_kj_kg"] for r in rs]))
    pw = float(np.interp(qg, q, [r["shaft_power_kw"] for r in rs]))
    eta = float(np.interp(qg, q, [r["eta_p"] for r in rs]))
    pred = ln["predicted"]
    surge_pred = min(p["qv_m3_h"] for p in pred)
    surge_test = min(q)
    tol_p = float(o.get("power_tolerance_pct", 4.0))
    checks = [
        {"check": "Head at guarantee flow (0 % negative tolerance)", "guarantee": sp["head"] / 1e3, "test": h, "deviation_pct": (h / (sp["head"] / 1e3) - 1) * 100,
         "status": "pass" if h >= sp["head"] / 1e3 * 0.9999 else "fail"},
        {"check": f"Shaft power at guarantee flow (<= {100 + tol_p:.0f} %)", "guarantee": sp["power_kw"], "test": pw, "deviation_pct": (pw / sp["power_kw"] - 1) * 100,
         "status": "pass" if pw <= sp["power_kw"] * (1 + tol_p / 100) else "fail"},
        {"check": "Surge flow not above predicted (0 % positive tolerance)", "guarantee": surge_pred, "test": surge_test, "deviation_pct": (surge_test / surge_pred - 1) * 100,
         "status": "pass" if surge_test <= surge_pred * 1.0001 else "fail"},
        {"check": "Polytropic efficiency at guarantee flow (information)", "guarantee": sp["eta"] * 100, "test": eta * 100, "deviation_pct": (eta - sp["eta"]) * 100,
         "status": "pass" if eta >= sp["eta"] - 0.02 else "review"},
    ]
    return {"checks": checks, "line": ln["speed_frac"], "basis": key, "guarantee_qv_m3_h": qg}


def PROCEDURE(test_type: int, n_sec: int) -> list[str]:  # noqa: N802
    s = [
        "Purge the closed loop with the test gas (two purges at about 50 kPa) until purity is above 98 %; leak-check all flanges at standstill."
        if test_type == 2 else "Fill the loop with gas of the specified composition; take a sample for analysis before the test.",
        "Start with all control valves open and raise the speed slowly to the test speed; run 30 min until mechanically stable.",
        "Hold suction pressure with the automatic gas-charging device and suction temperature with the cooler water flow.",
        "At each equivalent speed take at least 5 points: overload, two between, the guarantee flow and the point nearest surge.",
        "Record each point after heat balance; accept it when the efficiency varies less than 0.5 % over at least 5 min.",
        "Approach surge very slowly while watching vibration; if surge starts open the anti-surge valve at once.",
        "Sample the gas before the test, near the guarantee point and before the end.",
        "After the last point open the outlet control valve, vent slowly to about 200 kPa(g), trip the unit and record the coast-down time.",
    ]
    if n_sec > 1:
        s.insert(4, "Section 1: loop balance valve A open, B closed, seal balance valve C closed. Section 2: A closed, B open, C open; "
                    "keep the two discharge temperatures within 10 K by adjusting the other section's inlet temperature.")
    return s


# ---------------------------------------------------------------- PDF report
LEGEND_KEYS = ["p1", "t1", "p2", "t2", "dp", "pu", "tu", "N1", "power", "qloss", "gas", "valve", "asv", "cooler", "SG_DE", "SG_NDE", "SG_P", "SEP", "T_oil", "P_oil"]
INSTR_KEYS = ["t1", "p1", "dp", "pu", "N1", "dp", "gas"]


def ptc10_report(project, out: dict, train_components: list | None = None, images: dict | None = None) -> bytes:
    """A4 PDF: cover with the 2.5D loop picture and result summary, scope and gases, set-up and instruments,
    procedure, per section the test design and screening, similarity per point, data / stability / corrections /
    results per speed, a worked data reduction, curves (converted and as tested) with the surge line,
    deviations, API 617 acceptance and conclusions, orifice, coast-down and method, legend and sign-off."""
    import io

    from matplotlib.backends.backend_pdf import PdfPages

    from compsuite.testing.drawings import Doc, loop
    from compsuite.testing.mrt import cover_info, doc_info, style
    from compsuite.testing.tags import GLOSSARY, tag_names, tag_table

    f = lambda v, n=2: "-" if v is None or v == "" else (f"{v:.{n}f}" if isinstance(v, (int, float, np.floating)) else str(v))  # noqa: E731
    tt = out["test_type"]
    T = tag_names(project.test_tags)
    pal = ["#0b5cad", "#2e9e6b", "#d1782a", "#7b3fb5", "#c0392b"]
    info = doc_info(project, "Performance test report")
    comps = train_components or [{"kind": "motor", "name": "Shop motor"}, {"kind": "coupling", "name": "LS coupling"},
                                 {"kind": "gearbox", "name": "Shop gearbox"}, {"kind": "coupling", "name": "HS coupling"}, {"kind": "casing", "name": "Compressor"}]
    s0 = next((s for s in out["sections"] if s.get("selected")), None)
    gas_name = "/".join(s0["test_gas"]) if s0 and tt == 2 else "GAS"
    draw = lambda ax: loop(ax, comps, gas_name, len(out["sections"]), (s0 or {}).get("seal_gas"))  # noqa: E731
    summ = []
    for s in out["sections"]:
        for c in (s.get("acceptance") or {}).get("checks", []):
            summ.append((f"S{s['spec']['section']} {c['check'].split(' (')[0]}", f"{c['deviation_pct']:+.2f} %", c["status"]))
        sel = s.get("selected") or {}
        summ.append((f"S{s['spec']['section']} similarity / test limits", f"{sum(c['pass'] for c in sel.get('checks', []))}/{len(sel.get('checks', []))}",
                     "pass" if sel.get("qualified") else "fail"))
        pts = [r for ln in s.get("lines", []) for r in ln["results"] if "test" in r]
        if pts:
            summ.append((f"S{s['spec']['section']} point stability", f"{sum(r['stable'] for r in pts)}/{len(pts)}", "pass" if all(r["stable"] for r in pts) else "fail"))
    buf = io.BytesIO()
    with PdfPages(buf) as pdf:
        d = Doc(pdf, f"Shop performance test - ASME PTC 10-2022 Type {tt}", info)
        sel0 = (s0 or {}).get("selected") or {}
        d.cover("Performance test report", cover_info(project, info, [
            ("Test type", f"PTC 10 Type {tt}"), ("Test gas", gas_name if tt == 2 else "specified gas"),
            ("Test speed", f"{f(sel0.get('N_rpm'), 0)} rpm"), ("Overall status", out["status"].upper())]),
            (images or {}).get("loop"), draw, summ)

        d.page("1  Scope and test basis")
        d.line(out["scope"], 8.5)
        d.y -= 0.008
        d.table(["Item", "Value"], [("Test code", f"ASME PTC 10-2022, Type {tt}; acceptance to API 617 9th ed. 8.3.5 / 8.3.6"),
                                    ("Head and efficiency method", out["method"].replace("_", "-").title()), ("Gas property method", out["property_method"]),
                                    ("Reynolds-number correction", "applied (PTC 10 RA / RB)" if out["reynolds_correction"] else "not applied (per contract)"),
                                    ("Speed adjustment", f"{out['speed_adjust_pct']:+.1f} % (API 617 8.3.5.5)" if out["speed_adjust_pct"] else "none"),
                                    ("Data", "simulated example readings" if any(s.get("simulated") for s in out["sections"]) else "measured test log")], [0.07, 0.36])
        d.heading("Gas composition (mol %)")
        tg = (s0 or {}).get("test_gas") or {}
        keys = sorted(set(out["specified_gas"]) | set(tg), key=lambda k: -max(out["specified_gas"].get(k, 0), tg.get(k, 0)))
        d.table(["Component", "Specified gas", "Test gas"], [(k, f(out["specified_gas"].get(k), 3), f(tg.get(k), 3) if tt == 2 else f(out["specified_gas"].get(k), 3)) for k in keys],
                [0.07, 0.36, 0.6], 7)
        if s0:
            gp = s0["gas_properties"]
            d.heading("Gas properties at the inlet (section 1)")
            d.table(["Property", "Unit", "Specified", "Test"], [
                ("Inlet pressure / temperature", "bara / C", f"{gp['specified']['P_bara']:.2f} / {gp['specified']['T_c']:.1f}", f"{gp['test']['P_bara']:.2f} / {gp['test']['T_c']:.1f}"),
                ("Molecular weight", "kg/kmol", f(gp["specified"]["mw"]), f(gp["test"]["mw"])), ("Compressibility Z", "-", f(gp["specified"]["z"], 4), f(gp["test"]["z"], 4)),
                ("Isentropic exponent k", "-", f(gp["specified"]["k"], 4), f(gp["test"]["k"], 4)), ("cp", "kJ/kg K", f(gp["specified"]["cp"] / 1e3, 4), f(gp["test"]["cp"] / 1e3, 4)),
                ("Density", "kg/m3", f(gp["specified"]["rho"], 3), f(gp["test"]["rho"], 3)), ("Speed of sound", "m/s", f(gp["specified"]["sound"], 1), f(gp["test"]["sound"], 1)),
                ("Dynamic viscosity", "uPa s", f(gp["specified"]["mu"] * 1e6, 3), f(gp["test"]["mu"] * 1e6, 3))], [0.07, 0.42, 0.58, 0.76])

        d.page("2  Test set-up and instrumentation")
        if not d.image((images or {}).get("loop"), [0.04, 0.6, 0.92, 0.3]):
            draw(d.drawing([0.04, 0.6, 0.92, 0.3]))
        d.y = 0.585
        cal = (project.test_doc or {}).get("calibration") or {}
        d.table(["Tag", "Instrument", "Parameter", "Accuracy", "Qty", "Calibration"],
                [(T.get(k, k) if k != "dp" or i != 5 else "dP-BAL", r[0][:34], r[1][:22], r[2][:20], r[3][:24], cal.get(k, "enter")) for i, (k, r) in enumerate(zip(INSTR_KEYS, out["instruments"]))],
                [0.07, 0.16, 0.44, 0.6, 0.73, 0.88], 6.5, 40)
        d.heading("Stability criteria per test point (max - min over the reading period)")
        d.table(["Item", "Allowable fluctuation"], out["stability"], [0.07, 0.6])
        d.heading("Valve line-up" if any(s.get("valves") for s in out["sections"]) else "Seal gas")
        for s in out["sections"][:1]:
            if s.get("valves"):
                d.table(["Valve", "Section 1", "Section 2"], [(v["name"], v["s1"], v["s2"]) for v in s["valves"]], [0.07, 0.5, 0.7])
            sg = s.get("seal_gas") or {}
            d.line(f"Dry gas seals: primary {sg.get('primary', '-')}, secondary {sg.get('secondary', '-')}, buffer {sg.get('buffer', '-')}, separation {sg.get('separation', '-')}.", 8)

        d.page("3  Test procedure")
        for i, t in enumerate(out["procedure"]):
            d.line(f"{i + 1}. {t}", 8)

        for s in out["sections"]:
            sp, sel = s["spec"], s.get("selected")
            if not sel:
                d.page(f"Section {sp['section']} - no feasible test")
                d.line("No feasible test combination: see the screening on the Test design tab.", 8, "#c0392b")
                continue
            S = f"S{sp['section']}"
            d.page(f"4  {S} test design and gas screening")
            d.table(["Item", "Unit", "Specified", "Test"], [
                ("Medium", "-", "process gas", "/".join(f"{k} {v:g}%" for k, v in s["test_gas"].items()) if tt == 2 else "process gas"),
                ("Molecular weight", "kg/kmol", f(sp["mw"]), f(sel["mw"])),
                ("Inlet volume flow", "m3/h", f(sp["qv"] * 3600, 0), f(sel["qv_m3_h"], 0)),
                ("Mass flow", "kg/s", f(sp["m"]), f(sel["m_kg_s"])),
                ("Inlet pressure / temperature", "bara / C", f"{sp['P1'] / 1e5:.2f} / {k_to_c(sp['T1']):.1f}", f"{sel['P1_bara']:.2f} / {sel['T1_c']:.1f}"),
                ("Discharge pressure / temperature", "bara / C", f"{sp['P2'] / 1e5:.2f} / {k_to_c(sp['T2']):.1f}", f"{sel['P2_bara']:.2f} / {sel['T2_c']:.1f}"),
                ("Polytropic head", "kJ/kg", f(sp["head"] / 1e3), f(sel["head_kj_kg"])),
                ("Polytropic efficiency", "%", f(sp["eta"] * 100), f(sp["eta"] * 100)),
                ("Shaft power", "kW", f(sp["power_kw"], 0), f(sel["power_kw"], 0)),
                ("Speed", "rpm", f(sp["N"], 0), f(sel["N_rpm"], 0)),
                ("Machine Mach number", "-", f(sp["mach"], 4), f(sel["mach"], 4)),
                ("Machine Reynolds number", "-", f"{sp['reynolds']:.3g}", f"{sel['reynolds']:.3g}"),
                ("Flow coefficient", "-", f(sp["phi"], 4), f(sel["phi"], 4)),
                ("Specific volume ratio", "-", f(sp["rv"], 4), f(sel["rv"], 4)),
                ("1st impeller D2 / b2", "mm", f"{sp['D2'] * 1e3:.0f} / {sp['b2'] * 1e3:.1f}", "same"),
                ("Orifice d / D (beta)", "mm", "-", f"{s['setup']['orifice_d_m'] * 1e3:.1f} / {s['setup']['orifice_D_m'] * 1e3:.0f} ({s['setup']['beta']:.3f})")],
                [0.07, 0.42, 0.58, 0.76], 7)
            if sel.get("checks"):
                d.heading("Permissible deviations (PTC 10 Table 3-2.1-2 / 3-1) and stand limits")
                d.table(["Item", "Limit", "Value", "Assessment"],
                        [(c["check"], c["limit"], f(c["value"], 3), "Qualified" if c["pass"] else "Not qualified") for c in sel["checks"]], [0.07, 0.48, 0.66, 0.8], 7)
            if s["combinations"]:
                d.heading("Test-gas screening (all combinations)")
                d.table(["Gas", "P1 bara", "N rpm", "T2 C", "Power kW", "Result"],
                        [(c["gas"], f(c["P1_bara"], 1), f(c.get("N_rpm"), 0), f(c.get("T2_c"), 0), f(c.get("power_kw"), 0),
                          "Qualified" if c["qualified"] else c["reason"][:46]) for c in s["combinations"]], [0.07, 0.24, 0.34, 0.44, 0.53, 0.64], 6.8)

            d.page(f"5  {S} similarity per test point")
            mlo, mhi = mach_limits(sp["mach"])
            rlo, rhi = reynolds_limits(sp["reynolds"])
            d.line(f"Each point against its equivalent specified point (same flow coefficient, specified machine at the equivalent speed). Limits: "
                   f"rv,t/rv,sp 0.95-1.05; Mm,t - Mm,sp {mlo:+.3f} to {mhi:+.3f} at rated speed; Rem,t/Rem,sp {rlo:.2f}-{rhi:.0f}. phi and psi ratios to the "
                   "guarantee point are information (the points span the speed line).", 7.5, "#5b6878")
            rows_ = []
            for ln in s["lines"]:
                for r in ln["results"]:
                    if "test" not in r:
                        continue
                    sm, ok = r["similarity"], r["similarity_ok"]
                    rows_.append((f"{ln['speed_frac'] * 100:.0f} %", r["point"] + (" surge" if r["surge"] else ""), f(sm["phi"], 3), f(sm["psi"], 3), f(sm["rv"], 4),
                                  f(sm["mach"], 4), f(sm["re"], 3), "pass" if all(ok.values()) else "fail"))
            d.table(["Line", "Point", "phi ratio", "psi ratio", "rv ratio", "Mm diff", "Rem ratio", "Status"], rows_, [0.07, 0.15, 0.27, 0.38, 0.49, 0.6, 0.71, 0.84], 7)

            for ln in s["lines"]:
                ok = [r for r in ln["results"] if "test" in r]
                if not ok:
                    continue
                d.page(f"6  {S} {ln['speed_frac'] * 100:.0f} % speed - data, stability, corrections and results")
                cols = [0.07] + [0.36 + i * 0.12 for i in range(len(ok))]
                rd = ln["readings"]
                d.table(["Reading (tag)", *[r["point"] + (" surge" if r["surge"] else "") for r in ok]], [
                    (f"Speed {T['N1']} rpm", *[f(p["n_rpm"], 0) for p in rd]), (f"Inlet pressure {T['p1']} bara", *[f(p["p1_bara"], 4) for p in rd]),
                    (f"Inlet temperature {T['t1']} C", *[f(p["t1_c"]) for p in rd]), (f"Discharge pressure {T['p2']} bara", *[f(p["p2_bara"], 4) for p in rd]),
                    (f"Discharge temperature {T['t2']} C", *[f(p["t2_c"]) for p in rd]), (f"Orifice dp {T['dp']} kPa", *[f(p.get("dp_kpa"), 3) for p in rd]),
                    (f"FE upstream {T['pu']} / {T['tu']}", *[f"{f(p.get('pu_bara'), 3)}/{f(p.get('tu_c'), 1)}" for p in rd])], cols, 6.8)
                d.table(["Stability (fluctuation %)", *[r["point"] for r in ok]],
                        [(f"{lab} (<= {lim_:g} %)", *[f(next(x["value"] for x in r["stability"] if x["key"] == k), 2) for r in ok]) for k, lab, lim_ in FLUCT] +
                        [("Point accepted", *["pass" if r["stable"] else "fail" for r in ok])], cols, 6.8)
                d.table(["Corrections", *[r["point"] for r in ok]], [
                    ("Casing heat loss kW" + (" (estimated)" if ok[0]["test"]["heat_loss_estimated"] else ""), *[f(r["test"]["heat_loss_kw"], 2) for r in ok]),
                    ("Balance-piston leakage kg/s", *[f(r["test"]["m_balance_kg_s"], 4) for r in ok]), ("Seal (DGS vent) leakage kg/s", *[f(r["test"]["m_seal_kg_s"], 4) for r in ok]),
                    ("Mechanical losses at test speed kW", *[f(r["test"]["mech_loss_kw"], 1) for r in ok]),
                    ("Reynolds factor (1-eta,sp)/(1-eta,t)", *[f(r["converted"]["re_factor"], 4) for r in ok])], cols, 6.8)
                d.table(["Test results", *[r["point"] for r in ok]], [
                    ("Total inlet P bara / T C", *[f"{r['test']['P01_bara']:.4f}/{r['test']['T01_c']:.2f}" for r in ok]),
                    ("Total discharge P bara / T C", *[f"{r['test']['P02_bara']:.3f}/{r['test']['T02_c']:.2f}" for r in ok]),
                    ("Mass flow (orifice) kg/s", *[f(r["test"]["m_kg_s"], 3) for r in ok]), ("Inlet volume flow m3/h", *[f(r["test"]["qv_m3_h"], 1) for r in ok]),
                    ("Polytropic head kJ/kg", *[f(r["test"]["head_kj_kg"]) for r in ok]), ("Polytropic efficiency %", *[f(r["test"]["eta_p"] * 100) for r in ok]),
                    ("Work coefficient psi", *[f(r["test"]["psi"], 4) for r in ok]), ("Shaft power kW", *[f(r["test"]["shaft_power_kw"], 0) for r in ok])], cols, 6.8)
                for key, lab in (("converted", "Converted to specified conditions"), ("adjusted", f"Adjusted speed ({out['speed_adjust_pct']:+.1f} %)")):
                    if not ok[0].get(key):
                        continue
                    d.table([lab, *[r["point"] for r in ok]], [
                        ("Inlet volume flow m3/h", *[f(r[key]["qv_m3_h"], 1) for r in ok]), ("Polytropic head kJ/kg", *[f(r[key]["head_kj_kg"]) for r in ok]),
                        ("Polytropic efficiency %", *[f(r[key]["eta_p"] * 100) for r in ok]), ("Discharge pressure bara", *[f(r[key]["P2_bara"], 3) for r in ok]),
                        ("Discharge temperature C", *[f(r[key]["T2_c"], 1) for r in ok]), ("Shaft power kW", *[f(r[key]["shaft_power_kw"], 0) for r in ok])], cols, 6.8)
                d.table(["Expanded uncertainty U95", *[r["point"] for r in ok]],
                        [(lab, *[f"{r['uncertainty_pct'][k]:.2f} %" for r in ok]) for k, lab in
                         (("qv_m3_h", "Volume flow"), ("head_kj_kg", "Polytropic head"), ("eta_p", "Polytropic efficiency"), ("shaft_power_kw", "Shaft power"))], cols, 6.8)

            # worked example: point nearest the guarantee flow on the rated line
            ln1 = min(s["lines"], key=lambda l: abs(l["speed_frac"] - 1))
            okp = [r for r in ln1["results"] if "test" in r]
            if okp:
                r = min(okp, key=lambda r: abs(r["converted"]["qv_m3_h"] - sp["qv"] * 3600))
                rt, rc, o_ = r["test"], r["converted"], r["test"].get("orifice") or {}
                pt = ln1["readings"][ln1["results"].index(r)]
                d.page(f"7  {S} data reduction - worked example ({ln1['speed_frac'] * 100:.0f} % line, point {r['point']})")
                steps = [
                    ("1 Readings", f"p1 {pt['p1_bara']:.4f} bara, t1 {pt['t1_c']:.2f} C, p2 {pt['p2_bara']:.4f} bara, t2 {pt['t2_c']:.2f} C, N {pt['n_rpm']:.0f} rpm"),
                    ("2 Orifice (ISO 5167-2)", f"beta {o_.get('beta', 0):.4f}, C {o_.get('C', 0):.5f}, eps {o_.get('eps', 0):.5f}, Re_D {o_.get('Re_D', 0):.3g}, "
                                              f"dp {o_.get('dp', 0) / 1e3:.3f} kPa, rho {o_.get('rho', 0):.4f} kg/m3" if o_ else "mass flow entered directly"),
                    ("   m = C E eps (pi/4) d^2 sqrt(2 dp rho)", f"{rt['m_kg_s']:.4f} kg/s (impeller flow {rt['m_imp_kg_s']:.4f} kg/s with balance leakage)"),
                    ("3 Total conditions h0 = h + c^2/2", f"c1 {rt['c1_m_s']:.2f} m/s -> P01 {rt['P01_bara']:.4f} bara, T01 {rt['T01_c']:.3f} C; "
                                                         f"c2 {rt['c2_m_s']:.2f} m/s -> P02 {rt['P02_bara']:.4f} bara, T02 {rt['T02_c']:.3f} C"),
                    ("4 Enthalpy and entropy", f"h1 {rt['h1'] / 1e3:.3f}, h2 {rt['h2'] / 1e3:.3f} kJ/kg; s1 {rt['s1']:.4f}, s2 {rt['s2']:.4f} J/kg K"),
                    ("5 Polytropic head (" + out["method"].replace("_", "-") + ")", f"Hp = {rt['head_kj_kg']:.3f} kJ/kg"),
                    ("6 Work input w = dh + Qloss / m", f"{rt['work_kj_kg']:.3f} kJ/kg (Qloss {rt['heat_loss_kw']:.2f} kW)"),
                    ("7 Polytropic efficiency eta = Hp / w", f"{rt['eta_p'] * 100:.3f} %"),
                    ("8 Similarity", f"phi {rt['phi']:.5f}, psi {rt['psi']:.4f}, Mm {rt['mach']:.4f}, Rem {rt['reynolds']:.3g}, rv {rt['rv']:.4f}"),
                    ("9 Speed ratio Nsp / Nt", f"{rc['n_rpm'] / rt['n_rpm']:.5f}"),
                    ("10 Converted q = qt (Nsp/Nt)", f"{rc['qv_m3_h']:.1f} m3/h"),
                    ("11 Converted Hp = Hpt (Nsp/Nt)^2", f"{rc['head_kj_kg']:.3f} kJ/kg"),
                    ("12 Reynolds correction", f"factor {rc['re_factor']:.4f}: eta {rc['eta_test'] * 100:.3f} % -> {rc['eta_p'] * 100:.3f} %"),
                    ("13 Discharge at specified conditions", f"P2 {rc['P2_bara']:.3f} bara, T2 {rc['T2_c']:.1f} C (polytropic path on the specified gas)"),
                    ("14 Shaft power = m Hp / eta + mech. losses", f"{rc['gas_power_kw']:.0f} + {rc['mech_loss_kw']:.0f} = {rc['shaft_power_kw']:.0f} kW"),
                ]
                d.table(["Step", "Result"], steps, [0.07, 0.4], 7, 90)

            for key, lab in (("converted", "converted to specified conditions"), ("adjusted", "adjusted speed"), ("test", "as tested on the test gas")):
                if key == "adjusted" and not out["speed_adjust_pct"]:
                    continue
                d.page(f"8  {S} performance curves ({lab})")
                qs = (("head_kj_kg", "Polytropic head (kJ/kg)"), ("eta_p", "Polytropic efficiency (%)"), ("shaft_power_kw", "Shaft power (kW)"), ("P2_bara", "Discharge pressure (bara)"))
                for j, (q, yl) in enumerate(qs):
                    if key == "test" and q == "P2_bara":
                        q, yl = "P02_bara", "Discharge total pressure (bara)"
                    ax = d.fig.add_axes([0.1 + (j % 2) * 0.45, 0.52 - (j // 2) * 0.42, 0.37, 0.33])
                    for i, ln in enumerate(s["lines"]):
                        c = pal[i % len(pal)]
                        pr = ln["predicted_test"] if key == "test" else ln["predicted"]
                        pk_ = "power_kw" if q == "shaft_power_kw" else q
                        if all(pk_ in p for p in pr):
                            ax.plot([p["qv_m3_h"] for p in pr], [p[pk_] * (100 if q == "eta_p" else 1) for p in pr], color=c, lw=1, ls="--", alpha=0.8)
                        rr = sorted([r for r in ln["results"] if r.get(key)], key=lambda r: r[key]["qv_m3_h"])
                        if rr:
                            yv = [r[key][q] * (100 if q == "eta_p" else 1) for r in rr]
                            ax.plot([r[key]["qv_m3_h"] for r in rr], yv, "o-", color=c, ms=3, lw=1.2, label=f"{ln['speed_frac'] * 100:.0f} %")
                            uk = {"eta_p": "eta_p", "head_kj_kg": "head_kj_kg"}.get(q, "shaft_power_kw")
                            un = [r["uncertainty_pct"][uk] for r in rr]
                            ax.fill_between([r[key]["qv_m3_h"] for r in rr], [y * (1 - u_ / 100) for y, u_ in zip(yv, un)], [y * (1 + u_ / 100) for y, u_ in zip(yv, un)],
                                            color=c, alpha=0.12, lw=0)
                    if key != "test" and s.get("surge_line") and q in ("head_kj_kg", "P2_bara"):
                        sl = s["surge_line"]
                        ax.plot([x["qv_m3_h"] for x in sl], [x[q] for x in sl], color="#c0392b", lw=1.2, label="surge line")
                    g = s["acceptance"].get("guarantee_qv_m3_h")
                    if g and key != "test":
                        gy = {"head_kj_kg": sp["head"] / 1e3, "eta_p": sp["eta"] * 100, "shaft_power_kw": sp["power_kw"], "P2_bara": sp["P2"] / 1e5}[q]
                        ax.plot([g], [gy], marker="*", color="#c0392b", ms=9, zorder=5, label="guarantee")
                    style(ax, "Inlet volume flow (m3/h)", yl)
                    if j == 0:
                        ax.legend(fontsize=5.5, frameon=False, ncol=2)
                d.fig.text(0.1, 0.06, "Dashed: predicted. Markers: test points" + (" converted by similarity" if key != "test" else " on the test gas") +
                           ". Bands: U95. Red: surge line and guarantee point.", fontsize=7, color="#5b6878")

            d.page(f"9  {S} deviations from prediction and surge line")
            if s.get("deviation"):
                d.table(["Line", "Flow m3/h", "Head test / pred", "dev %", "Eff test / pred", "dev pts", "Power test / pred", "dev %", "P2 dev %"],
                        [(f"{x['speed_frac'] * 100:.0f} %", f(x["qv_m3_h"], 0), f"{x['head_kj_kg']['test']:.1f} / {x['head_kj_kg']['predicted']:.1f}", f(x["head_kj_kg"]["deviation_pct"]),
                          f"{x['eta_p']['test']:.1f} / {x['eta_p']['predicted']:.1f}", f(x["eta_p"]["test"] - x["eta_p"]["predicted"]),
                          f"{x['shaft_power_kw']['test']:.0f} / {x['shaft_power_kw']['predicted']:.0f}", f(x["shaft_power_kw"]["deviation_pct"]), f(x["P2_bara"]["deviation_pct"]))
                         for x in s["deviation"]], [0.07, 0.14, 0.24, 0.39, 0.47, 0.6, 0.68, 0.82, 0.88], 6.6)
                d.line("At each line's guarantee-equivalent flow q,g (N/Nsp), interpolated on the converted test points and on the predicted curve.", 7.5, "#5b6878")
            d.heading("Surge line (lowest stable flow per speed line, converted)")
            d.table(["Line", "Flow m3/h", "Head kJ/kg", "Discharge bara"], [(f"{x['speed_frac'] * 100:.0f} %", f(x["qv_m3_h"], 0), f(x["head_kj_kg"], 1), f(x["P2_bara"], 2))
                                                                         for x in s.get("surge_line", [])], [0.07, 0.25, 0.45, 0.65])

            acc = s["acceptance"]
            d.page(f"10  {S} acceptance (API 617) and conclusions")
            if acc.get("checks"):
                d.summary([(c["check"].split(" (")[0], f"{c['deviation_pct']:+.2f} %", c["status"]) for c in acc["checks"]])
                d.table(["Item", "Guarantee", "Test", "Deviation %", "Status"],
                        [(c["check"], f(c["guarantee"], 1), f(c["test"], 1), f(c["deviation_pct"]), c["status"]) for c in acc["checks"]], [0.07, 0.5, 0.62, 0.74, 0.86], 7)
                d.line(f"Basis: {acc['basis']} results on the {acc['line'] * 100:.0f} % line, interpolated at the guarantee flow {acc['guarantee_qv_m3_h']:.0f} m3/h.", 7.5, "#5b6878")
            d.heading("Conclusions")
            fails = [c["check"] for c in acc.get("checks", []) if c["status"] == "fail"]
            pts = [r for ln in s["lines"] for r in ln["results"] if "test" in r]
            concl = [f"The test was run as PTC 10 Type {tt}" + (f" on {'/'.join(s['test_gas'])} at {sel['P1_bara']:.2f} bara and {sel['N_rpm']:.0f} rpm" if tt == 2 else "") +
                     (", with all similarity and stand limits met." if sel.get("qualified") else ", outside at least one similarity or stand limit: " + sel.get("reason", "")),
                     f"{sum(r['stable'] for r in pts)} of {len(pts)} points met the stability criteria.",
                     "The converted performance meets the API 617 acceptance criteria." if not fails else "Not met: " + "; ".join(fails) + ".",
                     f"Uncertainty (U95) of the efficiency at the guarantee point about {min(r['uncertainty_pct']['eta_p'] for r in pts):.2f} %." if pts else ""]
            if s.get("simulated"):
                concl.append("The readings are the simulated example; enter the measured log before issuing the report.")
            for c in concl:
                if c:
                    d.line("- " + c, 8.5)

            cd = s["coastdown"]
            d.page(f"11  {S} flow element, coast-down and computational method")
            st_ = s["setup"]
            d.table(["Flow element (ISO 5167-2, corner taps)", "Value"], [
                ("Pipe internal diameter D mm", f(st_["orifice_D_m"] * 1e3, 1)), ("Orifice bore d mm", f(st_["orifice_d_m"] * 1e3, 2)),
                ("Diameter ratio beta", f(st_["beta"], 4)), ("Discharge coefficient", "Reader-Harris/Gallagher, iterated on Re"),
                ("Expansibility", "eps = 1 - (0.351 + 0.256 b^4 + 0.93 b^8)(1 - (p2/p1)^(1/k))"),
                ("Inlet / discharge flange ID mm", f"{st_['D1_pipe_m'] * 1e3:.0f} / {st_['D2_pipe_m'] * 1e3:.0f}"),
                ("Balance-piston leakage", f"{st_['balance_leak_pct']:.2f} % of through-flow (returns to suction)"),
                ("Casing for heat loss D x L m", f"{st_['casing_D_m']:.2f} x {st_['casing_L_m']:.2f}, ambient {st_['t_amb_c']:.0f} C")], [0.07, 0.5], 7)
            d.line("Coast-down", 10, "#0b5cad", True)
            d.line(f"Predicted coast-down time from {sel['N_rpm']:.0f} rpm (loop vented to about 2 barg): {cd['predicted_s']:.0f} s; "
                   f"train inertia referred to the compressor {cd['inertia_kgm2']:.2f} kg m2; measured {f(cd['measured_s'], 0)} s - {cd['status']}", 8)
            ax = d.fig.add_axes([0.1, d.y - 0.2, 0.84, 0.18])
            ax.plot([t for t, _ in cd["trace"]], [n for _, n in cd["trace"]], color="#0b5cad", lw=1.3)
            style(ax, "Time (s)", f"{T['N1']} (rpm)")
            d.y -= 0.24
            d.line("Computational method", 10, "#0b5cad", True)
            for t in ("Total conditions from the static flange readings and the pipe velocity head (h0 = h + c^2/2).",
                      "Sandberg-Colby: Hp = (h2 - h1) - (s2 - s1)(T2 - T1)/ln(T2/T1); Schultz and path integration selectable.",
                      "Work input = enthalpy rise + casing heat loss / mass flow (heat loss measured or estimated, h about 9 W/m2K); efficiency = Hp / work.",
                      "Leakage: impeller flow = orifice flow + balance-piston leakage; power uses the impeller flow; DGS vent leakage reported.",
                      "Conversion: q,co = q,te (N,sp/N,te); Hp,co = Hp,te (N,sp/N,te)^2; P,co = m,co Hp,co / eta,co + mech. losses (N ratio)^2.5.",
                      "Reynolds correction (PTC 10): (1 - eta,sp)/(1 - eta,t) = (RA,sp/RA,t)(RB,sp/RB,t), RA = 0.066 + 0.934 (4.8e6 b / Re)^C, C = 0.988 / Re^0.243, "
                      "RB = log(0.000125 + 13.67/Re) / log(eps + 13.67/Re)" + ("" if out["reynolds_correction"] else " - not applied in this report") + ".",
                      "Uncertainty: RSS of the result sensitivities to the instrument uncertainties (PTC 19.1, 95 %), plus orifice C and method terms."):
                d.line("- " + t, 7.8)

        d.legend(tag_table(project.test_tags), LEGEND_KEYS, [g for g in GLOSSARY if g[0] in ("PTC 10", "Type 1 / Type 2", "rv", "phi", "psi", "Mm", "Rem", "Hp", "eta p",
                                                                                             "FE", "ASV", "U95", "DGS", "DE / NDE")])
        d.signoff((project.test_doc or {}).get("signoff"))
        d.close()
    return buf.getvalue()
