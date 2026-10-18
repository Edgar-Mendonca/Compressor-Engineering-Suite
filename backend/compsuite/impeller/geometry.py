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
INCIDENCE_DEG = 2.0   # design incidence at the eye tip (blade angle minus flow angle)
DE_HALLER_MIN = 0.55  # w2/w1,tip; Japikse diffusion ratio w1s/w2 <= ~1.8 (0.7 is the classic blade-row de Haller limit)
VENDOR_KEYS = ("D2_mm", "bore_mm", "b2_mm", "blades", "mass_kg", "cg_mm", "ip_kgm2", "it_kgm2")
VENDOR_LIMITS = {"D2_mm": 0.01, "bore_mm": 0.02, "b2_mm": 0.15, "blades": 0.0, "mass_kg": 0.15, "ip_kgm2": 0.15, "it_kgm2": 0.25,
                 "yield_mpa": 0.10, "uts_mpa": 0.10}


def _tri(cm: float, U: float, cu: float) -> dict:
    """Velocity triangle: absolute c, relative w, angles from tangential (deg)."""
    wu = U - cu
    return {"U": U, "cm": cm, "cu": cu, "c": math.hypot(cm, cu), "w": math.hypot(cm, wu), "wu": wu,
            "alpha_deg": math.degrees(math.atan2(cm, cu)), "beta_deg": math.degrees(math.atan2(cm, wu))}


def velocity_triangles(Q_in: float, Q_out: float, omega: float, D1: float, hub_d: float, D2: float, b2: float, blades: int,
                       backsweep_deg: float, sound_in: float, blockage: float = BLOCKAGE, incidence_deg: float = INCIDENCE_DEG) -> dict:
    """Inlet (hub / mean / tip, axial inflow, no prewhirl) and outlet triangles, Wiesner slip, de Haller ratio."""
    cm1 = Q_in / (math.pi / 4 * (D1**2 - hub_d**2))
    rh, rt = hub_d / 2, D1 / 2
    inlet = {}
    for nm, r in (("hub", rh), ("mean", math.sqrt((rh**2 + rt**2) / 2)), ("tip", rt)):
        t = _tri(cm1, omega * r, 0.0)
        t.update(r_mm=r * 1e3, beta_blade_deg=t["beta_deg"] + incidence_deg, incidence_deg=incidence_deg,
                 relative_mach=t["w"] / max(sound_in, 1.0))
        inlet[nm] = t
    U2 = omega * D2 / 2
    cm2 = Q_out / (math.pi * D2 * b2 * (1 - blockage))
    sigma = wiesner_slip(blades, backsweep_deg)
    cu2 = U2 * (sigma - cm2 / U2 * math.tan(math.radians(backsweep_deg)))
    out = _tri(cm2, U2, cu2)
    out.update(beta_blade_deg=90.0 - backsweep_deg, slip_factor=sigma, slip_velocity=(1 - sigma) * U2, deviation_deg=(90.0 - backsweep_deg) - out["beta_deg"])
    dh = out["w"] / inlet["tip"]["w"]
    return {"inlet": inlet, "outlet": out, "de_haller": dh, "de_haller_ok": dh >= DE_HALLER_MIN, "phi2": cm2 / U2,
            "work_coefficient": cu2 / U2, "b2_D2": b2 / D2}


def apply_vendor(g: dict, v: dict | None, material: dict) -> dict:
    """Replace correlation values with vendor data; keep the estimates and a validation table."""
    if not v:
        g["vendor"], g["validation"] = None, []
        return g
    v = {k: x for k, x in v.items() if x is not None}
    est = {k: g.get(k) for k in VENDOR_KEYS} | {"yield_mpa": material["yield_mpa"], "uts_mpa": material["uts_mpa"]}
    rows = []
    for k in (*VENDOR_KEYS, "yield_mpa", "uts_mpa"):
        if k in v and est.get(k) is not None:
            d = (est[k] - v[k]) / v[k] * 100 if v[k] else 0.0
            lim = VENDOR_LIMITS.get(k)
            rows.append({"key": k, "estimate": est[k], "vendor": v[k], "diff_pct": d, "limit_pct": None if lim is None else lim * 100,
                         "status": "info" if lim is None else ("pass" if abs(d) <= lim * 100 + 1e-9 else "attention")})
    g.update({k: v[k] for k in VENDOR_KEYS if k in v})
    if "blades" in v:
        g["blades"] = int(v["blades"])
    g["b2_D2"] = g["b2_mm"] / g["D2_mm"]
    g["estimate"], g["vendor"], g["validation"] = est, v, rows
    return g


