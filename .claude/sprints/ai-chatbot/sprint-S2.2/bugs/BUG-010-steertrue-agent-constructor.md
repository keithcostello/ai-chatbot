# BUG-010: SteerTrueAgent Constructor TypeError

**Reported:** 2026-01-23
**Sprint:** S2.2
**Phase:** 4
**Severity:** CRITICAL
**Status:** OPEN

---

## Summary

SteerTrueAgent initializes but crashes with `TypeError: Cannot read properties of undefined (reading 'constructor')` in CopilotKit's `getCommonConfig` function.

---

## Evidence

### Railway Logs

```
[CopilotKit] Using SteerTrueAgent (BUG-009 fix) with governance injection
[SteerTrueAgent] Initialized with model: claude-sonnet-4-20250514 sessionId: 55930f96-...

⨯ TypeError: Cannot read properties of undefined (reading 'constructor')
    at getCommonConfig (.next/server/chunks/[root-of-the-server]__9e0a1d01._.js:319:1566)
    at copilotRuntimeNextJSAppRouterEndpoint (.next/server/chunks/[root-of-the-server]__9e0a1d01._.js:319:2492)
```

### UAT Result

- Chat page shows: "Application error: a client-side exception has occurred"
- No AI response generated
- SteerTrueAgent initializes but crashes before `handleRun` or `callSteerTrue` execute

---

## Root Cause

CopilotKit's `getCommonConfig` function expects certain properties on the agent that SteerTrueAgent doesn't have or returns undefined.

Looking at BUG-005 (same error), this was caused by `serviceAdapter` being undefined. Now with custom agent via `agents` parameter, something similar is happening.

**Hypothesis:** CopilotKit may still be trying to access `serviceAdapter` even when `agents` is provided, OR the custom agent is missing required properties that CopilotKit's telemetry system expects.

---

## MANDATORY: Review copilot_kit.md

DEV MUST read `.claude/docs/copilot_kit.md` for correct agent implementation.

Also check CopilotKit source:
- `node_modules/@copilotkit/runtime/src/lib/integrations/shared.ts` line 111
- `getCommonConfig` function requirements

---

## Fix Options

### Option A: Provide serviceAdapter alongside agents

CopilotKit may require serviceAdapter for telemetry even when using custom agents.

### Option B: Implement missing agent properties

Check what properties `getCommonConfig` expects and add them to SteerTrueAgent.

### Option C: Disable telemetry

If the error is in telemetry code, check if there's a way to disable it.

### Option D: Different CopilotKit approach

Consider using a completely different integration pattern.

---

## Verification

After fix:
1. Chat page loads without "Application error"
2. Railway logs show `[SteerTrueAgent] handleRun called`
3. Railway logs show `[SteerTrueAgent] SUCCESS`
4. AI response appears with SteerTrue governance header

---

**Filed by:** Orchestrator
**Assigned to:** DEV
**Review Required:** copilot_kit.md + CopilotKit source code
