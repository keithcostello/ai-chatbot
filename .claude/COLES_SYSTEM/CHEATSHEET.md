# SteerTrue Cheatsheet

<!-- AI CONTEXT
WHAT: Use this as your quick reference for ALL processes. When asked "how do I...", look here first.
WHY: Processes are scattered across many files. This consolidates them into one searchable document.
HOW: Present as menu first, then drill-down on selection.

PRESENTATION RULE:
When user asks for cheatsheet or process help:
1. Show the category table below (PROCESSES or REFERENCE)
2. Ask user to select a category for details
3. Only then show the full section content

Do NOT dump entire cheatsheet. Menu first, details on request.
-->

**Single source for all processes and quick reference**
**Last Updated:** 2026-01-19

---

# PROCESSES

The 7-step development lifecycle. Follow in order.

| # | Process | Command | Gate |
|---|---------|---------|------|
| 1 | Discovery & Design | RAT anchoring | PRD ready |
| 2 | Sprint Base Design | Design counsel | Sprints defined |
| 3 | UX Visual Walkthrough | Storyboards | Design gate all ✅ |
| 4 | Pre-sprint | `/pre-sprint` | 6 checks pass |
| 5 | Sprint | `/run-sprint` | Merge approved |
| 6 | Post-sprint | `/closeout-sprint` | 85% criteria |
| 7 | Delivery | `/verify` + `/ship` | PR merged |

---

## Process 1: Discovery & Design

**Trigger:** New project idea

**Method:** RAT (Role, Anchor, Task) anchoring

**Steps:**

1. Anchor AI to industry experts (verifiable links)
Anchoring = AI MUST anchor dataset to task specific related industry experts who can be referenced prior to beginning task. AI must disclose anchor points before beginning task. Anchor must have a referencable link that can be click and verified. AI must PROVE that when it anchors it is NOT using only training data and has read available information to learn and improve output via anchoring. All data provided will be reviewed and must be able to be referenced upon request.
2. Chat until ready to define requirements
3. AI creates PRD/project plan
4. Run through panel to find gaps

**Gate:** Comfortable to define build requirements

**Key docs:**

- `docs/framework/logic_bundles/L4_PROJECT_PLANNING.aipl` (aspirational reference)

---

## Process 2: Sprint Base Design

**Trigger:** PRD completed from Process 1

**Steps:**

1. Run PRD through design counsel
2. Output defines final PRD
3. Break into sprints by type (rapid prototype, full production, simple feature)
4. **Create FEATURE_ROADMAP.md** - Feature dependencies, MVP boundary, context budget
5. **Create MVP_CRITERIA.md** - Ship criteria, success metrics, pivot triggers

**Design Counsel:** `docs/design/mlaia-core/steertrue-architecture-context/`

- 7-section architecture interview
- `PDR_PROMPT.md` - interview prompt (copy to new session)
- `ARCHITECTURE_INTERVIEW.md` - guides the process

**Product Planning Artifacts (Rapid Prototyping):**

- `docs/design/mlaia-core/project/FEATURE_ROADMAP.md` - Feature sequence, dependencies
- `docs/design/mlaia-core/project/MVP_CRITERIA.md` - MVP definition, ship criteria

**Gate:** User confirms all steps complete

---

## Process 3: UX Visual Walkthrough

**Trigger:** Sprints defined from Process 2

**Purpose:** Create **promptframe storyboards** that generate verified PNGs via Nano Banana. Every storyboard must be copy-paste ready for image generation.

**Core Principle:** If you can't generate an image from it, it's not complete.

**Standard Frame:** 1920x1080

**4 Phases:**

| Phase | Name | Steps | Gate |
|-------|------|-------|------|
| A | Screen Inventory | 1 | All screen states identified |
| B | Wireframe Promptframes | 2-4 | Wireframe PNGs verified + human approved |
| C | Visual Promptframes | 5-7 | Visual PNGs verified + human approved |
| D | Sprint Alignment | 8-10 | Design gate all ✅ |

**Steps (with PNG verification):**

