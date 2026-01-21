# Project Plan: What/Why/How Audit

<!-- AI CONTEXT
WHAT: Track progress on adding What/Why/How headers to all AI-consumed documents.
WHY: AI sessions are stateless. Documents must be self-explanatory with WHAT to do, WHY it matters, HOW to use it.
HOW: Work through Priority 1 files first. Check off as complete. Update WAITING_ON.md when done.
-->

**Created:** 2026-01-17
**Status:** IN PROGRESS

---

## Problem Statement

AI sessions start with zero context. Telling AI "read file X" without explaining:
- **WHAT** to do with the information
- **WHY** the file exists/matters
- **HOW** to apply the information

...results in AI that reads but doesn't understand.

---

## Solution

Add standardized header to all AI-consumed documents:

```markdown
<!-- AI CONTEXT
WHAT: [Action to take with this file]
WHY: [Context needed to understand the What]
HOW: [How to use/apply the information]
-->
```

---

## Exempt File Types (Already Self-Documenting)

### Commands (.claude/commands/*.md) - EXEMPT

**Structure reviewed:** Commands have embedded What/Why/How via:

- **WHAT** = Frontmatter `name` and `description` fields
- **WHY** = Implicit - user invoked the command
- **HOW** = Command body with detailed instructions

**Example (primer.md):**

```yaml
---
name: primer
description: Session state recovery - load context, show status, provide clear next actions
---
```

**Verdict:** Adding HTML headers would be redundant and could break frontmatter parsing.

---

### Blocks/Logic Bundles (*.aipl) - EXEMPT

**Structure reviewed:** AIPL format is inherently self-documenting:

- **WHAT** = `IDENTITY.role`, `IDENTITY.is/is_not` fields
- **WHY** = `CONTEXT.notes` field explains purpose
- **HOW** = `WORKFLOW`, `ACTIVATION`, `CONSTRAINTS` sections

**Example (fierce_executor/settings.aipl):**

```yaml
IDENTITY:
  role: fierce_executor
  scope: sprint_execution
  is: [enforcer, verifier, binary_decider]

CONTEXT:
  notes: |
    PM/tech lead persona - binary decisions, evidence-based...
```

**Verdict:** AIPL structure provides What/Why/How. Adding HTML comments would be redundant and break AIPL parsing.

---

## Audit Scope (Markdown Documents Only)

### Priority 1: Critical Path (AI reads every session)

| File | Status | Notes |
|------|--------|-------|
| `CLAUDE.md` | ✅ DONE | Rule + header added |
| `.claude/COLES_SYSTEM/CHEATSHEET.md` | ✅ DONE | Header added |
| `memory/USER.md` | ⬜ TODO | Template needed (gitignored) |
| `memory/WAITING_ON.md` | ⬜ TODO | Template needed (gitignored) |
| `memory/ai/COMMON_MISTAKES.md` | ⬜ TODO | Template needed (gitignored) |

### Priority 2: Templates (AI reads when creating from template) - COMPLETE

| File | Status | Notes |
|------|--------|-------|
| `.claude/templates/sprint-tracker-template.md` | ✅ DONE | Header added |
| `.claude/templates/prp-template.md` | ✅ DONE | Header added |
| `.claude/templates/PROMOTION_CHECKLIST.md` | ✅ DONE | Header added |
| `.claude/templates/ROLLBACK_PROCEDURE.md` | ✅ DONE | Header added |
| `docs/handoff/HANDOFF_TEMPLATE_V3_FORM.md` | ✅ DONE | Header added |
| `docs/handoff/HANDOFF_TEMPLATE_V3_SECTION_GUIDE.md` | ✅ DONE | Header added |

### Priority 4: Handoff Documents (AI reads at session start if exists)

| File | Status | Notes |
|------|--------|-------|
| `docs/handoff/HANDOFF_PHASE2_PLANNING_V3.md` | ⬜ TODO | |
| `docs/handoff/HANDOFF_SESSION_6_V3.md` | ⬜ TODO | |
| `docs/handoff/HANDOFF_CHECKLIST_V3.md` | ⬜ TODO | |

### Priority 5: Phase 2 Project Docs (AI reads during Phase 2 work)

| File | Status | Notes |
|------|--------|-------|
| `docs/design/mlaia-core/project/PHASE_2_PLAN_V2.md` | ⬜ TODO | |
| `docs/design/mlaia-core/project/PHASE_2_METHODOLOGY.md` | ⬜ TODO | |
| `docs/design/mlaia-core/project/PHASE_2_INFRASTRUCTURE.md` | ⬜ TODO | |
| `docs/design/mlaia-core/project/PHASE_2_GAP_ANALYSIS.md` | ⬜ TODO | |
| `docs/design/PROJECT_VISION.md` | ⬜ TODO | |

### Priority 6: COLES_SYSTEM (Supporting docs) - COMPLETE

| File | Status | Notes |
|------|--------|-------|
| `.claude/COLES_SYSTEM/README.md` | ✅ DONE | Header added |
| `.claude/COLES_SYSTEM/PROJECT.md` | ✅ DONE | Header added |
| `.claude/COLES_SYSTEM/SOURCES.md` | ✅ DONE | Header added |
| `.claude/COLES_SYSTEM/BEST_PRACTICES_TODO.md` | ✅ DONE | Header added |

### Out of Scope (Archive/Historical)

These files are historical and not actively read by AI:
- `docs/design/mlaia-core/project/PHASE_1_*.md` (completed phase)
- `docs/handoff/HANDOFF_FAILURES_AND_FIXES.md` (reference only)
- `docs/handoff/HANDOFF_WARMUP_EXERCISE.md` (training only)
- `docs/handoff/CHANGELOG.md` (reference only)

---

## Execution Plan

### Sprint A: Critical Path (Priority 1)

- Create USER.md template with header
- Create WAITING_ON.md template with header
- Create COMMON_MISTAKES.md template with header

### Sprint B: Templates (Priority 2) - COMPLETE

- ✅ Add headers to all 6 template files
- ✅ Verify templates still work when used

### Sprint C: Active Docs (Priority 3-4)

- Add headers to handoff documents
- Add headers to Phase 2 project docs

### Sprint D: Cleanup (Priority 6) - COMPLETE

- ✅ Add headers to COLES_SYSTEM docs
- Final review and commit

---

## Success Criteria

- [ ] All Priority 1-5 markdown files have What/Why/How headers
- [ ] New AI session can understand document purpose without prior context
- [ ] No broken functionality from header additions
- [ ] Pattern documented in CLAUDE.md for future documents
- [x] Exemptions documented (commands, blocks)

---

## Notes

- Memory files are gitignored - need templates that users copy
- Some files may need content restructuring, not just headers
- **Commands EXEMPT** - frontmatter provides What/Why/How
- **Blocks/AIPL EXEMPT** - AIPL structure is self-documenting

---

**END OF PROJECT PLAN**
