"""Technical documentation: datasheet, calculation report (HTML and PDF),
Excel workbook, with full traceability of methods, assumptions and inputs."""

from __future__ import annotations

import io
import math
from datetime import datetime, timezone

import pandas as pd
from jinja2 import Environment, select_autoescape

from compsuite.core.trace import jsonable
from compsuite.core.workflow import collect_traces
from compsuite.reporting.figures import all_figures


def _f(v, nd=1):
    if v is None:
        return "-"
    if isinstance(v, float):
        if not math.isfinite(v):
            return "-"
        return f"{v:,.{nd}f}"
    return str(v)


def datasheet(project, res: dict) -> list[tuple[str, list[tuple[str, str, str]]]]:
    sz, cas = res["sizing"], res["casings"][0]
    rot, lat = cas["rotor"], cas["lateral"]
    g = res["gas"]
    dc = project.design_case()
    st = g["suction_state"]
    groups = [
        ("General", [("Project", project.name, ""), ("Revision", str(project.revision), ""),
                     ("Configuration", sz["configuration"], ""), ("Type", sz["type_selection"]["recommended"], ""),
                     ("Driver", project.design_basis.driver_type.replace("_", " "), "")]),
        ("Gas", [("Molecular weight", _f(g["mw"], 2), "kg/kmol"), ("Z suction", _f(st.Z if hasattr(st, "Z") else st["Z"], 4), "-"),
                 ("Property model", g["engine"], ""), ("H2S partial pressure (suction)", _f(g["ph2s_suction_bar"], 3), "bar")]),
        ("Rated conditions", [("Suction pressure", _f(dc.suction_pressure_bara, 2), "bara"),
                              ("Suction temperature", _f(dc.suction_temperature_c, 1), "°C"),
                              ("Discharge pressure", _f(dc.discharge_pressure_bara, 2), "bara"),
                              ("Mass flow", _f(sz["mass_flow_kg_s"], 2), "kg/s"),
                              ("Suction volume flow", _f(sz["suction_volume_flow_m3_s"] * 3600, 0), "Am³/h"),
                              ("Polytropic head", _f(sz["polytropic_head_total_j_kg"] / 1e3, 1), "kJ/kg"),
                              ("Polytropic efficiency", _f(sz["polytropic_efficiency_overall"], 3), "-"),
                              ("Shaft power", _f(sz["shaft_power_kw"], 0), "kW"),
                              ("Driver rating", _f(sz["driver_rating_kw"], 0), "kW"),
                              ("Discharge temperature", _f(sz["stages"][-1]["T_out_c"], 1), "°C")]),
        ("Aerodynamic design", [("Impellers", str(sz["n_stages"]), ""), ("Rated speed", _f(sz["speed_rpm"], 0), "rpm"),
                                ("Impeller diameter", _f(sz["impeller_diameter_m"] * 1e3, 0), "mm"),
                                ("Tip speed", _f(sz["tip_speed_m_s"], 1), "m/s"), ("Machine Mach", _f(sz["machine_mach"], 3), "-"),
                                ("First-stage flow coefficient", _f(sz["stages"][0]["phi"], 4), "-")]),
        ("Rotor", [("Rotor mass", _f(cas["mass_properties"]["mass_kg"], 0), "kg"),
                   ("Bearing span", _f(rot["bearing_span_m"] * 1e3, 0), "mm"),
                   ("Shaft diameter at impellers", _f(rot["shaft_diameter_impellers_m"] * 1e3, 0), "mm"),
                   ("Journal diameter", _f(rot["journal_diameter_m"] * 1e3, 0), "mm"),
                   ("Balance piston diameter", _f(rot["balance_piston_diameter_m"] * 1e3, 0), "mm"),
                   ("Residual thrust", _f(rot["thrust"]["residual_n"] / 1e3, 1), "kN"),
                   ("Shaft material", project.shaft.material, ""), ("Impeller material", project.shaft.impeller_material, ""),
                   ("Casing material", project.casing_material, "")]),
        ("Rotordynamics", [("Speed range", f"{lat['speeds']['min_rpm']:.0f} - {lat['speeds']['mcs_rpm']:.0f}", "rpm"),
                           ("Trip speed", _f(lat["speeds"]["trip_rpm"], 0), "rpm"),
                           ("Critical speeds (AF >= 2.5)", ", ".join(str(c) for c in res["summary"]["critical_speeds_rpm"]) or "none", "rpm"),
                           ("Level I log dec with Qa", _f(lat["stability"]["logdec_with_qa"], 3), "-"),
                           ("Qa (modified Wachel)", _f(lat["stability"]["qa_n_m"] / 1e6, 2), "MN/m"),
                           ("First torsional mode", _f(res["torsional"]["natural"]["modes"][0]["freq_hz"], 1), "Hz")]),
        ("Bearings and seals", [("Journal bearing type", project.bearings.journal_type.replace("_", " "), ""),
                                ("Shaft-end seals", project.seals.shaft_end_seal.replace("_", " "), ""),
                                ("Lube oil flow (normal)", _f(res["lube"]["normal_flow_l_min"], 0), "L/min"),
                                ("Bearing + thrust losses", _f(res["lube"]["total_loss_kw"], 1), "kW")]),
    ]
    return groups


