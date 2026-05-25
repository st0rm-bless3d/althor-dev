# Upwork proposal template — AI platform / Azure AI / multi-model pipelines

**Use this when**: Job post is for AI architecture, multi-model pipelines, RAG systems, agent platforms, or LLM gateway / observability work. Most often filed under "AI Agent Development" or "AI Services."

**Don't use this for**: Pure Copilot Studio jobs (use upwork-copilot-studio.md), pure MCP/agent infra jobs (use upwork-mcp-agents.md), or Power Automate / workflow automation jobs (use upwork-power-automate.md).

---

## Structure

Two-line hook (visible in proposal preview) + three bullets + scoping question + portfolio link + availability.

The first two sentences MUST contain: (a) the client's name or first 4 words of their job description echoed back, and (b) the specific match to their stated problem. This is the proposal-preview filter that decides whether you get opened.

---

## Template

```
{{CLIENT_NAME_IF_VISIBLE}} — I've shipped {{ECHO_THE_SPECIFIC_THING_FROM_THEIR_JOB_DESC}} into regulated production. Same shape as what you're describing.

Last six months I delivered:

▸ A multi-model extraction pipeline with field-level consensus voting across LLMs. Took throughput from 4 to 120 entries/hour — about a 30× lift — and retired an ongoing contractor spend. TypeScript + Azure Functions + Durable Orchestration + Entra ID + Bicep IaC.

▸ An enterprise AI governance platform — use-case registry, four-tier Entra ID RBAC, council review workflow, native Teams + SharePoint embedding. Global enterprise scale, ~100 submissions/month.

▸ {{PICK_ONE_RELEVANT_TO_THEIR_DOMAIN: Spire / Copilot Studio agent quickstart / RAG pipeline health check}}

One question on {{SPECIFIC_DETAIL_FROM_THEIR_POST}} before scoping — {{THE_ACTUAL_QUESTION}}.

Portfolio: althor.dev | Essays on agent infra: althor.dev/writing | Available {{HOURS}}/week starting {{DATE}}.

— Samuel
```

---

## Variant blocks (swap into bullet 3 based on the job)

### If the job mentions RAG, embeddings, or retrieval:
```
▸ Recently shipped a RAG pipeline review framework — embedding model fit (the silent 2048-token cap on Nomic, the dimension/storage tradeoffs across providers), chunking strategy, hybrid retrieval (BM25 + vector + rerank), eval harness for catching regressions. Catalogued as a productized health check at althor.dev/packages/rag-health-check.
```

### If the job mentions MCP, agents, or tool use:
```
▸ Run Spire, my own AI infrastructure control plane built in Rust — policy-gated approvals, per-object audit log, MCP server publisher + client consumer with proper auth boundaries. Long-form essays on MCP server boundary design + MCP in Copilot Studio at althor.dev/writing.
```

### If the job mentions Anthropic Claude or Agent SDK:
```
▸ Building on Claude API + Agent SDK in production. Prompt caching, multi-model coordination, tool use design, the cost shape of running Claude vs Azure OpenAI for the same workloads. Live integration in my own infra control plane.
```

### If the job mentions LangChain, LlamaIndex, or "AI framework" stuff:
Skip the framework name — I prefer first-principles infrastructure over framework lock-in. Replace bullet 3 with:
```
▸ Bias toward first-principles infrastructure over framework lock-in. I've shipped agent stacks both ways and the framework-free versions consistently outlast the framework versions — because the framework you pick today gets deprecated before the audit team finishes reviewing it. Happy to discuss trade-offs.
```

### If the job mentions a specific Azure service (Functions, Foundry, AI Search, etc.):
Replace bullet 3 with explicit case study link plus:
```
▸ Deep on {{AZURE_SERVICE}} — {{1_SENTENCE_SPECIFIC_INSIGHT}}. {{LINK_TO_RELEVANT_ESSAY_OR_CASE_STUDY}}
```

---

## Scoping question templates (bullet line "One question on...")

Pick a question that proves you read the post and that surfaces a key architecture decision. Avoid generic questions. Some patterns:

- "One question on the data source — is it living in {{TENANT_GUESSED_FROM_JD}} or in a separate {{SYSTEM}}? The OBO flow design depends on that."
- "One question on the eval harness — do you have a golden set already, or is part of the scope building it? Both are fine, just affects timeline."
- "One question on the auth boundary — are these tools meant to act as the user (OBO) or as the agent (app-only)? That decision drives the audit trail shape."
- "One question on the deployment target — is this landing in Azure (Functions / Container Apps / AKS) or somewhere else? Affects the IaC stack."
- "One question on the security review timing — is InfoSec already engaged, or is the goal to ship something that survives review when it lands? Both are fine, just changes the architecture I'd propose."

---

## Anti-patterns (don't do)

- Don't open with "Dear Sir/Madam" or "Hi there!"
- Don't list every skill you have ("I am proficient in...")
- Don't paste your full case study text — link to it instead, bullet should be one sentence
- Don't ask for the client's email or phone number in the proposal — Upwork flags this and it hurts your JSS
- Don't quote a price in the proposal unless the job is fixed-price and they asked
- Don't apologize for your rate ("I know my rate is higher than...")
- Don't promise unrealistic timelines to win the bid — JSS lives on completion quality

---

## When to skip a job entirely

- Fixed-price under $500 — not enough margin to bother
- Asking for "AI expert" with $15/hr budget — wrong client
- Multiple "fluent in 20 frameworks" requirements — generic skill harvest, low fit
- "Looking for a long-term partner" with no specific scope — usually means they don't know what they want
- Job posted >48 hours ago with 50+ proposals — algorithm has moved on
- Client unverified payment or <80% hire rate

---

## Bid timing

Reply within the first hour of posting when possible. First-hour bids see ~3× the open-rate of bids submitted 24 hours later. Set up saved searches with filters: payment verified ✅, client spend $5K+, hire rate 80%+, posted <24hr.

---

## Connects budget per proposal

- 16–20 Connects (standard): proceed if 80%+ fit
- 40 Connects (boosted): only for >95% fit + high-value job ($10K+ scope)
- 50–100 Connects (Boosted Proposals): reserve for the 1-in-20 perfect-fit job
