<!-- AI CONTEXT
WHAT: Reference this for original sources on context engineering patterns.
WHY: Links to Cole's videos, repos, and related tooling for deeper research.
HOW: Use URLs when you need to research implementation details beyond what README covers.
-->

# Sources and Research

## Primary Source

**Video:** Cole Medin - Context Engineering with Claude Code
- URL: https://youtu.be/ttdWPDmBN_4
- Key techniques: PRD-first, modular rules, commandify, context reset, system evolution

## GitHub Repositories

### coleam00/context-engineering-intro
- URL: https://github.com/coleam00/context-engineering-intro
- Contains: generate-prp.md, execute-prp.md, prp_base.md template
- Structure: `.claude/commands/`, `PRPs/templates/`

### croffasia/cc-blueprint-toolkit
- URL: https://github.com/croffasia/cc-blueprint-toolkit
- Plugin-based approach with `/bp:` prefix commands
- Commands: brainstorm, generate-prp, execute-prp, execute-task

### henkisdabro/wookstar-claude-plugins
- URL: https://github.com/henkisdabro/wookstar-claude-plugins
- Contains: /primer, /prep-parallel, /execute-parallel
- Productivity bundle with parallel worktree support

## Additional References

### Parallel Worktrees
- [Mastering Git Worktrees with Claude Code](https://medium.com/@dtunai/mastering-git-worktrees-with-claude-code-for-parallel-development-workflow-41dc91e645fe)
- [Parallel AI Coding with Git Worktrees](https://docs.agentinterviews.com/blog/parallel-ai-coding-with-gitworktrees/)
- [Claude Code: Parallel Development with /worktree](https://motlin.com/blog/claude-code-worktree)

### Claude Code Docs
- [Common Workflows](https://code.claude.com/docs/en/common-workflows)
- [Claude Code Commands](https://stevekinney.com/courses/ai-development/claude-code-commands)

## Key Insights Extracted

### PRP Structure (from prp_base.md)
1. Goal - specific end-state
2. Why - business value, problem identification
3. What - user-visible behavior, success criteria
4. Context - documentation, codebase tree, gotchas
5. Implementation Blueprint - data models, ordered tasks, pseudocode
6. Validation Loop - syntax/style, unit tests, integration tests
7. Anti-patterns - what to avoid

### Generate-PRP Workflow
1. Codebase Analysis - locate patterns, reference files, conventions
2. External Research - comparable implementations, documentation
3. User Clarification - patterns to replicate, integration requirements
4. Output to PRPs/{feature-name}.md

### Execute-PRP Workflow
1. Load PRP - read specified file
2. Plan - break into steps, use TodoWrite
3. Execute - implement requirements
4. Validate - run validation commands
5. Complete - verify checklist, final validation
