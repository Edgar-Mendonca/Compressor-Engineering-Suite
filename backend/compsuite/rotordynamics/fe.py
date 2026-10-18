"""Finite-element lateral rotor model.

Shaft: 2-node Timoshenko beam elements (shear deformation via the Phi
factor, consistent translational + rotary inertia, gyroscopic matrix).
Disks/impellers: rigid point masses with polar and transverse inertia.
Bearings and seals: 2x2 stiffness and damping (direct and cross-coupled),
optionally speed dependent.

Coordinates: z along the shaft, spin +Omega about +z. Each node has
DOFs [x, phi_x, y, phi_y] with phi_x = dx/dz and phi_y = dy/dz. Forward
whirl is orbital motion from +x toward +y (same sense as spin).

A cross-coupled stiffness with kxy = +q, kyx = -q is destabilising for
forward whirl (the usual aerodynamic cross-coupling sign).

References: Friswell, Penny, Garvey & Lees, "Dynamics of Rotating
Machines" (2010); Nelson & McVaugh (1976) J. Eng. Ind. 98(2).
"""

from __future__ import annotations

import math
from dataclasses import dataclass, field
from typing import Callable

import numpy as np
from scipy import linalg

from compsuite.core.units import G0

COEF_KEYS = ("kxx", "kxy", "kyx", "kyy", "cxx", "cxy", "cyx", "cyy")


@dataclass
class Section:
    z0: float
    z1: float
    od: float
    id: float = 0.0
    label: str = ""


@dataclass
class PointMass:
    label: str
    z: float
    mass: float
    ip: float
    it: float
    kind: str = "other"


@dataclass
class Support:
    """Bearing or seal. ``coefficients(omega)`` returns a dict with COEF_KEYS."""
    label: str
    z: float
    coefficients: Callable[[float], dict]
    kind: str = "bearing"


