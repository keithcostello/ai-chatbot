# DEV READY Confirmation

**Sprint:** S2.2-R1
**Timestamp:** 2026-01-23T08:45:16.721Z

---

## BRANCH VERIFICATION (MANDATORY - CHECK FIRST)

Command: `git branch --show-current`
Expected: `dev-sprint-S2.2-R1`
Actual: `dev-sprint-S2.2-R1`
Status: MATCH

---

## Confirmation

- [x] Read CONTEXT.md - Lines 1-685
- [x] Read PROMPT.md - Lines 1-685
- [x] Read dev_role.md - Lines 1-1260
- [x] Understand sprint goal
- [x] Branch verified: dev-sprint-S2.2-R1

---

## ISSUES.md Created

Location: `.claude/sprints/ai-chatbot/sprint-S2.2-R1/ISSUES.md`
Tasks identified: **89 total tasks** across 9 phases (0-8)

---

## Sprint Goal Understanding

**S2.2-R1 delivers:** A working chat interface where users can send messages, receive AI responses that stream back, and have those messages persist across sessions. The key deliverables are:

1. A **Python agent** (new repository: steertrue-chat-agent) using Pydantic AI with `agent.to_ag_ui()` deployed to Railway
2. A **CopilotKit frontend** using official `useCoAgent` hooks and `CopilotChat` component
3. **SteerTrue governance** injected via the Python agent before LLM calls
4. **Database persistence** for conversations and messages using Drizzle ORM
5. **Conversation UI** with sidebar, switching, and authorization

---

## Architecture Understanding

**WHY Python agent + AG-UI is CORRECT:**

S2.2 failed because it used a custom TypeScript agent (`lib/steertrue-agent.ts`) that fought CopilotKit's internals. This caused 6 bugs (BUG-009 through BUG-015) in 2 days:
- Manual RxJS Subject/Observable event handling
- Broken clone() methods
- Custom adapter wrappers overriding framework behavior

**The correct architecture** follows the official CopilotKit + Pydantic AI pattern from https://github.com/CopilotKit/with-pydantic-ai:

```
Next.js Frontend (useCoAgent)
  -> HTTP ->
Python Agent (Pydantic AI + agent.to_ag_ui())
  -> HTTP ->
SteerTrue API (governance)
  -> HTTP ->
LLM Provider (vendor-agnostic via LLM_MODEL env var)
```

**WHY this works:**
1. `agent.to_ag_ui()` exposes the Pydantic AI agent using the AG-UI protocol - CopilotKit's standard event format
2. AG-UI handles all event streaming automatically - no manual RxJS needed
3. `useCoAgent` hook connects to the AG-UI endpoint - no custom adapters needed
4. SteerTrue integration happens in ONE place (Python agent) not spread across TypeScript code

**WRONG (S2.2):** Custom TypeScript agent fighting framework internals
**RIGHT (S2.2-R1):** Python agent using official AG-UI protocol, frontend using official hooks

---

## Files Read (with line citations)

| File | Lines | Key Content |
|------|-------|-------------|
| CONTEXT.md | 1-685 | Architecture decisions (L50-106), Service architecture (L159-217), Database schema (L289-320), Environment variables (L325-343) |
| PROMPT.md | 1-685 | Success criteria (L185-199), Phase definitions (L201-617), Anti-rationalization constraints (L40-71), Skeleton gate (L409-424) |
| dev_role.md | 1-1260 | STOP rule (L133-145), Phase 5 UAT protocol (L829-874), Checkpoint format (L645-695), FIX_REVIEW protocol (L700-823) |

---

## Success Criteria Mapping

| # | Success Criterion | My Task | Phase |
|---|-------------------|---------|-------|
| SC-1 | User can send a message | Create CopilotChat component, verify message sends | Phase 2 |
| SC-2 | AI response streams back | Verify streaming via AG-UI protocol, capture VIDEO | Phase 2 |
| SC-3 | SteerTrue governance injected | Call SteerTrue from Python agent, return blocks_injected | Phase 3 |
| SC-4 | Messages persist in database | Save to messages table, verify with SELECT | Phase 5 |
| SC-5 | Page refresh preserves messages | Load messages on page load, verify after refresh | Phase 5 |
| SC-6 | New conversation works | Implement "New Chat" button, verify empty chat | Phase 6 |
| SC-7 | Python agent on Railway | Deploy steertrue-chat-agent, verify /health | Phase 1 |
| SC-8 | AG-UI protocol working | Use agent.to_ag_ui(), verify useCoAgent receives events | Phase 2 |
| SC-9 | No TypeScript agent exists | DELETE lib/steertrue-agent.ts | Phase 2 |

---

## Phase Breakdown with Time Estimates

| Phase | Name | DEV Action | Estimate |
|-------|------|------------|----------|
| 0 | Architect Consultation | Read agent docs, document patterns | 30 min |
| 1 | Python Agent Setup | Create repo, FastAPI + Pydantic AI, deploy | 60 min |
| 2 | Frontend Connection | CopilotKit provider, CopilotChat, SKELETON GATE | 45 min |
| 3 | SteerTrue Governance | Python API client, inject governance | 30 min |
| 4 | Database Schema | Drizzle schema, push to Railway Postgres | 30 min |
| 5 | Message Persistence | Save/load messages, conversation API | 45 min |
| 6 | Conversation UI | Sidebar, switching, authorization | 45 min |
| 7 | UX Polish | OPTIONAL - typing indicator, timestamps | 30 min |
| 8 | Deployment & UAT | UAT checklist, proof questions | 30 min |

**Total Estimate:** ~5.5 hours (excluding Phase 7 optional)

---

## Risks Identified

| Risk | Mitigation |
|------|------------|
| Pydantic AI `to_ag_ui()` method may not match training data | WebFetch official docs before implementation |
| CopilotKit package versions may differ | Check package.json versions, consult copilot_kit.md agent |
| Railway deployment issues | Use Railway CLI (`railway logs`) for debugging |
| SteerTrue API contract may change | Verify contract in Phase 3 entry checklist |
| Video evidence capture may be difficult | Use OBS or browser recording extension |

---

## File Locations (per PROJECT_STRUCTURE.md)

| Deliverable | Path |
|-------------|------|
| ISSUES.md | `.claude/sprints/ai-chatbot/sprint-S2.2-R1/ISSUES.md` |
| ready.md | `.claude/sprints/ai-chatbot/sprint-S2.2-R1/checkpoints/ready.md` |
| Python agent | NEW REPO: steertrue-chat-agent |
| Frontend chat page | `app/(chat)/page.tsx` |
| CopilotKit provider | `app/layout.tsx` |
| DB schema | `db/schema/conversations.ts`, `db/schema/messages.ts` |
| Conversation API | `app/api/conversations/route.ts` |

---

## Questions/Clarifications

1. **GitHub repository creation:** Should I create `steertrue-chat-agent` in the `keithcostello` GitHub org, or is there a different location?

2. **Railway project linkage:** Should the Python agent be added to the existing Railway project (dev-sandbox) or a new project?

3. **SteerTrue API URL:** CONTEXT.md mentions `STEERTRUE_API_URL` but doesn't specify the value. Which sandbox URL should be used? (dev, keith, or amy per system prompt)

---

## First Task

First task: Phase 0 - Architect Consultation
- Read `.claude/agents/pydantic_architect.md`
- Read `.claude/agents/copilot_kit.md`
- Document key patterns from official docs

---

**STATUS: READY FOR PM REVIEW**

STOP - Awaiting PM approval.
