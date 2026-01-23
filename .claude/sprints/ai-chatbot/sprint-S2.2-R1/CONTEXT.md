# Sprint Context: S2.2-R1

<!-- AI CONTEXT
WHAT: Read this FIRST when starting work on Sprint S2.2-R1. Contains architecture decisions.
WHY: S2.2 failed due to architecture misalignment. This revision uses official CopilotKit + Pydantic AI pattern.
HOW: Follow the architecture exactly as specified. No custom TypeScript agents.
-->

**Created:** 2026-01-24
**Sprint:** S2.2-R1 (Revision of failed S2.2)
**Day(s):** 3-4
**Goal:** User can send chat messages and get AI responses with conversation persistence

---

## WHY THIS REVISION EXISTS

**S2.2 Failed Because:**
- Phase 3B (Python FastAPI + Pydantic AI) was SKIPPED
- Custom TypeScript SteerTrueAgent was built instead
- Custom agent fought CopilotKit internals (RxJS, adapter system)
- Result: 6 bugs (BUG-009 through BUG-015) in 2 days
- Pattern: Fighting the framework instead of using it

**S2.2-R1 Fixes:**
- Uses official CopilotKit + Pydantic AI pattern from https://github.com/CopilotKit/with-pydantic-ai
- Python agent uses `agent.to_ag_ui()` for AG-UI protocol (built-in event handling)
- Frontend uses `useCoAgent` hook (no custom adapters)
- No custom TypeScript agent code
- SteerTrue injects into Python agent's system prompt

---

## 1. DELIVERABLES

| # | Deliverable | Type | Day | Acceptance Criteria |
|---|-------------|------|-----|---------------------|
| 1 | Python agent with Pydantic AI | Backend | 3 | Runs on Railway, exposes AG-UI endpoint |
| 2 | AG-UI protocol endpoint | API | 3 | `agent.to_ag_ui()` serving at /copilotkit |
| 3 | SteerTrue governance in Python | Backend | 3 | Python agent calls SteerTrue before LLM |
| 4 | CopilotKit frontend with useCoAgent | UI | 3 | Chat UI using official hooks |
| 5 | conversations table | DB | 4 | Stores user conversations with metadata |
| 6 | messages table | DB | 4 | Stores message history per conversation |
| 7 | GET /api/conversations | API | 4 | Lists user's conversations |
| 8 | POST /api/conversations | API | 4 | Creates new conversation |
| 9 | Message persistence | Feature | 4 | Messages persist across refresh |

---

## 2. ARCHITECTURE DECISIONS (BINDING)

### Official CopilotKit + Pydantic AI Pattern

**Source:** https://github.com/CopilotKit/with-pydantic-ai

```
┌─────────────────────────────────────────────────────────────────────┐
│                         CORRECT ARCHITECTURE                         │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  ┌──────────────┐        ┌────────────────────┐        ┌──────────┐ │
│  │   Next.js    │  HTTP  │  Python Agent      │  HTTP  │ Anthropic│ │
│  │   Frontend   │───────▶│  (Pydantic AI)     │───────▶│ API      │ │
│  │              │        │  agent.to_ag_ui()  │        │          │ │
│  │  useCoAgent  │◀───────│  AG-UI Protocol    │        │          │ │
│  └──────────────┘        └────────┬───────────┘        └──────────┘ │
│                                   │                                  │
│                                   ▼                                  │
│                          ┌────────────────────┐                      │
│                          │  SteerTrue API     │                      │
│                          │  (governance)      │                      │
│                          └────────────────────┘                      │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

### What S2.2 Did WRONG (Do Not Repeat)

```
┌─────────────────────────────────────────────────────────────────────┐
│                         WRONG ARCHITECTURE (S2.2)                    │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  ┌──────────────┐     ┌─────────────────────────┐     ┌──────────┐  │
│  │   Next.js    │     │  Custom TypeScript      │     │ Anthropic│  │
│  │   Frontend   │────▶│  SteerTrueAgent         │────▶│ API      │  │
│  │              │     │  (Fighting CopilotKit)  │     │          │  │
│  │  Custom      │     │  Manual RxJS events     │     │          │  │
│  │  Adapters    │     │  Broken clone()         │     │          │  │
│  └──────────────┘     └─────────────────────────┘     └──────────┘  │
│                                                                      │
│  BUGS CAUSED: BUG-009, BUG-010, BUG-011, BUG-012, BUG-013, BUG-015  │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

