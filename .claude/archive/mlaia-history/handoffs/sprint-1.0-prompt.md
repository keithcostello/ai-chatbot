# Sprint 1.0 - Calculator Module

## Sprint Goal
Create a production-ready calculator.py module with mathematical operations (add, subtract, multiply, divide), comprehensive input validation, error handling, and complete test coverage.

---

## Success Criteria

| # | Criterion | Testable Evidence |
|---|-----------|-------------------|
| 1 | calculator.py file exists in project root | File present at expected path |
| 2 | add(a, b) function returns sum of two numbers | Function call add(2, 3) returns 5 |
| 3 | subtract(a, b) function returns difference | Function call subtract(5, 3) returns 2 |
| 4 | multiply(a, b) function returns product | Function call multiply(4, 3) returns 12 |
| 5 | divide(a, b) function returns quotient | Function call divide(10, 2) returns 5.0 |
| 6 | All functions handle integer inputs | Functions accept int types without error |
| 7 | All functions handle float inputs | Functions accept float types without error |
| 8 | All functions validate input types | Non-numeric inputs raise TypeError |
| 9 | TypeError raised for string inputs | Passing "abc" raises TypeError with message |
| 10 | TypeError raised for None inputs | Passing None raises TypeError with message |
| 11 | TypeError raised for list/dict inputs | Passing [1,2] raises TypeError with message |
| 12 | divide() raises ZeroDivisionError for zero divisor | divide(5, 0) raises ZeroDivisionError |
| 13 | ZeroDivisionError has descriptive message | Error message includes "division by zero" |
| 14 | test_calculator.py exists with pytest tests | Test file present with valid pytest structure |
| 15 | All four operations have passing unit tests | pytest shows 4+ tests passing |
| 16 | Input validation has comprehensive tests | Tests verify all invalid input types |
| 17 | Division by zero has dedicated test | Test specifically validates ZeroDivisionError |
| 18 | Test coverage is 100% for calculator.py | Coverage report shows 100% line coverage |
| 19 | All functions have docstrings | Each function has description, args, returns, raises |
| 20 | Code follows PEP 8 style guidelines | No flake8/pylint warnings |

**Total: 20 criteria - All must be met for Grade A**

---

## File Manifest

### Files to Create
| File | Path | Purpose |
|------|------|---------|
| calculator.py | /calculator.py | Main calculator module with operations |
| test_calculator.py | /test_calculator.py | Pytest unit tests for calculator |
| ISSUES.md | /work/sprint-1/microsprint-1.0/ISSUES.md | Issue tracking (created in Phase 0) |
| UAT.md | /work/sprint-1/microsprint-1.0/UAT.md | User acceptance tests (created in Phase 5) |

### Files to Modify
None - this is a new module

### Protected Files (DO NOT MODIFY)
All files in .claude/ directory

---

## Phase Breakdown

### Phase 0: READY + ISSUES.md (15 min)
- Submit READY confirmation with file citations
- Create ISSUES.md with header row
- **Checkpoint 0 Evidence:** READY format complete, ISSUES.md exists

### Phase 1: Core Calculator Functions (30 min)
- Create calculator.py with add(), subtract(), multiply(), divide()
- Implement basic arithmetic logic for each function
- Add function docstrings
- **Checkpoint 1 Evidence:** calculator.py exists, all 4 functions defined, manual test shows basic functionality

### Phase 2: Input Validation (25 min)
- Add type validation to all functions (check for numeric types)
- Raise TypeError with descriptive messages for invalid inputs
- Add division by zero check to divide()
- Test validation manually with various invalid inputs
- **Checkpoint 2 Evidence:** Terminal output showing TypeError for strings/None, ZeroDivisionError for divide(x, 0)

### Phase 3: Unit Tests (35 min)
- Create test_calculator.py with pytest
- Write tests for all four operations with valid inputs
- Write tests for type validation (string, None, list, dict)
- Write test for division by zero
- Run pytest and show all tests passing
- **Checkpoint 3 Evidence:** pytest output showing X/X tests passing, test file with complete coverage

### Phase 4: Code Quality and Coverage (20 min)
- Run coverage.py to verify 100% line coverage
- Run linter (flake8/pylint) to verify PEP 8 compliance
- Fix any style issues or missing coverage
- **Checkpoint 4 Evidence:** Coverage report showing 100%, no linter warnings

### Phase 5: Documentation (25 min)
- Create UAT.md with manual acceptance tests
- Finalize ISSUES.md with all issues resolved/documented
- Update C4_DIAGRAMS.md (if exists) or skip if N/A
- Update API_REFERENCE.md (if exists) or skip if N/A
- **Checkpoint 5 Evidence:** UAT.md shows >=85% pass rate, ISSUES.md finalized

