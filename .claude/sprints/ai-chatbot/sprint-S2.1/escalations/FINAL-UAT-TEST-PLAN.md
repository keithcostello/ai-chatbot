# Final UAT Test Plan - Sprint S2.1

**Sprint:** S2.1 - User Authentication
**Date:** 2026-01-21
**Environment:** https://steertrue-chat-dev-sandbox.up.railway.app
**Tester:** [Name]

---

## Prerequisites

1. Use a modern browser (Chrome, Firefox, Safari, Edge)
2. Clear cookies for the domain before testing (fresh session)
3. Have a Google account available for OAuth testing

---

## Test 1: Email/Password Signup

**Steps:**
1. Navigate to https://steertrue-chat-dev-sandbox.up.railway.app/signup
2. Enter a NEW email address (not previously registered)
3. Enter a password (minimum 8 characters)
4. Confirm the password
5. Click "Sign Up"

**Expected Result:**
- Success message appears: "Account created successfully!"
- Link to login page is displayed

**Pass/Fail:** [ ]

**Notes:**
```

```

---

## Test 2: Email/Password Login

**Steps:**
1. Navigate to https://steertrue-chat-dev-sandbox.up.railway.app/login
2. Enter the email from Test 1 (or use: `test@example.com` / `TestPass1234`)
3. Enter the password
4. Click "Log In"

**Expected Result:**
- Redirected to dashboard
- Dashboard displays your email address
- "Sign Out" button is visible

**Pass/Fail:** [ ]

**Notes:**
```

```

---

## Test 3: Invalid Credentials

**Steps:**
1. Navigate to https://steertrue-chat-dev-sandbox.up.railway.app/login
2. Enter an invalid email or wrong password
3. Click "Log In"

**Expected Result:**
- Error message appears: "Invalid email or password"
- User remains on login page
- No specific information about whether email exists (security)

**Pass/Fail:** [ ]

**Notes:**
```

```

---

## Test 4: Google OAuth Login

**Steps:**
1. Sign out if logged in (or clear cookies)
2. Navigate to https://steertrue-chat-dev-sandbox.up.railway.app/login
3. Click "Sign in with Google"
4. Complete Google authentication (select account, authorize)

**Expected Result:**
- Redirected to Google consent screen
- After authorization, redirected back to dashboard
- Dashboard displays your Google email and name
- "Sign Out" button is visible

**Pass/Fail:** [ ]

**Notes:**
```

```

---

## Test 5: Session Persistence

**Steps:**
1. Log in using either method (email/password or Google)
2. Verify you're on the dashboard
3. Press F5 (hard refresh) or close and reopen the browser tab
4. Navigate back to the site

**Expected Result:**
- Still logged in after refresh
- Dashboard still shows your information
- No need to log in again

**Pass/Fail:** [ ]

**Notes:**
```

```

---

## Test 6: Sign Out

**Steps:**
1. While logged in on dashboard
2. Click "Sign Out" button

**Expected Result:**
- Redirected to home page
- No longer shows user information
- Visiting /dashboard redirects to /login

**Pass/Fail:** [ ]

**Notes:**
```

```

---

## Test 7: Protected Route

**Steps:**
1. Sign out if logged in
2. Try to navigate directly to https://steertrue-chat-dev-sandbox.up.railway.app/dashboard

**Expected Result:**
- Redirected to /login page
- Cannot access dashboard without authentication

**Pass/Fail:** [ ]

**Notes:**
```

```

---

## Test 8: Google OAuth Signup (New User)

**Steps:**
1. Clear all cookies for the domain
2. Navigate to https://steertrue-chat-dev-sandbox.up.railway.app/signup
3. Click "Sign up with Google"
4. Use a Google account that has NOT been used before on this site

**Expected Result:**
- Google OAuth flow completes
- New user account created automatically
- Redirected to dashboard with Google email/name displayed

**Pass/Fail:** [ ]

**Notes:**
```

```

---

## Summary

| Test | Description | Pass/Fail |
|------|-------------|-----------|
| 1 | Email/Password Signup | [ ] |
| 2 | Email/Password Login | [ ] |
| 3 | Invalid Credentials | [ ] |
| 4 | Google OAuth Login | [ ] |
| 5 | Session Persistence | [ ] |
| 6 | Sign Out | [ ] |
| 7 | Protected Route | [ ] |
| 8 | Google OAuth Signup | [ ] |

**Overall Result:** [ ] PASS / [ ] FAIL

**Tester Signature:** _______________________

**Date:** _______________________

---

## Known Test Account

For convenience, this account exists in the database:
- **Email:** test@example.com
- **Password:** TestPass1234

---

## Issue Reporting

If any test fails, document:
1. Which test failed
2. Expected behavior vs actual behavior
3. Screenshot (if applicable)
4. Browser console errors (F12 → Console tab)
5. Network requests (F12 → Network tab)

Report issues to the development team with this information.

---

**END OF UAT TEST PLAN**
