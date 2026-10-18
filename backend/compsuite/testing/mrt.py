"""Mechanical running test (API 617 9th ed. 8.3.2) and unbalanced rotor response test (8.3.3).

Plans the shop test from the project (test train, speed-time profile with the five lube-oil
sequences of the 4 h run), predicts what the probes should read along the profile from the
rotor FE model (synchronous response to the allowable residual unbalance, Bode / polar, shaft
centreline, waterfall, bearing metal temperatures), evaluates the test log against the API 617
limits and the prediction, plans and evaluates the URT, and records the assembled gas leak test
and the post-test inspection.

Limits: vibration A = 25.4 sqrt(12000 / MCS) um pk-pk unfiltered, not above 25.4 um; increase
from MCS to trip <= 12.7 um; mechanical + electrical runout <= max(6.35 um, 25 % A);
non-synchronous components <= 20 % A (0.05-8 x MCS); bearing metal <= 105 C (project value);
axial position <= 500 um; noise <= 85 dBA. URT: trial unbalance 2-8 x Ur at the coupling, measured
critical within +-5 % of the prediction, probe response within the predicted range.
"""

from __future__ import annotations

import math

import numpy as np

from compsuite.rotordynamics import fe

G0 = 9.80665
OIL_SEQ = [("Seq 1", "max", "min"), ("Seq 2", "max", "max"), ("Seq 3", "nor", "nor"), ("Seq 4", "min", "min"), ("Seq 5", "min", "max")]
PROBES = ["V1-X", "V1-Y", "V2-X", "V2-Y"]
TEMPS = [f"TA{i}" for i in range(1, 13)]


def vib_limit_um(mcs_rpm: float) -> float:
    return min(25.4, 25.4 * math.sqrt(12000 / mcs_rpm))


def _st(ok, measured=True):
    return "review" if not measured else ("pass" if ok else "fail")


# ---------------------------------------------------------------- test train
def test_train(project, res: dict, sp: dict, options: dict) -> dict:
    db, tr = project.design_basis, project.train
    geared = tr.gear_ratio > 1.0001 or db.driver_type == "fixed_speed_motor_gearbox"
    ratio = tr.gear_ratio if tr.gear_ratio > 1.0001 else (sp["rated_rpm"] / 2985 if geared else 1.0)
    src = options.get("equipment") or {}
    turbine = db.driver_type in ("steam_turbine", "gas_turbine")
    kw = float(res.get("summary", {}).get("driver_rating_kw") or 0)
    items = []

    def add(key, kind, name, default, note, ratio_=1.0):
        items.append({"key": key, "kind": kind, "name": name, "source": src.get(key, default), "speed_ratio": ratio_, "note": note})
    if not turbine:
        add("vfd", "vfd", "Variable frequency drive", "shop", "Test-stand VFD gives the variable speed; contract VFD if string test")
    add("driver", "turbine" if turbine else "motor", ("Steam" if db.driver_type == "steam_turbine" else "Gas") + " turbine" if turbine
        else f"Induction motor {kw:.0f} kW", "shop", "Shop driver with adequate power at trip speed", 1 / ratio)
    if geared:
        add("ls_coupling", "coupling", "LS coupling", "shop", "Shop coupling between driver and gearbox", 1 / ratio)
        add("gearbox", "gearbox", f"Speed-increasing gearbox i = {ratio:.3f}", "contract" if db.driver_type == "fixed_speed_motor_gearbox" else "shop",
            "Contract gear preferred (string test); shop gear otherwise", 1.0)
    add("hs_coupling", "coupling", "HS coupling (contract) or idling adaptor", "contract", "API 617 8.3.2: contract coupling or idling adaptor of equal moment")
    for i, c in enumerate(res["casings"]):
        add(f"casing{i + 1}", "casing", f"Compressor casing {i + 1} ({len(c['impellers']['impellers'])} impellers)", "contract", "Contract rotor, bearings and seals")
    add("probes", "instrument", "Shaft vibration and axial probes, proximitors", "contract", "Contract probes, cables and proximitors (API 670)")
    add("bearing_rtd", "instrument", "Bearing metal temperature RTDs TA1-TA12", "contract", "Contract RTDs; shop monitoring system")
    add("lube", "console", "Lube oil console", "shop", "Shop console; contract console if specified")
    add("dgs", "seal", "Dry gas seals with seal gas panel", "contract", "Contract seals; shop buffer / separation gas supply")
    return {"geared": geared, "gear_ratio": ratio, "driver_type": db.driver_type, "components": items, "casings": len(res["casings"])}


