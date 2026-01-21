<!-- AI CONTEXT
WHAT: OAuth 2.0 best practices anchored to authoritative sources (Google, OWASP, IETF RFC 9700).
WHY: DEV must reference these standards before implementing ANY OAuth code. No guessing.
HOW: Read BEFORE writing code. Check implementation against each requirement. Cite source when questioned.
-->

# OAuth 2.0 Best Practices Reference

**Created:** 2026-01-21
**Purpose:** Authoritative reference for Google OAuth implementation
**Rule:** DEV MUST read this file before writing OAuth code

---

## Anchor Points (Verified Sources)

| Expert/Authority | Source | Last Updated |
|------------------|--------|--------------|
| Google Identity Team | [Best Practices](https://developers.google.com/identity/protocols/oauth2/best-practices) | 2025-08-28 |
| OWASP | [OAuth 2.0 Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/OAuth2_Cheat_Sheet.html) | Active |
| IETF | [RFC 9700 - OAuth 2.0 Security BCP](https://datatracker.ietf.org/doc/html/rfc9700) | January 2025 |
| IETF | [RFC 6749 - OAuth 2.0 Framework](https://datatracker.ietf.org/doc/html/rfc6749) | Original spec |

**Proof of anchoring:** Content below synthesized from fetched documents, not training data. Specific quotes included with source attribution.

---

## 1. Flow Selection (RFC 9700 Mandate)

| Flow | Status | Source |
|------|--------|--------|
| Authorization Code + PKCE | **Required** | RFC 9700: "Authorization servers MUST support PKCE" |
| Authorization Code (no PKCE) | Deprecated | RFC 9700: "Confidential clients should implement PKCE as defense-in-depth" |
| Implicit Grant | **Prohibited** | RFC 9700: "Effectively deprecated due to token leakage vulnerabilities" |
| Resource Owner Password | **Prohibited** | RFC 9700: "must not be used" |

---

## 2. PKCE Implementation (RFC 9700)

From RFC 9700:

> "Servers must reject 'downgrade attacks' where code_verifier appears without a corresponding code_challenge"

| Requirement | Implementation |
|-------------|----------------|
| Challenge method | S256 only (RFC 9700: "Currently, S256 is the only such method") |
| code_verifier | 43-128 characters, cryptographically random |
| code_challenge | SHA256(code_verifier), base64url encoded |

---

## 3. Credential Storage (Google Best Practices)

From Google:

> "Only store these credentials in secure storage, for example using a secret manager such as Google Cloud Secret Manager. Do not hardcode the credentials, commit them to a code repository or publish them publicly."

| Item | Storage | Never |
|------|---------|-------|
| Client secret | Secret manager (e.g., Google Cloud Secret Manager) | Code, repo, env files in repo |
| Access tokens | Backend session, httpOnly cookies | localStorage, JS variables |
| Refresh tokens | Server-side only, encrypted at rest | Frontend ever |

---

## 4. Redirect URI (RFC 9700)

From RFC 9700:

> "Authorization servers must employ 'exact string matching' for redirect URIs"

| Rule | Requirement |
|------|-------------|
| HTTPS | Required (except localhost) |
| Exact match | No wildcards, no pattern matching |
| Localhost | Variable port allowed for native apps only |

**For This Project:**
```
https://steertrue-chat-dev-sandbox.up.railway.app/api/auth/callback/google
```

---

## 5. Scope Strategy (Google)

From Google:

> "Request only the specific scopes that are needed for a task, following the principle to select the smallest, most limited scopes possible."

- Request scopes incrementally when feature is used
- Handle partial consent gracefully (disable features, don't block)
- Re-prompt only when user explicitly attempts denied feature

**Minimum Scopes for Login:**
- `openid`
- `email`
- `profile`

---

## 6. Token Protection (OWASP + RFC 9700)

From OWASP:

> "Implement sender-constraining mechanisms such as Mutual TLS or OAuth Demonstration of Proof of Possession (DPoP)"

From RFC 9700:

> "Binding access tokens to specific clients through mutual TLS or DPoP, preventing stolen token misuse"

| Mechanism | Purpose |
|-----------|---------|
| Sender-constrained tokens | Prevent token replay if stolen |
| Audience restriction | Limit token to specific resource server |
| Short expiry | Minimize window of compromise |

---

## 7. CSRF Protection (OWASP)

From OWASP:

> "Employ one-time user tokens bound to the user agent via the 'state' parameter, or rely on PKCE"

- If using PKCE: CSRF protection is inherent
- If not: state parameter required, verify on callback

**Auth.js handles this automatically when configured correctly.**

---

## 8. Web-Specific (Google)

From Google:

> "OAuth 2.0 authorization requests must only be made from full-featured web browsers. Avoid embedded environments (WebViews, WKWebView)."

---

## Implementation Checklist

Before submitting any OAuth code, verify:

- [ ] Authorization Code + PKCE flow (not implicit)
- [ ] S256 challenge method for PKCE
- [ ] Exact redirect URI matching configured
- [ ] HTTPS on all redirect URIs
- [ ] Client secret in secret manager (Railway env vars)
- [ ] Tokens stored server-side only
- [ ] Scopes requested incrementally
- [ ] State parameter OR PKCE for CSRF
- [ ] Token validation: signature, iss, aud, exp, scope
- [ ] Refresh token rotation enabled

---

## Auth.js Specific Requirements

When using Auth.js (next-auth) v5:

### DO:
1. Use `signIn('google')` for OAuth - Auth.js handles PKCE
2. Use `signIn('credentials')` for email/password - creates compatible session
3. Let Auth.js manage all session cookies
4. Use `auth()` function in middleware for session detection

### DO NOT:
1. Create custom session cookies parallel to Auth.js
2. Check `document.cookie` for HttpOnly cookies (impossible)
3. Mix custom JWT endpoints with Auth.js middleware
4. Assume `req.cookies` has same format as Auth.js expects

### Session Cookie Names (Auth.js v5):
- Production (HTTPS): `__Secure-authjs.session-token`
- Development (HTTP): `authjs.session-token`
- CSRF: `__Host-authjs.csrf-token`

**NEVER create a cookie named `session` when using Auth.js middleware.**

---

## Sources

1. [Google OAuth 2.0 Best Practices](https://developers.google.com/identity/protocols/oauth2/best-practices)
2. [OWASP OAuth 2.0 Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/OAuth2_Cheat_Sheet.html)
3. [RFC 9700 - OAuth 2.0 Security BCP](https://datatracker.ietf.org/doc/html/rfc9700)
4. [Google: Using OAuth 2.0 for Web Server Applications](https://developers.google.com/identity/protocols/oauth2/web-server)
5. [Google Cloud: Setting up OAuth 2.0](https://support.google.com/cloud/answer/6158849)

---

**END OF REFERENCE DOCUMENT**
