# Process Fix for AI Agents

**Date:** 2026-01-21
**Source:** Sprint S2.1 Post-Mortem Analysis
**Purpose:** Share with all AI agents to prevent repeated failures

---

## Summary

Sprint S2.1 experienced 7+ UAT failures due to a fundamental gap: **AI agents verified API endpoints via curl but never verified actual browser user experience.**

This document explains what went wrong and what MUST change.

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
3. Check browser console (error check)
4. Test actual interaction (click/submit check)

### Rule 2: Use agent-browser for Browser Verification

```bash
# Install (one-time)
npm install -g agent-browser && agent-browser install

# Usage
agent-browser navigate https://your-url.com/page
agent-browser snapshot    # See what browser renders
agent-browser screenshot screenshot.png
agent-browser click "Button Text"
agent-browser fill @e1 "input value"
```

**Every UI checkpoint must include agent-browser evidence.**

### Rule 3: Check Browser Console ALWAYS

JavaScript errors break functionality silently. After loading any page:

```bash
# Manual check
Open DevTools (F12) -> Console tab -> Look for red errors

# Or via agent-browser
agent-browser navigate https://url
# Check output for console errors
```

**Document console errors (or "no errors") in every checkpoint.**

### Rule 4: Test Full User Flows, Not Components

**Bad:** Test /login loads, test /signup loads, test OAuth callback exists
**Good:** Test: Click login button -> Enter credentials -> Submit -> Verify logged-in state

User flows must be tested END-TO-END.

### Rule 5: Test What User Sees, Not What HTML Contains

**Bad:** `curl ... | grep "button"` shows button exists
**Good:** `agent-browser snapshot` shows button is visible and clickable

HTML containing elements ≠ User seeing elements

### Rule 6: Check Production Logs After Every Deployment

```bash
railway logs -n 50   # or your platform's equivalent
```

"Build succeeded locally" means NOTHING about production.

---

## CHECKPOINT TEMPLATE UPDATE

Every UI feature checkpoint must include:

```markdown
## BROWSER VERIFICATION (MANDATORY)

### 1. curl Verification
Command: curl -I https://[url]/[path]
Response: HTTP/1.1 200 OK

### 2. agent-browser Verification
Command: agent-browser navigate https://[url]/[path]
Snapshot: [paste accessibility tree output]

### 3. Console Error Check
Method: DevTools Console / agent-browser output
Errors: [none / list errors]

### 4. Screenshot Evidence
File: [path to screenshot showing URL bar]

### 5. Interaction Test (if applicable)
Action: agent-browser click "Button Text"
Result: [describe what happened]
Post-action URL: [URL after interaction]
```

---

## ANTI-PATTERNS TO AVOID

### AP1: "curl Returns 200, So It Works"
WRONG. 200 means server responded. Browser may still fail.

### AP2: "Human Will Test Browser"
WRONG. Human should receive VERIFIED UAT. If you can't verify browser behavior, don't approve.

### AP3: "Build Succeeded Locally"
WRONG. Local builds don't execute runtime code. Production may fail.

### AP4: "Snapshot Shows Elements Exist"
WRONG. Elements in DOM ≠ visible to user. Must also screenshot and interact.

### AP5: "Tests Pass Without Interaction"
WRONG. Loading is Step 1. Must also click, fill, submit, and verify result.

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

## PM ROLE CHANGES

### Before
PM could approve checkpoints with curl-only evidence, deferring browser testing to human.

### After
PM MUST have agent-browser capability. If PM cannot verify browser behavior:
- Checkpoint CANNOT be approved
- Escalate for tool installation
- Do NOT defer to human

---

## DEV ROLE CHANGES

### Before
DEV submitted curl evidence, agent-browser snapshots, and declared victory.

### After
DEV must provide for every UI feature:
1. curl HTTP verification
2. agent-browser rendering verification
3. Browser console error documentation
4. Interaction test results
5. Screenshots with URL bar visible

---

## CODE REVIEW REQUIREMENTS

Before PM approves any checkpoint:

1. **Architecture check:** Does code follow project patterns?
2. **Security check:** Any vulnerabilities introduced?
3. **Browser evidence check:** Did DEV provide agent-browser verification?
4. **Console check:** Did DEV document browser console state?
5. **Flow test check:** Did DEV test the full user flow?

If any check fails, REJECT the checkpoint.

---

## IMPLEMENTATION

### For Existing Projects

1. Install agent-browser: `npm install -g agent-browser && agent-browser install`
2. Update checkpoint templates to require browser verification
3. Update PM role to require agent-browser capability
4. Update DEV role to require console error documentation
5. Add LESSONS_LEARNED.md to each project's sprint folder

### For New Sprints

1. Pre-flight: Verify agent-browser is available
2. Every checkpoint: Include browser verification section
3. UAT: Test full user flows, not just components
4. Post-deployment: Check production logs immediately

---

## KEY TAKEAWAY

**Test what the user experiences, not what your tools report.**

curl says 200? Great, but does the user see the page?
Snapshot shows button? Great, but does clicking it work?
Build succeeded? Great, but does production work?

Always verify the ACTUAL USER EXPERIENCE.

---

**END OF PROCESS FIX DOCUMENT**

Share this document with all AI agents working on frontend/UI projects.
