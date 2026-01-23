"""
Pydantic AI agent definition for chat interactions.

Reference: https://ai.pydantic.dev/ - Pydantic AI documentation
Reference: CONTEXT.md lines 469-485 - Agent definition pattern
Reference: pydantic_architect.md - "Text is the interface, but Structure is the product"
"""

import logging
import os
from typing import Optional

from pydantic import ValidationError
from pydantic_ai import Agent

from models import ChatResponse

logger = logging.getLogger(__name__)

# Configuration
ANTHROPIC_MODEL = "claude-sonnet-4-20250514"  # Per CONTEXT.md line 480
MAX_RETRIES = 2  # Per PROMPT.md lines 266-281


def create_chat_agent(system_prompt: str = "") -> Agent[None, ChatResponse]:
    """
    Create a Pydantic AI agent configured for chat.

    NOTE: The system_prompt parameter is replaced by SteerTrue governance.
    We pass it dynamically per request via agent.run().

    Reference: pydantic_architect.md - Agent definitions with structured output
    """
    # Note: Pydantic AI uses ANTHROPIC_API_KEY from environment automatically
    return Agent(
        f"anthropic:{ANTHROPIC_MODEL}",
        result_type=ChatResponse,
        system_prompt=system_prompt or "You are a helpful AI assistant.",
    )


async def chat_with_retry(
    message: str,
    system_prompt: str,
    blocks_injected: list[str]
) -> ChatResponse:
    """
    Execute chat with Pydantic AI agent and retry on validation failures.

    Reference: PROMPT.md lines 266-281 - Retry logic specification

    Args:
        message: User's message
        system_prompt: SteerTrue composed system prompt
        blocks_injected: List of governance blocks for metadata

    Returns:
        ChatResponse with content and metadata

    Raises:
        ValidationError: If all retries fail
    """
    last_error: Optional[Exception] = None

    for attempt in range(MAX_RETRIES + 1):
        try:
            # Create agent with SteerTrue system prompt
            agent = create_chat_agent(system_prompt)

            # Run the agent - Pydantic AI handles structured output validation
            result = await agent.run(message)

            # Pydantic AI returns result.data as the validated ChatResponse
            # We need to inject our blocks_injected since the LLM doesn't know them
            response = ChatResponse(
                content=result.data.content if hasattr(result.data, 'content') else str(result.data),
                blocks_injected=blocks_injected,
                total_tokens=result.usage().total_tokens if hasattr(result, 'usage') else 0
            )

            return response

        except ValidationError as e:
            last_error = e
            if attempt < MAX_RETRIES:
                logger.warning(
                    f"Pydantic validation failed, retry {attempt + 1}/{MAX_RETRIES}: {e}"
                )
                continue
            logger.error(f"All {MAX_RETRIES} retries exhausted: {e}")
            raise

        except Exception as e:
            last_error = e
            logger.error(f"Unexpected error during chat: {e}")
            raise

    # Should not reach here, but for type safety
    if last_error:
        raise last_error
    raise RuntimeError("Unexpected state in chat_with_retry")


async def chat_streaming(
    message: str,
    system_prompt: str,
    blocks_injected: list[str]
):
    """
    Execute chat with streaming response.

    Yields SSE-formatted chunks for streaming to the client.

    Reference: CONTEXT.md lines 409-415 - Streaming response format
    """
    try:
        # Create agent with SteerTrue system prompt
        agent = create_chat_agent(system_prompt)

        # Use Pydantic AI's streaming capability
        # Note: Pydantic AI streaming works differently - we stream the raw response
        # and then validate at the end
        async with agent.run_stream(message) as result:
            accumulated_content = ""

            # Stream text chunks
            async for text in result.stream_text():
                accumulated_content += text
                yield {
                    "type": "chunk",
                    "content": text
                }

            # After streaming completes, get usage info
            # Note: result.usage() is available after stream completes
            try:
                usage = result.usage()
                total_tokens = usage.total_tokens if usage else 0
            except Exception:
                total_tokens = 0

            # Yield done event with metadata
            yield {
                "type": "done",
                "blocks_injected": blocks_injected,
                "total_tokens": total_tokens
            }

    except ValidationError as e:
        logger.error(f"Streaming validation error: {e}")
        yield {
            "type": "error",
            "code": "VALIDATION_ERROR",
            "message": str(e)
        }

    except Exception as e:
        logger.error(f"Streaming error: {e}")
        yield {
            "type": "error",
            "code": "STREAM_ERROR",
            "message": str(e)
        }
