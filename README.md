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
