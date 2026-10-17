"""Material assessment for sour / wet service.

Locations: suction, each stage outlet, SOP design (settle-out pressure and
temperature) and SOP saturation (settle-out pressure at its water dew
point). Conditions come from the compressor design; ``stage_overrides``
replace or add locations (e.g. a vendor's stage table). Water is knocked out
to saturation at every stage inlet (scrubbers / intercoolers).

Per location: partial pressures; water dew point from the H2O partial
pressure against pure-water saturation (Wagner-Pruss; ideal mixing, so it
under-predicts at high pressure); WET when T <= dew point + margin, i.e. the
point lies on or above the saturation curve shifted by the margin; estimated
condensed-water pH (CO2/H2S equilibria, unbuffered) unless measured; SSC
severity domain from editable boundaries (illustrative defaults, not the
ISO 15156-2 values); de Waard-Milliams (1991) carbon-steel CO2 rate x a
calibration factor x the O2 multiplier (API RP 581: x2 above 50 ppb O2), and
the cumulative loss over the design life.

Each component is then checked against the corrosion acceptance criteria
(rate and total loss, impellers by blade thickness) and against its
*recorded, documented* limits. Record verdicts:
  outside  - a recorded limit or acceptance criterion is exceeded
  evidence - nothing exceeded, but limits or evidence are missing
  within   - inside all recorded, verified limits (still conditional on sign-off)
A material name alone never passes. Plus weld overlay, SOP and contaminant
checks (status pass / fail / attention / review).
"""

from __future__ import annotations

import math

import numpy as np
from scipy.optimize import brentq

from compsuite.core.model import SSCDomains
from compsuite.core.trace import record
from compsuite.materials.database import get_material
from compsuite.materials.selection import (CS_FAMILIES, component_class, component_zone, criterion,
                                           select_materials, zone_rows)
from compsuite.thermo.eos import water_psat

SOUR_BAR = 0.003  # ISO 15156-2 threshold, 0.3 kPa
DEFAULT_BLADE_MM = 6.0  # impeller FEA smeared blade thickness
PSIG_TO_BARA = lambda psig: psig * 0.0689476 + 1.01325
SSC_X_RANGE, SSC_Y_RANGE = (1e-4, 100.0), (2.0, 7.0)
OVERLAY_STEPS = ["Weld overlay applied at rough machining stage", "Grinding / machining of the overlay",
                 "Stress-relief heat treatment of the base material", "NDT (PT/UT) of the overlay",
                 "Geometrical and roughness controls; chemistry check (Fe dilution) at the specified depth"]


def psat_bar(T_c: float) -> float:
    return water_psat(T_c + 273.15) / 1e5


def dew_point_c(ph2o_bar: float) -> float | None:
    """Temperature where pure water's vapour pressure equals the H2O partial pressure."""
    if ph2o_bar <= 0 or ph2o_bar >= 220.0:
        return None
    try:
        return float(brentq(lambda t: psat_bar(t) - ph2o_bar, -80.0, 373.0))
    except ValueError:
        return None


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


def _boundary_ph(points, ph2s: float) -> float:
    pts = sorted((p.ph2s_bar, p.ph) if hasattr(p, "ph") else (p["ph2s_bar"], p["ph"]) for p in points)
    return float(np.interp(math.log10(ph2s), [math.log10(x) for x, _ in pts], [y for _, y in pts]))


def ssc_domain(ph2s: float, ph: float, domains: SSCDomains | None = None) -> str:
    """Severity domain D0-D3 in the pH2S-pH plane; boundaries are straight in
    log pH2S between the given points and flat beyond them."""
    d = domains or SSCDomains()
    if ph2s < d.sour_threshold_bar:
        return "D0"
    return "D1" if ph >= _boundary_ph(d.d1_d2, ph2s) else ("D2" if ph >= _boundary_ph(d.d2_d3, ph2s) else "D3")


def co2_corrosion_mm_y(T_c: float, pco2: float) -> float:
    """de Waard & Milliams (1991) worst-case carbon steel rate, no scale factor."""
    if pco2 <= 0:
        return 0.0
    return 10 ** (5.8 - 1710 / (T_c + 273.15) + 0.67 * math.log10(pco2))


def o2_factor(ma) -> float:
    c = ma.contaminants
    return c.o2_rate_multiplier if (c.o2_ingress_ppmv or 0.0) * 1e3 > c.o2_threshold_ppb else 1.0


