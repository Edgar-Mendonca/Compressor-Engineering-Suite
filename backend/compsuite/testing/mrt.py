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
from compsuite.rotordynamics.lateral import required_separation
from compsuite.testing.tags import GLOSSARY, tag_names, tag_table

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
        out[f"V{i + 1}-Y"] = {"amp_um": [2 * a for a in d["y_amp_um"]], "phase_deg": [p % 360 for p in d.get("y_phase_deg") or [q - 90 for q in d["x_phase_deg"]]]}
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
    slow = float(options.get("slow_roll_rpm") or min(500.0, 0.1 * sp["min_rpm"]) or 400.0)
    probes = {}
    for j, k in enumerate(PROBES):
        a1 = r[k]["amp_um"]
        # Slow-roll (runout) vector: mechanical + electrical runout, fixed in the rotor frame, so it adds to the
        # 1X vector at every speed; compensation subtracts the vector read at slow roll.
        rv = 0.8 * runout * np.exp(1j * math.radians(40 + 75 * j))
        unc = [a * np.exp(-1j * math.radians(ph)) + rv for a, ph in zip(a1, r[k]["phase_deg"])]
        probes[k] = {"amp_1x_um": a1, "phase_deg": r[k]["phase_deg"],
                     "uncomp_1x_um": [float(abs(v)) for v in unc], "uncomp_phase_deg": [float(-math.degrees(np.angle(v)) % 360) for v in unc],
                     "slow_roll": {"rpm": slow, "amp_um": float(abs(rv)), "phase_deg": float(-math.degrees(np.angle(rv)) % 360)},
                     "unfiltered_um": [math.sqrt(a * a + runout**2 + (0.04 * a + 0.3) ** 2) for a in a1]}
    # Critical speeds: peaks of the major-axis response at either bearing.
    crit = []
    for i in range(len(brg)):
        for pk in fe.find_peaks_af(speeds, r[f"V{i + 1}"]):
            if pk["amplitude_um"] > 0.1 * max(r[f"V{i + 1}"]) and all(abs(pk["speed_rpm"] - c["speed_rpm"]) > 0.05 * c["speed_rpm"] for c in crit):
                crit.append({"speed_rpm": pk["speed_rpm"], "af": pk["af"], "probe": f"V{i + 1}"})
    crit.sort(key=lambda c: c["speed_rpm"])
    for c in crit:   # API 617 separation margin from the operating speed range
        below = c["speed_rpm"] < sp["min_rpm"]
        act = (sp["min_rpm"] - c["speed_rpm"]) / sp["min_rpm"] * 100 if below else (c["speed_rpm"] - mcs) / mcs * 100
        req = required_separation(c["af"], below) if c["speed_rpm"] < sp["min_rpm"] or c["speed_rpm"] > mcs else (None if c["af"] < 2.5 else 99.0)
        ok = req is None or act >= req
        c.update({"sm_actual_pct": act, "sm_required_pct": req, "sm_status": "pass" if ok else ("fail" if math.isfinite(c["af"]) else "review"),
                  "position": "below MSS" if below else ("above MCS" if c["speed_rpm"] > mcs else "inside the speed range")})
    # Orbits (1X, filtered) at MCS and trip from the X / Y amplitudes and phases.
    orbits = {}
    for b in ("V1", "V2"):
        for lab, n in (("MCS", mcs), ("Trip", trip)):
            ax_, ay_ = _interp_ext(n, speeds, r[f"{b}-X"]["amp_um"]) / 2, _interp_ext(n, speeds, r[f"{b}-Y"]["amp_um"]) / 2
            px_, py_ = math.radians(float(np.interp(n, speeds, r[f"{b}-X"]["phase_deg"]))), math.radians(float(np.interp(n, speeds, r[f"{b}-Y"]["phase_deg"])))
            th = np.linspace(0, 2 * math.pi, 73)
            orbits[f"{b} {lab}"] = {"speed_rpm": n, "x_um": (ax_ * np.cos(th - px_)).round(3).tolist(), "y_um": (ay_ * np.cos(th - py_)).round(3).tolist(),
                                    "major_um": 2 * max(math.hypot(x, y) for x, y in zip(ax_ * np.cos(th - px_), ay_ * np.cos(th - py_)))}
    # Shaft centreline from the bearing tables (journal static position vs speed).
    tables = cas["bearings"]["bearings"]
    cl, btemp, oilb = {}, {}, {}
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
        j = int(np.argmin([abs(x - mcs) for x in tb["speeds_rpm"]]))
        q, loss = rows[j].get("oil_flow_l_min") or 0.0, rows[j].get("power_loss_kw") or 0.0
        oilb[f"Bearing {i + 1}"] = {"speed_rpm": tb["speeds_rpm"][j], "load_kn": rows[j].get("load_n", 0) / 1e3, "unit_load_mpa": rows[j].get("unit_load_mpa"),
                                    "power_loss_kw": loss, "oil_flow_l_min": q, "temp_rise_k": loss * 1e3 / (860 * 2000 * q / 60000) if q else None,
                                    "metal_c": rows[j]["babbitt_temperature_est_c"], "eccentricity": rows[j]["eccentricity"], "h_min_um": rows[j].get("h_min_m", 0) * 1e6}
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
            "centreline": cl, "bearing_temp_table": btemp, "waterfall": wf, "limit_um": lim, "orbits": orbits, "bearing_oil": oilb,
            "subsync": [{"label": w["label"], "speed_rpm": w["speed_rpm"], "max_nonsync_um": max([q["amp_um"] for q in w["components"] if q["kind"] != "1X"] or [0]),
                         "limit_um": 0.2 * lim} for w in wf],
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
    rise = [v["temp_rise_k"] for v in pred.get("bearing_oil", {}).values() if v.get("temp_rise_k") is not None]
    sg_ref = float(options.get("dgs_primary_ref_nm3h") or 4.5)
    trip_set = float(options.get("trip_setpoint_rpm") or trip)
    trip_m = options.get("trip_measured_rpm")
    sm_bad = [c for c in pred["critical_speeds"] if c.get("sm_status") == "fail"]
    sm_rev = [c for c in pred["critical_speeds"] if c.get("sm_status") == "review"]
    extra = [
        row("Oil temperature rise across the bearings", "<= 28 K (API 614 / 617 typical)", 28.0, max(rise) if rise else None, m.get("max_oil_rise_k"), lambda v: v <= 28),
        row("Dry gas seal primary vent flow", f"<= {sg_ref:.1f} Nm3/h (seal vendor reference)", sg_ref, None, m.get("max_seal_vent_nm3h"), lambda v: v <= sg_ref, "Seal vendor / API 692"),
        row("Overspeed trip test", f"trip at the set point {trip_set:.0f} rpm +- 1 %", trip_set, None, trip_m, lambda v: abs(float(v) / trip_set - 1) <= 0.01, "API 617 / API 670"),
        {"check": "Critical-speed separation margin", "criterion": "API 617: SM >= required for AF >= 2.5", "limit": None,
         "predicted": len(pred["critical_speeds"]) - len(sm_bad), "measured": None, "status": "fail" if sm_bad else ("review" if sm_rev else "pass"), "reference": "API 617 4.6.2"},
    ]
    return extra[3:] + [
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
    ] + extra[:3]


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
        out.append({"t_min": t, "N1": n, "vib": v, "predicted": pv, "ratio_to_predicted": dev, "temps": tt, "flags": flags, "raw": r,
                    "status": "fail" if flags else ("attention" if any(x > 2.0 for x in dev.values()) else "pass")})
        if n >= 0.98 * mcs:
            near.append((t, r))
    allv = [x for o in out for x in o["vib"].values()]
    allt = [x for o in out for x in o["temps"].values()]
    z = [float(r[k]) for r in rows for k in ("V5-Z", "V6-Z") if r.get(k) not in (None, "")]
    rise = [float(r[k]) - float(r["T_oil"]) for r in rows for k in ("TD1", "TD2") if r.get(k) not in (None, "") and r.get("T_oil") not in (None, "")]
    sg = [float(r[k]) for r in rows for k in ("SG_DE", "SG_NDE") if r.get(k) not in (None, "")]
    at_mcs = [x for o in out if abs(o["N1"] - mcs) < 0.02 * mcs for x in o["vib"].values()]
    above = [x for o in out if o["N1"] > 1.02 * mcs for x in o["vib"].values()]
    summ = {"rows": len(rows), "max_vib_um": max(allv) if allv else None, "max_bearing_temp_c": max(allt) if allt else None,
            "axial_travel_um": (max(z) - min(z)) if z else None, "trip_increase_um": (max(above) - max(at_mcs)) if above and at_mcs else None,
            "duration_at_mcs_min": (near[-1][0] - near[0][0]) if len(near) > 1 else 0.0,
            "sequences": sorted({str(r.get("seq")) for _, r in near if r.get("seq") not in (None, "", "nor", "0")}),
            "max_nonsync_um": None, "max_oil_rise_k": max(rise) if rise else None, "max_seal_vent_nm3h": max(sg) if sg else None}
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