### Binding Decisions

| Decision | Rationale | DO NOT |
|----------|-----------|--------|
| **Python agent with agent.to_ag_ui()** | AG-UI protocol handles events automatically | Write custom TypeScript agent |
| **useCoAgent hook on frontend** | Official CopilotKit integration | Write custom adapters |
| **SteerTrue in Python agent** | Single integration point | Inject governance in multiple places |
| **No RxJS manual event handling** | AG-UI handles this | Use Subject/Observable patterns |
| **No custom clone() or adapter code** | Framework handles this | Override CopilotKit internals |
| **Vendor-agnostic LLM config** | Pydantic AI supports multiple providers | Hardcode to single provider |

### Vendor-Agnostic LLM Design (BINDING)

**Pydantic AI supports multiple LLM providers.** The agent must be configurable, not locked to Claude.

**Supported Providers (from Pydantic AI docs):**
- `anthropic:claude-sonnet-4-20250514` (Anthropic)
- `openai:gpt-4o` (OpenAI)
- `gemini-1.5-pro` (Google)
- `groq:llama-3.1-70b-versatile` (Groq)

**Implementation Pattern:**
```python
# agent/config.py
import os

# Model configurable via environment variable
LLM_MODEL = os.getenv("LLM_MODEL", "anthropic:claude-sonnet-4-20250514")

# agent/main.py
from pydantic_ai import Agent
from agent.config import LLM_MODEL

chat_agent = Agent(
    LLM_MODEL,  # <-- Configurable, not hardcoded
    system_prompt="",
)
```

**Environment Variables for LLM:**

| Variable | Purpose | Example Values |
|----------|---------|----------------|
| LLM_MODEL | Model identifier | `anthropic:claude-sonnet-4-20250514`, `openai:gpt-4o` |
| ANTHROPIC_API_KEY | Anthropic auth | (if using Anthropic) |
| OPENAI_API_KEY | OpenAI auth | (if using OpenAI) |
| GOOGLE_API_KEY | Google auth | (if using Gemini) |

**Verification Test:**
1. Deploy with `LLM_MODEL=anthropic:claude-sonnet-4-20250514`
2. Verify chat works
3. Change to `LLM_MODEL=openai:gpt-4o` (with OPENAI_API_KEY)
4. Verify chat still works
5. Confirms vendor-agnostic design

**DO NOT:**
- Hardcode model name in Python code
- Assume Anthropic is always the provider
- Skip the API key for the configured provider

---

## 3. SERVICE ARCHITECTURE

### Python Agent Service (NEW)

**Repository:** keithcostello/steertrue-chat-agent (NEW)
**Runtime:** Python 3.12+ with uv package manager
**Railway Service:** steertrue-chat-agent (dev-sandbox)

```python
# agent/main.py - CORRECT PATTERN
# Source: https://docs.copilotkit.ai/pydantic-ai/

import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic_ai import Agent
from copilotkit.integrations.fastapi import add_fastapi_endpoint
from copilotkit import CopilotKitSDK, LangGraphAgent

# 1. Vendor-agnostic model config
LLM_MODEL = os.getenv("LLM_MODEL", "anthropic:claude-sonnet-4-20250514")

# 2. Create Pydantic AI agent
chat_agent = Agent(
    LLM_MODEL,  # <-- NOT hardcoded
    system_prompt="",  # Replaced by SteerTrue at runtime
)

# 3. Wrap with CopilotKit
sdk = CopilotKitSDK(
    agents=[
        LangGraphAgent(
            name="chat_agent",
            description="SteerTrue-governed chat agent",
            agent=chat_agent.to_ag_ui(),  # <-- KEY: AG-UI protocol
        )
    ],
)

# 4. FastAPI app with CORS
app = FastAPI()

# CORS configuration (required for frontend communication)
# Source: https://docs.copilotkit.ai/pydantic-ai/
app.add_middleware(
    CORSMiddleware,
    allow_origins=os.getenv("ALLOWED_ORIGINS", "*").split(","),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

add_fastapi_endpoint(app, sdk, "/copilotkit")

# 5. Health endpoint
@app.get("/health")
def health():
    return {"status": "healthy", "model": LLM_MODEL}
```

