# Upwork proposal template — MCP servers, agents, Anthropic Claude, agent infrastructure

**Use this when**: Job post mentions Model Context Protocol, MCP server design, agent infrastructure, Anthropic Claude API / Agent SDK, tool use, agent orchestration, multi-agent systems, or anything in that adjacent space. Often categorized under "AI Agent Development."

**Don't use this for**: Generic chatbot work (often wrongly tagged as "agent"), pure RAG without an agent (use upwork-ai-platform.md), Copilot Studio (use upwork-copilot-studio.md).

---

## Why MCP/agent jobs are high-leverage

MCP is the hottest tag in AI infra as of Q2 2026. Most teams shipping MCP servers are doing it for the first time and the failure modes (trust boundary, tool surface, auth, output bounds, audit) are non-obvious. Even teams that have been doing AI for years are building their first MCP server now.

You'll win these by demonstrating that you've published opinion on MCP server boundaries — that's a signal almost no other freelancer can fake.

---

## Template

```
{{CLIENT_NAME_IF_VISIBLE}} — MCP server boundaries are exactly what I've been writing on (althor.dev/writing/mcp-server-boundaries) and shipping in my own infra control plane. {{ECHO_THEIR_SPECIFIC_PROBLEM}} is the right concern to be raising at this stage.

Recent work:

▸ Spire — my own AI infrastructure control plane built in Rust. MCP server publisher + client consumer with proper trust boundaries: one server, one credential scope, read-only by default, writes tagged and policy-gated. Per-object audit log. Source/screenshots at althor.dev/work/spire.

▸ {{PICK_ONE:}} Multi-model extraction pipeline with field-level consensus voting — agent orchestration across LLMs, 30× throughput, every decision auditable. TypeScript + Durable Orchestration.
   {{OR:}} MCP Server Security Review package — tool-by-tool review against OWASP Agentic AI Top 10, remediation list ordered by exploitability. althor.dev/packages/mcp-security-review

▸ Published opinion on MCP server boundary design + adding MCP to Copilot Studio in regulated environments. Six rules essay at althor.dev/writing/mcp-server-boundaries; regulated-tenant integration at althor.dev/writing/mcp-copilot-studio.

One question on {{SPECIFIC_DETAIL}} before scoping — {{THE_QUESTION}}.

Portfolio: althor.dev | Available {{HOURS}}/week starting {{DATE}}.

— Samuel
```

---

## Variant lead-ins by job type

### "We need someone to build us an MCP server for X"
Lead: "MCP server design comes down to four decisions: trust boundary, tool surface, auth resolution, output bounds. The good news on X is the trust boundary is pretty clear; the work is mostly in {{TOOL_SURFACE / AUTH / OUTPUT_BOUNDS — pick the trickiest}}."

### "We need someone to security-review our MCP server"
Lead: "I run this as a productized package — written review against the OWASP Agentic AI Top 10, tool-by-tool, with a remediation list ordered by exploitability. Three days, $1,500 fixed if you want to go that route, or hourly on Upwork if you'd rather. althor.dev/packages/mcp-security-review."

### "Building an agent on Claude API / Agent SDK"
Lead: "Building on the Claude API + Agent SDK in production myself. Prompt caching, tool use design, multi-model coordination — happy to walk through the trade-offs vs Azure OpenAI for the same workloads."

### "Multi-agent orchestration / agent-of-agents"
Lead: "Multi-agent systems are mostly an orchestration + audit problem disguised as an LLM problem. Recent work on field-level consensus voting across models, policy-gated approval flows, per-object audit logs — happy to walk through the patterns."

---

## Scoping question patterns (MCP/agent-specific)

- "One question on the trust boundary — is the MCP server going to be called by an agent on the user's machine (one trust posture) or by a service-side agent on shared infra (different posture)? Drives the auth design."
- "One question on the tool surface — is this read-only against {{SYSTEM}}, or does it need write capability? Writes need policy gating and that's a chunk of the engagement."
- "One question on the deployment target — Claude Desktop config, Copilot Studio custom connector, or your own agent runtime? Each one has a different boundary."
- "One question on the audit requirements — is there a downstream SIEM or compliance surface this needs to feed, or is logging just for debugging right now?"
- "One question on the LLM choice — is this Claude-locked, OpenAI-locked, or model-agnostic? If model-agnostic, where does the orchestration live?"

---

## What proves expertise in the proposal (without bragging)

The phrase that wins MCP jobs is: **"trust boundary, tool surface, auth resolution, output bounds, audit surface."** Drop those five concepts (in the right order) in the first two sentences. Clients who know what they're doing recognize the framework instantly; clients who don't notice the precision and assume you do.

Avoid the phrases that mark someone as new to MCP:
- "MCP allows LLMs to access tools" (true but generic — every blog post says this)
- "I've used MCP with [client name]" (no real architect names the client like that)
- "I can integrate any MCP server with any agent" (over-promise — the integration shape varies a lot)
