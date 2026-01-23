"""
Pydantic models for the SteerTrue Python microservice.

Reference: https://ai.pydantic.dev/ - Pydantic AI documentation
Reference: CONTEXT.md lines 469-485 - ChatResponse model specification
"""

from typing import Optional
from pydantic import BaseModel, Field


class ChatRequest(BaseModel):
    """
    Request model for POST /chat endpoint.

    Reference: CONTEXT.md lines 398-406 - Request contract
    """
    message: str = Field(
        ...,
        description="The user's message to process",
        min_length=1,
        max_length=32000
    )
    conversation_id: Optional[str] = Field(
        default=None,
        description="UUID of the conversation (optional)"
    )
    session_context: Optional[dict] = Field(
        default=None,
        description="Session context containing user_id and preferences"
    )


class ChatResponse(BaseModel):
    """
    Structured output model for Pydantic AI agent.

    Reference: CONTEXT.md lines 475-478 - ChatResponse definition

    NOTE: This model defines what we EXPECT the LLM to produce.
    Pydantic AI will validate and retry if the response doesn't match.
    """
    content: str = Field(
        ...,
        description="The AI assistant's response content"
    )
    blocks_injected: list[str] = Field(
        default_factory=list,
        description="List of governance blocks that were injected into the system prompt"
    )
    total_tokens: int = Field(
        default=0,
        description="Total tokens used in the request and response"
    )


class StreamChunk(BaseModel):
    """
    Model for streaming SSE chunk events.

    Reference: CONTEXT.md lines 409-415 - Streaming response format
    """
    type: str = Field(
        default="chunk",
        description="Event type: 'chunk', 'done', or 'error'"
    )
    content: Optional[str] = Field(
        default=None,
        description="Partial response text for chunk events"
    )


class StreamDone(BaseModel):
    """
    Model for streaming SSE done event.
    """
    type: str = Field(default="done")
    blocks_injected: list[str] = Field(default_factory=list)
    total_tokens: int = Field(default=0)


class StreamError(BaseModel):
    """
    Model for streaming SSE error event.
    """
    type: str = Field(default="error")
    code: str = Field(description="Error code for programmatic handling")
    message: str = Field(description="Human-readable error message")


class HealthResponse(BaseModel):
    """
    Health endpoint response model.

    Reference: CONTEXT.md lines 126-137 - Health endpoint contract
    """
    status: str = Field(
        description="Service health status: 'healthy', 'degraded', or 'unhealthy'"
    )
    version: str = Field(
        default="1.0.0",
        description="Service version"
    )
    dependencies: dict = Field(
        default_factory=dict,
        description="Status of external dependencies"
    )
    circuit_breaker: Optional[str] = Field(
        default=None,
        description="Circuit breaker state: 'closed', 'open', or 'half_open'"
    )


class SteerTrueRequest(BaseModel):
    """
    Request model for SteerTrue /api/v1/analyze endpoint.
    """
    message: str = Field(description="User message to analyze")
    session_id: str = Field(description="Session identifier")


class SteerTrueResponse(BaseModel):
    """
    Response model from SteerTrue /api/v1/analyze endpoint.
    """
    system_prompt: str = Field(description="Composed system prompt with governance blocks")
    blocks_injected: list[str] = Field(description="List of governance block IDs")
    session_id: str = Field(description="Session identifier")
