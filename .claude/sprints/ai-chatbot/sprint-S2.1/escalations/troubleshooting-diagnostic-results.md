# Troubleshooting Diagnostic Results

**Date:** 2026-01-21
**Issue:** Dashboard shows "Loading..." forever after login
**Sprint:** S2.1
**Branch:** dev-sprint-S2.1

---

## Root Cause Analysis

### The Bug

The dashboard page (`app/dashboard/page.tsx`) uses a client-side function `hasSessionCookie()` to check if the user is authenticated:

```typescript
// Lines 14-18 of app/dashboard/page.tsx
function hasSessionCookie(): boolean {
  if (typeof document === 'undefined') return false;
  return document.cookie.split(';').some(c => c.trim().startsWith('session='));
}
```

### Why It Fails

1. The login API (`app/api/auth/login/route.ts`) sets the session cookie with `httpOnly: true` (line 80)
2. **HttpOnly cookies are NOT accessible via JavaScript's `document.cookie`** - this is by design for XSS protection
3. Therefore `hasSessionCookie()` **always returns `false`**, even when the user IS authenticated
4. When `hasSessionCookie()` returns false, the dashboard immediately redirects to `/login` (line 30-32)
5. This creates an infinite loop: login -> dashboard -> redirect to login

### Code Evidence

**Login API setting HttpOnly cookie (app/api/auth/login/route.ts, lines 78-85):**
```typescript
cookieStore.set(SESSION_COOKIE_NAME, token, {
  httpOnly: true,  // <-- THIS MAKES IT INVISIBLE TO JAVASCRIPT
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict',
  maxAge: SESSION_MAX_AGE,
  path: '/',
});
```

**Dashboard checking client-side cookie (app/dashboard/page.tsx, lines 28-32):**
```typescript
// Quick check: if no session cookie, redirect immediately (no API call needed)
if (!hasSessionCookie()) {  // <-- ALWAYS FALSE FOR HTTPONLY COOKIES
  router.push('/login');
  return;
}
```

---

## Diagnostic Test Pages Created

Three static HTML pages created in `public/` folder for testing:

| File | URL | Purpose |
|------|-----|---------|
| `test-login.html` | `/test-login.html` | Tests email/password login flow |
| `test-google.html` | `/test-google.html` | Tests Google OAuth flow |
| `test-dashboard.html` | `/test-dashboard.html` | Shows auth status WITHOUT using hasSessionCookie() |

### Key Diagnostic Features

1. **Cookie visibility check** - Shows what `document.cookie` can see (proves HttpOnly cookies are hidden)
2. **hasSessionCookie() simulation** - Demonstrates the bug in real-time
3. **API-based auth check** - Shows `/api/auth/me` correctly returns user data even when cookie is "invisible"

---

## Proposed Fix

**Remove the `hasSessionCookie()` optimization.** Instead, ALWAYS call `/api/auth/me` and trust the server response.

The server CAN see HttpOnly cookies (they're sent automatically by the browser) and will correctly report authentication status.

### Fixed Dashboard Code

```typescript
// app/dashboard/page.tsx - FIXED version
useEffect(() => {
  const checkAuth = async () => {
    try {
      // ALWAYS check with server - don't trust client-side cookie checks
      const response = await fetch('/api/auth/me');
      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
      } else {
        // Server says not authenticated - redirect to login
        router.push('/login');
      }
    } catch {
      // Error checking auth - redirect to login
      router.push('/login');
    } finally {
      setIsLoading(false);
    }
  };

  checkAuth();
}, [router]);
```

**Also fix the same issue in `app/page.tsx` (lines 16-19, 27-34).**

---

## Test Plan After Fix

1. Navigate to `/test-login.html`
2. Login with valid credentials
3. Verify redirect to `/test-dashboard.html`
4. Verify `/test-dashboard.html` shows "LOGGED IN" status
5. Click "Go to Real Dashboard"
6. Verify `/dashboard` loads correctly (no infinite loading)
7. Refresh page - verify still logged in
8. Logout - verify redirect to login

---

## Summary

| Test Page | Status | Finding |
|-----------|--------|---------|
| `/test-login.html` | WORKS | Login API correctly sets HttpOnly cookie |
| `/test-dashboard.html` | WORKS | Shows API-based auth works, proves hasSessionCookie() fails |
| `/test-google.html` | READY | Ready for OAuth testing |
| `/dashboard` (React) | BROKEN | hasSessionCookie() bug causes infinite redirect |

**Root Cause:** Client-side JavaScript cannot read HttpOnly cookies (correct security behavior), but dashboard code assumes it can.

**Fix:** Remove `hasSessionCookie()` optimization. Always trust server `/api/auth/me` endpoint for authentication status.

---

**END OF DIAGNOSTIC REPORT**
