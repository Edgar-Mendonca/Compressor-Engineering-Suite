"""Axisymmetric rotating-disk finite elements (plane stress, variable thickness).

Radial displacement u(r) with linear elements and 2-point Gauss
integration. Loads: centrifugal body force rho omega^2 r, radial thermal
gradient, bore (shrink-fit) pressure and rim traction. Used for impeller
disk stress at rated, MCS and overspeed, and for a burst-margin estimate.

The impeller is idealised as a hub disk whose thickness tapers from the
hub to the tip; shroud and blade mass are carried as additional body load
outboard of the eye (``parasitic_factor``). This is a preliminary model;
blade/shroud stresses need a 3D FE model (see ``structural.calculix``).

Overspeed criterion (preliminary, OEM-style): average tangential stress at
115 % MCS <= 0.9 Sy; peak (bore) von Mises above Sy is flagged for review
because local bore yielding at overspeed is often accepted by design.
"""

from __future__ import annotations

import math

import numpy as np

from compsuite.core.trace import record

GAUSS = [(-1 / math.sqrt(3), 1.0), (1 / math.sqrt(3), 1.0)]
PARASITIC_FACTOR = 1.5  # disk body load multiplier outboard of the eye (shroud + blades)


def rotating_disk(r: np.ndarray, t: np.ndarray, E: float, nu: float, rho: float, omega: float,
                  alpha: float = 0.0, dT: np.ndarray | None = None, p_bore: float = 0.0, sigma_rim: float = 0.0,
                  body_factor: np.ndarray | None = None) -> dict:
    n = len(r)
    K = np.zeros((n, n))
    F = np.zeros(n)
    D = E / (1 - nu**2) * np.array([[1, nu], [nu, 1]])
    dT = np.zeros(n) if dT is None else dT
    bf = np.ones(n) if body_factor is None else body_factor
    for e in range(n - 1):
        r1, r2 = r[e], r[e + 1]
        L = r2 - r1
        for xi, w in GAUSS:
            N = np.array([(1 - xi) / 2, (1 + xi) / 2])
            rr = N @ [r1, r2]
            tt = N @ [t[e], t[e + 1]]
            dd = N @ [dT[e], dT[e + 1]]
            bb = N @ [bf[e], bf[e + 1]]
            B = np.array([[-1 / L, 1 / L], N / rr])
            jac = L / 2 * w * tt * rr
            K[e:e + 2, e:e + 2] += B.T @ D @ B * jac
            F[e:e + 2] += B.T @ D @ np.array([1, 1]) * alpha * dd * jac
            F[e:e + 2] += N * rho * bb * omega**2 * rr * jac
    # Traction: sigma_r(inner) = -p_bore, sigma_r(outer) = sigma_rim.
    F[0] += p_bore * t[0] * r[0]
    F[-1] += sigma_rim * t[-1] * r[-1]
    u = np.linalg.solve(K, F)
    # Stresses at element centroids (exact strain for linear elements),
    # linearly interpolated/extrapolated to the nodes.
    rc = 0.5 * (r[1:] + r[:-1])
    er = np.diff(u) / np.diff(r)
    et = 0.5 * (u[1:] + u[:-1]) / rc
    th = alpha * 0.5 * (dT[1:] + dT[:-1])
    src = E / (1 - nu**2) * (er + nu * et - (1 + nu) * th)
    stc = E / (1 - nu**2) * (et + nu * er - (1 + nu) * th)

    def to_nodes(vals):
        out = np.interp(r, rc, vals)
        out[0] = vals[0] + (vals[1] - vals[0]) * (r[0] - rc[0]) / (rc[1] - rc[0])
        out[-1] = vals[-1] + (vals[-1] - vals[-2]) * (r[-1] - rc[-1]) / (rc[-1] - rc[-2])
        return out

    sr, st = to_nodes(src), to_nodes(stc)
    vm = np.sqrt(sr**2 - sr * st + st**2)
    area = np.trapezoid(t, r)
    avg_t = np.trapezoid(st * t, r) / area
    return {"r_m": r.tolist(), "t_m": t.tolist(), "u_m": u.tolist(), "sigma_r_pa": sr.tolist(), "sigma_t_pa": st.tolist(),
            "von_mises_pa": vm.tolist(), "max_von_mises_pa": float(vm.max()), "average_tangential_pa": float(avg_t),
            "bore_growth_m": float(u[0]), "tip_growth_m": float(u[-1]),
            "residual": float(np.linalg.norm(K @ u - F) / max(np.linalg.norm(F), 1e-30))}


