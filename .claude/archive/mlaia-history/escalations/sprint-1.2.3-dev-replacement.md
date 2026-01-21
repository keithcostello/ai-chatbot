# Sprint 1.2.3 DEV Replacement - PM Decision

**Date:** 2025-12-11
**Sprint:** 1.2.3 - ContentLoader Protocol & Startup Validation
**Decision:** Previous DEV Terminated (Grade F) - New DEV Required
**Branch:** dev-sprint-1.2.3
**PM:** Microsprint PM (pm_role.md V2.2)

---

## EXECUTIVE SUMMARY

Sprint 1.2.3 UAT failed due to test design flaw (ISS-003). Previous DEV attempted fix but failed to understand root cause. Per framework protocols, DEV terminated with Grade F. New DEV handoff created with full context and focused rework requirements.

---

## UAT FAILURE DETAILS

**Endpoint:** `/uat/config-validator`
**Test Case:** TC-05 (Duplicate block_id detection)
**Error:** `duplicate key value violates unique constraint "block_settings_pkey"`
**Impact:** UAT cannot complete, blocks Sprint 1.2.3 completion

### Root Cause (ISS-003)

**Location:** `steertrue/main.py` lines 660-687

**The Problem:**
```python
# Line 667: First INSERT succeeds
INSERT INTO block_settings (id, layer, name)
VALUES ('test/duplicate', 'L2', 'Test Block Duplicate 1')

# Line 672: Second INSERT crashes with PK violation
INSERT INTO block_settings (id, layer, name)
VALUES ('test/duplicate', 'L2', 'Test Block Duplicate 2')  # ❌ FAILS HERE
```

**Why It's Wrong:**
- PostgreSQL PRIMARY KEY constraint on `id` column prevents duplicate INSERTs
- Error occurs at database level BEFORE ConfigValidator.validate() runs
- Test cannot verify validator's duplicate detection because database blocks the duplicate
- This is a fundamental test design flaw, not a validator bug

### Previous DEV Actions (FAILED)

**Attempt:** Added `DELETE FROM block_settings WHERE id = 'test/duplicate'` before INSERT (commit ce60d2e)

**Why It Failed:**
- DELETE only prevents re-run crashes (ISS-002) - already fixed
- Doesn't address the actual problem: second INSERT in same execution
- DEV didn't understand that PK constraint prevents testing duplicate detection via INSERT
- Applied superficial fix without understanding root cause

**Outcome:** Same error persists after "fix"

---

## PM ANALYSIS

### What's Actually Complete

**Phases 0-4: ALL COMPLETE AND CORRECT ✓**
- ContentLoader protocol implemented correctly
- ValidationResult model working properly
- ConfigValidator implementation follows all AC-11.x requirements
- All unit tests pass (15/15)
- Code quality is good

**Only Issue:** TC-05 UAT test design is flawed

### What Needs Fixing

**Single Issue:** Redesign TC-05 to properly test ConfigValidator's duplicate detection

