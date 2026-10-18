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
            except Exception:  # noqa: BLE001
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
def orifice_mass_flow(d: float, D: float, dp: float, p1: float, rho: float, mu: float, kappa: float) -> float:
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


def reduce_point(gas, comp, pt: dict, setup: dict, method: str = "sandberg_colby") -> dict:
    T1, P1 = c_to_k(pt["t1_c"]), bar_to_pa(pt["p1_bara"])
    T2, P2 = c_to_k(pt["t2_c"]), bar_to_pa(pt["p2_bara"])
    N = pt["n_rpm"]
    if pt.get("m_kg_s"):
        m = float(pt["m_kg_s"])
    else:
        Tu, Pu = c_to_k(pt.get("tu_c", pt["t1_c"])), bar_to_pa(pt.get("pu_bara", pt["p1_bara"]))
        su = gas.state(Tu, Pu)
        m = orifice_mass_flow(setup["orifice_d_m"], setup["orifice_D_m"], pt["dp_kpa"] * 1e3, Pu, su.rho, _mu(comp, Tu, su), float(su.k))
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
    q_loss = float(pt.get("heat_loss_kw") or 0.0) * 1e3
    w = dh + q_loss / m                                       # work input = enthalpy rise + casing heat loss
    rho1 = gas.density(T01, P01)
    qv = m / rho1
    d = _dimless(gas, comp, T01, P01, T02, P02, qv, N, setup["D2"], setup["b2"])
    mech = float(setup.get("mech_loss_kw", 0.0)) * (N / setup["N_ref"]) ** 2.5
    return {"m_kg_s": m, "qv_m3_h": qv * 3600, "T01_c": k_to_c(T01), "P01_bara": P01 / 1e5, "T02_c": k_to_c(T02), "P02_bara": P02 / 1e5,
            "c1_m_s": c1, "c2_m_s": c2, "h1": h1, "h2": h2, "s1": s1, "s2": s2, "head_kj_kg": hp / 1e3, "work_kj_kg": w / 1e3,
            "eta_p": hp / w, "gas_power_kw": m * w / 1e3, "shaft_power_kw": m * w / 1e3 + mech, "mech_loss_kw": mech,
            "pressure_ratio": P02 / P01, "n_rpm": N, **d}


