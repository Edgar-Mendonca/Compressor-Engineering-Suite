"""Impeller geometry, mass properties, centrifugal stress and axial thrust.

Geometry is estimated from the stage design point:
  * exit width b2 from the stage outlet volume flow and an outlet
    meridional flow coefficient (cm2 / U2),
  * eye diameter by minimising the inlet relative tip velocity,
  * blade number / backsweep from typical practice and the Wiesner slip
    factor, giving the Euler work coefficient as a consistency check.

Mass and inertia use an equivalent-disk model calibrated to typical
closed (shrouded) industrial impellers. Replace with CAD values once a
geometry exists.
"""

from __future__ import annotations

import math

from scipy.optimize import minimize_scalar

from compsuite.aero.stage import wiesner_slip
from compsuite.core.trace import record

OUTLET_CM_RATIO = 0.27
BLOCKAGE = 0.10
BLADES = 17
BACKSWEEP_DEG = 40.0  # from radial (blade exit angle 50 deg from tangential)


def impeller_geometry(stage: dict, D2: float, U2: float, m_dot: float, shaft_d: float, material: dict,
                      yield_fraction: float = 0.8) -> dict:
    omega = 2 * U2 / D2
    Q_out = m_dot / stage["rho_out"]
    cm2 = OUTLET_CM_RATIO * U2
    b2 = Q_out / (math.pi * D2 * cm2 * (1 - BLOCKAGE))
    hub_d = 1.25 * shaft_d
    Q_in = stage["Q_in_m3_s"]

    def w1_tip(D1):
        area = math.pi / 4 * (D1**2 - hub_d**2)
        if area <= 0:
            return 1e9
        cm1 = Q_in / area
        return math.hypot(cm1, omega * D1 / 2)

    res = minimize_scalar(w1_tip, bounds=(hub_d * 1.05, 0.85 * D2), method="bounded")
    D1 = float(res.x)
    cm1 = Q_in / (math.pi / 4 * (D1**2 - hub_d**2))
    sigma = wiesner_slip(BLADES, BACKSWEEP_DEG)
    phi2 = OUTLET_CM_RATIO
    work_coeff = sigma - phi2 * math.tan(math.radians(BACKSWEEP_DEG))

    # Equivalent disk: thickness ~ hub disk + shroud + blades.
    rho_m = material["density_kg_m3"]
    t_eq = 0.035 * D2 + b2
    r_o, r_i = D2 / 2, shaft_d / 2
    mass = rho_m * math.pi * (r_o**2 - r_i**2) * t_eq * 0.62  # 0.62: material fraction vs solid disk
    ip = 0.5 * mass * (r_o**2 * 0.55 + r_i**2)  # mass concentrated inboard of the tip
    axial_len = t_eq + 0.6 * b2 + 0.02 * D2
    it = 0.5 * ip + mass * axial_len**2 / 12

    # Rotating annular disk, uniform thickness: tangential stress at bore,
    # and an average tangential stress (shroud/blade loads carried by disk).
    nu = material.get("poisson", 0.3)
    sig_bore = (3 + nu) / 4 * rho_m * omega**2 * (r_o**2 + (1 - nu) / (3 + nu) * r_i**2)
    sig_avg = rho_m * U2**2 / 3.0 * 1.15
    # Solid-disk centre stress (3+nu)/4 rho U2^2 set equal to the allowable.
    tip_speed_capability = math.sqrt(material["yield_mpa"] * 1e6 * yield_fraction / (rho_m * (3 + nu) / 4))
    return {"index": stage["index"], "D2_mm": D2 * 1e3, "b2_mm": b2 * 1e3, "b2_D2": b2 / D2, "D1_eye_mm": D1 * 1e3,
            "hub_mm": hub_d * 1e3, "blades": BLADES, "backsweep_deg": BACKSWEEP_DEG, "slip_factor": sigma,
            "work_coefficient": work_coeff, "inlet_cm_m_s": cm1, "inlet_w1_tip_m_s": res.fun,
            "inlet_relative_mach": res.fun / max(stage.get("sound_in", 1e9), 1.0),
            "mass_kg": mass, "ip_kgm2": ip, "it_kgm2": it, "axial_length_mm": axial_len * 1e3,
            "bore_hoop_stress_mpa": sig_bore / 1e6, "average_hoop_stress_mpa": sig_avg / 1e6,
            "max_tip_speed_for_material_m_s": tip_speed_capability}