### Next.js Frontend (UPDATED)

**Repository:** keithcostello/ai-chatbot
**Changes from S2.2:**
- REMOVE: lib/steertrue-agent.ts (custom TypeScript agent)
- REMOVE: Custom RxJS event handling
- REMOVE: Custom adapter wrappers
- ADD: useCoAgent hook connection to Python agent

```typescript
// app/(chat)/page.tsx - CORRECT PATTERN

import { CopilotKit } from "@copilotkit/react-core";
import { CopilotChat } from "@copilotkit/react-ui";
import { useCoAgent } from "@copilotkit/react-core";

export default function ChatPage() {
  const { state, run } = useCoAgent({
    name: "chat_agent",  // Matches Python agent name
  });

  return (
    <CopilotKit
      runtimeUrl={process.env.NEXT_PUBLIC_COPILOT_RUNTIME_URL}
      agent="chat_agent"
    >
      <CopilotChat />
    </CopilotKit>
  );
}
```

### SteerTrue Integration (Python Side)

```python
# agent/steertrue.py

import httpx
from typing import Optional

STEERTRUE_API_URL = os.getenv("STEERTRUE_API_URL")

async def get_governance_prompt(session_id: str, message: str) -> tuple[str, list[str], bool]:
    """Call SteerTrue API to get composed system prompt with governance blocks.

    Returns: (system_prompt, blocks_injected, governance_available)
    """
    try:
        async with httpx.AsyncClient() as client:
            response = await client.post(
                f"{STEERTRUE_API_URL}/api/v1/analyze",
                json={
                    "session_id": session_id,
                    "user_message": message,
                },
                timeout=5.0,
            )
            data = response.json()
            return data["system_prompt"], data["blocks_injected"], True
    except Exception as e:
        # FALLBACK: Proceed with caution message when governance unavailable
        fallback_prompt = (
            "NOTICE: SteerTrue governance is temporarily unavailable. "
            "Proceed with caution. Responses are not governed by SteerTrue blocks."
        )
        return fallback_prompt, ["GOVERNANCE_UNAVAILABLE"], False
```

---

## 4. DATABASE SCHEMA

(Same as S2.2 - database design was correct)

### Tables (ai-chatbot Postgres)

```sql
-- Table: conversations
CREATE TABLE conversations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) DEFAULT 'New Conversation',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_conversations_user_id ON conversations(user_id);

-- Table: messages
CREATE TABLE messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
    role VARCHAR(20) NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    blocks_injected JSONB,
    total_tokens INTEGER
);

CREATE INDEX idx_messages_conversation ON messages(conversation_id, created_at);
```

---

## 5. ENVIRONMENT VARIABLES

### Python Agent (steertrue-chat-agent)

| Variable | Purpose | Source |
|----------|---------|--------|
| LLM_MODEL | Model identifier (vendor-agnostic) | Default: anthropic:claude-sonnet-4-20250514 |
| ANTHROPIC_API_KEY | Claude API access (if using Anthropic) | Anthropic dashboard |
| OPENAI_API_KEY | OpenAI access (if using OpenAI) | OpenAI dashboard |
| STEERTRUE_API_URL | SteerTrue governance API | Railway service URL |
| ALLOWED_ORIGINS | CORS allowed origins | Frontend Railway URL (comma-separated) |
| PORT | Server port | Railway provides |

### Next.js Frontend (ai-chatbot)

| Variable | Purpose | Source |
|----------|---------|--------|
| NEXT_PUBLIC_COPILOT_RUNTIME_URL | Python agent AG-UI endpoint | Railway service URL |
| DATABASE_URL | Postgres connection | Railway provides |

---

## 6. FILES TO DELETE FROM S2.2

These files represent the wrong architecture and must be removed:

