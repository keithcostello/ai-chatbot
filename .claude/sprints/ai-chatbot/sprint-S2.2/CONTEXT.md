# Sprint Context: S2.2

<!-- AI CONTEXT
WHAT: Read this FIRST when starting work on Sprint S2.2. Contains all context needed.
WHY: PRD and project docs are too large. This extracts Day 3-4 specific information.
HOW: Read sections relevant to your current task. Architecture decisions are binding.
-->

**Created:** 2026-01-22
**Sprint:** S2.2
**Day(s):** 3-4
**Goal:** User can send chat messages and get AI responses with conversation persistence

---

## 1. DELIVERABLES

| # | Deliverable | Type | Day | Acceptance Criteria |
|---|-------------|------|-----|---------------------|
| 1 | POST /api/chat endpoint | API | 3 | Accepts message, returns AI response with governance |
| 2 | CopilotKit chat interface | UI | 3 | Message input, display, streaming responses |
| 3 | Pydantic AI agent | Backend | 3 | Structured outputs, SteerTrue integration |
| 4 | conversations table | DB | 4 | Stores user conversations with metadata |
| 5 | messages table | DB | 4 | Stores message history per conversation |
| 6 | GET /api/conversations | API | 4 | Lists user's conversations |
| 7 | POST /api/conversations | API | 4 | Creates new conversation |
| 8 | GET /api/conversations/{id}/messages | API | 4 | Gets messages for conversation |
| 9 | Message persistence | Feature | 4 | Messages persist across refresh |

---

## 2. ARCHITECTURE DECISIONS

Decisions that constrain implementation. These are BINDING.

### Phased Architecture (Decision Review 2026-01-22)

**Approach:** Walking skeleton with Anthropic SDK first, Python microservice as flesh phase.

| Phase | Architecture | Purpose |
|-------|--------------|---------|
| Skeleton (2) | Next.js → Anthropic SDK → Anthropic API | Prove end-to-end works |
| Governance (3A) | Add SteerTrue /api/v1/analyze call | Inject governance into skeleton |
| Flesh (3B) | Next.js → Python FastAPI + Pydantic AI → Anthropic API | Structured output, agent patterns |

**Fallback:** If Python integration fails, skeleton remains functional.

### Binding Decisions

| Decision | Rationale | Alternatives Rejected |
|----------|-----------|----------------------|
| **Phased integration** | Walking skeleton proves flow before adding complexity | Big-bang integration (higher risk) |
| **Pydantic AI via Python microservice** | Structured outputs, governance injection, open-source AI framework | Direct SDK (no validation), LangGraph (different ecosystem) |
| **CopilotKit for chat UI** | React components, streaming support, CoAgents protocol | Custom components (reinventing wheel), Vercel AI SDK (less features) |
| **SteerTrue governance injection** | All AI responses pass through governance layer | Direct LLM calls (no governance) |
| **Same database as auth** | ai-chatbot Postgres already provisioned in S2.1 | Separate chat database (unnecessary complexity) |
| **Simple CopilotRuntime, not CoAgents (Design F11)** | S2.2 is single-turn Q&A, no workflow state needed | useCoAgent + LangGraph (overkill for simple chat, deferred to S2.4 multi-step workflows) |

### Service Architecture (Target State)

```
┌─────────────────┐     ┌─────────────────────┐     ┌─────────────┐
│  Next.js App    │────▶│  Python Microservice │────▶│ Anthropic   │
│  (ai-chatbot)   │     │  (Pydantic AI)       │     │ API         │
└─────────────────┘     └──────────┬──────────┘     └─────────────┘
                                   │
                                   ▼
                        ┌─────────────────────┐
                        │  SteerTrue API      │
                        │  (governance)       │
                        └─────────────────────┘
```

### Blue/Green/Red Architecture Compliance (F9 Fix)

**SteerTrue API** follows Blue/Green/Red architecture (see BLUE_GREEN_RED_ARCHITECTURE_PRIMER_V2.md).

