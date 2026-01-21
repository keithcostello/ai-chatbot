# Sprint 3.0 - Date Utilities Module

## Sprint Goal
Create a production-ready date_utils.py module with date manipulation functions (format_date, days_between, is_weekend), comprehensive input validation, error handling, and complete test coverage.

---

## Success Criteria

| # | Criterion | Testable Evidence |
|---|-----------|-------------------|
| 1 | date_utils.py file exists in project root | File present at expected path |
| 2 | format_date(date, format_type) function formats dates correctly | Function call format_date(datetime(2025, 12, 5), "ISO") returns "2025-12-05" |
| 3 | format_date() supports ISO format (YYYY-MM-DD) | format_date(date, "ISO") returns correct ISO string |
| 4 | format_date() supports US format (MM/DD/YYYY) | format_date(date, "US") returns correct US string |
| 5 | format_date() supports LONG format (Month DD, YYYY) | format_date(date, "LONG") returns "December 05, 2025" |
| 6 | format_date() handles datetime and date objects | Works with both datetime.datetime and datetime.date |
| 7 | days_between(date1, date2) returns correct day count | days_between(date1, date2) returns positive integer |
| 8 | days_between() handles dates in any order | days_between(newer, older) same as days_between(older, newer) |
| 9 | days_between() returns 0 for same date | days_between(date1, date1) returns 0 |
| 10 | days_between() handles leap years correctly | Validates February 29th calculations |
| 11 | is_weekend(date) returns True for Saturday | is_weekend(Saturday date) returns True |
| 12 | is_weekend(date) returns True for Sunday | is_weekend(Sunday date) returns True |
| 13 | is_weekend(date) returns False for weekdays | is_weekend(Monday-Friday date) returns False |
| 14 | All functions validate date object types | Non-date inputs raise TypeError |
| 15 | format_date() validates format_type parameter | Invalid format raises ValueError |
| 16 | TypeError raised for None/string/int date inputs | Passing None/"2025-12-05"/123 raises TypeError |
| 17 | ValueError raised for invalid format_type | Passing "INVALID" raises ValueError with message |
| 18 | test_date_utils.py exists with pytest tests | Test file present with valid pytest structure |
| 19 | All functions have passing unit tests | pytest shows 15+ tests passing |
| 20 | Test coverage is 100% for date_utils.py | Coverage report shows 100% line coverage |
| 21 | All functions have complete docstrings | Each function has description, args, returns, raises, examples |
| 22 | Code follows PEP 8 style guidelines | No flake8/pylint warnings |

**Total: 22 criteria - All must be met for Grade A**

---

## File Manifest

### Files to Create
| File | Path | Purpose |
|------|------|---------|
| date_utils.py | /date_utils.py | Main date utilities module with format_date, days_between, is_weekend functions |
| test_date_utils.py | /test_date_utils.py | Pytest unit tests for date utilities |
| ISSUES.md | /work/sprint-3/microsprint-3.0/ISSUES.md | Issue tracking (created in Phase 0) |
| UAT.md | /work/sprint-3/microsprint-3.0/UAT.md | User acceptance tests (created in Phase 5) |

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

### Phase 1: Core Date Functions (45 min)
- Create date_utils.py with format_date(), days_between(), is_weekend()
- Implement date manipulation logic for each function
- Add comprehensive docstrings with examples
- **Checkpoint 1 Evidence:** date_utils.py exists, all 3 functions defined, manual test shows basic functionality for each function

### Phase 2: Input Validation & Edge Cases (35 min)
- Add type validation to all functions (check for datetime/date objects)
- Add format_type validation in format_date (ISO/US/LONG only)
- Raise TypeError/ValueError with descriptive messages for invalid inputs
- Handle edge cases: leap years, same dates, date vs datetime objects
- **Checkpoint 2 Evidence:** Terminal output showing TypeError for None/string/int inputs, ValueError for invalid format, edge case handling demonstrated