def _row(name, zone, P, T, yw, yco2, yh2s, ma, sop=False, ph=None, cr=None, source="process") -> dict:
    ph2s, pco2, ph2o = P * yh2s, P * yco2, P * yw
    dew = dew_point_c(ph2o)
    margin = None if dew is None else T - dew
    wet = ma.liquid_water_assumed or (margin is not None and margin <= ma.dew_margin_c)
    ph_est = condensed_water_ph(T, pco2, ph2s)
    ph_val = ph if ph is not None else (ma.measured_ph if ma.measured_ph is not None else ph_est)
    basis = "override" if ph is not None else ("measured" if ma.measured_ph is not None else "estimated (unbuffered)")
    dom = ssc_domain(ph2s, ph_val, ma.ssc_domains)
    f_o2 = o2_factor(ma)
    rate = (cr if cr is not None else co2_corrosion_mm_y(T, pco2) * ma.corrosion_factor) * f_o2 if wet else 0.0
    return {"location": name, "zone": zone, "sop": sop, "source": source, "P_bara": P, "T_c": T,
            "h2o_pct": yw * 100, "co2_pct": yco2 * 100, "h2s_pct": yh2s * 100,
            "ph2s_bar": ph2s, "pco2_bar": pco2, "ph2o_bar": ph2o, "water_dew_point_c": dew, "dew_margin_c": margin,
            "wet": bool(wet), "moisture": "WET" if wet else "DRY", "ph": ph_val, "ph_estimated": ph_est, "ph_basis": basis,
            "sour": ph2s >= ma.ssc_domains.sour_threshold_bar, "domain": dom, "domain_index": int(dom[1]),
            "o2_factor": f_o2 if wet else 1.0, "cr_mm_y": rate, "co2_rate_mm_y": rate,
            "cumulative_loss_mm": rate * ma.service_life_years * (ma.sop_exposure_fraction if sop else 1.0)}


def stage_conditions(gas, sizing: dict, project) -> list[dict]:
    """Rows for suction, stage outlets (or override locations), SOP design and SOP saturation."""
    ma = project.material_assessment
    x = gas.composition
    yh2s, yco2 = x.get("H2S", 0.0), x.get("CO2", 0.0)
    yw = x.get("H2O", ma.water_content_ppmv * 1e-6)
    dc = project.design_case()
    pts = []  # name, P, T, yw
    if not ma.overrides_only:
        y = min(yw, psat_bar(dc.suction_temperature_c) / dc.suction_pressure_bara)
        pts.append(["Suction", dc.suction_pressure_bara, dc.suction_temperature_c, y])
        for s in sizing["stages"]:
            y = min(y, psat_bar(s["T_in_c"]) / s["P_in_bara"])  # knock-out at stage inlet
            pts.append([f"Stage {s['index'] + 1}", s["P_out_bara"], s["T_out_c"], y])
    pts = [dict(name=n, P=P, T=T, yw=w, yco2=yco2, yh2s=yh2s, ph=None, cr=None, source="process") for n, P, T, w in pts]
    sop_ov = {}
    for o in ma.stage_overrides:
        key = o.location.strip().lower()
        if key in ("sop design", "sop saturation"):
            sop_ov[key] = o
            continue
        tgt = next((p for p in pts if p["name"].lower() == key), None)
        if tgt is None:
            if o.P_bara is None or o.T_c is None:
                continue
            tgt = dict(name=o.location, P=o.P_bara, T=o.T_c, yw=yw, yco2=yco2, yh2s=yh2s, ph=None, cr=None)
            pts.append(tgt)
        for f, k, s in (("P_bara", "P", 1), ("T_c", "T", 1), ("h2o_pct", "yw", 0.01), ("co2_pct", "yco2", 0.01),
                        ("h2s_pct", "yh2s", 0.01), ("ph", "ph", 1), ("cr_mm_y", "cr", 1)):
            v = getattr(o, f)
            if v is not None:
                tgt[k] = v * s
        tgt["source"] = "override"
    rows = []
    for i, p in enumerate(pts):
        zone = "suction" if i == 0 else ("discharge" if i == len(pts) - 1 else "internal")
        rows.append(_row(p["name"], zone, p["P"], p["T"], p["yw"], p["yco2"], p["yh2s"], ma, ph=p["ph"], cr=p["cr"],
                         source=p["source"]))
    # Settle-out: suction-side composition at the settle-out pressure.
    ref = pts[0] if pts else dict(yw=yw, yco2=yco2, yh2s=yh2s)
    sop_p = ma.sop_pressure_bara or (dc.suction_pressure_bara + 0.45 * (dc.discharge_pressure_bara - dc.suction_pressure_bara))
    comp = dict(yw=ref["yw"], yco2=ref["yco2"], yh2s=ref["yh2s"])
    for name in ("SOP design", "SOP saturation"):
        o = sop_ov.get(name.lower())
        P = o.P_bara if o is not None and o.P_bara is not None else sop_p
        c = dict(comp)
        for f, k in (("h2o_pct", "yw"), ("co2_pct", "yco2"), ("h2s_pct", "yh2s")):
            if o is not None and getattr(o, f) is not None:
                c[k] = getattr(o, f) / 100
        if name == "SOP design":
            T = o.T_c if o is not None and o.T_c is not None else ma.sop_temperature_c
            comp, sop_p = c, P
        else:
            T = o.T_c if o is not None and o.T_c is not None else (dew_point_c(P * c["yw"]) or ma.sop_temperature_c)
        rows.append(_row(name, "sop", P, T, c["yw"], c["yco2"], c["yh2s"], ma, sop=True,
                         ph=getattr(o, "ph", None), cr=getattr(o, "cr_mm_y", None), source="override" if o else "process"))
    return rows


