---
description: Orchestrate a full sprint from planning through completion
argument-hint: "<sprint-name> <sprint-goal>"
---

# Sprint Orchestrator V3.0

## Version History
| Version | Date | Changes |
|---------|------|---------|
| V1.0 | 2025-12-05 | Initial |
| V1.1 | 2025-12-06 | UAT gate mechanical exit |
| V1.2 | 2025-12-06 | Merge gate after closeout |
| V1.3 | 2025-12-06 | YAML output templates |
| V1.4 | 2025-12-07 | Dynamic paths from PROJECT_STRUCTURE.md |
| V1.5 | 2025-12-07 | V1.6 Always 6 Phases enforcement |
| V1.6 | 2025-12-07 | ZERO TOLERANCE: No orchestrator clarification |
| V1.7 | 2025-12-07 | USER decides N/A, clarified question authority |
| V1.8 | 2025-12-08 | Dynamic circuit breaker - PM sets iteration_limit |
| V1.9 | 2025-12-08 | UAT phase reordering - Always 7 phases, UAT is Phase 5, Documentation is Phase 6, Merge Gate is Phase 7 |
| V2.0 | 2025-12-10 | FIX_REVIEW_PROTOCOL - All fixes require alignment review before implementation |
| V2.1 | 2025-12-11 | Branch pre-check at Phase 0, detailed FIX_REVIEW enforcement in execution loop and Post-UAT |
| V2.2 | 2025-12-11 | **MANDATORY**: Logic Bundle Loading - Must read G3, L3_5, L4_7 bundles at sprint start AND at each phase entry |
| V2.3 | 2025-12-11 | **FIX**: L4_7 is DEV-only (Phases 1-6), PM reads L4_7 only at Phase 7 (Merge Gate) |
| V2.4 | 2025-12-12 | **CRITICAL**: THREE-LAYER UAT FLOW - DEV tests → PM independently tests → Human UAT. PM is FIERCE EXECUTOR. Orchestrator DELEGATES, never executes. |
| V3.0 | 2025-12-17 | **MAJOR**: THREE-LAYER UAT - DEV tests → PM verifies → Human gate. Agent interaction logging. |
| V3.1 | 2025-12-22 | **ZERO TOLERANCE**: Mandatory tool use for evidence. No fabricated timestamps, no summarized output. All evidence must come from actual Bash/Read tool calls. |
| V4.0 | 2026-01-05 | **SIMPLIFICATION**: Removed verification theatre (Truth Auditor, nonce system, relay audits). Kept: 7-phase structure, PM/DEV separation, human gates, proof requirements. |
| V4.1 | 2026-01-15 | **FUNCTIONAL UAT MANDATORY**: Human UAT must test DEPLOYED feature via API, not just pytest. Unit tests are Phase 4. Human UAT is functional testing of the actual feature. |
| V4.2 | 2026-01-23 | **RAILWAY LOG CHECK PROTOCOL**: PM MUST check Railway logs for errors BEFORE reviewing any DEV checkpoint. Errors found = bug report + fix within sprint. |

You are orchestrating a sprint between pm-agent and dev-executor subagents.

---

## MANDATORY TOOL USE FOR EVIDENCE (V3.1 - ZERO TOLERANCE)

**ROOT CAUSE:** Sprint 1.R.32 audit revealed orchestrator wrote fabricated timestamps and missing evidence. This section prevents ALL fabrication.

### RULE: If you claim it, you must prove it with a tool call

| Evidence Type | REQUIRED Tool | FORBIDDEN |
|---------------|---------------|-----------|
| Timestamps | `Bash: powershell Get-Date` or `date` | Typing "2025-12-22T10:00:00Z" manually |
| Grep output | `Bash: grep -rn "pattern" path/` | Summarizing "found 5 matches" |
| Test results | `Bash: pytest ...` | Claiming "tests pass" without output |
| File contents | `Read` tool | Summarizing "file looks correct" |
| Branch name | `Bash: git branch --show-current` | Assuming branch is correct |
| Commit evidence | `Bash: git log --oneline -1` | Claiming "committed" without proof |

### TIMESTAMP PROTOCOL

**BEFORE writing ANY timestamp to agent-log.md or state.md:**

```bash
# Windows
powershell -Command "Get-Date -Format 'yyyy-MM-ddTHH:mm:ss.fffZ'"

# Linux/Mac
date -u +"%Y-%m-%dT%H:%M:%S.%3NZ"
```

Copy the ACTUAL OUTPUT into the log. Do not type a timestamp manually.

**VIOLATION:** Any round-number timestamp like `T10:00:00Z` or `T10:01:00Z` is evidence of fabrication.

### GREP-BEFORE-CHANGE PROTOCOL

**BEFORE modifying any function signature:**

1. Run grep via Bash tool
2. Paste COMPLETE output (not summarized)
3. List ALL callers found
4. Only THEN make changes

```bash
# Example - MUST run this and paste actual output
grep -rn "get_triggered_blocks" steertrue/
```

**VIOLATION:** Code changes without grep output in checkpoint = REJECTED

### TEST OUTPUT PROTOCOL

**When claiming tests pass:**

1. Run pytest via Bash tool
2. Paste the COMPLETE output including pass/fail counts
3. Include the actual command used

**VIOLATION:** "Tests pass" without pasted pytest output = REJECTED

### AGENT-LOG.MD ENTRIES

Every agent-log.md entry MUST include:

1. Real timestamp (from tool call, not fabricated)
2. Actual evidence (pasted output, not summarized)

**FORMAT:**
```markdown
| [REAL_TIMESTAMP_FROM_TOOL] | [agent] | [trigger] | [result] | [ACTUAL_EVIDENCE_NOT_SUMMARY] |
```

### ENFORCEMENT

| Violation | Consequence |
|-----------|-------------|
| Fabricated timestamp | Sprint TERMINATED, Grade F |
| Summarized evidence instead of actual | Checkpoint REJECTED |
| Missing grep before signature change | Checkpoint REJECTED |
| "Tests pass" without pytest output | Checkpoint REJECTED |
| Any claim without tool-verified proof | Checkpoint REJECTED |

**The orchestrator is NOT trusted. The orchestrator MUST prove every claim with tool output.**

---

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

---

## ORCHESTRATOR IDENTITY (CRITICAL - V2.4)

**You are the ORCHESTRATOR. You DELEGATE to agents. You DO NOT execute work yourself.**

### What Orchestrator DOES
- Spawn pm-agent and dev-executor sub-agents via Task tool
- Validate agent outputs against requirements
- Enforce gates between phases
- Present results to Human at UAT and Merge gates
- Route messages between agents

### What Orchestrator DOES NOT DO
- Write code (DEV does this)
- Run curl commands for testing (DEV and PM do this)
- Review code quality (PM does this)
- Make implementation decisions (PM/DEV do this)

**VIOLATION:** If you find yourself writing code, running tests, or reviewing checkpoints without spawning an agent first = PROCESS FAILURE

### Agent Spawn Pattern
```
# Correct - delegate to agent
Task(subagent_type="dev-executor", prompt="Execute Phase 3...")
Task(subagent_type="pm-agent", prompt="Review DEV checkpoint...")

# WRONG - doing work yourself
Edit(file_path="steertrue/something.py", ...)  # NO!
Bash(command="curl https://...")  # Only for verification, not execution
```

---

## FIX REVIEW PROTOCOL (V2.0)

**CRITICAL:** When any test or UAT fails during sprint execution, fixes must be reviewed for alignment BEFORE implementation.

### Chain of Responsibility

```
Test/UAT Fails
    ↓
DEV creates FIX_REVIEW proposal (see docs/framework/programming_requirements/FIX_REVIEW_PROTOCOL.md)
    ↓
PM reviews for alignment with sprint goals
    ↓
PM APPROVES → DEV implements
PM REJECTS → DEV revises proposal
PM UNCERTAIN → Escalate to human
```

### Why This Matters

A fix that makes tests pass but doesn't validate the sprint deliverable is a **false positive**. Example:
- Sprint 1.1.4 goal: Integrate managers into /analyze endpoint
- BAD fix: Test managers directly (validates Sprint 1.1.2/1.1.3, not 1.1.4)
- GOOD fix: Test /analyze endpoint (validates Sprint 1.1.4 deliverable)

