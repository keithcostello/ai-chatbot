# WAITING_ON - ai-chatbot Project

**Last Updated:** 2026-01-23T21:15:00Z
**Sprint:** S2.2-R1
**Position:** Phase 2 Micro-Phase Development - APPROVED, Ready to Execute

---

## Current State

**Phase 2 micro-phases APPROVED by user. Ready to execute Micro 2.1.**

### Root Cause Identified

BUG-003 (`localhost:8080` error) is caused by:
- Railway proxy sends requests with internal `host: localhost:8080`
- CopilotKit uses `host` header for callback URLs
- `x-forwarded-host` header exists but CopilotKit doesn't read it
- Fix: Middleware to rewrite host header from x-forwarded-host

### Approved Micro-Phases

| Micro | Task | Time |
|-------|------|------|
| 2.1 | Add host header middleware | 10 min |
| 2.2 | Build locally | 5 min |
| 2.3 | Commit and push | 5 min |
| 2.4 | Wait for deploy | 5 min |
| 2.5 | Integration test with agent-browser | 10 min |

### Micro 2.1 Exact Code

Add to middleware.ts BEFORE auth handling:

```typescript
if (pathname.startsWith('/api/copilotkit')) {
  const forwardedHost = req.headers.get('x-forwarded-host');
  if (forwardedHost) {
    const requestHeaders = new Headers(req.headers);
    requestHeaders.set('host', forwardedHost);
    return NextResponse.next({
      request: { headers: requestHeaders }
    });
  }
}
```

---

## Environment (Verified)

| Service | URL | Status |
|---------|-----|--------|
| Frontend | steertrue-chat-dev-sandbox.up.railway.app | Healthy |
| Python Agent | steertrue-pydantic-ai-dev-sandbox.up.railway.app | Healthy |
| Python AG-UI | /copilotkit endpoint | Working |

| Variable | Value |
|----------|-------|
| PYDANTIC_AI_URL | https://steertrue-pydantic-ai-dev-sandbox.up.railway.app |

---

## Protocol

All work follows `.claude/docs/MICRO_PHASE_PROTOCOL.md`:
- DEV only sees micro-phase spec (not full project)
- Expert review done before micro-phases
- Each micro-phase requires PROOF to close
- agent-browser verification mandatory

---

## Files

| File | Status |
|------|--------|
| app/api/copilotkit/route.ts | APPROVED by expert - no changes needed |
| app/chat/page.tsx | APPROVED - no changes needed |
| middleware.ts | NEEDS UPDATE - add host header fix |
| .claude/docs/MICRO_PHASE_PROTOCOL.md | Complete |

---

## Branch

**dev-sprint-S2.2-R1** - Commit: 63202d9
