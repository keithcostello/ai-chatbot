# Issues: Sprint S2.2-R1

**Sprint:** S2.2-R1 (Chat Core Redesigned)
**Created:** 2026-01-23T08:45:16.721Z
**Status:** Phase 1 - READY

---

## Phase 0: Architect Consultation
- [ ] 0.1 Read CONTEXT.md, understand S2.2 failure (custom TS agent = 6 bugs)
- [ ] 0.2 Read `.claude/agents/pydantic_architect.md`
- [ ] 0.3 Read `.claude/agents/copilot_kit.md`
- [ ] 0.4 Read https://github.com/CopilotKit/with-pydantic-ai README
- [ ] 0.5 Document 3 key Pydantic AI patterns
- [ ] 0.6 Document 3 key CopilotKit patterns
- [ ] 0.7 Explain AG-UI protocol in 1 sentence
- [ ] 0.8 List all official doc URLs reviewed

## Phase 1: Python Agent Repository Setup
- [ ] 1.1 Create repository: steertrue-chat-agent
- [ ] 1.2 Initialize pyproject.toml (Python 3.12+)
- [ ] 1.3 Create agent/main.py with FastAPI
- [ ] 1.4 Create Pydantic AI agent with `agent.to_ag_ui()` (VENDOR-AGNOSTIC)
- [ ] 1.5 Add /health endpoint returning {"status": "healthy", "model": LLM_MODEL}
- [ ] 1.6 Add CORS middleware for frontend communication
- [ ] 1.7 Add railway.toml
- [ ] 1.8 Deploy to Railway
- [ ] 1.9 Verify /health returns 200 (curl evidence)
- [ ] 1.10 Verify /copilotkit endpoint exists
- [ ] 1.11 Confirm code matches official pattern (side-by-side)

## Phase 2: Frontend Connection (SKELETON GATE)
- [ ] 2.1 Verify Phase 1 Python agent /health returns 200 (fresh curl)
- [ ] 2.2 Add NEXT_PUBLIC_COPILOT_RUNTIME_URL env var in Railway
- [ ] 2.3 Update app layout with CopilotKit provider
- [ ] 2.4 Create chat page with CopilotChat component
- [ ] 2.5 Import @copilotkit/react-ui/styles.css
- [ ] 2.6 DELETE lib/steertrue-agent.ts if exists
- [ ] 2.7 Verify chat page renders (screenshot with URL)
- [ ] 2.8 Verify message sends successfully (screenshot)
- [ ] 2.9 Verify response streams back (VIDEO evidence - URL bar visible)
- [ ] 2.10 Verify no console errors (browser console screenshot)
- [ ] 2.11 Confirm deployed commit SHA matches local HEAD

**SKELETON GATE CHECKLIST:**
- [ ] Python agent deployed, /health returns 200
- [ ] Frontend CopilotKit connects to Python agent
- [ ] End-to-end: message in -> AI response out
- [ ] VIDEO evidence of streaming (URL bar visible)
- [ ] No custom TypeScript agent code exists
- [ ] Deployed commit SHA matches local HEAD
- [ ] curl -i shows HTTP headers

## Phase 3: SteerTrue Governance
- [ ] 3.1 Create agent/steertrue.py with SteerTrue API client
- [ ] 3.2 Add STEERTRUE_API_URL to Railway env vars
- [ ] 3.3 Modify agent to call SteerTrue before LLM call
- [ ] 3.4 Use composed system_prompt from SteerTrue response
- [ ] 3.5 Return blocks_injected in response metadata
- [ ] 3.6 Implement fallback if SteerTrue unavailable
- [ ] 3.7 Verify Python logs show SteerTrue API call
- [ ] 3.8 Verify response JSON includes blocks_injected
- [ ] 3.9 Test fallback with SteerTrue unavailable

