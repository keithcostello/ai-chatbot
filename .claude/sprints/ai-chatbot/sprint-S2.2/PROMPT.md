# Sprint S2.2: Chat Core

<!-- AI CONTEXT
WHAT: Execute this sprint to deliver chat functionality with persistence.
WHY: Core feature - users need to chat with AI. Foundation for all chat features.
HOW: Follow phases in order. Meet success criteria. Pass UAT before merge.
-->

**Sprint:** S2.2
**Days:** 3-4
**Track:** Consumer
**Goal:** User can send chat messages, get AI responses, and messages persist across sessions

---

## ANCHOR REQUIREMENT

**MANDATORY:** Before beginning any phase, disclose industry expert references with verifiable links.

| Domain | Required Anchor | Example |
|--------|-----------------|---------|
| Pydantic AI | Official Documentation | https://ai.pydantic.dev/ |
| CopilotKit | Official Documentation | https://docs.copilotkit.ai/ |
| Streaming SSE | MDN Web Docs | https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events |
| Drizzle ORM | Official Documentation | https://orm.drizzle.team/docs/overview |

**Proof:** State which anchors you consulted and what guidance you extracted before each phase.

---

## SUCCESS CRITERIA

### Core Functionality
| # | Criterion | Verification Method | Status |
|---|-----------|---------------------|--------|
| SC-1 | User can send a message | Type in input, press send, message appears | ⬜ |
| SC-2 | AI response streams back | Response text appears incrementally (not all at once) | ⬜ |
| SC-3 | SteerTrue governance is injected | Response metadata includes blocks_injected array | ⬜ |
| SC-4 | Messages persist in database | Query messages table, see user + assistant messages | ⬜ |
| SC-5 | Conversations table exists | `\d conversations` shows schema | ⬜ |
| SC-6 | Messages table exists with FK | `\d messages` shows conversation_id FK | ⬜ |
| SC-7 | Page refresh preserves messages | Refresh browser, same messages visible | ⬜ |
| SC-8 | New conversation creates fresh chat | Click new chat, empty conversation | ⬜ |
| SC-9 | Chat UI matches design colors | Visual comparison to color palette | ⬜ |
| SC-10 | Deployed to Railway | `railway logs` + curl to Railway URL | ⬜ |

### UX Features (Step 1.75 Gaps)
| # | Criterion | Verification Method | Status |
|---|-----------|---------------------|--------|
| SC-11 | Typing/loading indicator shows during AI response | Visual indicator visible while streaming | ⬜ |
| SC-12 | Timestamps visible on messages | Each message shows time sent | ⬜ |
| SC-13 | Copy message button works | Click copy on AI response, paste elsewhere | ⬜ |
| SC-14 | Retry button on failed messages | Send fails → retry button appears → click retries | ⬜ |
| SC-15 | User-friendly error messages | Error displays in UI (not console only) | ⬜ |
| SC-16 | Enter sends, Shift+Enter newline | Keyboard behavior matches expectation | ⬜ |
| SC-17 | Edit user message | Click edit → modify → save → message updates | ⬜ |
| SC-18 | Delete message | Click delete → message removed from UI and DB | ⬜ |
| SC-19 | Regenerate AI response | Click regenerate → new response for same input | ⬜ |


---

## PHASES

### Phase 0: Architect Consultation (MANDATORY)

**Before ANY code, read these architect agents:**

- [ ] Read `.claude/agents/pydantic_architect.md` - understand Pydantic AI patterns
- [ ] Read `.claude/agents/copilot_kit.md` - understand CopilotKit integration
- [ ] Document key patterns from each agent

**Exit Criteria:** Summary of patterns to follow from each architect

**Proof Questions (Adversarial F14 Fix - Ungameable):**
1. **Pydantic Architect:** Paste the EXACT first sentence under the "Agent Definition" section header
2. **CopilotKit Architect:** Paste the EXACT first sentence under the "useCopilotReadable" section header
3. What are the 3 most important patterns from each architect agent?

**Note:** Generic patterns without exact text quotes = proof failed. This prevents fabrication.

---

### Phase 1: Database Schema (Day 4 prep)

**Deliverables:**
- [ ] Create db/schema/conversations.ts with Drizzle schema
- [ ] Create db/schema/messages.ts with Drizzle schema
- [ ] Add foreign key from messages → conversations
- [ ] Add foreign key from conversations → users
- [ ] Run migration: `npx drizzle-kit push`

