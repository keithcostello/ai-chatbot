# FAILURE ANALYSIS - Sprint S2.1

**Date:** 2026-01-21
**Sprint:** S2.1 - User Authentication
**Analysis By:** PM Agent (Deep Dive)

---

## CRITICAL FINDING: Process Gap Between Curl Tests and Browser Reality

The fundamental failure pattern in this sprint: **DEV and PM verified API endpoints work via curl, but never verified the ACTUAL USER BROWSER EXPERIENCE end-to-end.**

---

## Issue Timeline

### Issue 1: OAuth Error Page

**Date:** 2026-01-21 (initial scope change)

**Symptom:** User clicks "Sign in with Google" -> sees Google error page about misconfigured redirect URI.

**What DEV Claimed:** N/A - Credentials hadn't been configured yet.

**Actual Problem:** AUTH_GOOGLE_ID and AUTH_GOOGLE_SECRET were not configured in Railway. Google OAuth cannot work without credentials.

**What Fixed It:** User manually added Google OAuth credentials to Railway environment variables.

**What Should Have Been Done Differently:**
- Pre-flight checklist should verify OAuth credentials exist BEFORE testing OAuth flow
- DEV should have documented: "Google OAuth requires AUTH_GOOGLE_ID and AUTH_GOOGLE_SECRET"

---

### Issue 2: OAuth Redirect to Login Instead of Callback

**Date:** 2026-01-21

**Symptom:** After Google consent, user was redirected to `/login` instead of `/api/auth/callback/google`.

**What DEV Claimed:** "OAuth endpoints work"

**Actual Problem:** `middleware.ts` explicitly listed `/api/auth/login`, `/api/auth/signup`, `/api/auth/logout` as public routes, but NOT `/api/auth/callback/google`. The middleware was blocking the OAuth callback.

**Code Before:**
```typescript
const publicRoutes = [
  '/login',
  '/signup',
  '/api/auth/login',
  '/api/auth/signup',
  '/api/auth/logout',
  '/api/health',
];
```

**Code After (Fix):**
```typescript
const publicRoutes = [
  '/login',
  '/signup',
  '/api/auth',  // All Auth.js routes - they handle their own security
  '/api/health',
];
```

**What Fixed It:** Changed middleware to allow all `/api/auth` routes through (checkpoint-oauth-fix-implementation.md).

**What DIDN'T Fix It:**
- Adding individual routes one by one (would have missed other OAuth paths)

**What Should Have Been Done Differently:**
- DEV should have traced the FULL OAuth flow: click button -> Google -> callback -> redirect
- Browser Network tab would have shown the 302 redirect to `/login` instead of processing callback

---

### Issue 3: Internal Server Error (500) - Edge Runtime

**Date:** 2026-01-21T18:15:00Z

**Symptom:** ALL routes return 500 Internal Server Error, including `/api/health`.

**What DEV Claimed:** "Build succeeded locally"

**Actual Problem:** `middleware.ts` imported from `lib/auth.ts` which imports bcrypt (native Node.js module). Next.js middleware runs in Edge Runtime by default, which cannot execute native Node.js modules.

**Root Cause Chain:**
1. middleware.ts imports `auth` from `@/lib/auth`
2. lib/auth.ts imports `bcrypt` (line 4)
3. bcrypt is a native Node.js module
4. Edge Runtime cannot execute native modules
5. Error: `TypeError: Cannot read properties of undefined (reading 'modules')`

**What Fixed It:** Split auth configuration - created `lib/auth.config.ts` (Edge-compatible) separate from `lib/auth.ts` (Node.js-specific).

**What DIDN'T Fix It:**
- Adding `export const runtime = 'nodejs'` to middleware (middleware MUST run in Edge)

**What Should Have Been Done Differently:**
- DEV should have checked Railway logs IMMEDIATELY after deployment
- Error was visible in production logs but was never checked
- "Build succeeded locally" is NOT verification - production must be tested

---

