<!-- AI CONTEXT
WHAT: Read this to understand decisions and discussions from prior sessions for Sprint S2.1.
WHY: AI sessions are stateless. This tracker persists decisions/discussions across sessions.
HOW: Check Open Questions first. Reference Decision Log. Update Discussion History each session.
-->

# Sprint S2.1 Tracker - Authentication Foundation

## Status: IN_PROGRESS (Scope Change - Google OAuth)

**Last Updated:** 2026-01-21
**Updated By:** Session 34 (Opus 4.5)

---

## WHAT: Actions Required

| When | Action |
|------|--------|
| Session start | READ this file via `/primer` |
| Before asking user | CHECK Open Questions table - may already be answered |
| During session | LOG decisions to Decision Log table |
| Before session end | UPDATE Discussion History with session summary |

---

## WHY: Context

**Problem:** AI sessions are stateless. Each session starts fresh with no memory of prior discussions.

**Consequences without this document:**
- User repeats same answers to same questions
- Decisions made in Session A are unknown to Session B
- Planning work lost, user frustrated

---

## Decision Log

Captures WHY decisions were made. Required reading for session continuity.

| Date | Decision | Options Considered | Rationale | Decided By |
|------|----------|--------------------|-----------|------------|
| 2026-01-21 | Separate database for ai-chatbot | 1) Shared DB with SteerTrue 2) Separate DB | Security isolation (credentials vs governance), independent scaling, multi-tenancy ready | Keith |
| 2026-01-21 | Auth.js with httpOnly cookies | 1) JWT in localStorage 2) Session cookies 3) Auth.js | Enterprise-ready, XSS-resistant, successor to NextAuth.js | Keith |
| 2026-01-21 | Branded signup (split-page layout) | 1) Minimal centered form 2) Branded split-page | User preference for branded experience | Keith |
| 2026-01-21 | Include role field from Day 1 | 1) Add role later (Day 6) 2) Add now | Prep for admin separation, avoid migration later | Keith |
| 2026-01-21 | Add display_name + avatar_url fields | 1) Minimal schema 2) Extended profile | User preference for profile features | Keith |
| 2026-01-21 | Agent consultation NOT required Day 1 | 1) Consult pydantic_architect 2) Skip | Auth is Next.js native (Auth.js), not Pydantic AI or CopilotKit | Session 33 |
| 2026-01-21 | Delete repo except .claude and .env | 1) Delete all 2) Preserve existing 3) Delete except .claude/.env | Fresh start needed but preserve sprint config and secrets | Keith |
| 2026-01-21 | Add agent-browser for UAT | N/A | Required for UI verification on deployed Railway URL | Keith |
| 2026-01-21 | **SCOPE CHANGE: Add Google OAuth** | 1) Keep email-only 2) Add Google OAuth | Google sign-in was missed in original scope, required for complete auth | Keith |

---

## Discussion History

### Session 33 (2026-01-21) - Sprint Context Process + Requirements

**Discussed:**

- AI was designing sprint without proper context (PRD too large)
- Created SPRINT_CONTEXT_TEMPLATE.md (12 sections)
- Updated pre-sprint.md to require CONTEXT.md (blocking)
- Database architecture: separate vs shared
- Auth approach: Auth.js vs JWT vs custom
- Signup design: branded vs minimal
- Users table schema: which fields to include
- Railway setup: existing services, environments needed

**Conclusion:** Sprint S2.1 folder created with CONTEXT.md and PROMPT.md. Ready for /pre-sprint validation.

### Session 34 (2026-01-21) - Sprint Execution + Google OAuth Scope Change

**Discussed:**

- Executed /run-sprint S2.1
- Created SPRINT_HISTORY.md at .claude/sprints/ai-chatbot/
- User decision: Delete repo content except .claude/ and .env files
- Day 1 complete: Signup form, API routes, database migration, Railway deployment
- Day 2 complete: Login form, session management, logout
- Installed agent-browser for UAT testing
- All email/password success criteria verified (SC-1 through SC-10)
- **SCOPE CHANGE:** Google OAuth was missed in original scope
- UAT Gate paused, returning to execution for Google OAuth
- Created Google Cloud OAuth setup guide

