---
description: Resume a paused sprint with UAT results, merge decisions, guidance, or scope clarification
argument-hint: "<sprint-id> <type>: <response>"
---

# Resume Sprint V2.0

## Version History
| Version | Date | Changes |
|---------|------|---------|
| V1.0 | 2025-12-05 | Initial |
| V1.1 | 2025-12-06 | Added merge gate handling |
| V1.2 | 2025-12-06 | YAML output templates |
| V2.0 | 2025-12-17 | V3.0 agent resume types: uat-question, human-override, arbitrate |
| V2.1 | 2025-12-18 | V3.1 position-based resume: resume-from: [phase.step] for process break recovery |

Resume a sprint that was paused for any reason requiring human input.

## Pause Types

| Type | Pending File | Resume Pattern | Phase |
|------|--------------|----------------|-------|
| UAT | `uat-pending.md` | `Sprint-X UAT: all passed` | Phase 5 |
| **UAT Question (V3.0)** | `uat-question.md` | `Sprint-X uat-answer: [answer]` | Phase 5 |
| **Human Override (V3.0)** | `uat-notification.md` | `Sprint-X human-override: [reason]` | Phase 5 |
| **Validator Dispute (V3.0)** | `validator-dispute.md` | `Sprint-X arbitrate: [dev/validator]` | Any |
| Merge | `merge-pending.md` | `Sprint-X merge: approved` | Phase 7 |
| PM Question | `pm-question.md` | `Sprint-X decision: use Y` | Any |
| DEV Blocked | `dev-blocked.md` | `Sprint-X guidance: try Z` | Any |
| Circuit Breaker | `breaker-tripped.md` | `Sprint-X: reset and continue` | Any |

## Resume Logic

### Step 0: Context Recovery (MANDATORY FIRST)

**Before any other action:**

1. Read `.claude/sprints/mlaia/sprint-[id]/CONTEXT.md` (30 lines - fully internalize)
2. Verify branch: `git branch --show-current`
3. Compare to expected branch in CONTEXT.md
4. If MISMATCH → STOP, do not proceed, report violation

**Why this matters:**

- Fresh agents have no memory between checkpoints
- CONTEXT.md is 30 lines of critical info (branch, URL, paths)
- Without this, agents make basic mistakes (wrong branch, wrong URL)

### From UAT_PENDING (Legacy - Before V3.0)

1. Parse result from input (PASS/FAIL)
2. Write `escalations/uat-response.md`
3. If PASS → Continue to closeout → merge gate
4. If FAIL → Route to dev-executor for fixes → Back to UAT gate

### From UAT_QUESTION_PENDING (V3.0)

**Trigger:** Human-UAT AI asked a clarifying question

1. Parse answer from input
2. Write answer to `escalations/uat-answer.md`
3. Re-delegate to Human-UAT AI with the answer:
   ```
   Task(subagent_type="human-uat-executor", model="opus", prompt="""
   Continuing UAT EXECUTION for Sprint [sprint-id].

   Your previous question was:
   [question from uat-question.md]

   Human's answer:
   [answer from input]

   Based on this answer, complete your test execution and return PASS or FAIL.
   You cannot ask another question.
   """)
   ```
4. Log result to `agent-log.md`
5. If PASS → Write notification, continue to Phase 6
6. If FAIL → Return to DEV with failure reason
7. If ASK (violation) → BLOCK: "Human-UAT AI violated 1-question limit"

### From HUMAN_OVERRIDE (V3.0)

**Trigger:** Human manually tested after Human-UAT AI PASS and found issue

1. Parse override reason from input
2. Write `escalations/human-override.md` with reason
3. Update state → phase=UAT_FIX_PENDING
4. Route to DEV: "Human UAT Override - Issue found: [reason]"
5. DEV must submit FIX_REVIEW proposal
6. Continue with FIX_REVIEW protocol

### From ARBITRATION_PENDING (V3.0)

**Trigger:** DEV disputed Escalation Validator's ANSWER_EXISTS citation

1. Parse arbitration decision from input (dev/validator)
2. Write `escalations/arbitration-response.md`
3. If decision = `dev`:
   - DEV was correct, answer genuinely not in docs
   - Write `escalations/dev-blocked.md`
   - Update state → phase=PAUSED
   - Output BLOCKED template for human guidance
   - END
4. If decision = `validator`:
   - Validator was correct, DEV missed the answer
   - Return to DEV: "Arbitration: Validator correct. Re-read [file:line] and continue."
   - Update state → phase=EXECUTION
   - Continue orchestration

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
4. Output SPRINT_COMPLETE template
5. END

### From DEV_BLOCKED / PM_BLOCKED

1. Parse guidance from input
2. Write `escalations/[type]-response.md`
3. Route guidance to appropriate agent
4. Continue orchestration

### From BREAKER

1. Parse decision (reset/terminate)
2. If reset → clear counter, continue
3. If terminate → go to closeout

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
# Legacy (pre-V3.0)
Sprint-X.0 UAT: all passed
Sprint-X.0 UAT failed - [reason]

# V3.0 Agent Resume Types
Sprint-X.0 uat-answer: [answer to Human-UAT AI question]
Sprint-X.0 human-override: [reason why AI approval was wrong]
Sprint-X.0 arbitrate: dev          # DEV was correct, answer not in docs
Sprint-X.0 arbitrate: validator    # Validator was correct, DEV missed it

# Standard Types
Sprint-X.0 merge: approved
Sprint-X.0 merge: denied - [reason]
Sprint-X.0 guidance: [instruction]
Sprint-X.0 decision: [choice]
Sprint-X.0 hold: [reason]
Sprint-X.0 resume
Sprint-X.0 cancel: [reason]
Sprint-X.0: terminate

# Position-based Resume (V3.1)
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
| UAT passed (legacy) | `Sprint-X UAT: all passed` | → closeout → merge gate |
| UAT failed (legacy) | `Sprint-X UAT failed - reason` | → DEV fixes → UAT gate |
| **Answer UAT question (V3.0)** | `Sprint-X uat-answer: [answer]` | → Human-UAT AI decides PASS/FAIL |
| **Override AI approval (V3.0)** | `Sprint-X human-override: [reason]` | → DEV fixes → FIX_REVIEW |
| **Arbitrate dispute (V3.0)** | `Sprint-X arbitrate: dev/validator` | → Resume or block |
| Merge approved | `Sprint-X merge: approved` | → merge to main → COMPLETE |
| Merge denied | `Sprint-X merge: denied - reason` | → branch preserved → COMPLETE |
| Guidance | `Sprint-X guidance: try Z` | → agent retries |
| Cancel | `Sprint-X cancel: reason` | → CANCELLED |
| Hold | `Sprint-X hold: reason` | → ON_HOLD |
| Resume | `Sprint-X resume` | → continue from hold |
| **Resume from position (V3.1)** | `Sprint-X resume-from: 3.4` | → jump to exact step |