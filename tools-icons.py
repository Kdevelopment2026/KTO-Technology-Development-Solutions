#!/usr/bin/env python3
"""Re-bake the raster icons from the same geometry as the inline SVG favicon.

The mark is three stacked bars on the ink ground, long to short, in blue,
green and grey — the same three-bar figure as the `<link rel="icon">` data URI
in each page's <head>, drawn on the same 32-unit grid so every size is the
same drawing rather than a redraw.

    python3 tools-icons.py

Writes:
    favicon.ico                     16 / 32 / 48, for browsers that ignore SVG
    assets/img/apple-touch-icon.png 180px, iOS home screen (no rounding — iOS
                                    masks it itself, and pre-rounding it gives
                                    a double-rounded corner)
    assets/img/icon-192.png         referenced by site.webmanifest
    assets/img/icon-512.png         referenced by site.webmanifest

If the mark ever changes, change the SVG in the three <head> blocks and the
`BARS` table below together, then re-run this. Requires Pillow.
"""

import pathlib

from PIL import Image, ImageDraw

OUT = pathlib.Path(__file__).parent / "assets" / "img"
ROOT = pathlib.Path(__file__).parent

INK = "#0F1620"
BLUE = "#3D8BFF"
GREEN = "#24D267"
TEXT = (221, 229, 237, 140)  # #DDE5ED at the SVG's opacity .55

# x, y, width, colour — on the 32x32 grid, each bar 3 units tall
BARS = [(7, 9, 18, BLUE), (7, 15, 13, GREEN), (7, 21, 8, TEXT)]

SUPERSAMPLE = 8  # drawn large and resampled down, for clean bar edges


def mark(size, pad_ratio=0.0, radius_ratio=5 / 32):
    """The mark at `size` px, transparent outside the rounded ground."""
    s = size * SUPERSAMPLE
    im = Image.new("RGBA", (s, s), (0, 0, 0, 0))
    d = ImageDraw.Draw(im)

    inset = int(s * pad_ratio)
    inner = s - 2 * inset
    d.rounded_rectangle(
        (inset, inset, s - inset - 1, s - inset - 1),
        radius=int(inner * radius_ratio),
        fill=INK,
    )

    u = inner / 32.0
    for x, y, w, colour in BARS:
        d.rectangle(
            [inset + x * u, inset + y * u, inset + (x + w) * u, inset + (y + 3) * u],
            fill=colour,
        )
    return im.resize((size, size), Image.LANCZOS)


def flatten(im, size):
    """Composite onto the ink ground. PNG icons should not ship an alpha
    channel — iOS renders transparency as black, which loses the rounding."""
    out = Image.new("RGB", (size, size), INK)
    out.paste(im, (0, 0), im)
    return out


def main():
    apple = flatten(mark(180, pad_ratio=0.10, radius_ratio=0.0), 180)
    apple.save(OUT / "apple-touch-icon.png")

    for px in (192, 512):
        flatten(mark(px), px).save(OUT / f"icon-{px}.png")

    mark(64).save(ROOT / "favicon.ico", sizes=[(16, 16), (32, 32), (48, 48)])

    for name in (
        "favicon.ico",
        "assets/img/apple-touch-icon.png",
        "assets/img/icon-192.png",
        "assets/img/icon-512.png",
    ):
        path = ROOT / name
        print(f"{name:34s} {path.stat().st_size / 1024:6.1f} KB")


if __name__ == "__main__":
    main()
