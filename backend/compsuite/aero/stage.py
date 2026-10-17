"""Generic centrifugal stage characteristics and correlations.

The dimensionless curves are normalised generic shapes for a backswept,
shrouded industrial stage with vaned or vaneless diffuser. They are
intended for preliminary maps and off-design trends, not vendor guarantees.
Replace them with measured or vendor stage curves when available.
"""

from __future__ import annotations

import math

# Normalised curve parameters (r = phi / phi_design).
PSI_SLOPE = 0.30
PSI_CURV = 0.50
CHOKE_ONSET = 1.15
CHOKE_PSI = 8.0
CHOKE_ETA = 4.0
ETA_CURV = 0.60
R_SURGE = 0.70
R_STONEWALL = 1.40


def efficiency_correlation(phi: float, mach_u: float = 0.8) -> float:
    """Peak polytropic stage efficiency vs. design flow coefficient.

    Shape follows published industrial stage trends (e.g. Lüdtke,
    "Process Centrifugal Compressors", 2004): about 0.845 near
    phi = 0.08 falling for narrow low-flow stages and slightly for very high
    flow stages, including a typical inlet/volute allowance. A
    machine-Mach penalty is applied above Mu = 0.9.
    """
    phi = max(phi, 1e-3)
    eta = 0.845 - 0.035 * math.log(phi / 0.08) ** 2
    if mach_u > 0.9:
        eta -= 0.10 * (mach_u - 0.9)
    return max(0.55, min(0.88, eta))


def psi_ratio(r: float) -> float:
    x = r - 1.0
    val = 1.0 - PSI_SLOPE * x - PSI_CURV * x * x
    if r > CHOKE_ONSET:
        val -= CHOKE_PSI * (r - CHOKE_ONSET) ** 2
    return max(val, 0.0)


def eta_ratio(r: float) -> float:
    x = r - 1.0
    val = 1.0 - ETA_CURV * x * x
    if r > CHOKE_ONSET:
        val -= CHOKE_ETA * (r - CHOKE_ONSET) ** 2
    return max(val, 0.05)


def wiesner_slip(blades: int, backsweep_deg: float) -> float:
    """Wiesner (1967) slip factor; backsweep measured from the radial direction."""
    return 1.0 - math.sqrt(math.cos(math.radians(backsweep_deg))) / blades**0.7