TEMPLATE = """<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>{{ project.name }} - calculation report</title>
<style>
 :root { --ink:#1f2933; --muted:#5f6b7a; --line:#d5dbe1; --pass:#2e7d4f; --fail:#b3261e; --att:#9a6700; --bg:#ffffff; }
 body { font: 13px/1.45 system-ui, -apple-system, Segoe UI, sans-serif; color: var(--ink); background: var(--bg); margin: 0; }
 main { max-width: 960px; margin: 0 auto; padding: 24px 16px 64px; }
 h1 { font-size: 22px; margin: 0 0 4px; } h2 { font-size: 16px; margin: 28px 0 8px; border-bottom: 1px solid var(--line); padding-bottom: 4px; }
 h3 { font-size: 13px; margin: 16px 0 6px; } .muted { color: var(--muted); }
 table { border-collapse: collapse; width: 100%; margin: 6px 0 12px; font-variant-numeric: tabular-nums; }
 th, td { text-align: left; padding: 3px 8px; border-bottom: 1px solid var(--line); vertical-align: top; }
 th { font-weight: 600; background: #f4f6f8; } td.num { text-align: right; }
 .pass { color: var(--pass); font-weight: 600; } .fail { color: var(--fail); font-weight: 600; } .attention { color: var(--att); font-weight: 600; }
 .review { color: var(--muted); font-weight: 600; }
 .notice { border-left: 3px solid var(--att); background: #fff8e6; padding: 8px 12px; margin: 12px 0; }
 img { max-width: 100%; } .figs { display: grid; grid-template-columns: repeat(auto-fit, minmax(420px, 1fr)); gap: 12px; }
 .wrap { overflow-x: auto; }
 @media print { main { max-width: none; } h2 { break-after: avoid; } .figs { display: block; } img { break-inside: avoid; } }
</style></head><body><main>
<h1>{{ project.name }}</h1>
<div class="muted">{{ project.description }} · Revision {{ project.revision }} · compsuite {{ res.software_version }} ·
 input hash {{ res.input_hash }} · generated {{ now }}</div>
<div class="notice">Preliminary engineering results for design studies and comparison. Not a certificate of compliance with
 API 617, API 614, API 692, ISO 15156 or other standards. Criteria basis: {{ res.checklist.criteria_edition }}.
 Detailed design and safety-critical conclusions require qualified engineering review.</div>

<h2>1. Summary</h2>
<table><tr><th>Checklist</th><td><span class="pass">{{ res.checklist.counts.pass }} pass</span> ·
 <span class="fail">{{ res.checklist.counts.fail }} fail</span> · <span class="attention">{{ res.checklist.counts.attention }} attention</span> ·
 <span class="review">{{ res.checklist.counts.review }} for review</span></td></tr>
{% for w in res.summary.warnings %}<tr><th>Warning</th><td>{{ w }}</td></tr>{% endfor %}</table>

<h2>2. Datasheet</h2>
{% for title, rows in sheet %}<h3>{{ title }}</h3><table>{% for k, v, u in rows %}<tr><th style="width:45%">{{ k }}</th><td>{{ v }} {{ u }}</td></tr>{% endfor %}</table>{% endfor %}

<h2>3. Figures</h2><div class="figs">{% for t, b64 in figs.items() %}<figure><img alt="{{ t }}" src="data:image/png;base64,{{ b64 }}"></figure>{% endfor %}</div>

<h2>4. Operating cases</h2><div class="wrap"><table><tr><th>Case</th><th>Ps bara</th><th>Ts °C</th><th>Pd bara</th><th>Flow kg/s</th>
<th>Head kJ/kg</th><th>ηp</th><th>Td °C</th><th>Power kW</th><th>Speed %</th><th>Surge margin</th></tr>
{% for c, op in cases %}<tr><td>{{ c.case }}</td><td class="num">{{ f(c.suction.P/1e5, 2) }}</td><td class="num">{{ f(c.suction.T-273.15) }}</td>
<td class="num">{{ f(c.discharge.P/1e5, 2) }}</td><td class="num">{{ f(c.mass_flow_kg_s, 2) }}</td><td class="num">{{ f(c.polytropic_head_j_kg/1e3) }}</td>
<td class="num">{{ f(c.polytropic_efficiency, 3) }}</td><td class="num">{{ f(c.discharge.T-273.15) }}</td><td class="num">{{ f(c.shaft_power_kw, 0) }}</td>
<td class="num">{{ f((op.speed_frac or 0)*100) }}</td><td class="num">{{ f((op.surge_margin or 0)*100) }} %</td></tr>{% endfor %}</table></div>

<h2>5. Stage design</h2><div class="wrap"><table><tr><th>Stage</th><th>φ</th><th>ψ</th><th>ηp</th><th>P in</th><th>P out</th><th>T out °C</th>
<th>b2 mm</th><th>Eye mm</th><th>Mass kg</th><th>Thrust kN</th></tr>
{% for s, i in stages %}<tr><td>{{ s.index+1 }}</td><td class="num">{{ f(s.phi,4) }}</td><td class="num">{{ f(s.psi,3) }}</td><td class="num">{{ f(s.eta,3) }}</td>
<td class="num">{{ f(s.P_in_bara,2) }}</td><td class="num">{{ f(s.P_out_bara,2) }}</td><td class="num">{{ f(s.T_out_c) }}</td><td class="num">{{ f(i.b2_mm) }}</td>
<td class="num">{{ f(i.D1_eye_mm,0) }}</td><td class="num">{{ f(i.mass_kg) }}</td><td class="num">{{ f(i.thrust_n/1e3,1) }}</td></tr>{% endfor %}</table></div>

<h2>6. Verification checklist</h2><div class="wrap"><table><tr><th>Category</th><th>Check</th><th>Criterion</th><th>Value</th><th>Status</th><th>Reference</th></tr>
{% for i in res.checklist["items"] %}<tr><td>{{ i.category }}</td><td>{{ i.check }}{% if i.note %}<div class="muted">{{ i.note }}</div>{% endif %}</td>
<td>{{ i.criterion }}</td><td>{{ i.value }}</td><td class="{{ i.status }}">{{ i.status }}</td><td>{{ i.reference }}</td></tr>{% endfor %}</table></div>

<h2>7. Methods, assumptions and traceability</h2>
{% for t in traces %}<h3>{{ t.module }} — {{ t.method }}</h3><div class="muted">engine: {{ t.engine }} · version {{ t.version }} ·
 inputs {{ t.inputs_hash }}</div>
{% if t.assumptions %}<ul>{% for a in t.assumptions %}<li>{{ a }}</li>{% endfor %}</ul>{% endif %}
{% if t.references %}<div class="muted">References: {{ t.references | join("; ") }}</div>{% endif %}
{% if t.warnings %}<ul>{% for w in t.warnings %}<li class="attention">{{ w }}</li>{% endfor %}</ul>{% endif %}{% endfor %}
</main></body></html>"""


