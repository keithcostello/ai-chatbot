# Sprint S2.1 Lessons Learned

## Purpose
Capture lessons from this sprint to prevent repeating mistakes in future sprints.

---

## L1: Auth.js Session Cookie Configuration

**What Happened:** Initial confusion about how Auth.js manages session cookies.

**Lesson:** Auth.js (v5) uses httpOnly cookies by default for security. This is correct behavior and should not be changed.

**Impact:** None - understood during investigation.

---

## L2: Railway Environment Variables

**What Happened:** Google OAuth failed because environment variables were not set in Railway.

**Lesson:** Always verify environment variables are set in Railway dashboard before testing OAuth features. Use `railway variables` to check.

**Action:** Add to pre-deployment checklist: "Verify all required env vars are set"

---

## L3: Scope Changes Must Be Documented

**What Happened:** Google OAuth was missed in original sprint scope, required mid-sprint scope change.

**Lesson:** Create formal scope change documentation (escalations/) when adding features mid-sprint.

**Action:** Scope change process documented in escalations/scope-change-google-oauth.md

---

## L4: UAT Must Test Deployed URL

**What Happened:** Local testing passed but Railway deployment had different behavior.

**Lesson:** Always UAT on deployed Railway URL, never just localhost.

**Impact:** This is already in dev_role.md but reinforced by this sprint.

---

## L5: test-dashboard.html Pattern for Debugging

**What Happened:** Created test-dashboard.html to isolate authentication behavior from dashboard.tsx complexity.

**Lesson:** Simple static HTML pages are effective for isolating bugs. They remove framework complexity and allow direct observation of API behavior.

**Pattern to Reuse:**
```html
<!-- Test page that directly calls API without framework abstractions -->
<script>
fetch('/api/auth/me')
  .then(r => r.json())
  .then(data => console.log(data));
</script>
```

---

## L6: Browser DevTools Limitations

**What Happened:** Attempting to debug session cookies in browser DevTools.

**Lesson:** HttpOnly cookies appear in DevTools (Application > Cookies) but are NOT accessible via `document.cookie` in JavaScript. This is expected secure behavior.

---

## L7: Auth.js Session Endpoints

**What Happened:** Confusion about which endpoint to use for checking authentication.

**Lesson:**
- `/api/auth/session` - Auth.js built-in endpoint (shows raw session data)
- `/api/auth/me` - Custom endpoint (returns user data from database)

Both can be used, but `/api/auth/me` is preferred for this codebase as it returns the actual user record.

---

## L8: Multiple OAuth Providers

**What Happened:** Both Google OAuth and email/password auth needed to work together.

**Lesson:** Auth.js supports multiple providers simultaneously. The session endpoint works for both - it returns session data regardless of which provider was used for login.

---

## L9: HttpOnly Cookies Are NOT Visible to Client-Side JavaScript (CRITICAL)

**Date:** 2026-01-21

**What Happened:**
The codebase included a `hasSessionCookie()` function that attempted to check for session cookies using `document.cookie`:

```javascript
function hasSessionCookie(): boolean {
  if (typeof document === 'undefined') return false;
  return document.cookie.split(';').some(c => c.trim().startsWith('session='));
}
```

This function ALWAYS returned `false` for authenticated users because:
1. Auth.js sets session cookies with `httpOnly: true`
2. HttpOnly cookies are designed to be invisible to JavaScript
3. `document.cookie` cannot access HttpOnly cookies by design

**Why HttpOnly Exists:**
HttpOnly is a SECURITY FEATURE. It prevents Cross-Site Scripting (XSS) attacks from stealing session tokens. If malicious JavaScript runs on your page, it cannot read your session cookie.

**Correct Pattern:**
```javascript
// WRONG - will not work with httpOnly cookies
if (!hasSessionCookie()) {
  return; // Skip API call
}

// CORRECT - always call server, server can read httpOnly cookies
const response = await fetch('/api/auth/me');
if (response.ok) {
  const data = await response.json();
  setUser(data.user);
} else {
  // 401 = not authenticated
  redirectToLogin();
}
```

**Key Insight:**
The server CAN read HttpOnly cookies because they are sent with every HTTP request. The client JavaScript CANNOT read them directly, but that's okay - just make the API call and let the server tell you if the user is authenticated.

**Action Required:**
Remove `hasSessionCookie()` from:
- `app/page.tsx`
- `app/dashboard/page.tsx`

Replace with unconditional API calls that trust the server response.

---

## Summary Table

| # | Lesson | Category | Severity |
|---|--------|----------|----------|
| L1 | Auth.js uses httpOnly cookies | Understanding | Low |
| L2 | Verify Railway env vars | Process | Medium |
| L3 | Document scope changes | Process | Medium |
| L4 | UAT on deployed URL | Process | High |
| L5 | Use test pages for debugging | Technique | Low |
| L6 | DevTools shows but JS can't read httpOnly | Understanding | Medium |
| L7 | Know Auth.js session endpoints | Understanding | Low |
| L8 | Multiple providers work together | Understanding | Low |
| L9 | Never check httpOnly cookies with document.cookie | **CRITICAL** | **High** |

---

## Application to Future Sprints

1. **Session Management:** Never attempt to read session cookies client-side. Always call server API.
2. **OAuth Setup:** Add environment variable verification to deployment checklist.
3. **Debugging:** Create isolated test pages when debugging complex issues.
4. **Scope:** Formalize scope changes before implementing.
