"""Pure-component constants.

Critical constants, acentric factors and ideal-gas heat-capacity polynomial
coefficients (cp = A + B T + C T^2 + D T^3, J/(mol K), T in K) are taken from
Reid, Prausnitz & Poling, "The Properties of Gases and Liquids", 4th ed.,
Appendix A. The cp polynomials are fitted for roughly 270-1500 K.
"""

from __future__ import annotations

from dataclasses import dataclass


@dataclass(frozen=True)
class Component:
    key: str
    name: str
    mw: float  # kg/kmol
    tc: float  # K
    pc: float  # Pa
    omega: float
    cp: tuple[float, float, float, float]


def _c(key, name, mw, tc, pc_bar, omega, cp):
    return Component(key, name, mw, tc, pc_bar * 1e5, omega, cp)


COMPONENTS: dict[str, Component] = {c.key: c for c in [
    _c("CH4", "Methane", 16.043, 190.56, 45.99, 0.011, (19.25, 5.213e-2, 1.197e-5, -1.132e-8)),
    _c("C2H6", "Ethane", 30.070, 305.32, 48.72, 0.099, (5.409, 1.781e-1, -6.938e-5, 8.713e-9)),
    _c("C3H8", "Propane", 44.097, 369.83, 42.48, 0.152, (-4.224, 3.063e-1, -1.586e-4, 3.215e-8)),
    _c("iC4H10", "Isobutane", 58.123, 407.80, 36.40, 0.184, (-1.390, 3.847e-1, -1.846e-4, 2.895e-8)),
    _c("nC4H10", "n-Butane", 58.123, 425.12, 37.96, 0.200, (9.487, 3.313e-1, -1.108e-4, -2.822e-9)),
    _c("iC5H12", "Isopentane", 72.150, 460.40, 33.80, 0.229, (-9.525, 5.066e-1, -2.729e-4, 5.723e-8)),
    _c("nC5H12", "n-Pentane", 72.150, 469.70, 33.70, 0.252, (-3.626, 4.873e-1, -2.580e-4, 5.305e-8)),
    _c("nC6H14", "n-Hexane", 86.177, 507.60, 30.25, 0.300, (-4.413, 5.820e-1, -3.119e-4, 6.494e-8)),
    _c("nC7H16", "n-Heptane", 100.204, 540.20, 27.40, 0.350, (-5.146, 6.762e-1, -3.651e-4, 7.658e-8)),
    _c("nC8H18", "n-Octane", 114.231, 568.70, 24.90, 0.399, (-6.096, 7.712e-1, -4.195e-4, 8.855e-8)),
    _c("N2", "Nitrogen", 28.014, 126.20, 33.98, 0.037, (31.15, -1.357e-2, 2.680e-5, -1.168e-8)),
    _c("O2", "Oxygen", 31.999, 154.58, 50.43, 0.022, (28.11, -3.680e-6, 1.746e-5, -1.065e-8)),
    _c("CO2", "Carbon dioxide", 44.010, 304.21, 73.83, 0.224, (19.80, 7.344e-2, -5.602e-5, 1.715e-8)),
    _c("H2S", "Hydrogen sulfide", 34.082, 373.53, 89.63, 0.094, (31.94, 1.436e-3, 2.432e-5, -1.176e-8)),
    _c("H2", "Hydrogen", 2.016, 33.19, 13.13, -0.216, (27.14, 9.274e-3, -1.381e-5, 7.645e-9)),
    _c("H2O", "Water", 18.015, 647.14, 220.64, 0.344, (32.24, 1.924e-3, 1.055e-5, -3.596e-9)),
    _c("CO", "Carbon monoxide", 28.010, 132.92, 34.99, 0.048, (30.87, -1.285e-2, 2.789e-5, -1.272e-8)),
    _c("Ar", "Argon", 39.948, 150.86, 48.98, -0.002, (20.786, 0.0, 0.0, 0.0)),
    _c("He", "Helium", 4.003, 5.20, 2.28, -0.390, (20.786, 0.0, 0.0, 0.0)),
]}

# Names used by CoolProp for the optional reference backend.
COOLPROP_NAMES = {
    "CH4": "Methane", "C2H6": "Ethane", "C3H8": "n-Propane", "iC4H10": "IsoButane",
    "nC4H10": "n-Butane", "iC5H12": "Isopentane", "nC5H12": "n-Pentane", "nC6H14": "n-Hexane",
    "nC7H16": "n-Heptane", "nC8H18": "n-Octane", "N2": "Nitrogen", "O2": "Oxygen",
    "CO2": "CarbonDioxide", "H2S": "HydrogenSulfide", "H2": "Hydrogen", "H2O": "Water",
    "CO": "CarbonMonoxide", "Ar": "Argon", "He": "Helium",
}

# Default binary interaction parameters for Peng-Robinson (symmetric).
# Typical literature values for natural-gas systems; zero where not listed.
KIJ: dict[frozenset, float] = {
    frozenset({"CH4", "CO2"}): 0.100, frozenset({"CH4", "N2"}): 0.030,
    frozenset({"CH4", "H2S"}): 0.080, frozenset({"C2H6", "CO2"}): 0.130,
    frozenset({"C3H8", "CO2"}): 0.135, frozenset({"N2", "CO2"}): -0.020,
    frozenset({"C2H6", "N2"}): 0.040, frozenset({"C3H8", "N2"}): 0.080,
    frozenset({"CO2", "H2S"}): 0.097, frozenset({"H2O", "CH4"}): 0.500,
    frozenset({"H2O", "CO2"}): 0.190, frozenset({"H2O", "C2H6"}): 0.500,
    frozenset({"H2O", "C3H8"}): 0.500, frozenset({"H2O", "N2"}): 0.480,
    frozenset({"H2O", "H2S"}): 0.040,
}


def kij(a: str, b: str) -> float:
    if a == b:
        return 0.0
    return KIJ.get(frozenset({a, b}), 0.0)
