"""Preliminary centrifugal compressor selection and sizing.

Method (classic preliminary-design practice, e.g. Lüdtke 2004; Aungier
2000; API 617 Annex for typical limits):
  1. Overall polytropic head of the design case on the real-gas model.
  2. Split into sections with intercooling while the discharge
     temperature exceeds the limit.
  3. Tip speed limited by material (input) and machine Mach number.
  4. Number of impellers from the head coefficient psi = Hp / U2^2.
  5. Impeller diameter from the first-stage flow coefficient, speed from
     tip speed and diameter.
  6. Stage-by-stage march (volume flow falls through the machine) with
     a flow-coefficient efficiency correlation, iterated to convergence.
  7. Casings from the maximum impellers per casing.
"""

from __future__ import annotations

import math

from compsuite.aero.stage import efficiency_correlation
from compsuite.compression.process import mass_flow, polytropic_path
from compsuite.core.trace import record
from compsuite.core.units import R, c_to_k, bar_to_pa, k_to_c, rpm_to_rad


def _poly_step(gas, T1, P1, head, eta):
    """Discharge (T2, P2) for a stage of given polytropic head, using a local
    real-gas polytropic exponent (n/(n-1) = eta k/(k-1) from inlet state)."""
    st = gas.state(T1, P1)
    k = st.n_s if st.n_s > 1.0 else st.k
    m = eta * k / (k - 1.0)
    zrt = st.Z * R * T1 / (gas.mw() / 1000.0)
    pr = (1.0 + head / (m * zrt)) ** m
    P2 = P1 * pr
    # Discharge temperature from the energy balance: dh = head / eta.
    h2 = gas.h(T1, P1) + head / eta
    T2 = gas.T_from_hP(h2, P2, T1 * pr ** (1 / m))
    return T2, P2


