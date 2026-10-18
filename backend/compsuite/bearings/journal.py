"""Hydrodynamic journal bearings (plain cylindrical and tilting-pad).

Pressure field: short-bearing solution of the Reynolds equation (Ocvirk;
valid for L/D <= ~0.6) with half-Sommerfeld (Gümbel) cavitation, solved in
the same global frame as the rotor model (x horizontal, y vertical up,
spin +z from x toward y, gravity load along -y).

Integrated line pressure: p(theta) = -mu L^3 / (2 h^3) * (omega dh/dtheta + 2 dh/dt)

Tilting-pad bearings: each pad pivots freely (zero moment about the pivot),
so the pad tilt is solved for at every journal position. Coefficients are
obtained by finite differences of the fluid force about the static
equilibrium: K_ij = -dF_i/dq_j (pads re-equilibrated, i.e. fully reduced
zero-frequency stiffness) and C_ij = -dF_i/dqdot_j with the pads held at
their static tilt. Pad inertia and pivot flexibility are neglected.

Thermal model: single effective-temperature (isoviscous) iteration with
the oil temperature rise set by the design oil flow. Babbitt temperature is
a screening estimate only; use a thermo-elasto-hydrodynamic (THD/TEHD)
analysis or vendor data for design.
"""

from __future__ import annotations

import math
from dataclasses import dataclass

import numpy as np
from scipy.optimize import brentq, fsolve

from compsuite.core.trace import record

OIL_GRADES = {"ISO VG 32": (32.0, 5.4), "ISO VG 46": (46.0, 6.8), "ISO VG 68": (68.0, 8.7)}


def oil_kinematic_viscosity_cst(grade: str, temp_c: float) -> float:
    """ASTM D341 (Walther) interpolation through the 40 and 100 degC grade values."""
    v40, v100 = OIL_GRADES[grade]
    T1, T2 = 313.15, 373.15
    Z1, Z2 = math.log10(math.log10(v40 + 0.7)), math.log10(math.log10(v100 + 0.7))
    B = (Z1 - Z2) / (math.log10(T2) - math.log10(T1))
    A = Z1 + B * math.log10(T1)
    Z = A - B * math.log10(temp_c + 273.15)
    return 10 ** (10**Z) - 0.7


def oil_density(temp_c: float) -> float:
    return 870.0 - 0.63 * (temp_c - 15.0)


def oil_cp(temp_c: float) -> float:
    return 1800.0 + 3.6 * temp_c


def oil_dynamic_viscosity(grade: str, temp_c: float) -> float:
    return oil_kinematic_viscosity_cst(grade, temp_c) * 1e-6 * oil_density(temp_c)


