# Comprehensive Test Plan - Sprint S2.1

**Date:** 2026-01-21
**Purpose:** Test plan that PROVES functionality works, not just endpoints respond

---

## PREREQUISITES

### Tool Requirements

```bash
# agent-browser must be installed
agent-browser --version

# If not installed:
npm install -g agent-browser
agent-browser install
```

### Fresh State Requirement

Before each test session:
1. Clear all cookies for `steertrue-chat-dev-sandbox.up.railway.app`
2. Clear localStorage/sessionStorage
3. Close and reopen browser
4. Verify no cached state

---

## PART 1: Infrastructure Verification

### T1.1: Health Check

**Command:**
```bash
curl -s https://steertrue-chat-dev-sandbox.up.railway.app/api/health
```

**Expected Response:**
```json
{"status":"ok","timestamp":"[ISO timestamp]"}
```

**Pass Criteria:**
- HTTP 200 OK
- JSON contains `status: "ok"`

---

### T1.2: Railway Logs Check

**Command:**
```bash
railway logs --tail 50
```

**Pass Criteria:**
- No errors in last 50 lines
- Shows "Ready in Xms"
- No "TypeError", "Error:", or stack traces

**Document Output:** [paste last 10 lines]

---

## PART 2: Home Page Verification

### T2.1: Home Page Load (Fresh Session)

**Commands:**
```bash
agent-browser open https://steertrue-chat-dev-sandbox.up.railway.app/
agent-browser snapshot
agent-browser screenshot home-fresh.png
```

**Expected Snapshot Elements:**
```
- img "SteerTrue Logo"
- heading "SteerTrue" [level=1]
- paragraph "SteerTrue, Stay True."
- link "Get Started" -> /signup
- link "Log In" -> /login
```

**Pass Criteria:**
- Logo image visible
- Heading "SteerTrue" visible
- Tagline "SteerTrue, Stay True." visible
- "Get Started" button visible
- "Log In" button visible
- NO "Loading..." text

---

### T2.2: Get Started Button Works

**Commands:**
```bash
agent-browser open https://steertrue-chat-dev-sandbox.up.railway.app/
agent-browser click "Get Started"
agent-browser wait 2000
agent-browser snapshot
agent-browser screenshot after-get-started.png
```

**Pass Criteria:**
- URL changed to `/signup`
- Signup form visible
- No JavaScript errors

---

### T2.3: Log In Button Works

**Commands:**
```bash
agent-browser open https://steertrue-chat-dev-sandbox.up.railway.app/
agent-browser click "Log In"
agent-browser wait 2000
agent-browser snapshot
agent-browser screenshot after-login-click.png
```

**Pass Criteria:**
- URL changed to `/login`
- Login form visible
- No JavaScript errors

---

### T2.4: Console Error Check (Home Page)

**Manual Steps:**
1. Open browser DevTools (F12)
2. Go to Console tab
3. Clear console
4. Navigate to https://steertrue-chat-dev-sandbox.up.railway.app/
5. Wait for page load
6. Document any errors

**Pass Criteria:**
- No red errors in console
- 401 from `/api/auth/me` is acceptable (expected when not logged in)
- No JavaScript exceptions

**Document Output:** [list any console messages]

---

## PART 3: Email Authentication Flow

### T3.1: Signup Form Submission

**Commands:**
```bash
agent-browser open https://steertrue-chat-dev-sandbox.up.railway.app/signup
agent-browser snapshot
agent-browser fill "Email" "test-comprehensive-$(date +%s)@example.com"
agent-browser fill "Password" "TestPass123!"
agent-browser fill "Confirm Password" "TestPass123!"
agent-browser screenshot signup-filled.png
agent-browser click "Sign Up"
agent-browser wait 3000
agent-browser snapshot
agent-browser screenshot signup-result.png
```

**Pass Criteria:**
- Form accepts input
- Submit button works
- Success message appears OR redirect to login

---

### T3.2: Login Form Submission