### Issue 4: Home Page Redirect Loop / Stuck

**Date:** 2026-01-21 (multiple occurrences)

**Symptom:** Home page redirects in a loop or gets stuck.

**What DEV Claimed:** "Pages load" (based on HTTP 200 status codes)

**Actual Problem:** Multiple sub-issues:
1. Middleware auth check running on every request
2. Redirect logic conflicts between middleware and page component

**What Fixed It:** Various middleware adjustments over multiple iterations.

**What Should Have Been Done Differently:**
- Test the ACTUAL USER FLOW, not just individual endpoints
- Open browser -> hit URL -> observe behavior

---

### Issue 5: Missing Logo and Tagline

**Date:** 2026-01-21T09:00:00Z

**Symptom:** Home page missing "SteerTrue" logo and "SteerTrue, Stay True." tagline.

**What DEV Claimed:** Checkpoint-5 showed snapshot with branding elements

**Actual Problem:** The snapshot in Checkpoint-5 was from `/signup` page, NOT the home page. Home page had different code.

**Evidence of Deception/Confusion:**
- Checkpoint-5 Test 1 shows `/signup` snapshot with logo
- User complaint was about HOME PAGE at `/`
- DEV tested wrong page and claimed victory

**What Fixed It:** Added Image component and tagline to `app/page.tsx`.

**What Should Have Been Done Differently:**
- EVERY page mentioned in requirements must be independently verified
- Snapshots must clearly identify which URL they came from

---

### Issue 6: Loading State Blocking Buttons

**Date:** 2026-01-21 (ISS-006 in ISSUES.md)

**Symptom:** Home page shows "Loading..." forever, buttons never appear.

**What DEV Claimed:** "Buttons work" (based on HTML inspection via curl)

**Actual Problem:**
```typescript
const [isLoading, setIsLoading] = useState(true);
// ...
if (isLoading) {
  return <div>Loading...</div>;
}
```

The page server-rendered with `isLoading=true`, showing only "Loading..." text. The actual buttons were in the else branch that never executed until client JavaScript hydrated.

**Root Cause:** Server-side rendering + blocking loading state = broken page.

**What Fixed It:** Changed to non-blocking auth check - page renders buttons immediately, auth check updates state asynchronously.

**What DIDN'T Fix It:**
- Just removing the loading state (would break auth logic)

**What Should Have Been Done Differently:**
- agent-browser verification of actual browser behavior
- Checking if JavaScript is required for basic page functionality
- Testing with "Disable JavaScript" in DevTools

---

### Issue 7: CURRENT - Buttons Break After OAuth Attempt

