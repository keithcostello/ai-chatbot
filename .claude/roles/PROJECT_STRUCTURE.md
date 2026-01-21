# PROJECT STRUCTURE - ai-chatbot

**Version:** 1.0
**Project:** ai-chatbot (SteerTrue Consumer Frontend)
**Framework:** Next.js 15 App Router
**Updated:** 2026-01-20

---

## PATH CONFIG (Read by all role files)

**IMPORTANT:** The git repo is `ai-chatbot`. This is a Next.js frontend, not the SteerTrue Python backend.

| Variable | Value | Description |
|----------|-------|-------------|
| project_name | `ai-chatbot` | Sprint namespace identifier |
| sprint_root | `.claude/sprints/ai-chatbot/` | Base path for sprint directories |
| source_root | `app/`, `db/`, `lib/` | Source code locations |
| test_root | `tests/` or `__tests__/` | Test files location |
| components_root | `components/` | React components |
| sprint_pattern | `{sprint_root}sprint-{id}/` | Full sprint path pattern |

**Example paths:**

- Sprint directory: `.claude/sprints/ai-chatbot/sprint-S2.1/`
- Page component: `app/(auth)/signup/page.tsx`
- API route: `app/api/auth/[...nextauth]/route.ts`
- Database schema: `db/schema/users.ts`
- Component: `components/ui/Button.tsx`
- Test file: `tests/auth.test.ts` or `__tests__/auth.test.ts`

---

## NEXT.JS APP ROUTER ARCHITECTURE

### Directory Overview

