# Sprint S2.1: Authentication Foundation

<!-- AI CONTEXT
WHAT: Execute this sprint to deliver user authentication (signup + login).
WHY: Foundation for all consumer features. Users must authenticate before chat.
HOW: Follow phases in order. Meet success criteria. Pass UAT before merge.
-->

**Sprint:** S2.1
**Days:** 1-2
**Track:** Consumer
**Goal:** User can create account and log in with session persistence

---

## ANCHOR REQUIREMENT

**MANDATORY:** Before beginning any phase, disclose industry expert references with verifiable links.

| Domain | Required Anchor | Example |
|--------|-----------------|---------|
| Authentication | OWASP Cheat Sheet | https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html |
| Next.js Auth | Auth.js Documentation | https://authjs.dev/ |
| Database ORM | Drizzle Documentation | https://orm.drizzle.team/docs/overview |
| Framework | Next.js 15 App Router | https://nextjs.org/docs/app |

**Proof:** State which anchors you consulted and what guidance you extracted before each phase. This proves you used current documentation, not just training data.

---

## SUCCESS CRITERIA

| # | Criterion | Verification Method | Status |
|---|-----------|---------------------|--------|
| SC-1 | User can sign up with email/password | Submit form, user appears in database | ⬜ |
| SC-2 | Passwords are hashed with bcrypt, salt rounds >= 10 | Query database for hash + show bcrypt config code | ⬜ |
| SC-3 | Duplicate email rejected at DB constraint level | Show `UNIQUE` constraint in schema + try duplicate | ⬜ |
| SC-4 | User can log in with valid credentials | Submit login, redirected to app | ⬜ |
| SC-5 | Invalid credentials show generic error (no user enumeration) | Wrong password shows "Invalid credentials" not "wrong password" | ⬜ |
| SC-6 | Session cookie is httpOnly + Secure | Network tab showing Set-Cookie header with flags | ⬜ |
| SC-7 | GET /api/auth/me returns current user | Call endpoint with session cookie | ⬜ |
| SC-8 | Signup page matches brand design | Visual comparison to color palette | ⬜ |
| SC-9 | Deployed to Railway (dev environment) | `railway logs` + curl to Railway URL | ⬜ |
| SC-10 | Password confirmation validated server-side | API rejects mismatched passwords with 400 | ⬜ |
| SC-11 | **User can sign in with Google OAuth** | Click "Sign in with Google", complete OAuth flow, redirected to app | ⬜ |
| SC-12 | **Google OAuth creates/links user account** | Google user appears in database with email from Google | ⬜ |

---

## PHASES

### Phase 1: Repository Setup

**Deliverables:**
- [ ] Clone keithcostello/ai-chatbot repo
- [ ] Verify repo is empty or get explicit user approval before deletion
- [ ] Delete existing content (fresh start per user decision)
- [ ] Initialize Next.js 15 with App Router
- [ ] Create branches: dev, keith, amy
- [ ] Push branch structure to origin

**Exit Criteria:** `git branch -a` shows dev, keith, amy branches on origin

**Proof Question:** What was in the repo before deletion? (screenshot or `ls -la` output)

---

### Phase 2: Database Setup

**Deliverables:**
- [ ] Add Drizzle ORM dependency
- [ ] Create drizzle.config.ts
- [ ] Create db/schema/users.ts with schema from CONTEXT.md
- [ ] Verify DATABASE_URL connectivity BEFORE migration: `psql $DATABASE_URL -c "SELECT 1"`
- [ ] Configure DATABASE_URL for Railway Postgres
- [ ] Run migration: `npx drizzle-kit push`

**Exit Criteria:** `SELECT * FROM users;` works (empty table)

**Proof Questions:**
- What's the exact CREATE TABLE statement generated?
- Show `\d users` output proving UNIQUE constraint on email column

---

### Phase 3: Auth Routes (Day 1 - Signup)

**Deliverables:**
- [ ] Generate AUTH_SECRET: `openssl rand -base64 32`, add to `.env.local`
- [ ] Install Auth.js (next-auth v5)
- [ ] Create app/api/auth/[...nextauth]/route.ts
- [ ] Implement credentials provider with signup flow
- [ ] Password hashing with bcrypt (salt rounds ≥ 10) - MUST show code with explicit `saltRounds: 10`
- [ ] POST /api/auth/signup route accepting `{email, password, confirmPassword}`
- [ ] Server-side validation: reject if password !== confirmPassword (400 Bad Request)
- [ ] Add GET /api/health endpoint (returns 200 OK, no auth required)
- [ ] Error messages must be generic (no user enumeration): "Invalid credentials" not "user not found"

**Exit Criteria:** curl POST to /api/auth/signup creates user, GET /api/health returns 200

**Proof Questions:**
- What HTTP status code returned on success?
- Paste the bcrypt configuration code showing salt rounds value
- Show database query result with password_hash starting with `$2b$10$` (proving 10 rounds)
- Show curl response when password and confirmPassword don't match (must be 400)

---

### Phase 4: Signup UI (Day 1)

**Deliverables:**
- [ ] Create app/(auth)/signup/page.tsx
- [ ] Branded split-page layout (green left, form right)
- [ ] Form: email, password, confirm password
- [ ] Client-side validation (email format, password min 8 chars)
- [ ] Submit calls /api/auth/signup
- [ ] Success shows confirmation, error shows message

**Exit Criteria:** Can complete signup flow in browser

**Proof Questions:**
- Screenshot of signup page
- Console output showing no errors

---

### Phase 5: Auth Routes (Day 2 - Login + Session)

**Deliverables:**
- [ ] POST /api/auth/login validates credentials
- [ ] Session cookie set on successful login with flags: `HttpOnly; Secure; SameSite=Strict`
- [ ] GET /api/auth/me returns current user from session
- [ ] Middleware protects authenticated routes
- [ ] POST /api/auth/logout clears session cookie

