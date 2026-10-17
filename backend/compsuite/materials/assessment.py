"""Material assessment for sour / wet service.

Stage conditions come straight from the compressor design (stage outlet
pressure and temperature, gas composition), plus a settle-out (SOP) case.
For each stage it derives partial pressures, the water dew point (Peng-
Robinson fugacity) and wet/dry state, an estimated condensed-water pH
(CO2/H2S equilibria, unbuffered) unless a measured pH is given, an
illustrative SSC severity domain and a de Waard-Milliams CO2 corrosion
estimate for carbon steel.

Each component's material record is then checked against its *recorded,
documented* limits. Verdicts:
  outside  - a recorded limit is exceeded
  evidence - nothing exceeded, but limits or evidence are missing
  within   - inside all recorded, verified limits (still conditional on sign-off)
A material name alone never passes.
"""

from __future__ import annotations

import math

from compsuite.core.trace import record
from compsuite.materials.database import at_temperature, get_material

SOUR_BAR = 0.003  # ISO 15156-2 threshold, 0.3 kPa
DEW_APPROACH_C = 10.0


def condensed_water_ph(T_c: float, pco2: float, ph2s: float) -> float:
    """Unbuffered condensed water saturated with CO2 and H2S.
    [H+]^2 = K1(CO2) KH(CO2) pCO2 + K1(H2S) KH(H2S) pH2S, with van't Hoff
    temperature corrections of Henry and first dissociation constants."""
    T = T_c + 273.15
    vh = lambda k25, dH: k25 * math.exp(-dH / 8.314 * (1 / T - 1 / 298.15))
    kh_co2, k1_co2 = vh(0.034, -19950), vh(4.45e-7, 9150)   # mol/(L bar), mol/L
    kh_h2s, k1_h2s = vh(0.10, -17500), vh(1.0e-7, 22000)
    h2 = k1_co2 * kh_co2 * max(pco2, 0) + k1_h2s * kh_h2s * max(ph2s, 0) + 1e-14
    return -math.log10(math.sqrt(h2))


def ssc_domain(ph2s: float, ph: float) -> str:
    """Illustrative severity domain D0-D3 in the pH2S-pH plane (schematic of the
    ISO 15156-2 figure shape; not the standard's limits)."""
    if ph2s < SOUR_BAR:
        return "D0"
    lg = math.log10(max(ph2s, SOUR_BAR))
    upper = min(6.5, 4 + (lg - math.log10(0.003)))
    lower = min(5.5, 3.5 + (lg - math.log10(0.01)))
    return "D1" if ph >= upper else ("D2" if ph >= lower else "D3")


def co2_corrosion_mm_y(T_c: float, pco2: float) -> float:
    """de Waard & Milliams (1991) worst-case carbon steel rate, no scale factor."""
    if pco2 <= 0:
        return 0.0
    return 10 ** (5.8 - 1710 / (T_c + 273.15) + 0.67 * math.log10(pco2))


COMPONENTS = ["Casing", "Shaft", "Impellers", "Diaphragms", "Balance piston", "Labyrinths"]


def default_records(project) -> list[dict]:
    keys = {"Casing": project.casing_material, "Shaft": project.shaft.material, "Impellers": project.shaft.impeller_material,
            "Diaphragms": "ASTM A216 WCB", "Balance piston": project.shaft.impeller_material, "Labyrinths": "AA6082-T6"}
    out = []
    for comp in COMPONENTS:
        m = get_material(keys[comp])
        out.append({"component": comp, "material": m["key"], "wetted_surface": m["key"], "evidence_reference": "",
                    "verified": False, "min_temp_c": m["min_temp_c"], "max_temp_c": m["max_temp_c"],
                    "max_hardness_hrc": m.get("sour_max_hrc"), "measured_hardness_hrc": None,
                    "max_wet_ph2s_bar": None, "max_dry_ph2s_bar": None, "max_pco2_bar": None, "min_ph": None,
                    "max_chloride_ppm": None, "corrosion_allowance_mm": 3.0 if m["family"] in ("carbon_steel", "low_alloy") else 0.0,
                    "corrosion_resistant": m["family"] not in ("carbon_steel", "low_alloy")})
    return out


