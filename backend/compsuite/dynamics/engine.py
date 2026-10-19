"""Compressor-system dynamic simulation (lumped parameters, SciPy).

Network = nodes (gas volumes, cooler volumes, fixed-pressure sources / sinks) joined by links (compressor,
control / ESD valves, check valves). States: mass and temperature of every volume, compressor mass flow
(Greitzer duct inertia, so surge and flow reversal can happen), valve positions (stroke-time limited),
shaft speed (driver torque - gas torque - losses over the train inertia) and the controller integrators.
Gas: real-gas Z, cp, k and molar mass from the design suction state, held constant (preliminary dynamics).
Valves: ISA / IEC 60534 gas sizing, W = N6 Cv f(open) Y sqrt(x P1 rho1). Compressor: the performance map
collapsed by the fan laws, extended left of surge to shut-off and into reverse flow (Moore-Greitzer shape).
"""

from __future__ import annotations

import math

import numpy as np
from scipy.integrate import solve_ivp

RU = 8314.462618
N6 = 27.3 / 3600.0          # kg/s per (Cv sqrt(bar kg/m3))


class Model:
    def __init__(self, net: dict):
        self.net = net
        g = net["gas"]
        self.Rs, self.Z, self.cp, self.k = RU / g["mw"], g["Z"], g["cp"], g["k"]
        self.cv = self.cp / self.k
        self.sig = g.get("sigma", self.k / (self.k - 1) * 0.82)    # n / (n - 1) of the polytropic path
        self.mT = g.get("m_T", (self.k - 1) / (self.k * 0.82))     # T2 / T1 = PR ** m_T
        self.nodes, self.links, self.ctl = net["nodes"], net["links"], net.get("controllers", [])
        self.ni = {n["id"]: i for i, n in enumerate(self.nodes)}
        self.vol = [i for i, n in enumerate(self.nodes) if n["type"] not in ("source", "sink")]
        self.vi = {i: j for j, i in enumerate(self.vol)}
        self.valves = [i for i, l in enumerate(self.links) if l["type"] in ("valve", "check", "pipe")]
        self.comp = next(i for i, l in enumerate(self.links) if l["type"] == "compressor")
        c, m = self.links[self.comp], net["map"]
        self.N0 = c["rated_rpm"]
        self.fq, self.fh, self.fe = np.asarray(m["q"]), np.asarray(m["h"]), np.asarray(m["eta"])   # collapsed map at N0
        self.qs, self.hs = m["q_surge"], m["h_surge"]
        self.eta0 = float(np.max(self.fe))
        self.ctl_i = [i for i, x in enumerate(self.ctl) if x["type"] in ("antisurge", "pic")]
        # state layout
        nv = len(self.vol)
        self.o_m, self.o_T, self.o_c, self.o_v = 0, nv, 2 * nv, 2 * nv + 1
        self.o_w = self.o_v + len(self.valves)
        self.o_i = self.o_w + 3                       # shaft speed, driver PI integrator, ramped speed reference
        self.n = self.o_i + len(self.ctl_i)
        self.events, self.t_trip = [], None
        self.cmd_override: dict[str, float] = {}
        self.ctl_on = {x["id"]: x.get("enabled", True) for x in self.ctl}
        self.sp = {x["id"]: x.get("setpoint") for x in self.ctl}
        self.speed_sp = net["driver"].get("speed_setpoint", 1.0)
        self.trip = False

    # ---- elements
    def P(self, i, y):
        n = self.nodes[i]
        if n["type"] in ("source", "sink"):
            return n["P_bara"] * 1e5, n["T_c"] + 273.15
        j = self.vi[i]
        m, T = max(y[self.o_m + j], 1e-6), y[self.o_T + j]
        return self.Z * m * self.Rs * T / n["V_m3"], T

    def head(self, q, nf):
        """Polytropic head (J/kg) at actual suction flow q (m3/s) and speed fraction nf."""
        nf = max(nf, 1e-3)
        qn = q / nf
        if qn >= self.qs:
            h = np.interp(qn, self.fq, self.fh, right=None)
            if qn > self.fq[-1]:          # beyond choke: steep fall
                h = self.fh[-1] - (qn - self.fq[-1]) * (self.fh[-2] - self.fh[-1]) / max(self.fq[-1] - self.fq[-2], 1e-9) * 3
        elif qn >= 0:                     # left of surge: cubic down to shut-off head 0.85 Hs
            x = qn / self.qs
            h = self.hs * (0.85 + 0.15 * (3 * x * x - 2 * x ** 3))
        else:                             # reverse flow: rises like a throttle
            h = self.hs * 0.85 + 4 * self.hs * (qn / self.qs) ** 2
        return h * nf * nf

    def eta(self, q, nf):
        return float(np.interp(q / max(nf, 1e-3), self.fq, self.fe))

    def vflow(self, l, pos, P1, T1, P2):
        """Valve mass flow (kg/s), positive from 'from' to 'to'; reverse handled by symmetry."""
        if P2 > P1:
            return -self.vflow(l, pos, P2, T1, P1)
        ch = l.get("char", "linear")
        f = pos if ch == "linear" else (pos ** 0.5 if ch == "quick" else (50 ** (pos - 1) if pos > 0.01 else pos * 50 ** -0.99))
        rho = P1 / (self.Z * self.Rs * T1)
        xT, Fk = l.get("xT", 0.7), self.k / 1.4
        x = min((P1 - P2) / P1, Fk * xT)
        Y = 1 - x / (3 * Fk * xT)
        return N6 * l["Cv"] * f * Y * math.sqrt(max(x * P1 / 1e5 * rho, 0.0))

    # ---- right-hand side
    def rhs(self, t, y, out=None):
        dy = np.zeros(self.n)
        din = np.zeros(len(self.nodes))           # mass in
        dh = np.zeros(len(self.nodes))            # enthalpy in (cp T mdot)
        dh_in = np.zeros(len(self.nodes)); din_pos = np.zeros(len(self.nodes))

        def flow(a_, b_, m_, T_):                 # mass m_ (kg/s) at T_ from node a_ to node b_ (negative = reverse)
            din[a_] -= m_; din[b_] += m_
            dh[a_] -= m_ * self.cp * T_; dh[b_] += m_ * self.cp * T_
            r_ = b_ if m_ >= 0 else a_
            dh_in[r_] += abs(m_) * self.cp * T_; din_pos[r_] += abs(m_)
        PT = [self.P(i, y) for i in range(len(self.nodes))]
        nf = max(y[self.o_w], 0.0)
        # compressor
        c = self.links[self.comp]
        a, b = self.ni[c["from"]], self.ni[c["to"]]
        (P1, T1), (P2, T2) = PT[a], PT[b]
        mc = y[self.o_c]
        rho1 = P1 / (self.Z * self.Rs * T1)
        q = mc / rho1
        H = self.head(q, nf)
        pr = max(1 + H / (self.sig * self.Z * self.Rs * T1), 1e-3) ** self.sig
        dy[self.o_c] = c["A_m2"] / c["L_m"] * (P1 * pr - P2)
        eta = min(max(self.eta(max(q, 0), nf), 0.3), 0.95)
        Tout = T1 * pr ** (self.mT * self.eta0 / eta) if mc >= 0 else T2
        flow(a, b, mc, Tout if mc >= 0 else T2)
        if mc >= 0:   # suction side leaves at T1, discharge receives Tout: correct the enthalpy taken from the suction node
            dh[a] += mc * self.cp * (Tout - T1)
        # valves
        flows = {}
        for k_, li in enumerate(self.valves):
            l = self.links[li]
            a, b = self.ni[l["from"]], self.ni[l["to"]]
            pos = min(max(y[self.o_v + k_], 0.0), 1.0)
            m = self.vflow(l, pos, PT[a][0], PT[a][1] if PT[a][0] >= PT[b][0] else PT[b][1], PT[b][0])
            if l["type"] == "check" and m < 0:
                m = 0.0
            flows[l["id"]] = m
            flow(a, b, m, PT[a][1] if m >= 0 else PT[b][1])
        # volumes; a cooler returns its inflow at the outlet temperature (heat removed = duty), lagged by tau_s
        for j, i in enumerate(self.vol):
            nd = self.nodes[i]
            m, T = max(y[self.o_m + j], 1e-6), y[self.o_T + j]
            Q = 0.0
            if nd["type"] == "cooler":
                Q = -m * self.cv * (T - (nd["T_out_c"] + 273.15)) / nd.get("tau_s", 2.0) - max(dh_in[i] - din_pos[i] * self.cp * (nd["T_out_c"] + 273.15), 0.0)
            dy[self.o_m + j] = din[i]
            dy[self.o_T + j] = (dh[i] - self.cv * T * din[i] + Q) / (m * self.cv)
        # controllers -> valve commands
        cmd = {self.links[li]["id"]: self.links[li].get("open", 1.0) for li in self.valves}
        sm = (q / max(nf, 1e-3)) / self.qs - 1           # surge margin on flow at this speed
        for k_, ci in enumerate(self.ctl_i):
            x = self.ctl[ci]
            if not self.ctl_on.get(x["id"], True):
                continue
            if x["type"] == "antisurge":
                e = x.get("margin", 0.10) - sm                  # positive -> too close to surge -> open
                u = x.get("kp", 3.0) * e + y[self.o_i + k_]
                dy[self.o_i + k_] = 0.0 if (u > 1 and e > 0) or (u < 0 and e < 0) else x.get("kp", 3.0) * e / x.get("ti_s", 4.0)
                cmd[x["valve"]] = min(max(u, 0.0), 1.0)
                if sm < x.get("trip_line", 0.03) and nf > 0.2:      # recycle trip line: step fully open, integrator follows
                    cmd[x["valve"]] = 1.0
                    dy[self.o_i + k_] = (1.0 - y[self.o_i + k_]) / 0.2
                if self.trip and x.get("open_on_trip", True):
                    cmd[x["valve"]] = 1.0
            else:   # pressure controller on a node, reverse acting on its valve unless 'direct'
                Pm = PT[self.ni[x["node"]]][0] / 1e5
                e = (Pm - self.sp[x["id"]]) * (1 if x.get("action", "direct") == "direct" else -1) / max(self.sp[x["id"]], 1)
                u = x.get("bias", 0.5) + x.get("kp", 2.0) * e + y[self.o_i + k_]
                dy[self.o_i + k_] = 0.0 if (u > 1 and e > 0) or (u < 0 and e < 0) else x.get("kp", 2.0) * e / x.get("ti_s", 10.0)
                cmd[x["valve"]] = min(max(u, 0.0), 1.0)
        cmd.update(self.cmd_override)
        cmd.update({self.links[li]["id"]: 1.0 for li in self.valves if self.links[li]["type"] == "pipe"})
        for k_, li in enumerate(self.valves):
            l = self.links[li]
            pos, tgt = y[self.o_v + k_], cmd[l["id"]]
            rate = 1.0 / max(l.get("stroke_s", 2.0), 0.05)
            dy[self.o_v + k_] = max(min((tgt - pos) / 0.05, rate), -rate)
        # shaft: driver torque - gas torque - losses, J dw/dt (w in speed fraction)
        d = self.net["driver"]
        w0 = self.N0 * math.pi / 30
        Tr = d["rated_kw"] * 1e3 / w0
        if self.trip:
            Td = 0.0
            dy[self.o_w + 1] = 0.0
        else:
            ref = y[self.o_w + 2]
            rr = d.get("ramp_frac_s", 0.02)
            dy[self.o_w + 2] = max(min((self.speed_sp - ref) / 0.05, rr), -rr)
            e = ref - nf
            Td = min(max(d.get("kp", 20.0) * e * Tr + y[self.o_w + 1], 0.0), d.get("max_torque", 1.15) * Tr)
            dy[self.o_w + 1] = d.get("kp", 20.0) * e * Tr / d.get("ti_s", 1.0)
        Tg = mc * H / (eta * max(nf, 0.02) * w0) if mc > 0 else 0.0
        Tl = d.get("loss_frac", 0.015) * Tr * nf * nf
        dy[self.o_w] = (Td - Tg - Tl) / (d["J_kgm2"] * w0) if (nf > 0 or Td > Tg) else 0.0
        if out is not None:
            out.update(PT=PT, q=q, H=H, nf=nf, flows=flows, sm=sm, Tout=Tout, Tg=Tg, Td=Td, eta=eta, cmd=cmd)
        return dy

    def y0(self, settled: bool = False):
        y = np.zeros(self.n)
        for j, i in enumerate(self.vol):
            nd = self.nodes[i]
            P = (nd.get("P_settle_bara") if settled else None) or nd["P_bara"]
            T = nd["T_c"] + 273.15
            y[self.o_m + j] = P * 1e5 * nd["V_m3"] / (self.Z * self.Rs * T)
            y[self.o_T + j] = T
        c = self.links[self.comp]
        y[self.o_c] = 0.0 if settled else c["design_kg_s"]
        for k_, li in enumerate(self.valves):
            y[self.o_v + k_] = self.links[li].get("open", 1.0)
        y[self.o_w] = y[self.o_w + 2] = 0.0 if settled else self.speed_sp
        y[self.o_w + 1] = 0.0 if settled else (self.net["driver"]["rated_kw"] * 0.85e3 / (self.N0 * math.pi / 30))
        return y


