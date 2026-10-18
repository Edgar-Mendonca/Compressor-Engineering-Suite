"""Lateral, stability and torsional analysis reports (A4 PDF) in the CentriForge test-report style: cover with the
result summary, contents, scope / references / assumptions, input data, results per bearing case, conclusion,
appendices, legend and sign-off. Written so that each figure and table answers the usual review questions
(min / average / max bearing cases, node numbers, curves at every close-clearance station, AF / SM notes,
75 % clearance column, seal coefficients, support flexibility, experience plots, absolute Campbell)."""

from __future__ import annotations

import io
import math

import numpy as np

from compsuite.testing.drawings import Doc
from compsuite.testing.mrt import cover_info, doc_info, style

PAL = ["#0b5cad", "#2e9e6b", "#d1782a", "#7b3fb5", "#c0392b", "#5b6878"]
GLOSS_LAT = [("AF", "Amplification factor, half-power method (API 617)"), ("SM", "Separation margin of a critical speed from the operating range"),
             ("Ua / Ur", "Applied / allowable residual unbalance, Ur = 6350 W / Nmc (g mm)"), ("Scc", "Scale factor = min(6, Avl / Amax)"),
             ("Avl", "Mechanical test vibration limit, 25.4 sqrt(12000 / Nmc) um pk-pk"), ("Amax", "Maximum response at the probes, MSS - MCS"),
             ("MCS / MSS / Nmc", "Maximum / minimum continuous speed"), ("Kxx / Kyy", "Bearing direct stiffness, horizontal / vertical"),
             ("Cxx / Cyy", "Bearing direct damping"), ("K / k, C / c", "Seal direct / cross-coupled stiffness and damping"),
             ("CSR", "Critical speed ratio = MCS / first critical on rigid supports"), ("FCSR", "First critical speed on rigid supports"),
             ("qA / QA", "Aerodynamic cross-coupling per impeller / total (API 617)"), ("Q0", "Cross-coupling that drives the log decrement to zero"),
             ("delta (log dec)", "Logarithmic decrement of the first forward mode"), ("DE / NDE", "Drive end / non-drive end"),
             ("TNF", "Torsional natural frequency"), ("VSD", "Variable speed drive"), ("SC", "Short circuit (2- / 3-phase, at the motor terminals)")]


def _f(v, n=1):
    if v is None:
        return "-"
    if isinstance(v, (bool, np.bool_)):
        return "yes" if v else "no"
    if isinstance(v, (int, float, np.floating, np.integer)):
        return "-" if not math.isfinite(float(v)) else f"{float(v):.{n}f}"
    return str(v)


def _zx(z_nodes, n):
    """Node positions (mm) for a shape vector; the case models may carry extra seal nodes."""
    z = np.asarray(z_nodes, float) * 1e3
    return z if len(z) == n else np.linspace(z.min(), z.max(), n)


def _st(ok):
    return "pass" if ok else "fail"


def _refs(project, extra: list[str]) -> list[str]:
    own = [r for r in str((project.test_doc or {}).get("references", "")).splitlines() if r.strip()]
    return own + extra


def _assumptions(d: Doc, items: list[str]):
    d.heading("Assumptions")
    for a in items:
        d.line("- " + a, 7.6)


def rotor_drawing(ax, rotor: dict, z_nodes: list, stations: list | None = None, every: int = 2):
    """Rotor model: sections to scale, added masses (impellers, sleeves, coupling), bearings, close-clearance
    stations and node numbers."""
    from matplotlib.patches import Polygon, Rectangle
    for s in rotor["sections"]:
        r0, r1 = s["od_m"] / 2 * 1e3, s.get("id_m", 0) / 2 * 1e3
        ax.add_patch(Rectangle((s["z0_m"] * 1e3, -r0), (s["z1_m"] - s["z0_m"]) * 1e3, 2 * r0, fc="#c9d3dc", ec="#2b3440", lw=0.5))
        if r1 > 0:
            ax.add_patch(Rectangle((s["z0_m"] * 1e3, -r1), (s["z1_m"] - s["z0_m"]) * 1e3, 2 * r1, fc="white", ec="#2b3440", lw=0.3))
    rmax = max(s["od_m"] for s in rotor["sections"]) / 2 * 1e3
    for m in rotor["masses"]:
        z = m["z_m"] * 1e3
        h = rmax * (2.6 if "mpeller" in m["label"] else 1.4)
        ax.add_patch(Rectangle((z - 6, -h), 12, 2 * h, fc="#6f8ea3" if "mpeller" in m["label"] else "#d4a72c", ec="#2b3440", lw=0.4, alpha=0.85))
    for i, zb in enumerate(rotor["bearing_z_m"]):
        z = zb * 1e3
        ax.add_patch(Polygon([(z, -rmax * 1.25), (z - 18, -rmax * 2.1), (z + 18, -rmax * 2.1)], fc="#0b5cad", ec="#2b3440", lw=0.5))
        ax.text(z, -rmax * 2.5, "DE brg" if i == 0 else "NDE brg", ha="center", fontsize=5.5, color="#0b5cad")
    for s in stations or []:
        if "earing" in s["label"]:
            continue
        z = s["z_m"] * 1e3
        ax.plot([z, z], [rmax * 1.1, rmax * 3.1], color="#c0392b", lw=0.6, ls=":")
        ax.text(z, rmax * 3.25, s["label"].replace("seal", "").strip()[:12], fontsize=4.6, rotation=90, ha="center", va="bottom", color="#c0392b")
    for i, z in enumerate(z_nodes):
        if i % every == 0:
            ax.text(z * 1e3, -rmax * 3.0, str(i + 1), fontsize=4.2, ha="center", color="#5b6878")
            ax.plot([z * 1e3] * 2, [-rmax * 0.15, rmax * 0.15], color="#5b6878", lw=0.3)
    ax.set_xlim(-30, max(z_nodes) * 1e3 + 30)
    ax.set_ylim(-rmax * 3.6, rmax * 6.5)
    ax.set_aspect("auto")
    ax.axis("off")
    ax.text(0, rmax * 6.0, "Rotor model: shaft sections to scale, impellers (blue-grey), sleeves / thrust collar / coupling (gold), "
            "bearings (blue), close-clearance stations (red), node numbers below", fontsize=5.5, color="#5b6878")


