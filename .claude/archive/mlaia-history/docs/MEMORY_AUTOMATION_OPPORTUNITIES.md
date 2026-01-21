# Memory-Based Automation Opportunities

**Date:** 2026-01-15
**Source:** memory/ai/COMMON_MISTAKES.md patterns
**Status:** Future improvements beyond P1.1-P1.4

---

## Implemented in P1.1-P1.4

| Pattern | Command | Implementation |
|---------|---------|----------------|
| M2: Fabricated Timestamps | /ship | Uses git timestamps |
| M3: Summarized Evidence | /verify, SessionStart | Paste actual output |
| M11: Testing Stale Deployment | /verify | railway status + logs |
| M14: Missing RED Test | /verify | Run test before fix |
| M15: Vague Success Criteria | /verify | Specific counts required |
| M18: Missing Branch Verification | SessionStart | git branch --show-current |
| M21: API-Only UAT | /verify | Test deployed endpoint |
| M39: Unlimited Test Invocations | /verify | Budget tracking |
| M46: Testing Local vs Production | /verify | Deploy first, then test |
| M53: Assuming HTTP Status | /verify | curl -i for headers |

---

## Additional Automation Opportunities

### High Priority

**M13: Grep Verification Without Before/After**
- **Pattern:** Only checking new pattern exists, not that old removed
- **Automation:** PostToolUse hook for Edit operations
- **Implementation:**
  ```powershell
  # After Edit completes
  if ($tool_input.old_string -and $tool_input.new_string) {
    grep -c "$old_string" $file  # MUST = 0
    grep -c "$new_string" $file  # MUST = expected count
  }
  ```
- **Impact:** Prevents incomplete replacements
- **Complexity:** Medium (requires parsing Edit tool parameters)

**M40: Claiming Deployment Blocker Without Checking Tools**
- **Pattern:** Escalating to human without using Railway CLI
- **Automation:** PreEscalation hook (if exists)
- **Implementation:**
  ```powershell
  # Before escalating deployment blocker
  railway status
  railway logs --tail 20
  # Show actual state, not "I can't deploy"
  ```
- **Impact:** Self-service problem solving
- **Complexity:** Low (if PreEscalation hook available)

**M59: Git Operations Without Status Check First**
- **Pattern:** git pull/push without checking status
- **Automation:** Wrapper commands /pull, /push
- **Implementation:**
  ```bash
  git branch --show-current  # Verify correct branch
  git status                  # Check uncommitted changes
  # If external changes: STOP and ASK
  git pull  # Only if checks pass
  ```
- **Impact:** Prevents accidental overwrites
- **Complexity:** Low

### Medium Priority

**M38: DEV Agent Production Database Flooding**
- **Pattern:** Running full test suite hits production
- **Automation:** Test budget enforcement
- **Implementation:** Track pytest invocations, block at limit
- **Impact:** Protects production from test floods
- **Complexity:** High (requires session state tracking)

**M47: Orchestrator Executing DEV Work**
- **Pattern:** Orchestrator edits code directly
- **Automation:** Role enforcement (if multi-agent)
- **Implementation:** Block Write/Edit tools for non-DEV agents
- **Impact:** Enforces delegation
- **Complexity:** High (requires agent role detection)

**M70: Spinning Without Anchoring or Asking**
- **Pattern:** Repeated failed attempts without diagnosis
- **Automation:** Error loop detection
- **Implementation:** Track same error 3+ times → STOP and ASK
- **Impact:** Prevents wasted time
- **Complexity:** High (requires error pattern matching)

### Low Priority (Educational, not automatable)

These require judgment, not automation:
- M5: Orchestrator Executing Instead of Delegating
- M6: Wrong Sprint Folder Verification
- M7: Timezone Math Errors
- M8: Hallucinated File Non-Existence
- M9: Hallucinated Git State
- M10: Context Window Sprint Pollution
- M16: Closing Issues Before Tests Pass
- M17: Truncated Evidence
- M51: Creating User Stories Without Requirements
- M54: Sycophantic Agreement Opening
- M55: Header Truncation
- M56: False Bug Identification
- M60: Sprint Review Skipping Multi-Persona

---

## Recommended Next Steps

### Phase 2 (After velocity sprint test)

**P2.1 - /pull and /push Commands**
- Wrap git operations with safety checks (M59)
- Auto-check branch and uncommitted changes
- Effort: 10 minutes

**P2.2 - Edit Verification Hook**
- PostToolUse for Edit: verify old string removed, new string added (M13)
- Effort: 15 minutes

**P2.3 - Railway Check Command**
- /railway-check - automate M40 diagnostic steps
- Run railway status + logs before escalating
- Effort: 5 minutes

### Phase 3 (Advanced)

**P3.1 - Test Budget Tracking**
- Session-level tracking of pytest invocations (M38, M39)
- Block at limits, suggest alternative approaches
- Effort: 30 minutes (requires session state file)

**P3.2 - Error Loop Detection**
- Track error patterns across turns (M70)
- Suggest anchoring after 3 same errors
- Effort: 45 minutes (requires pattern matching)

**P3.3 - Role Enforcement**
- Block tools based on agent role (M47)
- Requires multi-agent architecture
- Effort: 60 minutes

---

## Pattern Analysis

**Total COMMON_MISTAKES patterns:** 71
**Automatable:** 13 (18%)
**Implemented P1.1-P1.4:** 10 (77% of automatable)
**Remaining high-value:** 3 (M13, M40, M59)

**Conclusion:** P1.1-P1.4 captured most high-value automation. Remaining opportunities require more complex state tracking or multi-agent coordination.

---

## References

| Source | Pattern Count | Implemented |
|--------|---------------|-------------|
| COMMON_MISTAKES.md | 71 | 10 patterns |
| LESSONS_LEARNED.aipl | 2 lessons | LESSON_1, LESSON_2 |
| USER.md | Preferences | PowerShell convention |

**See:** `.claude/docs/AUTOMATION_ALIGNMENT_CHECKLIST.md` for full alignment verification