**Exit Criteria:** Login → refresh → still authenticated

**Proof Questions:**
- Paste FULL Set-Cookie header (must show HttpOnly, Secure, SameSite flags)
- What does GET /api/auth/me return?
- Show curl -i output for logout endpoint clearing the cookie

---

### Phase 6: Login UI (Day 2)

**Deliverables:**
- [ ] Create app/(auth)/login/page.tsx
- [ ] Same branded layout as signup
- [ ] Form: email, password
- [ ] Submit calls login endpoint
- [ ] Success redirects to / (dashboard placeholder)
- [ ] Error shows generic message "Invalid credentials" (not "user not found" or "wrong password")
- [ ] Link to signup page
- [ ] Logout button on authenticated pages

**Exit Criteria:** Can complete login flow in browser

**Proof Question:** Screenshot showing error message on failed login (must NOT reveal if user exists)

---

### Phase 7: Railway Deployment

**Deliverables:**
- [ ] Link local to steertrue-chat-frontend service (dev-sandbox)
- [ ] Configure environment variables (DATABASE_URL, AUTH_SECRET, NEXTAUTH_URL)
- [ ] Deploy dev branch: `railway up`
- [ ] Wait for deployment to complete: `railway status` shows "deployed"
- [ ] Verify deployment branch: `railway logs` shows correct commit SHA
- [ ] Verify signup/login work on Railway URL (NOT localhost)

**Note:** keith-dev and amy-dev environments deferred to future sprint.

**Exit Criteria:** Signup/login work on deployed Railway URL

**Proof Questions:**
- What's the Railway deployment URL?
- What's the deployment ID?
- Paste `railway logs` showing successful startup with commit SHA matching local HEAD
- Show curl -i to Railway URL (not localhost) returning expected response

---

## UAT CHECKLIST

**Environment:** Railway deployed URL (NOT localhost)

**CRITICAL:** All UAT must be performed on the DEPLOYED Railway URL. Testing localhost and claiming "deployed works" is a UAT failure (see M21, M46 in COMMON_MISTAKES.md).

| # | Test | Action | Expected | Pass |
|---|------|--------|----------|------|
| 1 | Signup validation | Enter invalid email | Error message shown | ⬜ |
| 2 | Signup validation | Enter password < 8 chars | Error message shown | ⬜ |
| 3 | Signup validation | Passwords don't match (server-side) | 400 error with message | ⬜ |
| 4 | Signup success | Valid email + password | Account created, confirmation shown | ⬜ |
| 5 | Signup duplicate | Same email again | "Already registered" error (not "user exists") | ⬜ |
| 6 | Login invalid (wrong password) | Wrong password for existing user | "Invalid credentials" error (generic) | ⬜ |
| 7 | Login invalid (no such user) | Non-existent email | "Invalid credentials" error (same as #6) | ⬜ |
| 8 | Login success | Correct credentials | Redirected to app | ⬜ |
| 9 | Session persist | Refresh page | Still logged in | ⬜ |
| 10 | Session cookie security | Inspect Set-Cookie header | HttpOnly, Secure, SameSite=Strict flags | ⬜ |
| 11 | Logout works | Click logout | Cookie cleared, redirected to login | ⬜ |
| 12 | Visual design | Compare to color palette | Colors match spec | ⬜ |
| 13 | Mobile responsive | View on 375px width | All form fields visible, submit button accessible | ⬜ |

**Evidence Required:**
- Screenshot of signup page (desktop) with URL bar visible showing Railway domain
- Screenshot of signup page (mobile at 375px)
- Screenshot of successful signup confirmation
- Screenshot of login page with URL bar visible
- Screenshot of logged-in state after page refresh
- Browser console showing no errors (full console output, not summary)
- Network tab showing Set-Cookie header with HttpOnly, Secure flags
- Screenshot of error message for wrong password (must say "Invalid credentials")
- Screenshot of error message for non-existent user (must be IDENTICAL to wrong password)
- Curl output: `curl -i [Railway URL]/api/health` showing 200

---

## ROLLBACK PROCEDURE

If deployment fails:
1. `railway rollback` to previous deployment
2. Check logs: `railway logs --lines 100`
3. Fix issue locally
4. Redeploy

If database migration fails:
1. Do NOT run destructive migrations in production
2. Schema changes must be additive
3. If stuck, restore from Railway database backup:
   - Railway Dashboard → Project → Postgres service → Backups tab
   - Or use: `railway connect postgres` then restore from backup
   - Point-in-time recovery available for last 7 days

**HTTPS Verification:** Railway enforces HTTPS by default. Verify deployed URL uses `https://` prefix before UAT.

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

**Audit Date:** 2026-01-20
**Auditor:** Adversarial Process Auditor (Claude Opus 4.5)

### Security Hardening Applied:
1. Password confirmation must be validated server-side (not just client)
2. Error messages must be generic to prevent user enumeration
3. Session cookies must have HttpOnly, Secure, SameSite flags
4. Bcrypt salt rounds must be explicitly verified (>=10)
5. Logout functionality added (was missing)
6. UAT tests for wrong password vs non-existent user must show identical errors

### Fabrication Prevention:
1. Proof questions require actual code/output, not claims
2. Railway deployment requires `railway logs` with commit SHA
3. Screenshot evidence must show URL bar with Railway domain
4. Cookie security verified via Network tab, not claims
5. Database constraints verified via `\d users` output

### Known Gaps Deferred (Future Sprint):
- Rate limiting on auth endpoints
- Account lockout after failed attempts
- Password complexity beyond 8 chars
- HTTPS enforcement verification

---

**END OF PROMPT**
