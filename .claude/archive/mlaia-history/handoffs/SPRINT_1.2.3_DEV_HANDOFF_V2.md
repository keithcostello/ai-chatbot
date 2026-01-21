# Sprint 1.2.3 DEV Handoff - V2

**Date:** 2025-12-11
**Sprint:** 1.2.3 - ContentLoader Protocol & Startup Validation
**Branch:** dev-sprint-1.2.3
**Status:** UAT FAILED - Previous DEV Terminated (Grade F)
**New DEV Required:** YES

---

## CRITICAL: BRANCH HANDSHAKE REQUIRED

**Before starting ANY work:**

```
BRANCH HANDSHAKE - Sprint 1.2.3
Required branch: dev-sprint-1.2.3
Current branch: [run: git branch --show-current]
Status: [✅ MATCH / ❌ MISMATCH]
```

**DEV must confirm branch in READY response.**

---

## SITUATION SUMMARY

### Previous DEV Status: TERMINATED (Grade F)

**What happened:**
1. Sprint 1.2.3 UAT endpoint `/uat/config-validator` created
2. TC-05 (Duplicate block_id test) crashes with PostgreSQL error
3. Previous DEV attempted fix but misunderstood the root cause
4. Same error persists after "fix" attempt
5. DEV terminated for failing to understand the actual problem

### Current State

**Completed:**
- Phase 0-4: All implementation COMPLETE
- ContentLoader protocol created (steertrue/green/content_loader.py)
- ValidationResult model created (steertrue/green/validator.py)
- ConfigValidator implemented (steertrue/red/validator.py)
- All unit tests PASS (15/15)

**Blocked:**
- Phase 5: UAT FAILED - ISS-003 blocks completion
- TC-05 in /uat/config-validator crashes before validator runs

### Issues Log

| ID | Status | Description |
|----|--------|-------------|
| ISS-001 | OPEN | Wrong branch at sprint start (documentation only) |
| ISS-002 | OPEN | UAT endpoint crashes on duplicate test data |
| ISS-003 | OPEN | TC-05 test design flaw - cannot test duplicate detection via INSERT |

**Full context:** `docs/issues/SPRINT_1.2.3_ISSUES.md`

---

## YOUR TASK

**Fix ISS-003 and complete Sprint 1.2.3 UAT.**

### Root Cause Analysis (ISS-003)

**Location:** steertrue/main.py lines 660-687 (TC-05 test)

**The Problem:**
```python
# Line 667: First INSERT
await conn.execute("""
    INSERT INTO block_settings (id, layer, name)
    VALUES ('test/duplicate', 'L2', 'Test Block Duplicate 1')
""")

# Line 672: Second INSERT - THIS CRASHES
await conn.execute("""
    INSERT INTO block_settings (id, layer, name)
    VALUES ('test/duplicate', 'L2', 'Test Block Duplicate 2')  # ❌ PK violation
""")
```

**Why it fails:**
- PostgreSQL PRIMARY KEY constraint on `block_settings.id`
- Second INSERT attempts same ID = constraint violation
- Error occurs BEFORE ConfigValidator.validate() is called
- Cannot test duplicate detection if database prevents duplicates

**Previous DEV's mistake:**
- Added DELETE before INSERT (lines 662-663)
- This cleans up from previous runs, but doesn't fix the actual issue
- The test still tries to INSERT same ID twice in same execution

### The Solution

**You need to redesign TC-05 to test duplicate detection differently.**

**Option A: Test validator's duplicate detection logic on existing data**
- Query database for existing blocks
- Simulate duplicate detection by manually creating ValidationResult
- Verify validator can detect duplicates in test data

**Option B: Mock database response**
- Use validator's _fetch_all_blocks() to return duplicate rows
- Test that validate() correctly identifies duplicates

**Option C: Test with non-PK duplicate scenario**
- If the validator should detect duplicates in other fields
- Test those instead of ID duplicates

**YOUR DECISION:** Read ConfigValidator requirements in SPRINT_1.2.3_PROMPT.md and choose the correct approach.

---

## REQUIRED READING (MANDATORY)

**Before submitting READY, you MUST read:**