**Python Microservice (steertrue-pydantic-ai)** is a SEPARATE deployment:
- NOT part of SteerTrue Blue/Green/Red codebase
- Standalone FastAPI service
- Own repository: `keithcostello/steertrue-pydantic-ai`
- Own Railway service in dev-sandbox environment

**ai-chatbot (Next.js)** is a SEPARATE deployment:
- Consumer application, not part of SteerTrue core
- Own repository: `keithcostello/ai-chatbot`
- Consumes SteerTrue API and Python microservice as external services

**Import Rules for Python Microservice:**
- Python service → SteerTrue API: HTTP calls only (no direct imports)
- Python service → Anthropic: Via official SDK
- No circular dependencies between services

---

## 2.1 INITIALIZATION DEPENDENCY GRAPH (Python Microservice)

**Purpose:** Define startup sequence and component availability timing for steertrue-pydantic-ai service.

### Startup Sequence

```
1. FastAPI app starts
2. Environment variables validated (ANTHROPIC_API_KEY, STEERTRUE_API_URL)
3. HTTP client pools initialized (httpx for SteerTrue, Anthropic SDK)
4. Pydantic AI agent instantiated (chat_agent)
5. Health endpoint available: GET /health returns 200
6. Chat endpoint ready: POST /chat accepts requests
```

### Component Availability

| Component | Available After | Safe to Access |
|-----------|-----------------|----------------|
| FastAPI app | Step 1 | Immediately |
| Environment config | Step 2 | After validation passes |
| SteerTrue client | Step 3 | After health check |
| Anthropic client | Step 3 | After SDK init |
| chat_agent | Step 4 | After agent instantiation |
| /health endpoint | Step 5 | Use for readiness probe |
| /chat endpoint | Step 6 | After /health returns 200 |

### Health Endpoint Contract

```
GET /health
Response (200 OK):
{
    "status": "healthy",
    "version": "1.0.0",
    "dependencies": {
        "steertrue_api": "connected" | "error",
        "anthropic_api": "configured"
    },
    "circuit_breaker": "closed" | "open" | "half_open"  // Adversarial F7 Fix
}
```

**Circuit Breaker Observability (Adversarial F7 Fix):**
- Health endpoint exposes circuit state for UAT verification
- Allows IT-6 test to verify circuit actually opens after failures
- In production, consider moving to /health/detailed (authenticated)

**Anthropic API Key Validation Note (Adversarial F3 Fix):**
- Health endpoint shows `anthropic_api: "configured"` based on env var existence only
- Key validity is NOT verified at startup (to avoid unnecessary API calls)
- Invalid key will fail at runtime with clear error message
- Consider adding `/health/deep` endpoint that calls `anthropic.models.list()` for full validation

### Railway Readiness Probe

```yaml
# railway.toml
[healthcheck]
path = "/health"
interval = 10
timeout = 5
```

---

## 3. DATABASE SCHEMA

### New Tables (ai-chatbot Postgres)

```sql
-- Table: conversations
-- Purpose: Store conversation metadata
CREATE TABLE conversations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) DEFAULT 'New Conversation',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for user lookups
CREATE INDEX idx_conversations_user_id ON conversations(user_id);

-- Table: messages
-- Purpose: Store chat messages within conversations
CREATE TABLE messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
    role VARCHAR(20) NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    -- Governance metadata (optional - populated for assistant messages)
    blocks_injected JSONB,
    total_tokens INTEGER
);

-- Index for conversation lookups (ordered by time)
CREATE INDEX idx_messages_conversation ON messages(conversation_id, created_at);
```

### Drizzle Schema (TypeScript)

```typescript
// schema/conversations.ts
import { pgTable, uuid, varchar, timestamp, text, jsonb, integer } from 'drizzle-orm/pg-core';
import { users } from './users';

export const conversations = pgTable('conversations', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  title: varchar('title', { length: 255 }).default('New Conversation'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
});

export const messages = pgTable('messages', {
  id: uuid('id').primaryKey().defaultRandom(),
  conversationId: uuid('conversation_id').notNull().references(() => conversations.id, { onDelete: 'cascade' }),
  role: varchar('role', { length: 20 }).notNull(), // 'user', 'assistant', 'system'
  content: text('content').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  blocksInjected: jsonb('blocks_injected'),
  totalTokens: integer('total_tokens'),
});
```

