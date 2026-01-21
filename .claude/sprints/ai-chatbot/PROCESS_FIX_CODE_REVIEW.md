<!-- AI CONTEXT
WHAT: Root cause analysis of why code review failed in Sprint S2.1 and mandatory fixes.
WHY: PM "approved" hasSessionCookie() with false claim "matches Auth.js convention" - it doesn't.
HOW: Enforce code-reviewer agent BEFORE PM. PM cannot approve until code review passes.
-->

# Process Fix: Code Review Failure Analysis

**Sprint:** S2.1
**Date:** 2026-01-21
**Issue:** Code review approved broken code

---

## The Smoking Gun

From `pm-code-review-dashboard.md` line 27:

```
| No hardcoded values | PASS | Cookie name `session=` matches Auth.js convention |
```

**THIS IS FALSE.**

Auth.js uses:
- Production: `__Secure-authjs.session-token`
- Development: `authjs.session-token`
- CSRF: `__Host-authjs.csrf-token`

Auth.js does NOT use a cookie named `session=`.

The PM made an authoritative-sounding claim without verifying against actual Auth.js behavior. This false claim led to approval of broken code.

---

## What Went Wrong

### 1. Code-Reviewer Agent Never Spawned

**Expected flow (from run-sprint.md Step 3.4):**
```
DEV submits checkpoint
    ↓
Orchestrator spawns code-reviewer agent
    ↓
Code-reviewer checks: architecture, tests, security, quality
    ↓
Code-reviewer writes code-review-X.md
    ↓
If PASS → PM reviews alignment
If FAIL → DEV fixes
```

**Actual flow:**
```
DEV submits checkpoint
    ↓
PM does "code review" directly (WRONG)
    ↓
PM approves (no code-reviewer)
```

### 2. PM Made False Claim

PM wrote: "Cookie name `session=` matches Auth.js convention"

PM should have:
1. Read Auth.js documentation
2. Checked what cookies Auth.js actually creates
3. Verified the claim before making it

### 3. No Reference Check

The `hasSessionCookie()` function checks for `session=` cookie.
Auth.js creates `__Secure-authjs.session-token` cookie.
These don't match. This should have been caught by:
- Reading the Auth.js source code
- Checking browser DevTools cookies after Auth.js login
- Grepping for cookie names in the codebase

---

## Mandatory Fixes

### Fix 1: Orchestrator MUST Spawn Code-Reviewer

**In run-sprint.md Phase 3, Step 3.4:**

```python
# MANDATORY - Cannot skip
code_review = Task(subagent_type="code-reviewer", prompt="""
PHASE 3 - CODE QUALITY REVIEW

Sprint: {sprint_path}
Checkpoint: checkpoint-3.md

Verify:
1. Architecture compliance
2. Test coverage
3. Security scan
4. Code quality

Write: {sprint_path}/checkpoints/code-review-3.md

Return APPROVED or REJECTED with evidence.
""")

# BLOCKING - PM cannot review until code review passes
if code_review.decision != "APPROVED":
    return DEV_FIX_REQUIRED
```

### Fix 2: Code-Reviewer Must Verify Claims Against Sources

Add to `code-reviewer.md`:

```markdown
## CLAIM VERIFICATION (MANDATORY)

If your checkpoint contains ANY claim about:
- Library behavior (e.g., "Auth.js uses X cookie")
- Framework conventions (e.g., "Next.js pattern")
- Security properties (e.g., "HttpOnly cookies")

You MUST:
1. Read the official documentation
2. Paste the relevant quote
3. Cite the source

Example:
❌ WRONG: "Cookie name matches Auth.js convention"
✅ RIGHT: "Auth.js v5 uses `__Secure-authjs.session-token` (source: node_modules/next-auth/src/lib/init.ts line 45)"
```

### Fix 3: PM Cannot Do Code Review

Add to `pm_role.md`:

```markdown
## PM BOUNDARIES

PM DOES:
- Review sprint alignment (does code match goal?)
- Verify DEV followed the plan
- Run UAT tests

PM DOES NOT:
- Review code quality (code-reviewer does this)
- Make claims about library internals
- Approve based on "looks correct"

If PM receives a checkpoint without code-review-X.md:
→ REJECT immediately
→ Message: "Missing code review. Spawn code-reviewer first."
```

### Fix 4: Orchestrator Gate

Add to orchestrator flow:

```python
def can_pm_review(checkpoint_number):
    code_review_file = f"checkpoints/code-review-{checkpoint_number}.md"
    if not file_exists(code_review_file):
        return False, "Code review required before PM review"

    code_review = read(code_review_file)
    if code_review.decision != "APPROVED":
        return False, "Code review must pass before PM review"

    return True, None
```

---

## Evidence Required in Code Reviews

For ANY code involving external libraries:

| Claim Type | Required Evidence |
|------------|-------------------|
| Cookie names | Grep actual cookie creation code |
| Session handling | Read session.ts or equivalent |
| Security properties | Quote from security documentation |
| API behavior | Curl the actual API, paste response |

**No guessing. No assumptions. Verify or don't claim.**

---

## Checklist for Future Sprints

Before PM approval:

- [ ] Code-reviewer agent was spawned
- [ ] code-review-X.md exists
- [ ] Code review decision is APPROVED
- [ ] All claims cite sources
- [ ] No factual statements without verification

---

## Apply to This Sprint

Immediate action for Sprint S2.1:

1. Spawn code-reviewer for current state
2. Verify all Auth.js claims against actual Auth.js code
3. Document what cookies Auth.js actually creates
4. Fix any code that assumes wrong cookie names

---

**END OF PROCESS FIX**
