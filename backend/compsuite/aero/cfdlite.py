"""CFD-lite: fast flow solvers for one centrifugal stage (seconds, not hours).

A  Meridional (hub-to-shroud) flow by streamline curvature: quasi-orthogonals across the inlet duct, impeller and
   vaneless diffuser; meridional velocity from dWm/dn = kappa_n Wm, continuity with real-gas density, streamlines
   re-placed at equal mass fractions; swirl from the Euler work, r cu rising smoothly through the impeller.
B  Blade-to-blade loading on hub / mid / shroud streamlines (Stanitz: W_ss - W_ps = (2 pi / Z) d(r cu)/dm),
   diffusion ratio, pressure-side reversal check, inducer throat choke margin and a plan-view relative-velocity field.
C  Vaneless diffuser (1-D with wall friction, Johnston-Dean), flow angle, pressure recovery and loss; rotating
   stall margin from the critical inlet angle (Senoo-type fit) against flow; volute radial force (Stepanoff).
D  Return-channel vane cascade by a lumped-vortex panel method with the periodic (cascade) kernel: loading,
   exit angle and deviation, streamlines.
E  Export of the geometry (TurboGrid-style curves) and boundary conditions for a full CFD run.
Preliminary design tool: inviscid core with simple loss / blockage models; confirm with 3-D CFD.
"""

from __future__ import annotations

import io
import math
import zipfile

import numpy as np

RU = 8314.462618


def _gas(stage: dict, suction: dict) -> dict:
    T, P = stage["T_in_c"] + 273.15, stage["P_in_bara"] * 1e5
    R = RU / suction["mw"]
    return {"R": R, "Z": suction["Z"], "cp": suction["cp"], "k": suction["k"], "T01": T, "p01": P, "rho1": stage["rho_in"],
            "mdot": stage["Q_in_m3_s"] * stage["rho_in"], "eta": stage.get("eta", 0.82)}


def geometry(imp: dict, n_duct=6, n_imp=25, n_dif=12) -> dict:
    """Parametric meridional contour: inlet duct, impeller (quarter-ellipse hub and shroud), parallel-wall vaneless diffuser."""
    r1h, r1s, r2, b2 = imp["hub_mm"] / 2e3, imp["D1_eye_mm"] / 2e3, imp["D2_mm"] / 2e3, imp["b2_mm"] / 1e3
    L = max(imp["axial_length_mm"] * 0.75e-3, 1.4 * b2 + (r1s - r1h))
    Ls = L - b2
    t = np.linspace(0, 1, n_imp)
    hub = np.c_[r1h + (r2 - r1h) * (1 - np.cos(t * np.pi / 2)), L * np.sin(t * np.pi / 2)]
    shr = np.c_[r1s + (r2 - r1s) * (1 - np.cos(t * np.pi / 2)), Ls * np.sin(t * np.pi / 2)]
    zd = np.linspace(-0.5 * L, 0, n_duct + 1)[:-1]
    rd = np.linspace(r2, 1.6 * r2, n_dif + 1)[1:]
    hub = np.r_[np.c_[np.full(n_duct, r1h), zd], hub, np.c_[rd, np.full(n_dif, L)]]
    shr = np.r_[np.c_[np.full(n_duct, r1s), zd], shr, np.c_[rd, np.full(n_dif, Ls)]]
    region = ["inlet"] * n_duct + ["impeller"] * n_imp + ["diffuser"] * n_dif
    return {"hub": hub, "shroud": shr, "region": region, "r2": r2, "b2": b2, "L": L, "i_le": n_duct, "i_te": n_duct + n_imp - 1}


