# BUG-002: Python Service Errors

**Reported:** 2026-01-22
**Sprint:** S2.2
**Phase:** 3B
**Severity:** BLOCKING
**Status:** ROUTED TO DEV

---

## Summary

Python service `/chat` endpoint fails with two errors:
1. SteerTrue returns 422 (missing `user_id`)
2. Pydantic AI `result_type` parameter not recognized

---

## Evidence

### Railway Logs (steertrue-pydantic-ai service)

```
2026-01-23 00:50:25,900 - steertrue - ERROR - SteerTrue returned 422: {"detail":[{"type":"missing","loc":["body","user_id"],"msg":"Field required","input":{"message":"Hello","session_id":"test-session"}}]}
2026-01-23 00:50:25,900 - main - INFO - SteerTrue returned 1 blocks: ['FALLBACK/steertrue_error']
2026-01-23 00:50:26,027 - agent - ERROR - Streaming error: Unknown keyword arguments: `result_type`
```

### curl Test

```bash
curl -s -X POST "https://steertrue-pydantic-ai-dev-sandbox.up.railway.app/chat" \
  -H "Content-Type: application/json" \
  -H "X-Session-ID: test-session" \
  -d '{"message": "Hello", "session_context": {"user_id": "test-user"}}'
```

**Response:**
```
data: {"type": "error", "code": "STREAM_ERROR", "message": "Unknown keyword arguments: `result_type`"}
```

---

## Root Causes

### Issue 1: SteerTrue 422

**File:** `python-service/steertrue.py`
**Problem:** Missing `user_id` in request body to SteerTrue `/api/v1/analyze`

Same fix as BUG-001 - add `user_id` to the request body.

### Issue 2: Pydantic AI result_type

**File:** `python-service/agent.py`
**Problem:** `result_type` is not a valid parameter for pydantic-ai Agent

Pydantic AI API may have changed. Need to check pydantic-ai docs for correct parameter name.

---

## Fix Required

### Fix 1: steertrue.py

Add `user_id` to analyze request body (search for where it calls `/api/v1/analyze`).

### Fix 2: agent.py

Check pydantic-ai documentation for correct structured output parameter:
- https://ai.pydantic.dev/
- May be `output_type` instead of `result_type`

---

## Verification Required After Fix

1. `curl POST /chat` returns streaming response with real content
2. Railway logs show `SteerTrue returned X blocks` with real blocks (not FALLBACK/*)
3. No errors in Railway logs

---

**Filed by:** Orchestrator
**Assigned to:** DEV
