# DEV READY Confirmation

**Sprint:** S2.2
**Timestamp:** 2026-01-22T10:45:00Z
**Branch:** dev

---

## BRANCH VERIFICATION (MANDATORY - CHECK FIRST)

Command: `git branch --show-current`
Expected: `dev`
Actual: `dev`
Status: MATCH

---

## Confirmation

- [x] Read CONTEXT.md (Lines 1-823 - full file)
- [x] Read PROMPT.md (Lines 1-745 - full file)
- [x] Read PROJECT_STRUCTURE.md (Lines 1-242 - full file)
- [x] Read dev_role.md (Lines 1-1260 - full file)
- [x] Understand sprint goal: User can send chat messages and get AI responses with conversation persistence
- [x] Branch verified: dev

---

## ISSUES.md Created

Location: `.claude/sprints/ai-chatbot/sprint-S2.2/ISSUES.md`
Tasks identified: **69 issues** across 10 phases (plus Phase 0)

---

## Key Understanding

### Sprint Goal
User can send chat messages, get AI responses, and messages persist across sessions.

### Architecture (from CONTEXT.md Lines 36-93)

| Phase | Architecture | Purpose |
|-------|--------------|---------|
| Skeleton (Phase 2) | Next.js -> Anthropic SDK -> Anthropic API | Prove end-to-end works |
| Governance (Phase 3A) | Add SteerTrue /api/v1/analyze call | Inject governance into skeleton |
| Flesh (Phase 3B) | Next.js -> Python FastAPI + Pydantic AI -> Anthropic API | Structured output, agent patterns |

### Critical Gates

1. **SKELETON GATE (Phase 2):** Video evidence of streaming REQUIRED before Phase 3A/3B
2. **Walking Skeleton Methodology:** Build minimal end-to-end first, add flesh incrementally
3. **Phase 3B is FLESH:** Python microservice added only after skeleton proven working

### Deliverables (from CONTEXT.md Lines 16-28)

| # | Deliverable | Type | Day |
|---|-------------|------|-----|
| 1 | POST /api/chat endpoint | API | 3 |
| 2 | CopilotKit chat interface | UI | 3 |
| 3 | Pydantic AI agent | Backend | 3 |
| 4 | conversations table | DB | 4 |
| 5 | messages table | DB | 4 |
| 6 | GET /api/conversations | API | 4 |
| 7 | POST /api/conversations | API | 4 |
| 8 | GET /api/conversations/{id}/messages | API | 4 |
| 9 | Message persistence | Feature | 4 |

### Success Criteria Count

- Core Functionality: SC-1 through SC-10 (10 criteria)
- UX Features (Step 1.75 Gaps): SC-11 through SC-19 (9 criteria)
- **Total: 19 success criteria**

---

## Success Criteria Mapping (1:1)

| # | Success Criterion | My Task | Phase |
|---|-------------------|---------|-------|
| SC-1 | User can send a message | Create chat input, wire to /api/chat | Phase 2 |
| SC-2 | AI response streams back | Implement SSE streaming | Phase 2 |
| SC-3 | SteerTrue governance injected | Call /api/v1/analyze, use system_prompt | Phase 3A |
| SC-4 | Messages persist in database | Save to messages table | Phase 5 |
| SC-5 | Conversations table exists | Create db/schema/conversations.ts, migrate | Phase 1 |
| SC-6 | Messages table exists with FK | Create db/schema/messages.ts, migrate | Phase 1 |
| SC-7 | Page refresh preserves messages | Load messages on page load | Phase 5 |
| SC-8 | New conversation creates fresh chat | POST /api/conversations, wire button | Phase 6 |
| SC-9 | Chat UI matches design colors | Apply color palette to CopilotKit | Phase 4 |
| SC-10 | Deployed to Railway | railway up, verify with curl | Phase 10 |
| SC-11 | Typing/loading indicator | Add spinner during response | Phase 7 |
| SC-12 | Timestamps visible on messages | Add timestamp display | Phase 7 |
| SC-13 | Copy message button works | Clipboard API integration | Phase 8 |
| SC-14 | Retry button on failed messages | Error handling with retry | Phase 9 |
| SC-15 | User-friendly error messages | Error display in UI | Phase 9 |
| SC-16 | Enter sends, Shift+Enter newline | Keyboard event handling | Phase 7 |
| SC-17 | Edit user message | Inline edit component | Phase 8 |
| SC-18 | Delete message | Delete with confirmation | Phase 8 |
| SC-19 | Regenerate AI response | Re-run same input | Phase 8 |