1. Extract screen states from Sprint PROMPT.md (S1, S2, S3...)
2. Check for existing wireframe base PNG
3. Create wireframe **promptframe** (includes Nano Banana prompt)
3b. Generate PNG via Nano Banana
3c. Verify PNG matches intent (iterate if wrong)
4. **Wireframe review gate** - Human approves PNG
5. Check for existing visual base PNG
6. Create visual **promptframe** (includes Nano Banana prompt)
6b. Generate PNG via Nano Banana
6c. Verify PNG matches design system (iterate if wrong)
7. **Visual review gate** - Human approves PNG
8. Link promptframes + PNGs to USER_STORIES.md
9. Update Design Gate in PROMPT.md
10. Final design gate review

**Iteration:** If human rejects PNG at step 4 or 7, return to step 3 or 6, update prompt, regenerate.

**Output files:**

```text
docs/design/storyboarding/designx/[area]/phase[N]/sprint-X.Y/
├── S1_[SCREEN]_WIREFRAME.md    # Promptframe (contains Nano Banana prompt)
├── S1_[SCREEN]_WIREFRAME.png   # Verified PNG
├── S1_[SCREEN]_VISUAL.md       # Promptframe (contains Nano Banana prompt)
├── S1_[SCREEN]_VISUAL.png      # Verified PNG
└── ...
```

**Gate:** All promptframes exist, all PNGs verified, PROMPT.md design gate all ✅

**Key docs:**

- `docs/design/storyboarding/UX_VISUAL_WALKTHROUGH_PROCESS.md` (full process v2.1)
- `docs/design/storyboarding/designx/NANO_BANANA_WIREFRAME_TEMPLATE.md` (wireframe template with element IDs)
- `docs/design/storyboarding/designx/VISUAL_STORYBOARD_PROCESS.md` (two-layer methodology)
- `docs/design/storyboarding/designx/steertrue-design-system.yaml` (machine-readable tokens)
- `docs/design/storyboarding/designx/README.md` (folder structure + continuity rules)

---

## Process 4: Pre-sprint

**Trigger:** UX Visual Walkthrough complete (Process 3)

**Steps:**

1. Break phases into microsprints (50% context window rule)
2. Design each microsprint via L4_MICRO_SPRINT_PLANNING.aipl (P0-P12 phases)
3. Run `/pre-sprint [sprint-id]` (6 validation steps)
4. Final protocol check

**Pre-sprint 6 Validation Steps:**

| Step | Persona | Focus |
|------|---------|-------|
| 1 | Systems Integration Engineer | Wiring, config, init sequence |
| 2 | DevOps Engineer | Migration, rollback, secrets |
| 3 | Design Reviewer | Standards, user intent |
| 4 | Adversarial Auditor | Edge cases, attack vectors |
| 5 | Guardian | Safety, compliance |
| 6 | Protocol Validator | All requirements met |

**Gate:** All 6 checks pass

**Key docs:**

- `docs/framework/logic_bundles/L4_MICRO_SPRINT_PLANNING.aipl`
- `.claude/commands/pre-sprint.md`
- `.claude/protocols/SPRINT_PRE_POST_PROTOCOL.md`

---

## Process 5: Sprint

**Trigger:** Pre-sprint passed (Process 4), `/run-sprint [sprint-id] "goal"`

**7 Mandatory Phases:**

| Phase | Name | Owner | Action |
|-------|------|-------|--------|
| 0 | PLANNING | PM | Create PROMPT.md, CONTEXT.md, Sprint Goal, DoD |
| 1 | READY | DEV | ISSUES.md + READY confirmation |
| 2 | N/A Check | Both | Scope verification |
| 3 | EXECUTION | DEV + Code Review | Core implementation → Code quality gate → PM alignment |
| 4 | TESTING | DEV | Deployment verification + tests (fixes go through code review) |
| 5 | UAT | All | DEV tests → PM verifies → Human decides (fixes go through code review) |
| 6 | DOCUMENTATION | DEV | Docs + LESSONS_LEARNED |
| 7 | MERGE GATE | Human | Approve/deny merge |

**Actors:**

- **Orchestrator:** Routes, validates, enforces gates
- **PM:** Plans, reviews alignment, approves checkpoints
- **Code-Reviewer:** Verifies architecture, tests, security, quality (before PM review)
- **DEV:** Executes, tests, documents
- **Human:** UAT and Merge gates

