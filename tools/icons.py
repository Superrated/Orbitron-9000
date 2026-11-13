#!/usr/bin/env python3
"""Draw the Orbitron app icons (icons/*.png): a sun, three Euclidean rings
(5, 8 and 16 steps) and one planet per ring.
Run: python3 tools/icons.py   (needs Pillow)"""
import math, os
from PIL import Image, ImageDraw, ImageFilter

BG = (4, 16, 10)
GREEN = (0, 255, 156)
MINT = (127, 255, 196)
SUN = (255, 228, 77)
SS = 4  # supersampling

# (radius, ring width, colour, steps, dot radius, planet radius, planet angle in deg; 0 = right, 90 = down)
RINGS = [
    (81, 6, GREEN, 5, 7, 17, 270),
    (138, 5, MINT, 8, 8, 19.6, 45),
    (200, 6, GREEN, 16, 8, 22.2, 157.5),
]
SUN_R = 25.5


def render(size, scale):
    S = 512 * SS
    k = SS * scale
    c = S / 2
    img = Image.new("RGB", (S, S), BG)
    rings = Image.new("RGBA", (S, S), (0, 0, 0, 0))
    planets = Image.new("RGBA", (S, S), (0, 0, 0, 0))
    dr, dp = ImageDraw.Draw(rings), ImageDraw.Draw(planets)

    def disc(d, x, y, r, col):
        d.ellipse([x - r, y - r, x + r, y + r], fill=col + (255,))

    disc(dp, c, c, SUN_R * k, SUN)
    for r, w, col, steps, dot, pr, pa in RINGS:
        R = r * k
        dr.ellipse([c - R, c - R, c + R, c + R], outline=col + (255,), width=round(w * k))
        for i in range(steps):
            a = pa + i * 360 / steps
            x, y = c + R * math.cos(math.radians(a)), c + R * math.sin(math.radians(a))
            if i == 0:
                disc(dp, x, y, pr * k, SUN)
            else:
                disc(dr, x, y, dot * k, col)

    for layer, glow in ((rings, 6), (planets, 10)):
        halo = layer.filter(ImageFilter.GaussianBlur(glow * k))
        a = halo.getchannel("A").point(lambda v: int(v * 0.45))
        halo.putalpha(a)
        img.paste(halo, (0, 0), halo)
        img.paste(layer, (0, 0), layer)
    return img.resize((size, size), Image.LANCZOS)


def main():
    out = os.path.join(os.path.dirname(__file__), "..", "icons")
    for name, size, scale in [
        ("icon-512.png", 512, 1.0),
        ("icon-192.png", 192, 1.0),
        ("apple-touch-icon.png", 180, 1.0),
        ("favicon-64.png", 64, 1.0),
        ("icon-maskable-512.png", 512, 0.8),
        ("icon-maskable-192.png", 192, 0.8),
    ]:
        render(size, scale).save(os.path.join(out, name), optimize=True)
        print("wrote", name)


if __name__ == "__main__":
    main()
