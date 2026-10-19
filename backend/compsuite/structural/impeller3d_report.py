"""PDF report of a 3D impeller analysis in the house style (cover, contents, running header, sign-off):
1 scope and inputs, 2 FE model and mesh, 3 model validation, 4 stress results (banded contours with MAX / MIN),
5 stress along paths, 6 bore contact and shrink fit, 7 overspeed / spin test, 8 modes and SAFE, 9 fatigue,
10 acceptance, 11 all impellers, pictures captured in the 3D viewer."""

from __future__ import annotations

import io
import math

import numpy as np
from matplotlib.collections import PolyCollection
from matplotlib.colors import BoundaryNorm, LinearSegmentedColormap
from matplotlib.cm import ScalarMappable

from compsuite.structural.impeller3d import FACES
from compsuite.testing.drawings import Doc
from compsuite.testing.mrt import cover_info, doc_info, style

OS_CASE = "Overspeed 115 % (elastic-plastic)"
VIEWS = (("sector", "Sector close-up"), ("front", "Front (eye side)"), ("back", "Back (disk side)"))
MEANING = {"von_mises_mpa": "von Mises equivalent stress: compare with yield; the peak marks where the wheel would yield first.",
           "hoop_mpa": "Hoop (tangential) stress: governs bore growth, burst margin and the shrink-fit lift-off.",
           "max_principal_mpa": "Maximum principal stress: drives fatigue crack opening at blade roots and fillets.",
           "disp_um": "Total displacement (deformation exaggerated in the picture).",
           "safety_factor": "Safety factor against yield at each node; the minimum is the governing margin.",
           "temperature_c": "Metal temperature distribution used for the thermal stress and the derated material data."}
LABEL = {"von_mises_mpa": "von Mises (MPa)", "hoop_mpa": "Hoop (MPa)", "max_principal_mpa": "Max principal (MPa)", "radial_mpa": "Radial (MPa)",
         "axial_mpa": "Axial (MPa)", "disp_um": "Displacement (um)", "safety_factor": "Safety factor vs yield", "temperature_c": "Temperature (C)",
         "plastic_strain_ue": "Plastic strain (ue)", "residual_ur_um": "Permanent radial growth (um)", "ur_um": "Radial displacement (um)"}
# same colour ramp as the app viewer
CMAP = LinearSegmentedColormap.from_list("cf", [(0.19, 0.07, 0.6), (0.07, 0.45, 0.9), (0.1, 0.75, 0.8), (0.35, 0.85, 0.35), (0.98, 0.8, 0.15), (0.9, 0.2, 0.15)])
NB = 10


def _f(v, nd=1):
    if v is None:
        return "-"
    if isinstance(v, str):
        return v
    return f"{v:.{nd}f}" if abs(v) < 1e5 else f"{v:.3g}"


def _proj(P, view):
    """Project (..., 3) points: returns 2-D coordinates and depth (larger = nearer)."""
    if view == "front":
        return P[..., :2], P[..., 2]
    if view == "back":
        return np.stack([-P[..., 0], P[..., 1]], -1), -P[..., 2]
    az, el = math.radians(-60), math.radians(35)
    R1 = np.array([[math.cos(az), -math.sin(az), 0], [math.sin(az), math.cos(az), 0], [0, 0, 1]])
    R2 = np.array([[1, 0, 0], [0, math.cos(el), -math.sin(el)], [0, math.sin(el), math.cos(el)]])
    Q = P @ (R2 @ R1).T
    return Q[..., [0, 2]], -Q[..., 1]


