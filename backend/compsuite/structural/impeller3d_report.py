"""PDF report of a 3D impeller analysis (summary, checks and the Prism-style charts)."""

from __future__ import annotations

import io

from matplotlib.backends.backend_pdf import PdfPages
from matplotlib.figure import Figure
from PIL import Image

from compsuite.reporting.prism import render


def _img(fig, rect, spec):
    png = render(spec, {"width_in": 6.6, "height_in": 3.0, "font_size": 9}, "png", dpi=170)["content"]
    ax = fig.add_axes(rect)
    ax.imshow(Image.open(io.BytesIO(png)))
    ax.axis("off")


def fea_report(project, res: dict) -> bytes:
    s = res["summary"]
    buf = io.BytesIO()
    with PdfPages(buf) as pdf:
        fig = Figure(figsize=(8.27, 11.69))
        fig.text(0.07, 0.95, f"{project.name} - impeller {res['impeller']} 3D FEA", fontsize=14, weight="bold")
        fig.text(0.07, 0.925, f"Material {res['material']['name']} (Sy {res['material']['yield_mpa']:.0f} MPa, Su {res['material']['uts_mpa']:.0f} MPa); "
                 f"{s['elements']} hex8 elements per sector, {s['dof']} DOF; mesh error {s.get('convergence_error_pct', 0):.1f} %", fontsize=8)
        rows = [("Peak von Mises at MCS (combined)", f"{s['peak_vm_mcs_mpa']:.0f} MPa ({s['peak_zone']})"),
                ("Peak von Mises at 115 % overspeed", f"{s['peak_vm_overspeed_mpa']:.0f} MPa"),
                ("Yielded volume at overspeed", f"{s['plastic_volume_overspeed_pct']:.2f} %"),
                ("Permanent growth bore / eye / tip", f"{s['permanent_bore_growth_um']:.1f} / {s['permanent_eye_growth_um']:.1f} / {s['permanent_tip_growth_um']:.1f} um"),
                ("Burst speed / margin", f"{s['burst_speed_rpm']:.0f} rpm / {s['burst_margin']:.2f}"),
                ("Fit: interference / p standstill / lift-off", f"{s['fit_interference_um']:.0f} um / {s['fit_pressure_standstill_mpa']:.1f} MPa / {s['lift_off_rpm']:.0f} rpm"),
                ("Goodman SF (HCF) / LCF cycles", f"{s['goodman_sf_min']:.2f} / {s['lcf_cycles']:.3g} (required {s['lcf_required']:.0f})")]
        y = 0.89
        for a, b in rows:
            fig.text(0.07, y, a, fontsize=9)
            fig.text(0.55, y, b, fontsize=9, weight="bold")
            y -= 0.022
        y -= 0.01
        fig.text(0.07, y, "Checks", fontsize=11, weight="bold")
        for c in res["checks"]:
            y -= 0.02
            v = c["value"] if isinstance(c["value"], str) else f"{c['value']:.3g}"
            fig.text(0.07, y, f"{c['status'].upper():5s}  {c['check']}  ({c['criterion']}; value {v})", fontsize=8,
                     color="#1f7a4d" if c["status"] == "pass" else "#c0392b")
        p = res["paths"]["Blade root (hub)"]
        _img(fig, [0.05, 0.05, 0.9, 0.38], {"data": [{"x": p["x_mm"], "y": p["cases"][c]["von_mises_mpa"], "name": c, "mode": "lines"}
                                                    for c in ("MCS combined", "Overspeed 115 % (elastic-plastic)", "Standstill (fit only)")],
                                           "layout": {"title": "von Mises along the blade root", "xaxis": {"title": "r (mm)"}, "yaxis": {"title": "Stress (MPa)"}}})
        pdf.savefig(fig)
        fig = Figure(figsize=(8.27, 11.69))
        nmcs = res["safe"]["speed_range_rpm"][1]
        sp = [0, 0.5 * nmcs, nmcs, 1.2 * nmcs]
        data = []
        for nd in sorted({m["nd"] for m in res["modes"]}):
            for m in [q for q in res["modes"] if q["nd"] == nd][:1]:
                data.append({"x": sp, "y": [(m["f0_hz"]**2 + (m["f_mcs_hz"]**2 - m["f0_hz"]**2) * (n / nmcs) ** 2) ** 0.5 for n in sp],
                             "name": f"ND {nd}", "mode": "lines"})
        for e in res["safe"]["excitations"]:
            if e["order"] > 6:
                data.append({"x": sp, "y": [e["order"] * n / 60 for n in sp], "name": e["name"], "mode": "lines", "line": {"dash": "dash", "color": "#555"}})
        _img(fig, [0.05, 0.55, 0.9, 0.4], {"data": data, "layout": {"title": "Campbell diagram (first mode family per nodal diameter)",
                                                                     "xaxis": {"title": "Speed (rpm)"}, "yaxis": {"title": "Frequency (Hz)"}}})
        fr = res["overspeed_frames"]
        _img(fig, [0.05, 0.08, 0.9, 0.4], {"data": [{"x": [f["speed_frac"] * 100 for f in fr], "y": [f["tip_growth_um"] for f in fr], "name": "Tip growth (um)", "mode": "lines+markers"},
                                                   {"x": [f["speed_frac"] * 100 for f in fr], "y": [f["plastic_volume_pct"] for f in fr], "name": "Yielded volume (%)", "mode": "lines+markers", "yaxis": "y2"}],
                                          "layout": {"title": "Spin test: growth and yielding vs speed", "xaxis": {"title": "Speed (% MCS)"},
                                                     "yaxis": {"title": "Tip growth (um)"}, "yaxis2": {"title": "Yielded volume (%)"}}})
        fig.text(0.07, 0.03, "Preliminary engineering. Parametric geometry from the stage design; verify detailed design with CAD-based FEA.", fontsize=7)
        pdf.savefig(fig)
    return buf.getvalue()
