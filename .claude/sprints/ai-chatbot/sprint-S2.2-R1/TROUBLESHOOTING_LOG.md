# Troubleshooting Log: Railway Deployment S2.2-R1

**Created:** 2026-01-23
**Issue:** steertrue-pydantic-ai build failing / stuck

---

## Environment (from images)

### Railway Services (railway_environment.png)
| Service | Status | Notes |
|---------|--------|-------|
| steertrue-chat-frontend | Online | Connected to steertrue-chat-dev-sandbox |
| steertrue-pydantic-ai | Online ⚠️ 1 | **HAS WARNING** - issue exists |
| steertrue-sandbox | Online | Backend service |
| Postgres-x1A- | Online | Has volume |
| Postgres-LbgQ | Online | Has volume |

### steertrue-pydantic-ai Config (steertrue-pydantic-ai.png)
| Setting | Value |
|---------|-------|
| Source Repo | keithcostello/ai-chatbot |
| Root Directory | /python-service |
| Branch | dev-sprint-S2.2-R1 |
| Wait for CI | OFF |

---

## What We Know

1. **Build logs only show:** `scheduling build on Metal builder "builder-hdvmmv"` - then nothing
2. **Warning icon visible** in Railway dashboard on steertrue-pydantic-ai
3. **Config appears correct:** repo, root directory, branch all set properly
4. **/health returns OLD code:** version 1.0.0 (should be 0.1.0 with model field)

---

## Actions Taken

| # | Action | Result | Timestamp |
|---|--------|--------|-----------|
| 1 | Linked CLI to steertrue-pydantic-ai | Success | Earlier |
| 2 | Ran `railway up --detach` | Build stuck at scheduling | Earlier |
| 3 | Checked build logs | Only shows "scheduling build" | Earlier |
| 4 | Viewed images | Found warning icon on service | Now |
| 5 | Verified git branch | python-service/ exists with all files | Now |
| 6 | Verified remote push | origin/dev-sprint-S2.2-R1 has commits | Now |
| 7 | Read build logs JSON | **CRITICAL: No build steps, only healthcheck** | Now |

---

## CRITICAL FINDING

**Build logs show:**
```
scheduling build on Metal builder "builder-hdvmmv"
[NOTHING - NO BUILD STEPS]
Starting Healthcheck
Healthcheck succeeded!
```

**Expected flow should be:**
```
scheduling build
Detected Python
pip install
uvicorn starting
Healthcheck
```

**Conclusion:** Railway is NOT building new code. It's reusing old cached deployment.

---

## Files Verified

| File | Status | Contents |
|------|--------|----------|
| python-service/railway.toml | ✓ Exists | nixpacks builder, uvicorn start |
| python-service/pyproject.toml | ✓ Exists | fastapi, pydantic-ai, copilotkit deps |
| python-service/agent/main.py | ✓ Exists | FastAPI app with /health, /copilotkit |
| Git branch | ✓ Pushed | All 5 commits on origin |

---

## Root Cause Hypothesis

Railway's build cache is corrupted or stuck. The service is:
1. Detecting a "deploy" event
2. Skipping actual build (using stale cache)
3. Running healthcheck against OLD code
4. Reporting success (because old /health works)

---

## Resolution: Service Recreated

Service deleted and recreated. Fresh build now shows REAL error.

---

## ACTUAL ERROR FOUND

```
ValueError: Unable to determine which files to ship inside the wheel
The most likely cause is that there is no directory that matches the name of your project (steertrue_chat_agent).
```

**Root Cause:** Hatchling build backend expects directory matching project name `steertrue_chat_agent`, but code is in `agent/` directory.

**Fix Required:** Add `[tool.hatch.build.targets.wheel]` to pyproject.toml specifying `packages = ["agent"]`

---

## Status

- [x] Identified stale build cache issue
- [x] Deleted and recreated service
- [x] Got real build logs
- [x] Found actual error (hatchling package discovery)
- [x] Fix pyproject.toml - added `[tool.hatch.build.targets.wheel]` with `packages = ["agent"]`
- [x] Push and redeploy - commit `4f7ca24` pushed
- [x] **BUILD SUCCEEDED**
- [x] **HEALTHCHECK FAILED** - missing ANTHROPIC_API_KEY
- [x] Added environment variables:
  - `ANTHROPIC_API_KEY` - for LLM access
  - `STEERTRUE_API_URL` - for SteerTrue backend integration
