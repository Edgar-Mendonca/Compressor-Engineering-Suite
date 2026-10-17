"""Peng-Robinson (1976) cubic equation of state for gas mixtures.

Provides compressibility, density, enthalpy, entropy, heat capacities,
isentropic exponents, speed of sound, fugacity coefficients and the
inverse solvers (T from h,P and T from s,P) used by the compression module.

Reference state: ideal gas at 298.15 K and 1 atm has h = 0 and s = 0
(plus the ideal mixing entropy), so only differences are meaningful.
"""

from __future__ import annotations

import math
from dataclasses import dataclass

import numpy as np
from scipy.optimize import brentq

from compsuite.core.units import R, P_ATM
from compsuite.thermo.components import COMPONENTS, kij

SQRT2 = math.sqrt(2.0)
T_REF = 298.15


@dataclass
class GasState:
    T: float  # K
    P: float  # Pa
    Z: float
    rho: float  # kg/m3
    v: float  # m3/kg
    h: float  # J/kg
    s: float  # J/(kg K)
    cp: float  # J/(kg K)
    cv: float  # J/(kg K)
    k: float  # cp/cv
    n_s: float  # isentropic volume exponent -(v/P)(dP/dv)_s
    sound: float  # m/s
    mw: float  # kg/kmol
    mu: float  # Pa s (Lee-Gonzalez-Eakin)
    phase: str = "vapor"


