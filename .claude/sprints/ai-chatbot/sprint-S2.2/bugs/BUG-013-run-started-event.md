# BUG-013: "First event must be 'RUN_STARTED'" Error

**Reported:** 2026-01-23
**Sprint:** S2.2
**Phase:** 4
**Severity:** CRITICAL
**Status:** FIXED (commit 6a04a2d)

---

## Summary

After BUG-012 fix, SteerTrue governance succeeds (6 blocks returned), but response fails to stream. Error: "First event must be 'RUN_STARTED'".

---

## Evidence

### Railway Logs (Successful SteerTrue call, then error)

```
[SteerTrueAgent] handleRun called with 1 messages
[SteerTrueAgent] Latest user message: What is 2+2?...
[SteerTrueAgent] About to call SteerTrue with this.sessionId: 55930f96-c751-4ada-8a38-07f49faa3c23
[SteerTrueAgent] callSteerTrue called with sessionId: 55930f96-c751-4ada-8a38-07f49faa3c23
[SteerTrueAgent] STEERTRUE_API_URL: https://steertrue-sandbox-dev-sandbox.up.railway.app
[SteerTrueAgent] Response received, blocks_injected: ['L1/framework_container', ...]
[SteerTrueAgent] SUCCESS - returning 6 blocks
[SteerTrueAgent] Got system prompt with 6 blocks
Agent execution failed: Error: First event must be 'RUN_STARTED'
```

### Progress

| Component | Status |
|-----------|--------|
| Agent instantiation | ✅ Works |
| Agent clone() | ✅ Works (BUG-012 fixed) |
| handleRun() called | ✅ Works |
| sessionId populated | ✅ Works |
| SteerTrue API call | ✅ Works (200, 6 blocks) |
| RUN_STARTED event | ❌ Not received by CopilotKit |
| Response streaming | ❌ Fails |

---

## Root Cause Hypothesis

The handleRun method emits RUN_STARTED, but CopilotKit isn't receiving it. Possible causes:

1. **Event emitted too late** - Something executes before RUN_STARTED
2. **Wrong event type** - EventType.RUN_STARTED may not match what CopilotKit expects
3. **Observable timing** - The subject may not be subscribed when RUN_STARTED is emitted
4. **Clone affects Observable** - The cloned agent's Observable may have different behavior

---

## MANDATORY: Review copilot_kit.md

DEV MUST read `.claude/docs/copilot_kit.md` for correct AG-UI event protocol.

Check:
- Exact format of RUN_STARTED event
- Required fields
- When to emit relative to Observable creation
- AG-UI protocol specification

---

## Current Code

```typescript
// In handleRun (should emit RUN_STARTED first)
const runStartedEvent: RunStartedEvent = {
  type: EventType.RUN_STARTED,
  runId: runIdToUse,
  threadId: this.threadId,
  timestamp: Date.now(),
};
subject.next(runStartedEvent);
```

---

## Verification

After fix:
1. No "First event must be 'RUN_STARTED'" error
2. AI response streams to chat UI
3. Response includes SteerTrue governance header
4. Full conversation works end-to-end

---

**Filed by:** Orchestrator
**Assigned to:** DEV
**Review Required:** copilot_kit.md (AG-UI event protocol)
