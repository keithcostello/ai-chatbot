# HANDOFF: Three-Repo Migration Complete - 2025-12-12

## WHAT WAS DONE

Migrated from git worktree architecture to three independent repositories for full isolation.

### Problem Solved
Git worktrees were causing file loss during syncs and merges. Files like USER.md and docs were unexpectedly deleted. The worktree `.git` files pointing to shared repositories created corruption risks.

### Solution Implemented
Three completely independent git repositories, each with their own `.git` directory (not worktree files).

---

## NEW ARCHITECTURE

```
C:\PROJECTS\SINGLE PROJECTS\
├── mlaia-planning\     ← Framework/docs home (independent repo)
├── mlaia-sprint\       ← Development home (independent repo) ← YOU ARE HERE
└── mlaia\              ← Production only (independent repo)
```

### GitHub Repos

| Local Directory | GitHub Repo | Purpose |
|-----------------|-------------|---------|
| mlaia-planning | keithcostello/mlaia-planning | Framework, docs, design |
| mlaia-sprint | keithcostello/mlaia-sprint | Sprint dev work, Railway sandbox |
| mlaia | keithcostello/mlaia | Production deployments |

### Ownership Model

```
mlaia-planning OWNS:              mlaia-sprint OWNS:
────────────────────              ────────────────────
docs/                             .claude/
ai/                               steertrue/
scripts/
memory-server/
tooling/
WAITING_ON.md
CLAUDE.md


LOCAL TO EACH (never synced):
─────────────────────────────
USER.md  ← Each repo has its own, never overwritten
```

---

## RAILWAY CONFIGURATION

| Repo | Environment | URL |
|------|-------------|-----|
| mlaia-sprint (master) | Sandbox | mlaia-sandbox-production.up.railway.app |
| mlaia (main) | Production | softwaredesignv20-production.up.railway.app |

Railway is connected to `keithcostello/mlaia-sprint` for sandbox deployments.

---

## BRANCH STRATEGY

**Simplified with isolation:**
- `mlaia-sprint`: Create sprint branches (`dev-sprint-X.X.X`), merge to `master` when complete
- `mlaia`: `main` only - Keith controls production pushes manually
- `mlaia-planning`: `master` - framework docs, no deployment

No `develop` branch needed. Each sprint is its own branch.

---

## SYNC SCRIPTS

Located in `scripts/` directory:

| Script | Purpose |
|--------|---------|
| sync-planning-to-sprint.ps1 | Push docs/framework from planning → sprint |
| sync-sprint-to-planning.ps1 | Pull .claude/steertrue from sprint → planning |
| push-to-production.ps1 | Push to production (requires confirmation) |
| backup-planning.ps1 | Create backup |

**When to sync:**
- After framework/design changes in planning → run `sync-planning-to-sprint.ps1`
- After sprint code changes → run `sync-sprint-to-planning.ps1`
- After UAT passes → Keith runs `push-to-production.ps1`

---

## CURRENT STATE

### Sprint Status
- Sprint 1.4.1: COMPLETE (merged)
- Next: Sprint 1.4.2 (when ready)

### Files Present
This repo (mlaia-sprint) contains:
- `.claude/` - Sprint artifacts, agents, commands, checkpoints
- `steertrue/` - Application code (Blue/Green/Red blocks)
- `docs/` - Synced from planning (read-only conceptually)
- `ai/` - Synced from planning
- `scripts/` - Sync scripts

---

## BOOTSTRAP REQUIREMENTS

On session start, read:
1. `ai/bootstrap/MLAIA_BOOTSTRAP_4.3_full.aipl` (or latest version)
2. Logic bundles: G0, G1, G3, L3_5
3. `USER.md`
4. `WAITING_ON.md`

Or simply tell AI: "read and execute ai/bootstrap/MLAIA_BOOTSTRAP_4.3_full.aipl"

---

## USER PREFERENCES (Keith)

- Direct communication, no sycophancy
- PowerShell for Windows (not bash)
- Tables over prose
- Compliance footer required on every response
- Self-grade footer: `[G0:grade G1:grade L3_3:mode L3_5:grade]`

---

## KEY LESSON FROM PREVIOUS SESSION

**Never mark a task complete without executing it.**

Previous AI was terminated for P28 violation (claiming backup was done when it wasn't).

If you create a todo item:
1. Execute it and verify completion
2. Mark it as pending/blocked with explanation
3. Remove it if no longer needed

Marking complete without doing = lying = termination.

---

## NEXT STEPS

1. **Directory rename pending** - Keith handling manually (renaming -new dirs)
2. **Update WAITING_ON.md** - Reflect new three-repo architecture
3. **Sprint 1.4.2** - Ready to start when Keith initiates

---

**Migration completed by:** Claude Opus 4.5
**Date:** 2025-12-12
**Source:** mlaia-planning-backup-20251212