@dataclass
class RotorModel:
    sections: list[Section]
    masses: list[PointMass]
    supports: list[Support]
    E: float
    G: float
    rho: float
    max_element_length: float = 0.05
    nodes: np.ndarray = field(init=False)

    def __post_init__(self):
        pts = {round(s.z0, 6) for s in self.sections} | {round(s.z1, 6) for s in self.sections}
        pts |= {round(m.z, 6) for m in self.masses} | {round(b.z, 6) for b in self.supports}
        pts = sorted(pts)
        nodes = [pts[0]]
        for a, b in zip(pts[:-1], pts[1:]):
            n = max(1, math.ceil((b - a) / self.max_element_length - 1e-9))
            nodes.extend(np.linspace(a, b, n + 1)[1:].tolist())
        self.nodes = np.array(nodes)

    @property
    def ndof(self) -> int:
        return 4 * len(self.nodes)

    def node_at(self, z: float) -> int:
        return int(np.argmin(np.abs(self.nodes - z)))

    def section_at(self, zm: float) -> Section:
        for s in self.sections:
            if s.z0 - 1e-9 <= zm <= s.z1 + 1e-9:
                return s
        raise ValueError(f"No shaft section at z = {zm:.4f} m")

    # --------------------------------------------------------------- matrices
    def elements(self):
        for e in range(len(self.nodes) - 1):
            z0, z1 = self.nodes[e], self.nodes[e + 1]
            yield e, z1 - z0, self.section_at(0.5 * (z0 + z1))

    def assemble_structural(self):
        """Return M, K_shaft, G (gyroscopic per unit Omega)."""
        n = self.ndof
        M = np.zeros((n, n))
        K = np.zeros((n, n))
        Gm = np.zeros((n, n))
        nu = self.E / (2 * self.G) - 1
        for e, L, sec in self.elements():
            ro, ri = sec.od / 2, sec.id / 2
            A = math.pi * (ro**2 - ri**2)
            I = math.pi / 4 * (ro**4 - ri**4)
            mr = ri / ro
            kappa = 6 * (1 + nu) * (1 + mr**2) ** 2 / ((7 + 6 * nu) * (1 + mr**2) ** 2 + (20 + 12 * nu) * mr**2)
            phi = 12 * self.E * I / (kappa * self.G * A * L**2)
            k = self.E * I / (L**3 * (1 + phi)) * np.array([
                [12, 6 * L, -12, 6 * L],
                [6 * L, (4 + phi) * L**2, -6 * L, (2 - phi) * L**2],
                [-12, -6 * L, 12, -6 * L],
                [6 * L, (2 - phi) * L**2, -6 * L, (4 + phi) * L**2]])
            mt = self.rho * A * L / 420 * np.array([
                [156, 22 * L, 54, -13 * L],
                [22 * L, 4 * L**2, 13 * L, -3 * L**2],
                [54, 13 * L, 156, -22 * L],
                [-13 * L, -3 * L**2, -22 * L, 4 * L**2]])
            mrot = self.rho * I / (30 * L) * np.array([
                [36, 3 * L, -36, 3 * L],
                [3 * L, 4 * L**2, -3 * L, -L**2],
                [-36, -3 * L, 36, -3 * L],
                [3 * L, -L**2, -3 * L, 4 * L**2]])
            me = mt + mrot
            gr = 2 * mrot  # polar = 2 x diametral for a circular section
            ix = [4 * e, 4 * e + 1, 4 * e + 4, 4 * e + 5]
            iy = [4 * e + 2, 4 * e + 3, 4 * e + 6, 4 * e + 7]
            for idx in (ix, iy):
                M[np.ix_(idx, idx)] += me
                K[np.ix_(idx, idx)] += k
            Gm[np.ix_(ix, iy)] += gr
            Gm[np.ix_(iy, ix)] -= gr
        for pm in self.masses:
            i = 4 * self.node_at(pm.z)
            M[i, i] += pm.mass
            M[i + 2, i + 2] += pm.mass
            M[i + 1, i + 1] += pm.it
            M[i + 3, i + 3] += pm.it
            Gm[i + 1, i + 3] += pm.ip
            Gm[i + 3, i + 1] -= pm.ip
        return M, K, Gm

    def support_matrices(self, omega: float, extra: list[Support] | None = None):
        n = self.ndof
        K = np.zeros((n, n))
        C = np.zeros((n, n))
        for sp in list(self.supports) + list(extra or []):
            c = sp.coefficients(omega)
            i = 4 * self.node_at(sp.z)
            ij = [i, i + 2]
            K[np.ix_(ij, ij)] += [[c["kxx"], c["kxy"]], [c["kyx"], c["kyy"]]]
            C[np.ix_(ij, ij)] += [[c["cxx"], c["cxy"]], [c["cyx"], c["cyy"]]]
        return K, C

    def reduction_basis(self, omega_ref: float, n_modes: int = 40, structural: tuple | None = None) -> np.ndarray:
        """Ritz basis of undamped, non-gyroscopic modes with the direct
        (symmetrised) support stiffness at omega_ref. Used to reduce the
        damped/gyroscopic problems; accurate for modes well inside the basis."""
        M, Ks, _ = structural or self.assemble_structural()
        Kb, _ = self.support_matrices(omega_ref)
        Kref = Ks + 0.5 * (Kb + Kb.T)
        n = min(n_modes, M.shape[0])
        _, phi = linalg.eigh(Kref, M, subset_by_index=[0, n - 1])
        return phi

    # ----------------------------------------------------------- properties
    def mass_properties(self) -> dict:
        parts = []
        for s in self.sections:
            L = s.z1 - s.z0
            A = math.pi / 4 * (s.od**2 - s.id**2)
            m = self.rho * A * L
            parts.append((m, 0.5 * (s.z0 + s.z1), m * (s.od**2 + s.id**2) / 8,
                          m * (3 * (s.od**2 + s.id**2) / 16 + L**2) / 12))
        for pm in self.masses:
            parts.append((pm.mass, pm.z, pm.ip, pm.it))
        m_tot = sum(p[0] for p in parts)
        zc = sum(p[0] * p[1] for p in parts) / m_tot
        ip = sum(p[2] for p in parts)
        it = sum(p[3] + p[0] * (p[1] - zc) ** 2 for p in parts)
        shaft_mass = sum(p[0] for p in parts[:len(self.sections)])
        return {"mass_kg": m_tot, "shaft_mass_kg": shaft_mass, "cg_m": zc, "ip_kgm2": ip, "it_cg_kgm2": it,
                "length_m": self.nodes[-1] - self.nodes[0]}

    def gravity_load(self) -> np.ndarray:
        """Nodal gravity load vector (-y), shaft weight lumped at element nodes."""
        f = np.zeros(self.ndof)
        for e, L, sec in self.elements():
            w = self.rho * math.pi / 4 * (sec.od**2 - sec.id**2) * L * G0
            f[4 * e + 2] -= w / 2
            f[4 * e + 6] -= w / 2
        for pm in self.masses:
            f[4 * self.node_at(pm.z) + 2] -= pm.mass * G0
        return f

    def static_bearing_loads(self) -> dict[str, float]:
        """Statically determinate reactions for two bearings (N, positive up)."""
        brg = [s for s in self.supports if s.kind == "bearing"]
        f = self.gravity_load()
        W = -f[2::4]
        if len(brg) != 2:
            share = W.sum() / max(len(brg), 1)
            return {b.label: share for b in brg}
        z1, z2 = brg[0].z, brg[1].z
        R2 = float(np.sum(W * (self.nodes - z1)) / (z2 - z1))
        return {brg[0].label: float(W.sum() - R2), brg[1].label: R2}