## Phase 4: Database Schema
- [ ] 4.1 Review Drizzle schema docs (https://orm.drizzle.team/docs/sql-schema-declaration)
- [ ] 4.2 Test database connection (psql)
- [ ] 4.3 Create db/schema/conversations.ts
- [ ] 4.4 Create db/schema/messages.ts
- [ ] 4.5 Run `npx drizzle-kit push`
- [ ] 4.6 Verify conversations table exists (`\d conversations`)
- [ ] 4.7 Verify messages table exists (`\d messages`)
- [ ] 4.8 Verify foreign keys correct
- [ ] 4.9 Verify CHECK constraint on role column

## Phase 5: Message Persistence
- [ ] 5.1 Verify tables exist and are empty
- [ ] 5.2 Save user messages on send
- [ ] 5.3 Save assistant messages on response
- [ ] 5.4 Include blocks_injected in assistant messages
- [ ] 5.5 Auto-create conversation if none exists
- [ ] 5.6 Load messages on page load
- [ ] 5.7 Create GET /api/conversations endpoint
- [ ] 5.8 Create POST /api/conversations endpoint
- [ ] 5.9 Verify SELECT * FROM messages shows saved data
- [ ] 5.10 Verify page refresh shows same messages (screenshot)
- [ ] 5.11 Verify conversation API works (curl output)

## Phase 6: Conversation UI
- [ ] 6.1 Verify conversation data available via API
- [ ] 6.2 Create sidebar with conversation list
- [ ] 6.3 Create "New Chat" button
- [ ] 6.4 Implement conversation switching
- [ ] 6.5 Apply design colors from CONTEXT.md
- [ ] 6.6 Implement authorization check (own conversations only)
- [ ] 6.7 Verify sidebar shows conversations (screenshot)
- [ ] 6.8 Verify can switch conversations (screenshot)
- [ ] 6.9 Verify User A cannot see User B conversations

## Phase 7: UX Polish (OPTIONAL - can defer to S2.3)
- [ ] 7.1 Typing indicator during response
- [ ] 7.2 Timestamps on messages
- [ ] 7.3 Enter to send, Shift+Enter for newline
- [ ] 7.4 Copy button on AI responses
- [ ] 7.5 Error display with retry button
- [ ] 7.6 Verify typing indicator visible (screenshot)
- [ ] 7.7 Verify timestamps shown (screenshot)
- [ ] 7.8 Verify keyboard shortcuts work (video)

## Phase 8: Deployment & UAT
- [ ] 8.1 Confirm all REQUIRED phases passed (0-6)
- [ ] 8.2 Confirm both services deployed (Python agent + Frontend)
- [ ] 8.3 Confirm all env vars set
- [ ] 8.4 UAT Test 1: Send message -> appears
- [ ] 8.5 UAT Test 2: Response streams incrementally
- [ ] 8.6 UAT Test 3: blocks_injected in response (governance active)
- [ ] 8.7 UAT Test 4: Refresh -> same messages (persistence)
- [ ] 8.8 UAT Test 5: New conversation -> empty chat
- [ ] 8.9 UAT Test 6: Switch conversation -> messages load
- [ ] 8.10 UAT API Test A1: Python /health returns 200
- [ ] 8.11 UAT API Test A2: No TypeScript agent exists
- [ ] 8.12 Answer delayed proof question 1 (LLM_MODEL from /health)
- [ ] 8.13 Answer delayed proof question 2 (new conversation UUID)
- [ ] 8.14 Answer delayed proof question 3 (conversations table timestamp)
- [ ] 8.15 All screenshots captured
- [ ] 8.16 Video evidence captured
- [ ] 8.17 No console errors
- [ ] 8.18 Code committed (Git SHA)

---

## Issue Log

| ID | Phase | Description | Status | Root Cause | Resolution |
|----|-------|-------------|--------|------------|------------|
| - | - | No issues logged yet | - | - | - |

---

**Total Tasks:** 89
**Completed:** 0
**Remaining:** 89
