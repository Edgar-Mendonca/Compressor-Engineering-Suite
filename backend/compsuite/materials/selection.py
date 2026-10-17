"""Automatic material selection per compressor component.

Rules (screening, not a substitute for the vendor's qualified selection):
  * Environment per component from the locations it sees: wet/dry, worst
    ISO 15156-2 severity domain, temperature range vs MDMT, chlorides, O2.
  * Pressure parts and stator internals: carbon steel (A350 LF2 forgings,
    A352 LCB Mod castings; LF3 below -46 degC). Where wet and the carbon-steel
    corrosion exceeds the acceptance criterion, or O2 + H2S (elemental sulfur)
    is present, wetted surfaces get an Alloy 625 weld overlay; thin fabricated
    parts (inlet plenum) go solid Alloy 625.
  * Impellers / rotor parts: dry -> ASTM A182 F22 / AISI 4140 at <=22 HRC
    (ISO 15156-2). Wet -> 17-4PH H1150D or F6NM only inside their ISO 15156-3
    style envelopes (illustrative: pH2S <= 3.4 / 10 kPa, no chlorides, no O2),
    otherwise Alloy 718.
  * Labyrinths: AA6082 below its temperature limit and with mercury within
    limit (liquid-metal embrittlement); else 316L (dry) or Alloy 625 (wet).
Envelope values are illustrative; take the limits from the licensed
ISO 15156-3 tables and the vendor's experience.
"""

from __future__ import annotations

from compsuite.materials.database import get_material

# name, corrosion class, zone (suction / internal / discharge / all), kind
COMPONENTS = [("Casing", "casing", "all", "forging"), ("Inlet cover", "casing", "suction", "forging"),
              ("Discharge cover", "casing", "discharge", "forging"), ("Inlet plenum", "casing", "suction", "plenum"),
              ("Discharge scroll", "casing", "discharge", "casting"), ("Diaphragms", "diaphragm", "internal", "forging"),
              ("First impeller", "impeller", "suction", "impeller"), ("Other impellers", "impeller", "internal", "impeller"),
              ("Shaft", "shaft", "all", "shaft"), ("Shaft sleeve", "shaft", "suction", "sleeve"),
              ("Balance drum", "shaft", "discharge", "rotor"), ("Labyrinths", "diaphragm", "all", "labyrinth")]
CS_FAMILIES = ("carbon_steel", "low_alloy")
OVERLAY = "Alloy 625"


def component_class(name: str) -> str:
    n = name.lower()
    for c, cls, _, _ in COMPONENTS:
        if c.lower() == n:
            return cls
    if "impeller" in n:
        return "impeller"
    if any(k in n for k in ("shaft", "sleeve", "balance", "drum", "piston")):
        return "shaft"
    if any(k in n for k in ("diaphragm", "labyrinth")):
        return "diaphragm"
    return "casing"


def component_zone(name: str) -> str:
    n = name.lower()
    for c, _, z, _ in COMPONENTS:
        if c.lower() == n:
            return z
    if any(k in n for k in ("inlet", "suction", "first", "plenum", "sleeve")):
        return "suction"
    if any(k in n for k in ("discharge", "scroll", "balance", "drum")):
        return "discharge"
    if any(k in n for k in ("diaphragm", "other")):
        return "internal"
    return "all"


def zone_rows(rows: list[dict], zone: str) -> list[dict]:
    """Process (non-SOP) locations a component sees."""
    proc = [r for r in rows if not r.get("sop")]
    if not proc:
        return []
    return {"suction": proc[:1], "discharge": proc[-1:], "internal": proc[1:] or proc, "sleeved": proc[1:] or proc}.get(zone, proc)