# ---------------------------------------------------------------- speed-time plan
def speed_profile(sp: dict, crit: list[float], oil: dict, options: dict) -> dict:
    rated, mcs, trip, mss = sp["rated_rpm"], sp["mcs_rpm"], sp["trip_rpm"], sp["min_rpm"]
    warm = float(options.get("warmup_rpm") or min(1500.0, 0.3 * mss))
    run_h = float(options.get("run_hours") or 4.0)
    segs, t = [], 0.0

    def seg(phase, label, n0, n1, dur, oil_t="nor", oil_p="nor", seq=None):
        nonlocal t
        lo, hi = min(n0, n1), max(n0, n1)
        segs.append({"phase": phase, "label": label, "n0_rpm": n0, "n1_rpm": n1, "t0_min": t, "t1_min": t + dur, "oil_t": oil_t, "oil_p": oil_p,
                     "seq": seq, "critical": any(lo < c < hi for c in crit) or any(abs(c - n0) < 0.03 * c and n0 == n1 for c in crit)})
        t += dur
    seg("startup", "Start-up, breakaway", 0, warm, 2)
    seg("warmup", "Warm-up until oil and metal temperatures are stable", warm, warm, 15)
    seg("critical", "Accelerate quickly through the 1st critical to MSS", warm, mss, 2)
    seg("step", f"Hold at MSS {mss:.0f} rpm", mss, mss, 5)
    n = mss
    while n + 0.1 * rated < mcs - 0.02 * rated:
        seg("step", f"Step +10 % to {n + 0.1 * rated:.0f} rpm", n, n + 0.1 * rated, 1)
        n += 0.1 * rated
        seg("step", f"Hold {n / rated * 100:.0f} % rated", n, n, 5)
    seg("step", "Accelerate to MCS", n, mcs, 1)
    seg("step", "Hold at MCS", mcs, mcs, 5)
    seg("trip", "Accelerate to trip speed", mcs, trip, 1)
    seg("trip", "Trip-speed hold (>= 15 min, until stable)", trip, trip, 15)
    seg("runout", "Drop to MSS: runout / repeatability check", trip, mss, 2)
    seg("runout", "Hold at MSS", mss, mss, 10)
    seg("run4h", "Accelerate to MCS", mss, mcs, 2)
    rest = run_h * 60 - 150
    seg("run4h", "4 h run at MCS: stabilisation (normal oil)", mcs, mcs, max(rest - 30, 0))
    for name, ot, op in OIL_SEQ:
        seg("run4h", f"4 h run {name}: oil {ot} T / {op} P", mcs, mcs, 30, ot, op, name)
    seg("run4h", "4 h run: normal oil, final readings", mcs, mcs, 30)
    coast = float(options.get("coastdown_min") or 6.0)
    seg("coastdown", "Coast-down (Bode / polar recorded)", mcs, 0, coast)
    # Sampled timeline with first-order oil temperature / pressure lags.
    dt, T, P = 0.25, oil["t"]["nor"], oil["p"]["nor"]
    ts, ns, ots, ops, ph = [], [], [], [], []
    for k, s in enumerate(segs):
        for tt in np.arange(s["t0_min"], s["t1_min"] - 1e-9, dt):
            f = (tt - s["t0_min"]) / max(s["t1_min"] - s["t0_min"], 1e-9)
            nn = s["n0_rpm"] * max(0.0, 1 - f) ** 1.6 if s["phase"] == "coastdown" else s["n0_rpm"] + (s["n1_rpm"] - s["n0_rpm"]) * f
            T += (oil["t"][s["oil_t"]] - T) * dt / 4.0
            P += (oil["p"][s["oil_p"]] - P) * dt / 0.6
            ts.append(round(float(tt), 3)); ns.append(round(float(nn), 1)); ots.append(round(T, 2)); ops.append(round(P, 3)); ph.append(k)
    ts.append(t); ns.append(0.0); ots.append(round(T, 2)); ops.append(round(P, 3)); ph.append(len(segs) - 1)
    return {"segments": segs, "t_min": ts, "speed_rpm": ns, "oil_t_c": ots, "oil_p_barg": ops, "segment": ph, "duration_min": t, "warmup_rpm": warm}


# ---------------------------------------------------------------- prediction
def _ctx(cas: dict, sp: dict):
    model = cas["_model"]
    structural = model.assemble_structural()
    basis = model.reduction_basis(sp["mcs_rpm"] * math.pi / 30, 40, structural)
    brg = [s for s in model.supports if s.kind == "bearing"]
    return model, structural, basis, brg


def _resp(model, structural, basis, brg, speeds, ubs):
    r = fe.unbalance_response(model, np.asarray(speeds) * math.pi / 30, ubs, [b.z for b in brg], structural=structural, basis=basis)
    out = {}
    for i, b in enumerate(brg):
        d = r["probes"][f"{b.z:.4f}"]
        out[f"V{i + 1}-X"] = {"amp_um": [2 * a for a in d["x_amp_um"]], "phase_deg": [p % 360 for p in d["x_phase_deg"]]}
        out[f"V{i + 1}-Y"] = {"amp_um": [2 * a for a in d["y_amp_um"]], "phase_deg": [(p - 90) % 360 for p in d["x_phase_deg"]]}
        out[f"V{i + 1}"] = [2 * a for a in d["major_um"]]
    return out


def _interp_ext(x, xp, fp):
    """Linear interpolation with linear extrapolation above the table."""
    if x <= xp[-1]:
        return float(np.interp(x, xp, fp))
    s = (fp[-1] - fp[-2]) / (xp[-1] - xp[-2]) if len(xp) > 1 else 0
    return float(fp[-1] + s * (x - xp[-1]))


def predicted_response(project, cas: dict, sp: dict, ctx, options: dict) -> dict:
    model, structural, basis, brg = ctx
    mcs, trip = sp["mcs_rpm"], sp["trip_rpm"]
    loads = model.static_bearing_loads()
    U = [6350 * abs(loads[b.label]) / G0 / mcs for b in brg]                      # allowable residual per plane, g mm
    zc = float(model.mass_properties()["cg_m"])
    ubs = [{"z": zc, "me": sum(U) * 1e-6, "phase_deg": 0.0},
           {"z": brg[0].z, "me": 0.5 * U[0] * 1e-6, "phase_deg": 90.0}, {"z": brg[-1].z, "me": 0.5 * U[-1] * 1e-6, "phase_deg": 270.0}]
    speeds = np.linspace(200.0, 1.04 * trip, 170).tolist()
    r = _resp(model, structural, basis, brg, speeds, ubs)
    runout = float(options.get("runout_um", 4.0))
    lim = vib_limit_um(mcs)
    probes = {}
    for k in PROBES:
        a1 = r[k]["amp_um"]
        probes[k] = {"amp_1x_um": a1, "phase_deg": r[k]["phase_deg"],
                     "unfiltered_um": [math.sqrt(a * a + runout**2 + (0.04 * a + 0.3) ** 2) for a in a1]}
    # Critical speeds: peaks of the major-axis response at either bearing.
    crit = []
    for i in range(len(brg)):
        for pk in fe.find_peaks_af(speeds, r[f"V{i + 1}"]):
            if pk["amplitude_um"] > 0.1 * max(r[f"V{i + 1}"]) and all(abs(pk["speed_rpm"] - c["speed_rpm"]) > 0.05 * c["speed_rpm"] for c in crit):
                crit.append({"speed_rpm": pk["speed_rpm"], "af": pk["af"], "probe": f"V{i + 1}"})
    crit.sort(key=lambda c: c["speed_rpm"])
    # Shaft centreline from the bearing tables (journal static position vs speed).
    tables = cas["bearings"]["bearings"]
    cl, btemp = {}, {}
    t_des = project.bearings.oil_supply_temperature_c
    for i, b in enumerate(brg):
        tb = tables.get(b.label) or list(tables.values())[min(i, len(tables) - 1)]
        c_um = tb["geometry"]["radial_clearance_um"]
        rows = tb["rows"]
        cl[f"Bearing {i + 1}"] = {"speeds_rpm": [0.0] + list(tb["speeds_rpm"]), "x_um": [0.0] + [r_.get("x0_m", 0) * 1e6 for r_ in rows],
                                  "y_um": [-c_um] + [r_.get("y0_m", -r_["eccentricity"] * c_um * 1e-6) * 1e6 for r_ in rows],
                                  "eccentricity": [1.0] + [r_["eccentricity"] for r_ in rows], "clearance_um": c_um,
                                  "attitude_deg": [0.0] + [r_["attitude_deg"] for r_ in rows]}
        btemp[f"Bearing {i + 1}"] = {"speeds_rpm": [0.0] + list(tb["speeds_rpm"]), "temp_c": [t_des] + [r_["babbitt_temperature_est_c"] for r_ in rows]}
    # Waterfall: 1X dominant plus small residual components.
    c1 = crit[0]["speed_rpm"] if crit else 0.5 * sp["min_rpm"]
    wf = []
    for lab, n in [("MSS", sp["min_rpm"]), ("1st critical", c1), ("75 % rated", 0.75 * sp["rated_rpm"]), ("Rated", sp["rated_rpm"]), ("MCS", mcs), ("Trip", trip)]:
        a = max(_interp_ext(n, speeds, probes[k]["amp_1x_um"]) for k in PROBES)
        comp = [{"order": 1.0, "kind": "1X", "amp_um": a}, {"order": 2.0, "kind": "2X", "amp_um": 0.06 * a + 0.25},
                {"order": 3.0, "kind": "3X", "amp_um": 0.1 + 0.02 * a}, {"order": 0.43, "kind": "sub-synchronous (oil whirl region)", "amp_um": 0.25},
                {"order": 6000 / max(n, 1), "kind": "2 x line frequency", "amp_um": 0.15}]
        wf.append({"label": lab, "speed_rpm": n, "components": [{**q, "freq_hz": q["order"] * n / 60} for q in comp if q["order"] * n / 60 <= 8 * mcs / 60]})
    return {"speeds_rpm": speeds, "probes": probes, "major_um": {f"V{i + 1}": r[f"V{i + 1}"] for i in range(len(brg))},
            "residual_unbalance_g_mm": U, "unbalance_distribution": ubs, "runout_um": runout, "critical_speeds": crit,
            "centreline": cl, "bearing_temp_table": btemp, "waterfall": wf, "limit_um": lim,
            "probe_positions_m": [b.z for b in brg], "bearing_labels": [b.label for b in brg]}


