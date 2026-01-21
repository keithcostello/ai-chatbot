# Google Cloud OAuth Setup Guide for SteerTrue Chat

**Created:** 2026-01-21
**Purpose:** Step-by-step guide for creating Google OAuth 2.0 credentials

---

## Step 1: Access Google Cloud Console

1. Open your browser and navigate to: **https://console.cloud.google.com/**
2. Sign in with your Google account if not already signed in

---

## Step 2: Create or Select a Project

**Option A: Create New Project**
1. Click the project dropdown at the top of the page (next to "Google Cloud" logo)
2. In the popup, click **"NEW PROJECT"** (top right)
3. Enter project name: `SteerTrue Chat`
4. Leave organization as default (or select your org)
5. Click **"CREATE"**
6. Wait for project creation (notification bell will show progress)
7. Click **"SELECT PROJECT"** when prompted, or select from dropdown

**Option B: Use Existing Project**
1. Click the project dropdown
2. Select your existing project from the list

---

## Step 3: Configure OAuth Consent Screen

**You must configure the consent screen before creating credentials.**

1. In the left sidebar, click **"APIs & Services"**
2. Click **"OAuth consent screen"**
3. Select User Type: **"External"** (allows any Google account to sign in)
4. Click **"CREATE"**

**App Information (Screen 1):**
- App name: `SteerTrue Chat`
- User support email: (select your email from dropdown)
- App logo: (optional, skip for now)

**App Domain (optional, skip for now):**
- Leave blank

**Developer contact information:**
- Email addresses: Enter your email address

5. Click **"SAVE AND CONTINUE"**

**Scopes (Screen 2):**
1. Click **"ADD OR REMOVE SCOPES"**
2. In the search/filter box, find and check these scopes:
   - `.../auth/userinfo.email` (See your primary Google Account email address)
   - `.../auth/userinfo.profile` (See your personal info)
   - `openid` (Associate you with your personal info on Google)
3. Click **"UPDATE"** at bottom of scope panel
4. Click **"SAVE AND CONTINUE"**

**Test Users (Screen 3):**
1. Click **"ADD USERS"**
2. Enter email addresses of people who can test (include your own email)
3. Click **"ADD"**
4. Click **"SAVE AND CONTINUE"**

**Summary (Screen 4):**
- Review your settings
- Click **"BACK TO DASHBOARD"**

---

## Step 4: Create OAuth 2.0 Credentials

1. In the left sidebar, click **"Credentials"** (under APIs & Services)
2. Click **"+ CREATE CREDENTIALS"** (top of page)
3. Select **"OAuth client ID"**

**Configure the OAuth client:**

- Application type: **"Web application"**
- Name: `SteerTrue Chat Production`

**Authorized JavaScript origins:**
Click **"+ ADD URI"** and enter:
```
https://steertrue-chat-dev-sandbox.up.railway.app
```

**Authorized redirect URIs:**
Click **"+ ADD URI"** and enter:
```
https://steertrue-chat-dev-sandbox.up.railway.app/api/auth/callback/google
```

4. Click **"CREATE"**

---

## Step 5: Copy Your Credentials

A popup will appear with your credentials:

```
Your Client ID:     xxxxxxxx.apps.googleusercontent.com
Your Client Secret: GOCSPX-xxxxxxxxxxxxxxxxxxxx
```

**IMPORTANT:**
1. Copy the **Client ID** - save it securely
2. Copy the **Client Secret** - save it securely
3. Click **"OK"** to close

---

## Step 6: Environment Variables Required

| Variable Name | Value |
|---------------|-------|
| `AUTH_GOOGLE_ID` | Your Client ID |
| `AUTH_GOOGLE_SECRET` | Your Client Secret |

---

## Verification Checklist

- [ ] OAuth consent screen configured with External user type
- [ ] Scopes include: email, profile, openid
- [ ] Your email added as test user
- [ ] OAuth client created as "Web application" type
- [ ] JavaScript origin: `https://steertrue-chat-dev-sandbox.up.railway.app`
- [ ] Redirect URI: `https://steertrue-chat-dev-sandbox.up.railway.app/api/auth/callback/google`
- [ ] Client ID copied
- [ ] Client Secret copied

---

## Common Issues

**"Access blocked: This app's request is invalid"**
- Check redirect URI matches exactly (no trailing slash)

**"Error 400: redirect_uri_mismatch"**
- Redirect URI in app doesn't match Google Cloud config

**"This app is not verified"**
- Normal for development - click "Advanced" → "Go to SteerTrue Chat (unsafe)"
