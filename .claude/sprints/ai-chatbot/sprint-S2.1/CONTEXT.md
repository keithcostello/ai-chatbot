# Sprint Context: S2.1

<!-- AI CONTEXT
WHAT: Read this FIRST when starting work on Sprint S2.1. Contains all context needed.
WHY: PRD and project docs are too large. This extracts Day 1-2 specific information.
HOW: Read sections relevant to your current task. Architecture decisions are binding.
-->

**Created:** 2026-01-21
**Sprint:** S2.1
**Day(s):** 1-2
**Goal:** User authentication - signup and login with session persistence

---

## 1. DELIVERABLES

| # | Deliverable | Type | Acceptance Criteria |
|---|-------------|------|---------------------|
| 1 | Sign up form | UI | Form validates email/password, creates account, shows confirmation |
| 2 | POST /api/auth/signup | API | Creates user record, returns token/session |
| 3 | users table | DB | Stores user credentials with hashed passwords |
| 4 | ~~CORS configuration~~ | N/A | Same-origin deployment (frontend + API on same Railway service), not required |
| 5 | Railway deployment | Infra | steertrue-chat deployed to dev-sandbox only (keith/amy deferred) |
| 6 | Login form (Day 2) | UI | Valid credentials → dashboard, invalid → error |
| 7 | POST /api/auth/login (Day 2) | API | Validates credentials, returns session |
| 8 | GET /api/auth/me (Day 2) | API | Returns current user from session |
| 9 | Session persistence (Day 2) | Feature | Token in httpOnly cookie, auto-revalidate on refresh |

---

## 2. ARCHITECTURE DECISIONS

Decisions that constrain implementation. These are BINDING.