MRT_INSTRUMENTS = [
    ("V1-X", "Proximity probe 8 mm + proximitor (API 670)", "0-500 um", "+-5 % (7.87 mV/um)"),
    ("V1-Y", "Proximity probe 8 mm + proximitor (API 670)", "0-500 um", "+-5 %"),
    ("V2-X", "Proximity probe 8 mm + proximitor (API 670)", "0-500 um", "+-5 %"),
    ("V2-Y", "Proximity probe 8 mm + proximitor (API 670)", "0-500 um", "+-5 %"),
    ("V5-Z", "Axial proximity probe (API 670)", "+-1 mm", "+-5 %"),
    ("V6-Z", "Axial proximity probe (API 670)", "+-1 mm", "+-5 %"),
    ("KPH", "Keyphasor probe", "once per turn", "-"),
    ("N1", "Speed pickup / keyphasor channel", "0-trip x 1.2", "0.1 %"),
    ("Bearing 1", "RTD Pt100 3-wire in pads", "0-150 C", "+-1 C"),
    ("Bearing 2", "RTD Pt100 3-wire in pads", "0-150 C", "+-1 C"),
    ("Thrust (active)", "RTD Pt100 3-wire in pads", "0-150 C", "+-1 C"),
    ("T_oil", "RTD Pt100", "0-100 C", "+-0.5 C"),
    ("P_oil", "Pressure transmitter", "0-6 barg", "0.25 %"),
    ("SG_DE", "Flow meter, seal gas primary vent", "0-20 Nm3/h", "2 %"),
    ("SG_NDE", "Flow meter, seal gas primary vent", "0-20 Nm3/h", "2 %"),
]


