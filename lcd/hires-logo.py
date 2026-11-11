#!/usr/bin/env python3
"""The T-Dongle-S3 boot logo in film resolution.

The firmware's logo (main/lcd_logo.c) is 160x80 pixels, rendered by
scripts/gen-lcd-logo.py from app-logo.svg and the word mark. Upscaled for the
film it looks blocky, so this renders the same layout at SCALE x the panel
size from the same sources: same geometry, colours and font, only more pixels.
Also the idle screen's spam badge (display.c: draw_badge) for the counts the
film shows. Writes public/img/lcd-logo.png and lcd-logo-badge<n>.png.

Needs inkscape, Pillow, Noto Sans Bold, and the PhoneBlock repo
(PHONEBLOCK_REPO, default ../phoneblock).
"""
import os, subprocess, tempfile
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parent.parent
REPO = Path(os.environ.get("PHONEBLOCK_REPO", ROOT.parent / "phoneblock"))
SVG = REPO / "phoneblock/src/main/webapp/assets/img/app-logo.svg"
FONT = "/usr/share/fonts/truetype/noto/NotoSans-Bold.ttf"
SCALE = 8
W, H, LOGO = 160, 80, 72                       # as in gen-lcd-logo.py
BACKGROUND = (16, 24, 40)
# badge geometry from display.c
BADGE_TOP, BADGE_H, BADGE_RIGHT = 1, 17, 158
BADGE = (230, 40, 40)


def logo():
    s = SCALE
    with tempfile.TemporaryDirectory() as tmp:
        png = os.path.join(tmp, "logo.png")
        subprocess.run(["inkscape", str(SVG), "--export-type=png", "--export-filename=" + png, "-w", str(LOGO * s)],
                       check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
        mark = Image.open(png).convert("RGBA")
        mark.load()
    img = Image.new("RGB", (W * s, H * s), BACKGROUND)
    d = ImageDraw.Draw(img)
    top = (H - LOGO) // 2
    inset = 6
    d.ellipse(((top + inset) * s, (top + inset) * s, (top + LOGO - inset) * s, (top + LOGO - inset) * s), fill=(255, 255, 255))
    img.paste(mark, (top * s, top * s), mark)
    font = ImageFont.truetype(FONT, 22 * s)
    d.text(((top + LOGO + 6) * s, 10 * s), "Phone", font=font, fill=(255, 255, 255))
    d.text(((top + LOGO + 6) * s, 40 * s), "Block", font=font, fill=(230, 40, 40))
    return img


def badge(img, text):
    s = SCALE
    d = ImageDraw.Draw(img)
    font = ImageFont.truetype(FONT, 13 * s)
    tw = d.textlength(text, font=font)
    w = max(tw + 8 * s, BADGE_H * s)
    right = (BADGE_RIGHT + 1) * s
    d.rounded_rectangle((right - w, BADGE_TOP * s, right, (BADGE_TOP + BADGE_H) * s), radius=BADGE_H * s / 2, fill=BADGE)
    cy = (BADGE_TOP + BADGE_H / 2) * s
    d.text((right - w / 2, cy), text, font=font, fill=(255, 255, 255), anchor="mm")
    return img


out = ROOT / "public" / "img"
logo().save(out / "lcd-logo.png")
for n in ("1", "3", "4"):
    badge(logo(), n).save(out / f"lcd-logo-badge{n}.png")
print("written", out)
