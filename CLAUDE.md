# Project Instructions for Claude Code

<!-- AI CONTEXT
WHAT: Follow these rules in every response. This is your operating manual for ai-chatbot.
WHY: You have no persistent memory. Each session starts fresh. These rules ensure consistent behavior.
HOW: Read top-to-bottom at session start. Reference specific sections when relevant.
-->

## Project: ai-chatbot (SteerTrue Consumer Frontend)

**Stack:** Next.js 15, App Router, Auth.js, Drizzle ORM, TypeScript, React
**Database:** Railway Postgres (separate from SteerTrue backend)
**Deployment:** Railway (steertrue-chat-frontend service)
**Repository:** keithcostello/ai-chatbot

---

## Architecture

This is a Next.js 15 App Router project:

```
app/
├── (auth)/           # Auth route group
│   ├── signup/       # Signup page
│   └── login/        # Login page
├── api/
│   ├── auth/         # Auth.js routes
│   │   └── [...nextauth]/
│   └── health/       # Health check endpoint
├── layout.tsx        # Root layout
├── page.tsx          # Home page
└── globals.css       # Global styles

db/
├── index.ts          # Drizzle client with connection pooling
└── schema/
    └── users.ts      # User table schema

lib/
├── auth.ts           # Auth.js configuration
└── utils.ts          # Utility functions

components/           # Reusable React components

drizzle/              # Migration files (generated)
```

---

## Key Rules

1. **No Fabrication** - Claims without evidence = termination
2. **Railway UAT** - All UAT on deployed Railway URL, not localhost
3. **Auth.js Patterns** - Follow official Auth.js v5 documentation
4. **Drizzle Patterns** - Use Drizzle ORM conventions
5. **Pattern Search First** - Before proposing any fix, search codebase for existing patterns
6. **Walking Skeleton** - Build minimal end-to-end first, add flesh incrementally

---

## Walking Skeleton Methodology

**MANDATORY for all feature implementation and debugging.**

Build the thinnest possible end-to-end slice first, then add flesh:

1. **Skeleton** - Minimal path through all layers (UI → API → Logic → DB → Response)
2. **Verify** - Deploy and test skeleton works end-to-end before adding features
3. **Flesh** - Add capabilities one at a time, testing after each addition
4. **Debug** - If stuck, strip back to skeleton and binary search for failure

**Full process:** `.claude/docs/WALKING_SKELETON_METHODOLOGY.md`

---

## Branch Strategy

| Branch | Purpose |
|--------|---------|
| dev | Primary development |
| keith | Keith's environment |
| amy | Amy's environment |

Sprint branches: `dev-sprint-S{X.Y}` (e.g., `dev-sprint-S2.1`)

---

## Environment Variables

| Variable | Purpose | Source |
|----------|---------|--------|
| DATABASE_URL | Railway Postgres connection | Railway dashboard |
| AUTH_SECRET | Auth.js secret | `openssl rand -base64 32` |
| NEXTAUTH_URL | Deployment URL | Railway service URL |

**Never commit secrets to repository. Use `.env.local` (gitignored).**

---

## Sprint Tracking

- Sprint files: `.claude/sprints/ai-chatbot/sprint-{id}/`
- Main sprint docs: Coordinated from `dev_pm_branch/.claude/sprints/mlaia/`

---

## SteerTrue Integration

This frontend connects to SteerTrue backend for:
- Chat AI features (future sprints)
- Block injection for AI responses

Backend API: Railway steertrue-sandbox service

---

## UAT Policy

**UAT = Visual verification on deployed Railway URL using agent-browser.**

| NOT Acceptable | Acceptable |
|----------------|------------|
| "npm run dev works" | "I can see it at the Railway URL" |
| "Tests pass locally" | "It shows real data from real backend" |
| Mock data | Real data from real backend |
| Developer verification | User-centric browser verification |
| curl-only API tests | agent-browser UI verification |

---

## Browser Testing (agent-browser)

**All UAT must use agent-browser for UI verification on Railway URL.**

```bash
# Navigate to deployed URL
agent-browser open https://[railway-url]/signup

# Get element refs for interaction
agent-browser snapshot --interactive

# Fill form fields using refs
agent-browser fill @e1 "test@example.com"
agent-browser fill @e2 "password123"
agent-browser click @e3

# Capture screenshot evidence
agent-browser screenshot evidence/signup-result.png

# Get page state
agent-browser title
agent-browser url
```

**UAT Evidence Required:**
- `agent-browser snapshot` output showing page structure
- `agent-browser screenshot` of key states (form, success, error)
- Actual element interaction via `fill`, `click` commands

**Installation:** `npm install -g agent-browser && agent-browser install`

---

## Testing Commands

```bash
# Development
npm run dev

# Build
npm run build

# Tests
npm test

# Database
npx drizzle-kit push    # Apply schema
npx drizzle-kit studio  # DB explorer
```

---

## Deployment

```bash
# Link to Railway service
railway link

# Deploy
railway up

# Check logs
railway logs

# Environment variables
railway variables
```

---

## Process Documentation

Sprint process uses role files in `.claude/roles/`:
- `dev_role.md` - Developer execution rules
- `pm_role.md` - PM verification rules
- `orchestrator_role.md` - Sprint coordination
- `PROJECT_STRUCTURE.md` - File placement rules

Use `/run-sprint` to execute sprints.

---

## Zero Tolerance

**Violations = Immediate termination:**
- Fabricated evidence
- Workarounds instead of proper patterns
- Skipping checkpoints
- Proceeding without approval

---

**END OF PROJECT INSTRUCTIONS**
