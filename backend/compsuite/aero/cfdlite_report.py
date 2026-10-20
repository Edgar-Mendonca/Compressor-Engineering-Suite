"""CFD-lite report in the house style: scope and method, meridional flow fields, blade-to-blade loading and
plan-view field, vaneless diffuser / rotating stall / volute, return-vane cascade, checks, CFD export, sign-off."""

from __future__ import annotations

import io

import numpy as np

from compsuite.testing.drawings import Doc
from compsuite.testing.mrt import cover_info, doc_info, style

FIELDS = (("Mrel", "Relative Mach number"), ("W", "Relative velocity W (m/s)"), ("p_bara", "Static pressure (bara)"), ("Wm", "Meridional velocity (m/s)"))
CM = "turbo"


def meridional_plot(ax, mer: dict, key: str, title: str, fig=None):
    r, z, v = np.asarray(mer["r_mm"]), np.asarray(mer["z_mm"]), np.asarray(mer[key])
    cs = ax.contourf(z, r, v, levels=14, cmap=CM)
    for j in range(r.shape[1]):
        ax.plot(z[:, j], r[:, j], color="white", lw=0.4, alpha=0.7)
    for c in ("hub_mm", "shroud_mm"):
        w = np.asarray(mer[c])
        ax.plot(w[:, 1], w[:, 0], color="#0c1a2b", lw=1.2)
    for i in (mer["i_le"], mer["i_te"]):
        ax.plot(z[i], r[i], color="#0c1a2b", lw=0.8, ls="--")
    ax.set_aspect("equal")
    style(ax, "z (mm)", "r (mm)", title)
    if fig is not None:
        fig.colorbar(cs, ax=ax, fraction=0.04, pad=0.02).ax.tick_params(labelsize=6)


def plan_plot(ax, b2b: dict, fig=None):
    p = b2b["plan"]
    x, y0, s, W = np.asarray(p["x_mm"]), np.asarray(p["y_ps_mm"]), np.asarray(p["pitch_mm"]), np.asarray(p["W"])
    K = W.shape[1]
    f = np.linspace(0, 1, K)
    cs = None
    for k in range(2):                                    # two passages
        X = np.repeat(x[:, None], K, 1)
        Y = y0[:, None] + (f[None] + k) * s[:, None]
        cs = ax.contourf(X, Y, W, levels=14, cmap=CM)
    for k in range(3):
        ax.plot(x, y0 + k * s, color="#0c1a2b", lw=2.2)
    ax.set_aspect("equal")
    style(ax, "Meridional distance m (mm)", "r theta (mm)", "Mid-span blade-to-blade relative velocity W (m/s)")
    if fig is not None and cs is not None:
        fig.colorbar(cs, ax=ax, fraction=0.04, pad=0.02).ax.tick_params(labelsize=6)


def cascade_plot(ax, cas: dict):
    cb = np.asarray(cas["camber"])
    for ln in cas["streamlines"]:
        p = np.asarray(ln["pts"])
        ax.plot(p[:, 0], p[:, 1], color="#0b5cad", lw=0.6)
    for k in range(-1, 3):
        ax.plot(cb[:, 0], cb[:, 1] + k * cas["pitch"], color="#0c1a2b", lw=2.4)
    ax.set_xlim(-0.5, 1.8)
    ax.set_ylim(-0.6 * cas["pitch"], 2.6 * cas["pitch"] + 1.0)
    ax.set_aspect("equal")
    style(ax, "x / chord (through-flow)", "y / chord (pitch-wise)", "Return-channel vane cascade: streamlines")


