"""
Local test script for verifying Python service structure.

Run with: python test_local.py
"""

import sys

def test_imports():
    """Test that all modules can be imported."""
    print("Testing imports...")

    try:
        from models import (
            ChatRequest,
            ChatResponse,
            HealthResponse,
            StreamChunk,
            StreamDone,
            StreamError,
        )
        print("  models.py: OK")
    except Exception as e:
        print(f"  models.py: FAILED - {e}")
        return False

    try:
        from steertrue import (
            SteerTrueClient,
            CircuitBreaker,
            get_circuit_breaker_state,
        )
        print("  steertrue.py: OK")
    except Exception as e:
        print(f"  steertrue.py: FAILED - {e}")
        return False

    try:
        from agent import (
            create_chat_agent,
            chat_with_retry,
            chat_streaming,
        )
        print("  agent.py: OK")
    except Exception as e:
        print(f"  agent.py: FAILED - {e}")
        return False

    try:
        from main import app
        print("  main.py: OK")
    except Exception as e:
        print(f"  main.py: FAILED - {e}")
        return False

    return True


def test_models():
    """Test Pydantic model validation."""
    print("\nTesting Pydantic models...")

    from models import ChatRequest, ChatResponse, HealthResponse

    # Test ChatRequest
    try:
        req = ChatRequest(message="Hello", conversation_id=None)
        assert req.message == "Hello"
        print("  ChatRequest: OK")
    except Exception as e:
        print(f"  ChatRequest: FAILED - {e}")
        return False

    # Test ChatResponse
    try:
        resp = ChatResponse(
            content="Hello, I'm an AI assistant.",
            blocks_injected=["L1/core_identity"],
            total_tokens=42
        )
        assert resp.content == "Hello, I'm an AI assistant."
        assert resp.blocks_injected == ["L1/core_identity"]
        print("  ChatResponse: OK")
    except Exception as e:
        print(f"  ChatResponse: FAILED - {e}")
        return False

    # Test HealthResponse
    try:
        health = HealthResponse(
            status="healthy",
            version="1.0.0",
            dependencies={"steertrue_api": "connected"},
            circuit_breaker="closed"
        )
        assert health.status == "healthy"
        print("  HealthResponse: OK")
    except Exception as e:
        print(f"  HealthResponse: FAILED - {e}")
        return False

    return True


def test_circuit_breaker():
    """Test circuit breaker logic."""
    print("\nTesting circuit breaker...")

    from steertrue import CircuitBreaker

    cb = CircuitBreaker(failure_threshold=3, recovery_timeout=1.0)

    # Should start closed
    assert cb.state == "closed"
    assert cb.allow_request() == True
    print("  Initial state (closed): OK")

    # Record failures
    cb.record_failure()
    cb.record_failure()
    assert cb.state == "closed"
    assert cb.allow_request() == True
    print("  After 2 failures (still closed): OK")

    # Third failure should open
    cb.record_failure()
    assert cb.state == "open"
    assert cb.allow_request() == False
    print("  After 3 failures (open): OK")

    # Success should reset
    cb.record_success()
    assert cb.state == "closed"
    assert cb.allow_request() == True
    print("  After success (closed again): OK")

    return True


def test_fastapi_routes():
    """Test FastAPI routes are defined."""
    print("\nTesting FastAPI routes...")

    from main import app

    routes = [route.path for route in app.routes]

    assert "/health" in routes, "/health route missing"
    print("  GET /health: OK")

    assert "/chat" in routes, "/chat route missing"
    print("  POST /chat: OK")

    assert "/chat/sync" in routes, "/chat/sync route missing"
    print("  POST /chat/sync: OK")

    return True


def main():
    """Run all tests."""
    print("=" * 60)
    print("SteerTrue Pydantic AI Service - Local Verification")
    print("=" * 60)

    all_passed = True

    if not test_imports():
        all_passed = False

    if not test_models():
        all_passed = False

    if not test_circuit_breaker():
        all_passed = False

    if not test_fastapi_routes():
        all_passed = False

    print("\n" + "=" * 60)
    if all_passed:
        print("ALL TESTS PASSED")
        return 0
    else:
        print("SOME TESTS FAILED")
        return 1


if __name__ == "__main__":
    sys.exit(main())