| File | Reason |
|------|--------|
| lib/steertrue-agent.ts | Custom TypeScript agent - replaced by Python |
| Any RxJS Subject/Observable code | AG-UI handles events |
| Custom adapter wrappers | useCoAgent replaces these |
| BUG-009 through BUG-015 fixes | Root cause addressed by architecture |

---

## 7. PROJECT STRUCTURE

### Python Agent Repository

```
steertrue-chat-agent/
├── agent/
│   ├── __init__.py
│   ├── main.py           # FastAPI + agent.to_ag_ui()
│   ├── steertrue.py      # SteerTrue API client
│   └── models.py         # Pydantic models
├── pyproject.toml        # Python dependencies
├── railway.toml          # Railway config
└── .env.example
```

### Next.js Frontend Updates

```
ai-chatbot/
├── app/
│   ├── (chat)/
│   │   └── page.tsx      # useCoAgent integration
│   ├── api/
│   │   └── health/
│   │       └── route.ts  # Health check
│   └── layout.tsx        # CopilotKit provider
├── lib/
│   └── [DELETED: steertrue-agent.ts]
└── ...
```

---

## 8. DEPENDENCIES

### From S2.1 (Already Built)

| Component | Status |
|-----------|--------|
| User authentication | Complete |
| Session management | Complete |
| Users table | Complete |
| Railway deployment (frontend) | Complete |
| Postgres connection | Complete |

### New for S2.2-R1

| Component | Status | Owner |
|-----------|--------|-------|
| Python agent repository | NEW | Sprint creates |
| Railway service (Python) | NEW | Sprint creates |
| NEXT_PUBLIC_COPILOT_RUNTIME_URL | NEW | Sprint sets |

---

## 9. TESTING REQUIREMENTS

### Integration Test Chain

```
Next.js (useCoAgent)
    → HTTP →
Python Agent (AG-UI endpoint)
    → HTTP →
SteerTrue API
    → HTTP →
Anthropic API
```

### Required Tests

| # | Test | Verification |
|---|------|--------------|
| 1 | Python agent health | curl /health returns 200 |
| 2 | AG-UI endpoint exists | curl /copilotkit returns valid response |
| 3 | SteerTrue integration | Python logs show SteerTrue call |
| 4 | End-to-end chat | Send message in UI, receive response |
| 5 | Governance active | Response includes blocks_injected |

---

## 10. WALKING SKELETON (ENFORCED METHODOLOGY)

**Principle:** Build pieces independently, test them, combine like LEGO blocks.

**Each component must be:**
1. Built in isolation
2. Tested independently before integration
3. Verified working before next component starts
4. Combined incrementally with integration tests at each join

### Skeleton Layers (Build Order)

```
LAYER 1: Python Agent (standalone)
├── Test: curl /health returns 200
├── Test: curl /copilotkit returns valid response
└── GATE: Must pass before Layer 2

LAYER 2: Python Agent + LLM
├── Test: Send message, get LLM response (any model)
├── Test: Streaming works (video evidence)
└── GATE: Must pass before Layer 3

LAYER 3: Python Agent + SteerTrue
├── Test: Python logs show SteerTrue call
├── Test: blocks_injected in response
└── GATE: Must pass before Layer 4

LAYER 4: Frontend + Python Agent
├── Test: useCoAgent connects
├── Test: End-to-end message flow
└── GATE: Must pass before Layer 5

LAYER 5: Frontend + Database
├── Test: Messages persist
├── Test: Refresh shows same messages
└── GATE: Must pass before Layer 6

LAYER 6: Full Integration
├── Test: All layers working together
├── Test: UAT checklist complete
└── GATE: Sprint complete
```

### Independent Testing Before Integration

| Component | Standalone Test | Integration Test |
|-----------|-----------------|------------------|
| Python FastAPI | curl /health | N/A |
| Pydantic AI agent | curl /copilotkit with test message | Python + LLM response |
| SteerTrue client | Mock SteerTrue response | Python + real SteerTrue |
| CopilotKit frontend | Mock agent response | Frontend + Python |
| Database schema | psql queries | Frontend + DB |
| Full system | N/A | All components |

### LEGO Block Verification