def ssc_chart(rows: list[dict], domains: SSCDomains) -> dict:
    """Boundary polylines and region polygons ([ph2s_bar, pH] pairs) for the pH2S-pH chart."""
    (x0, x1), (y0, y1) = SSC_X_RANGE, SSC_Y_RANGE
    thr = domains.sour_threshold_bar
    clip = lambda y: min(max(y, y0), y1)

    def line(points):
        xs = sorted({thr, x1, *[p.ph2s_bar for p in points if thr < p.ph2s_bar < x1]})
        return [[x, clip(_boundary_ph(points, x))] for x in xs]

    up, lo = line(domains.d1_d2), line(domains.d2_d3)
    xl = min(10 * thr, x1)
    yu, yl = clip(_boundary_ph(domains.d1_d2, xl)), clip(_boundary_ph(domains.d2_d3, xl))
    labels = {"D0": [math.sqrt(x0 * thr), (y0 + y1) / 2], "D1": [xl, (yu + y1) / 2], "D2": [xl, (yu + yl) / 2], "D3": [xl, (yl + y0) / 2]}
    return {"x_range": [x0, x1], "y_range": [y0, y1], "x_type": "log", "sour_threshold_bar": thr,
            "boundaries": [{"name": "D1/D2", "points": up}, {"name": "D2/D3", "points": lo},
                           {"name": "Sour threshold", "points": [[thr, y0], [thr, y1]]}],
            "regions": [{"domain": "D0", "label": "0", "label_at": labels["D0"], "polygon": [[x0, y0], [thr, y0], [thr, y1], [x0, y1]]},
                        {"domain": "D1", "label": "1", "label_at": labels["D1"], "polygon": up + [[x1, y1], [thr, y1]]},
                        {"domain": "D2", "label": "2", "label_at": labels["D2"], "polygon": up + lo[::-1]},
                        {"domain": "D3", "label": "3", "label_at": labels["D3"], "polygon": lo + [[x1, y0], [thr, y0]]}],
            "points": [{"location": r["location"], "x": max(r["ph2s_bar"], x0), "y": r["ph"], "wet": r["wet"],
                        "domain": r["domain"], "sop": r["sop"]} for r in rows],
            "note": "Illustrative boundaries (editable): enter the ISO 15156-2 Figure 1 values from the licensed copy"}


def dew_chart(rows: list[dict], margin_c: float) -> dict:
    ts = [float(t) for t in range(0, 201, 2)]
    return {"saturation": [[t, psat_bar(t)] for t in ts], "margin": [[t + margin_c, psat_bar(t)] for t in ts if t + margin_c <= 210],
            "margin_c": margin_c, "y_type": "log",
            "points": [{"location": r["location"], "x": r["T_c"], "y": r["ph2o_bar"], "wet": r["wet"], "sop": r["sop"],
                        "dew_point_c": r["water_dew_point_c"]} for r in rows],
            "note": "Wet when the point lies on or left of / above the margin curve"}