def impeller_disk_model(imp: dict, mat: dict, omega: float, T_gas_c: float, bore_dT: float = 20.0, n: int = 60) -> dict:
    r_i = imp["hub_mm"] / 2e3 / 1.25
    r_o = imp["D2_mm"] / 2e3
    r_hub = imp["hub_mm"] / 2e3
    r_eye = imp["D1_eye_mm"] / 2e3
    r = np.linspace(r_i, r_o, n)
    D2 = 2 * r_o
    t_hub, t_tip = 0.18 * D2, 0.012 * D2 + 0.004
    x = np.clip((r - r_hub * 1.1) / (r_o - r_hub * 1.1), 0.0, 1.0)
    t = np.where(r <= r_hub * 1.1, t_hub, t_hub + (t_tip - t_hub) * x**0.6)
    t = np.maximum(t, t_tip)
    bf = np.where(r > r_eye, PARASITIC_FACTOR, 1.0)  # shroud + blades carried by the disk
    dT = (T_gas_c - 20.0) - bore_dT * (r_o - r) / (r_o - r_i)
    return {"r": r, "t": t, "bf": bf, "dT": dT}


def impeller_stress(impellers: list[dict], stages: list[dict], mat: dict, speeds: dict, criteria) -> dict:
    rec = record("structural.disk", "Axisymmetric variable-thickness rotating-disk FE (plane stress)", [impellers, speeds],
                 assumptions=[f"Tapered hub disk; shroud and blades as {PARASITIC_FACTOR}x body load outboard of the eye",
                              "Linear radial temperature drop of 20 K from rim to bore", "No shrink-fit pressure (axial-key/shrink not modelled)",
                              "Overspeed check at 115 % MCS against yield (API 617 overspeed test speed)",
                              "Burst margin from average tangential stress vs. UTS"],
                 references=["Timoshenko & Goodier, Theory of Elasticity, rotating disks", "API 617 8th ed. 2.5 overspeed test"])
    out = []
    E, nu, rho, alpha = mat["E_pa"], mat["poisson"], mat["density_kg_m3"], mat["expansion_um_mk"] * 1e-6
    w_mcs = speeds["mcs_rpm"] * math.pi / 30
    for imp, st in zip(impellers, stages):
        g = impeller_disk_model(imp, mat, w_mcs, st["T_out_c"])
        res_mcs = rotating_disk(g["r"], g["t"], E, nu, rho, w_mcs, alpha, g["dT"], body_factor=g["bf"])
        res_os = rotating_disk(g["r"], g["t"], E, nu, rho, 1.15 * w_mcs, alpha, g["dT"], body_factor=g["bf"])
        res_mech = rotating_disk(g["r"], g["t"], E, nu, rho, w_mcs, body_factor=g["bf"])
        burst = w_mcs * math.sqrt(0.9 * mat["uts_mpa"] * 1e6 / max(res_mech["average_tangential_pa"], 1.0))
        os_ratio = res_os["max_von_mises_pa"] / (mat["yield_mpa"] * 1e6)
        avg_ratio = res_os["average_tangential_pa"] / (0.9 * mat["yield_mpa"] * 1e6)
        if avg_ratio > 1.0:
            rec.warn(f"Impeller {imp['index'] + 1}: average tangential stress at overspeed exceeds 0.9 Sy ({avg_ratio:.2f})")
        elif os_ratio > 1.0:
            rec.warn(f"Impeller {imp['index'] + 1}: peak bore stress at overspeed {os_ratio:.2f} x Sy (local yielding - review)")
        out.append({"impeller": imp["index"] + 1, "mcs": res_mcs, "max_vm_mcs_mpa": res_mcs["max_von_mises_pa"] / 1e6,
                    "max_vm_overspeed_mpa": res_os["max_von_mises_pa"] / 1e6, "overspeed_yield_ratio": os_ratio,
                    "overspeed_average_ratio": avg_ratio, "avg_tangential_overspeed_mpa": res_os["average_tangential_pa"] / 1e6,
                    "burst_speed_rpm": burst * 30 / math.pi, "burst_margin": burst / w_mcs,
                    "tip_growth_um": res_mcs["tip_growth_m"] * 1e6})
        _steps(rec, len(out) - 1, out[-1], g, res_mcs, res_os, res_mech, mat, w_mcs, burst)
    if impellers:
        rec.step("Tip speed at MCS", r"U_2 = \omega_{mcs}\,D_2/2", {r"\omega_{mcs}": (w_mcs, "rad/s"), "D_2": (impellers[0]["D2_mm"] / 1e3, "m")},
                 w_mcs * impellers[0]["D2_mm"] / 2e3, "m/s", "U_2", note=f"Impeller {impellers[0]['index'] + 1}; MCS = {speeds['mcs_rpm']:.0f} rpm")
    return {"impellers": out, "trace": rec}


