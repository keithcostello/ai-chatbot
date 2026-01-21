# Sprint 4.0 - File Utilities Module

## Sprint Goal
Create a production-ready file_utils.py module with file I/O functions (read_file, write_file, append_file), comprehensive input validation, error handling for file operations, and complete test coverage.

---

## Success Criteria

| # | Criterion | Testable Evidence |
|---|-----------|-------------------|
| 1 | file_utils.py file exists in project root | File present at expected path |
| 2 | read_file(filepath) function reads file contents correctly | Function call read_file("test.txt") returns file contents as string |
| 3 | read_file() returns empty string for empty files | read_file("empty.txt") returns "" |
| 4 | read_file() handles text files with UTF-8 encoding | Reads files with UTF-8 characters correctly |
| 5 | read_file() raises FileNotFoundError for missing files | read_file("nonexistent.txt") raises FileNotFoundError |
| 6 | read_file() raises PermissionError for inaccessible files | read_file("no_permission.txt") raises PermissionError when applicable |
| 7 | write_file(filepath, content) creates new file with content | File created with exact content specified |
| 8 | write_file() overwrites existing file content | Calling write_file twice replaces content |
| 9 | write_file() handles UTF-8 encoded content | Writes Unicode characters correctly |
| 10 | write_file() creates parent directories if missing | write_file("subdir/file.txt", "test") creates subdir/ |
| 11 | write_file() raises PermissionError for write-protected locations | write_file to read-only location raises PermissionError |
| 12 | append_file(filepath, content) appends to existing file | Calling append_file adds content to end |
| 13 | append_file() creates file if it doesn't exist | append_file on new file creates it with content |
| 14 | append_file() handles UTF-8 encoded content | Appends Unicode characters correctly |
| 15 | append_file() creates parent directories if missing | append_file("subdir/file.txt", "test") creates subdir/ |
| 16 | All functions validate filepath is string | Non-string filepath raises TypeError |
| 17 | All functions validate filepath is not empty | Empty string filepath raises ValueError |
| 18 | write_file/append_file validate content is string | Non-string content raises TypeError |
| 19 | test_file_utils.py exists with pytest tests | Test file present with valid pytest structure |
| 20 | All functions have passing unit tests | pytest shows 20+ tests passing |
| 21 | Test coverage is 100% for file_utils.py | Coverage report shows 100% line coverage |
| 22 | All functions have complete docstrings | Each function has description, args, returns, raises, examples |
| 23 | Code follows PEP 8 style guidelines | No flake8/pylint warnings |
| 24 | Error messages are descriptive and helpful | Error messages include filepath and reason |

**Total: 24 criteria - All must be met for Grade A**

---

## File Manifest

### Files to Create
| File | Path | Purpose |
|------|------|---------|
| file_utils.py | /file_utils.py | Main file utilities module with read_file, write_file, append_file functions |
| test_file_utils.py | /test_file_utils.py | Pytest unit tests for file utilities |
| ISSUES.md | /work/sprint-4/microsprint-4.0/ISSUES.md | Issue tracking (created in Phase 0) |
| UAT.md | /work/sprint-4/microsprint-4.0/UAT.md | User acceptance tests (created in Phase 5) |

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

### Phase 1: Core File Functions (50 min)
- Create file_utils.py with read_file(), write_file(), append_file()
- Implement file I/O logic for each function
- Add parent directory creation for write/append operations
- Add comprehensive docstrings with examples
- **Checkpoint 1 Evidence:** file_utils.py exists, all 3 functions defined, manual test shows basic functionality for each function (create test files, read, write, append)

### Phase 2: Input Validation & Error Handling (40 min)
- Add filepath validation to all functions (string type, non-empty)
- Add content validation to write_file/append_file (string type)
- Raise TypeError/ValueError with descriptive messages for invalid inputs
- Handle file operation errors: FileNotFoundError, PermissionError, OSError
- Implement proper exception handling with context (include filepath in error messages)
- **Checkpoint 2 Evidence:** Terminal output showing TypeError for non-string inputs, ValueError for empty filepath, FileNotFoundError for missing file, proper error messages with filepath context