def bearing_temperature(pred: dict, n: float, t_oil: float, t_des: float) -> dict:
    out = {k: _interp_ext(n, v["speeds_rpm"], v["temp_c"]) + (t_oil - t_des) for k, v in pred["bearing_temp_table"].items()}
    out["Thrust (active)"] = t_oil + 1.1 * max(max(out.values()) - t_oil, 0)
    return out


# ---------------------------------------------------------------- acceptance
def acceptance(sp: dict, pred: dict, plan: dict, oil: dict, t_des: float, ev: dict | None, options: dict, crit_max_c: float) -> list[dict]:
    lim, mcs, trip = pred["limit_um"], sp["mcs_rpm"], sp["trip_rpm"]
    s = np.asarray(pred["speeds_rpm"])
    band = (s >= sp["min_rpm"]) & (s <= mcs)
    vmax = max(max(np.asarray(pred["probes"][k]["unfiltered_um"])[band]) for k in PROBES)
    at = {k: _interp_ext(mcs, pred["speeds_rpm"], pred["probes"][k]["unfiltered_um"]) for k in PROBES}
    above = (s >= mcs) & (s <= trip)
    inc = max(max(np.asarray(pred["probes"][k]["unfiltered_um"])[above]) - at[k] for k in PROBES) if above.any() else 0.0
    runout_lim = max(6.35, 0.25 * lim)
    ns = max(q["amp_um"] for w in pred["waterfall"] for q in w["components"] if q["kind"] != "1X")
    tmax = max(max(bearing_temperature(pred, n, oil["t"]["max"], t_des).values()) for n in (sp["min_rpm"], mcs, trip))
    m = (ev or {}).get("summary") or {}
    has = bool(m)
    run_min = sum(x["t1_min"] - x["t0_min"] for x in plan["segments"] if x["phase"] == "run4h" and x["n0_rpm"] == x["n1_rpm"] == mcs)
    seqs = sorted({x["seq"] for x in plan["segments"] if x["seq"]})

    def row(check, crit, limit, p, meas, ok_fn, ref="API 617 8.3.2"):
        val = meas if meas is not None else p
        ok = ok_fn(val) if val is not None else False
        return {"check": check, "criterion": crit, "limit": limit, "predicted": p, "measured": meas,
                "status": ("pass" if ok else "fail") if meas is not None else ("review" if p is None else ("pass" if ok else "attention")), "reference": ref}
    noise = options.get("noise_dba")
    return [
        row("Shaft vibration, unfiltered, MSS-MCS", f"<= min(25.4, 25.4 sqrt(12000/MCS)) = {lim:.1f} um pk-pk", lim, vmax, m.get("max_vib_um"), lambda v: v <= lim),
        row("Increase MCS -> trip", "<= 12.7 um over the MCS value", 12.7, inc, m.get("trip_increase_um"), lambda v: v <= 12.7),
        row("Mechanical + electrical runout", f"<= max(6.35 um, 25 % of limit) = {runout_lim:.2f} um", runout_lim, pred["runout_um"],
            options.get("runout_measured_um"), lambda v: v <= runout_lim),
        row("Non-synchronous components (0.05-8 x MCS)", f"<= 20 % of limit = {0.2 * lim:.2f} um", 0.2 * lim, ns, m.get("max_nonsync_um"), lambda v: v <= 0.2 * lim),
        row("Bearing metal temperature", f"<= {crit_max_c:.0f} C", crit_max_c, tmax, m.get("max_bearing_temp_c"), lambda v: v <= crit_max_c),
        row("Axial position change", "<= 500 um", 500.0, 150.0, m.get("axial_travel_um"), lambda v: v <= 500),
        row("Noise at 1 m", "<= 85 dBA", 85.0, None, noise, lambda v: v <= 85, "Purchaser specification"),
        row("4 h run at MCS", "Duration >= 240 min at MCS", 240.0, run_min, m.get("duration_at_mcs_min") if has else None, lambda v: v >= 239.9),
        {"check": "Lube-oil sequences", "criterion": "5 x 30 min: max T/min P, max T/max P, nor/nor, min T/min P, min T/max P", "limit": 5,
         "predicted": len(seqs), "measured": len(m["sequences"]) if has and m.get("sequences") else None,
         "status": ("pass" if len(m["sequences"]) >= 5 else "fail") if has and m.get("sequences") else ("pass" if len(seqs) == 5 else "fail") if not has else "review",
         "reference": "API 617 8.3.2 / API 614"},
    ]


