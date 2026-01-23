"""
SteerTrue Chat Agent - FastAPI + Pydantic AI

Official Pattern Source: https://github.com/CopilotKit/with-pydantic-ai
Architecture: Native AG-UI protocol via agent.to_ag_ui()

Key Design Decisions:
1. Vendor-agnostic LLM via LLM_MODEL env var
2. AG-UI protocol via agent.to_ag_ui() (native Pydantic AI)
3. FastAPI mounts AG-UI app at /copilotkit
"""

import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic_ai import Agent

# 1. Vendor-agnostic model configuration
LLM_MODEL = os.getenv("LLM_MODEL", "anthropic:claude-sonnet-4-20250514")

# 2. Create Pydantic AI agent
chat_agent = Agent(
    LLM_MODEL,
    system_prompt="You are a helpful assistant.",
)

# 3. FastAPI application
app = FastAPI(
    title="SteerTrue Chat Agent",
    version="0.1.0",
)

# 4. CORS configuration (required for frontend communication)
app.add_middleware(
    CORSMiddleware,
    allow_origins=os.getenv("ALLOWED_ORIGINS", "*").split(","),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 5. Mount AG-UI app at /copilotkit
# Source: Pydantic AI native AG-UI integration
ag_ui_app = chat_agent.to_ag_ui()
app.mount("/copilotkit", ag_ui_app)


# 6. Health endpoint for Railway readiness probes
@app.get("/health")
def health():
    """Health check endpoint for Railway deployment."""
    return {
        "status": "healthy",
        "model": LLM_MODEL,
        "version": "0.1.0",
    }


# 7. Root endpoint for basic verification
@app.get("/")
def root():
    """Root endpoint - basic info."""
    return {
        "service": "steertrue-chat-agent",
        "endpoints": ["/health", "/copilotkit"],
    }
