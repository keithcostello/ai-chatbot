# BUG-007: CopilotKit Bypasses SteerTrue Governance

**Reported:** 2026-01-23
**Sprint:** S2.2
**Phase:** 4
**Severity:** CRITICAL
**Status:** OPEN

---

## Summary

CopilotKit chat UI works but AI responses do NOT include SteerTrue governance. The CopilotKit endpoint is calling Anthropic directly instead of routing through the Python service that has SteerTrue integration.

---

## Evidence

### UAT Test (2026-01-23)

User sent "What is 2+2?" in CopilotKit chat.

**Expected:** Response with SteerTrue header like:
```
**[SteerTrue: L4/reasoning_discipline | 17 | 2331ms]**

2 + 2 = 4
```

**Actual:** Plain response without governance:
```
2 + 2 = 4

This is a basic arithmetic question...
```

### Comparison with Python Service

Python service `/chat/sync` DOES include SteerTrue:
```json
{
  "content": "**[SteerTrue: L1/framework_container, L1/core_identity, L1/global_ethics, L2/proof_enforcement, L4/reasoning_discipline, L3/strategic_partner | 2028 | 2885ms]**\n\n2 + 2 = 4",
  "blocks_injected": ["L1/framework_container", "L1/core_identity", ...]
}
```

---

## Root Cause

**File:** `app/api/copilot/route.ts`

BUG-005 fix added AnthropicAdapter which calls Anthropic API directly:

```typescript
const serviceAdapter = new AnthropicAdapter({
  model: "claude-sonnet-4-20250514",
});
```

This bypasses the Python service entirely. The `remoteActions` config points to Python service but actions are NOT being used for chat messages - only the serviceAdapter is.

---

## MANDATORY: Review copilot_kit.md

DEV MUST read `.claude/docs/copilot_kit.md` before fixing.

Look for:
- How to route chat messages through external service
- How to use remoteActions for LLM calls (not just actions)
- CopilotKit CoAgents or custom adapters
- Whether CopilotKit can use a custom LLM endpoint

---

## Fix Options

### Option A: Create CopilotKit endpoint in Python service

Add `/copilotkit` endpoint to Python service that CopilotKit can use as LLM backend.

### Option B: Custom ServiceAdapter

Create custom adapter that calls Python service instead of Anthropic directly.

### Option C: Use existing /api/chat endpoint

Configure CopilotKit to use the existing Next.js /api/chat endpoint which already has SteerTrue integration.

---

## Verification Required

After fix:
1. Send message in CopilotKit chat UI
2. AI response MUST include `**[SteerTrue: ...]**` header
3. Railway logs show SteerTrue blocks being injected

---

**Filed by:** Orchestrator
**Assigned to:** DEV
**Review Required:** copilot_kit.md
