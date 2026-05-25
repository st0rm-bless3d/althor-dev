# Upwork proposal template — Power Automate / workflow automation

**Use this when**: Job post is for Power Automate, workflow automation, M365 integration, SharePoint workflows, Teams adaptive cards, or "automating a manual process" with Microsoft tools.

**Don't use this for**: Copilot Studio agents (use upwork-copilot-studio.md), AI/LLM-centric jobs (use upwork-ai-platform.md or upwork-mcp-agents.md).

**Why this exists**: Power Automate jobs are massive long-tail volume at $50–80/hr — exactly the right shape for cold-start grinding to Top Rated badge in the first 2–4 weeks. Lower margin per job but high win rate.

---

## Cold-start framing

For the first 2 weeks on Upwork, accept Power Automate jobs at $60–75/hr to bank reviews and hit the $1K-earnings JSS-90% bar. After Top Rated badge, raise to $90/hr; after 3 months and visible Top Rated history, raise to $110/hr.

---

## Template

```
{{CLIENT_NAME_IF_VISIBLE}} — {{ECHO_THEIR_PROBLEM_IN_ONE_SENTENCE}}. I build these as part of broader AI/M365 work; happy to do a one-off if that's what you need.

Recent Microsoft-stack work:

▸ Enterprise AI governance platform — Power Platform + Entra ID + Cosmos DB + native Microsoft Teams + SharePoint embedding. Council review workflow with conditional approvals, audit trail. ~100 submissions/month at global enterprise scale. althor.dev/work/governance-platform.

▸ Multi-stage data pipelines — Azure Functions + Durable Orchestration with audit-grade event sourcing. Powers a 30× throughput lift on a previously-manual process. TypeScript + Bicep IaC. althor.dev/work/extraction-pipeline.

▸ {{IF_THEIR_JOB_MENTIONS_APPROVAL: }} Approval workflows are a particular focus — multi-tier approvers, dynamic routing based on form data, audit log of every decision, escalation timers, Teams adaptive cards for in-channel approve/reject.
   {{IF_THEIR_JOB_MENTIONS_AI: }} Often pair Power Automate with Azure OpenAI or Copilot Studio for "automation with judgment" — flow handles the deterministic steps, LLM handles the classification/extraction/drafting steps, audit log captures both.
   {{ELSE: }} Comfortable across the Power Platform surface — flows, custom connectors, Dataverse, Power Apps wrappers when the workflow needs a UI.

One question on {{SPECIFIC_DETAIL_FROM_THEIR_POST}} — {{THE_QUESTION}}.

Portfolio: althor.dev | Available {{HOURS}}/week starting {{DATE}}.

— Samuel
```

---

## Scoping question patterns (Power Automate-specific)

- "One question on the trigger — is this scheduled, event-driven (SharePoint, Outlook, Teams), or webhook-triggered from an external system? Drives the flow shape."
- "One question on the connector posture — using premium connectors (your license covers this?) or sticking to standard? Affects what's feasible."
- "One question on error handling — do you want failure notifications to land in Teams, email, or both? And should failed runs auto-retry or queue for human review?"
- "One question on the audit log — is there a SharePoint list or Dataverse table where you want every run recorded, or is the built-in run history sufficient?"
- "One question on environment — is this landing in your Production environment, or do you want it built in Dev first with a deployment path? Both fine, just changes the engagement shape."

---

## When to bid (and not)

### Bid:
- Specific deliverable scope ("automate confirmation emails for new appointments in Calendly → CRM")
- Client has clear "before" pain (3 hours/week manual work, etc.)
- Stack already in place (they have M365, Power Automate license — verify in proposal question if unclear)
- $500+ fixed price or $50+/hr ceiling
- Posted in last 24 hours

### Skip:
- "We need someone to build all our automations" (no scope, scope-creep magnet)
- "Power Automate expert wanted" with $10/hr budget
- Multi-tool requirement ("must be expert in Power Automate, Zapier, Make, n8n, Workato...") — generic skill harvest
- Jobs requesting RPA (UiPath, Automation Anywhere) misclassified as Power Automate
- "Looking for a long-term partner" with no specific first task

---

## What NOT to over-promise

Power Automate jobs are tempting to over-promise because the platform is "easy." It's not. Common failure modes:
- Premium connector cost the client didn't budget for
- Throttling limits (Microsoft Graph + SharePoint) that surface at production volume
- Service account permissions that need IT-side coordination you can't do alone
- License model gotchas (per-user vs per-flow plans)

In scoping, ALWAYS surface: license posture, premium connector cost if applicable, service account / app registration ownership, throttling tier expected.
