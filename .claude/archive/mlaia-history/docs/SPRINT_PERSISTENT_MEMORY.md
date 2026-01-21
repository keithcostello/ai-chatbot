# Sprint Persistent Memory Pattern

**Purpose:** Enable AI agent continuity across checkpoints and sessions within a sprint

**Problem Solved:** Each AI agent starts fresh → wastes time re-reading, loses context, repeats mistakes

**Solution:** Structured sprint-level memory that SessionStart hook loads automatically

---

## Architecture

```
.claude/sprints/mlaia/sprint-F-1.5.X/
├── CONTEXT.md          # Read FIRST - sprint identity, commands, requirements
├── PROMPT.md           # Full sprint specification (782+ lines)
├── agent-log.md        # Audit trail of all agent actions
├── state.md            # Current phase, checkpoint, status
├── ISSUES_LOG.md       # Problems encountered and resolutions
├── checkpoints/        # Checkpoint evidence files
└── escalations/        # Human UAT handoffs
```

---

## File Purposes

### CONTEXT.md (MANDATORY FIRST READ)

**Rule:** Every AI agent working on sprint MUST read CONTEXT.md before any other file

**Contents:**
- Sprint ID and branch name
- Goal (one sentence)
- Deployment URL
- Critical paths (PROMPT.md, state.md, logs)
- Current checkpoint
- Copy-paste commands for common operations
- Dependencies from previous sprints
- Agent configuration

**Why First:**
- Prevents wrong branch mistakes (M18, M59)
- Shows current state immediately
- Provides context-specific commands
- Lists what files to read next

**Example:**
```markdown
## Sprint Identity
- **Sprint ID**: F-1.5.8
- **Branch**: `dev-sprint-F-1.5.8`
- **Goal**: Add production-grade resilience to vendor system

## Current Checkpoint
- **Phase**: 6 (Documentation)
- **Checkpoint**: 6
- **Status**: in_progress
```

### agent-log.md (Audit Trail)

**Purpose:** Track every agent action with timestamp, evidence

**Format:**
```markdown
| Timestamp | Agent | Trigger | Result | Evidence |
|-----------|-------|---------|--------|----------|
| 2026-01-13T11:47:02.683Z | Orchestrator | /run-sprint F-1.5.8 | Sprint initialized | Branch verified |
| 2026-01-13T11:48:32.412Z | DEV | Checkpoint 1 | Implemented resilience.py | Lines: 287, Tests: 156 |
```

**Updated By:** Every agent after completing action

**Read By:** Next agent to understand what was done

**Prevents:**
- Repeating same work
- Losing track of progress
- Missing evidence trail

### state.md (Current State)

**Purpose:** Track phase, checkpoint, status in machine-readable format

**Format:**
```yaml
current_phase: 6
current_checkpoint: 6
status: in_progress
last_updated: 2026-01-13T12:30:45.123Z
```

**Updated By:** PM agent at checkpoint transitions

**Read By:** SessionStart hook, agents checking progress

### ISSUES_LOG.md (Problem Tracking)

**Purpose:** Document issues encountered and resolutions

**Format:**
```markdown
## Issue 1: Migration Fails on CHECK Constraint

**Discovered:** Phase 3, Checkpoint 3
**Root Cause:** CHECK constraint used spec values, not codebase values
**Resolution:** Grep codebase for actual values, update constraint
**Prevented By:** M52 COMMON_MISTAKES pattern
**Status:** RESOLVED
```

**Updated By:** Agent that encounters/resolves issue

**Read By:** Next agent to avoid repeating mistake

**Feeds Into:** COMMON_MISTAKES.md if pattern detected

---

## SessionStart Hook Integration

**Enhanced hook (P1.5) automatically loads:**

1. **Git context:** Branch, status, recent commits
2. **Memory files:** USER.md, WAITING_ON.md, COMMON_MISTAKES (excerpts)
3. **Sprint context (if in sprint branch):**
   - CONTEXT.md goal
   - Last agent-log.md entry
   - state.md current phase

**Display example:**
```
=== ACTIVE SPRINT: F-1.5.8 ===

Sprint context loaded from CONTEXT.md
  Goal: Add production-grade resilience to vendor system

Last agent action:
  Agent: DEV
  Trigger: Checkpoint 3
  Result: Implemented CircuitBreaker class

  Current phase: 4
  Status: in_progress

=== CONTEXT LOAD COMPLETE ===
```

**Benefit:** Every agent starts with context, no manual loading required

---

## Agent Workflow

