# Micro-Phase Sprint Protocol

**Version:** 1.0
**Created:** 2026-01-23
**Status:** MANDATORY for all AI agents

---

## Purpose

This protocol exists because AI agents repeatedly failed to deliver quality output by:
- Not reading requirements fully
- Not testing before claiming completion
- Not verifying integration chains
- Claiming success without proof

This protocol eliminates those failure modes.

---

## Core Rules

### Rule 0: Full Document Reading (PRE-WORK GATE)

ALL AI must read the following IN FULL before ANY work begins:

```yaml
mandatory_reading:
  environment:
    - railway variables --json (ALL variables)
    - .env files (if exist)
    - Railway dashboard service config

  sprint_documents:
    - PROMPT.md (100% - every line)
    - CONTEXT.md (100% - every line)
    - state.md (current sprint state)
    - ISSUES.md (task breakdown)

  role_documents:
    - dev_role.md (if DEV)
    - pm_role.md (if PM)

  protocol_documents:
    - MICRO_PHASE_PROTOCOL.md (this document)
    - LESSONS_LEARNED.md

  architect_documents:
    - pydantic_architect.md (if Pydantic work)
    - copilot_kit.md (if CopilotKit work)
```

**NO EXCEPTIONS.** AI cannot claim "I skimmed it" or "I read the relevant parts."

**Proof Required:**
```markdown
## Pre-Work Reading Certification

I have read the following documents IN FULL:

| Document | Lines | Read Complete | Key Points Noted |
|----------|-------|---------------|------------------|
| PROMPT.md | 1-685 | YES | [list 3+ key points] |
| CONTEXT.md | 1-685 | YES | [list 3+ key points] |
| [etc] | | | |

## Environment Variables Captured

| Variable | Value | Purpose |
|----------|-------|---------|
| [from railway variables] | | |

Signature: [agent name]
Timestamp: [ISO timestamp]
```

AI that skips this gate will have ALL work rejected.

---

### Rule 0.3: DEV Information Restriction

**DEV agents do NOT see:**
- Entire project documentation
- Entire sprint PROMPT.md
- Full CONTEXT.md
- Other phases' details

**DEV agents ONLY receive:**
1. Environment details (variables, endpoints, services)
2. Micro-phase requirements (exact specification)
3. Details needed to complete THAT micro-phase only

**Rationale:**
- Prevents DEV from skipping ahead
- Forces focus on single atomic task
- Reduces context pollution
- Ensures DEV executes exactly what's specified

**Orchestrator responsibility:**
- Extract relevant environment details
- Provide exact micro-phase specification
- Withhold unrelated project context
- DEV asks questions if unclear (not assume)

---

### Rule 0.5: Phase Entry STOP (MANDATORY)

At the BEGINNING of EVERY phase, AI must:

```
1. STOP
2. Report: "PHASE [X] ENTRY - AWAITING MICRO-PHASE DEVELOPMENT"
3. Wait for user
4. Develop micro-phases WITH user
5. Get user approval on all micro-phases
6. Only then proceed to execution
```

**AI is NOT permitted to:**
- Create micro-phases without user involvement
- Proceed into a phase without micro-phase approval
- Assume previous micro-phase structure applies

**Format:**
```markdown
## PHASE [X] ENTRY

**Status:** STOPPED - Awaiting micro-phase development

**Phase Goal:** [from PROMPT.md]

**Proposed Micro-Phases:** [to be developed with user]

STOP - Awaiting user to develop micro-phases.
```

---

### Rule 1: Proof of Reading

ALL AI must PROVE they have read requirements by:

```yaml
reading_proof:
  format: |
    ## Requirements Read

    | Document | Lines | Key Requirement | My Understanding |
    |----------|-------|-----------------|------------------|
    | [file]   | [X-Y] | [quote]         | [paraphrase]     |

    ## Proof Questions Answered

    Q1: [Question from requirements]
    A1: [Answer with line citation]
```

AI cannot proceed without this proof. Claims of "I read it" are rejected.

---

### Rule 2: Micro-Phase Structure

Each phase is broken into micro-phases. Each micro-phase has:

| Element | Required | Description |
|---------|----------|-------------|
| Task | YES | Single atomic action |
| Input Spec | YES | Exact code/command provided |
| Expert Review | YES | pydantic_architect.md or copilot_kit.md |
| Output Proof | YES | Exact command to verify |
| Pass Criteria | YES | Binary - no judgment calls |
| User Approval | YES | Cannot proceed without |

---

### Rule 3: Expert Review

Before ANY code is written:

