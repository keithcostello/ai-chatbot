# Bug Report: BUG-001

**Sprint:** S2.2-R1
**Phase:** 2 - Frontend Connection
**Reported:** 2026-01-23
**Reporter:** Orchestrator (after architect consultation)
**Status:** OPEN

---

## Summary

CopilotKit frontend cannot communicate with Pydantic AI backend. Proxy returns 422 (Unprocessable Entity).

---

## Evidence

### Symptom
```bash
curl -s -X POST https://steertrue-chat-dev-sandbox.up.railway.app/api/copilotkit \
  -H "Content-Type: application/json" -d '{"message":"hello"}'
```
**Response:** `{"error":"Upstream error: 422"}`

### Environment
- Frontend: steertrue-chat-dev-sandbox.up.railway.app (HTTPS)
- Python Agent: steertrue-pydantic-ai-dev-sandbox.up.railway.app (healthy)
- Chat page renders correctly with CopilotKit UI

---

## Root Cause Analysis (from architect consultation)

### Consulted
- `pydantic_architect.md` - AG-UI protocol format
- `copilot_kit.md` - CopilotKit integration pattern
- Official docs: https://ai.pydantic.dev/ui/ag-ui/
- Official template: https://github.com/CopilotKit/with-pydantic-ai

### Finding

**Current Implementation (WRONG):**
```typescript
// Raw fetch proxy - just forwards bytes
const response = await fetch(`${PYTHON_AGENT_URL}/copilotkit/`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body,
});
```

**Required Implementation (from official template):**
```typescript
import { CopilotRuntime, ExperimentalEmptyAdapter, copilotRuntimeNextJSAppRouterEndpoint } from "@copilotkit/runtime";
import { HttpAgent } from "@ag-ui/client";

const runtime = new CopilotRuntime({
  agents: {
    steertrue_agent: new HttpAgent({ url: `${PYTHON_AGENT_URL}/` }),
  },
});

export const POST = async (req: NextRequest) => {
  const { handleRequest } = copilotRuntimeNextJSAppRouterEndpoint({
    runtime,
    serviceAdapter: new ExperimentalEmptyAdapter(),
    endpoint: "/api/copilotkit",
  });
  return handleRequest(req);
};
```

### Missing Packages
- `@copilotkit/runtime`
- `@ag-ui/client`

### Why 422?
AG-UI protocol expects `RunAgentInput` format:
```json
{
  "thread_id": "...",
  "run_id": "...",
  "state": {},
  "messages": [{"id": "...", "role": "user", "content": "..."}],
  "tools": [],
  "context": [],
  "forwarded_props": {}
}
```

The raw proxy sends whatever CopilotKit sends, but without `CopilotRuntime` + `HttpAgent`, the AG-UI protocol is not properly handled.

---

## Fix Required

1. Install packages: `npm install @copilotkit/runtime @ag-ui/client`
2. Rewrite `app/api/copilotkit/route.ts` with official pattern
3. Update `app/chat/page.tsx` to use agent name matching runtime config
4. Deploy and verify

---

## Severity

**HIGH** - Blocks Phase 2 completion. Chat cannot function.

---

## Attachments

- TROUBLESHOOTING_LOG.md (full troubleshooting history)
- 8 commits attempted to fix (mixed content → proxy → still 422)