**Quality Gates (V4.2):**

Every code change passes through:
1. **Code-Reviewer** - Architecture compliance, test coverage, security scan, linting
2. **PM** - Sprint alignment, requirements validation

**Circuit Breakers:**

- 20 iterations max (PM sets based on complexity)
- 3 rejections per checkpoint
- 2 same errors = STOP

**Gate:** Phase 7 MERGE_GATE approved

**Key docs:**

- `.claude/commands/run-sprint.md`
- `.claude/agents/code-reviewer.md`
- `.claude/sprints/mlaia/sprint-[id]/CONTEXT.md`
- `.claude/sprints/mlaia/sprint-[id]/state.md`

---

## Process 6: Post-sprint (Closeout)

**Trigger:** Merge approved from Process 5

**Command:** `/closeout-sprint [sprint-id]`

**6 Closeout Phases:**

| Phase | Name | Action |
|-------|------|--------|
| 1 | Micro-Sprint Verification | All microsprints COMPLETE + Human UAT |
| 2 | Success Criteria Validation | >=85% pass rate |
| 3 | Integration Testing | No regressions |
| 4 | Feature Test Documentation | FEATURE_TEST.md (blocking) |
| 5 | Sprint Human UAT | CLOSEOUT.md, await approval |
| 6 | Documentation & Cleanup | Update SPRINT_HISTORY.md, PRODUCT_STATUS.md, TECH_DEBT.md |

**Post-Sprint Protocol Checks:**

- Architecture delta (vs pre-sprint baseline)
- Test suite delta
- Files modified audit
- Consumer handoff test

**Product Tracking (Rapid Prototyping):**

- `PRODUCT_STATUS.md` - Feature completion %, test coverage, MVP criteria status
- `TECH_DEBT.md` - Log shortcuts taken, assign payback sprint

**Gate:** Human UAT approved, >=85% success criteria

**Key docs:**

- `.claude/commands/closeout-sprint.md`
- `.claude/protocols/SPRINT_PRE_POST_PROTOCOL.md`
- `docs/design/mlaia-core/project/PRODUCT_STATUS.md`
- `docs/design/mlaia-core/project/TECH_DEBT.md`

---

## Process 7: Delivery (Ship)

**Trigger:** Closeout approved

**Commands:** `/verify` then `/ship`

**Verify workflow (test -> deploy -> verify):**

1. Run tests locally
2. Deploy to Railway (`railway up`)
3. Verify deployment (status, logs)
4. Test deployed endpoint (curl)
5. Report results

**Ship workflow (commit -> push -> PR):**

1. Review changes (git status/diff/log)
2. Draft commit message
3. Stage and commit (with Co-Authored-By)
4. Push to remote
5. Create PR via `gh pr create`

**Gate:** PR merged to target branch

**Key docs:**

- `.claude/commands/verify.md`
- `.claude/commands/ship.md`

---

# REFERENCE

Supporting material (alphabetical).

---

## Architecture (Blue/Green/Red)

| Layer | Purpose | Can Import |
|-------|---------|------------|
| Blue | Orchestration | Green only |
| Green | Protocols | Nothing |
| Red | Implementations | Green only |

```text
steertrue/
├── blue/    # Orchestration, routing
├── green/   # Protocols, interfaces
└── red/     # Implementations
```

---

## Commands

| Command | Purpose |
|---------|---------|
| `/primer` | Session state recovery |
| `/run-sprint` | Full sprint with PM/DEV agents |
| `/pre-sprint` | Validate sprint readiness |
| `/resume-sprint` | Resume paused sprint |
| `/closeout-sprint` | Sprint closeout process |
| `/ship` | Commit, push, create PR |
| `/verify` | Test -> deploy -> verify cycle |
| `/generate-prp` | Create implementation blueprint |

---

## File Structure

