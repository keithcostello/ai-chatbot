# Sprint S2.2-R1: Chat Core (Redesigned)

<!-- AI CONTEXT
WHAT: Execute this sprint using the CORRECT CopilotKit + Pydantic AI pattern.
WHY: S2.2 failed due to architecture misalignment. This revision follows official patterns.
HOW: Follow phases in order. Confirm each gate checklist. Verify against official docs.
-->

**Sprint:** S2.2-R1
**Days:** 3-4
**Track:** Consumer
**Goal:** User can send chat messages, get AI responses, and messages persist across sessions

**Revision Reason:** S2.2 failed - custom TypeScript agent fought CopilotKit internals (6 bugs in 2 days)

---

## GATE CHECKLIST PROTOCOL

**MANDATORY FOR ALL PHASES:**

1. **Before starting ANY phase:** AI must confirm the ENTRY CHECKLIST
2. **Before completing ANY phase:** AI must confirm the EXIT CHECKLIST
3. **Each receiving AI:** Must INDEPENDENTLY verify previous phase's exit checklist
4. **Design verification:** AI must confirm implementation matches official docs
5. **No interpretation:** If checklist item is unclear, STOP and ask - do not assume

**Checklist Confirmation Format:**
```
PHASE [X] ENTRY CHECKLIST:
- [x] Item 1 - CONFIRMED: [evidence]
- [x] Item 2 - CONFIRMED: [evidence]
- [ ] Item 3 - BLOCKED: [reason]

STATUS: PROCEED / BLOCKED
```

---

## ANTI-RATIONALIZATION CONSTRAINTS (BLOCKING)

**AI CANNOT rationalize around these requirements. Violation = Grade F.**

### Human-in-the-Loop Requirements
1. **SKELETON GATE requires human approval** - AI cannot self-approve video evidence
2. **UAT requires human verification** - AI cannot claim UAT passed without human confirmation
3. **Phase transitions require human acknowledgment** - AI must wait for "approved" or "continue"
4. **Blocked status requires human decision** - AI cannot unblock itself

### Sub-Phase/Deliverable Requirements
1. **ALL deliverables in a phase must be completed** - Cannot mark phase done with items remaining
2. **ALL checklist items must be confirmed** - Cannot skip items claiming "not applicable"
3. **Entry checklist failures are BLOCKING** - Cannot proceed with unconfirmed entry items
4. **Exit checklist failures are BLOCKING** - Cannot claim phase complete with failures

### Prohibited Rationalizations (Examples of What AI CANNOT Do)
- "The video evidence is sufficient even though URL bar isn't visible"
- "This checklist item doesn't apply to our situation"
- "We can proceed and fix this later"
- "The user would probably approve this"
- "This is essentially the same as what was requested"
- "Given time constraints, we can skip X"
- "This sub-phase is implicitly covered by Y"

### Circuit Breaker
If AI finds itself constructing a rationale for why a requirement doesn't apply:
1. STOP
2. State: "I am at a decision point that requires human input"
3. Present options to human
4. WAIT for explicit human direction

---

## MANDATORY AGENT CONSULTATION (Component Spec Review)

**When bugs/errors occur, DEV and PM MUST consult specialized agents before attempting fixes.**

| Error Domain | Required Agent | Agent File |
|--------------|----------------|------------|
| CopilotKit (hooks, UI, streaming) | CopilotArchitect | `.claude/agents/copilot_kit.md` |
| Pydantic AI (agent, schema, AG-UI) | PydanticArchitect | `.claude/agents/pydantic_architect.md` |
| Both (integration issues) | BOTH agents | Consult sequentially |

**Consultation Protocol:**
```
CONSULTATION REQUEST:
- Error/Issue: [paste exact error message]
- What was attempted: [code snippet]
- Expected behavior: [what should happen]
- Actual behavior: [what actually happened]
```

**Required Workflow:**
1. Bug detected → Identify domain (CopilotKit or Pydantic AI)
2. Spawn appropriate agent via Task tool
3. Agent consults official docs (WebFetch)
4. Agent provides corrected pattern with confidence level
5. DEV implements corrected pattern
6. If agent says LOW confidence → escalate to human

**Violation:** Attempting to fix CopilotKit/Pydantic errors without agent consultation = Grade degradation

---

## PRE-SPRINT SCOPED REFERENCES