### Phase 3: Unit Tests (50 min)
- Create test_date_utils.py with pytest
- Write tests for format_date (all 3 formats, date vs datetime)
- Write tests for days_between (positive/negative/zero, leap years)
- Write tests for is_weekend (all 7 days of week)
- Write tests for type validation (None, string, int, list)
- Write tests for format_type validation
- Run pytest and show all tests passing
- **Checkpoint 3 Evidence:** pytest output showing 15+ tests passing, test file with complete coverage

### Phase 4: Code Quality and Coverage (25 min)
- Run coverage.py to verify 100% line coverage
- Run linter (flake8/pylint) to verify PEP 8 compliance
- Fix any style issues or missing coverage
- **Checkpoint 4 Evidence:** Coverage report showing 100%, no linter warnings

### Phase 5: Documentation (30 min)
- Create UAT.md with manual acceptance tests
- Finalize ISSUES.md with all issues resolved/documented
- Update C4_DIAGRAMS.md (if exists) or skip if N/A
- Update API_REFERENCE.md (if exists) or skip if N/A
- **Checkpoint 5 Evidence:** UAT.md shows >=85% pass rate, ISSUES.md finalized

**Total Estimated Time: 200 minutes (3.3 hours)**

---

## Technical Specification

### Date Utilities Module API

```python
# date_utils.py

from datetime import datetime, date

def format_date(date_obj, format_type="ISO"):
    """
    Format a date object into a string representation.

    Args:
        date_obj: Date to format (datetime.datetime or datetime.date)
        format_type: Output format - "ISO" (YYYY-MM-DD), "US" (MM/DD/YYYY),
                     or "LONG" (Month DD, YYYY). Default: "ISO"

    Returns:
        String representation of the date in the specified format

    Raises:
        TypeError: If date_obj is not a datetime.datetime or datetime.date object
        ValueError: If format_type is not one of: "ISO", "US", "LONG"

    Examples:
        >>> format_date(datetime(2025, 12, 5), "ISO")
        '2025-12-05'
        >>> format_date(datetime(2025, 12, 5), "US")
        '12/05/2025'
        >>> format_date(datetime(2025, 12, 5), "LONG")
        'December 05, 2025'
    """
    pass

def days_between(date1, date2):
    """
    Calculate the number of days between two dates.

    Returns the absolute difference in days, regardless of date order.
    Both datetime.datetime and datetime.date objects are supported.

    Args:
        date1: First date (datetime.datetime or datetime.date)
        date2: Second date (datetime.datetime or datetime.date)

    Returns:
        Integer count of days between the dates (always non-negative)

    Raises:
        TypeError: If date1 or date2 is not a datetime.datetime or datetime.date object

    Examples:
        >>> days_between(datetime(2025, 12, 5), datetime(2025, 12, 10))
        5
        >>> days_between(datetime(2025, 12, 10), datetime(2025, 12, 5))
        5
        >>> days_between(datetime(2025, 12, 5), datetime(2025, 12, 5))
        0
    """
    pass

def is_weekend(date_obj):
    """
    Check if a given date falls on a weekend (Saturday or Sunday).

    Args:
        date_obj: Date to check (datetime.datetime or datetime.date)

    Returns:
        Boolean - True if the date is Saturday (5) or Sunday (6), False otherwise

    Raises:
        TypeError: If date_obj is not a datetime.datetime or datetime.date object

    Examples:
        >>> is_weekend(datetime(2025, 12, 6))  # Saturday
        True
        >>> is_weekend(datetime(2025, 12, 7))  # Sunday
        True
        >>> is_weekend(datetime(2025, 12, 5))  # Friday
        False
    """
    pass
```

### Validation Requirements
- **Type checking for date objects:** Use `isinstance(date_obj, (datetime, date))` to validate date types
- **TypeError message format:** "Argument must be a datetime.datetime or datetime.date object, got {type}"
- **format_type validation:** Only accept "ISO", "US", "LONG" (case-sensitive)
- **ValueError message format:** "format_type must be one of: ISO, US, LONG, got '{value}'"
- **Return types:**
  - format_date returns str
  - days_between returns int (non-negative)
  - is_weekend returns bool
