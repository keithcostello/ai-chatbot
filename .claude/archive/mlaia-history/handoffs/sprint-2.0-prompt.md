# Sprint 2.0 - String Utilities Module

## Sprint Goal
Create a production-ready string_utils.py module with string manipulation functions (reverse, capitalize, word_count), comprehensive input validation, error handling, and complete test coverage.

---

## Success Criteria

| # | Criterion | Testable Evidence |
|---|-----------|-------------------|
| 1 | string_utils.py file exists in project root | File present at expected path |
| 2 | reverse(text) function returns reversed string | Function call reverse("hello") returns "olleh" |
| 3 | reverse() handles empty strings | reverse("") returns "" without error |
| 4 | reverse() handles single characters | reverse("a") returns "a" |
| 5 | capitalize(text) function capitalizes first letter of each word | capitalize("hello world") returns "Hello World" |
| 6 | capitalize() handles already capitalized text | capitalize("Hello World") returns "Hello World" |
| 7 | capitalize() handles mixed case input | capitalize("hELLo WoRLd") returns "Hello World" |
| 8 | word_count(text) function returns correct word count | word_count("hello world") returns 2 |
| 9 | word_count() handles multiple spaces correctly | word_count("hello  world") returns 2 |
| 10 | word_count() handles leading/trailing spaces | word_count("  hello world  ") returns 2 |
| 11 | All functions validate input type as string | Non-string inputs raise TypeError |
| 12 | TypeError raised for None inputs | Passing None raises TypeError with message |
| 13 | TypeError raised for int/float inputs | Passing 123 raises TypeError with message |
| 14 | TypeError raised for list/dict inputs | Passing [1,2] raises TypeError with message |
| 15 | test_string_utils.py exists with pytest tests | Test file present with valid pytest structure |
| 16 | All three functions have passing unit tests | pytest shows 9+ tests passing |
| 17 | Input validation has comprehensive tests | Tests verify all invalid input types |
| 18 | Test coverage is 100% for string_utils.py | Coverage report shows 100% line coverage |
| 19 | All functions have docstrings | Each function has description, args, returns, raises |
| 20 | Code follows PEP 8 style guidelines | No flake8/pylint warnings |

**Total: 20 criteria - All must be met for Grade A**

---

## File Manifest

### Files to Create
| File | Path | Purpose |
|------|------|---------|
| string_utils.py | /string_utils.py | Main string utilities module with manipulation functions |
| test_string_utils.py | /test_string_utils.py | Pytest unit tests for string utilities |
| ISSUES.md | /work/sprint-2/microsprint-2.0/ISSUES.md | Issue tracking (created in Phase 0) |
| UAT.md | /work/sprint-2/microsprint-2.0/UAT.md | User acceptance tests (created in Phase 5) |

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

### Phase 1: Core String Functions (35 min)
- Create string_utils.py with reverse(), capitalize(), word_count()
- Implement string manipulation logic for each function
- Add function docstrings
- **Checkpoint 1 Evidence:** string_utils.py exists, all 3 functions defined, manual test shows basic functionality

### Phase 2: Input Validation (25 min)
- Add type validation to all functions (check for string type)
- Raise TypeError with descriptive messages for invalid inputs
- Test validation manually with various invalid inputs
- **Checkpoint 2 Evidence:** Terminal output showing TypeError for None/int/float/list/dict inputs

### Phase 3: Unit Tests (40 min)
- Create test_string_utils.py with pytest
- Write tests for all three functions with valid inputs
- Write tests for edge cases (empty strings, single chars, multiple spaces)
- Write tests for type validation (None, int, float, list, dict)
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

**Total Estimated Time: 160 minutes (2.7 hours)**

---

## Technical Specification

### String Utilities Module API

```python
# string_utils.py

def reverse(text):
    """
    Reverse a string.

    Args:
        text: String to reverse (str)

    Returns:
        String with characters in reverse order

    Raises:
        TypeError: If text is not a string
    """
    pass

def capitalize(text):
    """
    Capitalize the first letter of each word in a string.

    Args:
        text: String to capitalize (str)

    Returns:
        String with first letter of each word capitalized

    Raises:
        TypeError: If text is not a string
    """
    pass

def word_count(text):
    """
    Count the number of words in a string.

    Words are defined as sequences of characters separated by whitespace.
    Multiple consecutive spaces are treated as a single delimiter.

    Args:
        text: String to count words in (str)

    Returns:
        Integer count of words in the string

    Raises:
        TypeError: If text is not a string
    """
    pass
```