def report_html(project, res: dict) -> str:
    env = Environment(autoescape=select_autoescape(["html"]))
    tpl = env.from_string(TEMPLATE)
    cas = res["casings"][0]
    imps = {i["index"]: i for c in res["casings"] for i in c["impellers"]["impellers"]}
    return tpl.render(project=project, res=jsonable({k: v for k, v in res.items() if k not in ("casings",)}) | {"casings": None},
                      sheet=datasheet(project, res), figs=all_figures(res), f=_f, now=datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M UTC"),
                      cases=list(zip(jsonable(res["cases"]), jsonable(res["operating_points"]))),
                      stages=[(s, imps[s["index"]]) for s in jsonable(res["sizing"]["stages"])],
                      traces=collect_traces(res), cas=cas)


UNITS = {"kw": "kW", "mm": "mm", "kg": "kg", "n": "N", "um": "um", "mpa": "MPa", "c": "C", "rpm": "rpm", "m": "m", "pct": "%", "bar": "bar", "bara": "bara",
         "kg_s": "kg/s", "l_min": "l/min", "m2": "m2", "n_m": "N/m", "m3_h": "m3/h", "cst": "cSt", "hz": "Hz", "cpm": "cpm", "kgm2": "kg m2"}


def _head(k: str) -> str:
    """'oil_flow_l_min' -> 'Oil flow l/min'."""
    parts = k.split("_")
    for n in (2, 1):
        u = "_".join(parts[-n:])
        if len(parts) > n and u in UNITS:
            return " ".join(parts[:-n]).capitalize() + " " + UNITS[u]
    return k.replace("_", " ").capitalize()


