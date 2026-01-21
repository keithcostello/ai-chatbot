---
name: interrupt
description: Circuit breaker for stuck AI - forces diagnostic and new approach
---

# Interrupt Command

Manual circuit breaker when AI is spinning without progress. Implements M70 "Spinning Without Anchoring" recovery.

## Purpose

Stop unproductive loops by forcing AI to:
1. Document what was tried
2. Identify the actual blocker
3. Choose new approach (anchor/troubleshoot/ask)

## Usage

Type `/interrupt` when AI shows these symptoms:
- Same error appears 3+ times
- Multiple attempts without diagnosis
- Continuous code changes without understanding why
- No progress for >10 minutes

## What It Does

Forces structured blocked report (sprint_workflow F2 requirement):

```
**What I'm trying to do:**
[One sentence - specific goal]

**What's blocking:**
[Specific technical blocker - not "not working"]

**What I tried:**
1. [Specific action 1] - [Result]
2. [Specific action 2] - [Result]
3. [Specific action 3] - [Result]

**Pattern detected:**
[Same error repeated / No diagnosis / Guessing without evidence]

**Next approach (choose ONE):**

Option A: ANCHOR
- Find authoritative source (official docs, SDK source, working example)
- Reference: [specific URL or file]
- What to verify: [specific claim]

Option B: TROUBLESHOOT
- Systematically test each component
- Isolate: [specific piece to test]
- Expected vs actual: [what should happen]

Option C: ASK
- Question for user: [specific question]
- Why needed: [what this unblocks]
- Context provided: [evidence collected so far]
```

## When to Use /interrupt

### DO Use When:
- AI repeats same failed approach 3+ times
- No root cause identified after multiple attempts
- Code changes without diagnosis ("try this instead")
- Stuck on technical issue >10 minutes

### DON'T Use When:
- AI is making measurable progress
- Different errors each time (exploring)
- Waiting for deployment/tests (expected delay)
- First or second attempt at solution

## Circuit Breaker Rules (M70)

After `/interrupt`, AI MUST:
1. Complete the blocked report template
2. Choose exactly ONE approach (A, B, or C)
3. Execute that approach before trying more code changes
4. NOT resume guessing without evidence

## Integration with Sprint Workflow

`/interrupt` triggers sprint_workflow F2 enforcement:
- Vague blocked reports REJECTED
- Must include all 4 required fields
- Circuit breaker limits apply (3 rejections → escalate)

## Examples

### Bad (Spinning):
```
AI: "Let me try changing the port..."
[Error]
AI: "Maybe it's the host setting..."
[Same error]
AI: "Let me adjust the transport..."
[Same error]
```

**Solution:** User types `/interrupt`

### Good (After Interrupt):
```
**What I'm trying to do:**
Get Railway deployment to accept external HTTP requests

**What's blocking:**
All external requests return 502, but logs show server starting on 127.0.0.1:8080

**What I tried:**
1. Changed port from 8000 to 8080 - Same 502
2. Added transport="sse" - Same 502
3. Checked Railway logs - Shows "Uvicorn running on http://127.0.0.1:8080"

**Pattern detected:**
Same 502 error regardless of port changes. Server binds to localhost, not external interface.

**Next approach: A (ANCHOR)**
- Authoritative source: FastMCP documentation on deployment
- What to verify: Default host binding behavior
- Expected: Documentation should specify host="0.0.0.0" for external access
```

## Recovery Paths

### Option A - ANCHOR (Recommended first)
1. Find official documentation
2. Verify current understanding
3. Identify specific misconception
4. Apply correct approach

### Option B - TROUBLESHOOT
1. List all components in workflow
2. Test each piece independently
3. Isolate the failing component
4. Fix that specific piece

### Option C - ASK
1. State specific question
2. Explain what it unblocks
3. Provide evidence collected
4. Wait for user response

## Success Criteria

After `/interrupt`, AI should:
- ✅ Stop repeating failed approach
- ✅ Document what was tried with evidence
- ✅ Identify actual root cause OR ask user
- ✅ Make progress on different path

NOT:
- ❌ Resume guessing with new variations
- ❌ Skip blocked report
- ❌ Try "one more thing" before diagnosis

## Pattern Sources

- M70: Spinning Without Anchoring or Asking
- sprint_workflow F2: No vague blocked reports
- LESSONS_LEARNED: systematic diagnosis required
