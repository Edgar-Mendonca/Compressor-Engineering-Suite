"""Default compressor-system network built from the steady-state results, the valve sizing helper and the
study presets (ESD, driver trip, blocked discharge, deep surge, start-up, speed step)."""

from __future__ import annotations

import math

import numpy as np

from compsuite.dynamics.engine import N6, RU

SCENARIOS = {
    "esd": {"title": "Emergency shutdown (ESD): driver trip, ESD valves close, anti-surge valve opens", "duration_s": 40,
            "events": [{"t": 2, "action": "trip"}, {"t": 2, "action": "valve", "id": "XV-101", "open": 0}, {"t": 2, "action": "valve", "id": "XV-102", "open": 0}]},
    "esd_hgv": {"title": "ESD with the hot-gas bypass valve opening on the trip", "duration_s": 40,
                "events": [{"t": 2, "action": "trip"}, {"t": 2, "action": "valve", "id": "XV-101", "open": 0}, {"t": 2, "action": "valve", "id": "XV-102", "open": 0},
                           {"t": 2, "action": "valve", "id": "HV-100", "open": 1}]},
    "stop": {"title": "Normal stop: unload on the anti-surge valve, ramp the speed down, trip at minimum speed", "duration_s": 70,
             "events": [{"t": 2, "action": "valve", "id": "FV-100", "open": 1}, {"t": 12, "action": "speed_step", "value": -0.6}, {"t": 50, "action": "trip"},
                        {"t": 50, "action": "valve", "id": "XV-101", "open": 0}, {"t": 50, "action": "valve", "id": "XV-102", "open": 0}]},
    "trip": {"title": "Driver trip (process valves stay open)", "duration_s": 30, "events": [{"t": 2, "action": "trip"}]},
    "blocked": {"title": "Blocked discharge: export valve closes in 5 s, anti-surge control in service", "duration_s": 40,
                "events": [{"t": 2, "action": "valve", "id": "XV-102", "open": 0}]},
    "surge": {"title": "Driver trip with the anti-surge controller out of service (deep surge)", "duration_s": 20,
              "events": [{"t": 0, "action": "controller", "id": "UIC-100", "on": False}, {"t": 2, "action": "trip"}]},
    "startup": {"title": "Start-up from settle-out on full recycle, speed ramp, export valve opens", "duration_s": 60, "settled": True,
                "initial": [{"t": 0, "action": "speed", "value": 0}, {"t": 0, "action": "valve", "id": "XV-102", "open": 0}, {"t": 0, "action": "valve", "id": "FV-100", "open": 1}],
                "events": [{"t": 1, "action": "speed", "value": 1.0}, {"t": 55, "action": "release", "id": "FV-100"}, {"t": 60, "action": "release", "id": "XV-102"}],
                "duration_s": 90},
    "speed": {"title": "Speed set-point step -3 % (drive ramp 2 %/s)", "duration_s": 30, "events": [{"t": 2, "action": "speed_step", "value": -0.03}]},
}


def cv_for(mdot, P1, P2, T1, gas, open_=1.0, xT=0.7):
    """Valve Cv that passes mdot (kg/s) from P1 to P2 (Pa) at the given opening (linear trim)."""
    rho = P1 / (gas["Z"] * RU / gas["mw"] * T1)
    Fk = gas["k"] / 1.4
    x = min((P1 - P2) / P1, Fk * xT)
    Y = 1 - x / (3 * Fk * xT)
    return mdot / (N6 * open_ * Y * math.sqrt(x * P1 / 1e5 * rho))


def collapse_map(pm: dict) -> dict:
    """Fan-law collapse of all speed lines to the rated speed: q/N, H/N^2 -> one head and efficiency curve."""
    q, h, e = [], [], []
    for ln in pm["lines"]:
        f = ln["speed_frac"]
        for p in ln["points"]:
            q.append(p["q_am3_h"] / 3600 / f); h.append(p["head_kj_kg"] * 1e3 / f / f); e.append(p["eta_p"])
    q, h, e = map(np.asarray, (q, h, e))
    qs = float(np.median([p["q_am3_h"] / 3600 / ln["speed_frac"] for ln, p in zip(pm["lines"], pm["surge_line"])])) if pm.get("surge_line") else float(q.min())
    ph, pe = np.polyfit(q, h, 3), np.polyfit(q, e, 2)
    g = np.linspace(qs, q.max() * 1.02, 24)
    return {"q": g.tolist(), "h": np.polyval(ph, g).tolist(), "eta": np.clip(np.polyval(pe, g), 0.4, 0.92).tolist(), "q_surge": qs, "h_surge": float(np.polyval(ph, qs))}


def _calibrate(mp: dict, q: float, h: float) -> dict:
    """Scale the collapsed head curve so it passes through the rated point."""
    f = h / float(np.interp(q, mp["q"], mp["h"]))
    return {**mp, "h": [x * f for x in mp["h"]], "h_surge": mp["h_surge"] * f}