### Validation Requirements
- **Type checking:** Use `isinstance(text, str)` to validate string type
- **TypeError message format:** "Argument must be a string, got {type}"
- **Return types:** reverse/capitalize return str, word_count returns int
- **Edge case handling:**
  - Empty strings should be handled gracefully (no errors)
  - Leading/trailing whitespace should be handled correctly
  - Multiple consecutive spaces should be treated as single delimiter for word_count

### Test Requirements
Minimum test cases:
1. **Happy path - reverse:** Valid strings of various lengths
2. **Happy path - capitalize:** Strings with different capitalization patterns
3. **Happy path - word_count:** Strings with different word counts
4. **Edge cases - reverse:** Empty string, single character
5. **Edge cases - capitalize:** Already capitalized, mixed case, single word
6. **Edge cases - word_count:** Empty string, multiple spaces, leading/trailing spaces
7. **Invalid type - None:** Pass None to each function
8. **Invalid type - int:** Pass 123 to each function
9. **Invalid type - float:** Pass 1.5 to each function
10. **Invalid type - list:** Pass [1, 2] to each function
11. **Invalid type - dict:** Pass {"a": 1} to each function

---

## Checkpoint Evidence Requirements

### Checkpoint 0 (READY)
- [ ] READY confirmation with all 6 sections complete
- [ ] File citations include specific line numbers
- [ ] Success criteria mapped 1:1 to tasks
- [ ] Phase 5 documentation explicitly listed
- [ ] ISSUES.md created with header row

### Checkpoint 1 (Core Functions)
- [ ] string_utils.py file created
- [ ] All 3 functions defined (reverse, capitalize, word_count)
- [ ] Docstrings present for each function
- [ ] Terminal output showing manual test: reverse("hello") = "olleh", capitalize("hello world") = "Hello World", word_count("hello world") = 2

### Checkpoint 2 (Validation)
- [ ] Terminal output showing TypeError for invalid inputs (None, int, list, dict)
- [ ] Error messages are descriptive and follow specified format
- [ ] All three functions properly validate input type

### Checkpoint 3 (Tests)
- [ ] test_string_utils.py created
- [ ] pytest output showing all tests passing
- [ ] Minimum 11 test cases implemented (3 functions x happy path + edge cases + 5 invalid types)
- [ ] Test names are descriptive

### Checkpoint 4 (Quality)
- [ ] Coverage report showing 100% line coverage for string_utils.py
- [ ] Linter output showing 0 warnings/errors
- [ ] Code follows PEP 8 style

### Checkpoint 5 (Documentation)
- [ ] UAT.md created with pass rate >=85%
- [ ] ISSUES.md finalized (all issues resolved or documented)
- [ ] All success criteria marked complete with evidence

---

## READY Format Template

```
READY CONFIRMATION - Sprint 2.0

═══════════════════════════════════════════════════════════════
SECTION 1: FILES READ (with line number citations)
═══════════════════════════════════════════════════════════════
- .claude/handoffs/sprint-2.0-prompt.md: Lines [X-Y] - [specific content]
- .claude/roles/dev_role.md: Lines [X-Y] - [specific content about READY format]
- [any other project files]: Lines [X-Y] - [specific content]

═══════════════════════════════════════════════════════════════
SECTION 2: ARCHITECTURE UNDERSTANDING
═══════════════════════════════════════════════════════════════
Blue (Orchestrator): [describe if applicable, otherwise "N/A - standalone module"]
Green (Contract): [describe string_utils function interfaces]
Red (Plugin): [describe if applicable, otherwise "N/A - standalone module"]

Data Flow: [describe how string functions process inputs to outputs]

═══════════════════════════════════════════════════════════════
SECTION 3: SUCCESS CRITERIA MAPPING
═══════════════════════════════════════════════════════════════
| # | Success Criterion | My Task | Phase |
|---|-------------------|---------|-------|
| 1 | string_utils.py file exists | Create string_utils.py | Phase 1 |
| 2 | reverse(text) returns reversed string | Implement reverse function | Phase 1 |
[... map all 20 criteria]

═══════════════════════════════════════════════════════════════
SECTION 4: PHASE BREAKDOWN WITH TIME ESTIMATES
═══════════════════════════════════════════════════════════════
- Phase 0: READY + ISSUES.md (15 min)
- Phase 1: Core String Functions (35 min)
- Phase 2: Input Validation (25 min)
- Phase 3: Unit Tests (40 min)
- Phase 4: Code Quality and Coverage (20 min)
- Phase 5: Documentation - UAT.md, ISSUES.md final (25 min)
Total: 160 min

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
git checkout -b dev-sprint-2.0
git add .
git commit -m "READY submitted - Sprint 2.0"
git push origin dev-sprint-2.0

RELAY TO PM: "READY submitted for review on dev-sprint-2.0"

STOP - Awaiting PM approval.
```

