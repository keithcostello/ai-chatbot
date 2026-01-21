# CHECKPOINT 2 REJECTION

**Status:** REJECTED
**Reviewer:** PM
**Date:** 2025-12-05

---

## Rejection Reason

**REJECTED: Missing risk documentation.**

Add RISKS IDENTIFIED section showing what could break if `add()` receives non-numeric inputs.

---

## Required Action

Revise checkpoint-2.md to include the following section before ISSUES.MD STATUS:

```
═══════════════════════════════════════════════════════════════
RISKS IDENTIFIED
═══════════════════════════════════════════════════════════════
| Risk | Mitigation |
|------|------------|
| [identify what happens with non-numeric inputs] | [how to handle it] |
```

Consider risks such as:
- `add("hello", "world")` - string concatenation instead of addition
- `add(None, 5)` - TypeError
- `add([1,2], [3,4])` - list concatenation instead of numeric addition

---

## Resubmission Instructions

1. Update checkpoint-2.md with RISKS IDENTIFIED section
2. Commit changes: `git commit --amend -m "Checkpoint 2 complete - with risk documentation"`
3. Push to branch
4. Relay: "Checkpoint 2 revised - ready for re-review"

---

STOP - Awaiting DEV revision.