def cfd_report(project, res: dict, imp: dict, images: dict | None = None) -> bytes:
    from matplotlib.backends.backend_pdf import PdfPages
    mer, b2b, st, cas, g = res["meridional"], res["blade_to_blade"], res["stator"], res["cascade"], res["gas"]
    info = doc_info(project, f"Impeller {res['impeller']} CFD-lite flow analysis")
    chips = [(c["check"][:46], f"{c['value']}" if isinstance(c["value"], str) else (f"{c['value']:.2f}" if c["value"] is not None else "-"), c["status"]) for c in res["checks"]]
    buf = io.BytesIO()
    with PdfPages(buf) as pdf:
        d = Doc(pdf, "Stage flow analysis - CFD-lite (streamline curvature, blade-to-blade, diffuser, cascade)", info)
        d.cover(f"Impeller {res['impeller']} CFD-lite flow analysis",
                cover_info(project, info, [("Impeller", res["impeller"]), ("Speed", f"{mer['rpm']:.0f} rpm"), ("Mass flow", f"{g['mdot']:.2f} kg/s"),
                                           ("Blades", imp["blades"])]),
                (images or {}).get("meridional"), None if (images or {}).get("meridional") else (lambda ax: meridional_plot(ax, mer, "Mrel", "Relative Mach number")), chips)

        d.page("1  Scope and method")
        d.line("Fast (seconds) flow analysis of one stage at its design point, used before full 3-D CFD to check blade loading, incidence, choke and stall "
               "margins and Mach-number hot spots, and to export a ready CFD case.", 8)
        for x in ("A  Meridional flow by streamline curvature: quasi-orthogonals from the inlet duct through the impeller to the vaneless diffuser; "
                  "dWm/dn = kappa Wm with the wall curvatures interpolated across the passage; continuity with real-gas density and blade blockage; "
                  "streamlines placed at equal mass fractions; swirl r cu from the Euler work, rising smoothly through the impeller.",
                  "B  Blade-to-blade: suction / pressure-side velocities from the blade loading W_ss - W_ps = (2 pi / Z) d(r cu)/dm (Stanitz) on the hub, "
                  "mid and shroud streamlines; diffusion ratio (Rodgers), pressure-side reversal, inducer throat choke margin, mid-span plan-view field.",
                  "C  Vaneless diffuser: 1-D angular momentum and total pressure with wall friction (Johnston and Dean); flow angle, pressure recovery, loss; "
                  "rotating-stall margin from the diffuser inlet angle against flow vs a critical angle (Senoo-type fit on b2 / r2); volute radial force "
                  "(Stepanoff coefficient).",
                  "D  Return-channel vanes as a 2-D cascade: lumped-vortex panels on a circular-arc camber line with the periodic cascade kernel, iterated on "
                  "the vector-mean velocity: loading, exit angle (deviation), turning, Zweifel coefficient, streamlines.",
                  "E  Export: hub, shroud and mid-span camber curves (TurboGrid-style point lists) and the boundary conditions for a full CFD run."):
            d.line("- " + x, 7.6)
        d.heading("Limitations")
        d.line("Inviscid core with simple blockage, friction and loss models; a parametric meridional contour from the stage design; no tip leakage, "
               "secondary flows or unsteady effects. Confirm the detailed design with 3-D CFD.", 7.5, "#5b6878")
        d.heading("Stage inlet and design point")
        d.table(["Item", "Value"], [("Inlet total pressure", f"{g['p01'] / 1e5:.3f} bara"), ("Inlet total temperature", f"{g['T01'] - 273.15:.1f} C"),
                                    ("Mass flow", f"{g['mdot']:.3f} kg/s"), ("Speed", f"{mer['rpm']:.0f} rpm"), ("Tip speed U2", f"{mer['U2']:.1f} m/s"),
                                    ("D2 / b2 / blades", f"{imp['D2_mm']:.1f} mm / {imp['b2_mm']:.1f} mm / {imp['blades']}"), ("Backsweep", f"{imp['backsweep_deg']:.0f} deg")],
                [0.07, 0.45], 7.5)

        d.page("2  Meridional flow field")
        for k, (key, t) in enumerate(FIELDS):
            meridional_plot(d.fig.add_axes([0.08 + (k % 2) * 0.46, 0.5 - (k // 2) * 0.42, 0.38, 0.38]), mer, key, t, d.fig)
        d.y = 0.06
        d.line("White lines are the computed streamlines (equal mass fractions); dashed lines mark the impeller leading and trailing edges.", 7, "#5b6878")

        d.page("3  Blade-to-blade loading")
        for k, (nm, v) in enumerate(b2b["streamlines"].items()):
            ax = d.fig.add_axes([0.1, 0.68 - k * 0.27, 0.82, 0.21])
            ax.plot(v["m_frac"], v["W_ss"], color="#c0392b", lw=1.3, label="suction side")
            ax.plot(v["m_frac"], v["W_ps"], color="#0b5cad", lw=1.3, label="pressure side")
            ax.plot(v["m_frac"], v["W"], color="#5b6878", lw=0.9, ls="--", label="passage mean")
            style(ax, "Meridional fraction (LE to TE)", "W (m/s)", f"{nm.capitalize()} streamline: diffusion ratio {v['diffusion_ratio']:.2f}, min W_ps {v['min_ps']:.0f} m/s")
            ax.legend(fontsize=6, frameon=False)
        d.y = 0.08
        d.line(f"Inducer throat area {b2b['throat_area_mm2']:.0f} mm2, choke margin A_throat / A* = {b2b['choke_margin']:.2f}.", 8)
        d.page("3  Blade-to-blade plan view")
        plan_plot(d.fig.add_axes([0.08, 0.35, 0.84, 0.55]), b2b, d.fig)

        d.page("4  Vaneless diffuser, rotating stall and volute")
        rd = st["diffuser"]
        ax = d.fig.add_axes([0.1, 0.68, 0.82, 0.22])
        ax.plot([x["r_mm"] for x in rd], [x["alpha_deg"] for x in rd], color="#0b5cad", lw=1.3, label="flow angle from tangential (deg)")
        ax2 = ax.twinx()
        ax2.plot([x["r_mm"] for x in rd], [x["cp_recovery"] for x in rd], color="#d1782a", lw=1.3)
        ax2.set_ylabel("Pressure recovery Cp", fontsize=7)
        ax2.tick_params(labelsize=6)
        style(ax, "Radius (mm)", "Flow angle (deg)", f"Vaneless diffuser: Cp {st['cp_recovery']:.2f}, loss coefficient {st['loss_coefficient']:.3f}")
        sl = st["stall"]
        ax = d.fig.add_axes([0.1, 0.38, 0.82, 0.22])
        ax.plot(np.asarray(sl["q_frac"]) * 100, sl["alpha_deg"], color="#0b5cad", lw=1.3, label="diffuser inlet angle")
        ax.axhline(sl["alpha_crit_deg"], color="#c0392b", ls="--", lw=0.9, label=f"critical angle {sl['alpha_crit_deg']:.1f} deg")
        if sl["stall_q_frac"]:
            ax.axvline(sl["stall_q_frac"] * 100, color="#c0392b", ls=":", lw=0.9, label=f"stall onset {sl['stall_q_frac'] * 100:.0f} %")
        style(ax, "Flow (% design)", "Angle from tangential (deg)", "Rotating-stall margin (vaneless diffuser)")
        ax.legend(fontsize=6, frameon=False)
        ax = d.fig.add_axes([0.1, 0.08, 0.82, 0.22])
        ax.plot([x["q_frac"] * 100 for x in st["volute"]], [x["radial_force_n"] / 1e3 for x in st["volute"]], color="#2e9e6b", lw=1.3)
        style(ax, "Flow (% design)", "Radial force (kN)", "Volute radial force on the rotor (Stepanoff)")

        d.page("5  Return-channel vane cascade")
        cascade_plot(d.fig.add_axes([0.08, 0.45, 0.84, 0.45]), cas)
        ax = d.fig.add_axes([0.1, 0.12, 0.82, 0.24])
        ax.plot(cas["x_load"], cas["dcp"], color="#0b5cad", lw=1.3)
        style(ax, "x / chord", "Loading dCp", f"Vane loading: inlet {cas['inlet_flow_deg']:.1f} deg, exit {cas['exit_flow_deg']:.1f} deg, turning {cas['turning_deg']:.1f} deg, "
              f"Zweifel {cas['zweifel']:.2f}")

        d.page("6  Checks and CFD export")
        d.table(["Check", "Value", "Status"], [(c["check"], c["value"] if isinstance(c["value"], str) else (f"{c['value']:.3f}" if c["value"] is not None else "-"), c["status"])
                                              for c in res["checks"]], [0.07, 0.62, 0.8], 7.5, 70)
        d.heading("CFD export (download from the app)")
        for x in ("hub.curve, shroud.curve: meridional contour (x y z, mm)", "profile.curve: mid-span camber line (x y z, mm)",
                  "boundary_conditions.txt: inlet total pressure and temperature, mass flow (wheel and passage), speed, gas properties, walls, periodicity",
                  "meridional_field.csv: the CFD-lite field for comparison with the 3-D CFD"):
            d.line("- " + x, 7.6)
        d.signoff((project.test_doc or {}).get("signoff"), ("Prepared - aerodynamic engineer", "Checked - rotating equipment engineer", "Approved - engineering manager"))
        d.close()
    return buf.getvalue()
