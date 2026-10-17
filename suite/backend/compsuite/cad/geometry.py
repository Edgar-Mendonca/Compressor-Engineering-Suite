"""Rotor geometry for visualisation and CAD export.

* ``scene``: a JSON scene description (lathe profiles and blade counts) that
  the browser renders with Three.js.
* ``rotor_stl``: an ASCII STL of the rotor assembly built from surfaces of
  revolution in pure NumPy (no CAD kernel needed).
* ``rotor_step``: a STEP solid via CadQuery/OpenCASCADE when installed.
"""

from __future__ import annotations

import math

import numpy as np


def impeller_profile(imp: dict, z_c: float) -> dict:
    """Simplified closed-impeller envelope: eye toward the coupling (low z)."""
    r2, r1, rh = imp["D2_mm"] / 2e3, imp["D1_eye_mm"] / 2e3, imp["hub_mm"] / 2e3
    L = imp["axial_length_mm"] / 1e3
    z0 = z_c - L / 2
    envelope = [(rh, z0 + L), (r2, z0 + L - 0.2 * L), (r2, z0 + 0.45 * L), (r1 * 1.05, z0), (rh, z0)]
    return {"r2": r2, "r1": r1, "rh": rh, "b2": imp["b2_mm"] / 1e3, "z0": z0, "length": L,
            "blades": imp["blades"], "envelope": envelope}


def scene(rotor: dict, impellers: list[dict], bearings: dict | None = None) -> dict:
    parts = []
    for s in rotor["sections"]:
        parts.append({"type": "cylinder", "label": s["label"], "z0": s["z0_m"], "z1": s["z1_m"],
                      "r_outer": s["od_m"] / 2, "r_inner": s["id_m"] / 2, "material": "shaft"})
    imp_masses = [m for m in rotor["masses"] if m["kind"] == "impeller"]
    for imp, m in zip(impellers, imp_masses):
        p = impeller_profile(imp, m["z_m"])
        parts.append({"type": "impeller", "label": m["label"], "z_center": m["z_m"], "r2": p["r2"], "r1": p["r1"],
                      "r_hub": p["rh"], "b2": p["b2"], "length": p["length"], "blades": p["blades"],
                      "backsweep_deg": imp["backsweep_deg"], "material": "impeller"})
    for m in rotor["masses"]:
        if m["kind"] == "balance_piston":
            parts.append({"type": "disk", "label": m["label"], "z_center": m["z_m"], "r_outer": rotor["balance_piston_diameter_m"] / 2,
                          "thickness": 0.06, "material": "piston"})
        elif m["kind"] == "thrust_collar":
            parts.append({"type": "disk", "label": m["label"], "z_center": m["z_m"], "r_outer": rotor["thrust"]["collar_diameter_m"] / 2,
                          "thickness": 0.035, "material": "collar"})
        elif m["kind"] == "coupling":
            parts.append({"type": "disk", "label": m["label"], "z_center": 0.04, "r_outer": rotor["coupling_diameter_m"] * 1.4,
                          "thickness": 0.08, "material": "coupling"})
        elif m["kind"] == "sleeve":
            parts.append({"type": "disk", "label": m["label"], "z_center": m["z_m"], "r_outer": rotor["seal_diameter_m"] * 0.8,
                          "thickness": 0.10, "material": "sleeve"})
    for i, z in enumerate(rotor["bearing_z_m"]):
        parts.append({"type": "bearing", "label": f"Journal bearing {i + 1}", "z_center": z,
                      "r_inner": rotor["journal_diameter_m"] / 2, "r_outer": rotor["journal_diameter_m"] * 0.85,
                      "width": rotor["journal_length_m"], "material": "bearing"})
    return {"units": "m", "axis": "z", "parts": parts, "length": rotor["sections"][-1]["z1_m"]}


def _revolve(profile: list[tuple[float, float]], n: int = 48) -> list[np.ndarray]:
    """Triangles of the surface of revolution of an (r, z) polyline about z."""
    tris = []
    th = np.linspace(0, 2 * math.pi, n + 1)
    for (ra, za), (rb, zb) in zip(profile[:-1], profile[1:]):
        for t0, t1 in zip(th[:-1], th[1:]):
            p1 = np.array([ra * math.cos(t0), ra * math.sin(t0), za])
            p2 = np.array([rb * math.cos(t0), rb * math.sin(t0), zb])
            p3 = np.array([rb * math.cos(t1), rb * math.sin(t1), zb])
            p4 = np.array([ra * math.cos(t1), ra * math.sin(t1), za])
            tris += [np.array([p1, p2, p3]), np.array([p1, p3, p4])]
    return tris


def rotor_profile(rotor: dict, impellers: list[dict]) -> list[tuple[float, float]]:
    """Closed outer (r, z) profile of shaft + impeller envelopes."""
    pts = [(0.0, 0.0)]
    for s in rotor["sections"]:
        r = s["od_m"] / 2
        pts += [(r, s["z0_m"]), (r, s["z1_m"])]
    pts.append((0.0, rotor["sections"][-1]["z1_m"]))
    return pts


def rotor_stl(rotor: dict, impellers: list[dict], name: str = "rotor") -> str:
    tris = _revolve(rotor_profile(rotor, impellers))
    imp_masses = [m for m in rotor["masses"] if m["kind"] == "impeller"]
    for imp, m in zip(impellers, imp_masses):
        env = impeller_profile(imp, m["z_m"])["envelope"]
        tris += _revolve(env + [env[0]])
    lines = [f"solid {name}"]
    for t in tris:
        nrm = np.cross(t[1] - t[0], t[2] - t[0])
        ln = np.linalg.norm(nrm)
        nrm = nrm / ln if ln > 0 else nrm
        lines.append(f"facet normal {nrm[0]:.6e} {nrm[1]:.6e} {nrm[2]:.6e}")
        lines.append("outer loop")
        for v in t:
            lines.append(f"vertex {v[0]:.6e} {v[1]:.6e} {v[2]:.6e}")
        lines.append("endloop")
        lines.append("endfacet")
    lines.append(f"endsolid {name}")
    return "\n".join(lines) + "\n"


def cadquery_available() -> bool:
    try:
        import cadquery  # noqa: F401
        return True
    except ImportError:
        return False


def rotor_step(rotor: dict, impellers: list[dict], path: str) -> str:
    """Write a STEP solid of the rotor using CadQuery (optional dependency)."""
    import cadquery as cq
    solid = None
    for s in rotor["sections"]:
        cyl = cq.Workplane("XY").workplane(offset=s["z0_m"] * 1e3).circle(s["od_m"] * 500).extrude((s["z1_m"] - s["z0_m"]) * 1e3)
        if s["id_m"] > 0:
            cyl = cyl.cut(cq.Workplane("XY").workplane(offset=s["z0_m"] * 1e3).circle(s["id_m"] * 500)
                          .extrude((s["z1_m"] - s["z0_m"]) * 1e3))
        solid = cyl if solid is None else solid.union(cyl)
    imp_masses = [m for m in rotor["masses"] if m["kind"] == "impeller"]
    for imp, m in zip(impellers, imp_masses):
        prof = impeller_profile(imp, m["z_m"])["envelope"]
        wheel = (cq.Workplane("XZ").polyline([(r * 1e3, z * 1e3) for r, z in prof]).close()
                 .revolve(360, (0, 0, 0), (0, 1, 0)))
        solid = solid.union(wheel)
    cq.exporters.export(solid, path)
    return path