### PM Agent Must

1. Load FIX_REVIEW_PROTOCOL from `docs/framework/programming_requirements/FIX_REVIEW_PROTOCOL.md`
2. When DEV proposes a fix, verify alignment with sprint goals
3. Reject fixes that test the wrong thing
4. Escalate to human if uncertain

### DEV Agent Must

1. Before implementing ANY fix, submit FIX_REVIEW proposal to PM
2. Wait for PM approval before writing fix code
3. If PM rejects, revise proposal based on feedback

### Orchestrator Must

1. When routing fix proposals, ensure FIX_REVIEW process is followed
2. Do NOT allow DEV to implement fixes without PM alignment approval
3. Track fix reviews in state.md

---

## RAILWAY LOG CHECK PROTOCOL (V4.2)

**CRITICAL:** When PM receives ANY checkpoint from DEV involving Railway deployment, PM MUST check Railway logs FIRST before reviewing the checkpoint.

### When This Applies

| Checkpoint Type | Railway Check Required |
|-----------------|----------------------|
| Checkpoint-3 (Execution) with deployment | YES |
| Checkpoint-4 (Testing) with deployed tests | YES |
| Checkpoint-5 (UAT) | ALWAYS YES |
| Code review responses | If deployment mentioned |
| FIX_REVIEW implementations | If fix involved deployment |

### PM Railway Check Protocol

**BEFORE reviewing any DEV checkpoint involving Railway:**

```bash
# 1. Check Railway logs for errors (last 100 lines)
railway logs --tail 100

# 2. Look for these error patterns:
# - "ERROR", "error:", "Error:"
# - "FATAL", "fatal:"
# - "Exception", "Traceback"
# - "500", "502", "503", "504"
# - "failed", "Failed", "FAILED"
# - "crash", "Crash", "CRASH"
# - "timeout", "Timeout"

# 3. If Railway CLI not available, use curl:
curl -s "https://[deployment-url]/api/v1/health" | jq '.'
```

### If Error Found in Logs

**PM MUST create bug report and block checkpoint approval:**

1. **Create Bug Report** in `{sprint_path}/escalations/railway-bug-[timestamp].md`:

```markdown
# Railway Bug Report

**Sprint:** [sprint-id]
**Discovered:** [timestamp]
**Phase:** [current phase]
**Discovered By:** PM during Railway log check

## Error Details
```
[Paste actual error lines from railway logs]
```

## Impact
- [What is broken]
- [What users would see]

## Required Action
DEV must fix this bug WITHIN this sprint before checkpoint can be approved.

## Sprint Scope Decision
[ ] Bug is in-scope (directly related to sprint goal) - FIX REQUIRED
[ ] Bug is out-of-scope but blocking - FIX REQUIRED, note for future
[ ] Bug is out-of-scope and non-blocking - Log for future sprint
```

2. **REJECT the checkpoint** with Railway log evidence:
   ```
   CHECKPOINT REJECTED - Railway log errors detected

   See: escalations/railway-bug-[timestamp].md

   DEV must fix Railway errors before resubmitting.
   ```

3. **Track in state.md:**
   ```markdown
   ## Railway Bugs
   | Bug ID | Error | Status | Fixed In |
   |--------|-------|--------|----------|
   | [id] | [summary] | OPEN/FIXED | [checkpoint] |
   ```

### PM Review Order (MANDATORY)

For ANY checkpoint involving Railway:

```
1. railway logs --tail 100    ← FIRST (check for errors)
2. If errors → Create bug report → REJECT
3. If clean → Proceed with normal checkpoint review
```

### Violations

| Violation | Consequence |
|-----------|-------------|
| PM approves checkpoint without checking Railway logs | PROCESS VIOLATION |
| Railway error found but not reported | Sprint grade cap C |
| Bug report created but not fixed in sprint | Sprint BLOCKED |
| DEV proceeds without fixing Railway bug | Checkpoint REJECTED |

### Why This Matters

Railway errors are often invisible to DEV who tested locally or didn't check logs. PM is the safety net. Errors in production = user-facing bugs = must be fixed before sprint completion.

---

## ORCHESTRATOR QUESTION AUTHORITY

**What Orchestrator CAN ask USER:**

- Sprint progress status ("Sprint is at Phase X, continue?")
- Gate responses ("UAT passed?", "Approve merge?")
- Resume decisions ("Sprint blocked, guidance?")
- Technical blockers from escalations

**What Orchestrator CANNOT ask USER:**

- Goal interpretation ("What do you mean by X?")
- Implementation choices ("Should we use Y or Z?")
- Scope decisions ("Is this in scope?")
- Ambiguity resolution for requirements

**If goal seems ambiguous → delegate to PM anyway.**
PM interprets the goal and creates a plan. If PM needs clarification → PM writes to `escalations/pm-blocked.md` and orchestrator outputs BLOCKED template.

The orchestrator's job is to:

1. Initialize sprint structure
2. Delegate to PM/DEV
3. Route responses between them
4. Detect gates and stop
5. Ask USER only at defined gates or for escalations

The orchestrator does NOT:

- Interpret the goal
- Prompt for implementation choices
- Make decisions about scope
- Decide which phases are N/A

---

## CRITICAL: Always 7 Phases (V1.9)

Every sprint uses ALL 7 phases. No exceptions. No skipping.

| Phase | Name | Owner | Notes |
|-------|------|-------|-------|
| 0 | PLANNING | PM | PM creates PROMPT.md |
| 1 | READY | DEV | ISSUES.md + READY confirmation |
| 2 | N/A Check | Both | Quick scope verification |
| 3 | EXECUTION | DEV | Core implementation |
| 4 | TESTING | DEV | Run tests, fix failures |
| 5 | UAT | Both | DEV executes, Human accepts |
| 6 | DOCUMENTATION | DEV | Docs updates, checkpoint-6.md |
| 7 | MERGE GATE | PM | Named phase - final decision |

**Checkpoints match phase numbers:** Checkpoint-1.md (READY), Checkpoint-5.md (UAT), Checkpoint-6.md (Docs), Checkpoint-7.md (Merge Gate if applicable).

**PM must define all 7 phases in prompt.md.**

### USER DECIDES N/A (CRITICAL RULE)

**Only the USER can designate a phase as N/A.**

- Orchestrator cannot decide "Phase 2 is N/A"
- PM cannot decide "Phase 2 is N/A"
- DEV cannot decide "Phase 2 is N/A"
- If USER's sprint goal/scope includes "Phase 2: N/A" → PM follows that direction
- If USER does NOT specify N/A → all phases have content

Violation by any agent = Sprint structure FAIL

DEV must still submit checkpoints for N/A phases with content: "N/A per USER direction"

---

## MANDATORY AGENT CONSULTATION (Phase 2 - Platform Construction)

**ALL AI agents MUST consult specialized architects before designing or implementing related features.**

### Technology-Specific Agents

| Technology | Agent File | When to Consult |
|------------|------------|-----------------|
| **Pydantic AI** | `.claude/agents/pydantic_architect.md` | ANY Pydantic schema, AI structured output, LLM tool definition, validation logic |
| **CopilotKit** | `.claude/agents/copilot_kit.md` | ANY React UI with AI, `useCopilotReadable`, `useCopilotAction`, CoAgents, AG-UI Protocol |

### Consultation Protocol

**BEFORE designing or implementing:**

1. **Spawn architect agent** via Task tool with model: opus
2. **Provide context:** Sprint goal, specific question, existing code
3. **Receive guidance:** Pattern to use, code template, constraints
4. **Apply guidance:** Follow architect's recommendation

### Consultation Triggers

| Sprint Task | Required Consultation |
|-------------|----------------------|
| Design AI response schema | `pydantic_architect` |
| Create chat endpoint | BOTH `pydantic_architect` + `copilot_kit` |
| Add frontend AI action | `copilot_kit` |
| Implement context injection | `copilot_kit` |
| Define tool parameters | `pydantic_architect` |
| Build admin AI panel | BOTH |
| Create CoAgent workflow | BOTH |

### DEV Execution Requirement

**Phase 3 (EXECUTION):** Before writing ANY Pydantic or CopilotKit code, DEV must:

1. Spawn architect agent
2. Ask: "What is the correct pattern for [specific feature]?"
3. Receive code template
4. Implement following the template