def _view(ax, res, view, val=None, case=None, mode=None, mesh=False, title=None, marks=True):
    """Painter's-algorithm picture of the FE surface: banded contours of a nodal field (or plain mesh),
    optional deformed shape (load case or mode shape) and MAX / MIN markers."""
    sec = res["_sector"]
    X = sec.nodes * 1e3
    F = np.array([sec.els[e][FACES[n]] for e, n in res["_faces"]])
    Z, a = sec.m["Z"], sec.m["alpha"]
    R = float(np.hypot(X[:, 0], X[:, 1]).max())
    U = np.zeros_like(X)
    if case is not None:
        U = np.asarray(res["_u"][case]) * 1e3
    secs = range(Z) if view != "sector" else range(-1, 2)
    if mode is None:
        k = 0.03 * R / (np.abs(U).max() or 1) if case is not None else 0
    P, V, nodes = [], [], []
    for s in secs:
        c, sn = math.cos(s * a), math.sin(s * a)
        rot = np.array([[c, sn, 0], [-sn, c, 0], [0, 0, 1]])
        D = U * k if mode is None else (np.asarray(mode["re"]) * math.cos(mode["nd"] * s * a) - np.asarray(mode["im"]) * math.sin(mode["nd"] * s * a))
        if mode is not None:
            D = D * 0.06 * R / (np.abs(np.asarray(mode["re"])).max() + np.abs(np.asarray(mode["im"])).max() or 1)
        Y = (X + D) @ rot
        P.append(Y[F])
        vv = np.linalg.norm(D, axis=1) if mode is not None else val
        V.append(vv[F].mean(1) if vv is not None else np.zeros(len(F)))
        if s == 0:
            nodes = (Y, vv)
    P, V = np.concatenate(P), np.concatenate(V)
    q, dep = _proj(P, view)
    o = np.argsort(dep.mean(1))
    lo, hi = float(V.min()), float(V.max())
    lv = np.linspace(lo, hi if hi > lo else lo + 1, NB + 1)
    nrm = BoundaryNorm(lv, CMAP.N)
    fc = "#c9d3de" if mesh or (val is None and mode is None) else CMAP(nrm(V[o]))
    ax.add_collection(PolyCollection(q[o], facecolors=fc, edgecolors=(0.06, 0.09, 0.12, 0.55 if mesh else 0.12), linewidths=0.22 if mesh else 0.12))
    ax.autoscale_view()
    ax.set_aspect("equal")
    ax.axis("off")
    if marks and not mesh and mode is None and val is not None:
        Y0, v0 = nodes
        pts, _ = _proj(Y0, view)
        for i, t, c in ((int(np.argmax(v0)), "MAX", "#d6204a"), (int(np.argmin(v0)), "MIN", "#0a7fb0")):
            x, y = pts[i]
            ax.plot(x, y, "o", ms=3.5, mfc=c, mec="white", mew=0.6, zorder=5)
            ax.annotate(f"{t} {v0[i]:.4g}", (x, y), xytext=(10, 10), textcoords="offset points", fontsize=5.6, color=c, weight="bold", zorder=6,
                        bbox={"boxstyle": "round,pad=0.2", "fc": "white", "ec": c, "lw": 0.5}, arrowprops={"arrowstyle": "-", "color": c, "lw": 0.6})
    if title:
        ax.set_title(title, fontsize=7, color="#0c1a2b")
    return lv


def _colorbar(d, rect, lv, label):
    cax = d.fig.add_axes(rect)
    cb = d.fig.colorbar(ScalarMappable(norm=BoundaryNorm(lv, CMAP.N), cmap=CMAP), cax=cax, ticks=lv)
    cb.ax.tick_params(labelsize=5.5)
    cb.ax.set_title(label, fontsize=5.8, loc="left")


def _row(d, res, field, case, h=0.24, label=""):
    """Three views of one field and load case with a banded colour bar."""
    val = np.asarray(res["_fields"][case][field])
    d.line(f"{label or LABEL.get(field, field)} - {case}:  max {val.max():.4g}, min {val.min():.4g}", 8, bold=True)
    y = d.y - h
    for i, (v, t) in enumerate(VIEWS):
        lv = _view(d.fig.add_axes([0.05 + i * 0.29, y, 0.28, h]), res, v, val, case, title=t)
    _colorbar(d, [0.925, y + 0.02, 0.012, h - 0.05], lv, "")
    d.y = y - 0.005
    if field in MEANING:
        d.line(MEANING[field], 7, "#5b6878")
    d.y -= 0.01