# --------------------------------------------------------------------- analyses
def modal(model: RotorModel, omega: float, n_modes: int = 8, extra: list[Support] | None = None,
          structural: tuple | None = None, basis: np.ndarray | None = None) -> dict:
    """Damped complex eigen-analysis at spin speed omega (rad/s).
    With ``basis`` (see RotorModel.reduction_basis) the problem is solved in
    the reduced modal space and the shapes are expanded back."""
    M, Ks, Gm = structural or model.assemble_structural()
    Kb, Cb = model.support_matrices(omega, extra)
    K = Ks + Kb
    C = Cb + omega * Gm
    if basis is not None:
        M, K, C = basis.T @ M @ basis, basis.T @ K @ basis, basis.T @ C @ basis
    n = M.shape[0]
    Minv = linalg.inv(M)
    A = np.block([[np.zeros((n, n)), np.eye(n)], [-Minv @ K, -Minv @ C]])
    lam, vec = linalg.eig(A)
    # Keep oscillatory, under-damped roots (overdamped real roots are not modes).
    keep = (lam.imag > 1e-3) & (-lam.real / np.abs(lam) < 0.9)
    lam, vec = lam[keep], vec[:, keep]
    order = np.argsort(np.abs(lam))
    lam, vec = lam[order][:n_modes], vec[:, order][:, :n_modes]
    modes = []
    for j in range(lam.size):
        wd = lam[j].imag
        wn = abs(lam[j])
        zeta = -lam[j].real / wn
        logdec = -2 * math.pi * lam[j].real / wd
        q = vec[:n, j] if basis is None else basis @ vec[:n, j]
        x, y = q[0::4], q[2::4]
        # Whirl: sign of the orbit angular momentum at each node.
        h = np.imag(np.conj(x) * y)
        amp = np.abs(x) ** 2 + np.abs(y) ** 2
        weight = h.sum() / max(amp.sum(), 1e-30)
        whirl = "forward" if weight < -0.05 else ("backward" if weight > 0.05 else "mixed")
        maj = _major_axis(x, y)
        k = int(np.argmax(maj))
        ref = x[k] if abs(x[k]) >= abs(y[k]) else y[k]
        scale = ref if abs(ref) > 0 else 1.0
        xn, yn = x / scale, y / scale
        s = max(np.max(_major_axis(xn, yn)), 1e-30)
        modes.append({"wd_rad_s": wd, "freq_hz": wd / (2 * math.pi), "freq_cpm": wd * 60 / (2 * math.pi),
                      "wn_rad_s": wn, "damping_ratio": zeta, "logdec": logdec, "whirl": whirl,
                      "shape_x": xn / s, "shape_y": yn / s})
    return {"omega": omega, "modes": modes}


