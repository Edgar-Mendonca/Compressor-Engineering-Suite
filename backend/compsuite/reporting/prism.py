"""Publication charts in a GraphPad Prism style (matplotlib).

One renderer for the app and the reports. ``render(spec, opts, fmt)`` takes a
chart spec in a small Plotly-like vocabulary (traces with x, y, name, mode,
line, marker, text, yaxis; layout with title, axis titles, ranges, log axes,
a secondary y axis, shapes and annotations) plus user edits (labels, ranges,
scales, fonts, size, legend, per-series style) and returns SVG, PNG or PDF.

Figures use the object API (no pyplot). rcParams are global in matplotlib,
so rendering is serialised with a lock; one chart takes ~50-200 ms.
"""

from __future__ import annotations

import io
import math
import threading
from typing import Any

import logging

from matplotlib.figure import Figure
from matplotlib.ticker import AutoMinorLocator, LogLocator

logging.getLogger("matplotlib.font_manager").setLevel(logging.ERROR)
FONT = ["Arial", "Helvetica", "Liberation Sans", "DejaVu Sans"]
PALETTES = {
    "engineering": ["#0B5CAD", "#D55E00", "#009E73", "#CC79A7", "#E69F00", "#56B4E9", "#000000", "#7F7F7F"],
    "prism": ["#000000", "#E8251F", "#2C65B0", "#2EA049", "#8C3FA0", "#F28E1C", "#A65628", "#F781BF"],
    "colorblind": ["#0072B2", "#E69F00", "#009E73", "#D55E00", "#CC79A7", "#56B4E9", "#F0E442", "#000000"],
    "grayscale": ["#000000", "#555555", "#888888", "#AAAAAA", "#333333", "#777777", "#999999", "#CCCCCC"],
}
MARKERS = {"circle": "o", "square": "s", "diamond": "D", "triangle-up": "^", "triangle-down": "v", "cross": "P",
           "x": "X", "star": "*", "none": ""}
DASHES = {"solid": "-", "dash": "--", "dot": ":", "dashdot": "-."}
DEFAULTS = {"font_size": 11, "width_in": 6.4, "height_in": 4.0, "line_width": 1.8, "marker_size": 6.0,
            "palette": "engineering", "axis_style": "prism", "grid": "none", "minor_ticks": False,
            "legend": "best", "frame_legend": False, "title_bold": True}


def _title(v: Any) -> str:
    if isinstance(v, dict):
        v = v.get("text", "")
    return str(v or "").replace("<br>", "\n")


def _style_axes(ax, o: dict, fs: float):
    lw = 1.4
    for side in ("left", "bottom", "right", "top"):
        ax.spines[side].set_linewidth(lw)
        ax.spines[side].set_color("#000000")
    if o["axis_style"] == "prism":
        ax.spines["top"].set_visible(False)
        ax.spines["right"].set_visible(False)
        ax.tick_params(direction="out", length=5, width=lw, labelsize=fs * 0.92, colors="#000000")
        ax.tick_params(which="minor", direction="out", length=3, width=lw * 0.7)
    else:  # closed box, ticks inside on all sides (OriginPro look)
        ax.tick_params(direction="in", top=True, right=True, length=5, width=lw, labelsize=fs * 0.92)
        ax.tick_params(which="minor", direction="in", top=True, right=True, length=3, width=lw * 0.7)
    if o["grid"] in ("major", "both"):
        ax.grid(True, which="major", color="#D9D9D9", lw=0.7)
    if o["grid"] == "both":
        ax.grid(True, which="minor", color="#EEEEEE", lw=0.5)
    ax.set_axisbelow(True)


def _apply_axis(ax, spec_axis: dict, o: dict, which: str, fs: float):
    label = o.get(f"{which}label")
    label = _title(spec_axis.get("title")) if label in (None, "") else label
    log = o.get(f"{which}log")
    log = spec_axis.get("type") == "log" if log is None else log
    getattr(ax, f"set_{which[0]}label")(label, fontsize=fs, fontweight="bold" if o["title_bold"] else "normal", color="#000000")
    if log:
        getattr(ax, f"set_{which[0]}scale")("log")
    spec_log = spec_axis.get("type") == "log"
    rng = spec_axis.get("range") if bool(log) == spec_log else None
    if rng and spec_log and all(v is not None for v in rng):  # Plotly log ranges are exponents
        rng = [10 ** rng[0], 10 ** rng[1]]
    user = o.get(f"{which}lim") or [None, None]
    lo = user[0] if user[0] is not None else (rng[0] if rng else None)
    hi = user[1] if user[1] is not None else (rng[1] if rng else None)
    if lo is not None or hi is not None:
        getattr(ax, f"set_{which[0]}lim")(lo, hi)
    axis = ax.xaxis if which.startswith("x") else ax.yaxis
    if o["minor_ticks"]:
        axis.set_minor_locator(LogLocator(subs="auto") if log else AutoMinorLocator())
    return bool(log)