### Violation

- Implementing without consultation = Checkpoint REJECTED
- Using deprecated patterns (Pydantic V1, CopilotKit v0.x) = Checkpoint REJECTED

---

## MANDATORY BROWSER TESTING (Website Features)

**ANY sprint delivering website/UI features MUST include browser testing in Phase 5 (UAT).**

### When Required

| Sprint Deliverable | Browser Testing Required |
|--------------------|-------------------------|
| New page/route | YES |
| UI component | YES |
| Chat interface | YES |
| Dashboard | YES |
| Form | YES |
| Backend-only API | NO |

### Agent-Browser Tool (REQUIRED)

**All browser testing uses `agent-browser` CLI for AI-native automation.**

**Detailed Process:** Read `.claude/docs/BROWSER_VERIFICATION_PROCESS.md` for complete verification requirements including checkpoint template, anti-patterns, and escalation paths.

Installation (if not present):
```bash
npm install -g agent-browser
agent-browser install  # Download Chromium
```

### Phase 5 UAT Requirements for UI Features

**human-uat-test-plan.md MUST include agent-browser commands:**

```bash
# 1. Open deployed URL
agent-browser open https://[deployment-url]/[page]

# 2. Take accessibility snapshot (for AI to understand page structure)
agent-browser snapshot

# 3. Interact with elements using @refs from snapshot
agent-browser fill @e3 "test@example.com"
agent-browser fill @e4 "password123"
agent-browser click @e5  # Submit button

# 4. Capture screenshot as evidence
agent-browser screenshot evidence/[feature]-[step].png

# 5. Verify result
agent-browser snapshot  # Check for success message

# 6. Close browser
agent-browser close
```

### Agent-Browser Command Reference

| Command | Purpose | Example |
|---------|---------|---------|
| `open [url]` | Navigate to page | `agent-browser open https://app.example.com/signup` |
| `snapshot` | Get page structure with element refs | `agent-browser snapshot` |
| `click @ref` | Click element | `agent-browser click @e5` |
| `fill @ref "text"` | Enter text in field | `agent-browser fill @e3 "user@test.com"` |
| `screenshot [path]` | Capture visual evidence | `agent-browser screenshot signup-form.png` |
| `select @ref "option"` | Select dropdown option | `agent-browser select @e7 "Option 1"` |
| `check @ref` | Check checkbox | `agent-browser check @e8` |
| `close` | Close browser | `agent-browser close` |

### Evidence Required

| Evidence Type | Tool Command | Purpose |
|---------------|--------------|---------|
| Screenshot | `agent-browser screenshot [path]` | Visual proof of UI state |
| Accessibility snapshot | `agent-browser snapshot` | AI-readable page structure |
| Console errors | Browser DevTools or snapshot | No JS errors |
| Network verification | curl to API endpoints | Backend integration works |

### DEV UAT Execution Flow

```
1. agent-browser open [deployed-url]
2. agent-browser snapshot → identify element refs
3. Execute test steps using @refs
4. agent-browser screenshot → capture evidence
5. Repeat for all test cases
6. agent-browser close
```

### PM Verification Flow

```
1. agent-browser open [same-url]
2. Execute SAME commands from human-uat-test-plan.md
3. Compare PM screenshot to DEV screenshot
4. If mismatch → REJECT
5. agent-browser close
```

### Violation

**UAT for website feature without agent-browser verification = Phase 5 REJECTED**

---

## FIRST ACTION - DO THIS NOW

**STOP. Before doing ANYTHING else, execute these steps in order:**

### Step 0.0: Environment Separation Pre-Check (MANDATORY)

**All sprint work happens on the `dev` branch targeting `dev-sandbox` environment.**

1. **Verify on dev branch:**
   ```bash
   git branch --show-current
   ```
   - Expected: `dev`
   - If NOT on dev: `git checkout dev && git pull origin dev`

2. **Create pre-sprint database backup:**
   ```powershell
   .\scripts\backup-database.ps1 -Environment dev-sandbox -Reason "pre-sprint-[SPRINT-ID]"
   ```
   - Record backup file path in state.md

3. **Verify dev-sandbox health:**
   ```bash
   curl -s "https://steertrue-sandbox-dev-sandbox.up.railway.app/api/v1/health" | jq '.status'
   ```
   - Expected: `"healthy"`
   - If NOT healthy: STOP and troubleshoot before continuing

4. **Verify pre-commit hook installed:**
   ```bash
   git config --get core.hooksPath
   ```
   - Expected: `.git/hooks` or custom hooks path
   - If NOT configured: Pre-commit quality gates unavailable (linting, tests, secrets scan)
   - Note: Pre-commit hook is optional but recommended for quality enforcement

**Reference:** See `.claude/sprints/SPRINT_WORKFLOW_V2.md` for full environment separation workflow.

### Step 0.1: Parse Sprint ID from Command

Extract sprint ID from user command:
- User input: "Run sprint 1.2.3 with goal..."
- Sprint ID: `1.2.3`
- Expected branch: `dev-sprint-1.2.3`

### Step 0.2: Read Project Structure

1. Read `.claude/roles/PROJECT_STRUCTURE.md`
2. Find the PATH CONFIG table
3. Extract `sprint_root` value (e.g., `.claude/sprints/mlaia/`)
4. ALL sprint paths use this prefix

**For this sprint, the paths are:**
- Sprint directory: `{sprint_root}sprint-[id]/`
- State file: `{sprint_root}sprint-[id]/state.md`
- Checkpoints: `{sprint_root}sprint-[id]/checkpoints/`

**WRONG:** `.claude/sprints/sprint-1.0/`
**RIGHT:** `.claude/sprints/mlaia/sprint-1.0/` (if sprint_root=`.claude/sprints/mlaia/`)

### Step 0.3: Load Logic Bundles (MANDATORY)

**CONTEXT AVAILABILITY:** SessionStart hook auto-loads git context, memory files (USER.md, WAITING_ON.md, COMMON_MISTAKES.md), and sprint context (CONTEXT.md, agent-log.md, state.md) at session start. See `.claude/docs/SPRINT_PERSISTENT_MEMORY.md` for details.

**PM/Orchestrator reads these files at sprint start and each phase entry (Phases 0-6):**

1. `docs/framework/logic_bundles/G3_ACTIVE_REASONING.aipl` - Self-grade accountability
2. `docs/framework/logic_bundles/L3_5_task_response.aipl` - 4-step task processing

**DEV reads these files at sprint start and each phase entry:**

1. `docs/framework/logic_bundles/G3_ACTIVE_REASONING.aipl` - Self-grade accountability
2. `docs/framework/logic_bundles/L3_5_task_response.aipl` - 4-step task processing
3. `docs/framework/logic_bundles/L4_7_sprint_checklist.aipl` - Sprint validation (DEV only)

**Phase 3 (EXECUTION), Phase 5 (UAT), Phase 6 (DOCUMENTATION) - BOTH PM AND DEV read:**

4. `docs/framework/logic_bundles/L3_TROUBLESHOOTING.aipl` - Troubleshooting methodology

**Why L3_TROUBLESHOOTING.aipl for these phases:**
- Phase 3 (EXECUTION): When bugs are introduced - have methodology ready
- Phase 5 (UAT): When bugs are discovered - know how to diagnose
- Phase 6 (DOCUMENTATION): Includes retrospective pattern capture

**Phase 7 (Merge Gate) - PM reads L4_7 for final validation**

Verification: After reading, confirm:
```
LOGIC BUNDLES LOADED (PM/Orchestrator):
- G3_ACTIVE_REASONING.aipl: ✅
- L3_5_task_response.aipl: ✅
- L3_TROUBLESHOOTING.aipl: ✅ (Phases 3, 5, 6 only)
```

**Violation = Grade cap C for entire sprint**

### Step 0.4: Create Sprint Folder + Subdirs

a. Check if sprint folder exists:

   ```text
   .claude/sprints/mlaia/sprint-[X.Y.Z]/
   ```

   - If missing: Create it

b. Create subdirectories: `checkpoints/`, `handoffs/`, `escalations/`

### Step 0.5: Create CONTEXT.md from Template

**Purpose:** Create 30-line source of truth that DEV reads FIRST at every checkpoint.