def instruments(o: dict) -> list[dict]:
    cal = o.get("calibration") or {}
    return [{"key": k, "instrument": i, "range": r, "accuracy": a, "calibration": cal.get(k, "")} for k, i, r, a in MRT_INSTRUMENTS]


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
           "inspection": [{"key": k, "item": t, "done": bool((o.get("inspection") or {}).get(k)), "note": (o.get("inspection_notes") or {}).get(k, "")} for k, t in INSPECTION],
           "retest_rules": RETEST, "instruments": instruments(o), "deviations": o.get("deviations") or [],
           "trip_test": {"setpoint_rpm": float(o.get("trip_setpoint_rpm") or sp["trip_rpm"]), "measured_rpm": o.get("trip_measured_rpm")},
           "variation": [{"seq": nm, "oil_t": ot, "oil_p": op, "oil_t_c": oil["t"][ot], "oil_p_barg": oil["p"][op],
                          "temps": bearing_temperature(pred, sp["mcs_rpm"], oil["t"][ot], t_des),
                          "vib_um": {k: _interp_ext(sp["mcs_rpm"], pred["speeds_rpm"], pred["probes"][k]["unfiltered_um"]) for k in PROBES}} for nm, ot, op in OIL_SEQ]}
    out["acceptance"] = acceptance(sp, pred, plan, oil, t_des, ev, o, temp_lim)
    sts = [a["status"] for a in out["acceptance"]]
    out["status"] = "fail" if "fail" in sts else ("pass" if ev and all(s == "pass" for s in sts if s != "review") else "review")
    out["procedure"] = [
        "Install the test train: driver, couplings (contract HS coupling or idling adaptor), compressor on the test bed; connect the lube console and seal gas.",
        "Check instrumentation: X/Y shaft probes at each journal (DE-X/Y, NDE-X/Y), axial probes (AX-A/B), keyphasor (KPH), bearing RTDs "
        "(TE-DE, TE-NDE, TE-TA, TE-TI), oil supply and drain T / P, seal gas vent flows; record calibration certificates.",
        f"Slow roll at about {pred['probes']['V1-X']['slow_roll']['rpm']:.0f} rpm: record the runout vectors for 1X compensation.",
        f"Warm up at about {plan['warmup_rpm']:.0f} rpm until oil and metal temperatures are stable.",
        f"Accelerate quickly through the 1st critical ({crit[0]:.0f} rpm) to MSS {sp['min_rpm']:.0f} rpm." if crit else f"Accelerate to MSS {sp['min_rpm']:.0f} rpm.",
        "Increase in about 10 % steps, holding each step until readings are stable; record Bode / polar data on the way.",
        f"Run at trip speed {sp['trip_rpm']:.0f} rpm for at least 15 min until stable; then drop to MSS for the runout / repeatability check.",
        f"Run at MCS {sp['mcs_rpm']:.0f} rpm for 4 h, with the five 30 min lube-oil sequences; log readings every 15 min.",
        "Overspeed trip test: raise the speed to the trip set point and record the actuation speed.",
        "Coast down recording Bode / polar plots; then the URT (trial unbalance at the coupling) if specified.",
        "After the test: assembled gas leak test with helium, then remove and inspect bearings and seals.",
    ]
    return out


# ---------------------------------------------------------------- PDF report
PCOL = {"V1-X": "#0b5cad", "V1-Y": "#7b3fb5", "V2-X": "#2e9e6b", "V2-Y": "#d1782a"}
LEGEND_KEYS = PROBES + ["V5-Z", "V6-Z", "KPH", "N1", "Bearing 1", "Bearing 2", "Thrust (active)", *TEMPS, "TD1", "TD2", "T_oil", "P_oil", "SG_DE", "SG_NDE", "SG_P", "SEP"]


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


def doc_info(project, kind: str) -> dict:
    d = dict(project.test_doc or {})
    return {"title": f"{project.name} - {kind}", "number": d.get("number", ""), "rev": d.get("rev", "0"), "client": d.get("client", ""),
            "equipment": d.get("equipment_tag", ""), **d}


def cover_info(project, d: dict, extra: list) -> list:
    import datetime
    return [("Project", project.name), ("Document no.", d.get("number") or "-"), ("Client / purchaser", d.get("client") or "-"),
            ("Revision", d.get("rev", "0")), ("Equipment tag", d.get("equipment") or "-"), ("Date", d.get("date") or datetime.date.today().isoformat()),
            ("Vendor / works", d.get("vendor") or "-"), ("Purchase order", d.get("po") or "-"), *extra]