---

## 4. API CONTRACTS

### Endpoint Usage Clarification (DevOps F4 Fix)

| Endpoint | Purpose | When Active |
|----------|---------|-------------|
| `/api/chat` | Direct Anthropic SDK (skeleton) | Fallback when `USE_PYTHON_SERVICE=false` |
| `/api/copilot` | CopilotKit → Python microservice | Primary production path |

**Production Path:** `/api/copilot` → Python microservice → SteerTrue → Anthropic
**Fallback Path:** `/api/chat` → Direct Anthropic SDK (no Python, no structured output)

### Chat Endpoint (Day 3) - Skeleton/Fallback

```
POST /api/chat
Headers:
  Cookie: session=<token>
  Content-Type: application/json

Request:
{
    "message": "string - user's message",
    "conversationId": "uuid - optional, creates new if not provided"
}

Response (200 OK - streaming):
  Content-Type: text/event-stream
  Cache-Control: no-cache
  Connection: keep-alive
  X-Accel-Buffering: no

  # SSE Protocol (MDN: https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events)
  # Each event: "data: {json}\n\n" (double newline delimiter)

  data: {"type": "chunk", "content": "partial response text"}

  data: {"type": "chunk", "content": "more text..."}

  data: {"type": "done", "conversationId": "uuid", "messageId": "uuid", "blocksInjected": ["L1/core_identity"], "totalTokens": 150}

  # Keep-alive: Send empty comment every 15 seconds during long responses
  : keep-alive

  # Error mid-stream (Adversarial F10 Fix):
  data: {"type": "error", "code": "STREAM_ERROR", "message": "Connection interrupted"}

  # Anthropic-specific errors mid-stream:
  data: {"type": "error", "code": "CONTENT_POLICY", "partial_content": "...", "message": "Response flagged by content policy"}
  data: {"type": "error", "code": "TOKEN_LIMIT", "partial_content": "...", "message": "Maximum token limit reached"}
  data: {"type": "error", "code": "ANTHROPIC_ERROR", "partial_content": "...", "message": "Upstream API error"}

### SSE Client Handling (Browser)

```typescript
// EventSource reconnection behavior
const eventSource = new EventSource('/api/chat');

// Built-in reconnection: browser auto-retries on connection drop
// Retry interval: default 3 seconds (server can override via "retry:" field)

eventSource.onmessage = (event) => {
  const data = JSON.parse(event.data);
  if (data.type === 'chunk') appendToChat(data.content);
  if (data.type === 'done') closeStream();
  if (data.type === 'error') handleError(data);
};

eventSource.onerror = () => {
  // Connection lost - EventSource auto-reconnects
  showReconnectingIndicator();
};
```

### Connection Timeout

- Server: 60 second max stream duration
- Client: Show "taking longer than expected" after 30 seconds

Response (401 Unauthorized):
{
    "error": "Not authenticated",
    "code": "NOT_AUTHENTICATED"
}

Response (429 Too Many Requests - Adversarial F5 Fix):
{
    "error": "Rate limit exceeded",
    "code": "RATE_LIMITED",
    "retry_after": 60
}
Headers:
  Retry-After: 60

Rate Limit: 10 requests/minute per authenticated user
```

### Conversation Endpoints (Day 4)

```
GET /api/conversations
Headers:
  Cookie: session=<token>

Response (200 OK):
{
    "conversations": [
        {
            "id": "uuid",
            "title": "string",
            "createdAt": "ISO timestamp",
            "updatedAt": "ISO timestamp",
            "messageCount": number
        }
    ]
}
```