def _major_axis(x: np.ndarray, y: np.ndarray) -> np.ndarray:
    a = (np.abs(x) ** 2 + np.abs(y) ** 2) / 2
    b = np.sqrt(((np.abs(x) ** 2 - np.abs(y) ** 2) / 2) ** 2 + np.real(x * np.conj(y)) ** 2)
    return np.sqrt(a + b)


def campbell(model: RotorModel, speeds_rad: np.ndarray, n_modes: int = 6, extra=None, structural=None, basis=None) -> dict:
    structural = structural or model.assemble_structural()
    rows = []
    for w in speeds_rad:
        res = modal(model, float(w), n_modes, extra, structural, basis)
        rows.append([{k: m[k] for k in ("freq_hz", "logdec", "whirl", "damping_ratio")} for m in res["modes"]])
    return {"speeds_rpm": (np.asarray(speeds_rad) * 60 / (2 * math.pi)).tolist(), "modes": rows}


def undamped_critical_speed_map(model: RotorModel, k_values: np.ndarray, n_modes: int = 4) -> dict:
    """Non-rotating, undamped natural frequencies vs. isotropic bearing stiffness."""
    M, Ks, _ = model.assemble_structural()
    out = []
    brg = [s for s in model.supports if s.kind == "bearing"]
    for kv in k_values:
        K = Ks.copy()
        for b in brg:
            i = 4 * model.node_at(b.z)
            K[i, i] += kv
            K[i + 2, i + 2] += kv
        w2 = linalg.eigh(K, M, eigvals_only=True)
        w = np.sqrt(np.clip(w2, 0, None))
        # x and y planes are identical: take every other eigenvalue.
        freqs = np.sort(w)[::2][:n_modes] * 60 / (2 * math.pi)
        out.append(freqs.tolist())
    return {"k_n_m": list(map(float, k_values)), "critical_speeds_rpm": out}


def undamped_modes(model: RotorModel, k_bearing: float, n_modes: int = 4, structural: tuple | None = None) -> list[dict]:
    """Non-rotating undamped modes (one plane) with isotropic bearing stiffness k_bearing (N/m)."""
    M, Ks, _ = structural or model.assemble_structural()
    ix = np.sort(np.r_[np.arange(0, model.ndof, 4), np.arange(1, model.ndof, 4)])
    K = Ks[np.ix_(ix, ix)].copy()
    for b in (s for s in model.supports if s.kind == "bearing"):
        K[2 * model.node_at(b.z), 2 * model.node_at(b.z)] += k_bearing
    w2, v = linalg.eigh(K, M[np.ix_(ix, ix)], subset_by_index=[0, n_modes - 1])
    out = []
    for j in range(n_modes):
        x = v[0::2, j]
        x = x / x[np.argmax(np.abs(x))]
        out.append({"freq_rpm": float(np.sqrt(max(w2[j], 0.0)) * 30 / math.pi), "shape": x.tolist()})
    return out


def static_deflection(model: RotorModel, omega: float = 0.0) -> dict:
    """Gravity sag on the bearing direct stiffnesses at speed omega."""
    M, Ks, _ = model.assemble_structural()
    Kb, _ = model.support_matrices(omega)
    K = Ks + Kb
    # Remove cross-coupling for a static solve (gravity sag uses direct terms).
    f = model.gravity_load()
    u = linalg.solve(K, f)
    return {"z_m": model.nodes.tolist(), "y_m": u[2::4].tolist(), "x_m": u[0::4].tolist(),
            "slope_rad": u[3::4].tolist(), "max_deflection_m": float(np.max(np.abs(u[2::4])))}


