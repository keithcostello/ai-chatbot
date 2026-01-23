# BUG-003: Pydantic AI Streaming Incompatible with Structured Output

**Reported:** 2026-01-23
**Sprint:** S2.2
**Phase:** 3B
**Severity:** BLOCKING
**Status:** OPEN

---

## Summary

Pydantic AI's `stream_text()` method cannot be used with `output_type` (structured output). The code tries to stream text but structured output mode doesn't support text streaming.

---

## Evidence

### curl Test

```bash
curl -s -X POST "https://steertrue-pydantic-ai-dev-sandbox.up.railway.app/chat" \
  -H "Content-Type: application/json" \
  -H "X-Session-ID: uat-test" \
  -d '{"message": "What is 2+2?", "session_context": {"user_id": "uat-user"}}'
```

**Response:**
```
data: {"type": "error", "code": "STREAM_ERROR", "message": "stream_text() can only be used with text responses"}
```

---

## Root Cause

**File:** `python-service/agent.py`

The agent is defined with `output_type=ChatResponse` for structured output. But then `chat_streaming()` calls `stream_text()` which only works for plain text responses, not structured output.

```python
# This combination doesn't work:
agent = Agent(..., output_type=ChatResponse)  # Structured output
async with agent.run_stream(...) as stream:
    async for text in stream.stream_text():  # Text streaming - INCOMPATIBLE
```

---

## Fix Options

### Option A: Remove structured output for streaming (RECOMMENDED)

Keep streaming, remove `output_type`. Stream raw text and construct response manually.

### Option B: Use sync mode with structured output

Use `agent.run()` instead of `run_stream()`. Get structured output but no streaming.

### Option C: Stream structured output differently

Check pydantic-ai docs for `stream()` method that might work with structured output.

---

## Pydantic AI Documentation

DEV must research: https://ai.pydantic.dev/

Look for:
- How to stream with structured output
- Whether `stream()` vs `stream_text()` matters
- Examples of streaming + `output_type`

---

**Filed by:** Orchestrator
**Assigned to:** DEV