def _data_table(d, project, res, cas, L):
    sz, db = res["sizing"], project.design_basis
    mp, rot = L["mass_properties"], cas["rotor"]
    dw = project.bearings.rotor_weight_drawing_kg
    dev = (mp["mass_kg"] / dw - 1) * 100 if dw else None
    seal = project.seals.shaft_end_seal.replace("_", " ")
    d.table(["Item", "Value", "Item", "Value"], [
        ("Number of stages", len(cas["impellers"]["impellers"]), "Max absorbed power", f"{sz['shaft_power_kw']:.0f} kW"),
        ("Rated speed", f"{sz['speed_rpm']:.0f} rpm", "MSS / MCS / trip", f"{L['speeds']['min_rpm']:.0f} / {L['speeds']['mcs_rpm']:.0f} / {L['speeds']['trip_rpm']:.0f} rpm"),
        ("Driver", db.driver_type.replace("_", " "), "Coupling hub diameter", f"{rot['coupling_diameter_m'] * 1e3:.0f} mm"),
        ("Shaft-end seal", f"{seal}, nominal dia {rot['seal_diameter_m'] * 1e3:.0f} mm", "Balance drum dia", f"{rot.get('balance_piston_diameter_m', 0) * 1e3:.0f} mm"),
        ("Rotor mass (model)", f"{mp['mass_kg']:.1f} kg", "Rotor mass (drawing)", f"{dw:.1f} kg ({dev:+.1f} %)" if dw else "enter in Bearings"),
        ("Rotor length / bearing span L", f"{mp['length_m'] * 1e3:.0f} / {rot['bearing_span_m'] * 1e3:.0f} mm", "Avg shaft dia under impellers D",
         f"{rot['shaft_diameter_impellers_m'] * 1e3:.0f} mm (L/D {rot['span_to_diameter']:.2f})"),
    ], [0.07, 0.27, 0.52, 0.72], 7, 40)
    if dev is not None and abs(dev) > 3:
        d.line(f"Model rotor mass differs from the drawing by {dev:+.1f} % (> 3 %): update the rotor model.", 7.5, "#c0392b")


def _bearing_table(d, project, L):
    b = project.bearings
    cases = L["bearing_cases"]
    g = {c["key"]: list(c["bearing_coefficients"].values())[0]["geometry"] for c in cases}
    d.table(["Journal bearing", "Value", "", ""], [
        ("Type / make & model", f"{b.journal_type.replace('_', ' ')}, {b.pads} pads", "Make / model", b.bearing_make_model or "vendor data"),
        ("Pad L/D / pivot", f"{b.length_to_diameter:.2f} / offset {b.pivot_offset:.2f}", "Load", "between pads" if b.load_between_pads else "on pad"),
        ("Diameter", f"{list(g.values())[0]['diameter_mm']:.0f} mm", "Oil", f"{b.oil_grade}, inlet {b.oil_supply_temperature_c - b.oil_supply_tolerance_c:.0f} / "
         f"{b.oil_supply_temperature_c:.0f} / {b.oil_supply_temperature_c + b.oil_supply_tolerance_c:.0f} C"),
        *[(f"Clearance ({k})", f"diametral {2 * v['radial_clearance_um']:.0f} um (radial {v['radial_clearance_um']:.0f})", "Preload", _f(v.get("preload"), 3)) for k, v in g.items()],
        ("Support", "rigid" if not b.support_stiffness_n_m else f"{b.support_stiffness_n_m:.3g} N/m in series", "Seals in model", "yes" if b.include_seals_in_lateral else "no"),
    ], [0.07, 0.27, 0.56, 0.7], 7, 44)


def _cases_table(d, L):
    d.table(["Case", "Bearing clearance / oil inlet", "Oil inlet C", "Status"], [(c["key"], c["label"], _f(c["oil_inlet_c"], 1), _st(c["pass"])) for c in L["bearing_cases"]],
            [0.07, 0.17, 0.66, 0.8], 7.2, 60)


