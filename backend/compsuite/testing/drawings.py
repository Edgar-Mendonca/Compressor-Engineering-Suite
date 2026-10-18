"""2.5D (oblique) drawings of the shop test train and the PTC 10 closed loop for the PDF reports,
plus the small page helper shared by the test reports."""

from __future__ import annotations

import io
import textwrap

from matplotlib.patches import Circle, FancyBboxPatch, Polygon, Rectangle

DX, DY = 0.55, 0.38          # oblique depth direction per unit depth
COL = {"vfd": "#4a5563", "motor": "#1f5fa8", "turbine": "#1f5fa8", "coupling": "#d4a72c", "gearbox": "#7d868f",
       "casing": "#5d86a6", "base": "#9aa3ab", "oil": "#a88a4f", "pipe": "#8e9aa5", "cooler": "#5e9c8f", "dgs": "#6c5a9c"}


def _shade(c: str, f: float) -> str:
    c = c.lstrip("#")
    r, g, b = (int(c[i:i + 2], 16) for i in (0, 2, 4))
    k = (lambda v: int(min(255, v * f))) if f < 1 else (lambda v: int(v + (255 - v) * (f - 1)))
    return f"#{k(r):02x}{k(g):02x}{k(b):02x}"


def box(ax, x, y, w, h, d, color, label=None, fs=6, z=2, lc="white"):
    """Oblique box: front face (x, y, w, h) with depth d going up-right."""
    ox, oy = d * DX, d * DY
    ax.add_patch(Polygon([(x, y + h), (x + ox, y + h + oy), (x + w + ox, y + h + oy), (x + w, y + h)], fc=_shade(color, 1.35), ec="#2b3440", lw=0.5, zorder=z))
    ax.add_patch(Polygon([(x + w, y), (x + w + ox, y + oy), (x + w + ox, y + h + oy), (x + w, y + h)], fc=_shade(color, 0.7), ec="#2b3440", lw=0.5, zorder=z))
    ax.add_patch(Rectangle((x, y), w, h, fc=color, ec="#2b3440", lw=0.6, zorder=z + 0.1))
    if label:
        ax.text(x + w / 2, y + h / 2, label, ha="center", va="center", fontsize=fs, color=lc, weight="bold", zorder=z + 1)


def cyl(ax, x, y, w, r, color, z=3):
    """Horizontal shaft / coupling cylinder (front silhouette with an end ellipse)."""
    ax.add_patch(Rectangle((x, y - r), w, 2 * r, fc=color, ec="#2b3440", lw=0.5, zorder=z))
    ax.add_patch(Rectangle((x, y + r * 0.25), w, r * 0.35, fc=_shade(color, 1.4), lw=0, zorder=z + 0.1))


