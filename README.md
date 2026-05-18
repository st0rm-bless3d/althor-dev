# althor.dev

Practice site for Althor Consulting LLC. Static, multi-page; served via GitHub Pages on the apex domain.

## Layout

- `index.html` — home (hero, methodology, work tiles, writing tiles, about, engagement tiers, contact)
- `work/` — case studies (one subdirectory per project)
- `writing/` — essays + Atom feed (`writing/feed.xml`)
- `checklist/` — lead-magnet landing page
- `assets/` — shared CSS, OG images, PDF artifacts

## Deploy

GitHub Pages auto-deploys `main` on push. DNS managed at Porkbun:

- Apex `althor.dev` → 4 A records pointing at GitHub Pages (`185.199.108.153`, `.109.153`, `.110.153`, `.111.153`)
- `www.althor.dev` → CNAME → `st0rm-bless3d.github.io`

## Edit

Edit any HTML page, commit, push — Pages rebuilds in ~30s.

## Caching

GitHub Pages serves a fixed `Cache-Control: max-age=600` on all assets. Custom headers are not supported. If aggressive caching becomes a concern, front the origin with Cloudflare or migrate to Caddy on Orion.

## Helper scripts

- `scripts/build-sitemap.sh` — regenerates `sitemap.xml` from the on-disk page set; uses each file's most recent commit date as `lastmod`.
- `scripts/build-llms-full.sh` — concatenates every page's plaintext into `llms-full.txt` with per-page boundary markers.
- `scripts/build-og-images.py` — overlays each page's H1 onto the OG template (`og-essay.png` / `og-case-study.png` / `og-default.png`) and writes `og-<slug>.png`. Pillow required (`pip install --break-system-packages Pillow` on Ubuntu).

Run all three after any meaningful content change before committing.

## IndexNow

`.github/workflows/indexnow.yml` POSTs the URL set to `api.indexnow.org` on every push to main that touches HTML or `sitemap.xml`. Key file lives at the repo root (`<key>.txt`) so Bing/Yandex can verify host ownership.
