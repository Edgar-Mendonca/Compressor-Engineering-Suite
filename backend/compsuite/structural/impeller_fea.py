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
    return {"u": u.reshape(-1, 2), "stress": S}


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
    for imp, st in zip(impellers, stages):
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
    return {"impellers": out, "trace": rec}


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