def criterion(cls: str, criteria: list, blade_t_mm: float | None = None) -> tuple[dict | None, str]:
    """Acceptance criterion for a class; impellers by blade thickness. Returns (criterion, note)."""
    cs = [c if isinstance(c, dict) else c.model_dump() for c in criteria]
    cs = [c for c in cs if c["component_class"] == cls]
    if not cs:
        return None, f"No acceptance criterion for class '{cls}'"
    if cls != "impeller" or blade_t_mm is None:
        return cs[0], ""
    for c in cs:
        lo, hi = c.get("blade_min_mm"), c.get("blade_max_mm")
        if (lo is None or blade_t_mm > lo) and (hi is None or blade_t_mm <= hi):
            return c, f"blade {blade_t_mm:.1f} mm"
    strict = min(cs, key=lambda c: c["max_cr_mm_y"])
    return strict, f"blade {blade_t_mm:.1f} mm outside the tabulated ranges: most stringent criterion used"


def environment(rows: list[dict], zone: str, ma, mdmt_c: float) -> dict:
    zr = zone_rows(rows, zone)
    c = ma.contaminants
    o2_ppb = (c.o2_ingress_ppmv or 0.0) * 1e3
    chl = max(ma.chloride_ppm or 0.0, c.chloride_entrainment_ppmv or 0.0, c.chloride_saturation_ppmv or 0.0)
    wet = [r for r in zr if r["wet"]]
    return {"zone": zone, "locations": [r["location"] for r in zr], "wet": bool(wet),
            "wet_locations": [r["location"] for r in wet],
            "domain": max((r["domain_index"] for r in zr), default=0), "max_ph2s_bar": max((r["ph2s_bar"] for r in zr), default=0.0),
            "min_ph": min((r["ph"] for r in wet), default=None), "tmax_c": max((r["T_c"] for r in zr), default=0.0),
            "mdmt_c": mdmt_c, "chlorides": chl > 0, "chloride_ppm": chl, "o2": o2_ppb > c.o2_threshold_ppb, "o2_ppb": o2_ppb,
            "sulfur_risk": o2_ppb > 0 and any(r["ph2s_bar"] > 0 for r in zr),
            "cs_cr_mm_y": max((r["cr_mm_y"] for r in wet), default=0.0),
            "mercury_high": c.mercury_ng_nm3 is not None and c.mercury_ng_nm3 > c.mercury_limit_ng_nm3}


def nace_status(key: str, domain: int) -> tuple[str, str]:
    m = get_material(key)
    if domain == 0:
        return "not sour", "pH2S below the sour threshold: ISO 15156 not mandatory"
    if m["family"] == "aluminium":
        return "not applicable", "Outside ISO 15156 SSC scope (non-pressure part; Al not SSC-susceptible): check compatibility"
    if m["family"] in CS_FAMILIES:
        return "compliant", f"ISO 15156-2 compliant at <= {m['sour_max_hrc']} HRC. {m['sour_note']}"
    if m["family"] == "nickel_alloy":
        return "compliant", f"ISO 15156-3 Ni-base alloy. {m['sour_note']}"
    return "conditional", f"ISO 15156-3 with environmental limits. {m['sour_note']}"


def _cs_ok(env: dict, cls: str, ma, crit: dict | None) -> tuple[bool, list[str]]:
    """Is bare carbon / low-alloy steel acceptable for the wetted surface?"""
    why = []
    if not env["wet"]:
        return True, ["Dry at " + ", ".join(env["locations"]) + ": no aqueous corrosion or SSC in service"]
    life = ma.service_life_years
    cr = env["cs_cr_mm_y"]
    ok = True
    if crit is not None:
        if cr > crit["max_cr_mm_y"] or cr * life > crit["max_total_mm"]:
            ok = False
            why.append(f"Wet at {', '.join(env['wet_locations'])}: carbon-steel CR {cr:.2f} mm/y ({cr * life:.1f} mm in {life:.0f} y) "
                       f"exceeds {crit['max_cr_mm_y']:.3g} mm/y / {crit['max_total_mm']:.3g} mm ({cls})")
        else:
            why.append(f"Wet but carbon-steel CR {cr:.3f} mm/y within {crit['max_cr_mm_y']:.3g} mm/y ({cls})")
    if env["sulfur_risk"]:
        ok = False
        why.append("O2 with H2S in wet service: elemental sulfur risk; only Ni-base alloys tolerate it")
    return ok, why


