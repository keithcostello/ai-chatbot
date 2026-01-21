# Browser Verification Process for AI Agents

<!-- AI CONTEXT
WHAT: Follow this process for all UI/frontend verification. Required reading before any UI checkpoint.
WHY: Sprint S2.1 failed 7+ UAT cycles because AI agents verified HTTP status but not browser rendering.
HOW: Use agent-browser commands below. Include all evidence types in checkpoints.
-->

**Date:** 2026-01-21
**Source:** Sprint S2.1 Post-Mortem Analysis
**Purpose:** Prevent repeated browser verification failures

---

## THE PROBLEM

### What AI Agents Were Doing

```
DEV: "curl returns 200 OK, endpoint works!"
PM: "Confirmed, curl also returns 200 for me"
Human: "The page doesn't work in my browser"
```

### Why This Fails

curl tests:
- HTTP response codes
- JSON payloads
- Server-side rendered HTML

curl does NOT test:
- JavaScript execution
- React/Vue/Angular component rendering
- Client-side routing
- Session/cookie behavior
- OAuth redirect flows
- User interactions (clicks, form submission)
- Browser console errors

**A 200 OK from curl does NOT mean the page works in a browser.**

---

## THE FIX

### Rule 1: curl Tests Are NOT Browser Tests

For ANY UI feature, curl evidence alone is INSUFFICIENT.

**Before:** DEV runs `curl -I /login`, gets 200, declares "login page works"

**After:** DEV must:
1. Run curl (HTTP status check)
2. Run agent-browser (browser rendering check)
3. Test actual interaction (click/submit check)
4. Capture screenshot evidence

### Rule 2: Use agent-browser for Browser Verification

```bash
# Install (one-time)
npm install -g agent-browser && agent-browser install

# Usage
agent-browser open https://your-url.com/page
agent-browser snapshot    # Get accessibility tree with element refs
agent-browser screenshot screenshot.png
agent-browser click @e5   # Click by element ref
agent-browser fill @e3 "input value"
agent-browser close
```

**Every UI checkpoint must include agent-browser evidence.**

### Rule 3: Understand Snapshot vs Screenshot

| Tool | Output | Purpose |
|------|--------|---------|
| `snapshot` | Accessibility tree with @refs | Machine-readable structure, element targeting |
| `screenshot` | PNG image file | Human-readable visual evidence |

**Both are required.** Snapshot proves elements exist and are interactive. Screenshot proves visual rendering matches expectations.

### Rule 4: Console Errors Require Manual Check

**Note:** agent-browser does NOT capture browser console errors.

For console error verification:
- Use browser DevTools (F12 → Console tab)
- Document "No console errors" or list specific errors
- This requires human verification or alternative tooling

### Rule 5: Test Full User Flows, Not Components

**Bad:** Test /login loads, test /signup loads, test OAuth callback exists
**Good:** Test: Click login button → Enter credentials → Submit → Verify logged-in state

User flows must be tested END-TO-END.

### Rule 6: Test What User Sees, Not What HTML Contains

**Bad:** `curl ... | grep "button"` shows button exists
**Good:** `agent-browser snapshot` shows button has @ref and is interactive

HTML containing elements ≠ User seeing elements

### Rule 7: Check Production Logs After Every Deployment

```bash
railway logs -n 50   # or your platform's equivalent
```

"Build succeeded locally" means NOTHING about production.

---

## CHECKPOINT TEMPLATE

Every UI feature checkpoint must include:

```markdown
## BROWSER VERIFICATION (MANDATORY)

### 1. HTTP Verification
Command: curl -I https://[url]/[path]
Response: HTTP/1.1 200 OK

### 2. Snapshot (Accessibility Tree)
Command: agent-browser open https://[url]/[path] && agent-browser snapshot
Output:
[paste accessibility tree with @refs]

### 3. Screenshot Evidence
Command: agent-browser screenshot [filename].png
File: [path to screenshot]
URL Bar Visible: [yes/no - must be yes]

### 4. Interaction Test (if applicable)
Action: agent-browser click @e[N] / agent-browser fill @e[N] "value"
Result: [describe what happened]
Post-action snapshot: [paste if state changed]

### 5. Console Errors (manual check or deferred)
Method: [DevTools / Deferred to Human UAT]
Status: [No errors observed / Errors listed / Deferred]
```

---

## ANTI-PATTERNS TO AVOID

| ID | Anti-Pattern | Why It's Wrong |
|----|--------------|----------------|
| AP1 | "curl returns 200, so it works" | 200 = server responded. Browser may still fail. |
| AP2 | "Human will test browser" | Human receives VERIFIED UAT, not first-pass testing. |
| AP3 | "Build succeeded locally" | Local builds don't test runtime. Production may fail. |
| AP4 | "Snapshot shows elements exist" | Existence ≠ visibility. Must also screenshot and interact. |
| AP5 | "Tests pass without interaction" | Loading is step 1. Must click, fill, submit, verify. |

---

## OAUTH SPECIFIC REQUIREMENTS

OAuth is a multi-step redirect flow. Testing any single step is insufficient.

**Full OAuth Flow:**
1. User clicks "Sign in with [Provider]"
2. Browser redirects to provider's auth URL
3. User authenticates with provider
4. Provider redirects to callback URL
5. App processes callback, creates session
6. App redirects user to destination
7. Page shows logged-in state

**You MUST test steps 1 through 7.** Not just "callback endpoint returns 200."

---

## ESCALATION PATH

If browser verification is blocked:

| Blocker | Action |
|---------|--------|
| agent-browser not installed | Run `npm install -g agent-browser && agent-browser install` |
| agent-browser fails to open | Document error, escalate to human with specific error |
| Site requires auth agent-browser can't do | Document limitation, create human-uat-test-plan.md with steps |
| Console check required | Explicitly defer to human UAT, document in checkpoint |

**Never approve a checkpoint with unverified browser behavior.** Either verify it, or explicitly document what remains unverified and why.

---

## ROLE REQUIREMENTS

### DEV Role

For every UI feature, provide:
1. curl HTTP verification
2. agent-browser snapshot (accessibility tree)
3. agent-browser screenshot (with URL bar visible)
4. Interaction test results (if applicable)
5. Console status: verified clean OR deferred with reason

### PM Role

Before approving any UI checkpoint:
1. Verify DEV provided all 5 evidence types above
2. Run independent agent-browser verification on same URL
3. Compare PM snapshot to DEV snapshot
4. If mismatch or missing evidence → REJECT

---

## KEY TAKEAWAY

**Test what the user experiences, not what your tools report.**

| Tool Says | Reality Check |
|-----------|---------------|
| curl says 200 | Does the user see the page? |
| Snapshot shows button | Does clicking it work? |
| Build succeeded | Does production work? |

Always verify the ACTUAL USER EXPERIENCE.

---

**END OF BROWSER VERIFICATION PROCESS**
