<!-- AI CONTEXT
WHAT: Track Cole's system adoption progress. Status is COMPLETE - adoption finished.
WHY: Documents decisions made during adoption, what was kept vs skipped.
HOW: Read for historical context. Key outputs: PROJECT_VISION.md and primer.md command.
-->

# Cole's System Adoption Project

**Created:** 2026-01-16
**Owner:** Keith Costello
**Status:** In Progress - Doc Organization Phase

---

## Goal

Adopt Cole Medin's context engineering patterns for SteerTrue development workflow:
- Clean context loading per session
- Structured planning docs (PRD/PRP)
- Commandified workflows

---

## Key Findings

### Finding 1: Cole's System Scope
Cole's system is **FEATURE-LEVEL** (per-task blueprints). SteerTrue needs **PROJECT-LEVEL** vision doc first.

Cannot create `/primer` that loads PRD until docs are organized and vision doc exists.

### Finding 2: Two Documentation Categories

SteerTrue has TWO distinct documentation sets - do NOT conflate them:

| Category | Location | Purpose | Audience | Lifecycle |
|----------|----------|---------|----------|-----------|
| **Design Docs** | `docs/design/*` | What to build, vision, architecture | Architects, planners | KEEP → OLD → archive when done |
| **Operational Docs** | `steertrue/docs/*` | How to use what's built | Developers, operators | Lives with code, evolves |

**Rule:** `steertrue/docs/*` is PRODUCT DOCUMENTATION ONLY. It stays with the code and is maintained as the product evolves. It is NOT part of the design doc review.

**Docs 17-18 Status:** OUT OF SCOPE for KEEP/OLD/DONE categorization. They are operational docs.

---

## Current Phase: Doc Organization

Reviewing 18 docs to categorize as KEEP/OLD/DONE before synthesizing project vision.

### Progress

| Status | Count | Docs |
|--------|-------|------|
| Reviewed | 16 | 1-9, 15-16 |
| Out of Scope | 3 | 10 (spec), 17-18 (operational) |

### Findings

| Doc | Status | Role |
|-----|--------|------|
| 1 ROADMAP | KEEP | Sprint plan for chat platform |
| 2 CHAT_PROJECT | KEEP | Implementation spec for GUI vision |
| 3 CORE_V2 | KEEP | Backend API/engine spec |
| 4 ADMIN_UI_V2 | KEEP | Admin area (separate UI surface) |
| 5 PHASE_1_1.5_SUMMARY | KEEP | AI quick-load doc, /primer candidate |
| 6 ARCH_VISUAL | OLD | Visuals useful, roadmap stale |
| 7 WORKFLOW_VISUAL | KEEP | Comprehensive technical reference (current) |
| 8 TECHNICAL_DESIGN | KEEP | Codebase inventory, architecture analysis |
| 9 VISUAL_DESIGN | KEEP | .claude orchestration + UI analysis |
| 10 AIPL_SPEC | OUT OF SCOPE | Specification doc (framework reference) |
| 11 CONTEXT_WINDOW | OLD | JARVIS-era future vision (Nov 2025) |
| 12 FRAMEWORK_ENFORCE_1 | OLD | JARVIS-era VSCode extension design |
| 13 FRAMEWORK_ENFORCE_V2 | OLD | JARVIS-era hybrid Python/TS design |
| 14 PROJECT_OVERSIGHT | OLD | JARVIS-era multi-project vision |
| 15 ENGINE_DESIGN | OLD | Superseded by CORE_V2 |
| 16 GUI_VISION | KEEP | UX philosophy / design north star |

### Summary

| Category | Count | Docs |
|----------|-------|------|
| **KEEP** | 10 | 1, 2, 3, 4, 5, 7, 8, 9, 16 |
| **OLD** | 5 | 6, 11, 12, 13, 14, 15 |
| **OUT OF SCOPE** | 3 | 10, 17, 18 |

**Key Insight:** Docs 11-14 are in `docs/future_improvements/` - all from JARVIS 1.0 era (Nov 2025). SteerTrue has evolved past these designs.

