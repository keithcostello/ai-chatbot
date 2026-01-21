<!-- AI CONTEXT
WHAT: Copy this checklist before promoting code between environments. Fill as you go.
WHY: Promotions can cause outages. Checklist ensures no steps skipped, creates audit trail.
HOW: 1) Copy for each promotion 2) Complete Pre-Promotion section 3) Execute Promotion 4) Verify Post-Promotion
-->

# Promotion Checklist

**Sprint:** ________________
**From:** dev -> keith / keith -> amy (circle one)
**Date:** ________________

---

## Pre-Promotion

- [ ] Sprint validation complete on source environment
- [ ] All tests passing
- [ ] UAT approved
- [ ] Database backup of target environment created
  - Backup file: ________________
  - Backup size: ________________

---

## Promotion

- [ ] PR created
  - PR URL: ________________
  - PR title: ________________
- [ ] PR reviewed and approved
  - Approver: ________________
  - Approval time: ________________
- [ ] PR merged
  - Merge commit: ________________
- [ ] Auto-deploy triggered
  - Deployment visible in Railway: [ ] Yes
  - Deployment status: ________________

---

## Post-Promotion

- [ ] Health check passes
  - Endpoint: ________________
  - Status: ________________
  - Blocks loaded: ________________
  - Uptime: ________________ (should be low = fresh deploy)

- [ ] Smoke test passed
  - Test performed: ________________
  - Result: ________________

---

## Sign-Off

| Field | Value |
|-------|-------|
| Promoted by | ________________ |
| Verified by | ________________ |
| Date/Time | ________________ |
| Issues encountered | ________________ |

---

## Rollback Info (Keep Handy)

If issues occur after promotion:

**Backup file:** ________________

**Rollback command:**
```powershell
.\scripts\restore-database.ps1 -Environment [ENV] -BackupFile "[BACKUP-PATH]"
```

**Git revert:**
```powershell
git checkout [BRANCH]
git revert HEAD
git push origin [BRANCH]
```
