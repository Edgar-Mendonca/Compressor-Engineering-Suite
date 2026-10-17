"""Parametric rotor assembly.

Builds a stepped shaft with impellers, balance piston, shaft-end seal
sleeves, journals, thrust collar and coupling hub from the aerodynamic
design, or takes a user-defined geometry (``ShaftDesign.sections_override``
etc.). Layout rules are typical industrial proportions and are reported in
the trace so they can be reviewed.

z = 0 is the coupling-end shaft tip; the impeller eyes face the coupling end
(suction at the drive end). Positive thrust acts toward the coupling end.
"""

from __future__ import annotations

import math

from compsuite.core.trace import record
from compsuite.rotordynamics.fe import PointMass, RotorModel, Section, Support

STEP = 0.005  # round diameters up to 5 mm
SLENDERNESS = 8.5  # max bearing span / shaft diameter at impellers


def _round_up(d: float) -> float:
    return math.ceil(d / STEP - 1e-9) * STEP


def coupling_estimate(torque: float) -> dict:
    """Flexible disc coupling half (incl. half spacer) - typical proportions."""
    m = 8.0 * (torque / 1000.0) ** 0.7
    D = 0.14 * (torque / 1000.0) ** (1 / 3)
    ip = 1.2 * m * D**2 / 8
    return {"mass_kg": m, "outer_diameter_m": D, "ip_kgm2": ip, "it_kgm2": ip / 2 + m * 0.15**2 / 12}