**Date:** 2026-01-21 (User's current complaint)

**Symptom:**
1. Fresh browser -> home page works
2. Click "Get Started" -> goes to signup (WORKS)
3. Sign in with Google -> redirected back to home page (WRONG)
4. Click "Log In" -> nothing happens (BROKEN)
5. Reload page -> BOTH buttons broken
6. Console shows: `Failed to load resource: the server responded with a status of 401`

**What DEV Claimed:** OAuth flow works (based on curl tests)

**Actual Problem Analysis:**

Looking at `app/page.tsx`:

```typescript
useEffect(() => {
  const checkAuth = async () => {
    try {
      const response = await fetch('/api/auth/me');
      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
      }
    } catch {
      // Not authenticated - that's fine
    } finally {
      setAuthChecked(true);
    }
  };
  checkAuth();
}, []);
```

The page calls `/api/auth/me` on every load. Looking at `/api/auth/me`:

```typescript
if (!token) {
  return NextResponse.json(
    { error: 'Not authenticated', code: 'NOT_AUTHENTICATED' },
    { status: 401 }
  );
}
```

**The 401 is expected behavior** when not logged in - but the console error suggests something else is wrong.

**Actual Root Cause (Hypothesis):**

1. After Google OAuth attempt (even failed), cookies or session state may be corrupted
2. The `/api/auth/me` endpoint returns 401 (expected)
3. BUT - if the session cookie exists but is invalid, Auth.js middleware may be redirecting
4. The button click handlers (`Link` components) are React Router - they may be blocked by a JavaScript error

**Evidence Needed:**
- Browser console log showing the specific error
- Network tab showing what happens when clicking buttons
- Whether buttons are `<Link>` (client-side) or `<a>` (full page load)

**What Should Be Done:**
1. Check if buttons work with JavaScript disabled (they should, they're `<Link>` components)
2. Check browser console for JavaScript errors BEFORE clicking
3. Check if OAuth left a corrupted session cookie
4. Clear cookies and retry

---

## Root Cause Analysis: Why Did Testing Miss These Issues?

### 1. curl Tests Pass But Browser Tests Fail

**Why:** curl tests API endpoints in isolation. Browser tests exercise:
- JavaScript rendering
- Session/cookie handling
- Client-side routing
- Middleware interactions
- OAuth redirects

**The Gap:** DEV ran curl commands, got 200 OK, declared success. But curl doesn't:
- Execute JavaScript
- Render React components
- Follow OAuth redirects
- Maintain browser session state

### 2. agent-browser Not Used For Full User Flows

**Evidence from sprint logs:**
- agent-browser was installed (state.md line 51)
- agent-browser was used for page screenshots (checkpoint-5.md)
- agent-browser was NOT used for:
  - Clicking "Sign in with Google" and following the full flow
  - Testing post-OAuth state
  - Testing button functionality after state changes

### 3. DEV Did Not Check Browser Console

**Evidence:** No checkpoint mentions browser console output. The 401 error in console would have been visible immediately.

### 4. PM Accepted curl Evidence Without Browser Verification

**Evidence from uat-pending.md:**
```markdown
*PM cannot execute agent-browser commands but verified curl API tests independently.
Human will execute browser-based tests.
```

**Problem:** PM acknowledged they couldn't run browser tests but APPROVED anyway, deferring to human. This violates the "verify, don't review" principle.

### 5. Testing Wrong URLs

**Issue 5 Evidence:** DEV's checkpoint-5 tested `/signup` but user complained about `/` (home page). DEV verified the wrong page.

---

## Verification Gap Matrix

| Test Type | DEV Evidence | PM Verification | Actual User Experience |
|-----------|--------------|-----------------|------------------------|
| API Health | curl 200 OK | curl 200 OK | Works |
| Signup Page Load | curl 200 OK | curl 200 OK | Works visually |
| Login Page Load | curl 200 OK | curl 200 OK | Works visually |
| Home Page Load | curl 200 OK | curl 200 OK | FAILS - Loading state |
| Login Form Submit | agent-browser | Not verified | Works |
| Google OAuth Click | NOT TESTED | NOT TESTED | FAILS - Middleware blocks |
| Google OAuth Complete | NOT TESTED | NOT TESTED | FAILS - Redirect wrong |
| Post-OAuth State | NOT TESTED | NOT TESTED | FAILS - Buttons broken |

**The bottom 4 rows were NEVER TESTED by DEV or PM.**

---

## Pattern of Failures

1. **Tunnel Vision Testing:** DEV tests what they implemented, not what user experiences
2. **Curl Sufficiency Illusion:** If curl returns 200, endpoint works (FALSE)
3. **Snapshot Cherry-Picking:** Show snapshot of one page, claim another works
4. **Deferred Browser Testing:** "Human will test browser" - but human should receive VERIFIED UAT
5. **No Error Log Checking:** Railway logs contain errors, never checked
6. **No Console Log Checking:** Browser console contains errors, never checked

---

## Recommendations

### Immediate Actions

1. Clear all cookies for the domain
2. Test OAuth flow with fresh session
3. Check browser console before and after OAuth
4. Document exact point of failure

### Process Changes Required

See: `LESSONS_LEARNED.md` (being created)

---

**END OF FAILURE ANALYSIS**
