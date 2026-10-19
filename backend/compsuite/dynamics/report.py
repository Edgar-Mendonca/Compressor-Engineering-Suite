"""Dynamic simulation report in the house style: scope and method, system model (P&ID, equipment, valves,
controllers, driver and inertia, map), scenario and events, results (map trajectory and trends), comparison of
all studies, conclusions and sign-off."""

from __future__ import annotations

import io

import numpy as np

from compsuite.testing.drawings import Doc
from compsuite.testing.mrt import cover_info, doc_info, style

PAL = ["#0b5cad", "#2e9e6b", "#d1782a", "#7b3fb5", "#c0392b", "#5b6878", "#0a9396"]


def pid_drawing(ax, net: dict):
    """Simplified P&ID (ISA-style symbols): vessels, cooler, compressor, valves, check valve, lines and tags."""
    from matplotlib.patches import Circle, FancyBboxPatch, Polygon
    pos = {n["id"]: (n["x"], -n["y"]) for n in net["nodes"]}
    for n in net["nodes"]:
        x, y = pos[n["id"]]
        if n["type"] in ("source", "sink"):
            d = 1 if n["type"] == "source" else -1
            ax.add_patch(Polygon([(x - 28 * d, y + 14), (x + 10 * d, y + 14), (x + 28 * d, y), (x + 10 * d, y - 14), (x - 28 * d, y - 14)], fc="#eef2f6", ec="#2b3440", lw=0.8, zorder=3))
        elif n["type"] == "cooler":
            ax.add_patch(Circle((x, y), 26, fc="#e8f4fb", ec="#2b3440", lw=0.9, zorder=3))
            ax.plot([x - 18, x - 8, x, x + 8, x + 18], [y - 6, y + 8, y - 8, y + 8, y - 6], color="#0b5cad", lw=1, zorder=4)
        else:
            ax.add_patch(FancyBboxPatch((x - 16, y - 34), 32, 68, boxstyle="round,pad=0,rounding_size=14", fc="#eef2f6", ec="#2b3440", lw=0.9, zorder=3))
        ax.text(x, y - 48, n["id"], ha="center", fontsize=6.5, weight="bold", color="#0c1a2b")
        ax.text(x, y - 60, n["label"][:22], ha="center", fontsize=5.5, color="#5b6878")
    vpos = {}
    for k, l in enumerate(net["links"]):
        (x0, y0), (x1, y1) = pos[l["from"]], pos[l["to"]]
        back = x1 < x0                     # recycle lines run below the main line
        dy = -110 - 40 * (k % 2) if back else 0
        pts = [(x0, y0), (x0, y0 + dy), (x1, y1 + dy), (x1, y1)] if back else [(x0, y0), (x1, y1)]
        ax.plot(*zip(*pts), color="#0b5cad" if back else "#2b3440", lw=1.1, zorder=1)
        mx, my = ((x0 + x1) / 2, y0 + dy) if back else ((x0 + x1) / 2, (y0 + y1) / 2)
        vpos[l["id"]] = (mx, my)
        if l["type"] == "compressor":
            ax.add_patch(Polygon([(mx - 28, my + 24), (mx + 28, my + 12), (mx + 28, my - 12), (mx - 28, my - 24)], fc="#c9d6e3", ec="#0c1a2b", lw=1.1, zorder=3))
            ax.text(mx, my + 32, l["id"], ha="center", fontsize=6.5, weight="bold")
        elif l["type"] == "pipe":
            continue
        else:
            ax.add_patch(Polygon([(mx - 12, my + 8), (mx + 12, my - 8), (mx + 12, my + 8), (mx - 12, my - 8)], fc="white" if l["type"] != "check" else "#2b3440", ec="#2b3440", lw=0.9, zorder=3))
            if l["type"] != "check":
                ax.plot([mx, mx], [my, my + 16], color="#2b3440", lw=0.8, zorder=3)
                ax.add_patch(Polygon([(mx - 7, my + 16), (mx + 7, my + 16), (mx, my + 22)], fc="#2b3440", zorder=3))
            ax.text(mx, my + (28 if l["type"] != "check" else 14), l["id"], ha="center", fontsize=6, weight="bold")
    for c in net.get("controllers", []):
        if c.get("valve") in vpos:
            mx, my = vpos[c["valve"]]
            ax.plot([mx, mx + 40], [my + 22, my + 50], color="#c0392b", lw=0.6, ls="--", zorder=2)
            ax.add_patch(Circle((mx + 52, my + 58), 14, fc="white", ec="#c0392b", lw=0.9, zorder=3))
            ax.text(mx + 52, my + 58, c["id"].split("-")[0], ha="center", va="center", fontsize=5.5, color="#c0392b", zorder=4)
    xs = [p[0] for p in pos.values()]
    ax.set_xlim(min(xs) - 60, max(xs) + 60)
    ax.set_ylim(min(p[1] for p in pos.values()) - 200, max(p[1] for p in pos.values()) + 260)
    ax.set_aspect("equal")
    ax.axis("off")


