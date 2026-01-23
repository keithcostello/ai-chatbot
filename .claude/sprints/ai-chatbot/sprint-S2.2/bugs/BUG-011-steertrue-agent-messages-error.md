# BUG-011: SteerTrueAgent TypeError - Cannot Read .messages

**Reported:** 2026-01-23
**Sprint:** S2.2
**Phase:** 4
**Severity:** CRITICAL
**Status:** OPEN

---

## Summary

SteerTrueAgent crashes with `TypeError: Cannot read properties of undefined (reading 'messages')` in handleRun method. Also, SteerTrue API returns 422 Unprocessable Entity.

---

## Evidence

### Railway Logs

```
[SteerTrueAgent] SteerTrue returned 422: Unprocessable Entity
[SteerTrueAgent] Got system prompt with 1 blocks
[SteerTrueAgent] Error: TypeError: Cannot read properties of undefined (reading 'messages')
    at et7.handleRun (.next/server/chunks/[root-of-the-server]__9e0a1d01._.js:321:3431)
Agent execution failed: Error: First event must be 'RUN_STARTED'
```

### UAT Result

- Chat page loads (BUG-010 fix working)
- User can send message
- NO AI response - crashes before generating

---

## Root Cause Analysis

**Two issues:**

### Issue 1: SteerTrue 422 Error

SteerTrue API returns 422 Unprocessable Entity. This is the same error as BUG-001 and BUG-002 - likely missing `user_id` in the request body.

**File:** `lib/steertrue-agent.ts` - `callSteerTrue()` function

Check request body format against what SteerTrue expects:
```typescript
// Required by SteerTrue /api/v1/analyze:
{
  message: string,
  session_id: string,
  user_id: string  // THIS MAY BE MISSING
}
```

### Issue 2: .messages TypeError

After SteerTrue returns (even with fallback), the code tries to access `.messages` on something undefined.

**File:** `lib/steertrue-agent.ts` - `handleRun()` method

The code likely accesses `context.messages` or similar where context is undefined.

---

## MANDATORY: Review copilot_kit.md

DEV MUST read `.claude/docs/copilot_kit.md` for AG-UI message format and context structure.

Check:
- RunInput structure for AbstractAgent
- How to access messages in handleRun
- Correct AG-UI event sequence (RUN_STARTED must be first)

---

## Fix Required

1. Add `user_id` to SteerTrue API request (like BUG-001 fix)
2. Fix undefined access in handleRun - check context/input structure
3. Ensure RUN_STARTED event is emitted first

---

## Verification

After fix:
1. SteerTrue returns 200 (not 422)
2. No TypeError in logs
3. AI response appears in chat
4. Response includes `**[SteerTrue: ...]**` header

---

**Filed by:** Orchestrator
**Assigned to:** DEV
**Review Required:** copilot_kit.md