def _base_cs(kind: str, env: dict) -> tuple[str, list[str]]:
    mdmt, tmax = env["mdmt_c"], env["tmax_c"]
    key = "ASTM A352 LCB (Mod)" if kind == "casting" else "ASTM A350 LF2"
    why = []
    if mdmt < get_material(key)["min_temp_c"]:
        key = "ASTM A350 LF3"
        why.append(f"MDMT {mdmt:.0f} °C below the -46 °C rating of LF2/LCB: 3.5Ni LF3 (fabricated) proposed")
    if tmax > get_material(key)["max_temp_c"]:
        key = "ASTM A182 F22"
        why.append(f"Temperature {tmax:.0f} °C above the carbon-steel limit: 2.25Cr-1Mo F22")
    m = get_material(key)
    why.insert(0, f"{m.get('designation', key)}: impact rated to {m['min_temp_c']:.0f} °C (MDMT {mdmt:.0f} °C), "
                  f"<= {m['sour_max_hrc']} HRC per ISO 15156-2")
    return key, why


def _impeller(env: dict, ma, crit) -> tuple[str, list[str], list[str]]:
    alts = ["17-4PH H1150", "ASTM A182 F6NM", "Alloy 718", "AISI 4140 Q&T"]
    if not env["wet"]:
        key = "ASTM A182 F22" if env["mdmt_c"] >= -46 and env["tmax_c"] <= 450 else "Alloy 718"
        return key, [f"Dry at {', '.join(env['locations'])}: low-alloy steel at <=22 HRC (ISO 15156-2) acceptable",
                     "Confirm tip-speed capability with the hardness-limited yield"], alts
    p, ph = env["max_ph2s_bar"], env["min_ph"] if env["min_ph"] is not None else 7.0
    clean = not env["chlorides"] and not env["sulfur_risk"]
    if clean and p <= 0.034 and ph >= 4.5:
        return "17-4PH H1150", ["Wet, pH2S <= 3.4 kPa, pH >= 4.5, no chlorides/O2: 17-4PH H1150D within its envelope"], alts
    if clean and p <= 0.10 and ph >= 3.5:
        return "ASTM A182 F6NM", ["Wet, pH2S <= 10 kPa, no chlorides/O2: 13Cr-4Ni (F6NM) double tempered <=23 HRC"], alts
    why = [f"Wet at {', '.join(env['wet_locations'])} with pH2S {p:.3f} bar, pH {ph:.2f}"
           + (", chlorides" if env["chlorides"] else "") + (", O2" if env["sulfur_risk"] else "")
           + ": outside 17-4PH / 13Cr envelopes, low-alloy CR above criterion", "Precipitation-hardened Ni-base Alloy 718 selected"]
    return "Alloy 718", why, [a for a in alts if a != "Alloy 718"]