def _plot(d, h, series, xl, yl, title, hl=(), vl=()):
    ax = d.fig.add_axes([0.11, d.y - h, 0.8, h - 0.035])
    for i, (x, y, lab) in enumerate(series):
        ax.plot(x, y, lw=1.1, color=PAL[i % len(PAL)], label=lab)
    for v, lab, c in hl:
        ax.axhline(v, color=c, ls="--", lw=0.8, label=lab)
    for v in vl:
        ax.axvline(v, color="#9aa3ab", ls=":", lw=0.8)
    style(ax, xl, yl, title)
    ax.legend(fontsize=5.8, frameon=False, ncol=3)
    d.y -= h + 0.02
    return ax


def dynamics_report(project, net: dict, sc: dict, res: dict, comp: list, pid_png: str | None = None) -> bytes:
    from matplotlib.backends.backend_pdf import PdfPages
    info = doc_info(project, "Compressor dynamic simulation report")
    s, t, cm = res["summary"], np.asarray(res["t"]), res["compressor"]
    ev_t = sorted({e["t"] for e in sc.get("events", [])})
    buf = io.BytesIO()
    with PdfPages(buf) as pdf:
        d = Doc(pdf, "Compressor system dynamics - ESD, trip, anti-surge, start-up and settle-out", info)
        chips = [("Surge during the study", "YES" if s["surge"] else "NO", "fail" if s["surge"] else "pass"),
                 ("Minimum surge margin", f"{s['min_surge_margin_pct']:.1f} %" if s["min_surge_margin_pct"] is not None else "-", "pass" if not s["surge"] else "fail"),
                 ("Surge cycles", str(s["surge_cycles"]), "pass" if not s["surge_cycles"] else "fail"),
                 ("Max discharge temperature", f"{s['max_discharge_c']:.0f} C", "pass"),
                 ("Max pressure", f"{s['max_pressure_bara']:.1f} bara", "pass"),
                 ("Settle-out pressure", f"{s['settle_out_bara']:.1f} bara" if s.get("settle_out_bara") else "-", "review")]
        d.cover("Compressor dynamic simulation report", cover_info(project, info, [("Study", sc.get("title", "")[:44]), ("Duration", f"{sc.get('duration_s', 0):.0f} s"),
                                                                                  ("Driver", net["driver"]["type"]), ("Verdict", s["verdict"].upper())]),
                pid_png, None if pid_png else (lambda ax: pid_drawing(ax, net)), chips)

        d.page("1  Scope, method and assumptions")
        d.line("Dynamic (time-domain) simulation of the compressor system for the study below: the compressor with its suction and discharge volumes, "
               "cooler, check valve, anti-surge (recycle) and other valves, the driver and the train inertia, and the controllers. The model answers "
               "whether the compressor surges, how far the operating point moves on the map, how the pressures, flows, temperatures and speed change, "
               "and what pressure the system settles out to.", 8)
        d.heading("Method")
        for x in ("Lumped volumes: mass and energy balances; real-gas Z, cp and k from the design suction state (held constant).",
                  "Compressor: performance map collapsed by the fan laws and calibrated to the rated point; extended left of surge to the shut-off head "
                  "and into reverse flow; duct inertia (Greitzer) so that surge and flow reversal develop in time.",
                  "Pressure ratio and discharge temperature from the real-gas polytropic exponents of the rated case.",
                  "Valves: ISA / IEC 60534-2-1 gas sizing with expansion factor and choked flow; stroke-time limited; linear, equal % or quick-opening trim.",
                  "Shaft: driver torque - gas torque - losses = J dw/dt with the train inertia referred to the compressor (torsional model); "
                  "speed controller with ramp rate and torque limit; on a trip the driver torque is zero.",
                  "Anti-surge controller: PI on the flow margin to the surge line at the current speed, control line and recycle trip line (fast open), "
                  "opens fully on a trip when configured.",
                  "Integration: SciPy LSODA (stiff / non-stiff switching), events applied at their times."):
            d.line("- " + x, 7.6)
        d.heading("Limitations")
        d.line("Preliminary engineering: constant gas properties, a single-section map and lumped volumes; acoustic (wave) effects in long pipes are "
               "not modelled. Valve dead times are not modelled. Detailed anti-surge design should be confirmed with the vendor map and a detailed model.", 7.5, "#5b6878")

        d.page("2  System model")
        d.image(pid_png, [0.05, d.y - 0.3, 0.9, 0.29]) or pid_drawing(d.drawing([0.05, d.y - 0.3, 0.9, 0.29]), net)
        d.y -= 0.32
        d.table(["Node", "Type", "Description", "Volume m3", "Initial bara", "T C"],
                [(n["id"], n["type"], n["label"][:28], f"{n['V_m3']:.1f}" if n.get("V_m3") else "-", f"{n['P_bara']:.1f}", f"{n['T_c']:.0f}") for n in net["nodes"]],
                [0.07, 0.18, 0.3, 0.6, 0.72, 0.84], 7)
        d.table(["Link", "Type", "Description", "From - to", "Cv", "Open", "Stroke s", "Trim"],
                [(l["id"], l["type"], l["label"][:26], f"{l['from']} - {l['to']}", f"{l['Cv']:.0f}" if l.get("Cv") else "-", f"{l.get('open', 1) * 100:.0f} %" if l["type"] != "compressor" else "-",
                  f"{l.get('stroke_s', '-')}", l.get("char", "-") if l["type"] == "valve" else "-") for l in net["links"]],
                [0.07, 0.16, 0.26, 0.5, 0.66, 0.73, 0.8, 0.87], 6.8)
        d.table(["Controller", "Type", "Acts on", "Settings"],
                [(c["id"], c["type"], c.get("valve", "-"), f"control line {c.get('margin', 0) * 100:.0f} %, trip line {c.get('trip_line', 0) * 100:.0f} %, Kp {c.get('kp')}, Ti {c.get('ti_s')} s"
                  if c["type"] == "antisurge" else f"set-point {c.get('setpoint')} bara, Kp {c.get('kp')}, Ti {c.get('ti_s')} s") for c in net.get("controllers", [])],
                [0.07, 0.2, 0.33, 0.45], 7, 80)
        dr, g = net["driver"], net["gas"]
        d.line(f"Driver: {dr['type']}, rated {dr['rated_kw']:.0f} kW, train inertia referred to the compressor {dr['J_kgm2']:.2f} kg m2, speed set-point "
               f"{dr['speed_setpoint'] * 100:.1f} %, ramp {dr.get('ramp_frac_s', 0.02) * 100:.1f} %/s. Gas: MW {g['mw']:.2f}, Z {g['Z']:.3f}, k {g['k']:.3f}, cp {g['cp']:.0f} J/kg K.", 7.5)

        d.page("3  Scenario and events")
        d.line(sc.get("title", ""), 9, bold=True)
        d.table(["Time s", "Action", "Element", "Value"],
                [(f"{e['t']:.1f}", e["action"], e.get("id", "-"), e.get("open", e.get("value", e.get("on", "-")))) for e in sc.get("initial", []) + sc.get("events", [])],
                [0.07, 0.2, 0.4, 0.6], 7.5)
        d.heading("Result summary")
        d.summary(chips)
        if s.get("surge_times_s"):
            d.line("Surge (flow reversal) starts at t = " + ", ".join(f"{x:.2f}" for x in s["surge_times_s"][:10]) + " s.", 7.5, "#c0392b")

        d.page("4  Operating point on the compressor map")
        mp = res["map"]
        ax = d.fig.add_axes([0.11, 0.5, 0.8, 0.4])
        qn, hn = np.asarray(mp["q"]), np.asarray(mp["h"])
        for f in (0.5, 0.7, 0.9, 1.0, 1.05):
            ax.plot(qn * f, hn * f * f, color="#9aa3ab", lw=0.7)
            ax.text(qn[-1] * f, hn[-1] * f * f, f"{f * 100:.0f} %", fontsize=5.5, color="#5b6878")
        ff = np.linspace(0.3, 1.08, 20)
        ax.plot(mp["q_surge"] * ff, mp["h_surge"] * ff ** 2, color="#c0392b", lw=1.2, label="Surge line")
        mg = next((c.get("margin", 0.1) for c in net.get("controllers", []) if c["type"] == "antisurge"), 0.1)
        ax.plot(mp["q_surge"] * ff * (1 + mg), mp["h_surge"] * ff ** 2, color="#d1782a", lw=0.9, ls="--", label="Control line")
        sca = ax.scatter(cm["q_am3_h"], cm["head_kj_kg"], c=t, s=3, cmap="viridis", zorder=4)
        ax.plot(cm["q_am3_h"][0], cm["head_kj_kg"][0], "o", color="#0b5cad", ms=6, label="Start")
        d.fig.colorbar(sca, ax=ax, pad=0.01).set_label("Time (s)", fontsize=6.5)
        ax.set_xlim(min(0, min(cm["q_am3_h"])) * 1.05, max(qn) * 1.15)
        ax.set_ylim(0, max(hn) * 1.25)
        style(ax, "Actual suction flow (m3/h)", "Polytropic head (kJ/kg)", "Trajectory of the operating point (colour = time)")
        ax.legend(fontsize=6, frameon=False)
        d.y = 0.44
        _plot(d, 0.33, [(t, cm["surge_margin"], "Flow margin to surge")], "Time (s)", "Margin (%)", "Surge margin",
              hl=[(mg * 100, "Control line", "#d1782a"), (0, "Surge", "#c0392b")], vl=ev_t)

        d.page("5  Trends")
        _plot(d, 0.21, [(t, np.asarray(cm["speed_frac"]) * 100, "Speed (%)")], "Time (s)", "Speed (%)", "Shaft speed", vl=ev_t)
        _plot(d, 0.21, [(t, res["nodes"][n["id"]]["P_bara"], n["id"]) for n in net["nodes"] if n["type"] not in ("source", "sink")], "Time (s)", "Pressure (bara)", "Pressures", vl=ev_t)
        _plot(d, 0.21, [(t, res["links"][l["id"]]["mdot_kg_s"], l["id"]) for l in net["links"] if l["type"] != "pipe"], "Time (s)", "Mass flow (kg/s)", "Flows (negative = reverse)", vl=ev_t)
        d.page("5  Trends (continued)")
        _plot(d, 0.21, [(t, np.asarray(res["links"][l["id"]]["open"]) * 100, l["id"]) for l in net["links"] if l["type"] in ("valve", "check")], "Time (s)", "Opening (%)", "Valve positions", vl=ev_t)
        _plot(d, 0.21, [(t, cm["power_kw"], "Gas power"), (t, cm["Td_kw"], "Driver power")], "Time (s)", "Power (kW)", "Power", vl=ev_t)
        _plot(d, 0.21, [(t, cm["T_out_c"], "Compressor discharge")] + [(t, res["nodes"][n["id"]]["T_c"], n["id"]) for n in net["nodes"] if n["type"] not in ("source", "sink")],
              "Time (s)", "Temperature (C)", "Temperatures", vl=ev_t)

        if comp:
            d.page("6  Comparison of the studies")
            d.table(["Study", "Surge", "Cycles", "Min margin %", "Max bara", "Max T C", "Settle-out", "Verdict"],
                    [(ti[:44], "yes" if x["surge"] else "no", x["surge_cycles"], f"{x['min_surge_margin_pct']:.1f}" if x["min_surge_margin_pct"] is not None else "-",
                      f"{x['max_pressure_bara']:.1f}", f"{x['max_discharge_c']:.0f}", f"{x['settle_out_bara']:.1f}" if x.get("settle_out_bara") else "-", x["verdict"])
                     for _, ti, x in comp], [0.07, 0.43, 0.5, 0.57, 0.66, 0.74, 0.81, 0.88], 6.5, 46)

        d.page("7  Conclusions")
        if s["surge"]:
            d.line(f"The compressor surges in this study ({s['surge_cycles']} cycle(s), first at t = {s['surge_times_s'][0]:.2f} s). Typical remedies: a faster "
                   "or larger anti-surge valve, a hot-gas bypass taken off close to the discharge nozzle, a check valve closer to the nozzle (less volume to "
                   "depressurise), a larger control margin or more train inertia.", 8.5, "#c0392b")
        else:
            d.line(f"The compressor stays on the stable side of the surge line through this study (minimum margin {s['min_surge_margin_pct']:.1f} %).", 8.5, "#1f7a4d")
        if s.get("settle_out_bara"):
            d.line(f"Settle-out pressure of the isolated loop {s['settle_out_bara']:.1f} bara: check it against the casing and seal design pressures and the "
                   "restart (settle-out) start-up torque.", 8.5)
        d.line(f"Maximum discharge temperature {s['max_discharge_c']:.0f} C; maximum system pressure {s['max_pressure_bara']:.1f} bara.", 8.5)
        d.signoff((project.test_doc or {}).get("signoff"), ("Prepared - process / control engineer", "Checked - rotating equipment engineer", "Approved - engineering manager"))
        d.close()
    return buf.getvalue()
