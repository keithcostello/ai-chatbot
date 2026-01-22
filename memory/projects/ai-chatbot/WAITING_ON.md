# WAITING_ON - ai-chatbot Project

**Last Updated:** 2026-01-22
**Sprint:** S2.2 (HALTED)

---

## BLOCKERS (Must resolve before any work resumes)

| # | Blocker | Owner | Status | Notes |
|---|---------|-------|--------|-------|
| 1 | Subagent SteerTrue governance | Architecture | **FIXED** | Session isolation implemented - unique session per subagent |
| 2 | Revert all work after df23763 | DEV | BLOCKED | Commits e28c7ea, 95be9c5, cbda29e, 70e0b5b are invalid |
| 3 | Bug reports reviewed by PM | PM | PENDING | BUG_REPORT_001.md created |
| 4 | Root cause analysis: Why no AI caught deployment failure | Investigation | DOCUMENTED | See LESSONS_LEARNED.md |

---

## Subagent Governance Testing (2026-01-22)

**Tested subagent types:**

| Agent Type | Blocks Received | L2/proof_enforcement | Compliant |
|------------|-----------------|----------------------|-----------|
| Explore | 1 (L3) | NO | Rejected governance |
| dev-executor | 2 (L3, L4) | NO | Yes |
| pm-agent | 6 (L1x3, L2, L3, L4) | YES | Yes |

**Findings:**
1. Hook IS working - governance injected successfully
2. pm-agent receives full governance including L2/proof_enforcement
3. S2.2 failure was transient (API down or hook error at that time)
4. Explore agent type may exhibit rejection behavior - use dev-executor or pm-agent instead

---

## Context

**Last Known Good Commit:** df23763 (Phase 0-1: Architect consultation + database schema files)

**What Happened:**
- Phase 3A-5 deployed code that failed Railway `npm ci` due to dependency conflict
- DEV/PM agents approved based on local builds only
- Subagent governance did not enforce deployment verification
- All work after df23763 is invalid

**Railway Status:** Reset to last known good by human

---

## Resolution Required

1. **Subagent governance fix** - PreToolUse hook must inject governance unconditionally, not based on prompt triggers
2. **Code revert** - Delete commits e28c7ea through 70e0b5b
3. **Process fix** - Deployment verification required between every phase

---

## Waiting On Human Decision

- How to fix subagent governance architecture
- Confirmation of revert approach
