# Sprint Pre/Post Protocol

**Version:** 1.0
**Created:** 2025-12-30
**Source:** Sprint 1.B.2 learnings

---


## Purpose

Enforce baseline capture BEFORE sprint work and verification AFTER to:
1. Detect regressions
2. Prevent scope creep
3. Catch architecture violations
4. Provide audit trail

---

**Anchor:** AI MUST anchor dataset to task specific related industry experts who can be referenced prior to beginning task. 
AI must disclose anchor points before beginning task. Anchor must have a referencable link that can be click and verified.
AI must PROVE that when it anchors it is NOT using only training data and has read available information to learn and improve output via anchoring.

## PRE-SPRINT CHECKS (Guardian Role)

Run BEFORE any code changes. Capture baseline.

### 1. Architecture Verification

```bash
# Count Red→Red imports (violations)
grep -rn "from steertrue\.red" steertrue/red/ --include="*.py" | wc -l

# Count Blue→Red imports (violations)
grep -rn "from steertrue\.red" steertrue/blue/ --include="*.py" | wc -l

# Count Green→Red imports (allowed but track)
grep -rn "from steertrue\.red" steertrue/green/ --include="*.py" | wc -l
```

**Document in:** `checkpoints/pre-sprint-baseline.md`

### 2. Test Suite Baseline

```bash
pytest steertrue/tests/ -v --tb=short 2>&1 | tail -5
```

**Capture:** Total passed, failed, skipped counts.

### 3. File Manifest

List files in original scope from PROMPT.md:

```markdown
| File | In Scope? | Reason |
|------|-----------|--------|
| steertrue/red/aipl_parser.py | ✅ | R1 parser fix |
```

### 4. Success Criteria Baseline

From PROMPT.md, extract SC-01 through SC-XX. Document pass/fail BEFORE work.

### 5. Acceptance Test Command Validation (Sprint F-1.5.4)

**MANDATORY for sprints with API endpoints or integration tests**

Before sprint work begins, validate that acceptance test commands actually work:

```bash
# For each acceptance test command in PROMPT.md:
# 1. Execute the command
# 2. Document the ACTUAL response
# 3. If command fails with 404/500, STOP - endpoint may not exist

# Example validation:
curl -s https://[deployment-url]/api/v1/[endpoint] | head -20
```

**If acceptance test endpoint does NOT exist:**
- STOP immediately
- Document in pre-sprint baseline as BLOCKER
- Escalate to PM for scope revision

**Why this check exists:**
Sprint F-1.5.4 discovered at Checkpoint 3 that the API endpoint assumed by acceptance tests did not exist. This caused significant rework. This section prevents that scenario.

### 6. Endpoint Existence Check (Sprint F-1.5.4)

**MANDATORY for sprints that consume API endpoints**

For each API endpoint referenced in PROMPT.md success criteria:

```bash
# Check endpoint returns something other than 404
curl -s -o /dev/null -w "%{http_code}" https://[deployment-url]/api/v1/[endpoint]
```

**Expected results:**
- 200, 201, 400, 403, 500 = Endpoint EXISTS (may have business logic issues, but exists)
- 404 = Endpoint DOES NOT EXIST (BLOCKER)

**Document in pre-sprint baseline:**
| Endpoint | HTTP Status | Exists? |
|----------|-------------|---------|
| GET /api/v1/blocks/{layer}/{name} | 200 | ✅ |
| GET /api/v1/nonexistent | 404 | ❌ BLOCKER |

---

## POST-SPRINT CHECKS (Guardian Role)

Run AFTER all code changes, BEFORE merge gate.

### 1. Architecture Delta

```bash
# Re-run same counts
Red→Red: [current] vs [baseline] = Δ[diff]
Blue→Red: [current] vs [baseline] = Δ[diff]
```

**Red Flag:** Any increase requires BUG REPORT, not fix.

### 2. Test Suite Delta

```bash
pytest steertrue/tests/ -v --tb=short 2>&1 | tail -5
```

**Compare:**
- Passed: [current] vs [baseline]
- Failed: Must be 0
- New tests added: Document which

### 3. Files Modified Audit

```bash
git diff --name-only [baseline-commit]..[current-commit]
```

**Compare to manifest:**
- In scope: ✅
- Out of scope (human-directed): ⚠️ Document approval
- Out of scope (no approval): ❌ BLOCKER

### 4. Success Criteria Verification

Re-run each SC-XX. Document pass/fail AFTER work.

### 5. Consumer Handoff Test (Sprint F-1.5.4)

**MANDATORY for sprints that create API endpoints for downstream consumers**

Before merge, verify that downstream consumers can actually use the new endpoint:

```bash
# Test the endpoint as a consumer would:
curl -s https://[deployment-url]/api/v1/[new-endpoint] | jq '.'

# Verify response matches documented schema
# Verify all expected fields are present
# Verify field types match documentation
```

**Consumer Handoff Checklist:**
- [ ] Endpoint returns expected HTTP status codes
- [ ] Response body matches documented JSON Schema
- [ ] All advertised fields are present in response
- [ ] Array fields serialize as arrays (not null)
- [ ] Nullable fields serialize as null (not empty string)

**Why this check exists:**
Prevents situations where an endpoint is created but doesn't actually work for consumers. Sprint F-1.5.4 required this verification.

---

## BLOCKER CONDITIONS

Sprint CANNOT proceed to merge if:

| Condition | Action |
|-----------|--------|
| Architecture violations increased | Create BUG report, route to PM |
| Tests fail | Fix in sprint or defer with BUG report |
| Files modified outside scope without approval | Revert or get human approval |
| Success criteria not met | Fix or defer with BUG report |

---

## Template: Pre-Sprint Baseline

```markdown
# Pre-Sprint Baseline: Sprint [ID]

**Date:** [UTC timestamp]
**Branch:** [branch name]

## Architecture Counts
- Red→Red: [count]
- Blue→Red: [count]
- Green→Red: [count]

## Test Suite
- Passed: [count]
- Failed: [count]
- Skipped: [count]

## File Manifest
| File | In Scope | Reason |
|------|----------|--------|
| [file] | ✅/❌ | [reason] |

## Success Criteria
| SC | Description | Baseline |
|----|-------------|----------|
| SC-01 | [description] | ⏳/✅/❌ |
```

---

## Template: Post-Sprint Check

```markdown
# Post-Sprint Check: Sprint [ID]

**Date:** [UTC timestamp]
**Baseline Commit:** [commit]
**Current Commit:** [commit]

## Architecture Delta
| Metric | Before | After | Δ | Status |
|--------|--------|-------|---|--------|
| Red→Red | [n] | [n] | [+/-] | ✅/⚠️/❌ |
| Blue→Red | [n] | [n] | [+/-] | ✅/⚠️/❌ |

## Test Suite Delta
| Metric | Before | After | Status |
|--------|--------|-------|--------|
| Passed | [n] | [n] | ✅/❌ |
| Failed | [n] | [n] | ✅/❌ |

## Files Modified
| File | In Manifest | Approval |
|------|-------------|----------|
| [file] | ✅/❌ | Human/None |

## Success Criteria
| SC | Before | After | Status |
|----|--------|-------|--------|
| SC-01 | ⏳ | ✅ | ✅ |

## Red Flags
- [List any issues]

## Recommendation
[APPROVE / CONDITIONAL APPROVE / BLOCK]
```

---

## Enforcement

- Pre-sprint baseline MANDATORY before first commit
- Post-sprint check MANDATORY before merge gate
- Architecture increases = BUG REPORT (not direct fix)
- PM assigns all fixes, orchestrator does not fix directly

---

**END PROTOCOL**
