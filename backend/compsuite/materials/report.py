"""Material selection report (PDF), laid out like a vendor material selection
presentation: operating conditions per location, water dew-point and SSC
severity charts, corrosion acceptance criteria, selection with rationale,
weld overlay, settle-out (SOP) and contaminants, disclaimer.

Built with the matplotlib object API (Figure + PdfPages, no pyplot); charts
are rendered by ``compsuite.reporting.prism.render`` as PNG, with a plain
matplotlib fallback.
"""

from __future__ import annotations

import logging

import io
import math
import textwrap
from datetime import datetime, timezone

from matplotlib.backends.backend_pdf import PdfPages
from matplotlib.figure import Figure
from matplotlib.image import imread

PAGE = (11.69, 8.27)  # A4 landscape, inches
M, FS = 0.045, 8.0
WET, DRY, SOP = "#D55E00", "#0B5CAD", "#009E73"
DISCLAIMER = ("Preliminary screening for engineering review. Correlations, SSC domain boundaries and material envelopes are "
              "illustrative defaults, not values from ISO 15156 / NACE MR0175, API RP 581 or any licensed standard. Material "
              "selection, qualification (hardness, SSC/HIC testing, weld overlay PQR) and the final decision rest with the "
              "responsible materials engineer and the vendor.")


def _f(v, nd=2):
    if v is None:
        return "-"
    if isinstance(v, bool):
        return "yes" if v else "no"
    if isinstance(v, (int, float)):
        return f"{v:.{nd}f}"
    return str(v)


def dew_point_spec(ma_res: dict) -> dict:
    ch = ma_res["charts"]["dew_point"]
    pts = ch["points"]
    tr = [{"x": [p[0] for p in ch["saturation"]], "y": [p[1] for p in ch["saturation"]], "name": "Water saturation", "mode": "lines",
           "line": {"color": "#000000"}},
          {"x": [p[0] for p in ch["margin"]], "y": [p[1] for p in ch["margin"]], "name": f"Saturation +{ch['margin_c']:g} °C",
           "mode": "lines", "line": {"color": "#7F7F7F", "dash": "dash"}}]
    for name, sel, color, sym in (("Wet location", lambda p: p["wet"] and not p["sop"], WET, "circle"),
                                  ("Dry location", lambda p: not p["wet"] and not p["sop"], DRY, "circle"),
                                  ("SOP", lambda p: p["sop"], SOP, "diamond")):
        s = [p for p in pts if sel(p)]
        if s:
            tr.append({"x": [p["x"] for p in s], "y": [p["y"] for p in s], "name": name, "mode": "markers+text",
                       "text": [p["location"] for p in s], "marker": {"symbol": sym, "size": 7, "color": color}, "line": {"color": color}})
    return {"data": tr, "layout": {"title": "H₂O partial pressure vs temperature",
                                   "xaxis": {"title": "Temperature (°C)", "range": [0, 200]},
                                   "yaxis": {"title": "H₂O partial pressure (bar)", "type": "log"}}}


def ssc_spec(ma_res: dict) -> dict:
    ch = ma_res["charts"]["ssc"]
    styles = {"D1/D2": ("#2C65B0", "dash"), "D2/D3": ("#E8251F", "dash"), "Sour threshold": ("#555555", "dot")}
    tr = []
    for b in ch["boundaries"]:
        c, d = styles.get(b["name"], ("#555555", "solid"))
        tr.append({"x": [p[0] for p in b["points"]], "y": [p[1] for p in b["points"]], "name": b["name"], "mode": "lines",
                   "line": {"color": c, "dash": d}})
    for name, sel, color, sym in (("Wet", lambda p: p["wet"] and not p["sop"], WET, "circle"),
                                  ("Dry", lambda p: not p["wet"] and not p["sop"], DRY, "circle"),
                                  ("SOP", lambda p: p["sop"], SOP, "diamond")):
        s = [p for p in ch["points"] if sel(p)]
        if s:
            tr.append({"x": [p["x"] for p in s], "y": [p["y"] for p in s], "name": name, "mode": "markers",
                       "marker": {"symbol": sym, "size": 7, "color": color}, "line": {"color": color}})
    ann = [{"x": r["label_at"][0], "y": r["label_at"][1], "text": f"Domain {r['label']}"} for r in ch["regions"]]
    (x0, x1), (y0, y1) = ch["x_range"], ch["y_range"]
    return {"data": tr, "layout": {"title": "SSC severity (pH vs pH₂S)", "annotations": ann,
                                   "xaxis": {"title": "pH₂S (bar)", "type": "log", "range": [math.log10(x0), math.log10(x1)]},
                                   "yaxis": {"title": "pH", "range": [y0, y1]}}}


