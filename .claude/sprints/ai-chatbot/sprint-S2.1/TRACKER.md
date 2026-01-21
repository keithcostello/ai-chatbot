<!-- AI CONTEXT
WHAT: Read this to understand decisions and discussions from prior sessions for Sprint S2.1.
WHY: AI sessions are stateless. This tracker persists decisions/discussions across sessions.
HOW: Check Open Questions first. Reference Decision Log. Update Discussion History each session.
-->

# Sprint S2.1 Tracker - Authentication Foundation

## Status: READY_FOR_PRESPRINT

**Last Updated:** 2026-01-21
**Updated By:** Session 33 (Opus 4.5)

---

## WHAT: Actions Required

| When | Action |
|------|--------|
| Session start | READ this file via `/primer` |
| Before asking user | CHECK Open Questions table - may already be answered |
| During session | LOG decisions to Decision Log table |
| Before session end | UPDATE Discussion History with session summary |

---

## WHY: Context

**Problem:** AI sessions are stateless. Each session starts fresh with no memory of prior discussions.

**Consequences without this document:**
- User repeats same answers to same questions
- Decisions made in Session A are unknown to Session B
- Planning work lost, user frustrated

---

## Decision Log

Captures WHY decisions were made. Required reading for session continuity.

| Date | Decision | Options Considered | Rationale | Decided By |
|------|----------|--------------------|-----------|------------|
| 2026-01-21 | Separate database for ai-chatbot | 1) Shared DB with SteerTrue 2) Separate DB | Security isolation (credentials vs governance), independent scaling, multi-tenancy ready | Keith |
| 2026-01-21 | Auth.js with httpOnly cookies | 1) JWT in localStorage 2) Session cookies 3) Auth.js | Enterprise-ready, XSS-resistant, successor to NextAuth.js | Keith |
| 2026-01-21 | Branded signup (split-page layout) | 1) Minimal centered form 2) Branded split-page | User preference for branded experience | Keith |
| 2026-01-21 | Include role field from Day 1 | 1) Add role later (Day 6) 2) Add now | Prep for admin separation, avoid migration later | Keith |
| 2026-01-21 | Add display_name + avatar_url fields | 1) Minimal schema 2) Extended profile | User preference for profile features | Keith |
| 2026-01-21 | Agent consultation NOT required Day 1 | 1) Consult pydantic_architect 2) Skip | Auth is Next.js native (Auth.js), not Pydantic AI or CopilotKit | Session 33 |

---

## Discussion History

### Session 33 (2026-01-21) - Sprint Context Process + Requirements

**Discussed:**

- AI was designing sprint without proper context (PRD too large)
- Created SPRINT_CONTEXT_TEMPLATE.md (12 sections)
- Updated pre-sprint.md to require CONTEXT.md (blocking)
- Database architecture: separate vs shared
- Auth approach: Auth.js vs JWT vs custom
- Signup design: branded vs minimal
- Users table schema: which fields to include
- Railway setup: existing services, environments needed

**Conclusion:** Sprint S2.1 folder created with CONTEXT.md and PROMPT.md. Ready for /pre-sprint validation.

---

## Open Questions

Questions that need resolution before sprint can proceed.

| # | Question | Status | Resolved |
|---|----------|--------|----------|
| 1 | Separate database for ai-chatbot? | RESOLVED | Yes - security isolation |
| 2 | Auth approach? | RESOLVED | Auth.js with httpOnly cookies |
| 3 | Signup design? | RESOLVED | Branded split-page layout |
| 4 | Include role field Day 1? | RESOLVED | Yes |
| 5 | Additional profile fields? | RESOLVED | display_name, avatar_url |
| 6 | Where does frontend code live? | RESOLVED | keithcostello/ai-chatbot repo |
| 7 | Which Railway environments? | RESOLVED | dev-sandbox, keith-dev, amy-dev |

---

## Context Links

Key documents for this sprint.

| Document | Purpose |
|----------|---------|
| CONTEXT.md | Sprint-scoped context (architecture, schema, APIs, design) |
| PROMPT.md | Success criteria, phases, UAT checklist |
| PRD_V1.md | Full PRD (reference only - CONTEXT.md has extracts) |
| REQUIREMENTS_MAP.md | C-01, I-04, I-05 requirements |
| chat_visual_v.01.md | Color palette, typography |

---

## Anchors (Industry References)

| Source | Topic | Link |
|--------|-------|------|
| Auth.js | Next.js authentication | https://authjs.dev/ |
| Drizzle ORM | TypeScript ORM | https://orm.drizzle.team/ |
| Railway | Deployment platform | https://docs.railway.com/ |

---

**Template Version:** 1.0
**Created:** 2026-01-21
**Purpose:** Cross-session continuity for Sprint S2.1