def train(ax, comps: list[dict], probes: bool = True, y0: float = 4.0) -> dict:
    """Driver - couplings - gearbox - compressor on a base plate. Returns anchor x positions by kind."""
    wd = {"vfd": 7, "motor": 15, "turbine": 15, "coupling": 4, "gearbox": 11, "casing": 19}
    main = [c for c in comps if c["kind"] in wd]
    sc = 90 / sum(wd[c["kind"]] + 1.5 for c in main)
    box(ax, 1, y0 - 2.2, 96, 2.2, 6, COL["base"], z=1)
    x, anchors, shaft_y = 2.0, {}, y0 + 8
    for c in main:
        k, w = c["kind"], wd[c["kind"]] * sc
        if k == "vfd":
            box(ax, x, y0, w, 20, 3, COL["vfd"], "VFD", 6)
            ax.add_patch(Rectangle((x + w * 0.2, y0 + 15), w * 0.6, 2.5, fc="#0e1a12", ec="none", zorder=5))
            ax.text(x + w / 2, y0 + 16.2, "Hz", color="#7cf0a8", fontsize=5, ha="center", va="center", zorder=6)
        elif k in ("motor", "turbine"):
            box(ax, x, y0, w, 14, 7, COL[k], "MOTOR" if k == "motor" else "TURBINE", 7)
            for i in range(1, 12):
                ax.plot([x + i * w / 12] * 2, [y0 + 1, y0 + 13], color=_shade(COL[k], 0.8), lw=0.6, zorder=3)
            box(ax, x + w * 0.35, y0 + 14, w * 0.3, 2.5, 3, _shade(COL[k], 0.85), z=2)
        elif k == "coupling":
            cyl(ax, x, shaft_y, w, 1.6, COL["coupling"])
            ax.text(x + w / 2, shaft_y - 3.5, "cpl", fontsize=5, ha="center", color="#5b6878")
        elif k == "gearbox":
            box(ax, x, y0, w, 15, 8, COL["gearbox"], None)
            ax.add_patch(Circle((x + w * 0.42, y0 + 6.5), w * 0.3, fc=_shade(COL["gearbox"], 0.75), ec="#2b3440", lw=0.5, zorder=4))
            ax.add_patch(Circle((x + w * 0.8, y0 + 11), w * 0.12, fc=_shade(COL["gearbox"], 0.75), ec="#2b3440", lw=0.5, zorder=4))
            ax.text(x + w / 2, y0 + 1.5, "GEARBOX", fontsize=5.5, ha="center", color="white", weight="bold", zorder=5)
        elif k == "casing":
            ax.add_patch(FancyBboxPatch((x + 2, y0 + 1), w - 4, 13, boxstyle="round,pad=0,rounding_size=3", fc=COL["casing"], ec="#2b3440", lw=0.6, zorder=3))
            box(ax, x + 2.5, y0 + 1, w - 5, 12.6, 6, COL["casing"], None, z=2)
            ax.text(x + w / 2, y0 + 7, "COMPRESSOR", fontsize=6.5, ha="center", va="center", color="white", weight="bold", zorder=5)
            for nx in (0.3, 0.62):    # suction / discharge nozzles
                box(ax, x + w * nx, y0 + 14, w * 0.12, 4.5, 3, _shade(COL["casing"], 0.9), z=2)
            box(ax, x, y0 + 3, 2.5, 8, 4, "#9aa3ab", z=4)
            box(ax, x + w - 2.5, y0 + 3, 2.5, 8, 4, "#9aa3ab", z=4)
            if probes:
                for px, tag in ((x + 1.2, "1R1"), (x + w - 1.2, "1R2")):
                    for a, s in ((-1, "X"), (1, "Y")):
                        ax.plot([px, px + a * 2.2], [y0 + 11, y0 + 14.5], color="#2b3440", lw=0.8, zorder=6)
                        ax.add_patch(Circle((px + a * 2.2, y0 + 14.8), 0.55, fc="#2e9e6b", ec="#2b3440", lw=0.4, zorder=7))
                    ax.text(px, y0 + 17.3, f"{tag}X/Y", fontsize=5, ha="center", color="#0c1a2b", zorder=7)
        anchors.setdefault(k, (x, w))
        ax.text(x + w / 2, y0 - 4.2, c["name"][:26], fontsize=4.8, ha="center", color="#3b4652", rotation=0)
        if c.get("source"):
            ax.text(x + w / 2, y0 - 6.0, c["source"], fontsize=4.5, ha="center", color="#7a8592")
        x += w + 1.5 * sc
    ax.plot([2, x], [shaft_y, shaft_y], color="#3b4652", lw=1.4, zorder=1.5)
    return anchors


def loop(ax, comps, gas: str, sections: int = 1, seal: dict | None = None):
    """PTC 10 closed loop over the train: compressor suction / discharge, control valve, cooler, orifice,
    gas charging and vent, instruments and the dry-gas-seal panel."""
    a = train(ax, comps, probes=False, y0=4.0)
    x, w = a.get("casing", (60, 30))
    sx, dx = x + w * 0.36, x + w * 0.68
    top = 44
    pipe = dict(color=COL["pipe"], lw=3.2, solid_capstyle="round", zorder=1.8)
    R = x + w + 5
    ax.plot([dx, dx, R, R, sx - 30, sx - 30, sx, sx], [22.5, top, top, 54, 54, top, top, 22.5], **pipe)   # discharge -> valve -> cooler -> orifice -> suction
    vx, vy = R, 48
    ax.add_patch(Polygon([(vx - 1.6, vy - 2), (vx - 1.6, vy + 2), (vx + 1.6, vy - 2), (vx + 1.6, vy + 2)], fc="#e7ebee", ec="#2b3440", lw=0.6, zorder=4))
    ax.text(vx + 2.5, vy, "Control valve", fontsize=5, va="center")
    # cooler on the return line
    box(ax, sx - 4, 51.2, 14, 5.6, 3, COL["cooler"], "COOLER", 5.5)
    # orifice on the suction leg
    ox = sx - 15
    ax.plot([ox, ox], [top - 2.4, top + 2.4], color="#0c1a2b", lw=1.6, zorder=4)
    ax.text(ox, top - 4.2, "FE orifice (ISO 5167)", fontsize=5, ha="center")
    # gas charging, vent and anti-surge
    box(ax, sx - 40, top - 10, 5, 8, 2, "#b8c2c9", gas, 5, lc="#0c1a2b")
    ax.plot([sx - 37.5, sx - 37.5, sx - 30], [top - 2, top, top], color=COL["pipe"], lw=1.4, zorder=1.7)
    ax.text(sx - 37.5, top - 12, "Gas charging", fontsize=4.8, ha="center")
    ax.plot([R, R + 5], [52, 52], color=COL["pipe"], lw=1.4)
    ax.text(R + 5.5, 52, "Vent / anti-surge", fontsize=5, va="center")
    # instruments at the flanges
    for px, py, tags in ((sx, top - 6, ("PT", "TT")), (dx, top - 6, ("PT", "TT")), (ox + 4, top + 1, ("FT",))):
        for i, t in enumerate(tags):
            ax.add_patch(Circle((px + 2.8 + i * 3, py), 1.25, fc="white", ec="#0b5cad", lw=0.7, zorder=6))
            ax.text(px + 2.8 + i * 3, py, t, fontsize=4.2, ha="center", va="center", color="#0b5cad", zorder=7)
    ax.text(sx, top + 2, "Suction", fontsize=5, ha="center")
    ax.text(dx, top + 2, "Discharge", fontsize=5, ha="center")
    # dry gas seal panel
    if seal:
        px = x + w + 12
        box(ax, px, 4, 12, 14, 3, COL["dgs"], "DGS", 6)
        for i, (k, c) in enumerate((("primary", "#e69f00"), ("secondary", "#56b4e9"), ("buffer", "#2e9e6b"))):
            ax.plot([px, x + w - 1 - i * 0.8], [15 - i * 3, 11 - i * 1.2], color=c, lw=0.9, zorder=6)
            ax.plot([px, x + 1 + i * 0.8], [15 - i * 3, 11 - i * 1.2], color=c, lw=0.9, ls=":", zorder=1.6)
            ax.text(px + 13.5 + 1.8, 15 - i * 3, f"{k}: {seal.get(k, '-')}", fontsize=4.5, color=c, va="center")
    if sections > 1:
        ax.text(x + w / 2, top + 6, "Section 1 / 2 tested separately - loop balance valves A, B and seal balance valve C", fontsize=5, ha="center", color="#5b6878")
    ax.set_xlim(0, 125)
    ax.set_ylim(-8, 60)