1. **copilot_kit.md** reviews all CopilotKit-related code
2. **pydantic_architect.md** reviews all Pydantic AI-related code
3. **PM** reviews architect outputs
4. **User** approves final specification

NO EXCEPTIONS. Code written without expert review is rejected.

---

### Rule 4: agent-browser Verification

ALL AI (including developers) must use agent-browser to prove frontend functionality.

```bash
# Required verification sequence
agent-browser open [url]
agent-browser snapshot --interactive
agent-browser fill [ref] "[test input]"
agent-browser click [ref]
agent-browser wait [ms]
agent-browser screenshot evidence/[micro-phase]-result.png
```

**NO EXCEPTIONS.**

- curl-only verification is NOT acceptable for UI features
- "It should work" is NOT acceptable
- Local testing without Railway deployment is NOT acceptable

---

### Rule 5: Work Log

Every AI maintains a work log during execution:

```yaml
work_log:
  agent: [agent type]
  micro_phase: [ID]
  started: [ISO timestamp]

  actions:
    - timestamp: [time]
      tool: [tool name]
      input: [exact input]
      output: |
        [ACTUAL OUTPUT - NOT SUMMARY]

  ended: [timestamp]
  result: PASS | FAIL
  proof: [paste actual evidence]
```

"Command succeeded" is rejected. Actual output required.

---

### Rule 6: Environment Capture

At end of each micro-phase:

```yaml
environment_snapshot:
  timestamp: [ISO timestamp from: date --iso-8601=seconds]
  branch: [git branch --show-current]
  commit: [git rev-parse HEAD]

  railway_vars:
    [railway variables output]

  packages:
    [npm list --depth=0 output]

  files_changed:
    [git diff --name-only HEAD~1]
```

---

### Rule 7: Troubleshooting Protocol

On ANY error or bug:

| Step | Action | Output |
|------|--------|--------|
| 1 | Enter troubleshooting mode | State: "ENTERING TROUBLESHOOTING MODE" |
| 2 | Create tracking document | File: `TROUBLESHOOTING_[issue].md` |
| 3 | Capture desired result | Document expected output |
| 4 | Map successful workflow path | Step-by-step path that SHOULD work |
| 5 | Test workflow one step at a time | Execute each step, capture output |
| 6 | Document results | SUCCESS/FAIL for each step with actual output |
| 7 | Consult expert architects | pydantic_architect.md and/or copilot_kit.md |
| 8 | Repeat (max 10 iterations) | If no solution after 10 → STOP and ask human |

AI cannot proceed past error without following this protocol.

---

### Rule 8: Non-Gameable Testing

**Nonce Injection:**
User provides random string. AI must include in test. Output must contain nonce.

```
USER: NONCE: x7k9m2
AI: curl -s ... -d '{"nonce":"x7k9m2"}'
OUTPUT: Must contain x7k9m2
```

**Timestamp Verification:**
Suspicious patterns:
- Timestamps ending in :00.000
- Execution faster than network allows
- Identical response times

**Independent Verification:**
User may re-run any command AI claims succeeded.

---

## Micro-Phase Template

```markdown
# Micro [X.Y]: [Task Name]

## Task
[Single atomic action]

## Input Specification
```[language]
[Exact code or command - no interpretation needed]
```

## Expert Review Required
- [ ] pydantic_architect.md (if Python/Pydantic)
- [ ] copilot_kit.md (if CopilotKit)
- [ ] PM review of architect output
- [ ] User approval

## Verification Command
```bash
[Exact command to verify completion]
```

## Pass Criteria
[Binary criteria - no judgment calls]

## Work Log
[AI fills during execution]

## Environment Snapshot
[AI fills after completion]

## User Approval
- [ ] APPROVED
- [ ] REJECTED - Reason: ___
```

---

## Enforcement

| Violation | Consequence |
|-----------|-------------|
| Code without expert review | Rejected, must restart |
| No reading proof | Cannot proceed |
| No agent-browser verification | UAT invalid |
| Summary instead of actual output | Work log rejected |
| Proceeding without user approval | Phase invalidated |
| Skipping troubleshooting protocol | Bug report required |

---

## Workflow Summary

```
1. User provides micro-phase specification
2. AI proves reading of requirements (with citations)
3. Expert architects review specification
4. PM reviews architect output
5. User approves specification
6. AI executes EXACTLY as specified
7. AI proves completion with actual output
8. AI captures environment snapshot
9. User verifies with agent-browser (if frontend)
10. User approves micro-phase completion
11. Proceed to next micro-phase
```

---

## Version History

| Version | Date | Change |
|---------|------|--------|
| 1.0 | 2026-01-23 | Initial protocol after S2.2-R1 Phase 2 failures |
