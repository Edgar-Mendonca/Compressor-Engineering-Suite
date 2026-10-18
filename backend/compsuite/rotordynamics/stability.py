"""Lateral stability per the structure of API 617-2022 6.8.4 (Level I / Level II).

* Level I: anticipated aerodynamic cross-coupling per impeller
  qA = HP Bc C / (Dc Hc Nr) (rho_d / rho_s), Bc = 3, C = 9.55 (HP kW, Dc and
  Hc mm, Nr rpm; qA kN/mm), summed to QA and applied at mid-span. The
  sensitivity sweep of the first forward log decrement against applied
  cross-coupling gives Q0 (zero log dec) and deltaA (log dec at QA).
  Screening: Q0/QA, deltaA and the CSR vs average gas density chart.
* Level II: rotor + bearings (delta_b), then with the eye-seal and balance
  piston labyrinth coefficients at the minimum and maximum seal clearance
  (delta_f).

Labyrinth coefficients: one-control-volume bulk-flow model (Childs &
Scharrer 1986 structure; isothermal, Neumann/Martin leakage with Hodkinson
carry-over, Blasius wall shear), solved per cavity for the circumferential
pressure and swirl perturbations at whirl frequencies 0 and Omega. It is an
estimate for screening: replace with vendor seal coefficients for design.
The Level I region A/B boundary is a digitised approximation of the API
chart and must be checked against the licensed edition.
"""

from __future__ import annotations

import math

import numpy as np
from scipy.optimize import brentq

from compsuite.rotordynamics import fe
from compsuite.seals.seals import hodkinson_carry_over

BC, C_API = 3.0, 9.55
# (average gas density kg/m3, CSR) points of the region A / B boundary (region B above).
SCREENING_BOUNDARY = [(0.0, 3.5), (16.0, 3.5), (60.0, 2.5), (200.0, 2.5)]


def anticipated_qa_kn_mm(power_kw: float, dc_mm: float, hc_mm: float, nr_rpm: float, rho_d: float, rho_s: float,
                         bc: float = BC, c: float = C_API) -> float:
    """API 617-2022 6.8.4.7 anticipated cross-coupling of one impeller (kN/mm)."""
    return power_kw * bc * c / (dc_mm * hc_mm * nr_rpm) * (rho_d / rho_s) * 1e3


def screening_boundary_csr(rho_avg: float) -> float:
    xs, ys = zip(*SCREENING_BOUNDARY)
    return float(np.interp(rho_avg, xs, ys))


def level1_screening(q0_over_qa: float | None, delta_a: float, csr: float, rho_avg: float, logdec_min: float = 0.1) -> dict:
    region = "B" if csr > screening_boundary_csr(rho_avg) else "A"
    r = q0_over_qa if q0_over_qa is not None else math.inf
    reasons = []
    if r < 2.0:
        reasons.append("Q0/QA < 2")
    if delta_a < logdec_min:
        reasons.append(f"deltaA < {logdec_min:g}")
    if 2.0 <= r < 10.0 and region == "B":
        reasons.append("2 <= Q0/QA < 10 in region B")
    return {"region": region, "boundary_csr": screening_boundary_csr(rho_avg), "level2_required": bool(reasons),
            "reasons": reasons}


