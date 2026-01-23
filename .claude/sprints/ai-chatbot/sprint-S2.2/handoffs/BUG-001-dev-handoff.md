# DEV HANDOFF: BUG-001 - SteerTrue API Contract Fix

**Date:** 2026-01-22
**Sprint:** S2.2
**Bug ID:** BUG-001
**Assigned to:** dev-executor
**Priority:** BLOCKING

---

## PM ACKNOWLEDGMENT

I have reviewed and confirmed BUG-001. The issue is VALID:

### PM Independent Verification

**Test 1: Without user_id (current broken state)**
```bash
curl -s -X POST https://steertrue-sandbox-dev-sandbox.up.railway.app/api/v1/analyze \
  -H "Content-Type: application/json" \
  -d '{"message": "test", "session_id": "test-123"}'
```

**Response (422 Error):**
```json
{"detail":[{"type":"missing","loc":["body","user_id"],"msg":"Field required","input":{"message":"test","session_id":"test-123"}}]}
```

**Test 2: With user_id (correct fix)**
```bash
curl -s -X POST https://steertrue-sandbox-dev-sandbox.up.railway.app/api/v1/analyze \
  -H "Content-Type: application/json" \
  -d '{"message": "test", "session_id": "test-123", "user_id": "test-123"}'
```

**Response (200 OK with real blocks):**
- `request_id`: `1bfeec29-2f79-40b9-bce1-7bbbf7ce1350`
- `processed_at`: `2026-01-23T00:28:59.590499+00:00`
- `blocks_injected`: `["L1/framework_container", "L1/core_identity", "L1/global_ethics", "L2/proof_enforcement", "L3/strategic_partner"]`

---

## FIX INSTRUCTIONS

### File to Modify
`app/api/chat/route.ts`

### Location
Lines 54-57 in the `callSteerTrue` function

### Current Code (WRONG)
```typescript
body: JSON.stringify({
  message: message,
  session_id: sessionId,
}),
```

### Required Code (CORRECT)
```typescript
body: JSON.stringify({
  message: message,
  session_id: sessionId,
  user_id: sessionId,
}),
```

### Change Summary
Add `user_id: sessionId` to the request body. The SteerTrue API requires `user_id` field.

---

## ACCEPTANCE CRITERIA

### Must Pass
1. Railway build succeeds
2. Railway logs show: `[SteerTrue] SUCCESS - returning X blocks` (where X > 0)
3. Response `done` event contains real block names (e.g., `L1/framework_container`), NOT `FALLBACK/*`

### Must NOT
- Claim fix is complete without Railway UAT proof
- Submit checkpoint with only local test results
- Show `FALLBACK/steertrue_error` in blocks_injected

---

## PROOF REQUIRED IN CHECKPOINT

DEV checkpoint MUST include:

1. **The exact code change** (diff or paste)
2. **Railway deployment status** (commit SHA deployed)
3. **Railway logs** showing `[SteerTrue] SUCCESS`
4. **Actual curl test to Railway URL** showing real blocks in response

Example proof structure:
```markdown
## Code Change
[paste diff]

## Railway Deployment
Commit: [SHA]
Status: [deployed/building]

## Railway Logs
[paste log lines showing SUCCESS]

## UAT Test
Command: curl -X POST [railway-url]/api/chat ...
Response: {"type": "done", "blocksInjected": ["L1/...", "L2/..."], ...}
```

---

## WARNINGS

1. **DO NOT** claim fixed if blocks_injected still shows `FALLBACK/*`
2. **DO NOT** test only locally - must test deployed Railway endpoint
3. **DO NOT** fabricate log output or test responses

---

**RELAY TO DEV:** BUG-001 assigned - Add `user_id` to SteerTrue request body in `app/api/chat/route.ts`. Proof required: Railway logs showing SUCCESS + real blocks (not FALLBACK) on dev-sprint-S2.2.

**PM STATUS:** Awaiting DEV checkpoint with fix proof.