@dataclass
class JournalBearing:
    diameter: float
    length: float
    clearance: float  # radial (assembled) clearance
    kind: str = "tilting_pad"
    n_pads: int = 5
    pad_arc_deg: float = 60.0
    preload: float = 0.25
    pivot_offset: float = 0.5
    load_between_pads: bool = True
    n_theta: int = 241
    pivot_stiffness: float | None = None  # N/m per pad; None = rigid pivots

    @property
    def R(self):
        return self.diameter / 2

    # ------------------------------------------------------------ geometry
    def _pads(self):
        if self.kind == "plain_cylindrical":
            return [(0.0, 2 * math.pi, None)]
        pads = []
        start = -math.pi / 2 + (math.pi / self.n_pads if self.load_between_pads else 0.0)
        arc = math.radians(self.pad_arc_deg)
        for i in range(self.n_pads):
            centre = start + 2 * math.pi * i / self.n_pads
            lead = centre - arc / 2
            pivot = lead + self.pivot_offset * arc
            pads.append((lead, lead + arc, pivot))
        return pads

    def _line_pressure(self, th, h, dh_dth, dh_dt, mu, omega):
        p = -mu * self.length**3 / (2 * h**3) * (omega * dh_dth + 2 * dh_dt)
        return np.maximum(p, 0.0)

    def _pad_force(self, pad, x, y, vx, vy, mu, omega, delta=None):
        lead, trail, pivot = pad
        th = np.linspace(lead, trail, self.n_theta if pivot is None else max(41, self.n_theta // 4))
        c = self.clearance
        if pivot is None:
            h = c - x * np.cos(th) - y * np.sin(th)
            dh_dth = x * np.sin(th) - y * np.cos(th)
            dh_dt = -vx * np.cos(th) - vy * np.sin(th)
        else:
            cp = c / (1 - self.preload)
            # Pad tilt delta (rad x R) about the pivot opens/closes the film linearly.
            d = 0.0 if delta is None else delta
            h = cp - x * np.cos(th) - y * np.sin(th) - (cp - c) * np.cos(th - pivot) - d * np.sin(th - pivot)
            dh_dth = x * np.sin(th) - y * np.cos(th) + (cp - c) * np.sin(th - pivot) - d * np.cos(th - pivot)
            dh_dt = -vx * np.cos(th) - vy * np.sin(th)
        h = np.maximum(h, 1e-3 * c)
        p = self._line_pressure(th, h, dh_dth, dh_dt, mu, omega)
        Fx = -np.trapezoid(p * np.cos(th), th) * self.R
        Fy = -np.trapezoid(p * np.sin(th), th) * self.R
        M = np.trapezoid(p * np.sin(th - pivot), th) if pivot is not None else 0.0
        return Fx, Fy, M, float(h.min()), th, h

    def _pad_equilibrium_tilt(self, pad, x, y, vx, vy, mu, omega):
        # Tilting the pad open (negative d) unloads it; the moment then
        # vanishes trivially. The physical equilibrium is the sign change of
        # the moment from negative to positive while the pad carries pressure.
        c = self.clearance
        f = lambda d: self._pad_force(pad, x, y, vx, vy, mu, omega, d)[2]
        grid = np.linspace(-1.5 * c, 1.5 * c, 19)
        vals = [f(d) for d in grid]
        for i in range(len(grid) - 1):
            if vals[i] < 0.0 < vals[i + 1]:
                return brentq(f, grid[i], grid[i + 1], xtol=1e-7 * c)
        # Unloaded pad: it floats, so take the most-closed tilt with no pressure.
        unloaded = [d for d, v in zip(grid, vals) if v == 0.0]
        return max(unloaded) if unloaded else 0.0

    def force(self, x, y, vx, vy, mu, omega, tilts=None):
        """Fluid force on the journal. ``tilts`` freezes the pad tilts; by
        default each pad is placed in moment equilibrium."""
        Fx = Fy = 0.0
        hmin = self.clearance
        used = []
        for i, pad in enumerate(self._pads()):
            if pad[2] is None:
                d = None
            elif tilts is not None:
                d = tilts[i]
            else:
                d = self._pad_equilibrium_tilt(pad, x, y, vx, vy, mu, omega)
            used.append(d)
            fx, fy, _, hm, _, _ = self._pad_force(pad, x, y, vx, vy, mu, omega, d)
            Fx += fx
            Fy += fy
            hmin = min(hmin, hm)
        self._last_tilts = used
        return Fx, Fy, hmin

    # --------------------------------------------------------------- solve
    def equilibrium(self, W: float, mu: float, omega: float):
        c = self.clearance
        def res(q):
            Fx, Fy, _ = self.force(q[0] * c, q[1] * c, 0, 0, mu, omega)
            return [Fx / W, (Fy - W) / W]
        guess = [0.05, -0.4] if self.kind == "plain_cylindrical" else [0.0, -0.3]
        sol, info, ier, _ = fsolve(res, guess, full_output=True, xtol=1e-9)
        if ier != 1 or np.max(np.abs(res(sol))) > 1e-4:
            for g in ([0.3, -0.6], [0.1, -0.8], [0.0, -0.1], [-0.2, -0.5]):
                sol, info, ier, _ = fsolve(res, g, full_output=True, xtol=1e-9)
                if ier == 1 and np.max(np.abs(res(sol))) < 1e-4:
                    break
        return sol[0] * c, sol[1] * c, ier == 1

    def coefficients(self, W: float, mu: float, omega: float) -> dict:
        x0, y0, ok = self.equilibrium(W, mu, omega)
        c = self.clearance
        dq = 1e-4 * c
        dv = 1e-4 * c * omega
        _, _, hmin = self.force(x0, y0, 0, 0, mu, omega)
        static_tilts = list(self._last_tilts)
        def F(x, y, vx, vy, tilts=None):
            fx, fy, _ = self.force(x, y, vx, vy, mu, omega, tilts)
            return np.array([fx, fy])
        Kd = np.zeros((2, 2))
        Cd = np.zeros((2, 2))
        for j, (ex, ey) in enumerate(((1, 0), (0, 1))):
            # Stiffness with pads re-equilibrated (pads follow the journal);
            # damping with pads held at their static tilt (pad-fixed damping).
            Kd[:, j] = -(F(x0 + ex * dq, y0 + ey * dq, 0, 0) - F(x0 - ex * dq, y0 - ey * dq, 0, 0)) / (2 * dq)
            Cd[:, j] = -(F(x0, y0, ex * dv, ey * dv, static_tilts) - F(x0, y0, -ex * dv, -ey * dv, static_tilts)) / (2 * dv)
        if self.pivot_stiffness and self.kind == "tilting_pad":
            # Pivots in series with the film (bearing level: sum of cos^2 over pads = n/2).
            kp = self.pivot_stiffness * self.n_pads / 2
            for i in range(2):
                f = kp / (Kd[i, i] + kp)
                Kd[i, i] *= f
                Cd[i, i] *= f * f
        ecc = math.hypot(x0, y0) / c
        attitude = math.degrees(math.atan2(x0, -y0))
        return {"kxx": Kd[0, 0], "kxy": Kd[0, 1], "kyx": Kd[1, 0], "kyy": Kd[1, 1],
                "cxx": Cd[0, 0], "cxy": Cd[0, 1], "cyx": Cd[1, 0], "cyy": Cd[1, 1],
                "eccentricity": ecc, "attitude_deg": attitude, "h_min_m": hmin, "converged": ok,
                "x0_m": x0, "y0_m": y0}

    def power_loss(self, mu: float, omega: float) -> float:
        """Viscous shear loss (Petroff, full film over the pad arcs)."""
        arc = 2 * math.pi if self.kind == "plain_cylindrical" else self.n_pads * math.radians(self.pad_arc_deg)
        c_eff = self.clearance if self.kind == "plain_cylindrical" else self.clearance / (1 - self.preload) * 0.8
        return mu * (omega * self.R) ** 2 / c_eff * self.R * arc * self.length


def ocvirk_load(mu, omega, R, L, c, ecc):
    """Closed-form short-bearing load capacity (validation reference)."""
    return mu * omega * R * L**3 / (4 * c**2) * ecc / (1 - ecc**2) ** 2 * math.sqrt(math.pi**2 * (1 - ecc**2) + 16 * ecc**2)


def bearing_performance(bearing: JournalBearing, W: float, omega: float, grade: str, t_supply: float, dT_design: float) -> dict:
    """Thermal iteration: effective temperature from losses and design oil flow."""
    t_eff = t_supply + 0.8 * dT_design
    for _ in range(6):
        mu = oil_dynamic_viscosity(grade, t_eff)
        loss = bearing.power_loss(mu, omega)
        t_new = t_supply + 0.8 * dT_design
        if abs(t_new - t_eff) < 0.1:
            break
        t_eff = t_new
    coeffs = bearing.coefficients(W, mu, omega)
    rho, cp = oil_density(t_eff), oil_cp(t_eff)
    flow = loss / (rho * cp * dT_design)
    U = omega * bearing.R
    p_unit = W / (bearing.length * bearing.diameter)
    t_babbitt = t_supply + dT_design + 10.0 + 0.25 * U * p_unit / 1e6
    sommerfeld = mu * (omega / (2 * math.pi)) * bearing.length * bearing.diameter / W * (bearing.R / bearing.clearance) ** 2
    return {**coeffs, "load_n": W, "unit_load_mpa": p_unit / 1e6, "surface_speed_m_s": U, "viscosity_pa_s": mu,
            "effective_temperature_c": t_eff, "power_loss_kw": loss / 1e3, "oil_flow_l_min": flow * 60000,
            "babbitt_temperature_est_c": t_babbitt, "sommerfeld": sommerfeld}


def size_journal(W: float, shaft_d: float, design) -> JournalBearing:
    D = shaft_d
    return JournalBearing(diameter=D, length=design.length_to_diameter * D, clearance=design.radial_clearance_ratio * D / 2,
                          kind="plain_cylindrical" if design.journal_type == "plain_cylindrical" else "tilting_pad",
                          n_pads=design.pads, preload=design.preload, pivot_offset=design.pivot_offset, pivot_stiffness=getattr(design, "pivot_stiffness_n_m", None),
                          load_between_pads=design.load_between_pads)


def bearing_tables(bearings: dict[str, tuple[JournalBearing, float]], speeds_rad: np.ndarray, design) -> dict:
    """Speed-dependent coefficients for each bearing: {label: (bearing, static load)}."""
    rec = record("bearings", "Short-bearing Reynolds with half-Sommerfeld cavitation; finite-difference K, C",
                 [design, list(speeds_rad)],
                 assumptions=["Short-bearing approximation (L/D <= 0.6)", "Isoviscous at an effective temperature",
                              "Tilting pads: free pivots, fully reduced zero-frequency coefficients, no pad inertia",
                              "Babbitt temperature is a screening estimate only"],
                 references=["Ocvirk (1952) NACA TN 2808", "Childs, Turbomachinery Rotordynamics (1993)",
                             "Someya, Journal-Bearing Databook (1989) for validation"])
    out = {}
    for label, (brg, W) in bearings.items():
        rows = []
        for w in speeds_rad:
            rows.append(bearing_performance(brg, W, float(w), design.oil_grade, design.oil_supply_temperature_c,
                                            design.oil_temperature_rise_c))
        for r in rows:
            if not r["converged"]:
                rec.warn(f"{label}: equilibrium not converged at some speeds")
                break
        out[label] = {"geometry": {"diameter_mm": brg.diameter * 1e3, "length_mm": brg.length * 1e3,
                                   "radial_clearance_um": brg.clearance * 1e6, "type": brg.kind,
                                   "pads": brg.n_pads if brg.kind != "plain_cylindrical" else None,
                                   "preload": brg.preload if brg.kind != "plain_cylindrical" else None},
                      "speeds_rpm": (speeds_rad * 60 / (2 * math.pi)).tolist(), "rows": rows}
    return {"bearings": out, "trace": rec}
