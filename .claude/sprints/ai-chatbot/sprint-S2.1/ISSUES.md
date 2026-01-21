# ISSUES.md - Sprint S2.1: Authentication Foundation

**Sprint:** S2.1
**Created:** 2026-01-21T06:57:11
**Last Updated:** 2026-01-21T07:15:00

---

## Task Breakdown

### Phase 1: Repository Setup

| ID | Task | Status | Priority | Assignee | Notes |
|----|------|--------|----------|----------|-------|
| P1-01 | Clone keithcostello/ai-chatbot repo | COMPLETE | HIGH | DEV | Already in repo |
| P1-02 | Verify repo is empty or get explicit user approval before deletion | COMPLETE | HIGH | DEV | User approved deletion |
| P1-03 | Delete existing content (fresh start per user decision) | COMPLETE | HIGH | DEV | All content deleted except .claude/, .env*, .git |
| P1-04 | Initialize Next.js 15 with App Router | COMPLETE | HIGH | DEV | Next.js 16.1.4 initialized |
| P1-05 | Create branches: dev, keith, amy | BLOCKED | HIGH | DEV | Need to push and create branches |
| P1-06 | Push branch structure to origin | BLOCKED | HIGH | DEV | Need P1-05 first |

### Phase 2: Database Setup

| ID | Task | Status | Priority | Assignee | Notes |
|----|------|--------|----------|----------|-------|
| P2-01 | Add Drizzle ORM dependency | COMPLETE | HIGH | DEV | drizzle-orm, postgres, drizzle-kit installed |
| P2-02 | Create drizzle.config.ts | COMPLETE | HIGH | DEV | Per CONTEXT.md schema |
| P2-03 | Create db/schema/users.ts with schema from CONTEXT.md | COMPLETE | HIGH | DEV | UNIQUE constraint on email |
| P2-04 | Verify DATABASE_URL connectivity BEFORE migration | BLOCKED | HIGH | DEV | DATABASE_URL not in .env.local |
| P2-05 | Configure DATABASE_URL for Railway Postgres | BLOCKED | HIGH | DEV | Need DATABASE_URL from Railway |
| P2-06 | Run migration: npx drizzle-kit push | BLOCKED | HIGH | DEV | Requires P2-04, P2-05 |

### Phase 3: Auth Routes (Signup)

| ID | Task | Status | Priority | Assignee | Notes |
|----|------|--------|----------|----------|-------|
| P3-01 | Generate AUTH_SECRET (openssl rand -base64 32), add to .env.local | COMPLETE | HIGH | DEV | Already exists in .env.local |
| P3-02 | Install Auth.js (next-auth v5) | COMPLETE | HIGH | DEV | next-auth@beta installed |
| P3-03 | Create app/api/auth/[...nextauth]/route.ts | COMPLETE | HIGH | DEV | Created |
| P3-04 | Implement credentials provider with signup flow | COMPLETE | HIGH | DEV | In lib/auth.ts |
| P3-05 | Password hashing with bcrypt (salt rounds >= 10) | COMPLETE | CRITICAL | DEV | BCRYPT_SALT_ROUNDS = 10 explicit |
| P3-06 | POST /api/auth/signup route accepting {email, password, confirmPassword} | COMPLETE | HIGH | DEV | Created |
| P3-07 | Server-side validation: reject if password !== confirmPassword (400) | COMPLETE | HIGH | DEV | Returns 400 with error |
| P3-08 | Add GET /api/health endpoint (returns 200 OK, no auth) | COMPLETE | HIGH | DEV | Created |
| P3-09 | Error messages must be generic (no user enumeration) | COMPLETE | CRITICAL | DEV | Returns null for both cases |

### Phase 4: Signup UI

| ID | Task | Status | Priority | Assignee | Notes |
|----|------|--------|----------|----------|-------|
| P4-01 | Create app/(auth)/signup/page.tsx | COMPLETE | HIGH | DEV | Created |
| P4-02 | Branded split-page layout (green left, form right) | COMPLETE | HIGH | DEV | Per CONTEXT.md colors |
| P4-03 | Form: email, password, confirm password | COMPLETE | HIGH | DEV | All three fields |
| P4-04 | Client-side validation (email format, password min 8 chars) | COMPLETE | MEDIUM | DEV | validateForm() function |
| P4-05 | Submit calls /api/auth/signup | COMPLETE | HIGH | DEV | fetch POST |
| P4-06 | Success shows confirmation, error shows message | COMPLETE | HIGH | DEV | Both states handled |

### Phase 5: Auth Routes (Login + Session)

| ID | Task | Status | Priority | Assignee | Notes |
|----|------|--------|----------|----------|-------|
| P5-01 | POST /api/auth/login validates credentials | PENDING | HIGH | DEV | Day 2 |
| P5-02 | Session cookie set with HttpOnly; Secure; SameSite=Strict | PENDING | CRITICAL | DEV | Day 2 |
| P5-03 | GET /api/auth/me returns current user from session | PENDING | HIGH | DEV | Day 2 |
| P5-04 | Middleware protects authenticated routes | PENDING | HIGH | DEV | Day 2 |
| P5-05 | POST /api/auth/logout clears session cookie | PENDING | HIGH | DEV | Day 2 |

### Phase 6: Login UI

| ID | Task | Status | Priority | Assignee | Notes |
|----|------|--------|----------|----------|-------|
| P6-01 | Create app/(auth)/login/page.tsx | PENDING | HIGH | DEV | Day 2 |
| P6-02 | Same branded layout as signup | PENDING | HIGH | DEV | Day 2 |
| P6-03 | Form: email, password | PENDING | HIGH | DEV | Day 2 |
| P6-04 | Submit calls login endpoint | PENDING | HIGH | DEV | Day 2 |
| P6-05 | Success redirects to / (dashboard placeholder) | PENDING | HIGH | DEV | Day 2 |
| P6-06 | Error shows generic "Invalid credentials" message | PENDING | CRITICAL | DEV | Day 2 |
| P6-07 | Link to signup page | PENDING | MEDIUM | DEV | Day 2 |
| P6-08 | Logout button on authenticated pages | PENDING | HIGH | DEV | Day 2 |

### Phase 7: Railway Deployment

| ID | Task | Status | Priority | Assignee | Notes |
|----|------|--------|----------|----------|-------|
| P7-01 | Link local to steertrue-chat-frontend service (dev-sandbox) | PENDING | HIGH | DEV | - |
| P7-02 | Configure environment variables (DATABASE_URL, AUTH_SECRET, NEXTAUTH_URL) | PENDING | HIGH | DEV | - |
| P7-03 | Deploy dev branch: railway up | PENDING | HIGH | DEV | - |
| P7-04 | Wait for deployment to complete: railway status shows "deployed" | PENDING | HIGH | DEV | - |
| P7-05 | Verify deployment branch: railway logs shows correct commit SHA | PENDING | HIGH | DEV | - |
| P7-06 | Verify signup/login work on Railway URL (NOT localhost) | PENDING | CRITICAL | DEV | UAT required |

---

## Issues Log

| ID | Issue | Severity | Status | Root Cause | Resolution | Phase |
|----|-------|----------|--------|------------|------------|-------|
| ISS-001 | DATABASE_URL missing from .env.local | HIGH | OPEN | Not configured | Need Railway Postgres connection string | P2 |

---

## Summary

- **Total Tasks:** 41
- **Completed:** 18
- **In Progress:** 0
- **Pending:** 20 (Day 2 items)
- **Blocked:** 3 (DATABASE_URL dependency)

---

**END OF ISSUES.MD**