- [x] Fixed CopilotKit API change: `LangGraphAgent` → `LangGraphAGUIAgent` (WRONG)
- [x] Consulted copilot_kit.md architect - found correct pattern
- [x] Implemented native Pydantic AI AG-UI pattern (commit ef0f1e4)
- [x] Verify /health returns new code ✅
- [x] Verify /copilotkit endpoint exists ✅

---

## RESOLVED - Commit ef0f1e4

**Verification Evidence:**
```
GET /health → {"status":"healthy","model":"anthropic:claude-sonnet-4-20250514","version":"0.1.0"}
GET /       → {"service":"steertrue-chat-agent","endpoints":["/health","/copilotkit"]}
```

**Final Issue Count:** 4 errors resolved
**Total Time:** ~2 hours troubleshooting

---

## Workflow & Expectations

**Goal:** Pydantic AI + CopilotKit integration on Railway

**Expected Stack:**
1. Pydantic AI Agent → creates chat agent with LLM
2. `agent.to_ag_ui()` → converts to AG-UI protocol
3. CopilotKit SDK → wraps agent for /copilotkit endpoint
4. FastAPI → serves endpoints
5. Railway → hosts service

**Success Criteria:**
- `/health` returns `{"status": "healthy", "model": "...", "version": "0.1.0"}`
- `/copilotkit` endpoint exists and accepts POST

---

## Issue Timeline

| # | Error | Fix | Status |
|---|-------|-----|--------|
| 1 | Hatchling package discovery | Added `[tool.hatch.build.targets.wheel]` | ✅ |
| 2 | Missing ANTHROPIC_API_KEY | Added env var to Railway | ✅ |
| 3 | `LangGraphAgent` deprecated | Wrong fix - guessed without consulting architect | ❌ |
| 4 | `LangGraphAGUIAgent` not found | Consulted copilot_kit.md → native AG-UI pattern | ✅ |

---

## Lessons Learned

### L1: Consult Architect BEFORE Fixing Library Errors
**What happened:** Error said "use LangGraphAGUIAgent" → I changed import without verifying class exists.
**Correct approach:** Consult copilot_kit.md or pydantic_architect.md FIRST to get verified pattern.
**Rule:** Sprint directives exist for a reason - follow them.

### L2: CopilotKitSDK vs Native AG-UI
**What happened:** Assumed CopilotKitSDK wrapper was required for all agents.
**Reality:** Pydantic AI has native AG-UI support. CopilotKitSDK is only for LangGraph.
**Pattern:**
- Pydantic AI → `agent.to_ag_ui()` directly
- LangGraph → `CopilotKitSDK` + `LangGraphAGUIAgent`

### L3: Railway Build Cache Can Be Stale
**What happened:** Builds showed "scheduling" then "healthcheck" with no actual build steps.
**Fix:** Delete and recreate service to clear stale cache.
**Signal:** If build logs skip pip install, cache is corrupted.

### L4: Troubleshooting Document is Critical
**What happened:** Without structured tracking, we repeated steps and lost context.
**Fix:** Create TROUBLESHOOTING_LOG.md with workflow, expectations, and step-by-step tracking.

---

## Current Step: Fix #3 & #4 - Use Native AG-UI Pattern

**Error #3:**
```
ValueError: LangGraphAgent should be instantiated using LangGraphAGUIAgent
```

**Error #4:**
```
ImportError: cannot import name 'LangGraphAGUIAgent' from 'copilotkit.langgraph'
```

**Root Cause (from copilot_kit.md consultation):**
CopilotKitSDK wrapper is for LangGraph, NOT Pydantic AI. Pydantic AI uses native `to_ag_ui()`.

**Fix Applied:**
- Removed CopilotKitSDK wrapper entirely
- Using Pydantic AI native AG-UI: `app.mount("/copilotkit", chat_agent.to_ag_ui())`
- Simplified imports (no copilotkit SDK imports needed)

**Next Action:** Push and verify deployment
