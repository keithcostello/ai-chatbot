# Checkpoint 0: Architect Consultation

**Timestamp:** 2026-01-23T08:58:52.745Z
**Phase:** 0 - Architect Consultation
**Branch:** dev-sprint-S2.2-R1

---

## BRANCH VERIFICATION (MANDATORY)

**Command:** `git branch --show-current`
**Expected:** dev-sprint-S2.2-R1
**Actual:** dev-sprint-S2.2-R1
**Status:** MATCH

---

## PHASE 0 ENTRY CHECKLIST

| # | Check | Confirmed | Evidence |
|---|-------|-----------|----------|
| 0.1 | Sprint CONTEXT.md read | YES | Architecture decision: "Uses official CopilotKit + Pydantic AI pattern from https://github.com/CopilotKit/with-pydantic-ai. Python agent uses `agent.to_ag_ui()` for AG-UI protocol" (CONTEXT.md lines 26-28) |
| 0.2 | Previous sprint failure understood | YES | S2.2 failed because: "Phase 3B (Python FastAPI + Pydantic AI) was SKIPPED. Custom TypeScript SteerTrueAgent was built instead. Custom agent fought CopilotKit internals (RxJS, adapter system). Result: 6 bugs (BUG-009 through BUG-015) in 2 days." (CONTEXT.md lines 18-24) |

**STATUS:** PROCEED

---

## DELIVERABLES

### 1. Read `.claude/agents/pydantic_architect.md` - COMPLETE

**Key Patterns Documented:**

| Pattern | Description | Source |
|---------|-------------|--------|
| Pydantic V2 Syntax | Use `.model_dump()` and `.model_validate()`, not `.dict()` or `.parse_obj()` | pydantic_architect.md lines 68-72 |
| Agentic Tooling | Define tools as BaseModel schemas with comprehensive Field descriptions | pydantic_architect.md lines 74-76 |
| Structured Generation | Use `tool_choice` or structured output modes over regex parsing | pydantic_architect.md lines 78-80 |

### 2. Read `.claude/agents/copilot_kit.md` - COMPLETE

**Key Patterns Documented:**

| Pattern | Description | Source |
|---------|-------------|--------|
| useCoAgent for State | For complex workflows, prefer useCoAgent (with LangGraph) over simple chat endpoints | copilot_kit.md lines 66-69 |
| useCopilotReadable | Use to make app state accessible to LLM with clear description strings | copilot_kit.md lines 71-74 |
| useCopilotAction | Treat frontend actions as Tools with strictly typed parameters schemas | copilot_kit.md lines 76-79 |

### 3. Fetch https://github.com/CopilotKit/with-pydantic-ai README - COMPLETE

**Key Information from README:**

- Framework: CopilotKit + PydanticAI integration template
- Prerequisites: Python 3.12+, uv package manager, Node.js 20+
- Agent runs on port 8000
- Frontend connects to agent via CopilotKit SDK

**Source:** `https://raw.githubusercontent.com/CopilotKit/with-pydantic-ai/main/README.md`

### 4. Document key patterns from official docs - COMPLETE

---

## DOC VERIFICATION

| Pattern | Official Source | AI Confirmation |
|---------|-----------------|-----------------|
| agent.to_ag_ui() | https://github.com/pydantic/pydantic-ai/blob/main/pydantic_ai_slim/pydantic_ai/agent/abstract.py | **CONFIRMED.** Method exists with signature: `def to_ag_ui(self, *, output_type=None, message_history=None, deferred_tool_results=None, model=None, deps=None, model_settings=None, usage_limits=None, usage=None, infer_name=True, toolsets=None, debug=False, routes=None, middleware=None, exception_handlers=None, on_startup=None, on_shutdown=None, lifespan=None) -> AGUIApp`. Returns an ASGI application that handles AG-UI requests. |
| add_fastapi_endpoint | CopilotKit docs | **CONFIRMED.** From with-pydantic-ai template: `from copilotkit.integrations.fastapi import add_fastapi_endpoint`. Usage: `add_fastapi_endpoint(app, sdk, "/copilotkit")` |
| useCoAgent | CopilotKit docs | **CONFIRMED.** From with-pydantic-ai page.tsx: `import { useCoAgent } from "@copilotkit/react-core"`. Usage: `const { state, setState } = useCoAgent<AgentState>({ name: "my_agent", initialState: {...} })`. Returns `{ state, setState, run }` |

---

## PROOF QUESTIONS

### 1. What method exposes a Pydantic AI agent to CopilotKit?

**Answer:** `agent.to_ag_ui()`

**Citation:** Pydantic AI source code (pydantic_ai/agent/abstract.py):
```python
def to_ag_ui(
    self,
    *,
    # Agent.iter parameters
    output_type: OutputSpec[OutputDataT] | None = None,
    ...
) -> AGUIApp[AgentDepsT, OutputDataT]:
    """Returns an ASGI application that handles every AG-UI request by running the agent."""
```

