"""
SteerTrue Chat Agent - FastAPI + Pydantic AI

Official Pattern Source: https://github.com/CopilotKit/with-pydantic-ai
Architecture: CONTEXT.md Section 3 - Service Architecture

Key Design Decisions:
1. Vendor-agnostic LLM via LLM_MODEL env var
2. AG-UI protocol via agent.to_ag_ui()
3. CopilotKit integration via add_fastapi_endpoint()
"""

import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic_ai import Agent
from copilotkit.integrations.fastapi import add_fastapi_endpoint
from copilotkit import CopilotKitSDK, LangGraphAgent

# 1. Vendor-agnostic model configuration
# Source: CONTEXT.md Section 2 - Binding Decisions
LLM_MODEL = os.getenv("LLM_MODEL", "anthropic:claude-sonnet-4-20250514")

# 2. Create Pydantic AI agent
# Source: https://ai.pydantic.dev/agents/
chat_agent = Agent(
    LLM_MODEL,
    system_prompt="You are a helpful assistant.",
)

# 3. Wrap with CopilotKit SDK
# Source: https://docs.copilotkit.ai/pydantic-ai/
sdk = CopilotKitSDK(
    agents=[
        LangGraphAgent(
            name="chat_agent",
            description="SteerTrue-governed chat agent",
            agent=chat_agent.to_ag_ui(),
        )
    ],
)

# 4. FastAPI application
app = FastAPI(
    title="SteerTrue Chat Agent",
    version="0.1.0",
)

# 5. CORS configuration (required for frontend communication)
# Source: https://docs.copilotkit.ai/pydantic-ai/
app.add_middleware(
    CORSMiddleware,
    allow_origins=os.getenv("ALLOWED_ORIGINS", "*").split(","),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 6. Add CopilotKit endpoint
# Source: CopilotKit docs - add_fastapi_endpoint
add_fastapi_endpoint(app, sdk, "/copilotkit")


# 7. Health endpoint for Railway readiness probes
@app.get("/health")
def health():
    """Health check endpoint for Railway deployment."""
    return {
        "status": "healthy",
        "model": LLM_MODEL,
        "version": "0.1.0",
    }


# 8. Root endpoint for basic verification
@app.get("/")
def root():
    """Root endpoint - basic info."""
    return {
        "service": "steertrue-chat-agent",
        "endpoints": ["/health", "/copilotkit"],
    }
