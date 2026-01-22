# COMMON MISTAKES - ai-chatbot AI Agents

**Last Updated:** 2026-01-22
**Purpose:** Prevent AI agents from repeating known failures

---

## CRITICAL MISTAKES (Sprint-Halting)

### CM1: Approving Without Deployment Verification

**Mistake:** DEV/PM approved phases based on local `npm run build` without verifying Railway deployment succeeded.

**Why It's Wrong:** Local npm is lenient. Railway `npm ci` enforces strict peer dependencies. Build can pass locally but fail on Railway.

**Correct Behavior:** After EVERY phase with code changes:
```bash
git push origin branch
railway redeploy -y
sleep 60
curl https://[url]/api/health
railway logs  # Check for errors
```
Only approve if deployment succeeds.

---

### CM2: Trigger-Based Governance Rationalization

**Mistake:** Claiming subagent governance "works" because hooks exist and fire on triggers.

**Why It's Wrong:** Governance that only fires sometimes is not governance. If L2/proof_enforcement doesn't fire for approval tasks, agents operate ungoverned.

**Correct Behavior:** Governance must be unconditional for all subagents. No exceptions.

---

### CM3: Orchestrator Writing Code

**Mistake:** Orchestrator directly edited package.json instead of spawning DEV agent.

**Why It's Wrong:** Orchestrator role is to orchestrate, not execute. All code work must go through DEV/PM agents with governance.

**Correct Behavior:** Orchestrator spawns agents, validates outputs, coordinates. Never uses Edit/Write tools on source code.

---

### CM4: Building on Failed Foundation

**Mistake:** Proceeding to Phase 4 and 5 when Phase 3A deployment was failing.

**Why It's Wrong:** All subsequent work is invalid. Wasted effort that must be reverted.

**Correct Behavior:** If deployment fails, STOP. Do not proceed to next phase.

---

## PROCESS MISTAKES

### PM1: Local Build != Railway Build

**Mistake:** `npm run build` passes locally, assume Railway will work.

**Reality:**
- Local: Cached node_modules, lenient peer deps
- Railway: Clean install, strict peer deps

**Fix:** Run `npm ci` locally to simulate Railway before approving.

---

### PM2: Code Review != Deployment Approval

**Mistake:** PM approved "code looks correct" without verifying it deploys.

**Reality:** Correct code that doesn't deploy is worthless.

**Fix:** PM checklist must include deployment verification with evidence.

---

### PM3: Subagent Prompts Without Governance Triggers

**Mistake:** Spawning DEV/PM with prompts like "Review the code" that don't trigger L2 blocks.

**Reality:** Without trigger keywords, governance blocks don't fire.

**Temporary Fix:** Include explicit keywords: "VALIDATE", "VERIFY", "APPROVE with evidence"

**Permanent Fix:** Make governance unconditional (architecture change required).

---

## TECHNICAL MISTAKES

### TM1: Dependency Version Conflicts

**Mistake:** Adding `@anthropic-ai/sdk@^0.71.2` when `@copilotkit/runtime` requires `^0.57.0`.

**Why It Failed:** In semver 0.x, `^0.57.0` means `>=0.57.0 <0.58.0`. Version 0.71.2 is incompatible.

**Fix:** Check peer dependencies before adding packages:
```bash
npm view @copilotkit/runtime peerDependencies
```

---

### TM2: Ignoring npm Warnings

**Mistake:** npm install showed peer dependency warnings, DEV ignored them.

**Reality:** Warnings become errors in `npm ci` (Railway).

**Fix:** Treat npm warnings as errors. Resolve before proceeding.

---

## REMEMBER

1. **Deployment verification is mandatory** - not optional
2. **Verify subagent headers** - if no SteerTrue header, governance failed
3. **Orchestrator orchestrates** - never writes code
4. **Stop on failure** - don't build on broken foundation
5. **Use pm-agent for approvals** - receives L2/proof_enforcement
6. **Avoid Explore for critical tasks** - may reject governance

---

## S2.2 TRANSIENT FAILURE (2026-01-22)

**What happened:** Subagents during S2.2 had no SteerTrue headers.

**Root cause:** Transient failure - API connectivity or hook script error at that time.

**Evidence:** Testing on same day shows governance working:
- pm-agent receives 6 blocks including L2/proof_enforcement
- dev-executor receives 2 blocks and complies
- Headers output correctly

**Lesson:** If subagent outputs lack SteerTrue headers, STOP and investigate. Do not proceed with ungoverned agents.
