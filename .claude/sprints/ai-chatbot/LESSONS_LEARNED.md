# LESSONS LEARNED - ai-chatbot Sprints

**Created:** 2026-01-21
**Last Updated:** 2026-01-21
**Sprints Covered:** S2.1

---

## Purpose

This document captures lessons learned from sprint failures to prevent future AI agents from repeating the same mistakes. Every agent working on ai-chatbot MUST read this before starting work.

---

## KEY LESSONS

### L1: curl Tests Are NOT Browser Tests

**Lesson:** A 200 OK from curl does NOT mean the page works in a browser.

**Why:** curl tests:
- HTTP response codes
- API JSON payloads
- Server-side rendering output

curl does NOT test:
- JavaScript execution
- React component rendering
- Client-side routing
- Session/cookie behavior
- OAuth redirect flows
- User interactions (clicks, form submission)

**Rule:** For ANY UI feature, curl evidence alone is INSUFFICIENT. You MUST use agent-browser to verify actual browser behavior.

---

### L2: Test The Actual User Flow, Not Components

**Lesson:** Testing individual endpoints/pages is not the same as testing user flows.

**Example from S2.1:**
- DEV tested: `/signup` page loads (PASS)
- DEV tested: `/login` page loads (PASS)
- DEV tested: OAuth callback endpoint exists (PASS)
- USER FLOW (untested): Click "Sign in with Google" -> Google consent -> callback -> redirect -> logged in state

The individual components passed, but the full flow failed because middleware blocked the callback.

**Rule:** Always test END-TO-END user flows, not just individual components.

---

### L3: Check Production Logs Immediately After Deployment

**Lesson:** "Build succeeded locally" means NOTHING about production.

**Example from S2.1:**
- Local build: SUCCESS
- Railway deployment: 500 Internal Server Error
- Root cause: Edge Runtime incompatibility with bcrypt
- Error was visible in Railway logs but never checked

**Rule:** After every deployment, run:
```bash
railway logs --tail 50
```
And look for ANY errors. Do not assume deployment worked because upload completed.

---

### L4: Check Browser Console For Errors

**Lesson:** JavaScript errors break functionality silently.

**Example from S2.1:**
- User saw buttons stop working
- Console showed: `Failed to load resource: the server responded with a status of 401`
- DEV never checked browser console

**Rule:** After loading any page, check browser DevTools Console for errors. Document any errors found, even if they seem unrelated to the feature being tested.

---

### L5: OAuth Flows Require Full Flow Testing

**Lesson:** OAuth is a multi-step redirect flow. Testing any single step is insufficient.

**Full OAuth Flow:**
1. User clicks "Sign in with [Provider]"
2. Browser redirects to provider's auth URL
3. User authenticates with provider
4. Provider redirects to callback URL (`/api/auth/callback/[provider]`)
5. App processes callback, creates session
6. App redirects user to destination (home/dashboard)
7. Page shows logged-in state

**What S2.1 Tested:**
- Step 1: Untested (assumed Link component works)
- Step 2: Untested
- Step 3: Untested (outside our control)
- Step 4: Assumed working (middleware blocked it)
- Step 5-7: Untested

**Rule:** For OAuth, you MUST test the COMPLETE flow from button click to logged-in state. Use agent-browser to follow redirects.

---

### L6: Middleware Affects EVERY Route

**Lesson:** Middleware runs before EVERY request. A bug in middleware breaks everything.

**Example from S2.1:**
- Middleware imported `lib/auth.ts`
- `lib/auth.ts` imported bcrypt (Node.js native module)
- Middleware runs in Edge Runtime
- Edge Runtime cannot execute bcrypt
- Result: 500 error on EVERY route, including health check

**Rule:** Before importing anything into middleware, verify it's Edge-compatible. Middleware must be lightweight.

---

### L7: Test What The User Sees, Not What HTML Contains

**Lesson:** HTML containing correct elements does NOT mean user sees them.

**Example from S2.1:**
- curl showed HTML contained button elements
- DEV claimed "buttons work"
- User saw "Loading..." - buttons never rendered
- Root cause: React `useState(true)` for loading blocked render

**Rule:** Use agent-browser `snapshot` to see what the browser RENDERS, not curl to see raw HTML.

---

### L8: Test The Right Page

**Lesson:** Screenshots and snapshots must be from the exact URL being verified.

**Example from S2.1:**
- User complained about home page (`/`)
- DEV provided evidence from `/signup`
- `/signup` had correct branding
- `/` (home page) was missing branding
- DEV declared victory based on wrong page

**Rule:** EVERY piece of evidence must clearly state which URL it came from. Verify the EXACT page mentioned in requirements.

---

## ANTI-PATTERNS

### AP1: "curl Returns 200, So It Works"

**Pattern:** DEV runs curl, gets 200 OK, declares endpoint working.

**Reality:** 200 OK means server responded successfully. It does NOT mean:
- The response content is correct
- JavaScript rendering works
- User interactions work
- State management works
- OAuth redirects complete

**Correction:** curl is only Step 1. Step 2 is agent-browser verification.

---

### AP2: "Human Will Test Browser"

**Pattern:** PM acknowledges browser tests weren't done, defers to human.

**Reality:** Human should NEVER receive untested UAT. If you can't verify browser behavior, you cannot approve the checkpoint.

**Correction:** If agent-browser is unavailable, checkpoint cannot be approved. Request it be installed or escalate.

---

### AP3: "Build Succeeded Locally"

**Pattern:** Local npm build completes, DEV assumes production works.

**Reality:** Local builds don't execute runtime code. Production may fail due to:
- Missing environment variables
- Runtime incompatibilities (Edge vs Node.js)
- Database connectivity
- External service dependencies

