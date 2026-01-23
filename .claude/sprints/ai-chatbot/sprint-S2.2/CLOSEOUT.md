# Sprint S2.2 Closeout

**Status:** FAILED
**Closed:** 2026-01-23
**Duration:** 2026-01-22 to 2026-01-23

---

## Sprint Goal

User can send chat messages and get AI responses with conversation persistence.

---

## Outcome

**FAILED** - Architecture misalignment caused 6 bugs from fighting framework internals.

---

## What Was Built

| Component | Status | Notes |
|-----------|--------|-------|
| Database schema (conversations, messages) | ✅ Built | Reusable |
| Custom TypeScript SteerTrueAgent | ❌ Remove | Wrong pattern |
| Manual RxJS event handling | ❌ Remove | Wrong pattern |
| Message persistence layer | ⚠️ Partial | Logic reusable, integration wrong |
| Conversation API endpoints | ⚠️ Partial | Logic reusable |

---

## Bugs Encountered

| Bug | Root Cause |
|-----|------------|
| BUG-009 | CopilotKit bypasses adapter |
| BUG-010 | Missing serviceAdapter |
| BUG-011 | `this` context lost |
| BUG-012 | Agent clone loses properties |
| BUG-013 | RUN_STARTED event lost |
| BUG-015 | Conversation creation failing |

All bugs are symptoms of fighting CopilotKit's internal architecture.

---

## Root Cause Analysis

1. **CONTEXT.md specified Phase 3B:** Python FastAPI + Pydantic AI
2. **Phase 3B was skipped** - Jumped from 3A directly to Phase 4
3. **Custom TypeScript agent built** instead of using official pattern
4. **Bugs cascaded** as implementation fought framework internals

---

## What Should Have Been Done

**Official CopilotKit + Pydantic AI pattern:**

```
Next.js (CopilotKit components)
         ↓ HTTP
Python Agent (Pydantic AI + AG-UI protocol)
         ↓
   agent.to_ag_ui()  ← Built-in event handling
```

Reference: https://docs.copilotkit.ai/pydantic-ai

---

## Reusable Work

| Item | Location | Reuse in S2.3 |
|------|----------|---------------|
| DB schema | `db/schema/conversations.ts` | Yes |
| Persistence logic | `lib/persistence.ts` | Adapt for Python |
| Auth integration | `lib/auth.ts` | Yes |
| Conversation API | `app/api/conversations/` | Yes |

---

## Lessons Learned

Added to `LESSONS_LEARNED.md`:

- **L14:** Use Official Framework Patterns, Not Custom Implementations
- **L15:** Phase Skipping Is Sprint Failure
- **AP7:** "Build Custom Instead of Use Official"
- **PG9:** No Architecture Review Against Official Docs

---

## Successor Sprint

**S2.3** (or renamed sprint) must:

1. Follow official CopilotKit + Pydantic AI pattern
2. Implement Python agent with `agent.to_ag_ui()`
3. Use `useCoAgent` hook on frontend
4. SteerTrue injects into Python agent's system prompt
5. Review architecture against official docs BEFORE implementation

---

## Commits (Not Merged)

| Commit | Description | Status |
|--------|-------------|--------|
| c230e6f | signIn error handling | Not pushed |
| d24ad2b | Auth logging | Not pushed |
| Earlier commits | Phase 1-5 work | On dev-sprint-S2.2 branch |

**Branch:** `dev-sprint-S2.2` - Do not merge to main.

---

**END OF CLOSEOUT**
