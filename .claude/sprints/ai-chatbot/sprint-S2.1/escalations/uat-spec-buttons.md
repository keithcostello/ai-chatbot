# UAT Specification: Home Page Navigation

**Sprint:** S2.1
**Created:** 2026-01-21
**Status:** BLOCKING - 3 UAT failures reported by user
**Priority:** CRITICAL

---

## PM Investigation Summary

### Root Cause Analysis

**FINDING:** The home page is stuck in a permanent "Loading..." state.

**Evidence from PM curl test (2026-01-21T19:24:11Z):**

```bash
curl -s https://steertrue-chat-dev-sandbox.up.railway.app/
```

**Actual HTML returned:**
```html
<div class="min-h-screen flex items-center justify-center bg-[#f8f4ed]">
  <div class="text-[#1e3a3a]">Loading...</div>
</div>
```

The buttons ("Get Started", "Log In") are **NEVER RENDERED** because the page never exits the loading state.

### Why This Happens

Looking at `app/page.tsx`:

1. Line 1: `'use client'` - This is a client-side rendered component
2. Line 18: `const [isLoading, setIsLoading] = useState(true);` - Starts in loading state
3. Lines 20-37: `useEffect()` calls `/api/auth/me` to check authentication
4. Lines 51-57: If `isLoading` is true, returns only the "Loading..." div
5. Lines 103-118: The actual buttons are only rendered AFTER loading completes

**The problem:** The client-side JavaScript is either:
- Not executing at all (hydration failure)
- Failing silently during the `/api/auth/me` fetch
- The `finally` block (line 33) is never reached

### Server-Side Verification (No Redirect Issue)

PM verified that `/login` and `/signup` routes are NOT redirecting:

```bash
curl -I https://steertrue-chat-dev-sandbox.up.railway.app/login
# Response: HTTP/1.1 200 OK

curl -I https://steertrue-chat-dev-sandbox.up.railway.app/signup
# Response: HTTP/1.1 200 OK
```

Both pages return HTTP 200 with full form HTML. The middleware is working correctly.

---

## Pre-requisites

Before any UAT testing, DEV must verify:

- [ ] **P1:** Build completes without errors: `npm run build`
- [ ] **P2:** No TypeScript errors: `npx tsc --noEmit`
- [ ] **P3:** Deployment confirmed on Railway with commit SHA from `dev-sprint-S2.1`
- [ ] **P4:** Railway logs show no runtime errors: `railway logs -n 100`
- [ ] **P5:** Browser console shows no JavaScript errors when loading home page

---

## Test Case 1: Home Page Renders (Not Stuck on Loading)

**Objective:** Verify the home page exits loading state and shows buttons

**Steps:**
1. Open a fresh browser incognito window (no cached state)
2. Navigate to `https://steertrue-chat-dev-sandbox.up.railway.app/`
3. Wait up to 10 seconds for page to fully load
4. Verify page shows "SteerTrue" title, logo, and TWO buttons

**Evidence Required:**
- [ ] Screenshot showing URL bar at `/`
- [ ] Screenshot showing "Get Started" button visible
- [ ] Screenshot showing "Log In" button visible
- [ ] Browser console screenshot showing NO JavaScript errors
- [ ] agent-browser command output: `agent-browser open https://steertrue-chat-dev-sandbox.up.railway.app/`
- [ ] agent-browser snapshot showing the buttons

**Pass Criteria:**
- Page does NOT show "Loading..." after 5 seconds
- "Get Started" button is visible
- "Log In" button is visible
- No console errors related to hydration or fetch failures

**Fail Criteria:**
- Page stuck on "Loading..."
- Console shows JavaScript errors
- Buttons are never visible

---

## Test Case 2: Get Started Button Navigation

**Objective:** Verify clicking "Get Started" navigates to `/signup`

**Pre-condition:** Test Case 1 must pass first

**Steps:**
1. On home page, locate "Get Started" button
2. Click the button
3. Verify URL changes to `/signup`
4. Verify signup form is displayed

**Evidence Required:**
- [ ] Screenshot BEFORE click (showing URL bar at `/`)
- [ ] Screenshot AFTER click (showing URL bar at `/signup`)
- [ ] Screenshot showing signup form ("Create Account" title)
- [ ] agent-browser commands:
  ```
  agent-browser open https://steertrue-chat-dev-sandbox.up.railway.app/
  agent-browser click "Get Started"
  agent-browser snapshot
  ```

**Pass Criteria:**
- URL changes from `/` to `/signup`
- Signup form is visible with "Create Account" heading
- Email, password, confirm password fields visible
- Navigation happens within 2 seconds of click

**Fail Criteria:**
- Button click does nothing
- URL does not change
- Page redirects back to `/`
- Console error on click

---

## Test Case 3: Log In Button Navigation

**Objective:** Verify clicking "Log In" navigates to `/login`

**Pre-condition:** Test Case 1 must pass first

**Steps:**
1. On home page, locate "Log In" button
2. Click the button
3. Verify URL changes to `/login`
4. Verify login form is displayed

**Evidence Required:**
- [ ] Screenshot BEFORE click (showing URL bar at `/`)
- [ ] Screenshot AFTER click (showing URL bar at `/login`)
- [ ] Screenshot showing login form ("Welcome Back" title)
- [ ] agent-browser commands:
  ```
  agent-browser open https://steertrue-chat-dev-sandbox.up.railway.app/
  agent-browser click "Log In"
  agent-browser snapshot
  ```

**Pass Criteria:**
- URL changes from `/` to `/login`
- Login form is visible with "Welcome Back" heading
- Email and password fields visible
- Navigation happens within 2 seconds of click