def evaluate_log(rows: list[dict], pred: dict, sp: dict, t_des: float, temp_lim: float) -> dict:
    lim, mcs = pred["limit_um"], sp["mcs_rpm"]
    out, near = [], []

    def tmin(v):
        if isinstance(v, str) and ":" in v:
            h, mm = v.split(":")[:2]
            return float(h) * 60 + float(mm)
        return float(v)
    for i, r in enumerate(rows):
        n = float(r.get("N1") or 0)
        t = tmin(r.get("time", i * 30))
        pv = {k: _interp_ext(n, pred["speeds_rpm"], pred["probes"][k]["unfiltered_um"]) for k in PROBES}
        v = {k: float(r[k]) for k in PROBES if r.get(k) not in (None, "")}
        tt = {k: float(r[k]) for k in TEMPS if r.get(k) not in (None, "")}
        flags = [f"{k} {x:.1f} > {lim:.1f} um" for k, x in v.items() if x > lim] + [f"{k} {x:.0f} > {temp_lim:.0f} C" for k, x in tt.items() if x > temp_lim]
        dev = {k: v[k] / pv[k] for k in v if pv[k] > 0}
        out.append({"t_min": t, "N1": n, "vib": v, "predicted": pv, "ratio_to_predicted": dev, "temps": tt, "flags": flags,
                    "status": "fail" if flags else ("attention" if any(x > 2.0 for x in dev.values()) else "pass")})
        if n >= 0.98 * mcs:
            near.append((t, r))
    allv = [x for o in out for x in o["vib"].values()]
    allt = [x for o in out for x in o["temps"].values()]
    z = [float(r[k]) for r in rows for k in ("V5-Z", "V6-Z") if r.get(k) not in (None, "")]
    at_mcs = [x for o in out if abs(o["N1"] - mcs) < 0.02 * mcs for x in o["vib"].values()]
    above = [x for o in out if o["N1"] > 1.02 * mcs for x in o["vib"].values()]
    summ = {"rows": len(rows), "max_vib_um": max(allv) if allv else None, "max_bearing_temp_c": max(allt) if allt else None,
            "axial_travel_um": (max(z) - min(z)) if z else None, "trip_increase_um": (max(above) - max(at_mcs)) if above and at_mcs else None,
            "duration_at_mcs_min": (near[-1][0] - near[0][0]) if len(near) > 1 else 0.0,
            "sequences": sorted({str(r.get("seq")) for _, r in near if r.get("seq") not in (None, "", "nor", "0")}),
            "max_nonsync_um": None}
    return {"rows": out, "summary": summ, "status": "fail" if any(o["status"] == "fail" for o in out) else ("pass" if out else "review")}


def evaluate_coastdown(points: list[dict], pred: dict) -> dict:
    by = {}
    for p in points:
        by.setdefault(p.get("probe", "V1-X"), []).append(p)
    out = {}
    pc = pred["critical_speeds"][0]["speed_rpm"] if pred["critical_speeds"] else None
    for k, pts in by.items():
        pts = sorted(pts, key=lambda q: q["speed_rpm"])
        pk = max(pts, key=lambda q: q["amp_um"])
        dev = (pk["speed_rpm"] / pc - 1) * 100 if pc else None
        out[k] = {"points": pts, "measured_critical_rpm": pk["speed_rpm"], "peak_um": pk["amp_um"], "predicted_critical_rpm": pc, "deviation_pct": dev,
                  "status": "pass" if dev is not None and abs(dev) <= 5 else ("review" if dev is None else "fail")}
    return out


# ---------------------------------------------------------------- URT
def urt(cas: dict, sp: dict, ctx, pred: dict, options: dict, measured: dict | None) -> dict:
    model, structural, basis, brg = ctx
    mcs, mss = sp["mcs_rpm"], sp["min_rpm"]
    rot = cas["rotor"]
    cpl = next((m for m in rot.get("masses", []) if m.get("kind") == "coupling"), {"z": 0.0, "mass_kg": 20.0})
    loads = model.static_bearing_loads()
    w1 = abs(loads[brg[0].label]) / G0                                     # coupling-end journal static load, kg
    ur = 6350 * w1 / mcs                                                   # g mm
    radius = float(options.get("urt_radius_mm") or max(60.0, 1.4 * rot.get("coupling_diameter_m", 0.08) * 1e3))
    mult = float(options.get("urt_multiple") or 4.0)
    ut = mult * ur
    ub = [{"z": cpl.get("z", cpl.get("z_m", 0.0)), "me": ut * 1e-6, "phase_deg": 0.0}]
    speeds = pred["speeds_rpm"]
    r = _resp(model, structural, basis, brg, speeds, ub)
    pk = [p for p in fe.find_peaks_af(speeds, r["V1"]) if p["amplitude_um"] > 0.1 * max(r["V1"])]
    crit = pk[0]["speed_rpm"] if pk else (pred["critical_speeds"][0]["speed_rpm"] if pred["critical_speeds"] else mss)
    n_test = min(max(crit, mss), mcs)
    rng = {}
    for k in PROBES:
        for lab, n in (("test", n_test), ("mcs", mcs)):
            tv = _interp_ext(n, speeds, r[k]["amp_um"])
            rv = _interp_ext(n, speeds, pred["probes"][k]["amp_1x_um"])
            rng.setdefault(k, {})[lab] = [max(tv - rv, 0.0), tv, tv + rv]
    checks = [{"check": "Trial unbalance 2-8 x Ur", "value": mult, "status": "pass" if 2 <= mult <= 8 else "fail"}]
    meas = measured or {}
    if meas.get("critical_rpm"):
        d = (float(meas["critical_rpm"]) / crit - 1) * 100
        checks.append({"check": "Measured critical within +-5 % of predicted", "value": d, "status": "pass" if abs(d) <= 5 else "fail"})
    for k, v in (meas.get("amplitudes_um") or {}).items():
        if k in rng and v not in (None, ""):
            lo, _, hi = rng[k]["mcs"]
            checks.append({"check": f"{k} at MCS within predicted range {lo:.1f}-{hi:.1f} um", "value": float(v), "status": "pass" if lo <= float(v) <= hi else "fail"})
    done = len(checks) > 1
    ok = all(c["status"] == "pass" for c in checks)
    return {"ur_g_mm": ur, "journal_load_kg": w1, "coupling_half_mass_kg": cpl.get("mass_kg"), "coupling_z_m": ub[0]["z"], "radius_mm": radius,
            "multiple": mult, "trial_g_mm": ut, "trial_mass_g": ut / radius, "range_mass_g": [2 * ur / radius, 8 * ur / radius],
            "range_g_mm": [2 * ur, 8 * ur], "predicted_critical_rpm": crit, "test_speed_rpm": n_test,
            "response": {k: r[k] for k in PROBES}, "speeds_rpm": speeds, "predicted_range_um": rng, "checks": checks,
            "status": ("pass" if ok else "fail") if done else "review", "nameplate": "test" if done and ok else "calc"}