def _plot(d, h, series, xl, yl, title, hlines=(), vlines=(), logx=False, y2=None):
    ax = d.fig.add_axes([0.11, d.y - h, 0.8, h - 0.03])
    for x, y, lab, *fmt in series:
        ax.plot(x, y, *(fmt or ["o-"]), lw=1.2, ms=3, label=lab)
    for v, lab, c in hlines:
        ax.axhline(v, color=c, ls="--", lw=0.9, label=lab)
    for v, lab, c in vlines:
        ax.axvline(v, color=c, ls=":", lw=0.9, label=lab)
    if y2:
        a2 = ax.twinx()
        a2.plot(y2[0], y2[1], "s--", color="#a8650c", lw=1, ms=3, label=y2[2])
        a2.tick_params(labelsize=6.5)
        a2.set_ylabel(y2[2], fontsize=7)
        a2.legend(fontsize=6, loc="lower right", frameon=False)
    if logx:
        ax.set_xscale("log")
    style(ax, xl, yl, title)
    ax.legend(fontsize=6, frameon=False)
    d.y -= h + 0.03
    return ax


def fea_report(project, res: dict, others: list | None = None, images: list | None = None) -> bytes:
    from matplotlib.backends.backend_pdf import PdfPages
    s, inp, mdl, val = res["summary"], res["inputs"], res["model"], res["validation"]
    acc, sp, mt = res["acceptance"], res["speeds"], res["material"]
    info = doc_info(project, f"Impeller {res['impeller']} 3D FEA report")
    buf = io.BytesIO()
    with PdfPages(buf) as pdf:
        d = Doc(pdf, "Impeller structural analysis - 3D cyclic-sector FEA (API 617 9th ed. 4.3 / 6.x)", info)
        vm = np.asarray(res["_fields"]["MCS combined"]["von_mises_mpa"])
        cover_img = (images or [{}])[0].get("png") if images else None
        d.cover(f"Impeller {res['impeller']} 3D FEA report",
                cover_info(project, info, [("Impeller", res["impeller"]), ("Material", mt["name"]), ("MCS / overspeed", f"{sp['mcs_rpm']:.0f} / {sp['overspeed_rpm']:.0f} rpm"),
                                           ("Qualified", "YES" if s.get("qualified") else "NO")]),
                cover_img, None if cover_img else (lambda ax: _view(ax, res, "iso", vm, "MCS combined")),
                [(a["criterion"], _f(a["value"], 2), a["status"]) for a in acc])

        d.page("1  Scope, references and inputs")
        d.line("Structural analysis of the impeller with a 3D finite-element model of one blade passage tied by cyclic symmetry: stresses and deformation at "
               "MCS, trip and the 115 % overspeed test (elastic-plastic), bore contact and shrink-fit lift-off, natural frequencies by nodal diameter with the "
               "SAFE / Campbell interference check, and the high- and low-cycle fatigue margins.", 8)
        d.heading("Reference documents")
        for r in ("API 617 9th ed. (2022) Axial and centrifugal compressors", "Impeller drawing and material certificate (when available)",
                  "Lateral analysis report (this project)", "Stage aerodynamic design (CentriForge sizing)"):
            d.line("- " + r, 7.6)
        d.heading("Speeds")
        d.table(["Speed", "rpm", "x MCS", "Tip speed m/s"], [(r["speed"], _f(r["rpm"], 0), _f(r["ratio_mcs"], 3), _f(r["tip_speed_m_s"], 1)) for r in inp["speeds"]],
                [0.07, 0.42, 0.58, 0.72])
        d.heading("Geometry and mass properties")
        d.table(["Parameter", "Unit", "Model", "Vendor", "Diff %"],
                [(b["parameter"], b["unit"], _f(b["value"], 3 if b["unit"] == "kg m2" else 1), _f(b.get("vendor"), 3 if b["unit"] == "kg m2" else 1), _f(b.get("diff_pct"), 1))
                 for b in inp["basic"]], [0.07, 0.45, 0.56, 0.69, 0.82])
        m_ = inp["material"]
        d.heading("Material")
        d.table(["Material", "E GPa", "nu", "rho kg/m3", "Yield MPa", "UTS MPa", "T range C"],
                [(str(m_["name"]), _f(m_["E_gpa"], 0), _f(m_["poisson"], 2), _f(m_["density_kg_m3"], 0), _f(m_["yield_mpa"], 0), _f(m_["uts_mpa"], 0),
                  f"{m_['temperature_range_c'][0]:.0f} - {m_['temperature_range_c'][1]:.0f}")], [0.07, 0.3, 0.41, 0.5, 0.62, 0.73, 0.84])
        d.line(f"Material data: {m_['source']}.", 7, "#5b6878")

        d.page("2  Finite-element model and mesh")
        d.line(f"{mdl['element']}; sector {mdl['sector_deg']:.2f} deg with {mdl['elements']} elements and {mdl['nodes']} nodes ({mdl['dof']} DOF); "
               f"full wheel {mdl['elements_full']} elements. Thickness factors {mdl['thickness_factor']}; FE mass {s['fe_mass_kg']:.2f} kg.", 8)
        for t, lst in (("Restraints (boundary conditions)", mdl["restraints"]), ("Loads", mdl["loads"])):
            d.heading(t)
            for x in lst:
                d.line("- " + x, 7.6)
        y = d.y - 0.3
        for i, (v, t) in enumerate((("sector", "Mesh - sector close-up"), ("front", "Mesh - full wheel, eye side"))):
            _view(d.fig.add_axes([0.06 + i * 0.45, y, 0.43, 0.29]), res, v, mesh=True, title=t)
        d.y = y - 0.02
        d.line("The sector is meshed with hexahedral elements through the hub, blade and shroud; the full wheel is the sector repeated "
               f"{s.get('blades', '') or mdl['elements_full'] // max(mdl['elements'], 1)} times.", 7, "#5b6878")

        d.page("3  Model validation")
        p, dc = val["patch"], val["disc"]
        rows = [("Constant-strain patch test (impeller mesh)", f"max error {p['constant_strain_error_pct']:.1e} %", "< 1e-6 %", "pass" if p["constant_strain_error_pct"] < 1e-6 else "fail"),
                ("Free thermal expansion (100 K)", f"max VM {p['free_thermal_vm_mpa']:.1e} MPa", "~ 0", "pass" if p["free_thermal_vm_mpa"] < 1e-3 else "fail"),
                ("Rotating disc: bore hoop FE / exact", f"{dc['hoop_bore_fe_mpa']:.0f} / {dc['hoop_bore_exact_mpa']:.0f} MPa ({dc['hoop_error_pct']:+.1f} %)", "+/- 5 %",
                 "pass" if abs(dc["hoop_error_pct"]) <= 5 else "fail"),
                ("Rotating disc: bore growth FE / exact", f"{dc['ur_bore_fe_um']:.1f} / {dc['ur_bore_exact_um']:.1f} um ({dc['ur_error_pct']:+.1f} %)", "+/- 5 %",
                 "pass" if abs(dc["ur_error_pct"]) <= 5 else "fail")]
        ax3 = val.get("axi_vs_3d")
        if ax3:
            rows += [("2D axisymmetric vs 3D: peak VM at MCS", f"{ax3['vm_mcs_2d_mpa']:.0f} / {ax3['vm_mcs_3d_mpa']:.0f} MPa", "info", "info"),
                     ("2D vs 3D: tip radial growth (centrifugal)", f"{ax3['tip_growth_2d_um']:.0f} / {ax3['tip_growth_3d_um']:.0f} um", "info", "info")]
        if s.get("convergence_error_pct") is not None:
            ce = s["convergence_error_pct"]
            rows.append(("Mesh convergence (average hoop, medium vs fine)", f"{ce:.2f} %", "<= 5 %", "pass" if ce <= 5 else "fail"))
        d.table(["Check", "Result", "Limit", "Status"], rows, [0.07, 0.47, 0.75, 0.86])
        c = res["convergence"]
        if c:
            _plot(d, 0.3, [([q["dof"] for q in c], [q["peak_vm_mpa"] for q in c], "Peak von Mises (MPa)"),
                           ([q["dof"] for q in c], [q["avg_hoop_mpa"] for q in c], "Average hoop (MPa)", "s-")],
                  "Degrees of freedom (sector)", "Stress (MPa)", "Mesh convergence - centrifugal load at MCS", logx=True)
        d.line("The patch test proves that the element reproduces a constant strain state exactly on the distorted impeller mesh; the rotating-disc "
               "check compares the same element and solver with the closed-form plane-stress solution.", 7.5, "#5b6878")

        for case, lbl in (("MCS combined", f"MCS {sp['mcs_rpm']:.0f} rpm (centrifugal + pressure + thermal + fit)"),
                          (OS_CASE, f"overspeed {sp['overspeed_rpm']:.0f} rpm (elastic-plastic, fit, room temperature)")):
            d.page(f"4  Stress results - {lbl}")
            _row(d, res, "von_mises_mpa", case)
            _row(d, res, "hoop_mpa", case)
        fl = [f for f in ("max_principal_mpa", "disp_um", "safety_factor", "temperature_c") if f in res["_fields"]["MCS combined"]]
        if fl:
            d.page("4  Stress results - further fields at MCS")
            for f in fl[:3]:
                _row(d, res, f, "MCS combined", 0.2)
        d.page("4  Stress results - hot spots at MCS")
        X = res["_sector"].nodes * 1e3
        mc = res["_fields"]["MCS combined"]
        top = np.argsort(vm)[::-1]
        hs, seen = [], []
        for i in top:   # five separated hot spots (>= 3 % of the tip radius apart)
            if all(np.linalg.norm(X[i] - X[j]) > 0.03 * res["mesh"]["r_tip_mm"] for j in seen):
                seen.append(i)
                hs.append((len(hs) + 1, _f(float(np.hypot(*X[i][:2])), 1), _f(float(X[i][2]), 1), _f(vm[i], 0), _f(float(mc["hoop_mpa"][i]), 0),
                           _f(mt["yield_mpa"] / vm[i], 2)))
            if len(hs) == 5:
                break
        d.table(["#", "r mm", "z mm", "von Mises MPa", "Hoop MPa", "Yield / VM"], hs, [0.07, 0.15, 0.3, 0.45, 0.63, 0.8])
        d.line(f"Peak von Mises at MCS {s['peak_vm_mcs_mpa']:.0f} MPa against yield {mt['yield_mpa']:.0f} MPa (ratio {s['peak_vm_mcs_mpa'] / mt['yield_mpa']:.2f}).", 8)

        d.page("5  Stress along paths")
        for pn, pth in list(res["paths"].items())[:3]:
            _plot(d, 0.26, [(pth["x_mm"], pth["cases"][c]["von_mises_mpa"], c, "-") for c in pth["cases"] if "von_mises_mpa" in pth["cases"][c]],
                  pth["axis"], "von Mises (MPa)", pn, hlines=[(mt["yield_mpa"], "Yield", "#c0392b")])

        d.page("6  Bore contact and shrink fit")
        bp = res["bore_path"]
        _plot(d, 0.3, [(bp["z_mm"], bp["ur_mm"], "Bore radial deformation (free, centrifugal MCS)"),
                       (bp["z_mm"], [u - bp["shaft_growth_mm"] for u in bp["ur_mm"]], "Relative to shaft growth", "--")],
              "Bore axial position from back face (mm)", "Radial (mm)", "Bore radial deformation at MCS",
              hlines=[(bp["min_radial_interference_mm"], f"Minimum radial interference {bp['min_radial_interference_mm']:.3f} mm", "#c0392b")])
        ok = bp["contact_length_pct"] >= 50
        d.line(f"Contact length {bp['contact_length_pct']:.0f} % of {bp['axial_length_mm']:.0f} mm (criterion >= 50 %): {'PASS' if ok else 'FAIL'}. "
               f"Interference source: {bp['interference_source']}.", 8, "#1f7a4d" if ok else "#c0392b", True)
        fc = res["fit"]["curve"]
        _plot(d, 0.28, [([q["rpm"] for q in fc], [q["pressure_mpa"] for q in fc], "Fit contact pressure", "-")], "Speed (rpm)", "Contact pressure (MPa)",
              "Shrink-fit contact pressure vs speed", vlines=[(s["lift_off_rpm"], "Lift-off", "#c0392b"), (1.15 * sp["mcs_rpm"], "115 % MCS", "#0b5cad")])
        d.table(["Diametral interference", "Pressure standstill", "Pressure MCS", "Lift-off rpm", "Lift-off / MCS"],
                [(f"{s['fit_interference_um']:.0f} um", f"{s['fit_pressure_standstill_mpa']:.1f} MPa", f"{s['fit_pressure_mcs_mpa']:.1f} MPa", f"{s['lift_off_rpm']:.0f}",
                  f"{s['lift_off_ratio']:.2f} (>= 1.15)")], [0.07, 0.27, 0.45, 0.62, 0.77])

        d.page("7  Overspeed and spin test")
        Sy = mt["yield_mpa"]
        d.table(["Method", "Peak VM MPa", "Yield MPa", "Ratio"],
                [(f"Scaled: VM(MCS) x (Nos / Nmcs)^2 = x {s['overspeed_ratio_sq']:.3f}", _f(s["peak_vm_overspeed_scaled_mpa"], 0), _f(Sy, 0), _f(s["peak_vm_overspeed_scaled_mpa"] / Sy, 2)),
                 ("Elastic-plastic FE (bilinear, deformation theory)", _f(s["peak_vm_overspeed_mpa"], 0), _f(Sy, 0), _f(s["peak_vm_overspeed_mpa"] / Sy, 2))],
                [0.07, 0.6, 0.73, 0.85])
        d.line(f"Yielded volume {s['plastic_volume_overspeed_pct']:.2f} %; permanent growth bore / eye / tip {s['permanent_bore_growth_um']:.1f} / "
               f"{s['permanent_eye_growth_um']:.1f} / {s['permanent_tip_growth_um']:.1f} um.", 8)
        fr = res["overspeed_frames"]
        x = [f["speed_frac"] * 100 for f in fr]
        _plot(d, 0.26, [(x, [f["tip_growth_um"] for f in fr], "Tip growth (um)")], "Speed (% MCS)", "Tip growth (um)", "Spin test: growth and yielding vs speed",
              y2=(x, [f["plastic_volume_pct"] for f in fr], "Yielded volume (%)"))
        _plot(d, 0.26, [(x, [f["max_vm_mpa"] for f in fr], "Peak von Mises")], "Speed (% MCS)", "Stress (MPa)", "Peak stress vs speed", hlines=[(Sy, "Yield", "#c0392b")])
        if "residual_ur_um" in res["_fields"][OS_CASE]:
            d.page("7  Overspeed - permanent deformation")
            _row(d, res, "residual_ur_um", OS_CASE)
            if "plastic_strain_ue" in res["_fields"][OS_CASE]:
                _row(d, res, "plastic_strain_ue", OS_CASE)

        d.page("8  Natural frequencies, SAFE and Campbell diagram")
        nmcs = res["safe"]["speed_range_rpm"][1]
        spd = np.linspace(0, 1.2 * nmcs, 25)
        ser = [(spd, [(m["f0_hz"] ** 2 + (m["f_mcs_hz"] ** 2 - m["f0_hz"] ** 2) * (n / nmcs) ** 2) ** 0.5 for n in spd], f"ND {m['nd']}", "-")
               for m in res["modes"] if m["mode"] == 1]
        ser += [(spd, e["order"] * spd / 60, e["name"], "k--") for e in res["safe"]["excitations"] if e["order"] > 6]
        ax = _plot(d, 0.34, ser, "Speed (rpm)", "Frequency (Hz)", "Campbell diagram (first mode family per nodal diameter)",
                   vlines=[(res["safe"]["speed_range_rpm"][0], "MSS", "#5b6878"), (nmcs, "MCS", "#5b6878")])
        ax.legend(fontsize=5.5, frameon=False, ncol=3)
        hits = res["safe"]["hits"][:10]
        d.heading("Closest interferences (SAFE)")
        d.table(["Excitation", "Order", "ND", "Mode", "Resonance rpm", "Margin %", "In range"],
                [(h["excitation"], h["order"], h["nd"], h["mode"], _f(h["resonance_rpm"], 0), _f(h["margin"] * 100, 1), "fail" if h["in_range"] else "pass") for h in hits],
                [0.07, 0.36, 0.46, 0.53, 0.61, 0.75, 0.86])
        shp = res["mode_shapes"][:4]
        if shp:
            d.page("8  Mode shapes")
            for i, m in enumerate(shp):
                _view(d.fig.add_axes([0.06 + (i % 2) * 0.45, 0.5 - (i // 2) * 0.42, 0.42, 0.38]), res, "front", mode=m,
                      title=f"ND {m['nd']}  mode {m['mode']}  {m['f_mcs_hz']:.0f} Hz at MCS")
            d.y = 0.07
            d.line("Colour shows the relative modal displacement (normalised); deformation exaggerated.", 7, "#5b6878")

        d.page("9  Fatigue (HCF Goodman and LCF)")
        uts, se = mt["uts_mpa"], s["endurance_mpa"]
        ax = _plot(d, 0.34, [([0, uts], [se, 0], "Goodman line", "-"), ([0, uts], [se / 1.5, 0], "SF 1.5", "--")], "Mean stress (MPa)", "Alternating stress (MPa)",
                   "Goodman diagram (HCF)")
        ax.plot([s["mean_mpa"]], [s["alternating_mpa"]], "D", ms=7, color="#c0392b", label=f"Critical point ({s['goodman_zone']})")
        ax.legend(fontsize=6, frameon=False)
        d.table(["Quantity", "Value", "Criterion"],
                [("Goodman safety factor", _f(s["goodman_sf_min"], 2), ">= 1.5"), ("Mean / alternating stress", f"{s['mean_mpa']:.0f} / {s['alternating_mpa']:.1f} MPa", ""),
                 ("Endurance limit", f"{se:.0f} MPa", ""), ("LCF cycles to initiation", f"{s['lcf_cycles']:.2e}", ""), ("Required starts", _f(s["lcf_required"], 0), ""),
                 ("LCF life / required", _f(s["lcf_ratio"], 2), ">= 2")], [0.07, 0.45, 0.7])

        d.page("10  Acceptance criteria")
        d.table(["Criterion", "Value", "Limit", "Unit", "Status"], [(a["criterion"], _f(a["value"], 2), _f(a["limit"], 2), a["unit"], a["status"]) for a in acc],
                [0.07, 0.6, 0.71, 0.8, 0.87], 7, 60)
        d.heading("Other checks")
        d.table(["Check", "Criterion", "Value", "Status"],
                [(c["check"], c["criterion"], c["value"] if isinstance(c["value"], str) else f"{c['value']:.3g}", c["status"]) for c in res["checks"]],
                [0.07, 0.48, 0.74, 0.87], 6.8, 52)
        if others:
            d.heading("11  All impellers (analysed with the same options)")
            d.table(["Imp.", "VM MCS", "VM OS sc.", "VM OS e-p", "Yield", "Bore ur mm", "Min interf.", "Contact %", "Qualified"],
                    [(r["impeller"], _f(r["max_vm_mcs_mpa"], 0), _f(r["max_vm_overspeed_scaled_mpa"], 0), _f(r["max_vm_overspeed_ep_mpa"], 0), _f(r["yield_mpa"], 0),
                      _f(r["max_bore_ur_mm"], 4), _f(r["min_radial_interference_mm"], 4), _f(r["contact_length_pct"], 0), "pass" if r["qualified"] else "fail") for r in others],
                    [0.07, 0.13, 0.23, 0.33, 0.43, 0.52, 0.63, 0.74, 0.84])
        d.line("Preliminary engineering: parametric geometry from the stage design (scaled to vendor mass data when given); verify the detailed design with "
               "CAD-based FEA.", 7, "#5b6878")
        for i, im in enumerate(images or []):
            if i % 2 == 0:
                d.page("Pictures from the 3D viewer")
            d.line(str(im.get("title", ""))[:100], 8, bold=True)
            if d.image(im.get("png"), [0.07, d.y - 0.4, 0.86, 0.39]):
                d.y -= 0.42
        d.signoff((project.test_doc or {}).get("signoff"), ("Prepared - design engineer", "Checked - rotating equipment engineer", "Approved - engineering manager"))
        d.close()
    return buf.getvalue()
