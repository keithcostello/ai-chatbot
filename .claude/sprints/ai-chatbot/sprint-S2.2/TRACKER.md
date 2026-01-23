# Sprint S2.2 Tracker - Chat Core

## Status: PHASE 2 COMPLETE

**Last Updated:** 2026-01-22
**Updated By:** Claude Opus 4.5 (Session 37ff9a67)

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

**PM Methodology Basis:**
- [PMI PMBOK](https://www.pmi.org/standards/pmbok): Centralized decision documentation
- [Agile Decision Log](https://www.meegle.com/en_us/advanced-templates/sprint_planning/agile_decision_log_template): Context + rationale + outcomes

---

## HOW: Usage Instructions

1. **Open Questions** - Check BEFORE asking user anything. If question exists with RESOLVED status, use that answer.
2. **Decision Log** - When user makes a decision, add row with date, decision, options considered, rationale, who decided.
3. **Discussion History** - Add session entry with date, topic, what was discussed, conclusion reached.
4. **Context Links** - Reference these docs during sprint work. Don't search for docs that are already linked.

---

## Decision Log

Captures WHY decisions were made. Required reading for session continuity.

| Date | Decision | Options Considered | Rationale | Decided By |
|------|----------|--------------------|-----------|------------|
| 2026-01-21 | Pydantic AI for ALL LLM calls | Pydantic AI, LangChain, Direct API | Structured outputs, governance injection, multi-model | Keith (PRD) |
| 2026-01-21 | CopilotKit for chat UI | CopilotKit, Vercel AI SDK, Custom | React components, streaming, CoAgents | Keith (PRD) |
| 2026-01-21 | Same DB as auth (ai-chatbot Postgres) | Separate chat DB, Shared DB | Already provisioned, simpler | Architecture |
| 2026-01-22 | Walking skeleton approach | Full build, Incremental | Prove integration early, reduce risk | Sprint design |

---

## Discussion History

Captures cross-session discussions. Prevents re-asking same questions.

### Session 2026-01-22 (Sprint Creation)

**Discussed:**

- Created CONTEXT.md with Day 3-4 scope
- Created PROMPT.md with success criteria
- Defined database schema for conversations + messages
- Mapped API contracts for chat endpoints

**Conclusion:** Sprint artifacts ready for pre-sprint validation

---

### Session 2026-01-22 (Phase 2 Implementation & UAT)

**Discussed:**

- Investigated subagent SteerTrue header compliance issue
- Found: Hook injects governance correctly, subagents receive it, but headers not displayed in output
- Filed GitHub issue #20190 with Anthropic
- Completed Phase 2 UAT with agent-browser
- Created test account: `uat-test-s2.2@steertrue.test`
- Captured evidence: screenshots + streaming video

**Phase 2 Results:**
- Chat page deployed at /chat
- POST /api/chat endpoint working with Anthropic SDK
- GET /api/health returns `{"status":"healthy","database":"connected"}`
- Streaming response verified via video capture

**Conclusion:** Phase 2 COMPLETE. Ready for Phase 3A (SteerTrue Governance Integration)

---

## Open Questions

Questions that need resolution before sprint can proceed.

| # | Question | Status | Resolved |
|---|----------|--------|----------|
| 1 | CoAgents vs direct API for Pydantic AI integration? | OPEN | Needs architect consultation |
| 2 | Streaming SSE vs WebSocket for chat responses? | RESOLVED | SSE (CopilotKit default) |
| 3 | Auto-generate conversation titles? | RESOLVED | Defer to S2.3 - manual only |

---

## Context Links

Key documents for this sprint.

| Document | Purpose |
|----------|---------|
| PROMPT.md | Sprint definition (success criteria, phases, UAT) |
| CONTEXT.md | Sprint-scoped context (schema, APIs, design refs) |
| `.claude/agents/pydantic_architect.md` | Pydantic AI patterns |
| `.claude/agents/copilot_kit.md` | CopilotKit patterns |
| `memory/projects/steertrue-audit/PRD_V1.md` | Full requirements |

---

## Anchors (Industry References)

Per ANCHOR requirement: Verifiable expert references, not just training data.

| Source | Topic | Link |
|--------|-------|------|
| Pydantic AI Docs | Agent patterns | https://ai.pydantic.dev/ |
| CopilotKit Docs | React components | https://docs.copilotkit.ai/ |
| Auth.js v5 | Session handling | https://authjs.dev/ |
| Drizzle ORM | Schema definition | https://orm.drizzle.team/ |

---

**Template Version:** 1.0
**Created:** 2026-01-22
**Purpose:** Cross-session continuity for sprint S2.2