# ---------------------------------------------------------------- gas leak test and inspection
def leak_test(project, leak: dict | None) -> dict:
    lk = leak or {}
    p_def = max(c.discharge_pressure_bara for c in project.cases) - 1.013
    p = float(lk.get("test_pressure_barg") or p_def)
    ref = float(lk.get("dgs_primary_ref_nm3h") or 4.5)
    hold = float(lk.get("hold_min") or 30)
    rows = lk.get("readings") or [{"t_min": t, "pressure_barg": None, "dgs_de_nm3h": None, "dgs_nde_nm3h": None, "joint_leak": False} for t in range(0, int(hold) + 1, 15)]
    filled = [r for r in rows if r.get("pressure_barg") not in (None, "")]
    span = (max(float(r["t_min"]) for r in filled) - min(float(r["t_min"]) for r in filled)) if len(filled) > 1 else 0
    ts = sorted(float(r["t_min"]) for r in filled)
    gaps = max((b - a for a, b in zip(ts, ts[1:])), default=0)
    dgs = [float(r[k]) for r in filled for k in ("dgs_de_nm3h", "dgs_nde_nm3h") if r.get(k) not in (None, "")]
    drop = (float(filled[0]["pressure_barg"]) - min(float(r["pressure_barg"]) for r in filled)) / p * 100 if filled else None
    checks = [{"check": f"Hold >= {hold:.0f} min at test pressure", "value": span, "status": _st(span >= hold, bool(filled))},
              {"check": "Readings at <= 15 min intervals", "value": gaps, "status": _st(gaps <= 15.01, len(filled) > 1)},
              {"check": "Test pressure maintained (drop <= 1 %)", "value": drop, "status": _st(drop is not None and drop <= 1.0, bool(filled))},
              {"check": "No leakage at casing joints / connections (soap or helium sniffer)", "value": any(r.get("joint_leak") for r in filled),
               "status": _st(not any(r.get("joint_leak") for r in filled), bool(filled))},
              {"check": f"DGS primary leakage <= {ref:.1f} Nm3/h (reference)", "value": max(dgs) if dgs else None, "status": _st(bool(dgs) and max(dgs) <= ref, bool(dgs))}]
    st = "review" if not filled else ("fail" if any(c["status"] == "fail" for c in checks[:4]) else "pass")
    return {"gas": lk.get("gas", "Helium"), "test_pressure_barg": p, "default_pressure_barg": p_def, "hold_min": hold, "dgs_primary_ref_nm3h": ref,
            "readings": rows, "checks": checks, "status": st,
            "procedure": ["Assembled compressor after the MRT, contract seals installed, at rest", "Pressurise with helium to the maximum sealing pressure",
                          "Hold >= 30 min; record pressure and DGS primary vent flows every 15 min",
                          "Check casing joints, nozzles and connections with a helium sniffer / soap solution",
                          "Pass: no casing-joint leakage; DGS primary leakage within the seal vendor's reference"]}


INSPECTION = [
    ("bearings", "Journal and thrust bearings removed and inspected (babbitt, pad contact, wiping)"),
    ("journals", "Journals and thrust collar inspected for scoring"),
    ("seals", "Dry gas seals inspected (or left assembled if the seal vendor requires; record)"),
    ("labyrinths", "Labyrinth / oil seals inspected for rubs"),
    ("coupling", "Coupling and guard inspected; idling adaptor removed"),
    ("oil", "Oil filters inspected for debris; oil sample taken"),
    ("reassembly", "Bearings re-installed with recorded clearances; covers closed"),
]
RETEST = ["Bearings or seals replaced or reworked after the test require a retest (API 617 8.3.2)",
          "Rotor rebalanced or dismantled: repeat the MRT", "Wiped bearings: find and correct the cause, then retest",
          "Minor dressing of babbitt within vendor limits: purchaser agrees whether a retest is needed"]