- **Edge case handling:**
  - Both datetime.datetime and datetime.date objects must work
  - days_between should handle dates in any order (always return positive)
  - days_between should handle leap years correctly
  - Same date should return 0 days

### Test Requirements
Minimum test cases:
1. **format_date - ISO format:** Various dates in ISO format
2. **format_date - US format:** Various dates in US format
3. **format_date - LONG format:** Various dates in long format
4. **format_date - datetime vs date:** Test both datetime.datetime and datetime.date objects
5. **format_date - invalid format:** Test ValueError for invalid format_type
6. **days_between - positive difference:** Test date1 < date2
7. **days_between - negative difference:** Test date1 > date2 (should be same as positive)
8. **days_between - same date:** Test date1 == date2 (should be 0)
9. **days_between - leap year:** Test February 29th calculations
10. **is_weekend - Saturday:** Test returns True for Saturday
11. **is_weekend - Sunday:** Test returns True for Sunday
12. **is_weekend - Monday-Friday:** Test returns False for each weekday
13. **Invalid type - None:** Pass None to each function
14. **Invalid type - string:** Pass "2025-12-05" to each function
15. **Invalid type - int:** Pass 123 to each function

---

## Checkpoint Evidence Requirements

### Checkpoint 0 (READY)
- [ ] READY confirmation with all 6 sections complete
- [ ] File citations include specific line numbers
- [ ] Success criteria mapped 1:1 to tasks
- [ ] Phase 5 documentation explicitly listed
- [ ] ISSUES.md created with header row

### Checkpoint 1 (Core Functions)
- [ ] date_utils.py file created
- [ ] All 3 functions defined (format_date, days_between, is_weekend)
- [ ] Comprehensive docstrings with examples for each function
- [ ] Terminal output showing manual tests:
  - format_date(datetime(2025, 12, 5), "ISO") = "2025-12-05"
  - format_date(datetime(2025, 12, 5), "US") = "12/05/2025"
  - format_date(datetime(2025, 12, 5), "LONG") = "December 05, 2025"
  - days_between(datetime(2025, 12, 5), datetime(2025, 12, 10)) = 5
  - is_weekend(datetime(2025, 12, 6)) = True (Saturday)
  - is_weekend(datetime(2025, 12, 5)) = False (Friday)

### Checkpoint 2 (Validation & Edge Cases)
- [ ] Terminal output showing TypeError for invalid date inputs (None, "2025-12-05", 123)
- [ ] Terminal output showing ValueError for invalid format_type ("INVALID")
- [ ] Error messages are descriptive and follow specified format
- [ ] Edge case demonstrations:
  - days_between works in both directions (same result)
  - days_between(same_date, same_date) = 0
  - Leap year handling (e.g., days in February 2024 vs 2025)
  - Both date and datetime objects work

### Checkpoint 3 (Tests)
- [ ] test_date_utils.py created
- [ ] pytest output showing all tests passing (minimum 15 tests)
- [ ] Tests cover all three functions with happy paths
- [ ] Tests cover edge cases (leap years, same dates, both date types)
- [ ] Tests cover validation (type errors, format errors)
- [ ] Test names are descriptive

### Checkpoint 4 (Quality)
- [ ] Coverage report showing 100% line coverage for date_utils.py
- [ ] Linter output showing 0 warnings/errors
- [ ] Code follows PEP 8 style

### Checkpoint 5 (Documentation)
- [ ] UAT.md created with pass rate >=85%
- [ ] ISSUES.md finalized (all issues resolved or documented)
- [ ] All success criteria marked complete with evidence

---

## READY Format Template

