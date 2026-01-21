# Human UAT Test Plan - Sprint S2.1

**Sprint:** S2.1 - User Authentication
**Environment:** https://steertrue-chat-dev-sandbox.up.railway.app
**Date:** 2026-01-21

---

## Prerequisites

- agent-browser installed: `npm install -g agent-browser && agent-browser install`
- Test user exists: `test-phase3@example.com` / `testpass123`

---

## Test 1: Signup Form UI

```bash
# Navigate to signup page
agent-browser open https://steertrue-chat-dev-sandbox.up.railway.app/signup

# Get snapshot
agent-browser snapshot --interactive

# Take screenshot
agent-browser screenshot signup-page.png
```

**Pass Criteria:**
- Page loads with branded split layout (dark green left, cream right)
- Form has email, password, confirm password fields
- "Sign Up" button visible

---

## Test 2: Signup Validation

```bash
# Fill with mismatched passwords
agent-browser fill "[name=email]" "newuser@example.com"
agent-browser fill "[name=password]" "password123"
agent-browser fill "[name=confirmPassword]" "differentpassword"
agent-browser click "button[type=submit]"

# Screenshot error state
agent-browser screenshot signup-validation-error.png
```

**Pass Criteria:**
- Form shows validation error for password mismatch

---

## Test 3: Login Form UI

```bash
# Navigate to login page
agent-browser open https://steertrue-chat-dev-sandbox.up.railway.app/login

# Get snapshot
agent-browser snapshot --interactive

# Take screenshot
agent-browser screenshot login-page.png
```

**Pass Criteria:**
- Page loads with branded layout matching signup
- Form has email, password fields
- "Sign In" button visible
- Link to signup page visible

---

## Test 4: Login with Valid Credentials

```bash
# Fill login form
agent-browser fill "[name=email]" "test-phase3@example.com"
agent-browser fill "[name=password]" "testpass123"
agent-browser click "button[type=submit]"

# Wait for redirect
sleep 2
agent-browser url

# Screenshot dashboard
agent-browser screenshot login-success-dashboard.png
```

**Pass Criteria:**
- Redirects to / (home/dashboard)
- Shows logged-in state with logout button

---

## Test 5: Login with Invalid Credentials

```bash
agent-browser open https://steertrue-chat-dev-sandbox.up.railway.app/login
agent-browser fill "[name=email]" "test-phase3@example.com"
agent-browser fill "[name=password]" "wrongpassword"
agent-browser click "button[type=submit]"

# Screenshot error
agent-browser screenshot login-error.png
```

**Pass Criteria:**
- Shows "Invalid credentials" error (generic, not "wrong password")

---

## Test 6: Session Persistence (Cookie Verification)

```bash
# Login and capture cookie
curl -i -X POST https://steertrue-chat-dev-sandbox.up.railway.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test-phase3@example.com","password":"testpass123"}'
```

**Pass Criteria:**
- Set-Cookie header shows: `Secure; HttpOnly; SameSite=strict`

---

## Test 7: Logout

```bash
# From logged-in state
agent-browser open https://steertrue-chat-dev-sandbox.up.railway.app
agent-browser click "button:has-text('Logout')"

# Verify redirect
agent-browser url
agent-browser screenshot logout-success.png
```

**Pass Criteria:**
- Redirects to /login
- No longer shows authenticated state

---

## Success Criteria Summary

| SC | Description | Test |
|----|-------------|------|
| SC-1 | User can sign up | Test 2 (validation) + manual |
| SC-4 | User can log in | Test 4 |
| SC-5 | Generic error (no enumeration) | Test 5 |
| SC-6 | Secure cookie flags | Test 6 |
| SC-8 | Brand design matches | Test 1, 3 |
| SC-9 | Deployed to Railway | All tests use Railway URL |

---

## Human Instructions

1. Run each test command in sequence
2. Compare screenshots to pass criteria
3. Check console for errors: `agent-browser console`

**Approve:** `Sprint-S2.1 UAT: PASS`
**Reject:** `Sprint-S2.1 UAT: FAIL - [reason]`
