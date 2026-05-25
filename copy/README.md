# /copy/

Authoring directory. Not rendered as web pages. Not linked from site navigation. Not in `sitemap.xml` or `llms.txt`.

This is where the source-of-truth copy lives for off-site surfaces — freelance platform profiles, proposal templates, outreach copy, internal templates. Each file is plain Markdown intended to be pasted into the target system (Upwork profile editor, Toptal application, Codementor mentor pitch, etc.).

## Layout

- `platforms/` — profile copy for Upwork, Toptal, Codementor + the shared 60–90 sec video intro script.
- `proposal-templates/` — Upwork proposal templates by category. Fill in the brackets before sending.
- `outreach/` — cold outreach copy (Microsoft Partner subcontracting, etc.).
- `bookkeeping-template.md` — column schema for tracking platform revenue across Upwork / Toptal / Codementor.

## Why these live in the repo

Single source of truth. When a case study on althor.dev updates, every platform profile that references it gets re-synced from one place. Pull requests on these files are the change log.

## Why they're not rendered

They're paste targets, not pages. Upwork profiles aren't web pages — they're form fields in Upwork's editor. Rendering them at `/copy/platforms/upwork-profile/` would create a confusing public artifact ("why does this site host its own Upwork profile?") and pollute the sitemap.

## Update discipline

When a case study or essay changes meaningfully, walk every file under `/copy/platforms/` and re-paste the affected sections into the corresponding platform editor. Profile drift is the failure mode — same person, three different stories.
