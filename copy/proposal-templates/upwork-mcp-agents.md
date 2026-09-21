# MCP and agent integration proposal draft

Status: Draft, unsent. Reviewed 2026-09-21.

## Template

Hi {{NAME}},

For {{SPECIFIC_SYSTEM_OR_TOOL}}, I'd start by checking which operations the agent needs and whose permissions each call uses.

I maintain Spire, an independent infrastructure project used with my own systems. It gives me direct experience building and operating agent workflows. The overview is at https://althorlabs.com/work/spire/. My notes on tool design are at https://althorlabs.com/writing/mcp-server-boundaries/.

For your brief, I propose {{BOUNDED_IMPLEMENTATION_OR_REVIEW}}. The acceptance check would be {{OBSERVABLE_RESULT_INCLUDING_RELEVANT_DENIED_ACTION}}.

{{ONE_QUESTION_ABOUT_CALLER_ACCESS_OR_WRITES}}

I have {{CONFIRMED_HOURS}} hours per week available from {{CONFIRMED_DATE}}.

Samuel
Althor Labs
https://althorlabs.com

## Fixed review option

Existing offer: MCP Server Security Review, $1,500 fixed, three days. Confirm the tool inventory, access, and start date before quoting delivery. The output is a written review with prioritized remediation, not a security certification.

https://althorlabs.com/packages/mcp-security-review/

## Scoping

Identify the caller, credential handling, and allowed operations. Ask which writes need approval, what record remains after a denied call, and which client or runtime must work. Describe proposed services separately from completed work.
