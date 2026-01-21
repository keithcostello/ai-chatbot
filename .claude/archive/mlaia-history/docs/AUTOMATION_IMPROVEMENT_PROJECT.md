# .claude Automation Improvement Project

**Objective:** Increase development velocity through automation and parallel workflow enablement

**Hypothesis:** Current process overhead + missing automation patterns limit velocity. Adding expert patterns (Boris Cherny workflow, v2.1.0 features) can improve throughput 2-3x.

**Success Criteria:** Measurable velocity increase in post-implementation sprint

---

## Current State

**Have:**
- Hooks: UserPromptSubmit, PreToolUse
- Agents: pm-agent, dev-executor, design-reviewer
- Commands: /run-sprint, /closeout-sprint
- Process infrastructure: checkpoints, escalations, handoffs

**Missing:**
- PostToolUse hooks (automatic formatting/testing)
- Slash commands for repeated workflows (/ship, /verify)
- .claude/skills/ directory (hot reload, structured workflows)
- Automation for commit/push/PR flow
- Git worktree setup for parallel sessions

---

## Improvements (Priority Order)

### Priority 1: High Impact, Low Effort

**P1.1 - Add /ship Command**
- Pattern: Boris Cherny's /commit-push-pr (used "dozens of times daily")
- Automates: git status, diff, commit, push, PR creation
- Impact: Reduces manual workflow overhead
- File: `.claude/commands/ship.md`

**P1.2 - Add PostToolUse Hooks**
- Pattern: Automatic formatting after Write/Edit
- Automates: code formatting, linting
- Impact: Eliminates manual format step
- Config: `.claude/settings.json` PostToolUse section

**P1.3 - Add SessionStart Hook**
- Pattern: Load git context on session start
- Automates: git status, recent commits display
- Impact: Reduces context-gathering time
- Config: `.claude/settings.json` SessionStart section

**P1.4 - Add /verify Command**
- Pattern: Boris Cherny's verification loop (2-3x quality improvement)
- Automates: test → fix → build cycle
- Impact: Systematic quality verification
- File: `.claude/commands/verify.md`

### Priority 2: Enable Parallelization

**P2.1 - Define Interface Contracts**
- Pattern: API specs, data models for frontend/backend boundary
- Enables: Independent parallel work
- Impact: Reduces integration conflicts
- Location: Define before implementing parallel sessions

**P2.2 - Create .claude/skills/ Directory**
- Pattern: v2.1.0 hot reload, structured workflows
- Includes: TDD workflow, debugging workflow, planning workflow
- Impact: Reusable patterns, no session restart
- Files: `.claude/skills/*.md` with `context: fork` frontmatter

**P2.3 - Git Worktree Setup**
- Pattern: Boris Cherny's parallel session management
- Enables: 5 local + 5-10 web sessions without conflicts
- Impact: True parallel development
- Command: `git worktree add ../path frontend-work`

### Priority 3: Parallel Execution

**P3.1 - Run 2 Parallel Sessions**
- Pattern: Frontend + Backend split
- Requires: P2.1, P2.2, P2.3 complete
- Impact: 1.5-1.8x additional improvement
- Setup: Separate worktrees, own Claude Code sessions

**P3.2 - Measure & Iterate**
- Baseline: Features/week before changes
- After automation: Measure improvement
- After parallel: Measure additional improvement
- Adjust: Based on merge conflicts, integration issues

---

## Non-Negotiables (User Requirements)

**UAT Required:**
- AI cannot be trusted during coding phase
- UAT catches fabrication and logic errors
- Automation should reduce UAT overhead, not eliminate it
- Maintain current UAT rigor while improving process efficiency

**Quality Bar:**
- Current Grade A- output is acceptable
- Don't sacrifice quality for speed
- Proof enforcement remains mandatory
- Evidence-based verification stays in place

---

## Expected Outcomes

**After Priority 1 (Automation):**
- 2x velocity improvement from reduced manual overhead
- Same quality bar (Grade A-)
- Lower context-switching cost

**After Priority 2 + 3 (Parallelization):**
- Additional 1.5-1.8x improvement
- Total: 3-3.6x velocity improvement
- Measured via sprint completion rate

---

## Implementation Plan

1. Backup current .claude folder (archive_claude)
2. Implement one change at a time
3. Test each change in isolation
4. Run sprint to measure velocity improvement
5. Iterate based on results

---

## References

- [Boris Cherny Workflow - InfoQ](https://www.infoq.com/news/2026/01/claude-code-creator-workflow/)
- [Claude Code v2.1.0 Release](https://venturebeat.com/orchestration/claude-code-2-1-0-arrives-with-smoother-workflows-and-smarter-agents/)
- [Hooks Reference - Claude Docs](https://code.claude.com/docs/en/hooks)
- [How to Use Claude Code Subagents to Parallelize Development](https://zachwills.net/how-to-use-claude-code-subagents-to-parallelize-development/)