def _apply(md: Model, ev: dict):
    a = ev["action"]
    if a == "trip":
        md.trip = True
    elif a == "valve":
        md.cmd_override[ev["id"]] = float(ev["open"])
    elif a == "release":
        md.cmd_override.pop(ev["id"], None)
    elif a == "controller":
        md.ctl_on[ev["id"]] = bool(ev.get("on", True))
    elif a == "setpoint":
        md.sp[ev["id"]] = float(ev["value"])
    elif a == "speed":
        md.speed_sp = float(ev["value"])


def simulate(net: dict, scenario: dict) -> dict:
    """Run a scenario: {duration_s, dt_s, settled (start from rest), pre_s (settling time before t = 0), events: [{t, action, ...}]}."""
    md = Model(net)
    T_end, dt = float(scenario.get("duration_s", 30)), float(scenario.get("dt_s", 0.05))
    settled = bool(scenario.get("settled"))
    y = md.y0(settled)
    for ev in scenario.get("initial", []):
        _apply(md, ev)
    if not settled and scenario.get("pre_s", 20) > 0:      # settle the design point before the scenario starts
        y = solve_ivp(md.rhs, (0, scenario.get("pre_s", 20)), y, method="LSODA", rtol=1e-5, atol=1e-6, max_step=0.2).y[:, -1]
        for k_ in range(len(md.ctl_i)):
            y[md.o_i + k_] = np.clip(y[md.o_i + k_], -1, 1)
    evs = sorted(scenario.get("events", []), key=lambda e: e["t"])
    cuts = sorted({0.0, T_end, *[min(max(e["t"], 0), T_end) for e in evs]})
    ts, ys = [], []
    for t0, t1 in zip(cuts[:-1], cuts[1:]):
        for e in evs:
            if t0 <= e["t"] < t1 or (e["t"] <= 0 and t0 == 0):
                if not e.get("_done"):
                    _apply(md, e)
                    e["_done"] = True
        te = np.arange(t0, t1, dt)
        s = solve_ivp(md.rhs, (t0, t1), y, method="LSODA", t_eval=te if len(te) else None, rtol=1e-5, atol=1e-6, max_step=0.05)
        ts.append(s.t); ys.append(s.y)
        y = s.y[:, -1] if s.y.shape[1] else y
        if s.status < 0:
            break
    for e in evs:
        e.pop("_done", None)
    t = np.concatenate(ts)
    Y = np.concatenate(ys, axis=1)
    return _post(md, t, Y, evs)