### Sprint Context
1. `docs/design/mlaia-core/project/sprints/SPRINT_1.2.3_PROMPT.md` (original sprint requirements)
2. `docs/issues/SPRINT_1.2.3_ISSUES.md` (what's been tried, what failed)
3. `docs/design/mlaia-core/project/PHASE_1_PLAN.md` lines 355-371 (US-11 acceptance criteria)

### Architecture Context
4. `docs/architecture/ARCHITECTURE_DECISION_RULES.md`
5. `docs/architecture/BLUE_GREEN_RED_ARCHITECTURE_PRIMER.md`
6. `docs/design/mlaia-core/01_MLAIA_CORE.md`

### Technical Context
7. `steertrue/docs/API_REFERENCE.md`
8. `steertrue/docs/DATA_MODELS.md`
9. `steertrue/docs/INFRASTRUCTURE.md`
10. `steertrue/docs/C4.md`

### Existing Implementation
11. `steertrue/red/validator.py` (ConfigValidator - your fix target)
12. `steertrue/main.py` lines 660-687 (broken TC-05 test)
13. `steertrue/green/validator.py` (ValidationResult model)

### Framework Logic Bundles
14. `docs/framework/logic_bundles/L3_5_task_response.aipl`
15. `docs/framework/logic_bundles/G3_ACTIVE_REASONING.aipl`

---

## WORKING CONSTRAINTS

### MUST Do
- Complete branch handshake before any work
- Fix ISS-003 by redesigning TC-05 test
- Ensure ConfigValidator duplicate detection is properly tested
- Run full UAT and achieve 100% pass rate
- Update ISSUES.md with resolution

### MUST NOT Do
- Skip reading requirements (previous DEV failed here)
- Proceed without understanding root cause
- Apply superficial fixes without testing
- Modify core validator logic (it's correct - test is wrong)

---

## SUCCESS CRITERIA

**Sprint 1.2.3 complete when:**
1. TC-05 test redesigned to properly test duplicate detection
2. All UAT tests pass (7/7)
3. /uat/config-validator endpoint works on re-run
4. ISS-003 resolved and documented
5. ISSUES.md updated with final status

**UAT Pass Criteria:**
- Valid config passes validation ✓
- Invalid decay_preset detected ✓
- Missing required fields detected ✓
- Unknown mutual_exclusive_with warns ✓
- Duplicate block_id detection tested correctly ✓ (YOUR FIX)
- Invalid requires references detected ✓
- All errors collected before reporting ✓

---

## PHASE RESTART POINT

**You are resuming at Phase 5 (UAT) with rework required.**

### Phase 5 Checklist
- [ ] Read all required documents (15 files listed above)
- [ ] Complete branch handshake (confirm dev-sprint-1.2.3)
- [ ] Analyze ISS-003 root cause (understand why INSERT fails)
- [ ] Redesign TC-05 test (choose correct approach)
- [ ] Implement fix in steertrue/main.py
- [ ] Test locally (verify no PK violations)
- [ ] Submit for UAT approval

### After UAT Approval
- Phase 6: Update documentation
- Phase 7: Merge gate

---

## GIT STATUS

**Current branch:** dev-sprint-1.2.3
**Latest commit:** ce60d2e (Previous DEV's failed fix)
**Base branch:** develop

**Recent commits:**
```
ce60d2e Fix ISS-002: Clean up test data before insert  [PREVIOUS DEV - FAILED]
10567de Sprint 1.2.3 work + branch handshake protocol
799ca76 Add /uat/config-validator endpoint
a6dad8c Phase 0 COMPLETE - ISSUES_LOG created
```

---

## RELAY FROM PM

"Sprint 1.2.3 UAT FAILED. Previous DEV terminated (Grade F) for failing to understand root cause of ISS-003. New DEV must:

1. Read all 15 required documents
2. Complete branch handshake (dev-sprint-1.2.3)
3. Understand ISS-003: Cannot test PK duplicate detection via INSERT
4. Redesign TC-05 test correctly
5. Achieve 100% UAT pass rate

This is a FOCUSED REWORK, not full sprint restart. Implementation (Phases 0-4) is complete and correct. Only UAT test needs fixing."

---

## QUESTIONS?

**If blocked >20 minutes:**
1. Document in ISSUES.md
2. STOP and request PM guidance
3. Do NOT guess or apply untested fixes

**Common trap:** Trying to bypass PK constraint instead of redesigning test approach.

---

## END OF HANDOFF

**Next action:** DEV reads all required documents and submits READY confirmation with branch handshake.
