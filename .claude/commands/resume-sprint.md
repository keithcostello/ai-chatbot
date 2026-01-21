---
description: Resume a paused sprint with UAT results, merge decisions, guidance, or scope clarification
argument-hint: "<sprint-id> <type>: <response>"
---

# Resume Sprint V3.0

## Version History
| Version | Date | Changes |
|---------|------|---------|
| V1.0 | 2025-12-05 | Initial |
| V1.1 | 2025-12-06 | Added merge gate handling |
| V1.2 | 2025-12-06 | YAML output templates |
| V2.0 | 2025-12-17 | Agent resume types, position-based resume |
| V3.0 | 2026-01-05 | **SIMPLIFICATION**: Removed verification theatre (Truth Auditor, nonce, relay audits). Kept: human gates, position resume, FIX_REVIEW. |

Resume a sprint that was paused for any reason requiring human input.

## Pause Types

| Type | Pending File | Resume Pattern | Phase |
|------|--------------|----------------|-------|
| UAT | `uat-pending.md` | `Sprint-X UAT: passed` or `Sprint-X UAT failed - [reason]` | Phase 5 |
| Merge | `merge-pending.md` | `Sprint-X merge: approved` | Phase 7 |
| PM Question | `pm-question.md` | `Sprint-X decision: use Y` | Any |
| DEV Blocked | `dev-blocked.md` | `Sprint-X guidance: try Z` | Any |
| Circuit Breaker | `breaker-tripped.md` | `Sprint-X: reset and continue` | Any |

---

## Resume Logic

### Step 0: Context Recovery (MANDATORY FIRST)

**Before any other action:**

1. Read `.claude/sprints/mlaia/sprint-[id]/CONTEXT.md` (30 lines - fully internalize)

2. **CONTEXT ECHO (MANDATORY):**

   Output this block EXACTLY before proceeding:

   ```yaml
   CONTEXT_ECHO:
     sprint_id: [from CONTEXT.md line 4]
     branch: [from CONTEXT.md line 6]
     deployment_url: [from CONTEXT.md line 8]
     test_command: [from CONTEXT.md line 10]
     pause_type: [from state.md]
     return_position: [from state.md if applicable]
   ```

   Missing or incorrect echo = PROCESS_BREAK

3. **Environment Separation Verification:**
   ```bash
   # Verify on dev branch
   git branch --show-current
   # Expected: dev

   # Verify dev-sandbox health
   curl -s "https://steertrue-sandbox-dev-sandbox.up.railway.app/api/v1/health" | jq '.status'
   # Expected: "healthy"

   # Pull latest changes
   git pull origin dev
   ```

4. Compare to expected branch in CONTEXT.md

5. If MISMATCH → STOP, do not proceed, report violation

**Why this matters:**

- Fresh agents have no memory between checkpoints
- CONTEXT.md is 30 lines of critical info (branch, URL, paths)
- Without this, agents make basic mistakes (wrong branch, wrong URL)

**Note:** SessionStart hook has already loaded git context, memory files (USER.md, WAITING_ON.md, COMMON_MISTAKES.md), and sprint context at session start. See `.claude/docs/SPRINT_PERSISTENT_MEMORY.md`

### From UAT_PENDING (Legacy - Before V3.0)

1. Parse result from input (PASS/FAIL)
2. Write `escalations/uat-response.md`
3. If PASS → Continue to closeout → merge gate
4. If FAIL → Route to dev-executor for fixes → Back to UAT gate

### From UAT_FAIL (Human Rejected UAT)

**Trigger:** Human rejected UAT with reason

1. Parse rejection reason from input
2. Write `escalations/uat-fail.md` with reason
3. Update state → phase=UAT_FIX_PENDING
4. Route to DEV:

   ```python
   dev_response = Task(subagent_type="dev-executor", prompt=f"""
   HUMAN UAT REJECTED - Issue Found

   Human tested and found issue:
   [reason from input]

   You must submit a FIX_REVIEW proposal. DO NOT implement without PM approval.
   """)
   ```

5. DEV must submit FIX_REVIEW proposal
6. Continue with FIX_REVIEW protocol

### From MERGE_PENDING

1. Parse decision from input (approved/denied)
2. Write `escalations/merge-response.md`
3. If APPROVED:
   ```bash
   git checkout main
   git merge dev-[sprint-id]
   git push origin main
   git branch -d dev-[sprint-id]
   ```
   **Automated Workflow:** `/ship` command can automate commit → push → PR. See `.claude/commands/ship.md`
