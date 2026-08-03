"""Bake the 1200x630 social sharing card.

Every LinkedIn, Slack or WhatsApp share of this site renders this image. It is
built from the same hero plate the page uses, darkened with the same elliptical
pool as tools-bake.py, and set in the same two typefaces at the same widths, so
the card and the page are recognisably one thing.

    python3 tools-og-card.py

Fonts are the variable Archivo and IBM Plex Mono Medium TTFs. They are build
input only — the site itself ships the woff2 cuts in assets/fonts/. Point FONTS
at wherever you keep them, or fetch them again:

    curl -L -o Archivo.ttf 'https://github.com/google/fonts/raw/main/ofl/archivo/Archivo%5Bwdth%2Cwght%5D.ttf'
    curl -L -o PlexMono-Medium.ttf 'https://github.com/google/fonts/raw/main/ofl/ibmplexmono/IBMPlexMono-Medium.ttf'
"""

from PIL import Image, ImageDraw, ImageFont
import numpy as np
import os

HERE  = os.path.dirname(os.path.abspath(__file__))
FONTS = os.environ.get("KTO_FONTS", HERE)
OUT   = os.path.join(HERE, "assets", "img", "og-card.jpg")
PLATE = os.path.join(HERE, "assets", "img", "hero-panels.jpg")

W, H = 1200, 630

# The page's own tokens. Keep these in step with :root in styles.css.
INK    = (15, 22, 32)
TEXT   = (221, 229, 237)
BLUE   = (61, 139, 255)
GREEN  = (36, 210, 103)
DARK   = (4, 20, 10)
MUTED  = (147, 163, 180)


def smoothstep(t):
    t = np.clip(t, 0, 1)
    return t * t * (3 - 2 * t)


def plate():
    """Hero plate, cropped to 1200x630 and darkened on the left so the copy
    sits on solid ink while the blue and green panels survive on the right."""
    im = Image.open(PLATE).convert("RGB")
    scale = max(W / im.width, H / im.height)
    im = im.resize((round(im.width * scale), round(im.height * scale)), Image.LANCZOS)
    # Bias the crop right: that is where the panels are.
    left = round((im.width - W) * 0.62)
    top = round((im.height - H) * 0.5)
    im = im.crop((left, top, left + W, top + H))

    a = np.asarray(im).astype(np.float32) / 255.0
    xs = np.linspace(0, 1, W)[None, :]
    ys = np.linspace(0, 1, H)[:, None]
    d = np.sqrt(((xs - 0.20) / 0.62) ** 2 + ((ys - 0.50) / 0.95) ** 2)
    mask = 0.05 + 0.95 * smoothstep((d - 0.55) / 0.55)
    a *= mask[:, :, None]
    return Image.fromarray((np.clip(a, 0, 1) * 255).astype(np.uint8))


def archivo(size, wght=700, wdth=118):
    f = ImageFont.truetype(os.path.join(FONTS, "Archivo.ttf"), size)
    f.set_variation_by_axes([wght, wdth])
    return f


def mono(size):
    return ImageFont.truetype(os.path.join(FONTS, "PlexMono-Medium.ttf"), size)


def tracked(draw, xy, text, font, fill, tracking):
    """PIL has no letter-spacing, and the wide-tracked uppercase label is the
    single most recognisable thing about this brand, so it is drawn a glyph at
    a time. Returns the x it ended at."""
    x, y = xy
    for ch in text:
        draw.text((x, y), ch, font=font, fill=fill)
        x += draw.textlength(ch, font=font) + tracking
    return x


def main():
    im = plate()
    d = ImageDraw.Draw(im)

    M = 74                     # left margin
    label = mono(19)
    x = tracked(d, (M, 66), "KTO", label, BLUE, 5.2)
    tracked(d, (x + 12, 66), "TECHNOLOGY SOLUTIONS", label, TEXT, 5.2)

    # Headline. Three lines, the last carrying the green wash the hero uses,
    # because the word behind it is "results".
    big = archivo(72)
    lines = ["Designing digital learning", "that informs, engages"]
    y = 210
    for line in lines:
        d.text((M, y), line, font=big, fill=TEXT)
        y += 86

    tail, hl = "and ", "delivers results"
    tw = d.textlength(tail, font=big)
    d.text((M, y), tail, font=big, fill=TEXT)

    hx = M + tw
    hw = d.textlength(hl, font=big)
    pad_x, pad_y = 10, 8
    box = d.textbbox((hx, y), hl, font=big)
    d.rectangle(
        [box[0] - pad_x, box[1] - pad_y, box[2] + pad_x, box[3] + pad_y],
        fill=GREEN,
    )
    d.text((hx, y), hl, font=big, fill=DARK)

    # Footer line: the name first. A recruiter should not have to open the page
    # to find out who this is.
    foot = mono(20)
    fy = H - 96
    x = tracked(d, (M, fy), "KAYODE FASHOLA", foot, TEXT, 3.4)
    tracked(d, (x + 14, fy), "· LONDON, ENGLAND", foot, MUTED, 3.4)
    d.text((M, fy + 34),
           "Instructional design · E-learning development · Learning video",
           font=archivo(21, wght=400, wdth=100), fill=MUTED)

    im.save(OUT, quality=86, optimize=True, progressive=True)
    print(f"og-card.jpg: {W}x{H}  {os.path.getsize(OUT) // 1024} KB")


if __name__ == "__main__":
    main()