```
POST /api/conversations
Headers:
  Cookie: session=<token>

Request:
{
    "title": "string - optional, defaults to 'New Conversation'"
}

Response (201 Created):
{
    "id": "uuid",
    "title": "string",
    "createdAt": "ISO timestamp"
}
```

```
GET /api/conversations/{id}/messages
Headers:
  Cookie: session=<token>

Response (200 OK):
{
    "messages": [
        {
            "id": "uuid",
            "role": "user" | "assistant",
            "content": "string",
            "createdAt": "ISO timestamp",
            "blocksInjected": ["L1/core_identity"] | null,
            "totalTokens": number | null
        }
    ]
}

Response (404 Not Found):
{
    "error": "Conversation not found",
    "code": "NOT_FOUND"
}
```

### Python Microservice API Contract (Phase 3B)

**Service:** steertrue-pydantic-ai
**Base URL:** `${PYDANTIC_AI_URL}`

```
POST /chat
Headers:
  Content-Type: application/json
  X-Session-ID: string (user session identifier)

Request:
{
    "message": "string - user's message",
    "conversation_id": "uuid - optional",
    "session_context": {
        "user_id": "uuid",
        "preferences": {}
    }
}

Response (200 OK - streaming):
  Content-Type: text/event-stream
  Cache-Control: no-cache
  Connection: keep-alive

  data: {"type": "chunk", "content": "partial text"}
  data: {"type": "chunk", "content": "more text..."}
  data: {"type": "done", "blocks_injected": ["L1/core_identity"], "total_tokens": 150}

Response (400 Bad Request):
{
    "error": "Invalid request",
    "code": "VALIDATION_ERROR",
    "details": [{"field": "message", "message": "required"}]
}

Response (502 Bad Gateway - SteerTrue unavailable):
{
    "error": "Governance service unavailable",
    "code": "STEERTRUE_UNAVAILABLE",
    "fallback_used": true
}

Response (503 Service Unavailable - Anthropic unavailable):
{
    "error": "AI service unavailable",
    "code": "ANTHROPIC_UNAVAILABLE"
}

Timeout: 30 seconds
```

### CopilotKit to Python Service Protocol

```typescript
// Next.js /api/copilot calls Python service
// CopilotKit remoteActions configuration

remoteActions: [{
  url: process.env.PYDANTIC_AI_URL + "/chat",
  // CopilotKit sends:
  // - messages: array of {role, content}
  // - context: from useCopilotReadable hooks
  // Python service must handle CopilotKit message format
}]

// Request transformation (Next.js middleware):
// CopilotKit format → Python service format
{
  "message": messages[messages.length - 1].content,
  "conversation_id": conversationId,
  "session_context": { "user_id": session.user.id }
}
```

---

## 5. PYDANTIC AI INTEGRATION

### Agent Definition

```python
# Reference: consult .claude/agents/pydantic_architect.md for full patterns

from pydantic_ai import Agent
from pydantic import BaseModel

class ChatResponse(BaseModel):
    content: str
    blocks_injected: list[str]
    total_tokens: int

chat_agent = Agent(
    'anthropic:claude-sonnet-4-20250514',
    result_type=ChatResponse,
    system_prompt="You are a helpful AI assistant.",  # Replaced by SteerTrue
)
```

### SteerTrue Integration Flow

```
1. User sends message
2. Backend calls SteerTrue /api/v1/analyze with message + session_id
3. SteerTrue returns composed system_prompt with relevant blocks
4. Pydantic AI agent uses composed system_prompt
5. Agent generates response
6. Response + governance metadata saved to messages table
7. Stream response to frontend via CopilotKit
```

### SteerTrue Error Handling (F7 Fix)

**Timeout:** 5 seconds for SteerTrue API calls

**Circuit Breaker Pattern:**
- Failure threshold: 3 consecutive failures
- Recovery timeout: 30 seconds
- Half-open: 1 test request after recovery timeout

**Fallback Behavior:**