def corrosion_acceptance(cls: str, cr_mm_y: float, loss_mm: float, criteria: list, blade_t_mm: float | None = None) -> dict:
    """Rate and total-loss check against the class criterion (impellers by blade thickness)."""
    c, note = criterion(cls, criteria, blade_t_mm)
    if c is None:
        return {"status": "review", "limit_cr": None, "limit_total": None, "note": note, "pass": None}
    ok = cr_mm_y <= c["max_cr_mm_y"] + 1e-12 and loss_mm <= c["max_total_mm"] + 1e-12
    return {"status": "pass" if ok else "fail", "pass": ok, "limit_cr": c["max_cr_mm_y"], "limit_total": c["max_total_mm"],
            "note": note}


def _surface(rec: dict) -> tuple[str, bool]:
    """Wetted-surface material and whether it is corrosion resistant (CRA / overlay)."""
    surf = rec.get("overlay") or rec.get("wetted_surface") or rec.get("material")
    try:
        cra = get_material(surf)["family"] not in CS_FAMILIES
    except KeyError:
        cra = bool(rec.get("corrosion_resistant"))
    return surf, bool(rec.get("corrosion_resistant")) or cra or bool(rec.get("overlay"))


def assess_record(rec: dict, rows: list[dict], project, blade_t_mm: float | None = None) -> dict:
    """Check one component record against the locations it sees (SOP rows weighted by exposure)."""
    ma = project.material_assessment
    failures, missing, checks = [], [], []
    fail, need, ok = failures.append, missing.append, checks.append
    life = ma.service_life_years
    tmax = max(r["T_c"] for r in rows)
    tmin = ma.shaft_mdmt_c if rec["component"].strip().lower() == "shaft" else ma.mdmt_c
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
    if any(r["sour"] for r in rows):
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
    # Corrosion of the wetted surface: CRA / overlay taken as negligible within its qualified envelope.
    surf, cra = _surface(rec)
    rate_of = lambda r: r.get("cr_mm_y", r.get("co2_rate_mm_y", 0.0))
    proc = [r for r in wet if not r.get("sop")]
    sop = [r for r in wet if r.get("sop")]
    cr = 0.0 if cra else max((rate_of(r) for r in proc), default=0.0)
    cr_sop = 0.0 if cra else max((rate_of(r) for r in sop), default=0.0)
    loss = cr * life + cr_sop * life * ma.sop_exposure_fraction
    cls = rec.get("component_class") or component_class(rec["component"])
    acc = corrosion_acceptance(cls, cr, loss, ma.acceptance_criteria, blade_t_mm)
    if acc["status"] == "review":
        need(acc["note"])
    else:
        txt = (f"Corrosion {cr:.3f} mm/y, {loss:.2f} mm over {life:.0f} y vs {acc['limit_cr']:.3g} mm/y / {acc['limit_total']:.3g} mm "
               f"({cls}{', ' + acc['note'] if acc['note'] else ''}; surface {surf}{', CRA' if cra else ''})")
        (ok if acc["pass"] else fail)(txt)
    if wet and not cra:
        ca = rec.get("corrosion_allowance_mm") or 0.0
        (fail if loss > ca else ok)(f"Loss {loss:.1f} mm vs corrosion allowance {ca:.1f} mm")
    status = "outside" if failures else ("evidence" if missing else "within")
    return {**rec, "status": status, "failures": failures, "missing": missing, "checks": checks, "wet": bool(proc),
            "domain": f"D{max((r.get('domain_index', 0) for r in rows), default=0)}", "surface": surf, "cra": cra,
            "cr_mm_y": cr, "loss_mm": loss, "limit_cr": acc["limit_cr"], "limit_total": acc["limit_total"],
            "acceptance": acc["status"]}