**Migration Timing Clarification (F11 Fix):**

| Database | ORM | Migration Tool | When to Run |
|----------|-----|----------------|-------------|
| ai-chatbot Postgres | Drizzle | `npx drizzle-kit push` | Locally before deploy, then Railway auto-syncs |
| steertrue Postgres | SQLAlchemy | Alembic | N/A - not modified in this sprint |

**Migration Process (ai-chatbot):**
1. Create schema files locally (db/schema/*.ts)
2. Run `npx drizzle-kit push` locally to test against local DB
3. Commit schema files to git
4. Railway deployment: Drizzle does NOT auto-migrate
5. After deploy, run `railway run npx drizzle-kit push` to apply to Railway DB
6. Verify with `railway run psql -c "\d conversations"`

**Note:** Unlike SteerTrue (which uses startup.sh + Alembic), ai-chatbot uses manual Drizzle migrations.

**Database Rollback Procedure (DevOps F2 Fix):**

1. **Pre-deployment backup (REQUIRED before migration):**
   ```bash
   # Backup Railway Postgres before schema changes
   railway run pg_dump -Fc > backup_pre_s2.2_$(date +%Y%m%d).dump
   ```

2. **Drizzle rollback (if migration breaks app):**
   ```bash
   # Drizzle doesn't have built-in rollback - use manual DROP
   railway run psql -c "DROP TABLE IF EXISTS messages CASCADE;"
   railway run psql -c "DROP TABLE IF EXISTS conversations CASCADE;"
   ```

3. **Restore from backup (nuclear option):**
   ```bash
   railway run pg_restore --clean --if-exists -d $DATABASE_URL backup_pre_s2.2.dump
   ```

4. **Migration is additive:** Tables don't modify existing auth tables, so worst case is DROP new tables and redeploy previous version.

**Exit Criteria:** `SELECT * FROM conversations; SELECT * FROM messages;` work (empty tables)

**Proof Questions:**
- **Show `ls -la backup_pre_s2.2_*.dump` output proving backup exists (Adversarial F2 Fix)**
- Show `\d conversations` output with user_id FK
- Show `\d messages` output with conversation_id FK and role CHECK constraint
- **Show CHECK constraint exists: `SELECT conname FROM pg_constraint WHERE conname LIKE '%role%';` (Adversarial F1 Fix)**

---

### Phase 2: Walking Skeleton - Anthropic SDK Direct (Day 3)

**Goal:** Thinnest possible end-to-end slice: input → Next.js API → Anthropic SDK → streaming response → display

**Skeleton Definition (F5 Fix):**
```
User types message → Chat input component → POST /api/chat → Anthropic SDK → Anthropic API → SSE stream → Display in chat area → User sees response
```

**Architecture Decision:** Use Anthropic TypeScript SDK directly in Next.js API route for skeleton. Pydantic AI microservice added in Phase 3B as flesh.

**Deliverables:**
- [ ] Create basic chat page at app/(chat)/page.tsx
- [ ] Create POST /api/chat endpoint with Anthropic SDK
- [ ] Implement streaming response (SSE)
- [ ] Wire input to API call
- [ ] Display streaming response in chat area
- [ ] Add ANTHROPIC_API_KEY to Railway env vars
- [ ] **Create GET /api/health endpoint (DevOps F1 Fix)**
- [ ] Deploy to Railway and verify skeleton works

**Health Endpoint Contract (DevOps F1 Fix):**
```typescript
// app/api/health/route.ts
export async function GET() {
  const dbHealthy = await checkDatabaseConnection();
  return Response.json({
    status: dbHealthy ? "healthy" : "degraded",
    database: dbHealthy ? "connected" : "error",
    version: process.env.npm_package_version || "1.0.0",
    timestamp: new Date().toISOString()
  });
}
```

**Railway Readiness Probe:**
```toml
# railway.toml for ai-chatbot
[healthcheck]
path = "/api/health"
interval = 10
timeout = 5
```

**Exit Criteria:** Can send message on Railway URL, see real AI streaming response

**Proof Questions:**
- Screenshot of chat page on Railway URL (URL bar visible)
- curl -X POST to /api/chat showing streaming response
- **Video/GIF showing text streaming incrementally - MANDATORY (Adversarial F4 Fix)**

**STREAMING EVIDENCE REQUIREMENT (Adversarial F4 Fix):**
- Screenshots are NOT acceptable for streaming verification
- Must provide: Video file link OR screen recording reference with timestamp
- Video must show: text appearing word-by-word or chunk-by-chunk (not instant)
- Acceptable formats: .mp4, .gif, .mov, or Loom/screen recording link

**CRITICAL:** Skeleton must work end-to-end before adding Python service.

**SKELETON GATE (Design F7 Fix + Adversarial F13 Fix - M73 Pattern):**
```
┌─────────────────────────────────────────────────────────┐
│  STOP - MANDATORY CHECKPOINT AFTER PHASE 2             │
│                                                         │
│  Before proceeding to Phase 3A/3B:                     │
│  1. Verify skeleton deployed to Railway (not localhost)│
│  2. Send real message, receive real AI response        │
│  3. Confirm streaming works (video evidence REQUIRED)  │
│  4. Health endpoint returns 200                        │
│                                                         │
│  If ANY check fails: DO NOT proceed. Fix skeleton first│
│  Phase 3B work is WASTED if skeleton fundamentally broken│
│                                                         │
│  ⚠️  CHECKPOINT VIOLATION = GRADE F, SPRINT TERMINATED │
│  Proceeding to Phase 3A/3B without Phase 2 video      │
│  evidence is a TERMINATION-LEVEL violation.           │
└─────────────────────────────────────────────────────────┘
```

---

### Phase 3A: SteerTrue Governance Integration (Day 3)

**Goal:** Inject governance into the working skeleton

**Deliverables:**
- [ ] Add STEERTRUE_API_URL to env vars
- [ ] Call SteerTrue /api/v1/analyze before Anthropic call
- [ ] Use composed system_prompt from SteerTrue
- [ ] Return blocks_injected in response metadata
- [ ] Verify governance is active

**Exit Criteria:** Response metadata shows blocks_injected array

**Proof Questions:**
- Show curl to SteerTrue /api/v1/health (connectivity)
- Show response with blocks_injected array populated
- What blocks were injected for a test message?

---

### Phase 3B: Python Microservice with Pydantic AI (Day 3-4) - FLESH

**Goal:** Replace direct Anthropic SDK with Python microservice for structured output and agent patterns

**Architecture:**
```
[Next.js] → HTTP → [Python FastAPI + Pydantic AI] → [Anthropic API]
                              ↓
                    [SteerTrue API for governance]
```

**Deliverables:**
- [ ] Create new Railway service: steertrue-pydantic-ai
- [ ] Create Python FastAPI app with Pydantic AI
- [ ] Define structured output models (ChatResponse, etc.)
- [ ] Implement POST /chat endpoint with streaming
- [ ] Integrate SteerTrue governance in Python service
- [ ] **Implement retry logic for Pydantic validation failures (Design F4 Fix)**
- [ ] Update Next.js to call Python service instead of direct Anthropic
- [ ] Deploy Python service to Railway
- [ ] Verify end-to-end with new architecture

**Pydantic AI Retry Logic (Design F4 Fix):**
```python
from pydantic_ai import Agent
from pydantic import ValidationError

MAX_RETRIES = 2

async def chat_with_retry(message: str, system_prompt: str) -> ChatResponse:
    for attempt in range(MAX_RETRIES + 1):
        try:
            result = await chat_agent.run(message, system_prompt=system_prompt)
            return result.data  # Pydantic validates automatically
        except ValidationError as e:
            if attempt < MAX_RETRIES:
                logger.warning(f"Validation failed, retry {attempt + 1}: {e}")
                continue
            raise  # Final attempt failed
```

**Exit Criteria:** Chat works via Python microservice with Pydantic AI structured output

**Phase 3B Endpoint Testing (Adversarial F11 Fix):**
Before Phase 4, verify Python endpoints work DIRECTLY (not via Next.js):
```bash
# Test health
curl ${PYDANTIC_AI_URL}/health

# Test chat directly
curl -X POST ${PYDANTIC_AI_URL}/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "Hello", "session_context": {"user_id": "test-uuid"}}'
```

**Proof Questions:**
- Show Python service health endpoint on Railway (direct curl)
- Show Pydantic model definition for ChatResponse
- **curl to Python /chat directly (bypassing Next.js) - Adversarial F11 Fix**
- Verify structured output validation working (invalid response rejected)
- **Show retry logic in code (grep for MAX_RETRIES)**

**Fallback:** If Python integration fails, skeleton (Phase 2) remains functional.

**Orphan Endpoint Note (F4 Fix):** Phase 3B creates Python service endpoints. Client integration (CopilotKit wiring to Python service) happens in Phase 4. This is intentional - server-side verified before client integration.

**Explicit Rollback Procedure (F12 Fix):**

If Python integration fails, rollback to skeleton:

1. **Criteria for "Python integration fails":**
   - Python service health endpoint returns non-200 for >5 minutes
   - Streaming responses timeout consistently (>30s)
   - Pydantic validation errors on >50% of requests

2. **Rollback steps:**
   ```bash
   # In ai-chatbot repo
   git revert HEAD --no-commit  # Revert Python service wiring
   # OR use feature flag:
   # Set USE_PYTHON_SERVICE=false in Railway env vars
   ```

3. **Verify rollback:**
   - Send message via UI
   - Confirm response comes from direct Anthropic SDK (no Python service call)
   - Check Railway logs show /api/chat handling request directly

**Feature Flag (recommended):**
```typescript
// In /api/chat/route.ts
const USE_PYTHON_SERVICE = process.env.USE_PYTHON_SERVICE === 'true';

if (USE_PYTHON_SERVICE) {
  // Call Python microservice
} else {
  // Direct Anthropic SDK (skeleton)
}
```

---

### Phase 4: CopilotKit Chat UI (Day 3)

**Deliverables:**
- [ ] Install @copilotkit/react-ui, @copilotkit/react-core
- [ ] Replace basic chat UI with CopilotChat component
- [ ] Configure streaming responses
- [ ] Style to match design colors
- [ ] Create /api/copilot endpoint for CoAgents
- [ ] **Implement useCopilotReadable hooks (Design F2 Fix)**

**useCopilotReadable Implementation (Design F2 Fix):**
```typescript
// Inject application state for LLM context awareness
useCopilotReadable({
  description: "Current conversation ID the user is viewing",
  value: currentConversationId,
});

useCopilotReadable({
  description: "User's display name for personalization",
  value: { name: session.user.name?.split(' ')[0] || 'User', id: session.user.id },
  // NOTE: First name only, NOT full name or email (Adversarial F12 - PII protection)
});

useCopilotReadable({
  description: "Number of messages in current conversation for context",
  value: messages.length,
});
```

**PII Protection (Adversarial F12 Fix):**
- DO NOT inject: email, full name, phone, address
- SAFE to inject: user ID (UUID), first name, conversation ID
- All data sent to Anthropic via useCopilotReadable is logged - minimize PII

**Exit Criteria:** CopilotKit chat UI working with streaming

**Proof Questions:**
- Screenshot of CopilotKit chat on Railway
- Video/GIF showing streaming response (text appears incrementally)
- Console log showing useCopilotReadable values being passed

---

### Phase 5: Message Persistence (Day 4)

**Deliverables:**
- [ ] Save user messages to messages table on send
- [ ] Save assistant messages to messages table on response
- [ ] Include blocks_injected and total_tokens in assistant messages
- [ ] Auto-create conversation if none exists
- [ ] Load messages on page load

**Exit Criteria:** Refresh page, same messages visible

**Proof Questions:**
- Show `SELECT * FROM messages LIMIT 5;` with real messages
- Screenshot showing messages after page refresh

---

### Phase 6: Conversation API (Day 4)

**Deliverables:**
- [ ] GET /api/conversations - list user's conversations
- [ ] POST /api/conversations - create new conversation
- [ ] GET /api/conversations/{id}/messages - get messages for conversation
- [ ] **Authorization check: user can only access own conversations (DevOps F7 Fix)**
- [ ] Wire "New Chat" button to create conversation
- [ ] Wire conversation list in sidebar (basic, no styling)

**Authorization Implementation (DevOps F7 Fix):**
```typescript
// In GET /api/conversations/{id}/messages
const conversation = await db.query.conversations.findFirst({
  where: eq(conversations.id, params.id)
});

// Ownership check - CRITICAL for security
if (!conversation || conversation.userId !== session.user.id) {
  return Response.json(
    { error: "Conversation not found", code: "NOT_FOUND" },
    { status: 404 }  // Use 404, not 403, to prevent enumeration
  );
}
```

**Exit Criteria:** Can create new conversation, switch between them

**Proof Questions:**
- curl GET /api/conversations showing list
- Screenshot showing two conversations in sidebar
- **Security test: curl with User A token for User B conversation returns 404**

---

### Phase 7: UX Polish - Input & Feedback (Day 4)

**Deliverables:**
- [ ] Typing/loading indicator during AI response (spinner or dots)
- [ ] Timestamps on all messages (relative: "2m ago" or absolute)
- [ ] Enter to send, Shift+Enter for newline
- [ ] Input placeholder text ("Type a message...")
- [ ] Auto-scroll to new messages
- [ ] **Minimum keyboard navigation (Design F10 Fix)**

**Keyboard Navigation (Design F10 Fix - WCAG 2.1.1 Minimum):**
- Tab: Navigate between input field, send button, New Chat button
- Enter: Send message (when input focused)
- Escape: Cancel current action (e.g., close edit modal)
- Focus indicators: Visible outline on focused elements

**Note:** Full accessibility (ARIA labels, screen reader) deferred to S2.5.

**Exit Criteria:** All input behaviors work as expected

**Proof Questions:**
- Screenshot showing typing indicator during response
- Screenshot showing timestamps on messages
- Demonstrate Shift+Enter creates newline (screenshot of multi-line message)
- **Demonstrate Tab navigation: input → send → new chat (video/GIF)**

---

### Phase 8: Message Actions (Day 4)

**Deliverables:**
- [ ] Copy button on AI responses (copies to clipboard)
- [ ] Edit button on user messages (inline edit, save/cancel)
- [ ] Delete button on messages (soft delete or hard delete - decide)
- [ ] Regenerate button on AI responses (re-runs with same user input)
- [ ] Confirmation modal for delete

**useCopilotAction Decision (Design F3 Fix):**

| Action | Expose as CopilotKit Action? | Rationale |
|--------|------------------------------|-----------|
| Copy | NO | Pure UI function, no AI involvement |
| Edit | NO | Direct DB update, no AI needed |
| Delete | NO | Direct DB update, no AI needed |
| Regenerate | YES (future) | Could benefit from AI-aware retry, but defer to S2.4 |

**S2.2 Implementation:** All message actions are pure React UI functions with direct API calls. CopilotKit actions deferred to S2.4 when multi-step workflows added.

**Exit Criteria:** All message actions functional

**Proof Questions:**
- Screenshot showing copy/edit/delete/regenerate buttons
- Demonstrate edit: before/after screenshots
- Demonstrate regenerate: two different responses for same input

---

### Phase 9: Error Handling UX (Day 4)

**Deliverables:**
- [ ] User-friendly error display in chat (not just console)
- [ ] Retry button on failed message sends
- [ ] Error message variation (not same text every time)
- [ ] Rate limiting feedback if applicable
- [ ] Network offline detection
- [ ] **Use Alert accent color #d4915c for errors (Design F5 Fix)**

**Error Styling (Design F5 Fix):**
- Error messages: Alert accent #d4915c text or border
- Retry button: Alert accent #d4915c background with white text
- Offline indicator: Alert accent #d4915c icon/badge

**Exit Criteria:** Errors display gracefully with recovery options

**Proof Questions:**
- Screenshot of error state with retry button
- Demonstrate retry: click retry, message sends successfully
- **Screenshot showing Alert color #d4915c on error elements**

---

### Phase 10: Railway Deployment + UAT (Day 4)

**Deliverables:**
- [ ] Verify all env vars set on Railway
- [ ] Deploy: `railway up`
- [ ] Run full UAT checklist on Railway URL
- [ ] Capture all evidence screenshots
- [ ] **Configure monitoring/alerting (DevOps F5 Fix)**

**Monitoring Setup (DevOps F5 Fix):**

| Metric | Threshold | Alert Action |
|--------|-----------|--------------|
| Error rate | >1% over 5 min | Railway notification |
| Response time p99 | >500ms | Railway notification |
| Health endpoint | 3 consecutive failures | Railway auto-restart |

**Railway Metrics Configuration:**
```toml
# railway.toml
[healthcheck]
path = "/api/health"
interval = 10
timeout = 5

# Note: Railway provides built-in metrics dashboard
# Access via Railway dashboard → Service → Metrics tab
```

**Minimum Viable Monitoring (for S2.2):**
1. Health check configured (auto-restart on failure)
2. Railway metrics dashboard reviewed post-deployment
3. Document baseline response times in TRACKER.md

**Future (S2.5+):** External monitoring (Datadog/Sentry integration)

**Exit Criteria:** All UAT tests pass on Railway URL

**Proof Questions:**
- What's the deployment ID?
- Paste `railway logs` showing successful startup
- Screenshot of Railway metrics dashboard showing healthy service

---

## UAT CHECKLIST

**Environment:** Railway deployed URL (NOT localhost)

**CRITICAL:** All UAT must be performed on the DEPLOYED Railway URL. Testing localhost and claiming "deployed works" is a UAT failure.

### Core Functionality
| # | Test | Action | Expected | Pass |
|---|------|--------|----------|------|
| 1 | Send message | Type "Hello", press send | Message appears in chat | ⬜ |
| 2 | Receive response | Wait for AI | Response streams in (not instant) | ⬜ |
| 3 | Governance active | Check response metadata | blocks_injected array populated | ⬜ |
| 4 | Message persists | Refresh page | Same messages visible | ⬜ |
| 5 | New conversation | Click "New Chat" | Empty conversation created | ⬜ |
| 6 | Switch conversation | Click old conversation | Previous messages load | ⬜ |
| 7 | Multiple messages | Send 3 messages | All appear in order | ⬜ |
| 8 | Visual design | Compare to color palette | Colors match spec | ⬜ |

### First-Use Scenarios (F6 Fix)
| # | Test | Action | Expected | Pass |
|---|------|--------|----------|------|
| FU-1 | New user, no conversations | Login as new user, open chat | Empty state shown, "New Chat" available | ⬜ |
| FU-2 | First message in conversation | Click New Chat, send first message | Message saved, conversation created | ⬜ |
| FU-2b | Default title applied | Check conversation title after FU-2 | Title is "New Conversation" (Adversarial F9) | ⬜ |
| FU-3 | Empty messages query | `GET /api/conversations/{new_id}/messages` | Returns empty array `[]`, not error | ⬜ |
| FU-4 | Empty conversations query | `GET /api/conversations` (new user) | Returns empty array `[]`, not error | ⬜ |

### Authorization Tests (Adversarial F8 Fix)
| # | Test | Action | Expected | Pass |
|---|------|--------|----------|------|
| AUTH-1 | Positive: Own conversation | curl with User A token for User A conversation | 200 with messages | ⬜ |
| AUTH-2 | Negative: Other's conversation | curl with User A token for User B conversation | 404 (not 403) | ⬜ |

### UX Features (Step 1.75)
| # | Test | Action | Expected | Pass |
|---|------|--------|----------|------|
| 9 | Typing indicator | Send message, watch during response | Indicator visible while AI responds | ⬜ |
| 10 | Timestamps | Look at messages | Each message shows timestamp | ⬜ |
| 11 | Copy message | Click copy on AI response | Text copied to clipboard | ⬜ |
| 12 | Enter to send | Press Enter in input | Message sends | ⬜ |
| 13 | Shift+Enter newline | Press Shift+Enter | New line in input (no send) | ⬜ |
| 14 | Edit message | Click edit on user message | Can modify and save | ⬜ |
| 15 | Delete message | Click delete on message | Message removed | ⬜ |
| 16 | Regenerate response | Click regenerate on AI message | New response generated | ⬜ |
| 17 | Error with retry | Disconnect network, send | Error shown with retry button | ⬜ |
| 18 | Retry works | Click retry button | Message sends successfully | ⬜ |

### Wiring Verification (Design F8 Fix - M45 Pattern)
| # | Test | Action | Expected | Pass |
|---|------|--------|----------|------|
| WV-1 | Python service receives request | Send message, check Python logs | Log shows incoming request with message content | ⬜ |
| WV-2 | SteerTrue called from Python | Send message, check SteerTrue logs | /api/v1/analyze called with session_id | ⬜ |
| WV-3 | Not using fallback accidentally | Check response metadata | blocks_injected NOT "FALLBACK/*" | ⬜ |
| WV-4 | Feature flag works | Set USE_PYTHON_SERVICE=false, send | Response comes from /api/chat (skeleton) | ⬜ |

**Feature Flag Toggle Procedure (Adversarial F6 Fix):**
```bash
# Quick toggle without full redeploy:
railway variables set USE_PYTHON_SERVICE=false
railway up --detach  # Fast redeploy with env change only

# Verify:
railway logs --lines 10  # Check startup shows flag value
```
**Note:** If Python service is stable during UAT, WV-4 may be tested once and skipped on subsequent runs.

**Evidence Required:**
- Screenshot of chat with messages (URL bar visible showing Railway domain)
- Video/GIF of streaming response with typing indicator visible
- Screenshot of conversation list with 2+ conversations
- curl output showing blocks_injected in response
- Database query showing messages table contents
- Browser console showing no errors
- Screenshot showing timestamps on messages
- Screenshot showing copy/edit/delete/regenerate buttons on messages
- Screenshot of error state with retry button
- Video demonstrating Shift+Enter creates newline

---

## ROLLBACK PROCEDURE

If deployment fails:
1. `railway rollback` to previous deployment
2. Check logs: `railway logs --lines 100`
3. Fix issue locally
4. Redeploy

If SteerTrue integration fails:
1. Verify STEERTRUE_API_URL is correct
2. Test `/api/v1/health` endpoint directly
3. Check Railway logs for connection errors
4. Fallback: hardcode system prompt temporarily (document as tech debt)

---

## BLOCKED REPORTING TEMPLATE

If blocked, report with ALL fields:

```
**What I'm trying to do:**
[One sentence]

**What's blocking:**
[Specific blocker]

**What I tried:**
- [Action 1]
- [Action 2]

**What would unblock:**
[Specific ask]
```

---

## COMPLETION CHECKLIST

Before marking sprint complete:

- [ ] All success criteria pass
- [ ] All UAT tests pass on Railway URL (with URL bar visible in screenshots)
- [ ] Evidence screenshots captured (full console, not summaries)
- [ ] No console errors
- [ ] Code committed to dev branch
- [ ] CONTEXT.md updated if decisions changed
- [ ] TRACKER.md updated with decisions made

---

## ADVERSARIAL AUDIT NOTES

**Audit Date:** 2026-01-22
**Auditor:** Sprint Author (Claude Opus 4.5)

### Fabrication Prevention:

1. Walking skeleton FIRST - no complex integration until basic flow works
2. Railway deployment verified at Phase 2, not just at end
3. Streaming must be demonstrated with video/GIF, not claimed
4. Database queries required as proof of persistence
5. blocks_injected array must be shown in actual response

### Known Risks:

1. Pydantic AI + CopilotKit integration is novel - may need adaptation
2. CoAgents protocol may require debugging
3. SteerTrue API connectivity from Railway needs explicit verification

### Deferred (Future Sprint):

**Conversation Management:**
- Conversation rename
- Conversation delete
- Auto-generate conversation titles from first message
- Message search

**Governance Visibility (Design F6 Fix):**
- User-facing display of blocks_injected (dev mode toggle in header)
- Aligns with design spec "DEV label + toggle switch"
- Target: S2.4 (Admin foundation) or S2.6 (Dev tools)

**Accessibility (WCAG 2.2 Compliance) - Deferred from S2.2:**

| Item | WCAG Requirement | Why Deferred | Target Sprint |
|------|------------------|--------------|---------------|
| Keyboard navigation | 2.1.1 Level A | Core UX prioritized first | S2.5 |
| Screen reader / ARIA | 4.1.2 Level A | Requires accessibility audit | S2.5 |
| Focus indicators | 2.4.7 Level AA | UI polish phase | S2.5 |
| Color contrast 4.5:1 | 1.4.3 Level AA | Requires design review | S2.5 |
| Touch targets 24x24px | 2.5.8 Level AA (WCAG 2.2) | Mobile optimization phase | S2.5 |

**Note:** Accessibility is a compliance requirement, not optional. S2.5 should be dedicated accessibility sprint before production launch.

---

**END OF PROMPT**