| Directory | Purpose | Contains |
|-----------|---------|----------|
| **app/** | Routes & Pages | Page components, API routes, layouts |
| **app/api/** | API Routes | Server-side endpoints (route.ts files) |
| **db/** | Database | Drizzle schema, client configuration |
| **lib/** | Utilities | Auth config, helpers, shared logic |
| **components/** | UI | Reusable React components |
| **drizzle/** | Migrations | Generated SQL migration files |

### App Router Conventions

```
app/
├── (auth)/                 # Route group (no URL segment)
│   ├── signup/
│   │   └── page.tsx        # /signup
│   └── login/
│       └── page.tsx        # /login
├── api/
│   ├── auth/
│   │   └── [...nextauth]/
│   │       └── route.ts    # /api/auth/*
│   └── health/
│       └── route.ts        # /api/health
├── layout.tsx              # Root layout
├── page.tsx                # / (home)
└── globals.css             # Global styles
```

### File Naming Rules

| Type | File Name | Example |
|------|-----------|---------|
| Page | `page.tsx` | `app/login/page.tsx` |
| Layout | `layout.tsx` | `app/layout.tsx` |
| API Route | `route.ts` | `app/api/health/route.ts` |
| Loading UI | `loading.tsx` | `app/loading.tsx` |
| Error UI | `error.tsx` | `app/error.tsx` |
| Component | `PascalCase.tsx` | `components/LoginForm.tsx` |
| Utility | `camelCase.ts` | `lib/auth.ts` |
| Schema | `tableName.ts` | `db/schema/users.ts` |

---

## DIRECTORY STRUCTURE

```
ai-chatbot/                          # git repo root
│
├── app/                             # Next.js App Router
│   ├── (auth)/                      # Auth route group
│   │   ├── signup/
│   │   │   └── page.tsx
│   │   └── login/
│   │       └── page.tsx
│   ├── api/
│   │   ├── auth/
│   │   │   └── [...nextauth]/
│   │   │       └── route.ts
│   │   └── health/
│   │       └── route.ts
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css
│
├── components/                      # React components
│   ├── ui/                          # Base UI components
│   └── auth/                        # Auth-specific components
│
├── db/                              # Database layer
│   ├── index.ts                     # Drizzle client
│   └── schema/
│       └── users.ts                 # User table schema
│
├── lib/                             # Shared utilities
│   ├── auth.ts                      # Auth.js configuration
│   └── utils.ts                     # Helper functions
│
├── drizzle/                         # Migrations (generated)
│
├── tests/                           # Test files
│   └── auth.test.ts
│
├── .claude/                         # AI Orchestration
│   ├── roles/                       # Role definitions
│   │   ├── PROJECT_STRUCTURE.md    # This file
│   │   ├── dev_role.md
│   │   ├── pm_role.md
│   │   └── orchestrator_role.md
│   ├── commands/                    # Slash commands
│   ├── sprints/ai-chatbot/          # Sprint files
│   │   └── sprint-S{X.Y}/
│   │       ├── PROMPT.md
│   │       ├── CONTEXT.md
│   │       ├── ISSUES.md
│   │       └── state.md
│   └── status/
│       └── current-sprint.md
│
├── scripts/                         # Hook scripts
│
├── CLAUDE.md                        # Project instructions
├── drizzle.config.ts               # Drizzle configuration
├── package.json
├── tsconfig.json
└── next.config.ts
```

---

## FILE PLACEMENT RULES

### Source Code

| Content Type | Location | Example |
|--------------|----------|---------|
| Pages | `app/{route}/page.tsx` | `app/(auth)/signup/page.tsx` |
| API routes | `app/api/{route}/route.ts` | `app/api/health/route.ts` |
| Layouts | `app/{route}/layout.tsx` | `app/(auth)/layout.tsx` |
| Database schema | `db/schema/{table}.ts` | `db/schema/users.ts` |
| Database client | `db/index.ts` | `db/index.ts` |
| Auth config | `lib/auth.ts` | `lib/auth.ts` |
| Components | `components/{category}/{Name}.tsx` | `components/ui/Button.tsx` |
| Utilities | `lib/{name}.ts` | `lib/utils.ts` |

### Tests

| Content Type | Location | Example |
|--------------|----------|---------|
| Unit tests | `tests/` or `__tests__/` | `tests/auth.test.ts` |
| E2E tests | `tests/e2e/` | `tests/e2e/signup.spec.ts` |

### Sprint Artifacts

| Content Type | Location | Example |
|--------------|----------|---------|
| Sprint prompt | `.claude/sprints/ai-chatbot/sprint-{id}/PROMPT.md` | `sprint-S2.1/PROMPT.md` |
| Sprint context | `.claude/sprints/ai-chatbot/sprint-{id}/CONTEXT.md` | `sprint-S2.1/CONTEXT.md` |
| Issues log | `.claude/sprints/ai-chatbot/sprint-{id}/ISSUES.md` | `sprint-S2.1/ISSUES.md` |
| State tracking | `.claude/sprints/ai-chatbot/sprint-{id}/state.md` | `sprint-S2.1/state.md` |
| Checkpoints | `.claude/sprints/ai-chatbot/sprint-{id}/checkpoints/` | `checkpoints/checkpoint-3.md` |

---

## VALIDATION RULES

### Path Evidence in Checkpoints

Always use full paths:

```
CORRECT: "Created app/(auth)/signup/page.tsx"
CORRECT: "Schema at db/schema/users.ts"
CORRECT: "API route at app/api/health/route.ts"

WRONG: "Created signup page"
WRONG: "Created page.tsx"
WRONG: "Created src/signup.tsx" (wrong structure)
```

**Structure violation = checkpoint rejected.**

---

## PM VALIDATION CHECKLIST

When reviewing checkpoints, PM must verify:

- [ ] Pages are in `app/` with `page.tsx` naming
- [ ] API routes use `route.ts` (not `page.ts`)
- [ ] Database schema in `db/schema/`
- [ ] Components in `components/`
- [ ] No files in root (except config files)
- [ ] Full paths cited in evidence
- [ ] Tests exist for new functionality
- [ ] TypeScript types are correct

---

## ARCHITECTURE REVIEW (Per Checkpoint)

1. **Did you modify app/?** Are routes using App Router conventions?
2. **Did you add API routes?** Are they using `route.ts` with proper HTTP methods?
3. **Did you modify db/?** Is the schema using Drizzle patterns?
4. **Did you add components?** Are they properly typed and reusable?
5. **Import map:** No circular dependencies?

---

## DEPLOYMENT CONTEXT

| Environment | Service | URL Pattern |
|-------------|---------|-------------|
| dev-sandbox | steertrue-chat-frontend | `*.railway.app` |
| Database | Postgres-x1A- | Railway internal |

**Deployment command:** `railway up`
**Logs:** `railway logs`

---

**END OF PROJECT STRUCTURE**