```
READY CONFIRMATION - Sprint 3.0

═══════════════════════════════════════════════════════════════
SECTION 1: FILES READ (with line number citations)
═══════════════════════════════════════════════════════════════
- .claude/handoffs/sprint-3.0-prompt.md: Lines [X-Y] - [specific content]
- .claude/roles/dev_role.md: Lines [X-Y] - [specific content about READY format]
- [any other project files]: Lines [X-Y] - [specific content]

═══════════════════════════════════════════════════════════════
SECTION 2: ARCHITECTURE UNDERSTANDING
═══════════════════════════════════════════════════════════════
Blue (Orchestrator): [describe if applicable, otherwise "N/A - standalone module"]
Green (Contract): [describe date_utils function interfaces]
Red (Plugin): [describe if applicable, otherwise "N/A - standalone module"]

Data Flow: [describe how date functions process inputs to outputs]

═══════════════════════════════════════════════════════════════
SECTION 3: SUCCESS CRITERIA MAPPING
═══════════════════════════════════════════════════════════════
| # | Success Criterion | My Task | Phase |
|---|-------------------|---------|-------|
| 1 | date_utils.py file exists | Create date_utils.py | Phase 1 |
| 2 | format_date(date, format_type) formats correctly | Implement format_date function | Phase 1 |
[... map all 22 criteria]

═══════════════════════════════════════════════════════════════
SECTION 4: PHASE BREAKDOWN WITH TIME ESTIMATES
═══════════════════════════════════════════════════════════════
- Phase 0: READY + ISSUES.md (15 min)
- Phase 1: Core Date Functions (45 min)
- Phase 2: Input Validation & Edge Cases (35 min)
- Phase 3: Unit Tests (50 min)
- Phase 4: Code Quality and Coverage (25 min)
- Phase 5: Documentation - UAT.md, ISSUES.md final (30 min)
Total: 200 min

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
git checkout -b dev-sprint-3.0
git add .
git commit -m "READY submitted - Sprint 3.0"
git push origin dev-sprint-3.0

RELAY TO PM: "READY submitted for review on dev-sprint-3.0"

STOP - Awaiting PM approval.
```

---

## Working Rules

### MUST Do
| Action | When | Evidence |
|--------|------|----------|
| Create ISSUES.md | Phase 0, before code | File with header: Issue \| Type \| Severity \| Status \| Root Cause \| Resolution |
| Cite line numbers | READY and all file references | Specific lines like "45-52", not "entire file" |
| Validate all inputs | Every function | TypeError for non-date inputs, ValueError for invalid formats |
| Handle edge cases | Phase 2 | Leap years, same dates, date vs datetime objects handled correctly |
| Test both date types | Phase 3 | Tests for both datetime.datetime and datetime.date objects |
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
| Use strings instead of date objects | Checkpoint rejected - must use datetime module |

---

## UAT Acceptance Tests

Your UAT.md must include these test cases at minimum:

### TC-01: Date Formatting - ISO Format
| Step | Action | Expected | Status |
|------|--------|----------|--------|
| 1 | Import date_utils and datetime | Modules load without error | |
| 2 | Call format_date(datetime(2025, 12, 5), "ISO") | Returns "2025-12-05" | |
| 3 | Call format_date(datetime(2025, 1, 15), "ISO") | Returns "2025-01-15" | |
| 4 | Call format_date(date(2025, 12, 5), "ISO") | Returns "2025-12-05" | |

### TC-02: Date Formatting - US Format
| Step | Action | Expected | Status |
|------|--------|----------|--------|
| 1 | Call format_date(datetime(2025, 12, 5), "US") | Returns "12/05/2025" | |
| 2 | Call format_date(datetime(2025, 1, 15), "US") | Returns "01/15/2025" | |
| 3 | Call format_date(date(2025, 12, 5), "US") | Returns "12/05/2025" | |

### TC-03: Date Formatting - LONG Format
| Step | Action | Expected | Status |
|------|--------|----------|--------|
| 1 | Call format_date(datetime(2025, 12, 5), "LONG") | Returns "December 05, 2025" | |
| 2 | Call format_date(datetime(2025, 1, 15), "LONG") | Returns "January 15, 2025" | |
| 3 | Call format_date(date(2025, 12, 5), "LONG") | Returns "December 05, 2025" | |