**Current Status:**
- Email/password auth: COMPLETE (verified on Railway)
- Google OAuth: PENDING (awaiting credentials from user)
- UAT Gate: PAUSED (will re-run full UAT after Google OAuth)

**Files Created This Session:**
- `.claude/sprints/ai-chatbot/SPRINT_HISTORY.md`
- `escalations/scope-change-google-oauth.md`
- `handoffs/google-oauth-setup-guide.md`
- `checkpoints/checkpoint-3.md`, `checkpoint-3-day2.md`, `checkpoint-5.md`
- `screenshots/` folder with UI evidence

### Session 35 (2026-01-21) - Bug Root Cause Confirmed + Fix Ready

**User Testing Results:**

1. **Standard Login: WORKS**
   - test@example.com logged in successfully
   - Redirected to test-dashboard.html
   - /api/auth/me returns user data correctly

2. **Google OAuth: WORKS**
   - /api/auth/session shows: Keith Costello (keith@steertrue.ai)
   - Google session exists and is valid
   - Expires: 2026-02-20

3. **THE BUG CONFIRMED:**
   - `hasSessionCookie()` returns FALSE even when authenticated
   - HttpOnly cookies are NOT visible to JavaScript (correct security behavior)
   - This is why dashboard was stuck on "Loading..."

**Root Cause Analysis:**

The `hasSessionCookie()` function in both `app/page.tsx` and `app/dashboard/page.tsx`:
```javascript
function hasSessionCookie(): boolean {
  if (typeof document === 'undefined') return false;
  return document.cookie.split(';').some(c => c.trim().startsWith('session='));
}
```

**Why it fails:** Auth.js session cookies are set with `httpOnly: true`. HttpOnly cookies are intentionally invisible to client-side JavaScript (`document.cookie`). This is a security feature, not a bug.

**Fix Identified:**
- Remove `hasSessionCookie()` from app/page.tsx and app/dashboard/page.tsx
- Always call /api/auth/me and trust server response
- Server CAN see HttpOnly cookies (sent with every request)

**Documentation Created:**
- `troubleshooting-log.md` - Issue 4 documents the bug
- `LESSONS_LEARNED.md` - L9 captures the HttpOnly cookie lesson

**Current Status:**
- Email/password auth: COMPLETE (verified working)
- Google OAuth: COMPLETE (session exists and works)
- Dashboard bug: ROOT CAUSE CONFIRMED, fix ready to implement

**Next Steps:**
1. Implement fix in app/page.tsx and app/dashboard/page.tsx
2. Build and deploy to Railway
3. Verify dashboard loads correctly for authenticated users

---

## Open Questions

Questions that need resolution before sprint can proceed.

| # | Question | Status | Resolved |
|---|----------|--------|----------|
| 1 | Separate database for ai-chatbot? | RESOLVED | Yes - security isolation |
| 2 | Auth approach? | RESOLVED | Auth.js with httpOnly cookies |
| 3 | Signup design? | RESOLVED | Branded split-page layout |
| 4 | Include role field Day 1? | RESOLVED | Yes |
| 5 | Additional profile fields? | RESOLVED | display_name, avatar_url |
| 6 | Where does frontend code live? | RESOLVED | keithcostello/ai-chatbot repo |
| 7 | Which Railway environments? | RESOLVED | dev-sandbox, keith-dev, amy-dev |
| 8 | Google OAuth credentials? | **PENDING** | User following setup guide |

---

## Context Links

Key documents for this sprint.

| Document | Purpose |
|----------|---------|
| CONTEXT.md | Sprint-scoped context (architecture, schema, APIs, design) |
| PROMPT.md | Success criteria, phases, UAT checklist |
| PRD_V1.md | Full PRD (reference only - CONTEXT.md has extracts) |
| REQUIREMENTS_MAP.md | C-01, I-04, I-05 requirements |
| chat_visual_v.01.md | Color palette, typography |

---

## Anchors (Industry References)

| Source | Topic | Link |
|--------|-------|------|
| Auth.js | Next.js authentication | https://authjs.dev/ |
| Drizzle ORM | TypeScript ORM | https://orm.drizzle.team/ |
| Railway | Deployment platform | https://docs.railway.com/ |

---

**Template Version:** 1.0
**Created:** 2026-01-21
**Purpose:** Cross-session continuity for Sprint S2.1
