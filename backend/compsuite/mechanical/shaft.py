"""Shaft mechanical integrity: torque, bending, axial load, stress
concentrations at shoulders, fatigue (modified Goodman / DE-Goodman with
Marin factors), first-cycle yield under transient torque, gravity sag and
static stiffness.

Bending moments come from statics of the gravity loads and bearing
reactions; the rotating shaft sees gravity bending as fully reversed
alternating stress while torque and thrust are steady (mean) stresses.

Stress-concentration factors use Collins/Shigley power-law fits of
Peterson's stepped-round-bar charts, Kt = A (r/d)^b, interpolated in D/d.
"""

from __future__ import annotations

import math

import numpy as np

from compsuite.core.trace import record

# Peterson stepped shaft fits: D/d -> (A, b)
KT_BEND = [(1.01, 0.91938, -0.17032), (1.02, 0.96048, -0.17711), (1.03, 0.98061, -0.18381), (1.05, 0.98137, -0.19653),
           (1.07, 0.97527, -0.20958), (1.10, 0.95120, -0.23757), (1.20, 0.97098, -0.21796), (1.50, 0.93836, -0.25759),
           (2.00, 0.90879, -0.28598), (3.00, 0.89334, -0.30860), (6.00, 0.87868, -0.33243)]
KT_TORS = [(1.09, 0.90337, -0.12692), (1.20, 0.83425, -0.21649), (1.33, 0.84897, -0.23161), (2.00, 0.86331, -0.23865)]
SURFACE = {"ground": (1.58, -0.085), "machined": (4.51, -0.265), "hot_rolled": (57.7, -0.718), "forged": (272.0, -0.995)}
RELIABILITY = [(0.5, 1.0), (0.9, 0.897), (0.95, 0.868), (0.99, 0.814), (0.999, 0.753), (0.9999, 0.702)]


def kt_shoulder(D: float, d: float, r: float, table) -> float:
    ratio = D / d
    if ratio <= 1.0 + 1e-6:
        return 1.0
    rows = sorted(table)
    ratios = [t[0] for t in rows]
    rr = min(max(ratio, ratios[0]), ratios[-1])
    A = float(np.interp(rr, ratios, [t[1] for t in rows]))
    b = float(np.interp(rr, ratios, [t[2] for t in rows]))
    kt = A * (r / d) ** b
    if ratio < ratios[0]:
        kt = 1 + (kt - 1) * (ratio - 1) / (ratios[0] - 1)
    return max(kt, 1.0)


def notch_sensitivity(sut_mpa: float, r_m: float, torsion: bool = False) -> float:
    S = sut_mpa / 6.894757
    if torsion:
        sqrt_a = 0.190 - 2.51e-3 * S + 1.35e-5 * S**2 - 2.67e-8 * S**3
    else:
        sqrt_a = 0.246 - 3.08e-3 * S + 1.51e-5 * S**2 - 2.67e-8 * S**3
    sqrt_a = max(sqrt_a, 1e-4)
    r_in = r_m / 0.0254
    return 1.0 / (1.0 + sqrt_a / math.sqrt(r_in))


def marin_endurance(mat: dict, d_m: float, finish: str, reliability: float) -> dict:
    a, b = SURFACE[finish]
    ka = min(a * mat["uts_mpa"] ** b, 1.0)
    d_mm = d_m * 1e3
    if d_mm <= 51:
        kb = 1.24 * d_mm ** -0.107
    elif d_mm <= 254:
        kb = 1.51 * d_mm ** -0.157
    else:
        kb = 0.6
    ke = float(np.interp(reliability, [r[0] for r in RELIABILITY], [r[1] for r in RELIABILITY]))
    Se = ka * kb * ke * mat["endurance_mpa"]
    return {"ka": ka, "kb": kb, "ke": ke, "Se_mpa": Se}