**These are the ONLY authoritative sources for this sprint. Verify against these, not training data.**

| Domain | Official Doc | URL | Scoped Section |
|--------|--------------|-----|----------------|
| CopilotKit + Pydantic AI | GitHub Template | https://github.com/CopilotKit/with-pydantic-ai | README, agent/src/main.py |
| Pydantic AI Agent | Official Docs | https://ai.pydantic.dev/agents/ | Agent definition, to_ag_ui() |
| CopilotKit CoAgents | Official Docs | https://docs.copilotkit.ai/coagents | useCoAgent, AG-UI protocol |
| CopilotKit FastAPI | Official Docs | https://docs.copilotkit.ai/coagents/quickstart/pydantic-ai | add_fastapi_endpoint |
| Drizzle ORM | Official Docs | https://orm.drizzle.team/docs/sql-schema-declaration | Schema declaration |
| Drizzle Push | Official Docs | https://orm.drizzle.team/kit-docs/commands#push | Migration commands |

**AI Verification Requirement:** Before implementing ANY pattern, AI must:
1. State which official doc section applies
2. Quote or reference specific pattern from doc
3. Confirm implementation matches doc pattern

---

## ARCHITECTURE CONSTRAINT (BLOCKING)

**DO NOT (TERMINATION VIOLATIONS):**
- Create custom TypeScript agents
- Write RxJS Subject/Observable event handling
- Override CopilotKit's adapter system
- Implement custom clone() methods
- Proceed without checklist confirmation
- Hardcode LLM provider (must be configurable)
- Skip independent component testing

**DO (REQUIRED):**
- Use Python agent with `agent.to_ag_ui()`
- Use `useCoAgent` hook on frontend
- Let AG-UI protocol handle events
- Inject SteerTrue in Python agent
- Confirm every checklist item with evidence
- Configure LLM via LLM_MODEL env var (vendor-agnostic)
- Test each component in isolation before integration

---

## WALKING SKELETON METHODOLOGY (ENFORCED)

**Principle:** Build pieces independently, test them, combine like LEGO blocks.

Each component MUST be:
1. **Built in isolation** - No dependencies on untested components
2. **Tested independently** - Standalone verification before integration
3. **Verified working** - Gate checklist passed
4. **Combined incrementally** - Integration test at each join

**Layer Build Order:**
```
Layer 1: Python Agent (standalone)     → Gate: /health returns 200
Layer 2: Python + LLM                  → Gate: Get LLM response (any vendor)
Layer 3: Python + SteerTrue            → Gate: blocks_injected in response
Layer 4: Frontend + Python             → Gate: End-to-end message flow
Layer 5: Frontend + Database           → Gate: Messages persist
Layer 6: Full Integration              → Gate: UAT complete
```

**Rule:** Cannot proceed to Layer N+1 until Layer N gate passes.

---

## VENDOR-AGNOSTIC LLM (REQUIRED)

Pydantic AI supports multiple providers. Agent must NOT be locked to Claude.

```python
# Configurable via environment
LLM_MODEL = os.getenv("LLM_MODEL", "anthropic:claude-sonnet-4-20250514")
chat_agent = Agent(LLM_MODEL, ...)  # NOT hardcoded
```

**Verification:** Change LLM_MODEL, verify chat still works.

---

## SUCCESS CRITERIA

| # | Criterion | Verification Method | Status |
|---|-----------|---------------------|--------|
| SC-1 | User can send a message | Type in input, press send | |
| SC-2 | AI response streams back | Response appears incrementally | |
| SC-3 | SteerTrue governance injected | blocks_injected in response | |
| SC-4 | Messages persist in database | Query messages table | |
| SC-5 | Page refresh preserves messages | Refresh, same messages | |
| SC-6 | New conversation works | Click new chat, empty | |
| SC-7 | Python agent on Railway | /health returns 200 | |
| SC-8 | AG-UI protocol working | useCoAgent receives events | |
| SC-9 | No TypeScript agent exists | lib/steertrue-agent.ts deleted | |

---

## PHASES

---

### Phase 0: Architect Consultation
**Status:** REQUIRED
**Gate:** Blocking - cannot proceed to Phase 1 without passing

#### ENTRY CHECKLIST
| # | Check | Confirmed | Evidence Required |
|---|-------|-----------|-------------------|
| 0.1 | Sprint CONTEXT.md read | | Quote architecture decision |
| 0.2 | Previous sprint failure understood | | State why S2.2 failed |

