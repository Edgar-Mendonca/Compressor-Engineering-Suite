"""Adapter to Petrobras ROSS (https://github.com/petrobras/ross).

Converts a compsuite ``RotorModel`` into a ROSS ``Rotor`` element by element
(same mesh, sections, disks and bearing coefficients) so that natural
frequencies and log decrements can be cross-checked with an independent,
widely used rotordynamics code. ROSS is optional: install it with
``pip install ross-rotordynamics``.
"""

from __future__ import annotations

import math

import numpy as np


def ross_available() -> bool:
    try:
        import ross  # noqa: F401
        return True
    except ImportError:
        return False


def to_ross(model, speeds_rad: np.ndarray | None = None):
    """Build a ross.Rotor equivalent to ``model``.

    Speed-dependent supports are sampled at ``speeds_rad`` (ROSS interpolates
    between them); constant supports need no speeds.
    """
    import ross as rs
    mat = rs.Material(name="compsuite_shaft", rho=model.rho, E=model.E, G_s=model.G)
    shaft = [rs.ShaftElement(L=L, idl=sec.id, odl=sec.od, material=mat, shear_effects=True,
                             rotary_inertia=True, gyroscopic=True)
             for _, L, sec in model.elements()]
    disks = [rs.DiskElement(n=model.node_at(pm.z), m=pm.mass, Id=pm.it, Ip=pm.ip) for pm in model.masses]
    bearings = []
    for sp in model.supports:
        n = model.node_at(sp.z)
        if speeds_rad is None:
            c = sp.coefficients(0.0)
            bearings.append(rs.BearingElement(n=n, kxx=c["kxx"], kyy=c["kyy"], kxy=c["kxy"], kyx=c["kyx"],
                                              cxx=c["cxx"], cyy=c["cyy"], cxy=c["cxy"], cyx=c["cyx"], tag=sp.label))
        else:
            rows = [sp.coefficients(float(w)) for w in speeds_rad]
            col = {k: np.array([r[k] for r in rows]) for k in rows[0]}
            bearings.append(rs.BearingElement(n=n, kxx=col["kxx"], kyy=col["kyy"], kxy=col["kxy"], kyx=col["kyx"],
                                              cxx=col["cxx"], cyy=col["cyy"], cxy=col["cxy"], cyx=col["cyx"],
                                              frequency=np.asarray(speeds_rad), tag=sp.label))
    return rs.Rotor(shaft, disk_elements=disks, bearing_elements=bearings)


def ross_modal(model, omega: float, n_modes: int = 8, speeds_rad: np.ndarray | None = None) -> list[dict]:
    """Damped natural frequencies (Hz) and log decrements from ROSS at speed omega."""
    rotor = to_ross(model, speeds_rad)
    res = rotor.run_modal(speed=omega, num_modes=2 * n_modes, sparse=False)
    out = []
    for wd, ld in zip(res.wd, res.log_dec):
        if wd > 1e-3:
            out.append({"freq_hz": float(wd) / (2 * math.pi), "logdec": float(ld)})
    return sorted(out, key=lambda m: m["freq_hz"])[:n_modes]