| SteerTrue Status | Action | blocks_injected |
|------------------|--------|-----------------|
| 200 OK | Use composed system_prompt | Actual blocks from response |
| Timeout (>5s) | Use fallback system_prompt | `["FALLBACK/no_governance"]` |
| 5xx Error | Use fallback system_prompt | `["FALLBACK/steertrue_error"]` |
| Circuit Open | Use fallback system_prompt | `["FALLBACK/circuit_open"]` |

**Fallback System Prompt:**
```python
FALLBACK_SYSTEM_PROMPT = """You are a helpful AI assistant.
Note: Governance system temporarily unavailable. Operating in fallback mode.
Respond helpfully while maintaining safety guidelines."""
```

**Logging Requirements:**
- Log every fallback activation with timestamp
- Log circuit breaker state changes
- Alert if fallback used >10 times in 5 minutes

**Circuit Breaker State Persistence (DevOps F6 Fix - Tech Debt):**

| Approach | Pros | Cons | Decision |
|----------|------|------|----------|
| In-memory (current) | Simple, no dependencies | Lost on restart | Use for S2.2 |
| Redis-backed | Persists across restarts | Adds dependency | Future S2.5+ |

**S2.2 Behavior:** Circuit state is in-memory. On service restart:
- Circuit starts CLOSED (healthy assumption)
- Re-evaluates within 3 requests if SteerTrue is still down
- Worst case: 3 requests hit timeout before circuit opens again

**Graceful Degradation:** Even if circuit is lost, fallback still works - just takes 3 requests to re-trigger.

**Tech Debt Item:** Add Redis-backed circuit breaker in S2.5 for production resilience.

### Environment Variables (New)

| Variable | Purpose | Source |
|----------|---------|--------|
| STEERTRUE_API_URL | SteerTrue backend URL | Railway service URL |
| ANTHROPIC_API_KEY | Claude API access | Anthropic dashboard |

---

## 6. COPILOTKIT INTEGRATION

### Components to Use

```tsx
// Reference: consult .claude/agents/copilot_kit.md for full patterns

import { CopilotKit, CopilotChat } from "@copilotkit/react-ui";
import { useCopilotChat } from "@copilotkit/react-core";

// Main chat interface
<CopilotKit runtimeUrl="/api/copilot">
  <CopilotChat
    labels={{
      title: "SteerTrue Chat",
      initial: "How can I help you today?",
    }}
  />
</CopilotKit>
```

### CoAgents Backend

```typescript
// app/api/copilot/route.ts
// Connects CopilotKit to Pydantic AI backend

import { CopilotRuntime } from "@copilotkit/runtime";

export async function POST(req: Request) {
  const runtime = new CopilotRuntime({
    remoteActions: [
      {
        url: process.env.PYDANTIC_AI_URL + "/chat",
      },
    ],
  });

  return runtime.response(req);
}
```

---

## 7. DESIGN REFERENCES

| Reference | Path | What to Extract |
|-----------|------|-----------------|
| Consumer Visual | `docs/design/storyboarding/designx/user_frontend/chat_visual_v.01.md` | Chat layout, colors |
| Consumer Visual PNG | `docs/design/storyboarding/designx/user_frontend/chat_visual_v.01.png` | Visual reference |

### Chat Layout (from design)

**Design F1 Fix - Layout Clarification:**

Full design spec (`chat_visual_v.01.md`) shows THREE columns:
- Sidebar (240px) + Chat Area + Tile Dashboard (~500px)

**S2.2 Scope:** TWO columns only (sidebar + chat). Tile dashboard DEFERRED to S2.4 (Admin foundation).

```
┌─────────────────────────────────────────────────────────────┐
│  SIDEBAR (forest green)     │  CHAT AREA (cream)            │
│  ─────────────────────────  │  ───────────────────────────  │
│                             │                               │
│  🐢 SteerTrue               │  [AI Message bubble]          │
│                             │                               │
│  + New Chat                 │  [User Message bubble]        │
│                             │                               │
│  ─────────────────────────  │  [AI Message bubble]          │
│  Conversation 1             │                               │
│  Conversation 2             │                               │
│  Conversation 3             │                               │
│                             │  ───────────────────────────  │
│                             │  [Message input box]     [▶]  │
│                             │                               │
└─────────────────────────────────────────────────────────────┘
```