### Phase Start (PM Agent)
1. **SessionStart loads:** Git + Memory + Sprint context
2. **PM reads:** PROMPT.md (full spec), CONTEXT.md (current state)
3. **PM delegates:** "D1 to dev-executor: Implement [task]"
4. **PM updates:** agent-log.md with delegation entry

### Implementation (DEV Agent)
1. **SessionStart loads:** Context automatically
2. **DEV reads:** CONTEXT.md (requirements), agent-log.md (what PM requested)
3. **DEV implements:** Code, tests, documentation
4. **DEV updates:** agent-log.md with completion entry
5. **DEV creates:** checkpoint/checkpoint-N.md with evidence

### Verification (PM Agent Returns)
1. **SessionStart loads:** Updated context
2. **PM reads:** agent-log.md (DEV's completion), checkpoint file (evidence)
3. **PM verifies:** Evidence matches requirements (proof questions)
4. **PM updates:** state.md (advance checkpoint), agent-log.md (verification entry)

### Next Checkpoint (New DEV Agent)
1. **SessionStart loads:** Full context including previous work
2. **New DEV reads:** agent-log.md to see what was already done
3. **New DEV continues:** Next task without repeating work
4. **New DEV references:** Previous checkpoint evidence if needed

---

## Memory Continuity Benefits

| Before (No Persistent Memory) | After (With Pattern) |
|-------------------------------|----------------------|
| Each agent re-reads 782-line PROMPT.md | Read CONTEXT.md (50 lines), then PROMPT if needed |
| Agent doesn't know current phase | state.md shows phase immediately |
| Repeats work from previous checkpoint | agent-log.md shows what was done |
| Loses issue resolutions | ISSUES_LOG.md captures solutions |
| No audit trail | Every action logged with timestamp |
| Manual context gathering every time | SessionStart hook loads automatically |

---

## Integration with Automation

**P1.1-P1.7 Automation Improvements:**
- P1.5: SessionStart loads sprint context automatically
- P1.6: `/interrupt` references agent-log.md for what was tried
- P1.7: TodoWrite enforcement creates visible progress

**M70 Pattern (Spinning Without Anchoring):**
- agent-log.md shows if same approach repeated
- `/interrupt` forces diagnosis before continuing
- Next agent sees failed approaches, tries different path

**Evidence Auditor (L2):**
- All agent-log.md entries require evidence
- Timestamps verified (must have milliseconds)
- Fabrication detected via agent-log.md audit

---

## File Update Responsibilities

| File | Updated By | When | Format |
|------|-----------|------|--------|
| CONTEXT.md | PM at sprint start | Once, then at checkpoint transitions | Markdown |
| agent-log.md | Every agent | After each action | Timestamped table |
| state.md | PM | At checkpoint transitions | YAML |
| ISSUES_LOG.md | Agent that encounters issue | When issue found/resolved | Numbered sections |
| checkpoint/*.md | DEV | At checkpoint completion | Markdown with evidence |

---

## Mandatory Reading Order

**For PM starting sprint:**
1. CONTEXT.md (current state)
2. PROMPT.md (full spec)
3. agent-log.md (previous work if resuming)

**For DEV implementing:**
1. CONTEXT.md (requirements summary)
2. agent-log.md (PM's request + previous work)
3. PROMPT.md (specific section for current task)

**For Verifier:**
1. CONTEXT.md (success criteria)
2. checkpoint file (DEV's evidence)
3. agent-log.md (trace from request to completion)

---

## Pattern Sources

- **CLAUDE.md Memory Boot Sequence:** USER.md, WAITING_ON.md, COMMON_MISTAKES.md
- **Sprint F-1.5.8 CONTEXT.md:** Template for sprint identity file
- **M18:** Missing Branch Verification → CONTEXT.md includes branch
- **M59:** Git Operations Without Status Check → SessionStart shows status
- **M70:** Spinning Without Anchoring → agent-log.md tracks attempts

---

## Implementation Status

**Complete:**
- ✅ P1.5: Enhanced SessionStart hook loads sprint context
- ✅ Scripts/session-start.ps1: Parses CONTEXT.md, agent-log.md, state.md
- ✅ Documentation: This file

**Existing (Already Working):**
- ✅ CONTEXT.md: All sprints have this file
- ✅ agent-log.md: Audit trail in place
- ✅ state.md: Phase tracking exists

**Next:**
- Test with sprint F-1.5.5 (if resuming) or next new sprint
- Verify SessionStart displays context correctly
- Measure reduction in re-reading time