def build_rotor(project, sizing: dict, stages: list[dict], impellers: list[dict], casing_power_w: float,
                shaft_mat: dict, impeller_mat: dict) -> dict:
    sd = project.shaft
    rec = record("mechanical.rotor", "Parametric rotor layout from stage design", [sd, [s["index"] for s in stages]],
                 assumptions=[f"Shaft diameter at impellers >= torsion (0.15 Sy allowable incl. {sd.torque_transient_factor}x transient) "
                              f"and >= bearing span / {SLENDERNESS:.0f}",
                              "Journal diameter 0.75 x impeller-shaft diameter; seal sleeves 0.95 x",
                              "End zone (seals) length 0.20 m + 0.25 D2; stage pitch 0.22 D2 + 3 b2 + 20 mm",
                              "Balance piston sized for the target residual thrust toward the coupling end",
                              "Coupling half and DGS sleeve masses from typical proportions"])
    omega = sizing["speed_rpm"] * math.pi / 30
    torque = casing_power_w / omega
    D2 = sizing["impeller_diameter_m"]
    tau_allow = 0.15 * shaft_mat["yield_mpa"] * 1e6
    d_torsion = (16 * torque * sd.torque_transient_factor / (math.pi * tau_allow)) ** (1 / 3)

    pitches = [0.22 * D2 + 3 * imp["b2_mm"] / 1e3 + 0.02 for imp in impellers]
    end_zone = 0.20 + 0.25 * D2
    n_bp_len = project.seals.balance_piston_teeth * project.seals.labyrinth_pitch_mm / 1e3 + 0.03
    section_gap = sum(0.5 * D2 for i in range(1, len(stages)) if stages[i]["section"] != stages[i - 1]["section"])

    d_imp = sd.shaft_diameter_at_impellers_mm / 1e3 if sd.shaft_diameter_at_impellers_mm else None
    for _ in range(5):
        d_guess = d_imp or max(d_torsion, 0.08)
        d_j = sd.journal_diameter_mm / 1e3 if sd.journal_diameter_mm else _round_up(0.75 * d_guess)
        L_j = project.bearings.length_to_diameter * d_j
        span = L_j + 0.10 + 2 * end_zone + sum(pitches) + section_gap + n_bp_len
        if sd.shaft_diameter_at_impellers_mm:
            break
        # Slenderness sets the shaft, but never beyond a hub that still leaves an impeller
        # (hub <= 0.5 D2); a longer rotor is then flagged by the span/D check instead.
        d_new = _round_up(max(d_torsion, min(span / SLENDERNESS, 0.4 * D2)))
        if d_imp and abs(d_new - d_imp) < 1e-9:
            break
        d_imp = d_new
    d_j = sd.journal_diameter_mm / 1e3 if sd.journal_diameter_mm else _round_up(0.75 * d_imp)
    d_seal = _round_up(0.95 * d_imp)
    d_cpl = _round_up(max(d_torsion * 0.9, 0.6 * d_j))
    L_j = project.bearings.length_to_diameter * d_j

    # --- thrust balance --------------------------------------------------------
    P_s = stages[0]["P_in_bara"] * 1e5
    P_d = stages[-1]["P_out_bara"] * 1e5
    gross = sum(imp["thrust_n"] for imp in impellers)
    target = project.bearings.thrust_target_residual_kn * 1e3
    dP = P_d - P_s
    if gross > target and dP > 0:
        d_bp = math.sqrt(4 * (gross - target) / (math.pi * dP) + d_seal**2)
    else:
        d_bp = d_imp * 1.05
    d_bp = max(d_bp, d_imp * 1.05)
    F_bp = dP * math.pi / 4 * (d_bp**2 - d_seal**2)
    residual = gross - F_bp
    swing = 0.3 * abs(gross)
    thrust_design = max(abs(residual) + swing, 5e3)
    pad_area = thrust_design / (project.bearings.thrust_allowable_unit_load_mpa * 1e6)
    d_in = d_j * 1.1
    d_collar = math.sqrt(pad_area / 0.8 * 4 / math.pi + d_in**2)

    # --- axial layout ----------------------------------------------------------
    if sd.sections_override:
        sections, z = [], 0.0
        for s in sd.sections_override:
            sections.append(Section(z, z + s.length_mm / 1e3, s.od_mm / 1e3, s.id_mm / 1e3, s.label))
            z += s.length_mm / 1e3
        z_b1, z_b2 = (sd.bearing_positions_mm_override or [sections[0].z1 * 1e3, sections[-1].z0 * 1e3])[:2]
        z_b1, z_b2 = z_b1 / 1e3, z_b2 / 1e3
        sp = z_b2 - z_b1
        n = len(impellers)
        imp_z = [z_b1 + sp * (0.3 + 0.4 * (i + 0.5) / n) for i in range(n)]
        z_bp_c = z_b1 + 0.78 * sp
        z_tc_c = sections[-1].z1 - 0.05
        z_sleeves = [z_b1 + 0.12 * sp, z_b2 - 0.12 * sp]
        rec.assumptions.append("User-defined shaft geometry; attached masses placed by span fractions unless overridden")
    else:
        sections = []
        def add(length, od, label):
            z0 = sections[-1].z1 if sections else 0.0
            sections.append(Section(z0, z0 + length, od, 0.0, label))
            return z0
        add(0.12, d_cpl, "Coupling stub")
        z_b1 = sd.coupling_overhang_mm / 1e3
        add(z_b1 - 0.12 + L_j / 2 + 0.05, d_j, "Journal 1")
        add(end_zone, d_seal, "Seal sleeve DE")
        imp_z = []
        for i, (st, p) in enumerate(zip(stages, pitches)):
            if i > 0 and st["section"] != stages[i - 1]["section"]:
                add(0.5 * D2, d_imp, "Intercooler nozzle zone")
            z0 = add(p, d_imp, f"Impeller {st['index'] + 1}")
            imp_z.append(z0 + p / 2)
        z_bp0 = add(n_bp_len, d_imp, "Balance piston")
        add(end_zone, d_seal, "Seal sleeve NDE")
        z_j2 = add(L_j + 0.10, d_j, "Journal 2")
        z_b2 = z_j2 + 0.05 + L_j / 2
        z_tc = add(0.10, d_j, "Thrust collar")
        add(0.06, _round_up(0.8 * d_j), "Shaft end NDE")
        z_bp_c = z_bp0 + n_bp_len / 2
        z_tc_c = z_tc + 0.05
        nde = next(s for s in sections if s.label == "Seal sleeve NDE")
        z_sleeves = [sections[2].z0 + 0.06, nde.z1 - 0.06]

    # --- attached masses -------------------------------------------------------
    masses = []
    if sd.masses_override:
        for m in sd.masses_override:
            masses.append(PointMass(m.label, m.position_mm / 1e3, m.mass_kg, m.ip_kgm2, m.it_kgm2, m.kind))
    else:
        cpl = coupling_estimate(torque * 1.5)
        masses.append(PointMass("Coupling half", 0.03, cpl["mass_kg"], cpl["ip_kgm2"], cpl["it_kgm2"], "coupling"))
        for imp, z in zip(impellers, imp_z):
            masses.append(PointMass(f"Impeller {imp['index'] + 1}", z, imp["mass_kg"], imp["ip_kgm2"], imp["it_kgm2"], "impeller"))
        rho = impeller_mat["density_kg_m3"]
        m_bp = rho * math.pi / 4 * (d_bp**2 - d_imp**2) * n_bp_len * 0.7
        masses.append(PointMass("Balance piston", z_bp_c, m_bp, m_bp * (d_bp**2 + d_imp**2) / 8,
                                m_bp * (3 * (d_bp**2 + d_imp**2) / 16 + n_bp_len**2) / 12, "balance_piston"))
        m_tc = shaft_mat["density_kg_m3"] * math.pi / 4 * (d_collar**2 - d_j**2) * 0.04
        masses.append(PointMass("Thrust collar", z_tc_c, m_tc, m_tc * (d_collar**2 + d_j**2) / 8,
                                m_tc * (3 * (d_collar**2 + d_j**2) / 16 + 0.04**2) / 12, "thrust_collar"))
        for label, zs in zip(("DGS sleeve DE", "DGS sleeve NDE"), z_sleeves):
            m_s = shaft_mat["density_kg_m3"] * math.pi / 4 * ((1.6 * d_seal) ** 2 - d_seal**2) * 0.10 * 0.5
            masses.append(PointMass(label, zs, m_s, m_s * ((1.6 * d_seal) ** 2 + d_seal**2) / 8,
                                    m_s * (3 * ((1.6 * d_seal) ** 2 + d_seal**2) / 16 + 0.01) / 12, "sleeve"))

    span = z_b2 - z_b1
    if span / d_imp > SLENDERNESS * 1.05:
        rec.warn(f"Bearing span / shaft diameter = {span / d_imp:.1f} exceeds {SLENDERNESS:.0f}: flexible rotor, check stability")
    if abs(residual) + swing > thrust_design + 1:
        rec.warn("Thrust swing exceeds thrust bearing capacity")
    seal_locs = [(s.label, 0.5 * (s.z0 + s.z1), s.od) for s in sections if "Seal" in s.label or "Impeller" in s.label
                 or "Balance" in s.label]
    return {
        "sections": [{"z0_m": s.z0, "z1_m": s.z1, "od_m": s.od, "id_m": s.id, "label": s.label} for s in sections],
        "masses": [{"label": m.label, "kind": m.kind, "z_m": m.z, "mass_kg": m.mass, "ip_kgm2": m.ip, "it_kgm2": m.it}
                   for m in masses],
        "bearing_z_m": [z_b1, z_b2], "bearing_span_m": span, "span_to_diameter": span / d_imp,
        "shaft_diameter_impellers_m": d_imp, "journal_diameter_m": d_j, "journal_length_m": L_j,
        "seal_diameter_m": d_seal, "coupling_diameter_m": d_cpl, "coupling_hub_z_m": 0.06,
        "torsion_min_diameter_m": d_torsion, "casing_torque_nm": torque,
        "balance_piston_diameter_m": d_bp, "thrust": {"gross_impeller_n": gross, "balance_piston_n": F_bp,
                                                      "residual_n": residual, "design_swing_n": swing,
                                                      "thrust_bearing_load_n": thrust_design,
                                                      "pad_area_m2": pad_area, "collar_diameter_m": d_collar},
        "close_clearance_locations": [{"label": a, "z_m": b, "diameter_m": c} for a, b, c in seal_locs],
        "impeller_z_m": imp_z, "trace": rec,
    }


def fe_model(rotor: dict, shaft_mat: dict, supports: list[Support], max_el: float = 0.06) -> RotorModel:
    sections = [Section(s["z0_m"], s["z1_m"], s["od_m"], s["id_m"], s["label"]) for s in rotor["sections"]]
    masses = [PointMass(m["label"], m["z_m"], m["mass_kg"], m["ip_kgm2"], m["it_kgm2"], m["kind"]) for m in rotor["masses"]]
    return RotorModel(sections, masses, supports, shaft_mat["E_pa"], shaft_mat["shear_modulus_pa"],
                      shaft_mat["density_kg_m3"], max_element_length=max_el)