# ---------------------------------------------------------------- main
def mrt_analysis(project, res: dict, casing: int = 0, log: list[dict] | None = None, coastdown: list[dict] | None = None,
                 urt_measured: dict | None = None, leak: dict | None = None, options: dict | None = None) -> dict:
    o = options or {}
    cas = res["casings"][casing]
    sp = dict(cas["lateral"]["speeds"])
    t_des = project.bearings.oil_supply_temperature_c
    pn = float(res.get("lube", {}).get("supply_pressure_barg") or project.lube.supply_pressure_barg)
    oil = {"t": {"min": t_des - 5, "nor": t_des, "max": t_des + 5, **(o.get("oil_t") or {})},
           "p": {"min": 0.8 * pn, "nor": pn, "max": 1.2 * pn, **(o.get("oil_p") or {})}}
    ctx = _ctx(cas, sp)
    pred = predicted_response(project, cas, sp, ctx, o)
    crit = [c["speed_rpm"] for c in pred["critical_speeds"] if not (c["af"] < 2.5)] or [c["speed_rpm"] for c in pred["critical_speeds"][:1]]
    plan = speed_profile(sp, crit, oil, o)
    temp_lim = float(o.get("bearing_temp_limit_c") or 105.0)
    # Prediction along the profile (every 1 min) for the animation and the report.
    idx = list(range(0, len(plan["t_min"]), 4))
    along = {"t_min": [plan["t_min"][i] for i in idx], "speed_rpm": [plan["speed_rpm"][i] for i in idx]}
    for k in PROBES:
        along[k] = [round(_interp_ext(plan["speed_rpm"][i], pred["speeds_rpm"], pred["probes"][k]["unfiltered_um"]), 2) for i in idx]
    bt = [bearing_temperature(pred, plan["speed_rpm"][i], plan["oil_t_c"][i], t_des) for i in idx]
    for k in bt[0]:
        along[k] = [round(b[k], 1) for b in bt]
    ev = evaluate_log(log, pred, sp, t_des, temp_lim) if log else None
    out = {"speeds": sp, "limit_um": pred["limit_um"], "runout_limit_um": max(6.35, 0.25 * pred["limit_um"]),
           "train": test_train(project, res, sp, o), "oil": oil, "plan": plan, "prediction": pred, "along": along,
           "bearing_temp_limit_c": temp_lim, "log": ev, "coastdown": evaluate_coastdown(coastdown, pred) if coastdown else None,
           "urt": urt(cas, sp, ctx, pred, o, urt_measured), "leak": leak_test(project, leak),
           "inspection": [{"key": k, "item": t, "done": bool((o.get("inspection") or {}).get(k))} for k, t in INSPECTION], "retest_rules": RETEST}
    out["acceptance"] = acceptance(sp, pred, plan, oil, t_des, ev, o, temp_lim)
    sts = [a["status"] for a in out["acceptance"]]
    out["status"] = "fail" if "fail" in sts else ("pass" if ev and all(s == "pass" for s in sts if s != "review") else "review")
    out["procedure"] = [
        "Install the test train: driver, couplings (contract HS coupling or idling adaptor), compressor on the test bed; connect the lube console and seal gas.",
        "Check instrumentation: X/Y shaft probes at each journal (V1, V2), axial probes (V5, V6), bearing RTDs TA1-TA12, oil drain and supply T / P.",
        f"Warm up at about {plan['warmup_rpm']:.0f} rpm until oil and metal temperatures are stable.",
        f"Accelerate quickly through the 1st critical ({crit[0]:.0f} rpm) to MSS {sp['min_rpm']:.0f} rpm." if crit else f"Accelerate to MSS {sp['min_rpm']:.0f} rpm.",
        "Increase in about 10 % steps, holding each step until readings are stable; record Bode / polar data on the way.",
        f"Run at trip speed {sp['trip_rpm']:.0f} rpm for at least 15 min until stable; then drop to MSS for the runout / repeatability check.",
        f"Run at MCS {sp['mcs_rpm']:.0f} rpm for 4 h, with the five 30 min lube-oil sequences; log readings every 30 min.",
        "Coast down recording Bode / polar plots; then the URT (trial unbalance at the coupling) if specified.",
        "After the test: assembled gas leak test with helium, then remove and inspect bearings and seals.",
    ]
    return out


# ---------------------------------------------------------------- PDF report
TAG = {"V1-X": "1R1X", "V1-Y": "1R1Y", "V2-X": "1R2X", "V2-Y": "1R2Y"}
PCOL = {"V1-X": "#0b5cad", "V1-Y": "#7b3fb5", "V2-X": "#2e9e6b", "V2-Y": "#d1782a"}


def style(ax, xl="", yl="", title=None):
    ax.grid(True, color="#e3e7ea", lw=0.6)
    for k in ("top", "right"):
        ax.spines[k].set_visible(False)
    for k in ("left", "bottom"):
        ax.spines[k].set_color("#9aa3ab")
    ax.tick_params(labelsize=6.5, colors="#3b4652")
    ax.set_xlabel(xl, fontsize=7, color="#3b4652")
    ax.set_ylabel(yl, fontsize=7, color="#3b4652")
    if title:
        ax.set_title(title, fontsize=8, loc="left", color="#0c1a2b", weight="bold")


