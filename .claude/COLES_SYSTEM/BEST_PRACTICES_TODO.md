<!-- AI CONTEXT
WHAT: Backlog of patterns to consider implementing later. Not active requirements.
WHY: Captured during Cole analysis but deferred. Prevents forgetting good ideas.
HOW: Review when planning improvements to CLAUDE.md or command workflows. Prioritized by P1/P2/P3.
-->

# Best Practices - For Later Consideration

Patterns from Cole's system not yet implemented. Review after Phase 1 validates.

---

## Modular Rules Architecture

**Concept:** Keep CLAUDE.md lightweight (~200 lines). Reference detailed docs only when relevant.

**Current State:** CLAUDE.md exists but may be loading too much upfront.

**Action:** Audit CLAUDE.md. Move task-specific rules to `.claude/reference/` docs. Add reference section pointing to them.

**Example structure:**
```
.claude/reference/
├── api-development.md      # Load when working on API
├── frontend-components.md  # Load when working on UI
├── deployment.md           # Load when deploying
└── testing-patterns.md     # Load when writing tests
```

---

## Context Reset Between Phases

**Concept:** Clear conversation between planning and execution. Only feed the PRP doc to execution.

**Current State:** Not enforced. `/execute-prp` would handle this in Phase 2.

**Action:** When implementing `/execute-prp`, emphasize starting fresh conversation or using `/clear`.

---

## System Evolution Mindset

**Concept:** Every bug is an opportunity to improve the system (rules, commands, templates), not just fix the code.

**Current State:** COMMON_MISTAKES.md captures patterns manually.

**Action:** Consider command like `/evolve-system` that prompts reflection:
- What went wrong?
- Which rule/command/template should change?
- How do we prevent this class of bug?

---

## Confidence Scoring

**Concept:** Rate 1-10 confidence that PRP can be implemented in one pass. Target 8+.

**Current State:** Added to template but not enforced.

**Action:** Consider blocking execution if confidence < 7. Force more research.

---

## Reference Section in Global Rules

**Concept:** CLAUDE.md has explicit "when working on X, read Y" mappings.

**Example from Cole:**
```markdown
## Reference
- When working on API endpoints → read `.claude/reference/api.md`
- When working on auth → read `.claude/reference/auth.md`
```

**Action:** Add similar section to CLAUDE.md after identifying common task types.

---

## PRD as North Star

**Concept:** Single document defining entire project scope. All features derive from it.

**Current State:** WAITING_ON.md serves similar purpose but is more tactical.

**Action:** Consider creating `docs/PRD.md` for SteerTrue project-level scope. Features reference it.

---

## Review Priority

| Practice | Impact | Effort | Priority |
|----------|--------|--------|----------|
| Modular rules | High | Medium | P1 |
| System evolution command | Medium | Low | P2 |
| PRD north star | Medium | Medium | P2 |
| Reference section | Medium | Low | P2 |
| Confidence enforcement | Low | Low | P3 |