# ------------------------------------------------------------------ labyrinth seal coefficients
def labyrinth_coefficients(R: float, cr: float, n_teeth: int, pitch: float, height: float, p_in: float, p_out: float,
                           rt: float, mu: float, omega: float, swirl_in: float, whirl: float | None = None,
                           cd: float = 0.71) -> dict:
    """Direct/cross-coupled stiffness K, k (N/m) and damping C, c (N s/m) of a
    see-through labyrinth (teeth on stator). rt = p / rho of the gas (Z R T)."""
    n = n_teeth - 1
    if n < 1 or p_in <= p_out:
        return {"K": 0.0, "k": 0.0, "C": 0.0, "c": 0.0, "leakage_kg_s": 0.0}
    p = np.sqrt(p_in**2 - np.arange(n_teeth + 1) * (p_in**2 - p_out**2) / n_teeth)
    pr = p_out / p_in
    q0 = cd * hodkinson_carry_over(n_teeth, cr, pitch) * cr * p_in / math.sqrt(rt) * math.sqrt((1 - pr**2) / (n_teeth - math.log(pr)))
    rho = p / rt
    A = (height + cr) * pitch
    dh = 2 * (height + cr) * pitch / (height + cr + pitch)
    a_r, a_s = pitch, pitch + 2 * height
    nb, mb = 0.079, -0.25
    U = R * omega

    def tau(rho_i, u):
        return 0.5 * rho_i * u * abs(u) * nb * (max(abs(u), 1e-9) * dh * rho_i / mu) ** mb

    V = np.zeros(n_teeth + 1)
    V[0] = swirl_in * U
    for i in range(1, n_teeth):
        f = lambda v: q0 * (v - V[i - 1]) - tau(rho[i], U - v) * a_r + tau(rho[i], v) * a_s
        V[i] = brentq(f, -abs(U) - abs(V[0]) - 1, abs(U) + abs(V[0]) + 1)

    def forces(W):
        # Unknowns: P_1..P_n, Vp_1..Vp_n; clearance perturbation H = -1 (unit displacement).
        H = -1.0
        M = np.zeros((2 * n, 2 * n), complex)
        b = np.zeros(2 * n, complex)
        gu = q0 * p[:-1] / (p[:-1] ** 2 - p[1:] ** 2)  # tooth j (between cavity j-1 and j), j = 1..N -> index j-1
        gd = q0 * p[1:] / (p[:-1] ** 2 - p[1:] ** 2)
        for i in range(1, n + 1):
            r, ip, iv = i - 1, i - 1, n + i - 1
            s = 1j * (V[i] / R - W)
            # continuity: (A/rt) s P + rho Lc s H + i rho A Vp / R + q'_{i+1} - q'_i = 0
            M[r, ip] += A / rt * s
            M[r, iv] += 1j * rho[i] * A / R
            b[r] -= rho[i] * pitch * s * H
            M[r, ip] += gu[i]  # q'_{i+1} = q0 H/cr + gu P_i - gd P_{i+1}
            if i < n:
                M[r, ip + 1] -= gd[i]
            M[r, ip] += gd[i - 1]  # - q'_i = -(q0 H/cr + gu P_{i-1} - gd P_i)
            if i > 1:
                M[r, ip - 1] -= gu[i - 1]
            # momentum: rho A s Vp + q0 (Vp_i - Vp_{i-1}) + (V_i - V_{i-1}) q'_i + (A/R) i P - dtau = 0
            m = n + i - 1
            ur, us = U - V[i], V[i]
            tr, ts = tau(rho[i], ur), tau(rho[i], us)
            M[m, iv] += rho[i] * A * s + q0 + tr * a_r * (2 + mb) / (ur if abs(ur) > 1e-9 else 1e-9) \
                + ts * a_s * (2 + mb) / (us if abs(us) > 1e-9 else 1e-9)
            if i > 1:
                M[m, iv - 1] -= q0
            dv = V[i] - V[i - 1]
            M[m, ip] += 1j * A / R - dv * gd[i - 1] - (1 + mb) / p[i] * (tr * a_r - ts * a_s)
            if i > 1:
                M[m, ip - 1] += dv * gu[i - 1]
            b[m] -= dv * q0 * H / cr
        x = np.linalg.solve(M, b)
        P = x[:n].sum()
        return -math.pi * R * pitch * P.real, math.pi * R * pitch * P.imag

    W = omega if whirl is None else whirl
    fr0, ft0 = forces(0.0)
    fr1, ft1 = forces(W)
    K, k = -fr0, ft0
    c = (-fr1 - K) / W if W else 0.0
    C = (k - ft1) / W if W else 0.0
    return {"K": float(K), "k": float(k), "C": float(C), "c": float(c), "leakage_kg_s": float(q0 * 2 * math.pi * R),
            "swirl_exit_ratio": float(V[n] / U) if U else 0.0}


def seal_supports(seal_rows: list[dict]) -> list[fe.Support]:
    return [fe.Support(s["label"], s["z_m"], fe.constant_support(kxx=s["K"], kyy=s["K"], kxy=s["k"], kyx=-s["k"],
                                                                 cxx=s["C"], cyy=s["C"], cxy=s["c"], cyx=-s["c"]), "seal")
            for s in seal_rows]