4. Output SPRINT_COMPLETE template
5. END

### From DEV_BLOCKED / PM_BLOCKED

1. Parse guidance from input
2. Write `escalations/[type]-response.md`
3. Route guidance to appropriate agent:

   **For DEV_BLOCKED:**

   ```python
   dev_response = Task(subagent_type="dev-executor", prompt=f"""
   GUIDANCE FROM HUMAN

   Your block was reviewed. Here is guidance:
   [guidance from input]

   Continue with your work using this guidance.
   """)
   ```

   **For PM_BLOCKED:**

   ```python
   pm_response = Task(subagent_type="pm-agent", prompt=f"""
   GUIDANCE FROM HUMAN

   Your block was reviewed. Here is guidance:
   [guidance from input]

   Continue with your work using this guidance.
   """)
   ```

4. Continue orchestration

### From BREAKER

1. Parse decision (reset/terminate)
2. **Recovery:** Use `/interrupt` command for structured diagnosis before reset/terminate (see `.claude/commands/interrupt.md`)
3. If reset → clear counter, continue
4. If terminate → go to closeout

### Cancel Action

1. Write `escalations/cancelled.md`
2. Update state → phase=CANCELLED
3. Output:
```yaml
event: CANCELLED
sprint: [sprint-id]
reason: [reason]
phase_at_cancel: [phase]
work_completed:
  - [item]
```
4. END

### Hold Action

1. Write `escalations/on-hold.md`
2. Update state → phase=ON_HOLD
3. Output:
```yaml
event: ON_HOLD
sprint: [sprint-id]
reason: [reason]
phase_at_hold: [phase]
resume: "Sprint-[id] resume"
```
4. END

### Resume from Hold

1. Read state to find phase before hold
2. Update state → phase=(previous phase)
3. Continue orchestration

### Resume from Position (V3.1)

**Trigger:** Process break recovery - jump to exact step

**Input pattern:** `Sprint-X resume-from: [phase.step]`

1. Parse position from input (e.g., `3.4`)
2. Validate position exists in run-sprint.md steps
3. Read CONTEXT.md
4. Verify branch
5. Validate position matches state.md `return_to_position`
6. Output position confirmation:
   ```yaml
   event: POSITION_RESUME
   sprint: [sprint-id]
   position: [phase.step]
   step_name: [description]
   status: RESUMING
   ```
7. Jump to exact step in run-sprint.md
8. Continue normal flow

## Input Patterns

```
# UAT Results
Sprint-X.0 UAT: passed
Sprint-X.0 UAT failed - [reason]

# Merge Gate
Sprint-X.0 merge: approved
Sprint-X.0 merge: denied - [reason]

# Guidance & Decisions
Sprint-X.0 guidance: [instruction]
Sprint-X.0 decision: [choice]

# Sprint Control
Sprint-X.0 hold: [reason]
Sprint-X.0 resume
Sprint-X.0 cancel: [reason]
Sprint-X.0: terminate

# Position-based Resume
Sprint-X.0 resume-from: 3.4    # Resume at Phase 3, Step 4
Sprint-X.0 resume-from: 5.2    # Resume at Phase 5, Step 2
```

## Error Handling

**Sprint not found:**
```yaml
event: ERROR
error: "Sprint not found"
available_sprints:
  - [sprint-id]: [status]
```

**Can't parse input:**
```yaml
event: ERROR
error: "Could not parse input"
examples:
  - "Sprint-X UAT: all passed"
  - "Sprint-X merge: approved"
  - "Sprint-X guidance: [instruction]"
```

## Quick Reference

| Action | Input Pattern | Result |
|--------|---------------|--------|
| UAT passed | `Sprint-X UAT: passed` | → closeout → merge gate |
| UAT failed | `Sprint-X UAT failed - reason` | → DEV fixes → FIX_REVIEW |
| Merge approved | `Sprint-X merge: approved` | → merge to main → COMPLETE |
| Merge denied | `Sprint-X merge: denied - reason` | → branch preserved → COMPLETE |
| Guidance | `Sprint-X guidance: try Z` | → agent retries |
| Decision | `Sprint-X decision: use Y` | → agent continues with choice |
| Cancel | `Sprint-X cancel: reason` | → CANCELLED |
| Hold | `Sprint-X hold: reason` | → ON_HOLD |
| Resume | `Sprint-X resume` | → continue from hold |
| Resume from position | `Sprint-X resume-from: 3.4` | → jump to exact step |