def _steps(rec, row, o, g, mcs, os_, mech, mat, w, burst):
    rec.sym(**{r"\sigma_r": ("Radial stress", "Pa"), r"\sigma_\theta": ("Tangential (hoop) stress", "Pa"), "u": ("Radial displacement", "m"),
               "r": ("Radius", "m"), "t": ("Disk thickness", "m"), r"\rho": ("Material density", "kg/m³"), r"\omega": ("Angular speed", "rad/s"),
               r"\omega_{mcs}": ("Angular speed at MCS", "rad/s"), "D_2": ("Impeller tip diameter", "m"), "U_2": ("Tip speed", "m/s"),
               "b": ("Body-load factor (shroud and blades outboard of the eye)", "-"), "E": ("Young's modulus", "Pa"), r"\nu": ("Poisson ratio", "-"),
               r"\alpha": ("Thermal expansion coefficient", "1/K"), r"\Delta T": ("Temperature rise above 20 °C", "K"), "n_e": ("Number of elements", "-"),
               r"\varepsilon": ("Relative residual |Ku − F|/|F|", "-"), r"\sigma_{vm}": ("von Mises stress", "Pa"), r"\bar\sigma_\theta": ("Average tangential stress", "Pa"),
               "S_y": ("Yield strength at temperature", "Pa"), "S_u": ("Tensile strength at temperature", "Pa"), r"\omega_b": ("Burst speed", "rad/s"),
               r"\bar\sigma_{\theta,m}": ("Average tangential stress at MCS, no thermal load", "Pa"), "BM": ("Burst margin", "-"),
               "R_y": ("Average stress over 0.9 S_y", "-"), "N_b": ("Burst speed", "rpm"), "r_i": ("Bore radius", "m"), "r_o": ("Tip radius", "m"),
               "u_o": ("Radial growth at the tip", "m"), "t_{hub}": ("Hub thickness", "m"), "t_{tip}": ("Tip thickness", "m")})
    r, t = g["r"], g["t"]
    if row == 0:
        rec.step("Disk equilibrium", r"\frac{d}{dr}(t\,r\,\sigma_r) - t\,\sigma_\theta + b\,\rho\,\omega^2 r^2 t = 0",
                 {r"\rho": (mat["density_kg_m3"], "kg/m³"), "E": (mat["E_pa"], "Pa"), r"\nu": mat["poisson"], r"\alpha": (mat["expansion_um_mk"] * 1e-6, "1/K"),
                  "b": PARASITIC_FACTOR}, "", "", "",
                 note="Solved for the radial displacement u(r) with linear elements, two Gauss points each, and one direct linear solve")
    rec.step("Mesh", r"n_e = n - 1", {"r_i": (float(r[0]), "m"), "r_o": (float(r[-1]), "m"), "t_{hub}": (float(t[0]), "m"), "t_{tip}": (float(t[-1]), "m")},
             len(r) - 1, "elements", "n_e", row, note="Equal radial steps; thickness tapers from hub to tip; 20 K cooler at the bore than at the tip")
    rec.step("Solution residual", r"\varepsilon = \lVert K u - F \rVert / \lVert F \rVert", {}, mcs["residual"], "", r"\varepsilon", row,
             note="Direct solve, no iteration; a tiny residual means the force balance is met")
    sy, su = mat["yield_mpa"] * 1e6, mat["uts_mpa"] * 1e6
    rec.step("Peak von Mises stress at MCS", r"\sigma_{vm} = \max_r \sqrt{\sigma_r^2 - \sigma_r\sigma_\theta + \sigma_\theta^2}", {r"\omega": (w, "rad/s")},
             o["max_vm_mcs_mpa"], "MPa", r"\sigma_{vm}", row, note="Spin plus thermal load", ui="σvm MCS MPa")
    rec.step("Peak von Mises stress at overspeed", r"\sigma_{vm} = \max_r \sqrt{\sigma_r^2 - \sigma_r\sigma_\theta + \sigma_\theta^2}", {r"\omega": (1.15 * w, "rad/s")},
             o["max_vm_overspeed_mpa"], "MPa", r"\sigma_{vm}", row, ui="σvm 115 % MPa")
    rec.step("Average hoop stress at overspeed", r"\bar\sigma_\theta = \frac{\int \sigma_\theta\,t\,dr}{\int t\,dr}", {r"\omega": (1.15 * w, "rad/s")},
             o["avg_tangential_overspeed_mpa"], "MPa", r"\bar\sigma_\theta", row, ui="σθ avg 115 % MPa")
    rec.step("Average stress over allowed", r"R_y = \frac{\bar\sigma_\theta}{0.9\,S_y}", {r"\bar\sigma_\theta": (os_["average_tangential_pa"], "Pa"), "S_y": (sy, "Pa")},
             o["overspeed_average_ratio"], "", "R_y", row, note="1 or less passes", ui="avg / 0.9 Sy")
    rec.step("Burst speed", r"\omega_b = \omega_{mcs}\sqrt{\frac{0.9\,S_u}{\bar\sigma_{\theta,m}}}", {r"\omega_{mcs}": (w, "rad/s"), "S_u": (su, "Pa"),
             r"\bar\sigma_{\theta,m}": (mech["average_tangential_pa"], "Pa")}, o["burst_speed_rpm"], "rpm", r"\omega_b", row,
             note="Spin stress grows with speed squared; burst when the average hoop stress reaches 0.9 of the tensile strength", ui="Burst rpm")
    rec.step("Burst margin", r"BM = \omega_b / \omega_{mcs}", {r"\omega_b": (burst, "rad/s"), r"\omega_{mcs}": (w, "rad/s")}, o["burst_margin"], "", "BM", row)
    rec.step("Tip radial growth", "u_o = u(r_o)", {"r_o": (float(r[-1]), "m")}, o["tip_growth_um"], "µm", "u_o", row, ui="Tip growth µm")
