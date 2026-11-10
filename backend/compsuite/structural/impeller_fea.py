"""Axisymmetric finite-element model of a closed impeller.

The meridional section (r, z) is meshed with 4-node axisymmetric quads
(2x2 Gauss): hub/backplate, blade passage and shroud. Blades are smeared
into the passage as a ring of reduced density and stiffness (blade
fraction f = Z t / 2 pi r), so their mass loads hub and shroud while the
hub and shroud carry hoop stress. Loads: centrifugal body force and a
linear rim-to-bore temperature field. Blade stresses themselves need a
3D (cyclic-sector) model; ``calculix_deck`` exports the same mesh as CAX4
for an independent check.
"""

from __future__ import annotations

import math

import numpy as np
from scipy.sparse import coo_matrix
from scipy.sparse.linalg import spsolve

from compsuite.core.trace import record

G2 = (-1 / math.sqrt(3), 1 / math.sqrt(3))
BLADE_T = 0.006  # m, smeared blade thickness


def mesh(imp: dict, nr_in: int = 6, nr_out: int = 18, nb: int = 4, npass: int = 3, ns: int = 2) -> dict:
    """Structured mesh: columns in r, stacked layers (backplate, passage, shroud) in z.
    Returns nodes (r, z), elements (4 node ids) and per-element zone."""
    D2 = imp["D2_mm"] / 1e3
    r2, r1, rb = D2 / 2, imp["D1_eye_mm"] / 2e3, imp["hub_mm"] / 2e3 / 1.25
    b2 = imp["b2_mm"] / 1e3
    t_hub, t_back, t_sh = 0.20 * D2, 0.035 * D2 + 0.004, 0.022 * D2 + 0.003
    rs = np.concatenate([np.linspace(rb, r1, nr_in + 1), np.linspace(r1, r2, nr_out + 1)[1:]])
    nodes, ids, elems, zones = [], {}, [], []

    def thick_back(r):  # hub tapers into the backplate
        x = np.clip((r - rb) / max(r1 - rb, 1e-9), 0, 1)
        return t_hub + (t_back - t_hub) * x**0.7 if r <= r1 else t_back

    def b(r):  # passage width falls from the eye to b2
        return b2 + (1.6 * b2) * (r2 - r) / max(r2 - r1, 1e-9)

    def levels(r):
        z = list(np.linspace(0, thick_back(r), nb + 1))
        if r >= r1 - 1e-12:
            tb = z[-1]
            z += list(np.linspace(tb, tb + b(r), npass + 1)[1:])
            z += list(np.linspace(tb + b(r), tb + b(r) + t_sh, ns + 1)[1:])
        return z

    def nid(i, j, r, z):
        key = (i, j)
        if key not in ids:
            ids[key] = len(nodes)
            nodes.append((r, z))
        return ids[key]

    for i in range(len(rs) - 1):
        ra, rb_ = rs[i], rs[i + 1]
        za, zb = levels(ra), levels(rb_)
        nl = min(len(za), len(zb)) - 1
        for j in range(nl):
            zone = "hub" if j < nb else ("passage" if j < nb + npass else "shroud")
            elems.append([nid(i, j, ra, za[j]), nid(i + 1, j, rb_, zb[j]), nid(i + 1, j + 1, rb_, zb[j + 1]), nid(i, j + 1, ra, za[j + 1])])
            zones.append(zone)
    return {"nodes": np.array(nodes), "elements": np.array(elems), "zones": zones, "r_eye": r1, "r_tip": r2, "r_bore": rb}


def _D(E, nu):
    c = E / ((1 + nu) * (1 - 2 * nu))
    return c * np.array([[1 - nu, nu, nu, 0], [nu, 1 - nu, nu, 0], [nu, nu, 1 - nu, 0], [0, 0, 0, (1 - 2 * nu) / 2]])


def _shape(xi, eta):
    N = 0.25 * np.array([(1 - xi) * (1 - eta), (1 + xi) * (1 - eta), (1 + xi) * (1 + eta), (1 - xi) * (1 + eta)])
    dN = 0.25 * np.array([[-(1 - eta), (1 - eta), (1 + eta), -(1 + eta)], [-(1 - xi), -(1 + xi), (1 + xi), (1 - xi)]])
    return N, dN