def _post(md: Model, t, Y, evs) -> dict:
    """Series and the result summary."""
    out_n = {n["id"]: {"P_bara": [], "T_c": []} for n in md.nodes}
    out_l = {l["id"]: {"mdot_kg_s": [], "open": []} for l in md.links}
    cmp = {"q_am3_h": [], "head_kj_kg": [], "speed_frac": [], "surge_margin": [], "power_kw": [], "Td_kw": [], "T_out_c": []}
    o: dict = {}
    for k in range(Y.shape[1]):
        md.trip = any(e["action"] == "trip" and e["t"] <= t[k] for e in evs)
        md.rhs(t[k], Y[:, k], o)
        for i, n in enumerate(md.nodes):
            out_n[n["id"]]["P_bara"].append(o["PT"][i][0] / 1e5)
            out_n[n["id"]]["T_c"].append(o["PT"][i][1] - 273.15)
        for k_, li in enumerate(md.valves):
            lid = md.links[li]["id"]
            out_l[lid]["mdot_kg_s"].append(o["flows"][lid])
            out_l[lid]["open"].append(float(np.clip(Y[md.o_v + k_, k], 0, 1)))
        cl = md.links[md.comp]["id"]
        out_l[cl]["mdot_kg_s"].append(float(Y[md.o_c, k]))
        out_l[cl]["open"].append(1.0)
        w = o["nf"] * md.N0 * math.pi / 30
        cmp["q_am3_h"].append(o["q"] * 3600); cmp["head_kj_kg"].append(o["H"] / 1e3); cmp["speed_frac"].append(float(o["nf"]))
        cmp["surge_margin"].append(float(o["sm"]) * 100); cmp["power_kw"].append(o["Tg"] * w / 1e3); cmp["Td_kw"].append(o["Td"] * w / 1e3)
        cmp["T_out_c"].append(o["Tout"] - 273.15)
    sm = np.asarray(cmp["surge_margin"]); nf = np.asarray(cmp["speed_frac"]); mc = np.asarray(out_l[md.links[md.comp]["id"]]["mdot_kg_s"])
    run = nf > 0.3
    surge = bool(np.any(sm[run] < 0)) if run.any() else False
    vols = [md.nodes[i]["id"] for i in md.vol]
    P_end = [out_n[v]["P_bara"][-1] for v in vols]
    c_ = md.links[md.comp]
    ps_, pd_ = out_n[c_["from"]]["P_bara"][-1], out_n[c_["to"]]["P_bara"][-1]
    rev = mc < -0.02 * md.links[md.comp]["design_kg_s"]
    cyc = int(np.sum(rev[1:] & ~rev[:-1]))
    surge_t = [float(t[k]) for k in range(1, len(t)) if rev[k] and not rev[k - 1]]
    stop = next((float(t[k]) for k in range(len(t)) if nf[k] < 0.05 and t[k] > 0), None)
    summary = {"min_surge_margin_pct": float(sm[run].min()) if run.any() else None, "surge": surge, "reverse_flow": bool(np.any(mc < -0.02 * md.links[md.comp]["design_kg_s"])),
               "time_below_control_line_s": float(np.sum((sm < 10) & run) * (t[1] - t[0])) if len(t) > 1 else 0.0,
               "max_discharge_c": float(max(cmp["T_out_c"])), "max_pressure_bara": float(max(max(out_n[v]["P_bara"]) for v in vols)),
               "settle_out_bara": float((ps_ + pd_) / 2) if abs(pd_ - ps_) < 0.03 * pd_ else None, "surge_cycles": cyc, "surge_times_s": surge_t[:20],
               "end_pressures_bara": dict(zip(vols, P_end)), "verdict": "fail" if surge else "pass", "stop_time_s": stop, "final_speed_frac": float(nf[-1])}
    return {"t": t.tolist(), "nodes": out_n, "links": out_l, "compressor": cmp, "summary": summary,
            "map": {"q": (np.asarray(md.fq) * 3600).tolist(), "h": (np.asarray(md.fh) / 1e3).tolist(), "q_surge": md.qs * 3600, "h_surge": md.hs / 1e3}}
