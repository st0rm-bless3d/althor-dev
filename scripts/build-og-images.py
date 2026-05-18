#!/usr/bin/env python3
"""Generate per-page Open Graph images by overlaying the page H1 onto
the existing essay/case-study templates.

Inputs:
  - /og-essay.png       — template for /writing/* leaves
  - /og-case-study.png  — template for /work/* leaves
  - /og-default.png     — template for /checklist/

Output: /og-<slug>.png (1200x630) per essay + per case study.

Font fallback: prefers Liberation Sans Bold (closer to Geist's
weight than DejaVu), falls back to DejaVu Sans Bold which is
guaranteed to exist on Ubuntu boxes. Title color matches the
site's --text token; we add an accent-colored leading rule under
the title to mirror the section__rule pattern.

Run: python3 scripts/build-og-images.py
"""

from __future__ import annotations

import sys
import textwrap
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

REPO_ROOT = Path(__file__).resolve().parent.parent

# Font candidates in priority order. First one that loads wins.
FONT_CANDIDATES = [
    "/usr/share/fonts/truetype/liberation/LiberationSans-Bold.ttf",
    "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf",
    "/usr/share/fonts/truetype/liberation2/LiberationSans-Bold.ttf",
]
MONO_CANDIDATES = [
    "/usr/share/fonts/truetype/liberation/LiberationMono-Bold.ttf",
    "/usr/share/fonts/truetype/dejavu/DejaVuSansMono-Bold.ttf",
]

# Site colors (oklch values translated to closest sRGB hex by eye —
# OG images are previewed in many places that don't understand oklch).
COLOR_TEXT = (232, 231, 226)     # --text
COLOR_ACCENT = (107, 207, 130)   # --accent (oklch 74% .15 150 → ~ #6BCF82)
COLOR_DIM = (114, 118, 127)      # --text-dim

# 1200x630 (Twitter / OG canonical) — content safe area: 80px each edge.
SAFE_LEFT = 80
SAFE_RIGHT = 1120
SAFE_TOP = 130
SAFE_BOTTOM = 560

# Per-page metadata. (slug, template, h1, eyebrow)
# Templates are resolved relative to REPO_ROOT.
PAGES: list[tuple[str, str, str, str]] = [
    # Essays
    ("agent-security-review", "og-essay.png",
     "Making agent deployments pass security review",
     "Pattern · althor"),
    ("entra-workload-identities", "og-essay.png",
     "Entra ID workload identities for agent systems",
     "Pattern · althor"),
    ("mcp-copilot-studio", "og-essay.png",
     "Adding MCP servers to Copilot Studio in regulated environments",
     "Pattern · althor"),
    ("mcp-server-boundaries", "og-essay.png",
     "Drawing the right boundaries for an MCP server",
     "Pattern · althor"),
    # Case studies + spire
    ("extraction-pipeline", "og-case-study.png",
     "Multi-model extraction pipeline",
     "Case study · althor"),
    ("governance-platform", "og-case-study.png",
     "Enterprise AI governance platform",
     "Case study · althor"),
    ("spire", "og-case-study.png",
     "Spire — AI infrastructure control plane",
     "Active build · althor"),
    # Lead magnet — uses default template instead of essay
    ("checklist", "og-default.png",
     "Agent Security Review Checklist",
     "Free PDF · althor"),
]


def load_font(candidates: list[str], size: int) -> ImageFont.FreeTypeFont:
    for path in candidates:
        if Path(path).exists():
            return ImageFont.truetype(path, size=size)
    # Last-ditch — Pillow's bundled default. Looks terrible but doesn't crash.
    print(f"warn: no font from {candidates} found; falling back to default",
          file=sys.stderr)
    return ImageFont.load_default()


def wrap_to_width(draw: ImageDraw.ImageDraw, text: str,
                  font: ImageFont.FreeTypeFont, max_width: int) -> list[str]:
    """Greedy word-wrap to a pixel width measured against the actual font."""
    words = text.split()
    lines: list[str] = []
    current: list[str] = []
    for word in words:
        candidate = " ".join(current + [word])
        bbox = draw.textbbox((0, 0), candidate, font=font)
        if (bbox[2] - bbox[0]) <= max_width:
            current.append(word)
        else:
            if current:
                lines.append(" ".join(current))
            current = [word]
    if current:
        lines.append(" ".join(current))
    return lines


def render(slug: str, template: str, h1: str, eyebrow: str) -> Path:
    src = REPO_ROOT / template
    if not src.exists():
        raise SystemExit(f"template missing: {src}")

    img = Image.open(src).convert("RGB")
    if img.size != (1200, 630):
        print(f"warn: {template} is {img.size}, not 1200x630", file=sys.stderr)
    draw = ImageDraw.Draw(img)

    # Choose a starting size and shrink if the title doesn't fit in 3 lines.
    max_width = SAFE_RIGHT - SAFE_LEFT
    title_size = 64
    while title_size >= 38:
        font = load_font(FONT_CANDIDATES, title_size)
        lines = wrap_to_width(draw, h1, font, max_width)
        if len(lines) <= 3:
            break
        title_size -= 4
    eyebrow_font = load_font(MONO_CANDIDATES, 22)

    # Paint a semi-opaque dark slab behind the text so the overlay
    # remains legible regardless of how busy the template background is.
    slab = Image.new("RGBA", img.size, (0, 0, 0, 0))
    slab_draw = ImageDraw.Draw(slab)
    line_height = int(title_size * 1.18)
    text_block_h = line_height * len(lines) + 60  # plus eyebrow + rule
    slab_top = SAFE_TOP - 30
    slab_bot = slab_top + text_block_h + 60
    slab_draw.rectangle(
        [(SAFE_LEFT - 30, slab_top), (SAFE_RIGHT + 30, slab_bot)],
        fill=(26, 29, 34, 215),  # --bg with alpha
    )
    img = Image.alpha_composite(img.convert("RGBA"), slab).convert("RGB")
    draw = ImageDraw.Draw(img)

    # Eyebrow (uppercase, accent color, monospace).
    draw.text((SAFE_LEFT, SAFE_TOP), eyebrow.upper(), font=eyebrow_font,
              fill=COLOR_ACCENT, spacing=4)

    # Accent rule under the eyebrow.
    rule_y = SAFE_TOP + 38
    draw.rectangle(
        [(SAFE_LEFT, rule_y), (SAFE_LEFT + 60, rule_y + 3)],
        fill=COLOR_ACCENT,
    )

    # Title — multi-line.
    y = SAFE_TOP + 70
    for line in lines:
        draw.text((SAFE_LEFT, y), line, font=font, fill=COLOR_TEXT)
        y += line_height

    # Footer: althor.dev wordmark in dim text, bottom-left.
    foot_font = load_font(MONO_CANDIDATES, 20)
    draw.text((SAFE_LEFT, SAFE_BOTTOM + 35), "althor.dev",
              font=foot_font, fill=COLOR_DIM)

    out = REPO_ROOT / f"og-{slug}.png"
    img.save(out, "PNG", optimize=True)
    return out


def main() -> int:
    written: list[Path] = []
    for entry in PAGES:
        out = render(*entry)
        size_kb = out.stat().st_size // 1024
        print(f"wrote {out.name} ({size_kb} KB)")
        written.append(out)
    print(f"\n{len(written)} images generated.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