**Total Estimated Time: 150 minutes (2.5 hours)**

---

## Technical Specification

### Calculator Module API

```python
# calculator.py

def add(a, b):
    """
    Add two numbers.

    Args:
        a: First number (int or float)
        b: Second number (int or float)

    Returns:
        Numeric sum of a and b

    Raises:
        TypeError: If either argument is not numeric
    """
    pass

def subtract(a, b):
    """
    Subtract b from a.

    Args:
        a: First number (int or float)
        b: Second number (int or float)

    Returns:
        Numeric difference (a - b)

    Raises:
        TypeError: If either argument is not numeric
    """
    pass

def multiply(a, b):
    """
    Multiply two numbers.

    Args:
        a: First number (int or float)
        b: Second number (int or float)

    Returns:
        Numeric product of a and b

    Raises:
        TypeError: If either argument is not numeric
    """
    pass

def divide(a, b):
    """
    Divide a by b.

    Args:
        a: Numerator (int or float)
        b: Denominator (int or float)

    Returns:
        Numeric quotient (a / b) as float

    Raises:
        TypeError: If either argument is not numeric
        ZeroDivisionError: If b is zero
    """
    pass
```

### Validation Requirements
- **Type checking:** Use `isinstance(x, (int, float))` to validate numeric types
- **TypeError message format:** "Arguments must be numeric (int or float), got {type}"
- **ZeroDivisionError message:** "Cannot divide by zero"
- **Return types:** add/subtract/multiply return same type as inputs, divide always returns float

### Test Requirements
Minimum test cases:
1. **Happy path:** Valid int inputs for all operations
2. **Happy path:** Valid float inputs for all operations
3. **Mixed types:** int + float combinations
4. **Invalid type - string:** Pass "abc" to each function
5. **Invalid type - None:** Pass None to each function
6. **Invalid type - list:** Pass [1, 2] to each function
7. **Division by zero:** divide(5, 0)
8. **Edge cases:** divide(0, 5), negative numbers, large numbers

---

## Checkpoint Evidence Requirements

### Checkpoint 0 (READY)
- [ ] READY confirmation with all 6 sections complete
- [ ] File citations include specific line numbers
- [ ] Success criteria mapped 1:1 to tasks
- [ ] Phase 5 documentation explicitly listed
- [ ] ISSUES.md created with header row

### Checkpoint 1 (Core Functions)
- [ ] calculator.py file created
- [ ] All 4 functions defined (add, subtract, multiply, divide)
- [ ] Docstrings present for each function
- [ ] Terminal output showing manual test: add(2, 3) = 5, subtract(5, 2) = 3, etc.

### Checkpoint 2 (Validation)
- [ ] Terminal output showing TypeError for invalid inputs
- [ ] Terminal output showing ZeroDivisionError for divide(x, 0)
- [ ] Error messages are descriptive and follow specified format

### Checkpoint 3 (Tests)
- [ ] test_calculator.py created
- [ ] pytest output showing all tests passing
- [ ] Minimum 8 test cases implemented
- [ ] Test names are descriptive

### Checkpoint 4 (Quality)
- [ ] Coverage report showing 100% line coverage for calculator.py
- [ ] Linter output showing 0 warnings/errors
- [ ] Code follows PEP 8 style

### Checkpoint 5 (Documentation)
- [ ] UAT.md created with pass rate >=85%
- [ ] ISSUES.md finalized (all issues resolved or documented)
- [ ] All success criteria marked complete with evidence

---

## READY Format Template

```
READY CONFIRMATION - Sprint 1.0

═══════════════════════════════════════════════════════════════
SECTION 1: FILES READ (with line number citations)
═══════════════════════════════════════════════════════════════
- .claude/handoffs/sprint-1.0-prompt.md: Lines [X-Y] - [specific content]
- .claude/roles/dev_role.md: Lines [X-Y] - [specific content about READY format]
- [any other project files]: Lines [X-Y] - [specific content]

═══════════════════════════════════════════════════════════════
SECTION 2: ARCHITECTURE UNDERSTANDING
═══════════════════════════════════════════════════════════════
Blue (Orchestrator): [describe if applicable, otherwise "N/A - standalone module"]
Green (Contract): [describe calculator function interfaces]
Red (Plugin): [describe if applicable, otherwise "N/A - standalone module"]

Data Flow: [describe how calculator functions process inputs to outputs]

═══════════════════════════════════════════════════════════════
SECTION 3: SUCCESS CRITERIA MAPPING
═══════════════════════════════════════════════════════════════
| # | Success Criterion | My Task | Phase |
|---|-------------------|---------|-------|
| 1 | calculator.py file exists | Create calculator.py | Phase 1 |
| 2 | add(a, b) returns sum | Implement add function | Phase 1 |
[... map all 20 criteria]

═══════════════════════════════════════════════════════════════
SECTION 4: PHASE BREAKDOWN WITH TIME ESTIMATES
═══════════════════════════════════════════════════════════════
- Phase 0: READY + ISSUES.md (15 min)
- Phase 1: Core Calculator Functions (30 min)
- Phase 2: Input Validation (25 min)
- Phase 3: Unit Tests (35 min)
- Phase 4: Code Quality and Coverage (20 min)
- Phase 5: Documentation - UAT.md, ISSUES.md final (25 min)
Total: 150 min

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
git checkout -b dev-sprint-1.0
git add .
git commit -m "READY submitted - Sprint 1.0"
git push origin dev-sprint-1.0

RELAY TO PM: "READY submitted for review on dev-sprint-1.0"

STOP - Awaiting PM approval.
```

