from PIL import Image
import numpy as np, sys, os

SRC = "/private/tmp/claude-501/-Users-kfmedia-Desktop-Claude--Claude-Code-projects-Websites/4672a3bb-274e-4d08-ba99-f0dc0673c9ad/scratchpad/"
OUT = "/Users/kfmedia/Desktop/Claude /Claude Code projects/Websites/elearning-portfolio/assets/img/"

def smoothstep(t):
    t = np.clip(t, 0, 1)
    return t*t*(3 - 2*t)

def bake(src, dst, width, cx, cy, rx, ry, floor, vign_top=0.0, vign_bot=0.0, q=82):
    """Multiply an elliptical pool of darkness into the plate, centred on where
    the copy sits, so text contrast does not depend on CSS scrims at all."""
    im = Image.open(src).convert("RGB")
    w, h = im.size
    im = im.resize((width, round(h*width/w)), Image.LANCZOS)
    W, H = im.size
    a = np.asarray(im).astype(np.float32) / 255.0

    xs = np.linspace(0, 1, W)[None, :]
    ys = np.linspace(0, 1, H)[:, None]
    d = np.sqrt(((xs - cx)/rx)**2 + ((ys - cy)/ry)**2)
    mask = floor + (1.0 - floor) * smoothstep((d - 0.55) / 0.55)

    if vign_top: mask *= (vign_top + (1-vign_top) * smoothstep(ys/0.22))
    if vign_bot: mask *= (vign_bot + (1-vign_bot) * smoothstep((1-ys)/0.22))

    a = a * mask[:, :, None]
    Image.fromarray((np.clip(a,0,1)*255).astype(np.uint8)).save(
        dst, quality=q, optimize=True, progressive=True)
    print(f"{os.path.basename(dst)}: {W}x{H}  {os.path.getsize(dst)//1024} KB")

# hero: dark pool over the copy block (upper-left/centre), panels survive
# bottom-right and far right
bake(SRC+"plate1.png", OUT+"hero-panels.jpg", 2000,
     cx=0.34, cy=0.42, rx=0.60, ry=0.58, floor=0.06, vign_top=0.10, vign_bot=0.30)

# band: copy sits hard left, so the pool is a tall narrow ellipse on the left
bake(SRC+"plate3.png", OUT+"band-panels.jpg", 2000,
     cx=0.12, cy=0.50, rx=0.42, ry=0.95, floor=0.07)
