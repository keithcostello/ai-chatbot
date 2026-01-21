# Sprint Workflow V2 (Environment Separation)

**Version:** 2.0
**Effective:** 2026-01-09
**Supersedes:** Direct master deployment

---

## Overview

| Stage | Branch | Environment | Gate |
|-------|--------|-------------|------|
| Development | dev | dev-sandbox | None |
| Keith Review | keith | keith-dev | PR approval |
| Amy Promotion | amy | amy-dev | PR approval |
| Production | master | SteerTrue Clone | Manual only |

---

## Pre-Sprint (MANDATORY)

### 1. Database Backup
Before ANY sprint work:
```powershell
.\scripts\backup-database.ps1 -Environment dev-sandbox -Reason "pre-sprint-[SPRINT-ID]"
```
- Backup file: ________________
- Timestamp: ________________

### 2. Branch Verification
```powershell
cd "C:\PROJECTS\SINGLE PROJECTS\dev_pm_branch"
git pull origin dev
git branch --show-current
```
- On `dev` branch: [ ] Yes

### 3. Environment Health Check
```powershell
Invoke-RestMethod -Uri "https://steertrue-sandbox-dev-sandbox.up.railway.app/api/v1/health"
```
- Status: healthy [ ] Yes
- Blocks: 16 [ ] Yes

---

## During Sprint

All development happens on `dev` branch:
- Commits go to `dev`
- Auto-deploy to dev-sandbox
- Test on dev-sandbox
- DO NOT touch `keith` or `amy` branches

### Development Loop
```
1. Make changes in dev_pm_branch folder
2. Commit to dev
3. Push to origin dev
4. Verify auto-deploy on dev-sandbox
5. Test changes
6. Repeat until sprint complete
```

---

## Post-Sprint (Before Promotion)

### 1. Sprint Validation Complete
- [ ] All acceptance criteria met
- [ ] Tests passing
- [ ] UAT complete on dev-sandbox

### 2. Pre-Promotion Backup
```powershell
.\scripts\backup-database.ps1 -Environment keith-dev -Reason "pre-promotion-[SPRINT-ID]"
```

### 3. Create Promotion PR
```powershell
cd "C:\PROJECTS\SINGLE PROJECTS\keith_branch"
git fetch origin
gh pr create --base keith --head dev --title "Promote [SPRINT-ID] to keith-dev"
```

### 4. Keith Approval
- PR URL: ________________
- Approved by: ________________
- Approval date: ________________

### 5. Merge and Verify
```powershell
gh pr merge [PR-NUMBER] --merge
```
- Wait for keith-dev auto-deploy
- Verify health:
```powershell
Invoke-RestMethod -Uri "https://steertrue-keith-keith-dev.up.railway.app/api/v1/health"
```

---

## Promotion to Amy (After Keith Validates)

### 1. Pre-Promotion Backup
```powershell
.\scripts\backup-database.ps1 -Environment amy-dev -Reason "pre-promotion-[SPRINT-ID]"
```

### 2. Create Promotion PR
```powershell
gh pr create --base amy --head keith --title "Promote [SPRINT-ID] to amy-dev"
```

### 3. Merge and Verify
- Wait for amy-dev auto-deploy
- Verify health:
```powershell
Invoke-RestMethod -Uri "https://steertrue-amy-amy-dev.up.railway.app/api/v1/health"
```

---

## Rollback Procedure

If promotion causes issues:

### 1. Stop (Don't Panic)
- Document what went wrong
- Note current state

### 2. Git Rollback
```powershell
git checkout keith
git revert HEAD
git push origin keith
```

### 3. Database Rollback (If Needed)
```powershell
.\scripts\restore-database.ps1 -Environment keith-dev -BackupFile "[PRE-PROMOTION-BACKUP]"
```

### 4. Verify Recovery
```powershell
Invoke-RestMethod -Uri "https://steertrue-keith-keith-dev.up.railway.app/api/v1/health"
```

### 5. Post-Mortem
- What broke?
- Why wasn't it caught in dev-sandbox?
- What check should be added?

---

## Quick Reference

```
1. PRE-SPRINT
   - Backup dev-sandbox database
   - Verify on dev branch

2. SPRINT EXECUTION
   - All work on dev branch
   - Auto-deploy to dev-sandbox
   - Test on dev-sandbox

3. SPRINT COMPLETE
   - Backup keith-dev database
   - Create PR: dev -> keith
   - Keith approves
   - Merge -> auto-deploy keith-dev
   - Verify keith-dev health

4. PROMOTE TO AMY
   - Backup amy-dev database
   - Create PR: keith -> amy
   - Merge -> auto-deploy amy-dev
   - Verify amy-dev health
```

---

## Promoting Changes to Users (Quick Commands)

When you have changes in dev that need to go to all users:

### Step 1: Commit and Push on Dev
```powershell
cd "C:\PROJECTS\SINGLE PROJECTS\dev_pm_branch"
git add .
git commit -m "Description of changes"
git push origin dev
```

### Step 2: Promote Dev → Keith
```powershell
gh pr create --base keith --head dev --title "Promote: [description]"
gh pr merge [PR-NUMBER] --merge
```

### Step 3: Promote Keith → Amy
```powershell
gh pr create --base amy --head keith --title "Promote: [description]"
gh pr merge [PR-NUMBER] --merge
```

### Step 4: Users Pull Latest
Keith (on keith_branch folder):
```powershell
git pull origin keith
```

Amy (on amy_branch folder):
```powershell
git pull origin amy
```

**Note:** Auto-deploy updates Railway environments automatically after each merge.

---

## Environment URLs

| Environment | Health Endpoint | Log Viewer |
|-------------|-----------------|------------|
| dev-sandbox | https://steertrue-sandbox-dev-sandbox.up.railway.app/api/v1/health | https://steertrue-sandbox-dev-sandbox.up.railway.app/logs/view |
| keith-dev | https://steertrue-keith-keith-dev.up.railway.app/api/v1/health | https://steertrue-keith-keith-dev.up.railway.app/logs/view |
| amy-dev | https://steertrue-amy-amy-dev.up.railway.app/api/v1/health | https://steertrue-amy-amy-dev.up.railway.app/logs/view |
| SteerTrue Clone (prod) | https://steertrue-sandbox-steertrue-clone.up.railway.app/api/v1/health | https://steertrue-sandbox-steertrue-clone.up.railway.app/logs/view |

---

## Local Folder Mapping

| Folder | Branch | Environment | User |
|--------|--------|-------------|------|
| dev_pm_branch | dev | dev-sandbox | dev |
| keith_branch | keith | keith-dev | keith |
| amy_branch | amy | amy-dev | amy |
| mlaia-sprint-new | master | (production) | - |