def solve(m: dict, E: float, nu: float, rho: float, omega: float, alpha: float = 0.0, dT_nodes=None,
          blades: int = 17) -> dict:
    X, EL = m["nodes"], m["elements"]
    n = len(X)
    dT = np.zeros(n) if dT_nodes is None else dT_nodes
    rows, cols, vals = [], [], []
    F = np.zeros(2 * n)
    gp_store = []
    for e, conn in enumerate(EL):
        xe = X[conn]
        rc = xe[:, 0].mean()
        f = min(1.0, blades * BLADE_T / (2 * math.pi * rc)) if m["zones"][e] == "passage" else 1.0
        D = _D(E * f, nu)
        Ke = np.zeros((8, 8))
        Fe = np.zeros(8)
        for xi in G2:
            for eta in G2:
                N, dN = _shape(xi, eta)
                J = dN @ xe
                detJ = np.linalg.det(J)
                dNx = np.linalg.solve(J, dN)
                r = N @ xe[:, 0]
                B = np.zeros((4, 8))
                B[0, 0::2] = dNx[0]
                B[1, 1::2] = dNx[1]
                B[2, 0::2] = N / r
                B[3, 0::2] = dNx[1]
                B[3, 1::2] = dNx[0]
                w = r * detJ
                Ke += B.T @ D @ B * w
                Fe[0::2] += N * rho * f * omega**2 * r * w
                e0 = alpha * (N @ dT[conn]) * np.array([1, 1, 1, 0])
                Fe += B.T @ D @ e0 * w
        dofs = np.ravel([[2 * a, 2 * a + 1] for a in conn])
        rr, cc = np.meshgrid(dofs, dofs, indexing="ij")
        rows.append(rr.ravel()); cols.append(cc.ravel()); vals.append(Ke.ravel())
        F[dofs] += Fe
        gp_store.append((D, f))
    K = coo_matrix((np.concatenate(vals), (np.concatenate(rows), np.concatenate(cols))), shape=(2 * n, 2 * n)).tocsr()
    # Axial restraint at the innermost bottom node (rigid-body z); radial is free.
    fix = int(np.lexsort((X[:, 1], X[:, 0]))[0]) * 2 + 1
    K = K.tolil(); K[fix, :] = 0; K[:, fix] = 0; K[fix, fix] = 1.0; F[fix] = 0.0
    u = spsolve(K.tocsr(), F)
    resid = float(np.linalg.norm(K.tocsr() @ u - F) / max(np.linalg.norm(F), 1e-30))
    # Centroid stresses.
    out = []
    for e, conn in enumerate(EL):
        xe = X[conn]
        N, dN = _shape(0.0, 0.0)
        J = dN @ xe
        dNx = np.linalg.solve(J, dN)
        r = N @ xe[:, 0]
        B = np.zeros((4, 8))
        B[0, 0::2] = dNx[0]; B[1, 1::2] = dNx[1]; B[2, 0::2] = N / r; B[3, 0::2] = dNx[1]; B[3, 1::2] = dNx[0]
        ue = np.ravel([[u[2 * a], u[2 * a + 1]] for a in conn])
        D, f = gp_store[e]
        s = D @ (B @ ue - alpha * (N @ dT[conn]) * np.array([1, 1, 1, 0]))
        sr, sz, st, trz = s
        vm = math.sqrt(0.5 * ((sr - sz) ** 2 + (sz - st) ** 2 + (st - sr) ** 2) + 3 * trz**2)
        out.append((r, N @ xe[:, 1], sr, sz, st, trz, vm))
    S = np.array(out)
    return {"u": u.reshape(-1, 2), "stress": S, "residual": resid}


def _nodal(m: dict, res: dict) -> dict:
    """Average element-centroid stresses to the nodes for contour plotting."""
    n = len(m["nodes"])
    acc, cnt = np.zeros((n, 5)), np.zeros(n)
    for e, conn in enumerate(m["elements"]):
        sr, sz, st, trz, vm = res["stress"][e, 2:7]
        acc[conn] += (vm, st, sr, sz, trz)
        cnt[conn] += 1
    acc /= np.maximum(cnt, 1)[:, None]
    u = res["u"]
    r1 = lambda a: np.round(a, 1).tolist()
    return {"von_mises_mpa": r1(acc[:, 0] / 1e6), "hoop_mpa": r1(acc[:, 1] / 1e6), "radial_mpa": r1(acc[:, 2] / 1e6),
            "axial_mpa": r1(acc[:, 3] / 1e6), "ur_um": r1(u[:, 0] * 1e6), "uz_um": r1(u[:, 1] * 1e6),
            "disp_um": r1(np.hypot(u[:, 0], u[:, 1]) * 1e6)}