def select_component(name: str, cls: str, zone: str, kind: str, rows: list[dict], ma, blade_t_mm: float | None = None) -> dict:
    mdmt = ma.shaft_mdmt_c if kind == "shaft" else ma.mdmt_c
    env = environment(rows, zone, ma, mdmt)
    crit, _ = criterion(cls, ma.acceptance_criteria, blade_t_mm)
    ov_mode = ma.weld_overlay.enabled
    overlay, alts, why = None, [], []
    if kind in ("forging", "casting"):
        key, why = _base_cs(kind, env)
        ok, w2 = _cs_ok(env, cls, ma, crit)
        why += w2
        if (not ok or (ov_mode == "yes" and env["wet"])) and ov_mode != "no":
            overlay = OVERLAY
            why.append(f"{ma.weld_overlay.alloy} weld overlay on wetted surfaces at {', '.join(env['wet_locations'])} "
                       f"(>= {ma.weld_overlay.min_undiluted_mm:g} mm undiluted)")
        elif not ok:
            key = OVERLAY
            why.append("Weld overlay disabled: solid Alloy 625 proposed")
        alts = [f"{key} + {OVERLAY} weld overlay" if overlay is None else "Solid Alloy 625", "22Cr Duplex (F51) (no chlorides/O2 only)"]
    elif kind == "plenum":
        ok, w2 = _cs_ok(env, cls, ma, crit)
        if ok and ov_mode != "yes":
            key, why = _base_cs("forging", env)
        else:
            key = OVERLAY
            why = w2 + ["Thin fabricated part: overlay impractical, solid Alloy 625"]
        alts = ["ASTM A350 LF2 + Alloy 625 weld overlay", "AISI 316L (no chlorides/O2 only)"]
    elif kind == "impeller":
        key, why, alts = _impeller(env, ma, crit)
    elif kind in ("shaft", "sleeve", "rotor"):
        sub = zone_rows(rows, "internal")
        internal_wet = any(r["wet"] for r in sub) if kind == "shaft" else False
        if env["wet"] and (kind != "shaft" or internal_wet):
            key = "Alloy 718"
            why = [f"Wetted at {', '.join(env['wet_locations'])}: Ni-base Alloy 718 (ISO 15156-3)"]
        else:
            if kind == "rotor":
                key = "ASTM A182 F22"
            else:
                key = "AISI 4140 A668 Cl L <=22 HRC" if mdmt >= -29 else "AISI 4340 Q&T"
            why = [f"{get_material(key).get('designation', key)}, <=22 HRC per ISO 15156-2, rated to "
                   f"{get_material(key)['min_temp_c']:.0f} °C (MDMT {mdmt:.0f} °C)"]
            if kind == "shaft" and env["wet"]:
                why.append(f"Wet only at {', '.join(env['wet_locations'])}: shaft protected there by an Alloy 718 sleeve")
            elif not env["wet"]:
                why.append("Dry at its locations")
        alts = ["AISI 4340 Q&T", "Alloy 718", "17-4PH H1150"] if kind != "rotor" else ["AISI 4140 A668 Cl L <=22 HRC", "Alloy 718"]
    else:  # labyrinth
        al = get_material("AA6082-T6")
        if env["tmax_c"] <= al["max_temp_c"] and not env["mercury_high"]:
            key = "AA6082-T6"
            why = [f"Abradable aluminium, T max {env['tmax_c']:.0f} °C <= {al['max_temp_c']:.0f} °C; Al is not SSC-susceptible",
                   "Mercury within limit (no liquid-metal embrittlement)"]
            if env["wet"]:
                why.append("Wet at suction: inspect for chloride pitting at overhaul (non-pressure part)")
        else:
            key = "Alloy 625" if env["wet"] else "AISI 316L"
            why = [("Mercury above limit (aluminium LME)" if env["mercury_high"] else f"T max {env['tmax_c']:.0f} °C above the aluminium limit")
                   + f": {key}"]
        alts = ["AISI 316L", "Alloy 625", "Abradable polymer (PEEK) where qualified"]
    m = get_material(key)
    status, note = nace_status(key, env["domain"])
    if overlay:
        note = f"Wetted surface {OVERLAY} overlay (ISO 15156-3); base: {note}"
    if m["min_temp_c"] > mdmt:
        why.append(f"WARNING: {key} rated to {m['min_temp_c']:.0f} °C, above MDMT {mdmt:.0f} °C")
    designation = m.get("designation", key) + (f" + {ma.weld_overlay.alloy} WO" if overlay else "")
    return {"component": name, "component_class": cls, "zone": zone, "wet": env["wet"], "domain": f"D{env['domain']}",
            "proposed": key, "designation": designation, "overlay": overlay, "rationale": why,
            "alternatives": [a for a in alts if a != key], "nace": status, "nace_note": note,
            "max_hrc": m.get("sour_max_hrc"), "min_temp_c": m["min_temp_c"], "max_temp_c": m["max_temp_c"], "mdmt_c": mdmt,
            "mdmt_ok": m["min_temp_c"] <= mdmt, "environment": env}


def select_materials(rows: list[dict], ma, blade_t_mm: float | None = None) -> list[dict]:
    """Proposed material for every standard component."""
    return [select_component(n, c, z, k, rows, ma, blade_t_mm) for n, c, z, k in COMPONENTS]
