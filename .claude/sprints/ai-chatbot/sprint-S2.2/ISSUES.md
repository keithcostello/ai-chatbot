# Sprint S2.2 Issues

**Sprint:** S2.2
**Goal:** User can send chat messages and get AI responses with conversation persistence
**Created:** 2026-01-22
**Status:** In Progress

---

## Phase 0: Architect Consultation
| ID | Task | Status | Notes |
|----|------|--------|-------|
| ISSUE-001 | Read `.claude/agents/pydantic_architect.md`, extract patterns | [x] | COMPLETE - Extracted Pydantic V2 strictness, structured generation, Field descriptions |
| ISSUE-002 | Read `.claude/agents/copilot_kit.md`, extract patterns | [x] | COMPLETE - Extracted useCopilotReadable, useCopilotAction, useCoAgent patterns |
| ISSUE-003 | Document key patterns summary from each architect | [x] | COMPLETE - See checkpoint-3.md |

---

## Phase 1: Database Schema
| ID | Task | Status | Notes |
|----|------|--------|-------|
| ISSUE-004 | Create `db/schema/conversations.ts` with Drizzle schema | [x] | COMPLETE - FK to users table defined at line 7 |
| ISSUE-005 | Create `db/schema/messages.ts` with Drizzle schema | [x] | COMPLETE - FK to conversations at line 7 |
| ISSUE-006 | Run backup: `pg_dump -Fc > backup_pre_s2.2_*.dump` | [ ] | BLOCKED - Requires DATABASE_URL access |
| ISSUE-007 | Run migration: `npx drizzle-kit push` | [ ] | BLOCKED - Requires DATABASE_URL access |
| ISSUE-008 | Verify tables with `\d conversations` and `\d messages` | [ ] | BLOCKED - Waiting for migration |

---

## Phase 2: Walking Skeleton - Anthropic SDK Direct
| ID | Task | Status | Notes |
|----|------|--------|-------|
| ISSUE-009 | Create chat page at `app/(chat)/page.tsx` | [ ] | Basic chat UI with input |
| ISSUE-010 | Create POST `/api/chat` endpoint with Anthropic SDK | [ ] | Direct SDK call |
| ISSUE-011 | Implement SSE streaming response | [ ] | Per MDN SSE spec |
| ISSUE-012 | Wire input to API call | [ ] | Send message on button/enter |
| ISSUE-013 | Display streaming response in chat area | [ ] | Incremental text display |
| ISSUE-014 | Create GET `/api/health` endpoint | [ ] | Health check per DevOps F1 Fix |
| ISSUE-015 | Add `ANTHROPIC_API_KEY` to Railway env vars | [ ] | Required for Claude API |
| ISSUE-016 | Deploy skeleton to Railway | [ ] | Verify on Railway URL |
| ISSUE-017 | **SKELETON GATE: Video evidence of streaming** | [ ] | MANDATORY - no Phase 3 without this |

---

## Phase 3A: SteerTrue Governance Integration
| ID | Task | Status | Notes |
|----|------|--------|-------|
| ISSUE-018 | Add `STEERTRUE_API_URL` to env vars | [ ] | `https://steertrue-sandbox-dev-sandbox.up.railway.app` |
| ISSUE-019 | Call SteerTrue `/api/v1/analyze` before Anthropic call | [ ] | Get composed system_prompt |
| ISSUE-020 | Use composed system_prompt from SteerTrue | [ ] | Inject governance |
| ISSUE-021 | Return `blocks_injected` in response metadata | [ ] | Track governance blocks |
| ISSUE-022 | Verify governance is active with curl | [ ] | Show blocks_injected populated |

---

## Phase 3B: Python Microservice with Pydantic AI
| ID | Task | Status | Notes |
|----|------|--------|-------|
| ISSUE-023 | Create Railway service: `steertrue-pydantic-ai` | [ ] | Separate Python service |
| ISSUE-024 | Create Python FastAPI app with Pydantic AI | [ ] | Consult pydantic_architect.md |
| ISSUE-025 | Define structured output models (ChatResponse) | [ ] | Pydantic BaseModel |
| ISSUE-026 | Implement POST `/chat` endpoint with streaming | [ ] | SSE from Python |
| ISSUE-027 | Integrate SteerTrue governance in Python service | [ ] | Call /api/v1/analyze |
| ISSUE-028 | Implement retry logic for Pydantic validation failures | [ ] | MAX_RETRIES = 2 |
| ISSUE-029 | Implement circuit breaker for SteerTrue failures | [ ] | 3 failures, 30s recovery |
| ISSUE-030 | Update Next.js to call Python service | [ ] | Add USE_PYTHON_SERVICE flag |
| ISSUE-031 | Deploy Python service to Railway | [ ] | Verify health endpoint |
| ISSUE-032 | Test Python `/chat` directly (bypass Next.js) | [ ] | Adversarial F11 Fix |

---