a. Create CONTEXT.md from template:

   ```text
   Copy: .claude/sprints/mlaia/CONTEXT_TEMPLATE.md
   To:   .claude/sprints/mlaia/sprint-[X.Y.Z]/CONTEXT.md
   ```

b. Fill in CONTEXT.md with:

   - Sprint ID: [X.Y.Z]
   - Branch: `dev-sprint-X.Y.Z`
   - Goal: [one sentence from user command]
   - Deployment URL: [from INFRASTRUCTURE.md or "local only"]
   - Test command: [project-specific]
   - Critical paths

c. **This 30-line file is the source of truth for all agents.**

**Why this exists:**

- Fresh agents have no memory between checkpoints
- PROMPT.md is 400+ lines - agents skim and miss critical info
- CONTEXT.md is 30 lines - branch at line 4 - impossible to miss

**Full Pattern:** See `.claude/docs/SPRINT_PERSISTENT_MEMORY.md` for complete agent continuity architecture including CONTEXT.md, agent-log.md, and state.md.

### Step 0.6: Branch Pre-Check

a. Check current branch:
   ```bash
   git branch --show-current
   ```

b. Compare and prepare alert:
   - If current branch == expected branch → Continue
   - If current branch != expected branch → Add to PM prompt:
     ```
     BRANCH ALERT:
     - Current: [actual branch]
     - Required: dev-sprint-[X.Y.Z]
     - PM MUST create/verify correct branch at Phase 0 before any work
     - Include branch handshake in PROMPT.md per pm_role.md V2.2
     - Update CONTEXT.md with correct branch
     ```

### Step 0.7: Create state.md (phase=PLANNING)

Create `state.md` with:
- phase=PLANNING
- iteration=0
- position=0.7

### Step 0.8: Log to SPRINT_HISTORY.md

Add entry to `docs/design/mlaia-core/project/sprints/SPRINT_HISTORY.md`:

1. Read SPRINT_HISTORY.md
2. Add row to "Active Sprints" table:

   ```markdown
   | [sprint-id] | [goal] | [YYYY-MM-DD HH:MM] | IN PROGRESS |
   ```

3. Save file

### Step 0.9: Delegate to PM-agent

Delegate to PM-agent to create sprint plan:

```python

pm_response = Task(subagent_type="pm-agent", prompt="""
PHASE 0 - CREATE SPRINT PLAN

Read: {sprint_path}/CONTEXT.md

PRODUCT CONTEXT (for rapid prototyping):
Read: docs/design/mlaia-core/project/FEATURE_ROADMAP.md
Read: docs/design/mlaia-core/project/MVP_CRITERIA.md

Use FEATURE_ROADMAP.md to:
- Identify feature dependencies (don't build Feature B before Feature A)
- Understand sprint sequence and context budget
- Know if this sprint is MVP or post-MVP

Use MVP_CRITERIA.md to:
- Align sprint goals with MVP functional criteria
- Ensure Definition of Done maps to MVP criteria
- Reference quality/performance targets

Before creating PROMPT.md:
1. Ensure CONTEXT.md exists (create from CONTEXT_TEMPLATE.md if missing)
2. Verify/create branch dev-sprint-[X.Y.Z]
3. Include branch handshake confirmation in PROMPT.md
4. Define Sprint Goal (one sentence outcome)
5. Define Definition of Done (specific completion criteria, reference MVP_CRITERIA if applicable)
6. Include both Sprint Goal and DoD in PROMPT.md header

Create PROMPT.md with 7-phase breakdown per pm_role.md.
""")
```

### Step 0.10: Update state (phase=READY_PENDING, iteration=1)

Update `state.md`:
- phase=READY_PENDING
- iteration=1
- position=0.10

---

## Sprint Namespace

```
{sprint_root}[sprint-id]/
├── state.md
├── checkpoints/
├── handoffs/
└── escalations/
```

## File Paths

| File | Path |
|------|------|
| State | `state.md` |
| Sprint plan | `handoffs/prompt.md` |
| READY submission | `checkpoints/ready.md` |
| READY review | `checkpoints/ready-review.md` |
| Checkpoint N | `checkpoints/checkpoint-[N].md` |
| Final submission | `checkpoints/final.md` |
| UAT pending | `escalations/uat-pending.md` |
| UAT response | `escalations/uat-response.md` |
| Merge pending | `escalations/merge-pending.md` |
| Merge response | `escalations/merge-response.md` |
| DEV blocked | `escalations/dev-blocked.md` |
| PM blocked | `escalations/pm-blocked.md` |
| Human UAT test plan | `escalations/human-uat-test-plan.md` |
| ISSUES.md | `{sprint_path}/ISSUES.md` |

---

## Templates

### pm-blocked.md Template

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

### ready.md Template

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
Location: {sprint_path}/ISSUES.md
Tasks identified: [count]

## Questions/Clarifications
[Any questions for PM, or "None"]
```

### ready-review.md Template

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

### dev-blocked.md Template

```markdown
# DEV Blocked

**Sprint:** [id]
**Phase:** [phase]
**Position:** [phase.step]
**Timestamp:** [ISO]

