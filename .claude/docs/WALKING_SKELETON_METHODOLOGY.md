# Walking Skeleton Methodology

<!-- AI CONTEXT
WHAT: Use this approach when implementing features or debugging issues. Build minimal end-to-end first.
WHY: Prevents wasted effort on components that don't integrate. Isolates failures precisely.
HOW: Follow the phases below. Each phase must work before proceeding to next.
-->

**Date:** 2026-01-21
**Purpose:** Standard methodology for feature implementation and issue resolution

---

## CORE PRINCIPLE

**Build the thinnest possible end-to-end slice first, then add flesh.**

A walking skeleton is a minimal implementation that:
1. Touches all architectural layers
2. Proves the integration works
3. Can be tested immediately
4. Identifies failures precisely

---

## WHEN TO USE

| Scenario | Apply Walking Skeleton |
|----------|------------------------|
| New feature implementation | YES - always |
| Bug investigation | YES - isolate the failure |
| Integration work | YES - prove connection first |
| Refactoring | YES - verify behavior preserved |
| Simple one-file change | NO - overkill |

---

## THE PROCESS

### Phase 1: Define the Skeleton

Identify the minimal path through all layers:

```
[User Action] → [UI] → [API] → [Logic] → [Database] → [Response] → [UI Update]
```

**Example - Login Feature:**
```
Click Login → POST /api/auth/login → Validate credentials → Query users table → Return session → Redirect to dashboard
```

### Phase 2: Build the Thinnest Slice

Implement ONLY what's needed for one path to work:

| Layer | Skeleton Version | NOT Yet |
|-------|------------------|---------|
| UI | One button, one input | Validation, styling, error states |
| API | One endpoint, hardcoded response | Error handling, edge cases |
| Logic | Simplest happy path | Business rules, validation |
| Database | One query | Migrations, indexes, constraints |

**Rule:** Each layer returns a hardcoded success first. Replace with real logic incrementally.

### Phase 3: Verify End-to-End

Before adding ANY flesh:

1. **Deploy the skeleton** (not just local)
2. **Test the full path** (click through, not just unit test)
3. **Capture evidence** (screenshot, curl response, logs)

**If skeleton fails:** You've found the integration issue. Fix it before proceeding.

**If skeleton works:** The architecture is sound. Now add flesh.

### Phase 4: Add Flesh Incrementally

Add one capability at a time:

```
Skeleton → Add validation → Test → Add error handling → Test → Add edge cases → Test
```

**Rule:** Test after EVERY addition. If something breaks, you know exactly what caused it.

---

## DEBUGGING WITH WALKING SKELETON

When something doesn't work:

### Step 1: Strip to Skeleton

Remove everything except the minimal path:
- Comment out validation
- Hardcode values
- Remove error handling
- Simplify queries

### Step 2: Verify Skeleton Works

Does the stripped version work?

| Result | Action |
|--------|--------|
| Skeleton works | Bug is in the flesh you removed. Binary search to find it. |
| Skeleton fails | Bug is in core integration. Check each layer boundary. |

### Step 3: Binary Search

Add back half the removed code. Test.
- Works? Bug is in the other half.
- Fails? Bug is in this half.

Repeat until isolated.

---

## EVIDENCE REQUIREMENTS

At each phase, capture:

| Phase | Required Evidence |
|-------|-------------------|
| Skeleton defined | Written list of layers and minimal path |
| Skeleton built | Code committed (can be WIP branch) |
| Skeleton verified | Screenshot/curl showing end-to-end works |
| Flesh added | Test results after each addition |

---

## ANTI-PATTERNS

| Anti-Pattern | Problem | Fix |
|--------------|---------|-----|
| Build all layers, then integrate | Integration fails, don't know which layer | Build skeleton first |
| Add all features, then test | Multiple bugs compound | Test after each addition |
| Debug by guessing | Wastes time, may introduce new bugs | Strip to skeleton, binary search |
| Skip deployment verification | Works locally, fails deployed | Always verify deployed skeleton |

---

## SPRINT APPLICATION

### For PM (Planning)

Break deliverables into skeleton + flesh:

```markdown
## Day 1 Deliverables

### Skeleton (MUST complete first)
- [ ] POST /api/auth/signup returns 200 with hardcoded response
- [ ] Signup form submits (no validation)
- [ ] Database connection verified

### Flesh (after skeleton verified)
- [ ] Input validation
- [ ] Error messages
- [ ] Password hashing
- [ ] Duplicate email check
```

### For DEV (Execution)

1. Build skeleton items first
2. Get PM approval on working skeleton
3. Then add flesh items
4. Test after each flesh item

### For Debugging

If stuck for >30 minutes:
1. STOP adding code
2. Strip to skeleton
3. Verify skeleton
4. Binary search for failure

---

## KEY TAKEAWAY

**Never build a feature without a working skeleton first.**

The skeleton proves your architecture. The flesh is just details.

---

**END OF WALKING SKELETON METHODOLOGY**
