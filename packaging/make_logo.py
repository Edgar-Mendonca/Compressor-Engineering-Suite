"""Generate the CentriForge logo (SVG, PNG and ICO) from one geometry.

  python packaging/make_logo.py
"""

from __future__ import annotations

import math
from pathlib import Path

from PIL import Image, ImageDraw

ROOT = Path(__file__).resolve().parents[1]
BLUE, DEEP, CYAN, WHITE = "#0B5CAD", "#072F5F", "#22B8E6", "#FFFFFF"
N_BLADES, R_HUB, R_EYE, R_TIP = 7, 18.0, 7.5, 44.0


def blade(i: int, n: int = 24) -> list[tuple[float, float]]:
    """Backswept blade as a closed polygon in a 128 x 128 box."""
    th0 = 2 * math.pi * i / N_BLADES - math.pi / 2
    side_a, side_b = [], []
    for k in range(n + 1):
        t = k / n
        r = R_HUB - 2 + (R_TIP - R_HUB + 2) * t
        th = th0 + 0.62 * t ** 1.4          # backsweep against rotation
        w = (0.15 - 0.065 * t)                # angular half-thickness, tapering
        for s, lst in ((-1, side_a), (1, side_b)):
            a = th + s * w
            lst.append((64 + r * math.cos(a), 64 + r * math.sin(a)))
    return side_a + side_b[::-1]


def svg(size: int = 128) -> str:
    blades = "".join(f'<path d="M{" L".join(f"{x:.2f} {y:.2f}" for x, y in blade(i))} Z" fill="{WHITE}"/>' for i in range(N_BLADES))
    tip = blade(0)
    return f"""<svg xmlns="http://www.w3.org/2000/svg" width="{size}" height="{size}" viewBox="0 0 128 128" role="img" aria-label="CentriForge logo">
  <defs><linearGradient id="cf-bg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="{BLUE}"/><stop offset="1" stop-color="{DEEP}"/></linearGradient></defs>
  <rect width="128" height="128" rx="26" fill="url(#cf-bg)"/>
  <circle cx="64" cy="64" r="{R_TIP + 4}" fill="{WHITE}" fill-opacity=".10" stroke="{WHITE}" stroke-width="3"/>
  {blades}
  <path d="M{" L".join(f"{x:.2f} {y:.2f}" for x, y in tip)} Z" fill="{CYAN}"/>
  <circle cx="64" cy="64" r="{R_HUB}" fill="{WHITE}"/>
  <circle cx="64" cy="64" r="{R_EYE}" fill="{DEEP}"/>
</svg>
"""


def png(size: int) -> Image.Image:
    s = 8 * size / 128
    im = Image.new("RGBA", (8 * size, 8 * size), (0, 0, 0, 0))
    d = ImageDraw.Draw(im)
    bg = Image.new("RGBA", im.size)
    b1, b2 = (int(BLUE[1:3], 16), int(BLUE[3:5], 16), int(BLUE[5:], 16)), (int(DEEP[1:3], 16), int(DEEP[3:5], 16), int(DEEP[5:], 16))
    for y in range(im.size[1]):
        f = y / im.size[1]
        ImageDraw.Draw(bg).line([(0, y), (im.size[0], y)], fill=tuple(int(a + (b - a) * f) for a, b in zip(b1, b2)) + (255,))
    mask = Image.new("L", im.size, 0)
    ImageDraw.Draw(mask).rounded_rectangle([0, 0, im.size[0] - 1, im.size[1] - 1], radius=26 * s, fill=255)
    im.paste(bg, (0, 0), mask)
    r = R_TIP + 4
    ring = Image.new("RGBA", im.size, (0, 0, 0, 0))
    ImageDraw.Draw(ring).ellipse([(64 - r) * s, (64 - r) * s, (64 + r) * s, (64 + r) * s], fill=(255, 255, 255, 26), outline=WHITE, width=int(3 * s))
    im.alpha_composite(ring)
    d = ImageDraw.Draw(im)
    sc = lambda pts: [(x * s, y * s) for x, y in pts]  # noqa: E731
    for i in range(N_BLADES):
        d.polygon(sc(blade(i)), fill=CYAN if i == 0 else WHITE)
    for r, c in ((R_HUB, WHITE), (R_EYE, DEEP)):
        d.ellipse([(64 - r) * s, (64 - r) * s, (64 + r) * s, (64 + r) * s], fill=c)
    return im.resize((size, size), Image.LANCZOS)


def banner() -> str:
    logo = svg().split("\n", 1)[1].rsplit("</svg>", 1)[0].replace('id="cf-bg"', 'id="cf-bg2"').replace("url(#cf-bg)", "url(#cf-bg2)")
    return f"""<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="260" viewBox="0 0 1200 260" role="img" aria-label="CentriForge">
  <rect width="1200" height="260" fill="#F3F4F1"/>
  <path d="M0 259.5H1200" stroke="#D5D9DE"/>
  <g transform="translate(70 50) scale(1.25)">{logo}</g>
  <text x="270" y="140" font-family="IBM Plex Sans, Segoe UI, Arial, sans-serif" font-size="78" font-weight="700" fill="#0C1A2B">Centri<tspan fill="{BLUE}">Forge</tspan></text>
  <text x="274" y="190" font-family="IBM Plex Mono, Consolas, monospace" font-size="20" letter-spacing="4" fill="#5B6878">COMPRESSOR ENGINEERING SUITE</text>
</svg>
"""


if __name__ == "__main__":
    (ROOT / "frontend/public/favicon.svg").write_text(svg(64))
    (ROOT / "docs/assets/logo.svg").write_text(svg())
    (ROOT / "docs/assets/banner.svg").write_text(banner())
    png(512).save(ROOT / "docs/assets/logo.png")
    png(256).save(ROOT / "packaging/centriforge.ico", sizes=[(16, 16), (24, 24), (32, 32), (48, 48), (64, 64), (128, 128), (256, 256)])
    print("logo written")
