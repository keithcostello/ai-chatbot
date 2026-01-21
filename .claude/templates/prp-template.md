<!-- AI CONTEXT
WHAT: Copy this template when creating a new Product Requirement Plan (PRP). Fill all sections.
WHY: PRPs provide structured context for implementation. Without them, AI lacks scope/success criteria.
HOW: 1) Copy to PRPs/feature-name.md 2) Fill Goal, Why, What, Context, Tasks, Validation 3) Use during sprint
-->

# PRP: {Feature Name}

**Created:** {date}
**Status:** Draft | Ready | In Progress | Complete

---

## Goal

{One sentence: What specific end-state will exist when this is done?}

---

## Why

{2-3 sentences: Business value, problem being solved, why now}

---

## What

### User-Visible Behavior

{What will the user see/experience differently?}

### Success Criteria

- [ ] {Specific, testable criterion 1}
- [ ] {Specific, testable criterion 2}
- [ ] {Specific, testable criterion 3}

---

## Context

### Files to Modify

| File | Changes |
|------|---------|
| {path} | {what changes} |

### Files to Create

| File | Purpose |
|------|---------|
| {path} | {responsibility} |

### Reference Patterns

{Existing code to follow as examples}

```
{file path}:{line numbers}
```

### Gotchas

- {Known issues, quirks, or things to watch out for}

---

## Tasks

Ordered implementation steps:

### 1. {First Task}

**Action:** MODIFY | CREATE | DELETE
**File:** {path}

```
{Pseudocode or specific changes}
```

### 2. {Second Task}

**Action:** MODIFY | CREATE | DELETE
**File:** {path}

```
{Pseudocode or specific changes}
```

### 3. {Third Task}

...

---

## Validation

### Level 1: Syntax & Style

```bash
# Run linter/formatter
{command}
```

### Level 2: Unit Tests

```bash
# Run tests for this feature
{command}
```

**Test cases:**
- [ ] Happy path: {description}
- [ ] Edge case: {description}
- [ ] Error case: {description}

### Level 3: Integration

```bash
# Verify end-to-end
{command or manual steps}
```

---

## Anti-Patterns

Do NOT:
- {Specific thing to avoid}
- {Another thing to avoid}

---

## Confidence: {X}/10

{What would increase confidence? Missing information? Unclear requirements?}