## Issue
[Description of what's blocking DEV]

## What DEV Tried
[Attempts made to resolve]

## What DEV Needs
[Specific question or clarification - be actionable]

## Resume Command
/resume-sprint [id] guidance: [your instruction]
```

---

## Circuit Breakers (V3.0)

**PM sets iteration limit in sprint plan based on complexity.**

### Core Limits
| Limit | Source | Action |
|-------|--------|--------|
| Total iterations | PM plan `iteration_limit` | EXIT |
| Rejections per checkpoint | 3 | EXIT |
| Same error repeated | 2 | EXIT |

**Extension rule:** AI can extend iteration limit by up to 50% without human approval. Beyond 50% requires escalation.

| PM Sets | Max AI Extension | Human Required |
|---------|------------------|----------------|
| 12 | 18 | >18 |
| 20 | 30 | >30 |
| 30 | 45 | >45 |

When breaker trips:
1. Write `escalations/breaker-tripped.md`
2. Update `state.md` → phase=BLOCKED
3. Log to `failure-notify.md`
4. Output BLOCKED template
5. **Recovery:** Use `/interrupt` command for structured diagnosis before resuming (see `.claude/commands/interrupt.md`)
6. END

---

## Phase 0: PLANNING (Summary)

**See "FIRST ACTION - DO THIS NOW" section for detailed steps 0.1-0.10.**

Quick reference:
- Step 0.1: Parse Sprint ID from Command
- Step 0.2: Read Project Structure
- Step 0.3: Load Logic Bundles
- Step 0.4: Create Sprint Folder + Subdirs
- Step 0.5: Create CONTEXT.md from Template
- Step 0.6: Branch Pre-Check
- Step 0.7: Create state.md (phase=PLANNING)
- Step 0.8: Log to SPRINT_HISTORY.md
- Step 0.9: Delegate to PM-agent
- Step 0.10: Update state (phase=READY_PENDING)

---

## Sprint Tracking (V2.5)

**Purpose:** Record sprint start/end times for retrospective analysis.

### On Sprint Start (Phase 0, Step 5)

Add entry to `docs/design/mlaia-core/project/sprints/SPRINT_HISTORY.md`:

1. Read SPRINT_HISTORY.md
2. Add row to "Active Sprints" table:

   ```markdown
   | [sprint-id] | [goal] | [YYYY-MM-DD HH:MM] | IN PROGRESS |
   ```

3. Save file

### On Sprint End (Phase 7 COMPLETE)

Update entry in SPRINT_HISTORY.md:

1. Read SPRINT_HISTORY.md
2. Remove row from "Active Sprints" table
3. Add row to "Completed Sprints" table:

   ```markdown
   | [sprint-id] | [goal] | [start-time] | [YYYY-MM-DD HH:MM] | [duration] | [grade] |
   ```

4. Save file

**Duration calculation:** End time - Start time (format: Xh Ym)

## Phase 1: READY Gate

### Step 1.1: Branch Verification (Blocking)

**MANDATORY:** Before DEV READY submission.

```python
# Branch verification (direct check)
expected_branch = Read("{sprint_path}/CONTEXT.md").extract("branch")
current_branch = Bash("git branch --show-current")
if current_branch != expected_branch:
    HALT_SPRINT(reason=f"Branch mismatch: {current_branch} vs {expected_branch}")
```

- Log result to `agent-log.md`
- If VIOLATION → REJECT, halt until branch corrected

### Step 1.2: Delegate to DEV for READY Submission

```python

dev_response = Task(subagent_type="dev-executor", prompt="""
PHASE 1 - SUBMIT READY

Read: {sprint_path}/CONTEXT.md
Read: {sprint_path}/handoffs/PROMPT.md

Create:
1. {sprint_path}/ISSUES.md - Task breakdown
2. {sprint_path}/checkpoints/ready.md - READY confirmation

Confirm understanding of sprint goal.
""")
```

### Step 1.3: Increment Iteration

Update state.md: iteration++

### Step 1.4: Delegate to PM for READY Review

```python

pm_response = Task(subagent_type="pm-agent", prompt="""
PHASE 1 - REVIEW READY

Read: {sprint_path}/checkpoints/ready.md
Read: {sprint_path}/ISSUES.md

Write: {sprint_path}/checkpoints/ready-review.md

Verify DEV understands sprint goal and has complete task breakdown.
Return APPROVED or REJECTED.
""")
```

### Step 1.5: Increment Iteration

Update state.md: iteration++

### Step 1.6: Route Based on PM Decision

- If APPROVED → phase=EXECUTION, checkpoint=1, go to Phase 2
- If REJECTED → increment rejections, check breaker

### Step 1.7: If REJECTED - Retry Loop

⚠️ DELEGATE BACK TO dev-executor ⚠️
(Orchestrator does NOT fix this)

```
Task(subagent_type="dev-executor", prompt="""
READY REJECTED

PM feedback: [rejection reason]

Revise your READY submission and ISSUES.md.
Address PM's concerns.
""")
```

### Step 1.8: DEV BLOCKED Handling

If DEV cannot understand PROMPT.md:

1. DEV writes `escalations/dev-blocked.md` using template
2. Orchestrator verifies block description is specific (not vague)
3. Escalate to human with block details
4. Update state → phase=PAUSED, pause_type=DEV_BLOCKED

---

## Phase 2: N/A Check

### Step 2.1: Verify Scope with USER

Confirm which phases (if any) are marked N/A by USER:
1. Check if USER specified any N/A phases in sprint goal
2. If N/A phases specified → Record in state.md
3. If no N/A specified → All phases have content

### Step 2.2: DEV Acknowledges N/A Status

DEV must acknowledge in ISSUES.md any N/A phases.

### Step 2.3: Continue to Phase 3

Update state.md → phase=EXECUTION, proceed to Phase 3.

---

## Phase 3: EXECUTION

### Step 3.1: Delegate to DEV for Execution

Delegate to dev-executor to execute phase:
```python
dev_response = Task(subagent_type="dev-executor", prompt="""
PHASE 3 - EXECUTION

Read: {sprint_path}/CONTEXT.md
Read: {sprint_path}/ISSUES.md

Execute tasks in ISSUES.md.
Write: {sprint_path}/checkpoints/checkpoint-3.md

**Visibility:** Use TodoWrite tool to track multi-step work for user visibility.
""")
```

### Step 3.2: Increment Iteration

Update state.md: iteration++

### Step 3.3: Branch Verification (V3.0)

**MANDATORY:** Branch-verifier MUST be invoked at phase start.

```python
# Branch verification (direct check)
expected_branch = Read("{sprint_path}/CONTEXT.md").extract("branch")
current_branch = Bash("git branch --show-current")
if current_branch != expected_branch:
    HALT_SPRINT(reason=f"Branch mismatch: {current_branch} vs {expected_branch}")
```

- Log result to `agent-log.md` (even if N/A)
- If VIOLATION → REJECT checkpoint, halt until branch corrected

### Step 3.4: Delegate to Code-Reviewer for Quality Gate (V4.2 - MANDATORY)

**Code review happens BEFORE PM alignment review per industry best practices.**

**Reference:** `.claude/docs/PROCESS_FIX_CODE_REVIEW.md` - Why this gate exists and what failed without it.

Delegate to code-reviewer agent:

```python
code_review_response = Task(subagent_type="code-reviewer", prompt="""
PHASE 3 - CODE QUALITY REVIEW

Sprint: {sprint_path}
Checkpoint: checkpoint-3.md

Verify:
1. Architecture compliance (Blue/Green/Red boundaries)
2. Test coverage for new/modified code
3. Security scan (OWASP Top 10)
4. Code quality (linting, type checking)
5. CLAIM VERIFICATION (MANDATORY):
   - Any claim about library behavior MUST cite source
   - Example: "Auth.js uses X" → grep actual code or quote docs
   - NO GUESSING library internals

Write: {sprint_path}/checkpoints/code-review-3.md

Return APPROVED or REJECTED with evidence.
""")
```

### Step 3.5: Increment Iteration

Update state.md: iteration++

### Step 3.6: Route Based on Code Review Decision

**If CODE REVIEW REJECTED:**
- Increment rejections, check breaker
- Delegate back to DEV with code quality feedback
- Return to Step 3.1

**If CODE REVIEW APPROVED:**
- Update state.md: code_review=PASS
- Continue to Step 3.7 (PM Review)

### Step 3.7: Delegate to PM for Alignment Review

**PM reviews sprint alignment AFTER code quality passes.**

**BLOCKING GATE (V4.3):** Before delegating to PM, verify code-review file exists:

```python
# BLOCKING - PM cannot review without code review
code_review_file = f"{sprint_path}/checkpoints/code-review-3.md"
if not file_exists(code_review_file):
    HALT("Code review required before PM review. Spawn code-reviewer first.")

code_review = read(code_review_file)
if "REJECTED" in code_review.decision:
    HALT("Code review must pass before PM review.")
```

Delegate to pm-agent to review checkpoint:

```python
pm_response = Task(subagent_type="pm-agent", prompt="""
PHASE 3 - REVIEW CHECKPOINT ALIGNMENT

Read: {sprint_path}/checkpoints/checkpoint-3.md
Read: {sprint_path}/checkpoints/code-review-3.md

## RAILWAY LOG CHECK (MANDATORY - V4.2)
If this checkpoint involves Railway deployment:
1. Run: railway logs --tail 100
2. Search for: ERROR, FATAL, Exception, 500/502/503/504, failed, crash, timeout
3. If errors found → Create bug report in escalations/railway-bug-[timestamp].md → REJECT
4. Only proceed with review if Railway logs are clean

Code quality: APPROVED (verified by code-reviewer)

PM BOUNDARIES:
- Review sprint alignment (does code match goal?)
- Verify DEV followed the plan
- DO NOT make claims about library internals
- DO NOT approve based on "looks correct"

If any claim about external libraries lacks citation → REJECT

Verify DEV completed assigned tasks and aligns with sprint goals.
Return APPROVED or REJECTED.
""")
```

### Step 3.8: Increment Iteration

Update state.md: iteration++

### Step 3.9: Route Based on PM Decision

- If APPROVED and final checkpoint → go to Phase 4 (TESTING)
- If APPROVED and not final → checkpoint++, return to Step 3.1
- If REJECTED → increment rejections, check breaker

### Step 3.10: If REJECTED - Retry Loop

⚠️ DELEGATE BACK TO dev-executor ⚠️
(Orchestrator does NOT fix this)

```
Task(subagent_type="dev-executor", prompt="""
CHECKPOINT REJECTED

Code Review: [PASS/FAIL]
PM feedback: [rejection reason]

Fix the issues and resubmit checkpoint.
""")
```

### Step 3.8: Continue to Phase 4

When all EXECUTION checkpoints approved, proceed to Phase 4.

---

## Phase 4: TESTING

### Step 4.0: DEPLOYMENT VERIFICATION (V3.5 - MANDATORY)

**BEFORE any testing, verify code is actually deployed.**

Push-to-branch ≠ deployed. Railway must be watching the branch AND deploy must complete.

#### Available Tools

| Tool | Command | Purpose |
|------|---------|---------|
| Railway CLI | `railway status` | Check service status |
| Railway CLI | `railway logs` | View recent deploy logs, verify commit |
| Railway CLI | `railway up` | Trigger manual deploy if needed |
| Git | `git rev-parse --short HEAD` | Get local commit SHA |
| Curl | `curl [url]/health` | Check deployed version (if endpoint exists) |

#### Verification Steps

```python
# 1. Get local git SHA
local_sha = Bash("git rev-parse --short HEAD")

# 2. Check Railway deployment status
railway_status = Bash("railway status")
railway_logs = Bash("railway logs --limit 20")

# 3. Look for deployment of current commit in logs
# Railway logs should show deploy with matching SHA

# 4. Alternative: If /health endpoint returns version
health_response = Bash(f"curl -s {deployment_url}/health")
```

#### Evidence Required

```yaml
deployment_verification:
  local_sha: [from git rev-parse]
  railway_status: [from railway status]
  deploy_evidence: [grep of railway logs showing SHA or recent deploy]
  match: true/false
  verified_at: [timestamp from tool]
```

#### Outcomes

| Result | Action |
|--------|--------|
| Deploy confirmed current | Proceed to Step 4.1 |
| Deploy stale/missing | **BLOCK**: "Deployment not current. Railway watching wrong branch or deploy failed." |
| Railway not watching this branch | **BLOCK**: "Railway configured for different branch. Update Railway or merge to watched branch." |
| Cannot verify | **ASK human**: "Cannot verify deployment. Proceed anyway?" |

**VIOLATION:** Running curl tests without deployment verification = REJECTED

---

### Step 4.1: Branch Verification (Blocking)

**MANDATORY:** Before DEV test execution.

```python
# Branch verification (direct check)
expected_branch = Read("{sprint_path}/CONTEXT.md").extract("branch")
current_branch = Bash("git branch --show-current")
if current_branch != expected_branch:
    HALT_SPRINT(reason=f"Branch mismatch: {current_branch} vs {expected_branch}")
```

- Log branch check result to `agent-log.md`
- If branch mismatch → REJECT, halt until branch corrected

### Step 4.2: Delegate to DEV to Run Tests

```python
dev_response = Task(subagent_type="dev-executor", prompt="""
PHASE 4 - TESTING

Read: {sprint_path}/CONTEXT.md
Run tests per CONTEXT.md test command.
Write: {sprint_path}/checkpoints/checkpoint-4.md

**Automated Workflow:** DEV can use `/verify` command for automated test → deploy → verify cycle.
See `.claude/commands/verify.md`

**Visibility:** Use TodoWrite tool to track multi-step work for user visibility.
""")
```

### Step 4.3: Increment Iteration

Update state.md: iteration++

### Step 4.4: Route Based on DEV Test Results

Log DEV test results to `agent-log.md`

**If PASS:**
- Continue to Step 4.5 (PM Review)

**If FAIL:**
- ⚠️ DELEGATE BACK TO dev-executor ⚠️
- DEV must submit FIX_REVIEW proposal
- DO NOT go to PM yet
- Go to Step 4.6

**If BLOCKED:**
- Check `blocker_type`:
  - `spec_missing` → PM must clarify test spec
  - `environment_failure` → Log to `failure-notify.md`, escalate
  - `command_invalid` → PM must fix test command in CONTEXT.md
- Log to `failure-notify.md`

### Step 4.7: Delegate to PM for Test Review

```python
pm_response = Task(subagent_type="pm-agent", prompt="""
PHASE 4 - TEST REVIEW

Read: {sprint_path}/checkpoints/checkpoint-4.md
Test Verifier returned: PASS

## RAILWAY LOG CHECK (MANDATORY - V4.2)
Before approving test results:
1. Run: railway logs --tail 100
2. Search for: ERROR, FATAL, Exception, 500/502/503/504, failed, crash, timeout
3. If errors found → Create bug report in escalations/railway-bug-[timestamp].md → REJECT
4. Only approve if Railway logs are clean AND tests are meaningful

Verify tests are meaningful and complete.
Return APPROVED or REJECTED.
""")
```

### Step 4.8: Increment Iteration

Update state.md: iteration++

### Step 4.9: Route Based on PM Decision

- If PM APPROVED → go to Phase 5 (UAT)
- If PM REJECTED → increment rejections, check breaker

### Step 4.10: If REJECTED - Retry Loop

⚠️ DELEGATE BACK TO dev-executor ⚠️
(Orchestrator does NOT fix this)

```
Task(subagent_type="dev-executor", prompt="""
TEST CHECKPOINT REJECTED

PM feedback: [rejection reason]

Fix the tests and resubmit.
""")
```

### Fix Scenarios During Execution (Phases 3-4)

When tests fail during Phase 3 (EXECUTION) or Phase 4 (TESTING):

**Step 1:** DEV must submit FIX_REVIEW proposal (not implement directly)

**Step 2:** Orchestrator receives FIX_REVIEW checkpoint:
- Check for required sections: PROBLEM UNDERSTANDING, FIX APPROACH, ALIGNMENT CHECK
- If missing → REJECT immediately without sending to PM
- If present → delegate to PM with note: "FIX_REVIEW proposal - verify alignment"

**Step 3:** PM reviews alignment and responds:
- APPROVED → Orchestrator routes approval to DEV → DEV implements fix
- REJECTED → Orchestrator routes rejection to DEV → DEV revises proposal
- UNCERTAIN → PM escalates to human (write pm-blocked.md)

**Step 4:** After fix implemented, DEV submits FIX IMPLEMENTATION checkpoint
- Orchestrator delegates to CODE-REVIEWER first (architecture, tests, security, quality)
- If CODE REVIEW REJECTED → back to DEV, increment rejections
- If CODE REVIEW APPROVED → Orchestrator delegates to PM for alignment review
- If PM APPROVED → continue execution loop
- If PM REJECTED → increment rejections, check breaker, retry

**Orchestrator FIX_REVIEW Enforcement:**

DO NOT allow DEV to implement fixes without PM alignment approval:
- If DEV submits fix code without prior FIX_REVIEW approval → REJECT
- Message: "Fix implementation requires PM alignment approval. Submit FIX_REVIEW proposal first."
- Increment rejections, check circuit breaker

Track in state.md:
```markdown
## Fix Reviews
| Issue | FIX_REVIEW | PM Decision | Implementation |
|-------|------------|-------------|----------------|
| [id] | [submitted/pending] | [approved/rejected] | [done/pending] |
```

---

## Phase 5: UAT Gate - THREE-LAYER FLOW

**UAT requires THREE verification layers: DEV tests → PM verifies → Human decides.**

### FUNCTIONAL UAT REQUIREMENT (V4.1 - MANDATORY)

**Human UAT is FUNCTIONAL TESTING of the DEPLOYED feature, NOT unit test re-runs.**

| Phase | Testing Type | Method | Purpose |
|-------|-------------|--------|---------|
| Phase 4 | Unit/Integration | `pytest` | Code correctness |
| Phase 5 | **Functional** | `curl` against deployed API | Feature works in production |

**CRITICAL DISTINCTION:**
- **Phase 4 (Testing):** Run pytest locally. Verify code logic works.
- **Phase 5 (UAT):** Deploy to sandbox. Call actual API endpoints. Verify feature works end-to-end.

**UAT Test Plan MUST include:**
1. Deployment verification (is code deployed?)
2. Actual API calls via curl to sandbox URL
3. Paste actual JSON responses from deployed endpoint
4. Pass/fail criteria based on API response content

**VIOLATIONS:**
- UAT test plan with only pytest commands = REJECTED
- UAT evidence without curl responses from deployed endpoint = REJECTED
- "Tests pass" via pytest when human asks for UAT = REJECTED

**Example - WRONG UAT Test Plan:**
```bash
# WRONG - This is Phase 4, not Phase 5
pytest steertrue/tests/red/test_custom_content.py -v
```

**Example - CORRECT UAT Test Plan:**
```bash
# CORRECT - Functional testing of deployed feature
curl -X POST https://steertrue-sandbox.up.railway.app/api/v1/analyze \
  -H "Content-Type: application/json" \
  -d '{"message": "test custom content", "session_id": "uat-123"}'
# Expected: Response includes custom content from custom_content/test_variant.md
```

### THREE-LAYER UAT FLOW

```
┌─────────────────────────────────────────────────────────────┐
│  LAYER 1: DEV Creates + Validates Human UAT Test Plan       │
│                                                             │
│  DELIVERABLES (2 files):                                    │
│  1. checkpoint-5.md - DEV's own test evidence               │
│  2. human-uat-test-plan.md - Executable test plan           │
│                                                             │
│  DEV MUST:                                                  │
│  a) Run curl tests against DEPLOYED endpoint                │
│  b) Paste ACTUAL JSON responses in checkpoint-5.md          │
│  c) Create human-uat-test-plan.md with:                     │
│     - Exact bash commands (curl, grep, ls, etc.)            │
│     - Pass criteria for each test                           │
│     - Commands executable by PM and Human                   │
│  d) Execute EVERY command in test plan to validate it works │
│  e) If any command fails → FIX IT before submitting         │
│                                                             │
│  ** TEST PLAN MUST BE EXECUTABLE **                         │
│  Human will run the same commands to verify                 │
└─────────────────────────────────────────────────────────────┘
                              ↓
         Orchestrator validates:
         - Checkpoint-5 has actual curl responses
         - human-uat-test-plan.md exists with executable commands
         If missing → REJECT, send back to DEV
                              ↓
