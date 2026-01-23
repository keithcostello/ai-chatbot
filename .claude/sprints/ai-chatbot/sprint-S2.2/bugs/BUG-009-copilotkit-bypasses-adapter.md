# BUG-009: CopilotKit Bypasses Custom Adapter process() Method

**Reported:** 2026-01-23
**Sprint:** S2.2
**Phase:** 4
**Severity:** CRITICAL (Architecture)
**Status:** FIXED

---

## Summary

CopilotKit 1.51.2 bypasses custom adapter `process()` methods entirely. The SteerTrueAnthropicAdapter is instantiated but its `process()` method is never called, so SteerTrue governance is never invoked.

---

## Evidence

### Railway Logs Analysis

```
[SteerTrueAdapter] Initialized with model: claude-sonnet-4-20250514 sessionId: 55930f96-...
```

**Missing logs that SHOULD appear:**
- `[SteerTrueAdapter] Processing request with...`
- `callSteerTrue called`
- `[SteerTrueAdapter] SUCCESS - returning X blocks`

The adapter constructor runs, but `process()` is never called.

### CopilotKit Internal Architecture

**File:** `node_modules/@copilotkit/runtime/src/lib/runtime/copilot-runtime.ts` (lines 383-384)

When `serviceAdapter` is provided:
1. CopilotKit's `handleServiceAdapter()` extracts only `provider` and `model`
2. Creates `BuiltInAgent` with model string `"anthropic/claude-sonnet-4-20250514"`
3. `BuiltInAgent.resolveModel()` creates its OWN Anthropic client via AI SDK
4. Custom adapter's `process()` is NEVER called

---

## Root Cause

CopilotKit 1.51.2 architecture change. The `BuiltInAgent` class handles LLM calls directly using the AI SDK, completely bypassing custom adapter logic.

**Code evidence:**
```typescript
// From copilot-runtime.ts lines 383-384
agentsList.default = new BuiltInAgent({
  model: `${serviceAdapter.provider}/${serviceAdapter.model}`,
});
```

---

## FIX IMPLEMENTED

### Approach: Custom AbstractAgent

Instead of using `serviceAdapter`, create a custom agent that extends `AbstractAgent` from `@ag-ui/client`. Pass it via the `agents` parameter to `CopilotRuntime`.

### Changes Made

1. **lib/steertrue-agent.ts** (NEW)
   - `SteerTrueAgent` class extending `AbstractAgent`
   - Implements `run()` method that:
     - Extracts user message from AG-UI message format
     - Calls SteerTrue `/api/v1/analyze` to get governance system prompt
     - Calls Anthropic with governance-injected system prompt
     - Streams response via AG-UI protocol events

2. **app/api/copilot/route.ts** (MODIFIED)
   - Removed `serviceAdapter` parameter
   - Added custom agent via `agents` parameter:
     ```typescript
     const runtime = new CopilotRuntime({
       agents: {
         default: steerTrueAgent,
       },
     });
     ```

### Commit

```
Commit: fbf41bc
Message: Fix BUG-009: CopilotKit bypasses custom adapter
```

---

## Verification

After fix, Railway logs should show:
1. `[SteerTrueAgent] handleRun called with X messages`
2. `[SteerTrueAgent] callSteerTrue called with sessionId: ...`
3. `[SteerTrueAgent] SUCCESS - returning X blocks`
4. `[SteerTrueAgent] Response complete, blocks_injected: [...]`

AI response should include `**[SteerTrue: ...]**` header.

---

## Options Evaluated

| Option | Description | Decision |
|--------|-------------|----------|
| A: Custom AbstractAgent | Extend AG-UI AbstractAgent, pass via `agents` param | **IMPLEMENTED** |
| B: remoteActions | Route to Python service | Complex, requires Python microservice |
| C: Middleware | Intercept before BuiltInAgent | Deprecated in CopilotKit |
| D: Don't use CopilotKit adapter | Keep CopilotKit UI only | Loses CopilotKit features |

Option A was chosen because:
- Works with CopilotKit's actual architecture
- Full control over LLM calls
- No external service dependency
- Maintains all CopilotKit features

---

**Filed by:** Orchestrator
**Fixed by:** DEV
**Commit SHA:** fbf41bc
