# althor.dev

Personal site for Althor Consulting LLC. Single-file static page served via GitHub Pages on the apex domain.

## Deploy

GitHub Pages auto-deploys `main` on push. DNS managed at Porkbun:

- Apex `althor.dev` → 4 A records pointing at GitHub Pages (`185.199.108.153`, `.109.153`, `.110.153`, `.111.153`)
- `www.althor.dev` → CNAME → `st0rm-bless3d.github.io`

## Edit

`index.html` is the whole site. Edit, commit, push — Pages rebuilds in ~30s.
