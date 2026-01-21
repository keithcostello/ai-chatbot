# Orchestration Fix Plan

**Created:** 2025-12-18
**Purpose:** Fix all orchestration issues identified in systematic walkthrough
**Status:** PENDING IMPLEMENTATION

---

## Summary

Systematic review of `.claude/commands/run-sprint.md` and related orchestration files revealed:
- Phase numbering inconsistencies throughout document
- Missing GLOBAL Process Control section
- Missing templates and step numbering
- Agent registration issue (fixed: use `human-uat-executor` not `human-uat`)

---

## Already Fixed

### Agent Registration Issue
- **Problem:** `human-uat` agent lacked Bash access at runtime despite frontmatter
- **Solution:** Use `human-uat-executor` which has working Bash access
- **Files Updated:**
  - `.claude/commands/run-sprint.md` - 3 references updated
  - `.claude/commands/resume-sprint.md` - 1 reference updated
  - `.claude/docs/ORCHESTRATION_WORKFLOW.md` - agent table updated
  - `.claude/agents/orchestration-architect.md` - 2 references updated
  - `.claude/agents/human-uat.md` - DELETED (broken)

---

## Fixes Needed

### 1. MAJOR: Fix Phase Numbering in Section Headers

**Problem:** Section headers don't match the 7-phase definition at line 177-191.

**7-Phase Definition (CORRECT):**
```
Phase 0: PLANNING
Phase 1: READY
Phase 2: N/A Check
Phase 3: EXECUTION
Phase 4: TESTING
Phase 5: UAT
Phase 6: DOCUMENTATION
Phase 7: MERGE GATE
```

**Current Section Headers (WRONG):**
| Line | Current Header | Should Be |
|------|----------------|-----------|
| 455 | "Phase 2: Execution Loop" | Split into Phase 2, 3, 4 sections |
| 556 | "Phase 3: UAT Gate" | "Phase 5: UAT Gate" |
| 765 | "Phase 4: Post-UAT" | Part of Phase 5 (UAT) |
| 817 | "Phase 5: Closeout" | "Phase 6: DOCUMENTATION" |
| 825 | "Phase 6: Merge Gate" | "Phase 7: MERGE GATE" |
| 846 | "Phase 7: Post-Merge" | Part of Phase 7 (MERGE GATE) |

**Action:** Renumber ALL section headers to match 7-phase definition.

---

### 2. Fix Phase 0 Step Labels and Order

**Problem:**
- Two steps both labeled "Step 0a" (lines 216 and 250)
- Illogical order (reads PROJECT_STRUCTURE.md after using sprint_root)

**Correct Order:**
```
Step 0.1: Parse sprint ID from command
Step 0.2: Read PROJECT_STRUCTURE.md → get sprint_root
Step 0.3: Load Logic Bundles (G3, L3_5)
Step 0.4: Create sprint folder + subdirs
Step 0.5: Create CONTEXT.md from template
Step 0.6: Branch Pre-Check
Step 0.7: Create state.md (phase=PLANNING)
Step 0.8: Log to SPRINT_HISTORY.md
Step 0.9: Delegate to PM-agent
Step 0.10: Update state (phase=READY_PENDING, iteration=1)
```

**Action:** Rewrite "FIRST ACTION" section with correct numbering and order.

---

### 3. Add GLOBAL Process Control Section

**Problem:** No centralized section for process control that applies to ALL phases.

**Add at TOP of run-sprint.md (after version history, before phases):**

```markdown
## GLOBAL Process Control

### State Tracking
Every step updates state.md with:
- position: [phase].[step]
- last_agent: [agent name]
- last_action: [description]
- timestamp: [ISO]

### Delegation Enforcement
ORCHESTRATOR IDENTITY:
- I DO: Spawn agents, update state, route messages, validate outputs, enforce gates
- I NEVER: Write code, edit files (except state/escalations), run tests, fix bugs

VIOLATION = PROCESS FAILURE

### Process Break Handler
TRIGGERS: Unexpected error, tool failure, confusion, bug discovered, human action needed

STEPS:
1. Capture position (phase.step)
2. Write escalations/break-[timestamp].md
3. Update state: phase=PROCESS_BREAK, return_to_position=[X.Y]
4. Output PROCESS_BREAK template
5. END

### Return-to-Process Recovery
On /resume-sprint [id] resume-from: [X.Y]:
1. Read CONTEXT.md
2. Verify branch
3. Validate position matches state.md
4. Output position confirmation
5. Jump to exact step
6. Continue normal flow

### Circuit Breakers
- Total iterations: PM limit → PROCESS_BREAK
- Rejections per checkpoint: 3 → PROCESS_BREAK
- Same error repeated: 2 → PROCESS_BREAK
```

---

### 4. Add Phase 6 Documentation Requirements

**Problem:** Phase 6 (Documentation) only has 3 lines - doesn't specify what DEV must document.

**Add to Phase 6:**

