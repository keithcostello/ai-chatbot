# Sprint Workflow Visual Reference V2.0

**Version:** 2.0
**Updated:** 2025-12-18
**Purpose:** Quick visual reference for sprint workflow with verification agents and step positions

---

## Full Sprint Flow Overview

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           SPRINT LIFECYCLE                                   │
│                                                                             │
│  Phase 0        Phase 1       Phase 2      Phase 3       Phase 4           │
│  PLANNING  ──►  READY    ──►  N/A CHECK ──► EXECUTION ──► TESTING          │
│  (0.1-0.10)     (1.1-1.7)     (2.1-2.3)    (3.1-3.8)     (4.1-4.9)         │
│     │              │             │             │             │              │
│     │              │             │             │             ▼              │
│     │              │             │             │     ┌───────────────┐      │
│     │              │             │             │     │TEST VERIFIER  │      │
│     │              │             │             │     │(Fresh Context)│      │
│     │              │             │             │     └───────┬───────┘      │
│     │              │             │             │             │              │
│     │              │             │             │             ▼              │
│     │              │             │             │      PASS/FAIL/BLOCKED     │
│     │              │             │             │             │              │
└─────┴──────────────┴─────────────┴─────────────┴─────────────┴──────────────┘
                                                               │
                                                               ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                                                                             │
│  Phase 5                    Phase 6              Phase 7                    │
│  UAT ────────────────────►  DOCUMENTATION  ───► MERGE GATE                 │
│  (5.1-5.10)                 (6.1-6.4)           (7.1-7.5)                   │
│  (FOUR-LAYER)               (DEV + PM)          (PM + Human)               │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘

STEP POSITION FORMAT: [phase].[step]
- Use in state.md to track exact position
- Use in resume-from: to recover from process breaks
- Example: "3.4" = Phase 3, Step 4 (PM checkpoint review)
```

---

## Phase 4: Testing Flow (Test Verifier Integration)

```
                    ┌─────────────────────┐
                    │   DEV Claims        │
                    │   "Tests Pass"      │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │   ORCHESTRATOR      │
                    │   Delegates to      │
                    │   Test Verifier     │
                    └──────────┬──────────┘
                               │
                               ▼
              ┌────────────────────────────────┐
              │      TEST VERIFIER AGENT       │
              │      (Sonnet, Fresh Context)   │
              │                                │
              │  Reads ONLY:                   │
              │  - CONTEXT.md (30 lines)       │
              │  - Test specification          │
              │                                │
              │  Executes:                     │
              │  - Actual test commands        │
              │  - Captures real output        │
              └────────────────┬───────────────┘
                               │
            ┌──────────────────┼──────────────────┐
            │                  │                  │
            ▼                  ▼                  ▼
        ┌───────┐         ┌────────┐        ┌─────────┐
        │ PASS  │         │ FAIL   │        │ BLOCKED │
        └───┬───┘         └───┬────┘        └────┬────┘
            │                 │                  │
            ▼                 ▼                  ▼
     PM reviews         Back to DEV        PM clarifies
     (abbreviated)      with evidence      test spec
