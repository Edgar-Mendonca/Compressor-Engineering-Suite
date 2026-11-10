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
    _steps(rec, sd, sizing, shaft_mat, impeller_mat, casing_power_w, omega, torque, tau_allow, d_torsion, d_imp, d_j, d_seal, D2,
           span, z_b1, z_b2, P_s, P_d, gross, target, d_bp, F_bp, residual, swing, thrust_design, pad_area, d_in, d_collar,
           project.bearings.thrust_allowable_unit_load_mpa, n_bp_len, masses)
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


def _steps(rec, sd, sizing, shaft_mat, imp_mat, P, omega, T, tau_a, d_t, d, d_j, d_s, D2, span, z_b1, z_b2, P_s, P_d, F_g, F_t,
           d_bp, F_bp, F_r, F_sw, F_d, A_p, d_in, D_c, p_a, L_bp, masses) -> None:
    rec.sym(**{"P": ("Casing shaft power", "W"), r"\omega": ("Shaft angular speed", "rad/s"), "T": ("Casing torque", "N·m"), r"\tau_a": ("Allowable shear stress", "Pa"), "S_y": ("Shaft yield strength", "Pa"),
               "k_t": ("Transient torque factor", "-"), "d_t": ("Minimum shaft diameter for torsion", "m"),
               "d": ("Shaft diameter at the impellers", "m"), "d_j": ("Journal diameter", "m"), "d_s": ("Seal sleeve diameter", "m"),
               "D_2": ("Impeller tip diameter", "m"), "L_s": ("Bearing span", "m"), "z_{b1}": ("Drive-end bearing position", "m"),
               "z_{b2}": ("Non-drive-end bearing position", "m"), r"\Delta p": ("Discharge minus suction pressure", "Pa"),
               "F_i": ("Thrust of one impeller", "N"), "F_g": ("Gross impeller thrust", "N"), "F_t": ("Target residual thrust", "N"),
               "d_{bp}": ("Balance piston diameter", "m"), "F_{bp}": ("Balance piston force", "N"), "F_r": ("Residual thrust", "N"),
               "F_{sw}": ("Thrust swing allowance", "N"), "F_d": ("Thrust bearing design load", "N"), "p_a": ("Allowable pad unit load", "Pa"),
               "A_p": ("Thrust pad area", "m²"), "d_{in}": ("Collar inner pad diameter", "m"), "D_c": ("Thrust collar diameter", "m"),
               r"\rho": ("Material density", "kg/m³"), "L_{bp}": ("Balance piston length", "m"), "m": ("Mass", "kg"),
               "m_{imp}": ("Impeller mass from the impeller design", "kg"), "d_{user}": ("Diameter set by the user", "m")})
    rec.step("Casing torque", r"T = P / \omega", {"P": (P, "W"), r"\omega": (omega, "rad/s")}, T, "N·m", "T", ui="Torque")
    rec.step("Minimum diameter for torsion", r"d_t = \left(\frac{16\,T\,k_t}{\pi\,\tau_a}\right)^{1/3},\quad \tau_a = 0.15\,S_y",
             {"T": (T, "N·m"), "k_t": sd.torque_transient_factor, "S_y": (shaft_mat["yield_mpa"] * 1e6, "Pa"), r"\tau_a": (tau_a, "Pa")},
             d_t * 1e3, "mm", "d_t")
    if sd.shaft_diameter_at_impellers_mm:
        rec.step("Shaft diameter at impellers", "d = d_{user}", {}, d * 1e3, "mm", "d", note="Set by the user", ui="Shaft at impellers")
    else:
        rec.step("Shaft diameter at impellers", r"d = \max\left(d_t,\ \min\left(\frac{L_s}{8.5},\ 0.4\,D_2\right)\right)",
                 {"d_t": (d_t, "m"), "L_s": (span, "m"), "D_2": (D2, "m")}, d * 1e3, "mm", "d",
                 note="Span and diameter depend on each other, so they are found by repeating the layout until d stops changing; rounded up to 5 mm", ui="Shaft at impellers")
    rec.step("Journal diameter", "d_j = 0.75\\,d" if not sd.journal_diameter_mm else "d_j = d_{user}", {"d": (d, "m")}, d_j * 1e3, "mm", "d_j",
             note="User value" if sd.journal_diameter_mm else "Rounded up to 5 mm", ui="Journal")
    rec.step("Seal sleeve diameter", r"d_s = 0.95\,d", {"d": (d, "m")}, d_s * 1e3, "mm", "d_s", note="Rounded up to 5 mm")
    rec.step("Bearing span", r"L_s = z_{b2} - z_{b1}", {"z_{b1}": (z_b1, "m"), "z_{b2}": (z_b2, "m")}, span * 1e3, "mm", "L_s",
             note="Bearing positions from adding up the section lengths of the layout")
    rec.step("Span to diameter ratio", r"L_s / d", {"L_s": (span, "m"), "d": (d, "m")}, span / d, "", "", ui="Span / D")
    rec.step("Gross impeller thrust", r"F_g = \sum F_i", {}, F_g / 1e3, "kN", "F_g", row=0,
             note="Sum of the impeller thrusts from the impeller design", ui="Gross kN")
    dp = P_d - P_s
    if F_g > F_t and dp > 0 and d_bp > d * 1.05 + 1e-12:
        rec.step("Balance piston diameter", r"d_{bp} = \sqrt{\frac{4\,(F_g - F_t)}{\pi\,\Delta p} + d_s^2}",
                 {"F_g": (F_g, "N"), "F_t": (F_t, "N"), r"\Delta p": (dp, "Pa"), "d_s": (d_s, "m")}, d_bp * 1e3, "mm", "d_{bp}",
                 note="Piston sized so that the target thrust remains toward the coupling end", ui="Balance piston")
    else:
        rec.step("Balance piston diameter", r"d_{bp} = 1.05\,d", {"d": (d, "m")}, d_bp * 1e3, "mm", "d_{bp}", note="Smallest piston that clears the shaft", ui="Balance piston")
    rec.step("Balance piston force", r"F_{bp} = \Delta p\,\frac{\pi}{4}\,(d_{bp}^2 - d_s^2)", {r"\Delta p": (dp, "Pa"), "d_{bp}": (d_bp, "m"), "d_s": (d_s, "m")},
             F_bp / 1e3, "kN", "F_{bp}", row=0, ui="Piston kN")
    rec.step("Residual thrust", r"F_r = F_g - F_{bp}", {"F_g": (F_g, "N"), "F_{bp}": (F_bp, "N")}, F_r / 1e3, "kN", "F_r")
    rec.step("Residual thrust", r"F_r = F_g - F_{bp}", {"F_g": (F_g, "N"), "F_{bp}": (F_bp, "N")}, F_r / 1e3, "kN", "F_r", row=0, ui="Residual kN")
    rec.step("Thrust swing", r"F_{sw} = 0.3\,|F_g|", {"F_g": (F_g, "N")}, F_sw / 1e3, "kN", "F_{sw}")
    rec.step("Thrust bearing design load", r"F_d = \max(|F_r| + F_{sw},\ 5\ \mathrm{kN})", {"F_r": (F_r, "N"), "F_{sw}": (F_sw, "N")}, F_d / 1e3, "kN", "F_d", row=0, ui="Design load kN")
    rec.step("Thrust pad area", r"A_p = F_d / p_a", {"F_d": (F_d, "N"), "p_a": (p_a * 1e6, "Pa")}, A_p * 1e4, "cm²", "A_p")
    rec.step("Thrust collar diameter", r"D_c = \sqrt{\frac{4\,A_p}{0.8\,\pi} + d_{in}^2},\quad d_{in} = 1.1\,d_j",
             {"A_p": (A_p, "m²"), "d_{in}": (d_in, "m")}, D_c * 1e3, "mm", "D_c", row=0, note="Pads cover 80 % of the ring", ui="Collar mm")
    if sd.masses_override:
        return
    rho_i, rho_s = imp_mat["density_kg_m3"], shaft_mat["density_kg_m3"]
    for i, m in enumerate(masses):
        if m.kind == "coupling":
            rec.step("Attached mass", r"m = 8\,\left(\frac{1.5\,T}{1000}\right)^{0.7}", {"T": (T, "N·m")}, m.mass, "kg", "m", row=i,
                     note="Typical disc coupling half with half spacer", ui="Mass kg")
        elif m.kind == "balance_piston":
            rec.step("Attached mass", r"m = 0.7\,\rho\,\frac{\pi}{4}\,(d_{bp}^2 - d^2)\,L_{bp}",
                     {r"\rho": (rho_i, "kg/m³"), "d_{bp}": (d_bp, "m"), "d": (d, "m"), "L_{bp}": (L_bp, "m")}, m.mass, "kg", "m", row=i,
                     note="0.7 allows for the labyrinth grooves", ui="Mass kg")
        elif m.kind == "thrust_collar":
            rec.step("Attached mass", r"m = \rho\,\frac{\pi}{4}\,(D_c^2 - d_j^2)\cdot 0.04\ \mathrm{m}",
                     {r"\rho": (rho_s, "kg/m³"), "D_c": (D_c, "m"), "d_j": (d_j, "m")}, m.mass, "kg", "m", row=i, ui="Mass kg")
        elif m.kind == "impeller":
            rec.step("Attached mass", "m = m_{imp}", {}, m.mass, "kg", "m", row=i, note="From the impeller design", ui="Mass kg")


def fe_model(rotor: dict, shaft_mat: dict, supports: list[Support], max_el: float = 0.06) -> RotorModel:
    sections = [Section(s["z0_m"], s["z1_m"], s["od_m"], s["id_m"], s["label"]) for s in rotor["sections"]]
    masses = [PointMass(m["label"], m["z_m"], m["mass_kg"], m["ip_kgm2"], m["it_kgm2"], m["kind"]) for m in rotor["masses"]]
    return RotorModel(sections, masses, supports, shaft_mat["E_pa"], shaft_mat["shear_modulus_pa"],
                      shaft_mat["density_kg_m3"], max_element_length=max_el)
