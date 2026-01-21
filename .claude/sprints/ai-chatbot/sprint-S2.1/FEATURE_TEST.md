# Feature Test: Sprint S2.1 - User Authentication

**Sprint:** S2.1
**Feature:** User Authentication (Email/Password + Google OAuth)
**Date:** 2026-01-21
**Status:** COMPLETE

---

## What This Feature Does

This sprint implemented complete user authentication for the SteerTrue chat application:

1. **Email/Password Signup** - Users can create accounts with email and password
2. **Email/Password Login** - Users can log in with their credentials
3. **Google OAuth** - Users can sign in/up using their Google account
4. **Session Persistence** - Users stay logged in across page refreshes
5. **Protected Routes** - Dashboard requires authentication
6. **Sign Out** - Users can log out and end their session

---

## Why This Feature Exists

SteerTrue needs user authentication to:
- Identify users for personalized chat experiences
- Protect user data and conversations
- Enable future features like chat history and preferences
- Provide enterprise-grade security with OAuth support

---

## Step-by-Step Demo

### Prerequisites
- Browser with cookies enabled
- Access to https://steertrue-chat-dev-sandbox.up.railway.app

### Demo 1: Email/Password Flow

**Step 1: Create Account**
```
1. Navigate to: https://steertrue-chat-dev-sandbox.up.railway.app/signup
2. Enter email: demo-[timestamp]@example.com
3. Enter password: DemoPass123
4. Confirm password: DemoPass123
5. Click "Sign Up"
6. Expected: Success message appears
```

**Step 2: Login**
```
1. Click "Continue to login" or navigate to /login
2. Enter the email and password from Step 1
3. Click "Log In"
4. Expected: Redirected to dashboard, see your email displayed
```

**Step 3: Verify Session**
```
1. Press F5 to refresh the page
2. Expected: Still logged in, dashboard still shows your email
```

**Step 4: Sign Out**
```
1. Click "Sign Out" button
2. Expected: Redirected to home page
3. Navigate to /dashboard
4. Expected: Redirected to /login (protected route)
```

### Demo 2: Google OAuth Flow

**Step 1: Sign In with Google**
```
1. Navigate to: https://steertrue-chat-dev-sandbox.up.railway.app/login
2. Click "Sign in with Google"
3. Select your Google account
4. Authorize the application
5. Expected: Redirected to dashboard, see your Google email and name
```

**Step 2: Verify Session**
```
1. Press F5 to refresh
2. Expected: Still logged in with Google account
```

**Step 3: Sign Out**
```
1. Click "Sign Out"
2. Expected: Redirected to home page
```

---

## Test Account

For quick testing without creating a new account:

| Field | Value |
|-------|-------|
| Email | test@example.com |
| Password | TestPass1234 |

---

## Technical Implementation

| Component | Technology |
|-----------|------------|
| Auth Framework | Auth.js v5 (next-auth) |
| Session Strategy | JWT (stateless) |
| Password Hashing | bcrypt (10 salt rounds) |
| OAuth Provider | Google (OIDC) |
| Database | Railway Postgres via Drizzle ORM |
| Cookie Security | HttpOnly, Secure, SameSite=Lax |

---

## Undo Instructions

To revert test changes (clean up test accounts):

**Option 1: Delete specific user via database**
```sql
-- Connect to Railway Postgres
DELETE FROM users WHERE email = 'demo-[timestamp]@example.com';
```

**Option 2: Clear all test users**
```sql
-- Only run in dev environment!
DELETE FROM users WHERE email LIKE 'demo-%@example.com';
```

**Option 3: Reset to clean state**
```bash
# This will drop and recreate the users table
npx drizzle-kit push --force
```

---

## Known Limitations

1. **No password reset** - Users cannot reset forgotten passwords (future sprint)
2. **No email verification** - Emails are not verified on signup (future sprint)
3. **No remember me** - Sessions expire after 7 days regardless of preference
4. **Single OAuth provider** - Only Google OAuth (GitHub, etc. could be added)

---

## Files Involved

| File | Purpose |
|------|---------|
| `lib/auth.ts` | Auth.js configuration with providers |
| `lib/auth.config.ts` | Edge-compatible auth config |
| `app/(auth)/login/page.tsx` | Login page UI |
| `app/(auth)/signup/page.tsx` | Signup page UI |
| `app/dashboard/page.tsx` | Protected dashboard |
| `middleware.ts` | Route protection |
| `app/api/auth/[...nextauth]/route.ts` | Auth.js API routes |
| `app/api/auth/signup/route.ts` | Signup API endpoint |

---

**END OF FEATURE TEST**