def _fallback_png(spec: dict) -> bytes:
    fig = Figure(figsize=(6.4, 4.2), facecolor="white")
    ax = fig.add_subplot(111)
    lay = spec["layout"]
    for t in spec["data"]:
        mk = "o" if "markers" in t["mode"] else None
        ax.plot(t["x"], t["y"], ls="--" if t.get("line", {}).get("dash") else ("-" if "lines" in t["mode"] else "none"),
                marker=mk, color=t.get("line", {}).get("color"), label=t["name"])
    for a in lay.get("annotations", []):
        ax.annotate(a["text"], (a["x"], a["y"]), fontsize=8)
    for k, setter in (("xaxis", ax.set_xscale), ("yaxis", ax.set_yscale)):
        if lay[k].get("type") == "log":
            setter("log")
    ax.set_xlabel(lay["xaxis"]["title"], fontweight="bold")
    ax.set_ylabel(lay["yaxis"]["title"], fontweight="bold")
    ax.spines["top"].set_visible(False)
    ax.spines["right"].set_visible(False)
    ax.tick_params(direction="out")
    ax.set_title(lay.get("title", ""), fontweight="bold")
    ax.legend(frameon=False, fontsize=7)
    fig.tight_layout()
    buf = io.BytesIO()
    fig.savefig(buf, format="png", dpi=200)
    return buf.getvalue()


def _png(spec: dict, legend: str = "best") -> bytes:
    try:
        from compsuite.reporting.prism import render
        return render(spec, {"width_in": 6.4, "height_in": 4.2, "font_size": 10, "legend": legend}, "png", dpi=200)["content"]
    except Exception as exc:  # noqa: BLE001 - concurrent edits / missing fonts must not break the report
        logging.getLogger(__name__).warning("fallback at report.py:112: %s", exc)
        return _fallback_png(spec)


class _Doc:
    def __init__(self, pdf, title: str):
        self.pdf, self.title, self.fig, self.y, self.n = pdf, title, None, 0.0, 0

    def page(self):
        self.flush()
        self.n += 1
        self.fig = Figure(figsize=PAGE, facecolor="white")
        self.fig.text(M, 0.965, self.title, fontsize=9, color="#555555")
        self.fig.text(1 - M, 0.965, f"Page {self.n}", fontsize=9, color="#555555", ha="right")
        self.fig.add_artist(_hline(0.955))
        self.y = 0.93

    def flush(self):
        if self.fig is not None:
            self.pdf.savefig(self.fig)
            self.fig = None

    def need(self, h: float):
        if self.fig is None or self.y - h < 0.05:
            self.page()

    def heading(self, text: str, size: float = 12):
        self.need(0.08)
        if self.y < 0.92:
            self.y -= 0.012
        self.fig.text(M, self.y, text, fontsize=size, fontweight="bold")
        self.y -= 0.035 if size <= 12 else 0.05

    def para(self, text: str, width: int = 175, size: float = FS, indent: float = 0.0):
        for line in textwrap.wrap(text, width) or [""]:
            self.need(0.022)
            self.fig.text(M + indent, self.y, line, fontsize=size)
            self.y -= 0.021

    def table(self, header: list[str], rows: list[list], widths: list[float] | None = None, size: float = 7.0,
              colors: list[list[str | None]] | None = None):
        rh = 0.026
        widths = widths or [1.0 / len(header)] * len(header)
        total = sum(widths)
        widths = [w / total * (1 - 2 * M) for w in widths]
        i = 0
        while i < len(rows):
            self.need(rh * 3)
            n = max(1, min(len(rows) - i, int((self.y - 0.05) / rh) - 1))
            chunk = rows[i:i + n]
            h = rh * (len(chunk) + 1)
            ax = self.fig.add_axes([M, self.y - h, 1 - 2 * M, h])
            ax.axis("off")
            tb = ax.table(cellText=[[_f(c) for c in r] for r in chunk], colLabels=header, colWidths=[w / (1 - 2 * M) for w in widths],
                          bbox=[0, 0, 1, 1], cellLoc="left")
            tb.auto_set_font_size(False)
            tb.set_fontsize(size)
            for (r, c), cell in tb.get_celld().items():
                cell.set_linewidth(0.4)
                cell.set_edgecolor("#999999")
                if r == 0:
                    cell.set_facecolor("#1F3B5C")
                    cell.get_text().set_color("white")
                    cell.get_text().set_fontweight("bold")
                elif colors and colors[i + r - 1][c]:
                    cell.set_facecolor(colors[i + r - 1][c])
            self.y -= h + 0.02
            i += n

    def image(self, png: bytes, x: float, w: float, h: float):
        ax = self.fig.add_axes([x, self.y - h, w, h])
        ax.imshow(imread(io.BytesIO(png), format="png"))
        ax.axis("off")


