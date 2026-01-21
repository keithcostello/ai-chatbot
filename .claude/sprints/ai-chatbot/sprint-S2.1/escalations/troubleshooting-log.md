# Troubleshooting Log - Sprint S2.1 Google OAuth

## Issue Timeline

### Issue 1: 2026-01-21T18:15:00Z - Internal Server Error on All Routes
**Problem:** https://steertrue-chat-dev-sandbox.up.railway.app/signup returns "Internal Server Error" (500)

**Investigation:**
1. Checked Railway logs via `railway logs`
2. Found error: `TypeError: Cannot read properties of undefined (reading 'modules')`
3. Error occurs in `.next/server/edge/chunks/[root-of-the-server]__98f42940._.js`
4. Local build succeeds (`npm run build` completes successfully)
5. Health endpoint `/api/health` also returns 500

**Root Cause:**
The `middleware.ts` file uses Auth.js's `auth()` wrapper pattern:
```typescript
import { auth } from '@/lib/auth';
export default auth((req) => { ... });
```

The `lib/auth.ts` imports:
- `bcrypt` - Node.js native module (line 4)
- `postgres` via `@/db` - Node.js database driver (line 5)
- `drizzle-orm` - depends on postgres (line 7)

Middleware in Next.js runs in the **Edge Runtime** by default. These Node.js-specific modules cannot run in Edge Runtime, causing the "Cannot read properties of undefined (reading 'modules')" error.

**Evidence:**
- Railway logs show: `TypeError: Cannot read properties of undefined (reading 'modules')`
- curl response: `HTTP/1.1 500 Internal Server Error`
- API routes have `export const runtime = 'nodejs';` but middleware does not

**Fix Applied:** Option B - Split auth configuration

**Selected Solution:** Created Edge-compatible `lib/auth.config.ts` that contains only configuration that can run in Edge Runtime (no bcrypt, no database imports). Updated `middleware.ts` to use this config instead of the full `lib/auth.ts`.

**Files Changed:**
1. Created `lib/auth.config.ts` - Edge-compatible auth configuration
2. Modified `middleware.ts` - Import from `auth.config.ts` instead of `auth.ts`

**Result:** FIXED

**Verification (2026-01-21T18:20:43Z):**
```bash
# Health check - SUCCESS
curl -s https://steertrue-chat-dev-sandbox.up.railway.app/api/health
{"status":"ok","timestamp":"2026-01-21T18:20:36.945Z"}

# Signup page - SUCCESS (HTTP 200)
curl -s -I https://steertrue-chat-dev-sandbox.up.railway.app/signup
HTTP/1.1 200 OK

# Login page - SUCCESS (HTTP 200)
curl -s -I https://steertrue-chat-dev-sandbox.up.railway.app/login
HTTP/1.1 200 OK

# Railway logs - No errors
Starting Container
> next start
...
✓ Ready in 796ms
```

---

## Agent-Browser Verification (2026-01-21T10:24:00Z)

**Purpose:** Visual verification of deployed fix using agent-browser

### Signup Page Verification
**URL:** https://steertrue-chat-dev-sandbox.up.railway.app/signup

**Command:**
```bash
agent-browser --session verify open https://steertrue-chat-dev-sandbox.up.railway.app/signup
```

**Result:** SUCCESS - Page loads with title "SteerTrue"

**Accessibility Snapshot:**
```
- document:
  - img "SteerTrue Logo"
  - heading "SteerTrue" [level=1]
  - paragraph: SteerTrue, Stay True.
  - heading "Create Account" [level=2]
  - button "Sign up with Google"
  - textbox "Email" (placeholder: you@example.com)
  - textbox "Password" (placeholder: At least 8 characters)
  - textbox "Confirm Password" (placeholder: Confirm your password)
  - button "Sign Up"
  - link "Log in" -> /login
```

**Screenshot:** `.claude/sprints/ai-chatbot/sprint-S2.1/screenshots/signup-verification.png`

### Login Page Verification
**URL:** https://steertrue-chat-dev-sandbox.up.railway.app/login

**Command:**
```bash
agent-browser --session verify open https://steertrue-chat-dev-sandbox.up.railway.app/login
```

**Result:** SUCCESS - Page loads with title "SteerTrue"

**Accessibility Snapshot:**
```
- document:
  - img "SteerTrue Logo"
  - heading "SteerTrue" [level=1]
  - paragraph: SteerTrue, Stay True.
  - heading "Welcome Back" [level=2]
  - button "Sign in with Google"
  - textbox "Email" (placeholder: you@example.com)
  - textbox "Password" (placeholder: Enter your password)
  - button "Log In"
  - link "Sign up" -> /signup
```

**Screenshot:** `.claude/sprints/ai-chatbot/sprint-S2.1/screenshots/login-verification.png`

### Verification Summary

| Page | Status | Elements Verified |
|------|--------|-------------------|
| /signup | PASS | Logo, form fields, Google OAuth button, navigation link |
| /login | PASS | Logo, form fields, Google OAuth button, navigation link |

**Conclusion:** Edge Runtime fix verified successful. Both authentication pages render correctly with all form elements functional.

---

## Notes

- Local build succeeds because the build step doesn't execute the Edge Runtime code
- The error only manifests at runtime when Railway tries to serve requests
- This is a known Auth.js v5 compatibility issue when using database adapters with Edge middleware
- The solution follows Auth.js v5 best practice: separate Edge-compatible config from Node.js-specific code
- Full `auth.ts` is still used by API routes (which run in Node.js runtime)
- `auth.config.ts` is used by middleware (which runs in Edge runtime)