**Correction:** After deployment, verify production health BEFORE claiming success:
```bash
curl https://[deployment-url]/api/health
railway logs --tail 50
```

---

### AP4: "Snapshot Shows Elements Exist"

**Pattern:** agent-browser snapshot shows form elements, DEV declares UI complete.

**Reality:** Elements existing in accessibility tree does NOT mean:
- User can see them (might be hidden)
- User can interact with them (might be disabled)
- They work correctly (might have JavaScript errors)

**Correction:** Snapshot shows structure. Screenshot shows appearance. Interaction testing (fill, click) verifies functionality. All three are needed.

---

### AP5: "Tests Pass Without Interaction"

**Pattern:** Page loads without error, DEV declares tests pass.

**Reality:** Loading is Step 1. User flows require:
1. Page loads
2. User sees expected content
3. User interacts (click, type, submit)
4. App responds correctly
5. State updates correctly
6. User sees correct result

**Correction:** agent-browser scripts must include interaction: `fill`, `click`, then verify result.

---

## REQUIRED PRACTICES

### RP1: Multi-Layer Verification

For EVERY UI feature:

1. **curl verification:** API returns expected response
2. **agent-browser open:** Page loads without error
3. **agent-browser snapshot:** Correct elements present
4. **agent-browser screenshot:** Visual appearance correct
5. **agent-browser interaction:** Fill forms, click buttons
6. **agent-browser result:** Verify expected outcome

If ANY layer fails, checkpoint is REJECTED.

---

### RP2: Post-Deployment Checks

After EVERY deployment:

```bash
# 1. Health check
curl -s https://[url]/api/health

# 2. Production logs
railway logs --tail 50

# 3. Page load verification
agent-browser open https://[url]/
agent-browser snapshot

# 4. Console error check
# (via agent-browser or manual DevTools)
```

Document results in checkpoint.

---

### RP3: Full Flow Testing

For user flows (login, signup, OAuth):

```bash
# Document complete flow
agent-browser open https://[url]/login
agent-browser snapshot  # Verify page state
agent-browser fill @e1 "email"
agent-browser fill @e2 "password"
agent-browser click @e3  # Submit button
# Wait for result
agent-browser snapshot  # Verify new state
agent-browser screenshot result.png
```

Each step must be documented with actual output.

---

### RP4: OAuth Testing Protocol

For OAuth specifically:

```bash
# Step 1: Initial state
agent-browser open https://[url]/login
agent-browser snapshot  # Verify OAuth button present

# Step 2: Click OAuth button
agent-browser click "[Sign in with Google]"
# Document: Where did browser go?
# Expected: accounts.google.com

# Step 3: After OAuth (manual or simulated)
# Document: Did callback process correctly?
# Document: What page did user land on?
# Document: Is user logged in?

agent-browser snapshot  # Verify logged-in state
```

---

### RP5: Error Documentation

When ANY error occurs:

1. Document exact error message
2. Document where error appeared (console, logs, UI)
3. Document what action triggered it
4. Document current URL
5. Document session/cookie state

Example:
```
ERROR: Failed to load resource: 401
LOCATION: Browser Console
TRIGGER: Page load after OAuth redirect
URL: https://steertrue-chat-dev-sandbox.up.railway.app/
COOKIES: session cookie present but possibly invalid
```

---

## PROCESS GAPS IDENTIFIED

### PG1: No Browser Testing Requirement

**Gap:** Checkpoint approval didn't require browser-based testing evidence.

**Fix:** Add to checkpoint templates:
```markdown
## BROWSER VERIFICATION (MANDATORY for UI features)
- agent-browser open [URL]
- agent-browser snapshot output: [paste]
- agent-browser screenshot: [path]
- Console errors: [none / list]
```

---

### PG2: PM Cannot Execute agent-browser

**Gap:** PM stated "PM cannot execute agent-browser commands"

**Fix:** PM MUST have agent-browser access. If unavailable:
- Checkpoint cannot be approved
- Escalate to orchestrator for tool installation
- Do NOT defer to human - human should receive VERIFIED UAT

---

### PG3: No Post-OAuth State Testing

**Gap:** Test plan tested pre-OAuth and OAuth initiation, but not post-OAuth state.

**Fix:** Add to OAuth test plan:
```markdown
## POST-OAUTH VERIFICATION
After completing OAuth flow:
1. Verify logged-in state displayed
2. Verify buttons still work
3. Verify page reload maintains state
4. Clear cookies and verify buttons work again
```

---

### PG4: No Console Log Checking

**Gap:** No test step verifies browser console is error-free.

**Fix:** Add to EVERY UI test:
```markdown
## CONSOLE VERIFICATION
Command: agent-browser console-errors (or manual DevTools check)
Expected: No errors
Actual: [none / list errors]
```

---

## SPRINT S2.1 SPECIFIC LEARNINGS

### What Went Wrong

1. **7+ UAT iterations** - Each found new problems
2. **Edge Runtime incompatibility** - Not caught until production
3. **Middleware blocking OAuth** - Never tested full flow
4. **Loading state blocking render** - curl showed HTML, user saw "Loading..."
5. **Wrong page tested** - DEV tested /signup, user complained about /
6. **Post-OAuth state corruption** - Never tested

### What Should Have Been Different

1. First deployment -> immediate `railway logs` check
2. Every page mentioned -> independent agent-browser verification
3. OAuth flow -> complete button-to-logged-in test
4. Every checkpoint -> browser console error check
5. PM verification -> agent-browser, not just curl

---

**END OF LESSONS LEARNED**

---

**Next Steps:**
1. Integrate lessons into checkpoint templates
2. Update PM role to require browser verification
3. Create OAuth-specific test protocol
4. Add console error checking to UAT requirements
