#!/usr/bin/env python3
"""Re-encode the explainer for the web, from the master in Vid/.

The delivered master was 6.45 MB for fifteen seconds — about 3.6 Mbps, which
is several times what flat-vector animation needs. It compresses extremely
well: almost every frame is large areas of flat colour.

    python3 tools-video.py            # encode both, report sizes and SSIM
    python3 tools-video.py --check    # compare what is deployed against the master

Writes assets/video/healthconnect.webm and .mp4. The page lists the WebM first
and falls through to the MP4, so a visitor downloads one of them.

Measured against the master (SSIM, 1.0 is identical):

    MP4  H.264 CRF 24   1.09 MB   Y 0.9993  U 0.9988  V 0.9907
    WebM VP9   CRF 30   0.80 MB   Y 0.9995  U 0.9996  V 0.9823

CRF 24 rather than 28 for the MP4: at 28 the V channel — the chroma carrying
that purple — fell to 0.975, and the saving was 0.4 MB. Not worth it on a
video whose whole subject is one brand colour and a lot of small white text.

ffmpeg comes from the `imageio-ffmpeg` pip package rather than Homebrew, which
is not installed on this machine. It is a self-contained static binary, so
nothing is added system-wide.
"""

import pathlib
import subprocess
import sys

ROOT = pathlib.Path(__file__).parent
MASTER = ROOT / "Vid" / "Healthconnect.mp4"
OUT = ROOT / "assets" / "video"
MP4 = OUT / "healthconnect.mp4"
WEBM = OUT / "healthconnect.webm"


def ffmpeg():
    try:
        import imageio_ffmpeg
    except ImportError:
        sys.exit("ffmpeg not available. Install it with:\n"
                 "    python3 -m pip install imageio-ffmpeg")
    return imageio_ffmpeg.get_ffmpeg_exe()


def run(args):
    r = subprocess.run(args, capture_output=True, text=True)
    if r.returncode:
        sys.exit(r.stderr[-2000:])
    return r


def mb(path):
    return path.stat().st_size / 1048576


def ssim(exe, candidate, reference):
    r = subprocess.run(
        [exe, "-hide_banner", "-loglevel", "error",
         "-i", str(candidate), "-i", str(reference),
         "-lavfi", "ssim=stats_file=-", "-f", "null", "-"],
        capture_output=True, text=True)
    tail = [l for l in r.stdout.splitlines() if l.startswith("n:")]
    return tail[-1] if tail else "(no SSIM output)"


def encode(exe):
    # -movflags +faststart puts the moov atom before the media data, so the
    # browser can start playing before the whole file has arrived. Without it a
    # progressive download has to finish first.
    run([exe, "-y", "-hide_banner", "-loglevel", "error", "-i", str(MASTER),
         "-c:v", "libx264", "-preset", "slow", "-crf", "24",
         "-profile:v", "high", "-level", "4.0", "-pix_fmt", "yuv420p",
         "-movflags", "+faststart",
         "-c:a", "aac", "-b:a", "96k", "-ac", "2", str(MP4)])
    print(f"{MP4.name:26s} {mb(MP4):5.2f} MB   {ssim(exe, MP4, MASTER)}")

    run([exe, "-y", "-hide_banner", "-loglevel", "error", "-i", str(MASTER),
         "-c:v", "libvpx-vp9", "-crf", "30", "-b:v", "0",
         "-row-mt", "1", "-cpu-used", "2", "-pix_fmt", "yuv420p",
         "-c:a", "libopus", "-b:a", "80k", str(WEBM)])
    print(f"{WEBM.name:26s} {mb(WEBM):5.2f} MB   {ssim(exe, WEBM, MASTER)}")

    print(f"\nmaster {mb(MASTER):.2f} MB -> a visitor downloads one of the two above.")


def check():
    if not MASTER.exists():
        print(f"Master not found at {MASTER} (it is git-ignored). Nothing to compare.")
        return 0
    exe = ffmpeg()
    for f in (MP4, WEBM):
        if not f.exists():
            print(f"MISSING: {f}")
            return 1
        print(f"{f.name:26s} {mb(f):5.2f} MB   {ssim(exe, f, MASTER)}")
    return 0


def main():
    if "--check" in sys.argv:
        return check()
    if not MASTER.exists():
        sys.exit(f"Master not found at {MASTER}. It is git-ignored — put the "
                 f"delivered file back before re-encoding.")
    encode(ffmpeg())
    return 0


if __name__ == "__main__":
    sys.exit(main())
