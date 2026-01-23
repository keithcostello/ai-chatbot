"""
SteerTrue API client with circuit breaker pattern.

Reference: CONTEXT.md lines 499-543 - SteerTrue error handling and fallback
"""

import asyncio
import logging
import os
import time
from typing import Optional

import httpx

from models import SteerTrueResponse

logger = logging.getLogger(__name__)

# Configuration from environment
STEERTRUE_API_URL = os.getenv("STEERTRUE_API_URL", "")
STEERTRUE_TIMEOUT_SECONDS = 5  # Per CONTEXT.md Section 5

# Fallback system prompt when SteerTrue is unavailable
# Reference: CONTEXT.md lines 517-520
FALLBACK_SYSTEM_PROMPT = """You are a helpful AI assistant.
Note: Governance system temporarily unavailable. Operating in fallback mode.
Respond helpfully while maintaining safety guidelines."""


class CircuitBreaker:
    """
    Simple circuit breaker pattern implementation.

    Reference: CONTEXT.md lines 503-506 - Circuit breaker spec
    - Failure threshold: 3 consecutive failures
    - Recovery timeout: 30 seconds
    - Half-open: 1 test request after recovery timeout

    Note: In-memory state per CONTEXT.md lines 529-543 (Tech Debt)
    """

    def __init__(
        self,
        failure_threshold: int = 3,
        recovery_timeout: float = 30.0
    ):
        self.failure_threshold = failure_threshold
        self.recovery_timeout = recovery_timeout
        self.failures = 0
        self.last_failure_time: Optional[float] = None
        self.state = "closed"  # closed, open, half_open

    def record_failure(self) -> None:
        """Record a failure and potentially open the circuit."""
        self.failures += 1
        self.last_failure_time = time.time()

        if self.failures >= self.failure_threshold:
            self.state = "open"
            logger.warning(
                f"Circuit breaker OPENED after {self.failures} failures"
            )

    def record_success(self) -> None:
        """Record a success and reset the circuit."""
        self.failures = 0
        self.state = "closed"
        logger.info("Circuit breaker CLOSED after successful request")

    def allow_request(self) -> bool:
        """Check if a request should be allowed through."""
        if self.state == "closed":
            return True

        if self.state == "open":
            # Check if recovery timeout has passed
            if self.last_failure_time is None:
                return True

            elapsed = time.time() - self.last_failure_time
            if elapsed >= self.recovery_timeout:
                self.state = "half_open"
                logger.info("Circuit breaker entering HALF_OPEN state")
                return True
            return False

        if self.state == "half_open":
            # Allow one test request
            return True

        return False

    def get_state(self) -> str:
        """Get current circuit breaker state."""
        # Re-evaluate state based on time
        if self.state == "open" and self.last_failure_time is not None:
            elapsed = time.time() - self.last_failure_time
            if elapsed >= self.recovery_timeout:
                return "half_open"
        return self.state


# Global circuit breaker instance
circuit_breaker = CircuitBreaker()


class SteerTrueClient:
    """
    Async client for SteerTrue governance API.
    """

    def __init__(self, base_url: Optional[str] = None):
        self.base_url = base_url or STEERTRUE_API_URL
        self._client: Optional[httpx.AsyncClient] = None

    async def get_client(self) -> httpx.AsyncClient:
        """Get or create HTTP client."""
        if self._client is None:
            self._client = httpx.AsyncClient(
                timeout=httpx.Timeout(STEERTRUE_TIMEOUT_SECONDS)
            )
        return self._client

    async def close(self) -> None:
        """Close the HTTP client."""
        if self._client is not None:
            await self._client.aclose()
            self._client = None

    async def analyze(
        self,
        message: str,
        session_id: str
    ) -> tuple[str, list[str]]:
        """
        Call SteerTrue /api/v1/analyze endpoint.

        Returns:
            Tuple of (system_prompt, blocks_injected)

        Reference: CONTEXT.md lines 509-515 - Fallback behavior table
        """
        # Check if SteerTrue is configured
        if not self.base_url:
            logger.warning("STEERTRUE_API_URL not configured, using fallback")
            return FALLBACK_SYSTEM_PROMPT, ["FALLBACK/not_configured"]

        # Check circuit breaker
        if not circuit_breaker.allow_request():
            logger.warning("Circuit breaker OPEN, using fallback")
            return FALLBACK_SYSTEM_PROMPT, ["FALLBACK/circuit_open"]

        try:
            client = await self.get_client()
            response = await client.post(
                f"{self.base_url}/api/v1/analyze",
                json={
                    "message": message,
                    "session_id": session_id
                }
            )

            if response.status_code != 200:
                logger.error(
                    f"SteerTrue returned {response.status_code}: {response.text}"
                )
                circuit_breaker.record_failure()
                return FALLBACK_SYSTEM_PROMPT, ["FALLBACK/steertrue_error"]

            data = response.json()

            # Validate response has required fields
            if "system_prompt" not in data or "blocks_injected" not in data:
                logger.error("SteerTrue response missing required fields")
                circuit_breaker.record_failure()
                return FALLBACK_SYSTEM_PROMPT, ["FALLBACK/invalid_response"]

            # Success - record it and return
            circuit_breaker.record_success()
            return data["system_prompt"], data["blocks_injected"]

        except httpx.TimeoutException:
            logger.error(
                f"SteerTrue request timed out after {STEERTRUE_TIMEOUT_SECONDS}s"
            )
            circuit_breaker.record_failure()
            return FALLBACK_SYSTEM_PROMPT, ["FALLBACK/timeout"]

        except httpx.HTTPError as e:
            logger.error(f"SteerTrue HTTP error: {e}")
            circuit_breaker.record_failure()
            return FALLBACK_SYSTEM_PROMPT, ["FALLBACK/steertrue_error"]

        except Exception as e:
            logger.error(f"SteerTrue unexpected error: {e}")
            circuit_breaker.record_failure()
            return FALLBACK_SYSTEM_PROMPT, ["FALLBACK/steertrue_error"]

    async def health_check(self) -> str:
        """
        Check if SteerTrue API is reachable.

        Returns:
            "connected" or "error"
        """
        if not self.base_url:
            return "not_configured"

        try:
            client = await self.get_client()
            response = await client.get(
                f"{self.base_url}/api/v1/health",
                timeout=httpx.Timeout(2.0)  # Short timeout for health check
            )
            if response.status_code == 200:
                return "connected"
            return "error"
        except Exception as e:
            logger.warning(f"SteerTrue health check failed: {e}")
            return "error"


# Global client instance
steertrue_client = SteerTrueClient()


def get_circuit_breaker_state() -> str:
    """Get current circuit breaker state for health endpoint."""
    return circuit_breaker.get_state()
