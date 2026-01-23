# BUG-001: SteerTrue API Contract Mismatch

**Reported:** 2026-01-22
**Sprint:** S2.2
**Phase:** 3A
**Severity:** BLOCKING
**Status:** ASSIGNED TO DEV (PM verified 2026-01-22)

---

## Summary

The `/api/chat` route sends incorrect request body to SteerTrue `/api/v1/analyze`, causing 422 Unprocessable Entity errors. SteerTrue governance is NOT working.

---

## Evidence

### Railway Logs (2026-01-22 ~23:25 UTC)

```
[SteerTrue] callSteerTrue called with sessionId: 2f9c13f3-4daa-495b-a4da-5e1e3584f9b7
[SteerTrue] STEERTRUE_API_URL: https://steertrue-sandbox-dev-sandbox.up.railway.app
[SteerTrue] Calling: https://steertrue-sandbox-dev-sandbox.up.railway.app/api/v1/analyze
SteerTrue returned 422: Unprocessable Entity
```

### Direct API Test

```bash
curl -s -X POST https://steertrue-sandbox-dev-sandbox.up.railway.app/api/v1/analyze \
  -H "Content-Type: application/json" \
  -d '{"message": "test", "session_id": "test-123"}'
```

**Response:**
```json
{"detail":[{"type":"missing","loc":["body","user_id"],"msg":"Field required","input":{"message":"test","session_id":"test-123"}}]}
```

---

## Root Cause

The code in `app/api/chat/route.ts` lines 50-53 sends:

```typescript
body: JSON.stringify({
  message: message,
  session_id: sessionId,
}),
```

But SteerTrue `/api/v1/analyze` requires `user_id` field.

---

## Impact

- Phase 3A claimed COMPLETE but is NOT working
- All chat requests fall back to `FALLBACK/steertrue_error`
- No SteerTrue governance is being applied to AI responses

---

## Fix Required

Update `app/api/chat/route.ts` to include `user_id` in request body:

```typescript
body: JSON.stringify({
  message: message,
  session_id: sessionId,
  user_id: sessionId, // Add this field
}),
```

---

## Verification Required After Fix

1. Railway logs show: `[SteerTrue] SUCCESS - returning X blocks`
2. Response `done` event contains real blocks (not `FALLBACK/*`)
3. User-visible: AI response has SteerTrue governance tone

---

## Lessons Learned

1. UAT executor tested SteerTrue `/analyze` endpoint directly but NOT through `/api/chat`
2. PM code review verified code structure but not actual API contract
3. Claims of "working" were made without end-to-end proof on Railway

---

**Filed by:** Orchestrator
**Assigned to:** DEV
**PM Handoff:** `.claude/sprints/ai-chatbot/sprint-S2.2/handoffs/BUG-001-dev-handoff.md`

---

## PM Verification (2026-01-22 00:28 UTC)

PM independently confirmed the bug and verified the fix approach:

### Test 1 - Bug Confirmed (422 without user_id)
```bash
curl -s -X POST https://steertrue-sandbox-dev-sandbox.up.railway.app/api/v1/analyze \
  -H "Content-Type: application/json" \
  -d '{"message": "test", "session_id": "test-123"}'
```
Response: `{"detail":[{"type":"missing","loc":["body","user_id"],"msg":"Field required"...}]}`

### Test 2 - Fix Verified (200 with user_id)
```bash
curl -s -X POST https://steertrue-sandbox-dev-sandbox.up.railway.app/api/v1/analyze \
  -H "Content-Type: application/json" \
  -d '{"message": "test", "session_id": "test-123", "user_id": "test-123"}'
```
Response:
- `request_id`: `1bfeec29-2f79-40b9-bce1-7bbbf7ce1350`
- `blocks_injected`: `["L1/framework_container", "L1/core_identity", "L1/global_ethics", "L2/proof_enforcement", "L3/strategic_partner"]`

**PM VERIFIED: Fix approach is correct. Routing to DEV for implementation.**
