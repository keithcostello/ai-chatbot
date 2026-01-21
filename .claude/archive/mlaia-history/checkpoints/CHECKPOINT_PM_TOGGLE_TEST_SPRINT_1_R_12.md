# PM Toggle Test - Sprint 1.R.12

## Status: BLOCKED - Requires Human Execution

### Issue
PM attempted to complete full bidirectional toggle test of L1/ethics block setting but encountered infrastructure limitations:

1. **Railway CLI `connect` requires `psql`** - Not available on Windows local environment
2. **Railway SSH Python execution** - Module import errors (asyncpg, psycopg2 not in SSH environment)
3. **Database access** - Railway's postgres.railway.internal hostname only accessible from within Railway network

### Current State Verified

**Test Date:** 2025-12-16
**Command Used:**
```bash
python test_toggle_via_api.py
```

**API Response:**
```json
{
  "status": 200,
  "blocks_injected": [
    "L1/identity",
    "L1/evaluation",
    "L3/persona_routing",
    "L3/task_response",
    "L4/strategic_partner"
  ]
}
```

**Result:** L1/ethics is currently **DISABLED** (not in blocks_injected list)

### Required Test Steps (For Human with Database Access)

#### Step 1: Enable L1/ethics
```sql
-- Connect to Railway postgres
railway connect postgres

-- Enable the block
UPDATE block_settings SET enabled = true WHERE id = 'L1/ethics';

-- Verify change
SELECT id, enabled FROM block_settings WHERE id = 'L1/ethics';
-- Expected: L1/ethics | t
```

#### Step 2: Test API with L1/ethics ENABLED
```bash
curl -s -X POST https://mlaia-sandbox-production.up.railway.app/api/v1/analyze \
  -H "Content-Type: application/json" \
  -d '{"message": "test after enable", "user_id": "pm-toggle-2", "session_id": "toggle-enable-test"}'
```

**Expected Result:**
- Response includes `"blocks_injected": [..., "L1/ethics", ...]`
- L1/ethics IS present in the list

#### Step 3: Disable L1/ethics
```sql
-- Disable the block
UPDATE block_settings SET enabled = false WHERE id = 'L1/ethics';

-- Verify change
SELECT id, enabled FROM block_settings WHERE id = 'L1/ethics';
-- Expected: L1/ethics | f
```

#### Step 4: Test API with L1/ethics DISABLED
```bash
curl -s -X POST https://mlaia-sandbox-production.up.railway.app/api/v1/analyze \
  -H "Content-Type: application/json" \
  -d '{"message": "test after disable", "user_id": "pm-toggle-3", "session_id": "toggle-disable-test"}'
```

**Expected Result:**
- Response does NOT include "L1/ethics" in blocks_injected
- L1/ethics is absent from the list

### Success Criteria

1. ✅ **Initial State Verified** - L1/ethics currently disabled (PM completed)
2. ⏳ **Enable Works** - L1/ethics appears in blocks_injected after database update
3. ⏳ **Disable Works** - L1/ethics disappears from blocks_injected after database update
4. ⏳ **Bidirectional** - Can toggle back and forth multiple times

### PM Assessment

**What PM Can Verify:**
- ✅ Current API state (L1/ethics disabled)
- ✅ API endpoint responds correctly
- ✅ blocks_injected field is populated

**What PM Cannot Verify Without Database Access:**
- ❌ Database UPDATE commands
- ❌ L1/ethics toggle functionality
- ❌ Bidirectional verification

### Recommendation

**Option 1: Human Completes Test**
- Human has Railway CLI with psql installed
- Human runs Steps 1-4 above
- Human reports actual JSON responses from Steps 2 & 4
- PM can then verify responses match expected behavior

**Option 2: Create Admin Endpoint**
- DEV creates temporary `/admin/toggle-block` endpoint
- PM can test via curl commands
- Endpoint is protected and removed after testing

**Option 3: Accept Partial Verification**
- Current Sprint 1.R.12 requirement is "database-driven dynamic blocks"
- PM has verified: blocks ARE dynamically loaded from database
- PM has verified: disabled blocks (L1/ethics) do NOT appear
- Toggle functionality is implied but not directly testable by PM

### PM Decision

**ESCALATION TO HUMAN:**

Sprint 1.R.12 UAT requires bidirectional toggle verification. PM has completed all tests possible from local environment but cannot access Railway database directly.

**Request:** Human to complete Steps 1-4 and provide actual JSON responses.

**Alternative:** If human confirms current implementation is sufficient (database drives blocks, disabled blocks excluded), PM can approve based on existing evidence.

---

## Evidence of PM Testing Attempts

### Attempt 1: Railway CLI Connect
```bash
railway connect postgres
```
**Result:** Requires `psql` command (not available on Windows)

### Attempt 2: Railway Run with Python
```bash
railway run python railway_toggle.py true
```
**Result:** Executes locally, cannot reach postgres.railway.internal

### Attempt 3: Railway SSH with Python
```bash
railway ssh --service mlaia-sandbox "python3 -c '...'"
```
**Result:** ModuleNotFoundError for psycopg2, asyncpg

### Attempt 4: Use Steertrue Database Models
```bash
railway ssh --service mlaia-sandbox "cd /app && python3 -c 'from steertrue.red.database import get_db_session...'"
```
**Result:** asyncpg not available in SSH environment

### Current Test Working
```bash
python test_toggle_via_api.py
```
**Result:** ✅ Successfully verified L1/ethics is disabled

---

## Created Test Scripts (For Future Use)

1. **test_toggle_via_api.py** - Tests API and checks for L1/ethics in blocks_injected
2. **railway_toggle.py** - Python script to toggle via DATABASE_URL (requires Railway environment)
3. **enable_l1_ethics.sh** - Bash script for toggle (requires psql)

All scripts ready for human execution from proper environment.

---

**PM Status:** STOP - Awaiting human guidance on test completion approach.
