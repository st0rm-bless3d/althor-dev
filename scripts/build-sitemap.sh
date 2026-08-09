#!/usr/bin/env bash
# Regenerate sitemap.xml from the on-disk page set. Lastmod for each
# URL is the most recent commit date that touched that file.
#
# Page priority + changefreq mirrors what the old hand-maintained
# sitemap declared; adjust here if the IA changes.

set -euo pipefail

REPO_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "${REPO_ROOT}"
SITE_URL="https://althor.dev"

# (filepath, url-path, priority, changefreq)
PAGES=(
  "index.html|/|1.0|monthly"
  "work/index.html|/work/|0.9|monthly"
  "work/extraction-pipeline/index.html|/work/extraction-pipeline/|0.8|monthly"
  "work/governance-platform/index.html|/work/governance-platform/|0.8|monthly"
  "work/spire/index.html|/work/spire/|0.8|monthly"
  "writing/index.html|/writing/|0.9|monthly"
  "writing/entra-workload-identities/index.html|/writing/entra-workload-identities/|0.8|monthly"
  "writing/agent-security-review/index.html|/writing/agent-security-review/|0.8|monthly"
  "writing/mcp-server-boundaries/index.html|/writing/mcp-server-boundaries/|0.8|monthly"
  "writing/mcp-copilot-studio/index.html|/writing/mcp-copilot-studio/|0.8|monthly"
  "checklist/index.html|/checklist/|0.9|monthly"
  "packages/index.html|/packages/|0.9|monthly"
  "packages/ai-governance-audit/index.html|/packages/ai-governance-audit/|0.8|monthly"
  "packages/mcp-security-review/index.html|/packages/mcp-security-review/|0.8|monthly"
  "packages/copilot-studio-quickstart/index.html|/packages/copilot-studio-quickstart/|0.8|monthly"
  "packages/azure-openai-architecture-review/index.html|/packages/azure-openai-architecture-review/|0.8|monthly"
  "packages/rag-health-check/index.html|/packages/rag-health-check/|0.8|monthly"
  "offers/index.html|/offers/|0.9|weekly"
  "offers/licensegate/index.html|/offers/licensegate/|0.8|weekly"
  "offers/nonprofit-comp-benchmark/index.html|/offers/nonprofit-comp-benchmark/|0.8|weekly"
  "offers/accessibility-baseline-report/index.html|/offers/accessibility-baseline-report/|0.8|weekly"
  "offers/federal-fit-alerts/index.html|/offers/federal-fit-alerts/|0.8|weekly"
  "offers/n8n-ticket-triage/index.html|/offers/n8n-ticket-triage/|0.8|weekly"
  "assets/agent-security-review-checklist.pdf|/assets/agent-security-review-checklist.pdf|0.7|monthly"
)

OUT="${REPO_ROOT}/sitemap.xml"
TMP="$(mktemp)"
trap 'rm -f "${TMP}"' EXIT

printf '<?xml version="1.0" encoding="UTF-8"?>\n' > "${TMP}"
printf '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' >> "${TMP}"

for entry in "${PAGES[@]}"; do
  IFS='|' read -r file urlpath priority freq <<<"${entry}"
  if [[ ! -f "${file}" ]]; then
    echo "warn: ${file} missing, skipping" >&2
    continue
  fi
  # Use the most recent commit date that touched the file. Fall back
  # to today if git can't find one (first time the file is added).
  lastmod=$(git log -1 --pretty=%cs -- "${file}" 2>/dev/null || true)
  if [[ -z "${lastmod}" ]]; then
    lastmod=$(date -u +%Y-%m-%d)
  fi
  {
    printf '  <url>\n'
    printf '    <loc>%s%s</loc>\n' "${SITE_URL}" "${urlpath}"
    printf '    <lastmod>%s</lastmod>\n' "${lastmod}"
    printf '    <changefreq>%s</changefreq>\n' "${freq}"
    printf '    <priority>%s</priority>\n' "${priority}"
    printf '  </url>\n'
  } >> "${TMP}"
done

printf '</urlset>\n' >> "${TMP}"
mv "${TMP}" "${OUT}"
printf 'wrote %s\n' "${OUT}"