---

## Working Rules

### MUST Do
| Action | When | Evidence |
|--------|------|----------|
| Create ISSUES.md | Phase 0, before code | File with header: Issue \| Type \| Severity \| Status \| Root Cause \| Resolution |
| Cite line numbers | READY and all file references | Specific lines like "45-52", not "entire file" |
| Validate all inputs | Every function | TypeError for non-string inputs |
| Handle edge cases | Phase 1 | Empty strings, multiple spaces handled correctly |
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

### TC-01: String Reversal
| Step | Action | Expected | Status |
|------|--------|----------|--------|
| 1 | Import string_utils | Module loads without error | |
| 2 | Call reverse("hello") | Returns "olleh" | |
| 3 | Call reverse("Python") | Returns "nohtyP" | |
| 4 | Call reverse("") | Returns "" | |
| 5 | Call reverse("a") | Returns "a" | |

### TC-02: String Capitalization
| Step | Action | Expected | Status |
|------|--------|----------|--------|
| 1 | Call capitalize("hello world") | Returns "Hello World" | |
| 2 | Call capitalize("HELLO WORLD") | Returns "Hello World" | |
| 3 | Call capitalize("hELLo WoRLd") | Returns "Hello World" | |
| 4 | Call capitalize("python") | Returns "Python" | |

### TC-03: Word Counting
| Step | Action | Expected | Status |
|------|--------|----------|--------|
| 1 | Call word_count("hello world") | Returns 2 | |
| 2 | Call word_count("hello  world") | Returns 2 | |
| 3 | Call word_count("  hello world  ") | Returns 2 | |
| 4 | Call word_count("") | Returns 0 | |
| 5 | Call word_count("one") | Returns 1 | |

### TC-04: Invalid Input Handling - reverse
| Step | Action | Expected | Status |
|------|--------|----------|--------|
| 1 | Call reverse(None) | TypeError raised | |
| 2 | Call reverse(123) | TypeError raised | |
| 3 | Call reverse([1, 2]) | TypeError raised | |

### TC-05: Invalid Input Handling - capitalize
| Step | Action | Expected | Status |
|------|--------|----------|--------|
| 1 | Call capitalize(None) | TypeError raised | |
| 2 | Call capitalize(123) | TypeError raised | |
| 3 | Call capitalize({"a": 1}) | TypeError raised | |

### TC-06: Invalid Input Handling - word_count
| Step | Action | Expected | Status |
|------|--------|----------|--------|
| 1 | Call word_count(None) | TypeError raised | |
| 2 | Call word_count(1.5) | TypeError raised | |
| 3 | Call word_count([1, 2]) | TypeError raised | |

**Pass Threshold: 85% (at least 6/7 test cases must pass)**

---

## Git Branch
Branch name: `dev-sprint-2.0`

Create branch at start of Phase 0:
```bash
git checkout -b dev-sprint-2.0
```

All commits and pushes go to this branch until sprint completion and PM approval.

---

## Notes for DEV

1. **This is a standalone module** - no existing architecture to integrate with
2. **Start simple** - Phase 1 is just the basic string manipulation, validation comes in Phase 2
3. **Test thoroughly** - 100% coverage is required, not optional
4. **Edge cases matter** - Pay attention to empty strings, whitespace handling
5. **STOP discipline** - Do not continue past checkpoints without PM approval
6. **String operations** - Python has built-in string methods that will be useful (e.g., split(), title())

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
