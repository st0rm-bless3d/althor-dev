# Upwork profile — Althor (Samuel S)

**Last reviewed**: 2026-05-25
**Source of truth**: althor.dev case studies + essays
**Posted at**: TBD (paste into Upwork → Profile after May 28 specialized-profile retirement)

---

## Title (70 chars max)

```
AI Platform Engineer | Azure OpenAI · Copilot Studio · MCP · Anthropic
```

(68 chars. Drop any one keyword if Upwork's counter says different — order is intentional, leading on Azure OpenAI because that's the densest demand keyword in the AI category right now.)

---

## Overview hero (first 160 chars — visible in search previews)

```
I ship enterprise AI platforms end-to-end: governance registries, multi-model OCR pipelines, Copilot Studio agents wired to Microsoft Graph. Production, not POCs.
```

(159 chars. This is the most important sentence in the whole profile. It's what clients see in the proposal list and the search results.)

---

## Full overview (target 350–450 words)

```
I ship enterprise AI platforms end-to-end: governance registries, multi-model OCR pipelines, Copilot Studio agents wired to Microsoft Graph. Production, not POCs.

What I do, concretely:

▸ AI agent infrastructure. Credential brokers, scoped tool surfaces, policy-gated approvals, audit layers — the work between a prompt and a deployment that passes security review. Published essays on Entra ID workload identities for agents, MCP server boundaries, and adding MCP to Copilot Studio in regulated environments. Run my own infrastructure control plane (Spire) on a homelab serving as the test bed.

▸ Multi-model extraction pipelines. Built and shipped a configurable, multi-stage agent pipeline with field-level consensus voting for a regulated client — 30× throughput lift, retired a contractor spend, every extraction decision auditable end-to-end.

▸ Enterprise governance platforms. Built an AI use-case registry with four-tier RBAC, council review workflow, and native Microsoft Teams + SharePoint embedding for global enterprise scale (~100 submissions/month).

▸ Microsoft Copilot Studio agents. OAuth on-behalf-of, correct DLP zoning, custom connectors over Streamable HTTP (not the deprecated SSE), generative orchestration, Functions middleware, audit logging — ready for InfoSec review on day one.

Stack depth:

▸ Microsoft: Azure (Functions, Static Web Apps, Cosmos DB, App Service, API Management), Entra ID (B2B, OBO, FIC, managed identity), Power Platform (Power Automate, Copilot Studio, custom connectors, DLP), M365 (Graph, SharePoint, Teams app dev).
▸ LLM providers: Azure OpenAI, Anthropic Claude (Claude API + Agent SDK), Google Gemini, Mistral, local Ollama for cost-sensitive inference.
▸ Agent infrastructure: Model Context Protocol (server publisher + client consumer), retrieval-augmented generation pipelines, agent eval harnesses, audit-trail surfaces.
▸ Languages: TypeScript, C# / .NET, Python, Rust.
▸ IaC + ops: Bicep, GitHub Actions, Application Insights, audit logging, observability.

How I work:

▸ Architecture before code. Auth boundaries, tool scopes, audit surface, failure modes modeled before the first function ships.
▸ Scoped tools, never master keys. One scope, one tool, one expiry — credentials in a broker, tools with explicit allowlists.
▸ Audit everything that matters. Compliance review, debugging, and post-incident work all run against the same structured surface.
▸ Humans own the risky calls. Reversible actions auto-run. Anything touching production state, payments, or customer-facing data queues for approval.
▸ Documentation that survives me. Every engagement ships with IaC, runbooks, architecture docs. Handoff is a milestone, not an afterthought.

Engagement structure mirrors how I sell direct: discovery (1–2 weeks, fixed), build (8–12 weeks, fixed), advisory retainer (monthly). For smaller fixed packages — MCP server security reviews, RAG pipeline health checks, Azure OpenAI architecture reviews — see /packages on the portfolio site.

Portfolio + case studies: althor.dev
```

(Word count ~430. Pastes as-is into Upwork's overview field. Cut a paragraph if you're hitting the platform's character cap.)

---

## Skill tags (15 max, order = ranking weight)

1. Azure OpenAI
2. Microsoft Copilot Studio
3. Anthropic Claude
4. AI Agent Development
5. Microsoft Power Automate
6. Microsoft Entra ID
7. Azure Functions
8. RAG (Retrieval-Augmented Generation)
9. Bicep
10. Model Context Protocol
11. AI Governance
12. Microsoft Graph
13. TypeScript
14. SharePoint
15. CI/CD

**Why this order**: Azure OpenAI and Copilot Studio are the two highest-volume search keywords in the AI category as of Feb 2026 Upwork data. Anthropic third because Claude API demand grew faster than any other LLM provider tag YoY. Power Automate sits at #5 because there's massive long-tail volume in workflow-automation-with-AI jobs that pay $50–80/hr — useful for cold-start grinding to Top Rated. CI/CD last because most AI clients don't filter for it but it raises completeness signal.

---

## Hourly rate (posted)

```
$95 / hour
```

**Reasoning**: above the $75 "cheap" threshold (anything below that screens for budget clients), below the $100 mental round (clients with $100/hr filters cut you off above that). The first 2 weeks of cold-start grinding will bid below this on smaller jobs to bank reviews fast — see §6 of the platform spec for the JSS-building strategy. After Top Rated badge, raise to $110.

---

## Portfolio items (10–15)

Each entry pastes into Upwork's portfolio card. Pull the longer-form content directly from the linked althor.dev page so updates propagate.

### 1. Enterprise AI Governance Platform
- Tagline: Use-case registry · four-tier RBAC · council review · Teams + SharePoint embed
- Stack: React 18, TypeScript, Vite, Azure Functions, Static Web Apps, Cosmos DB, Entra ID, Bicep IaC
- Outcome: Global enterprise scale, ~100 submissions/month, audit trail for council review
- Link: althor.dev/work/governance-platform/

### 2. Multi-Model Extraction Pipeline
- Tagline: Field-level consensus voting · learning loops · 30× throughput lift
- Stack: TypeScript, Next.js, Azure Functions, Durable Orchestration, Azure SQL, Entra ID, Bicep, Playwright E2E
- Outcome: Throughput 4→120 entries/hour, retired contractor spend, every decision auditable
- Link: althor.dev/work/extraction-pipeline/

### 3. Spire — AI infrastructure control plane
- Tagline: Operator surface for running agents against real infra · Rust · single-binary deploy
- Stack: Rust, Axum, sqlx, SQLite, bollard, tokio, React, Model Context Protocol
- Outcome: Policy-gated approvals, per-object audit log, MCP tools with read-only guards
- Link: althor.dev/work/spire/

### 4. Essay — Entra ID workload identities for agent systems
- Tagline: App-only / OBO / FIC / managed identity mapped to the audit-trail decision agent designers are making
- Format: 3,500-word pattern essay with decision tree
- Link: althor.dev/writing/entra-workload-identities/

### 5. Essay — Adding MCP servers to Copilot Studio in regulated environments
- Tagline: Five architecture decisions the wizard quietly assumes you've made
- Format: Long-form pattern essay with threat model
- Link: althor.dev/writing/mcp-copilot-studio/

### 6. Essay — MCP server boundaries: when to expose what
- Tagline: Six rules for designing MCP tool surfaces that survive security review
- Link: althor.dev/writing/mcp-server-boundaries/

### 7. Essay — Agent security review patterns
- Tagline: The same review I run during a Discovery engagement, distilled
- Link: althor.dev/writing/agent-security-review/

### 8. Agent Security Review Checklist (free PDF)
- Tagline: Pre-flight checklist for shipping AI agents into regulated environments
- Format: PDF lead magnet — 5 layers, yes/no items, decision tree
- Link: althor.dev/checklist/

### 9. Package — Copilot Studio Agent Quickstart
- Tagline: Working agent + Functions middleware + connector wiring in 2 weeks
- Link: althor.dev/packages/copilot-studio-quickstart/

### 10. Package — MCP Server Security Review
- Tagline: Written review against the OWASP Agentic AI Top 10, 3 days
- Link: althor.dev/packages/mcp-security-review/

### 11. Package — AI Governance Foundation Audit
- Tagline: NIST AI RMF gap analysis + Foundry control-plane recommendations
- Link: althor.dev/packages/ai-governance-audit/

(Add 2–4 more derived from public case-study material as new client work completes and gets abstracted to the site.)

---

## Video intro

See `video-intro-script.md` in this directory. 60–90 sec, self-record on phone in landscape, neutral background.

---

## Profile completeness checklist (the literal Upwork meter)

- [ ] Profile photo (clean headshot, neutral background — NOT a logo)
- [ ] Title (above)
- [ ] Overview (above)
- [ ] Video intro (per script)
- [ ] Hourly rate (above)
- [ ] Skills (15, above)
- [ ] Education (degree if applicable)
- [ ] Employment history (Corus / SNI engagement + Althor LLC as current)
- [ ] Certifications (any Microsoft AI certs, Azure certs)
- [ ] Languages (English — Native or Bilingual)
- [ ] Hours per week (15–20 if still on SNI engagement, 30+ once free)
- [ ] Project preferences (Complex projects, Long-term, Expert level)
- [ ] Categories (AI Services → AI Agent Development as primary)
- [ ] At least 10 portfolio items (above)
- [ ] At least one work sample with rich detail
- [ ] Public profile URL set
- [ ] Payment method connected (LLC bank account)
- [ ] W-9 with Althor Consulting LLC + EIN

---

## Payee / LLC setup

- **Payee type**: Business Entity
- **Legal name**: Althor Consulting LLC
- **EIN**: (fill in from IRS letter)
- **Address**: (LLC registered address)
- **Bank**: LLC business checking
- **W-9**: Single-member LLC, taxed as disregarded entity (likely) — verify with bookkeeper before submitting

---

## Notes on platform-side gotchas

- **Conversion Fee**: 13.5% of one year projected earnings if you take a client off-platform within 24 months. Never DM a personal email to move a relationship — use Upwork's official conversion option instead.
- **Private JSS feedback**: clients can give private ratings you'll never see. JSS can drift below 90% even with all-5-star public reviews. Don't take it personally; it just means the algorithm is tuned for caution.
- **Time tracker**: hourly contracts take screenshots every 10 minutes. For anything >10 hours, propose a fixed-price milestone structure to skip the surveillance theatre.
- **Connects budget**: ~$30–50/month for serious bidding. Freelancer Plus ($19.99/mo) is worth it for the competitor-bid-range insights, not for the Connect inclusion.
- **Refresh activity weekly**: the algorithm rewards freshness signals. Small portfolio edits count.
