# ISSUES.md - Sprint S2.1: Authentication Foundation

**Sprint:** S2.1
**Created:** 2026-01-21T06:57:11
**Last Updated:** 2026-01-21T06:57:11

---

## Task Breakdown

### Phase 1: Repository Setup

| ID | Task | Status | Priority | Assignee | Notes |
|----|------|--------|----------|----------|-------|
| P1-01 | Clone keithcostello/ai-chatbot repo | PENDING | HIGH | DEV | Verify repo state before deletion |
| P1-02 | Verify repo is empty or get explicit user approval before deletion | PENDING | HIGH | DEV | Must document what exists |
| P1-03 | Delete existing content (fresh start per user decision) | PENDING | HIGH | DEV | Requires user approval |
| P1-04 | Initialize Next.js 15 with App Router | PENDING | HIGH | DEV | - |
| P1-05 | Create branches: dev, keith, amy | PENDING | HIGH | DEV | - |
| P1-06 | Push branch structure to origin | PENDING | HIGH | DEV | Exit: git branch -a shows branches |

### Phase 2: Database Setup

| ID | Task | Status | Priority | Assignee | Notes |
|----|------|--------|----------|----------|-------|
| P2-01 | Add Drizzle ORM dependency | PENDING | HIGH | DEV | - |
| P2-02 | Create drizzle.config.ts | PENDING | HIGH | DEV | Per CONTEXT.md schema |
| P2-03 | Create db/schema/users.ts with schema from CONTEXT.md | PENDING | HIGH | DEV | UNIQUE constraint on email |
| P2-04 | Verify DATABASE_URL connectivity BEFORE migration | PENDING | HIGH | DEV | psql $DATABASE_URL -c "SELECT 1" |
| P2-05 | Configure DATABASE_URL for Railway Postgres | PENDING | HIGH | DEV | - |
| P2-06 | Run migration: npx drizzle-kit push | PENDING | HIGH | DEV | Exit: SELECT * FROM users works |

### Phase 3: Auth Routes (Signup)

| ID | Task | Status | Priority | Assignee | Notes |
|----|------|--------|----------|----------|-------|
| P3-01 | Generate AUTH_SECRET (openssl rand -base64 32), add to .env.local | PENDING | HIGH | DEV | Never commit |
| P3-02 | Install Auth.js (next-auth v5) | PENDING | HIGH | DEV | - |
| P3-03 | Create app/api/auth/[...nextauth]/route.ts | PENDING | HIGH | DEV | - |
| P3-04 | Implement credentials provider with signup flow | PENDING | HIGH | DEV | - |
| P3-05 | Password hashing with bcrypt (salt rounds >= 10) | PENDING | CRITICAL | DEV | SC-2: Must show explicit saltRounds: 10 |
| P3-06 | POST /api/auth/signup route accepting {email, password, confirmPassword} | PENDING | HIGH | DEV | - |
| P3-07 | Server-side validation: reject if password !== confirmPassword (400) | PENDING | HIGH | DEV | SC-10 |
| P3-08 | Add GET /api/health endpoint (returns 200 OK, no auth) | PENDING | HIGH | DEV | - |
| P3-09 | Error messages must be generic (no user enumeration) | PENDING | CRITICAL | DEV | SC-5: "Invalid credentials" only |

### Phase 4: Signup UI

| ID | Task | Status | Priority | Assignee | Notes |
|----|------|--------|----------|----------|-------|
| P4-01 | Create app/(auth)/signup/page.tsx | PENDING | HIGH | DEV | - |
| P4-02 | Branded split-page layout (green left, form right) | PENDING | HIGH | DEV | SC-8: Match color palette |
| P4-03 | Form: email, password, confirm password | PENDING | HIGH | DEV | - |
| P4-04 | Client-side validation (email format, password min 8 chars) | PENDING | MEDIUM | DEV | - |
| P4-05 | Submit calls /api/auth/signup | PENDING | HIGH | DEV | - |
| P4-06 | Success shows confirmation, error shows message | PENDING | HIGH | DEV | - |

### Phase 5: Auth Routes (Login + Session)

| ID | Task | Status | Priority | Assignee | Notes |
|----|------|--------|----------|----------|-------|
| P5-01 | POST /api/auth/login validates credentials | PENDING | HIGH | DEV | SC-4 |
| P5-02 | Session cookie set with HttpOnly; Secure; SameSite=Strict | PENDING | CRITICAL | DEV | SC-6 |
| P5-03 | GET /api/auth/me returns current user from session | PENDING | HIGH | DEV | SC-7 |
| P5-04 | Middleware protects authenticated routes | PENDING | HIGH | DEV | - |
| P5-05 | POST /api/auth/logout clears session cookie | PENDING | HIGH | DEV | - |

### Phase 6: Login UI

| ID | Task | Status | Priority | Assignee | Notes |
|----|------|--------|----------|----------|-------|
| P6-01 | Create app/(auth)/login/page.tsx | PENDING | HIGH | DEV | - |
| P6-02 | Same branded layout as signup | PENDING | HIGH | DEV | - |
| P6-03 | Form: email, password | PENDING | HIGH | DEV | - |
| P6-04 | Submit calls login endpoint | PENDING | HIGH | DEV | - |
| P6-05 | Success redirects to / (dashboard placeholder) | PENDING | HIGH | DEV | - |
| P6-06 | Error shows generic "Invalid credentials" message | PENDING | CRITICAL | DEV | SC-5: Same message for all failures |
| P6-07 | Link to signup page | PENDING | MEDIUM | DEV | - |
| P6-08 | Logout button on authenticated pages | PENDING | HIGH | DEV | - |

### Phase 7: Railway Deployment

| ID | Task | Status | Priority | Assignee | Notes |
|----|------|--------|----------|----------|-------|
| P7-01 | Link local to steertrue-chat-frontend service (dev-sandbox) | PENDING | HIGH | DEV | - |
| P7-02 | Configure environment variables (DATABASE_URL, AUTH_SECRET, NEXTAUTH_URL) | PENDING | HIGH | DEV | - |
| P7-03 | Deploy dev branch: railway up | PENDING | HIGH | DEV | - |
| P7-04 | Wait for deployment to complete: railway status shows "deployed" | PENDING | HIGH | DEV | - |
| P7-05 | Verify deployment branch: railway logs shows correct commit SHA | PENDING | HIGH | DEV | SC-9 |
| P7-06 | Verify signup/login work on Railway URL (NOT localhost) | PENDING | CRITICAL | DEV | UAT required |

---

## Issues Log

| ID | Issue | Severity | Status | Root Cause | Resolution | Phase |
|----|-------|----------|--------|------------|------------|-------|
| - | No issues yet | - | - | - | - | - |

---

## Summary

- **Total Tasks:** 41
- **Completed:** 0
- **In Progress:** 0
- **Pending:** 41
- **Blocked:** 0

---

**END OF ISSUES.MD**