def axes(fig, rect):
    ax = fig.add_axes(rect)
    ax.set_aspect("equal")
    ax.axis("off")
    return ax


class Doc:
    """A4 portrait pages with a title, wrapped text lines and simple tables."""

    def __init__(self, pdf, subtitle: str):
        self.pdf, self.fig, self.y, self.sub = pdf, None, 0, subtitle

    def page(self, title):
        from matplotlib.figure import Figure
        if self.fig is not None:
            self.pdf.savefig(self.fig)
        self.fig = Figure(figsize=(8.27, 11.69))
        self.fig.text(0.07, 0.955, title, fontsize=13, weight="bold", color="#0c1a2b")
        self.fig.text(0.07, 0.94, self.sub, fontsize=8, color="#5b6878")
        self.fig.add_artist(Rectangle((0.07, 0.932), 0.86, 0.0012, transform=self.fig.transFigure, color="#0b5cad"))
        self.y = 0.91

    def line(self, s, size=8.5, color="#0c1a2b", bold=False, x=0.07, step=0.019):
        for part in textwrap.wrap(s, int(118 * 8.5 / size)) or [""]:
            if self.y < 0.06:
                self.page("(continued)")
            self.fig.text(x, self.y, part, fontsize=size, color=color, weight="bold" if bold else "normal")
            self.y -= step

    def table(self, head, rows, xs, fs=7.5, width=70):
        for j, h in enumerate(head):
            self.fig.text(xs[j], self.y, h, fontsize=fs, weight="bold", color="#5b6878")
        self.y -= 0.017
        for i, r in enumerate(rows):
            if self.y < 0.06:
                self.page("(continued)")
            if i % 2 == 0:
                self.fig.add_artist(Rectangle((0.065, self.y - 0.004), 0.87, 0.015, transform=self.fig.transFigure, color="#f1f3f2", zorder=0))
            for j, v in enumerate(r):
                col = {"pass": "#1f7a4d", "fail": "#c0392b", "attention": "#a8650c", "review": "#a8650c", "Qualified": "#1f7a4d",
                       "Not qualified": "#c0392b"}.get(str(v), "#0c1a2b")
                self.fig.text(xs[j], self.y, str(v)[:width], fontsize=fs, color=col)
            self.y -= 0.016
        self.y -= 0.01

    def chart(self, spec, rect, h=3.0, w=6.6):
        from PIL import Image

        from compsuite.reporting.prism import render
        png = render(spec, {"width_in": w, "height_in": h, "font_size": 9}, "png", dpi=160)["content"]
        ax = self.fig.add_axes(rect)
        ax.imshow(Image.open(io.BytesIO(png)))
        ax.axis("off")

    def drawing(self, rect):
        return axes(self.fig, rect)

    def close(self):
        if self.fig is not None:
            self.pdf.savefig(self.fig)
