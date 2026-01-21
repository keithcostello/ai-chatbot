<!-- AI CONTEXT
WHAT: Follow this procedure when a promotion causes issues requiring rollback.
WHY: Rollbacks are stressful. Step-by-step procedure prevents mistakes during incidents.
HOW: 1) Check Decision Criteria (rollback vs fix-forward) 2) Follow steps in order 3) Complete Evidence section
-->

# Rollback Procedure

Use when promotion causes issues that cannot be quickly fixed forward.

---

## Decision Criteria

**Roll back if:**
- Health endpoint failing
- Critical functionality broken
- Data corruption detected
- Fix would take > 30 minutes

**Do NOT roll back if:**
- Minor UI issue
- Non-critical feature broken
- Can be fixed with quick hotfix (< 15 minutes)

---

## Rollback Steps

### Step 1: Announce
Notify team that rollback is in progress.
- Who notified: ________________
- Time: ________________

### Step 2: Identify the Problem
```powershell
# Check health
Invoke-RestMethod -Uri "https://[URL]/api/v1/health"

# Check logs
railway link -p 7e819fb2-6401-4390-be5f-d66ede223933 -e [ENV]
railway logs --service [SERVICE] | head -50
```

Problem identified: ________________

### Step 3: Git Rollback
```powershell
# Identify the merge commit
git log --oneline -5

# Revert the merge
git checkout [BRANCH]
git revert -m 1 [MERGE-COMMIT-SHA]
git push origin [BRANCH]
```

Revert commit SHA: ________________

### Step 4: Wait for Auto-Deploy
- Check Railway dashboard
- Wait for deployment complete
- Deployment status: ________________

### Step 5: Database Rollback (If Schema Changed)

Only needed if:
- Migration was run
- Data was modified
- Schema changed

```powershell
.\scripts\restore-database.ps1 -Environment [ENV] -BackupFile [BACKUP-PATH]
```

Database restored: [ ] Yes / [ ] No (not needed)

### Step 6: Verify Recovery
```powershell
# Health check
Invoke-RestMethod -Uri "https://[URL]/api/v1/health"

# Sync blocks if needed
Invoke-RestMethod -Uri "https://[URL]/api/v1/settings/refresh" -Method POST
```

Health status after rollback: ________________
Blocks loaded: ________________

### Step 7: Document
Complete the evidence section below.

---

## Rollback Evidence

| Field | Value |
|-------|-------|
| Environment rolled back | ________________ |
| Problem description | ________________ |
| Git revert commit | ________________ |
| Database restored | [ ] Yes / [ ] No (not needed) |
| Backup file used | ________________ |
| Health after rollback | ________________ |
| Blocks after rollback | ________________ |
| Rollback completed by | ________________ |
| Date/Time | ________________ |
| Total downtime | ________________ |

---

## Post-Mortem (Required)

| Question | Answer |
|----------|--------|
| What broke? | ________________ |
| Root cause | ________________ |
| Why wasn't it caught in dev-sandbox? | ________________ |
| What check should be added? | ________________ |
| Action items | ________________ |

---

## Environment Reference

| Environment | Health URL |
|-------------|------------|
| dev-sandbox | https://steertrue-sandbox-dev-sandbox.up.railway.app/api/v1/health |
| keith-dev | https://steertrue-keith-keith-dev.up.railway.app/api/v1/health |
| amy-dev | https://steertrue-amy-amy-dev.up.railway.app/api/v1/health |
