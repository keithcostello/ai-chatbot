# WAITING_ON - ai-chatbot Project

**Last Updated:** 2026-01-23
**Sprint:** S2.2-R1 (Phase 2 FAILED - Restarting with Micro-Phase Protocol)

---

## Current Blocker

| # | Blocker | Status | Action |
|---|---------|--------|--------|
| 1 | Phase 2 failed twice | BLOCKED | Restart with MICRO_PHASE_PROTOCOL.md |

---

## What Happened (2026-01-23)

**Phase 2 (Frontend Connection) failed with 3 bugs:**

| Bug | Error | Root Cause |
|-----|-------|------------|
| BUG-001 | 422 Upstream | DEV used raw fetch instead of CopilotRuntime |
| BUG-002 | 405 at "/" | DEV pointed HttpAgent to wrong path |
| BUG-003 | 405 at localhost:8080 | CopilotKit routing misconfiguration |

**Root Cause Analysis:**
- DEV not reading requirements fully
- DEV not testing before claiming complete
- PM approving without integration verification
- No micro-phase breakdown with user approval gates

---

## New Protocol Created

**File:** `.claude/docs/MICRO_PHASE_PROTOCOL.md`

**Key Rules:**
- Rule 0: Full document reading with proof (certificates required)
- Rule 0.3: DEV only sees micro-phase details (not full project)
- Rule 0.5: Phase entry STOP for micro-phase development with user
- Rule 1: Proof of reading with citations
- Rule 2: Micro-phase structure (atomic tasks)
- Rule 3: Expert review (pydantic_architect.md, copilot_kit.md)
- Rule 4: agent-browser verification for ALL AI (no exceptions)
- Rule 5: Work logs with actual output (not summaries)
- Rule 6: Environment capture at phase end
- Rule 7: Troubleshooting protocol (10 iteration max)
- Rule 8: Non-gameable testing (nonce, timestamps, independent verify)

---

## Current State

**Branch:** dev-sprint-S2.2-R1
**Commit:** a8e6b65
**Position:** Phase 2 entry - STOPPED for micro-phase development

**Completed Phases:**
- Phase 0: Architect Consultation - DONE
- Phase 1: Python Agent Setup - DONE (deployed, healthy)

**Failed Phase:**
- Phase 2: Frontend Connection - FAILED (3 bugs, restarting)

---

## To Resume

1. User and Orchestrator develop micro-phases for Phase 2
2. Each micro-phase gets expert review
3. User approves each micro-phase before execution
4. DEV receives ONLY micro-phase spec (not full project)
5. All verification uses agent-browser
6. All outputs approved by user

---

## Environment (Verified)

| Service | URL | Status |
|---------|-----|--------|
| Frontend | steertrue-chat-dev-sandbox.up.railway.app | Healthy |
| Python Agent | steertrue-pydantic-ai-dev-sandbox.up.railway.app | Healthy |

| Variable | Value | Location |
|----------|-------|----------|
| PYDANTIC_AI_URL | https://steertrue-pydantic-ai-dev-sandbox.up.railway.app | Railway frontend |
