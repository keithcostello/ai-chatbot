# Human UAT Test Plan - Sprint S2.1 (Full)

**Sprint:** S2.1 - User Authentication (Email + Google OAuth)
**Environment:** https://steertrue-chat-dev-sandbox.up.railway.app
**Date:** 2026-01-21

---

## PART A: Email/Password Authentication

### Test A1: Signup with Email

1. Navigate to: https://steertrue-chat-dev-sandbox.up.railway.app/signup
2. Enter email: `uat-test-[timestamp]@example.com`
3. Enter password: `TestPass123!`
4. Enter confirm password: `TestPass123!`
5. Click "Sign Up"

**Pass Criteria:** Success message shown, user created

---

### Test A2: Login with Email

1. Navigate to: https://steertrue-chat-dev-sandbox.up.railway.app/login
2. Enter email from Test A1
3. Enter password: `TestPass123!`
4. Click "Sign In"

**Pass Criteria:** Redirected to dashboard, shows logged-in state

---

### Test A3: Invalid Credentials

1. Navigate to login page
2. Enter email: `nonexistent@example.com`
3. Enter password: `wrongpassword`
4. Click "Sign In"

**Pass Criteria:** Shows "Invalid credentials" (generic error)

---

### Test A4: Logout

1. From logged-in state, click "Logout" button

**Pass Criteria:** Redirected to login page, session cleared

---

## PART B: Google OAuth Authentication

### Test B1: Sign In with Google (New User)

1. Navigate to: https://steertrue-chat-dev-sandbox.up.railway.app/login
2. Click "Sign in with Google" button
3. Google consent screen appears
4. Select your Google account
5. Authorize the app

**Pass Criteria:**
- Redirected back to app
- Shows logged-in state with Google email
- User created in database

---

### Test B2: Sign Up with Google

1. Log out if logged in
2. Navigate to: https://steertrue-chat-dev-sandbox.up.railway.app/signup
3. Click "Sign up with Google" button
4. Complete Google consent flow

**Pass Criteria:**
- Same behavior as B1
- User created/linked in database

---

### Test B3: Google OAuth Redirect

1. Click "Sign in with Google"
2. Observe URL changes

**Pass Criteria:**
- Redirects to accounts.google.com
- Shows SteerTrue Chat app name
- Shows requested permissions (email, profile)

---

## PART C: Session & Security

### Test C1: Session Persistence

1. Log in (email or Google)
2. Close browser tab
3. Open new tab, navigate to app

**Pass Criteria:** Still logged in (session persisted)

---

### Test C2: Cookie Security

1. Log in via email
2. Open browser DevTools → Network tab
3. Find the login request
4. Check Set-Cookie header

**Pass Criteria:** Cookie has `HttpOnly`, `Secure`, `SameSite=strict`

---

## Success Criteria Summary

| SC | Description | Test |
|----|-------------|------|
| SC-1 | Signup with email | A1 |
| SC-4 | Login with email | A2 |
| SC-5 | Generic error | A3 |
| SC-6 | Secure cookies | C2 |
| SC-11 | Google OAuth sign-in | B1, B3 |
| SC-12 | Google creates user | B1, B2 |

---

## Human Instructions

1. Run tests A1-A4 for email authentication
2. Run tests B1-B3 for Google OAuth
3. Run tests C1-C2 for session/security
4. Document any failures

**Approve:** `Sprint-S2.1 UAT: PASS`
**Reject:** `Sprint-S2.1 UAT: FAIL - [reason]`
