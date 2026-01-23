# BUG-008: SteerTrueAnthropicAdapter Unknown Provider Error

**Reported:** 2026-01-23
**Sprint:** S2.2
**Phase:** 4
**Severity:** CRITICAL
**Status:** OPEN

---

## Summary

SteerTrueAnthropicAdapter registers as provider "anthropic-steertrue" which CopilotKit rejects. No AI response is generated.

---

## Evidence

### Railway Logs

```
Agent execution failed: Error: Unknown provider "anthropic-steertrue" in "anthropic-steertrue/claude-sonnet-4-20250514". Supported: openai, anthropic, google (gemini).
```

### UAT Test

- User sends message in CopilotKit chat
- User message appears
- NO AI response - chat stuck
- Send button stays disabled

---

## Root Cause

**File:** `lib/steertrue-adapter.ts`

The SteerTrueAnthropicAdapter is registering with provider name "anthropic-steertrue" instead of "anthropic".

CopilotKit only supports these providers:
- `openai`
- `anthropic`
- `google` (gemini)

Custom provider names are rejected.

---

## MANDATORY: Review copilot_kit.md

DEV MUST read `.claude/docs/copilot_kit.md` before fixing.

Look for:
- How to properly extend AnthropicAdapter
- Provider registration requirements
- Custom adapter patterns that work

---

## Fix Required

Option A: Change provider from "anthropic-steertrue" to "anthropic"

Option B: Extend AnthropicAdapter correctly instead of creating custom provider

Option C: Use a different approach - wrap the request/response instead of custom provider

---

## Verification

After fix:
1. Send message in CopilotKit chat
2. AI response appears (not stuck)
3. Response includes SteerTrue governance header
4. No "Unknown provider" errors in Railway logs

---

**Filed by:** Orchestrator
**Assigned to:** DEV
**Review Required:** copilot_kit.md
