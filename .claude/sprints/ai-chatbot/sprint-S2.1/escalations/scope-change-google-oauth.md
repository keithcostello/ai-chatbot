# Scope Change: Google OAuth

**Sprint:** S2.1
**Timestamp:** 2026-01-21T08:29:00.963Z
**Decision By:** Keith

## Change Request

Add Google OAuth sign-in to Sprint S2.1 (was missed in original scope).

## New Deliverables

| # | Deliverable | Type | Acceptance Criteria |
|---|-------------|------|---------------------|
| 10 | Google OAuth sign-in | Feature | User can sign in with Google account |
| 11 | Google provider config | Config | Auth.js Google provider configured |

## Requirements

1. **Google Cloud Console:**
   - Create OAuth 2.0 credentials (Client ID, Client Secret)
   - Configure authorized redirect URIs for Railway URL

2. **Auth.js Configuration:**
   - Add Google provider to auth.ts
   - Handle account linking (if user signs up with email, then tries Google with same email)

3. **UI Updates:**
   - Add "Sign in with Google" button on login page
   - Add "Sign up with Google" button on signup page

4. **Environment Variables:**
   - GOOGLE_CLIENT_ID
   - GOOGLE_CLIENT_SECRET

## Impact

- UAT Gate: PAUSED
- Return to Phase 3 (Execution)
- Full UAT re-run required (email/password + Google OAuth)

## Updated Success Criteria

| SC | Criterion | New |
|----|-----------|-----|
| SC-11 | User can sign in with Google account | YES |
| SC-12 | Google OAuth redirects correctly | YES |
