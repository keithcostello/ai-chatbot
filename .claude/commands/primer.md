---
name: primer
description: Session state recovery - load context, show status, provide clear next actions
---

# Primer Command

Session state recovery. Tells you WHAT's happening, WHAT's next, and your calls to action.

## What This Command Does

### 1. Check for Handoff (AFTER project selection)

**DO NOT scan docs/handoff/ directly.** Use the project's WAITING_ON.md "Relevant Handoff" field.

```
1. Read project's WAITING_ON.md
2. Check "Relevant Handoff:" field
3. If path specified → validate file exists, then load
4. If "None" → skip handoff loading
5. If field missing → skip handoff loading (legacy file)
```

**Validation:** If handoff path specified but file doesn't exist, warn:
```
⚠️ Handoff reference invalid: [path] does not exist. Proceeding without handoff context.
```

Handoff contains: session state, current work, patterns, lessons

### 2. Load Memory Files (FIRST - user context)

```
1. memory/USER.md                    → User preferences, communication style, environment
2. memory/ai/COMMON_MISTAKES.md      → Patterns to avoid (scan headings, not full content)
```

### 3. Discover Available Projects

```bash
# Scan for project folders (names only - do NOT read content yet)
ls memory/projects/
```

**Selection logic (MUST follow):**

- If only one project → load it automatically (proceed to step 4)
- If multiple projects → show folder names, ASK which to load, THEN proceed to step 4
- If user invoked `/primer [project-name]` → load that specific project directly

**Output format (multiple projects):**
```
Available Projects:
1. steertrue (default)
2. doc-audit

Which project?
```

**CRITICAL:** Do NOT read WAITING_ON.md for projects user didn't select. That wastes context.

### 4. Load Selected Project State

```
1. memory/projects/[selected]/WAITING_ON.md         → Current state, active work, next actions
2. Check "Relevant Handoff:" field → if valid path, load that handoff
3. docs/design/PROJECT_VISION.md                    → Project scope, architecture, what's built
4. docs/PROCESS_INDEX.md                            → Process documentation reference
```

**Note:** Only load the selected project's WAITING_ON.md and its referenced handoff. Do NOT scan docs/handoff/ or load all projects.

### 5. Check Sprint Readiness (CRITICAL - M74, M75)

Before suggesting `/run-sprint`, verify:
```
1. Sprint folder exists: `.claude/sprints/mlaia/sprint-X.Y/`
2. PROMPT.md exists in that folder
3. TRACKER.md exists (for cross-session continuity)
4. If folder/PROMPT.md MISSING → Status is "PLANNING REQUIRED", NOT "READY"
5. If TRACKER.md MISSING → Warn "Prior discussions may be lost"
6. If TRACKER.md EXISTS → Surface Open Questions table in output
```

**DO NOT recommend `/run-sprint` if sprint folder or PROMPT.md is missing.**

**TRACKER.md template:** `.claude/templates/sprint-tracker-template.md`

### 6. Check Git State

```bash
git branch --show-current
git status
git log --oneline -3
```

### 7. Parse Session State

From selected project's WAITING_ON.md, extract:
- **CURRENT section** → What's actively being worked on
- **Status** → READY/BLOCKED/IN_PROGRESS/PLANNING REQUIRED
- **Next Step** → Exact command or action to take
- **Blockers** → Anything preventing progress

### 8. Output Session Recovery

Present findings in this format:

```
## Session State Recovery

**Branch:** [current branch]
**Project:** [selected project name]
**Phase:** [current phase from PROJECT_VISION]
**Handoff:** [Found: filename | None]

---

### HANDOFF CONTEXT (if found)

[Summary from handoff: what happened last session, key decisions, patterns to continue]

---

### CURRENT WORK

**Goal:** [from WAITING_ON CURRENT section - Goal field]
**Status:** [READY TO START / IN PROGRESS / BLOCKED]

[Brief description of current work item]

---

### NEXT ACTIONS

1. **[Primary action]**
   ```
   [exact command to run]
   ```

2. **[Secondary action if applicable]**
   ```
   [exact command]
   ```

---

### BLOCKERS (if any)

- [Blocker 1]
- [Blocker 2]

---

### GIT STATE

- Branch: [branch name]
- Uncommitted: [yes/no + summary]
- Last commit: [SHA + message]

---

### PROCESS QUICK REFERENCE

- Handoff: `docs/handoff/HANDOFF_TEMPLATE_V3_FORM.md`
- Sprint: `/run-sprint [sprint-id]`
- Processes: `docs/PROCESS_INDEX.md`
```

## Key Rules

- DO read actual files, don't assume content
- DO parse WAITING_ON.md for actionable state
- DO provide exact commands as calls to action
- DO show blockers prominently if any exist
- DON'T say "What would you like to work on?" - tell them what's next
- DON'T start implementing anything
- DON'T load full sprint history or archive docs

## Example Output (PLANNING REQUIRED - sprint folder missing)

```
## Session State Recovery

**Branch:** dev
**Phase:** Phase 2 - Admin UI Development

---

### CURRENT WORK

**Goal:** Scope Sprint 2.0 before execution
**Status:** PLANNING REQUIRED

Sprint folder `.claude/sprints/mlaia/sprint-2.0/` does not exist.
PROMPT.md with success criteria must be created before `/run-sprint`.

---

### NEXT ACTIONS

1. **Plan Sprint 2.0** (create folder + PROMPT.md)
   - Create `.claude/sprints/mlaia/sprint-2.0/`
   - Create PROMPT.md with success criteria table

2. **After planning complete:**
   ```
   /run-sprint 2.0 "Admin UI scaffold + health dashboard"
   ```

---

### GIT STATE

- Branch: dev
- Uncommitted: No
- Last commit: eff90ba - Stop tracking per-user memory files

---

### PROCESS QUICK REFERENCE

- Handoff: `docs/handoff/HANDOFF_TEMPLATE_V3_FORM.md`
- Sprint: `/run-sprint [sprint-id]`
- Processes: `docs/PROCESS_INDEX.md`
```

## Usage

```
/primer                      # Load default project (steertrue)
/primer steertrue            # Explicitly load steertrue project
/primer document-cleanup     # Load specific project by name
/primer PRPs/my-feature.md   # Load with feature doc context
```

**Project selection:**
- No argument → load steertrue (primary)
- Project name → load that project's WAITING_ON.md
- Feature doc → also read that document and include its scope

## Integration

- Session initializer with state recovery
- Provides clear calls to action, not vague questions
- Pairs with `/run-sprint` for sprint execution
- References `docs/PROCESS_INDEX.md` for process discovery