def stage_conditions(gas, sizing: dict, project) -> list[dict]:
    ma = project.material_assessment
    x = gas.composition
    h2s, co2 = x.get("H2S", 0.0), x.get("CO2", 0.0)
    h2o = x.get("H2O", ma.water_content_ppmv * 1e-6)
    rows = []
    pts = [(f"Stage {s['index'] + 1}", s["P_out_bara"], s["T_out_c"]) for s in sizing["stages"]]
    dc = project.design_case()
    pts.insert(0, ("Suction", dc.suction_pressure_bara, dc.suction_temperature_c))
    sop_p = ma.sop_pressure_bara or (dc.suction_pressure_bara + 0.45 * (dc.discharge_pressure_bara - dc.suction_pressure_bara))
    pts.append(("Settle-out", sop_p, ma.sop_temperature_c))
    from compsuite.thermo.eos import PengRobinson
    wet_gas = PengRobinson({**{k: v for k, v in x.items() if k != "H2O"}, "H2O": h2o}) if h2o > 0 else None
    for name, P, T in pts:
        ph2s, pco2, ph2o = P * h2s, P * co2, P * h2o
        dew = None
        if wet_gas is not None:
            d = wet_gas.water_dew_point(P * 1e5)
            dew = d - 273.15 if d else None
        margin = None if dew is None else T - dew
        wet = ma.liquid_water_assumed or (margin is not None and margin < DEW_APPROACH_C)
        ph_est = condensed_water_ph(min(T, dew) if dew is not None else T, pco2, ph2s)
        ph = ma.measured_ph if ma.measured_ph is not None else ph_est
        rate = co2_corrosion_mm_y(T, pco2) if wet else 0.0
        rows.append({"location": name, "P_bara": P, "T_c": T, "ph2s_bar": ph2s, "pco2_bar": pco2, "ph2o_bar": ph2o,
                     "water_dew_point_c": dew, "dew_margin_c": margin, "wet": bool(wet), "ph": ph, "ph_estimated": ph_est,
                     "ph_basis": "measured" if ma.measured_ph is not None else "estimated (unbuffered)",
                     "sour": ph2s >= SOUR_BAR, "domain": ssc_domain(ph2s, ph) if wet else "dry",
                     "co2_rate_mm_y": rate})
    return rows