def _shape(ax, s: dict, ax2=None):
    target = ax2 if (s.get("yref") == "y2" and ax2 is not None) else ax
    ln = s.get("line") or {}
    kw = {"color": ln.get("color", "#555555"), "lw": ln.get("width", 1.2), "ls": DASHES.get(ln.get("dash", "solid"), "-"),
          "zorder": 1}
    x0, x1, y0, y1 = s.get("x0"), s.get("x1"), s.get("y0"), s.get("y1")
    xp, yp = s.get("xref") == "paper", s.get("yref") == "paper"
    if s.get("type") == "rect":
        fc = s.get("fillcolor", "#0B5CAD")
        op = s.get("opacity", 0.12)
        if xp and not yp:
            target.axhspan(y0, y1, color=fc, alpha=op, lw=0, zorder=0)
        elif yp and not xp:
            target.axvspan(x0, x1, color=fc, alpha=op, lw=0, zorder=0)
        else:
            target.fill([x0, x1, x1, x0], [y0, y0, y1, y1], color=fc, alpha=op, lw=0, zorder=0)
        return
    if xp and y0 == y1:
        target.axhline(y0, **kw)
    elif yp and x0 == x1:
        target.axvline(x0, **kw)
    else:
        target.plot([x0, x1], [y0, y1], **kw)


_LOCK = threading.Lock()


def render(spec: dict, opts: dict | None = None, fmt: str = "svg", dpi: int = 600) -> dict:
    """Render a chart. Returns {"content": bytes|str, "meta": {...}} (meta for the data cursor and editor)."""
    with _LOCK:
        return _render(spec, opts, fmt, dpi)


