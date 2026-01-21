---
name: verify
description: Test → deploy → verify cycle (Boris 2-3x quality + LESSONS_LEARNED)
---

# Verify Command

Automates Boris Cherny's 2-3x quality verification loop combined with LESSONS_LEARNED LESSON_1 deployment verification patterns.

## Purpose

Prevent M11 (Testing Against Stale Deployment), M14 (Missing RED Test), M21 (API-Only UAT), M46 (Testing Local vs Production).

## Workflow

### Step 1: Run Tests Locally

```bash
# Run specific test scope (prevent M39: budget limits)
pytest steertrue/tests/green/ steertrue/tests/red/ --ignore=*integration* -v
```

**Verification:**
- Paste actual test output (M3: no summaries)
- Specific counts: "X passed, 0 failed" (M15: specific criteria)
- If failed: capture FAILED output (M14: RED test before fix)

### Step 2: Deploy to Railway

Only if local tests passed:

```bash
railway up --detach
```

**Wait:** Deployment takes ~2-3 minutes

### Step 3: Verify Deployment

```bash
# Check deployment status
railway status

# Verify recent deploy
railway logs --tail 50
```

**Verification (M11, M46):**
- Logs show recent deployment timestamp
- Compare deployed commit SHA to local HEAD
- Service status shows "RUNNING"

### Step 4: Test Deployed Endpoint

```bash
# Health check
curl -i https://steertrue-sandbox-dev-sandbox.up.railway.app/api/v1/health

# Test actual feature
curl -i -X POST https://steertrue-sandbox-dev-sandbox.up.railway.app/api/v1/analyze \
  -H "Content-Type: application/json" \
  -d '{"message":"test","user_id":"dev","source":"verify-command"}'
```

**Verification (M21: actual user flow, not just API):**
- Show HTTP status line (use curl -i, prevent M53)
- Paste actual response body (M3: no summaries)
- Verify response matches expected fields
- If testing hook: test the hook, not just the API

### Step 5: Report Results

**Format:**
```
VERIFY COMPLETE

Local Tests: [X passed, 0 failed]
Deployment: [commit SHA] deployed at [timestamp]
Health Check: [HTTP status]
Feature Test: [HTTP status] - [key fields present]

RESULT: [PASS/FAIL]
```

## Budget Tracking (M39)

Track these limits per sprint:
- API_CALLS: [X]/15 max
- TEST_RETRIES: test_name=[Y]/2 max
- PYTEST_PER_PHASE: [Z]/3 max

If budget exceeded: STOP, escalate to PM

## Error Handling

**If tests fail:**
1. Capture FAILED output (M14)
2. Do NOT proceed to deploy
3. Fix issue
4. Re-run verify command

**If deployment fails:**
1. Check railway logs for error
2. Verify branch configuration
3. Check Railway dashboard

**If deployed endpoint fails:**
1. Compare deployed commit to local (M46)
2. Check Railway logs for runtime errors
3. Verify environment variables set

## Key Rules

From COMMON_MISTAKES.md:
- M3: Paste actual output, not summaries
- M11: Verify deployment before testing
- M14: Run test BEFORE fix (capture RED state)
- M15: Specific counts required
- M21: Test user flow, not just API
- M39: Respect budget limits
- M46: Test deployed, not local
- M53: Use curl -i to show HTTP status

From LESSONS_LEARNED.aipl LESSON_1:
- Deploy before UAT checkpoint
- E2E tests use HTTP requests
- Router field forwarding check if response empty

## Pattern Sources

- Boris Cherny verification loop (2-3x quality improvement)
- LESSONS_LEARNED.aipl LESSON_1 (lines 43-69)
- COMMON_MISTAKES.md (M11, M14, M15, M21, M39, M46, M53)
