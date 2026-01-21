# Current Issue Analysis - Buttons Break After OAuth

**Date:** 2026-01-21
**Sprint:** S2.1
**Issue:** Buttons stop working after OAuth attempt

---

## User Report

1. Fresh browser -> https://steertrue-chat-dev-sandbox.up.railway.app
2. Click "Get Started" -> Goes to signup (WORKS)
3. Sign in with Google -> Redirected back to home page (WRONG - should go to dashboard?)
4. Click "Log In" -> Nothing happens (BROKEN)
5. Reload page -> BOTH buttons now broken
6. Console shows: `Failed to load resource: the server responded with a status of 401 ()`

---

## PM Investigation

### Finding 1: HTML Contains Correct Buttons

curl test of home page shows buttons are correctly rendered in HTML:

```html
<a class="inline-block px-6 py-3 bg-[#5d8a6b]..." href="/signup">Get Started</a>
<a class="inline-block px-6 py-3 border border-[#5d8a6b]..." href="/login">Log In</a>
```

Both buttons are standard `<a>` tags with `href` attributes - they should work even without JavaScript.

**Conclusion:** The HTML is correct. The problem is NOT missing buttons.

---

### Finding 2: The 401 Error

The 401 error comes from `/api/auth/me` endpoint called on page load.

**Code in `app/page.tsx`:**
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

**Code in `/api/auth/me/route.ts`:**
```typescript
if (!token) {
  return NextResponse.json(
    { error: 'Not authenticated', code: 'NOT_AUTHENTICATED' },
    { status: 401 }
  );
}
```

**Analysis:** The 401 is EXPECTED behavior when the user is not logged in. The code handles this gracefully (empty catch block). This is NOT the bug.

---

### Finding 3: Server vs Client Rendering

The page uses `'use client'` directive and renders differently:

**Server-Side (initial HTML):**
- Both buttons rendered immediately
- No loading state
- `user` is `null`, `authChecked` is `false`

**Client-Side (after JavaScript):**
- useEffect runs
- `/api/auth/me` called
- 401 returned (expected)
- `authChecked` set to `true`
- Buttons should still work

**The 401 error should NOT break the buttons** because:
1. The code catches the error
2. The buttons are regular `<a>` tags, not JavaScript-dependent

---

### Finding 4: React Link vs Native Anchor

Looking at the code:

```typescript
import Link from 'next/link';
// ...
<Link
  href="/signup"
  className="inline-block px-6 py-3 bg-[#5d8a6b]..."
>
  Get Started
</Link>
```

The buttons use Next.js `Link` component which:
1. Renders as `<a>` tags in HTML
2. Provides client-side navigation when JavaScript runs
3. Falls back to regular navigation if JavaScript fails

**If buttons "do nothing" on click, possible causes:**

1. **JavaScript error** - If JS throws, React crashes and event handlers stop
2. **Hydration mismatch** - If server/client HTML differs, React may not attach handlers
3. **Link component bug** - unlikely, but possible
4. **Session cookies corruption** - Auth.js sets cookies that may affect subsequent requests

---

### Finding 5: Cookie State After OAuth

Looking at the home page response headers:

```
Set-Cookie: __Host-authjs.csrf-token=...
Set-Cookie: __Secure-authjs.callback-url=...
```

Auth.js sets cookies on every page load. After a failed OAuth attempt:

1. User clicks "Sign in with Google"
2. Redirected to Google
3. Either: User cancels, OR OAuth fails
4. User returns to app
5. Auth.js may have set partial session state

**Hypothesis:** After OAuth attempt (even failed), Auth.js may have set cookies that are in an inconsistent state:
- No valid session token
- But callback-url or csrf-token set
- Next request to `/api/auth/me` returns 401
- But some Auth.js internal state is confused

---

## Root Cause Hypotheses

### Hypothesis A: JavaScript Error Breaks React

