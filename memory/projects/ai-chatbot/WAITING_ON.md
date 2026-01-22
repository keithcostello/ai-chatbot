# WAITING_ON - ai-chatbot Project

**Last Updated:** 2026-01-22
**Sprint:** S2.2 (READY TO RESUME)

---

## BLOCKERS - ALL RESOLVED

| # | Blocker | Status | Resolution |
|---|---------|--------|------------|
| 1 | Subagent SteerTrue governance | **FIXED** | Session isolation implemented - unique session per subagent |
| 2 | Revert all work after df23763 | **DONE** | Branch reset to df23763, force pushed |
| 3 | Bug reports reviewed by PM | **DONE** | BUG_REPORT_001.md committed |
| 4 | Root cause analysis | **DONE** | LESSONS_LEARNED.md updated |

---

## Subagent Governance Testing (2026-01-22) - POST-FIX

**All 6 sprint subagent types verified:**

| Agent Type | Blocks | L2/proof_enforcement | Session Isolation | Status |
|------------|--------|---------------------|-------------------|--------|
| dev-executor | 5 | YES | UNIQUE | **PASS** |
| pm-agent | 5 | YES | UNIQUE | **PASS** |
| code-reviewer | 5 | YES | UNIQUE | **PASS** |
| design-reviewer | 5 | YES | UNIQUE | **PASS** |
| human-uat-executor | 5 | YES | UNIQUE | **PASS** |
| test-verifier | 6 | YES | UNIQUE | **PASS** |

**Session IDs verified unique:**
- Parent: 2928c10c-9a4d-47
- Subagents each received unique session IDs (not extending parent)

---

## Current State

**Branch:** dev-sprint-S2.2
**Current Commit:** 9b125f9
**Base:** df23763 (Phase 0-1: database schema files)

**What's Included:**
- Database schema (conversations.ts, messages.ts)
- Governance fix (steertrue-subagent-hook.ps1 with session isolation)
- Documentation (LESSONS_LEARNED, COMMON_MISTAKES, BUG_REPORT_001)

---

## Ready to Resume

Sprint S2.2 can restart from **Phase 2 (Walking Skeleton)**.

Previous Phase 3A-5 work was reverted. Must re-implement with:
1. Deployment verification between EVERY phase
2. `npm ci` locally before approving (simulates Railway)
3. All subagents now receive L2/proof_enforcement

---

## No Blockers

Sprint ready to proceed.
