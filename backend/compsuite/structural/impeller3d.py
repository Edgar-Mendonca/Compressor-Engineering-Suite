"""3D cyclic-sector impeller FEA (8-node hexahedra).

One blade passage is meshed: hub disk, one blade and the shroud, with mesh
lines following the blade camber (logarithmic spiral of constant blade angle).
Cyclic symmetry ties the two sector faces: u_slave = R(alpha) u_master for
nodal diameter 0 (static loads) and e^{i k alpha} R(alpha) u_master for
nodal diameter k (modes).

Load cases: centrifugal (MCS, trip, 115 % overspeed), gas pressure on the
passage, blade and cavity surfaces, temperature from the gas path, and the
shrink fit as a bore pressure from the interference and the shaft compliance
(lift-off speed where the fit pressure reaches zero).
Overspeed plasticity: secant (deformation-theory) iteration on a bilinear
stress-strain curve; permanent growth = elastic-plastic minus elastic response.
Modes: stress stiffening (geometric stiffness from the MCS prestress) and
spin softening; f(N)^2 = f0^2 + (f_mcs^2 - f0^2)(N/N_mcs)^2 for the Campbell
and SAFE (interference) diagrams.
Fatigue: Goodman (HCF, alternating stress as a fraction of steady, raised at
an interference) and Manson universal slopes (LCF, start-stop cycles, Neuber).

Preliminary engineering: geometry is parametric from the stage design, not CAD.
"""

from __future__ import annotations

import math

import numpy as np
import scipy.sparse as sp
import scipy.sparse.linalg as spla

from compsuite.core.trace import record

GP = np.array([-1, 1]) / math.sqrt(3)
CORNERS = np.array([[-1, -1, -1], [1, -1, -1], [1, 1, -1], [-1, 1, -1], [-1, -1, 1], [1, -1, 1], [1, 1, 1], [-1, 1, 1]], float)
# Element faces (local node ids, outward for a right-handed hex).
FACES = {"zmin": [0, 3, 2, 1], "zmax": [4, 5, 6, 7], "ymin": [0, 1, 5, 4], "ymax": [2, 3, 7, 6], "xmin": [0, 4, 7, 3], "xmax": [1, 2, 6, 5]}


# ---------------------------------------------------------------- mesh
def build_mesh(imp: dict, bore_d: float | None = None, level: int = 2, blade_t: float | None = None, thick=1.0) -> dict:
    """Structured sector mesh. Indices: i radial station, j tangential (camber-following), k axial layer.
    thick: factor on the hub, back-plate and shroud thickness, or (hub factor, back-plate / shroud factor)."""
    fh, fo = (thick, thick) if np.isscalar(thick) else thick
    D2 = imp["D2_mm"] / 1e3
    r2, r1 = D2 / 2, imp["D1_eye_mm"] / 2e3
    rb = (bore_d or imp["hub_mm"] / 1e3 / 1.25) / 2
    b2 = imp["b2_mm"] / 1e3
    Z = int(imp.get("blades", 17))
    beta = math.radians(imp.get("backsweep_deg", 40.0))
    tb = blade_t or max(0.003, 0.014 * D2)
    t_hub, t_back, t_sh = fh * 0.20 * D2, fo * (0.035 * D2 + 0.004), fo * (0.022 * D2 + 0.003)
    s = {1: 0.6, 2: 1.0, 3: 1.6}.get(level, 1.0)
    nri, nro = max(3, round(5 * s)), max(6, round(14 * s))
    nb, npz, ns, nside = max(2, round(3 * s)), max(2, round(3 * s)), 2, max(2, round(3 * s))
    nblade = 2
    rs = np.concatenate([np.linspace(rb, r1, nri + 1), np.linspace(r1, r2, nro + 1)[1:]])
    alpha = 2 * math.pi / Z

    def back(r):
        x = np.clip((r - rb) / max(r1 - rb, 1e-9), 0, 1)
        return np.where(r <= r1, t_hub + (t_back - t_hub) * x**0.7, t_back)

    def bw(r):
        return b2 + 1.6 * b2 * (r2 - np.maximum(r, r1)) / max(r2 - r1, 1e-9)

    def camber(r):  # constant blade angle beta from radial: dtheta/dr = -tan(beta)/r
        return -math.tan(beta) * np.log(np.maximum(r, r1) / r1)

    nth = 2 * nside + nblade
    X = np.zeros((len(rs), nth + 1, nb + npz + ns + 1, 3))
    for i, r in enumerate(rs):
        d = tb / (2 * max(r, r1))
        th = np.concatenate([np.linspace(-alpha / 2, -d, nside + 1), np.linspace(-d, d, nblade + 1)[1:], np.linspace(d, alpha / 2, nside + 1)[1:]])
        h, b = back(r), bw(r)
        zs = np.concatenate([np.linspace(0, h, nb + 1), np.linspace(h, h + b, npz + 1)[1:], np.linspace(h + b, h + b + t_sh, ns + 1)[1:]])
        ang = th + camber(r)
        X[i, :, :, 0] = r * np.cos(ang)[:, None]
        X[i, :, :, 1] = r * np.sin(ang)[:, None]
        X[i, :, :, 2] = zs[None, :]
    ni, nj, nk = X.shape[:3]
    gid = np.arange(ni * nj * nk).reshape(ni, nj, nk)
    els, zone, ijk = [], [], []
    for i in range(ni - 1):
        outer = rs[i] >= r1 - 1e-12
        for j in range(nj - 1):
            in_blade = nside <= j < nside + nblade
            for k in range(nk - 1):
                z = "hub" if k < nb else ("blade" if k < nb + npz else "shroud")
                if z != "hub" and (not outer or (z == "blade" and not in_blade)):
                    continue
                els.append([gid[i, j, k], gid[i + 1, j, k], gid[i + 1, j + 1, k], gid[i, j + 1, k],
                            gid[i, j, k + 1], gid[i + 1, j, k + 1], gid[i + 1, j + 1, k + 1], gid[i, j + 1, k + 1]])
                zone.append(z)
                ijk.append((i, j, k))
    els = np.array(els)
    used = np.unique(els)
    remap = -np.ones(ni * nj * nk, int)
    remap[used] = np.arange(len(used))
    nodes = X.reshape(-1, 3)[used]
    els = remap[els]
    gidr = remap[gid]
    pairs = [(gidr[i, 0, k], gidr[i, nj - 1, k]) for i in range(ni) for k in range(nk) if gidr[i, 0, k] >= 0 and gidr[i, nj - 1, k] >= 0]
    return {"nodes": nodes, "elements": els, "zone": np.array(zone), "ijk": np.array(ijk), "gid": gidr, "rs": rs, "alpha": alpha, "Z": Z,
            "r_bore": rb, "r_eye": r1, "r_tip": r2, "nb": nb, "npz": npz, "ns": ns, "nside": nside, "nblade": nblade,
            "pairs": np.array(pairs), "blade_t": tb, "b2": b2, "level": level, "thick": [float(fh), float(fo)]}


def disk_mesh(ri: float, ro: float, t: float, Z: int = 24, nr: int = 12, nt: int = 3, nz: int = 2) -> dict:
    """Flat annular disk sector (for the analytical rotating-disc check)."""
    alpha = 2 * math.pi / Z
    rs = np.linspace(ri, ro, nr + 1)
    th = np.linspace(-alpha / 2, alpha / 2, nt + 1)
    zs = np.linspace(0, t, nz + 1)
    R, TH, ZZ = np.meshgrid(rs, th, zs, indexing="ij")
    nodes = np.stack([R * np.cos(TH), R * np.sin(TH), ZZ], -1).reshape(-1, 3)
    gid = np.arange(len(nodes)).reshape(R.shape)
    els = [[gid[i, j, k], gid[i + 1, j, k], gid[i + 1, j + 1, k], gid[i, j + 1, k], gid[i, j, k + 1], gid[i + 1, j, k + 1],
            gid[i + 1, j + 1, k + 1], gid[i, j + 1, k + 1]] for i in range(nr) for j in range(nt) for k in range(nz)]
    pairs = [(gid[i, 0, k], gid[i, nt, k]) for i in range(nr + 1) for k in range(nz + 1)]
    return {"nodes": nodes, "elements": np.array(els), "gid": gid, "alpha": alpha, "Z": Z, "pairs": np.array(pairs), "rs": rs}