**Also confirmed in with-pydantic-ai template (agent/src/main.py):**
```python
app = agent.to_ag_ui(deps=StateDeps(ProverbsState()))
```

### 2. What hook does the frontend use?

**Answer:** `useCoAgent`

**Citation:** with-pydantic-ai template (src/app/page.tsx):
```typescript
import { useCoAgent } from "@copilotkit/react-core";

// Usage:
const { state, setState } = useCoAgent<AgentState>({
  name: "my_agent",
  initialState: {
    proverbs: ["CopilotKit may be new, but its the best thing since sliced bread."],
  },
});
```

### 3. What is the AG-UI protocol?

**Answer:** AG-UI (Agent-User Interaction) is a streaming event-based communication protocol between Pydantic AI agents and frontend applications.

**Citation:** Pydantic AI source (pydantic_ai/ag_ui.py docstring):
```python
"""Provides an AG-UI protocol adapter for the Pydantic AI agent.

This package provides seamless integration between pydantic-ai agents and ag-ui
for building interactive AI applications with streaming event-based communication.
"""
```

The protocol handles:
- Streaming responses from agent to frontend
- State synchronization between Python agent and React frontend
- Event types for state snapshots, tool calls, and message streaming
- Automatic handling of conversation flow (no manual RxJS needed)

---

## PHASE 0 EXIT CHECKLIST

| # | Check | Confirmed | Evidence |
|---|-------|-----------|----------|
| 0.3 | Pydantic architect patterns documented | YES | 3 patterns: (1) Pydantic V2 syntax, (2) Agentic tooling with BaseModel, (3) Structured generation over regex |
| 0.4 | CopilotKit patterns documented | YES | 3 patterns: (1) useCoAgent for state sync, (2) useCopilotReadable for context, (3) useCopilotAction for frontend tools |
| 0.5 | AG-UI protocol understood | YES | AG-UI is a streaming event-based communication protocol that handles agent-frontend interaction, state sync, and message streaming automatically |
| 0.6 | Official doc sections identified | YES | URLs reviewed: (1) https://github.com/CopilotKit/with-pydantic-ai README, (2) https://github.com/CopilotKit/with-pydantic-ai/main/agent/src/main.py, (3) https://github.com/pydantic/pydantic-ai/blob/main/pydantic_ai_slim/pydantic_ai/agent/abstract.py, (4) https://ai.pydantic.dev/ui/ag-ui/ |

**STATUS:** PHASE 0 COMPLETE

---

## KEY PATTERNS SUMMARY

### Pydantic AI Patterns (from official docs)

1. **agent.to_ag_ui()** - Returns ASGI app for AG-UI protocol
2. **StateDeps** - Inject state dependencies into agent context
3. **Agent tools** - Define with @agent.tool decorator, use RunContext for deps

### CopilotKit Patterns (from official docs)

1. **useCoAgent** - State sync between frontend and agent
2. **CopilotSidebar** - Built-in chat UI component
3. **useFrontendTool** - Frontend-defined tools callable by agent

### Integration Pattern (from with-pydantic-ai template)

```python
# Python Backend (main.py)
from pydantic_ai import Agent
from pydantic_ai.ag_ui import StateDeps

agent = Agent(model, deps_type=StateDeps[State], system_prompt="...")
app = agent.to_ag_ui(deps=StateDeps(State()))
```

```typescript
// Frontend (page.tsx)
import { useCoAgent } from "@copilotkit/react-core";
import { CopilotSidebar } from "@copilotkit/react-ui";

const { state, setState } = useCoAgent<AgentState>({
  name: "my_agent",
  initialState: {...},
});
```

---

## OFFICIAL DOCS REVIEWED

| URL | Content | Relevance |
|-----|---------|-----------|
| https://github.com/CopilotKit/with-pydantic-ai | Official starter template | Primary pattern reference |
| https://github.com/CopilotKit/with-pydantic-ai/blob/main/agent/src/main.py | Agent entry point | Shows to_ag_ui() usage |
| https://github.com/CopilotKit/with-pydantic-ai/blob/main/agent/src/agent.py | Agent definition | Shows Agent class, tools, StateDeps |
| https://github.com/CopilotKit/with-pydantic-ai/blob/main/src/app/page.tsx | Frontend page | Shows useCoAgent, CopilotSidebar |
| https://github.com/pydantic/pydantic-ai/blob/main/pydantic_ai_slim/pydantic_ai/agent/abstract.py | Agent source | to_ag_ui() method signature |
| https://ai.pydantic.dev/ui/ag-ui/ | AG-UI docs | Protocol explanation |

---

## GIT COMMANDS

```bash
git add .
git commit -m "Checkpoint 0 - Architect Consultation complete"
git push origin dev-sprint-S2.2-R1
```

---

**RELAY TO PM:** "Checkpoint 0 (Architect Consultation) ready for review on dev-sprint-S2.2-R1"

**STOP - Awaiting PM approval.**