def axial_thrust(stage: dict, geom: dict, omega: float, m_dot: float, reaction: float = 0.6, core_rotation: float = 0.5) -> float:
    """Net axial thrust of one impeller (N, positive toward the suction/eye).

    Side cavities carry a pressure that falls inward with a forced vortex of
    core rotation k*omega. Between the eye-seal and the tip both cavities
    cancel; the back cavity also acts between the shaft-seal and the eye
    radius. Inlet momentum reduces the thrust.
    """
    P1, P2 = stage["P_in_bara"] * 1e5, stage["P_out_bara"] * 1e5
    p_tip = P1 + reaction * (P2 - P1)
    rho = stage["rho_out"]
    R2, Re, Rh = geom["D2_mm"] / 2e3, geom["D1_eye_mm"] / 2e3 * 1.05, geom["hub_mm"] / 2e3
    w2 = (core_rotation * omega) ** 2
    force = math.pi * ((p_tip - P1 - rho * w2 * R2**2 / 2) * (Re**2 - Rh**2) + rho * w2 * (Re**4 - Rh**4) / 4)
    return force - m_dot * geom["inlet_cm_m_s"]


def impeller_set(sizing: dict, gas, shaft_d: float, material: dict, criteria) -> dict:
    rec = record("impeller", "Preliminary geometry, equivalent-disk mass properties, rotating-disk stress", sizing["stages"],
                 assumptions=[f"Outlet cm2/U2 = {OUTLET_CM_RATIO}, blockage {BLOCKAGE}",
                              f"{BLADES} blades, {BACKSWEEP_DEG} deg backsweep (from radial), Wiesner slip",
                              "Equivalent-disk mass model for closed impellers (replace with CAD values)",
                              "Bore hoop stress from uniform-thickness rotating annular disk"],
                 references=["Wiesner (1967) ASME J. Eng. Power", "Timoshenko & Goodier, Theory of Elasticity (rotating disks)"])
    D2, U2, m = sizing["impeller_diameter_m"], sizing["tip_speed_m_s"], sizing["mass_flow_kg_s"]
    omega = 2 * U2 / D2
    out = []
    for st in sizing["stages"]:
        st = dict(st)
        st["sound_in"] = gas.state(st["T_in_c"] + 273.15, st["P_in_bara"] * 1e5).sound
        g = impeller_geometry(st, D2, U2, m, shaft_d, material, criteria.impeller_yield_fraction)
        g["thrust_n"] = axial_thrust(st, g, omega, m)
        allow = criteria.impeller_yield_fraction * material["yield_mpa"]
        g["stress_utilisation"] = g["bore_hoop_stress_mpa"] / allow
        if g["stress_utilisation"] > 1:
            rec.warn(f"Impeller {st['index'] + 1}: bore hoop stress {g['bore_hoop_stress_mpa']:.0f} MPa exceeds "
                     f"{criteria.impeller_yield_fraction:.0%} of yield ({allow:.0f} MPa)")
        if g["b2_D2"] < 0.012:
            rec.warn(f"Impeller {st['index'] + 1}: b2/D2 = {g['b2_D2']:.4f} is very narrow (efficiency/manufacturing)")
        if g["inlet_relative_mach"] > 0.9:
            rec.warn(f"Impeller {st['index'] + 1}: inlet relative Mach {g['inlet_relative_mach']:.2f} > 0.9")
        out.append(g)
    psi_check = [g["work_coefficient"] * st["eta"] for g, st in zip(out, sizing["stages"])]
    return {"impellers": out, "gross_thrust_n": sum(g["thrust_n"] for g in out),
            "head_coefficient_from_geometry": psi_check, "trace": rec}