# ------------------------------------------------------------------ lateral
def lateral_report(project, res: dict, casing: int = 0, urt: dict | None = None) -> bytes:
    from matplotlib.backends.backend_pdf import PdfPages
    cas = res["casings"][casing]
    L = cas["lateral"]
    sp, cases = L["speeds"], L["bearing_cases"]
    info = doc_info(project, "Lateral analysis report")
    concl = L["conclusion"]
    buf = io.BytesIO()
    with PdfPages(buf) as pdf:
        d = Doc(pdf, "Lateral analysis - API 617 9th ed. (2022) / API 684", info)
        summ = [(c["label"].replace(" inlet temperature", ""), f"{len(c['unbalance'])} cases", _st(c["pass"])) for c in cases]
        summ.append(("Overall lateral checks", "", _st(concl["pass"])))
        d.cover("Lateral analysis report", cover_info(project, info, [("Casing", casing + 1), ("Speeds MSS / MCS", f"{sp['min_rpm']:.0f} / {sp['mcs_rpm']:.0f} rpm"),
                                                                      ("Bearing cases", len(cases)), ("Overall", "PASS" if concl["pass"] else "REVIEW")]),
                None, lambda ax: rotor_drawing(ax, cas["rotor"], L["z_m"]), summ)

        d.page("1  Scope, references and assumptions")
        d.line("Lateral (damped and undamped) analysis of the compressor rotor to API 617 9th ed. (2022) 4.6 (6.8): undamped critical speed map, "
               "unbalance response with the unbalance placed to excite each mode, amplification factors and separation margins, deflected shapes and "
               "the close-clearance check, for every bearing case (bearing clearance with the matching preload and oil inlet temperature). "
               "Rotor stability is reported separately (Stability analysis report).", 8)
        d.heading("Reference documents")
        for r in _refs(project, ["API 617 9th ed. (2022) Axial and centrifugal compressors and expander-compressors",
                                 "API 684 2nd ed. Rotordynamic tutorial", "Stability analysis report (this project)", "Rotor assembly drawing, bearing and seal drawings, mechanical datasheet"]):
            d.line("- " + r, 7.6)
        d.heading("Calculation method")
        d.line("Finite-element rotor (Timoshenko beams with shear and rotary inertia, gyroscopics), speed-dependent tilting-pad bearing "
               "coefficients, Ritz-reduced complex eigen and forced response; cross-checked against the open-source ROSS rotordynamics library.", 7.6)
        _assumptions(d, list(L["trace"].assumptions))

        d.page("2  Compressor, rotor and bearing data")
        _data_table(d, project, res, cas, L)
        d.heading("Journal bearings")
        _bearing_table(d, project, L)
        d.heading("Bearing cases analysed")
        _cases_table(d, L)
        ax = d.fig.add_axes([0.06, 0.06, 0.88, max(d.y - 0.1, 0.12)])
        rotor_drawing(ax, cas["rotor"], L["z_m"], cases[0]["unbalance"][0]["clearance"] if cases else None)

        d.page("3  Bearing and seal coefficients")
        for c in cases:
            for lb, t in c["bearing_coefficients"].items():
                if not t.get("rows"):
                    continue
                d.line(f"{lb} - {c['label']}", 8, bold=True)
                d.table(["rpm", "Kxx N/m", "Kyy N/m", "Kxy", "Kyx", "Cxx N s/m", "Cyy N s/m"],
                        [(f"{r['speed_rpm']:.0f}", f"{r['kxx']:.3e}", f"{r['kyy']:.3e}", f"{r['kxy']:.2e}", f"{r['kyx']:.2e}", f"{r['cxx']:.3e}", f"{r['cyy']:.3e}")
                         for r in t["rows"]], [0.07, 0.17, 0.3, 0.43, 0.55, 0.67, 0.8], 6.6)
                break
        sl = L.get("seal_coefficients_lateral") or []
        if sl:
            d.heading("Labyrinth / balance-drum seal coefficients in the model (at MCS)")
            d.table(["Seal", "z mm", "Radial clr mm", "K N/m", "k N/m", "C N s/m", "c N s/m"],
                    [(s["label"], f"{s['z_m'] * 1e3:.0f}", f"{s['radial_clearance_mm']:.3f}", f"{s['K']:.3e}", f"{s['k']:.3e}", f"{s['C']:.1f}", f"{s['c']:.1f}") for s in sl],
                    [0.07, 0.24, 0.33, 0.45, 0.59, 0.73, 0.85], 6.8)

        # undamped critical speed map
        d.page("4  Undamped critical speed map")
        ucs = L["undamped_critical_map"]
        ax = d.fig.add_axes([0.12, 0.47, 0.8, 0.42])
        for j, f in enumerate(np.asarray(ucs["critical_speeds_rpm"]).T[:4]):
            ax.loglog(ucs["k_n_m"], f, color="#2b3440", lw=1.1, label="undamped criticals" if j == 0 else None)
        for i, c in enumerate(cases):
            sc_ = c["stiffness_curve"]
            ax.loglog(sc_["kxx"], sc_["speeds_rpm"], color=PAL[i], lw=1, ls="--", label=f"Kxx {c['key']}")
            ax.loglog(sc_["kyy"], sc_["speeds_rpm"], color=PAL[i], lw=1, ls=":", label=f"Kyy {c['key']}")
        for n, lab in ((sp["min_rpm"], "MSS"), (sp["mcs_rpm"], "MCS")):
            ax.axhline(n, color="#c0392b", lw=0.6, ls="-.")
            ax.text(ucs["k_n_m"][0], n, lab, fontsize=6, color="#c0392b", va="bottom")
        style(ax, "Support stiffness (N/m)", "Critical speed (rpm)", "Undamped critical speed map with bearing stiffness (min / avg / max)")
        ax.legend(fontsize=5.5, frameon=False, ncol=4)
        d.y = 0.42
        d.table(["Case", "Mode", "Kxx intersection rpm", "Kyy intersection rpm"], [(c["key"], u["mode"], _f(u["kxx_rpm"], 0), _f(u["kyy_rpm"], 0))
                                                                                  for c in cases for u in c["undamped_criticals"]], [0.07, 0.2, 0.32, 0.56], 7)
        d.page("4  Undamped mode shapes per bearing case")
        for i, c in enumerate(cases):
            ax = d.fig.add_axes([0.1, 0.68 - i * 0.29, 0.84, 0.22])
            for j, m in enumerate(c["undamped_modes"][:3]):
                sh = np.asarray(m["shape"], float)
                sh = sh / (np.abs(sh).max() or 1)
                ax.plot(_zx(L["z_m"], len(sh)), sh, color=PAL[j], lw=1.2, label=f"mode {j + 1}: {m['freq_rpm']:.0f} rpm")
            for zb in cas["rotor"]["bearing_z_m"]:
                ax.axvline(zb * 1e3, color="#9aa3ab", lw=0.6, ls=":")
            style(ax, "Axial position (mm)", "Normalised", f"{c['label']}")
            ax.legend(fontsize=6, frameon=False, ncol=3)

        d.page("5  Damped Campbell diagram")
        camp = L["campbell"]
        ax = d.fig.add_axes([0.12, 0.5, 0.8, 0.38])
        for kind, col in (("forward", "#0b5cad"), ("backward", "#d1782a")):
            xs = [s for s, ms in zip(camp["speeds_rpm"], camp["modes"]) for m in ms if m["whirl"] == kind and m["logdec"] < 1]
            ys = [m["freq_hz"] * 60 for ms in camp["modes"] for m in ms if m["whirl"] == kind and m["logdec"] < 1]
            ax.scatter(xs, ys, s=5, color=col, label=kind)
        ax.plot(camp["speeds_rpm"], camp["speeds_rpm"], color="#c0392b", lw=0.8, label="1X")
        for n in (sp["min_rpm"], sp["mcs_rpm"]):
            ax.axvline(n, color="#5b6878", lw=0.6, ls=":")
        ax.set_ylim(0, max(camp["speeds_rpm"]) * 2)
        style(ax, "Rotor speed (rpm)", "Damped natural frequency (cpm)", "Damped Campbell (nominal bearings; modes with log dec < 1)")
        ax.legend(fontsize=6, frameon=False)

        for c in cases:
            for u in c["unbalance"]:
                d.page(f"6  Unbalance response - {c['key']} - case {u['case']}: {u['label']}")
                d.table(["Unbalance", "Node", "z mm", "Amount g mm", "Phase deg", "Basis"],
                        [(i + 1, x.get("node", "-"), f"{x['z'] * 1e3:.0f}", f"{x['g_mm']:.1f}", f"{x['phase_deg']:.0f}", x.get("basis", "")) for i, x in enumerate(u["unbalances"])],
                        [0.07, 0.17, 0.25, 0.34, 0.47, 0.58], 7, 50)
                ax = d.fig.add_axes([0.1, 0.5, 0.84, 0.3])
                for i, (lb, b) in enumerate(u["bode"].items()):
                    ax.plot(u["speeds_rpm"], b["amp_pp_um"], color=PAL[i], lw=1.4, label=f"{lb} (probe)")
                for i, (lb, v) in enumerate((u.get("bode_stations") or {}).items()):
                    if "earing" not in lb:
                        ax.plot(u["speeds_rpm"], v, color=PAL[(i + 2) % 6], lw=0.8, ls="--", label=lb)
                ax.axhline(u["avl_um"], color="#c0392b", lw=0.7, ls="-.", label="Avl")
                for n in (sp["min_rpm"], sp["mcs_rpm"]):
                    ax.axvline(n, color="#5b6878", lw=0.6, ls=":")
                style(ax, "", "Amplitude (um pk-pk)", "Response at the probes and every close-clearance station")
                ax.legend(fontsize=5, frameon=False, ncol=3)
                ax2 = d.fig.add_axes([0.1, 0.32, 0.84, 0.14])
                for i, (lb, b) in enumerate(u["bode"].items()):
                    ph = np.degrees(np.unwrap(np.radians(b["phase_deg"])))
                    ax2.plot(u["speeds_rpm"], ph - 360 * math.floor(min(ph) / 360), color=PAL[i], lw=1)
                style(ax2, "Speed (rpm)", "Phase (deg)")
                d.y = 0.27
                d.table(["Location", "Nc rpm", "AF", "SM actual %", "SM required %", "Amp um", "Status"],
                        [(x["location"], _f(x["speed_rpm"], 0), _f(x["af"], 2) if x["af"] is not None and math.isfinite(float(x["af"])) else "n/a",
                          _f(x["sm_actual_pct"]), _f(x["sm_required_pct"]) if x["sm_required_pct"] is not None else "not required",
                          _f(x["amplitude_pp_um"], 2), _st(x["pass"])) for x in u["criticals"]], [0.07, 0.2, 0.31, 0.4, 0.53, 0.69, 0.8], 7)
                d.line(f"Amax {u['amax_um']:.2f} um vs Avl {u['avl_um']:.1f} um; Scc {u['scc']:.2f}. AF by the half-power method; where no half-power band "
                       "exists the AF follows from the damping of the eigenvalue. A critical with AF < 2.5 is critically damped and needs no separation margin.", 7, "#5b6878")
                d.page(f"7  Deflected shapes and clearance check - {c['key']} - case {u['case']}")
                ax = d.fig.add_axes([0.1, 0.6, 0.84, 0.28])
                for i, sh in enumerate(u["deflected_shapes"]):
                    v = np.asarray(sh["shape_um"], float)
                    ax.plot(_zx(L["z_m"], len(v)), v, color=PAL[i % 6], lw=1.2, label=f"{sh['label']} {sh['speed_rpm']:.0f} rpm")
                for zb in cas["rotor"]["bearing_z_m"]:
                    ax.axvline(zb * 1e3, color="#9aa3ab", lw=0.6, ls=":")
                style(ax, "Axial position (mm)", "Amplitude (um, major axis)", "Deflected shapes at the critical speeds and Nmc")
                ax.legend(fontsize=6, frameon=False, ncol=3)
                d.y = 0.54
                d.table(["Station", "Node", "Dia clr um", "75 % clr um", "Ap um", "Scc x Ap um", "Ratio", "Status"],
                        [(x["label"], x.get("node", "-"), _f(x["diametral_clearance_um"], 0), _f(x["limit_um"], 1), _f(x["ap_um"], 2), _f(x["corrected_um"], 2),
                          _f(x["corrected_um"] / x["limit_um"] * 0.75, 3), _st(x["qualified"])) for x in u["clearance"]],
                        [0.07, 0.27, 0.35, 0.46, 0.57, 0.66, 0.77, 0.86], 6.8)
                d.line("Close-clearance check (API 617): Ap = maximum response up to trip speed; Scc x Ap must stay below 75 % of the minimum diametral running clearance.", 7, "#5b6878")

        d.page("8  Unbalance response verification test and conclusion")
        if urt:
            d.table(["URT check point (API 617 8.3.3)", "Value"], [
                ("Ur, coupling-end journal", f"{urt['ur_g_mm']:.1f} g mm"), ("Trial unbalance", f"{urt['multiple']:.1f} x Ur = {urt['trial_g_mm']:.0f} g mm ({urt['trial_mass_g']:.2f} g at r = {urt['radius_mm']:.0f} mm)"),
                ("Predicted critical with the trial unbalance", f"{urt['predicted_critical_rpm']:.0f} rpm"), ("Test speed", f"{urt['test_speed_rpm']:.0f} rpm"),
                ("Acceptance", "measured critical within +-5 % of the prediction; probe response at MCS within the predicted range")], [0.07, 0.5])
        d.heading("Conclusion")
        for it in concl["items"]:
            if "stability" not in it["item"]:
                d.line(f"[{'PASS' if it['pass'] else 'FAIL'}] {it['item']}", 7.8, "#1f7a4d" if it["pass"] else "#c0392b")
        ok = all(c["pass"] for c in cases)
        d.line(("Since every bearing case meets the API 617 separation margin, amplitude and close-clearance requirements, the rotor is acceptable "
                "for lateral vibration over the operating speed range." if ok else
                "At least one bearing case does not meet an API 617 requirement: see the failed items above."), 8.5, bold=True)
        d.line("Rotor stability (Level I screening and Level II log decrement) is covered in the Stability analysis report.", 7.6, "#5b6878")

        d.page("Appendix A  Rotor geometry")
        d.table(["Section", "z0 mm", "z1 mm", "OD mm", "ID mm"], [(s["label"], f"{s['z0_m'] * 1e3:.1f}", f"{s['z1_m'] * 1e3:.1f}", f"{s['od_m'] * 1e3:.1f}", f"{s.get('id_m', 0) * 1e3:.1f}")
                                                             for s in cas["rotor"]["sections"]], [0.07, 0.35, 0.48, 0.61, 0.74], 6.8)
        d.table(["Added mass", "z mm", "kg", "Ip kg m2", "It kg m2"], [(m["label"], f"{m['z_m'] * 1e3:.1f}", f"{m['mass_kg']:.2f}", f"{m['ip_kgm2']:.4f}", f"{m['it_kgm2']:.4f}")
                                                                  for m in cas["rotor"]["masses"]], [0.07, 0.35, 0.48, 0.61, 0.74], 6.8)
        d.page("Appendix B  Bearing coefficients (all cases, both bearings)")
        for c in cases:
            for lb, t in c["bearing_coefficients"].items():
                d.line(f"{lb} - {c['label']}", 7.6, bold=True)
                d.table(["rpm", "Kxx", "Kyy", "Kxy", "Kyx", "Cxx", "Cyy", "Cxy", "Cyx"],
                        [(f"{r['speed_rpm']:.0f}", *[f"{r[k]:.2e}" for k in ("kxx", "kyy", "kxy", "kyx", "cxx", "cyy", "cxy", "cyx")]) for r in t["rows"]],
                        [0.07, 0.15, 0.25, 0.35, 0.45, 0.55, 0.65, 0.75, 0.85], 6.2)
        _legend(d, GLOSS_LAT[:12])
        d.signoff((project.test_doc or {}).get("signoff"))
        d.close()
    return buf.getvalue()


