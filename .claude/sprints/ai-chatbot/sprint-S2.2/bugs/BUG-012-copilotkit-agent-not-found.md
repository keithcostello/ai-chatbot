# BUG-012: CopilotKit "Agent default not found"

**Reported:** 2026-01-23
**Sprint:** S2.2
**Phase:** 4
**Severity:** CRITICAL (Architecture)
**Status:** FIXED (2026-01-23)
**Commit:** 4ccbb6f

---

## Summary

CopilotKit 1.51.2 is not routing to the custom SteerTrueAgent. Browser console shows "Agent default not found" error. The agent's `run()` method is never called.

---

## Evidence

### Browser Console

```
[warning] Agent default not found
[error] Agent execution failed: Error: HTTP 500
```

### Railway Logs

```
[CopilotKit] Request received, user: 575af5a1-...
[CopilotKit] Using SteerTrueAgent (BUG-009 fix) with governance injection
[SteerTrueAgent] Initialized with model: claude-sonnet-4-20250514 sessionId: 575af5a1-...
```

**MISSING (never logged):**
- `[SteerTrueAgent] handleRun called`
- `[SteerTrueAgent] callSteerTrue called`
- Any SteerTrue API call

### Conclusion

Agent is instantiated but `run()` method is NEVER invoked by CopilotKit.

---

## Root Cause (FOUND)

**Missing `clone()` method in SteerTrueAgent.**

CopilotKit clones agents before running them in `handleRunAgent()`:
```javascript
// @copilotkitnext/runtime handleRunAgent
const registeredAgent = agents[agentId];
const agent = registeredAgent.clone();  // <-- CLONES THE AGENT
```

The base `AbstractAgent.clone()` only copies standard properties:
- agentId, description, threadId, messages, state, debug, subscribers, middlewares

It does NOT copy custom properties:
- `anthropic` (Anthropic SDK client)
- `model` (Claude model identifier)
- `sessionId` (SteerTrue session ID)

**Result:** The cloned agent has undefined `anthropic` client and `sessionId`, causing runtime errors before `run()` is invoked. The error cascades, appearing as "Agent default not found" on the client side.

---

## MANDATORY: Review copilot_kit.md

DEV MUST read `.claude/docs/copilot_kit.md` THOROUGHLY before attempting any fix.

Check for:
- Correct way to register custom agents with CopilotRuntime
- Whether AbstractAgent from @ag-ui/client is the right base class
- CoAgents pattern vs custom agents
- How CopilotKit resolves agent names

---

## Options to Investigate

### Option A: Fix agent registration pattern

Maybe agents need different configuration or naming.

### Option B: Use CoAgents/LangGraph pattern

copilot_kit.md may describe a different pattern for custom agents.

### Option C: Abandon custom agent approach

Use CopilotKit's built-in adapters + middleware approach.

### Option D: Use Python service as CoAgent

Route to Python service (which already works with SteerTrue) as a CoAgent.

---

## Critical Questions

1. What is the correct way to register custom agents in CopilotKit 1.51.2?
2. Does AbstractAgent from @ag-ui/client work with CopilotRuntime?
3. Is there a different pattern for custom LLM routing?

---

## Verification

After fix:
1. No "Agent default not found" error
2. Railway logs show `handleRun called`
3. SteerTrue API called (200 response)
4. AI response appears in chat

---

## Fix Applied

**File:** `lib/steertrue-agent.ts`

**Change:** Added `clone()` method override:

```typescript
clone(): SteerTrueAgent {
  const cloned = new SteerTrueAgent({
    agentId: this.agentId,
    description: this.description,
    threadId: this.threadId,
    initialMessages: [...this.messages],
    initialState: { ...this.state },
    debug: this.debug,
    model: this.model,         // Custom property
    sessionId: this.sessionId, // Custom property
  });
  // Copy middlewares
  cloned['middlewares'] = [...this['middlewares']];
  return cloned;
}
```

**Why this works:** The new `clone()` method properly instantiates a new `SteerTrueAgent` with all custom properties, ensuring the cloned agent has a working Anthropic client and session ID.

---

## Lessons Learned

1. **Read CopilotKit source code** - The agent clone behavior is not documented but is visible in `@copilotkitnext/runtime`
2. **Custom AbstractAgent subclasses MUST override clone()** - This is a hidden requirement
3. **Client-side errors may mask server-side root causes** - "Agent not found" was misleading

---

**Filed by:** Orchestrator
**Fixed by:** DEV
**Review Required:** copilot_kit.md (MANDATORY - READ ENTIRE DOCUMENT)