def assess_record(rec: dict, rows: list[dict], project) -> dict:
    ma = project.material_assessment
    failures, missing, checks = [], [], []
    fail, need, ok = failures.append, missing.append, checks.append
    life = ma.service_life_years
    tmax, tmin = max(r["T_c"] for r in rows), ma.mdmt_c
    if not rec.get("verified") or not str(rec.get("evidence_reference") or "").strip():
        need("Add the documented service basis (reference) and mark the record verified")
    for key, label, cond, val, unit in (
            ("max_temp_c", "maximum temperature", lambda lim, v: v <= lim, tmax, "°C"),
            ("min_temp_c", "MDMT", lambda lim, v: v >= lim, tmin, "°C")):
        lim = rec.get(key)
        if lim is None:
            need(f"Record the material {label} limit")
        elif cond(lim, val):
            ok(f"{label.capitalize()} {val:.0f} {unit} within limit {lim:.0f} {unit}")
        else:
            fail(f"{label.capitalize()} {val:.0f} {unit} outside limit {lim:.0f} {unit}")
    wet = [r for r in rows if r["wet"]]
    dry = [r for r in rows if not r["wet"]]
    sour = any(r["sour"] for r in rows)
    if sour:
        hmax, hmeas = rec.get("max_hardness_hrc"), rec.get("measured_hardness_hrc")
        if hmax is None:
            need("Sour service: record the ISO 15156 hardness limit")
        elif hmeas is None:
            need(f"Sour service: record measured hardness (limit {hmax} HRC)")
        elif hmeas > hmax:
            fail(f"Measured hardness {hmeas} HRC exceeds {hmax} HRC")
        else:
            ok(f"Hardness {hmeas} HRC ≤ {hmax} HRC")
    for lst, key, label in ((wet, "max_wet_ph2s_bar", "wet pH₂S"), (dry, "max_dry_ph2s_bar", "dry pH₂S")):
        if not lst or not any(r["ph2s_bar"] > 0 for r in lst):
            continue
        lim = rec.get(key)
        worst = max(lst, key=lambda r: r["ph2s_bar"])
        if lim is None:
            need(f"Record the qualified {label} limit")
        elif worst["ph2s_bar"] > lim:
            fail(f"{worst['location']}: {label} {worst['ph2s_bar']:.3f} bar > limit {lim:.3f} bar")
        else:
            ok(f"Max {label} {worst['ph2s_bar']:.3f} bar ≤ {lim:.3f} bar")
    if wet:
        worst = max(wet, key=lambda r: r["pco2_bar"])
        lim = rec.get("max_pco2_bar")
        if worst["pco2_bar"] > 0:
            if lim is None:
                need("Record the wet pCO₂ limit")
            elif worst["pco2_bar"] > lim:
                fail(f"{worst['location']}: pCO₂ {worst['pco2_bar']:.2f} bar > limit {lim:.2f} bar")
            else:
                ok(f"Max pCO₂ {worst['pco2_bar']:.2f} bar ≤ {lim:.2f} bar")
        low = min(wet, key=lambda r: r["ph"])
        lim = rec.get("min_ph")
        if lim is None:
            need("Record the minimum aqueous pH limit")
        elif low["ph"] < lim:
            fail(f"{low['location']}: pH {low['ph']:.2f} < limit {lim:.2f} ({low['ph_basis']})")
        else:
            ok(f"Min pH {low['ph']:.2f} ≥ {lim:.2f} ({low['ph_basis']})")
        if ma.chloride_ppm is not None:
            lim = rec.get("max_chloride_ppm")
            if lim is None:
                need("Record the chloride limit")
            elif ma.chloride_ppm > lim:
                fail(f"Chlorides {ma.chloride_ppm:.0f} ppm > limit {lim:.0f} ppm")
            else:
                ok(f"Chlorides {ma.chloride_ppm:.0f} ppm ≤ {lim:.0f} ppm")
        if not rec.get("corrosion_resistant"):
            frac = lambda r: ma.sop_exposure_fraction if r["location"] == "Settle-out" else 1.0
            rate = max(r["co2_rate_mm_y"] for r in wet)
            loss = max(r["co2_rate_mm_y"] * life * frac(r) for r in wet)
            ca = rec.get("corrosion_allowance_mm") or 0.0
            (fail if loss > ca else ok)(f"CO₂ loss {loss:.1f} mm over {life:.0f} y (≤{rate:.2f} mm/y) vs allowance {ca:.1f} mm")
    status = "outside" if failures else ("evidence" if missing else "within")
    return {**rec, "status": status, "failures": failures, "missing": missing, "checks": checks}


def material_assessment(gas, sizing: dict, project) -> dict:
    ma = project.material_assessment
    rec = record("materials.assessment", "Stage-by-stage sour/wet screening against recorded material limits", [ma, sizing["stages"]],
                 assumptions=["Partial pressures from the design gas composition at each stage outlet and settle-out",
                              f"Wet when the stage is within {DEW_APPROACH_C:.0f} °C of the water dew point (or liquid water assumed)",
                              "pH estimated for unbuffered condensed water saturated with CO2/H2S unless a measured pH is entered",
                              "SSC domains D0-D3 are illustrative, not ISO 15156 limits",
                              f"Settle-out corrosion counted for {ma.sop_exposure_fraction:.0%} of the service life",
                              "CO2 rate: de Waard-Milliams 1991 worst case for carbon/low-alloy steel (no scale, inhibition or flow effects)",
                              "A material name alone never passes: limits and evidence must be recorded"],
                 references=["ISO 15156-1/2/3 (NACE MR0175)", "de Waard, Lotz & Milliams, Corrosion 47 (1991)", "API 617 materials"])
    rows = stage_conditions(gas, sizing, project)
    records = [r.model_dump() for r in ma.records] if ma.records else default_records(project)
    results = [assess_record(r, rows, project) for r in records]
    if any(r["sour"] for r in rows):
        rec.warn("Sour service (pH₂S ≥ 0.3 kPa): ISO 15156 material requirements apply")
    if any(r["wet"] for r in rows):
        rec.warn("Liquid water possible at one or more locations: wet-service limits and corrosion allowance govern")
    counts = {k: sum(1 for r in results if r["status"] == k) for k in ("outside", "evidence", "within")}
    return {"conditions": rows, "components": results, "counts": counts, "trace": rec}