def shaft_integrity(model, rotor: dict, mat: dict, project, stage_powers_w: list[float], omega: float,
                    static: dict) -> dict:
    sd, cr = project.shaft, project.criteria
    rec = record("mechanical.shaft", "Beam statics + Peterson Kt + Marin endurance + DE-Goodman", [rotor["sections"], sd],
                 assumptions=["Gravity bending fully reversed (rotating shaft); torque and thrust steady",
                              f"Shoulder fillet r/d = {sd.fillet_radius_ratio}", f"Surface finish '{sd.surface_finish}', "
                              f"reliability {sd.reliability}", f"Transient torque factor {sd.torque_transient_factor} for yield",
                              "Shrink-fit and keyway effects under impellers not included"],
                 references=["Peterson's Stress Concentration Factors (Pilkey)", "Shigley's Mechanical Engineering Design, ch. 6-7"])
    z = model.nodes
    f = model.gravity_load()
    W = -f[2::4]
    brg_z = rotor["bearing_z_m"]
    reactions = model.static_bearing_loads()
    R = list(reactions.values())
    # Bending moment by statics (loads downward, reactions upward).
    M = np.zeros_like(z)
    for i, zi in enumerate(z):
        left = z < zi
        m = -np.sum(W[left] * (zi - z[left]))
        for zb, Rb in zip(brg_z, R):
            if zb < zi:
                m += Rb * (zi - zb)
        M[i] = m
    # Torque: enters at the coupling, each impeller absorbs its stage power.
    imp = [m for m in rotor["masses"] if m["kind"] == "impeller"]
    T_imp = [p / omega for p in stage_powers_w]
    T = np.zeros_like(z)
    for i, zi in enumerate(z):
        T[i] = sum(t for m, t in zip(imp, T_imp) if m["z_m"] > zi) if zi >= rotor["coupling_hub_z_m"] else 0.0
    thrust = abs(rotor["thrust"]["residual_n"]) + rotor["thrust"]["design_swing_n"]
    sections = rotor["sections"]
    Sy, Su = mat["yield_mpa"], mat["uts_mpa"]
    points = []
    # Evaluate at every section boundary (shoulder) and at mid-sections.
    eval_z = sorted({s["z0_m"] for s in sections[1:]} | {0.5 * (s["z0_m"] + s["z1_m"]) for s in sections})
    for ze in eval_z:
        left = [s for s in sections if s["z1_m"] <= ze + 1e-9 and s["z1_m"] >= ze - 1e-9]
        right = [s for s in sections if s["z0_m"] <= ze + 1e-9 and s["z0_m"] >= ze - 1e-9]
        if left and right:
            d = min(left[0]["od_m"], right[0]["od_m"])
            Dl = max(left[0]["od_m"], right[0]["od_m"])
            r = sd.fillet_radius_ratio * d
            ktb = kt_shoulder(Dl, d, r, KT_BEND)
            ktt = kt_shoulder(Dl, d, r, KT_TORS)
            kind = "shoulder" if Dl / d > 1.0 + 1e-6 else "joint"
            di = min(left[0]["id_m"], right[0]["id_m"])
        else:
            s = next(s for s in sections if s["z0_m"] <= ze <= s["z1_m"])
            d, di, r, ktb, ktt, kind = s["od_m"], s["id_m"], None, 1.0, 1.0, "plain"
        Mz = float(np.interp(ze, z, M))
        Tz = float(np.interp(ze, z, T))
        Zb = math.pi * (d**4 - di**4) / (32 * d)
        Zt = 2 * Zb
        A = math.pi / 4 * (d**2 - di**2)
        sb = abs(Mz) / Zb / 1e6
        tau = Tz / Zt / 1e6
        sax = thrust / A / 1e6
        if r:
            kf = 1 + notch_sensitivity(Su, r) * (ktb - 1)
            kfs = 1 + notch_sensitivity(Su, r, True) * (ktt - 1)
        else:
            kf = kfs = 1.0
        en = marin_endurance(mat, d, sd.surface_finish, sd.reliability)
        sa = kf * sb
        sm = math.sqrt((kf * sax) ** 2 + 3 * (kfs * tau) ** 2)
        n_f = 1.0 / (sa / en["Se_mpa"] + sm / Su) if (sa + sm) > 0 else float("inf")
        s_max = math.sqrt((kf * (sb + sax)) ** 2 + 3 * (kfs * tau * sd.torque_transient_factor) ** 2)
        n_y = Sy / s_max if s_max > 0 else float("inf")
        points.append({"z_m": ze, "kind": kind, "d_mm": d * 1e3, "fillet_mm": r * 1e3 if r else None, "kt_bending": ktb,
                       "kt_torsion": ktt, "kf": kf, "kfs": kfs, "moment_nm": Mz, "torque_nm": Tz,
                       "bending_mpa": sb, "torsion_mpa": tau, "axial_mpa": sax, "von_mises_mpa": math.sqrt((sb + sax) ** 2 + 3 * tau**2),
                       "Se_mpa": en["Se_mpa"], "marin": en, "fatigue_safety": n_f, "yield_safety": n_y})
    crit_f = min(points, key=lambda p: p["fatigue_safety"])
    crit_y = min(points, key=lambda p: p["yield_safety"])
    if crit_f["fatigue_safety"] < cr.shaft_fatigue_safety_min:
        rec.warn(f"Fatigue safety factor {crit_f['fatigue_safety']:.2f} at z = {crit_f['z_m']:.3f} m below {cr.shaft_fatigue_safety_min}")
    if crit_y["yield_safety"] < cr.shaft_yield_safety_min:
        rec.warn(f"Yield safety factor {crit_y['yield_safety']:.2f} at z = {crit_y['z_m']:.3f} m below {cr.shaft_yield_safety_min}")
    # Static stiffness at mid-span from the sag (rigid-support equivalent load).
    mid = 0.5 * (brg_z[0] + brg_z[1])
    y = np.asarray(static["y_m"])
    sag_mid = abs(float(np.interp(mid, z, y)))
    ybrg = [float(np.interp(b, z, y)) for b in brg_z]
    rel_sag = abs(float(np.interp(mid, z, y)) - 0.5 * (ybrg[0] + ybrg[1]))
    stiffness = W.sum() / max(rel_sag, 1e-12)
    return {"points": points, "moment_diagram": {"z_m": z.tolist(), "moment_nm": M.tolist(), "torque_nm": T.tolist()},
            "bearing_reactions_n": reactions, "min_fatigue_safety": crit_f["fatigue_safety"], "critical_fatigue_z_m": crit_f["z_m"],
            "min_yield_safety": crit_y["yield_safety"], "critical_yield_z_m": crit_y["z_m"],
            "midspan_sag_um": sag_mid * 1e6, "shaft_relative_sag_um": rel_sag * 1e6,
            "equivalent_static_stiffness_n_m": stiffness, "trace": rec}