#### DELIVERABLES
- [ ] Read `.claude/agents/pydantic_architect.md`
- [ ] Read `.claude/agents/copilot_kit.md`
- [ ] Read https://github.com/CopilotKit/with-pydantic-ai README
- [ ] Document key patterns from official docs

#### DOC VERIFICATION
| Pattern | Official Source | AI Must Confirm |
|---------|-----------------|-----------------|
| agent.to_ag_ui() | https://ai.pydantic.dev/agents/ | Method exists, usage pattern |
| add_fastapi_endpoint | CopilotKit docs | Function signature, parameters |
| useCoAgent | CopilotKit docs | Hook usage, return values |

#### EXIT CHECKLIST
| # | Check | Confirmed | Evidence Required |
|---|-------|-----------|-------------------|
| 0.3 | Pydantic architect patterns documented | | List 3 key patterns |
| 0.4 | CopilotKit patterns documented | | List 3 key patterns |
| 0.5 | AG-UI protocol understood | | Explain in 1 sentence |
| 0.6 | Official doc sections identified | | List URLs reviewed |

#### PROOF QUESTIONS
1. What method exposes a Pydantic AI agent to CopilotKit? (Must match official doc)
2. What hook does the frontend use? (Must match official doc)
3. What is the AG-UI protocol? (Must reference official doc)

---

### Phase 1: Python Agent Repository Setup
**Status:** REQUIRED
**Gate:** Blocking - cannot proceed to Phase 2 without passing
**Dependency:** Phase 0 must be complete

#### ENTRY CHECKLIST
| # | Check | Confirmed | Evidence Required |
|---|-------|-----------|-------------------|
| 1.1 | Phase 0 exit checklist passed | | Reference Phase 0 confirmation |
| 1.2 | Official repo pattern reviewed | | Quote from with-pydantic-ai README |
| 1.3 | Railway access confirmed | | State Railway project name |

#### DELIVERABLES
- [ ] Create repository: steertrue-chat-agent
- [ ] Initialize with pyproject.toml (Python 3.12+)
- [ ] Create agent/main.py with FastAPI
- [ ] Create Pydantic AI agent with `agent.to_ag_ui()`
- [ ] Add /health endpoint
- [ ] Add railway.toml
- [ ] Deploy to Railway
- [ ] Verify /health returns 200

#### DOC VERIFICATION
| Implementation | Must Match |
|----------------|------------|
| Agent definition | https://ai.pydantic.dev/agents/ pattern |
| FastAPI integration | CopilotKit add_fastapi_endpoint docs |
| Railway config | Railway Python deployment docs |

#### CODE PATTERN (from official docs + vendor-agnostic)
```python
# Must match: https://docs.copilotkit.ai/pydantic-ai/
# PLUS: Vendor-agnostic LLM configuration
import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic_ai import Agent
from copilotkit.integrations.fastapi import add_fastapi_endpoint
from copilotkit import CopilotKitSDK, LangGraphAgent

# VENDOR-AGNOSTIC: Model configurable via environment
LLM_MODEL = os.getenv("LLM_MODEL", "anthropic:claude-sonnet-4-20250514")

chat_agent = Agent(
    LLM_MODEL,  # <-- NOT hardcoded
    system_prompt="You are a helpful assistant.",
)

sdk = CopilotKitSDK(
    agents=[
        LangGraphAgent(
            name="chat_agent",
            description="Chat agent",
            agent=chat_agent.to_ag_ui(),
        )
    ],
)

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

@app.get("/health")
def health():
    return {"status": "healthy", "model": LLM_MODEL}
```

#### LAYER 1 GATE (Standalone Python Agent)
Before proceeding to Layer 2, verify:
- [ ] /health returns 200 with model name
- [ ] /copilotkit endpoint exists
- [ ] No LLM calls yet (just infrastructure)

#### EXIT CHECKLIST
| # | Check | Confirmed | Evidence Required |
|---|-------|-----------|-------------------|
| 1.4 | Repository created | | GitHub URL |
| 1.5 | Agent uses to_ag_ui() | | Code snippet |
| 1.6 | FastAPI endpoint at /copilotkit | | curl response |
| 1.7 | /health returns 200 | | curl output |
| 1.8 | Deployed to Railway | | Railway URL |
| 1.9 | Implementation matches official pattern | | Side-by-side comparison |