---

## Working Rules

### MUST Do
| Action | When | Evidence |
|--------|------|----------|
| Create ISSUES.md | Phase 0, before code | File with header: Issue | Type | Severity | Status | Root Cause | Resolution |
| Cite line numbers | READY and all file references | Specific lines like "45-52", not "entire file" |
| Validate all inputs | Every function | TypeError for non-numeric inputs |
| Test division by zero | Phase 3 | ZeroDivisionError test passing |
| Create UAT.md | Phase 5 | File present with >=85% pass rate |
| STOP after checkpoint | Every checkpoint | "STOP - Awaiting PM approval" |

### MUST NOT Do
| Forbidden Action | Consequence |
|------------------|-------------|
| Skip READY gate | Immediate termination |
| Skip input validation | Checkpoint rejected |
| Skip Phase 5 documentation | Checkpoint rejected |
| Continue after STOP | Immediate termination |
| Modify .claude/ files | Immediate termination |
| Fabricate test results | Immediate termination |

---

## UAT Acceptance Tests

Your UAT.md must include these test cases at minimum:

### TC-01: Basic Addition
| Step | Action | Expected | Status |
|------|--------|----------|--------|
| 1 | Import calculator | Module loads without error | |
| 2 | Call add(5, 3) | Returns 8 | |
| 3 | Call add(2.5, 1.5) | Returns 4.0 | |

### TC-02: Basic Subtraction
| Step | Action | Expected | Status |
|------|--------|----------|--------|
| 1 | Call subtract(10, 4) | Returns 6 | |
| 2 | Call subtract(5.5, 2.3) | Returns 3.2 | |

### TC-03: Basic Multiplication
| Step | Action | Expected | Status |
|------|--------|----------|--------|
| 1 | Call multiply(6, 7) | Returns 42 | |
| 2 | Call multiply(2.5, 4) | Returns 10.0 | |

### TC-04: Basic Division
| Step | Action | Expected | Status |
|------|--------|----------|--------|
| 1 | Call divide(20, 4) | Returns 5.0 | |
| 2 | Call divide(7, 2) | Returns 3.5 | |

### TC-05: Invalid Input Handling
| Step | Action | Expected | Status |
|------|--------|----------|--------|
| 1 | Call add("5", 3) | TypeError raised | |
| 2 | Call subtract(5, None) | TypeError raised | |
| 3 | Call multiply([1, 2], 3) | TypeError raised | |

### TC-06: Division by Zero
| Step | Action | Expected | Status |
|------|--------|----------|--------|
| 1 | Call divide(10, 0) | ZeroDivisionError raised | |
| 2 | Error message | Contains "Cannot divide by zero" | |

**Pass Threshold: 85% (at least 5/6 test cases must pass)**

---

## Git Branch
Branch name: `dev-sprint-1.0`

Create branch at start of Phase 0:
```bash
git checkout -b dev-sprint-1.0
```

All commits and pushes go to this branch until sprint completion and PM approval.

---

## Notes for DEV

1. **This is a standalone module** - no existing architecture to integrate with
2. **Start simple** - Phase 1 is just the basic arithmetic, validation comes in Phase 2
3. **Test thoroughly** - 100% coverage is required, not optional
4. **Document everything** - Every function needs a complete docstring
5. **STOP discipline** - Do not continue past checkpoints without PM approval

---

## PM Review Notes

This PROMPT.md satisfies all requirements per pm_role.md lines 54-74:
- [x] Sprint ID and Goal (1 sentence)
- [x] Success Criteria (20 specific, testable items)
- [x] File Manifest (create, modify, protected)
- [x] Phase Breakdown with time estimates
- [x] Checkpoint structure with exact evidence requirements
- [x] Technical specification (API with docstring templates)
- [x] READY format template (all 6 sections)
- [x] Working Rules (MUST/MUST NOT tables)
- [x] UAT acceptance test steps
- [x] Git branch name

Ready for DEV execution.
