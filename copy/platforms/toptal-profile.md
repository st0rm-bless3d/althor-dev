# Toptal profile — Althor (Samuel S)

**Last reviewed**: 2026-05-25
**Source of truth**: althor.dev case studies + essays
**Status**: Application not yet submitted (Phase 1 of platform pivot)

---

## Specialty selection (during application)

Toptal's dropdown shifts periodically. Target order during application:

1. **AI Engineer** (or "AI Architect" / "AI Platform Engineer" if offered as separate track)
2. **Full-Stack Developer with AI specialty** (fallback if no dedicated AI track)
3. **Backend Developer** (third-string — don't lead with this)

Avoid: "Generic Developer", anything front-end-only, anything mobile.

---

## Headline (concise — Toptal profiles don't have Upwork's 70-char limit but shorter is better here)

```
AI Platform Architect — Azure, MCP, Multi-Model LLM Pipelines
```

---

## Bio (target 200–300 words — Toptal's bio field is shorter than Upwork's overview)

```
I build the infrastructure layer between a working prompt and a production agent deployment that passes security review.

Recent production work:

A configurable multi-stage extraction pipeline with field-level consensus voting across LLMs. 30× throughput, eliminated a contractor spend, every extraction decision auditable end-to-end. TypeScript + Azure Functions + Durable Orchestration + Bicep.

An enterprise AI governance platform — use-case registry, four-tier Entra ID RBAC, council review workflow, native Teams + SharePoint embedding. Operating at global enterprise scale.

Ongoing: Spire, an AI-native infrastructure control plane built in Rust. Policy-gated approvals, structured audit log, MCP tools with read-only guards and per-server auth boundaries.

The specialty: Microsoft ecosystem (Azure, Entra ID, M365, Power Platform, Copilot Studio) plus AI-provider depth (Azure OpenAI, Anthropic Claude API + Agent SDK, MCP server publisher + consumer). Background spans architecture, build, and the audit work most teams skip until InfoSec asks.

Published essays on Entra ID workload identities for agents, adding MCP to Copilot Studio in regulated environments, and MCP server boundary design. Practice site at althor.dev.

How I engage:

— Architecture before code. Auth boundaries, tool scopes, audit surface, failure modes modeled first.
— Scoped tools, never master keys. Credentials live in brokers, tools expose narrow surfaces with allowlists.
— Audit everything. Compliance review, debugging, post-incident analysis run against the same structured surface.
— Humans own the risky calls. Reversible actions auto-run. State changes queue for approval.
— Documentation that survives me. IaC, runbooks, architecture docs ship with every engagement.

D.C. metro · remote-first · regulated environments preferred.
```

(Word count ~270. Trim a paragraph if Toptal's bio field caps lower.)

---

## Skills (15, ordered for Toptal's matcher)

Toptal's matcher gives heavier weight to specialty-track skills. Order accordingly:

1. Azure OpenAI
2. Model Context Protocol
3. Anthropic Claude
4. AI Agent Development
5. Microsoft Copilot Studio
6. Microsoft Entra ID
7. Retrieval-Augmented Generation (RAG)
8. Document Intelligence
9. Bicep
10. Microsoft Power Platform
11. TypeScript
12. C# / .NET
13. Azure Functions
14. AI Governance
15. CI/CD

**Why this differs from Upwork**: Toptal matcher weights specialty depth over keyword coverage. MCP and Claude land in the top three because Toptal's clients are commissioning agent-infrastructure work, not just looking for "any AI dev."

---

## Portfolio (5–8 deep entries)

Toptal prefers fewer, deeper portfolio items than Upwork. Each one needs an architecture diagram, the decisions you made, what broke. Pull from althor.dev:

1. **Multi-model extraction pipeline** — full architecture diagram, decisions on consensus voting + Raw/Suggested/Final audit layering, 30× throughput metric. (althor.dev/work/extraction-pipeline/)
2. **Enterprise AI governance platform** — architecture diagram, four-tier RBAC decision, Teams + SharePoint embedding pattern, ~100 submissions/month scale. (althor.dev/work/governance-platform/)
3. **Spire — AI infrastructure control plane** — homelab-validated, Rust + Axum + MCP, policy-gated approvals, per-object audit. (althor.dev/work/spire/)
4. **Entra ID workload identities for agent systems** — long-form pattern essay with decision tree. (althor.dev/writing/entra-workload-identities/)
5. **Adding MCP servers to Copilot Studio** — pattern essay with threat model. (althor.dev/writing/mcp-copilot-studio/)
6. **MCP server boundaries — when to expose what** — six rules for designing MCP tool surfaces. (althor.dev/writing/mcp-server-boundaries/)
7. **Agent security review** — pre-flight review checklist for shipping AI agents. (althor.dev/writing/agent-security-review/)
8. **Agent Security Review Checklist (free PDF lead magnet)** — productized version of the review. (althor.dev/checklist/)

---

## Rate

Toptal sets the client-facing rate; you set your floor. Floor recommendation:

- **Minimum**: $130/hr (Toptal takes their margin opaque inside this — client sees ~$150–160/hr)
- **Target**: $150/hr ($175–185/hr client rate)
- **Stretch for AI specialty**: $175/hr ($200+ client rate)

For context: Toptal AI specialists in 2026 commonly hit $150–200+/hr client-side. Don't undersell — the matcher uses your floor to filter inbound, so a lower floor means you get matched to lower-quality engagements.

---

## Screening prep notes (NOT for the profile — for you, before the application)

### Stage 1 — Language & Personality (15–20 min)

- Common opener: "Walk me through your background."
- Practice answering this in under 2 min, 10x out loud. Three beats: technical depth, recent production work, the specific consulting practice you've built.
- Common second: "Describe a challenging project."
- Pick ONE: the extraction pipeline (consensus voting was non-obvious, retired contractor spend) or the governance platform (four-tier RBAC mapped to Entra security groups). Practice the 3-min walkthrough.
- Don't over-qualify. "It depends" is fine occasionally; chronic hedging fails.

### Stage 2 — Technical / Skill (90 min timed, HackerRank or Codility)

- This is the highest-failure stage for senior architects who don't grind LeetCode.
- Prep window: 2 weeks of LeetCode Easy + Medium (~50–100 problems). Focus on: arrays/strings, hash maps, two-pointer, binary search, basic graph traversal, basic DP.
- If a system-design / architecture track is available for the AI Engineer specialty — ASK for it during the recruiter call. Some specialty tracks have alternate Stage 2 formats.
- Don't apply until you've done 2 weeks of prep. Failing Stage 2 means a ~6-month cooldown.

### Stage 3 — Live Technical Interview (1 hr)

- Senior Toptal engineer, live coding + system design conversation.
- For AI specialty: expect a real-world scenario — "design an MCP server for X" or "architect an agent system that does Y under these constraints." Prep by walking through the althor.dev case studies as if explaining them on a whiteboard.
- Communication > raw skill. They're selling consultants to non-technical client buyers. If you can't explain it plain, you fail regardless of correctness.

### Stage 4 — Test Project (1–3 weeks)

- For AI specialty: likely an agent-system design + implementation exercise.
- **Highest-failure mode is over-engineering**. Stick to the spec. Document choices. Ship clean code. Don't gold-plate.
- The althor.dev case studies are your reference — they show "what good looks like" in terms of scope discipline + documentation discipline.

### Stage 5 — Onboarding + first match

- ~5 days from acceptance to first client match.
- First match offers usually arrive within 2 weeks of acceptance for AI specialists (current undersupply per 2026 demand data).

---

## Payee / LLC setup

- **Pay-out method**: PayPal or Payoneer (Toptal default)
- **Legal entity**: Althor Consulting LLC + EIN
- **W-9 / W-8BEN**: W-9 (US entity)
- **Insurance**: Toptal carries E&O / professional liability for client engagements