---

## Phase Breakdown with Time Estimates

| Phase | Description | Estimated Time |
|-------|-------------|----------------|
| 0 | Architect Consultation (Pydantic AI, CopilotKit) | 30 min |
| 1 | Database Schema (conversations, messages) | 45 min |
| 2 | Walking Skeleton - Anthropic SDK Direct | 90 min |
| 3A | SteerTrue Governance Integration | 45 min |
| 3B | Python Microservice with Pydantic AI | 120 min |
| 4 | CopilotKit Chat UI | 60 min |
| 5 | Message Persistence | 45 min |
| 6 | Conversation API | 60 min |
| 7 | UX Polish - Input & Feedback | 45 min |
| 8 | Message Actions | 60 min |
| 9 | Error Handling UX | 30 min |
| 10 | Railway Deployment + UAT | 60 min |
| **Total** | | **~11 hours** |

---

## Risks Identified

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| Pydantic AI + CopilotKit integration complexity | Medium | High | Consult architect agents FIRST, walking skeleton approach |
| CoAgents protocol debugging | Medium | Medium | Follow official CopilotKit docs exactly |
| SteerTrue API connectivity from Railway | Low | High | Test /health endpoint first, implement circuit breaker |
| SSE streaming issues | Medium | Medium | Use MDN spec, test incrementally |
| Database migration breaks auth | Low | High | Pre-migration backup REQUIRED |

---

## File Locations (per PROJECT_STRUCTURE.md)

| Deliverable | Path |
|-------------|------|
| Chat page | `app/(chat)/page.tsx` |
| Chat API | `app/api/chat/route.ts` |
| Health API | `app/api/health/route.ts` |
| Copilot API | `app/api/copilot/route.ts` |
| Conversations API | `app/api/conversations/route.ts` |
| Conversations schema | `db/schema/conversations.ts` |
| Messages schema | `db/schema/messages.ts` |
| ISSUES.md | `.claude/sprints/ai-chatbot/sprint-S2.2/ISSUES.md` |
| Checkpoints | `.claude/sprints/ai-chatbot/sprint-S2.2/checkpoints/` |

---

## Anchor References (MANDATORY)

| Domain | Required Anchor | Link |
|--------|-----------------|------|
| Pydantic AI | Official Documentation | https://ai.pydantic.dev/ |
| CopilotKit | Official Documentation | https://docs.copilotkit.ai/ |
| Streaming SSE | MDN Web Docs | https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events |
| Drizzle ORM | Official Documentation | https://orm.drizzle.team/docs/overview |

---

## Questions/Clarifications

1. **Python microservice repository:** CONTEXT.md Line 82 states `keithcostello/steertrue-pydantic-ai` as separate repo. Should I create this repo, or does it already exist?

2. **CopilotKit vs direct SSE:** Phase 2 uses direct Anthropic SDK with SSE, Phase 4 replaces with CopilotKit. Should CopilotKit also use SSE streaming, or does it have its own protocol?

3. **Railway service for Python:** CONTEXT.md Line 708 shows `PYDANTIC_AI_URL` for the Python service. Who creates the Railway service - DEV or human?

---

## First Task

First task after PM approval: Phase 0 - Read architect agents and document patterns

---

**GIT:**
```bash
git add .claude/sprints/ai-chatbot/sprint-S2.2/ISSUES.md
git add .claude/sprints/ai-chatbot/sprint-S2.2/checkpoints/ready.md
git commit -m "READY submitted - Sprint S2.2"
git push origin dev
```

**RELAY TO PM:** "READY submitted for review on dev branch - Sprint S2.2"

---

**STOP - Awaiting PM approval.**
