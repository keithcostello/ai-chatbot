# Bug Report: BUG-002

**Sprint:** S2.2-R1
**Phase:** 2 - Frontend Connection
**Reported:** 2026-01-23
**Reporter:** Human UAT Executor
**Status:** OPEN
**Severity:** HIGH (Blocking)

---

## Summary

HttpAgent URL misconfiguration causes 405 Method Not Allowed error. Chat messages fail silently.

---

## Evidence

### Symptom
- User sends message in CopilotChat UI
- Message appears in chat (user bubble)
- No AI response appears
- Silent failure (no visible error to user)

### Logs

**Frontend logs:**
```
Agent execution failed: Error: HTTP 405: {"detail":"Method Not Allowed"}
```

**Python agent logs:**
```
"POST / HTTP/1.1" 405 Method Not Allowed
"POST /copilotkit HTTP/1.1" 307 Temporary Redirect
```

---

## Root Cause

**File:** `app/api/copilotkit/route.ts`
**Line:** 25

**Current (WRONG):**
```typescript
steertrue_agent: new HttpAgent({ url: `${PYTHON_AGENT_URL}/` }),
```

**Should be:**
```typescript
steertrue_agent: new HttpAgent({ url: `${PYTHON_AGENT_URL}/copilotkit` }),
```

**Explanation:**
- HttpAgent sends POST to the URL specified
- Currently sends to root "/" which returns 405 (no POST handler at root)
- Python agent's AG-UI endpoint is mounted at "/copilotkit"
- Need to include "/copilotkit" in the HttpAgent URL

---

## UAT Screenshots

| File | Description |
|------|-------------|
| evidence/chat-initial.png | Initial chat state - UI renders correctly |
| evidence/chat-after-send.png | After send - user message visible, no AI response |
| evidence/chat-no-response.png | After 15s wait - still no AI response |

---

## Fix Required

```diff
- steertrue_agent: new HttpAgent({ url: `${PYTHON_AGENT_URL}/` }),
+ steertrue_agent: new HttpAgent({ url: `${PYTHON_AGENT_URL}/copilotkit` }),
```

---

## Acceptance Criteria

1. HttpAgent URL includes "/copilotkit" path
2. Message sent from chat UI reaches Python agent's /copilotkit endpoint
3. AI response appears in chat after sending message
