# BUG-002 Routing: Python Service Errors

**Routed by:** PM Agent
**Date:** 2026-01-22
**Status:** ROUTING TO DEV

---

## PM Verification Summary

I have independently verified BOTH bugs exist by reading the source code.

---

## BUG 1: Missing `user_id` in SteerTrue Request

### Location
- **File:** `python-service/steertrue.py`
- **Lines:** 155-160

### Current Code (BROKEN)
```python
response = await client.post(
    f"{self.base_url}/api/v1/analyze",
    json={
        "message": message,
        "session_id": session_id
    }
)
```

### Problem
SteerTrue `/api/v1/analyze` endpoint requires `user_id` in the request body.
Error from logs: `{"detail":[{"type":"missing","loc":["body","user_id"],"msg":"Field required"...}]}`

### Fix Required

**Step 1:** Modify `analyze()` method signature to accept `user_id` parameter:

```python
async def analyze(
    self,
    message: str,
    session_id: str,
    user_id: str  # ADD THIS PARAMETER
) -> tuple[str, list[str]]:
```

**Step 2:** Add `user_id` to the JSON body:

```python
response = await client.post(
    f"{self.base_url}/api/v1/analyze",
    json={
        "message": message,
        "session_id": session_id,
        "user_id": user_id  # ADD THIS LINE
    }
)
```

**Step 3:** Update callers in `main.py` to pass `user_id` from request context.

There are TWO places that call `steertrue_client.analyze()`:

**Location A:** `generate_sse_stream()` function (lines 139-142)
```python
# Current:
system_prompt, blocks_injected = await steertrue_client.analyze(
    message=message,
    session_id=session_id
)

# Fix: Add user_id parameter (needs to be passed to generate_sse_stream)
```

**Location B:** `chat_sync()` endpoint (lines 248-251)
```python
# Current:
system_prompt, blocks_injected = await steertrue_client.analyze(
    message=request.message,
    session_id=session_id
)

# Fix: Add user_id from request.session_context
```

**Step 4:** Modify `generate_sse_stream()` signature to accept `user_id`:
```python
async def generate_sse_stream(
    message: str,
    session_id: str,
    user_id: str  # ADD THIS
) -> AsyncGenerator[str, None]:
```

**Step 5:** Update `chat()` endpoint to pass `user_id` to `generate_sse_stream()`:
```python
# Extract user_id from request
user_id = "anonymous"
if request.session_context:
    user_id = request.session_context.get("user_id", "anonymous")

return StreamingResponse(
    generate_sse_stream(
        message=request.message,
        session_id=session_id,
        user_id=user_id  # ADD THIS
    ),
    ...
)
```

---

## BUG 2: Pydantic AI `result_type` Parameter Not Valid

### Location
- **File:** `python-service/agent.py`
- **Lines:** 35-39

### Current Code (BROKEN)
```python
return Agent(
    f"anthropic:{ANTHROPIC_MODEL}",
    result_type=ChatResponse,  # ERROR: Unknown keyword argument
    system_prompt=system_prompt or "You are a helpful AI assistant.",
)
```

### Problem
Error from logs: `Unknown keyword arguments: result_type`

Pydantic AI v1.46.0 does not use `result_type` as a constructor parameter.

### Fix Required - RESEARCH FIRST

**CRITICAL:** DEV MUST consult pydantic-ai documentation BEFORE implementing fix.

**Documentation:** https://ai.pydantic.dev/agents/

**Likely Fix Options (DEV must verify):**

**Option A:** Use generic type annotation
```python
from pydantic_ai import Agent

def create_chat_agent(system_prompt: str = "") -> Agent[None, ChatResponse]:
    return Agent[None, ChatResponse](
        f"anthropic:{ANTHROPIC_MODEL}",
        system_prompt=system_prompt or "You are a helpful AI assistant.",
    )
```

**Option B:** Use `output_type` parameter (if available in v1.46.0)
```python
return Agent(
    f"anthropic:{ANTHROPIC_MODEL}",
    output_type=ChatResponse,  # MAYBE - verify in docs
    system_prompt=system_prompt or "You are a helpful AI assistant.",
)
```

**Option C:** Structured output via different pattern
Check docs for: https://ai.pydantic.dev/output/

**DEV MUST:**
1. Read pydantic-ai docs for v1.46.0
2. Find correct structured output pattern
3. Test locally before deploying
4. Document which option was used

---

## Acceptance Criteria

DEV must provide evidence showing:

1. **Railway logs** with NO errors:
   - No `SteerTrue returned 422` errors
   - No `Unknown keyword arguments: result_type` errors

2. **Successful chat response** with real SteerTrue blocks:
   - `blocks_injected` contains actual blocks (not `FALLBACK/*`)
   - Response content is meaningful AI response

3. **curl test** showing working endpoint:
```bash
curl -s -X POST "https://steertrue-pydantic-ai-dev-sandbox.up.railway.app/chat" \
  -H "Content-Type: application/json" \
  -H "X-Session-ID: test-session" \
  -d '{"message": "Hello", "session_context": {"user_id": "test-user"}}'
```

---

## WARNING: No Fabrication

- DEV MUST paste ACTUAL Railway logs
- DEV MUST paste ACTUAL curl response JSON
- PM will independently verify by running same tests
- If PM's tests fail but DEV claimed success = REJECTION + TERMINATION

---

## Files to Modify

| File | Changes |
|------|---------|
| `python-service/steertrue.py` | Add `user_id` parameter and include in request body |
| `python-service/agent.py` | Fix structured output pattern per pydantic-ai docs |
| `python-service/main.py` | Pass `user_id` to `steertrue.analyze()` call |

---

## Next Action

**RELAY TO DEV:** "BUG-002 ROUTED - Fix steertrue.py (add user_id) and agent.py (correct pydantic-ai structured output pattern). Research pydantic-ai docs before fixing agent.py. Provide Railway log evidence + curl response in checkpoint."

---
