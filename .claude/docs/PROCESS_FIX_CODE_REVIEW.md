<!-- AI CONTEXT
WHAT: Enforce code-reviewer agent before PM review. PM cannot approve without code review passing.
WHY: Sprint S2.1 PM approved broken code with false claim "session= matches Auth.js convention" - Auth.js uses __Secure-authjs.session-token.
HOW: Code-reviewer MUST be spawned before PM. All library claims require citations. No guessing.
-->

# Process Fix: Code Review Enforcement

**Date:** 2026-01-21
**Source:** Sprint S2.1 Post-Mortem Analysis
**Purpose:** Prevent false claims from causing UAT failures

---

## The Problem

PM approved a checkpoint with this claim:

```
| No hardcoded values | PASS | Cookie name `session=` matches Auth.js convention |
```

**THIS IS FALSE.**

Auth.js uses:
- Production: `__Secure-authjs.session-token`
- Development: `authjs.session-token`
- CSRF: `__Host-authjs.csrf-token`

Auth.js does NOT use a cookie named `session=`. This false claim led to 7+ UAT failures.

---

## Root Causes

### 1. Code-Reviewer Agent Never Spawned

**Expected flow (run-sprint.md Step 3.4):**
```
DEV submits checkpoint
    ↓
Orchestrator spawns code-reviewer agent
    ↓
Code-reviewer verifies: architecture, tests, security, quality
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
PM approves without verification
```

### 2. False Claim Without Citation

PM wrote: "Cookie name `session=` matches Auth.js convention"

PM should have:
1. Read Auth.js documentation
2. Grepped actual cookie creation code
3. Cited the source

---

## Mandatory Fixes

### Fix 1: Orchestrator MUST Spawn Code-Reviewer

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

### Fix 2: Blocking Gate Before PM Review

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

### Fix 3: Claim Verification Required

All claims about external libraries MUST include citations:

| Claim Type | Required Evidence |
|------------|-------------------|
| Cookie names | Grep actual cookie creation code |
| Session handling | Read session.ts or equivalent |
| Security properties | Quote from security documentation |
| API behavior | Curl the actual API, paste response |

**Examples:**

❌ WRONG: "Cookie name matches Auth.js convention"

✅ RIGHT: "Auth.js v5 uses `__Secure-authjs.session-token` (source: node_modules/next-auth/src/lib/init.ts line 45)"

### Fix 4: PM Boundaries

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

---

## Checklist Before PM Approval

- [ ] Code-reviewer agent was spawned
- [ ] code-review-X.md exists
- [ ] Code review decision is APPROVED
- [ ] All library claims cite sources
- [ ] No factual statements without verification

---

## Anti-Patterns

| Anti-Pattern | Problem | Fix |
|--------------|---------|-----|
| PM does code review | PM lacks technical depth | Spawn code-reviewer agent |
| "Matches convention" without source | May be false | Require citation |
| Approving without code-review-X.md | Skipped quality gate | Block PM until file exists |
| Guessing library behavior | Leads to bugs | Grep code or read docs |

---

**END OF PROCESS FIX**