If any JavaScript error occurs during page load:
1. React error boundary catches (or doesn't)
2. Component tree may not hydrate correctly
3. Link component click handlers not attached
4. Buttons render but don't respond to clicks

**Evidence needed:** Check browser console for JavaScript exceptions, not just network errors.

---

### Hypothesis B: Session State Corruption

After failed OAuth:
1. Auth.js sets partial cookies
2. Middleware sees partial auth state
3. Middleware behavior changes
4. Links work but navigation is blocked

**Evidence needed:** Compare cookies before and after OAuth attempt.

---

### Hypothesis C: Redirect Loop Detection

If browser detects a redirect loop:
1. Browser may block further navigation
2. Click events might be suppressed
3. Links appear broken

**Evidence needed:** Check Network tab for redirect sequences.

---

### Hypothesis D: OAuth Callback Not Completing

Looking at middleware:

```typescript
const publicRoutes = [
  '/',
  '/login',
  '/signup',
  '/api/auth',  // All Auth.js routes
  '/api/health',
];
```

`/api/auth` prefix should allow `/api/auth/callback/google`.

BUT - after Google redirects back:
1. Does `/api/auth/callback/google` run correctly?
2. Does it set session?
3. Does it redirect to the right place?

**The user says:** "Redirected back to home page (WRONG - should go to dashboard?)"

This suggests OAuth callback IS running but not setting session correctly.

---

## Recommended Investigation Steps

### Step 1: Check Browser Console (CRITICAL)

Open DevTools Console BEFORE navigating to the site.
Document ALL messages - errors AND warnings.

**Key questions:**
- Are there JavaScript exceptions?
- Are there React errors?
- Are there hydration warnings?

---

### Step 2: Check Network Tab During Click

With Network tab open:
1. Click "Log In" button
2. Check if ANY request fires
3. If yes - what's the response?
4. If no - JavaScript event handler isn't running

---

### Step 3: Test Without JavaScript

1. Disable JavaScript in browser
2. Navigate to home page
3. Click "Log In"
4. Does navigation work?

If YES - JavaScript is breaking it.
If NO - Something else is wrong.

---

### Step 4: Clear Cookies and Retry

1. Clear ALL cookies for the domain
2. Clear localStorage and sessionStorage
3. Navigate to home page
4. Test buttons

If buttons work after clearing cookies, the problem is corrupted session state.

---

### Step 5: Test OAuth Callback Directly

1. Open Network tab
2. Click "Sign in with Google"
3. Complete OAuth
4. Watch the redirect chain
5. Document every redirect

**Expected:**
```
/login -> accounts.google.com -> /api/auth/callback/google -> / (with session)
```

**Problem if:**
```
/login -> accounts.google.com -> /api/auth/callback/google -> /login (loop)
OR
/login -> accounts.google.com -> / (skipped callback)
```

---

## Questions for User

1. **Console:** What EXACT messages appear in browser console?
2. **Network:** When you click "Log In", does Network tab show any request?
3. **Cookies:** If you clear cookies for the domain, do buttons work again?
4. **OAuth Details:** After clicking Google sign-in and completing auth, what URL are you returned to EXACTLY?

---

## Likely Fix

Based on the evidence, the most likely issue is one of:

**A. OAuth callback redirect URL misconfigured**
- In Google Cloud Console, the redirect URI might be wrong
- Should be: `https://steertrue-chat-dev-sandbox.up.railway.app/api/auth/callback/google`

**B. Auth.js session not being set after OAuth**
- The signIn callback in `lib/auth.ts` may have a bug
- The database insert may be failing silently

**C. Middleware interfering with OAuth callback**
- Though `/api/auth` prefix should allow it, something may be wrong

**D. JavaScript error from 401 breaking React**
- The 401 should be handled, but perhaps there's an unhandled edge case

---

## Immediate Action

**User should:**
1. Open DevTools Console
2. Clear console
3. Navigate to home page fresh
4. Document any errors
5. Click "Log In"
6. Document what happens (network activity, console messages)
7. Report back

**DEV should:**
1. Check Railway logs for errors during OAuth callback
2. Verify Google OAuth redirect URIs match exactly
3. Add console.log to OAuth signIn callback
4. Test OAuth flow with Railway logs visible

---

**END OF ANALYSIS**