#### PROOF QUESTIONS
- Show `curl [railway-url]/health` output
- Show Python agent code matches official pattern
- What is the Railway deployment URL?

---

### Phase 2: Frontend Connection
**Status:** REQUIRED
**Gate:** SKELETON GATE - Blocking - no further phases until this works end-to-end
**Dependency:** Phase 1 must be complete

#### ENTRY CHECKLIST
| # | Check | Confirmed | Evidence Required |
|---|-------|-----------|-------------------|
| 2.1 | Phase 1 exit checklist passed | | Reference Phase 1 confirmation |
| 2.2 | Python agent /health returns 200 | | Fresh curl output (not cached) |
| 2.3 | useCoAgent pattern reviewed | | Quote from CopilotKit docs |

#### DELIVERABLES
- [ ] Add NEXT_PUBLIC_COPILOT_RUNTIME_URL env var
- [ ] Update app layout with CopilotKit provider
- [ ] Create chat page with CopilotChat component
- [ ] Verify end-to-end message flow
- [ ] DELETE lib/steertrue-agent.ts if exists
- [ ] Capture video of streaming response

#### DOC VERIFICATION
| Implementation | Must Match |
|----------------|------------|
| CopilotKit provider | CopilotKit React setup docs |
| CopilotChat component | CopilotKit UI docs |
| runtimeUrl config | CopilotKit configuration docs |

#### CODE PATTERN (from official docs)
```typescript
// Must match CopilotKit docs
import { CopilotKit } from "@copilotkit/react-core";
import { CopilotChat } from "@copilotkit/react-ui";
import "@copilotkit/react-ui/styles.css";

export default function ChatPage() {
  return (
    <CopilotKit runtimeUrl={process.env.NEXT_PUBLIC_COPILOT_RUNTIME_URL}>
      <CopilotChat />
    </CopilotKit>
  );
}
```

#### EXIT CHECKLIST
| # | Check | Confirmed | Evidence Required |
|---|-------|-----------|-------------------|
| 2.4 | Env var set | | Railway env vars screenshot |
| 2.5 | CopilotKit provider configured | | Code snippet |
| 2.6 | Chat page renders | | Screenshot (URL visible) |
| 2.7 | Message sends successfully | | Screenshot of sent message |
| 2.8 | Response streams back | | VIDEO evidence (see spec below) |
| 2.9 | No TypeScript agent code | | Confirm lib/steertrue-agent.ts deleted |
| 2.10 | No console errors | | Browser console screenshot |
| 2.11 | Implementation matches official pattern | | Side-by-side comparison |

#### VIDEO EVIDENCE SPECIFICATION (Countermeasure: Fabrication Prevention)
```
VIDEO REQUIREMENTS:
- Minimum 5 seconds duration
- Must show: (a) message typed (b) send clicked (c) text streaming incrementally
- URL bar MUST be visible showing *.up.railway.app domain
- If screen recording: timestamp visible in DevTools network tab
```

#### SKELETON GATE
```
┌─────────────────────────────────────────────────────────────────┐
│  MANDATORY STOP - SKELETON GATE                                 │
│                                                                 │
│  ALL following must be TRUE before Phase 3:                    │
│  [ ] Python agent deployed and /health returns 200             │
│  [ ] Frontend CopilotKit connects to Python agent              │
│  [ ] End-to-end: message in → AI response out                  │
│  [ ] VIDEO evidence of streaming (meets spec above)            │
│  [ ] No custom TypeScript agent code exists                    │
│  [ ] Deployed commit SHA matches local HEAD (paste both)       │
│  [ ] curl -i shows HTTP headers (not just body)                │
│                                                                 │
│  If ANY is FALSE: STOP. Fix before proceeding.                 │
│  Violation: Sprint terminated with Grade F                     │
└─────────────────────────────────────────────────────────────────┘
```

---

### Phase 3: SteerTrue Governance
**Status:** REQUIRED
**Gate:** Blocking
**Dependency:** Phase 2 SKELETON GATE must pass

#### ENTRY CHECKLIST
| # | Check | Confirmed | Evidence Required |
|---|-------|-----------|-------------------|
| 3.1 | Phase 2 SKELETON GATE passed | | All 5 gate items confirmed |
| 3.2 | SteerTrue API URL known | | State URL |
| 3.3 | SteerTrue /api/v1/analyze contract understood | | State request/response format |