## Phase 4: CopilotKit Chat UI
| ID | Task | Status | Notes |
|----|------|--------|-------|
| ISSUE-033 | Install @copilotkit/react-ui, @copilotkit/react-core | [ ] | npm install |
| ISSUE-034 | Replace basic chat UI with CopilotChat component | [ ] | Consult copilot_kit.md |
| ISSUE-035 | Configure streaming responses | [ ] | CopilotKit streaming |
| ISSUE-036 | Style to match design colors | [ ] | Forest green sidebar, cream chat |
| ISSUE-037 | Create `/api/copilot` endpoint for CopilotRuntime | [ ] | Connect to Python service |
| ISSUE-038 | Implement useCopilotReadable hooks | [ ] | Design F2 Fix - inject context |

---

## Phase 5: Message Persistence
| ID | Task | Status | Notes |
|----|------|--------|-------|
| ISSUE-039 | Save user messages to messages table on send | [ ] | role='user' |
| ISSUE-040 | Save assistant messages on response complete | [ ] | role='assistant', blocks_injected |
| ISSUE-041 | Auto-create conversation if none exists | [ ] | Default title 'New Conversation' |
| ISSUE-042 | Load messages on page load | [ ] | Query by conversation_id |
| ISSUE-043 | Verify persistence with page refresh | [ ] | Messages still visible |

---

## Phase 6: Conversation API
| ID | Task | Status | Notes |
|----|------|--------|-------|
| ISSUE-044 | GET `/api/conversations` - list user's conversations | [ ] | Filter by session user |
| ISSUE-045 | POST `/api/conversations` - create new conversation | [ ] | Returns new conversation ID |
| ISSUE-046 | GET `/api/conversations/{id}/messages` - get messages | [ ] | Authorization check required |
| ISSUE-047 | Implement authorization: user can only access own conversations | [ ] | DevOps F7 Fix - return 404 not 403 |
| ISSUE-048 | Wire "New Chat" button to create conversation | [ ] | UI integration |
| ISSUE-049 | Wire conversation list in sidebar | [ ] | Basic list, no styling yet |

---

## Phase 7: UX Polish - Input & Feedback
| ID | Task | Status | Notes |
|----|------|--------|-------|
| ISSUE-050 | Typing/loading indicator during AI response | [ ] | Spinner or dots |
| ISSUE-051 | Timestamps on all messages | [ ] | Relative or absolute |
| ISSUE-052 | Enter to send, Shift+Enter for newline | [ ] | Keyboard handling |
| ISSUE-053 | Input placeholder text | [ ] | "Type a message..." |
| ISSUE-054 | Auto-scroll to new messages | [ ] | Scroll to bottom on new message |
| ISSUE-055 | Minimum keyboard navigation (Tab navigation) | [ ] | Design F10 Fix - WCAG 2.1.1 |

---

## Phase 8: Message Actions
| ID | Task | Status | Notes |
|----|------|--------|-------|
| ISSUE-056 | Copy button on AI responses | [ ] | Clipboard API |
| ISSUE-057 | Edit button on user messages | [ ] | Inline edit, save/cancel |
| ISSUE-058 | Delete button on messages | [ ] | With confirmation modal |
| ISSUE-059 | Regenerate button on AI responses | [ ] | Re-run same input |

---

## Phase 9: Error Handling UX
| ID | Task | Status | Notes |
|----|------|--------|-------|
| ISSUE-060 | User-friendly error display in chat | [ ] | Not just console |
| ISSUE-061 | Retry button on failed message sends | [ ] | Recovery option |
| ISSUE-062 | Network offline detection | [ ] | Show offline indicator |
| ISSUE-063 | Use Alert accent color #d4915c for errors | [ ] | Design F5 Fix |

---

## Phase 10: Railway Deployment + UAT
| ID | Task | Status | Notes |
|----|------|--------|-------|
| ISSUE-064 | Verify all env vars set on Railway | [ ] | ANTHROPIC_API_KEY, STEERTRUE_API_URL, etc. |
| ISSUE-065 | Deploy with `railway up` | [ ] | Final deployment |
| ISSUE-066 | Run full UAT checklist on Railway URL | [ ] | All 19 success criteria |
| ISSUE-067 | Capture all evidence screenshots | [ ] | URL bar visible |
| ISSUE-068 | Configure Railway healthcheck | [ ] | DevOps F5 Fix |
| ISSUE-069 | Document baseline response times | [ ] | In TRACKER.md |

---

## Summary

| Phase | Issues | Description |
|-------|--------|-------------|
| 0 | 3 | Architect Consultation |
| 1 | 5 | Database Schema |
| 2 | 9 | Walking Skeleton |
| 3A | 5 | SteerTrue Governance |
| 3B | 10 | Python Microservice |
| 4 | 6 | CopilotKit Chat UI |
| 5 | 5 | Message Persistence |
| 6 | 6 | Conversation API |
| 7 | 6 | UX Polish |
| 8 | 4 | Message Actions |
| 9 | 4 | Error Handling |
| 10 | 6 | Deployment + UAT |
| **Total** | **69** | |

---

## Change Log

| Date | Issue | Change | Reason |
|------|-------|--------|--------|
| 2026-01-22 | All | Initial creation | Sprint S2.2 kickoff |
| 2026-01-22 | ISSUE-001,002,003 | Marked COMPLETE | Phase 0 architect consultation done |
| 2026-01-22 | ISSUE-004,005 | Marked COMPLETE | Schema files created |
| 2026-01-22 | ISSUE-006,007,008 | Marked BLOCKED | Requires DATABASE_URL env var |

---

**END OF ISSUES**