**Possible Approaches:**
1. Test validator with pre-existing duplicate data in database
2. Mock _fetch_all_blocks() to return duplicate rows
3. Test different duplicate scenario (if PK duplicates aren't the requirement)

**Key Insight:** The validator implementation is correct. The test approach is wrong.

---

## PM ACTIONS TAKEN

### 1. DEV Termination

**Grade:** F
**Reason:** Failed to understand root cause after being given clear error message
**Justification:** Per pm_role.md V2.2, DEV must demonstrate understanding. Previous DEV applied superficial fix without analyzing actual problem.

### 2. Handoff Created

**File:** `.claude/handoffs/SPRINT_1.2.3_DEV_HANDOFF_V2.md`

**Contents:**
- Full UAT failure context
- Root cause analysis (why INSERT approach doesn't work)
- Previous DEV's mistakes documented
- All 15 required reading documents listed
- Branch handshake protocol requirements
- Clear success criteria for TC-05 redesign
- Working constraints and common traps

### 3. Issues Log Updated

**File:** `docs/issues/SPRINT_1.2.3_ISSUES.md`

**Changes:**
- ISS-001: Resolved (documentation error - branch was correct)
- ISS-002: Resolved (cleanup prevents re-run crashes)
- ISS-003: Status updated with clear resolution path
- DEV-001: Previous DEV termination documented
- PM-001: New DEV handoff action recorded

### 4. Git Actions

**Commit:** 35f5992
**Message:** "PM: Sprint 1.2.3 DEV replacement - Previous DEV terminated (Grade F)"
**Branch:** dev-sprint-1.2.3 (pushed to origin)

---

## NEW DEV REQUIREMENTS

### Mandatory Reading (15 Documents)

**Sprint Context:**
1. docs/design/mlaia-core/project/sprints/SPRINT_1.2.3_PROMPT.md
2. docs/issues/SPRINT_1.2.3_ISSUES.md
3. docs/design/mlaia-core/project/PHASE_1_PLAN.md (lines 355-371)

**Architecture:**
4. docs/architecture/ARCHITECTURE_DECISION_RULES.md
5. docs/architecture/BLUE_GREEN_RED_ARCHITECTURE_PRIMER.md
6. docs/design/mlaia-core/01_MLAIA_CORE.md

**Technical:**
7. steertrue/docs/API_REFERENCE.md
8. steertrue/docs/DATA_MODELS.md
9. steertrue/docs/INFRASTRUCTURE.md
10. steertrue/docs/C4.md

**Implementation:**
11. steertrue/red/validator.py (ConfigValidator)
12. steertrue/main.py (lines 660-687 - broken test)
13. steertrue/green/validator.py (ValidationResult)

**Framework:**
14. docs/framework/logic_bundles/L3_5_task_response.aipl
15. docs/framework/logic_bundles/G3_ACTIVE_REASONING.aipl

### Required Actions

**Before starting work:**
1. Complete branch handshake (confirm dev-sprint-1.2.3)
2. Read all 15 documents
3. Submit READY with understanding confirmation

**To complete sprint:**
1. Analyze ISS-003 root cause (understand why PK prevents testing)
2. Choose correct test redesign approach
3. Implement fix in steertrue/main.py TC-05
4. Test locally (verify no errors)
5. Achieve 100% UAT pass rate (7/7 tests)
6. Update documentation

---

## SUCCESS CRITERIA

**Sprint 1.2.3 complete when:**
- TC-05 properly tests ConfigValidator duplicate detection
- All 7 UAT tests pass
- /uat/config-validator endpoint runs without errors
- ISS-003 resolved and documented
- Phases 5-7 completed

**No rework needed on:**
- Phases 0-4 implementation (all correct)
- ContentLoader protocol
- ValidationResult model
- ConfigValidator logic

**This is a FOCUSED FIX, not a full sprint restart.**

---

## FRAMEWORK COMPLIANCE

**Per pm_role.md V2.2:**
- Binary decision applied: Grade F (termination)
- Specific evidence cited: ISS-003 analysis
- Enforcement ladder followed: First attempt → termination for critical failure
- DEV replacement protocol executed

**Zero-Tolerance Violation:** N/A (DEV made honest mistake but failed to understand problem)

**Standard Process:** DEV replacement for failure to understand root cause

---

## RISK ASSESSMENT

**Risk Level:** LOW

**Why Low Risk:**
- Implementation (Phases 0-4) is complete and correct
- Only test design needs fixing, not production code
- Clear solution path identified
- New DEV has comprehensive handoff

**Time Impact:** +30-60 minutes (test redesign + UAT re-run)

**Quality Impact:** None (may improve test coverage)

---

## NEXT STEPS

**Immediate:**
1. New DEV reads handoff (.claude/handoffs/SPRINT_1.2.3_DEV_HANDOFF_V2.md)
2. DEV reads all 15 required documents
3. DEV submits READY with branch handshake

**After READY Approved:**
1. DEV redesigns TC-05 test
2. PM reviews implementation
3. DEV runs UAT
4. PM validates UAT results
5. Human UAT approval (Keith)
6. Complete Phases 6-7

**Sprint Completion:** Expected within 1-2 DEV sessions

---

## PM RECOMMENDATION

**Proceed with new DEV assignment.**

Sprint 1.2.3 is 80% complete. Only UAT test design needs fixing. Implementation quality is good. Previous DEV failure was educational - highlighted importance of understanding root cause vs. applying quick fixes.

New DEV will benefit from:
- Comprehensive failure analysis
- Clear solution guidance
- Detailed handoff documentation
- Working codebase to build on

**Confidence Level:** HIGH - This is a straightforward fix with clear requirements.

---

## CONTACT

**Questions about this decision:** Review pm_role.md V2.2 Section: DEV Replacement Protocol

**Handoff location:** `.claude/handoffs/SPRINT_1.2.3_DEV_HANDOFF_V2.md`

**Issues log:** `docs/issues/SPRINT_1.2.3_ISSUES.md`

**Branch:** dev-sprint-1.2.3

---

**PM Status:** Awaiting new DEV to read handoff and submit READY

**Framework Status:** Compliant with pm_role.md V2.2

**Sprint Status:** UAT FAILED - Rework Required - New DEV Assigned