def seal_inventory(stages: list[dict], impellers: list[dict], seals: dict, rotor: dict, sd) -> list[dict]:
    """Eye seals (one per impeller) and the balance piston, with pressures and nominal radial clearance."""
    out = []
    for st, imp, lab, z in zip(stages, impellers, seals["labyrinths"], rotor["impeller_z_m"]):
        p_in, p_out = st["P_in_bara"] * 1e5, st["P_out_bara"] * 1e5
        p_up = p_in + 0.6 * (p_out - p_in)
        out.append({"label": f"Eye seal {lab['stage']}", "kind": "eye", "z_m": z - 0.25 * imp["b2_mm"] / 1e3,
                    "radius_m": lab["eye_diameter_mm"] / 2e3, "clearance_m": lab["eye_clearance_mm"] / 1e3,
                    "teeth": sd.labyrinth_teeth, "p_in": p_up, "p_out": p_in, "rt": p_in / st["rho_in"],
                    "swirl": 0.0 if getattr(sd, "swirl_brakes", False) else getattr(sd, "pre_swirl_ratio", 0.5)})
    bp = seals["balance_piston"]
    zb = next((m["z_m"] for m in rotor["masses"] if m["kind"] == "balance_piston"), None)
    if zb is not None and stages:
        out.append({"label": "Balance piston", "kind": "balance_piston", "z_m": zb, "radius_m": bp["diameter_mm"] / 2e3,
                    "clearance_m": bp["clearance_mm"] / 1e3, "teeth": sd.balance_piston_teeth,
                    "p_in": stages[-1]["P_out_bara"] * 1e5, "p_out": stages[0]["P_in_bara"] * 1e5,
                    "rt": stages[-1]["P_out_bara"] * 1e5 / stages[-1]["rho_out"],
                    "swirl": 0.0 if getattr(sd, "balance_piston_swirl_brake", True) else getattr(sd, "pre_swirl_ratio", 0.5)})
    return out


def seal_coefficient_table(inventory: list[dict], omega: float, extra_clearance_m: float, sd) -> list[dict]:
    mu = getattr(sd, "gas_viscosity_pa_s", 1.3e-5)
    h = getattr(sd, "labyrinth_tooth_height_mm", 3.5) / 1e3
    rows = []
    for s in inventory:
        co = labyrinth_coefficients(s["radius_m"], s["clearance_m"] + extra_clearance_m, s["teeth"], sd.labyrinth_pitch_mm / 1e3,
                                    h, s["p_in"], s["p_out"], s["rt"], mu, omega, s["swirl"])
        rows.append({"label": s["label"], "kind": s["kind"], "z_m": s["z_m"], "radial_clearance_mm": (s["clearance_m"] + extra_clearance_m) * 1e3,
                     "pre_swirl_ratio": s["swirl"], **co})
    return rows


# ------------------------------------------------------------------ log dec evaluation
def first_forward(model, omega, extra=None, structural=None, basis=None) -> dict:
    res = fe.modal(model, omega, 8, extra, structural, basis)
    fw = [m for m in res["modes"] if m["whirl"] == "forward"] or res["modes"]
    m = min(fw, key=lambda m: m["freq_cpm"])
    return {"logdec": m["logdec"], "freq_cpm": m["freq_cpm"]}


def sensitivity(model, omega, z_q, qa, structural, basis, extra=None) -> dict:
    """Log dec of the first forward mode vs cross-coupling at z_q; Q0 by bracketing + bisection."""
    def ld(q):
        ex = list(extra or []) + [fe.Support("Q", z_q, fe.constant_support(kxy=q, kyx=-q), "cross_coupling")]
        return first_forward(model, omega, ex, structural, basis)["logdec"]
    d0, da = ld(0.0), ld(qa)
    lo, hi = 0.0, max(qa, 1e6)
    while ld(hi) > 0 and hi < 1e10:
        lo, hi = hi, hi * 2
    q0 = None
    if ld(hi) <= 0:
        for _ in range(40):
            mid = 0.5 * (lo + hi)
            lo, hi = (mid, hi) if ld(mid) > 0 else (lo, mid)
            if hi - lo < 2e-3 * hi:
                break
        q0 = 0.5 * (lo + hi)
    qmax = max(2 * qa, 1.25 * (q0 or qa))
    sweep = [(float(q), ld(q)) for q in np.linspace(0, qmax, 11)]
    return {"delta_b": d0, "delta_a": da, "q0_n_m": q0, "sweep": sweep}