```

---

## Phase 5: UAT Flow (FOUR-LAYER with Human-UAT AI)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  LAYER 1: DEV Tests Deployed Endpoint                                       │
│  ─────────────────────────────────────                                      │
│  • DEV runs curl commands against DEPLOYED sandbox                          │
│  • DEV pastes ACTUAL JSON responses (not summaries)                         │
│  • If FAIL: DEV debugs, does NOT submit checkpoint                          │
│  • If PASS: DEV submits Checkpoint-5 with curl evidence                     │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
                         Orchestrator validates
                         Checkpoint-5 has actual
                         curl responses
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│  LAYER 2: PM INDEPENDENTLY Tests Deployed Endpoint                          │
│  ─────────────────────────────────────────────────                          │
│  • PM runs SAME curl commands as DEV                                        │
│  • PM pastes their OWN actual JSON responses                                │
│  • PM verifies response matches DEV's evidence                              │
│  • If FAIL: PM REJECTS Checkpoint-5, DEV fixes                              │
│  • If PASS: PM writes uat-pending.md with BOTH evidences                    │
│                                                                             │
│  ** PM IS FIERCE EXECUTOR - NOT A BOX CHECKER **                            │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
                    ┌───────────────────────────────┐
                    │    BRANCH VERIFIER (Haiku)    │
                    │    Non-blocking check         │
                    │    Log if mismatch            │
                    └───────────────┬───────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│  LAYER 2.5: Human-UAT AI Reviews (NEW)                                      │
│  ─────────────────────────────────────                                      │
│  • Reads: Sprint requirements + UAT spec (fresh context)                    │
│  • Reviews DEV + PM evidence                                                │
│  • Returns: PASS / FAIL / ASK (one question max)                            │
│                                                                             │
│  Model: OPUS (highest stakes decision)                                      │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
              ┌─────────────────────┼─────────────────────┐
              │                     │                     │
              ▼                     ▼                     ▼
         ┌────────┐           ┌──────────┐          ┌──────────┐
         │  PASS  │           │   FAIL   │          │   ASK    │
         └───┬────┘           └────┬─────┘          └────┬─────┘
             │                     │                     │
             ▼                     ▼                     ▼
     ┌──────────────┐      ┌─────────────┐      ┌──────────────┐
     │Notify Human  │      │Return to PM │      │PROJECT STOPS │
     │Continue to   │      │with failure │      │until human   │
     │Phase 6       │      │reason       │      │answers       │
     └──────────────┘      └─────────────┘      └──────┬───────┘
                                                       │
                                                       ▼
                                              Human answers question
                                                       │
                                                       ▼
                                              Human-UAT AI MUST
                                              return PASS or FAIL
                                              (no second ASK)

┌─────────────────────────────────────────────────────────────────────────────┐
│  LAYER 3: Human Notification/Override                                       │
│  ────────────────────────────────────                                       │
│  • Human receives notification of PASS (FYI)                                │
│  • Human CAN override: /resume-sprint X.Y.Z human-override: [reason]        │
│  • Human tests if they choose (no longer mandatory for PASS)                │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## DEV Blocked Escalation Flow (Escalation Validator)

```
                    ┌─────────────────────┐
                    │   DEV Claims        │
                    │   "BLOCKED"         │
                    │   (Can't proceed)   │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │   ORCHESTRATOR      │
                    │   Delegates to      │
                    │   Escalation        │
                    │   Validator         │
                    └──────────┬──────────┘
                               │
                               ▼
          ┌────────────────────────────────────────┐
          │      ESCALATION VALIDATOR AGENT        │
          │      (Sonnet, Fresh Context)           │
          │                                        │
          │  Reads:                                │
          │  - CONTEXT.md                          │
          │  - LESSONS_LEARNED.aipl                │
          │  - PROMPT.md                           │
          │  - PROJECT_STRUCTURE.md                │
          │                                        │
          │  Searches for answer DEV claims        │
          │  doesn't exist                         │
          └────────────────────┬───────────────────┘
                               │
                 ┌─────────────┴─────────────┐
                 │                           │
                 ▼                           ▼
         ┌─────────────┐            ┌──────────────────┐
         │ VALID_BLOCK │            │  ANSWER_EXISTS   │
         │             │            │  [file:line]     │
         └──────┬──────┘            └────────┬─────────┘
                │                            │
                ▼                            ▼
         ┌─────────────┐            ┌──────────────────┐
         │ Escalate to │            │ Return to DEV:   │
         │ Human for   │            │ "Answer at       │
         │ guidance    │            │  [file:line].    │
         │             │            │  Re-read and     │
         │ PROJECT     │            │  continue."      │
         │ STOPS       │            │                  │
         └─────────────┘            └──────────────────┘
                                             │
                                             ▼
                                    ┌──────────────────┐
                                    │ DEV disputes?    │
                                    │                  │
                                    │ YES → Escalate   │
                                    │ to human with    │
                                    │ both sides       │
                                    │                  │
                                    │ NO → DEV         │
                                    │ continues work   │
                                    └──────────────────┘
```

---

## Agent Interaction Tracking

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         AGENT LOG (agent-log.md)                            │
│                                                                             │
│  ALL agent interactions logged for audit + failure notification             │
│                                                                             │
│  Location: .claude/sprints/mlaia/sprint-X.Y.Z/agent-log.md                  │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │ Timestamp         │ Agent              │ Trigger   │ Result │ Detail│   │
│  ├───────────────────┼────────────────────┼───────────┼────────┼───────┤   │
│  │ 2025-12-17T10:30  │ branch-verifier    │ pre-chk-3 │ MATCH  │ ...   │   │
│  │ 2025-12-17T10:35  │ test-verifier      │ chk-4     │ PASS   │ 7/7   │   │
│  │ 2025-12-17T11:00  │ escalation-validator│ dev-block│ ANSWER │ PM:42 │   │
│  │ 2025-12-17T11:30  │ human-uat          │ post-pm   │ PASS   │ 3/3   │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │  FAILURE NOTIFY     │
                    │  (failure-notify.md)│
                    │                     │
                    │  Any FAIL/BLOCKED   │
                    │  result writes here │
                    │  for human review   │
                    └─────────────────────┘
```

---

## Human Intervention Points (STOP Gates)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                       HUMAN INTERVENTION POINTS                              │
│                                                                             │
│  When PROJECT STOPS and waits for human:                                    │
│                                                                             │
│  1. Human-UAT AI asks question                                              │
│     ├─ Project STOPS until human answers                                    │
│     └─ After answer: Human-UAT AI returns PASS/FAIL                         │
│                                                                             │
│  2. Escalation Validator returns VALID_BLOCK                                │
│     ├─ Project STOPS until human provides guidance                          │
│     └─ Resume with: /resume-sprint X.Y.Z guidance: [instruction]            │
│                                                                             │
│  3. DEV disputes Escalation Validator                                       │
│     ├─ Project STOPS for human arbitration                                  │
│     └─ Human decides: DEV or Validator correct                              │
│                                                                             │
│  4. Human-UAT AI PASS but human wants to override                           │
│     ├─ Human tests manually, finds issue                                    │
│     └─ /resume-sprint X.Y.Z human-override: [reason]                        │
│                                                                             │
│  5. Circuit breaker tripped                                                 │
│     ├─ Too many iterations or rejections                                    │
│     └─ Human decides: reset, continue, or cancel                            │
│                                                                             │
│  6. Merge Gate (Phase 7)                                                    │
│     ├─ Final merge decision                                                 │
│     └─ Human approves or denies merge                                       │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Agent Summary Table

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           VERIFICATION AGENTS                                │
│                                                                             │
│  Agent               │ Model  │ Blocking │ Trigger           │ Returns     │
│  ────────────────────┼────────┼──────────┼───────────────────┼─────────────│
│  Test Verifier       │ Sonnet │ Yes      │ DEV claims pass   │ PASS/FAIL/  │
│                      │        │          │ (Phase 4)         │ BLOCKED     │
│  ────────────────────┼────────┼──────────┼───────────────────┼─────────────│
│  Escalation Validator│ Sonnet │ Yes      │ DEV claims blocked│ VALID_BLOCK/│
│                      │        │          │                   │ ANSWER_EXISTS│
│  ────────────────────┼────────┼──────────┼───────────────────┼─────────────│
│  Human-UAT AI        │ Opus   │ Yes      │ After PM Layer 2  │ PASS/FAIL/  │
│                      │        │          │                   │ ASK (1x)    │
│  ────────────────────┼────────┼──────────┼───────────────────┼─────────────│
│  Branch Verifier     │ Haiku  │ No       │ Before all PM     │ MATCH/      │
│                      │        │          │ reviews           │ VIOLATION   │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Agent Registration (REQUIRED)

**Claude Code reads agents from `.claude/agents/*.md` files.**

For an agent to be available as a `subagent_type` in the Task tool, the agent file MUST have YAML frontmatter:

```yaml
---
name: agent-name          # Used as subagent_type value
description: Brief description of when to use this agent
tools: Read, Bash, Grep   # Tools agent can access
model: sonnet             # Model: sonnet, opus, or haiku
---
```

**Example invocation:**
```
Task(subagent_type="human-uat-executor", model="opus", prompt="...")
```

**Registered Verification Agents:**
| Agent File | subagent_type | Model |
|------------|---------------|-------|
| `test-verifier.md` | `test-verifier` | sonnet |
| `escalation-validator.md` | `escalation-validator` | sonnet |
| `human-uat-executor.md` | `human-uat-executor` | opus |
| `branch-verifier.md` | `branch-verifier` | haiku |

**Note:** After adding/modifying agent files, Claude Code may need to be restarted to pick up changes.

---

## Failure Notification Flow

```
     ┌─────────────────┐
     │ Any Agent       │
     │ Returns         │
     │ FAIL/BLOCKED    │
     └────────┬────────┘
              │
              ▼
     ┌─────────────────┐
     │ Orchestrator    │
     │ Writes to       │
     │ agent-log.md    │
     └────────┬────────┘
              │
              ▼
     ┌─────────────────┐
     │ Orchestrator    │
     │ Writes to       │
     │ failure-        │
     │ notify.md       │
     └────────┬────────┘
              │
              ▼
     ┌─────────────────┐
     │ Human           │
     │ Notified        │
     │ (monitors file) │
     └─────────────────┘
```

---

## Quick Reference: Which Agent Does What

```
┌──────────────────────────────────────────────────────────────────┐
│  "I need tests verified"          →  Test Verifier              │
│  "DEV says they're blocked"       →  Escalation Validator       │
│  "PM verified, need UAT decision" →  Human-UAT AI               │
│  "Is branch correct?"             →  Branch Verifier            │
└──────────────────────────────────────────────────────────────────┘
```

---

**END OF VISUAL WORKFLOW REFERENCE**
