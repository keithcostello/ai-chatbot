# Bug Report: BUG-003

**Sprint:** S2.2-R1
**Phase:** 2 - Frontend Connection
**Reported:** 2026-01-23
**Reporter:** Human UAT Executor
**Status:** OPEN
**Severity:** HIGH (Blocking)

---

## Summary

CopilotKit runtime makes internal callback to `localhost:8080/api/copilotkit` instead of Python agent URL, causing 405 errors.

---

## Evidence

### Symptom
- User sends message in CopilotChat UI
- Message appears in chat (user bubble)
- No AI response appears
- Alert element visible in DOM (error indicator)

### Railway Logs
```
Agent execution failed: Error: HTTP 405: Method Not Allowed
{ url: 'https://localhost:8080/api/copilotkit' } Invalid single-route payload
```

### Analysis
- The URL `localhost:8080/api/copilotkit` is NOT the Python agent
- Python agent is at `https://steertrue-pydantic-ai-dev-sandbox.up.railway.app/copilotkit`
- CopilotKit runtime appears to be making a loopback call to itself
- This suggests misconfiguration in CopilotRuntime or HttpAgent setup

---

## Context

BUG-002 fix changed HttpAgent URL from `/` to `/copilotkit`, but this error persists.

Current route.ts configuration:
```typescript
const runtime = new CopilotRuntime({
  agents: {
    steertrue_agent: new HttpAgent({ url: `${PYTHON_AGENT_URL}/copilotkit` }),
  },
});
```

---

## Questions for Architect

1. Why is CopilotKit calling `localhost:8080` instead of the configured HttpAgent URL?
2. Is there a missing configuration for the endpoint callback?
3. Does the route need to handle additional HTTP methods (GET, OPTIONS)?
4. Is there an issue with the `endpoint` parameter in `copilotRuntimeNextJSAppRouterEndpoint`?

---

## Requires

Consultation with `copilot_kit.md` architect before fix attempt.
