# Sprint 5.0 - Greet Function

## Sprint Goal
Create a function called greet() that returns the string "Hello".

---

## Success Criteria

| # | Criterion | Testable Evidence |
|---|-----------|-------------------|
| 1 | greet.py file exists in project root | File present at expected path |
| 2 | greet() function is defined | Function exists and is callable |
| 3 | greet() returns "Hello" | Calling greet() returns exactly "Hello" |
| 4 | greet() takes no parameters | Function signature is greet() with no args |
| 5 | Function has docstring | Docstring describes function purpose |
| 6 | test_greet.py exists with pytest tests | Test file present with valid pytest structure |
| 7 | Unit tests pass | pytest shows all tests passing |
| 8 | UAT.md created with manual test results | UAT file shows >=85% pass rate |

**Total: 8 criteria - All must be met for Grade A**

---

## File Manifest

### Files to Create
| File | Path | Purpose |
|------|------|---------|
| greet.py | /greet.py | Module with greet() function |
| test_greet.py | /test_greet.py | Pytest unit tests for greet() |
| ISSUES.md | /work/sprint-5/microsprint-5.0/ISSUES.md | Issue tracking (created in Phase 0) |
| UAT.md | /work/sprint-5/microsprint-5.0/UAT.md | User acceptance tests (created in Phase 3) |

### Files to Modify
None - this is a new module

### Protected Files (DO NOT MODIFY)
All files in .claude/ directory

---

## Phase Breakdown

### Phase 0: READY + ISSUES.md (10 min)
- Submit READY confirmation with file citations
- Create ISSUES.md with header row
- **Checkpoint 0 Evidence:** READY format complete, ISSUES.md exists

### Phase 1: Implementation (20 min)
- Create greet.py with greet() function
- Implement function to return "Hello"
- Add docstring with description
- Create test_greet.py with pytest tests
- Run pytest and show all tests passing
- **Checkpoint 1 Evidence:** greet.py exists, greet() function defined with docstring, pytest output showing tests passing, manual terminal test showing greet() returns "Hello"

### Phase 2: Documentation (15 min)
- Create UAT.md with manual acceptance tests
- Finalize ISSUES.md with all issues resolved/documented
- Update C4_DIAGRAMS.md (if exists) or skip if N/A
- Update API_REFERENCE.md (if exists) or skip if N/A
- **Checkpoint 2 Evidence:** UAT.md shows >=85% pass rate, ISSUES.md finalized

**Total Estimated Time: 45 minutes**

---

## Technical Specification

### Greet Function API

```python
# greet.py

def greet():
    """
    Return a greeting message.

    Returns:
        String containing "Hello"

    Examples:
        >>> greet()
        'Hello'
    """
    return "Hello"
```

### Implementation Requirements

- **Function name:** Must be exactly `greet` (lowercase)
- **Parameters:** Function takes no parameters
- **Return value:** Must return the exact string `"Hello"` (not "hello" or "HELLO")
- **Docstring:** Include description, Returns section, and example

### Test Requirements

Minimum test cases:

1. **test_greet_returns_hello:** Call greet() and assert it returns "Hello"
2. **test_greet_returns_string:** Verify return value is a string type
3. **test_greet_no_parameters:** Verify function can be called with no arguments

---

## Checkpoint Evidence Requirements

### Checkpoint 0 (READY)
- [ ] READY confirmation with all 6 sections complete
- [ ] File citations include specific line numbers
- [ ] Success criteria mapped 1:1 to tasks
- [ ] Phase 2 documentation explicitly listed
- [ ] ISSUES.md created with header row

### Checkpoint 1 (Implementation)
- [ ] greet.py file created
- [ ] greet() function defined with correct signature (no parameters)
- [ ] Function returns exactly "Hello"
- [ ] Docstring present with description and example
- [ ] test_greet.py created
- [ ] pytest output showing all tests passing (minimum 3 tests)
- [ ] Terminal output showing manual test: `python -c "from greet import greet; print(greet())"` outputs "Hello"

### Checkpoint 2 (Documentation)
- [ ] UAT.md created with pass rate >=85%
- [ ] ISSUES.md finalized (all issues resolved or documented)
- [ ] All success criteria marked complete with evidence

---

## READY Format Template