Before combining any two components:
1. Each component tested in isolation
2. Integration point documented
3. Test added for the combined behavior
4. Rollback procedure defined if integration fails

**Flesh (After ALL Skeleton Layers Work):**
1. Add conversation persistence (Layer 5)
2. Add conversation list UI
3. Add message actions (copy, edit, delete)
4. Add UX polish (timestamps, indicators)

---

## EXTRACTION LOG

| Source | Used For | Date |
|--------|----------|------|
| S2.2 CONTEXT.md | Database schema, environment vars | 2026-01-24 |
| S2.2 failure analysis | Architecture lessons | 2026-01-24 |
| https://github.com/CopilotKit/with-pydantic-ai | Official pattern | 2026-01-24 |
| CopilotKit docs | AG-UI protocol | 2026-01-24 |

---

## 11. VISUAL DESIGN ALIGNMENT (BINDING)

**Design Reference Files:**
- `docs/design/storyboarding/designx/user_frontend/chat_visual_v.01.md`
- `docs/design/storyboarding/designx/user_frontend/chat_visual_v.01.png`

### Color Palette (MUST MATCH)

| Name | Hex | Usage |
|------|-----|-------|
| Background | #f8f4ed | Chat area background |
| Cards | #f0ebe0 | Message bubbles (AI) |
| Sidebar | #2d4a3e | Left sidebar |
| Primary accent | #5d8a6b | User message bubbles, buttons |
| Text primary | #1e3a3a | Message text |
| Alert accent | #d4915c | Error messages, warnings |

### Layout (MUST MATCH - 4 Sections)