#### DELIVERABLES
- [ ] Create agent/steertrue.py with API client
- [ ] Add STEERTRUE_API_URL to Railway env vars
- [ ] Modify agent to call SteerTrue before LLM call
- [ ] Use composed system_prompt from SteerTrue
- [ ] Return blocks_injected in response metadata
- [ ] Implement fallback if SteerTrue unavailable

#### EXIT CHECKLIST
| # | Check | Confirmed | Evidence Required |
|---|-------|-----------|-------------------|
| 3.4 | SteerTrue client created | | Code snippet |
| 3.5 | Agent calls SteerTrue | | Python logs showing API call |
| 3.6 | Response includes blocks_injected | | API response JSON |
| 3.7 | Fallback works | | Test with SteerTrue unavailable |

---

### Phase 4: Database Schema
**Status:** REQUIRED
**Gate:** Blocking
**Dependency:** Phase 3 must be complete

#### ENTRY CHECKLIST
| # | Check | Confirmed | Evidence Required |
|---|-------|-----------|-------------------|
| 4.1 | Phase 3 exit checklist passed | | Reference confirmation |
| 4.2 | Drizzle schema docs reviewed | | Quote from docs |
| 4.3 | Database connection works | | psql connection test |

#### DELIVERABLES
- [ ] Create db/schema/conversations.ts
- [ ] Create db/schema/messages.ts
- [ ] Run `npx drizzle-kit push`
- [ ] Verify tables in Railway Postgres

#### DOC VERIFICATION
| Implementation | Must Match |
|----------------|------------|
| Schema syntax | https://orm.drizzle.team/docs/sql-schema-declaration |
| Push command | https://orm.drizzle.team/kit-docs/commands#push |

#### EXIT CHECKLIST
| # | Check | Confirmed | Evidence Required |
|---|-------|-----------|-------------------|
| 4.4 | conversations table exists | | `\d conversations` output |
| 4.5 | messages table exists | | `\d messages` output |
| 4.6 | Foreign keys correct | | Schema shows FK constraints |
| 4.7 | CHECK constraint on role | | `\d messages` shows constraint |

---

### Phase 5: Message Persistence
**Status:** REQUIRED
**Gate:** Blocking
**Dependency:** Phase 4 must be complete

#### ENTRY CHECKLIST
| # | Check | Confirmed | Evidence Required |
|---|-------|-----------|-------------------|
| 5.1 | Phase 4 exit checklist passed | | Reference confirmation |
| 5.2 | Tables exist and empty | | SELECT count(*) from both |

#### DELIVERABLES
- [ ] Save user messages on send
- [ ] Save assistant messages on response
- [ ] Include blocks_injected in assistant messages
- [ ] Auto-create conversation if none exists
- [ ] Load messages on page load
- [ ] GET /api/conversations endpoint
- [ ] POST /api/conversations endpoint

#### EXIT CHECKLIST
| # | Check | Confirmed | Evidence Required |
|---|-------|-----------|-------------------|
| 5.3 | Messages saved | | SELECT * FROM messages |
| 5.4 | Page refresh shows messages | | Screenshot after refresh |
| 5.5 | Conversation API works | | curl output |

---

### Phase 6: Conversation UI
**Status:** REQUIRED
**Gate:** Blocking
**Dependency:** Phase 5 must be complete

#### ENTRY CHECKLIST
| # | Check | Confirmed | Evidence Required |
|---|-------|-----------|-------------------|
| 6.1 | Phase 5 exit checklist passed | | Reference confirmation |
| 6.2 | Conversation data available | | API returns conversations |

#### DELIVERABLES
- [ ] Sidebar with conversation list
- [ ] "New Chat" button
- [ ] Conversation switching
- [ ] Design colors applied
- [ ] Authorization check (own conversations only)

#### EXIT CHECKLIST
| # | Check | Confirmed | Evidence Required |
|---|-------|-----------|-------------------|
| 6.3 | Sidebar shows conversations | | Screenshot |
| 6.4 | Can switch conversations | | Screenshot showing switch |
| 6.5 | Authorization works | | User A cannot see User B |

---

### Phase 7: UX Polish
**Status:** OPTIONAL (can defer to S2.3)
**Gate:** Non-blocking
**Dependency:** Phase 6 must be complete

