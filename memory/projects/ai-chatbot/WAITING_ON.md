# WAITING_ON - ai-chatbot Project

**Last Updated:** 2026-01-23
**Sprint:** S2.2 - CLOSED (FAILED)

---

## Sprint S2.2 Closed

**Status:** FAILED
**Closed:** 2026-01-23
**Root Cause:** Architecture misalignment - Phase 3B skipped, custom TypeScript agent fought CopilotKit internals

---

## Next Sprint Requirements

Successor sprint (S2.3) must use official CopilotKit + Pydantic AI pattern:

```
Next.js (CopilotKit components)
         ↓ HTTP
Python Agent (Pydantic AI + AG-UI protocol)
         ↓
   agent.to_ag_ui()  ← Built-in event handling
```

**Reference:** https://docs.copilotkit.ai/pydantic-ai

---

## Reusable from S2.2

| Component | Location | Reuse |
|-----------|----------|-------|
| DB schema | `db/schema/conversations.ts` | Yes |
| Persistence logic | `lib/persistence.ts` | Adapt |
| Auth integration | `lib/auth.ts` | Yes |
| Conversation API | `app/api/conversations/` | Yes |

---

## What to Remove

| Component | Location | Reason |
|-----------|----------|--------|
| SteerTrueAgent | `lib/steertrue-agent.ts` | Wrong pattern |
| CopilotKit route | `app/api/copilot/route.ts` | Replace with Python integration |

---

## Key Resources

- [CopilotKit Pydantic AI Docs](https://docs.copilotkit.ai/pydantic-ai/)
- [CopilotKit Pydantic AI Starter](https://github.com/CopilotKit/with-pydantic-ai)
- [LESSONS_LEARNED.md](/.claude/sprints/ai-chatbot/LESSONS_LEARNED.md)

---

## Branch State

**Closed Branch:** dev-sprint-S2.2 (DO NOT MERGE)
**Main Branch:** main (unchanged)

---
