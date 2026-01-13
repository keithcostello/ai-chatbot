# Troubleshooting Log: Chat API 400 Errors

## Current Status
- **Build**: SUCCESS (Next.js 16.0.10 Turbopack)
- **Deployment**: RUNNING on Railway
- **Direct Anthropic Code**: LOADING (`[anthropic-direct] Initializing with API key: present (108 chars)`)
- **Chat API**: 400 Bad Request

## Issue Description
POST /api/chat returns 400 Bad Request with message:
```json
{"code":"bad_request:api","message":"The request couldn't be processed. Please check your input and try again."}
```

## Test Request
```bash
curl -X POST "https://steertrue-chat-dev-sandbox.up.railway.app/api/chat" \
  -H "Content-Type: application/json" \
  -H "Cookie: [session-token]" \
  -d '{"id":"test-chat-123","messages":[{"role":"user","content":"Say hello"}],"selectedChatModel":"chat-model-small"}'
```

## What's Been Done

### Attempt 1: AI SDK v6 with @ai-sdk/anthropic
- **Result**: FAILED - Gateway error "Unauthenticated"
- **Reason**: AI SDK v6 routes through Vercel AI Gateway by default

### Attempt 2: Remove @ai-sdk/gateway from package.json
- **Result**: FAILED - Still using gateway

### Attempt 3: Set AI_GATEWAY_API_KEY="disabled"
- **Result**: FAILED - Changed error to "Invalid API key"
- **Action**: Deleted variable from Railway dashboard

### Attempt 4: Direct Anthropic SDK wrapper (anthropic-direct.ts)
- **Result**: BUILD SUCCESS, 400 errors persist
- **Progress**: Code IS loading (logs confirm initialization)
- **Issue**: Request still failing at validation layer

## Investigation Queue
1. [x] Check request validation in chat API route - DONE
2. [x] Verify request body structure matches expected schema - FOUND ISSUES
3. [ ] Check if model name mapping is working
4. [ ] Verify SteerTrue middleware not rejecting

## Root Cause Found (2026-01-13T23:08:00Z)

Schema validation failing because my test request was wrong:

**My test request (WRONG):**
```json
{"id":"test-chat-123","messages":[{"role":"user","content":"Say hello"}],"selectedChatModel":"chat-model-small"}
```

**Schema requirements (from schema.ts):**
- `id`: Must be UUID (not "test-chat-123")
- `selectedVisibilityType`: REQUIRED field (missing!)
- `message` format: Needs `parts` array with `{type: "text", text: "..."}`, not `content` string
- Message `id`: Must be UUID

**Correct request format:**
```json
{
  "id": "<valid-uuid>",
  "message": {
    "id": "<valid-uuid>",
    "role": "user",
    "parts": [{"type": "text", "text": "Say hello"}]
  },
  "selectedChatModel": "chat-model-small",
  "selectedVisibilityType": "private"
}
```

## Test Result 1: Validation PASSED (2026-01-13T23:10:00Z)

With correct format, error changed from:
- OLD: `{"code":"bad_request:api","message":"The request couldn't be processed..."}` (400)
- NEW: `{"code":"","message":"Something went wrong. Please try again later."}` (400)

**Diagnosis**: Schema validation passed! Error is now coming from deeper layer (LLM call or streaming).
**Next Step**: Check if error is from SteerTrue call or Anthropic call.

## Test Result 2: ROOT CAUSE FOUND (2026-01-13T23:12:00Z)

**Error from Railway logs:**
```
AI_UnsupportedModelVersionError: Unsupported model version v1 for provider "anthropic-direct" and model "claude-3-haiku-20240307". AI SDK 5 only supports models that implement specification version "v2".
```

**Root Cause**: `anthropic-direct.ts` uses `specificationVersion: 'v1'` but AI SDK 5/6 requires `specificationVersion: 'v2'`

**Fix**: Change `specificationVersion: 'v1'` to `specificationVersion: 'v2'` in anthropic-direct.ts

**Additional Note**: The logs also show SteerTrue is working (`[anthropic-direct] Creating model: claude-3-haiku-20240307`) and model mapping is correct.

## Attempt 5: Switch back to @ai-sdk/anthropic (2026-01-13T23:18:00Z)

Changed providers.ts to use official `@ai-sdk/anthropic` directly:
```typescript
import { anthropic } from "@ai-sdk/anthropic";
// ...
return anthropic(anthropicModelId);
```

The official provider should:
- Use ANTHROPIC_API_KEY env var automatically
- Support v2 specification required by AI SDK 5/6

**Deploying now...**

## Files Involved
- `lib/ai/anthropic-direct.ts` - Direct Anthropic SDK wrapper
- `lib/ai/providers.ts` - Model provider selection
- `app/api/chat/route.ts` - Chat API endpoint
- `lib/steertrue.ts` - SteerTrue governance client

## Next Steps
1. Read `app/api/chat/route.ts` to understand request validation
2. Check what schema the API expects
3. Verify model name mapping

---
Updated: 2026-01-13T23:05:00Z