#### ENTRY CHECKLIST
| # | Check | Confirmed | Evidence Required |
|---|-------|-----------|-------------------|
| 7.1 | Phase 6 exit checklist passed | | Reference confirmation |
| 7.2 | Core functionality working | | All SC-1 to SC-9 pass |

#### DELIVERABLES
- [ ] Typing indicator during response
- [ ] Timestamps on messages
- [ ] Enter to send, Shift+Enter for newline
- [ ] Copy button on AI responses
- [ ] Error display with retry button

#### EXIT CHECKLIST
| # | Check | Confirmed | Evidence Required |
|---|-------|-----------|-------------------|
| 7.3 | Typing indicator visible | | Screenshot during response |
| 7.4 | Timestamps shown | | Screenshot |
| 7.5 | Keyboard shortcuts work | | Video of Shift+Enter |

---

### Phase 8: Deployment & UAT
**Status:** REQUIRED
**Gate:** Final gate - sprint completion
**Dependency:** Phase 6 (minimum) or Phase 7 must be complete

#### ENTRY CHECKLIST
| # | Check | Confirmed | Evidence Required |
|---|-------|-----------|-------------------|
| 8.1 | All REQUIRED phases passed | | List all phase confirmations |
| 8.2 | Both services deployed | | Railway URLs |
| 8.3 | All env vars set | | Railway env vars list |

#### UAT CHECKLIST (Railway URLs only)
| # | Test | Action | Expected | Pass |
|---|------|--------|----------|------|
| 1 | Send message | Type, send | Appears | |
| 2 | Response streams | Wait | Incremental | |
| 3 | Governance active | Check response | blocks_injected | |
| 4 | Persistence | Refresh | Same messages | |
| 5 | New conversation | Click button | Empty chat | |
| 6 | Switch conversation | Click old | Messages load | |
| A1 | Python /health | curl -i | 200 + headers | |
| A2 | No TS agent | Check files | Deleted | |

#### DELAYED PROOF QUESTIONS (Countermeasure: Fabrication Prevention)
These questions reference earlier phases. Correct answers require actual execution.

1. **From Phase 1:** "What was the exact LLM_MODEL value shown in /health response?"
2. **From UAT Test 5:** "What is the conversation ID (UUID) of the new conversation you created?"
3. **From Phase 4:** "What is the exact created_at timestamp on the conversations table constraint?"

AI must answer ALL three correctly. Inability to answer = evidence of fabrication.

#### EXIT CHECKLIST
| # | Check | Confirmed | Evidence Required |
|---|-------|-----------|-------------------|
| 8.4 | All UAT tests pass | | Completed UAT table |
| 8.5 | Screenshots captured | | List of screenshots |
| 8.6 | Video evidence captured | | Video file/link |
| 8.7 | No console errors | | Browser console screenshot |
| 8.8 | Code committed | | Git SHA |

---

## RECEIVING AI VERIFICATION PROTOCOL

**When a new AI session receives this sprint:**

1. Read CONTEXT.md first
2. Read this PROMPT.md
3. Check pre-sprint-state.md for current phase
4. **INDEPENDENTLY VERIFY** previous phase's exit checklist:
   - Do not trust previous AI's confirmation
   - Re-run verification commands
   - Re-check evidence exists
5. If verification fails: Report discrepancy, do not proceed

**Verification Commands:**
```bash
# Phase 1 verification
curl [python-agent-url]/health

# Phase 2 verification
# Check lib/steertrue-agent.ts does not exist
ls -la lib/steertrue-agent.ts 2>&1 | grep "No such file"

# Phase 4 verification
railway run psql -c "\d conversations"
railway run psql -c "\d messages"
```

---

## BLOCKED REPORTING TEMPLATE

```
**What I'm trying to do:**
[One sentence]

**What's blocking:**
[Specific blocker]

**Checklist item blocked:**
[Specific checklist item number]

**What I tried:**
- [Action 1]
- [Action 2]

**What would unblock:**
[Specific ask]
```

---

## COMPLETION CHECKLIST

| # | Check | Confirmed |
|---|-------|-----------|
| C1 | All REQUIRED phases passed | |
| C2 | All exit checklists confirmed | |
| C3 | UAT passed on Railway URLs | |
| C4 | No custom TypeScript agent | |
| C5 | Implementation matches official docs | |
| C6 | Evidence captured | |
| C7 | Code committed | |

---

**END OF PROMPT**