def default_records(selection: list[dict]) -> list[dict]:
    """Unverified records from the automatic selection (limits from the database, evidence missing)."""
    out = []
    for s in selection:
        m = get_material(s["proposed"])
        cra = m["family"] not in CS_FAMILIES or bool(s["overlay"])
        out.append({"component": s["component"], "material": s["proposed"], "wetted_surface": s["overlay"] or s["proposed"],
                    "evidence_reference": "", "verified": False, "component_class": s["component_class"], "overlay": s["overlay"],
                    "min_temp_c": m["min_temp_c"], "max_temp_c": m["max_temp_c"], "max_hardness_hrc": m.get("sour_max_hrc"),
                    "measured_hardness_hrc": None, "max_wet_ph2s_bar": None, "max_dry_ph2s_bar": None, "max_pco2_bar": None,
                    "min_ph": None, "max_chloride_ppm": None, "corrosion_allowance_mm": 0.0 if cra else 3.0,
                    "corrosion_resistant": cra})
    return out


def weld_overlay_check(ma, components: list[dict]) -> dict:
    w = ma.weld_overlay
    parts = [c["component"] for c in components if c.get("overlay")]
    checks = []
    if parts:
        for val, lim, label, cmp, unit in ((w.measured_undiluted_mm, w.min_undiluted_mm, "Undiluted thickness", lambda v, l: v >= l, "mm"),
                                           (w.measured_fe_dilution_pct, w.max_fe_dilution_pct, "Fe dilution at 1 mm", lambda v, l: v <= l, "%")):
            crit = f"{'>=' if unit == 'mm' else '<='} {lim:g} {unit}"
            if val is None:
                checks.append({"check": label, "criterion": crit, "value": None, "status": "attention",
                               "note": "Verify on the PQR / production test coupon"})
            else:
                checks.append({"check": label, "criterion": crit, "value": val, "status": "pass" if cmp(val, lim) else "fail", "note": ""})
    st = [c["status"] for c in checks]
    status = "fail" if "fail" in st else ("attention" if "attention" in st else ("pass" if parts else "not required"))
    return {"required": bool(parts), "components": parts, "alloy": w.alloy, "min_undiluted_mm": w.min_undiluted_mm,
            "max_fe_dilution_pct": w.max_fe_dilution_pct, "measured_undiluted_mm": w.measured_undiluted_mm,
            "measured_fe_dilution_pct": w.measured_fe_dilution_pct, "checks": checks, "status": status,
            "process_steps": OVERLAY_STEPS if parts else [],
            "statement": (f"{w.alloy} weld overlay on wetted surfaces of {', '.join(parts)}: minimum {w.min_undiluted_mm:g} mm with "
                          f"undiluted chemistry; Fe dilution at 1 mm below the alloy-625 limit (5-{w.max_fe_dilution_pct:g} % max)")
            if parts else "No weld overlay required by the selection"}


def sop_check(rows: list[dict], ma) -> dict:
    s = ma.sop
    d = next(r for r in rows if r["location"] == "SOP design")
    dew = d["water_dew_point_c"]
    trip = None if dew is None else dew + s.tt_margin_c
    p_low = PSIG_TO_BARA(s.depressurise_to_psig)
    dew_low = dew_point_c(p_low * d["h2o_pct"] / 100)
    st = []
    if dew is None:
        status = "pass"
        st.append("No water in the gas: no condensation at settle-out")
    elif d["T_c"] >= trip:
        status = "pass"
        st.append(f"SOP {d['P_bara']:.1f} bara, {d['T_c']:.1f} °C stays above the water dew point {dew:.1f} °C + {s.tt_margin_c:g} °C: dry")
    else:
        exp = s.expected_standstill_hours
        status = "fail" if exp is not None and exp > s.standstill_hours_max else "attention"
        st += [f"Gas stays dry at SOP while the temperature is above the SOP water dew point ({dew:.1f} °C at {d['P_bara']:.1f} bara)",
               "Selection assumes the SOP duration is short enough to avoid condensation",
               f"Install a temperature transmitter at the casing inlet with a depressurisation trip at {trip:.1f} °C "
               f"(dew point + {s.tt_margin_c:g} °C)",
               f"MOC suitable for {s.standstill_hours_max:g} h maximum pressurised standstill at SOP",
               f"Immediate depressurisation to {s.depressurise_to_psig:g} psig ({p_low:.2f} bara, dew point "
               + (f"{dew_low:.1f} °C" if dew_low is not None else "n/a") + ") removes the limit"]
        if exp is not None:
            st.append(f"Expected standstill {exp:g} h {'exceeds' if exp > s.standstill_hours_max else 'within'} "
                      f"{s.standstill_hours_max:g} h")
    return {"pressure_bara": d["P_bara"], "temperature_c": d["T_c"], "h2o_pct": d["h2o_pct"], "dew_point_c": dew,
            "trip_setpoint_c": trip, "wet_at_design": d["wet"], "standstill_hours_max": s.standstill_hours_max,
            "expected_standstill_hours": s.expected_standstill_hours, "depressurise_to_psig": s.depressurise_to_psig,
            "depressurise_to_bara": p_low, "dew_point_depressurised_c": dew_low, "status": status, "statements": st}