class PengRobinson:
    def __init__(self, composition: dict[str, float], kij_override: dict | None = None):
        unknown = [k for k in composition if k not in COMPONENTS]
        if unknown:
            raise ValueError(f"Unknown components: {unknown}. Known: {sorted(COMPONENTS)}")
        items = [(k, float(v)) for k, v in composition.items() if float(v) > 0]
        if not items:
            raise ValueError("Composition is empty")
        total = sum(v for _, v in items)
        self.keys = [k for k, _ in items]
        self.x = np.array([v / total for _, v in items])
        comps = [COMPONENTS[k] for k in self.keys]
        self.tc = np.array([c.tc for c in comps])
        self.pc = np.array([c.pc for c in comps])
        self.omega = np.array([c.omega for c in comps])
        self.mw_i = np.array([c.mw for c in comps])
        self.cp_coef = np.array([c.cp for c in comps])
        self.ac = 0.45724 * R**2 * self.tc**2 / self.pc
        self.bi = 0.07780 * R * self.tc / self.pc
        w = self.omega
        self.kappa = np.where(w <= 0.49, 0.37464 + 1.54226 * w - 0.26992 * w**2,
                              0.379642 + 1.48503 * w - 0.164423 * w**2 + 0.016666 * w**3)
        n = len(self.keys)
        self.kij = np.zeros((n, n))
        for i in range(n):
            for j in range(n):
                self.kij[i, j] = kij(self.keys[i], self.keys[j])
        if kij_override:
            for (a, b), val in kij_override.items():
                if a in self.keys and b in self.keys:
                    i, j = self.keys.index(a), self.keys.index(b)
                    self.kij[i, j] = self.kij[j, i] = val
        self.composition = dict(zip(self.keys, self.x.tolist()))

    # ------------------------------------------------------------------ basics
    def mw(self, x: np.ndarray | None = None) -> float:
        x = self.x if x is None else x
        return float(x @ self.mw_i)

    def _a_i(self, T: float):
        sqrt_tr = np.sqrt(T / self.tc)
        alpha = (1 + self.kappa * (1 - sqrt_tr)) ** 2
        a = self.ac * alpha
        dadT = -self.ac * self.kappa * np.sqrt(alpha) / np.sqrt(T * self.tc)
        return a, dadT

    def _mix(self, T: float, x: np.ndarray):
        a, dadT = self._a_i(T)
        sa = np.sqrt(np.outer(a, a))
        aij = sa * (1 - self.kij)
        am = float(x @ aij @ x)
        # d(sqrt(ai aj))/dT = 0.5 sqrt(ai aj) (ai'/ai + aj'/aj)
        ratio = dadT / a
        daij = 0.5 * aij * (ratio[:, None] + ratio[None, :])
        dam = float(x @ daij @ x)
        bm = float(x @ self.bi)
        return am, dam, bm, aij

    @staticmethod
    def _roots(A: float, B: float) -> np.ndarray:
        coeffs = [1.0, -(1 - B), A - 3 * B**2 - 2 * B, -(A * B - B**2 - B**3)]
        r = np.roots(coeffs)
        real = np.sort(r[np.abs(r.imag) < 1e-9].real)
        real = real[real > B]
        if real.size == 0:
            real = np.array([max(r.real)])
        return real

    def _z(self, T, P, x, phase):
        am, dam, bm, aij = self._mix(T, x)
        A = am * P / (R * T) ** 2
        B = bm * P / (R * T)
        roots = self._roots(A, B)
        if phase == "vapor" or roots.size == 1:
            Z = roots[-1] if phase != "liquid" else roots[0]
        elif phase == "liquid":
            Z = roots[0]
        else:  # minimum Gibbs energy root
            g = [self._g_dep(z, A, B) for z in (roots[0], roots[-1])]
            Z = roots[0] if g[0] < g[1] else roots[-1]
        return float(Z), A, B, am, dam, bm, aij

    @staticmethod
    def _g_dep(Z, A, B):
        return Z - 1 - math.log(Z - B) - A / (2 * SQRT2 * B) * math.log((Z + (1 + SQRT2) * B) / (Z + (1 - SQRT2) * B))

    # ------------------------------------------------------------ ideal parts
    def _cp_ig_molar(self, T, x=None):
        x = self.x if x is None else x
        A, B, C, D = (x @ self.cp_coef)
        return A + B * T + C * T**2 + D * T**3

    def _h_ig_molar(self, T, x=None):
        x = self.x if x is None else x
        A, B, C, D = (x @ self.cp_coef)
        f = lambda t: A * t + B * t**2 / 2 + C * t**3 / 3 + D * t**4 / 4
        return f(T) - f(T_REF)

    def _s_ig_molar(self, T, P, x=None):
        x = self.x if x is None else x
        A, B, C, D = (x @ self.cp_coef)
        f = lambda t: A * math.log(t) + B * t + C * t**2 / 2 + D * t**3 / 3
        xm = x[x > 0]
        return f(T) - f(T_REF) - R * math.log(P / P_ATM) - R * float(xm @ np.log(xm))

    # -------------------------------------------------------------- properties
    def z(self, T: float, P: float, phase: str = "vapor") -> float:
        return self._z(T, P, self.x, phase)[0]

    def density(self, T: float, P: float, phase: str = "vapor") -> float:
        Z = self.z(T, P, phase)
        return P * self.mw() / 1000.0 / (Z * R * T)

    def _hs_molar(self, T, P, x=None, phase="vapor"):
        x = self.x if x is None else x
        Z, A, B, am, dam, bm, _ = self._z(T, P, x, phase)
        lg = math.log((Z + (1 + SQRT2) * B) / (Z + (1 - SQRT2) * B))
        h_dep = R * T * (Z - 1) + (T * dam - am) / (2 * SQRT2 * bm) * lg
        s_dep = R * math.log(Z - B) + dam / (2 * SQRT2 * bm) * lg
        return self._h_ig_molar(T, x) + h_dep, self._s_ig_molar(T, P, x) + s_dep, Z

    def h(self, T: float, P: float, phase: str = "vapor") -> float:
        return self._hs_molar(T, P, phase=phase)[0] / self.mw() * 1000.0

    def s(self, T: float, P: float, phase: str = "vapor") -> float:
        return self._hs_molar(T, P, phase=phase)[1] / self.mw() * 1000.0

    def _derivs(self, T, v_m, x=None):
        """Analytic dP/dT at constant v and dP/dv at constant T (molar volume)."""
        x = self.x if x is None else x
        am, dam, bm, _ = self._mix(T, x)
        den = v_m**2 + 2 * bm * v_m - bm**2
        dPdT = R / (v_m - bm) - dam / den
        dPdv = -R * T / (v_m - bm) ** 2 + am * (2 * v_m + 2 * bm) / den**2
        return dPdT, dPdv

    def state(self, T: float, P: float, phase: str = "vapor") -> GasState:
        mw = self.mw()
        h_m, s_m, Z = self._hs_molar(T, P, phase=phase)
        v_m = Z * R * T / P
        dT = max(1e-3, 1e-5 * T)
        cp_m = (self._hs_molar(T + dT, P, phase=phase)[0] - self._hs_molar(T - dT, P, phase=phase)[0]) / (2 * dT)
        dPdT, dPdv = self._derivs(T, v_m)
        cv_m = cp_m + T * dPdT**2 / dPdv
        k = cp_m / cv_m
        n_s = k * (-v_m / P) * dPdv
        sound = math.sqrt(max(-v_m**2 * k * dPdv / (mw / 1000.0), 0.0))
        rho = P * mw / 1000.0 / (Z * R * T)
        f = 1000.0 / mw
        return GasState(T=T, P=P, Z=Z, rho=rho, v=1 / rho, h=h_m * f, s=s_m * f, cp=cp_m * f, cv=cv_m * f,
                        k=k, n_s=n_s, sound=sound, mw=mw, mu=lee_gonzalez_eakin(T, rho, mw), phase=phase)

    def T_from_hP(self, h: float, P: float, T_guess: float = 300.0) -> float:
        f = lambda T: self.h(T, P) - h
        return _bracket_solve(f, T_guess)

    def T_from_sP(self, s: float, P: float, T_guess: float = 300.0) -> float:
        f = lambda T: self.s(T, P) - s
        return _bracket_solve(f, T_guess)

    # --------------------------------------------------------- phase equilibria
    def ln_phi(self, T: float, P: float, x: np.ndarray, phase: str) -> np.ndarray:
        Z, A, B, am, dam, bm, aij = self._z(T, P, x, phase)
        lg = math.log((Z + (1 + SQRT2) * B) / (Z + (1 - SQRT2) * B))
        bi_b = self.bi / bm
        sum_a = 2 * (aij @ x) / am
        return bi_b * (Z - 1) - math.log(Z - B) - A / (2 * SQRT2 * B) * (sum_a - bi_b) * lg

    def wilson_k(self, T: float, P: float) -> np.ndarray:
        return self.pc / P * np.exp(5.373 * (1 + self.omega) * (1 - self.tc / T))

    def _dew_residual(self, T: float, P: float, iters: int = 200):
        """Dew condition: vapour = feed, find incipient liquid. Returns (sum(x)-1, x)."""
        y = self.x
        K = self.wilson_k(T, P)
        lnphi_v = self.ln_phi(T, P, y, "vapor")
        xs = y / K
        for _ in range(iters):
            xn = xs / xs.sum()
            K_new = np.exp(self.ln_phi(T, P, xn, "liquid") - lnphi_v)
            xs_new = y / K_new
            if np.max(np.abs(xs_new - xs)) < 1e-10:
                xs = xs_new
                break
            xs = xs_new
        trivial = np.allclose(xs / xs.sum(), y, atol=1e-4)
        return xs.sum() - 1.0, xs / xs.sum(), trivial

    def _bubble_residual(self, T: float, P: float, iters: int = 200):
        x = self.x
        K = self.wilson_k(T, P)
        lnphi_l = self.ln_phi(T, P, x, "liquid")
        ys = x * K
        for _ in range(iters):
            yn = ys / ys.sum()
            K_new = np.exp(lnphi_l - self.ln_phi(T, P, yn, "vapor"))
            ys_new = x * K_new
            if np.max(np.abs(ys_new - ys)) < 1e-10:
                ys = ys_new
                break
            ys = ys_new
        trivial = np.allclose(ys / ys.sum(), x, atol=1e-4)
        return ys.sum() - 1.0, ys / ys.sum(), trivial

    def dew_points(self, P: float, T_lo: float = 120.0, T_hi: float = 700.0, n: int = 120) -> list[float]:
        """All dew-point temperatures at pressure P found by scanning (retrograde gives two)."""
        return self._scan(lambda T: self._dew_residual(T, P), T_lo, T_hi, n)

    def bubble_points(self, P: float, T_lo: float = 60.0, T_hi: float = 700.0, n: int = 120) -> list[float]:
        return self._scan(lambda T: self._bubble_residual(T, P), T_lo, T_hi, n)

    @staticmethod
    def _scan(fun, T_lo, T_hi, n):
        Ts = np.linspace(T_lo, T_hi, n)
        vals = []
        for T in Ts:
            try:
                r, _, triv = fun(T)
                vals.append(np.nan if triv else r)
            except (ValueError, FloatingPointError, ZeroDivisionError):
                vals.append(np.nan)
        out = []
        for i in range(n - 1):
            a, b = vals[i], vals[i + 1]
            if np.isfinite(a) and np.isfinite(b) and a * b < 0:
                g = lambda T: fun(T)[0]
                try:
                    out.append(float(brentq(g, Ts[i], Ts[i + 1], xtol=1e-4)))
                except ValueError:
                    pass
        return out

    def phase_envelope(self, P_min: float = 1e5, P_max: float = 150e5, n_p: int = 30) -> dict:
        """Dew and bubble curves by pressure sweep. Near the critical point the
        successive-substitution solver may not converge; such points are omitted."""
        dew, bub = [], []
        for P in np.geomspace(P_min, P_max, n_p):
            for T in self.dew_points(P):
                dew.append((T, P))
            for T in self.bubble_points(P):
                bub.append((T, P))
        return {"dew": dew, "bubble": bub}

    def water_dew_point(self, P: float) -> float | None:
        """Water dew point: temperature where pure liquid water would form.
        Uses the PR fugacity of water in the gas vs. pure water (approximate)."""
        if "H2O" not in self.keys:
            return None
        iw = self.keys.index("H2O")
        yw = self.x[iw]
        def f(T):
            lnphi_v = self.ln_phi(T, P, self.x, "vapor")[iw]
            psat = water_psat(T)
            return math.log(yw * P) + lnphi_v - math.log(psat)
        try:
            return float(brentq(f, 250.0, 640.0))
        except ValueError:
            return None