def size_compressor(gas, project) -> dict:
    db = project.design_basis
    case = project.design_case()
    rec = record("aero.sizing", "Preliminary sizing by head/flow coefficients with stage-by-stage march", [db, case],
                 assumptions=[f"Head coefficient psi = {db.head_coefficient}",
                              f"First-stage flow coefficient phi1 = {db.first_stage_flow_coefficient}",
                              "All impellers in a casing have the same tip diameter and speed",
                              "Stage efficiency from a generic phi correlation; Mach penalty above Mu = 0.9"],
                 references=["Lüdtke, Process Centrifugal Compressors (2004)", "Aungier, Centrifugal Compressors (2000)"])
    T1, P1, P2 = c_to_k(case.suction_temperature_c), bar_to_pa(case.suction_pressure_bara), bar_to_pa(case.discharge_pressure_bara)
    m = mass_flow(gas, case)
    Tmax = c_to_k(db.max_discharge_temperature_c)

    # 1-2: sections with intercooling.
    eta_guess = case.polytropic_efficiency or 0.80
    n_sections = 1
    while True:
        pr_sec = (P2 / P1) ** (1.0 / n_sections)
        T_in, P_in, ok = T1, P1, True
        for i in range(n_sections):
            P_out = P_in * pr_sec + (bar_to_pa(db.intercooler_pressure_drop_bar) if i < n_sections - 1 else 0)
            res = polytropic_path(gas, T_in, P_in, P_out, eta_guess, steps=15)
            if res["T2"] > Tmax:
                ok = False
            T_in, P_in = c_to_k(db.intercooler_outlet_temperature_c), P_out - bar_to_pa(db.intercooler_pressure_drop_bar)
        if ok or n_sections >= 4:
            break
        n_sections += 1
    if n_sections > 1:
        rec.assumptions.append(f"{n_sections} sections with intercooling to {db.intercooler_outlet_temperature_c} degC "
                               f"(discharge temperature limit {db.max_discharge_temperature_c} degC)")

    a1 = gas.state(T1, P1).sound
    U2_max = min(db.max_tip_speed_m_s, db.max_machine_mach * a1)
    rho1 = gas.density(T1, P1)
    Q1 = m / rho1

    # Section boundaries (pressures), iterate efficiency.
    eta_sec = [eta_guess] * n_sections
    stages_per_section = [1] * n_sections
    for _ in range(4):
        sections, T_in, P_in = [], T1, P1
        pr_sec = (P2 / P1) ** (1.0 / n_sections)
        for i in range(n_sections):
            P_out = P_in * pr_sec + (bar_to_pa(db.intercooler_pressure_drop_bar) if i < n_sections - 1 else 0)
            res = polytropic_path(gas, T_in, P_in, P_out, eta_sec[i], steps=15)
            sections.append({"T_in": T_in, "P_in": P_in, "P_out": P_out, "head": res["head"], "T_out": res["T2"]})
            T_in, P_in = c_to_k(db.intercooler_outlet_temperature_c), P_out - bar_to_pa(db.intercooler_pressure_drop_bar)
        total_head = sum(s["head"] for s in sections)
        if db.stages_override:
            n_total = db.stages_override
            U2 = math.sqrt(total_head / (n_total * db.head_coefficient))
        else:
            n_total = max(1, math.ceil(total_head / (db.head_coefficient * U2_max**2) - 1e-9))
            U2 = math.sqrt(total_head / (n_total * db.head_coefficient))
        # Distribute impellers by section head.
        stages_per_section = _distribute(n_total, [s["head"] for s in sections])
        if db.impeller_diameter_mm_override:
            D2 = db.impeller_diameter_mm_override / 1000.0
        else:
            D2 = math.sqrt(4 * Q1 / (math.pi * db.first_stage_flow_coefficient * U2))
        if db.speed_rpm_override:
            omega = rpm_to_rad(db.speed_rpm_override)
            U2 = omega * D2 / 2
        else:
            omega = 2 * U2 / D2
        stages = _march(gas, m, sections, stages_per_section, D2, U2, db, a1)
        new_eta = []
        for i in range(n_sections):
            st = [s for s in stages if s["section"] == i]
            dh = sum(s["head"] / s["eta"] for s in st)
            new_eta.append(sum(s["head"] for s in st) / dh)
        if max(abs(a - b) for a, b in zip(new_eta, eta_sec)) < 2e-4:
            eta_sec = new_eta
            break
        eta_sec = new_eta

    speed_rpm = omega * 60 / (2 * math.pi)
    n_casings = math.ceil(n_total / db.max_impellers_per_casing)
    casings = _assign_casings(stages, n_sections, db.max_impellers_per_casing)
    for st in stages:
        if st["phi"] < 0.01:
            rec.warn(f"Stage {st['index'] + 1} flow coefficient {st['phi']:.4f} < 0.01: very narrow impeller, "
                     "consider a lower speed or a separate HP casing")
        if st["phi"] > 0.16:
            rec.warn(f"Stage {st['index'] + 1} flow coefficient {st['phi']:.3f} > 0.16: consider a double-flow or larger diameter")
    mach_u = U2 / a1
    if mach_u > db.max_machine_mach + 1e-6:
        rec.warn(f"Machine Mach number {mach_u:.2f} exceeds limit {db.max_machine_mach}")
    dh_total = sum(s["head"] / s["eta"] for s in stages)
    head_total = sum(s["head"] for s in stages)
    gas_power = m * dh_total
    ns = omega * math.sqrt(Q1) / (head_total / n_total) ** 0.75
    ds = D2 * (head_total / n_total) ** 0.25 / math.sqrt(Q1)
    config = ("Straight-through" if n_sections == 1 else f"{n_sections}-section with intercooling") + \
             f", {n_casings} casing{'s' if n_casings > 1 else ''}, {n_total} impellers"
    return {
        "configuration": config,
        "type_selection": _type_selection(Q1, P2 / P1, m),
        "n_sections": n_sections,
        "n_casings": n_casings,
        "n_stages": n_total,
        "stages_per_section": stages_per_section,
        "casings": casings,
        "speed_rpm": speed_rpm,
        "impeller_diameter_m": D2,
        "tip_speed_m_s": U2,
        "machine_mach": mach_u,
        "inlet_sound_speed_m_s": a1,
        "suction_volume_flow_m3_s": Q1,
        "mass_flow_kg_s": m,
        "polytropic_head_total_j_kg": head_total,
        "polytropic_efficiency_overall": head_total / dh_total,
        "section_efficiency": eta_sec,
        "gas_power_kw": gas_power / 1e3,
        "shaft_power_kw": gas_power * (1 + db.mechanical_loss_fraction) / 1e3,
        "driver_rating_kw": gas_power * (1 + db.mechanical_loss_fraction) * db.driver_rating_margin / 1e3,
        "specific_speed": ns,
        "specific_diameter": ds,
        "sections": [{**s, "T_in_c": k_to_c(s["T_in"]), "T_out_c": k_to_c(s["T_out"]), "P_in_bara": s["P_in"] / 1e5,
                      "P_out_bara": s["P_out"] / 1e5} for s in sections],
        "stages": stages,
        "trace": rec,
    }