def mrt_report(project, out: dict, images: dict | None = None) -> bytes:
    """A4 PDF: cover with the 2.5D test-train picture and result summary, set-up and instruments, procedure and
    plan, lube-oil variation tests, trend, slow roll and compensated Bode, polar, orbits and centreline, critical
    speeds and separation margins, spectra / waterfall / sub-synchronous screening, bearings and oil,
    acceptance, trip test and URT, 15-min log, seal and leak tests, inspection, deviations, legend and sign-off."""
    import io

    from matplotlib.backends.backend_pdf import PdfPages

    from compsuite.testing.drawings import Doc, train

    f = lambda v, n=1: "-" if v is None or v == "" else (f"{v:.{n}f}" if isinstance(v, (int, float)) else str(v))  # noqa: E731
    sp, pred, plan, u, al = out["speeds"], out["prediction"], out["plan"], out["urt"], out["along"]
    lim, s = out["limit_um"], pred["speeds_rpm"]
    tr = out["train"]
    T = tag_names(project.test_tags)
    info = doc_info(project, "Mechanical running test report")
    acc = out["acceptance"]
    buf = io.BytesIO()
    with PdfPages(buf) as pdf:
        d = Doc(pdf, "Mechanical running test - API 617 9th ed. 8.3.2 / 8.3.3", info)
        d.cover("Mechanical running test report", cover_info(project, info, [
            ("Speeds MSS / MCS / trip", f"{sp['min_rpm']:.0f} / {sp['mcs_rpm']:.0f} / {sp['trip_rpm']:.0f} rpm"), ("Vibration limit", f"{lim:.1f} um pk-pk"),
            ("Test duration", f"{plan['duration_min'] / 60:.1f} h"), ("Overall status", out["status"].upper())]),
            (images or {}).get("setup"), lambda ax: train(ax, tr["components"]),
            [(a["check"], f(a["measured"] if a["measured"] is not None else a["predicted"]), a["status"]) for a in acc])

        d.page("1  Test set-up and instrumentation")
        if not d.image((images or {}).get("setup"), [0.05, 0.67, 0.9, 0.23]):
            train(d.drawing([0.05, 0.67, 0.9, 0.23]), tr["components"])
        d.y = 0.655
        kw = next((c["name"] for c in tr["components"] if c["kind"] in ("motor", "turbine")), "-")
        d.table(["Set-up", "Value", "", ""], [
            ("Test driver", kw, "Gear ratio", f"{tr['gear_ratio']:.3f}" if tr["geared"] else "direct drive"),
            ("Rotation", "clockwise from drive end", "Seal gas", "N2 (shop)"),
            ("Oil", f"{project.bearings.oil_grade}, {out['oil']['t']['nor']:.0f} C", "Oil filtration", "10 um"),
            ("Radial probes", f"{T['V1-X']}/{T['V1-Y']}, {T['V2-X']}/{T['V2-Y']}", "Axial probes", f"{T['V5-Z']} / {T['V6-Z']}"),
            ("MSS / rated", f"{sp['min_rpm']:.0f} / {sp['rated_rpm']:.0f} rpm", "MCS / trip", f"{sp['mcs_rpm']:.0f} / {sp['trip_rpm']:.0f} rpm")],
            [0.07, 0.22, 0.52, 0.66])
        d.heading("Equipment (shop / contract)")
        d.table(["Item", "Source", "Note"], [(c["name"], c["source"], c["note"]) for c in tr["components"]], [0.07, 0.42, 0.52], 7, 60)
        d.heading("Instrument list and calibration")
        d.table(["Tag", "Instrument", "Range", "Accuracy", "Calibration"], [(T.get(r["key"], r["key"]), r["instrument"], r["range"], r["accuracy"], r["calibration"] or "enter")
                                                                          for r in out["instruments"]], [0.07, 0.19, 0.55, 0.68, 0.82], 6.8, 46)

        d.page("2  Procedure and speed-time plan")
        for i, t in enumerate(out["procedure"]):
            d.line(f"{i + 1}. {t}", 7.8)
        ax = d.fig.add_axes([0.1, 0.34, 0.83, 0.24])
        th = [t / 60 for t in plan["t_min"]]
        ax.fill_between(th, plan["speed_rpm"], color="#0b5cad", alpha=0.08)
        ax.plot(th, plan["speed_rpm"], color="#0b5cad", lw=1.4)
        for c in pred["critical_speeds"][:2]:
            ax.axhline(c["speed_rpm"], color="#c0392b", lw=0.8, ls="--")
            ax.text(th[-1], c["speed_rpm"], f" Nc {c['speed_rpm']:.0f}", fontsize=6, color="#c0392b", va="bottom", ha="right")
        for k, n in (("MCS", sp["mcs_rpm"]), ("Trip", sp["trip_rpm"])):
            ax.axhline(n, color="#5b6878", lw=0.6, ls=":")
            ax.text(0, n, f"{k} ", fontsize=6, color="#5b6878", ha="right", va="center")
        style(ax, "Time (h)", f"{T['N1']} speed (rpm)", "Speed-time plan")
        ax2 = d.fig.add_axes([0.1, 0.1, 0.83, 0.17])
        ax2.plot(th, plan["oil_t_c"], color="#d1782a", lw=1.2)
        ax3 = ax2.twinx()
        ax3.plot(th, plan["oil_p_barg"], color="#2e9e6b", lw=1.2)
        style(ax2, "Time (h)", f"{T['T_oil']} (C)", "Lube-oil supply (orange T, green P)")
        ax3.tick_params(labelsize=6.5)
        ax3.set_ylabel(f"{T['P_oil']} (barg)", fontsize=7)

        d.page("3  Lube-oil variation tests (4 h run)")
        d.line("Five 30 min sequences at MCS with the oil supply temperature and pressure at their limits (API 617 8.3.2 / API 614). "
               "Predicted bearing metal temperatures and vibration; measured values from the 15-min log.", 7.8, "#5b6878")
        d.table(["Sequence", f"{T['T_oil']} C", f"{T['P_oil']} barg", T["Bearing 1"] + " C", T["Bearing 2"] + " C", T["Thrust (active)"] + " C", "Max vib um"],
                [(v["seq"], f"{v['oil_t_c']:.0f} ({v['oil_t']})", f"{v['oil_p_barg']:.2f} ({v['oil_p']})", f(v["temps"].get("Bearing 1")), f(v["temps"].get("Bearing 2")),
                  f(v["temps"].get("Thrust (active)")), f(max(v["vib_um"].values()))) for v in out["variation"]], [0.07, 0.2, 0.34, 0.49, 0.62, 0.75, 0.87], 7)
        lg = out.get("log")
        if lg:
            seqs = {}
            for r in lg["rows"]:
                raw = r["raw"]
                if raw.get("seq") not in (None, "", "nor"):
                    seqs.setdefault(raw["seq"], []).append(r)
            if seqs:
                d.heading("Measured during the sequences")
                d.table(["Sequence", "Max vib um", "Max metal C", "Status"], [(k, f(max(x for r in v for x in r["vib"].values()) if any(r["vib"] for r in v) else None),
                                                                            f(max(x for r in v for x in r["temps"].values()) if any(r["temps"] for r in v) else None),
                                                                            "fail" if any(r["status"] == "fail" for r in v) else "pass") for k, v in seqs.items()],
                        [0.07, 0.3, 0.5, 0.7])

        d.page("4  Trend - vibration, bearing temperature and speed")
        ax = d.fig.add_axes([0.1, 0.6, 0.8, 0.29])
        ta = [t / 60 for t in al["t_min"]]
        for k in PROBES:
            ax.plot(ta, al[k], color=PCOL[k], lw=1.0, label=T[k])
        ax.axhline(lim, color="#c0392b", lw=0.8, ls="--", label="API limit")
        style(ax, "Time (h)", "Amplitude (um pk-pk)", "Shaft vibration (unfiltered) and speed")
        ax.legend(fontsize=6, ncol=5, frameon=False, loc="upper left")
        axs = ax.twinx()
        axs.plot(ta, al["speed_rpm"], color="#8e9aa5", lw=0.9, alpha=0.8)
        axs.set_ylabel(f"{T['N1']} (rpm)", fontsize=7)
        axs.tick_params(labelsize=6.5)
        d.y = 0.555
        d.table(["Tag", "Description", "Max um", "Min um", "At MCS um"],
                [(T[k], tag_table(project.test_tags)[k]["description"][:44], f(max(al[k]), 2), f(min(al[k]), 2),
                  f(_interp_ext(sp["mcs_rpm"], s, pred["probes"][k]["unfiltered_um"]), 2)) for k in PROBES], [0.07, 0.17, 0.62, 0.72, 0.82], 7)
        bt = [k for k in al if k.startswith("Bearing") or k.startswith("Thrust")]
        ax = d.fig.add_axes([0.1, 0.1, 0.8, 0.24])
        for i, k in enumerate(bt):
            ax.plot(ta, al[k], lw=1.1, label=T.get(k, k), color=["#0b5cad", "#2e9e6b", "#d1782a", "#7b3fb5"][i % 4])
        ax.axhline(out["bearing_temp_limit_c"], color="#c0392b", lw=0.8, ls="--", label="limit")
        style(ax, "Time (h)", "Metal temperature (C)", "Bearing metal temperature")
        ax.legend(fontsize=6, frameon=False, ncol=4)

        for pair in (("V1-X", "V1-Y"), ("V2-X", "V2-Y")):
            d.page(f"5  Bode plots - {T[pair[0]]} / {T[pair[1]]} (coast-down, 1X)")
            sr = [pred["probes"][k]["slow_roll"] for k in pair]
            d.line(f"Slow roll at {sr[0]['rpm']:.0f} rpm: {T[pair[0]]} {sr[0]['amp_um']:.2f} um at {sr[0]['phase_deg']:.0f} deg, "
                   f"{T[pair[1]]} {sr[1]['amp_um']:.2f} um at {sr[1]['phase_deg']:.0f} deg. Solid: slow-roll compensated 1X; dashed: uncompensated.", 7.5, "#5b6878")
            for j, k in enumerate(pair):
                y0 = 0.5 - j * 0.43
                pk = pred["probes"][k]
                a1 = d.fig.add_axes([0.1, y0 + 0.17, 0.83, 0.2])
                a1.plot(s, pk["amp_1x_um"], color=PCOL[k], lw=1.3, label="compensated")
                a1.plot(s, pk["uncomp_1x_um"], color=PCOL[k], lw=0.9, ls="--", alpha=0.7, label="uncompensated")
                a1.fill_between(s, pk["amp_1x_um"], color=PCOL[k], alpha=0.08)
                for c in pred["critical_speeds"][:2]:
                    a1.axvline(c["speed_rpm"], color="#c0392b", lw=0.6, ls=":")
                    a1.text(c["speed_rpm"], a1.get_ylim()[1] * 0.95, f" Nc {c['speed_rpm']:.0f} AF {c['af']:.1f}", fontsize=5.5, color="#c0392b", va="top")
                for n, lab in ((sp["min_rpm"], "MSS"), (sp["mcs_rpm"], "MCS")):
                    a1.axvline(n, color="#8e9aa5", lw=0.5, ls=":")
                style(a1, "", "Amplitude (um pk-pk)", f"{T[k]}: {tag_table(project.test_tags)[k]['description']}")
                a1.legend(fontsize=6, frameon=False, loc="upper left")
                a2 = d.fig.add_axes([0.1, y0, 0.83, 0.15])
                for key_, ls_ in (("phase_deg", "-"), ("uncomp_phase_deg", "--")):
                    ph = np.degrees(np.unwrap(np.radians(pk[key_])))
                    a2.plot(s, ph - 360 * math.floor(min(ph) / 360), color=PCOL[k], lw=1.0 if ls_ == "-" else 0.8, ls=ls_)
                style(a2, "Speed (rpm)", "Phase lag (deg)")

        for title, rev in (("6  Speed-up polar plots (1X, compensated)", False), ("6  Coast-down polar plots (1X, compensated)", True)):
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
                ax.set_title(T[k], fontsize=8, weight="bold", pad=10)

        d.page("7  Orbits and shaft centreline")
        for j, b in enumerate(("V1", "V2")):
            for jj, lab in enumerate(("MCS", "Trip")):
                o_ = pred["orbits"][f"{b} {lab}"]
                ax = d.fig.add_axes([0.09 + jj * 0.235 + j * 0.47, 0.62, 0.2, 0.2])
                r_ = max(max(map(abs, o_["x_um"])), max(map(abs, o_["y_um"])), 0.1) * 1.3
                ax.plot(o_["x_um"], o_["y_um"], color=PCOL[f"{b}-X"], lw=1.2)
                ax.plot(o_["x_um"][0], o_["y_um"][0], "o", color="#c0392b", ms=3)
                ax.set_xlim(-r_, r_)
                ax.set_ylim(-r_, r_)
                ax.set_aspect("equal")
                style(ax, "X (um)", "Y (um)" if jj == 0 else "", f"{T[b + '-X'][:-2]} {lab} {o_['speed_rpm']:.0f} rpm")
                ax.title.set_fontsize(7)
        d.fig.text(0.09, 0.59, "1X orbits from the X / Y amplitude and phase; dot = keyphasor mark. Major axis (pk-pk): " +
                   ", ".join(f"{k} {v['major_um']:.2f} um" for k, v in pred["orbits"].items()), fontsize=6.5, color="#5b6878")
        for j, (k, v) in enumerate(pred["centreline"].items()):
            ax = d.fig.add_axes([0.1 + j * 0.45, 0.14, 0.36, 0.36])
            c = v["clearance_um"]
            th_ = np.linspace(0, 2 * math.pi, 120)
            ax.plot(c * np.cos(th_), c * np.sin(th_), color="#9aa3ab", lw=0.8, ls="--")
            ax.plot(v["x_um"], v["y_um"], "o-", color="#0b5cad", ms=2.5, lw=1)
            for x, y, n in list(zip(v["x_um"], v["y_um"], v["speeds_rpm"]))[1::max(1, len(v["x_um"]) // 4)]:
                ax.annotate(f"{n:.0f}", (x, y), fontsize=5, color="#5b6878")
            ax.set_aspect("equal")
            style(ax, "X (um)", "Y (um)", f"Shaft centreline - {T.get(k, k)}")

        d.page("8  Critical speeds and separation margins")
        d.table(["Critical", "Speed rpm", "AF", "Position", "SM actual %", "SM required %", "Status"],
                [(i + 1, f(c["speed_rpm"], 0), f(c["af"], 2) if math.isfinite(c["af"]) else "broad", c["position"], f(c["sm_actual_pct"]), f(c["sm_required_pct"]) if c["sm_required_pct"] and math.isfinite(c["af"]) else ("AF not determinable" if not math.isfinite(c["af"]) else "none (AF < 2.5)"),
                  c["sm_status"]) for i, c in enumerate(pred["critical_speeds"])], [0.07, 0.15, 0.27, 0.36, 0.56, 0.68, 0.84], 7)
        d.line("AF by the half-power method on the predicted 1X response. Required SM (API 617): below MSS 16 (1 - 1/(AF - 1.5)) % max 16 %, "
               "above MCS 10 + 17 (1 - 1/(AF - 1.5)) % max 26 %; no margin for AF < 2.5. 'broad': no half-power band on the predicted curve (heavily damped hump) - "
               "confirm with the measured coast-down Bode.", 7.5, "#5b6878")
        if out.get("coastdown"):
            d.heading("Measured (coast-down) vs predicted (lateral analysis)")
            d.table(["Probe", "Measured critical rpm", "Peak um", "Predicted rpm", "Deviation %", "Status"],
                    [(T.get(k, k), f(v["measured_critical_rpm"], 0), f(v["peak_um"], 1), f(v["predicted_critical_rpm"], 0), f(v["deviation_pct"]), v["status"])
                     for k, v in out["coastdown"].items()], [0.07, 0.2, 0.38, 0.5, 0.64, 0.8])
        else:
            d.line("No coast-down points entered: enter them on the Test log tab to compare with the prediction.", 7.5, "#5b6878")

        wf = pred["waterfall"]
        mcs = sp["mcs_rpm"]
        for g in range(0, len(wf), 2):
            d.page("9  Spectra at test speeds (per probe)")
            for jj, w in enumerate(wf[g:g + 2]):
                d.fig.text(0.07, 0.9 - jj * 0.44, f"{w['label']} - {w['speed_rpm']:.0f} rpm", fontsize=9, weight="bold", color="#0b5cad")
                a_ref = max(_interp_ext(w["speed_rpm"], s, pred["probes"][k]["amp_1x_um"]) for k in PROBES) or 1
                for j, k in enumerate(PROBES):
                    ax = d.fig.add_axes([0.09 + (j % 2) * 0.46, 0.7 - jj * 0.44 - (j // 2) * 0.19, 0.38, 0.14])
                    sc = _interp_ext(w["speed_rpm"], s, pred["probes"][k]["amp_1x_um"]) / a_ref
                    for q in w["components"]:
                        ax.bar(q["freq_hz"], q["amp_um"] * (sc if q["kind"] == "1X" else 1), width=mcs / 60 * 0.06,
                               color=PCOL[k] if q["kind"] == "1X" else "#8e9aa5")
                    ax.axhline(0.2 * lim, color="#c0392b", lw=0.6, ls=":")
                    ax.set_xlim(0, 4 * mcs / 60)
                    style(ax, "Frequency (Hz)" if j // 2 else "", "um pk-pk", T[k])
                    ax.title.set_fontsize(7)

        d.page(f"9  Waterfall, spectrogram and sub-synchronous screening ({T['V1-X']})")
        ax = d.fig.add_axes([0.1, 0.56, 0.82, 0.34])
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
        ax = d.fig.add_axes([0.1, 0.27, 0.82, 0.22])
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
        d.y = 0.22
        d.table(["Speed", "rpm", "Max non-synchronous um", "Limit 20 % A um", "Status"],
                [(w["label"], f(w["speed_rpm"], 0), f(w["max_nonsync_um"], 2), f(w["limit_um"], 2), "pass" if w["max_nonsync_um"] <= w["limit_um"] else "fail")
                 for w in pred["subsync"]], [0.07, 0.25, 0.37, 0.6, 0.8], 7)

        d.page("10  Bearings and lube oil at MCS")
        bo = pred["bearing_oil"]
        d.table(["Bearing", "Load kN", "Unit load MPa", "Ecc.", "h min um", "Loss kW", "Oil l/min", "Rise K", "Metal C"],
                [(T.get(k, k), f(v["load_kn"], 2), f(v["unit_load_mpa"], 2), f(v["eccentricity"], 2), f(v["h_min_um"], 0), f(v["power_loss_kw"], 2), f(v["oil_flow_l_min"], 1),
                  f(v["temp_rise_k"], 1), f(v["metal_c"], 1)) for k, v in bo.items()], [0.07, 0.17, 0.27, 0.39, 0.47, 0.57, 0.67, 0.77, 0.86], 7)
        d.line("Oil temperature rise = power loss / (rho cp Q), rho 860 kg/m3, cp 2.0 kJ/kg K. Measured rise = drain - supply temperature from the log.", 7.5, "#5b6878")
        if lg:
            ax = d.fig.add_axes([0.1, 0.38, 0.8, 0.28])
            tl = [r["t_min"] / 60 for r in lg["rows"]]
            for i, k in enumerate(TEMPS):
                ys = [r["temps"].get(k) for r in lg["rows"]]
                if any(y is not None for y in ys):
                    ax.plot(tl, [np.nan if y is None else y for y in ys], lw=0.9, label=T[k], color=["#0b5cad", "#2e9e6b", "#d1782a", "#7b3fb5"][i // 3])
            ax.axhline(out["bearing_temp_limit_c"], color="#c0392b", lw=0.8, ls="--")
            style(ax, "Time (h)", "Metal temperature (C)", "Measured bearing pad temperatures")
            ax.legend(fontsize=5.5, frameon=False, ncol=6)
            ax = d.fig.add_axes([0.1, 0.08, 0.8, 0.22])
            for k, c in (("V5-Z", "#0b5cad"), ("V6-Z", "#d1782a")):
                ys = [r["raw"].get(k) for r in lg["rows"]]
                if any(y not in (None, "") for y in ys):
                    ax.plot(tl, [np.nan if y in (None, "") else float(y) for y in ys], lw=1.1, label=T[k], color=c)
            style(ax, "Time (h)", "Axial position (um)", "Axial rotor position")
            ax.legend(fontsize=6, frameon=False)

        d.page("11  Acceptance criteria")
        d.summary([(a["check"], f(a["measured"] if a["measured"] is not None else a["predicted"]), a["status"]) for a in acc])
        d.table(["Check", "Criterion", "Predicted", "Measured", "Status"],
                [(a["check"][:40], a["criterion"][:46], f(a["predicted"]), f(a["measured"]), a["status"]) for a in acc], [0.07, 0.36, 0.69, 0.79, 0.88], 6.8)
        d.line("Predicted values come from the rotor model; the status is final only with the measured values from the test log.", 7.5, "#5b6878")

        d.page("12  Overspeed trip test and unbalanced rotor response test")
        tt = out["trip_test"]
        d.table(["Overspeed trip test", "Value"], [("Trip set point rpm", f(tt["setpoint_rpm"], 0)), ("Measured actuation rpm", f(tt["measured_rpm"], 0)),
                                                  ("Deviation %", f((float(tt["measured_rpm"]) / tt["setpoint_rpm"] - 1) * 100, 2) if tt["measured_rpm"] else "-"),
                                                  ("Status", next((a["status"] for a in acc if a["check"] == "Overspeed trip test"), "review"))], [0.07, 0.5])
        d.heading("Unbalanced rotor response test (URT, API 617 8.3.3)")
        for k, v in [("Ur (coupling-end journal)", f"{u['ur_g_mm']:.1f} g mm ({u['journal_load_kg']:.0f} kg journal load)"),
                     ("Coupling half mass", f"{f(u['coupling_half_mass_kg'])} kg; trial radius {u['radius_mm']:.0f} mm"),
                     ("Trial unbalance", f"{u['multiple']:.1f} x Ur = {u['trial_g_mm']:.0f} g mm = {u['trial_mass_g']:.2f} g (range {u['range_mass_g'][0]:.2f}-{u['range_mass_g'][1]:.2f} g)"),
                     ("Predicted critical / test speed", f"{u['predicted_critical_rpm']:.0f} rpm / {u['test_speed_rpm']:.0f} rpm"),
                     ("Status / nameplate critical speed", f"{u['status']} / '{u['nameplate']}'")]:
            d.line(f"{k}: {v}", 8)
        d.table(["Probe", "Range at test speed um", "Range at MCS um"],
                [(T.get(k, k), "{:.1f}-{:.1f}".format(r["test"][0], r["test"][2]), "{:.1f}-{:.1f}".format(r["mcs"][0], r["mcs"][2])) for k, r in u["predicted_range_um"].items()], [0.07, 0.3, 0.55])
        d.table(["URT check", "Value", "Status"], [(c["check"], f(c["value"], 2), c["status"]) for c in u["checks"]], [0.07, 0.62, 0.8])
        ax = d.fig.add_axes([0.1, max(d.y - 0.3, 0.07), 0.82, 0.24])
        for k in PROBES:
            ax.plot(u["speeds_rpm"], u["response"][k]["amp_um"], color=PCOL[k], lw=1.1, label=f"{T[k]} with trial")
        ax.axvline(u["predicted_critical_rpm"], color="#c0392b", lw=0.7, ls="--")
        style(ax, "Speed (rpm)", "1X (um pk-pk)", "Predicted response with the trial unbalance")
        ax.legend(fontsize=6, frameon=False, ncol=4)

        d.page("13  Test log (15 min readings)")
        if lg:
            vk = [k for k in PROBES + ["V5-Z", "V6-Z"]]
            d.table(["Time", T["N1"], *[T[k] for k in vk], "Status"],
                    [(r["raw"].get("time", f(r["t_min"], 0)), f(r["N1"], 0), *[f(r["raw"].get(k)) for k in vk], r["status"]) for r in lg["rows"]],
                    [0.07, 0.15, 0.25, 0.34, 0.43, 0.52, 0.61, 0.7, 0.82], 6.8)
            tk = ["Bearing 1", "Bearing 2", "Thrust (active)", "TD1", "TD2", "T_oil", "P_oil", "SG_DE", "SG_NDE"]
            d.table(["Time", *[T[k] for k in tk]],
                    [(r["raw"].get("time", f(r["t_min"], 0)), f(max([r["temps"][k] for k in TEMPS[:3] if k in r["temps"]] or [None], key=lambda x: x or 0)),
                      f(max([r["temps"][k] for k in TEMPS[3:6] if k in r["temps"]] or [None], key=lambda x: x or 0)),
                      f(max([r["temps"][k] for k in TEMPS[6:9] if k in r["temps"]] or [None], key=lambda x: x or 0)),
                      *[f(r["raw"].get(k)) for k in tk[3:]]) for r in lg["rows"]], [0.07, 0.14, 0.23, 0.32, 0.41, 0.52, 0.63, 0.72, 0.8, 0.88], 6.3)
            fl = [f"{r['raw'].get('time', '')}: " + "; ".join(r["flags"]) for r in lg["rows"] if r["flags"]]
            for x in fl:
                d.line(x, 7, "#c0392b")
        else:
            d.line("No test log entered.", 8, "#5b6878")

        lk = out["leak"]
        d.page("14  Seal and gas leak tests, inspection and deviations")
        d.line(f"Assembled gas leak test: {lk['gas']} at {lk['test_pressure_barg']:.1f} barg, hold {lk['hold_min']:.0f} min - {lk['status'].upper()}", 9, bold=True)
        d.table(["Check", "Value", "Status"], [(c["check"], f(c["value"], 2), c["status"]) for c in lk["checks"]], [0.07, 0.62, 0.8])
        filled = [r for r in lk["readings"] if r.get("pressure_barg") not in (None, "")]
        if filled:
            d.table(["t min", "Pressure barg", f"{T['SG_DE']} Nm3/h", f"{T['SG_NDE']} Nm3/h", "Joint leak"],
                    [(f(r["t_min"], 0), f(r["pressure_barg"], 2), f(r.get("dgs_de_nm3h"), 2), f(r.get("dgs_nde_nm3h"), 2), "yes" if r.get("joint_leak") else "no") for r in filled],
                    [0.07, 0.2, 0.38, 0.58, 0.8])
        d.heading("Post-test inspection")
        for it in out["inspection"]:
            d.line(f"[{'x' if it['done'] else ' '}] {it['item']}" + (f" - {it['note']}" if it.get("note") else ""), 7.8)
        d.y -= 0.005
        for r in out["retest_rules"]:
            d.line(f"- {r}", 7.5, "#5b6878")
        d.heading("Deviations and non-conformances")
        if out["deviations"]:
            d.table(["No.", "Item", "Description", "Disposition"], [(i + 1, x.get("item", ""), x.get("description", ""), x.get("disposition", "")) for i, x in enumerate(out["deviations"])],
                    [0.07, 0.12, 0.32, 0.72], 7, 58)
        else:
            d.line("None recorded.", 8, "#5b6878")

        d.legend(tag_table(project.test_tags), LEGEND_KEYS, GLOSSARY[:15])
        d.signoff((project.test_doc or {}).get("signoff"))
        d.close()
    return buf.getvalue()
