# Bug Report: S2.2 Deployment Failure (Dependency Conflict)

**ID:** BUG-S2.2-001
**Severity:** Critical (blocked all UAT)
**Status:** FIXED (pending verification)
**Date Found:** 2026-01-22
**Date Fixed:** 2026-01-22
**Found By:** Human UAT review of Railway logs

---

## Summary

Railway deployment failed since Phase 4 due to npm peer dependency conflict between `@anthropic-ai/sdk@0.71.2` and `@copilotkit/runtime@1.51.2` which requires `@anthropic-ai/sdk@^0.57.0`.

---

## Root Cause

| Package | Version Installed | Version Required |
|---------|-------------------|------------------|
| @anthropic-ai/sdk | ^0.71.2 | ^0.57.0 (by CopilotKit) |

**Why it failed:**
- `^0.57.0` in semver 0.x means `>=0.57.0 <0.58.0`
- `0.71.2` is outside this range
- Railway `npm ci` enforces strict peer deps
- Local `npm install` gave warnings but succeeded (cached node_modules)

---

## Timeline

| Commit | Phase | Packages | Deployment |
|--------|-------|----------|------------|
| e28c7ea | 3A | SteerTrue integration | Unknown |
| 95be9c5 | 4 | CopilotKit + Anthropic SDK | **FAILED** |
| cbda29e | 5 | Persistence | **FAILED** |
| 70e0b5b | Fix | SDK downgrade | Pending |

---

## Process Failures

### 1. No Deployment Verification Between Phases
- DEV reported "build passes" based on local `npm run build`
- PM approved based on code review only
- No one verified Railway build succeeded

### 2. Local vs CI Behavior Difference
- Local npm issues warnings but succeeds
- Railway npm ci fails on same dependencies
- Cached node_modules masked the problem locally

### 3. Subagent Governance Gap
- DEV/PM agents approved without L2/proof_enforcement catching missing deployment proof
- Subagent governance depends on prompt triggers (may not fire)
- Blocks decay over session

---

## Fix Applied

```json
// package.json
"@anthropic-ai/sdk": "^0.57.0"  // Changed from ^0.71.2
```

Commit: 70e0b5b

---

## Verification Steps

1. `npm ls @anthropic-ai/sdk` shows 0.57.0 deduped
2. `npm run build` passes with /chat route present
3. Railway deployment succeeds (pending)
4. UAT passes (pending)

---

## Prevention

| Gap | Mitigation |
|-----|------------|
| No deployment verification | Add `railway up && curl health` to phase checklist |
| Local/CI behavior difference | Run `npm ci` locally before approving |
| Subagent governance | Ensure L2/proof_enforcement triggers on approval prompts |

---

## Related

- LESSONS_LEARNED.md (updated)
- UAT_TESTS.md (blocked, pending re-run)
