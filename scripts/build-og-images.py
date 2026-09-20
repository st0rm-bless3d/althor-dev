#!/usr/bin/env python3
"""Generate Althor Labs social cards and raster favicon assets.

Outputs:
  - /og-default.png, /og-essay.png, /og-case-study.png
  - /og-<slug>.png for each essay, case study, and lead magnet
  - /favicon-32.png, /favicon.ico, /apple-touch-icon.png

Run: python3 scripts/build-og-images.py
"""

from __future__ import annotations

import sys
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

REPO_ROOT = Path(__file__).resolve().parent.parent

FONT_CANDIDATES = [
    "/usr/share/fonts/truetype/liberation/LiberationSans-Bold.ttf",
    "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf",
    "/usr/share/fonts/truetype/liberation2/LiberationSans-Bold.ttf",
]
MONO_CANDIDATES = [
    "/usr/share/fonts/truetype/liberation/LiberationMono-Bold.ttf",
    "/usr/share/fonts/truetype/dejavu/DejaVuSansMono-Bold.ttf",
]

COLOR_BG = (11, 16, 23)
COLOR_PANEL = (17, 25, 35)
COLOR_GRID = (31, 46, 60)
COLOR_TEXT = (238, 242, 244)
COLOR_MUTED = (151, 166, 177)
COLOR_ACCENT = (112, 221, 215)
COLOR_ACCENT_2 = (192, 151, 232)

PAGES: list[tuple[str, str, str]] = [
    ("agent-security-review", "Making agent deployments pass security review", "PATTERN / LAB NOTES"),
    ("entra-workload-identities", "Entra ID workload identities for agent systems", "PATTERN / LAB NOTES"),
    ("mcp-copilot-studio", "Adding MCP servers to Copilot Studio in regulated environments", "PATTERN / LAB NOTES"),
    ("mcp-server-boundaries", "Drawing the right boundaries for an MCP server", "PATTERN / LAB NOTES"),
    ("extraction-pipeline", "Multi-model extraction pipeline", "CASE STUDY / SELECTED WORK"),
    ("governance-platform", "Enterprise AI governance platform", "CASE STUDY / SELECTED WORK"),
    ("spire", "Spire: AI infrastructure control plane", "ACTIVE BUILD / ALTHOR LABS"),
    ("checklist", "Agent Security Review Checklist", "FIELD GUIDE / FREE PDF"),
]

BASE_CARDS: list[tuple[str, str, str]] = [
    ("og-default.png", "AI systems that work inside real organizations.", "APPLIED AI / AUTOMATION"),
    ("og-essay.png", "Lab notes from systems under load.", "IDENTITY / TOOLS / POLICY / AUDIT"),
    ("og-case-study.png", "Production systems, measured.", "SELECTED WORK / ALTHOR LABS"),
]


def load_font(candidates: list[str], size: int) -> ImageFont.FreeTypeFont:
    for path in candidates:
        if Path(path).exists():
            return ImageFont.truetype(path, size=size)
    print(f"warn: no font from {candidates} found; using Pillow default", file=sys.stderr)
    return ImageFont.load_default()


def wrap_to_width(draw: ImageDraw.ImageDraw, text: str,
                  font: ImageFont.FreeTypeFont, max_width: int) -> list[str]:
    words = text.split()
    lines: list[str] = []
    current: list[str] = []
    for word in words:
        candidate = " ".join(current + [word])
        bbox = draw.textbbox((0, 0), candidate, font=font)
        if bbox[2] - bbox[0] <= max_width:
            current.append(word)
        else:
            if current:
                lines.append(" ".join(current))
            current = [word]
    if current:
        lines.append(" ".join(current))
    return lines


