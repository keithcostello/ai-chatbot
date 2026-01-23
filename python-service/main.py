"""
FastAPI application for SteerTrue Pydantic AI microservice.

Reference: CONTEXT.md lines 387-438 - Python Microservice API Contract
Reference: https://fastapi.tiangolo.com/ - FastAPI documentation
"""

import asyncio
import json
import logging
import os
from contextlib import asynccontextmanager
from typing import AsyncGenerator

from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse

from agent import chat_streaming, chat_with_retry
from models import ChatRequest, ChatResponse, HealthResponse
from steertrue import (
    get_circuit_breaker_state,
    steertrue_client,
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger(__name__)

# Environment validation
ANTHROPIC_API_KEY = os.getenv("ANTHROPIC_API_KEY")
STEERTRUE_API_URL = os.getenv("STEERTRUE_API_URL")


@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Application lifespan handler.

    Reference: CONTEXT.md lines 101-121 - Startup sequence
    """
    # Startup
    logger.info("Starting SteerTrue Pydantic AI microservice...")

    # Step 2: Validate environment variables
    if not ANTHROPIC_API_KEY:
        logger.warning(
            "ANTHROPIC_API_KEY not set - service will fail on chat requests"
        )
    else:
        logger.info("ANTHROPIC_API_KEY configured")

    if not STEERTRUE_API_URL:
        logger.warning(
            "STEERTRUE_API_URL not set - will use fallback governance"
        )
    else:
        logger.info(f"SteerTrue API URL: {STEERTRUE_API_URL}")

    # Step 5: Service ready
    logger.info("Service startup complete")

    yield

    # Shutdown
    logger.info("Shutting down...")
    await steertrue_client.close()
    logger.info("Shutdown complete")


# Create FastAPI app
app = FastAPI(
    title="SteerTrue Pydantic AI Service",
    description="Python microservice for AI chat with SteerTrue governance",
    version="1.0.0",
    lifespan=lifespan
)

# CORS middleware for development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Restrict in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health", response_model=HealthResponse)
async def health_check() -> HealthResponse:
    """
    Health check endpoint.

    Reference: CONTEXT.md lines 126-137 - Health endpoint contract
    """
    # Check SteerTrue connectivity
    steertrue_status = await steertrue_client.health_check()

    # Check Anthropic API key is configured (not validity)
    anthropic_status = "configured" if ANTHROPIC_API_KEY else "not_configured"

    # Get circuit breaker state
    circuit_state = get_circuit_breaker_state()

    # Determine overall status
    if anthropic_status != "configured":
        status = "unhealthy"
    elif steertrue_status == "error":
        status = "degraded"
    else:
        status = "healthy"

    return HealthResponse(
        status=status,
        version="1.0.0",
        dependencies={
            "steertrue_api": steertrue_status,
            "anthropic_api": anthropic_status
        },
        circuit_breaker=circuit_state
    )


async def generate_sse_stream(
    message: str,
    session_id: str
) -> AsyncGenerator[str, None]:
    """
    Generate SSE stream for chat response.

    Reference: CONTEXT.md lines 409-415 - SSE response format
    Reference: https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events
    """
    try:
        # Get governance from SteerTrue
        system_prompt, blocks_injected = await steertrue_client.analyze(
            message=message,
            session_id=session_id
        )

        logger.info(
            f"SteerTrue returned {len(blocks_injected)} blocks: {blocks_injected}"
        )

        # Stream response from Pydantic AI agent
        async for event in chat_streaming(message, system_prompt, blocks_injected):
            # Format as SSE
            data = json.dumps(event)
            yield f"data: {data}\n\n"

    except Exception as e:
        logger.error(f"SSE stream error: {e}")
        error_event = json.dumps({
            "type": "error",
            "code": "STREAM_ERROR",
            "message": str(e)
        })
        yield f"data: {error_event}\n\n"


@app.post("/chat")
async def chat(
    request: ChatRequest,
    req: Request
) -> StreamingResponse:
    """
    Chat endpoint with streaming SSE response.

    Reference: CONTEXT.md lines 392-438 - POST /chat contract

    Headers:
        X-Session-ID: Session identifier for SteerTrue governance
    """
    # Get session ID from header or request body
    session_id = req.headers.get("X-Session-ID")
    if not session_id and request.session_context:
        session_id = request.session_context.get("user_id")
    if not session_id:
        session_id = "anonymous"

    logger.info(
        f"Chat request - session: {session_id}, "
        f"message length: {len(request.message)}"
    )

    # Validate Anthropic API key is configured
    if not ANTHROPIC_API_KEY:
        raise HTTPException(
            status_code=503,
            detail={
                "error": "AI service not configured",
                "code": "ANTHROPIC_NOT_CONFIGURED"
            }
        )

    # Return streaming response
    return StreamingResponse(
        generate_sse_stream(
            message=request.message,
            session_id=session_id
        ),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            "X-Accel-Buffering": "no"
        }
    )


@app.post("/chat/sync", response_model=ChatResponse)
async def chat_sync(
    request: ChatRequest,
    req: Request
) -> ChatResponse:
    """
    Synchronous chat endpoint (non-streaming).

    Useful for testing and simple integrations.
    """
    # Get session ID
    session_id = req.headers.get("X-Session-ID")
    if not session_id and request.session_context:
        session_id = request.session_context.get("user_id")
    if not session_id:
        session_id = "anonymous"

    logger.info(
        f"Sync chat request - session: {session_id}, "
        f"message length: {len(request.message)}"
    )

    # Validate Anthropic API key
    if not ANTHROPIC_API_KEY:
        raise HTTPException(
            status_code=503,
            detail={
                "error": "AI service not configured",
                "code": "ANTHROPIC_NOT_CONFIGURED"
            }
        )

    try:
        # Get governance from SteerTrue
        system_prompt, blocks_injected = await steertrue_client.analyze(
            message=request.message,
            session_id=session_id
        )

        # Call Pydantic AI agent with retry logic
        response = await chat_with_retry(
            message=request.message,
            system_prompt=system_prompt,
            blocks_injected=blocks_injected
        )

        return response

    except Exception as e:
        logger.error(f"Sync chat error: {e}")
        raise HTTPException(
            status_code=500,
            detail={
                "error": "Chat request failed",
                "code": "CHAT_ERROR",
                "message": str(e)
            }
        )


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=int(os.getenv("PORT", "8000")),
        reload=True
    )
