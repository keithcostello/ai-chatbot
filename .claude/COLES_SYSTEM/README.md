<!-- AI CONTEXT
WHAT: Reference this when implementing context engineering patterns (PRPs, /primer, /generate-prp).
WHY: Cole's patterns inform SteerTrue's planning workflow. Understanding his system prevents reinventing.
HOW: Read for background. Apply PRP structure to sprint PROMPT.md. Use validation loop concept.
-->

# Cole Medin's Context Engineering System

**Source:** [context-engineering-intro](https://github.com/coleam00/context-engineering-intro)
**Local Clone:** `C:\PROJECTS\SINGLE PROJECTS\dev_pm_branch_v2`
**Video:** YouTube ttdWPDmBN_4
**Analyzed:** 2026-01-16

---

## Overview

A context management workflow focused on keeping the LLM's context window clean and structured. Core principle: **"The AI agent only gets the context you append - protect the context window."**

**Goal:** One-pass implementation success through comprehensive context.

---

## Key Insight: FEATURE-LEVEL, Not PROJECT-LEVEL

Cole's system is designed for **per-feature planning**, not project-wide vision documents.

| Cole's Term | What It Is | What It Is NOT |
|-------------|------------|----------------|
| `INITIAL.md` | Per-feature brief (4 sections) | Project-wide PRD |
| `/primer` | Context loader (CLAUDE.md, README, tree) | PRD loader |
| `PRP` | Implementation blueprint (comprehensive) | Planning doc |
| `/generate-prp` | Transforms INITIAL → PRP via research | - |

---

## Cole's File Structure

```
project/
├── INITIAL.md              # Feature definition (user writes)
├── INITIAL_EXAMPLE.md      # Example feature definition
├── CLAUDE.md               # Global rules (lightweight)
├── README.md               # Project documentation
├── PRPs/
│   ├── templates/
│   │   └── prp_base.md     # PRP template
│   └── {feature-name}.md   # Generated blueprints
└── .claude/
    └── commands/
        ├── primer.md       # Context loading
        ├── generate-prp.md # Blueprint creation
        └── execute-prp.md  # Implementation (Phase 2)
```

---

## INITIAL.md Template (Cole's "PRD")

Simple 4-section feature brief:

```markdown
## FEATURE:
[Insert your feature here]

## EXAMPLES:
[Provide and explain examples in examples/ folder]

## DOCUMENTATION:
[List docs/URLs needed during development]

## OTHER CONSIDERATIONS:
[Gotchas, specific requirements, common AI mistakes]
```

**Note:** This is per-FEATURE, not project-wide. Each task gets its own INITIAL.md.

---

## PRP Template Structure

The PRP (Product Requirements Prompt) is the comprehensive implementation blueprint:

| Section | Purpose |
|---------|---------|
| Goal | What needs to be built (specific end state) |
| Why | Business value, integration, problems solved |
| What | User-visible behavior, technical requirements |
| Success Criteria | Specific measurable outcomes (checkboxes) |
| Documentation & References | URLs, files, patterns to follow |
| Current Codebase tree | Output of `tree` command |
| Desired Codebase tree | Files to be added with responsibilities |
| Known Gotchas | Library quirks, version issues, critical notes |
| Data Models | Pydantic models, ORM models, schemas |
| Task List | Ordered tasks with MODIFY/CREATE instructions |
| Pseudocode | Per-task pseudocode with CRITICAL details |
| Integration Points | Database, config, routes changes |
| Validation Loop | 3 levels: Syntax, Unit Tests, Integration |
| Final Checklist | All gates that must pass |
| Anti-Patterns | What NOT to do |
| Confidence Score | 1-10 rating for one-pass success |

---

## /primer Command

**Purpose:** Load codebase context at conversation start.

**What it does:**
1. Run `tree` to understand project structure
2. Read CLAUDE.md (global rules)
3. Read README.md (project documentation)
4. Read key files in src/ or root
5. Explain back: structure, purpose, key files, dependencies, config

**What it does NOT do:**
- Load a project-wide PRD
- Define what to build next
- Make decisions about features

---

## /generate-prp Command

**Purpose:** Transform feature brief into implementation blueprint.

**Input:** `$ARGUMENTS` = path to INITIAL.md or feature file

**Process:**
1. Read feature file to understand requirements
2. **Codebase Analysis:** Search for similar patterns, identify files to reference
3. **External Research:** Library docs, implementation examples, best practices
4. **User Clarification:** If needed, ask about patterns/integration
5. **ULTRATHINK:** Plan approach before writing
6. Output comprehensive PRP using template

**Output:** `PRPs/{feature-name}.md`

**Key principle:** "The AI agent only gets the context you are appending to the PRP and training data."

---

## Workflow

```
1. Write INITIAL.md       → Define feature (simple 4-section brief)
2. /primer                → Load codebase context
3. Conversation           → Discuss and refine understanding
4. /generate-prp INITIAL.md → Research + output comprehensive blueprint
5. /clear                 → Reset context (manual)
6. /execute-prp           → Implement from blueprint only (Phase 2)
```

---

## Validation Loop (3 Levels)

### Level 1: Syntax & Style
```bash
ruff check src/ --fix
mypy src/
```

### Level 2: Unit Tests
```bash
pytest tests/ -v
# If failing: Read error, understand root cause, fix code, re-run
```

### Level 3: Integration Test
```bash
# Start service and test endpoints
# Manual verification of expected behavior
```

---

## Integration with SteerTrue

### What SteerTrue Can Adopt

| Pattern | How to Apply |
|---------|--------------|
| PRP template | Use for sprint PROMPT.md generation |
| Validation loops | Add to sprint workflow |
| "Context is King" | Ensure comprehensive context in sprint docs |
| Confidence scoring | Add to sprint planning |

### What SteerTrue Still Needs (Cole Doesn't Provide)

| Need | Why |
|------|-----|
| PROJECT-LEVEL vision doc | Cole's INITIAL.md is per-feature only |
| Doc organization by department | Cole starts fresh, we have existing docs |
| Integration with sprint system | Different workflow paradigm |

### Complementary Usage

- **Sprint system** (`/run-sprint`): Major features, multi-agent, governance
- **PRP workflow** (`/primer` + `/generate-prp`): Single-session, focused work

---

## Core Concepts

| Concept | Description |
|---------|-------------|
| **Context is King** | Include ALL necessary documentation, examples, caveats |
| **One-Pass Success** | Goal is implementation success without iteration |
| **Validation Loops** | Executable tests AI can run and fix |
| **Commandify** | Any prompt used >2x becomes a reusable command |
| **System Evolution** | Bugs fix the system (rules/commands), not just the code |

---

## References

- [coleam00/context-engineering-intro](https://github.com/coleam00/context-engineering-intro)
- Local clone: `C:\PROJECTS\SINGLE PROJECTS\dev_pm_branch_v2`
