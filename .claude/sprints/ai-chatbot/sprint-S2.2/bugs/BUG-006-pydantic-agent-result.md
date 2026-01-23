# BUG-006: Pydantic AI AgentRunResult Attribute Error

**Reported:** 2026-01-23
**Sprint:** S2.2
**Phase:** 3B
**Severity:** CRITICAL
**Status:** FIXED (commit 72c9ccb)

---

## Summary

Python service `/chat/sync` endpoint fails with `'AgentRunResult' object has no attribute 'data'`.

---

## Evidence

### Railway Logs (steertrue-pydantic-ai)

```
ERROR - Unexpected error during chat: 'AgentRunResult' object has no attribute 'data'
ERROR - Sync chat error: 'AgentRunResult' object has no attribute 'data'
POST /chat/sync HTTP/1.1" 500 Internal Server Error
```

---

## Root Cause Analysis

**File:** `python-service/agent.py` or `python-service/main.py`

Code is accessing `.data` attribute on Pydantic AI `AgentRunResult` object, but this attribute doesn't exist.

The correct attribute may be:
- `.output` (for structured output)
- `.data` only exists on specific result types
- Different accessor for streaming vs sync results

---

## MANDATORY: Review pydantic_architect.md

DEV MUST read `.claude/docs/pydantic_architect.md` before fixing this bug.

Check for:
- AgentRunResult structure
- Correct way to access agent output
- Difference between streaming and sync result handling
- Example code for extracting responses

---

## Fix Required

1. Read pydantic_architect.md architect document
2. Find the correct attribute to access agent output
3. Update code to use correct attribute
4. Test with curl before deploying

---

**Filed by:** Orchestrator
**Assigned to:** DEV
**Review Required:** pydantic_architect.md