def default_network(project, res: dict) -> dict:
    case = next((c for c in res["cases"] if str(c.get("case", "")).lower().startswith("rated")), res["cases"][0])
    op = next((o for o in res["operating_points"] if o.get("case") == case.get("case")), res["operating_points"][0])
    su, di = case["suction"], case["discharge"]
    Z_RT = su["Z"] * RU / su["mw"] * su["T"]
    pr = di["P"] / su["P"]
    lo, hi = 1.0, 20.0                       # n/(n-1) from the rated head and pressure ratio (real-gas path)
    for _ in range(60):
        mid = (lo + hi) / 2
        lo, hi = (mid, hi) if Z_RT * mid * (pr ** (1 / mid) - 1) > case["polytropic_head_j_kg"] else (lo, mid)
    gas = {"mw": su["mw"], "Z": su["Z"], "cp": su["cp"], "k": su["k"], "sigma": round(mid, 4), "m_T": round(math.log(di["T"] / su["T"]) / math.log(pr), 4)}
    Ps, Pd, Ts, Td = su["P"] / 1e5, di["P"] / 1e5, su["T"] - 273.15, di["T"] - 273.15
    m = case["mass_flow_kg_s"]
    Qs = case["suction_volume_flow_m3_s"]
    rated = res["sizing"]["speed_rpm"]
    nf = op.get("speed_frac") or case.get("speed_frac") or 1.0
    T_K = Ts + 273.15
    Vs, Vc, Ve = round(max(3.0, 4 * Qs), 1), round(max(2.0, 3 * Qs), 1), round(max(6.0, 10 * Qs), 1)
    J = float(res["torsional"]["model"].get("total_ip_ref_kgm2") or 10.0)
    P_set = (Ps * Vs + Pd * (Vc + Ve)) / (Vs + Vc + Ve)
    node = lambda i, t, lab, x, y, P, T, V=None, **k: {"id": i, "type": t, "label": lab, "x": x, "y": y, "P_bara": round(P, 2), "T_c": round(T, 1),
                                                        **({"V_m3": V, "P_settle_bara": round(P_set, 2)} if V else {}), **k}
    nodes = [node("SRC", "source", "Suction header", 60, 150, Ps + 0.5, Ts),
             node("V-100", "volume", "Suction scrubber", 270, 150, Ps, Ts, Vs),
             node("D-100", "volume", "Discharge nozzle", 500, 150, Pd + 0.4, Td, 0.6),
             node("E-100", "cooler", "Discharge cooler", 680, 150, Pd + 0.2, Ts, Vc, T_out_c=round(Ts, 1), tau_s=2.0),
             node("V-101", "volume", "Discharge line", 850, 150, Pd, Ts, Ve),
             node("SNK", "sink", "Export header", 1060, 150, Pd - 1.0, Ts)]
    link = lambda i, t, lab, a, b, **k: {"id": i, "type": t, "label": lab, "from": a, "to": b, **k}
    links = [link("XV-101", "valve", "Suction ESD valve", "SRC", "V-100", Cv=round(cv_for(m, (Ps + 0.5) * 1e5, Ps * 1e5, T_K, gas), 0), open=1.0, stroke_s=3.0, char="quick"),
             link("K-100", "compressor", "Compressor", "V-100", "D-100", rated_rpm=rated, design_kg_s=m, L_m=15.0, A_m2=round(Qs / 25, 4)),
             link("L-100", "pipe", "Discharge piping", "D-100", "E-100", Cv=round(cv_for(m, (Pd + 0.4) * 1e5, (Pd + 0.2) * 1e5, Td + 273.15, gas), 0), open=1.0),
             link("NRV-101", "check", "Discharge check valve", "E-100", "V-101", Cv=round(cv_for(m, (Pd + 0.2) * 1e5, Pd * 1e5, T_K, gas), 0), open=1.0, stroke_s=0.3),
             link("XV-102", "valve", "Discharge ESD / export valve", "V-101", "SNK", Cv=round(cv_for(m, Pd * 1e5, (Pd - 1.0) * 1e5, T_K, gas, 0.7), 0), open=0.7, stroke_s=5.0),
             link("FV-100", "valve", "Anti-surge (recycle) valve", "E-100", "V-100", Cv=round(cv_for(1.5 * m, Pd * 1e5, Ps * 1e5, T_K, gas, 1.0), 0), open=0.0, stroke_s=2.0, char="linear"),
             link("HV-100", "valve", "Hot-gas bypass valve", "D-100", "V-100", Cv=round(cv_for(1.0 * m, Pd * 1e5, Ps * 1e5, Td + 273.15, gas, 1.0), 0), open=0.0, stroke_s=0.3, char="quick")]
    ctl = [{"id": "UIC-100", "type": "antisurge", "label": "Anti-surge controller", "compressor": "K-100", "valve": "FV-100", "margin": 0.10, "kp": 6.0, "ti_s": 3.0,
            "trip_line": 0.05, "open_on_trip": True, "enabled": True}]
    return {"gas": gas, "nodes": nodes, "links": links, "controllers": ctl,
            "driver": {"type": "VFD motor" if res["torsional"]["model"].get("vfd") else "Motor", "rated_kw": round(res["sizing"]["driver_rating_kw"], 0), "J_kgm2": round(J, 2),
                       "speed_setpoint": round(nf, 3), "ramp_frac_s": 0.02, "kp": 20.0, "ti_s": 1.0, "max_torque": 1.15, "loss_frac": 0.015},
            "map": _calibrate(collapse_map(res["performance_map"]), Qs / nf, case["polytropic_head_j_kg"] / nf ** 2), "design": {"Ps_bara": Ps, "Pd_bara": Pd, "Ts_c": Ts, "mass_flow_kg_s": m, "speed_frac": nf}}


def scenario(key: str, net: dict, overrides: dict | None = None) -> dict:
    import copy
    s = copy.deepcopy(SCENARIOS[key])
    sp = net["driver"].get("speed_setpoint", 1.0)
    for e in s.get("events", []):
        if e["action"] == "speed_step":
            e.update(action="speed", value=sp + e["value"])
        elif e["action"] == "speed" and key == "startup":
            e["value"] = e["value"] * sp
    return {**s, **(overrides or {})}