| Decision | Rationale | Alternatives Rejected |
|----------|-----------|----------------------|
| **Separate databases** - ai-chatbot gets own Postgres, not SteerTrue's | Security isolation (credentials vs governance), independent scaling, multi-tenancy ready | Single shared database (coupling, security concerns) |
| **Auth.js** for authentication | Enterprise-ready, httpOnly cookies by default, successor to NextAuth.js | JWT in localStorage (XSS vulnerable), custom auth (reinventing wheel) |
| **httpOnly cookies** for session storage | XSS-resistant, more secure than localStorage | localStorage (XSS vulnerable), sessionStorage (doesn't persist) |
| **Drizzle ORM** | Matches ai-chatbot template pattern, TypeScript-first | Prisma (heavier), raw SQL (no type safety) |
| **Next.js 15 App Router** | Server components, streaming SSR, per PRD stack | Pages Router (older pattern) |
| **Branded signup page** | Split layout: branding left, form right. User decision. | Minimal centered form |
| **JWT session strategy** | Stateless, no sessions table needed, scales horizontally | Database sessions (adds complexity, DB lookup per request) |
| **Node.js runtime for auth routes** | bcrypt requires native Node.js APIs, Edge runtime breaks native modules | Edge runtime (incompatible), bcryptjs (slower pure JS) |

---

## 3. DATABASE SCHEMA

### New Tables

```sql
-- Table: users
-- Purpose: Store user accounts for ai-chatbot frontend
-- Database: ai-chatbot Postgres (NOT SteerTrue Postgres)
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) DEFAULT 'user' CHECK (role IN ('user', 'admin')),
    display_name VARCHAR(255),
    avatar_url VARCHAR(500),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for email lookups
CREATE INDEX idx_users_email ON users(email);
```

### Drizzle Schema (TypeScript)

```typescript
// schema/users.ts
import { pgTable, uuid, varchar, timestamp } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: varchar('email', { length: 255 }).unique().notNull(),
  passwordHash: varchar('password_hash', { length: 255 }).notNull(),
  role: varchar('role', { length: 20 }).default('user'),
  displayName: varchar('display_name', { length: 255 }),
  avatarUrl: varchar('avatar_url', { length: 500 }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
});
```

### Database Connection (with pooling)

```typescript
// db/index.ts
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

const connectionString = process.env.DATABASE_URL!;
const client = postgres(connectionString, { max: 10 }); // Connection pool size
export const db = drizzle(client);
```

### Drizzle Configuration

```typescript
// drizzle.config.ts
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: './db/schema/*',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
```

---

## 4. API CONTRACTS

### New Endpoints

```
GET /api/health
Response (200 OK):
{
    "status": "ok",
    "timestamp": "ISO timestamp"
}
```

```
POST /api/auth/signup
Request:
{
    "email": "string - valid email format",
    "password": "string - min 8 chars",
    "confirmPassword": "string - must match password (server-side validation)"
}

Response (201 Created):
{
    "user": {
        "id": "uuid",
        "email": "string",
        "role": "user",
        "displayName": "string | null",
        "createdAt": "ISO timestamp"
    }
}

Response (400 Bad Request):
{
    "error": "string - validation message",
    "code": "VALIDATION_ERROR"
}

Response (409 Conflict):
{
    "error": "Email already registered",
    "code": "EMAIL_EXISTS"
}
```

```
POST /api/auth/logout (Day 2)
Request: (no body, uses session cookie)

Response (200 OK):
{
    "success": true
}
Set-Cookie: session=; Max-Age=0; HttpOnly; Secure; SameSite=Strict
```

```
POST /api/auth/login (Day 2)
Request:
{
    "email": "string",
    "password": "string"
}

Response (200 OK):
{
    "user": {
        "id": "uuid",
        "email": "string",
        "role": "string",
        "displayName": "string | null"
    }
}
Set-Cookie: session=<token>; HttpOnly; Secure; SameSite=Strict

Response (401 Unauthorized):
{
    "error": "Invalid credentials",
    "code": "INVALID_CREDENTIALS"
}
```

```
GET /api/auth/me (Day 2)
Headers:
Cookie: session=<token>

Response (200 OK):
{
    "user": {
        "id": "uuid",
        "email": "string",
        "role": "string",
        "displayName": "string | null"
    }
}

Response (401 Unauthorized):
{
    "error": "Not authenticated",
    "code": "NOT_AUTHENTICATED"
}
```

### Existing Endpoints Used

| Endpoint | Purpose | Notes |
|----------|---------|-------|
| None for Day 1 | Auth is self-contained | SteerTrue backend not called until chat (Day 3) |

---

## 5. DESIGN REFERENCES

| Reference | Path | What to Extract |
|-----------|------|-----------------|
| Consumer Visual | `docs/design/storyboarding/designx/user_frontend/chat_visual_v.01.md` | Color palette, typography |
| Consumer Visual PNG | `docs/design/storyboarding/designx/user_frontend/chat_visual_v.01.png` | Visual reference |

**NOTE:** No signup screen design exists. Use branded split-page layout per user decision.

### Color Palette

| Name | Hex | Usage |
|------|-----|-------|
| Background | #f8f4ed | Page background (warm cream) |
| Cards | #f0ebe0 | Form card background (cream-dark) |
| Sidebar | #2d4a3e | Left branding panel (dark forest green) |
| Primary accent | #5d8a6b | Buttons, links (turtle green) |
| Text primary | #1e3a3a | Body text (navy) |
| Text on dark | #f8f4ed | Text on green background (cream) |
| Borders | #e8e0d0 | Form borders (sand) |

### Typography

| Property | Value | Fallback |
|----------|-------|----------|
| Font family | DM Sans | system-ui, -apple-system, sans-serif |
| Body text | 16px / 1.5 line-height | - |
| Headings | Bold weight | - |

### Logo

**Status:** No design asset provided yet.
**Approach:** Use text "SteerTrue" in sidebar until logo asset provided.

### Signup Page Layout (Branded - Desktop)

```
┌──────────────────────────────────────────────────────────┐
│                                                          │
│  ┌─────────────────────┐  ┌────────────────────────────┐ │
│  │                     │  │                            │ │
│  │  BRANDING PANEL     │  │   SIGNUP FORM              │ │
│  │  (dark forest green)│  │   (warm cream background)  │ │
│  │                     │  │                            │ │
│  │  - Logo             │  │   Email input              │ │
│  │  - Tagline          │  │   Password input           │ │
│  │  - Illustration?    │  │   Confirm password         │ │
│  │                     │  │   [Sign Up] button         │ │
│  │                     │  │                            │ │
│  │                     │  │   Already have account?    │ │
│  │                     │  │   Login link               │ │
│  │                     │  │                            │ │
│  └─────────────────────┘  └────────────────────────────┘ │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

### Login Page Layout (Centered - Desktop)

```
┌──────────────────────────────────────────────────────────┐
│                    (warm cream background)               │
│                                                          │
│              ┌────────────────────────────┐              │
│              │                            │              │
│              │   🐢 SteerTrue             │              │
│              │                            │              │
│              │   Email input              │              │
│              │   Password input           │              │
│              │   [Login] button           │              │
│              │                            │              │
│              │   Don't have account?      │              │
│              │   Sign up link             │              │
│              │                            │              │
│              └────────────────────────────┘              │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

### Mobile Layout (375x667) - Both Pages

```
┌─────────────────────┐
│  BRANDING (compact) │  ← Green bar with logo
├─────────────────────┤
│                     │
│   FORM              │
│   (full width)      │
│                     │
│   Email input       │
│   Password input    │
│   [Button]          │
│                     │
│   Link to other pg  │
│                     │
└─────────────────────┘
```

### UX Decisions (Confirmed)

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Error display | Inline under field + Toast | Both for visibility |
| Validation timing | On submit only | Simpler, less intrusive |
| Success flow | Confirmation → redirect | User sees feedback before navigation |
| Button style | Turtle green `#5d8a6b`, cream text, 12px rounded | Matches brand |
| Mobile layout | Stack vertically (branding top, form below) | Maintains brand presence |

---

## 6. DEPENDENCIES

### Required Before Start

| Dependency | Status | Blocker If Missing |
|------------|--------|-------------------|
| ai-chatbot repo cloned | EXISTS | Cannot start frontend |
| Railway project access | EXISTS | Cannot deploy |
| Postgres database | NEEDS SETUP | Cannot persist users |

### External Services

| Service | Purpose | Config Needed |
|---------|---------|---------------|
| Railway Postgres | User database | DATABASE_URL env var |
| Railway | Deployment | RAILWAY_TOKEN, project link |

---

## 7. ENVIRONMENT

### Railway Project

**Project:** upbeat-benevolence (id: `7e819fb2-6401-4390-be5f-d66ede223933`)

### Railway Services

| Service | Environment | Status | Notes |
|---------|-------------|--------|-------|
| steertrue-chat-frontend | dev-sandbox | EXISTS | ai-chatbot Next.js app |
| Postgres-x1A- | dev-sandbox | ONLINE | ai-chatbot database (separate from SteerTrue) |

**Note:** keith-dev and amy-dev environments deferred to future sprint.

### Environment Variables (ai-chatbot)

| Variable | Service | Value/Source |
|----------|---------|--------------|
| DATABASE_URL | ai-chatbot | Railway Postgres connection string |
| AUTH_SECRET | ai-chatbot | Generate with `openssl rand -base64 32` |
| NEXTAUTH_URL | ai-chatbot | Railway service URL |

**⚠️ WARNING:** Never commit AUTH_SECRET to the repository. Use `.env.local` for local development (gitignored) and Railway environment variables for deployment.

### Existing Backend (for reference - not used Day 1)

| Service | URL | Purpose |
|---------|-----|---------|
| steertrue-sandbox | Railway | SteerTrue API (Day 3+) |

---

## 8. REPOSITORY CONTEXT

| Repo | Purpose | Branch |
|------|---------|--------|
| keithcostello/ai-chatbot | Consumer frontend | dev (primary), keith, amy |
| steertrue (this repo) | Documentation, sprint tracking | dev |

### Branch Strategy

```
ai-chatbot repo:
├── dev      ← Primary development
├── keith    ← Keith's environment
└── amy      ← Amy's environment
```

### File Locations (ai-chatbot - to be created)

| What | Path |
|------|------|
| User schema | `db/schema/users.ts` |
| Auth routes | `app/api/auth/[...nextauth]/route.ts` |
| Signup page | `app/(auth)/signup/page.tsx` |
| Login page | `app/(auth)/login/page.tsx` |
| Drizzle config | `drizzle.config.ts` |

---

## 9. TESTING REQUIREMENTS

### Automated Tests

| Test Type | Command | What It Verifies |
|-----------|---------|------------------|
| Unit | `npm test` | Password hashing, validation |
| Integration | `npm run test:integration` | API routes work |

### Manual Verification (Day 1)

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Navigate to /signup | See branded signup form |
| 2 | Enter invalid email | See validation error |
| 3 | Enter password < 8 chars | See validation error |
| 4 | Enter valid email + password | Form submits |
| 5 | Check database | User record exists with hashed password |
| 6 | Submit same email again | See "already registered" error |

### Browser Testing (REQUIRED - per PRD)

| Browser | Viewport | Must Pass |
|---------|----------|-----------|
| Chrome | Desktop (1440x900) | All manual steps |
| Chrome | Mobile (375x667) | Form is usable |

**Evidence Required:**
- Screenshot of signup form
- Screenshot of successful signup
- Console showing no errors
- Network tab showing 201 response

---

## 10. RISKS AND MITIGATIONS

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| Auth.js setup complexity | Medium | Medium | Follow official Next.js 15 + Auth.js docs |
| Database connection issues | Low | High | Test connection before writing schema |
| Password hashing security | Low | High | Use bcrypt with salt rounds ≥ 10 |
| CORS misconfiguration | Low | Medium | Test cross-origin requests explicitly |

---

## 11. AGENT CONSULTATION REQUIRED

| Technology | Agent | Trigger |
|------------|-------|---------|
| Pydantic models | `.claude/agents/pydantic_architect.md` | NOT required Day 1 (auth is Next.js native) |
| CopilotKit | `.claude/agents/copilot_kit.md` | NOT required Day 1 (no AI features) |

**Day 1 does not require architect consultation** - Auth.js is a Next.js pattern, not Pydantic AI or CopilotKit.

---

## 12. OPEN QUESTIONS

| # | Question | Answer | Answered By |
|---|----------|--------|-------------|
| 1 | Separate database for ai-chatbot? | Yes - security isolation from SteerTrue | Keith (this session) |
| 2 | Auth approach? | Auth.js with httpOnly cookies | Keith (this session) |
| 3 | Signup design? | Branded split-page layout | Keith (this session) |
| 4 | Include role in users table from Day 1? | Yes | Keith (this session) |
| 5 | Additional profile fields? | Yes - display_name, avatar_url | Keith (this session) |

---

## EXTRACTION LOG

| Source | Sections Used | Date |
|--------|---------------|------|
| `memory/projects/steertrue-audit/PRD_V1.md` | Day 1-2 schedule, Architecture Decisions, Database Changes, User Stories, Color Palette | 2026-01-21 |
| `memory/projects/steertrue-audit/REQUIREMENTS_MAP.md` | C-01, I-04, I-05 requirements | 2026-01-21 |
| `docs/design/storyboarding/designx/user_frontend/chat_visual_v.01.md` | Color palette, typography | 2026-01-21 |
| Conversation with Keith | Database separation, auth approach, design decisions | 2026-01-21 |
| Railway CLI output | Project structure, existing services | 2026-01-21 |

---

**END OF SPRINT CONTEXT**