def contaminant_checks(rows: list[dict], ma) -> list[dict]:
    c = ma.contaminants
    wet = any(r["wet"] for r in rows if not r["sop"])
    h2s = any(r["ph2s_bar"] > 0 for r in rows)
    out = []
    add = lambda item, value, limit, status, note="": out.append(
        {"item": item, "value": value, "limit": limit, "status": status, "note": note})
    if c.mercury_ng_nm3 is None:
        add("Mercury", None, f"<= {c.mercury_limit_ng_nm3:g} ng/Nm³", "review", "Not specified: aluminium parts are prone to Hg LME")
    else:
        okhg = c.mercury_ng_nm3 <= c.mercury_limit_ng_nm3
        add("Mercury", f"{c.mercury_ng_nm3:g} ng/Nm³", f"<= {c.mercury_limit_ng_nm3:g} ng/Nm³", "pass" if okhg else "fail",
            "" if okhg else "Aluminium labyrinths excluded (liquid-metal embrittlement)")
    for label, v in (("Chloride (liquid entrainment)", c.chloride_entrainment_ppmv), ("Chloride (water saturation)", c.chloride_saturation_ppmv)):
        if v is None:
            add(label, None, "-", "review", "Not specified")
        else:
            add(label, f"{v:g} ppmv", "-", "attention" if wet and v > 0 else "pass",
                "Chlorides in the condensed water: Ni-base alloys in wet zones; 300-series / 17-4PH excluded" if wet and v > 0 else
                "No wet location in service")
    for label, v, lim, ge, unit in (("Scrubber efficiency (droplets >= 10 µm)", c.scrubber_efficiency_pct, c.scrubber_min_efficiency_pct, True, "%wt"),
                                    ("Liquid carry-over", c.carryover_l_mmscfd, c.carryover_max_l_mmscfd, False, "L/MMSCFD"),
                                    ("Max droplet size", c.max_droplet_um, c.max_droplet_limit_um, False, "µm")):
        crit = f"{'>=' if ge else '<='} {lim:g} {unit}"
        if v is None:
            add(label, None, crit, "review", "Not specified")
        else:
            add(label, f"{v:g} {unit}", crit, "pass" if (v >= lim if ge else v <= lim) else "fail")
    o2 = c.o2_ingress_ppmv
    if o2 is None:
        note = f"Seal N2 purity {c.n2_purity_pct:g} %: enter the maximum O2 ingress" if c.n2_purity_pct is not None and c.n2_purity_pct < 100 \
            else "Not specified"
        add("O2 ingress", None, f"<= {c.o2_threshold_ppb:g} ppb", "review", note)
    else:
        high = o2 * 1e3 > c.o2_threshold_ppb
        add("O2 ingress", f"{o2:g} ppmv ({o2 * 1e3:.0f} ppb)", f"<= {c.o2_threshold_ppb:g} ppb", "attention" if high else "pass",
            f"API RP 581: carbon/low-alloy steel corrosion rate x{c.o2_rate_multiplier:g} applied" if high else "")
        if o2 > 0 and h2s:
            add("Elemental sulfur (O2 + H2S)", "risk", "no O2 with H2S", "attention" if wet else "review",
                "Sulfur deposition in wet zones: only Ni-base alloys tolerate it" if wet else "No wet location: confirm during upsets")
    return out