```markdown
## Phase 6: DOCUMENTATION

### DEV Documentation Requirements
DEV MUST create/update these files in `steertrue/docs/`:
1. API_REFERENCE.md - API endpoints and contracts
2. C4.md - Architecture diagrams
3. CLIENT_INTEGRATION.md - Integration guide
4. DATA_MODELS.md - Data structures
5. DECAY_SEMANTICS.md - Decay behavior
6. INFRASTRUCTURE.md - Deployment config
7. QUICK_REFERENCE.md - Quick start guide
8. SEQUENCE_DIAGRAMS.md - Flow diagrams

### PM Final Review
1. Verify all 8 docs updated
2. Review sprint deliverables
3. Assign final grade
4. Write checkpoint-6.md

### LESSONS_LEARNED Update (MANDATORY)
Before merge gate:
1. PM reviews LESSONS_LEARNED.aipl
2. Add new patterns (3 minimum if lessons learned)
3. Add anti-patterns (1 minimum if lessons learned)
4. Update Tips section
```

---

### 5. Add Templates

#### pm-blocked.md Template
```markdown
# PM Blocked

**Sprint:** [id]
**Phase:** [phase]
**Position:** [phase.step]
**Timestamp:** [ISO]

## Issue
[Description of what's blocking PM]

## What PM Needs
[Specific question or clarification - be actionable]

## Context
[Relevant background]

## Resume Command
/resume-sprint [id] guidance: [your instruction]
```

#### ready.md Template
```markdown
# DEV READY Confirmation

**Sprint:** [id]
**Timestamp:** [ISO]

## Confirmation
- [ ] Read CONTEXT.md
- [ ] Read PROMPT.md
- [ ] Understand sprint goal
- [ ] Branch verified: dev-sprint-[id]

## ISSUES.md Created
Location: [path]
Tasks identified: [count]

## Questions/Clarifications
[Any questions for PM, or "None"]
```

#### ready-review.md Template
```markdown
# PM READY Review

**Sprint:** [id]
**Timestamp:** [ISO]

## Review
- [ ] DEV confirmed understanding
- [ ] ISSUES.md complete
- [ ] Branch correct

## Decision
**[APPROVED / REJECTED]**

## Reason (if rejected)
[Specific feedback]
```

---

### 6. Clarifications Needed

| Item | Question | Proposed Answer |
|------|----------|-----------------|
| Test plan location | escalations/ or checkpoints/? | `escalations/human-uat-test-plan.md` (current) |
| ISSUES.md location | Root or sprint folder? | `{sprint_path}/ISSUES.md` |
| Phase 3 checkpoints | How many? Who decides? | PM defines in PROMPT.md |

---

### 7. Add Step Numbering to ALL Phases

Every phase needs explicit step numbers in format `[phase].[step]`:
- Phase 0: 0.1, 0.2, 0.3...
- Phase 1: 1.1, 1.2, 1.3...
- etc.

This enables:
- `resume-from: 3.4` syntax
- State tracking with exact position
- Process break recovery

---

### 8. Add DELEGATE BACK Markers

In every retry loop, add explicit:
```
⚠️ DELEGATE BACK TO [agent] ⚠️
(Orchestrator does NOT fix this)

Task(subagent_type="[agent]", prompt="""
  [rejection context]
  [what agent needs to fix]
""")
```

---

### 9. Add DEV BLOCKED Handling to Phase 1

Currently missing. Add:
```
If DEV cannot understand PROMPT.md:
1. DEV writes escalations/dev-blocked.md
2. Orchestrator delegates to escalation-validator
3. If VALID_BLOCK → escalate to human
4. If ANSWER_EXISTS → return to DEV with citation
```

---

## Implementation Order

1. **Add GLOBAL Process Control section** (foundation for everything)
2. **Fix Phase 0 step labels and order**
3. **Fix ALL phase numbering** (renumber section headers)
4. **Add step numbering to all phases**
5. **Add templates** (pm-blocked, ready, ready-review)
6. **Add Phase 6 documentation requirements**
7. **Add DELEGATE BACK markers to retry loops**
8. **Add DEV BLOCKED to Phase 1**
9. **Clarify locations** (test plan, ISSUES.md)

---

## Files to Modify

| File | Changes |
|------|---------|
| `.claude/commands/run-sprint.md` | ALL fixes above |
| `.claude/commands/resume-sprint.md` | Add resume-from syntax |
| `.claude/docs/ORCHESTRATION_WORKFLOW.md` | Update visuals to match |
| `.claude/roles/dev_role.md` | Add Phase 6 doc requirements |
| `.claude/roles/pm_role.md` | Add LESSONS_LEARNED requirement |

---

## Visual Workflows Created

During walkthrough, these visual workflows were designed:
- Phase 0: Sprint Initialization (10 steps)
- Phase 1: READY Gate
- GLOBAL Process Control (6 sections)
- Phase 2: N/A Check (3 steps)
- Phase 3: EXECUTION (8 steps)
- Phase 4: TESTING (12 steps including FIX_REVIEW)
- Phase 5: UAT (11 steps, 4 layers)
- Phase 6: DOCUMENTATION
- Phase 7: MERGE GATE

These visuals should be added to ORCHESTRATION_WORKFLOW.md after fixes.

---

## Verification

After all fixes:
1. Run `/run-sprint test-fix "Verify orchestration works"`
2. Verify all phases execute with correct numbering
3. Test process break and recovery
4. Test delegation enforcement (orchestrator shouldn't do work)

---

**END OF FIX PLAN**