def impeller_fea(impellers: list[dict], stages: list[dict], mat: dict, speeds: dict, criteria) -> dict:
    rec = record("structural.impeller_fea", "Axisymmetric FE (CAX4-type quads), smeared blades, centrifugal + thermal",
                 [impellers, speeds],
                 assumptions=[f"Blades smeared in the passage (t = {BLADE_T * 1e3:.0f} mm, f = Z t / 2 pi r)",
                              "Linear temperature drop of 20 K from rim to bore", "Bore radially free (no shrink fit), axial rigid-body restraint",
                              "Hub, backplate and shroud proportions from the stage geometry; replace with CAD for detail design",
                              "Blade root and fillet stresses not resolved (needs a 3D cyclic-sector model)"],
                 references=["Zienkiewicz & Taylor, The Finite Element Method, axisymmetric solids",
                             "API 617 8th ed. overspeed test (115 % MCS)"])
    E, nu, rho, alpha = mat["E_pa"], mat["poisson"], mat["density_kg_m3"], mat["expansion_um_mk"] * 1e-6
    Sy = mat["yield_mpa"] * 1e6
    w = speeds["mcs_rpm"] * math.pi / 30
    out = []
    _syms(rec)
    for row, (imp, st) in enumerate(zip(impellers, stages)):
        m = mesh(imp)
        X = m["nodes"]
        dT = (st["T_out_c"] - 20.0) - 20.0 * (m["r_tip"] - X[:, 0]) / (m["r_tip"] - m["r_bore"])
        res = solve(m, E, nu, rho, w, alpha, dT, imp["blades"])
        os_ = solve(m, E, nu, rho, 1.15 * w, alpha, dT, imp["blades"])
        S, So = res["stress"], os_["stress"]
        solid = np.array([z != "passage" for z in m["zones"]])
        tip = int(np.argmax(X[:, 0] + 1e-6 * X[:, 1]))
        eye_nodes = [k for k, (r, z) in enumerate(X) if abs(r - m["r_eye"]) < 1e-9]
        eye_top = max(eye_nodes, key=lambda k: X[k, 1]) if eye_nodes else tip
        vm_max = float(S[solid, 6].max())
        vm_os = float(So[solid, 6].max())
        if vm_os > Sy:
            rec.warn(f"Impeller {imp['index'] + 1}: FE peak von Mises at overspeed {vm_os / 1e6:.0f} MPa exceeds yield (local, review)")
        out.append({"impeller": imp["index"] + 1, "elements": len(m["elements"]), "nodes": len(X),
                    "max_vm_mcs_mpa": vm_max / 1e6, "max_vm_overspeed_mpa": vm_os / 1e6,
                    "max_hoop_mcs_mpa": float(S[solid, 4].max() / 1e6), "yield_utilisation_mcs": vm_max / Sy,
                    "yield_utilisation_overspeed": vm_os / Sy,
                    "tip_radial_growth_um": float(res["u"][tip, 0] * 1e6),
                    "eye_radial_growth_um": float(res["u"][eye_top, 0] * 1e6),
                    "eye_axial_shift_um": float(res["u"][eye_top, 1] * 1e6),
                    "model": {"nodes_mm": (X * 1e3).round(3).tolist(), "elements": m["elements"].tolist(), "zones": m["zones"],
                              "blades": imp["blades"], "backsweep_deg": imp["backsweep_deg"],
                              "r_eye_mm": m["r_eye"] * 1e3, "r_tip_mm": m["r_tip"] * 1e3,
                              "cases": {"MCS": _nodal(m, res), "Overspeed 115 %": _nodal(m, os_)}}})
        _steps(rec, row, out[-1], m, res, os_, solid, dict(E=E, nu=nu, rho=rho, alpha=alpha, Sy=Sy, w=w, T_out=st["T_out_c"], Z=imp["blades"]))
    return {"impellers": out, "trace": rec}


