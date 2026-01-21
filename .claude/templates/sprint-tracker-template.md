<!-- AI CONTEXT
WHAT: Copy this template when creating a new sprint tracker. Fill in placeholders.
WHY: AI sessions are stateless. Trackers persist decisions/discussions across sessions.
HOW: 1) Copy to .claude/sprints/mlaia/sprint-X.Y/TRACKER.md 2) Fill placeholders 3) Update during sessions
-->

# Sprint [X.Y] Tracker - [Title]

## Status: [PLANNING | IN_PROGRESS | BLOCKED | COMPLETE]

**Last Updated:** [YYYY-MM-DD]
**Updated By:** [Session ID or Human]

---

## WHAT: Actions Required

| When | Action |
|------|--------|
| Session start | READ this file via `/primer` |
| Before asking user | CHECK Open Questions table - may already be answered |
| During session | LOG decisions to Decision Log table |
| Before session end | UPDATE Discussion History with session summary |

---

## WHY: Context

**Problem:** AI sessions are stateless. Each session starts fresh with no memory of prior discussions.

**Consequences without this document:**
- User repeats same answers to same questions
- Decisions made in Session A are unknown to Session B
- Planning work lost, user frustrated

**PM Methodology Basis:**
- [PMI PMBOK](https://www.pmi.org/standards/pmbok): Centralized decision documentation
- [Agile Decision Log](https://www.meegle.com/en_us/advanced-templates/sprint_planning/agile_decision_log_template): Context + rationale + outcomes

---

## HOW: Usage Instructions

1. **Open Questions** - Check BEFORE asking user anything. If question exists with RESOLVED status, use that answer.
2. **Decision Log** - When user makes a decision, add row with date, decision, options considered, rationale, who decided.
3. **Discussion History** - Add session entry with date, topic, what was discussed, conclusion reached.
4. **Context Links** - Reference these docs during sprint work. Don't search for docs that are already linked.

---

## Decision Log

Captures WHY decisions were made. Required reading for session continuity.

| Date | Decision | Options Considered | Rationale  | Decided By |
|------|----------|--------------------|------------|------------|
|      |          |                    |            |            |

---

## Discussion History

Captures cross-session discussions. Prevents re-asking same questions.

### Session [YYYY-MM-DD HH:MM] - [Brief Topic]

**Discussed:**

- [Point 1]
- [Point 2]

**Conclusion:** [Outcome or "PENDING - needs [X]"]

---

## Open Questions

Questions that need resolution before sprint can proceed.

| #   | Question | Status        | Resolved |
|-----|----------|---------------|----------|
| 1   |          | OPEN/RESOLVED |          |

---

## Context Links

Key documents for this sprint.

| Document  | Purpose                          |
|-----------|----------------------------------|
| PROMPT.md | Sprint definition (success criteria) |
| [Other]   | [Purpose]                        |

---

## Anchors (Industry References)

Per ANCHOR requirement: Verifiable expert references, not just training data.

| Source | Topic | Link |
|--------|-------|------|
|        |       |      |

---

**Template Version:** 1.0
**Created:** 2026-01-16
**Purpose:** Cross-session continuity for sprint planning discussions