def _hline(y):
    from matplotlib.lines import Line2D
    return Line2D([M, 1 - M], [y, y], lw=0.6, color="#999999")


STATUS_COLOR = {"pass": "#DFF2E1", "fail": "#F8D7DA", "attention": "#FFF3CD", "review": "#E7E9EE", "WET": "#FBE3D6"}


def material_selection_report(project, res: dict) -> bytes:
    """PDF bytes of the material selection report for ``res["material_assessment"]``."""
    r = res["material_assessment"]
    ma = project.material_assessment
    rows = r["conditions"]
    life = r.get("design_life_years", ma.service_life_years)
    buf = io.BytesIO()
    with PdfPages(buf) as pdf:
        d = _Doc(pdf, f"{project.name} - material selection, rev {project.revision}")
        d.page()
        d.heading("Material selection - sour / wet service", 16)
        d.para(f"{project.name}. {project.description}. Generated {datetime.now(timezone.utc):%Y-%m-%d %H:%M} UTC. "
               f"Design life {life:g} years; MDMT {ma.mdmt_c:g} °C (shaft {ma.shaft_mdmt_c:g} °C); wet margin "
               f"{ma.dew_margin_c:g} °C above the water dew point.")
        d.heading("Operating conditions")
        spec = [("P (bara)", "P_bara", 2), ("T (°C)", "T_c", 1), ("H₂O (%)", "h2o_pct", 3), ("CO₂ (%)", "co2_pct", 2),
                ("H₂S (%)", "h2s_pct", 2), ("pH₂S (bar)", "ph2s_bar", 3), ("pCO₂ (bar)", "pco2_bar", 3),
                ("Water dew point (°C)", "water_dew_point_c", 1), ("pH", "ph", 2), ("Severity (ISO 15156-2)", "domain", 0),
                ("Moisture", "moisture", 0), ("CR (mm/y)", "cr_mm_y", 3), (f"C {life:g}Y (mm)", "cumulative_loss_mm", 2)]
        tab = [[label] + [_f(x[k], nd) if nd else x[k] for x in rows] for label, k, nd in spec]
        col = [[None] + [STATUS_COLOR["WET"] if (k == "moisture" and x["wet"]) else None for x in rows] for _, k, _ in spec]
        d.table(["Parameter"] + [x["location"] for x in rows], tab, [2.2] + [1.0] * len(rows), colors=col)
        d.para("pH: estimated for unbuffered condensed water saturated with CO₂/H₂S unless measured. CR: de Waard-Milliams (1991) "
               "carbon-steel CO₂ rate at wet locations" + (" x O₂ multiplier (API RP 581)" if any(x["o2_factor"] > 1 for x in rows) else "")
               + ". SOP rows: settle-out pressure at design temperature and at the water dew point.", size=7)

        d.page()
        d.heading("Water dew point and SSC severity")
        h = 0.62
        d.image(_png(dew_point_spec(r), "lower right"), M, 0.44, h)
        d.image(_png(ssc_spec(r), "lower left"), 0.51, 0.44, h)
        d.y -= h + 0.02
        d.para("(a) A location is wet when its point lies on or above the saturation curve shifted by the margin. "
               "(b) " + r["charts"]["ssc"]["note"] + ".", size=7)

        d.page()
        d.heading("Corrosion rate acceptance criteria")
        crit = []
        for c in r["criteria"]:
            rng = ""
            if c["component_class"] == "impeller":
                rng = f"blade > {_f(c['blade_min_mm'], 0)}" + (f" ≤ {_f(c['blade_max_mm'], 0)} mm" if c["blade_max_mm"] else " mm")
            crit.append([c["component_class"].title(), rng, _f(c["max_cr_mm_y"], 3), _f(c["max_total_mm"], 1)])
        d.table(["Component", "Range", "Max CR (mm/y)", "Max total (mm)"], crit, [2, 2, 1.5, 1.5])
        d.para(f"Impeller blade thickness {r['blade_thickness_mm']:.1f} mm ({r['blade_thickness_basis']}).", size=7)
        d.heading("Material selection")
        sel = r["selection"]
        comp = {c["component"]: c for c in r["components"]}
        tab, col = [], []
        for s in sel:
            c = comp.get(s["component"], {})
            acc = c.get("acceptance", "-")
            tab.append([s["component"], "WET" if s["wet"] else "DRY", s["domain"], s["designation"][:58], s["nace"],
                        _f(s["max_hrc"], 0), _f(s["min_temp_c"], 0), _f(c.get("cr_mm_y"), 3), _f(c.get("loss_mm"), 2), acc])
            col.append([None, STATUS_COLOR["WET"] if s["wet"] else None] + [None] * 7 + [STATUS_COLOR.get(acc)])
        d.table(["Component", "Moisture", "Domain", "Material", "NACE", "Max HRC", "Min T °C", "CR mm/y", "Loss mm", "Acceptance"],
                tab, [1.6, 0.8, 0.7, 4.2, 1.1, 0.8, 0.8, 0.8, 0.8, 1.0], colors=col)
        d.heading("Selection rationale")
        for s in sel:
            d.para(f"{s['component']} - {s['designation']}", size=8)
            for t in s["rationale"]:
                d.para("• " + t, size=7, indent=0.015)
            if s["alternatives"]:
                d.para("Alternatives: " + "; ".join(s["alternatives"]), size=7, indent=0.015)

        w = r["weld_overlay"]
        d.heading("Weld overlay")
        d.para(w["statement"])
        for i, t in enumerate(w["process_steps"], 1):
            d.para(f"{i}. {t}", size=7, indent=0.015)
        if w["checks"]:
            d.table(["Check", "Criterion", "Value", "Status", "Note"],
                    [[c["check"], c["criterion"], c["value"], c["status"], c["note"]] for c in w["checks"]], [2, 1.5, 1, 1, 3],
                    colors=[[None, None, None, STATUS_COLOR.get(c["status"]), None] for c in w["checks"]])
        s = r["sop"]
        d.heading("Settle-out (SOP)")
        d.para(f"SOP {s['pressure_bara']:.2f} bara, {s['temperature_c']:.1f} °C; water dew point {_f(s['dew_point_c'], 1)} °C; "
               f"trip setpoint {_f(s['trip_setpoint_c'], 1)} °C. Status: {s['status']}.")
        for t in s["statements"]:
            d.para("• " + t, size=7, indent=0.015)
        d.heading("Contaminants")
        cs = r["contaminants"]
        d.table(["Item", "Value", "Limit", "Status", "Note"], [[c["item"], c["value"], c["limit"], c["status"], c["note"]] for c in cs],
                [2.2, 1.4, 1.4, 0.9, 4.5], colors=[[None, None, None, STATUS_COLOR.get(c["status"]), None] for c in cs])
        d.heading("Disclaimer")
        d.para(DISCLAIMER, size=7)
        d.flush()
    return buf.getvalue()