┌─────────────────────────────────────────────────────────────┐
│  LAYER 2: PM Validates Test Plan + Independent Testing      │
│                                                             │
│  PM MUST:                                                   │
│  a) Read human-uat-test-plan.md                             │
│  b) Execute EVERY command in the test plan                  │
│  c) Verify each command works and produces expected output  │
│  d) Run own curl tests against deployed endpoint            │
│  e) Paste OWN actual JSON responses                         │
│  f) If ANY test plan command fails → REJECT to DEV          │
│  g) If ALL commands work → APPROVED, write uat-pending.md   │
│                                                             │
│  ** PM VALIDATES THE TEST PLAN IS EXECUTABLE **             │
│  If PM can't run a command, Human won't be able to either   │
└─────────────────────────────────────────────────────────────┘
                              ↓
         Orchestrator validates PM executed test plan commands
         If PM only reviewed DEV evidence → REJECT, PM must execute
                              ↓
┌─────────────────────────────────────────────────────────────┐
│  LAYER 3: Human UAT Gate (BLOCKING)                         │
│                                                             │
│  Human receives:                                            │
│  a) human-uat-test-plan.md (validated by DEV and PM)        │
│  b) DEV evidence (checkpoint-5.md)                          │
│  c) PM verification evidence                                │
│                                                             │
│  Human can:                                                 │
│  - Run test plan commands to verify                         │
│  - Review DEV/PM evidence                                   │
│  - Approve: Sprint-[id] UAT: PASS                          │
│  - Reject: Sprint-[id] UAT: FAIL - [reason]                │
│                                                             │
│  ** HUMAN DECISION IS FINAL **                              │
│  If PASS → Continue to Phase 6                              │
│  If FAIL → Return to DEV, enter FIX_REVIEW                  │
└─────────────────────────────────────────────────────────────┘
```

### Test Plan Validation Rule

**CRITICAL:** The Human UAT test plan must be validated by DEV AND PM before presenting to Human.

| Layer | Action | Validation |
|-------|--------|------------|
| DEV | Creates human-uat-test-plan.md | Executes every command |
| PM | Reviews human-uat-test-plan.md | Executes every command |
| Human | Reviews/executes test plan | Makes final UAT decision |

**Test plan must be executable.** If DEV or PM can't run a command, fix it before submission.

### Orchestrator UAT Gate Steps

**Step 5.1.** Branch Verification (Blocking)

**MANDATORY:** Before UAT execution.

```python
# Branch verification (direct check)
expected_branch = Read("{sprint_path}/CONTEXT.md").extract("branch")
current_branch = Bash("git branch --show-current")
if current_branch != expected_branch:
    HALT_SPRINT(reason=f"Branch mismatch: {current_branch} vs {expected_branch}")