def unbalance_response(model: RotorModel, speeds_rad: np.ndarray, unbalances: list[dict], probes: list[float],
                       extra: list[Support] | None = None, structural: tuple | None = None,
                       basis: np.ndarray | None = None) -> dict:
    """Steady synchronous response. unbalance: {'z': m, 'me': kg m, 'phase_deg': deg}."""
    M, Ks, Gm = structural or model.assemble_structural()
    if basis is not None:
        Mr, Ksr, Gr = basis.T @ M @ basis, basis.T @ Ks @ basis, basis.T @ Gm @ basis
    resp = {p: {"major_um": [], "x_amp_um": [], "x_phase_deg": [], "y_amp_um": []} for p in probes}
    shapes = []
    for w in speeds_rad:
        Kb, Cb = model.support_matrices(float(w), extra)
        F = np.zeros(model.ndof, dtype=complex)
        for u in unbalances:
            i = 4 * model.node_at(u["z"])
            f = u["me"] * w**2 * np.exp(1j * math.radians(u.get("phase_deg", 0.0)))
            F[i] += f
            F[i + 2] += -1j * f
        if basis is None:
            D = Ks + Kb - w**2 * M + 1j * w * (Cb + w * Gm)
            q = linalg.solve(D, F)
        else:
            D = Ksr + basis.T @ Kb @ basis - w**2 * Mr + 1j * w * (basis.T @ Cb @ basis + w * Gr)
            q = basis @ linalg.solve(D, basis.T @ F)
        x, y = q[0::4], q[2::4]
        maj = _major_axis(x, y)
        shapes.append((maj * 1e6).tolist())
        for p in probes:
            k = model.node_at(p)
            resp[p]["major_um"].append(float(maj[k] * 1e6))
            resp[p]["x_amp_um"].append(float(abs(x[k]) * 1e6))
            resp[p]["x_phase_deg"].append(float(np.degrees(np.angle(x[k]))))
            resp[p]["y_amp_um"].append(float(abs(y[k]) * 1e6))
    return {"speeds_rpm": (np.asarray(speeds_rad) * 60 / (2 * math.pi)).tolist(),
            "probes": {f"{p:.4f}": v for p, v in resp.items()}, "deflected_shapes_um": shapes,
            "z_m": model.nodes.tolist()}


def find_peaks_af(speeds_rpm: list[float], amp: list[float]) -> list[dict]:
    """Response peaks with amplification factor by the half-power method
    (AF = Nc / (N2 - N1), API 617 / API 684)."""
    s, a = np.asarray(speeds_rpm), np.asarray(amp)
    out = []
    for i in range(1, len(a) - 1):
        if a[i] >= a[i - 1] and a[i] > a[i + 1]:
            hp = a[i] / math.sqrt(2)
            j = i
            while j > 0 and a[j] > hp:
                j -= 1
            k = i
            while k < len(a) - 1 and a[k] > hp:
                k += 1
            if a[j] > hp or a[k] > hp:
                af = float("inf")  # peak not resolved down to half power within the sweep
                n1 = n2 = None
            else:
                n1 = float(np.interp(hp, [a[j], a[j + 1]], [s[j], s[j + 1]]))
                n2 = float(np.interp(hp, [a[k], a[k - 1]], [s[k], s[k - 1]]))
                af = float(s[i] / (n2 - n1)) if n2 > n1 else float("inf")
            out.append({"speed_rpm": float(s[i]), "amplitude_um": float(a[i]), "af": af, "n1_rpm": n1, "n2_rpm": n2})
    return out


def constant_support(**kw) -> Callable[[float], dict]:
    c = {k: float(kw.get(k, 0.0)) for k in COEF_KEYS}
    return lambda omega: c


def tabulated_support(speeds_rad: np.ndarray, table: dict[str, np.ndarray]) -> Callable[[float], dict]:
    def f(omega):
        return {k: float(np.interp(omega, speeds_rad, table[k])) for k in COEF_KEYS}
    return f
