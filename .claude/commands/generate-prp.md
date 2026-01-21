---
name: generate-prp
description: Create implementation blueprint from planning conversation
arguments:
  - name: feature_name
    description: Name for the PRP file (e.g., "user-auth", "api-refactor")
    required: true
---

# Generate PRP Command

Create a comprehensive Product Requirements Prompt (PRP) - an implementation blueprint that contains everything needed to build a feature in a single session.

## Prerequisites

Run this AFTER a planning conversation where you've discussed:
- What you want to build
- Why it matters
- How it should work

## Process

### 1. Codebase Analysis

Search for existing patterns:
- Similar features already implemented
- Conventions used (naming, file structure, testing)
- Reference files to follow

```bash
# Find similar patterns
grep -rn "relevant_pattern" --include="*.py" --include="*.ts"
```

### 2. Gather Context

Identify what the implementation will need:
- Which files to modify
- Which files to create
- Dependencies required
- Integration points

### 3. Generate PRP

Read the template and output to `PRPs/$ARGUMENTS.md`:

```bash
# Template location
.claude/templates/prp-template.md
```

Fill in ALL sections:
- Goal (specific end-state)
- Why (business value)
- What (user-visible behavior + success criteria)
- Context (files, patterns, gotchas)
- Tasks (ordered, specific)
- Validation (how to verify it works)

### 4. Confidence Score

End the PRP with a confidence score:

```
## Confidence: X/10

[Explanation of what would increase confidence]
```

Target: 8/10 or higher before execution.

## Output Location

```
PRPs/{feature_name}.md
```

## Usage

After planning conversation:

```
/generate-prp user-authentication
/generate-prp api-rate-limiting
/generate-prp dashboard-redesign
```

## Key Rules

- DO include real file paths from codebase analysis
- DO include actual code patterns found
- DO list specific validation commands
- DON'T be vague ("update the code")
- DON'T skip the confidence score
- DON'T start implementing - this is planning only

## Next Step

After generating PRP:
1. Review it with user
2. Clear context (`/clear` or new conversation)
3. Execute with `/execute-prp PRPs/{feature_name}.md` (Phase 2)

Or for major features, use `/run-sprint` instead.