def _legend(d: Doc, items):
    d.page("Abbreviations")
    d.table(["Term", "Meaning"], items, [0.07, 0.25], 7.4, 100)


# ------------------------------------------------------------------ stability
def stability_report(project, res: dict, casing: int = 0) -> bytes:
    from matplotlib.backends.backend_pdf import PdfPages
    cas = res["casings"][casing]
    L = cas["lateral"]
    S, st = L["stability_api617"], L["stability"]
    sp = L["speeds"]
    info = doc_info(project, "Stability analysis report")
    l1, l2 = S["level1"], S["level2"]
    buf = io.BytesIO()
    with PdfPages(buf) as pdf:
        d = Doc(pdf, "Rotor stability analysis - API 617 9th ed. (2022) / API 684", info)
        summ = [(f"Level II {r['label'].split(' /')[0]}", f"delta {r['delta_f']:.3f}", _st(r["pass_api"] and r["pass_dep"] is not False)) for r in l2]
        summ += [(f"Screening {r['label'].split(' /')[0]}", f"Q0/QA {_f(r['q0_over_qa'], 2)}", "review" if r["level2_required"] else "pass") for r in l1]
        d.cover("Stability analysis report", cover_info(project, info, [("CSR", f"{S['csr']:.2f}"), ("Avg gas density", f"{S['avg_gas_density_kg_m3']:.1f} kg/m3"),
                                                                        ("QA", f"{S['qa_total_kn_mm']:.2f} kN/mm"), ("Overall", "PASS" if S["pass"] else "REVIEW")]),
                None, lambda ax: rotor_drawing(ax, cas["rotor"], L["z_m"]), summ)
        d.page("1  Scope, references and assumptions")
        d.line("Rotor stability to API 617 9th ed. (2022): screening with the anticipated aerodynamic cross-coupling QA (Level I) and, where required, "
               "the full stability analysis (Level II) with bearings, labyrinth / balance-drum seals and QA, for every bearing case and the "
               "minimum and maximum seal clearance. Acceptance: final log decrement delta_f >= 0.1 (purchaser value where stricter).", 8)
        d.heading("Reference documents")
        for r in _refs(project, ["API 617 9th ed. (2022)", "API 684 2nd ed.", "Lateral analysis report (this project)"]):
            d.line("- " + r, 7.6)
        _assumptions(d, list(L["trace"].assumptions)[-4:] + ["Seal coefficients: one-control-volume bulk-flow estimate; replace with vendor seal data",
                                                              "Bearing coefficients evaluated at the frequency of the first forward mode (synchronously reduced)"])
        d.page("2  Compressor, rotor and bearing data")
        _data_table(d, project, res, cas, L)
        _bearing_table(d, project, L)
        _cases_table(d, L)
        d.table(["Stability parameter", "Value"], [("First critical on rigid supports FCSR", f"{S['fcsr_rpm']:.0f} rpm"), ("Critical speed ratio CSR = MCS / FCSR", f"{S['csr']:.3f}"),
                                                   ("Average gas density (inlet / discharge)", f"{S['avg_gas_density_kg_m3']:.2f} kg/m3"),
                                                   ("QA applied at", f"z = {S['location_z_m'] * 1e3:.0f} mm (mid-span)")], [0.07, 0.55])
        d.page("3  Anticipated aerodynamic cross-coupling")
        d.table(["Impeller", "Power kW", "Dc mm", "Hc mm", "rho_s kg/m3", "rho_d kg/m3", "qA kN/mm"],
                [(q["impeller"], _f(q["power_kw"], 0), _f(q["dc_mm"], 1), _f(q["hc_mm"], 2), _f(q["rho_s"], 2), _f(q["rho_d"], 2), _f(q["qa_kn_mm"], 3)) for q in S["qa_table"]],
                [0.07, 0.18, 0.3, 0.42, 0.54, 0.68, 0.82], 7)
        d.line(f"QA = sum qA = {S['qa_total_kn_mm']:.3f} kN/mm; qA = (HP Bc C / (Dc Hc Nr)) (rho_d / rho_s), Bc = 3, C = 9.55 (API 617).", 7.6, "#5b6878")
        d.page("4  Screening (Level I): sensitivity and screening chart")
        for i, r in enumerate(l1):
            sw = r.get("sweep_kn_mm") or []
            q, ld = [x[0] for x in sw], [x[1] for x in sw]
            if q and ld:
                ax = d.fig.add_axes([0.1 + (i % 2) * 0.45, 0.62 - (i // 2) * 0.3, 0.38, 0.24])
                ax.plot(q, ld, color=PAL[i], lw=1.3)
                ax.axhline(0, color="#2b3440", lw=0.6)
                ax.axvline(r["qa_kn_mm"], color="#c0392b", lw=0.7, ls="--")
                ax.text(r["qa_kn_mm"], max(ld) * 0.9, " QA", fontsize=6, color="#c0392b")
                style(ax, "Cross-coupling Q (kN/mm)", "Log decrement", r["label"].split(" /")[0])
        ax = d.fig.add_axes([0.1, 0.12, 0.38, 0.22])
        sb = np.asarray(S["screening_boundary"], float)
        ax.plot(sb[:, 0], sb[:, 1], color="#c0392b", lw=1.2, label="screening boundary")
        ax.plot([S["avg_gas_density_kg_m3"]], [S["csr"]], "o", color="#0b5cad", ms=6, label="this rotor")
        style(ax, "Average gas density (kg/m3)", "CSR", "Screening chart (Fulton / API)")
        ax.legend(fontsize=6, frameon=False)
        ax = d.fig.add_axes([0.56, 0.12, 0.38, 0.22])
        pd = max(c.discharge_pressure_bara for c in project.cases) * 14.5038
        dp = pd - min(c.suction_pressure_bara for c in project.cases) * 14.5038
        ax.semilogx([pd * dp], [S["csr"]], "o", color="#0b5cad", ms=6)
        ax.set_xlim(1e3, 1e8)
        ax.set_ylim(0, 4)
        style(ax, "Pd x dP (psi^2)", "CSR", "Kirk-Donald experience plot")
        ax.text(1.5e3, 3.6, f"this rotor: Pd dP = {pd * dp:.3g} psi^2, CSR {S['csr']:.2f}", fontsize=6)
        ax.text(1.5e3, 0.3, "compare with the published Kirk-Donald experience line", fontsize=5.5, color="#5b6878")
        d.y = 0.08
        d.page("4  Screening results")
        d.table(["Case", "Q0 kN/mm", "QA kN/mm", "Q0/QA", "delta_A", "Region", "Level II required", "Reasons"],
                [(r["case"], _f(r["q0_kn_mm"], 2), _f(r["qa_kn_mm"], 2), _f(r["q0_over_qa"], 2), _f(r["delta_a"], 3), r["region"], _f(r["level2_required"]), "; ".join(r["reasons"])[:40])
                 for r in l1], [0.07, 0.16, 0.26, 0.36, 0.45, 0.54, 0.62, 0.74], 6.8)
        d.page("5  Level II stability")
        d.table(["Case", "delta_b (bearings)", "delta_f min seal clr", "delta_f max seal clr", "delta_f", "Freq cpm", "Status"],
                [(r["case"], _f(r["delta_b"], 3), _f(r["delta_f_min_seal"], 3), _f(r["delta_f_max_seal"], 3), _f(r["delta_f"], 3), _f(r["freq_f_min_seal_cpm"], 0),
                  _st(r["pass_api"] and r["pass_dep"] is not False)) for r in l2], [0.07, 0.17, 0.32, 0.47, 0.62, 0.72, 0.84], 7)
        ax = d.fig.add_axes([0.1, 0.42, 0.84, 0.3])
        for i, r in enumerate(l2):
            for key, ls_ in (("vs_speed_min_seal", "-"), ("vs_speed_max_seal", "--")):
                v = r.get(key) or []
                if v:
                    ax.plot([x["speed_rpm"] for x in v], [x["logdec"] for x in v], color=PAL[i], ls=ls_, lw=1.2, label=f"{r['case']} {'min' if 'min' in key else 'max'} seal clr")
        ax.axhline(S["logdec_min_api"], color="#c0392b", lw=0.8, ls="-.", label="API minimum")
        for n in (sp["min_rpm"], sp["mcs_rpm"]):
            ax.axvline(n, color="#5b6878", lw=0.6, ls=":")
        style(ax, "Speed (rpm)", "Log decrement (1st forward)", "Log decrement vs speed with QA, seals and bearings")
        ax.legend(fontsize=5.5, frameon=False, ncol=3)
        d.y = 0.36
        for k in ("min", "max"):
            rows = S["seal_coefficients"].get(k) or []
            d.line(f"Seal coefficients at {k} seal clearance", 8, bold=True)
            d.table(["Seal", "Radial clr mm", "K N/m", "k N/m", "C N s/m", "c N s/m", "Swirl in"],
                    [(s["label"], _f(s["radial_clearance_mm"], 3), f"{s['K']:.3e}", f"{s['k']:.3e}", _f(s["C"], 1), _f(s["c"], 1), _f(s["pre_swirl_ratio"], 2)) for s in rows],
                    [0.07, 0.24, 0.36, 0.5, 0.64, 0.75, 0.86], 6.6)
        d.page("6  Conclusion")
        for it in L["conclusion"]["items"]:
            if "stability" in it["item"].lower():
                d.line(f"[{'PASS' if it['pass'] else 'REVIEW'}] {it['item']}", 7.8, "#1f7a4d" if it["pass"] else "#a8650c")
        ok = all(r["pass_api"] and r["pass_dep"] is not False for r in l2)
        d.line(("Since the final log decrement of the first forward mode exceeds the required minimum for every bearing case and seal clearance, "
                "the rotor is stable to API 617." if ok else "The final log decrement is below the minimum in at least one case: see section 5."), 8.5, bold=True)
        _legend(d, [g for g in GLOSS_LAT if g[0] in ("CSR", "FCSR", "qA / QA", "Q0", "delta (log dec)", "K / k, C / c", "Kxx / Kyy", "MCS / MSS / Nmc", "DE / NDE")])
        d.signoff((project.test_doc or {}).get("signoff"))
        d.close()
    return buf.getvalue()


# ------------------------------------------------------------------ torsional
def torsional_report(project, res: dict) -> bytes:
    from matplotlib.backends.backend_pdf import PdfPages
    T = res["torsional"]
    m, cc = T["model"], T["conclusion"]
    info = doc_info(project, "Torsional analysis report")
    tr = project.train
    buf = io.BytesIO()
    with PdfPages(buf) as pdf:
        d = Doc(pdf, "Torsional analysis - API 617 9th ed. (2022) / API 684", info)
        summ = [("Interferences in the margin band", f"{cc['interferences']} ({cc['dangerous']} on exciting line)", "review" if cc["dangerous"] else "pass"),
                ("Steady-state resonant response", "", _st(cc["steady_state_pass"]))]
        if cc["vsd_pass"] is not None:
            summ.append(("VSD harmonic response", "", _st(cc["vsd_pass"])))
        if cc["short_circuit_pass"] is not None:
            summ.append(("Short-circuit transients", "", _st(cc["short_circuit_pass"])))
            summ.append(("Fatigue life", "infinite" if cc["infinite_life"] else "finite", "pass" if cc["infinite_life"] or all(
                v["miner_damage"] < 1 for v in T["short_circuit"].values()) else "fail"))
        d.cover("Torsional analysis report", cover_info(project, info, [("Train", " - ".join(c["name"] for c in m["components"])[:44]),
                                                                        ("Rated power", f"{m['rated_power_kw']:.0f} kW"), ("Modes", len(T["tnf"])),
                                                                        ("Overall", "ACCEPTABLE" if cc["acceptable"] else "REVIEW")]),
                None, lambda ax: train_drawing(ax, m), summ)
        d.page("1  Scope, references and assumptions")
        d.line("Torsional analysis of the complete train (driver, couplings, gearbox, compressor) to API 617 9th ed. (2022) and API 684: undamped natural "
               "frequencies and mode shapes, Campbell diagrams, separation margins, steady-state resonant response, VSD harmonic response over the "
               "acceleration and operating range, and transient short-circuit response with stress, coupling and fatigue checks.", 8)
        d.heading("Reference documents")
        for r in _refs(project, ["API 617 9th ed. (2022)", "API 684 2nd ed.", "API 671 Special-purpose couplings", "Motor datasheet (inertia, air-gap torque, short-circuit data)",
                                 "VSD datasheet (torque harmonics)", "Coupling datasheets", "Gearbox datasheet"]):
            d.line("- " + r, 7.6)
        _assumptions(d, list(T["trace"].assumptions) + [f"Short-circuit protection clearing time: {tr.breaker_clearing_time_s} s" if tr.breaker_clearing_time_s
                                                         else "Short-circuit torque applied for the full decay (no protection clearing time entered)",
                                                         f"Cumulative fatigue over {tr.short_circuit_events} transient events (Miner, Basquin S-N through 0.9 tau_u at 1e3 and tau_e at 1e6 cycles)"])
        d.page("2  Train model")
        ax = d.fig.add_axes([0.05, 0.72, 0.9, 0.18])
        train_drawing(ax, m)
        d.y = 0.69
        d.table(["Component", "Kind", "Speed rpm", "Ip kg m2", "Stiffness N m/rad", "Stations"],
                [(c["name"], c["kind"], _f(c["speed_rpm"], 0), _f(c.get("ip_kgm2"), 3), f"{c.get('stiffness_nm_rad') or 0:.3e}", "-".join(map(str, c.get("stations") or [])))
                 for c in m["components"]], [0.07, 0.3, 0.41, 0.52, 0.64, 0.82], 7, 34)
        g = m.get("gear")
        if g:
            d.table(["Gear", "Value"], [("Ratio", f"{g['ratio']:.4f} ({g['pinion_teeth']} / {g['bull_gear_teeth']} teeth)"), ("Module / helix", f"{g['module_mm']} mm / {g['helix_angle_deg']} deg"),
                                       ("Face width", f"{g['face_width_mm']:.0f} mm"), ("Mesh stiffness", f"{g['mesh_stiffness_n_mm']:.3e} N/mm")], [0.07, 0.4], 7)
        d.page("3  Natural frequencies and mode shapes")
        d.table(["Mode", "Hz", "cpm", "Main participation (strain energy)"], [(t["mode"], _f(t["freq_hz"], 2), _f(t["freq_cpm"], 0), ", ".join(t["main"])[:70]) for t in T["tnf"]],
                [0.07, 0.15, 0.25, 0.37], 7, 80)
        ax = d.fig.add_axes([0.1, 0.08, 0.84, max(d.y - 0.14, 0.2)])
        for j, t in enumerate(T["tnf"][:5]):
            sh = np.asarray(t["shape"], float)
            ax.plot(range(1, len(sh) + 1), sh / (np.abs(sh).max() or 1), "o-", ms=2.5, color=PAL[j], lw=1, label=f"mode {t['mode']} {t['freq_hz']:.1f} Hz")
        style(ax, "Station", "Normalised twist angle", "Mode shapes (referred to the compressor speed)")
        ax.legend(fontsize=6, frameon=False, ncol=3)
        cp = T["campbell"]
        d.page("4  Campbell diagrams (speed ratio and absolute)")
        rated = res["sizing"]["speed_rpm"]
        for k, absolute in enumerate((False, True)):
            ax = d.fig.add_axes([0.1, 0.55 - k * 0.45, 0.84, 0.36])
            x = np.asarray(cp["speed_pct"]) * (rated / 100 if absolute else 1)
            for e in cp["excitations"]:
                y = np.asarray(e["cpm"]) / (60 if absolute else 1)
                ax.plot(x, y, lw=0.9, label=e["name"])
            for f_ in cp["tnf_cpm"]:
                ax.axhline(f_ / (60 if absolute else 1), color="#2b3440", lw=0.7, ls="--")
            lo, hi = cp["operating_pct"]
            mlo, mhi = cp["margin_pct"]
            sc = rated / 100 if absolute else 1
            ax.axvspan(lo * sc, hi * sc, color="#2e9e6b", alpha=0.1)
            ax.axvspan(mlo * sc, lo * sc, color="#e0a020", alpha=0.08)
            ax.axvspan(hi * sc, mhi * sc, color="#e0a020", alpha=0.08)
            ax.set_ylim(0, max(cp["tnf_cpm"][:6]) * 1.2 / (60 if absolute else 1))
            style(ax, "Compressor speed (rpm)" if absolute else "Speed (% rated)", "Frequency (Hz)" if absolute else "Frequency (cpm)",
                  "Campbell diagram - absolute values" if absolute else "Campbell diagram - speed ratio")
            ax.legend(fontsize=5, frameon=False, ncol=4)
        d.page("5  Separation margins (API 617, 10 %)")
        exc = [c["excitation"] for c in T["separation_table"][0]["cells"]]
        d.table(["Mode", "cpm", *[e[:14] for e in exc[:6]]], [(r["mode"], _f(r["freq_cpm"], 0), *[("INT " if c["interferes"] else "") + _f(c["margin_pct"], 0) + " %" for c in r["cells"][:6]])
                                                            for r in T["separation_table"]], [0.07, 0.13, 0.23, 0.35, 0.47, 0.59, 0.71, 0.83], 6.4)
        d.line("INT = inside the margin band; such resonances are assessed by the steady-state response below (dangerous when the exciting shaft "
               f"line carries more than {project.train.danger_strain_energy_share * 100:.0f} % of the modal strain energy).", 7.4, "#5b6878")
        d.heading("Steady-state resonant response at the interferences")
        rows = []
        for s_ in T["steady_state"]:
            for r in s_["rotors"]:
                rows.append((s_["mode"], s_["excitation"][:22], r["rotor"], _f(r["max_shear_mpa"], 2), _f(r["allowable_mpa"], 1), _st(r["pass"])))
        d.table(["Mode", "Excitation", "Shaft", "Alt shear MPa", "Allowable MPa", "Status"], rows, [0.07, 0.14, 0.4, 0.58, 0.72, 0.86], 6.8)
        cpl = [(s_["mode"], c_["coupling"], _f(c_.get("safety_factor") or c_.get("goodman_safety"), 2), _st(c_["pass"])) for s_ in T["steady_state"] for c_ in s_["couplings"]]
        if cpl:
            d.table(["Mode", "Coupling", "Goodman safety", "Status"], cpl, [0.07, 0.15, 0.6, 0.8], 6.8)
        v = T.get("vsd")
        if v:
            d.page("6  VSD torque harmonics")
            d.table(["Harmonic order", "Content % rated torque"], [(x["order"], _f(x["pct"], 2)) for x in v["lines"]], [0.07, 0.4], 7)
            d.table(["Mode", "cpm", "Order", "Crossing % speed", "In operating range", "Evaluated"],
                    [(x["mode"], _f(x["freq_cpm"], 0), x["order"], _f(x["speed_pct"], 1), _f(x["in_operating_range"]), _f(x["evaluated"])) for x in v["crossings"]][:24],
                    [0.07, 0.15, 0.27, 0.37, 0.55, 0.75], 6.8)
            if v["responses"]:
                ax = d.fig.add_axes([0.1, 0.08, 0.84, max(d.y - 0.14, 0.18)])
                for i, r in enumerate(v["responses"]):
                    for n, cur in list(r["curves"].items())[:3]:
                        ax.plot(r["speed_pct"], cur, lw=0.9, color=PAL[i % 6], ls=["-", "--", ":"][list(r["curves"]).index(n) % 3], label=f"order {r['order']} {n}")
                style(ax, "Speed (% rated)", "Shear (MPa) / coupling torque (N m)", "VSD harmonic response over the acceleration")
                ax.legend(fontsize=5, frameon=False, ncol=3)
        for name, sc in (T.get("short_circuit") or {}).items():
            d.page(f"7  Transient: {name.lower()}")
            ax = d.fig.add_axes([0.1, 0.7, 0.84, 0.18])
            ax.plot(sc["t_s"], sc["excitation_nm"], color="#c0392b", lw=0.9)
            style(ax, "", "Air-gap torque (N m)", f"Excitation{' (cleared at %.3f s)' % sc['clearing_time_s'] if sc.get('clearing_time_s') else ''}")
            ax = d.fig.add_axes([0.1, 0.46, 0.84, 0.2])
            for i, (n, ser) in enumerate(sc["series"].items()):
                ax.plot(np.linspace(0, sc["t_s"][-1], len(ser)), ser, lw=0.8, color=PAL[i % 6], label=n)
            style(ax, "Time (s)", "Shear (MPa) / torque (N m)", "Response")
            ax.legend(fontsize=5.5, frameon=False, ncol=3)
            d.y = 0.41
            d.table(["Shaft", "Station", "Max total MPa", "Allowable MPa", "Alt MPa", "Endurance MPa", "Miner D", "Status"],
                    [(r["rotor"], r["station"], _f(r["max_total_shear_mpa"], 1), _f(r["allowable_mpa"], 1), _f(r["alternating_shear_mpa"], 1), _f(r["endurance_shear_mpa"], 1),
                      f"{r['miner']['damage']:.2e}" if r.get("miner") else "-", _st(r["pass"])) for r in sc["rotors"]], [0.07, 0.2, 0.29, 0.41, 0.53, 0.63, 0.75, 0.86], 6.6)
            d.table(["Coupling", "Max total N m", "Min total N m", "Allowable N m", "Reversal", "Status"],
                    [(c_["coupling"][:28], _f(c_["max_total_torque_nm"], 0), _f(c_.get("min_total_torque_nm"), 0), _f(c_["allowable_nm"], 0), _f(c_.get("torque_reversal")), _st(c_["pass"]))
                     for c_ in sc["couplings"]], [0.07, 0.36, 0.5, 0.63, 0.76, 0.86], 6.6)
            if sc.get("torque_reversal"):
                d.line("Torque reversal through a coupling / the gear mesh: check gear backlash and tooth impact with the gear vendor.", 7.4, "#a8650c")
        d.page("8  Conclusion")
        for t in cc.get("text", []):
            d.line("- " + t, 8)
        life = [f"{n}: cumulative damage D = {v['miner_damage']:.2e} over {v['events']} events" for n, v in (T.get("short_circuit") or {}).items()]
        for t in life:
            d.line("- " + t, 8)
        d.line(("Since the separation margins are met or the resonant responses are acceptable, and the transient stresses stay within the allowables "
                "with the fatigue damage below 1, the train is acceptable for torsional vibration." if cc["acceptable"] else
                "At least one torsional check is not met: see the sections above."), 8.5, bold=True)
        d.page("Appendix A  Train geometry (stations)")
        d.table(["Station", "Rotor", "x mm", "Ip kg m2", "Speed ratio", "L mm", "OD mm", "ID mm", "k N m/rad"],
                [(s_["station"], s_["rotor"][:18], _f(s_["x_mm"], 0), _f(s_["ip_kgm2"], 4), _f(s_.get("speed_ratio"), 3), _f(s_.get("length_mm"), 0), _f(s_.get("od_mm"), 1), _f(s_.get("id_mm"), 1),
                  f"{s_['k_nm_rad']:.3e}" if s_.get("k_nm_rad") else "-") for s_ in m["stations"]], [0.07, 0.14, 0.32, 0.4, 0.5, 0.6, 0.68, 0.76, 0.84], 6.2)
        _legend(d, [g for g in GLOSS_LAT if g[0] in ("TNF", "VSD", "SC", "MCS / MSS / Nmc", "DE / NDE")] + [("Miner D", "Cumulative fatigue damage sum (D < 1 required)")])
        d.signoff((project.test_doc or {}).get("signoff"))
        d.close()
    return buf.getvalue()


def train_drawing(ax, model: dict):
    """Mass-elastic schematic: inertia discs (area ~ Ip^0.4) on shaft springs, gear mesh, station numbers."""
    from matplotlib.patches import FancyBboxPatch
    st = model["stations"]
    x, pos, prev = [], 0.0, None      # evenly spaced stations, a gap between rotors
    for s_ in st:
        pos += 100.0 if prev is None else (100.0 if s_["rotor"] == prev else 220.0)
        x.append(pos)
        prev = s_["rotor"]
    x = np.asarray(x)
    ip = np.asarray([max(s["ip_kgm2"], 1e-6) for s in st])
    h = 0.25 + 0.75 * (ip / ip.max()) ** 0.4
    ax.plot(x, np.zeros_like(x), color="#5b6878", lw=1.5, zorder=1)
    cols = {}
    for i, s in enumerate(st):
        c = cols.setdefault(s["rotor"], PAL[len(cols) % 6])
        ax.add_patch(FancyBboxPatch((x[i] - 22, -h[i]), 44, 2 * h[i], boxstyle="round,pad=0,rounding_size=3", fc=c, ec="#2b3440", lw=0.4, zorder=2))
        ax.text(x[i], -1.25, str(s["station"]), fontsize=4.5, ha="center", color="#5b6878")
    for r, c in cols.items():
        xs = [x[i] for i, s in enumerate(st) if s["rotor"] == r]
        ax.text(np.mean(xs), 1.2, r[:22], fontsize=5.5, ha="center", color=c, weight="bold")
    ax.set_xlim(x.min() - 40, x.max() + 40)
    ax.set_ylim(-1.6, 1.6)
    ax.axis("off")