def meridional(imp: dict, gas: dict, ns: int = 9, iters: int = 40) -> dict:
    g = geometry(imp)
    hub, shr, reg = g["hub"], g["shroud"], g["region"]
    nq = len(hub)
    w = imp["rpm"] * math.pi / 30
    U2 = w * g["r2"]
    rcu2 = imp["work_coefficient"] * U2 * g["r2"]
    i0, i1 = g["i_le"], g["i_te"]
    x = np.clip((np.arange(nq) - i0) / max(i1 - i0, 1), 0, 1)
    frac = 3 * x ** 2 - 2 * x ** 3
    rcu = rcu2 * frac                                    # per QO (uniform across the span)
    dh0 = w * rcu                                        # Euler work done up to each QO
    B = np.where(np.array(reg) == "impeller", 0.92, 1.0)  # blade blockage
    cp, k, R, Z = gas["cp"], gas["k"], gas["R"], gas["Z"]
    q = np.tile(np.linspace(0, 1, ns), (nq, 1))
    d = shr - hub

    def wall_k(c):
        dc, ddc = np.gradient(c, axis=0), np.gradient(np.gradient(c, axis=0), axis=0)
        sp_ = np.linalg.norm(dc, axis=1) + 1e-12
        kap_ = (dc[:, 0] * ddc[:, 1] - dc[:, 1] * ddc[:, 0]) / sp_ ** 3
        side_ = np.sign(-dc[:, 1] * d[:, 0] + dc[:, 0] * d[:, 1])
        return np.convolve(kap_ * side_, np.ones(3) / 3, mode="same")
    kw = np.c_[wall_k(hub), wall_k(shr)]
    Lq = np.hypot(d[:, 0], d[:, 1])
    out = {}
    for _ in range(iters):
        P = hub[:, None, :] + q[:, :, None] * d[:, None, :]          # (nq, ns, 2): r, z
        # curvature: interpolated between the hub and shroud wall curvatures (stable form), signed positive when the
        # centre of curvature lies toward the shroud; QO-to-streamline angle from the current streamlines
        dP = np.gradient(P, axis=0)
        sp = np.linalg.norm(dP, axis=2) + 1e-12
        T_ = dP / sp[..., None]
        kn = (1 - q) * kw[:, None, 0] + q * kw[:, None, 1]
        sinq = np.abs(T_[..., 0] * d[:, None, 1] - T_[..., 1] * d[:, None, 0]) / Lq[:, None]
        Wm, rho, Tst, pst = (np.zeros((nq, ns)) for _ in range(4))
        for i in range(nq):
            n = q[i] * Lq[i]
            grow = np.exp(np.concatenate([[0], np.cumsum(0.5 * (kn[i, 1:] + kn[i, :-1]) * np.diff(n))]))
            r = P[i, :, 0]
            cu = rcu[i] / r
            T0 = gas["T01"] + dh0[i] / cp
            p0 = gas["p01"] * (T0 / gas["T01"]) ** (k / (k - 1) * gas["eta"])

            def mass(wh):
                wm = wh * grow
                C2 = wm ** 2 + cu ** 2
                T = np.maximum(T0 - C2 / (2 * cp), 0.3 * T0)
                p = p0 * (T / T0) ** (k / (k - 1))
                ro = p / (Z * R * T)
                f = ro * wm * sinq[i] * 2 * np.pi * r * B[i]
                return np.trapezoid(f, n), wm, ro, T, p

            lo, hi = 1.0, 600.0
            for _ in range(50):                       # subsonic branch: mass rises with Wm below choke
                mid = 0.5 * (lo + hi)
                m_mid = mass(mid)[0]
                m_hi = mass(min(mid * 1.02, hi))[0]
                if m_hi < m_mid:                       # past the mass-flow maximum: choke side
                    hi = mid
                elif m_mid < gas["mdot"]:
                    lo = mid
                else:
                    hi = mid
            _, Wm[i], rho[i], Tst[i], pst[i] = mass(0.5 * (lo + hi))
        # re-place the streamlines at equal mass fractions
        qn = np.zeros_like(q)
        for i in range(nq):
            f = rho[i] * Wm[i] * P[i, :, 0]
            cm_ = np.concatenate([[0], np.cumsum(0.5 * (f[1:] + f[:-1]) * np.diff(q[i]))])
            cm_ /= cm_[-1] or 1
            qn[i] = np.interp(np.linspace(0, 1, ns), cm_, q[i])
        if np.max(np.abs(qn - q)) < 1e-5:
            break
        q = 0.6 * q + 0.4 * qn
    r = P[..., 0]
    U = w * r
    cu = rcu[:, None] / r
    Wu = U - cu
    W = np.hypot(Wm, Wu)
    C = np.hypot(Wm, cu)
    a = np.sqrt(k * Z * R * Tst)
    out = {"r_mm": (r * 1e3), "z_mm": (P[..., 1] * 1e3), "Wm": Wm, "W": W, "C": C, "Mrel": W / a, "Mabs": C / a, "p_bara": pst / 1e5,
           "T_c": Tst - 273.15, "beta_deg": np.degrees(np.arctan2(Wm, Wu)), "alpha_deg": np.degrees(np.arctan2(Wm, cu + 1e-9)), "rcu": np.repeat(rcu[:, None], ns, 1)}
    res = {k_: np.round(v, 4).tolist() for k_, v in out.items()}
    res.update(region=reg, i_le=i0, i_te=i1, hub_mm=(hub * 1e3).round(3).tolist(), shroud_mm=(shr * 1e3).round(3).tolist(), U2=U2, rpm=imp["rpm"])
    res["_raw"] = {**out, "r": r, "z": P[..., 1]}
    return res