def _syms(rec) -> None:
    rec.sym(**{"K": ("Global stiffness matrix", "N/m"), "u": ("Nodal displacements", "m"), "N": ("Element shape functions", "-"), "F": ("Nodal loads (centrifugal and thermal)", "N"),
               "B": ("Strain-displacement matrix", "1/m"), "D": ("Elasticity matrix", "Pa"), "r": ("Radius", "m"), "A": ("Element area", "m²"),
               r"\rho": ("Material density", "kg/m³"), r"\omega": ("Angular speed", "rad/s"), "E": ("Young's modulus", "Pa"), r"\nu": ("Poisson's ratio", "-"),
               r"\alpha": ("Thermal expansion coefficient", "1/K"), "f": ("Blade fraction of the passage ring", "-"), "Z": ("Number of blades", "-"),
               "t_b": ("Smeared blade thickness", "m"), r"\Delta T": ("Temperature rise above 20 °C", "K"), "T_2": ("Stage outlet temperature", "°C"),
               "r_{tip}": ("Tip radius", "m"), "r_{bore}": ("Bore radius", "m"), "r_{eye}": ("Eye radius", "m"), "n_e": ("Number of elements", "-"),
               "n_n": ("Number of nodes", "-"), r"\varepsilon": ("Relative residual of the solved equations", "-"),
               r"\sigma_r": ("Radial stress", "Pa"), r"\sigma_z": ("Axial stress", "Pa"), r"\sigma_\theta": ("Hoop stress", "Pa"),
               r"\tau_{rz}": ("Shear stress", "Pa"), r"\sigma_{vm}": ("von Mises stress", "Pa"), "S_y": ("Yield strength", "Pa"),
               "u_r": ("Radial displacement", "m"), "u_z": ("Axial displacement", "m"), "U": ("Yield use", "-")})


def _steps(rec, row: int, o: dict, m: dict, res: dict, os_: dict, solid, p: dict) -> None:
    """Document one impeller of the axisymmetric model (values already computed)."""
    S, So = res["stress"], os_["stress"]
    ne, nn = o["elements"], o["nodes"]
    rec.step("Governing equation", r"K\,u = F,\quad K = \sum_e \int_A B^T D\,B\;2\pi r\,dA",
             {"E": (p["E"], "Pa"), r"\nu": p["nu"], r"\rho": (p["rho"], "kg/m³"), r"\omega": (p["w"], "rad/s")}, 2 * nn, "DOF", "", row,
             "Static equilibrium of the meridional section; 4-node axisymmetric quads with 2x2 Gauss points, solved once per speed by a direct sparse solver")
    rec.step("Mesh size", r"n_e,\; n_n", {"n_e": ne, "n_n": nn}, nn, "nodes", "n_n", row,
             "Structured mesh: bore to tip in r; back plate, passage and shroud layers in z", ui="Mesh")
    rec.step("Smeared blades", r"f = \min\!\left(1,\ \frac{Z\,t_b}{2\pi r}\right)", {"Z": p["Z"], "t_b": (BLADE_T, "m"), "r": (m["r_tip"], "m")},
             min(1.0, p["Z"] * BLADE_T / (2 * math.pi * m["r_tip"])), "", "f", row,
             "Passage elements carry this fraction of the density and stiffness (value shown at the tip)")
    rec.step("Loads", r"F = \sum_e \int_A N^T \rho f \omega^2 r\;2\pi r\,dA + \sum_e \int_A B^T D\,\alpha\,\Delta T\;2\pi r\,dA",
             {r"\rho": (p["rho"], "kg/m³"), r"\omega": (p["w"], "rad/s"), r"\alpha": (p["alpha"], "1/K"), "T_2": (p["T_out"], "°C")},
             p["T_out"] - 20.0, "K", r"\Delta T", row,
             "Centrifugal body force plus a temperature field: ΔT = T₂ − 20 at the rim, 20 K less at the bore (rim value shown)")
    rec.step("Force balance (residual)", r"\varepsilon = \frac{\lVert K u - F \rVert}{\lVert F \rVert}", {}, res["residual"], "", r"\varepsilon", row,
             "Direct solve, no iteration: a residual near machine precision shows the equations are met")
    for name, ui, SS, om in (("Peak von Mises stress at MCS", "Peak σvm at MCS", S, p["w"]),
                             ("Peak von Mises stress at 115 % speed", "Peak σvm at 115 %", So, 1.15 * p["w"])):
        e = int(np.flatnonzero(solid)[np.argmax(SS[solid, 6])])
        sr, sz, st, trz, vm = SS[e, 2:7]
        rec.step(name, r"\sigma_{vm} = \sqrt{\tfrac12\left[(\sigma_r-\sigma_z)^2+(\sigma_z-\sigma_\theta)^2+(\sigma_\theta-\sigma_r)^2\right]+3\tau_{rz}^2}",
                 {r"\omega": (om, "rad/s"), r"\sigma_r": (sr / 1e6, "MPa"), r"\sigma_z": (sz / 1e6, "MPa"), r"\sigma_\theta": (st / 1e6, "MPa"),
                  r"\tau_{rz}": (trz / 1e6, "MPa")}, vm / 1e6, "MPa", r"\sigma_{vm}", row,
                 f"Stresses at the centroid of the highest-stressed hub or shroud element (r = {SS[e, 0] * 1e3:.0f} mm); smeared passage left out", ui=ui)
    rec.step("Yield use", r"U = \sigma_{vm} / S_y", {r"\sigma_{vm}": (o["max_vm_mcs_mpa"], "MPa"), "S_y": (p["Sy"] / 1e6, "MPa")},
             o["yield_utilisation_mcs"], "", "U", row, f"At 115 %: {o['yield_utilisation_overspeed']:.3f}", ui="Yield use MCS / 115 %")
    rec.step("Tip radial growth", "u_r(r_{tip})", {"r_{tip}": (m["r_tip"], "m")}, o["tip_radial_growth_um"], "µm", "u_r", row,
             "Radial displacement of the outermost node at MCS")
    rec.step("Eye radial growth", r"u_r(r_{eye}),\; u_z(r_{eye})", {"r_{eye}": (m["r_eye"], "m")}, o["eye_radial_growth_um"], "µm", "u_r", row,
             f"At the shroud eye node; axial shift {o['eye_axial_shift_um']:.1f} µm", ui="Eye growth / axial shift")


