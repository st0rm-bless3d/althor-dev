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

COLOR_BG = (245, 242, 234)
COLOR_PANEL = (235, 231, 221)
COLOR_GRID = (201, 195, 181)
COLOR_TEXT = (39, 39, 33)
COLOR_MUTED = (98, 96, 85)
COLOR_ACCENT = (150, 62, 35)
COLOR_ACCENT_2 = (83, 99, 77)

PAGES: list[tuple[str, str, str]] = [
    ("agent-security-review", "Making agent deployments pass security review", "PATTERN / LAB NOTES"),
    ("entra-workload-identities", "Entra ID workload identities for agent systems", "PATTERN / LAB NOTES"),
    ("mcp-copilot-studio", "Adding MCP servers to Copilot Studio in regulated environments", "PATTERN / LAB NOTES"),
    ("mcp-server-boundaries", "Drawing the right boundaries for an MCP server", "PATTERN / LAB NOTES"),
    ("extraction-pipeline", "Multi-model extraction pipeline", "CASE STUDY / SELECTED WORK"),
    ("governance-platform", "Enterprise AI governance platform", "CASE STUDY / SELECTED WORK"),
    ("spire", "Spire: an infrastructure project", "ACTIVE BUILD / ALTHOR LABS"),
    ("checklist", "Agent Security Review Checklist", "FIELD GUIDE / FREE PDF"),
]

BASE_CARDS: list[tuple[str, str, str]] = [
    ("og-default.png", "I build the software around the model.", "APPLIED AI / AUTOMATION"),
    ("og-essay.png", "Notes on the decisions behind the code.", "IDENTITY / TOOLS / POLICY / AUDIT"),
    ("og-case-study.png", "Projects and the decisions behind them.", "SELECTED WORK / ALTHOR LABS"),
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
    draw.line((72, 132, 1128, 132), fill=COLOR_GRID, width=2)
    draw.line((72, 535, 1128, 535), fill=COLOR_GRID, width=2)
    return image


def render_card(filename: str, title: str, eyebrow: str) -> Path:
    image = make_canvas()
    draw = ImageDraw.Draw(image)
    draw_mark(draw, 72, 54)
    brand_font = load_font(MONO_CANDIDATES, 27)
    draw.text((132, 67), "althor labs", font=brand_font, fill=COLOR_TEXT)
    eyebrow_font = load_font(MONO_CANDIDATES, 18)
    draw.text((72, 167), eyebrow, font=eyebrow_font, fill=COLOR_ACCENT)

    title_size = 70
    serif_candidates = [
        "/usr/share/fonts/truetype/liberation2/LiberationSerif-Regular.ttf",
        "/usr/share/fonts/truetype/dejavu/DejaVuSerif.ttf",
    ]
    while title_size >= 36:
        title_font = load_font(serif_candidates, title_size)
        lines = wrap_to_width(draw, title, title_font, 1020)
        if len(lines) <= 3:
            break
        title_size -= 4
    y = 226
    for line in lines:
        draw.text((72, y), line, font=title_font, fill=COLOR_TEXT)
        y += int(title_size * 1.13)

    footer_font = load_font(MONO_CANDIDATES, 18)
    draw.text((72, 565), "ALTHORLABS.COM", font=footer_font, fill=COLOR_MUTED)
    label = "SAMUEL S / INDEPENDENT ENGINEERING"
    label_width = draw.textbbox((0, 0), label, font=footer_font)[2]
    draw.text((1128 - label_width, 565), label, font=footer_font, fill=COLOR_MUTED)
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