---

## Architecture Clarified

Two UI surfaces, three access levels:

```
USER-FACING AI OS (Docs 2, 16)
├── Chat pane (constant)
└── Dynamic frame (context-dependent)
    ├── Tiles/dashboard
    ├── Visual workflow (power user)
    ├── Settings panel
    └── Quick actions (email, etc.)

ADMIN AREA (Doc 4) - SEPARATE
├── Dedicated admin interface
├── Own chat component for config
└── Block management, audit logs

BACKEND (Doc 3)
└── Serves both UI surfaces
```

---

## Doc Relationships

```
Doc 16 (GUI_VISION)     = UX philosophy / design north star
        ↓ realized by
Doc 2 (CHAT_PROJECT)    = Implementation spec
        ↓ planned by
Doc 1 (ROADMAP)         = Sprint stages

Doc 4 (ADMIN_UI)        = Separate admin surface
Doc 3 (CORE)            = Backend serving all
```

---

## Blocked On

~~1. Complete doc review~~ ✅ DONE (2026-01-16)
~~2. Identify what can be archived vs kept~~ ✅ DONE

**Next blockers:**
1. Create PROJECT_VISION.md synthesizing the 10 KEEP docs + sprint findings
2. Adapt /primer to load vision doc

---

## Sprint Review Findings (2026-01-16)

Reviewed all sprint documentation to establish ground truth.

### Phases Completed

| Phase | Duration | Sprints | Status |
|-------|----------|---------|--------|
| Phase 1 | Nov 2024 - Dec 2025 | ~75 | ✅ COMPLETE (2025-12-28) |
| Phase 1.5 | Jan 6-15, 2026 | 10 | ✅ COMPLETE (2026-01-15) |
| Phase 2 | Planned | 10 | ⏳ NOT STARTED |

### What's Built

**Backend Engine:**
- REST API (Blue/Green/Red architecture)
- PostgreSQL persistence (9 tables)
- Decay-based injection (4 presets)
- Block relationships (requires, implies, mutual_exclusive)
- 527 tests passing

**27 Production Blocks:** L1(5), L2(6), L3(5), L4(8), L5-L7(3)

**Phase 1.5 Additions:**
- Lock field (FLOOR/CEILING)
- Vendor abstraction (Anthropic + OpenAI)
- Cost tracking, Custom content injection

### What's NOT Built (Phase 2)

- Admin UI
- Bidirectional compliance loop
- Redis caching
- Prometheus metrics
- CI/CD pipeline

### Key Docs for Vision

| Location | Purpose |
|----------|---------|
| `PHASE_1_CLOSEOUT_REPORT.md` | Phase 1 details (75 sprints) |
| `PHASE_1.5_CLOSEOUT.md` | Phase 1.5 details (10 sprints) |
| `PHASE_2_PLAN.md` | Next phase scope |

---

## Files in This Folder

| File | Purpose |
|------|---------|
| PROJECT.md | This file - tracks adoption project |
| README.md | Cole's system analysis |
| SOURCES.md | Research references |
| BEST_PRACTICES_TODO.md | Patterns to implement later |

---

## Next Actions

1. ~~Review remaining design docs: 5, 10-14~~ ✅ DONE
2. ~~Update findings table~~ ✅ DONE
3. ~~Create PROJECT_VISION.md synthesizing 10 KEEP docs~~ ✅ DONE (2026-01-16)
4. ~~Refine /primer command to load vision~~ ✅ DONE (2026-01-16)

**Status:** ADOPTION COMPLETE

**Files Created:**
- `docs/design/PROJECT_VISION.md` - Stable project reference (phase boundary updates only)
- `.claude/commands/primer.md` - Session initializer (loads PROJECT_VISION.md + WAITING_ON.md)

---

## References

- Cole's repo: `C:\PROJECTS\SINGLE PROJECTS\dev_pm_branch_v2`
- Full doc review: `memory/WAITING_ON.md` (CURRENT section)
- Cole's README: `.claude/COLES_SYSTEM/README.md`