def calculix_deck(m: dict, E: float, nu: float, rho: float, omega: float, blades: int = 17) -> str:
    """CAX4 deck of the same mesh (smeared passage as its own material) with CENTRIF load."""
    X, EL = m["nodes"], m["elements"]
    lines = ["** compsuite impeller axisymmetric model", "*NODE"]
    lines += [f"{i + 1}, {r:.7f}, {z:.7f}, 0.0" for i, (r, z) in enumerate(X)]
    groups = {}
    for e, (conn, zone) in enumerate(zip(EL, m["zones"])):
        rc = X[conn][:, 0].mean()
        f = min(1.0, blades * BLADE_T / (2 * math.pi * rc)) if zone == "passage" else 1.0
        groups.setdefault(round(f, 4), []).append((e, conn))
    for k, (f, els) in enumerate(groups.items()):
        lines.append(f"*ELEMENT, TYPE=CAX4, ELSET=E{k}")
        lines += [f"{e + 1}, {c[0] + 1}, {c[1] + 1}, {c[2] + 1}, {c[3] + 1}" for e, c in els]
        lines += [f"*MATERIAL, NAME=M{k}", "*ELASTIC", f"{E * f:.6E}, {nu}", "*DENSITY", f"{rho * f:.6E}",
                  f"*SOLID SECTION, ELSET=E{k}, MATERIAL=M{k}"]
    fix = int(np.lexsort((X[:, 1], X[:, 0]))[0]) + 1
    lines += ["*NSET, NSET=NALL, GENERATE", f"1, {len(X)}, 1", "*BOUNDARY", f"{fix}, 2, 2", "*STEP", "*STATIC", "*DLOAD"]
    lines += [f"E{k}, CENTRIF, {omega**2:.6E}, 0., 0., 0., 0., 1., 0." for k in range(len(groups))]
    lines += ["*NODE PRINT, NSET=NALL", "U", "*END STEP"]
    return "\n".join(lines) + "\n"
