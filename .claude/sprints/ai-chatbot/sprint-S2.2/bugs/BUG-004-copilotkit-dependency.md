# BUG-004: CopilotKit Dependency Conflict

**Reported:** 2026-01-23
**Sprint:** S2.2
**Phase:** 4
**Severity:** BLOCKING
**Status:** OPEN

---

## Summary

Railway deployment fails due to peer dependency conflict between CopilotKit and Anthropic SDK.

---

## Evidence

### Railway Build Error

```
npm error While resolving: @copilotkit/runtime@1.51.2
npm error Found: @anthropic-ai/sdk@0.71.2
npm error Could not resolve dependency:
npm error peerOptional @anthropic-ai/sdk@"^0.57.0" from @copilotkit/runtime@1.51.2
```

---

## Root Cause

| Package | Required Version | Installed Version |
|---------|------------------|-------------------|
| @anthropic-ai/sdk | ^0.57.0 (by CopilotKit) | 0.71.2 |

CopilotKit v1.51.2 has a peer dependency on an older Anthropic SDK version.

---

## Fix Options

### Option A: Downgrade Anthropic SDK (RISKY)

Downgrade to @anthropic-ai/sdk@0.57.0. May break existing /api/chat functionality.

### Option B: Use --legacy-peer-deps (RECOMMENDED)

Add to package.json or railway.toml to ignore peer dependency conflict.

```json
// In package.json scripts or .npmrc
engine-strict=false
legacy-peer-deps=true
```

Or in railway.toml:
```toml
[build]
buildCommand = "npm ci --legacy-peer-deps"
```

### Option C: Remove CopilotKit, use custom UI

Keep existing chat UI, don't use CopilotKit. Loses CopilotKit features.

---

## Recommendation

Option B - Use `--legacy-peer-deps`. The peer dependency is marked as `peerOptional` which means CopilotKit can work without Anthropic SDK directly (since we're using the Python service for LLM calls anyway).

---

**Filed by:** Orchestrator
**Assigned to:** DEV
