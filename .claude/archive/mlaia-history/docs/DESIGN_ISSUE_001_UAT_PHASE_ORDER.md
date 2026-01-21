# Design Issue 001: UAT Phase Ordering

**Raised:** 2025-12-08
**Raised By:** Keith (via session feedback)
**Status:** RESOLVED
**Resolved:** 2025-12-08
**Priority:** High (affects all future sprints)

---

## Issue Summary

UAT and Documentation are currently bundled in Phase 5. This creates a logical dependency problem where documentation might be written before UAT passes.

---

## Resolution

Keith approved the following decisions:
1. **Phase count**: "Always 7 Phases" (not "up to 7")
2. **UAT execution**: Both DEV and Human have UAT responsibilities
3. **Checkpoint naming**: checkpoint-5.md (UAT), checkpoint-6.md (Docs)
4. **Phase 6 scope**: Architect's best judgment
5. **Merge Gate**: Named as Phase 7

---

## New 7-Phase Structure (Implemented)

```
Phase 0: PLANNING (PM creates PROMPT.md)
Phase 1: READY (ISSUES.md + READY confirmation)
Phase 2: N/A Check (Quick scope verification)
Phase 3: EXECUTION (Core implementation)
Phase 4: TESTING (Run tests, fix failures)
Phase 5: UAT (User Acceptance Testing - DEV and Human)
Phase 6: DOCUMENTATION (Docs updates)
Phase 7: MERGE GATE (Named phase - final decision)
```

---

## Files Updated

| File | Changes | Version |
|------|---------|---------|
| `.claude/roles/pm_role.md` | 6 changes - phase definitions, gates, checklists | V1.7 |
| `.claude/roles/dev_role.md` | 5 changes - phase definitions, gates, checklists | V1.6 |
| `.claude/commands/run-sprint.md` | 3 changes - "Always 7 Phases", checkpoint naming | V1.9 |
| `.claude/commands/resume-sprint.md` | 1 change - Phase column in Pause Types | - |
| `.claude/docs/OUTPUT_TEMPLATES.md` | 3 changes - 7-phase header, UAT/MERGE templates | - |

---

## Acceptance Criteria - All Met

- [x] All files listed above reviewed for phase references
- [x] Phase 5 split into UAT (new Phase 5) and Documentation (new Phase 6)
- [x] UAT becomes a gate - must pass before Documentation phase begins
- [x] Merge Gate named as Phase 7
- [x] No orphaned references to old "Phase 5 = Doc + UAT"
- [x] Version numbers updated

---

## Notes

- Sprint 0.5 completed before this change (not affected)
- All future sprints will use the new 7-phase structure
- Keith is decision-maker for which phases are N/A

---

**Resolved By:** Architect Agent + Claude Code