```
READY CONFIRMATION - Sprint 5.0

═══════════════════════════════════════════════════════════════
SECTION 1: FILES READ (with line number citations)
═══════════════════════════════════════════════════════════════
- .claude/handoffs/sprint-5.0-prompt.md: Lines [X-Y] - [specific content]
- .claude/roles/dev_role.md: Lines [X-Y] - [specific content about READY format]
- [any other project files]: Lines [X-Y] - [specific content]

═══════════════════════════════════════════════════════════════
SECTION 2: ARCHITECTURE UNDERSTANDING
═══════════════════════════════════════════════════════════════
Blue (Orchestrator): N/A - standalone function module
Green (Contract): greet() function interface - no parameters, returns string "Hello"
Red (Plugin): N/A - standalone function module

Data Flow: greet() called -> returns hardcoded string "Hello"

═══════════════════════════════════════════════════════════════
SECTION 3: SUCCESS CRITERIA MAPPING
═══════════════════════════════════════════════════════════════
| # | Success Criterion | My Task | Phase |
|---|-------------------|---------|-------|
| 1 | greet.py file exists | Create greet.py | Phase 1 |
| 2 | greet() function is defined | Implement greet function | Phase 1 |
| 3 | greet() returns "Hello" | Return "Hello" string | Phase 1 |
| 4 | greet() takes no parameters | Define function with no args | Phase 1 |
| 5 | Function has docstring | Add docstring with description | Phase 1 |
| 6 | test_greet.py exists with pytest tests | Create test file | Phase 1 |
| 7 | Unit tests pass | Run pytest successfully | Phase 1 |
| 8 | UAT.md created with manual test results | Create UAT documentation | Phase 2 |

═══════════════════════════════════════════════════════════════
SECTION 4: PHASE BREAKDOWN WITH TIME ESTIMATES
═══════════════════════════════════════════════════════════════
- Phase 0: READY + ISSUES.md (10 min)
- Phase 1: Implementation - greet.py, test_greet.py, pytest (20 min)
- Phase 2: Documentation - UAT.md, ISSUES.md final (15 min)
Total: 45 min

═══════════════════════════════════════════════════════════════
SECTION 5: RISKS IDENTIFIED
═══════════════════════════════════════════════════════════════
| Risk | Mitigation |
|------|------------|
| [identify specific risks] | [mitigation plan] |

═══════════════════════════════════════════════════════════════
SECTION 6: FIRST TASK
═══════════════════════════════════════════════════════════════
First task: Create ISSUES.md with required header row

---
GIT:
git checkout -b dev-sprint-5.0
git add .
git commit -m "READY submitted - Sprint 5.0"
git push origin dev-sprint-5.0

RELAY TO PM: "READY submitted for review on dev-sprint-5.0"

STOP - Awaiting PM approval.
```

---

## Working Rules

### MUST Do
| Action | When | Evidence |
|--------|------|----------|
| Create ISSUES.md | Phase 0, before code | File with header: Issue \| Type \| Severity \| Status \| Root Cause \| Resolution |
| Cite line numbers | READY and all file references | Specific lines like "45-52", not "entire file" |
| Return exact string | greet() implementation | Must return "Hello" exactly, not variations |
| Add docstring | Function definition | Docstring with description, Returns, and example |
| Create unit tests | Phase 1 | Minimum 3 pytest tests in test_greet.py |
| Create UAT.md | Phase 2 | File present with >=85% pass rate |
| STOP after checkpoint | Every checkpoint | "STOP - Awaiting PM approval" |

### MUST NOT Do
| Forbidden Action | Consequence |
|------------------|-------------|
| Skip READY gate | Immediate termination |
| Skip Phase 2 documentation | Checkpoint rejected |
| Continue after STOP | Immediate termination |
| Modify .claude/ files | Immediate termination |
| Fabricate test results | Immediate termination |
| Return wrong string | Checkpoint rejected - must return "Hello" exactly |
| Add parameters to greet() | Checkpoint rejected - function must take no arguments |

---

## UAT Acceptance Tests

Your UAT.md must include these test cases at minimum:

### TC-01: Greet Returns Hello
| Step | Action | Expected | Status |
|------|--------|----------|--------|
| 1 | Import greet module | Module loads without error | |
| 2 | Call greet() | Returns "Hello" | |
| 3 | Verify exact string | Value is exactly "Hello" (not "hello" or "HELLO") | |

### TC-02: Greet Returns String Type
| Step | Action | Expected | Status |
|------|--------|----------|--------|
| 1 | Call greet() | Returns a value | |
| 2 | Check type | Value is type str | |

### TC-03: Greet Takes No Parameters
| Step | Action | Expected | Status |
|------|--------|----------|--------|
| 1 | Call greet() with no arguments | No TypeError raised | |
| 2 | Verify function works | Returns "Hello" | |

### TC-04: Greet Has Docstring
| Step | Action | Expected | Status |
|------|--------|----------|--------|
| 1 | Check greet.__doc__ | Docstring is not None | |
| 2 | Verify docstring content | Contains description of function | |

**Pass Threshold: 85% (at least 4/4 test cases must pass)**

---

## Git Branch
Branch name: `dev-sprint-5.0`

Create branch at start of Phase 0:
```bash
git checkout -b dev-sprint-5.0
```

All commits and pushes go to this branch until sprint completion and PM approval.

---

## Notes for DEV

1. **Simple implementation** - This is a straightforward function, no complex logic needed
2. **Exact string** - Must return "Hello" exactly as specified (case-sensitive)
3. **No parameters** - Function signature must be `def greet():` with no arguments
4. **Testing** - Use pytest for unit tests, test the return value and type
5. **STOP discipline** - Do not continue past checkpoints without PM approval
6. **Documentation** - Even simple functions need UAT.md and ISSUES.md completion

---

## PM Review Notes

This PROMPT.md satisfies all requirements per pm_role.md lines 54-74:
- [x] Sprint ID and Goal (1 sentence)
- [x] Success Criteria (8 specific, testable items)
- [x] File Manifest (create, modify, protected)
- [x] Phase Breakdown with time estimates
- [x] Checkpoint structure with exact evidence requirements
- [x] Technical specification (API with docstring template and example)
- [x] READY format template (all 6 sections)
- [x] Working Rules (MUST/MUST NOT tables)
- [x] UAT acceptance test steps (4 test cases with 85% threshold)
- [x] Git branch name

Ready for DEV execution.
