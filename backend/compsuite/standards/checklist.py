"""Engineering verification checklist.

Collects the checks of every module into one traceable list. Each item
states the criterion, the value found, the source module and a status:

  pass         - criterion met by the calculated value
  fail         - criterion not met
  attention    - criterion met with little margin, or input estimated
  review       - outside the scope of the software: needs qualified review

The checklist supports engineering review. It is not a certificate of
compliance with API 617, API 614, API 692, ISO 15156 or any other standard.
"""

from __future__ import annotations


def _item(cat, desc, criterion, value, ok, ref, module, note="", attention=False):
    status = "pass" if ok else "fail"
    if ok and attention:
        status = "attention"
    if ok is None:
        status = "review"
    return {"category": cat, "check": desc, "criterion": criterion, "value": value, "status": status,
            "reference": ref, "module": module, "note": note}


def build_checklist(project, res: dict) -> dict:
    cr, db = project.criteria, project.design_basis
    items = []
    sz = res["sizing"]
    # Process / aero
    for c in res["cases"]:
        T2 = c["discharge"]["T"] - 273.15 if isinstance(c["discharge"], dict) else c["discharge"].T - 273.15
        if sz["n_sections"] == 1:
            items.append(_item("Process", f"Discharge temperature - {c['case']}", f"<= {db.max_discharge_temperature_c} degC",
                               f"{T2:.1f} degC", T2 <= db.max_discharge_temperature_c, "Design basis", "compression"))
    for op in res["operating_points"]:
        if not op.get("feasible", False) and "speed_frac" not in op:
            items.append(_item("Aerodynamics", f"Operating point - {op['case']}", "Reachable on the map", "not reachable", False,
                               "Design basis", "aero.performance", "; ".join(op.get("notes", []))))
            continue
        items.append(_item("Aerodynamics", f"Surge margin - {op['case']}", f">= {cr.surge_margin_min:.0%}",
                           f"{op['surge_margin']:.1%}", op["surge_margin"] >= cr.surge_margin_min, "Purchaser specification / API 617 4.x",
                           "aero.performance", attention=op["surge_margin"] < cr.surge_margin_min * 1.5))
        lo, hi = db.min_operating_speed_pct / 100, db.max_continuous_speed_pct / 100
        items.append(_item("Aerodynamics", f"Speed within operating range - {op['case']}", f"{lo:.0%} - {hi:.0%}",
                           f"{op['speed_frac']:.1%}", lo - 1e-6 <= op["speed_frac"] <= hi + 1e-6, "Design basis", "aero.performance"))
    items.append(_item("Aerodynamics", "Machine Mach number", f"<= {db.max_machine_mach}", f"{sz['machine_mach']:.3f}",
                       sz["machine_mach"] <= db.max_machine_mach + 1e-6, "Design basis", "aero.sizing"))
    phis = [s["phi"] for s in sz["stages"]]
    items.append(_item("Aerodynamics", "Stage flow coefficients", "0.01 <= phi <= 0.16", f"{min(phis):.4f} - {max(phis):.4f}",
                       min(phis) >= 0.01 and max(phis) <= 0.16, "Industrial practice (Lüdtke)", "aero.sizing",
                       attention=min(phis) < 0.015))
    for ci, cas in enumerate(res["casings"]):
        tag = f"casing {ci + 1}"
        for imp in cas["impellers"]["impellers"]:
            items.append(_item("Impellers", f"Tip speed vs material capability - {tag} imp {imp['index'] + 1}",
                               f"<= {imp['max_tip_speed_for_material_m_s']:.0f} m/s", f"{sz['tip_speed_m_s']:.0f} m/s",
                               sz["tip_speed_m_s"] <= imp["max_tip_speed_for_material_m_s"], "Rotating-disk stress", "impeller"))
        for st in cas["impeller_stress"]["impellers"]:
            items.append(_item("Structural", f"Overspeed (115 % MCS) average hoop stress - {tag} imp {st['impeller']}",
                               "<= 0.9 Sy", f"{st['overspeed_average_ratio']:.2f} x 0.9 Sy", st["overspeed_average_ratio"] <= 1.0,
                               "API 617 overspeed test / OEM practice", "structural.disk",
                               note=(f"Peak bore von Mises {st['overspeed_yield_ratio']:.2f} x Sy - local yielding, review"
                                     if st["overspeed_yield_ratio"] > 1.0 else ""),
                               attention=st["overspeed_yield_ratio"] > 1.0))
            items.append(_item("Structural", f"Burst margin - {tag} imp {st['impeller']}", f">= {cr.impeller_burst_margin_min}",
                               f"{st['burst_margin']:.2f}", st["burst_margin"] >= cr.impeller_burst_margin_min, "Industrial practice",
                               "structural.disk"))
        sh = cas["shaft"]
        items.append(_item("Shaft", f"Fatigue safety factor - {tag}", f">= {cr.shaft_fatigue_safety_min}",
                           f"{sh['min_fatigue_safety']:.2f} at z = {sh['critical_fatigue_z_m']:.3f} m",
                           sh["min_fatigue_safety"] >= cr.shaft_fatigue_safety_min, "DE-Goodman (Shigley)", "mechanical.shaft"))
        items.append(_item("Shaft", f"Yield safety under transient torque - {tag}", f">= {cr.shaft_yield_safety_min}",
                           f"{sh['min_yield_safety']:.2f}", sh["min_yield_safety"] >= cr.shaft_yield_safety_min, "Langer first-cycle",
                           "mechanical.shaft"))
        for label in cas["bearings"]["bearings"]:
            rated = cas["bearing_rated"][label]
            items.append(_item("Bearings", f"Minimum film thickness - {tag} {label}", f">= {cr.bearing_min_film_um} um",
                               f"{rated['h_min_m'] * 1e6:.1f} um", rated["h_min_m"] * 1e6 >= cr.bearing_min_film_um,
                               "Vendor practice", "bearings"))
            items.append(_item("Bearings", f"Babbitt temperature (screening) - {tag} {label}", f"<= {cr.bearing_max_babbitt_c} degC",
                               f"{rated['babbitt_temperature_est_c']:.0f} degC", rated["babbitt_temperature_est_c"] <= cr.bearing_max_babbitt_c,
                               "API 617 / vendor limit", "bearings", "Screening estimate - confirm with THD analysis", attention=True))
            items.append(_item("Bearings", f"Unit load - {tag} {label}", f"<= {cr.bearing_max_unit_load_mpa} MPa",
                               f"{rated['unit_load_mpa']:.2f} MPa", rated["unit_load_mpa"] <= cr.bearing_max_unit_load_mpa,
                               "Vendor practice", "bearings", attention=rated["unit_load_mpa"] < 0.3,
                               note="Very light load: check pad flutter / stability" if rated["unit_load_mpa"] < 0.3 else ""))
        lat = cas["lateral"]
        for case in lat["unbalance_cases"]:
            for pk in case["peaks"]:
                req = pk["required_separation_pct"]
                items.append(_item("Lateral rotordynamics", f"Separation margin - {tag} critical {pk['speed_rpm']:.0f} rpm (AF {pk['af']:.1f})",
                                   "AF < 2.5 or SM >= required" if req is None else f"SM >= {req:.1f} %",
                                   f"{pk['separation_pct']:.1f} %", pk["pass"], "API 617 2.6.2.10", "rotordynamics.lateral"))
            for a in case["amplitude_checks"]:
                items.append(_item("Lateral rotordynamics", f"Unbalance amplitude at MCS - {tag} mode {case['mode']} {a['location']}",
                                   f"<= {a['limit_um']:.1f} um pk-pk", f"{a['pk_pk_um_1x_unbalance']:.2f} um", a["pass"],
                                   "API 617 2.6.2.11", "rotordynamics.lateral"))
            worst = max(case["clearance_checks"], key=lambda c: c["ratio"]) if case["clearance_checks"] else None
            if worst:
                items.append(_item("Lateral rotordynamics", f"Close-clearance response - {tag} mode {case['mode']} ({worst['location']})",
                                   f"<= {cr.clearance_ratio_limit:.0%} of clearance", f"{worst['ratio']:.1%}", worst["pass"],
                                   "API 617 2.6.2.11", "rotordynamics.lateral"))
        stab = lat["stability"]
        items.append(_item("Lateral rotordynamics", f"Level I stability log dec with Qa - {tag}", f">= {cr.lateral_logdec_min}",
                           f"{stab['logdec_with_qa']:.3f}", stab["level1_pass"], "API 617 2.6.5", "rotordynamics.lateral",
                           "" if stab["level1_pass"] else "Level II stability analysis required"))
        seals = cas["seals"]
        items.append(_item("Seals", f"Balance piston leakage - {tag}", f"<= {cr.seal_balance_piston_leakage_max_pct} %",
                           f"{seals['balance_piston']['leakage_pct']:.2f} %",
                           seals["balance_piston"]["leakage_pct"] <= cr.seal_balance_piston_leakage_max_pct, "Industrial practice", "seals"))
        cond = seals["end_seals"].get("conditioning")
        if cond and cond.get("superheat_margin_c") is not None:
            items.append(_item("Seals", f"Seal gas superheat above dew point - {tag}", f">= {project.seals.seal_gas_superheat_margin_c} degC",
                               f"{cond['superheat_margin_c']:.1f} degC", not cond["heater_required"], "API 692", "seals",
                               "Seal gas heater required" if cond["heater_required"] else ""))
    tor = res.get("torsional")
    if tor:
        for c in tor["interference"]["checks"]:
            if "VFD" in c["excitation"]:
                items.append(_item("Torsional", f"VFD harmonic coincidence {c['mode_hz']:.1f} Hz vs {c['excitation']}",
                                   "Evaluate by forced response if within band", f"{c['separation']:.1%}", True,
                                   "API 617 / API 684 (VFD trains)", "torsional",
                                   "Within harmonic band: forced-response evaluation with drive-supplied harmonics required"
                                   if not c["pass"] else "", attention=not c["pass"]))
                continue
            items.append(_item("Torsional", f"Separation {c['mode_hz']:.1f} Hz vs {c['excitation']}",
                               f">= {cr.torsional_separation_margin:.0%}", f"{c['separation']:.1%}", c["pass"], "API 617 torsional",
                               "torsional"))
        for s in tor["stress"]:
            items.append(_item("Torsional", f"Shaft torsional fatigue - {s['shaft']}", ">= 1.5", f"{s['goodman_safety']:.2f}",
                               s["goodman_safety"] >= 1.5, "Goodman", "torsional"))
    for use, scr in res["materials"].items():
        sel = scr["selected"]
        items.append(_item("Materials", f"{use.title()} material '{sel['key']}' screening", "Temperature range, sour availability, strength",
                           ", ".join(k for k, v in sel["checks"].items() if not v) or "all screening checks met",
                           sel["suitable"], "ISO 15156 / API 617", "materials",
                           "Record documented service limits and evidence for this material"))
    for c in res.get("material_assessment", {}).get("components", []):
        st = c["status"]
        items.append(_item("Material assessment", f"{c['component']}: {c['material']}", "Within recorded, verified limits",
                           "; ".join(c["failures"][:2]) or (f"{len(c['missing'])} evidence item(s) missing" if c["missing"] else "within limits"),
                           st != "outside", "ISO 15156 / project material records", "materials.assessment",
                           "; ".join(c["missing"][:3]), attention=st == "evidence"))
    for ci, cas in enumerate(res["casings"]):
        for f in (cas.get("impeller_fea") or {}).get("impellers", []):
            items.append(_item("Structural", f"Impeller FEA overspeed peak - casing {ci + 1} imp {f['impeller']}", "Peak von Mises <= Sy (local)",
                               f"{f['yield_utilisation_overspeed']:.2f} x Sy", True, "API 617 overspeed test", "structural.impeller_fea",
                               "Local peak above yield: review with detailed 3D FEA" if f["yield_utilisation_overspeed"] > 1 else "",
                               attention=f["yield_utilisation_overspeed"] > 1))
    lube = res.get("lube")
    if lube:
        items.append(_item("Auxiliaries", "Oil cooler temperature approach", "No temperature cross",
                           f"LMTD {lube['cooler_lmtd_c']:.1f} degC" if lube["cooler_lmtd_c"] == lube["cooler_lmtd_c"] else "cross",
                           lube["cooler_lmtd_c"] == lube["cooler_lmtd_c"] and lube["cooler_lmtd_c"] > 3, "API 614", "auxiliary.lube"))
    pip = res.get("piping")
    if pip:
        for side in ("suction", "discharge"):
            p = pip[side]
            items.append(_item("Piping", f"{side.title()} line rho v^2", f"<= {project.piping.rho_v2_limit_pa:.0f} Pa",
                               f"{p['rho_v2_pa']:.0f} Pa (NPS {p['nps_in']})", p["rho_v2_pa"] <= project.piping.rho_v2_limit_pa,
                               "Industrial practice", "piping"))
    for txt in ("Casing pressure design, hydrotest and nozzle loads (API 617 / ASME VIII)",
                "Impeller blade and shroud 3D stress / modal analysis (FEA)",
                "Rotor balancing grade and procedure (API 617 2.6.8)",
                "Level II stability analysis with seal/impeller dynamic coefficients",
                "Detailed bearing THD analysis and vendor coefficients",
                "Dry gas seal system design per API 692; lube system per API 614",
                "Material certification, hardness and SSC qualification per ISO 15156",
                "Datasheet completeness and purchaser specification review"):
        items.append(_item("Review", txt, "Qualified engineering review", "not evaluated by software", None, "-", "-"))
    counts = {k: sum(1 for i in items if i["status"] == k) for k in ("pass", "fail", "attention", "review")}
    return {"items": items, "counts": counts, "criteria_edition": cr.edition,
            "disclaimer": "Preliminary engineering checks. Not a certificate of compliance. Qualified review required."}