def stability_analysis(cases: list[dict], rotor: dict, stages: list[dict] | None, impellers: list[dict] | None,
                       seals: dict | None, project, n_rated: float, n_mcs: float, fcsr: float, qa_fallback: float) -> dict:
    """cases: [{key, label, model, structural, basis}] (one per bearing case)."""
    cr, sd = project.criteria, project.seals
    w = n_mcs * math.pi / 30
    rows = []
    if stages and impellers:
        for st, imp in zip(stages, impellers):
            hc = min(imp["b2_mm"], imp.get("diffuser_width_mm") or imp["b2_mm"])
            q = anticipated_qa_kn_mm(st["power_kw"], imp["D2_mm"], hc, n_rated, st["rho_out"], st["rho_in"])
            rows.append({"impeller": st["index"] + 1, "power_kw": st["power_kw"], "dc_mm": imp["D2_mm"], "hc_mm": hc,
                         "rho_s": st["rho_in"], "rho_d": st["rho_out"], "qa_kn_mm": q})
    QA = sum(r["qa_kn_mm"] for r in rows) * 1e6 if rows else qa_fallback
    rho_avg = float(np.mean([0.5 * (r["rho_s"] + r["rho_d"]) for r in rows])) if rows else 0.0
    zb = rotor["bearing_z_m"]
    z_mid = 0.5 * (zb[0] + zb[-1])
    csr = n_mcs / fcsr if fcsr else None
    dep = getattr(cr, "lateral_logdec_level2_min", None)
    inv = seal_inventory(stages, impellers, seals, rotor, sd) if (stages and impellers and seals) else []
    tol = getattr(sd, "labyrinth_clearance_tolerance_mm", 0.1) / 1e3
    tables = {"min": seal_coefficient_table(inv, w, 0.0, sd), "max": seal_coefficient_table(inv, w, tol, sd)} if inv else {}
    level1, level2 = [], []
    for c in cases:
        m, S, B = c["model"], c["structural"], c["basis"]
        s = sensitivity(m, w, z_mid, QA, S, B)
        ratio = s["q0_n_m"] / QA if (s["q0_n_m"] and QA) else None
        scr = level1_screening(ratio, s["delta_a"], csr or 0.0, rho_avg, cr.lateral_logdec_min)
        level1.append({"case": c["key"], "label": c["label"], "q0_kn_mm": (s["q0_n_m"] or math.nan) / 1e6, "qa_kn_mm": QA / 1e6,
                       "q0_over_qa": ratio, "delta_a": s["delta_a"], "delta_b": s["delta_b"],
                       "sweep_kn_mm": [(q / 1e6, d) for q, d in s["sweep"]], **scr})
        fb = first_forward(m, w, None, S, B)
        row = {"case": c["key"], "label": c["label"], "delta_b": fb["logdec"], "freq_b_cpm": fb["freq_cpm"]}
        for key, tab in tables.items():
            sup = seal_supports(tab)
            ff = first_forward(m, w, sup, S, B)
            fq = first_forward(m, w, sup + [fe.Support("QA", z_mid, fe.constant_support(kxy=QA, kyx=-QA), "cross_coupling")], S, B)
            vs = []
            for f in np.linspace(0.7, 1.1, 5):
                ws = f * w
                sp = seal_supports(seal_coefficient_table(inv, ws, 0.0 if key == "min" else tol, sd))
                vs.append({"speed_rpm": ws * 30 / math.pi, **first_forward(m, ws, sp, S, B)})
            row[f"delta_f_{key}_seal"] = ff["logdec"]
            row[f"freq_f_{key}_seal_cpm"] = ff["freq_cpm"]
            row[f"delta_f_qa_{key}_seal"] = fq["logdec"]
            row[f"vs_speed_{key}_seal"] = vs
        df = [row[k] for k in ("delta_f_min_seal", "delta_f_max_seal") if k in row] or [row["delta_b"]]
        row["delta_f"] = min(df)
        row["pass_api"] = row["delta_f"] > cr.lateral_logdec_min
        row["pass_dep"] = None if dep is None else row["delta_f"] > dep
        level2.append(row)
    return {"qa_table": rows, "qa_total_kn_mm": QA / 1e6, "avg_gas_density_kg_m3": rho_avg, "csr": csr, "fcsr_rpm": fcsr,
            "location_z_m": z_mid, "screening_boundary": SCREENING_BOUNDARY, "level1": level1,
            "seal_coefficients": tables, "level2": level2, "logdec_min_api": cr.lateral_logdec_min, "logdec_min_dep": dep,
            "level2_required": any(r["level2_required"] for r in level1),
            "pass": all(r["pass_api"] and r["pass_dep"] is not False for r in level2)}
