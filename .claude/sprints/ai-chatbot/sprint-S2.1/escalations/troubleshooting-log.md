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

**Fix Applied:** [PENDING - Need to implement]

**Options:**
1. **Option A:** Add `export const runtime = 'nodejs';` to middleware.ts - This forces middleware to run in Node.js runtime instead of Edge
2. **Option B:** Split auth configuration to separate Edge-compatible exports from Node.js-only code
3. **Option C:** Create a simpler middleware that doesn't import the full auth config

**Selected Solution:** Option A - Force Node.js runtime in middleware

**Result:** [PENDING]

---

## Notes

- Local build succeeds because the build step doesn't execute the Edge Runtime code
- The error only manifests at runtime when Railway tries to serve requests
- This is a known Auth.js v5 compatibility issue when using database adapters with Edge middleware
