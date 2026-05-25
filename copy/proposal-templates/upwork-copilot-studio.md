# Upwork proposal template — Microsoft Copilot Studio

**Use this when**: Job post explicitly mentions Copilot Studio, Power Virtual Agents (legacy name), custom connectors, Power Platform AI, or agents inside the M365 surface. Often categorized under "Microsoft Power Platform" or "AI Agent Development."

**Don't use this for**: Generic AI agent jobs (use upwork-mcp-agents.md or upwork-ai-platform.md), Power Automate flows without an agent (use upwork-power-automate.md).

---

## Why Copilot Studio jobs are high-value

The wizard makes it look 10x easier than it is. Five architecture decisions (identity / DLP / orchestration / transport / tenant scope) sit upstream of the onboarding flow. Most teams realize this 3 weeks in. That's when they post jobs that read like "we built a Copilot agent but it's not working correctly" — translation: they need someone who's done the architecture work to retrofit it.

You'll win these by demonstrating in the proposal that you know the five decisions exist.

---

## Template

```
{{CLIENT_NAME_IF_VISIBLE}} — I've shipped Copilot Studio agents into regulated tenants. The architecture is in the five decisions upstream of the wizard: identity (OAuth on-behalf-of for user-scoped data, app-only for shared), DLP zone classification, generative orchestration on (classic ignores MCP and custom connectors silently degrade), Streamable HTTP transport (SSE was deprecated August 2025), and tenant scoping. Sounds like you're at the {{IDENTIFY_WHICH_OF_THE_5_THEY'RE_STRUGGLING_WITH}} step.

Recent work:

▸ Copilot Studio quickstart pattern — working agent + custom connector + Azure Functions OBO middleware + Bicep IaC + audit logging, security-review-ready by handoff. Productized at althor.dev/packages/copilot-studio-quickstart.

▸ {{IF_THEIR_DOMAIN_IS_ENTERPRISE_INTEGRATION:}} Enterprise AI governance platform — use-case registry with four-tier Entra ID RBAC, native Microsoft Teams + SharePoint embedding, council review workflow. Global enterprise scale.
   {{IF_THEIR_DOMAIN_IS_AGENT_DESIGN:}} Multi-model extraction pipeline with field-level consensus voting — 30× throughput, every decision auditable end-to-end. TypeScript + Azure Functions + Durable Orchestration.

▸ Long-form essay on adding MCP servers to Copilot Studio in regulated environments — five upstream decisions + the threat model that isn't in the docs. althor.dev/writing/mcp-copilot-studio

One question on {{SPECIFIC_DETAIL}} before scoping — {{THE_QUESTION}}.

Portfolio: althor.dev | Available {{HOURS}}/week starting {{DATE}}.

— Samuel
```

---

## Scoping question patterns (Copilot-specific)

- "One question on the data source — is the agent reading user-scoped data (which means OBO) or shared org data (which means app-only)? That decision drives the whole identity flow."
- "One question on the DLP zone — has this been classified into Business / Non-Business / Blocked, or is that still TBD? It blocks publishing if it's wrong."
- "One question on the orchestration mode — are you on classic or generative? MCP and custom connector reliability depend on generative being on."
- "One question on the connector transport — Streamable HTTP or SSE? SSE was deprecated August 2025 and current Copilot Studio agents silently fail against SSE-only connectors."
- "One question on tenant scoping — is this meant to be tenant-isolated or cross-tenant published? Cross-tenant has a different approval flow."

---

## Red flags in Copilot Studio job posts (be cautious)

- "We need a Copilot Studio expert to set up an AI chatbot for our website" — probably wants Web Chat, not Copilot Studio. Wrong fit.
- "Looking for a Copilot Studio dev to build us a custom AI" — vague, often means they don't have a Microsoft 365 tenant or aren't licensed for Copilot Studio
- "$500 fixed price for a Copilot Studio agent" — license cost alone exceeds this; client doesn't understand the stack
- "Must have 5+ years Copilot Studio experience" — Copilot Studio (formerly PVA) has only had its current shape since ~2023, anything requiring "5+ years" is a copy-paste JD

---

## Green flags (lean in)

- Mentions Entra ID, OBO, app registrations
- Mentions DLP classification or governance
- Mentions a specific data source (Dataverse, ServiceNow, SharePoint sites, internal API)
- Mentions InfoSec or security review
- Mentions audit logging or compliance
- Client industry is regulated (finance, healthcare, gov, legal, education)
- Client has $10K+ spend on Upwork historically
- Job posted in the last 4 hours
