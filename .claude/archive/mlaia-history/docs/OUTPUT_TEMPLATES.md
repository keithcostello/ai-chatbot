# Orchestrator Output Templates V2.0

All orchestrator outputs use YAML format for machine parsing and token efficiency.

**7-Phase Structure:** Always 7 phases - PLANNING (0), READY (1), N/A Check (2), EXECUTION (3), TESTING (4), UAT (5), DOCUMENTATION (6), MERGE GATE (7).

**Key Checkpoints:**
- Checkpoint-1.md: READY confirmation
- Checkpoint-5.md: UAT results (both DEV and Human)
- Checkpoint-6.md: Documentation updates
- Checkpoint-7.md: Merge gate decision (if applicable)

---

## SPRINT_COMPLETE

```yaml
event: SPRINT_COMPLETE
sprint: [sprint-id]
grade: [A/B/C/D/F]
goal: [goal]
branch: dev-[sprint-id]
merged: [true/false]
deliverables:
  - [path]
metrics:
  iterations: [X]/20
  rejections: [X]
  uat_pass_rate: [X]%
```

---

## UAT_GATE

**Phase 5 Gate:** UAT must precede Documentation phase.

Both DEV and Human have UAT responsibilities:
- DEV: Executes test cases, documents results in checkpoint-5.md
- Human: Performs acceptance testing, provides pass/fail decision

```yaml
event: UAT_GATE
sprint: [sprint-id]
phase: 5
goal: [goal]
files:
  - [path]
test_commands:
  - [command]
dev_results:
  test_cases_executed: [n]
  pass_rate: [X]%
resume:
  pass: "Sprint-[id] UAT: all passed"
  fail: "Sprint-[id] UAT failed - [reason]"
```

---

## MERGE_GATE

**Phase 7 Gate (Named Phase):** Final merge decision - not just post-process.

```yaml
event: MERGE_GATE
sprint: [sprint-id]
phase: 7
grade: [grade]
branch: dev-[sprint-id]
documentation_complete: [true/false]
resume:
  approve: "Sprint-[id] merge: approved"
  deny: "Sprint-[id] merge: denied - [reason]"
```

---

## MERGED

```yaml
event: MERGED
sprint: [sprint-id]
branch: dev-[sprint-id]
target: main
status: [merged/preserved]
reason: [if denied]
```

---

## BLOCKED

```yaml
event: BLOCKED
sprint: [sprint-id]
type: [DEV_BLOCKED/PM_BLOCKED/BREAKER]
phase: [phase]
checkpoint: [N]
issue: [description]
resume: "Sprint-[id] guidance: [instruction]"
```

---

## CANCELLED

```yaml
event: CANCELLED
sprint: [sprint-id]
reason: [reason]
phase_at_cancel: [phase]
work_completed:
  - [item]
```

---

## ON_HOLD

```yaml
event: ON_HOLD
sprint: [sprint-id]
reason: [reason]
phase_at_hold: [phase]
resume: "Sprint-[id] resume"
```

---

## ERROR

```yaml
event: ERROR
sprint: [sprint-id]
error: [description]
available_sprints:
  - [sprint-id]: [status]
```

---

## VERIFICATION AGENT OUTPUTS (V2.0)

### Test Verifier Output

```yaml
agent: test_verifier
model: sonnet
sprint: [sprint-id]
result: [PASS/FAIL/BLOCKED]
evidence:
  command: [test command executed]
  output: [actual output - truncated if long]
  tests_passed: [n]
  tests_failed: [n]
  tests_skipped: [n]
# If BLOCKED:
blocker_type: [spec_missing/environment_failure/command_invalid]
blocker_detail: [specific issue]
# If FAIL:
failures:
  - test: [test name]
    error: [error message]
```

### Escalation Validator Output

```yaml
agent: escalation_validator
model: sonnet
sprint: [sprint-id]
dev_claim: [summary of what DEV claims is blocking]
result: [VALID_BLOCK/ANSWER_EXISTS]
# If ANSWER_EXISTS:
citation:
  file: [file path]
  line: [line number]
  content: [relevant excerpt]
# If VALID_BLOCK:
reason: [why this is genuinely a blocking issue]
```

### Human-UAT AI Output

```yaml
agent: human_uat_ai
model: opus
sprint: [sprint-id]
result: [PASS/FAIL/ASK]
# If PASS:
verification_summary: [what was verified]
confidence: [HIGH/MEDIUM]
# If FAIL:
failure_reason: [specific issue found]
dev_action_required: [what DEV must fix]
# If ASK:
question: [single clarifying question]
context: [why this needs clarification]
```

### Branch Verifier Output

```yaml
agent: branch_verifier
model: haiku
sprint: [sprint-id]
result: [MATCH/VIOLATION]
expected: [expected branch name]
actual: [actual branch name]
# If VIOLATION:
warning: "Branch mismatch detected - PM should verify"
```

---

## Agent Log Entry Format

Location: `.claude/sprints/mlaia/sprint-X.Y.Z/agent-log.md`

```markdown
## [TIMESTAMP]
| Field | Value |
|-------|-------|
| Agent | [agent name] |
| Model | [model used] |
| Trigger | [what triggered this invocation] |
| Result | [PASS/FAIL/BLOCKED/etc] |
| Detail | [summary or citation] |
```

---

## Failure Notification Format

Location: `.claude/sprints/mlaia/sprint-X.Y.Z/escalations/failure-notify.md`

```yaml
event: AGENT_FAILURE
timestamp: [ISO timestamp]
sprint: [sprint-id]
agent: [agent name]
result: [FAIL/BLOCKED]
summary: [brief description]
detail: |
  [full agent output]
human_action_required: [true/false]
resume_command: [if applicable]
```
