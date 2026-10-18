"""PDF report of a 3D impeller analysis, in the order of a vendor FEA report:
1 inputs, 2 model, 3 model validation, 4 results per load case (sector / front / back views), 5 bore contact,
6 overspeed, 7 acceptance criteria, 8 all-impellers summary, then modes / SAFE and the spin test."""

from __future__ import annotations

import io
import math

import numpy as np
from matplotlib import cm
from matplotlib.backends.backend_pdf import PdfPages
from matplotlib.collections import PolyCollection
from matplotlib.colors import Normalize
from matplotlib.figure import Figure
from PIL import Image

from compsuite.reporting.prism import render
from compsuite.structural.impeller3d import FACES

OK, BAD = "#1f7a4d", "#c0392b"
OS_CASE = "Overspeed 115 % (elastic-plastic)"
VIEWS = (("sector", "Sector close-up"), ("front", "Front (eye side)"), ("back", "Back (disk side)"))
MEANING = {"von_mises_mpa": "von Mises equivalent stress: compare with yield; the peak marks where the wheel would yield first.",
           "hoop_mpa": "Hoop (tangential) stress: governs bore growth, burst margin and the shrink-fit lift-off."}


def _img(fig, rect, spec):
    png = render(spec, {"width_in": 6.6, "height_in": 3.0, "font_size": 9}, "png", dpi=170)["content"]
    ax = fig.add_axes(rect)
    ax.imshow(Image.open(io.BytesIO(png)))
    ax.axis("off")


def _page(pdf, title=None):
    fig = Figure(figsize=(8.27, 11.69))
    if title:
        fig.text(0.07, 0.955, title, fontsize=12, weight="bold")
    return fig


def _table(fig, y, cols, rows, x0=0.07, width=0.86, fs=7.5, colors=None):
    """Simple ruled table. cols: [(header, rel_width)]; rows: lists of strings."""
    tot = sum(w for _, w in cols)
    xs = np.cumsum([0] + [w / tot * width for _, w in cols])[:-1] + x0
    for (h, _), x in zip(cols, xs):
        fig.text(x, y, h, fontsize=fs, weight="bold")
    fig.add_artist(_line(fig, y - 0.005, x0, width))
    for i, r in enumerate(rows):
        y -= 0.017
        for j, (v, x) in enumerate(zip(r, xs)):
            c = colors[i] if colors and j == len(r) - 1 else "black"
            fig.text(x, y, str(v), fontsize=fs, color=c, weight="bold" if c != "black" else "normal")
    return y - 0.025


def _line(fig, y, x0, w):
    from matplotlib.lines import Line2D
    return Line2D([x0, x0 + w], [y, y], transform=fig.transFigure, color="#999", lw=0.5)


def _f(v, nd=1):
    if v is None:
        return "-"
    if isinstance(v, str):
        return v
    return f"{v:.{nd}f}" if abs(v) < 1e5 else f"{v:.3g}"


def _view(ax, res, field, case, view, title=None, mono=False):
    """Painter's-algorithm projection of the FE surface coloured by a nodal field."""
    sec = res["_sector"]
    X = sec.nodes * 1e3
    F = np.array([sec.els[e][FACES[n]] for e, n in res["_faces"]])
    val = np.asarray(res["_fields"][case][field])
    Z, a = sec.m["Z"], sec.m["alpha"]
    secs = range(Z) if view != "sector" else range(-1, 2)
    P, V = [], []
    for s in secs:
        c, sn = math.cos(s * a), math.sin(s * a)
        Y = X @ np.array([[c, sn, 0], [-sn, c, 0], [0, 0, 1]])
        P.append(Y[F])
        V.append(val[F].mean(1))
    P, V = np.concatenate(P), np.concatenate(V)
    if view == "front":
        q, d = P[..., :2], P[..., 2].mean(1)
    elif view == "back":
        q, d = np.stack([-P[..., 0], P[..., 1]], -1), -P[..., 2].mean(1)
    else:  # isometric of three sectors, looking at the eye side from outside the tip
        az, el = math.radians(-60), math.radians(35)
        R1 = np.array([[math.cos(az), -math.sin(az), 0], [math.sin(az), math.cos(az), 0], [0, 0, 1]])
        R2 = np.array([[1, 0, 0], [0, math.cos(el), -math.sin(el)], [0, math.sin(el), math.cos(el)]])
        Q = P @ (R2 @ R1).T
        q, d = Q[..., [0, 2]], Q[..., 1].mean(1) * -1
    o = np.argsort(d)
    nrm = Normalize(float(val.min()), float(val.max()))
    fc = "#c9d3de" if mono else cm.turbo(nrm(V[o]))
    ax.add_collection(PolyCollection(q[o], facecolors=fc, edgecolors=(0, 0, 0, 0.45 if mono else 0.12), linewidths=0.2 if mono else 0.15))
    ax.autoscale_view()
    ax.set_aspect("equal")
    ax.axis("off")
    if title:
        ax.set_title(title, fontsize=7)
    return nrm