def _render(spec: dict, opts: dict | None, fmt: str, dpi: int) -> dict:
    o = {**DEFAULTS, **(opts or {})}
    fs = float(o["font_size"])
    layout = spec.get("layout") or {}
    traces = spec.get("data") or []
    pal = PALETTES.get(o["palette"], PALETTES["engineering"])
    rc = {"font.family": FONT, "font.size": fs, "svg.fonttype": "none", "pdf.fonttype": 42, "axes.unicode_minus": False}
    import matplotlib
    with matplotlib.rc_context(rc):
        fig = Figure(figsize=(float(o["width_in"]), float(o["height_in"])), facecolor="white")
        ax = fig.add_subplot(111)
        ax.set_facecolor("white")
        ax2 = ax.twinx() if any(t.get("yaxis") == "y2" for t in traces) else None
        series_meta = []
        over = {int(k): v for k, v in (o.get("series") or {}).items()}
        ci = 0
        for i, t in enumerate(traces):
            so = over.get(i, {})
            mode = t.get("mode", "lines")
            name = so.get("name") or t.get("name") or f"Series {i + 1}"
            line, mk = t.get("line") or {}, t.get("marker") or {}
            auto = pal[ci % len(pal)]
            if not (line.get("color") or mk.get("color")):
                ci += 1
            color = so.get("color") or line.get("color") or (mk.get("color") if isinstance(mk.get("color"), str) else None) or auto
            visible = so.get("visible", t.get("visible", True) is not False)
            has_line = "lines" in mode
            has_mark = "markers" in mode
            marker = so.get("marker") or (MARKERS.get(mk.get("symbol", "circle"), "o") if has_mark else "")
            dash = so.get("dash") or line.get("dash", "solid")
            lw = float(so.get("width") or line.get("width") or o["line_width"])
            ms = float(so.get("size") or (mk.get("size") if isinstance(mk.get("size"), (int, float)) else None) or o["marker_size"])
            target = ax2 if (t.get("yaxis") == "y2" and ax2 is not None) else ax
            x = [None if v is None else v for v in (t.get("x") or [])]
            y = [None if v is None else v for v in (t.get("y") or [])]
            xs = [math.nan if v is None else v for v in x]
            ys = [math.nan if v is None else v for v in y]
            series_meta.append({"name": name, "color": color, "visible": visible, "marker": marker, "dash": dash,
                                "axis": "y2" if target is ax2 else "y", "legend": t.get("showlegend", True) is not False})
            if not visible or not xs:
                continue
            label = name if t.get("showlegend", True) is not False else "_nolegend_"
            try:
                target.plot(xs, ys, ls=DASHES.get(dash, "-") if has_line else "none", lw=lw, color=color,
                            marker=marker or None, ms=ms, mfc=color, mec="#000000" if has_mark else color,
                            mew=0.8, label=label, zorder=3)
            except (TypeError, ValueError):  # categorical or non-numeric data
                continue
            if "text" in mode and t.get("text"):
                txt = t["text"] if isinstance(t["text"], list) else [t["text"]] * len(xs)
                for xv, yv, s in zip(xs, ys, txt):
                    if s:
                        target.annotate(str(s), (xv, yv), xytext=(4, 4), textcoords="offset points", fontsize=fs * 0.8)
        for s in layout.get("shapes") or []:
            _shape(ax, s, ax2)
        for a in layout.get("annotations") or []:
            ax.annotate(_title(a.get("text")), (a.get("x"), a.get("y")),
                        xycoords="axes fraction" if a.get("xref") == "paper" else "data", fontsize=fs * 0.85)
        xlog = _apply_axis(ax, layout.get("xaxis") or {}, o, "x", fs)
        ylog = _apply_axis(ax, layout.get("yaxis") or {}, o, "y", fs)
        _style_axes(ax, o, fs)
        if ax2 is not None:
            y2 = layout.get("yaxis2") or {}
            ax2.set_ylabel(o.get("y2label") or _title(y2.get("title")), fontsize=fs, fontweight="bold" if o["title_bold"] else "normal")
            if y2.get("type") == "log":
                ax2.set_yscale("log")
            for side in ("left", "bottom", "top"):
                ax2.spines[side].set_visible(False)
            ax2.spines["right"].set_linewidth(1.4)
            ax2.tick_params(direction="out" if o["axis_style"] == "prism" else "in", length=5, width=1.4, labelsize=fs * 0.92)
        title = o.get("title") if o.get("title") not in (None, "") else _title(layout.get("title"))
        if title:
            ax.set_title(title, fontsize=fs * 1.1, fontweight="bold", pad=10)
        handles, labels = ax.get_legend_handles_labels()
        if ax2 is not None:
            h2, l2 = ax2.get_legend_handles_labels()
            handles, labels = handles + h2, labels + l2
        if handles and o["legend"] != "none" and len(handles) > 1 or (handles and o["legend"] not in ("none", "best")):
            kw = {"frameon": bool(o["frame_legend"]), "fontsize": fs * 0.85}
            if o["legend"] == "outside":
                ax.legend(handles, labels, loc="upper left", bbox_to_anchor=(1.02 if ax2 is None else 1.12, 1), **kw)
            elif o["legend"] == "below":
                ax.legend(handles, labels, loc="upper center", bbox_to_anchor=(0.5, -0.18), ncol=min(4, len(handles)), **kw)
            else:
                ax.legend(handles, labels, loc=o["legend"], **kw)
        fig.tight_layout()
        fig.canvas.draw()  # finalise layout so the axes position is exact
        bb = ax.get_position()
        meta = {"axes": {"left": bb.x0, "right": bb.x1, "bottom": bb.y0, "top": bb.y1},
                "xlim": list(ax.get_xlim()), "ylim": list(ax.get_ylim()), "xlog": xlog, "ylog": ylog,
                "y2lim": list(ax2.get_ylim()) if ax2 is not None else None, "series": series_meta,
                "labels": {"title": title, "x": ax.get_xlabel(), "y": ax.get_ylabel(),
                           "y2": ax2.get_ylabel() if ax2 is not None else None}}
        buf = io.BytesIO()
        fig.savefig(buf, format=fmt, dpi=dpi if fmt == "png" else 100, facecolor="white")
    out = buf.getvalue()
    return {"content": out.decode("utf-8") if fmt == "svg" else out, "meta": meta}
