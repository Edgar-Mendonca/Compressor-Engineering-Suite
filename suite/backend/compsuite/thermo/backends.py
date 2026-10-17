"""Property backends behind one interface.

``pr`` is the built-in Peng-Robinson model (always available).
``coolprop`` uses CoolProp's multiparameter HEOS mixture model (GERG-type
departure functions where available) when the package is installed.
Both expose: mw(), z(), density(), h(), s(), state(), T_from_hP(), T_from_sP().
"""

from __future__ import annotations

import math

from compsuite.core.units import R
from compsuite.thermo.components import COOLPROP_NAMES
from compsuite.thermo.eos import GasState, PengRobinson, lee_gonzalez_eakin, _bracket_solve


def coolprop_available() -> bool:
    try:
        import CoolProp  # noqa: F401
        return True
    except ImportError:
        return False


class CoolPropGas:
    engine = "CoolProp HEOS"

    def __init__(self, composition: dict[str, float]):
        import CoolProp.CoolProp as CP
        self._CP = CP
        items = [(k, float(v)) for k, v in composition.items() if float(v) > 0]
        total = sum(v for _, v in items)
        self.keys = [k for k, _ in items]
        self.x = [v / total for _, v in items]
        names = "&".join(COOLPROP_NAMES[k] for k in self.keys)
        self._as = CP.AbstractState("HEOS", names)
        if len(self.keys) > 1:
            self._as.set_mole_fractions(self.x)
        self.composition = dict(zip(self.keys, self.x))
        self._pr = PengRobinson(composition)

    def _upd(self, T, P):
        self._as.update(self._CP.PT_INPUTS, P, T)
        return self._as

    def mw(self, x=None) -> float:
        return self._as.molar_mass() * 1000.0

    def z(self, T, P, phase="vapor"):
        return self._upd(T, P).compressibility_factor()

    def density(self, T, P, phase="vapor"):
        return self._upd(T, P).rhomass()

    def h(self, T, P, phase="vapor"):
        return self._upd(T, P).hmass()

    def s(self, T, P, phase="vapor"):
        return self._upd(T, P).smass()

    def state(self, T, P, phase="vapor") -> GasState:
        a = self._upd(T, P)
        rho, cp, cv = a.rhomass(), a.cpmass(), a.cvmass()
        try:
            sound = a.speed_sound()
        except ValueError:
            sound = float("nan")
        k = cp / cv
        n_s = sound**2 * rho / P if math.isfinite(sound) else k
        mw = self.mw()
        return GasState(T=T, P=P, Z=a.compressibility_factor(), rho=rho, v=1 / rho, h=a.hmass(), s=a.smass(),
                        cp=cp, cv=cv, k=k, n_s=n_s, sound=sound, mw=mw, mu=lee_gonzalez_eakin(T, rho, mw))

    def T_from_hP(self, h, P, T_guess=300.0):
        return _bracket_solve(lambda T: self.h(T, P) - h, T_guess)

    def T_from_sP(self, s, P, T_guess=300.0):
        return _bracket_solve(lambda T: self.s(T, P) - s, T_guess)

    # Phase equilibria are delegated to the cubic model.
    def __getattr__(self, name):
        return getattr(self._pr, name)


def make_gas(composition: dict[str, float], backend: str = "pr"):
    if backend == "coolprop":
        if not coolprop_available():
            raise RuntimeError("CoolProp backend requested but CoolProp is not installed (pip install CoolProp)")
        return CoolPropGas(composition)
    gas = PengRobinson(composition)
    gas.engine = "Peng-Robinson (built-in)"
    return gas


def ideal_density(T, P, mw):
    return P * mw / 1000.0 / (R * T)