### Phase 3: Unit Tests (60 min)
- Create test_file_utils.py with pytest
- Write tests for read_file (normal files, empty files, UTF-8 content, file not found)
- Write tests for write_file (new files, overwrite, UTF-8 content, parent directory creation)
- Write tests for append_file (existing files, new files, UTF-8 content, parent directory creation)
- Write tests for filepath validation (None, int, empty string, list)
- Write tests for content validation (None, int, list for write/append)
- Write tests for error conditions (file not found, permissions)
- Use pytest fixtures and tmp_path for temporary test files
- Run pytest and show all tests passing
- **Checkpoint 3 Evidence:** pytest output showing 20+ tests passing, test file with comprehensive coverage including edge cases

### Phase 4: Code Quality and Coverage (25 min)
- Run coverage.py to verify 100% line coverage
- Run linter (flake8/pylint) to verify PEP 8 compliance
- Fix any style issues or missing coverage
- Verify all error paths are tested
- **Checkpoint 4 Evidence:** Coverage report showing 100%, no linter warnings

### Phase 5: Documentation (30 min)
- Create UAT.md with manual acceptance tests
- Finalize ISSUES.md with all issues resolved/documented
- Update C4_DIAGRAMS.md (if exists) or skip if N/A
- Update API_REFERENCE.md (if exists) or skip if N/A
- **Checkpoint 5 Evidence:** UAT.md shows >=85% pass rate, ISSUES.md finalized

**Total Estimated Time: 220 minutes (3.7 hours)**

---

## Technical Specification

### File Utilities Module API

```python
# file_utils.py

import os

def read_file(filepath):
    """
    Read the contents of a file and return as a string.

    Reads the file using UTF-8 encoding. Returns empty string if file is empty.

    Args:
        filepath: Path to the file to read (string)

    Returns:
        String containing the file contents

    Raises:
        TypeError: If filepath is not a string
        ValueError: If filepath is an empty string
        FileNotFoundError: If the file does not exist
        PermissionError: If the file cannot be read due to permissions
        OSError: If other file system errors occur

    Examples:
        >>> read_file("example.txt")
        'Hello, World!'
        >>> read_file("empty.txt")
        ''
    """
    pass

def write_file(filepath, content):
    """
    Write content to a file, overwriting if it exists.

    Creates the file if it doesn't exist. Creates parent directories if they
    don't exist. Writes content using UTF-8 encoding.

    Args:
        filepath: Path to the file to write (string)
        content: Content to write to the file (string)

    Returns:
        None

    Raises:
        TypeError: If filepath or content is not a string
        ValueError: If filepath is an empty string
        PermissionError: If the file cannot be written due to permissions
        OSError: If other file system errors occur

    Examples:
        >>> write_file("example.txt", "Hello, World!")
        >>> write_file("subdir/example.txt", "Creates directory too")
    """
    pass

def append_file(filepath, content):
    """
    Append content to the end of a file.

    Creates the file if it doesn't exist. Creates parent directories if they
    don't exist. Appends content using UTF-8 encoding.

    Args:
        filepath: Path to the file to append to (string)
        content: Content to append to the file (string)

    Returns:
        None

    Raises:
        TypeError: If filepath or content is not a string
        ValueError: If filepath is an empty string
        PermissionError: If the file cannot be written due to permissions
        OSError: If other file system errors occur

    Examples:
        >>> append_file("log.txt", "New log entry\\n")
        >>> append_file("subdir/log.txt", "Creates directory if needed\\n")
    """
    pass
```

### Implementation Requirements

