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


def report_pdf(project, res: dict) -> bytes:
    """Multi-page PDF built with matplotlib (no external PDF engine needed)."""
    import matplotlib.pyplot as plt
    from matplotlib.backends.backend_pdf import PdfPages
    from compsuite.reporting import figures as F
    buf = io.BytesIO()
    with PdfPages(buf) as pdf:
        fig = plt.figure(figsize=(8.27, 11.69))
        fig.text(0.08, 0.95, project.name, fontsize=16, weight="bold")
        fig.text(0.08, 0.93, f"{project.description} - revision {project.revision} - compsuite {res['software_version']} - "
                             f"input hash {res['input_hash']}", fontsize=7.5, color="#5f6b7a")
        fig.text(0.08, 0.905, "Preliminary engineering results. Not a certificate of compliance. Qualified review required.",
                 fontsize=7.5, color="#9a6700")
        y = 0.87
        for title, rows in datasheet(project, res):
            fig.text(0.08, y, title, fontsize=9.5, weight="bold")
            y -= 0.016
            for k, v, u in rows:
                fig.text(0.10, y, k, fontsize=7.5)
                fig.text(0.55, y, f"{v} {u}", fontsize=7.5)
                y -= 0.0125
            y -= 0.008
        pdf.savefig(fig)
        plt.close(fig)
        cas = res["casings"][0]
        makers = []
        if res["performance_map"]["lines"]:
            makers.append(lambda: F.compressor_map(res))
        makers.append(lambda: F.rotor_layout(cas["rotor"]))
        if "campbell" in cas["lateral"]:
            makers += [lambda: F.campbell(cas["lateral"]), lambda: F.unbalance(cas["lateral"]),
                       lambda: F.mode_shapes(cas["lateral"], cas["rotor"])]
        makers += [lambda: F.shaft_stress(cas["shaft"]), lambda: F.torsional_interference(res["torsional"])]
        for mk in makers:
            f = mk()
            f.set_size_inches(8.27, 5.2)
            pdf.savefig(f, bbox_inches="tight")
            plt.close(f)
        items = res["checklist"]["items"]
        per = 46
        for start in range(0, len(items), per):
            fig = plt.figure(figsize=(8.27, 11.69))
            fig.text(0.06, 0.96, "Verification checklist" + (" (cont.)" if start else ""), fontsize=11, weight="bold")
            y = 0.93
            colors = {"pass": "#2e7d4f", "fail": "#b3261e", "attention": "#9a6700", "review": "#5f6b7a"}
            for it in items[start:start + per]:
                fig.text(0.06, y, it["status"].upper(), fontsize=6.5, color=colors[it["status"]], weight="bold")
                fig.text(0.16, y, f"{it['category']}: {it['check']}"[:95], fontsize=6.5)
                fig.text(0.70, y, f"{it['value']}"[:40], fontsize=6.5)
                y -= 0.0195
            pdf.savefig(fig)
            plt.close(fig)
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