def blade_to_blade(imp: dict, mer: dict) -> dict:
    """Blade loading on hub / mid / shroud streamlines, plan-view field on the mid streamline, throat and choke check."""
    raw, Zb = mer["_raw"], imp["blades"]
    i0, i1 = mer["i_le"], mer["i_te"]
    ns = raw["W"].shape[1]
    rows = {}
    for nm, j in (("hub", 0), ("mid", ns // 2), ("shroud", ns - 1)):
        r, z = raw["r"][i0:i1 + 1, j], raw["z"][i0:i1 + 1, j]
        m = np.concatenate([[0], np.cumsum(np.hypot(np.diff(r), np.diff(z)))])
        W = raw["W"][i0:i1 + 1, j]
        dW = 2 * np.pi / Zb * np.gradient(raw["rcu"][i0:i1 + 1, j], m)
        Wss, Wps = W + dW / 2, W - dW / 2
        rows[nm] = {"m_frac": (m / m[-1]).round(4).tolist(), "W": W.round(2).tolist(), "W_ss": Wss.round(2).tolist(), "W_ps": Wps.round(2).tolist(),
                    "diffusion_ratio": float(Wss.max() / W[-1]), "min_ps": float(Wps.min()), "reversal": bool(Wps.min() < 0),
                    "_m": m, "_r": r, "_Wm": raw["Wm"][i0:i1 + 1, j], "_Wu": (raw["W"][i0:i1 + 1, j] ** 2 - raw["Wm"][i0:i1 + 1, j] ** 2) ** 0.5}
    # plan view on the mid streamline: camber from the relative flow direction, pitch 2 pi r / Z, W linear PS -> SS
    md = rows["mid"]
    m, r = md["_m"], md["_r"]
    th = -np.concatenate([[0], np.cumsum(0.5 * ((md["_Wu"] / (r * md["_Wm"]))[1:] + (md["_Wu"] / (r * md["_Wm"]))[:-1]) * np.diff(m))])
    y0 = r * th
    K = 9
    s = 2 * np.pi * r / Zb
    field = {"x_mm": (m * 1e3).round(2).tolist(), "y_ps_mm": (y0 * 1e3).round(2).tolist(), "pitch_mm": (s * 1e3).round(2).tolist(),
             "W": [[round(float(md["W_ps"][i] + (md["W_ss"][i] - md["W_ps"][i]) * kk / (K - 1)), 2) for kk in range(K)] for i in range(len(m))]}
    # inducer throat (shroud): throat ~ pitch * sin(beta_blade) * blade height; choke margin = A_throat / A*
    t = imp["triangles"]["inlet"]
    bb = math.radians(t["tip"]["beta_blade_deg"])
    h1 = (imp["D1_eye_mm"] - imp["hub_mm"]) / 2e3
    rm = t["mean"]["r_mm"] / 1e3
    A_th = Zb * (2 * np.pi * rm / Zb * math.sin(bb) - 0.004) * h1
    M1 = t["mean"]["relative_mach"]
    k = 1.33
    A_ratio = (1 / M1) * ((2 / (k + 1)) * (1 + (k - 1) / 2 * M1 ** 2)) ** ((k + 1) / (2 * (k - 1)))   # A / A* at the inlet relative Mach
    A1 = math.pi * ((imp["D1_eye_mm"] / 2e3) ** 2 - (imp["hub_mm"] / 2e3) ** 2) * math.sin(math.radians(t["mean"]["beta_deg"]))
    choke = A_th / (A1 / A_ratio)
    for v in rows.values():
        for k_ in [k_ for k_ in v if k_.startswith("_")]:
            v.pop(k_)
    return {"streamlines": rows, "plan": field, "blades": Zb, "throat_area_mm2": A_th * 1e6, "choke_margin": choke,
            "max_diffusion_ratio": max(v["diffusion_ratio"] for v in rows.values()), "reversal": any(v["reversal"] for v in rows.values())}


def stator(imp: dict, gas: dict, mer: dict, stage: dict) -> dict:
    """Vaneless diffuser 1-D with wall friction, rotating-stall margin against flow, volute radial force against flow."""
    raw = mer["_raw"]
    i = mer["i_te"]
    r2, b = imp["D2_mm"] / 2e3, imp["b2_mm"] / 1e3
    cp, k, R, Z, md = gas["cp"], gas["k"], gas["R"], gas["Z"], gas["mdot"]
    cu = float(np.mean(raw["rcu"][i])) / r2
    T0 = float(np.mean(raw["T_c"][i])) + 273.15 + float(np.mean(raw["C"][i])) ** 2 / (2 * cp)
    p = float(np.mean(raw["p_bara"][i])) * 1e5
    T = T0 - float(np.mean(raw["C"][i])) ** 2 / (2 * cp)
    p0 = p * (T0 / T) ** (k / (k - 1))
    cf = 0.005
    rs = np.linspace(r2, 1.6 * r2, 40)
    rows, rcu, p2 = [], cu * r2, p
    for j, r in enumerate(rs):
        for _ in range(4):
            rho = p / (Z * R * T)
            cm = md / (2 * np.pi * r * b * rho)
            cuu = rcu / r
            C = math.hypot(cm, cuu)
            T = T0 - C * C / (2 * cp)
            p = p0 * (T / T0) ** (k / (k - 1))
        rows.append({"r_mm": r * 1e3, "alpha_deg": math.degrees(math.atan2(cm, cuu)), "C": C, "p_bara": p / 1e5,
                     "cp_recovery": (p - p2) / max(p0 - p2, 1), "p0_bara": p0 / 1e5})
        if j < len(rs) - 1:
            dr = rs[j + 1] - r
            rcu += -cf * r * C * cuu / (b * cm) * dr
            p0 += -cf * rho * C ** 3 / (cm * b) * dr
    loss = (rows[0]["p0_bara"] - rows[-1]["p0_bara"]) / max(rows[0]["p0_bara"] - rows[0]["p_bara"], 1e-9)
    # rotating stall: diffuser inlet angle against flow vs the critical angle (Senoo-type fit on b2 / r2)
    U2 = mer["U2"]
    b2b = math.radians(90 - imp["backsweep_deg"])
    sig = imp["slip_factor"]
    cm2d = float(np.mean(raw["Wm"][i]))
    a_crit = float(np.clip(4 + 85 * b / r2, 8, 22))
    qf = np.linspace(0.4, 1.3, 19)
    alpha = [math.degrees(math.atan2(cm2d * f, sig * U2 - cm2d * f / math.tan(b2b))) for f in qf]
    stall_q = next((float(f) for f, a in zip(qf, alpha) if a >= a_crit), None)
    dp = (stage["P_out_bara"] - stage["P_in_bara"]) * 1e5
    vol = [{"q_frac": float(f), "radial_force_n": float(0.36 * abs(1 - f * f) * dp * imp["D2_mm"] / 1e3 * b)} for f in qf]
    return {"diffuser": rows, "loss_coefficient": loss, "cp_recovery": rows[-1]["cp_recovery"], "alpha2_deg": rows[0]["alpha_deg"],
            "stall": {"q_frac": qf.tolist(), "alpha_deg": alpha, "alpha_crit_deg": a_crit, "stall_q_frac": stall_q,
                      "margin_pct": (1 - stall_q) * 100 if stall_q else None},
            "volute": vol, "volute_force_design_n": vol[int(np.argmin(np.abs(qf - 1)))]["radial_force_n"]}


def _kernel(dx, dy, s):
    """Velocity induced at (dx, dy) by a row of unit point vortices spaced s in y (counter-clockwise positive)."""
    a, b = 2 * np.pi * dx / s, 2 * np.pi * dy / s
    den = np.cosh(a) - np.cos(b) + 1e-12
    return -np.sin(b) / (2 * s * den), np.sinh(a) / (2 * s * den)


def cascade(alpha_in_deg: float, solidity: float = 1.3, n: int = 30, n_lines: int = 11) -> dict:
    """Return-channel vanes as a 2-D cascade (x through-flow, y pitch-wise; chord = 1): circular-arc camber from the
    inlet flow direction to axial exit, lumped-vortex panels with the cascade kernel, iterated on the vector-mean velocity."""
    g1 = math.radians(90 - alpha_in_deg)               # inflow angle from the through-flow direction
    s = 1 / solidity
    theta = np.linspace(g1, 0.0, n + 1)                # camber-line slope from inlet metal angle to 0
    xs = np.concatenate([[0], np.cumsum(np.cos(0.5 * (theta[1:] + theta[:-1])) / n)])
    ys = np.concatenate([[0], np.cumsum(np.sin(0.5 * (theta[1:] + theta[:-1])) / n)])
    xs, ys = xs / xs[-1], ys / xs[-1]
    xv, yv = xs[:-1] + 0.25 * np.diff(xs), ys[:-1] + 0.25 * np.diff(ys)
    xc, yc = xs[:-1] + 0.75 * np.diff(xs), ys[:-1] + 0.75 * np.diff(ys)
    tx, ty = np.diff(xs), np.diff(ys)
    ln = np.hypot(tx, ty)
    nx, ny = -ty / ln, tx / ln
    u, v = _kernel(xc[:, None] - xv[None], yc[:, None] - yv[None], s)
    A = u * nx[:, None] + v * ny[:, None]
    V1 = np.array([1.0, math.tan(g1)])
    vy2 = 0.0
    for _ in range(30):
        Vm = np.array([1.0, 0.5 * (V1[1] + vy2)])
        G = np.linalg.solve(A, -(Vm[0] * nx + Vm[1] * ny))
        vy2_new = V1[1] + G.sum() / s
        if abs(vy2_new - vy2) < 1e-7:
            break
        vy2 = 0.5 * vy2 + 0.5 * vy2_new
    Vmag = math.hypot(*Vm)
    dcp = np.abs(2 * G / (ln * Vmag))
    def vel(x, y):
        uu, vv = _kernel(x[..., None] - xv, y[..., None] - yv, s)
        return Vm[0] + (uu * G).sum(-1), Vm[1] + (vv * G).sum(-1)
    lines = []
    for y0 in np.linspace(-s, 2 * s, n_lines * 3):
        x, y = np.array(-0.5), np.array(float(y0 - 0.5 * math.tan(g1)))
        pts = [(float(x), float(y))]
        for _ in range(500):
            a, b = vel(x, y)
            sp = math.hypot(float(a), float(b)) or 1
            xm, ym = x + 0.012 * a / sp, y + 0.012 * b / sp
            a2, b2 = vel(xm, ym)
            sp2 = math.hypot(float(a2), float(b2)) or 1
            x, y = x + 0.024 * a2 / sp2, y + 0.024 * b2 / sp2
            pts.append((round(float(x), 4), round(float(y), 4)))
            if x > 1.8:
                break
        lines.append({"pts": pts, "speed": float(math.hypot(*vel(np.array(0.5), np.array(float(y0)))))})
    exit_deg = math.degrees(math.atan(vy2))
    return {"camber": [[round(float(a), 4), round(float(b), 4)] for a, b in zip(xs, ys)], "pitch": s, "x_load": xc.round(4).tolist(), "dcp": dcp.round(4).tolist(),
            "inlet_flow_deg": math.degrees(g1), "exit_flow_deg": exit_deg, "deviation_deg": exit_deg, "turning_deg": math.degrees(g1) - exit_deg,
            "zweifel": float(2 * s * math.cos(math.atan(vy2)) ** 2 * abs(math.tan(g1) - vy2)), "streamlines": lines, "solidity": solidity}


def analyse(imp: dict, stage: dict, suction: dict) -> dict:
    gas = _gas(stage, suction)
    mer = meridional(imp, gas)
    b2b = blade_to_blade(imp, mer)
    st = stator(imp, gas, mer, stage)
    cas = cascade(st["diffuser"][-1]["alpha_deg"])
    checks = [("Max diffusion ratio W_ss,max / W2 <= 2.0 (Rodgers)", b2b["max_diffusion_ratio"], b2b["max_diffusion_ratio"] <= 2.0),
              ("No pressure-side flow reversal", "none" if not b2b["reversal"] else "reversal", not b2b["reversal"]),
              ("Inducer throat choke margin >= 1.05", b2b["choke_margin"], b2b["choke_margin"] >= 1.05),
              ("Max relative Mach number < 0.9", float(np.max(mer["_raw"]["Mrel"])), float(np.max(mer["_raw"]["Mrel"])) < 0.9),
              ("Diffuser inlet angle above stall angle at design", st["alpha2_deg"], st["alpha2_deg"] > st["stall"]["alpha_crit_deg"]),
              ("Rotating-stall onset at or below 75 % of design flow", st["stall"]["stall_q_frac"], (st["stall"]["stall_q_frac"] or 0) <= 0.75)]
    mer.pop("_raw")
    return {"impeller": imp["index"] + 1, "meridional": mer, "blade_to_blade": b2b, "stator": st, "cascade": cas, "gas": gas,
            "checks": [{"check": a, "value": b if isinstance(b, str) else round(float(b), 3) if b is not None else None, "status": "pass" if c else "review"}
                       for a, b, c in checks]}


def export_zip(imp: dict, res: dict, project_name: str) -> bytes:
    """Geometry (TurboGrid-style hub / shroud / mid-span camber curves in mm, x y z) and boundary conditions for a full CFD run."""
    mer, g = res["meridional"], res["gas"]
    buf = io.BytesIO()
    with zipfile.ZipFile(buf, "w", zipfile.ZIP_DEFLATED) as z:
        for nm, key in (("hub.curve", "hub_mm"), ("shroud.curve", "shroud_mm")):
            z.writestr(nm, "# x y z (mm), meridional contour at theta = 0\n" + "\n".join(f"{r:.4f} 0.0000 {zz:.4f}" for r, zz in mer[key]))
        pl = res["blade_to_blade"]["plan"]
        ns = len(mer["r_mm"][0])
        i0, i1 = mer["i_le"], mer["i_te"]
        rr = [row[ns // 2] for row in mer["r_mm"][i0:i1 + 1]]
        zz = [row[ns // 2] for row in mer["z_mm"][i0:i1 + 1]]
        prof = [f"{r * math.cos(y / r):.4f} {r * math.sin(y / r):.4f} {z_:.4f}" for r, z_, y in zip(rr, zz, pl["y_ps_mm"])]
        z.writestr("profile.curve", "#Profile 1 (mid-span camber, mm)\n" + "\n".join(prof))
        z.writestr("boundary_conditions.txt", "\n".join([
            f"Project: {project_name}, impeller {res['impeller']}", f"Rotational speed: {mer['rpm']:.1f} rpm", f"Blades: {imp['blades']}",
            f"Inlet total pressure: {g['p01'] / 1e5:.4f} bara", f"Inlet total temperature: {g['T01']:.2f} K", f"Mass flow (full wheel): {g['mdot']:.4f} kg/s",
            f"Mass flow per passage: {g['mdot'] / imp['blades']:.5f} kg/s", f"Gas: R {g['R']:.2f} J/kg K, cp {g['cp']:.1f} J/kg K, k {g['k']:.4f}, Z {g['Z']:.4f}",
            "Outlet: mass flow or average static pressure at the diffuser exit", "Walls: hub and blade rotating, shroud stationary (shrouded impeller: shroud rotating)",
            "Turbulence: SST k-omega, y+ ~ 1 on walls; periodic boundaries at +/- 180/Z deg"]))
        z.writestr("meridional_field.csv", "qo,streamline,r_mm,z_mm,Wm,W,C,Mrel,p_bara,T_c\n" + "\n".join(
            f"{i},{j},{mer['r_mm'][i][j]},{mer['z_mm'][i][j]},{mer['Wm'][i][j]},{mer['W'][i][j]},{mer['C'][i][j]},{mer['Mrel'][i][j]},{mer['p_bara'][i][j]},{mer['T_c'][i][j]}"
            for i in range(len(mer["r_mm"])) for j in range(ns)))
        z.writestr("README.txt", "CentriForge CFD-lite export. Curves: TurboGrid-style point lists (x y z in mm). The camber line is the mid-span "
                   "streamline from the CFD-lite blade-to-blade solution; add the blade thickness distribution in the mesher. Boundary conditions "
                   "are for the design point of the stage.")
    return buf.getvalue()