**Commands:**
```bash
agent-browser open https://steertrue-chat-dev-sandbox.up.railway.app/login
agent-browser snapshot
agent-browser fill "Email" "test-phase3@example.com"
agent-browser fill "Password" "testpass123"
agent-browser screenshot login-filled.png
agent-browser click "Log In"
agent-browser wait 3000
agent-browser snapshot
agent-browser screenshot login-result.png
```

**Pass Criteria:**
- Form accepts input
- Submit button works
- Redirects to home page
- Shows logged-in state (user email, Log Out button)

---

### T3.3: Logged-In State Verification

After successful login:

**Commands:**
```bash
agent-browser snapshot
```

**Expected Elements:**
```
- text showing user email
- button "Log Out"
- text "Welcome back, [name or email]"
```

**Pass Criteria:**
- User email displayed
- Log Out button visible
- No "Get Started" or "Log In" buttons (those are for logged-out state)

---

### T3.4: Logout Flow

**Commands:**
```bash
agent-browser click "Log Out"
agent-browser wait 2000
agent-browser snapshot
agent-browser screenshot after-logout.png
```

**Pass Criteria:**
- Returns to logged-out state
- "Get Started" and "Log In" buttons visible again
- No user email displayed

---

### T3.5: Invalid Credentials

**Commands:**
```bash
agent-browser open https://steertrue-chat-dev-sandbox.up.railway.app/login
agent-browser fill "Email" "nonexistent@example.com"
agent-browser fill "Password" "wrongpassword"
agent-browser click "Log In"
agent-browser wait 2000
agent-browser screenshot login-invalid.png
```

**Pass Criteria:**
- Shows error message
- Error message is GENERIC ("Invalid credentials")
- Does NOT say "user not found" or "wrong password" (prevents enumeration)

---

## PART 4: Google OAuth Flow

### T4.1: OAuth Button Present (Signup)

**Commands:**
```bash
agent-browser open https://steertrue-chat-dev-sandbox.up.railway.app/signup
agent-browser snapshot
```

**Pass Criteria:**
- Button "Sign up with Google" visible
- Button has Google logo icon

---

### T4.2: OAuth Button Present (Login)

**Commands:**
```bash
agent-browser open https://steertrue-chat-dev-sandbox.up.railway.app/login
agent-browser snapshot
```

**Pass Criteria:**
- Button "Sign in with Google" visible
- Button has Google logo icon

---

### T4.3: OAuth Click (Manual Test)

**Manual Steps:**
1. Navigate to https://steertrue-chat-dev-sandbox.up.railway.app/login
2. Open Network tab in DevTools
3. Click "Sign in with Google"
4. Document where browser redirects

**Pass Criteria:**
- Browser redirects to accounts.google.com
- NOT redirected to /login or error page
- Network tab shows 302 redirect to Google

**Document:**
- Final URL after click: [URL]
- Any error messages: [none/list]

---

### T4.4: OAuth Complete Flow (Manual Test)

**Manual Steps:**
1. Complete T4.3 (click Google sign in)
2. Complete Google authentication
3. Authorize the application
4. Document where Google redirects you

**Pass Criteria:**
- Redirected back to app
- URL is `/` or `/api/auth/callback/google` briefly
- NOT stuck on error page
- Shows logged-in state with Google email

**Document:**
- Post-OAuth URL: [URL]
- User displayed: [email/name]
- Any errors: [none/list]

---

### T4.5: Post-OAuth State Verification

After completing OAuth:

**Commands:**
```bash
agent-browser snapshot
agent-browser screenshot post-oauth.png
```

**Pass Criteria:**
- Logged-in state displayed
- User email/name from Google account shown
- Log Out button visible

---

### T4.6: Post-OAuth Button Test

CRITICAL TEST - This is what failed before.

After completing OAuth:

**Commands:**
```bash
# First verify we're logged in
agent-browser snapshot

# Now click Log Out
agent-browser click "Log Out"
agent-browser wait 2000
agent-browser snapshot
agent-browser screenshot post-oauth-logout.png

# Now verify buttons work
agent-browser click "Log In"
agent-browser wait 2000
agent-browser snapshot
```

**Pass Criteria:**
- Log Out successfully logs out
- "Log In" button works after logout
- NOT broken/unresponsive

---