### TC-04: Days Between Calculation
| Step | Action | Expected | Status |
|------|--------|----------|--------|
| 1 | Call days_between(datetime(2025, 12, 5), datetime(2025, 12, 10)) | Returns 5 | |
| 2 | Call days_between(datetime(2025, 12, 10), datetime(2025, 12, 5)) | Returns 5 | |
| 3 | Call days_between(datetime(2025, 12, 5), datetime(2025, 12, 5)) | Returns 0 | |
| 4 | Call days_between(datetime(2024, 2, 28), datetime(2024, 3, 1)) | Returns 2 (leap year) | |
| 5 | Call days_between(date(2025, 12, 5), date(2025, 12, 10)) | Returns 5 | |

### TC-05: Weekend Detection
| Step | Action | Expected | Status |
|------|--------|----------|--------|
| 1 | Call is_weekend(datetime(2025, 12, 6)) | Returns True (Saturday) | |
| 2 | Call is_weekend(datetime(2025, 12, 7)) | Returns True (Sunday) | |
| 3 | Call is_weekend(datetime(2025, 12, 5)) | Returns False (Friday) | |
| 4 | Call is_weekend(datetime(2025, 12, 1)) | Returns False (Monday) | |
| 5 | Call is_weekend(date(2025, 12, 6)) | Returns True (Saturday) | |

### TC-06: Invalid Input Handling - format_date
| Step | Action | Expected | Status |
|------|--------|----------|--------|
| 1 | Call format_date(None, "ISO") | TypeError raised | |
| 2 | Call format_date("2025-12-05", "ISO") | TypeError raised | |
| 3 | Call format_date(123, "ISO") | TypeError raised | |
| 4 | Call format_date(datetime(2025, 12, 5), "INVALID") | ValueError raised | |

### TC-07: Invalid Input Handling - days_between
| Step | Action | Expected | Status |
|------|--------|----------|--------|
| 1 | Call days_between(None, datetime(2025, 12, 5)) | TypeError raised | |
| 2 | Call days_between(datetime(2025, 12, 5), "2025-12-10") | TypeError raised | |
| 3 | Call days_between(123, 456) | TypeError raised | |

### TC-08: Invalid Input Handling - is_weekend
| Step | Action | Expected | Status |
|------|--------|----------|--------|
| 1 | Call is_weekend(None) | TypeError raised | |
| 2 | Call is_weekend("2025-12-05") | TypeError raised | |
| 3 | Call is_weekend(123) | TypeError raised | |

**Pass Threshold: 85% (at least 7/8 test cases must pass)**

---

## Git Branch
Branch name: `dev-sprint-3.0`

Create branch at start of Phase 0:
```bash
git checkout -b dev-sprint-3.0
```

All commits and pushes go to this branch until sprint completion and PM approval.

---

## Notes for DEV

1. **Import requirements** - You must import from datetime module: `from datetime import datetime, date`
2. **Date vs Datetime** - Both datetime.datetime and datetime.date objects must be supported
3. **Absolute values** - days_between should always return non-negative integers (use abs())
4. **Day of week** - Use .weekday() method: Monday=0, Sunday=6 (Saturday=5, Sunday=6 are weekends)
5. **String formatting** - Use strftime() for date formatting or f-strings
6. **Leap years** - Python's datetime handles leap years automatically in date arithmetic
7. **Format validation** - Check format_type against allowed values before processing
8. **STOP discipline** - Do not continue past checkpoints without PM approval
9. **Edge case testing** - Make sure to test leap year scenarios (2024 is a leap year, 2025 is not)
10. **Month names** - For LONG format, use %B for full month name, ensure zero-padded day

---

## PM Review Notes

This PROMPT.md satisfies all requirements per pm_role.md lines 54-74:
- [x] Sprint ID and Goal (1 sentence)
- [x] Success Criteria (22 specific, testable items)
- [x] File Manifest (create, modify, protected)
- [x] Phase Breakdown with time estimates
- [x] Checkpoint structure with exact evidence requirements
- [x] Technical specification (API with docstring templates and examples)
- [x] READY format template (all 6 sections)
- [x] Working Rules (MUST/MUST NOT tables)
- [x] UAT acceptance test steps (8 test cases with 85% threshold)
- [x] Git branch name

Ready for DEV execution.