def _views_row(fig, res, field, case, y, h=0.2, label=""):
    nrm = None
    for i, (v, t) in enumerate(VIEWS):
        nrm = _view(fig.add_axes([0.06 + i * 0.29, y, 0.27, h]), res, field, case, v, t)
    cax = fig.add_axes([0.93, y + 0.02, 0.012, h - 0.04])
    cb = fig.colorbar(cm.ScalarMappable(norm=nrm, cmap="turbo"), cax=cax)
    cb.ax.tick_params(labelsize=6)
    fig.text(0.07, y + h + 0.008, f"{label}  - max {nrm.vmax:.0f} MPa, min {nrm.vmin:.0f} MPa", fontsize=8.5, weight="bold")
    fig.text(0.07, y - 0.012, MEANING.get(field, ""), fontsize=7, style="italic", color="#444")


def fea_report(project, res: dict, others: list | None = None) -> bytes:
    s, inp, mdl, val = res["summary"], res["inputs"], res["model"], res["validation"]
    buf = io.BytesIO()
    with PdfPages(buf) as pdf:
        # ---- 1 inputs, 2 model
        fig = _page(pdf)
        fig.text(0.07, 0.955, f"{project.name} - impeller {res['impeller']} 3D FEA validation", fontsize=14, weight="bold")
        q = all(a["status"] == "pass" for a in res["acceptance"])
        fig.text(0.07, 0.935, "Verdict: " + ("all acceptance criteria met" if q else "one or more acceptance criteria not met (see section 7)"),
                 fontsize=9, color=OK if q else BAD, weight="bold")
        fig.text(0.07, 0.905, "1  Inputs", fontsize=11, weight="bold")
        y = _table(fig, 0.885, [("Speed", 3), ("rpm", 1), ("x MCS", 1), ("Tip speed m/s", 1.2)],
                   [[r["speed"], _f(r["rpm"], 0), _f(r["ratio_mcs"], 3), _f(r["tip_speed_m_s"], 1)] for r in inp["speeds"]])
        y = _table(fig, y, [("Parameter", 3), ("Unit", 0.8), ("Model", 1), ("Vendor", 1), ("Diff %", 0.8)],
                   [[b["parameter"], b["unit"], _f(b["value"], 3 if b["unit"] == "kg m2" else 1), _f(b.get("vendor"), 3 if b["unit"] == "kg m2" else 1),
                     _f(b.get("diff_pct"), 1)] for b in inp["basic"]])
        mt = inp["material"]
        y = _table(fig, y, [("Material", 2), ("E GPa", 1), ("nu", 0.7), ("rho kg/m3", 1), ("Yield MPa", 1), ("UTS MPa", 1), ("T range C", 1.2)],
                   [[str(mt["name"]), _f(mt["E_gpa"], 0), _f(mt["poisson"], 2), _f(mt["density_kg_m3"], 0), _f(mt["yield_mpa"], 0), _f(mt["uts_mpa"], 0),
                     f"{mt['temperature_range_c'][0]:.0f} - {mt['temperature_range_c'][1]:.0f}"]])
        fig.text(0.07, y, f"Material data: {mt['source']}.", fontsize=7, color="#444")
        y -= 0.035
        fig.text(0.07, y, "2  Finite-element model", fontsize=11, weight="bold")
        y -= 0.02
        fig.text(0.07, y, f"{mdl['element']}; sector {mdl['sector_deg']:.2f} deg: {mdl['elements']} elements, {mdl['nodes']} nodes, {mdl['dof']} DOF "
                 f"(full wheel {mdl['elements_full']} elements). Thickness factors {mdl['thickness_factor']} (FE mass {s['fe_mass_kg']:.2f} kg).", fontsize=7.5)
        for t, lst in (("Restraints", mdl["restraints"]), ("Loads", mdl["loads"])):
            y -= 0.02
            fig.text(0.07, y, t, fontsize=8, weight="bold")
            for x in lst:
                y -= 0.015
                fig.text(0.09, y, "- " + x, fontsize=7.5)
        h = max(0.12, y - 0.07)
        for i, (v, t) in enumerate(VIEWS[:2]):
            _view(fig.add_axes([0.08 + i * 0.44, 0.04, 0.4, h]), res, "von_mises_mpa", "Standstill (fit only)", v, f"Mesh - {t}", mono=True)
        pdf.savefig(fig)

        # ---- 3 validation
        fig = _page(pdf, "3  Model validation")
        p, d = val["patch"], val["disc"]
        rows = [["Constant-strain patch test (impeller mesh)", f"max error {p['constant_strain_error_pct']:.1e} %", "< 1e-6 %", "pass" if p["constant_strain_error_pct"] < 1e-6 else "fail"],
                ["Free thermal expansion (100 K)", f"max VM {p['free_thermal_vm_mpa']:.1e} MPa", "~ 0", "pass" if p["free_thermal_vm_mpa"] < 1e-3 else "fail"],
                ["Rotating disc: bore hoop FE / exact", f"{d['hoop_bore_fe_mpa']:.0f} / {d['hoop_bore_exact_mpa']:.0f} MPa ({d['hoop_error_pct']:+.1f} %)", "+/- 5 %",
                 "pass" if abs(d["hoop_error_pct"]) <= 5 else "fail"],
                ["Rotating disc: bore growth FE / exact", f"{d['ur_bore_fe_um']:.1f} / {d['ur_bore_exact_um']:.1f} um ({d['ur_error_pct']:+.1f} %)", "+/- 5 %",
                 "pass" if abs(d["ur_error_pct"]) <= 5 else "fail"]]
        a = val.get("axi_vs_3d")
        if a:
            dv = (a["vm_mcs_3d_mpa"] / a["vm_mcs_2d_mpa"] - 1) * 100
            rows.append(["2D axisymmetric vs 3D sector: peak VM at MCS", f"{a['vm_mcs_2d_mpa']:.0f} / {a['vm_mcs_3d_mpa']:.0f} MPa ({dv:+.0f} %)",
                         "info (blades smeared in 2D)", "info"])
            rows.append(["2D vs 3D: tip radial growth (centrifugal)", f"{a['tip_growth_2d_um']:.0f} / {a['tip_growth_3d_um']:.0f} um", "info", "info"])
        ce = s.get("convergence_error_pct")
        if ce is not None:
            rows.append(["Mesh convergence (average hoop, medium vs fine)", f"{ce:.2f} %", "<= 5 %", "pass" if ce <= 5 else "fail"])
        y = _table(fig, 0.925, [("Check", 3.2), ("Result", 2.6), ("Limit", 1.4), ("Status", 0.8)], rows,
                   colors=[OK if r[-1] == "pass" else BAD if r[-1] == "fail" else "#555" for r in rows])
        if res["convergence"]:
            ax = fig.add_axes([0.12, 0.38, 0.76, 0.3])
            c = res["convergence"]
            ax.plot([q["dof"] for q in c], [q["peak_vm_mpa"] for q in c], "o-", label="Peak von Mises (MPa)")
            ax.plot([q["dof"] for q in c], [q["avg_hoop_mpa"] for q in c], "s-", label="Average hoop (MPa)")
            ax.set_xscale("log")
            ax.set_xlabel("Degrees of freedom (sector)", fontsize=8)
            ax.set_ylabel("Stress (MPa)", fontsize=8)
            ax.set_title("Mesh convergence - centrifugal load at MCS", fontsize=9)
            ax.legend(fontsize=7)
            ax.tick_params(labelsize=7)
            ax.grid(alpha=0.3)
        fig.text(0.07, 0.32, "The patch test proves that the element reproduces a constant strain state exactly on the distorted impeller mesh;\n"
                 "the rotating-disc check compares the same element and solver with the closed-form plane-stress solution.", fontsize=7.5)
        pdf.savefig(fig)

        # ---- 4 results per load case
        for case, lbl in (("MCS combined", f"MCS {res['speeds']['mcs_rpm']:.0f} rpm (centrifugal + pressure + thermal + fit)"),
                          (OS_CASE, f"Overspeed {res['speeds']['overspeed_rpm']:.0f} rpm (elastic-plastic, fit, room temperature)")):
            fig = _page(pdf, f"4  Results - {lbl}")
            _views_row(fig, res, "von_mises_mpa", case, 0.62, 0.27, "von Mises stress (MPa)")
            _views_row(fig, res, "hoop_mpa", case, 0.22, 0.27, "Hoop stress (MPa)")
            pdf.savefig(fig)

        # ---- 5 bore contact, 6 overspeed
        fig = _page(pdf, "5  Bore radial deformation and contact length at MCS")
        bp = res["bore_path"]
        ax = fig.add_axes([0.12, 0.62, 0.76, 0.28])
        ax.plot(bp["z_mm"], bp["ur_mm"], "o-", label="Bore radial deformation (free, centrifugal MCS)")
        ax.plot(bp["z_mm"], [u_ - bp["shaft_growth_mm"] for u_ in bp["ur_mm"]], "--", label="Relative to shaft growth")
        ax.axhline(bp["min_radial_interference_mm"], color=BAD, label=f"Minimum radial interference {bp['min_radial_interference_mm']:.3f} mm")
        ax.set_xlabel("Bore axial position from back face (mm)", fontsize=8)
        ax.set_ylabel("Radial (mm)", fontsize=8)
        ax.legend(fontsize=7)
        ax.tick_params(labelsize=7)
        ax.grid(alpha=0.3)
        ok = bp["contact_length_pct"] >= 50
        fig.text(0.07, 0.585, f"Max bore radial deformation {s['max_bore_ur_mm']:.4f} mm vs minimum radial interference {bp['min_radial_interference_mm']:.4f} mm "
                 f"({bp['interference_source']}). Contact length {bp['contact_length_pct']:.0f} % of {bp['axial_length_mm']:.0f} mm "
                 f"(criterion >= 50 %): {'PASS' if ok else 'FAIL'}.", fontsize=7.5, color=OK if ok else BAD, wrap=True)
        fig.text(0.07, 0.565, f"Lift-off speed {s['lift_off_rpm']:.0f} rpm = {s['lift_off_ratio']:.2f} x MCS (mean bore).", fontsize=7.5)
        fig.text(0.07, 0.52, "6  Overspeed", fontsize=11, weight="bold")
        y = _table(fig, 0.5, [("Method", 3.5), ("Peak VM MPa", 1), ("Yield MPa", 1), ("Ratio", 0.8)],
                   [[f"Scaled: VM(MCS) x (Nos / Nmcs)^2 = x {s['overspeed_ratio_sq']:.3f}", _f(s["peak_vm_overspeed_scaled_mpa"], 0), _f(res["material"]["yield_mpa"], 0),
                     _f(s["peak_vm_overspeed_scaled_mpa"] / res["material"]["yield_mpa"], 2)],
                    ["Elastic-plastic FE (bilinear, deformation theory)", _f(s["peak_vm_overspeed_mpa"], 0), _f(res["material"]["yield_mpa"], 0),
                     _f(s["peak_vm_overspeed_mpa"] / res["material"]["yield_mpa"], 2)]])
        fig.text(0.07, y, f"Yielded volume {s['plastic_volume_overspeed_pct']:.2f} %; permanent growth bore / eye / tip {s['permanent_bore_growth_um']:.1f} / "
                 f"{s['permanent_eye_growth_um']:.1f} / {s['permanent_tip_growth_um']:.1f} um.", fontsize=7.5)
        fr = res["overspeed_frames"]
        _img(fig, [0.05, 0.05, 0.9, 0.36], {"data": [{"x": [f["speed_frac"] * 100 for f in fr], "y": [f["tip_growth_um"] for f in fr], "name": "Tip growth (um)", "mode": "lines+markers"},
                                                     {"x": [f["speed_frac"] * 100 for f in fr], "y": [f["plastic_volume_pct"] for f in fr], "name": "Yielded volume (%)", "mode": "lines+markers", "yaxis": "y2"}],
                                            "layout": {"title": "Spin test: growth and yielding vs speed", "xaxis": {"title": "Speed (% MCS)"},
                                                       "yaxis": {"title": "Tip growth (um)"}, "yaxis2": {"title": "Yielded volume (%)"}}})
        pdf.savefig(fig)

        # ---- 7 acceptance, 8 all impellers
        fig = _page(pdf, "7  Acceptance criteria")
        acc = res["acceptance"]
        y = _table(fig, 0.925, [("Criterion", 4), ("Value", 1), ("Limit", 1), ("Unit", 0.6), ("Status", 0.7)],
                   [[a_["criterion"], _f(a_["value"], 2), _f(a_["limit"], 2), a_["unit"], a_["status"].upper()] for a_ in acc],
                   colors=[OK if a_["status"] == "pass" else BAD for a_ in acc])
        fig.text(0.07, y, "Other checks", fontsize=9, weight="bold")
        for c in res["checks"]:
            y -= 0.017
            v = c["value"] if isinstance(c["value"], str) else f"{c['value']:.3g}"
            fig.text(0.07, y, f"{c['status'].upper():5s}  {c['check']}  ({c['criterion']}; value {v})", fontsize=7.5, color=OK if c["status"] == "pass" else BAD)
        y -= 0.04
        if others:
            fig.text(0.07, y, "8  All impellers (analysed with the same options)", fontsize=11, weight="bold")
            y = _table(fig, y - 0.02, [("Imp.", 0.5), ("VM MCS", 1), ("VM OS scaled", 1), ("VM OS e-p", 1), ("Yield", 0.8), ("Bore ur mm", 1), ("Min interf. mm", 1),
                                        ("Contact %", 0.8), ("Qualified", 0.8)],
                       [[str(r["impeller"]), _f(r["max_vm_mcs_mpa"], 0), _f(r["max_vm_overspeed_scaled_mpa"], 0), _f(r["max_vm_overspeed_ep_mpa"], 0), _f(r["yield_mpa"], 0),
                         _f(r["max_bore_ur_mm"], 4), _f(r["min_radial_interference_mm"], 4), _f(r["contact_length_pct"], 0), "YES" if r["qualified"] else "NO"] for r in others],
                       colors=[OK if r["qualified"] else BAD for r in others])
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
        _img(fig, [0.05, 0.05, 0.9, 0.34], {"data": data, "layout": {"title": "Campbell diagram (first mode family per nodal diameter)",
                                                                     "xaxis": {"title": "Speed (rpm)"}, "yaxis": {"title": "Frequency (Hz)"}}})
        fig.text(0.07, 0.025, "Preliminary engineering. Parametric geometry from the stage design (scaled to vendor mass data when given); "
                 "verify detailed design with CAD-based FEA.", fontsize=6.5)
        pdf.savefig(fig)
    return buf.getvalue()