def _rows(items: list, keys: list | None = None, n: int = 7):
    """Generic table of a list of result dicts: label column + the first n scalar fields."""
    items = [i for i in items if isinstance(i, dict)]
    if not items:
        return [], []
    keys = keys or [k for k, v in items[0].items() if isinstance(v, (int, float, str)) and not k.startswith("_") and k != "trace"][:n]
    return [_head(k) for k in keys], [[_f(i.get(k), 3 if isinstance(i.get(k), float) and abs(i.get(k)) < 10 else 1) for k in keys] for i in items]


def _xs(n: int, x0=0.07, w=0.86):
    return [x0 + w * j / n for j in range(n)]


def _figpng(fig) -> bytes:
    import matplotlib.pyplot as plt
    b = io.BytesIO()
    fig.savefig(b, format="png", dpi=200, bbox_inches="tight", facecolor="white")
    plt.close(fig)
    return b.getvalue()


def report_pdf(project, res: dict) -> bytes:
    """Design-study report in the house style (cover, contents, header / footer, sign-off): summary and datasheet,
    gas and operating cases, compressor map, stage design, impellers, rotor and shaft, bearings and seals, lateral,
    stability, torsional, auxiliaries, verification checklist, methods and traceability."""
    from matplotlib.backends.backend_pdf import PdfPages

    from compsuite.reporting import figures as F
    from compsuite.reporting.rotordynamics_reports import mode_on_rotor, rotor_drawing, train_drawing
    from compsuite.testing.drawings import Doc
    from compsuite.testing.mrt import cover_info, doc_info
    cas = res["casings"][0]
    lat, sm, ck = cas["lateral"], res["summary"], res["checklist"]
    info = doc_info(project, "Compressor design report")
    buf = io.BytesIO()

    def fig(d, f, h=0.36, title=None):
        if d.y - h < 0.07:
            d.page("(continued)")
        if title:
            d.line(title, 8.5, bold=True)
        d.image(_figpng(f), [0.07, d.y - h, 0.86, h])
        d.y -= h + 0.015

    def table(d, title, head_rows, fs=6.8):
        head, rows = head_rows
        if rows:
            d.heading(title)
            d.table(head, rows, _xs(len(head)), fs, 30)

    with PdfPages(buf) as pdf:
        d = Doc(pdf, f"Centrifugal compressor design study - CentriForge {res['software_version']}", info)
        cnt = ck["counts"]
        d.cover("Compressor design report", cover_info(project, info, [("Configuration", sm.get("configuration", "-")), ("Speed", f"{sm['speed_rpm']:.0f} rpm"),
                                                                      ("Stages / casings", f"{sm['stages']} / {sm['casings']}"), ("Shaft power", f"{sm['shaft_power_kw']:.0f} kW")]),
                None, lambda ax: rotor_drawing(ax, cas["rotor"], lat["z_m"]),
                [("Checklist pass", str(cnt.get("pass", 0)), "pass"), ("Checklist fail", str(cnt.get("fail", 0)), "fail" if cnt.get("fail") else "pass"),
                 ("Attention", str(cnt.get("attention", 0)), "attention" if cnt.get("attention") else "pass"), ("For review", str(cnt.get("review", 0)), "review"),
                 ("Lateral (API 617)", "", "pass" if lat.get("conclusion", {}).get("pass") else "review"),
                 ("Torsional (API 617)", "", "pass" if res["torsional"].get("conclusion", {}).get("pass", True) else "review")])

        d.page("1  Summary and datasheet")
        d.line(f"{project.description or project.name}. Revision {project.revision}; input hash {res['input_hash']}. Preliminary engineering results - not a "
               "certificate of compliance; detailed design and safety-critical conclusions require qualified review.", 8)
        for w in sm.get("warnings", [])[:8]:
            d.line("! " + w, 7.5, "#a8650c")
        for title, rows in datasheet(project, res):
            d.heading(title)
            d.table(["Item", "Value", "Unit"], rows, [0.07, 0.5, 0.75], 7, 60)

        d.page("2  Gas and operating cases")
        g = res["gas"]
        d.line(f"Gas: MW {g['mw']:.2f}; property engine {g['engine']}; hydrocarbon dew point {_f(g.get('hydrocarbon_dew_point_c'))} C; "
               f"pH2S {_f(g.get('ph2s_suction_bar'), 3)} bar, pCO2 {_f(g.get('pco2_suction_bar'), 3)} bar.", 8)
        d.table(["Case", "Ps bara", "Ts C", "Pd bara", "Flow kg/s", "Head kJ/kg", "eta p", "Td C", "Power kW", "Speed %", "Surge m. %"],
                [(c["case"], _f(c["suction"]["P"] / 1e5, 2), _f(c["suction"]["T"] - 273.15), _f(c["discharge"]["P"] / 1e5, 2), _f(c["mass_flow_kg_s"], 2),
                  _f(c["polytropic_head_j_kg"] / 1e3), _f(c["polytropic_efficiency"], 3), _f(c["discharge"]["T"] - 273.15), _f(c["shaft_power_kw"], 0),
                  _f((op.get("speed_frac") or 0) * 100), _f((op.get("surge_margin") or 0) * 100))
                 for c, op in zip(jsonable(res["cases"]), jsonable(res["operating_points"]))], _xs(11), 6.5, 16)
        if res["performance_map"]["lines"]:
            fig(d, F.compressor_map(res), 0.42, "Performance map: speed lines, surge and choke, operating points")

        d.page("3  Stage and impeller design")
        imps = {i["index"]: i for c in res["casings"] for i in c["impellers"]["impellers"]}
        d.table(["Stage", "phi", "psi", "eta p", "P in", "P out", "T out C", "b2 mm", "Eye mm", "Mass kg", "Thrust kN"],
                [(s["index"] + 1, _f(s["phi"], 4), _f(s["psi"], 3), _f(s["eta"], 3), _f(s["P_in_bara"], 2), _f(s["P_out_bara"], 2), _f(s["T_out_c"]),
                  _f(imps[s["index"]]["b2_mm"]), _f(imps[s["index"]]["D1_eye_mm"], 0), _f(imps[s["index"]]["mass_kg"]), _f(imps[s["index"]]["thrust_n"] / 1e3, 1))
                 for s in jsonable(res["sizing"]["stages"])], _xs(11), 6.5, 14)
        table(d, "Impeller stresses (2D axisymmetric FEA)", _rows(jsonable((cas.get("impeller_fea") or {}).get("impellers", [])), n=8))

        d.page("4  Rotor, shaft and thrust")
        rotor_drawing(d.drawing([0.05, d.y - 0.22, 0.9, 0.21]), cas["rotor"], lat["z_m"])
        d.y -= 0.24
        mp = cas["mass_properties"]
        d.line(f"Rotor mass {mp['mass_kg']:.0f} kg, CG {mp['cg_m'] * 1e3:.0f} mm, Ip {mp['ip_kgm2']:.2f} kg m2; bearing span {cas['rotor']['bearing_span_m'] * 1e3:.0f} mm "
               f"(L/D {cas['rotor']['span_to_diameter']:.2f}); residual thrust {cas['rotor']['thrust']['residual_n'] / 1e3:.1f} kN. Shaft: min fatigue SF "
               f"{cas['shaft']['min_fatigue_safety']:.2f}, min yield SF {cas['shaft']['min_yield_safety']:.2f}, mid-span sag {cas['shaft']['midspan_sag_um']:.1f} um.", 8)
        fig(d, F.shaft_stress(cas["shaft"]), 0.33, "Shaft stresses and fatigue safety along the rotor")

        d.page("5  Bearings, seals and auxiliaries")
        b = jsonable(cas["bearings"].get("bearings", []))
        if isinstance(b, dict):
            table(d, "Journal bearings", _rows([{"bearing": k, **v.get("geometry", {})} for k, v in b.items()]))
            for k, v in b.items():
                table(d, f"{k} - dynamic coefficients vs speed", _rows(v.get("rows", []), ["speed_rpm", "kxx", "kyy", "kxy", "cxx", "cyy"]))
        se = jsonable(cas["seals"])
        table(d, "Labyrinth seals", _rows(se.get("labyrinths", []), n=7))
        es = se.get("end_seals") or {}
        if isinstance(es, dict):
            d.heading("End seals")
            d.table(["Item", "Value"], [(_head(k), _f(v, 3) if isinstance(v, float) else str(v)) for k, v in es.items() if isinstance(v, (int, float, str))], [0.07, 0.5], 7)
        d.line(f"Total Wachel cross-coupling {se.get('total_wachel_q_n_m', 0) / 1e6:.2f} MN/m; internal recirculation {_f(se.get('internal_recirculation_kg_s'), 3)} kg/s.", 7.5)
        lu = jsonable(res.get("lube") or {})
        if lu:
            d.heading("Lube oil system (API 614)")
            d.table(["Item", "Value"], [(_head(k), _f(v, 2)) for k, v in lu.items() if isinstance(v, (int, float))], [0.07, 0.5], 7)

        if "campbell" in lat:
            d.page("6  Lateral analysis (API 617 / API 684)")
            fig(d, F.campbell(lat), 0.33, "Damped Campbell diagram")
            fig(d, F.unbalance(lat), 0.33, "Unbalance response")
            d.page("6  Lateral analysis - mode shapes on the rotor model")
            bc = lat["bearing_cases"][len(lat["bearing_cases"]) // 2] if lat.get("bearing_cases") else None
            for j, m in enumerate((bc or {}).get("undamped_modes", [])[:3]):
                mode_on_rotor(d.drawing([0.06, d.y - 0.2, 0.88, 0.19]), cas["rotor"], lat["z_m"], m["shape"], f"Undamped mode {j + 1}: {m['freq_rpm']:.0f} rpm",
                              ["#0b5cad", "#2e9e6b", "#d1782a"][j])
                d.y -= 0.21
            table(d, f"Undamped critical speeds - {(bc or {}).get('label', '')}", _rows(jsonable((bc or {}).get("undamped_criticals", [])), ["mode", "kxx_rpm", "kyy_rpm"]))
            st = lat.get("stability", {})
            d.heading("Stability")
            d.line(f"First critical on rigid supports {_f(st.get('first_critical_rigid_rpm'), 0)} rpm; CSR {_f(st.get('critical_speed_ratio'), 2)}; "
                   f"QA {_f((st.get('qa_n_m') or 0) / 1e6, 2)} MN/m. Full details in the lateral and stability analysis reports.", 8)

        t = res["torsional"]
        d.page("7  Torsional analysis (API 617 / API 684)")
        if t.get("model"):
            train_drawing(d.drawing([0.05, d.y - 0.2, 0.9, 0.19]), t["model"])
            d.y -= 0.22
        table(d, "Torsional natural frequencies", _rows(jsonable(t.get("tnf", [])), ["mode", "freq_hz", "freq_cpm"]))
        fig(d, F.torsional_interference(t), 0.36, "Interference diagram")

        d.page("8  Verification checklist")
        d.line(f"{cnt.get('pass', 0)} pass, {cnt.get('fail', 0)} fail, {cnt.get('attention', 0)} attention, {cnt.get('review', 0)} for review.", 8, bold=True)
        d.table(["Status", "Category", "Check", "Value", "Reference"],
                [(i["status"], i["category"], i["check"], str(i["value"])[:24], str(i.get("reference", ""))[:28]) for i in ck["items"]],
                [0.07, 0.15, 0.29, 0.63, 0.78], 6.3, 48)

        d.page("9  Methods, assumptions and traceability")
        for tr in jsonable(collect_traces(res)):
            d.line(f"{tr['module']} - {tr['method']}", 8, "#0b5cad", True)
            for a_ in (tr.get("assumptions") or [])[:6]:
                d.line("- " + str(a_), 6.8)
            if tr.get("references"):
                d.line("References: " + "; ".join(map(str, tr["references"]))[:300], 6.5, "#5b6878")
        d.signoff((project.test_doc or {}).get("signoff"), ("Prepared - design engineer", "Checked - rotating equipment engineer", "Approved - engineering manager"))
        d.close()
    return buf.getvalue()


def results_excel(project, res: dict) -> bytes:
    buf = io.BytesIO()
    cas = res["casings"][0]
    with pd.ExcelWriter(buf, engine="openpyxl") as xw:
        rows = [(g, k, v, u) for g, items in datasheet(project, res) for k, v, u in items]
        pd.DataFrame(rows, columns=["Group", "Item", "Value", "Unit"]).to_excel(xw, sheet_name="Datasheet", index=False)
        pd.DataFrame([{k: v for k, v in jsonable(c).items() if not isinstance(v, (dict, list))} for c in res["cases"]]) \
            .to_excel(xw, sheet_name="Cases", index=False)
        pd.DataFrame(jsonable(res["operating_points"])).to_excel(xw, sheet_name="Operating points", index=False)
        pd.DataFrame(jsonable(res["sizing"]["stages"])).to_excel(xw, sheet_name="Stages", index=False)
        pd.DataFrame(jsonable(cas["impellers"]["impellers"])).to_excel(xw, sheet_name="Impellers", index=False)
        pd.DataFrame(cas["rotor"]["sections"]).to_excel(xw, sheet_name="Rotor sections", index=False)
        pd.DataFrame(cas["rotor"]["masses"]).to_excel(xw, sheet_name="Rotor masses", index=False)
        brg = []
        for label, b in cas["bearings"]["bearings"].items():
            for sp, r in zip(b["speeds_rpm"], b["rows"]):
                brg.append({"bearing": label, "speed_rpm": sp, **{k: v for k, v in jsonable(r).items()}})
        pd.DataFrame(brg).to_excel(xw, sheet_name="Bearing coefficients", index=False)
        peaks = [{"mode_case": c["mode"], **p} for c in cas["lateral"].get("unbalance_cases", []) for p in c["peaks"]]
        pd.DataFrame(jsonable(peaks)).to_excel(xw, sheet_name="Critical speeds", index=False)
        pd.DataFrame(jsonable(cas["shaft"]["points"])).drop(columns=["marin"], errors="ignore").to_excel(xw, sheet_name="Shaft stress", index=False)
        pd.DataFrame([{k: v for k, v in m.items() if k not in ("shape", "shaft_twist")} for m in res["torsional"]["natural"]["modes"]]) \
            .to_excel(xw, sheet_name="Torsional modes", index=False)
        pd.DataFrame(res["checklist"]["items"]).to_excel(xw, sheet_name="Checklist", index=False)
        pd.DataFrame([{"module": t.module, "method": t.method, "engine": t.engine, "version": t.version, "inputs_hash": t.inputs_hash,
                       "assumptions": " | ".join(t.assumptions), "references": " | ".join(t.references),
                       "warnings": " | ".join(t.warnings)} for t in collect_traces(res)]).to_excel(xw, sheet_name="Traceability", index=False)
        pd.DataFrame([{"path": k, "value": str(v)} for k, v in _flatten(jsonable(project))]).to_excel(xw, sheet_name="Inputs", index=False)
    return buf.getvalue()


def _flatten(obj, prefix=""):
    if isinstance(obj, dict):
        for k, v in obj.items():
            yield from _flatten(v, f"{prefix}.{k}" if prefix else k)
    elif isinstance(obj, list):
        for i, v in enumerate(obj):
            yield from _flatten(v, f"{prefix}.{i}")
    else:
        yield prefix, obj
