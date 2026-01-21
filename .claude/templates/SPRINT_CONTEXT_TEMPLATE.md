# Sprint Context: {SPRINT-ID}

<!-- AI CONTEXT
WHAT: Read this FIRST when starting work on this sprint. Contains all context needed.
WHY: PRD and project docs are too large. This extracts sprint-specific information.
HOW: Read sections relevant to your current task. Architecture decisions are binding.
-->

**Created:** {DATE}
**Sprint:** {SPRINT-ID}
**Day(s):** {DAY-NUMBERS}
**Goal:** {ONE-LINE-GOAL}

---

## 1. DELIVERABLES

What gets built this sprint.

| # | Deliverable | Type | Acceptance Criteria |
|---|-------------|------|---------------------|
| 1 | {name} | {API/UI/DB/Config} | {how to verify done} |
| 2 | ... | ... | ... |

---

## 2. ARCHITECTURE DECISIONS

Decisions that constrain implementation. These are BINDING.

| Decision | Rationale | Alternatives Rejected |
|----------|-----------|----------------------|
| {decision} | {why} | {what we didn't choose and why} |

---

## 3. DATABASE SCHEMA

Tables this sprint creates or modifies.

### New Tables

```sql
-- Table: {table_name}
-- Purpose: {why this table exists}
CREATE TABLE {table_name} (
    {column} {type} {constraints},
    ...
);
```

### Modified Tables

| Table | Change | Migration |
|-------|--------|-----------|
| {table} | {add column X} | {ALTER statement} |

---

## 4. API CONTRACTS

Endpoints this sprint creates or uses.

### New Endpoints

```
{METHOD} {PATH}
Request:
{
    "field": "type - description"
}

Response (success):
{
    "field": "type - description"
}

Response (error):
{
    "error": "string",
    "code": "string"
}
```

### Existing Endpoints Used

| Endpoint | Purpose | Notes |
|----------|---------|-------|
| {endpoint} | {why we call it} | {any special handling} |

---

## 5. DESIGN REFERENCES

Visual references for UI work. Include file paths.

| Reference | Path | What to Extract |
|-----------|------|-----------------|
| {name} | {path/to/file} | {specific elements to use} |

### Color Palette (if UI)

| Name | Hex | Usage |
|------|-----|-------|
| {name} | {#hex} | {where used} |

### Component Specs (if UI)

| Component | Dimensions | Behavior |
|-----------|------------|----------|
| {name} | {size} | {interactions} |

---

## 6. DEPENDENCIES

What must exist before this sprint can execute.

### Required Before Start

| Dependency | Status | Blocker If Missing |
|------------|--------|-------------------|
| {item} | {exists/missing} | {what can't proceed} |

### External Services

| Service | Purpose | Config Needed |
|---------|---------|---------------|
| {service} | {why} | {env vars, setup} |

---

## 7. ENVIRONMENT

Infrastructure details for this sprint.

### Railway Services

| Service | Environment | URL | Branch |
|---------|-------------|-----|--------|
| {name} | {env} | {url if known} | {git branch} |

### Environment Variables

| Variable | Service | Value/Source |
|----------|---------|--------------|
| {VAR_NAME} | {service} | {where to get it} |

### Database Connections

| Database | Service | Connection |
|----------|---------|------------|
| {name} | {which Railway service} | {DATABASE_URL source} |

---

## 8. REPOSITORY CONTEXT

Where code lives and branch strategy.

| Repo | Purpose | Branch |
|------|---------|--------|
| {repo} | {what it contains} | {which branch to use} |

### File Locations

| What | Path |
|------|------|
| {component/feature} | {path in repo} |

---

## 9. TESTING REQUIREMENTS

How to verify this sprint's deliverables.

### Automated Tests

| Test Type | Command | What It Verifies |
|-----------|---------|------------------|
| {unit/integration/e2e} | {command} | {what passes means} |

### Manual Verification

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | {do this} | {see this} |

### Browser Testing (if UI)

| Browser | Viewport | Must Pass |
|---------|----------|-----------|
| {browser} | {size} | {specific checks} |

---

## 10. RISKS AND MITIGATIONS

Known risks for this sprint.

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| {risk} | {H/M/L} | {H/M/L} | {what to do if it happens} |

---

## 11. AGENT CONSULTATION REQUIRED

Which architect agents must be consulted before implementation.

| Technology | Agent | Trigger |
|------------|-------|---------|
| {tech} | {agent file path} | {when to consult} |

---

## 12. OPEN QUESTIONS

Questions that need answers before or during sprint.

| # | Question | Answer | Answered By |
|---|----------|--------|-------------|
| 1 | {question} | {answer or TBD} | {who answered} |

---

## EXTRACTION LOG

Documents this context was extracted from.

| Source | Sections Used | Date |
|--------|---------------|------|
| {document path} | {which sections} | {when extracted} |

---

**END OF SPRINT CONTEXT**