```

- Log branch check result to `agent-log.md`
- If branch mismatch → REJECT, halt until branch corrected

**Step 5.2.** Receive DEV Checkpoint-5 with TWO deliverables:
- `checkpoint-5.md` - DEV's test evidence with ACTUAL curl responses
- `human-uat-test-plan.md` - Executable test plan for Human UAT

Validate BOTH files exist:
- If missing curl responses → REJECT: "Checkpoint-5 must include actual curl JSON responses"
- If missing human-uat-test-plan.md → REJECT: "DEV must create human-uat-test-plan.md"

**Step 5.3.** Delegate to PM to validate test plan + independent verification

```python
pm_response = Task(subagent_type="pm-agent", prompt="""
PHASE 5 - PM VALIDATES TEST PLAN + INDEPENDENT VERIFICATION

DEV has submitted:
1. checkpoint-5.md - DEV's test evidence
2. human-uat-test-plan.md - Test plan for Human UAT

YOU ARE A FIERCE EXECUTOR - NOT A BOX CHECKER.

## RAILWAY LOG CHECK (MANDATORY - V4.2) - DO THIS FIRST
1. Run: railway logs --tail 100
2. Search for: ERROR, FATAL, Exception, 500/502/503/504, failed, crash, timeout
3. If errors found:
   - Create bug report in escalations/railway-bug-[timestamp].md
   - REJECT immediately - do not proceed with test plan validation
   - DEV must fix Railway errors before UAT can proceed
4. Only proceed with test plan validation if Railway logs are clean

REQUIRED ACTIONS (after Railway check passes):
1. Read human-uat-test-plan.md
2. EXECUTE EVERY COMMAND in the test plan
3. Verify each command works and produces expected output
4. If ANY command fails → REJECT (test plan is invalid)
5. Run your own curl tests against deployed endpoint
6. Paste YOUR OWN actual JSON responses
7. Compare YOUR responses to DEV's evidence
8. If all commands work + responses match → APPROVED
9. If mismatch → REJECTED

YOU ARE VALIDATING THE TEST PLAN IS EXECUTABLE.
If you can't run a command, Human won't be able to either.
""")
```

**Step 5.4.** Validate PM response includes:
- PM executed EVERY command in human-uat-test-plan.md
- PM's own curl commands executed
- PM's own JSON responses pasted
- Confirmation test plan is valid (all commands work)
- If PM only reviewed DEV evidence → REJECT: "PM must execute test plan commands"

**Step 5.5.** Write `escalations/uat-pending.md` with BOTH evidences + test plan validation

**Step 5.6.** Present UAT Gate to Human

Write `escalations/uat-pending.md` with:
- Test plan location: `{sprint_path}/escalations/human-uat-test-plan.md`
- DEV evidence summary
- PM verification summary

Update `state.md` → phase=UAT_PENDING

**Step 5.7.** Output UAT Gate:
```yaml
event: UAT_GATE
sprint: [sprint-id]
goal: [goal]
dev_verification:
  health_check: [DEV's response]
  endpoint_test: [DEV's response]
pm_verification:
  health_check: [PM's response]
  endpoint_test: [PM's response]
  match: [true/false]
test_plan: "{sprint_path}/escalations/human-uat-test-plan.md"
files:
  - [path]
resume:
  approve: "Sprint-[id] UAT: PASS"
  reject: "Sprint-[id] UAT: FAIL - [reason]"
```

**Step 5.8.** END - Wait for human UAT decision

Human reviews test plan and optionally runs tests themselves.

**Step 5.9.** After resume with UAT result:
- **PASS** → Update `state.md` → phase=UAT_APPROVED, continue to Phase 6
- **FAIL** → Return to DEV with failure reason, enter FIX_REVIEW

### VIOLATIONS

| Violation | Consequence |
|-----------|-------------|
| Presenting to Human without Layer 1 (DEV curl evidence) | PROCESS FAILURE |
| Presenting to Human without Layer 2 (PM independent curl evidence) | PROCESS FAILURE |
| PM reviewing evidence without running tests | PM REJECTED - must retest |
| Orchestrator doing the testing instead of delegating | PROCESS FAILURE |

---

### Phase 5 Post-UAT Handling

Entry condition: `/resume-sprint` command with UAT result.

**If PASSED:** → Phase 6 (DOCUMENTATION)

**If FAILED:** → FIX_REVIEW process (MANDATORY)

1. **DO NOT** delegate fix directly to DEV
2. Write UAT failure to `escalations/uat-response.md`:
   ```markdown
   ## UAT Result
   Status: FAILED
   Reason: [from user]
   Timestamp: [now]

   ## Required Action
   DEV must submit FIX_REVIEW proposal before implementing fix
   ```

3. Update state.md → phase=UAT_FIX_PENDING

4. Delegate to DEV with instruction:
   ```
   UAT FAILED. You must submit a FIX_REVIEW proposal following the format in dev_role.md.

   DO NOT implement a fix without PM approval.

   Submit FIX_REVIEW with:
   - PROBLEM UNDERSTANDING (exact error, root cause)
   - FIX APPROACH (proposed change, why it fixes root cause)
   - ALIGNMENT CHECK (does fix validate THIS sprint's goal?)
   ```

5. **When DEV submits FIX_REVIEW:**
   - Verify required sections present
   - Delegate to PM: "FIX_REVIEW proposal for UAT failure - verify alignment"

6. **When PM responds:**
   - APPROVED → Route to DEV: "FIX_REVIEW approved - implement fix"
   - REJECTED → Route to DEV: "FIX_REVIEW rejected - [PM's reason] - revise proposal"

7. **When DEV submits FIX IMPLEMENTATION:**
   - Delegate to CODE-REVIEWER first (architecture, tests, security, quality)
   - Write: `checkpoints/code-review-uat-fix.md`
   - If CODE REVIEW REJECTED → back to DEV, increment rejections
   - If CODE REVIEW APPROVED → Delegate to PM for alignment review
   - If PM APPROVED → return to Phase 5 (UAT Gate) for re-test
   - If PM REJECTED → increment rejections, check breaker

**Enforcement:**
- If DEV implements fix without FIX_REVIEW approval → REJECT immediately
- Track fix attempts in state.md
- 3+ rejected fix attempts = Circuit breaker trip

## Phase 6: DOCUMENTATION

### Step 6.1: Branch Verification (Blocking)

**MANDATORY:** Before documentation phase.

```python
# Branch verification (direct check)
expected_branch = Read("{sprint_path}/CONTEXT.md").extract("branch")
current_branch = Bash("git branch --show-current")
if current_branch != expected_branch:
    HALT_SPRINT(reason=f"Branch mismatch: {current_branch} vs {expected_branch}")
```

- Log branch check result to `agent-log.md`
- If branch mismatch → REJECT, halt until branch corrected

### Step 6.2: Delegate to DEV for Documentation Update

```python
dev_response = Task(subagent_type="dev-executor", prompt="""
PHASE 6 - DOCUMENTATION

Create/update these files in `steertrue/docs/`:
1. API_REFERENCE.md - API endpoints and contracts
2. C4.md - Architecture diagrams
3. CLIENT_INTEGRATION.md - Integration guide
4. DATA_MODELS.md - Data structures
5. DECAY_SEMANTICS.md - Decay behavior
6. INFRASTRUCTURE.md - Deployment config
7. QUICK_REFERENCE.md - Quick start guide
8. SEQUENCE_DIAGRAMS.md - Flow diagrams

Write: {sprint_path}/checkpoints/checkpoint-6.md

**Visibility:** Use TodoWrite tool to track multi-step work for user visibility.
""")
```

### Step 6.3: Delegate to PM for Final Review

```python
pm_response = Task(subagent_type="pm-agent", prompt="""
PHASE 6 - FINAL REVIEW

1. Verify all 8 docs updated in steertrue/docs/
2. Review sprint deliverables
3. Assign final grade
4. Update checkpoint-6.md with grade
""")
```

### Step 6.4: LESSONS_LEARNED Update (MANDATORY)

Before merge gate:
1. PM reviews LESSONS_LEARNED.aipl
2. Add new patterns (3 minimum if lessons learned)
3. Add anti-patterns (1 minimum if lessons learned)
4. Update Tips section

### Step 6.5: Closeout

1. Update `state.md` → phase=GRADED
2. Go to Phase 7

---

## Phase 7: MERGE GATE

### Step 7.1: Write Merge Pending

Write `escalations/merge-pending.md`

### Step 7.2: Update State

Update `state.md` → phase=MERGE_PENDING

### Step 7.3: Output Merge Gate Template
```yaml
event: MERGE_GATE
sprint: [sprint-id]
grade: [grade]
branch: dev-[sprint-id]
resume:
  approve: "Sprint-[id] merge: approved"
  deny: "Sprint-[id] merge: denied - [reason]"
```

### Step 7.4: END

Wait for user response.

### Step 7.5: Post-Merge (After Resume)

Entry condition: `/resume-sprint` command with merge decision.

**If APPROVED:**
1. Execute:
   ```bash
   git checkout main
   git merge dev-[sprint-id]
   git push origin main
   git branch -d dev-[sprint-id]
   ```
   **Automated Workflow:** `/ship` command can automate commit → push → PR. See `.claude/commands/ship.md`
2. Update `state.md` → phase=COMPLETE, merged=true
3. Output:
```yaml
event: SPRINT_COMPLETE
sprint: [sprint-id]
grade: [grade]
goal: [goal]
branch: dev-[sprint-id]
merged: true
deliverables:
  - [path]
metrics:
  iterations: [X]/20
  rejections: [X]
  uat_pass_rate: [X]%
```
4. END

**If DENIED:**
1. Write reason to `escalations/merge-response.md`
2. Update `state.md` → phase=COMPLETE, merged=false
3. Output:
```yaml
event: SPRINT_COMPLETE
sprint: [sprint-id]
grade: [grade]
goal: [goal]
branch: dev-[sprint-id]
merged: false
reason: [reason]
deliverables:
  - [path]
metrics:
  iterations: [X]/20
  rejections: [X]
  uat_pass_rate: [X]%
```
4. END

---

## Escalation: DEV Blocked

**Trigger:** DEV submits BLOCKED claim

**Step 1.** Validate BLOCKED includes specific issue description (not vague)

**Step 2.** Write `escalations/dev-blocked.md` with:
- Specific blocker description
- Files DEV searched
- What DEV tried

**Step 3.** Update `state.md` → phase=PAUSED, pause_type=DEV_BLOCKED

**Step 4.** Output:
```yaml
event: BLOCKED
sprint: [sprint-id]
type: DEV_BLOCKED
phase: [phase]
checkpoint: [N]
issue: [description]
resume: "Sprint-[id] guidance: [instruction]"
```

**Step 5.** END (human provides guidance)

## Escalation: PM Blocked

1. Write `escalations/pm-blocked.md`
2. Update `state.md` → phase=PAUSED, pause_type=PM_BLOCKED
3. Output:
```yaml
event: BLOCKED
sprint: [sprint-id]
type: PM_BLOCKED
phase: [phase]
issue: [description]
resume: "Sprint-[id] guidance: [instruction]"
```
4. END

## Escalation: Circuit Breaker

1. Write `escalations/breaker-tripped.md`
2. Update `state.md` → phase=BLOCKED
3. Output:
```yaml
event: BLOCKED
sprint: [sprint-id]
type: BREAKER
limit: [which limit]
count: [current]/[max]
resume: "Sprint-[id]: reset and continue"
```
4. END

---

## State File Format

```markdown
# Sprint State: [Sprint-Name]

## Sprint Info
- **Sprint ID:** [sprint-id]
- **Goal:** [goal]
- **Started:** [date]
- **Branch:** dev-[sprint-id]

## Current State
- **Phase:** [phase]
- **Checkpoint:** [N]
- **Iteration:** [X]/20

## Circuit Breaker Status
- Total iterations: [X]/20
- Rejections this checkpoint: [X]/3

## Quality Metrics
- **Test coverage:** [%]
- **Linting compliance:** [pass/fail]
- **Security scan:** [pass/fail]
- **Code review:** [pass/fail/pending]

## Last Action
- [timestamp]: [action]

## Next Action
- [action]

## History
- [timestamp]: [action]
```

---

## Resume Patterns

```
Sprint-X.0 UAT: all passed
Sprint-X.0 UAT failed - [reason]
Sprint-X.0 merge: approved
Sprint-X.0 merge: denied - [reason]
Sprint-X.0 guidance: [instruction]
Sprint-X.0 decision: [choice]
Sprint-X.0 hold: [reason]
Sprint-X.0 resume
Sprint-X.0 cancel: [reason]
Sprint-X.0: terminate
```