def convert_point(red: dict, sp: dict, spec_gas, N_target: float, re_correction: bool = False, mech_kw: float = 0.0) -> dict:
    r = N_target / red["n_rpm"]
    eta = red["eta_p"]
    if re_correction:  # simple Wiesner-type ratio, only if contractually allowed (not for Type 2 here by default)
        eta = 1 - (1 - eta) * (0.3 + 0.7 * (sp["reynolds"] * N_target / sp["N"] / red["reynolds"]) ** -0.2)
    qv = red["qv_m3_h"] / 3600 * r
    hp = red["head_kj_kg"] * 1e3 * r * r
    m = qv * sp["rho1"]
    p2, pp = _head_to_p2(spec_gas, sp["T1"], sp["P1"], hp, eta)
    return {"qv_m3_h": qv * 3600, "m_kg_s": m, "head_kj_kg": hp / 1e3, "eta_p": eta, "P2_bara": p2 / 1e5, "T2_c": k_to_c(pp["T2"]),
            "pressure_ratio": p2 / sp["P1"], "shaft_power_kw": m * pp["dh"] / 1e3 + mech_kw * (N_target / sp["N"]) ** 2.5, "n_rpm": N_target}


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
                    "heat_loss_kw": round(0.35 * frac, 3), "surge": surge})
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
                 "mech_loss_kw": sp["power_kw"] - sp["m"] * sp["dh"] / 1e3}
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
                except Exception:  # noqa: BLE001
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
                    conv = convert_point(red, sp, spec_gas, N_t, bool(o.get("reynolds_correction", False)), setup["mech_loss_kw"])
                    conv_a = convert_point(red, sp, spec_gas, N_t * (1 + adj), bool(o.get("reynolds_correction", False)), setup["mech_loss_kw"]) if adj else None
                    unc = uncertainty(test_gas, comp, pt, setup, method, red, sp, spec_gas, N_t)
                    sim_chk = {"rv": red["rv"] / sp["rv"], "phi": red["phi"] / sp["phi"], "mach": red["mach"] - sp["mach"], "re": red["reynolds"] / sp["reynolds"]}
                    rows.append({"point": pt.get("point"), "surge": bool(pt.get("surge")), "test": red, "converted": conv, "adjusted": conv_a,
                                 "uncertainty_pct": unc, "similarity": sim_chk})
                except (ValueError, ZeroDivisionError, KeyError, RuntimeError) as exc:
                    rows.append({"point": pt.get("point"), "error": str(exc)})
            ln["results"] = rows
        acc = acceptance(sp, lines, adj, o)
        sections.append({"spec": sp, "combinations": combos, "selected": sel, "test_gas": comp, "setup": setup, "lines": lines,
                         "simulated": sim, "acceptance": acc, "coastdown": _coastdown(res, sel, o),
                         "seal_gas": {"primary": "Test gas (" + ("/".join(comp) if test_type == 2 else "process gas") + ")",
                                      "secondary": "N2", "buffer": "N2", "separation": "N2 / instrument air"},
                         "valves": [{"tag": "A", "name": "Loop balance valve A", "s1": "open", "s2": "closed"},
                                    {"tag": "B", "name": "Loop balance valve B", "s1": "closed", "s2": "open"},
                                    {"tag": "C", "name": "Seal balance valve C", "s1": "closed", "s2": "open"}] if len(secs) > 1 else []})
    stat = [a["status"] for s in sections for a in (s.get("acceptance") or {}).get("checks", [])]
    return {"test_type": test_type, "method": method, "speed_adjust_pct": adj * 100, "speed_fracs": fracs, "criticals_rpm": crit,
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
def ptc10_report(project, out: dict, train_components: list | None = None) -> bytes:
    """A4 PDF in the PTC 10 report layout: summary, similarity, test set-up drawing, test design, data and results
    per speed, curves (as tested / converted / adjusted vs predicted), uncertainty, orifice, coast-down and method."""
    import io

    from matplotlib.backends.backend_pdf import PdfPages

    from compsuite.testing.drawings import Doc, loop
    from compsuite.testing.mrt import style

    f = lambda v, n=2: "-" if v is None else (f"{v:.{n}f}" if isinstance(v, (int, float, np.floating)) else str(v))  # noqa: E731
    tt = out["test_type"]
    pal = ["#0b5cad", "#2e9e6b", "#d1782a", "#7b3fb5", "#c0392b"]
    buf = io.BytesIO()
    with PdfPages(buf) as pdf:
        d = Doc(pdf, f"{project.name} - shop performance test, ASME PTC 10-2022 Type {tt}")
        d.page("Performance test - summary")
        d.line(f"Test type {tt} ({'substitute test gas, similarity per Table 3-2.1-2' if tt == 2 else 'specified gas, Table 3-1 limits'}); "
               f"head / efficiency by {out['method'].replace('_', '-')}; overall status {out['status'].upper()}", 9, bold=True)
        for s in out["sections"]:
            sel = s.get("selected")
            if not sel:
                d.line(f"Section {s['spec']['section']}: no feasible test combination.", 8, "#c0392b")
                continue
            acc = s["acceptance"]
            d.line(f"Section {s['spec']['section']} - {'/'.join(s['test_gas']) if tt == 2 else 'specified gas'} at {sel['P1_bara']:.2f} bara, "
                   f"{sel['T1_c']:.1f} C, test speed {sel['N_rpm']:.0f} rpm{' (simulated example readings)' if s.get('simulated') else ''}", 9, bold=True)
            if acc.get("checks"):
                d.table(["Item", "Guarantee", "Test", "Deviation %", "Status"],
                        [(c["check"], f(c["guarantee"], 1), f(c["test"], 1), f(c["deviation_pct"]), c["status"]) for c in acc["checks"]], [0.07, 0.5, 0.62, 0.74, 0.86])
            if sel.get("checks"):
                d.line("Permissible deviation from specified operating parameters (PTC 10 Table 3-2.1-2 / 3-1)", 8.5, bold=True)
                d.table(["Item", "Limit", "Value", "Assessment"],
                        [(c["check"], c["limit"], f(c["value"], 3), "Qualified" if c["pass"] else "Not qualified") for c in sel["checks"]], [0.07, 0.48, 0.66, 0.8])
        s0 = next((s for s in out["sections"] if s.get("selected")), None)
        d.page("Test set-up - closed loop")
        loop(d.drawing([0.04, 0.55, 0.92, 0.37]), train_components or [{"kind": "motor", "name": "Shop motor"}, {"kind": "coupling", "name": "LS coupling"},
                                                                        {"kind": "gearbox", "name": "Shop gearbox"}, {"kind": "coupling", "name": "HS coupling"},
                                                                        {"kind": "casing", "name": "Compressor"}],
             "/".join(s0["test_gas"]) if s0 and tt == 2 else "GAS", len(out["sections"]), (s0 or {}).get("seal_gas"))
        d.y = 0.53
        d.line("Instruments", 10, bold=True)
        d.table(["Instrument", "Parameter", "Accuracy", "Quantity"], out["instruments"], [0.07, 0.42, 0.62, 0.8], 7, 48)
        d.line("Stability criteria per test point", 10, bold=True)
        d.table(["Item", "Allowable fluctuation"], out["stability"], [0.07, 0.6])
        d.line("Procedure", 10, bold=True)
        for i, t in enumerate(out["procedure"]):
            d.line(f"{i + 1}. {t}", 7.5)
        for s in out["sections"]:
            sp, sel = s["spec"], s.get("selected")
            if not sel:
                continue
            d.page(f"Section {sp['section']} - test design")
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
                [0.07, 0.42, 0.58, 0.76])
            if s["combinations"]:
                d.line("Test-gas screening (all combinations)", 10, bold=True)
                d.table(["Gas", "P1 bara", "N rpm", "T2 C", "Power kW", "Result"],
                        [(c["gas"], f(c["P1_bara"], 1), f(c.get("N_rpm"), 0), f(c.get("T2_c"), 0), f(c.get("power_kw"), 0),
                          "Qualified" if c["qualified"] else c["reason"][:46]) for c in s["combinations"]], [0.07, 0.24, 0.34, 0.44, 0.53, 0.64], 7)
            for ln in s["lines"]:
                ok = [r for r in ln["results"] if "test" in r]
                if not ok:
                    continue
                d.page(f"Section {sp['section']} - {ln['speed_frac'] * 100:.0f} % speed: data and results")
                cols = [0.07] + [0.36 + i * 0.12 for i in range(len(ok))]
                rd = ln["readings"]
                d.table(["Reading", *[r["point"] + (" surge" if r["surge"] else "") for r in ok]], [
                    ("Speed rpm", *[f(p["n_rpm"], 0) for p in rd]), ("Inlet pressure bara", *[f(p["p1_bara"], 4) for p in rd]),
                    ("Inlet temperature C", *[f(p["t1_c"]) for p in rd]), ("Discharge pressure bara", *[f(p["p2_bara"], 4) for p in rd]),
                    ("Discharge temperature C", *[f(p["t2_c"]) for p in rd]), ("Orifice dp kPa", *[f(p.get("dp_kpa"), 3) for p in rd]),
                    ("Orifice upstream P bara / T C", *[f"{f(p.get('pu_bara'), 3)}/{f(p.get('tu_c'), 1)}" for p in rd]),
                    ("Casing heat loss kW", *[f(p.get("heat_loss_kw"), 3) for p in rd])], cols, 7)
                d.table(["Test results", *[r["point"] for r in ok]], [
                    ("Total inlet P bara / T C", *[f"{r['test']['P01_bara']:.4f}/{r['test']['T01_c']:.2f}" for r in ok]),
                    ("Total discharge P bara / T C", *[f"{r['test']['P02_bara']:.3f}/{r['test']['T02_c']:.2f}" for r in ok]),
                    ("Mass flow kg/s", *[f(r["test"]["m_kg_s"], 3) for r in ok]), ("Inlet volume flow m3/h", *[f(r["test"]["qv_m3_h"], 1) for r in ok]),
                    ("Enthalpy rise kJ/kg", *[f((r["test"]["h2"] - r["test"]["h1"]) / 1e3) for r in ok]),
                    ("Polytropic head kJ/kg", *[f(r["test"]["head_kj_kg"]) for r in ok]), ("Polytropic efficiency %", *[f(r["test"]["eta_p"] * 100) for r in ok]),
                    ("Flow coefficient ratio", *[f(r["similarity"]["phi"], 3) for r in ok]), ("Volume ratio ratio", *[f(r["similarity"]["rv"], 3) for r in ok]),
                    ("Mach difference", *[f(r["similarity"]["mach"], 3) for r in ok]), ("Reynolds ratio", *[f(r["similarity"]["re"], 3) for r in ok])], cols, 7)
                for key, lab in (("converted", "Converted to specified conditions"), ("adjusted", f"Adjusted speed ({out['speed_adjust_pct']:+.1f} %)")):
                    if not ok[0].get(key):
                        continue
                    d.table([lab, *[r["point"] for r in ok]], [
                        ("Inlet volume flow m3/h", *[f(r[key]["qv_m3_h"], 1) for r in ok]), ("Polytropic head kJ/kg", *[f(r[key]["head_kj_kg"]) for r in ok]),
                        ("Polytropic efficiency %", *[f(r[key]["eta_p"] * 100) for r in ok]), ("Discharge pressure bara", *[f(r[key]["P2_bara"], 3) for r in ok]),
                        ("Discharge temperature C", *[f(r[key]["T2_c"], 1) for r in ok]), ("Shaft power kW", *[f(r[key]["shaft_power_kw"], 0) for r in ok])], cols, 7)
                d.table(["Expanded uncertainty (95 %)", *[r["point"] for r in ok]],
                        [(lab, *[f"{r['uncertainty_pct'][k]:.2f} %" for r in ok]) for k, lab in
                         (("qv_m3_h", "Volume flow"), ("head_kj_kg", "Polytropic head"), ("eta_p", "Polytropic efficiency"), ("shaft_power_kw", "Shaft power"))], cols, 7)
            # curves
            for key, lab in (("converted", "converted to specified conditions"), ("adjusted", "adjusted speed")):
                if key == "adjusted" and not out["speed_adjust_pct"]:
                    continue
                d.page(f"Section {sp['section']} - performance curves ({lab})")
                for j, (q, yl) in enumerate((("head_kj_kg", "Polytropic head (kJ/kg)"), ("eta_p", "Polytropic efficiency (%)"), ("shaft_power_kw", "Shaft power (kW)"))):
                    ax = d.fig.add_axes([0.1, 0.66 - j * 0.29, 0.84, 0.24])
                    for i, ln in enumerate(s["lines"]):
                        c = pal[i % len(pal)]
                        pr = ln["predicted"]
                        ys = [p[q] * (100 if q == "eta_p" else 1) for p in pr] if q != "shaft_power_kw" else [p["power_kw"] for p in pr]
                        ax.plot([p["qv_m3_h"] for p in pr], ys, color=c, lw=1, ls="--", alpha=0.8)
                        rs = sorted([r[key] for r in ln["results"] if r.get(key)], key=lambda r: r["qv_m3_h"])
                        if rs:
                            yv = [r[q] * (100 if q == "eta_p" else 1) for r in rs]
                            ax.plot([r["qv_m3_h"] for r in rs], yv, "o-", color=c, ms=3.5, lw=1.3, label=f"{ln['speed_frac'] * 100:.0f} % ({rs[0]['n_rpm']:.0f} rpm)")
                            un = [r["uncertainty_pct"]["eta_p" if q == "eta_p" else ("head_kj_kg" if q == "head_kj_kg" else "shaft_power_kw")]
                                  for r in sorted([r for r in ln["results"] if r.get(key)], key=lambda r: r[key]["qv_m3_h"])]
                            ax.fill_between([r["qv_m3_h"] for r in rs], [y * (1 - u_ / 100) for y, u_ in zip(yv, un)], [y * (1 + u_ / 100) for y, u_ in zip(yv, un)],
                                            color=c, alpha=0.12, lw=0)
                    g = s["acceptance"].get("guarantee_qv_m3_h")
                    if g:
                        gy = {"head_kj_kg": sp["head"] / 1e3, "eta_p": sp["eta"] * 100, "shaft_power_kw": sp["power_kw"]}[q]
                        ax.plot([g], [gy], marker="*", color="#c0392b", ms=10, zorder=5, label="Guarantee point")
                        if q == "shaft_power_kw":
                            ax.add_patch(__import__("matplotlib.patches", fromlist=["Rectangle"]).Rectangle((g * 0.99, gy), g * 0.02, gy * 0.04, fc="#c0392b", alpha=0.15))
                    style(ax, "Inlet volume flow (m3/h)", yl)
                    if j == 0:
                        ax.legend(fontsize=6, frameon=False, ncol=3)
                d.fig.text(0.1, 0.05, "Dashed: predicted (specified gas). Markers: test converted by similarity. Bands: expanded uncertainty (95 %).",
                           fontsize=7, color="#5b6878")
            cd = s["coastdown"]
            d.page(f"Section {sp['section']} - orifice, gas, coast-down and method")
            st_ = s["setup"]
            d.table(["Flow element (ISO 5167-2, corner taps)", "Value"], [
                ("Pipe internal diameter D mm", f(st_["orifice_D_m"] * 1e3, 1)), ("Orifice bore d mm", f(st_["orifice_d_m"] * 1e3, 2)),
                ("Diameter ratio beta", f(st_["beta"], 4)), ("Discharge coefficient", "Reader-Harris/Gallagher, iterated on Re"),
                ("Expansibility", "eps = 1 - (0.351 + 0.256 b^4 + 0.93 b^8)(1 - (p2/p1)^(1/k))"),
                ("Inlet / discharge flange ID mm", f"{st_['D1_pipe_m'] * 1e3:.0f} / {st_['D2_pipe_m'] * 1e3:.0f}")], [0.07, 0.55])
            d.line("Gas analysis: sample before the test, near the guarantee point and before the end; purity >= 98 % for a pure test gas.", 8)
            d.line(f"Seal gas: primary {s['seal_gas']['primary']}, secondary {s['seal_gas']['secondary']}, buffer {s['seal_gas']['buffer']}.", 8)
            d.line("Coast-down", 10, bold=True)
            d.line(f"Predicted coast-down time from {sel['N_rpm']:.0f} rpm (loop vented to about 2 barg): {cd['predicted_s']:.0f} s; "
                   f"train inertia referred to the compressor {cd['inertia_kgm2']:.2f} kg m2; measured {f(cd['measured_s'], 0)} s - {cd['status']}", 8)
            ax = d.fig.add_axes([0.1, d.y - 0.22, 0.84, 0.2])
            ax.plot([t for t, _ in cd["trace"]], [n for _, n in cd["trace"]], color="#0b5cad", lw=1.3)
            style(ax, "Time (s)", "Speed (rpm)")
            d.y -= 0.26
            d.line("Computational method", 10, bold=True)
            for t in ("Total conditions from the static flange readings and the pipe velocity head (h0 = h + c^2/2).",
                      "Sandberg-Colby: Hp = (h2 - h1) - (s2 - s1)(T2 - T1)/ln(T2/T1); Schultz and path integration selectable.",
                      "Work input = enthalpy rise + casing heat loss / mass flow; efficiency = Hp / work.",
                      "Conversion: eta,co = eta,te; q,co = q,te (N,sp/N,te); Hp,co = Hp,te (N,sp/N,te)^2; P,co = m,co Hp,co / eta,co + mech. losses (N ratio)^2.5.",
                      "Reynolds-number correction " + ("applied" if out.get("reynolds_correction") else "not applied (Type 2, per contract)") + ".",
                      "Uncertainty: RSS of the result sensitivities to the instrument uncertainties (PTC 19.1, 95 %), plus orifice C and method terms."):
                d.line("- " + t, 8)
        d.close()
    return buf.getvalue()