#### File Operations
- **Encoding:** All file operations must use UTF-8 encoding explicitly
- **read_file:** Use `open(filepath, 'r', encoding='utf-8')` and `.read()`
- **write_file:** Use `open(filepath, 'w', encoding='utf-8')` and `.write()`
- **append_file:** Use `open(filepath, 'a', encoding='utf-8')` and `.write()`
- **Parent directories:** Use `os.makedirs(os.path.dirname(filepath), exist_ok=True)` before write/append operations
- **Empty filepath handling:** Special case - if `os.path.dirname(filepath)` returns empty string, skip makedirs

#### Validation Requirements
- **filepath type checking:** Use `isinstance(filepath, str)` to validate filepath is string
- **filepath empty check:** Use `if not filepath or not filepath.strip()` to catch empty/whitespace-only strings
- **content type checking:** Use `isinstance(content, str)` to validate content is string
- **TypeError message format:**
  - "filepath must be a string, got {type}"
  - "content must be a string, got {type}"
- **ValueError message format:** "filepath cannot be an empty string"
- **FileNotFoundError handling:** Allow to propagate naturally with filepath in message
- **PermissionError handling:** Allow to propagate naturally with filepath in message
- **Error context:** When catching exceptions, re-raise with filepath context if needed

#### Edge Cases to Handle
- Empty files (read_file should return empty string)
- Files with UTF-8 characters (emoji, non-ASCII)
- Files in subdirectories (create parent directories)
- Files in current directory (don't fail on empty dirname)
- Overwriting existing files (write_file replaces content)
- Appending to new files (create if doesn't exist)
- Multiple append operations (verify content accumulates)

### Test Requirements

Minimum test cases:

1. **read_file - normal file:** Create test file, read, verify content matches
2. **read_file - empty file:** Create empty file, read, verify empty string
3. **read_file - UTF-8 content:** Read file with emoji/Unicode characters
4. **read_file - file not found:** Pass nonexistent filepath, verify FileNotFoundError
5. **read_file - invalid filepath type:** Pass None, int, list, verify TypeError
6. **read_file - empty filepath:** Pass empty string, verify ValueError
7. **write_file - new file:** Write to new file, verify file exists with correct content
8. **write_file - overwrite existing:** Write twice, verify second content replaces first
9. **write_file - UTF-8 content:** Write emoji/Unicode, read back, verify matches
10. **write_file - parent directory creation:** Write to subdir/file.txt, verify directory created
11. **write_file - invalid filepath type:** Pass None, int, list, verify TypeError
12. **write_file - empty filepath:** Pass empty string, verify ValueError
13. **write_file - invalid content type:** Pass None, int, list, verify TypeError
14. **append_file - existing file:** Append to file, verify content added to end
15. **append_file - new file:** Append to nonexistent file, verify file created
16. **append_file - multiple appends:** Append multiple times, verify all content present
17. **append_file - UTF-8 content:** Append emoji/Unicode, read back, verify matches
18. **append_file - parent directory creation:** Append to subdir/file.txt, verify directory created
19. **append_file - invalid filepath type:** Pass None, int, list, verify TypeError
20. **append_file - empty filepath:** Pass empty string, verify ValueError
21. **append_file - invalid content type:** Pass None, int, list, verify TypeError

**Use pytest tmp_path fixture for all file operations to ensure clean test isolation**

---

## Checkpoint Evidence Requirements

### Checkpoint 0 (READY)
- [ ] READY confirmation with all 6 sections complete
- [ ] File citations include specific line numbers
- [ ] Success criteria mapped 1:1 to tasks
- [ ] Phase 5 documentation explicitly listed
- [ ] ISSUES.md created with header row

### Checkpoint 1 (Core Functions)
- [ ] file_utils.py file created
- [ ] All 3 functions defined (read_file, write_file, append_file)
- [ ] Comprehensive docstrings with examples for each function
- [ ] Parent directory creation implemented in write_file and append_file
- [ ] Terminal output showing manual tests:
  - Create test.txt with "Hello, World!"
  - read_file("test.txt") returns "Hello, World!"
  - write_file("test.txt", "New content") - verify file overwritten
  - read_file("test.txt") returns "New content"
  - append_file("test.txt", " Appended!") - verify content added
  - read_file("test.txt") returns "New content Appended!"
  - write_file("subdir/nested.txt", "test") - verify directory created

### Checkpoint 2 (Validation & Error Handling)
- [ ] Terminal output showing TypeError for invalid filepath inputs (None, 123, [])
- [ ] Terminal output showing TypeError for invalid content inputs (None, 123, [])
- [ ] Terminal output showing ValueError for empty filepath ("")
- [ ] Terminal output showing FileNotFoundError for read_file("nonexistent.txt")
- [ ] Error messages include filepath context and are descriptive
- [ ] All validation occurs before file operations
- [ ] Edge case demonstrations:
  - Empty file handling (returns empty string)
  - UTF-8 character handling (emoji, accents)
  - Parent directory creation working

### Checkpoint 3 (Tests)
- [ ] test_file_utils.py created
- [ ] pytest output showing all tests passing (minimum 20 tests)
- [ ] Tests use tmp_path fixture for file isolation
- [ ] Tests cover all three functions with happy paths
- [ ] Tests cover edge cases (empty files, UTF-8, subdirectories, overwrite, multiple appends)
- [ ] Tests cover validation (type errors, empty filepath, value errors)
- [ ] Tests cover error conditions (file not found)
- [ ] Test names are descriptive (test_read_file_returns_content_from_existing_file)

### Checkpoint 4 (Quality)
- [ ] Coverage report showing 100% line coverage for file_utils.py
- [ ] Linter output showing 0 warnings/errors
- [ ] Code follows PEP 8 style
- [ ] All error paths tested and covered

### Checkpoint 5 (Documentation)
- [ ] UAT.md created with pass rate >=85%
- [ ] ISSUES.md finalized (all issues resolved or documented)
- [ ] All success criteria marked complete with evidence

---

## READY Format Template

```
READY CONFIRMATION - Sprint 4.0

═══════════════════════════════════════════════════════════════
SECTION 1: FILES READ (with line number citations)
═══════════════════════════════════════════════════════════════
- .claude/handoffs/sprint-4.0-prompt.md: Lines [X-Y] - [specific content]
- .claude/roles/dev_role.md: Lines [X-Y] - [specific content about READY format]
- [any other project files]: Lines [X-Y] - [specific content]

═══════════════════════════════════════════════════════════════
SECTION 2: ARCHITECTURE UNDERSTANDING
═══════════════════════════════════════════════════════════════
Blue (Orchestrator): [describe if applicable, otherwise "N/A - standalone module"]
Green (Contract): [describe file_utils function interfaces]
Red (Plugin): [describe if applicable, otherwise "N/A - standalone module"]

Data Flow: [describe how file functions process inputs to outputs]

═══════════════════════════════════════════════════════════════
SECTION 3: SUCCESS CRITERIA MAPPING
═══════════════════════════════════════════════════════════════
| # | Success Criterion | My Task | Phase |
|---|-------------------|---------|-------|
| 1 | file_utils.py file exists | Create file_utils.py | Phase 1 |
| 2 | read_file(filepath) reads correctly | Implement read_file function | Phase 1 |
[... map all 24 criteria]

═══════════════════════════════════════════════════════════════
SECTION 4: PHASE BREAKDOWN WITH TIME ESTIMATES
═══════════════════════════════════════════════════════════════
- Phase 0: READY + ISSUES.md (15 min)
- Phase 1: Core File Functions (50 min)
- Phase 2: Input Validation & Error Handling (40 min)
- Phase 3: Unit Tests (60 min)
- Phase 4: Code Quality and Coverage (25 min)
- Phase 5: Documentation - UAT.md, ISSUES.md final (30 min)
Total: 220 min

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
git checkout -b dev-sprint-4.0
git add .
git commit -m "READY submitted - Sprint 4.0"
git push origin dev-sprint-4.0

RELAY TO PM: "READY submitted for review on dev-sprint-4.0"

STOP - Awaiting PM approval.
```

---

## Working Rules

### MUST Do
| Action | When | Evidence |
|--------|------|----------|
| Create ISSUES.md | Phase 0, before code | File with header: Issue \| Type \| Severity \| Status \| Root Cause \| Resolution |
| Cite line numbers | READY and all file references | Specific lines like "45-52", not "entire file" |
| Validate all inputs | Every function | TypeError for non-string inputs, ValueError for empty filepath |
| Handle file errors | Every file operation | FileNotFoundError, PermissionError with descriptive messages |
| Create parent directories | write_file and append_file | Use os.makedirs with exist_ok=True |
| Use UTF-8 encoding | All file operations | Explicitly specify encoding='utf-8' |
| Use tmp_path fixture | All tests | Pytest tmp_path for file isolation |
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
| Use hardcoded filepaths in tests | Checkpoint rejected - must use tmp_path |
| Leave test files on filesystem | Checkpoint rejected - must use tmp_path |
| Skip parent directory creation | Checkpoint rejected |

---

## UAT Acceptance Tests

Your UAT.md must include these test cases at minimum:

### TC-01: Read File - Normal Operation
| Step | Action | Expected | Status |
|------|--------|----------|--------|
| 1 | Create test file with content "Test content" | File created | |
| 2 | Import file_utils | Module loads without error | |
| 3 | Call read_file(filepath) | Returns "Test content" | |
| 4 | Verify file still exists after read | File not deleted or modified | |

### TC-02: Read File - Empty File
| Step | Action | Expected | Status |
|------|--------|----------|--------|
| 1 | Create empty test file | File created with 0 bytes | |
| 2 | Call read_file(filepath) | Returns empty string "" | |

### TC-03: Read File - UTF-8 Content
| Step | Action | Expected | Status |
|------|--------|----------|--------|
| 1 | Create test file with content "Hello 👋 Café" | File created | |
| 2 | Call read_file(filepath) | Returns "Hello 👋 Café" exactly | |

### TC-04: Read File - File Not Found
| Step | Action | Expected | Status |
|------|--------|----------|--------|
| 1 | Call read_file("nonexistent_file_xyz.txt") | FileNotFoundError raised | |
| 2 | Verify error message includes filepath | Message contains "nonexistent_file_xyz.txt" | |

### TC-05: Write File - New File
| Step | Action | Expected | Status |
|------|--------|----------|--------|
| 1 | Call write_file("newfile.txt", "New content") | No exception raised | |
| 2 | Verify file exists | File exists on filesystem | |
| 3 | Read file content | Content is "New content" | |

### TC-06: Write File - Overwrite Existing
| Step | Action | Expected | Status |
|------|--------|----------|--------|
| 1 | Create test file with "Original content" | File created | |
| 2 | Call write_file(filepath, "New content") | No exception raised | |
| 3 | Read file content | Content is "New content" (original replaced) | |

### TC-07: Write File - Parent Directory Creation
| Step | Action | Expected | Status |
|------|--------|----------|--------|
| 1 | Verify subdirectory "testdir" does not exist | Directory absent | |
| 2 | Call write_file("testdir/file.txt", "Test") | No exception raised | |
| 3 | Verify directory created | Directory "testdir" exists | |
| 4 | Verify file exists | File "testdir/file.txt" exists | |
| 5 | Read file content | Content is "Test" | |

### TC-08: Append File - Existing File
| Step | Action | Expected | Status |
|------|--------|----------|--------|
| 1 | Create test file with "Line 1\n" | File created | |
| 2 | Call append_file(filepath, "Line 2\n") | No exception raised | |
| 3 | Read file content | Content is "Line 1\nLine 2\n" | |

### TC-09: Append File - New File
| Step | Action | Expected | Status |
|------|--------|----------|--------|
| 1 | Verify file does not exist | File absent | |
| 2 | Call append_file("newfile.txt", "First line\n") | No exception raised | |
| 3 | Verify file created | File exists | |
| 4 | Read file content | Content is "First line\n" | |

### TC-10: Append File - Multiple Appends
| Step | Action | Expected | Status |
|------|--------|----------|--------|
| 1 | Create test file with "A" | File created | |
| 2 | Call append_file(filepath, "B") | No exception raised | |
| 3 | Call append_file(filepath, "C") | No exception raised | |
| 4 | Read file content | Content is "ABC" | |

### TC-11: Input Validation - Invalid Filepath Type
| Step | Action | Expected | Status |
|------|--------|----------|--------|
| 1 | Call read_file(None) | TypeError raised with message about filepath | |
| 2 | Call read_file(123) | TypeError raised | |
| 3 | Call write_file([], "content") | TypeError raised | |

### TC-12: Input Validation - Empty Filepath
| Step | Action | Expected | Status |
|------|--------|----------|--------|
| 1 | Call read_file("") | ValueError raised with "empty string" message | |
| 2 | Call write_file("  ", "content") | ValueError raised (whitespace-only) | |

### TC-13: Input Validation - Invalid Content Type
| Step | Action | Expected | Status |
|------|--------|----------|--------|
| 1 | Call write_file("test.txt", None) | TypeError raised with message about content | |
| 2 | Call write_file("test.txt", 123) | TypeError raised | |
| 3 | Call append_file("test.txt", []) | TypeError raised | |

**Pass Threshold: 85% (at least 11/13 test cases must pass)**

---

## Git Branch
Branch name: `dev-sprint-4.0`

Create branch at start of Phase 0:
```bash
git checkout -b dev-sprint-4.0
```

All commits and pushes go to this branch until sprint completion and PM approval.

---

## Notes for DEV

1. **Import requirements** - You must import: `import os` for directory operations
2. **File encoding** - Always specify `encoding='utf-8'` explicitly in open() calls
3. **Parent directories** - Use `os.makedirs(os.path.dirname(filepath), exist_ok=True)` before write operations
4. **Empty dirname handling** - Check if dirname is empty string before calling makedirs (files in current directory)
5. **Context managers** - Use `with open(...) as f:` for automatic file closure
6. **Read operations** - Use `.read()` to get entire file contents as string
7. **Write operations** - Use mode 'w' for write_file (overwrite), mode 'a' for append_file
8. **Test isolation** - Use pytest's tmp_path fixture to avoid leaving test files: `def test_something(tmp_path):`
9. **Filepath construction** - In tests, use `tmp_path / "filename.txt"` or `os.path.join(tmp_path, "filename.txt")`
10. **STOP discipline** - Do not continue past checkpoints without PM approval
11. **Error messages** - Include filepath in error messages for better debugging
12. **Validation order** - Validate inputs before attempting any file operations
13. **Exception handling** - Let FileNotFoundError and PermissionError propagate naturally (don't catch unless adding context)

---

## PM Review Notes

This PROMPT.md satisfies all requirements per pm_role.md lines 54-74:
- [x] Sprint ID and Goal (1 sentence)
- [x] Success Criteria (24 specific, testable items)
- [x] File Manifest (create, modify, protected)
- [x] Phase Breakdown with time estimates
- [x] Checkpoint structure with exact evidence requirements
- [x] Technical specification (API with docstring templates and examples)
- [x] READY format template (all 6 sections)
- [x] Working Rules (MUST/MUST NOT tables)
- [x] UAT acceptance test steps (13 test cases with 85% threshold)
- [x] Git branch name

Ready for DEV execution.