**Fail Criteria:**
- Button click does nothing
- URL does not change
- Page redirects back to `/`
- Console error on click

---

## Test Case 4: Direct URL Access to /login

**Objective:** Verify navigating directly to `/login` shows login form

**Steps:**
1. Open new browser tab
2. Navigate directly to `https://steertrue-chat-dev-sandbox.up.railway.app/login`
3. Verify login form displays (not redirected to `/`)

**Evidence Required:**
- [ ] Screenshot showing URL bar at `/login`
- [ ] Screenshot showing login form visible
- [ ] curl output: `curl -I https://steertrue-chat-dev-sandbox.up.railway.app/login` (must show 200, not 307)

**Pass Criteria:**
- URL remains `/login` (no redirect)
- Login form is visible
- HTTP response is 200 OK

**Fail Criteria:**
- Redirects to `/`
- Shows home page instead of login form
- HTTP 307 redirect response

---

## Test Case 5: Direct URL Access to /signup

**Objective:** Verify navigating directly to `/signup` shows signup form

**Steps:**
1. Open new browser tab
2. Navigate directly to `https://steertrue-chat-dev-sandbox.up.railway.app/signup`
3. Verify signup form displays (not redirected to `/`)

**Evidence Required:**
- [ ] Screenshot showing URL bar at `/signup`
- [ ] Screenshot showing signup form visible
- [ ] curl output: `curl -I https://steertrue-chat-dev-sandbox.up.railway.app/signup` (must show 200, not 307)

**Pass Criteria:**
- URL remains `/signup` (no redirect)
- Signup form is visible
- HTTP response is 200 OK

**Fail Criteria:**
- Redirects to `/`
- Shows home page instead of signup form
- HTTP 307 redirect response

---

## Test Case 6: JavaScript Hydration Verification

**Objective:** Verify React client-side hydration completes successfully

**Steps:**
1. Open home page in browser
2. Open browser DevTools (F12)
3. Check Console tab for any errors
4. Check Network tab that all JS chunks loaded (200 status)
5. Verify React has hydrated (page interactive)

**Evidence Required:**
- [ ] Console tab screenshot showing no red errors
- [ ] Network tab screenshot showing all .js files loaded successfully
- [ ] Screenshot showing page is interactive (not just "Loading...")

**Pass Criteria:**
- No console errors
- All JavaScript chunks return 200
- Page renders interactive content within 5 seconds

**Fail Criteria:**
- Console shows hydration errors
- JavaScript files return 4xx/5xx errors
- Page stuck on "Loading..."

---

## Verification Method (PM Independent Check)

PM will independently verify DEV's claims using:

### 1. curl Header Verification
```bash
# Must all return HTTP 200, NOT 307 redirect
curl -I https://steertrue-chat-dev-sandbox.up.railway.app/
curl -I https://steertrue-chat-dev-sandbox.up.railway.app/login
curl -I https://steertrue-chat-dev-sandbox.up.railway.app/signup
```

### 2. HTML Content Verification
```bash
# Home page MUST NOT contain "Loading..." as only visible content
curl -s https://steertrue-chat-dev-sandbox.up.railway.app/ | grep -o "Loading\.\.\."

# If the above returns "Loading..." the page is broken
# After fix, page should contain href="/signup" and href="/login"
curl -s https://steertrue-chat-dev-sandbox.up.railway.app/ | grep -E 'href="/signup"|href="/login"'
```

### 3. agent-browser Verification (PM will run same commands)
```
agent-browser open https://steertrue-chat-dev-sandbox.up.railway.app/
agent-browser wait 5
agent-browser snapshot
# PM compares snapshot to DEV snapshot
```

---

## Summary of Required Fix

**The Problem:** Home page uses `'use client'` and `useState(true)` for `isLoading`, meaning the server-rendered HTML only shows "Loading...". The client-side JavaScript must execute to render the actual content.

**Possible Causes to Investigate:**
1. JavaScript hydration failure
2. `/api/auth/me` fetch never completing (network issue)
3. Error in `useEffect` silently failing
4. CORS or network security blocking the fetch
5. Edge caching serving stale pre-rendered HTML

**Potential Fixes to Consider:**
1. Add error boundary to catch and display errors
2. Add timeout to loading state
3. Consider server-side rendering for public landing page
4. Add fallback content if JavaScript fails to load
5. Check Railway build logs for issues

---

## Approval Criteria

**ALL test cases must pass for UAT approval:**

| Test Case | Description | Required |
|-----------|-------------|----------|
| TC1 | Home page renders (not loading) | MUST PASS |
| TC2 | Get Started button works | MUST PASS |
| TC3 | Log In button works | MUST PASS |
| TC4 | Direct /login access works | MUST PASS |
| TC5 | Direct /signup access works | MUST PASS |
| TC6 | JavaScript hydration works | MUST PASS |

**Evidence Requirements:**
- Screenshots must show URL bar
- agent-browser snapshots required for each test
- Console screenshots required for TC6
- PM will run independent verification before approval

---

## RELAY TO DEV

DEV must:
1. Investigate why home page is stuck on "Loading..."
2. Fix the root cause (likely JavaScript hydration or fetch issue)
3. Redeploy to Railway
4. Complete ALL 6 test cases with required evidence
5. Submit Checkpoint-5 with screenshots and agent-browser output

**DO NOT submit checkpoint without:**
- Screenshots showing buttons VISIBLE (not "Loading...")
- agent-browser snapshot showing buttons
- Console screenshot showing NO errors
- Evidence of clicking buttons and navigating

**Previous DEV claims that "buttons work" without this evidence will be REJECTED.**

---

*Generated by PM Agent - Sprint S2.1*
*Timestamp: 2026-01-21T19:25:00Z*