**Empty State (Design F9 Fix):**
When user has no conversations, display centered in chat area:
- Text: "No conversations yet. Click New Chat to start."
- Font: Text primary #1e3a3a on cream background #f8f4ed
- Include subtle illustration or icon (optional)

### Color Palette (same as S2.1)

| Name | Hex | Usage |
|------|-----|-------|
| Background | #f8f4ed | Chat area background |
| Cards | #f0ebe0 | Message bubbles (AI) |
| Sidebar | #2d4a3e | Left sidebar |
| Primary accent | #5d8a6b | User message bubbles, buttons |
| Text primary | #1e3a3a | Message text |

---

## 8. DEPENDENCIES

### From S2.1 (Already Built)

| Component | Status | Location |
|-----------|--------|----------|
| User authentication | ✅ | app/api/auth/* |
| Session management | ✅ | Auth.js + httpOnly cookies |
| Users table | ✅ | db/schema/users.ts |
| Railway deployment | ✅ | steertrue-chat-frontend |
| Postgres connection | ✅ | db/index.ts |

### External Services

| Service | Purpose | Config Needed |
|---------|---------|---------------|
| SteerTrue API | Governance injection | STEERTRUE_API_URL env var |
| Anthropic API | LLM responses | ANTHROPIC_API_KEY env var |

---

## 9. AGENT CONSULTATION (MANDATORY)

**CRITICAL:** Before implementing ANY Pydantic AI or CopilotKit code, you MUST consult the relevant architect agent.

| Technology | Agent | Trigger |
|------------|-------|---------|
| Pydantic AI | `.claude/agents/pydantic_architect.md` | Any LLM call, agent definition, structured output |
| CopilotKit | `.claude/agents/copilot_kit.md` | Any chat component, streaming, CoAgents |

**Violation:** Implementing without consultation = sprint checkpoint REJECTED

---

## 10. ENVIRONMENT

### Repository

| Repo | Purpose | Branch |
|------|---------|--------|
| keithcostello/ai-chatbot | Consumer frontend | dev-sprint-S2.2 |
| steertrue (this repo) | Documentation, sprint tracking | dev |

### Railway Services

| Service | Environment | Purpose |
|---------|-------------|---------|
| steertrue-chat-frontend | dev-sandbox | ai-chatbot Next.js app |
| Postgres-x1A- | dev-sandbox | ai-chatbot database |
| steertrue-sandbox | dev-sandbox | SteerTrue governance API |

### Environment Variables (to add)

| Variable | Value/Source | Required Phase |
|----------|--------------|----------------|
| ANTHROPIC_API_KEY | From Anthropic dashboard | Phase 2 (Skeleton) |
| STEERTRUE_API_URL | `https://steertrue-sandbox-dev-sandbox.up.railway.app` | Phase 3A (Governance) |
| PYDANTIC_AI_URL | `https://steertrue-pydantic-ai-dev-sandbox.up.railway.app` | Phase 3B (Flesh) |

**Note:** PYDANTIC_AI_URL is the Python microservice URL, separate from STEERTRUE_API_URL (governance API).

**Secrets Rotation Procedure (DevOps F8 Fix):**

| Secret | Rotation Steps | Downtime |
|--------|----------------|----------|
| ANTHROPIC_API_KEY | 1. Generate new key in Anthropic dashboard<br>2. Update Railway env var<br>3. Redeploy service<br>4. Revoke old key | ~30s (redeploy) |
| STEERTRUE_API_URL | N/A - URL, not secret | N/A |
| PYDANTIC_AI_URL | N/A - URL, not secret | N/A |

**If ANTHROPIC_API_KEY is compromised:**
1. Immediately revoke in Anthropic dashboard
2. Generate new key
3. Update in Railway: `railway variables set ANTHROPIC_API_KEY=new_key`
4. Redeploy: `railway up`
5. Monitor logs for auth failures

---

## 11. TESTING REQUIREMENTS

### Manual Verification

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Open chat page | See empty chat with input box |
| 2 | Type message + send | Message appears in chat |
| 3 | Wait for response | AI response streams in |
| 4 | Refresh page | Same messages visible |
| 5 | Start new conversation | New empty chat |
| 6 | Check old conversation | Previous messages still there |

### Browser Testing (REQUIRED)

| Browser | Viewport | Must Pass |
|---------|----------|-----------|
| Chrome | Desktop (1440x900) | All manual steps |
| Chrome | Mobile (375x667) | Chat is usable |

### Integration Test Scenarios (F10 Fix)

**Multi-service chain:** Next.js → Python → SteerTrue → Anthropic

| # | Test | Command/Action | Expected Result |
|---|------|----------------|-----------------|
| IT-1 | Python service health | `curl ${PYDANTIC_AI_URL}/health` | 200 OK with dependencies status |
| IT-2 | Python → SteerTrue connectivity | Check /health `steertrue_api: connected` | SteerTrue reachable from Python |
| IT-3 | Python → Anthropic connectivity | Send test message via /chat | Response received (not timeout) |
| IT-4 | Full chain: message in → response out | Send message from Next.js UI | Streaming response with blocks_injected |
| IT-5 | SteerTrue fallback | Stop SteerTrue, send message | Response with `FALLBACK/*` in blocks_injected |
| IT-6 | Circuit breaker activation | Cause 3 SteerTrue failures | Circuit opens, fallback used immediately |

**Test Order:** IT-1 → IT-2 → IT-3 → IT-4 (dependencies must pass before chain test)

**Phase Gate:** Integration tests run AFTER Phase 3B, BEFORE Phase 4 (CopilotKit UI)

```bash
# Integration test script (run from Next.js project)
#!/bin/bash
set -e

echo "IT-1: Python service health"
curl -f ${PYDANTIC_AI_URL}/health

echo "IT-2: SteerTrue connectivity (check health response)"
curl -s ${PYDANTIC_AI_URL}/health | jq -e '.dependencies.steertrue_api == "connected"'

echo "IT-3: Anthropic connectivity"
curl -X POST ${PYDANTIC_AI_URL}/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "Hello", "session_context": {"user_id": "test"}}' \
  --max-time 30 | head -1

echo "IT-4: Full chain (via Next.js)"
# Manual: Send message in UI, verify streaming response

echo "All integration tests passed"
```

---

## 12. RISKS AND MITIGATIONS

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| Pydantic AI + CopilotKit integration complexity | Medium | High | Consult architect agents first, walking skeleton approach |
| SteerTrue API connectivity | Low | High | Test /health endpoint first |
| Streaming response handling | Medium | Medium | Follow CopilotKit docs exactly |
| Database schema migration | Low | Medium | Test migration locally first |

---

## 13. OPEN QUESTIONS

| # | Question | Answer | Answered By |
|---|----------|--------|-------------|
| 1 | Use streaming or batch responses? | Streaming for better UX | PRD decision |
| 2 | Store governance metadata with messages? | Yes - blocks_injected, total_tokens | Architecture decision |
| 3 | Auto-generate conversation titles? | Defer to S2.3 - manual title for now | Scope decision |

---

## EXTRACTION LOG

| Source | Sections Used | Date |
|--------|---------------|------|
| `memory/projects/steertrue-audit/PRD_V1.md` | Architecture decisions, User Stories C5-C9, API contracts | 2026-01-22 |
| `memory/projects/steertrue-audit/REQUIREMENTS_MAP.md` | C-02, C-03 requirements | 2026-01-22 |
| `docs/design/storyboarding/designx/user_frontend/chat_visual_v.01.md` | Chat layout reference | 2026-01-22 |
| Sprint S2.1 CONTEXT.md | Template structure, color palette | 2026-01-22 |

---

**END OF SPRINT CONTEXT**
