# Sprint Workflow Visual Reference V4.0

**Version:** 4.0
**Updated:** 2026-01-05
**Purpose:** Quick visual reference for proof-based sprint workflow

---

## Full Sprint Flow
```
┌─────────────────────────────────────────────────────────────────┐
│                       SPRINT LIFECYCLE                           │
│                                                                 │
│   PLAN          EXECUTE         PROVE           MERGE           │
│   (0.1-0.9)     (1.1-1.6)       (2.1-2.5)       (3.1-3.5)       │
│      │             │               │               │            │
│      ▼             ▼               ▼               ▼            │
│   ┌──────┐     ┌──────┐       ┌──────┐       ┌──────┐          │
│   │ PM   │     │ DEV  │       │ DEV  │       │Human │          │
│   │creates│     │builds│       │proves│       │merges│          │
│   │plan  │     │      │       │      │       │      │          │
│   └──┬───┘     └──┬───┘       └──┬───┘       └──┬───┘          │
│      │            │              │              │               │
│      ▼            ▼              ▼              ▼               │
│   Human        PM reviews    Human          Complete            │
│   approves     checkpoint    approves                           │
│                              proof                              │
└─────────────────────────────────────────────────────────────────┘
```

---

## Phase Flow Detail
```
PLAN                    EXECUTE                 PROVE                   MERGE
────                    ───────                 ─────                   ─────

PM creates              DEV implements          DEV answers             Delayed proof
PROMPT.md               code changes            proof questions         question
    │                       │                       │                       │
    ▼                       ▼                       ▼                       ▼
DEV confirms            Proof questions:        Human reviews           Final git state
ready.md                • git diff --stat       actual output           • commits ahead
    │                   • commit SHA                │                   • clean status
    ▼                   • line 47 of file           ▼                       │
Human approves              │                   Approved?                   ▼
approach                    ▼                   │     │               Human approves
                       PM reviews               YES   NO              merge
                       checkpoint                │     │                   │
                            │                    ▼     ▼                   ▼
                       Approved?            Phase 3   Back to         git merge
                       │     │                        EXECUTE          main
                      YES   NO
                       │     │
                       ▼     ▼
                   Phase 2   Feedback
                             to DEV
```

---

## Proof Questions (Core Mechanism)
```
┌─────────────────────────────────────────────────────────────────┐
│                     PROOF QUESTIONS                              │
│                                                                 │
│  Instead of verification agents, ask questions that             │
│  can only be answered by doing the work.                        │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  BAD (Gameable)         │  GOOD (Requires Work)         │   │
│  ├─────────────────────────┼───────────────────────────────┤   │
│  │  "Did tests pass?"      │  "Slowest test name?"         │   │
│  │  "Is it working?"       │  "What UUID in response?"     │   │
│  │  "Did you commit?"      │  "What's the commit SHA?"     │   │
│  │  "Any errors?"          │  "Error on line 12?"          │   │
│  └─────────────────────────┴───────────────────────────────┘   │
│                                                                 │
│  TEST: Could DEV answer correctly WITHOUT doing the work?       │
│        If yes → bad question.                                   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## Proof by Sprint Type
```
┌─────────────────────────────────────────────────────────────────┐
│  API SPRINT                                                      │
│  ───────────                                                    │
│  Run: curl -v -X POST {url} -d '{payload}'                      │
│  Paste: Complete response                                        │
│  Answer: What's the {specific_field}?                           │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│  TEST SPRINT                                                     │
│  ───────────                                                    │
│  Run: pytest {path} -v | head -20 && pytest {path} -v | tail -40│
│  Paste: Output                                                   │
│  Answer: How many passed? Slowest test? Any warnings?           │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│  DATABASE SPRINT                                                 │
│  ──────────────                                                 │
│  Run: {sql_query}                                               │
│  Paste: Results                                                  │
│  Answer: What's row 1, column {col}?                            │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## Delayed Proof (Catches Drift)
```
     EXECUTE                           PROVE                    MERGE
        │                                │                        │
        ▼                                ▼                        ▼
   DEV provides                    DEV answers              Delayed question:
   proof details                   proof questions          "What was 2nd
   • slowest test                  • confirms work            slowest test
   • response UUID                                             from earlier?"
   • commit SHA                                                    │
        │                                                          ▼
        └──────────────────────────────────────────────────► Compare to
                                                             earlier answer
                                                                   │
                                                          ┌────────┴────────┐
                                                          │                 │
                                                          ▼                 ▼
                                                       MATCH            MISMATCH
                                                          │                 │
                                                          ▼                 ▼
                                                       Proceed          REJECT
                                                                     (fabrication
                                                                      detected)
```

---