def mrt_report(project, out: dict) -> bytes:
    """A4 PDF in the shop MRT-chart layout: setup (2.5D drawing), procedure, plan, trend, Bode, polar,
    spectra per speed, waterfall, spectrogram, acceptance, URT, logs, leak test and inspection."""
    import io

    from matplotlib.backends.backend_pdf import PdfPages

    from compsuite.testing.drawings import Doc, train

    f = lambda v, n=1: "-" if v is None else (f"{v:.{n}f}" if isinstance(v, (int, float)) else str(v))  # noqa: E731
    sp, pred, plan, u, al = out["speeds"], out["prediction"], out["plan"], out["urt"], out["along"]
    lim, s = out["limit_um"], pred["speeds_rpm"]
    tr = out["train"]
    buf = io.BytesIO()
    with PdfPages(buf) as pdf:
        d = Doc(pdf, f"{project.name} - mechanical running test (API 617 9th ed. 8.3.2 / 8.3.3)")
        d.page("MRT test set-up")
        train(d.drawing([0.05, 0.62, 0.9, 0.29]), tr["components"])
        d.y = 0.6
        kw = next((c["name"] for c in tr["components"] if c["kind"] in ("motor", "turbine")), "-")
        d.table(["Set-up", "Value", "", ""], [
            ("Test driver", kw, "Gear ratio", f"{tr['gear_ratio']:.3f}" if tr["geared"] else "direct drive"),
            ("Rotation", "clockwise from drive end", "Seal gas", "N2 (shop)"),
            ("Oil", f"{project.bearings.oil_grade}, {out['oil']['t']['nor']:.0f} C", "Oil filtration", "10 um"),
            ("Probes", "1R1X/Y drive end, 1R2X/Y non-drive end", "Limit", f"{lim:.1f} um pk-pk"),
            ("MSS / rated", f"{sp['min_rpm']:.0f} / {sp['rated_rpm']:.0f} rpm", "MCS / trip", f"{sp['mcs_rpm']:.0f} / {sp['trip_rpm']:.0f} rpm")],
            [0.07, 0.22, 0.52, 0.66])
        d.line("Equipment (shop / contract)", 10, bold=True)
        d.table(["Item", "Source", "Note"], [(c["name"], c["source"], c["note"]) for c in tr["components"]], [0.07, 0.42, 0.52])
        d.line(f"Overall status {out['status'].upper()}", 9, bold=True)

        d.page("Procedure and speed-time plan")
        for i, t in enumerate(out["procedure"]):
            d.line(f"{i + 1}. {t}", 8)
        ax = d.fig.add_axes([0.1, 0.36, 0.83, 0.25])
        th = [t / 60 for t in plan["t_min"]]
        ax.fill_between(th, plan["speed_rpm"], color="#0b5cad", alpha=0.08)
        ax.plot(th, plan["speed_rpm"], color="#0b5cad", lw=1.4)
        for c in pred["critical_speeds"][:2]:
            ax.axhline(c["speed_rpm"], color="#c0392b", lw=0.8, ls="--")
            ax.text(th[-1], c["speed_rpm"], f" Nc {c['speed_rpm']:.0f}", fontsize=6, color="#c0392b", va="bottom", ha="right")
        for k, n in (("MCS", sp["mcs_rpm"]), ("Trip", sp["trip_rpm"])):
            ax.axhline(n, color="#5b6878", lw=0.6, ls=":")
            ax.text(0, n, f"{k} ", fontsize=6, color="#5b6878", ha="right", va="center")
        style(ax, "Time (h)", "Speed (rpm)", "Speed-time plan")
        ax2 = d.fig.add_axes([0.1, 0.12, 0.83, 0.17])
        ax2.plot(th, plan["oil_t_c"], color="#d1782a", lw=1.2, label="Oil supply T (C)")
        ax3 = ax2.twinx()
        ax3.plot(th, plan["oil_p_barg"], color="#2e9e6b", lw=1.2, label="Oil supply P (barg)")
        style(ax2, "Time (h)", "Oil T (C)", "Lube-oil sequences (4 h run)")
        ax3.tick_params(labelsize=6.5)
        ax3.set_ylabel("Oil P (barg)", fontsize=7)

        d.page("Trend chart (amplitude and speed)")
        ax = d.fig.add_axes([0.1, 0.55, 0.8, 0.34])
        ta = [t / 60 for t in al["t_min"]]
        for k in PROBES:
            ax.plot(ta, al[k], color=PCOL[k], lw=1.0, label=TAG[k])
        ax.axhline(lim, color="#c0392b", lw=0.8, ls="--", label="API limit")
        style(ax, "Time (h)", "Amplitude (um pk-pk)", "Shaft vibration and speed")
        ax.legend(fontsize=6, ncol=5, frameon=False, loc="upper left")
        axs = ax.twinx()
        axs.plot(ta, al["speed_rpm"], color="#8e9aa5", lw=0.9, ls="-", alpha=0.8)
        axs.set_ylabel("Speed (rpm)", fontsize=7)
        axs.tick_params(labelsize=6.5)
        d.y = 0.5
        d.table(["Channel", "Abbreviation", "Max um", "Min um", "At MCS um"],
                [({"V1-X": "X vibration compressor drive end", "V1-Y": "Y vibration compressor drive end", "V2-X": "X vibration compressor non-drive end",
                   "V2-Y": "Y vibration compressor non-drive end"}[k], TAG[k], f(max(al[k]), 2), f(min(al[k]), 2),
                  f(_interp_ext(sp["mcs_rpm"], s, pred["probes"][k]["unfiltered_um"]), 2)) for k in PROBES], [0.07, 0.42, 0.56, 0.68, 0.8])
        bt = [k for k in al if k.startswith("Bearing")]
        if bt:
            ax = d.fig.add_axes([0.1, 0.1, 0.8, 0.22])
            for i, k in enumerate(bt):
                ax.plot(ta, al[k], lw=1.1, label=k, color=["#0b5cad", "#2e9e6b", "#d1782a", "#7b3fb5"][i % 4])
            ax.axhline(out["bearing_temp_limit_c"], color="#c0392b", lw=0.8, ls="--")
            style(ax, "Time (h)", "Metal temperature (C)", "Bearing metal temperature")
            ax.legend(fontsize=6, frameon=False, ncol=4)

        for pair in (("V1-X", "V1-Y"), ("V2-X", "V2-Y")):
            d.page(f"Bode plots - {TAG[pair[0]]} / {TAG[pair[1]]} (coast-down, 1X)")
            for j, k in enumerate(pair):
                y0 = 0.53 - j * 0.45
                a1 = d.fig.add_axes([0.1, y0 + 0.17, 0.83, 0.2])
                a1.plot(s, pred["probes"][k]["amp_1x_um"], color=PCOL[k], lw=1.3)
                a1.fill_between(s, pred["probes"][k]["amp_1x_um"], color=PCOL[k], alpha=0.08)
                for c in pred["critical_speeds"][:2]:
                    a1.axvline(c["speed_rpm"], color="#c0392b", lw=0.6, ls=":")
                style(a1, "", "Amplitude (um pk-pk)", f"{TAG[k]}: {'X' if k.endswith('X') else 'Y'}-direction vibration of compressor {'drive' if k.startswith('V1') else 'non-drive'} end")
                a2 = d.fig.add_axes([0.1, y0, 0.83, 0.15])
                ph = np.degrees(np.unwrap(np.radians(pred["probes"][k]["phase_deg"])))
                a2.plot(s, ph - 360 * math.floor(min(ph) / 360), color=PCOL[k], lw=1.1)
                style(a2, "Speed (rpm)", "Phase (deg)")

        for title, rev in (("Speed-up polar plots (1X)", False), ("Coast-down polar plots (1X)", True)):
            d.page(title)
            for j, k in enumerate(PROBES):
                ax = d.fig.add_axes([0.08 + (j % 2) * 0.46, 0.5 - (j // 2) * 0.42, 0.38, 0.36], projection="polar")
                ph = [math.radians(p + (8 if rev else 0)) for p in pred["probes"][k]["phase_deg"]]
                am = pred["probes"][k]["amp_1x_um"]
                ax.plot(ph, am, color=PCOL[k], lw=1.1)
                for c in pred["critical_speeds"][:1]:
                    i = int(np.argmin([abs(x - c["speed_rpm"]) for x in s]))
                    ax.plot([ph[i]], [am[i]], "o", color="#c0392b", ms=3)
                    ax.annotate(f"{c['speed_rpm']:.0f} rpm", (ph[i], am[i]), fontsize=5.5, color="#c0392b")
                ax.set_theta_zero_location("N")
                ax.set_theta_direction(-1)
                ax.tick_params(labelsize=5.5)
                ax.set_title(f"{TAG[k]}", fontsize=8, weight="bold", pad=10)

        wf = pred["waterfall"]
        mcs = sp["mcs_rpm"]
        for g in range(0, len(wf), 2):
            d.page("Spectra at test speeds (predicted, per probe)")
            for jj, w in enumerate(wf[g:g + 2]):
                d.fig.text(0.07, 0.9 - jj * 0.44, f"{w['label']} - {w['speed_rpm']:.0f} rpm", fontsize=9, weight="bold", color="#0b5cad")
                a_ref = max(_interp_ext(w["speed_rpm"], s, pred["probes"][k]["amp_1x_um"]) for k in PROBES) or 1
                for j, k in enumerate(PROBES):
                    ax = d.fig.add_axes([0.09 + (j % 2) * 0.46, 0.7 - jj * 0.44 - (j // 2) * 0.19, 0.38, 0.14])
                    sc = _interp_ext(w["speed_rpm"], s, pred["probes"][k]["amp_1x_um"]) / a_ref
                    for q in w["components"]:
                        ax.bar(q["freq_hz"], q["amp_um"] * (sc if q["kind"] == "1X" else 1), width=mcs / 60 * 0.06,
                               color=PCOL[k] if q["kind"] == "1X" else "#8e9aa5")
                    ax.set_xlim(0, 4 * mcs / 60)
                    style(ax, "Frequency (Hz)" if j // 2 else "", "um pk-pk", TAG[k])
                    ax.title.set_fontsize(7)

        d.page("Waterfall and spectrogram (coast-down, 1R1X)")
        ax = d.fig.add_axes([0.1, 0.5, 0.82, 0.4])
        sweep = np.linspace(sp["min_rpm"] * 0.3, sp["trip_rpm"], 26)
        fmax = 4 * mcs / 60
        for i, n in enumerate(sweep[::-1]):
            a1 = _interp_ext(n, s, pred["probes"]["V1-X"]["amp_1x_um"])
            fr_ = np.linspace(0, fmax, 400)
            sig = np.zeros_like(fr_)
            for order, amp in ((1, a1), (2, 0.06 * a1 + 0.25), (3, 0.1 + 0.02 * a1), (0.43, 0.25)):
                sig += amp * np.exp(-0.5 * ((fr_ - order * n / 60) / (fmax / 250)) ** 2)
            off = i * 0.022 * fmax
            ax.fill_between(fr_ + off, i * 0.6, sig + i * 0.6, color="white", zorder=i)
            ax.plot(fr_ + off, sig + i * 0.6, color="#0b5cad", lw=0.6, zorder=i + 0.5)
        style(ax, "Frequency (Hz) - offset by speed", "Amplitude (um) + speed step", "Waterfall (cascade)")
        ax.set_yticks([])
        ax = d.fig.add_axes([0.1, 0.08, 0.82, 0.33])
        nn = np.linspace(200, sp["trip_rpm"], 120)
        fr_ = np.linspace(0, fmax, 160)
        Z = np.zeros((len(fr_), len(nn)))
        for j, n in enumerate(nn):
            a1 = _interp_ext(n, s, pred["probes"]["V1-X"]["amp_1x_um"])
            for order, amp in ((1, a1), (2, 0.06 * a1 + 0.25), (3, 0.1 + 0.02 * a1), (0.43, 0.25)):
                Z[:, j] += amp * np.exp(-0.5 * ((fr_ - order * n / 60) / (fmax / 120)) ** 2)
        im = ax.pcolormesh(nn, fr_, Z, cmap="viridis", shading="auto")
        d.fig.colorbar(im, ax=ax, fraction=0.03).ax.tick_params(labelsize=6)
        style(ax, "Speed (rpm)", "Frequency (Hz)", "Spectrogram")
        ax.grid(False)

        d.page("Acceptance criteria")
        d.table(["Check", "Criterion", "Predicted", "Measured", "Status"],
                [(a["check"][:40], a["criterion"][:44], f(a["predicted"]), f(a["measured"]), a["status"]) for a in out["acceptance"]], [0.07, 0.36, 0.68, 0.78, 0.88])
        d.line("Unbalanced rotor response test (URT)", 10, bold=True)
        for k, v in [("Ur (coupling-end journal)", f"{u['ur_g_mm']:.1f} g mm ({u['journal_load_kg']:.0f} kg journal load)"),
                     ("Coupling half mass", f"{f(u['coupling_half_mass_kg'])} kg; trial radius {u['radius_mm']:.0f} mm"),
                     ("Trial unbalance", f"{u['multiple']:.1f} x Ur = {u['trial_g_mm']:.0f} g mm = {u['trial_mass_g']:.2f} g (range {u['range_mass_g'][0]:.2f}-{u['range_mass_g'][1]:.2f} g)"),
                     ("Predicted critical / test speed", f"{u['predicted_critical_rpm']:.0f} rpm / {u['test_speed_rpm']:.0f} rpm"),
                     ("Status / nameplate critical speed", f"{u['status']} / '{u['nameplate']}'")]:
            d.line(f"{k}: {v}", 8)
        d.table(["Probe", "Range at test speed um", "Range at MCS um"],
                [(TAG.get(k, k), "{:.1f}-{:.1f}".format(r["test"][0], r["test"][2]), "{:.1f}-{:.1f}".format(r["mcs"][0], r["mcs"][2])) for k, r in u["predicted_range_um"].items()], [0.07, 0.3, 0.55])
        d.table(["URT check", "Value", "Status"], [(c["check"], f(c["value"], 2), c["status"]) for c in u["checks"]], [0.07, 0.62, 0.8])

        d.page("Test log, gas leak test and inspection")
        lg = out.get("log")
        if lg:
            d.table(["t min", "N1 rpm", *[TAG[k] for k in PROBES], "max TA C", "Status"],
                    [(f(r["t_min"], 0), f(r["N1"], 0), *[f(r["vib"].get(k)) for k in PROBES], f(max(r["temps"].values()) if r["temps"] else None), r["status"])
                     for r in lg["rows"]], [0.07, 0.15, 0.25, 0.35, 0.45, 0.55, 0.66, 0.78])
        else:
            d.line("No test log entered.", 8, "#5b6878")
        if out.get("coastdown"):
            d.table(["Coast-down probe", "Measured critical rpm", "Predicted rpm", "Deviation %", "Status"],
                    [(TAG.get(k, k), f(v["measured_critical_rpm"], 0), f(v["predicted_critical_rpm"], 0), f(v["deviation_pct"]), v["status"]) for k, v in out["coastdown"].items()],
                    [0.07, 0.27, 0.47, 0.65, 0.8])
        lk = out["leak"]
        d.line(f"Assembled gas leak test: {lk['gas']} at {lk['test_pressure_barg']:.1f} barg, hold {lk['hold_min']:.0f} min - {lk['status']}", 10, bold=True)
        d.table(["Check", "Value", "Status"], [(c["check"], f(c["value"], 2), c["status"]) for c in lk["checks"]], [0.07, 0.62, 0.8])
        d.line("Post-test inspection", 10, bold=True)
        for it in out["inspection"]:
            d.line(f"[{'x' if it['done'] else ' '}] {it['item']}", 8)
        d.y -= 0.005
        for r in out["retest_rules"]:
            d.line(f"- {r}", 8, "#5b6878")
        d.close()
    return buf.getvalue()