def material_assessment(gas, sizing: dict, project, impellers: list[dict] | None = None) -> dict:
    ma = project.material_assessment
    life = ma.service_life_years
    rec = record("materials.assessment", "Location-by-location sour/wet screening, automatic selection and checks against "
                 "acceptance criteria and recorded material limits", [ma, sizing["stages"]],
                 assumptions=["Partial pressures from the gas composition at suction, stage outlets and settle-out (or overrides)",
                              "Water knocked out to saturation at each stage inlet; dew point from pH2O vs pure-water saturation "
                              "(ideal mixing, low-pressure approximation)",
                              f"Wet when T <= water dew point + {ma.dew_margin_c:g} °C (or liquid water assumed)",
                              "pH estimated for unbuffered condensed water saturated with CO2/H2S unless measured/overridden",
                              "SSC domain boundaries are editable; defaults are illustrative, not ISO 15156-2 values",
                              f"CO2 rate: de Waard-Milliams 1991 worst case x {ma.corrosion_factor:g}; O2 multiplier per API RP 581",
                              f"Cumulative loss over {life:g} y; settle-out " + ("protected by the dew-point trip (not counted)" if ma.sop.protected
                              else f"counted for {ma.sop_exposure_fraction:.0%} of the life"),
                              "CRA / overlay surfaces: general corrosion taken as negligible inside their qualified envelope",
                              "A material name alone never passes: limits and evidence must be recorded"],
                 references=["ISO 15156-1/2/3 (NACE MR0175)", "de Waard, Lotz & Milliams, Corrosion 47 (1991)",
                             "API RP 581 (O2 effect)", "API 617 materials", "Wagner & Pruss (2002) water vapour pressure"])
    rows = stage_conditions(gas, sizing, project)
    bt = [i.get("blade_thickness_mm") for i in (impellers or []) if i.get("blade_thickness_mm")]
    blade_t = ma.impeller_blade_thickness_mm or (min(bt) if bt else DEFAULT_BLADE_MM)
    blade_basis = "input" if ma.impeller_blade_thickness_mm else ("impeller results" if bt else "default (impeller FEA blade)")
    selection = select_materials(rows, ma, blade_t)
    sel_by = {s["component"].lower(): s for s in selection}
    records = [r.model_dump() for r in ma.records] if ma.records else default_records(selection)
    sop_design = [] if ma.sop.protected else [r for r in rows if r["location"] == "SOP design"]
    sleeve = next((r for r in records if r["component"].strip().lower() == "shaft sleeve"), None)
    sleeved = sleeve is not None and _surface(sleeve)[1]
    components = []
    for r in records:
        zone = component_zone(r["component"])
        if zone == "all" and sleeved and r["component"].strip().lower() == "shaft":
            zone = "sleeved"  # CRA sleeve covers the shaft at suction
        zr = zone_rows(rows, zone) + sop_design or rows
        a = assess_record(r, zr, project, blade_t)
        a.update(location=", ".join(x["location"] for x in zone_rows(rows, zone)), zone=zone,
                 selection=sel_by.get(r["component"].lower()))
        components.append(a)
    if any(r["sour"] for r in rows):
        rec.warn("Sour service (pH₂S ≥ 0.3 kPa): ISO 15156 material requirements apply")
    if any(r["wet"] for r in rows if not r["sop"]):
        rec.warn("Liquid water possible at one or more locations: wet-service limits and corrosion criteria govern")
    if blade_t <= 4:
        rec.warn(f"Impeller blade {blade_t:.1f} mm below the tabulated criteria: most stringent criterion used")
    sop = sop_check(rows, ma)
    contaminants = contaminant_checks(rows, ma)
    overlay = weld_overlay_check(ma, components)
    counts = {k: sum(1 for c in components if c["status"] == k) for k in ("outside", "evidence", "within")}
    counts.update(acceptance_fail=sum(1 for c in components if c["acceptance"] == "fail"),
                  wet_locations=sum(1 for r in rows if r["wet"] and not r["sop"]), sour=any(r["sour"] for r in rows),
                  mdmt_fail=sum(1 for s in selection if not s["mdmt_ok"]))
    criteria = [c.model_dump() for c in ma.acceptance_criteria]
    return {"conditions": rows, "charts": {"dew_point": dew_chart(rows, ma.dew_margin_c), "ssc": ssc_chart(rows, ma.ssc_domains)},
            "criteria": criteria, "blade_thickness_mm": blade_t, "blade_thickness_basis": blade_basis, "design_life_years": life,
            "mdmt_c": ma.mdmt_c, "shaft_mdmt_c": ma.shaft_mdmt_c, "components": components, "selection": selection,
            "weld_overlay": overlay, "sop": sop, "contaminants": contaminants, "counts": counts, "trace": rec}
