# Sprint S2.2-R1 Tracker

## Status: PRE-SPRINT

**Last Updated:** 2026-01-24
**Updated By:** Claude Opus 4.5

---

## Decision Log

| Date | Decision | Options Considered | Rationale | Decided By |
|------|----------|--------------------|-----------|------------|
| 2026-01-24 | Use official CopilotKit + Pydantic AI pattern | A: Official pattern, B: Strip CopilotKit, C: Fix bugs | S2.2 had 6 bugs from fighting framework | Keith |
| 2026-01-24 | Python agent with AG-UI protocol | TypeScript custom agent, Python AG-UI | TypeScript approach failed in S2.2 | Keith |
| 2026-01-24 | Mark S2.2 as FAILED | Revise S2.2, Create S2.3 | Need clean break, revised architecture | Keith |
| 2026-01-24 | Defer accessibility to S2.3 | A: Include in S2.2-R1, B: Defer | Core functionality first, documented gap | Keith |
| 2026-01-24 | Add copy/paste/model selection | A: Include 20,21,23, B: All, C: None | Standard chat features, low complexity | Keith |
| 2026-01-24 | Defer file/image/search to S2.3 | A: Include, B: Defer | Backend complexity, API integrations | Keith |
| 2026-01-24 | Response timeout: 60s | 30s/60s/90s | Balance between patience and feedback | Keith |
| 2026-01-24 | Message history: 50 | 20/50/100 | Performance vs context balance | Keith |
| 2026-01-24 | Max message: 8000 (adjustable) | 4000/8000/unlimited | Reasonable default with flexibility | Keith |

---

## Discussion History

### Session 2026-01-24 (Sprint Redesign)

**Discussed:**
- Reviewed S2.2 failure (6 bugs from architecture misalignment)
- Analyzed official CopilotKit + Pydantic AI pattern
- Decided on Option A: Rebuild with official pattern
- Created S2.2-R1 as revision sprint

**Key Findings:**
- S2.2 skipped Phase 3B (Python + Pydantic AI)
- Custom TypeScript agent fought CopilotKit internals
- Official pattern uses `agent.to_ag_ui()` for AG-UI protocol
- Official pattern uses `useCoAgent` hook on frontend

**Conclusion:** S2.2 marked FAILED. S2.2-R1 created with correct architecture.

---

## Open Questions

| # | Question | Status | Answer |
|---|----------|--------|--------|
| 1 | Does pydantic-ai support to_ag_ui()? | OPEN | Verify in Phase 0 |
| 2 | CopilotKitSDK vs direct AG-UI? | OPEN | Verify in Phase 0 |

---

## Deferred Items (S2.3)

### Accessibility (WCAG Compliance)
- Stories 7-10 deferred from S2.2-R1
- Covers: WCAG 2.1.1 (keyboard), 2.4.7 (focus), 1.3.1 (screen reader), 1.4.3 (contrast)
- **MUST implement in S2.3 before public release**

### Standard Chat Features
- Story 18: File upload (PDF, TXT, MD, CSV, JSON)
- Story 19: Image upload (PNG, JPG, GIF, WEBP) - requires Vision API
- Story 22: Web search integration - requires search API

### Research Gap Lesson
Step 1.25 searched "chat interface best practices" (UX patterns) but missed "AI chat product features" (ChatGPT/Claude capabilities). Future research should include competitor feature analysis.

---

## Context Links

| Document | Purpose |
|----------|---------|
| PROMPT.md | Sprint execution with gate checklists |
| CONTEXT.md | Architecture decisions (correct vs wrong) |
| SPRINT_HISTORY.md | S2.2 failure record |
| https://github.com/CopilotKit/with-pydantic-ai | Official pattern reference |

---

## Anchors

| Source | Topic | URL |
|--------|-------|-----|
| CopilotKit + Pydantic AI | Official Template | https://github.com/CopilotKit/with-pydantic-ai |
| Pydantic AI Docs | Agent API | https://ai.pydantic.dev/agents/ |
| CopilotKit Docs | CoAgents | https://docs.copilotkit.ai/coagents |

---

**Template Version:** 1.0
