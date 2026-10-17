"""Engineering figures (matplotlib, Agg backend) for reports."""

from __future__ import annotations

import base64
import io

import matplotlib

matplotlib.use("Agg")
import matplotlib.pyplot as plt  # noqa: E402

INK = "#1f2933"
GRID = "#d5dbe1"
SERIES = ["#1f6fb2", "#d9822b", "#2e9e6b", "#c2414b", "#7b5ea7", "#8a8f98"]

plt.rcParams.update({"font.size": 8.5, "axes.edgecolor": "#9aa5b1", "axes.labelcolor": INK, "xtick.color": INK,
                     "ytick.color": INK, "axes.grid": True, "grid.color": GRID, "grid.linewidth": 0.6,
                     "axes.spines.top": False, "axes.spines.right": False, "figure.dpi": 110})


def to_png_b64(fig) -> str:
    buf = io.BytesIO()
    fig.savefig(buf, format="png", bbox_inches="tight")
    plt.close(fig)
    return base64.b64encode(buf.getvalue()).decode()


def compressor_map(res: dict):
    fig, ax = plt.subplots(figsize=(6.2, 3.8))
    pm = res["performance_map"]
    for i, line in enumerate(pm["lines"]):
        q = [p["q_am3_h"] for p in line["points"]]
        ax.plot(q, [p["head_kj_kg"] for p in line["points"]], color=SERIES[0], lw=1.4)
        ax.annotate(f"{line['speed_frac']:.0%}", (q[-1], line["points"][-1]["head_kj_kg"]), fontsize=7, color=INK,
                    xytext=(3, 0), textcoords="offset points")
    if pm["surge_line"]:
        ax.plot([p["q_am3_h"] for p in pm["surge_line"]], [p["head_kj_kg"] for p in pm["surge_line"]], color=SERIES[3],
                lw=1.6, label="Surge limit")
        ax.plot([p["q_am3_h"] for p in pm["stonewall_line"]], [p["head_kj_kg"] for p in pm["stonewall_line"]], color=SERIES[5],
                lw=1.2, ls="--", label="Stonewall")
    for op in res["operating_points"]:
        if op.get("head_kj_kg"):
            ax.plot(op["q_am3_h"], op["head_kj_kg"], "o", color=SERIES[1], ms=5)
            ax.annotate(op["case"], (op["q_am3_h"], op["head_kj_kg"]), fontsize=7, xytext=(4, 4), textcoords="offset points")
    ax.set_xlabel("Suction volume flow (Am³/h)")
    ax.set_ylabel("Polytropic head (kJ/kg)")
    ax.legend(frameon=False, fontsize=7)
    ax.set_title("Compressor map (stage stacking)", loc="left", fontsize=9)
    return fig


def campbell(lat: dict):
    """Damped natural frequencies as markers (no index-based line tracking,
    which mis-connects modes that cross or become overdamped)."""
    fig, ax = plt.subplots(figsize=(6.2, 3.8))
    c = lat["campbell"]
    for kind, color, marker in (("forward", SERIES[0], "o"), ("backward", SERIES[5], "s")):
        for damped, alpha in ((False, 0.95), (True, 0.25)):
            xs, ys = [], []
            for sp, row in zip(c["speeds_rpm"], c["modes"]):
                for m in row:
                    if (m["whirl"] == kind or (kind == "backward" and m["whirl"] == "mixed")) and (m["logdec"] > 1.0) == damped:
                        xs.append(sp)
                        ys.append(m["freq_hz"] * 60)
            label = f"{kind.title()} whirl" + (" (log dec > 1)" if damped else "")
            ax.scatter(xs, ys, s=9, color=color, alpha=alpha, marker=marker, label=label, lw=0)
    sp = c["speeds_rpm"]
    ax.plot(sp, sp, color=SERIES[3], lw=1.0, label="1X")
    s = lat["speeds"]
    top = max(sp) * 2
    for k, lab in (("min_rpm", "Min"), ("mcs_rpm", "MCS"), ("trip_rpm", "Trip")):
        ax.axvline(s[k], color=SERIES[2], lw=0.8, ls=":")
        ax.annotate(lab, (s[k], top * 0.97), fontsize=7, rotation=90, ha="right", va="top")
    ax.set_xlabel("Rotor speed (rpm)")
    ax.set_ylabel("Damped natural frequency (cpm)")
    ax.set_ylim(0, top)
    ax.legend(frameon=False, fontsize=7, loc="upper center", bbox_to_anchor=(0.5, -0.16), ncol=3)
    ax.set_title("Campbell diagram", loc="left", fontsize=9)
    return fig