## PART 5: Session Persistence

### T5.1: Cookie Security

**Command:**
```bash
curl -i -X POST https://steertrue-chat-dev-sandbox.up.railway.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test-phase3@example.com","password":"testpass123"}'
```

**Pass Criteria in Set-Cookie header:**
- `Secure` present
- `HttpOnly` present
- `SameSite=strict` present

---

### T5.2: Session Survives Reload

**Manual Steps:**
1. Log in successfully
2. Verify logged-in state
3. Press F5 (hard refresh)
4. Verify still logged in

**Pass Criteria:**
- Still shows logged-in state after refresh
- User email still displayed
- Did not return to logged-out state

---

### T5.3: Session Survives Tab Close

**Manual Steps:**
1. Log in successfully
2. Close browser tab (not window)
3. Open new tab
4. Navigate to app URL
5. Verify logged-in state

**Pass Criteria:**
- Still logged in
- Session persisted across tabs

---

## PART 6: Error State Recovery

### T6.1: Clear Cookies Recovery

**Manual Steps:**
1. Attempt OAuth flow (even if it fails)
2. Note any broken state
3. Clear all cookies for domain
4. Navigate to home page
5. Verify buttons work

**Pass Criteria:**
- After clearing cookies, app works normally
- Buttons are responsive
- No lingering broken state

---

### T6.2: Console Errors During Flow

**Manual Steps:**
1. Open DevTools Console
2. Clear console
3. Navigate to home page
4. Click each button
5. Attempt login
6. Attempt OAuth
7. Document ALL console errors

**Pass Criteria:**
- No unexpected JavaScript errors
- 401 from `/api/auth/me` when not logged in is acceptable
- No "Failed to fetch" errors (except expected 401)

---

## VERIFICATION MATRIX

| Test ID | Test Name | Pass Criteria | Result |
|---------|-----------|---------------|--------|
| T1.1 | Health Check | 200 + status:ok | |
| T1.2 | Railway Logs | No errors | |
| T2.1 | Home Page Load | All elements visible | |
| T2.2 | Get Started Button | Navigates to /signup | |
| T2.3 | Log In Button | Navigates to /login | |
| T2.4 | Console Errors | No errors | |
| T3.1 | Signup Submit | Creates account | |
| T3.2 | Login Submit | Logs in | |
| T3.3 | Logged-In State | Shows user info | |
| T3.4 | Logout | Returns to guest | |
| T3.5 | Invalid Credentials | Generic error | |
| T4.1 | OAuth Button (Signup) | Button visible | |
| T4.2 | OAuth Button (Login) | Button visible | |
| T4.3 | OAuth Click | Redirects to Google | |
| T4.4 | OAuth Complete | Returns logged in | |
| T4.5 | Post-OAuth State | Correct state | |
| T4.6 | Post-OAuth Buttons | Still work | |
| T5.1 | Cookie Security | All flags present | |
| T5.2 | Session Reload | Persists | |
| T5.3 | Session Tab Close | Persists | |
| T6.1 | Cookie Clear Recovery | App recovers | |
| T6.2 | Console Errors | Documented | |

---

## EVIDENCE REQUIREMENTS

For each test, document:

```markdown
## Test [ID]: [Name]

**Date/Time:** [timestamp]
**Tester:** [DEV/PM/Human]

**Commands Run:**
[paste actual commands]

**Output:**
[paste actual output]

**Screenshot:** [path if applicable]

**Result:** PASS / FAIL

**If FAIL:**
- Error message: [exact text]
- Console errors: [list]
- Expected vs Actual: [description]
```

---

## PASS THRESHOLD

- ALL T1.x tests must pass (infrastructure)
- ALL T2.x tests must pass (home page)
- ALL T3.x tests must pass (email auth)
- T4.1, T4.2 must pass (OAuth buttons present)
- T4.3-T4.6: Document results (OAuth may require valid credentials)
- ALL T5.x tests must pass (sessions)
- ALL T6.x tests must pass (recovery)

**Overall Pass:** 19/22 tests (86%) with all critical tests passing

---

**END OF COMPREHENSIVE TEST PLAN**