def fe_mass_properties(m: dict, rho: float) -> dict:
    """Full-wheel mass, axial CG (from the back face), polar and transverse (about the CG) inertia of the FE model."""
    _, detJ, _, _ = _geometry(m["nodes"], m["elements"])
    Xg = np.einsum("ga,eaj->egj", NN, m["nodes"][m["elements"]])
    dm = rho * detJ * m["Z"]
    r2, z = Xg[..., 0]**2 + Xg[..., 1]**2, Xg[..., 2]
    M = float(dm.sum())
    zc = float((dm * z).sum() / M)
    return {"mass_kg": M, "cg_mm": zc * 1e3, "ip_kgm2": float((dm * r2).sum()), "it_kgm2": float((dm * (r2 / 2 + (z - zc)**2)).sum())}


def match_mass(imp: dict, bore_d, blade_t, rho: float, mass: float | None, ip: float | None = None):
    """Thickness factors so the FE wheel matches the vendor mass (one factor) or mass and polar inertia (hub / outer factors)."""
    if not mass:
        return 1.0
    def mp(f):
        q = fe_mass_properties(build_mesh(imp, bore_d, 1, blade_t, (f[0], f[1])), rho)
        return np.array([q["mass_kg"] / mass - 1, (q["ip_kgm2"] / ip - 1) if ip else 0.0])
    f = np.ones(2)
    for _ in range(8):
        r0 = mp(f)
        if np.abs(r0).max() < 0.003:
            break
        if not ip:
            f = np.clip(f / (1 + r0[0]), 0.3, 3.0)
            continue
        J = np.column_stack([(mp(f + h) - r0) / 0.01 for h in (np.array([0.01, 0]), np.array([0, 0.01]))])
        try:
            step = np.linalg.solve(J, -r0)
        except np.linalg.LinAlgError:
            step = -r0
        f = np.clip(f + np.clip(step, -0.5, 0.5), 0.2, 4.0)
    return float(f[0]) if not ip else (float(f[0]), float(f[1]))


def contact_length(z, ur_rel, delta: float) -> float:
    """Percentage of the bore axial length still in contact: radial growth relative to the shaft below the radial interference."""
    z, g = np.asarray(z, float), np.asarray(ur_rel, float) - delta
    o = np.argsort(z)
    zz = np.linspace(z[o][0], z[o][-1], 2001)
    return float(np.mean(np.interp(zz, z[o], g[o]) <= 0) * 100)


def rotating_disc_check(E: float, nu: float, rho: float, ri: float, ro: float, w: float) -> dict:
    """Thin rotating annular disc: FE (this element and solver) against the plane-stress closed form at the bore."""
    m = disk_mesh(ri, ro, 0.04 * ro)
    sec = Sector(m, E, nu, rho, 0.0)
    u = sec.solve(sec.f_centrifugal(w)).reshape(-1, 3)
    X = sec.nodes
    rN = np.hypot(X[:, 0], X[:, 1])
    th = np.arctan2(X[:, 1], X[:, 0])
    ur = u[:, 0] * np.cos(th) + u[:, 1] * np.sin(th)
    hoop = _gauss_to_nodes(m, cylindrical(sec.stresses(u.ravel()), sec.Xg)[1])
    bore = np.abs(rN - ri) < 1e-9
    s_exact = (3 + nu) / 4 * rho * w**2 * (ro**2 + (1 - nu) / (3 + nu) * ri**2)
    u_exact = ri * s_exact / E
    s_fe, u_fe = float(hoop[bore].mean()), float(ur[bore].mean())
    return {"hoop_bore_fe_mpa": s_fe / 1e6, "hoop_bore_exact_mpa": s_exact / 1e6, "hoop_error_pct": (s_fe - s_exact) / s_exact * 100,
            "ur_bore_fe_um": u_fe * 1e6, "ur_bore_exact_um": u_exact * 1e6, "ur_error_pct": (u_fe - u_exact) / u_exact * 100,
            "elements": len(m["elements"])}


def patch_test(sec: "Sector") -> dict:
    """Constant-strain patch test on the impeller mesh (linear field must give uniform exact stress) and free thermal expansion."""
    e0 = np.array([1e-4, -5e-5, 2e-5, 3e-5, 0.0, 1e-5])        # engineering strains
    G = np.array([[e0[0], e0[3] / 2, e0[5] / 2], [e0[3] / 2, e0[1], e0[4] / 2], [e0[5] / 2, e0[4] / 2, e0[2]]])
    u = (sec.nodes @ G.T).ravel()
    S = sec.stresses(u)
    exact = sec.D1 @ e0 * sec.E
    err = float(np.abs(S - exact).max() / np.abs(exact).max() * 100)
    f, eps0 = sec.f_thermal(np.full(sec.n, 100.0))
    th = float(von_mises(sec.stresses(sec.solve(f), eps0=eps0)).max() / 1e6)
    return {"constant_strain_error_pct": err, "free_thermal_vm_mpa": th, "pass": err < 1e-6 and th < 1e-3}


# ---------------------------------------------------------------- element matrices
def _dN(xi):
    """Shape-function derivatives d N / d xi at local point xi: (8, 3)."""
    c = CORNERS
    t = 1 + c * xi
    return np.stack([c[:, 0] * t[:, 1] * t[:, 2], c[:, 1] * t[:, 0] * t[:, 2], c[:, 2] * t[:, 0] * t[:, 1]], 1) / 8


def _N(xi):
    return np.prod(1 + CORNERS * xi, 1) / 8


GPTS = np.array([[a, b, c] for c in GP for b in GP for a in GP])
DN = np.array([_dN(g) for g in GPTS])           # (8gp, 8, 3)
NN = np.array([_N(g) for g in GPTS])            # (8gp, 8)


def _Dmat(E, nu):
    l, m = E * nu / ((1 + nu) * (1 - 2 * nu)), E / (2 * (1 + nu))
    D = np.zeros((6, 6))
    D[:3, :3] = l
    D[np.arange(3), np.arange(3)] += 2 * m
    D[3:, 3:] = np.eye(3) * m
    return D


def _geometry(nodes, els):
    Xe = nodes[els]                                      # (ne, 8, 3)
    J = np.einsum("gak,eaj->egkj", DN, Xe)               # (ne, g, 3, 3): dX_j/dxi_k
    detJ = np.linalg.det(J)
    dNx = np.einsum("egjk,gak->egaj", np.linalg.inv(J), DN)  # dN_a/dX_j = (J^-1)_jk dN_a/dxi_k
    B = np.zeros(J.shape[:2] + (6, 24))
    for a in range(8):
        dx, dy, dz = dNx[..., a, 0], dNx[..., a, 1], dNx[..., a, 2]
        B[..., 0, 3 * a] = dx
        B[..., 1, 3 * a + 1] = dy
        B[..., 2, 3 * a + 2] = dz
        B[..., 3, 3 * a], B[..., 3, 3 * a + 1] = dy, dx
        B[..., 4, 3 * a + 1], B[..., 4, 3 * a + 2] = dz, dy
        B[..., 5, 3 * a], B[..., 5, 3 * a + 2] = dz, dx
    return Xe, detJ, dNx, B


def _assemble(els, Ke, ndof, scale=None):
    dofs = (3 * els[:, :, None] + np.arange(3)).reshape(len(els), 24)
    v = Ke if scale is None else Ke * scale[:, None, None]
    rows = np.repeat(dofs, 24, 1).ravel()
    cols = np.tile(dofs, (1, 24)).ravel()
    return sp.coo_matrix((v.ravel(), (rows, cols)), shape=(ndof, ndof)).tocsr()