**Source:** `docs/design/storyboarding/designx/user_frontend/chat_wireframe_v.01.png`

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ HEADER (full width, 56px)                                                    │
│ [Logo] SteerTrue                                        [DEV toggle] [Avatar]│
├──────────────────┬────────────────────────────┬─────────────────────────────┤
│ NAVIGATION       │ CONVERSATION               │ DASHBOARD                    │
│ (280px)          │ (flexible ~400px)          │ (~500px)                     │
│                  │                            │                              │
│ Chat History     │ [AI Message]               │ ┌─────────────────────────┐  │
│ ─────────────    │                            │ │ TIME BANNER             │  │
│ Today: PRD      │ [User Message]             │ │ 10:00 AM                │  │
│ Yesterday: ...   │                            │ └─────────────────────────┘  │
│                  │ [AI Message]               │                              │
│ Project Folders  │                            │ ┌─────────────────────────┐  │
│ ─────────────    │                            │ │ TILE GRID (4x3)         │  │
│ 📁 SteerTrue AI │ [User Message]             │ │ [Tile] [Tile] [Tile]... │  │
│   📁 V2 Launch  │                            │ │                         │  │
│                  │ ─────────────────────────  │ └─────────────────────────┘  │
│ [<< collapse]    │ [Text input bar]    [Send] │                              │
└──────────────────┴────────────────────────────┴─────────────────────────────┘
```

### S2.2-R1 Layout Scope

| Section | S2.2-R1 | Later Sprints |
|---------|---------|---------------|
| HEADER | Logo + "SteerTrue" + Avatar placeholder | DEV toggle |
| NAVIGATION | Chat History (functional) | Project Folders |
| CONVERSATION | Full chat (Stories 1-6, 11-17) | - |
| DASHBOARD | Empty placeholder with border | Tiles, clock, notifications |

**Critical:** The 4-section structure must be visible from Day 1. DASHBOARD shows empty placeholder, not hidden.

### Visual Verification Checklist

| # | Element | Expected | Verification |
|---|---------|----------|--------------|
| V1 | Sidebar background | #2d4a3e | Color picker tool |
| V2 | Chat background | #f8f4ed | Color picker tool |
| V3 | AI message bubbles | #f0ebe0 | Color picker tool |
| V4 | User message bubbles | #5d8a6b | Color picker tool |
| V5 | Text color | #1e3a3a | Color picker tool |
| V6 | Layout matches spec | 2-column | Screenshot comparison |

**AI MUST verify visual alignment before UAT approval.**

---

## 12. TECHNOLOGY BEST PRACTICES (BINDING)

**These practices are MANDATORY. Future AIs have NO OPTION to deviate.**

### CopilotKit Best Practices

| Practice | Description | Source |
|----------|-------------|--------|
| Use official hooks | `useCoAgent`, `useCopilotChat` - not custom wrappers | CopilotKit docs |
| AG-UI protocol | Let framework handle events - no manual RxJS | CopilotKit docs |
| runtimeUrl config | Single env var for agent endpoint | CopilotKit docs |
| CopilotChat component | Use built-in UI, don't recreate | CopilotKit docs |
| No adapter overrides | Framework handles adapters internally | S2.2 failure lesson |

### Pydantic AI Best Practices

| Practice | Description | Source |
|----------|-------------|--------|
| agent.to_ag_ui() | Standard method for CopilotKit integration | Pydantic AI docs |
| Structured outputs | Use Pydantic models for response validation | Pydantic AI docs |
| System prompt injection | Modify at runtime, not in agent definition | SteerTrue pattern |
| Async handlers | Use async/await for all IO operations | FastAPI best practice |
| Error handling | Wrap LLM calls in try/except, return fallback | Reliability pattern |

### Python/FastAPI Best Practices

| Practice | Description | Source |
|----------|-------------|--------|
| Health endpoint | /health for Railway readiness probes | Railway docs |
| Environment variables | Use os.getenv, no hardcoded secrets | 12-factor app |
| CORS configuration | Allow frontend origin explicitly | Security pattern |
| Async client | Use httpx.AsyncClient for external calls | Performance pattern |
| Graceful shutdown | Handle SIGTERM for Railway restarts | Railway docs |

### Next.js Best Practices

| Practice | Description | Source |
|----------|-------------|--------|
| Server components | Use 'use client' only when needed | Next.js docs |
| Environment variables | NEXT_PUBLIC_ prefix for client-side | Next.js docs |
| CSS imports | Import styles at component level | CopilotKit pattern |
| Error boundaries | Wrap chat in error boundary | React best practice |
| Loading states | Show skeleton during data fetch | UX pattern |

### Anti-Patterns (PROHIBITED)

| Anti-Pattern | Why Prohibited | Reference |
|--------------|----------------|-----------|
| Custom TypeScript agents | S2.2 failure - 6 bugs from fighting framework | S2.2 failure analysis |
| Manual RxJS events | AG-UI protocol handles this | CopilotKit docs |
| Custom adapter wrappers | Framework handles adapters | CopilotKit docs |
| Hardcoded URLs/secrets | Security violation | 12-factor app |
| Sync external calls | Blocks event loop | FastAPI docs |
| Fighting framework internals | Creates maintenance burden | Engineering principle |

---

## 13. PRE-SPRINT VERIFICATION REQUIREMENTS

**All items must be verified BEFORE sprint execution begins:**

### Documentation Verification

| # | Document | Verified | Notes |
|---|----------|----------|-------|
| D1 | CopilotKit + Pydantic AI README | | https://github.com/CopilotKit/with-pydantic-ai |
| D2 | Pydantic AI agent.to_ag_ui() docs | | https://ai.pydantic.dev/agents/ |
| D3 | CopilotKit useCoAgent docs | | https://docs.copilotkit.ai/coagents |
| D4 | Design visual spec | | chat_visual_v.01.md |
| D5 | Color palette defined | | See Section 11 |

### Technology Pattern Verification

| # | Pattern | Official Source | Verified |
|---|---------|-----------------|----------|
| T1 | agent.to_ag_ui() method | Pydantic AI docs | |
| T2 | add_fastapi_endpoint function | CopilotKit docs | |
| T3 | useCoAgent hook | CopilotKit docs | |
| T4 | CopilotChat component | CopilotKit docs | |
| T5 | Drizzle schema syntax | Drizzle docs | |

### Architecture Verification

| # | Check | Expected | Verified |
|---|-------|----------|----------|
| A1 | No custom TS agent planned | True | |
| A2 | Python agent uses AG-UI | True | |
| A3 | Frontend uses official hooks | True | |
| A4 | SteerTrue in Python only | True | |
| A5 | Design colors documented | True | |

---

**END OF SPRINT CONTEXT**