def impeller_geometry(stage: dict, D2: float, U2: float, m_dot: float, shaft_d: float, material: dict,
                      yield_fraction: float = 0.8, vendor: dict | None = None) -> dict:
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

    # Eye diameter for minimum inlet relative velocity. A hub that leaves no room
    # (very small, high-speed stages on a thick shaft) is reported by the checks.
    # The eye stays within 0.75 D2 (shrouded impeller practice): a stage whose flow needs a
    # larger eye is flow-limited (high inlet Mach / cm1) and flagged by the checks.
    hub_d = min(hub_d, 0.5 * D2)
    lo, hi = hub_d * 1.05, max(0.75 * D2, hub_d * 1.1)
    res = minimize_scalar(w1_tip, bounds=(lo, hi), method="bounded")
    D1 = min(float(res.x), 0.75 * D2)
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
    g = {"index": stage["index"], "D2_mm": D2 * 1e3, "b2_mm": b2 * 1e3, "b2_D2": b2 / D2, "D1_eye_mm": D1 * 1e3, "bore_mm": shaft_d * 1e3,
            "hub_mm": hub_d * 1e3, "blades": BLADES, "backsweep_deg": BACKSWEEP_DEG, "slip_factor": sigma,
            "work_coefficient": work_coeff, "inlet_cm_m_s": cm1, "inlet_w1_tip_m_s": res.fun,
            "inlet_relative_mach": res.fun / max(stage.get("sound_in", 1e9), 1.0),
            "mass_kg": mass, "ip_kgm2": ip, "it_kgm2": it, "axial_length_mm": axial_len * 1e3,
            "bore_hoop_stress_mpa": sig_bore / 1e6, "average_hoop_stress_mpa": sig_avg / 1e6,
            "max_tip_speed_for_material_m_s": tip_speed_capability, "eye_limited": D1 >= 0.75 * D2 - 1e-6,
            "eye_tip_ratio": D1 / D2, "hub_tip_ratio": hub_d / D2, "cg_mm": None, "tip_speed_m_s": U2, "rpm": omega * 30 / math.pi}
    g = apply_vendor(g, vendor, material)
    g["tip_speed_m_s"] = omega * g["D2_mm"] / 2e3
    if vendor and (vendor.get("yield_mpa") or vendor.get("uts_mpa")):
        g["material_override"] = {k: vendor[k] for k in ("yield_mpa", "uts_mpa", "E_gpa", "poisson", "density_kg_m3", "temperature_c") if vendor.get(k)}
    vt = velocity_triangles(Q_in, Q_out, omega, D1, hub_d, g["D2_mm"] / 1e3, g["b2_mm"] / 1e3, g["blades"], BACKSWEEP_DEG,
                            stage.get("sound_in", 1e9))
    g.update(triangles=vt, de_haller=vt["de_haller"], slip_factor=vt["outlet"]["slip_factor"], work_coefficient=vt["work_coefficient"],
             flow_coefficient=stage.get("phi"), head_coefficient=stage.get("psi"))
    mo = g.get("material_override", {})
    g["material"] = {"name": material.get("key"), "E_gpa": mo.get("E_gpa", material.get("E_pa", 2e11) / 1e9), "poisson": mo.get("poisson", nu),
                     "density_kg_m3": mo.get("density_kg_m3", rho_m), "yield_mpa": mo.get("yield_mpa", material["yield_mpa"]),
                     "uts_mpa": mo.get("uts_mpa", material["uts_mpa"]), "temperature_c": mo.get("temperature_c", material.get("temperature_c")),
                     "T_in_c": stage.get("T_in_c"), "T_out_c": stage.get("T_out_c"), "source": "vendor" if mo else "database"}
    if vendor:
        g["max_tip_speed_for_material_m_s"] = math.sqrt(vendor.get("yield_mpa", material["yield_mpa"]) * 1e6 * yield_fraction / (rho_m * (3 + nu) / 4))
    return g


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


def impeller_set(sizing: dict, gas, shaft_d: float, material: dict, criteria, vendor: list | None = None) -> dict:
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
        vd = next((x for x in (vendor or []) if int(x.get("impeller", 0)) == st["index"] + 1), None)
        g = impeller_geometry(st, D2, U2, m, shaft_d, material, criteria.impeller_yield_fraction, vd)
        g["thrust_n"] = axial_thrust(st, g, omega, m)
        allow = criteria.impeller_yield_fraction * g.get("material_override", {}).get("yield_mpa", material["yield_mpa"])
        g["stress_utilisation"] = g["bore_hoop_stress_mpa"] / allow
        if g["stress_utilisation"] > 1:
            rec.warn(f"Impeller {st['index'] + 1}: bore hoop stress {g['bore_hoop_stress_mpa']:.0f} MPa exceeds "
                     f"{criteria.impeller_yield_fraction:.0%} of yield ({allow:.0f} MPa)")
        if g["b2_D2"] < 0.012:
            rec.warn(f"Impeller {st['index'] + 1}: b2/D2 = {g['b2_D2']:.4f} is very narrow (efficiency/manufacturing)")
        if not g["triangles"]["de_haller_ok"]:
            rec.warn(f"Impeller {st['index'] + 1}: de Haller ratio w2/w1 = {g['de_haller']:.2f} < {DE_HALLER_MIN} (diffusion / separation risk)")
        for r_ in g["validation"]:
            if r_["status"] == "attention":
                rec.warn(f"Impeller {st['index'] + 1}: estimate of {r_['key']} differs from vendor by {r_['diff_pct']:.0f} % (limit {r_['limit_pct']:.0f} %)")
        if g["inlet_relative_mach"] > 0.9:
            rec.warn(f"Impeller {st['index'] + 1}: inlet relative Mach {g['inlet_relative_mach']:.2f} > 0.9")
        out.append(g)
    psi_check = [g["work_coefficient"] * st["eta"] for g, st in zip(out, sizing["stages"])]
    return {"impellers": out, "gross_thrust_n": sum(g["thrust_n"] for g in out),
            "head_coefficient_from_geometry": psi_check, "trace": rec}