def draw_mark(draw: ImageDraw.ImageDraw, x: int, y: int, scale: int = 1) -> None:
    width = 8 * scale
    gap = 7 * scale
    heights = (18 * scale, 30 * scale, 42 * scale)
    for index, height in enumerate(heights):
        left = x + index * (width + gap)
        color = COLOR_ACCENT_2 if index == 2 else COLOR_ACCENT
        draw.rounded_rectangle(
            (left, y + heights[-1] - height, left + width, y + heights[-1]),
            radius=max(2, width // 2),
            fill=color,
        )


def make_canvas() -> Image.Image:
    image = Image.new("RGB", (1200, 630), COLOR_BG)
    draw = ImageDraw.Draw(image)

    for x in range(0, 1201, 48):
        draw.line((x, 0, x, 630), fill=COLOR_GRID, width=1)
    for y in range(0, 631, 48):
        draw.line((0, y, 1200, y), fill=COLOR_GRID, width=1)

    draw.rectangle((0, 0, 1200, 12), fill=COLOR_ACCENT)
    draw.rounded_rectangle((890, 126, 1120, 488), radius=20,
                           fill=COLOR_PANEL, outline=COLOR_GRID, width=2)

    node_font = load_font(MONO_CANDIDATES, 16)
    nodes = (("01", "IDENTITY"), ("02", "TOOLS"), ("03", "POLICY"), ("04", "AUDIT"))
    for index, (number, label) in enumerate(nodes):
        top = 158 + index * 76
        fill = COLOR_ACCENT if index in (0, 3) else COLOR_MUTED
        draw.rounded_rectangle((928, top, 1082, top + 46), radius=8,
                               fill=COLOR_BG, outline=fill, width=2)
        draw.text((944, top + 14), number, font=node_font, fill=COLOR_MUTED)
        draw.text((976, top + 14), label, font=node_font, fill=fill)
        if index < 3:
            draw.line((1005, top + 46, 1005, top + 76), fill=COLOR_GRID, width=2)

    return image


def render_card(filename: str, title: str, eyebrow: str) -> Path:
    image = make_canvas()
    draw = ImageDraw.Draw(image)

    draw_mark(draw, 80, 60)
    brand_font = load_font(MONO_CANDIDATES, 24)
    draw.text((140, 74), "althor", font=brand_font, fill=COLOR_TEXT)
    althor_width = draw.textbbox((0, 0), "althor", font=brand_font)[2]
    draw.text((140 + althor_width, 74), "labs", font=brand_font, fill=COLOR_ACCENT)

    eyebrow_font = load_font(MONO_CANDIDATES, 20)
    draw.text((80, 167), eyebrow, font=eyebrow_font, fill=COLOR_ACCENT)
    draw.rectangle((80, 205, 146, 209), fill=COLOR_ACCENT)

    max_width = 745
    title_size = 66
    while title_size >= 40:
        title_font = load_font(FONT_CANDIDATES, title_size)
        lines = wrap_to_width(draw, title, title_font, max_width)
        if len(lines) <= 3:
            break
        title_size -= 4

    y = 240
    line_height = int(title_size * 1.12)
    for line in lines:
        draw.text((80, y), line, font=title_font, fill=COLOR_TEXT)
        y += line_height

    footer_font = load_font(MONO_CANDIDATES, 18)
    draw.text((80, 570), "ALTHORLABS.COM", font=footer_font, fill=COLOR_MUTED)
    draw.text((972, 570), "BUILD / REVIEW / SHIP", font=footer_font, fill=COLOR_MUTED)

    output = REPO_ROOT / filename
    image.save(output, "PNG", optimize=True)
    return output


def make_icon(size: int) -> Image.Image:
    image = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(image)
    radius = max(2, round(size * 0.22))
    draw.rounded_rectangle((0, 0, size - 1, size - 1), radius=radius, fill=COLOR_BG + (255,))

    width = max(2, round(size * 0.12))
    gap = max(2, round(size * 0.09))
    heights = (round(size * 0.25), round(size * 0.44), round(size * 0.59))
    total_width = width * 3 + gap * 2
    start_x = (size - total_width) // 2
    baseline = round(size * 0.78)
    for index, height in enumerate(heights):
        left = start_x + index * (width + gap)
        color = COLOR_ACCENT_2 if index == 2 else COLOR_ACCENT
        draw.rounded_rectangle((left, baseline - height, left + width, baseline),
                               radius=max(1, width // 2), fill=color + (255,))
    return image


def render_icons() -> list[Path]:
    favicon_32 = REPO_ROOT / "favicon-32.png"
    apple_touch = REPO_ROOT / "apple-touch-icon.png"
    favicon_ico = REPO_ROOT / "favicon.ico"

    make_icon(32).save(favicon_32, "PNG", optimize=True)
    make_icon(180).save(apple_touch, "PNG", optimize=True)
    make_icon(64).save(favicon_ico, format="ICO", sizes=[(16, 16), (32, 32), (48, 48)])
    return [favicon_32, apple_touch, favicon_ico]


def main() -> int:
    written: list[Path] = []
    for filename, title, eyebrow in BASE_CARDS:
        written.append(render_card(filename, title, eyebrow))
    for slug, title, eyebrow in PAGES:
        written.append(render_card(f"og-{slug}.png", title, eyebrow))
    written.extend(render_icons())

    for output in written:
        print(f"wrote {output.name} ({output.stat().st_size // 1024} KB)")
    print(f"\n{len(written)} brand assets generated.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