def _bracket_solve(f, T_guess):
    # Secant from the guess first (properties are smooth in the gas region).
    T0, T1 = T_guess, T_guess * 1.02
    f0, f1 = f(T0), f(T1)
    for _ in range(25):
        if f1 == f0:
            break
        T2 = T1 - f1 * (T1 - T0) / (f1 - f0)
        if not (20.0 < T2 < 3000.0):
            break
        T0, f0, T1 = T1, f1, T2
        f1 = f(T1)
        if abs(T1 - T0) < 1e-7 * T1:
            return float(T1)
    lo, hi = max(40.0, T_guess * 0.6), T_guess * 1.6
    for _ in range(30):
        flo, fhi = f(lo), f(hi)
        if flo * fhi < 0:
            return float(brentq(f, lo, hi, xtol=1e-6))
        lo, hi = max(30.0, lo * 0.8), hi * 1.25
    raise ValueError("Temperature solve failed to bracket a root")


def water_psat(T: float) -> float:
    """Water saturation pressure (Pa), Wagner & Pruss (IAPWS-95 auxiliary equation)."""
    Tc, Pc = 647.096, 22.064e6
    tau = 1 - T / Tc
    a = (-7.85951783, 1.84408259, -11.7866497, 22.6807411, -15.9618719, 1.80122502)
    e = (1, 1.5, 3, 3.5, 4, 7.5)
    return Pc * math.exp(Tc / T * sum(ai * tau**ei for ai, ei in zip(a, e)))


def lee_gonzalez_eakin(T: float, rho: float, mw: float) -> float:
    """Gas viscosity (Pa s), Lee-Gonzalez-Eakin (1966) natural-gas correlation."""
    T_R = T * 1.8
    K = (9.4 + 0.02 * mw) * T_R**1.5 / (209 + 19 * mw + T_R)
    X = 3.5 + 986.0 / T_R + 0.01 * mw
    Y = 2.4 - 0.2 * X
    mu_cp = 1e-4 * K * math.exp(X * (rho / 1000.0) ** Y)
    return mu_cp * 1e-3