def unbalance(lat: dict):
    fig, ax = plt.subplots(figsize=(6.2, 3.6))
    case = lat["unbalance_cases"][0] if lat["unbalance_cases"] else None
    if case:
        for i, (z, d) in enumerate(list(case["response"]["probes"].items())[:6]):
            ax.semilogy(case["response"]["speeds_rpm"], d["major_um"], color=SERIES[i % len(SERIES)], lw=1.2, label=f"z = {float(z):.2f} m")
    s = lat["speeds"]
    ax.axvspan(s["min_rpm"], s["mcs_rpm"], color=SERIES[2], alpha=0.08, label="Operating range")
    ax.set_xlabel("Rotor speed (rpm)")
    ax.set_ylabel("Response, major semi-axis (µm)")
    ax.legend(frameon=False, fontsize=7, ncol=2)
    ax.set_title("Unbalance response (mode 1 unbalance, 4 x API amount)", loc="left", fontsize=9)
    return fig


def mode_shapes(lat: dict, rotor: dict):
    fig, ax = plt.subplots(figsize=(6.2, 3.2))
    z = lat["z_m"]
    fw = [m for m in lat["modes_at_mcs"] if m["whirl"] == "forward"][:3]
    for i, m in enumerate(fw):
        ax.plot(z, m["shape"], color=SERIES[i], lw=1.4, label=f"{m['freq_cpm']:.0f} cpm, δ = {m['logdec']:.2f}")
    for zb in rotor["bearing_z_m"]:
        ax.axvline(zb, color=SERIES[5], lw=0.8, ls="--")
    ax.set_xlabel("Axial position (m)")
    ax.set_ylabel("Normalised amplitude")
    ax.legend(frameon=False, fontsize=7)
    ax.set_title("Forward mode shapes at MCS", loc="left", fontsize=9)
    return fig


def rotor_layout(rotor: dict):
    fig, ax = plt.subplots(figsize=(6.2, 2.4))
    for s in rotor["sections"]:
        ax.fill_between([s["z0_m"], s["z1_m"]], -s["od_m"] / 2, s["od_m"] / 2, color="#c9d3dd", lw=0)
    for m in rotor["masses"]:
        if m["kind"] == "impeller":
            ax.plot([m["z_m"]] * 2, [-0.18, 0.18], color=SERIES[0], lw=4, alpha=0.6)
    for zb in rotor["bearing_z_m"]:
        ax.plot(zb, -rotor["journal_diameter_m"] / 2 - 0.02, "^", color=SERIES[1], ms=8)
    ax.set_aspect("equal")
    ax.set_xlabel("Axial position (m)")
    ax.set_ylabel("Radius (m)")
    ax.set_title("Rotor layout", loc="left", fontsize=9)
    return fig


def torsional_interference(tor: dict):
    fig, ax = plt.subplots(figsize=(6.2, 3.6))
    inter = tor["interference"]
    for i, (name, f) in enumerate(inter["lines_hz"].items()):
        ax.plot(inter["speeds_rpm"], f, color=SERIES[i % len(SERIES)], lw=1.0, label=name)
    for m in tor["natural"]["modes"][:4]:
        ax.axhline(m["freq_hz"], color=INK, lw=0.8, ls="--")
        ax.annotate(f"{m['freq_hz']:.0f} Hz", (inter["speeds_rpm"][1], m["freq_hz"]), fontsize=7, xytext=(0, 2),
                    textcoords="offset points")
    ax.set_ylim(0, min(4000, max(m["freq_hz"] for m in tor["natural"]["modes"][:4]) * 1.3))
    ax.set_xlabel("Compressor speed (rpm)")
    ax.set_ylabel("Frequency (Hz)")
    ax.legend(frameon=False, fontsize=7, ncol=2)
    ax.set_title("Torsional interference diagram", loc="left", fontsize=9)
    return fig


def shaft_stress(shaft: dict):
    fig, ax = plt.subplots(figsize=(6.2, 3.0))
    pts = shaft["points"]
    ax.plot([p["z_m"] for p in pts], [p["fatigue_safety"] for p in pts], "o-", color=SERIES[0], ms=3, lw=1.0, label="Fatigue SF")
    ax.plot([p["z_m"] for p in pts], [min(p["yield_safety"], 50) for p in pts], "s-", color=SERIES[1], ms=3, lw=1.0, label="Yield SF")
    ax.axhline(1.5, color=SERIES[3], lw=0.8, ls="--")
    ax.set_yscale("log")
    ax.set_xlabel("Axial position (m)")
    ax.set_ylabel("Safety factor")
    ax.legend(frameon=False, fontsize=7)
    ax.set_title("Shaft safety factors", loc="left", fontsize=9)
    return fig


def all_figures(res: dict) -> dict[str, str]:
    cas = res["casings"][0]
    figs = {}
    if res["performance_map"]["lines"]:
        figs["Compressor map"] = to_png_b64(compressor_map(res))
    figs["Rotor layout"] = to_png_b64(rotor_layout(cas["rotor"]))
    lat = cas["lateral"]
    if "campbell" in lat:
        figs["Campbell diagram"] = to_png_b64(campbell(lat))
        figs["Mode shapes"] = to_png_b64(mode_shapes(lat, cas["rotor"]))
        figs["Unbalance response"] = to_png_b64(unbalance(lat))
    figs["Shaft safety factors"] = to_png_b64(shaft_stress(cas["shaft"]))
    figs["Torsional interference"] = to_png_b64(torsional_interference(res["torsional"]))
    return figs
