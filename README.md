# Althor Labs

Public site for Althor Labs, the operating brand of Althor Consulting LLC. Static, multi-page, and served through GitHub Pages at the current canonical domain `althorlabs.com`.

## Layout

- `index.html` — home (project index, inspectable tool-call example, services, notes, about, contact)
- `work/` — case studies (one subdirectory per project)
- `writing/` — essays + Atom feed (`writing/feed.xml`)
- `checklist/` — direct PDF download
- `packages/` — fixed-scope service packages
- `intake/` — project routing and contact options
- `assets/` — shared CSS, OG images, PDF artifacts

## Deploy

GitHub Pages auto-deploys `main` on push. DNS managed at Porkbun:

- Apex `althorlabs.com` → 4 A records pointing at GitHub Pages (`185.199.108.153`, `.109.153`, `.110.153`, `.111.153`)
- `www.althorlabs.com` → CNAME → `st0rm-bless3d.github.io`
- `althor.dev` and `althorlabs.dev` → permanent, path-preserving HTTPS redirects to `althorlabs.com`
- The paid mailbox and independent `a11yscan` and `govalerts` services remain on `althor.dev`

## Edit

The visual system uses warm paper, dark type, and a rust accent. The homepage tool-call examples use native disclosure controls and work without JavaScript. Shared off-site wording and claim sources live in `copy/brand.md`; those drafts have not been posted to external profiles.

Edit any HTML page, commit, push — Pages rebuilds in ~30s.

## Caching

GitHub Pages serves a fixed `Cache-Control: max-age=600` on all assets. Custom headers are not supported. If aggressive caching becomes a concern, front the origin with Cloudflare or migrate to Caddy on Orion.

## Helper scripts

- `scripts/build-sitemap.sh` — regenerates `sitemap.xml` from the on-disk page set; uses each file's most recent commit date as `lastmod`.
- `scripts/build-llms-full.sh` — concatenates every page's plaintext into `llms-full.txt` with per-page boundary markers.
- `scripts/build-og-images.py` — generates the social-card templates, page-specific cards, and raster favicon variants. Pillow required (`pip install --break-system-packages Pillow` on Ubuntu).

Run all three after any meaningful content change before committing.

## IndexNow

`.github/workflows/indexnow.yml` POSTs the URL set to `api.indexnow.org` on every push to main that touches HTML or `sitemap.xml`. Key file lives at the repo root (`<key>.txt`) so Bing/Yandex can verify host ownership.