# ---------------------------------------------------------------- model
class Sector:
    def __init__(self, m: dict, E: float, nu: float, rho: float, alpha_th: float):
        self.m, self.E, self.nu, self.rho, self.alpha_th = m, E, nu, rho, alpha_th
        self.nodes, self.els = m["nodes"], m["elements"]
        self.n = len(self.nodes)
        self.ndof = 3 * self.n
        self.Xe, self.detJ, self.dNx, self.B = _geometry(self.nodes, self.els)
        self.D1 = _Dmat(1.0, nu)
        self.vol = self.detJ.sum(1)
        self.Ke1 = np.einsum("egik,ij,egjl,eg->ekl", self.B, self.D1, self.B, self.detJ)   # per unit E
        Me = np.einsum("ga,gb,eg->eab", NN, NN, self.detJ) * rho
        self.Me = np.einsum("eab,ij->eaibj", Me, np.eye(3)).reshape(-1, 24, 24)
        self.K0 = _assemble(self.els, self.Ke1, self.ndof) * E
        self.M = _assemble(self.els, self.Me, self.ndof)
        self.dofs = (3 * self.els[:, :, None] + np.arange(3)).reshape(len(self.els), 24)
        self.Xg = np.einsum("ga,eaj->egj", NN, self.Xe)      # gauss point coordinates

    # cyclic reduction u = T u_r
    def T(self, nd: int = 0):
        a = self.m["alpha"]
        c, s = math.cos(a), math.sin(a)
        R = np.array([[c, -s, 0], [s, c, 0], [0, 0, 1]], complex) * (np.exp(1j * nd * a) if nd else 1)
        slave = {int(sv): int(mv) for mv, sv in self.m["pairs"]}
        keep = [i for i in range(self.n) if i not in slave]
        col = {node: q for q, node in enumerate(keep)}
        rows, cols, vals = [], [], []
        for node in range(self.n):
            if node in col:
                for d in range(3):
                    rows.append(3 * node + d); cols.append(3 * col[node] + d); vals.append(1.0)
            else:
                mv = slave[node]
                for d in range(3):
                    for e in range(3):
                        if R[d, e] != 0:
                            rows.append(3 * node + d); cols.append(3 * col[mv] + e); vals.append(R[d, e])
        T = sp.coo_matrix((vals, (rows, cols)), shape=(self.ndof, 3 * len(keep))).tocsr()
        return T if nd else T.real

    def _penalty(self, nd):
        """Full-size penalty matrix: axial restraint of the bore ring at the back face; nd 0 also one tangential restraint."""
        gid = self.m["gid"]
        P = sp.lil_matrix((self.ndof, self.ndof))
        big = 1e3 * self.K0.diagonal().max()
        ring = [gid[0, j, 0] for j in range(gid.shape[1]) if gid[0, j, 0] >= 0]
        for nd_ in ring:
            P[3 * nd_ + 2, 3 * nd_ + 2] = big
        if nd == 0:
            q = ring[len(ring) // 2]
            x, y = self.nodes[q, :2]
            t = np.array([-y, x]) / math.hypot(x, y)
            for a in range(2):
                for b in range(2):
                    P[3 * q + a, 3 * q + b] = big * t[a] * t[b]
        return P.tocsr()

    # loads
    def f_centrifugal(self, w):
        fg = self.rho * w**2 * self.Xg.copy()
        fg[..., 2] = 0
        fe = np.einsum("ga,egj,eg->eaj", NN, fg, self.detJ).reshape(-1, 24)
        return self._scatter(fe)

    def f_thermal(self, dT_nodes, E=None):
        E = E if E is not None else self.E
        dTg = NN @ dT_nodes[self.els].T                     # (g, ne)
        eps0 = np.zeros((len(self.els), 8, 6))
        eps0[..., :3] = (self.alpha_th * dTg.T)[..., None]
        fe = np.einsum("egik,ij,egj,eg->ek", self.B, self.D1 * E, eps0, self.detJ)
        return self._scatter(fe), eps0

    def f_faces(self, faces, pfun):
        """Pressure on element faces [(element, face_name)]; pfun(points (n,3)) -> Pa, acting into the solid."""
        f = np.zeros(self.ndof)
        g2 = np.array([[a, b] for b in GP for a in GP])
        for e, name in faces:
            loc = FACES[name]
            Xf = self.nodes[self.els[e, loc]]
            c = self.nodes[self.els[e]].mean(0)
            for xi, eta in g2:
                Nf = np.array([(1 - xi) * (1 - eta), (1 + xi) * (1 - eta), (1 + xi) * (1 + eta), (1 - xi) * (1 + eta)]) / 4
                dxi = np.array([-(1 - eta), (1 - eta), (1 + eta), -(1 + eta)]) / 4
                deta = np.array([-(1 - xi), -(1 + xi), (1 + xi), (1 - xi)]) / 4
                n = np.cross(dxi @ Xf, deta @ Xf)
                pt = Nf @ Xf
                if np.dot(n, pt - c) < 0:
                    n = -n                                   # outward
                p = float(pfun(pt[None, :])[0])
                for a, node in enumerate(self.els[e, loc]):
                    f[3 * node:3 * node + 3] -= p * Nf[a] * n
        return f

    def _scatter(self, fe):
        f = np.zeros(self.ndof)
        np.add.at(f, self.dofs.ravel(), fe.ravel())
        return f

    # solve
    def solve(self, f, Escale=None):
        K = self.K0 if Escale is None else _assemble(self.els, self.Ke1, self.ndof, Escale * self.E)
        T = self.T(0)
        Kr = (T.T @ (K + self._penalty(0)) @ T).tocsr()
        return T @ spla.spsolve(Kr.tocsc(), T.T @ f)

    def strains(self, u):
        ue = u[self.dofs]                                     # (ne, 24)
        return np.einsum("egij,ej->egi", self.B, ue)        # (ne, g, 6) engineering

    def stresses(self, u, Escale=None, eps0=None):
        eps = self.strains(u)
        if eps0 is not None:
            eps = eps - eps0
        E = self.E * (np.ones(len(self.els)) if Escale is None else Escale)
        return np.einsum("ij,egj->egi", self.D1, eps) * E[:, None, None]


def von_mises(s):
    sx, sy, sz, txy, tyz, txz = np.moveaxis(s, -1, 0)
    return np.sqrt(0.5 * ((sx - sy)**2 + (sy - sz)**2 + (sz - sx)**2) + 3 * (txy**2 + tyz**2 + txz**2))


def cylindrical(s, X):
    """Radial, hoop, axial stress from Cartesian components at points X."""
    th = np.arctan2(X[..., 1], X[..., 0])
    c, sn = np.cos(th), np.sin(th)
    sx, sy, sz, txy = s[..., 0], s[..., 1], s[..., 2], s[..., 3]
    srr = sx * c**2 + sy * sn**2 + 2 * txy * c * sn
    stt = sx * sn**2 + sy * c**2 - 2 * txy * c * sn
    return srr, stt, sz


def principal_max(s):
    sx, sy, sz, txy, tyz, txz = np.moveaxis(s, -1, 0)
    T = np.stack([np.stack([sx, txy, txz], -1), np.stack([txy, sy, tyz], -1), np.stack([txz, tyz, sz], -1)], -2)
    return np.linalg.eigvalsh(T)[..., -1]


# ---------------------------------------------------------------- surfaces for loads and viewing
def surface_faces(m: dict):
    """Boundary faces of the sector (excluding the cyclic faces) with a tag."""
    count = {}
    for e, el in enumerate(m["elements"]):
        for name, loc in FACES.items():
            key = tuple(sorted(el[loc]))
            count.setdefault(key, []).append((e, name))
    gid = m["gid"]
    cyc = set(gid[:, 0, :].ravel()) | set(gid[:, -1, :].ravel())
    out = []
    for key, lst in count.items():
        if len(lst) != 1:
            continue
        e, name = lst[0]
        if set(key) <= cyc and name in ("ymin", "ymax"):
            continue
        out.append((e, name))
    return out


def classify(m: dict, faces):
    """Tag faces: bore, back (disk rear), passage hub, passage shroud, shroud front, blade PS/SS, tip, eye."""
    tags = {}
    nb, npz = m["nb"], m["npz"]
    for e, name in faces:
        i, j, k = m["ijk"][e]
        z = m["zone"][e]
        if name == "xmin" and i == 0:
            t = "bore"
        elif name == "zmin" and k == 0:
            t = "back"
        elif name == "xmax" and i == len(m["rs"]) - 2:
            t = "tip"
        elif z == "hub" and name == "zmax":
            t = "passage_hub" if k == nb - 1 and m["rs"][i] >= m["r_eye"] - 1e-12 else "front_hub"
        elif z == "shroud" and name == "zmin":
            t = "passage_shroud"
        elif z == "shroud" and name == "zmax":
            t = "shroud_front"
        elif z == "blade" and name in ("ymin", "ymax"):
            t = "blade_ps" if name == "ymax" else "blade_ss"
        else:
            t = "other"
        tags.setdefault(t, []).append((e, name))
    return tags


# ---------------------------------------------------------------- analysis
def _nodal_avg(m, val_e):
    """Element (ne,) values -> node averages."""
    n = len(m["nodes"])
    acc, cnt = np.zeros(n), np.zeros(n)
    np.add.at(acc, m["elements"].ravel(), np.repeat(val_e, 8))
    np.add.at(cnt, m["elements"].ravel(), 1)
    return acc / np.maximum(cnt, 1)


def _gauss_to_nodes(m, vg):
    """Gauss values (ne, 8) -> extrapolated to the element corners, then averaged at nodes."""
    # corner a nearest gauss point a (same ordering): use sqrt(3) extrapolation via shape functions at corners
    Ninv = np.linalg.inv(np.array([_N(g) for g in GPTS]))     # maps nodal->gauss; invert
    corner = vg @ Ninv.T                                         # (ne, 8) at corners
    n = len(m["nodes"])
    acc, cnt = np.zeros(n), np.zeros(n)
    np.add.at(acc, m["elements"].ravel(), corner.ravel())
    np.add.at(cnt, m["elements"].ravel(), 1)
    return acc / np.maximum(cnt, 1)


def _fields(sec: Sector, u, S, extra=None):
    m = sec.m
    srr, stt, szz = cylindrical(S, sec.Xg)
    vm = von_mises(S)
    p1 = principal_max(S)
    X = sec.nodes
    th = np.arctan2(X[:, 1], X[:, 0])
    U = u.reshape(-1, 3)
    ur = U[:, 0] * np.cos(th) + U[:, 1] * np.sin(th)
    out = {"von_mises_mpa": _gauss_to_nodes(m, vm) / 1e6, "max_principal_mpa": _gauss_to_nodes(m, p1) / 1e6,
           "hoop_mpa": _gauss_to_nodes(m, stt) / 1e6, "radial_mpa": _gauss_to_nodes(m, srr) / 1e6, "axial_mpa": _gauss_to_nodes(m, szz) / 1e6,
           "ur_um": ur * 1e6, "uz_um": U[:, 2] * 1e6, "disp_um": np.linalg.norm(U, axis=1) * 1e6,
           "strain_ue": _gauss_to_nodes(m, vm / sec.E * 1e6 / (1 + sec.nu) * 1.0), "_u": U}
    if extra:
        out.update(extra)
    return out


def bilinear(eps, E, Sy, Su, elong=0.12):
    ey = Sy / E
    Et = (Su - Sy) / max(elong - ey, 1e-6)
    return np.where(eps <= ey, E * eps, Sy + Et * (eps - ey))


def plastic_solve(sec: Sector, f, Sy, Su, iters=14):
    """Secant (deformation theory) elastic-plastic solution: returns u, stresses, element secant moduli, equivalent strain."""
    Es = np.ones(len(sec.els))
    for _ in range(iters):
        u = sec.solve(f, Es)
        eps = sec.strains(u)
        eq = von_mises(np.einsum("ij,egj->egi", sec.D1, eps)).mean(1) / (1 + sec.nu) * 1.0  # equivalent strain (approx.)
        target = bilinear(eq, sec.E, Sy, Su)
        new = np.clip(target / np.maximum(eq * sec.E, 1e-12), 0.02, 1.0)
        if np.max(np.abs(new - Es)) < 2e-3:
            Es = new
            break
        Es = 0.5 * Es + 0.5 * new
    u = sec.solve(f, Es)
    S = sec.stresses(u, Es)
    eq = von_mises(np.einsum("ij,egj->egi", sec.D1, sec.strains(u))).mean(1) / (1 + sec.nu)
    return u, S, Es, eq


def modes(sec: Sector, nd: int, n_modes: int, Kextra=None):
    T = sec.T(nd)
    K = sec.K0 if Kextra is None else sec.K0 + Kextra
    Kr = (T.conj().T @ (K + sec._penalty(nd)) @ T).tocsr()
    Mr = (T.conj().T @ sec.M @ T).tocsr()
    sigma = -1.0
    try:
        w2, v = spla.eigsh(Kr.tocsc(), k=n_modes, M=Mr.tocsc(), sigma=sigma, which="LM")
    except Exception:  # fallback dense for tiny models
        import scipy.linalg as sl
        w2, v = sl.eigh(Kr.toarray(), Mr.toarray())
        w2, v = w2[:n_modes], v[:, :n_modes]
    order = np.argsort(w2.real)
    w2, v = w2.real[order], v[:, order]
    keep = w2 > (2 * math.pi * 5.0)**2            # drop rigid-body modes (nd 1 in-plane translation)
    w2, v = w2[keep], v[:, keep]
    f = np.sqrt(np.maximum(w2, 0)) / (2 * math.pi)
    return f, T @ v


def geometric_stiffness(sec: Sector, S):
    """Stress stiffening K_G from the Gauss-point prestress S (ne, g, 6)."""
    St = np.stack([np.stack([S[..., 0], S[..., 3], S[..., 5]], -1), np.stack([S[..., 3], S[..., 1], S[..., 4]], -1),
                   np.stack([S[..., 5], S[..., 4], S[..., 2]], -1)], -2)                       # (ne, g, 3, 3)
    H = np.einsum("egai,egij,egbj,eg->eab", sec.dNx, St, sec.dNx, sec.detJ)
    KG = np.einsum("eab,ij->eaibj", H, np.eye(3)).reshape(-1, 24, 24)
    return _assemble(sec.els, KG, sec.ndof)


def spin_softening(sec: Sector, w):
    Ms = np.einsum("ga,gb,eg->eab", NN, NN, sec.detJ) * sec.rho
    P = np.diag([1.0, 1.0, 0.0])
    KS = np.einsum("eab,ij->eaibj", Ms, P).reshape(-1, 24, 24) * (-w**2)
    return _assemble(sec.els, KS, sec.ndof)


def manson_cycles(de, E, Su, ra=0.5):
    """Manson universal slopes: total strain range -> cycles to crack initiation."""
    D = math.log(1 / (1 - ra))
    lo, hi = 1.0, 1e12
    for _ in range(200):
        N = math.sqrt(lo * hi)
        d = 3.5 * Su / E * N**-0.12 + D**0.6 * N**-0.6
        lo, hi = (N, hi) if d > de else (lo, N)
    return math.sqrt(lo * hi)


def analyse(imp: dict, stage: dict, mat: dict, speeds: dict, opts: dict | None = None) -> dict:
    """Full 3D impeller analysis. opts: level, blade_t_mm, interference_mm (diametral), bore_mm, diffuser_vanes,
    igv_vanes, return_vanes, alt_fraction, kt, starts_per_year, life_years, n_modes, max_nd, convergence."""
    o = {"level": 2, "interference_um_per_mm": 0.0, "diffuser_vanes": 0, "igv_vanes": 0, "return_vanes": 0, "alt_fraction": 0.03,
         "kt": 1.6, "starts_per_year": 300, "life_years": 25, "n_modes": 3, "max_nd": 8, "convergence": True, **(opts or {})}
    rec = record("structural.impeller3d", "3D cyclic-sector FEA (hex8): static, plastic overspeed, modes with stress stiffening, fatigue, fit",
                 [imp, o], assumptions=["Parametric impeller from the stage design (hub disk, one blade with constant blade angle, shroud)",
                                        "Bilinear stress-strain curve (yield, UTS at 12 % strain); deformation-theory plasticity",
                                        "Fit pressure from interference and Lamé solid-shaft compliance; lift-off where it reaches zero; auto interference = lift-off at 1.2 x MCS",
                                        "Passage static pressure rises with r^2 (reaction 0.6); blade loading from stage torque",
                                        "Alternating stress = fraction of steady (x3 at a SAFE interference) for the Goodman check"],
                 references=["API 617 8th ed. 2.6.2 impeller overspeed test; 4.2 rotor balancing", "Singh & Vargo SAFE diagram (1989)",
                             "Manson (1965) universal slopes", "Neuber (1961)"])
    vend = imp.get("vendor") or {}
    mo = imp.get("material_override") or {}
    mat = {**mat, **{k: mo[k] for k in ("yield_mpa", "uts_mpa", "poisson", "density_kg_m3") if k in mo}}
    if "E_gpa" in mo:
        mat["E_pa"] = mo["E_gpa"] * 1e9
    E, nu, rho = mat["E_pa"], mat["poisson"], mat["density_kg_m3"]
    a_th = mat["expansion_um_mk"] * 1e-6
    Sy, Su = mat["yield_mpa"] * 1e6, mat["uts_mpa"] * 1e6
    n_mcs = speeds["mcs_rpm"]
    w = n_mcs * math.pi / 30
    n_trip = o.get("trip_rpm") or o.get("trip_factor", 1.10) * n_mcs
    os_f = o.get("overspeed_factor", 1.15)
    trip = n_trip * math.pi / 30
    bore_d = o.get("bore_mm") and o["bore_mm"] / 1e3
    bt = o.get("blade_t_mm") and o["blade_t_mm"] / 1e3
    thick = match_mass(imp, bore_d, bt, rho, o.get("target_mass_kg") or vend.get("mass_kg"), o.get("target_ip_kgm2") or vend.get("ip_kgm2"))
    m = build_mesh(imp, bore_d, o["level"], bt, thick)
    mesh_mass = fe_mass_properties(m, rho)
    sec = Sector(m, E, nu, rho, a_th)
    faces = surface_faces(m)
    tags = classify(m, faces)
    X = m["nodes"]
    rN = np.hypot(X[:, 0], X[:, 1])
    r1, r2, rb = m["r_eye"], m["r_tip"], m["r_bore"]

    # gas pressures (Pa)
    p1, p_out = stage["P_in_bara"] * 1e5, stage["P_out_bara"] * 1e5
    p2 = p1 + 0.6 * (p_out - p1)
    rho_g = stage.get("rho_out", 10.0)
    pg = lambda P: p1 + (p2 - p1) * np.clip((np.hypot(P[:, 0], P[:, 1])**2 - r1**2) / (r2**2 - r1**2), 0, 1)  # noqa: E731
    cav = lambda P: p2 - 0.5 * rho_g * (0.5 * w)**2 * (r2**2 - np.hypot(P[:, 0], P[:, 1])**2)  # noqa: E731
    torque = stage["power_kw"] * 1e3 / w
    rr = np.linspace(r1, r2, 30)
    bb = m["b2"] + 1.6 * m["b2"] * (r2 - rr) / (r2 - r1)
    dp_blade = torque / (m["Z"] * np.sum(0.5 * (rr[1:] * bb[1:] + rr[:-1] * bb[:-1]) * np.diff(rr)))
    f_p = np.zeros(sec.ndof)
    for t, fun in (("passage_hub", pg), ("passage_shroud", pg), ("back", cav), ("shroud_front", cav), ("tip", lambda P: np.full(len(P), p2)),
                   ("blade_ps", lambda P: pg(P) + dp_blade / 2), ("blade_ss", lambda P: pg(P) - dp_blade / 2)):
        if t in tags:
            f_p += sec.f_faces(tags[t], fun)
    # temperature: gas outlet temperature at the rim, 20 K lower at the bore
    T_out = mo.get("temperature_c", stage["T_out_c"])
    dT = (T_out - 20.0) - 20.0 * (r2 - rN) / (r2 - rb)
    f_t, eps0 = sec.f_thermal(dT)
    # shrink fit: unit bore pressure
    f_fit1 = sec.f_faces(tags["bore"], lambda P: np.full(len(P), 1e6))
    bore_nodes = np.unique(m["elements"][[e for e, _ in tags["bore"]]][:, FACES["xmin"]].ravel())

    def ur_bore(u):
        U = u.reshape(-1, 3)
        th = np.arctan2(X[bore_nodes, 1], X[bore_nodes, 0])
        return float(np.mean(U[bore_nodes, 0] * np.cos(th) + U[bore_nodes, 1] * np.sin(th)))

    f_c1 = sec.f_centrifugal(1.0)
    u_c1 = sec.solve(f_c1)                     # per unit omega^2
    u_fit1 = sec.solve(f_fit1)                 # per MPa
    c_imp = ur_bore(u_fit1) / 1e6              # m/Pa
    c_shaft = (1 - nu) * rb / E                # solid shaft radial compression per Pa
    g_imp = ur_bore(u_c1)                       # bore growth per omega^2
    g_shaft = (1 - nu) * rho * rb**3 / (4 * E)  # solid shaft surface growth per omega^2
    d_min = o.get("min_radial_interference_mm") or vend.get("min_radial_interference_mm")
    if o["interference_um_per_mm"]:
        delta = o["interference_um_per_mm"] * 1e-6 * 2 * rb * 1e3 / 2   # radial interference (m)
    elif d_min:
        delta = d_min / 1e3
    else:  # auto: interference for lift-off at 1.2 x MCS
        delta = (g_imp - g_shaft) * (1.2 * w) ** 2

    def p_fit(om):
        return max(0.0, (delta - (g_imp - g_shaft) * om**2) / (c_imp + c_shaft))
    w_lift = math.sqrt(delta / max(g_imp - g_shaft, 1e-30))

    u_p = sec.solve(f_p)
    u_t = sec.solve(f_t)
    cases = {}

    def case(name, om, fit=True, pres=True, therm=True):
        u = u_c1 * om**2 + (u_fit1 * p_fit(om) / 1e6 if fit else 0) + (u_p if pres else 0) + (u_t if therm else 0)
        S = sec.stresses(u, eps0=eps0 if therm else None)
        cases[name] = (u, S)
        return u, S

    case("Standstill (fit only)", 0.0, True, False, False)
    case("Centrifugal MCS", w, False, False, False)
    case("MCS combined", w)
    case("Trip combined", trip)
    # overspeed test: centrifugal + fit at room temperature, elastic-plastic
    wo = os_f * w
    f_os = f_c1 * wo**2 + f_fit1 * p_fit(wo) / 1e6
    u_os, S_os, Es, eq_os = plastic_solve(sec, f_os, Sy, Su)
    u_el = sec.solve(f_os)
    u_res = u_os - u_el
    eps_pl = np.maximum(eq_os - bilinear(eq_os, E, Sy, Su) / E, 0)
    cases["Overspeed 115 % (elastic-plastic)"] = (u_os, S_os)

    out_cases = {}
    for name, (u, S) in cases.items():
        extra = {}
        if name.startswith("Overspeed"):
            extra = {"plastic_strain_ue": _nodal_avg(m, eps_pl) * 1e6, "residual_ur_um": None}
            U = u_res.reshape(-1, 3)
            th = np.arctan2(X[:, 1], X[:, 0])
            extra["residual_ur_um"] = (U[:, 0] * np.cos(th) + U[:, 1] * np.sin(th)) * 1e6
        fl = _fields(sec, u, S, extra)
        fl["safety_factor"] = np.clip(Sy / 1e6 / np.maximum(fl["von_mises_mpa"], 1e-3), 0, 10)
        fl["temperature_c"] = dT + 20.0 if "combined" in name else np.full(len(X), 20.0)
        out_cases[name] = fl

    # speed sweep for the overspeed animation (elastic-plastic frames)
    frames = []
    for frac in (0.0, 0.5, 0.8, 1.0, 1.05, 1.10, os_f):
        om = frac * w
        if frac <= 1.0:
            fr = sec.stresses(u_c1 * om**2 + u_fit1 * p_fit(om) / 1e6)
            vm = von_mises(fr).max()
            frames.append({"speed_frac": frac, "max_vm_mpa": float(vm / 1e6), "plastic_volume_pct": 0.0,
                           "tip_growth_um": float(_fields(sec, u_c1 * om**2, fr)["ur_um"].max())})
        else:
            fo = f_c1 * om**2 + f_fit1 * p_fit(om) / 1e6
            uu, SS, EE, eqq = plastic_solve(sec, fo, Sy, Su, iters=10)
            pv = float((sec.vol * (eqq > Sy / E)).sum() / sec.vol.sum() * 100)
            frames.append({"speed_frac": frac, "max_vm_mpa": float(von_mises(SS).max() / 1e6), "plastic_volume_pct": pv,
                           "tip_growth_um": float(_fields(sec, uu, SS)["ur_um"].max())})

    # modes with stress stiffening at MCS
    S_mcs = cases["Centrifugal MCS"][1]
    KG = geometric_stiffness(sec, S_mcs)
    KS = spin_softening(sec, w)
    nds = list(range(0, min(m["Z"] // 2, o["max_nd"]) + 1))
    mode_rows, shapes = [], []
    for nd in nds:
        f0, _ = modes(sec, nd, o["n_modes"] + 1)
        fm, vm_ = modes(sec, nd, o["n_modes"] + 1, KG + KS)
        for q in range(min(o["n_modes"], len(f0), len(fm))):
            mode_rows.append({"nd": nd, "mode": q + 1, "f0_hz": float(f0[q]), "f_mcs_hz": float(fm[q])})
            if q < 2:
                v = vm_[:, q].reshape(-1, 3)
                v = v / max(np.abs(v).max(), 1e-30)
                shapes.append({"nd": nd, "mode": q + 1, "f_mcs_hz": float(fm[q]), "re": np.real(v).round(4).tolist(),
                               "im": np.imag(v).round(4).tolist()})

    # SAFE / Campbell interference
    n_min = speeds.get("min_rpm", 0.7 * n_mcs)
    exc = [(f"{n}x (rotor / stall / volute)", n) for n in range(1, 7)]
    for lbl, cnt in (("Diffuser vanes", o["diffuser_vanes"]), ("IGV vanes", o["igv_vanes"]), ("Return vanes", o["return_vanes"])):
        if cnt:
            exc += [(f"{lbl} {cnt}", cnt), (f"{lbl} 2x{cnt}", 2 * cnt)]
    Z = m["Z"]
    hits = []
    for name, eo in exc:
        k = eo % Z
        k = min(k, Z - k)
        for r_ in mode_rows:
            if r_["nd"] != k:
                continue
            # frequency at speed N: f^2 = f0^2 + (fm^2 - f0^2)(N/Nmcs)^2; resonance f = eo N / 60
            a2 = r_["f0_hz"]**2
            b2_ = (r_["f_mcs_hz"]**2 - a2) / n_mcs**2
            c = (eo / 60)**2 - b2_
            if c <= 0:
                continue
            Nres = math.sqrt(a2 / c)
            margin = (Nres - n_mcs) / n_mcs if Nres > n_mcs else (n_min - Nres) / n_min if Nres < n_min else -1.0
            hits.append({"excitation": name, "order": eo, "nd": k, "mode": r_["mode"], "resonance_rpm": Nres,
                         "f_hz": eo * Nres / 60, "in_range": n_min <= Nres <= 1.05 * n_mcs, "margin": margin})
    hits.sort(key=lambda h: h["margin"])
    interference = any(h["in_range"] for h in hits if h["order"] > 6)

    # summary values
    mc = out_cases["MCS combined"]
    solid = np.ones(len(X), bool)
    vm_peak = float(mc["von_mises_mpa"].max())
    loc = X[int(np.argmax(mc["von_mises_mpa"]))]
    sig_th_avg = float(np.sum(cylindrical(cases["Centrifugal MCS"][1], sec.Xg)[1].mean(1) * sec.vol) / sec.vol.sum())
    burst_rpm = n_mcs * math.sqrt(0.9 * Su / max(sig_th_avg, 1.0))
    # fatigue
    Se = mat.get("endurance_mpa", 0.45 * mat["uts_mpa"]) * 1e6 * 0.8
    sm = von_mises(cases["MCS combined"][1]).mean(1)
    sa = sm * o["alt_fraction"] * (3.0 if interference else 1.0)
    sf_g = 1 / np.maximum(sa / Se + sm / Su, 1e-9)
    e_hcf = int(np.argmin(sf_g))
    peak_e = int(np.argmax(sm))
    s_loc = o["kt"] * sm[peak_e]                               # elastic local, Neuber: sigma*eps = (Kt S)^2/E
    eps_loc = s_loc / E if s_loc <= Sy else (s_loc**2 / E) / max(bilinear(np.array(s_loc / E), E, Sy, Su).item(), Sy)
    n_lcf = manson_cycles(eps_loc, E, Su)
    starts = o["starts_per_year"] * o["life_years"]
    res_growth = out_cases["Overspeed 115 % (elastic-plastic)"]["residual_ur_um"]
    eye_nodes = [i for i in range(len(X)) if abs(rN[i] - r1) < 1e-6]
    summary = {
        "peak_vm_mcs_mpa": vm_peak, "peak_location_mm": (loc * 1e3).round(1).tolist(), "peak_zone": str(m["zone"][int(np.argmax(sm))]),
        "peak_vm_overspeed_mpa": float(out_cases["Overspeed 115 % (elastic-plastic)"]["von_mises_mpa"].max()),
        "yield_utilisation_mcs": vm_peak * 1e6 / Sy, "min_safety_factor_mcs": float(mc["safety_factor"].min()),
        "plastic_volume_overspeed_pct": frames[-1]["plastic_volume_pct"],
        "permanent_bore_growth_um": float(np.mean(res_growth[bore_nodes])), "permanent_tip_growth_um": float(res_growth[np.argmax(rN)]),
        "permanent_eye_growth_um": float(np.mean(res_growth[eye_nodes])) if eye_nodes else 0.0,
        "average_hoop_mpa": sig_th_avg / 1e6, "burst_speed_rpm": burst_rpm, "burst_margin": burst_rpm / n_mcs,
        "fit_interference_um": delta * 2e6, "fit_pressure_standstill_mpa": p_fit(0) / 1e6, "fit_pressure_mcs_mpa": p_fit(w) / 1e6,
        "lift_off_rpm": w_lift * 30 / math.pi, "lift_off_ratio": w_lift / w,
        "goodman_sf_min": float(sf_g[e_hcf]), "goodman_zone": str(m["zone"][e_hcf]), "alternating_mpa": float(sa[e_hcf] / 1e6),
        "mean_mpa": float(sm[e_hcf] / 1e6), "endurance_mpa": Se / 1e6, "lcf_cycles": n_lcf, "lcf_required": starts,
        "lcf_ratio": n_lcf / max(starts, 1), "safe_interference": interference,
        "blade_pressure_difference_kpa": dp_blade / 1e3, "elements": len(m["elements"]), "nodes": len(X), "dof": sec.ndof}
    checks = [
        ("Yield utilisation at MCS (combined)", "<= 0.90", summary["yield_utilisation_mcs"], summary["yield_utilisation_mcs"] <= 0.9),
        ("Burst margin (average hoop)", ">= 1.25", summary["burst_margin"], summary["burst_margin"] >= 1.25),
        ("Fit lift-off speed / MCS", ">= 1.15", summary["lift_off_ratio"], summary["lift_off_ratio"] >= 1.15),
        ("Goodman safety factor (HCF)", ">= 1.5", summary["goodman_sf_min"], summary["goodman_sf_min"] >= 1.5),
        ("LCF life / required starts", ">= 2", summary["lcf_ratio"], summary["lcf_ratio"] >= 2),
        ("SAFE: no blade-passing interference in the speed range", "none", "yes" if interference else "none", not interference),
        ("Permanent bore growth after overspeed", "<= 0.05 % of bore", summary["permanent_bore_growth_um"],
         summary["permanent_bore_growth_um"] <= 0.0005 * rb * 1e6),
    ]
    for c_ in checks:
        if not c_[3]:
            rec.warn(f"Impeller {imp['index'] + 1}: {c_[0]} = {c_[2] if isinstance(c_[2], str) else round(c_[2], 3)} (criterion {c_[1]})")

    # paths: blade root on the hub, shroud inner, bore, back face (radial lines at the blade centre)
    gid = m["gid"]
    jc = m["nside"] + m["nblade"] // 2
    nb, npz = m["nb"], m["npz"]
    paths = {}
    ni = gid.shape[0]
    for pname, idx in (("Blade root (hub)", [gid[i, jc, nb] for i in range(ni)]), ("Shroud inner", [gid[i, jc, nb + npz] for i in range(ni)]),
                       ("Disk back face", [gid[i, jc, 0] for i in range(ni)]), ("Bore (axial)", [gid[0, jc, k] for k in range(nb + 1)])):
        idx = [int(q) for q in idx if q >= 0]
        coord = (np.hypot(X[idx, 0], X[idx, 1]) if "Bore" not in pname else X[idx, 2]) * 1e3
        paths[pname] = {"x_mm": coord.round(2).tolist(), "axis": "z (mm)" if "Bore" in pname else "r (mm)",
                        "cases": {c: {k: v[idx].round(2).tolist() for k, v in out_cases[c].items() if k.endswith("_mpa")} for c in out_cases}}

    # convergence: centrifugal MCS peak von Mises and tip growth at three mesh levels
    conv = []
    if o["convergence"]:
        for lv in (1, 2, 3):
            if lv == o["level"]:
                uu = u_c1 * w**2
                SS = cases["Centrifugal MCS"][1]
                s2 = sec
            else:
                m2 = build_mesh(imp, bore_d, lv, bt, thick)
                s2 = Sector(m2, E, nu, rho, a_th)
                uu = s2.solve(s2.f_centrifugal(w))
                SS = s2.stresses(uu)
            U = uu.reshape(-1, 3)
            Xn = s2.nodes
            th = np.arctan2(Xn[:, 1], Xn[:, 0])
            conv.append({"level": lv, "dof": s2.ndof, "peak_vm_mpa": float(von_mises(SS).max() / 1e6),
                         "avg_hoop_mpa": float(np.sum(cylindrical(SS, s2.Xg)[1].mean(1) * s2.vol) / s2.vol.sum() / 1e6),
                         "tip_growth_um": float((U[:, 0] * np.cos(th) + U[:, 1] * np.sin(th)).max() * 1e6)})
        if len(conv) == 3:
            a_, b_, c_ = (q["avg_hoop_mpa"] for q in conv)
            summary["convergence_error_pct"] = abs(c_ - b_) / max(abs(c_), 1e-9) * 100

    # bore radial deformation along the bore (free impeller, centrifugal at MCS) vs the minimum radial interference
    ring_k = [[int(q) for q in gid[0, :, k] if q >= 0] for k in range(gid.shape[2])]
    ring_k = [r_ for r_ in ring_k if r_]
    zb = np.array([X[r_, 2].mean() for r_ in ring_k])
    Uc = (u_c1 * w**2).reshape(-1, 3)
    urb = np.array([np.mean(Uc[r_, 0] * np.cos(np.arctan2(X[r_, 1], X[r_, 0])) + Uc[r_, 1] * np.sin(np.arctan2(X[r_, 1], X[r_, 0]))) for r_ in ring_k])
    ur_sh = g_shaft * w**2
    d_ref = d_min / 1e3 if d_min else delta
    c_len = contact_length(zb, urb - ur_sh, d_ref)
    bore_path = {"z_mm": (zb * 1e3).round(2).tolist(), "ur_mm": (urb * 1e3).round(5).tolist(), "shaft_growth_mm": ur_sh * 1e3,
                 "min_radial_interference_mm": d_ref * 1e3, "interference_source": "vendor / input" if d_min else "model (lift-off at 1.2 x MCS)",
                 "contact_length_pct": c_len, "axial_length_mm": float((zb.max() - zb.min()) * 1e3)}
    os_ratio = os_f**2
    hoop_mcs = float(mc["hoop_mpa"].max())
    summary.update({"max_bore_ur_mm": float(urb.max() * 1e3), "min_radial_interference_mm": d_ref * 1e3, "contact_length_pct": c_len,
                    "peak_hoop_mcs_mpa": hoop_mcs, "peak_vm_overspeed_scaled_mpa": vm_peak * os_ratio, "overspeed_ratio_sq": os_ratio,
                    "peak_vm_overspeed_ep_mpa": summary["peak_vm_overspeed_mpa"], "fe_mass_kg": mesh_mass["mass_kg"], "thickness_factor": thick})
    perm_lim = 0.0005 * rb * 1e6
    acceptance = [
        ("Max von Mises at MCS < yield", vm_peak, Sy / 1e6, "MPa", vm_peak < Sy / 1e6),
        (f"Max von Mises at overspeed (scaled x{os_ratio:.3f}) < yield", vm_peak * os_ratio, Sy / 1e6, "MPa", vm_peak * os_ratio < Sy / 1e6),
        ("Max von Mises at overspeed (elastic-plastic) < UTS", summary["peak_vm_overspeed_mpa"], Su / 1e6, "MPa", summary["peak_vm_overspeed_mpa"] < Su / 1e6),
        ("Bore contact length at MCS >= 50 % of axial length", c_len, 50.0, "%", c_len >= 50),
        ("Fit lift-off speed / MCS >= 1.15", summary["lift_off_ratio"], 1.15, "-", summary["lift_off_ratio"] >= 1.15),
        ("Permanent bore growth after overspeed <= 0.05 % of bore", summary["permanent_bore_growth_um"], perm_lim, "um", summary["permanent_bore_growth_um"] <= perm_lim),
        ("SAFE: no blade-passing interference in the speed range", 1.0 if interference else 0.0, 0.0, "hits", not interference),
        ("Goodman safety factor (HCF) >= 1.5", summary["goodman_sf_min"], 1.5, "-", summary["goodman_sf_min"] >= 1.5),
        ("LCF life / required starts >= 2", summary["lcf_ratio"], 2.0, "-", summary["lcf_ratio"] >= 2)]
    acceptance = [{"criterion": a, "value": b, "limit": c, "unit": d, "status": "pass" if e else "fail"} for a, b, c, d, e in acceptance]
    summary["qualified"] = all(a["status"] == "pass" for a in acceptance[:4])
    if c_len < 50:
        rec.warn(f"Impeller {imp['index'] + 1}: bore contact length at MCS {c_len:.0f} % < 50 % of the bore length")

    # inputs (vendor-report style tables)
    D2m = r2 * 2
    sp_rows = [("Rated", speeds.get("rated_rpm") or n_mcs / 1.05), ("Maximum continuous (MCS)", n_mcs), ("Trip", n_trip), ("Overspeed test", os_f * n_mcs)]
    ref = {"mass_kg": vend.get("mass_kg"), "cg_mm": vend.get("cg_mm"), "ip_kgm2": vend.get("ip_kgm2"), "it_kgm2": vend.get("it_kgm2")}
    est = imp.get("estimate") or imp
    inputs = {
        "speeds": [{"speed": a, "rpm": b, "ratio_mcs": b / n_mcs, "tip_speed_m_s": b * math.pi / 30 * r2} for a, b in sp_rows],
        "basic": [{"parameter": "Outer diameter D2", "unit": "mm", "value": D2m * 1e3, "vendor": vend.get("D2_mm")},
                  {"parameter": "Bore diameter", "unit": "mm", "value": rb * 2e3, "vendor": vend.get("bore_mm")},
                  {"parameter": "Exit width b2", "unit": "mm", "value": m["b2"] * 1e3, "vendor": vend.get("b2_mm")},
                  {"parameter": "Blades", "unit": "-", "value": m["Z"], "vendor": vend.get("blades")}] +
                 [{"parameter": lbl, "unit": u_, "value": mesh_mass[k], "vendor": ref[k], "estimate": est.get(k)}
                  for k, lbl, u_ in (("mass_kg", "Mass (FE model)", "kg"), ("cg_mm", "Axial CG from back face", "mm"),
                                     ("ip_kgm2", "Polar inertia Ip", "kg m2"), ("it_kgm2", "Transverse inertia It (about CG)", "kg m2"))],
        "material": {"name": mat.get("key"), "E_gpa": E / 1e9, "poisson": nu, "density_kg_m3": rho, "yield_mpa": Sy / 1e6, "uts_mpa": Su / 1e6,
                     "expansion_um_mk": a_th * 1e6, "temperature_range_c": [float(stage.get("T_in_c", 20.0)), float(T_out)],
                     "source": "vendor" if mo else "database (derated to temperature)"}}
    for b_ in inputs["basic"]:
        b_["diff_pct"] = (b_["value"] - b_["vendor"]) / b_["vendor"] * 100 if b_.get("vendor") else None
    model = {"element": "8-node hexahedron (hex8, 2x2x2 Gauss)", "elements": len(m["elements"]), "nodes": len(X), "dof": sec.ndof,
             "elements_full": len(m["elements"]) * m["Z"], "nodes_full": len(X) * m["Z"], "sector_deg": 360 / m["Z"], "thickness_factor": thick,
             "restraints": ["Cyclic symmetry on both sector faces (u_slave = R(alpha) u_master)", "Axial restraint of the bore ring at the back face",
                            "One tangential restraint (rigid-body rotation) for the static cases", "Shrink fit as bore contact pressure (Lame shaft compliance)"],
             "loads": [f"Centrifugal: MCS {n_mcs:.0f} rpm, trip {n_trip:.0f} rpm, overspeed {os_f * n_mcs:.0f} rpm",
                       f"Gas pressure: passage {p1 / 1e5:.1f}-{p2 / 1e5:.1f} bara, cavities, blade loading dp {dp_blade / 1e3:.1f} kPa",
                       f"Temperature: {T_out:.0f} C at the rim, 20 K lower at the bore", f"Shrink fit: radial interference {delta * 1e3:.3f} mm"]}
    validation = {"patch": patch_test(sec), "disc": rotating_disc_check(E, nu, rho, rb, r2, w)}

    faces_v = [m["elements"][e][FACES[n]].tolist() for e, n in faces]
    return {
        "impeller": imp["index"] + 1, "summary": summary,
        "checks": [{"check": a, "criterion": b, "value": c, "status": "pass" if d else "fail"} for a, b, c, d in checks],
        "cases": {c: {k: np.asarray(v).round(3).tolist() for k, v in f.items() if not k.startswith("_") and v is not None} for c, f in out_cases.items()},
        "displacement_um": {c: (f["_u"] * 1e6).round(2).tolist() for c, f in out_cases.items()},
        "mesh": {"nodes_mm": (X * 1e3).round(3).tolist(), "faces": faces_v, "Z": m["Z"], "alpha": m["alpha"],
                 "r_tip_mm": r2 * 1e3, "r_eye_mm": r1 * 1e3, "r_bore_mm": rb * 1e3, "level": m["level"]},
        "modes": mode_rows, "mode_shapes": shapes, "safe": {"excitations": [{"name": n_, "order": eo} for n_, eo in exc], "hits": hits[:40],
                                                           "speed_range_rpm": [n_min, n_mcs], "Z": Z},
        "overspeed_frames": frames, "paths": paths, "convergence": conv, "bore_path": bore_path, "acceptance": acceptance,
        "inputs": inputs, "model": model, "validation": validation,
        "fit": {"interference_um": delta * 2e6, "lift_off_rpm": w_lift * 30 / math.pi,
                "curve": [{"rpm": f_ * n_mcs, "pressure_mpa": p_fit(f_ * w) / 1e6} for f_ in np.linspace(0, 1.3, 27)]},
        "material": {"name": mat.get("key"), "yield_mpa": Sy / 1e6, "uts_mpa": Su / 1e6, "E_gpa": E / 1e9},
        "speeds": {"mcs_rpm": n_mcs, "trip_rpm": n_trip, "overspeed_rpm": os_f * n_mcs, "min_rpm": n_min},
        "trace": rec, "_faces": faces,
        "_sector": sec, "_u": {c: f["_u"] for c, f in out_cases.items()}, "_fields": out_cases,
    }


def summary_row(res: dict) -> dict:
    """One row of the all-impellers table."""
    s = res["summary"]
    return {"impeller": res["impeller"], "max_vm_mcs_mpa": s["peak_vm_mcs_mpa"], "max_hoop_mcs_mpa": s["peak_hoop_mcs_mpa"],
            "max_vm_overspeed_scaled_mpa": s["peak_vm_overspeed_scaled_mpa"], "max_vm_overspeed_ep_mpa": s["peak_vm_overspeed_mpa"],
            "yield_mpa": res["material"]["yield_mpa"], "max_bore_ur_mm": s["max_bore_ur_mm"], "min_radial_interference_mm": s["min_radial_interference_mm"],
            "contact_length_pct": s["contact_length_pct"], "fe_mass_kg": s["fe_mass_kg"], "qualified": s["qualified"],
            "fails": [a["criterion"] for a in res["acceptance"] if a["status"] != "pass"]}


# ---------------------------------------------------------------- exports
def to_vtu(res: dict, full: bool = True) -> str:
    """ParaView unstructured grid (hexahedra); full 360 by rotating the sector."""
    sec: Sector = res["_sector"]
    m = sec.m
    X, E_ = sec.nodes, sec.els
    Z = m["Z"] if full else 1
    pts, cells, data = [], [], {}
    for s in range(Z):
        a = s * m["alpha"]
        R = np.array([[math.cos(a), -math.sin(a), 0], [math.sin(a), math.cos(a), 0], [0, 0, 1]])
        pts.append(X @ R.T)
        cells.append(E_ + s * len(X))
    P = np.vstack(pts)
    C = np.vstack(cells)
    out = ['<?xml version="1.0"?>', '<VTKFile type="UnstructuredGrid" version="0.1" byte_order="LittleEndian">', "<UnstructuredGrid>",
           f'<Piece NumberOfPoints="{len(P)}" NumberOfCells="{len(C)}">', "<PointData>"]
    for case, fl in res["_fields"].items():
        for k, v in fl.items():
            if k.startswith("_") or v is None:
                continue
            arr = np.tile(np.asarray(v), Z)
            nm = f"{case} | {k}".replace('"', "")
            out.append(f'<DataArray type="Float32" Name="{nm}" format="ascii">' + " ".join(f"{q:.4g}" for q in arr) + "</DataArray>")
    out += ["</PointData>", "<Points>", '<DataArray type="Float32" NumberOfComponents="3" format="ascii">' +
            " ".join(f"{q:.6g}" for q in P.ravel() * 1e3) + "</DataArray>", "</Points>", "<Cells>",
            '<DataArray type="Int32" Name="connectivity" format="ascii">' + " ".join(map(str, C.ravel())) + "</DataArray>",
            '<DataArray type="Int32" Name="offsets" format="ascii">' + " ".join(str(8 * (i + 1)) for i in range(len(C))) + "</DataArray>",
            '<DataArray type="UInt8" Name="types" format="ascii">' + " ".join(["12"] * len(C)) + "</DataArray>",
            "</Cells>", "</Piece>", "</UnstructuredGrid>", "</VTKFile>"]
    return "\n".join(out)


def to_calculix(res: dict, mat: dict, rpm: float) -> str:
    """CalculiX deck of the full 360 impeller (C3D8, centrifugal load) for an independent check."""
    sec: Sector = res["_sector"]
    m = sec.m
    X, E_ = sec.nodes, sec.els
    lines = ["** CentriForge 3D impeller (full 360, C3D8) - centrifugal load at the given speed", "*NODE, NSET=NALL"]
    n = len(X)
    for s in range(m["Z"]):
        a = s * m["alpha"]
        R = np.array([[math.cos(a), -math.sin(a), 0], [math.sin(a), math.cos(a), 0], [0, 0, 1]])
        for i, p in enumerate(X @ R.T):
            lines.append(f"{s * n + i + 1}, {p[0]:.7e}, {p[1]:.7e}, {p[2]:.7e}")
    lines.append("*ELEMENT, TYPE=C3D8, ELSET=EALL")
    k = 1
    for s in range(m["Z"]):
        for el in E_:
            lines.append(f"{k}, " + ", ".join(str(s * n + q + 1) for q in el))
            k += 1
    ring = [int(m["gid"][0, j, 0]) for j in range(m["gid"].shape[1]) if m["gid"][0, j, 0] >= 0]
    lines += ["*NSET, NSET=FIX", ", ".join(str(s * n + q + 1) for s in range(m["Z"]) for q in ring),
              "*MATERIAL, NAME=MAT", "*ELASTIC", f"{mat['E_pa']:.6e}, {mat['poisson']}", "*DENSITY", f"{mat['density_kg_m3']}",
              "*SOLID SECTION, ELSET=EALL, MATERIAL=MAT"]
    # rigid body: axial at the bore ring, node A fixed in-plane, node B (opposite) fixed normal to AB
    A, B = ring[0], (m["Z"] // 2) * n + ring[0]
    pa = X[ring[0]]
    Rb = np.array([[math.cos((m["Z"] // 2) * m["alpha"]), -math.sin((m["Z"] // 2) * m["alpha"])], [math.sin((m["Z"] // 2) * m["alpha"]), math.cos((m["Z"] // 2) * m["alpha"])]])
    pb = Rb @ pa[:2]
    d = (pb - pa[:2]) / np.linalg.norm(pb - pa[:2])
    lines += ["*NSET, NSET=NB", f"{B + 1}", "*TRANSFORM, NSET=NB, TYPE=R", f"{d[0]:.6f}, {d[1]:.6f}, 0., {-d[1]:.6f}, {d[0]:.6f}, 0.",
              "*BOUNDARY", "FIX, 3, 3", f"{A + 1}, 1, 2", "NB, 2, 2",
              "*STEP", "*STATIC", "*DLOAD", f"EALL, CENTRIF, {(rpm * math.pi / 30) ** 2:.6e}, 0., 0., 0., 0., 0., 1.",
              "*NODE FILE", "U", "*EL FILE", "S", "*END STEP"]
    return "\n".join(lines) + "\n"
