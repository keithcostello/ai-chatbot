---
name: ship
description: Commit, push, and create PR (Boris Cherny pattern)
---

# Quick Ship Command

Automates the complete ship workflow from changes to PR.

## Workflow

1. **Review Changes**
   - Run `git status` to see all modified/untracked files
   - Run `git diff` to see both staged and unstaged changes
   - Run `git log --oneline -5` to understand commit message style

2. **Draft Commit Message**
   - Analyze changes to understand what was done
   - Follow repository's commit message style (from git log)
   - Focus on "why" not "what" (changes are visible in diff)
   - Keep it concise (1-2 sentences)
   - Format: "Action: description"
     - Actions: Add, Update, Fix, Refactor, Remove, etc.

3. **Stage and Commit**
   - Add relevant files to staging area
   - Commit with message using HEREDOC format:

   ```bash
   git commit -m "$(cat <<'EOF'
   Commit message here.

   Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com>
   EOF
   )"
   ```

4. **Push to Remote**
   - Check if branch tracks remote: `git status`
   - If new branch: `git push -u origin <branch-name>`
   - If existing: `git push`

5. **Create Pull Request**
   - Use `gh pr create` with:
     - Title: Clear, descriptive (matches commit if single commit)
     - Body format (use HEREDOC):
       ```
       ## Summary
       <1-3 bullet points>

       ## Test plan
       [Bulleted markdown checklist of testing done]

       🤖 Generated with [Claude Code](https://claude.com/claude-code)
       ```

6. **Output PR URL**
   - Return the PR URL for user to review

## Key Rules

- NEVER skip reading git status/diff/log first
- NEVER commit without seeing changes
- NEVER push to main/master without user confirmation
- NEVER use --no-verify or skip hooks
- ALWAYS use HEREDOC for commit messages (proper formatting)
- ALWAYS include Co-Authored-By line
- DO NOT commit files with secrets (.env, credentials.json)

## Usage

Simply invoke: `/ship`

The command will walk through all steps, showing output at each stage.
