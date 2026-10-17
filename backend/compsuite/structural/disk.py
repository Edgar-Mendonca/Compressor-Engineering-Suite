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
            "bore_growth_m": float(u[0]), "tip_growth_m": float(u[-1])}


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
    return {"impellers": out, "trace": rec}