## Spot Checks (Orchestrator Verification)
```
┌─────────────────────────────────────────────────────────────────┐
│                      SPOT CHECKS                                 │
│                                                                 │
│  Orchestrator occasionally runs ONE command to verify:          │
│                                                                 │
│  ┌────────────────────────────┬────────────────────────────┐   │
│  │  Command                   │  Verifies                  │   │
│  ├────────────────────────────┼────────────────────────────┤   │
│  │  git log --oneline -1      │  Commit SHA exists         │   │
│  │  git branch --show-current │  Correct branch            │   │
│  │  ls -la {file}             │  File exists               │   │
│  │  grep -n '{pattern}' {file}│  Code change exists        │   │
│  └────────────────────────────┴────────────────────────────┘   │
│                                                                 │
│  One spot-check catches fabrication.                            │
│  No verification agents needed.                                 │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## Blocked Handling
```
                    ┌─────────────────────┐
                    │   DEV Claims        │
                    │   "BLOCKED"         │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │   Requires:         │
                    │   1. What doing     │
                    │   2. What blocks    │
                    │   3. What tried     │
                    │   4. What unblocks  │
                    └──────────┬──────────┘
                               │
              ┌────────────────┴────────────────┐
              │                                 │
              ▼                                 ▼
        ┌───────────┐                    ┌───────────┐
        │ Specific  │                    │  Vague    │
        │ details   │                    │ "I'm stuck"│
        └─────┬─────┘                    └─────┬─────┘
              │                                │
              ▼                                ▼
        Escalate to                       REJECTED
        Human                             Require specifics
```

---

## Circuit Breakers
```
┌─────────────────────────────────────────────────────────────────┐
│                     CIRCUIT BREAKERS                             │
│                                                                 │
│  ┌──────────────────────┬───────────┬─────────────────────┐    │
│  │  Condition           │ Threshold │  Action             │    │
│  ├──────────────────────┼───────────┼─────────────────────┤    │
│  │  Checkpoint rejects  │  3        │  BLOCK, escalate    │    │
│  │  Total iterations    │  20       │  BLOCK, escalate    │    │
│  │  Same error repeated │  2        │  BLOCK, escalate    │    │
│  └──────────────────────┴───────────┴─────────────────────┘    │
│                                                                 │
│  When tripped:                                                  │
│  • Project STOPS                                                │
│  • Human decides: reset, continue, or cancel                    │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## Human Intervention Points
```
┌─────────────────────────────────────────────────────────────────┐
│                 HUMAN INTERVENTION POINTS                        │
│                                                                 │
│  1. PLAN Gate                                                   │
│     └─ Human approves approach before code starts               │
│                                                                 │
│  2. PROVE Gate                                                  │
│     └─ Human reviews actual proof output                        │
│                                                                 │
│  3. MERGE Gate                                                  │
│     └─ Human approves final merge to main                       │
│                                                                 │
│  4. BLOCKED Escalation                                          │
│     └─ Human provides guidance when DEV stuck                   │
│                                                                 │
│  5. Circuit Breaker                                             │
│     └─ Human decides how to proceed                             │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## File Structure
```
{sprint_root}sprint-{id}/
├── CONTEXT.md              # 30-line source of truth
├── state.md                # Current phase, iteration
├── checkpoints/
│   ├── ready.md            # DEV ready confirmation
│   ├── checkpoint-exec.md  # Execution proof
│   └── checkpoint-proof.md # Final proof answers
├── escalations/
│   └── blocked.md          # Blocked reports
└── handoffs/
    └── PROMPT.md           # PM sprint plan
```

---

## What Was Removed (V3.x → V4.0)
```
┌─────────────────────────────────────────────────────────────────┐
│                        REMOVED                                   │
│                                                                 │
│  Verification Agents:                                           │
│  ✗ Test Verifier                                                │
│  ✗ Escalation Validator                                         │
│  ✗ Human-UAT AI                                                 │
│  ✗ Branch Verifier                                              │
│  ✗ Truth Auditor                                                │
│                                                                 │
│  Mechanisms:                                                    │
│  ✗ Nonce generation/verification                                │
│  ✗ Relay audits                                                 │
│  ✗ Agent log tracking                                           │
│  ✗ Anti-fabrication countermeasures                             │
│  ✗ Proof chains                                                 │
│                                                                 │
│  Phases:                                                        │
│  ✗ Phase 2 (N/A Check)                                          │
│  ✗ Phase 4 (Testing - merged into PROVE)                        │
│  ✗ Phase 5 (UAT - merged into PROVE)                            │
│  ✗ Phase 6 (Documentation - optional)                           │
│                                                                 │
│  Lines: ~2000 → ~450                                            │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## Why This Works
```
┌─────────────────────────────────────────────────────────────────┐
│  V3.x Problem:                                                   │
│  Verification agents can fabricate too.                         │
│  Adding layers doesn't prevent fabrication.                      │
│  2000 lines of rules = 2000 things to claim compliance with.    │
│                                                                 │
│  V4.0 Solution:                                                  │
│  Ask questions that require actual execution to answer.         │
│  One spot-check catches fabrication.                            │
│  Delayed proof catches drift.                                    │
│  Simple = fewer ways to game.                                    │
│                                                                 │
│  Core insight:                                                   │
│  "What's the commit SHA?" requires execution.                    │
│  "Did you commit?" can be answered without execution.            │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

**END OF VISUAL WORKFLOW REFERENCE V4.0**