```text
steertrue/
├── .claude/
│   ├── commands/           # Slash commands
│   ├── agents/             # PM, DEV agent definitions
│   ├── sprints/mlaia/      # Sprint folders
│   ├── protocols/          # Process protocols
│   └── COLES_SYSTEM/       # This folder
├── docs/
│   ├── design/             # Design documents
│   ├── handoff/            # Handoff templates
│   ├── framework/          # Logic bundles, AIPL
│   └── processes/          # Process documentation
├── memory/
│   ├── USER.md             # User preferences (gitignored)
│   ├── ai/COMMON_MISTAKES.md
│   └── projects/           # Per-project state
├── steertrue/              # Backend code
│   ├── blue/               # Orchestration
│   ├── green/              # Protocols
│   └── red/                # Implementations
└── CLAUDE.md               # Project rules
```

---

## Guardian Check Commands

```bash
# Red->Red (should be 0)
grep -rn "from steertrue\.red" steertrue/red/ --include="*.py" | wc -l

# Blue->Red excluding dependencies.py (should be 0)
grep -rn "from steertrue\.red" steertrue/blue/ --include="*.py" | grep -v dependencies.py | wc -l

# Green imports anything (should be 0)
grep -rn "from steertrue" steertrue/green/ --include="*.py" | grep -v "from steertrue\.green" | wc -l
```

---

## Handoff Process

**When:** Context at 100%, session ending, need continuity

**Steps:**

1. Read `docs/handoff/HANDOFF_TEMPLATE_V3_FORM.md`
2. Fill all 18 sections
3. Save to `docs/handoff/HANDOFF_[PROJECT]_[SESSION]_V3.md`
4. Commit before session ends

**Key docs:**

- Template: `docs/handoff/HANDOFF_TEMPLATE_V3_FORM.md`
- Section guide: `docs/handoff/HANDOFF_TEMPLATE_V3_SECTION_GUIDE.md`

---

## Memory Files (Project-Aware)

**Global (always loaded):**

| File | Purpose |
|------|---------|
| `memory/USER.md` | User preferences |
| `memory/ai/COMMON_MISTAKES.md` | Patterns to avoid |

**Per-Project (load on selection):**

| File | Purpose |
|------|---------|
| `memory/projects/[project]/WAITING_ON.md` | Current work, blockers |

**Rules:**

- `/primer` scans `memory/projects/` and prompts for project selection
- Default project: `steertrue`
- Before updating WAITING_ON.md, confirm which project
- These files are gitignored - do NOT merge between branches

---

## Railway Environments

| Environment | Branch | Backend URL |
|-------------|--------|-------------|
| Dev | dev | steertrue-sandbox-dev-sandbox.up.railway.app |
| Keith | keith | steertrue-keith-keith-dev.up.railway.app |
| Amy | amy | steertrue-amy-amy-dev.up.railway.app |

**Promotion flow:** dev -> keith -> amy -> master

---

## Rules (from CLAUDE.md)

1. **No Fabrication** - Claims without evidence = termination
2. **No Workarounds** - Workarounds = termination
3. **Pattern Search First** - Search codebase before proposing fixes
4. **Proof at Gates** - Checkpoints require actual output
5. **Branch Policy** - DEV works on `dev-sprint-X.Y.Z`

---

## Session Start

```bash
/primer    # Load context, show current work, get calls to action
```

**What /primer does:**

1. Check for handoff files (`docs/handoff/HANDOFF_*_V3.md`)
2. Load PROJECT_VISION.md, WAITING_ON.md
3. Show current work status + next actions

---

## Troubleshooting

| Problem | Solution |
|---------|----------|
| AI ignores rules | Check CLAUDE.md loaded |
| Command not found | Check `.claude/commands/` |
| Context lost | Run `/primer` |
| Tests failing | Check COMMON_MISTAKES.md |
| Architecture violation | Run guardian checks |

---

## UAT Policy

**UAT = Visual verification on deployed Railway URL.**

| NOT Acceptable | Acceptable |
|----------------|------------|
| "npm run dev works" | "I can see it at Railway URL" |
| "Tests pass locally" | "It shows live backend data" |
| Mock data | Real data from real backend |
| Developer verification | User-centric browser verification |

**Rules:**

- No mock tests
- UAT on deployed Railway, not localhost
- User-centric: "Can I see it in my browser?"

---

**END OF CHEATSHEET**