def _distribute(n_total, heads):
    if len(heads) == 1:
        return [n_total]
    total = sum(heads)
    raw = [n_total * h / total for h in heads]
    out = [max(1, int(math.floor(r))) for r in raw]
    while sum(out) < n_total:
        i = max(range(len(raw)), key=lambda j: raw[j] - out[j])
        out[i] += 1
    while sum(out) > n_total:
        i = max(range(len(out)), key=lambda j: out[j])
        out[i] -= 1
    return out


def _march(gas, m, sections, stages_per_section, D2, U2, db, a1):
    stages, idx = [], 0
    area = math.pi / 4 * D2**2
    for si, (sec, n) in enumerate(zip(sections, stages_per_section)):
        T, P = sec["T_in"], sec["P_in"]
        head_stage = sec["head"] / n
        for _ in range(n):
            rho = gas.density(T, P)
            Q = m / rho
            phi = Q / (area * U2)
            eta = efficiency_correlation(phi, U2 / a1)
            T2, P2 = _poly_step(gas, T, P, head_stage, eta)
            stages.append({"index": idx, "section": si, "phi": phi, "psi": head_stage / U2**2, "eta": eta,
                           "head": head_stage, "Q_in_m3_s": Q, "rho_in": rho, "rho_out": gas.density(T2, P2),
                           "T_in_c": k_to_c(T), "T_out_c": k_to_c(T2), "P_in_bara": P / 1e5, "P_out_bara": P2 / 1e5,
                           "power_kw": m * head_stage / eta / 1e3})
            T, P, idx = T2, P2, idx + 1
    return stages


def _assign_casings(stages, n_sections, max_per_casing):
    casings, current = [], []
    for st in stages:
        if len(current) >= max_per_casing:
            casings.append(current)
            current = []
        current.append(st["index"])
    if current:
        casings.append(current)
    return casings


def _type_selection(Q1, pr, m):
    """Coarse compressor-type screening by suction volume flow (Am3/h)."""
    q_h = Q1 * 3600
    notes = []
    if q_h < 300:
        rec = "Reciprocating (API 618)"
        notes.append("Suction flow below typical centrifugal range")
    elif q_h < 1500:
        rec = "Reciprocating or screw; centrifugal only with very narrow impellers"
    elif q_h < 250000:
        rec = "Centrifugal (API 617)"
    else:
        rec = "Axial or large centrifugal"
    if pr > 10 and rec.startswith("Centrifugal"):
        notes.append("High pressure ratio: multi-section with intercooling expected")
    return {"recommended": rec, "suction_flow_am3_h": q_h, "notes": notes,
            "ranges_am3_h": {"reciprocating": [0, 15000], "screw": [300, 60000],
                             "centrifugal": [1500, 250000], "axial": [100000, 1500000]}}
