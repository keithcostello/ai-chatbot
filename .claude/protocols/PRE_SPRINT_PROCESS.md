# Pre-Sprint Process Protocol

## Overview

Before any sprint execution begins, the sprint plan must pass through a 6-step validation pipeline. Each step loads specific personas and context files to review the sprint from different perspectives. This multi-pass approach catches issues that single-perspective review would miss.

## Process Flow

```
Create → DevOps Readiness → Design Review → Adversarial Review → Guardian Review → Protocol Check
```

---

## Step 1: Sprint Creation

**Purpose:** Generate or review the sprint plan using systems integration perspective.
**Anchor:** AI MUST anchor dataset to task specific related industry experts who can be referenced prior to beginning task. AI must disclose anchor points before beginning task. Anchor must have a referencable link that can be click and verified.

**Instruction Template:**
```
Review or create sprint X.X using these skills and persona. The Microsprint process is prescriptive and must be followed. Reading docs is NOT optional.
```

**Context Files:**
- `docs\architecture\BLUE_GREEN_RED_ARCHITECTURE_PRIMER_V2.md`
- `docs\framework\AIPL\AIPL_SPEC_v0.9.md`
- `docs\framework\logic_bundles\AI_FUNCTIONS\L_3_systems_integration_engineer_role.aipl`
- `docs\framework\logic_bundles\AI_FUNCTIONS\STEERTRUE_ARCHITECTURE_VISUAL_V3.md`
- `docs\framework\logic_bundles\G3_ACTIVE_REASONING.aipl`
- `docs\framework\logic_bundles\L3_5_task_response.aipl`
- `docs\framework\logic_bundles\L3_4_fierce_executor.aipl`
- `docs\framework\logic_bundles\L4_MICRO_SPRINT_PLANNING.aipl`
- `steertrue\docs`

**Key Persona:** Systems Integration Engineer

---

## Step 2: DevOps Readiness

**Purpose:** Validate deployment readiness - migrations, environment, rollback plan.
**Anchor:** AI MUST anchor dataset to task specific related industry experts who can be referenced prior to beginning task. AI must disclose anchor points before beginning task. Anchor must have a referencable link that can be click and verified.

**Instruction Template:**
```
Review sprint X.X for deployment readiness using the following skills and persona.
Validate migration safety, environment requirements, and rollback procedures. Reading docs is NOT optional.
```

**Context Files:**
- `docs\architecture\BLUE_GREEN_RED_ARCHITECTURE_PRIMER_V2.md`
- `docs\framework\AIPL\AIPL_SPEC_v0.9.md`
- `docs\framework\logic_bundles\AI_FUNCTIONS\STEERTRUE_ARCHITECTURE_VISUAL_V3.md`
- `docs\framework\logic_bundles\G3_ACTIVE_REASONING.aipl`
- `docs\framework\logic_bundles\L3_4_fierce_executor.aipl`
- `docs\framework\logic_bundles\L3_5_task_response.aipl`
- `docs\framework\logic_bundles\L4_MICRO_SPRINT_PLANNING.aipl`
- `docs\framework\logic_bundles\AI_FUNCTIONS\L3_devops_engineer.aipl`
- `steertrue\docs`

**Key Persona:** DevOps Engineer

**Checks:**
- Migration safety (additive, reversible, tested)
- Environment requirements documented
- Rollback procedure defined
- No hardcoded secrets
- Health check endpoints specified

---

## Step 3: Design Review

**Purpose:** Validate sprint against design standards and user intent.
**Anchor:** AI MUST anchor dataset to task specific related industry experts who can be referenced prior to beginning task. AI must disclose anchor points before beginning task. Anchor must have a referencable link that can be click and verified.

**Instruction Template:**
```
Review sprint X.X using the following skills and persona.
Identify any persona related finding and suggested improvement and / or fixes. Reading docs is NOT optional.
```

**Context Files:**
- `docs\architecture\BLUE_GREEN_RED_ARCHITECTURE_PRIMER_V2.md`
- `docs\framework\AIPL\AIPL_SPEC_v0.9.md`
- `docs\framework\logic_bundles\AI_FUNCTIONS\STEERTRUE_ARCHITECTURE_VISUAL_V3.md`
- `docs\framework\logic_bundles\G3_ACTIVE_REASONING.aipl`
- `docs\framework\logic_bundles\L3_4_fierce_executor.aipl`
- `docs\framework\logic_bundles\L3_5_task_response.aipl`
- `docs\framework\logic_bundles\L4_MICRO_SPRINT_PLANNING.aipl`
- `docs\framework\logic_bundles\AI_FUNCTIONS\L3_DESIGN_REVIEWER.aipl`
- `docs\framework\logic_bundles\AI_FUNCTIONS\L3_user_intent_validator.aipl`
- `steertrue\docs`

**Key Personas:** Design Reviewer + User Intent Validator

---

## Step 4: Adversarial Review

**Purpose:** Stress-test the sprint plan, find holes, challenge assumptions.
**Anchor:** AI MUST anchor dataset to task specific related industry experts who can be referenced prior to beginning task. AI must disclose anchor points before beginning task. Anchor must have a referencable link that can be click and verified.

**Instruction Template:**
```
Review sprint X.X using the following skills and persona.
Identify any persona related finding and suggested improvement and / or fixes. Ensure functional UAT at each checkpoint - behavioral verification, not just implementation verification. Tests must be cross functional with related systems being tested to ensure alignment with desired function. Reading docs is NOT optional.
```

**Context Files:**
- `docs\architecture\BLUE_GREEN_RED_ARCHITECTURE_PRIMER_V2.md`
- `docs\framework\AIPL\AIPL_SPEC_v0.9.md`
- `docs\framework\logic_bundles\AI_FUNCTIONS\STEERTRUE_ARCHITECTURE_VISUAL_V3.md`
- `docs\framework\logic_bundles\G3_ACTIVE_REASONING.aipl`
- `docs\framework\logic_bundles\L3_4_fierce_executor.aipl`
- `docs\framework\logic_bundles\L3_5_task_response.aipl`
- `docs\framework\logic_bundles\L4_MICRO_SPRINT_PLANNING.aipl`
- `docs\framework\logic_bundles\AI_FUNCTIONS\adversarial_process_auditor.md`
- `steertrue\docs`

**Key Persona:** Adversarial Process Auditor

---

## Step 5: Guardian Review

**Purpose:** Final safety and compliance check, behavioral guardrails validation.
**Anchor:** AI MUST anchor dataset to task specific related industry experts who can be referenced prior to beginning task. AI must disclose anchor points before beginning task. Anchor must have a referencable link that can be click and verified.

**Instruction Template:**
```
Review sprint X.X using the following skills and persona.
Identify any persona related finding and suggested improvement and / or fixes. Reading docs is NOT optional.
```

**Context Files:**
- `docs\architecture\BLUE_GREEN_RED_ARCHITECTURE_PRIMER_V2.md`
- `docs\framework\AIPL\AIPL_SPEC_v0.9.md`
- `docs\framework\logic_bundles\AI_FUNCTIONS\STEERTRUE_ARCHITECTURE_VISUAL_V3.md`
- `docs\framework\logic_bundles\G3_ACTIVE_REASONING.aipl`
- `docs\framework\logic_bundles\L3_4_fierce_executor.aipl`
- `docs\framework\logic_bundles\L3_5_task_response.aipl`
- `docs\framework\logic_bundles\L4_MICRO_SPRINT_PLANNING.aipl`
- `docs\framework\logic_bundles\AI_FUNCTIONS\GUARDIAN_MANUAL_TRIGGER.md`
- `steertrue\docs`

**Key Persona:** Guardian

---

## Step 6: Protocol Check

**Purpose:** Execute pre/post sprint protocol requirements for sprint X.X.

**Action:** Load and execute `.claude\protocols\SPRINT_PRE_POST_PROTOCOL.md`

---

## Core Context Files

The following files are loaded in all persona-based steps (1-5):

| File | Purpose |
|------|---------|
| `BLUE_GREEN_RED_ARCHITECTURE_PRIMER_V2.md` | Architecture foundation |
| `AIPL_SPEC_v0.9.md` | AIPL specification |
| `STEERTRUE_ARCHITECTURE_VISUAL_V3.md` | Architecture visual reference |
| `G3_ACTIVE_REASONING.aipl` | Reasoning protocol |
| `L3_4_fierce_executor.aipl` | Executor behavior contract |
| `L3_5_task_response.aipl` | Task response format |
| `L4_MICRO_SPRINT_PLANNING.aipl` | Sprint planning methodology |

---

## Summary Table

| Step | Purpose | Persona(s) | Unique Files |
|------|---------|------------|--------------|
| 1 | Create | Systems Integration Engineer | `L_3_systems_integration_engineer_role.aipl` |
| 2 | DevOps Readiness | DevOps Engineer | `L3_devops_engineer.aipl`, `INFRASTRUCTURE.md` |
| 3 | Design Review | Design Reviewer + Intent Validator | `L3_DESIGN_REVIEWER.aipl`, `L3_user_intent_validator.aipl` |
| 4 | Adversarial | Adversarial Process Auditor | `adversarial_process_auditor.md` |
| 5 | Guardian | Guardian | `GUARDIAN_MANUAL_TRIGGER.md` |
| 6 | Protocol | N/A | `SPRINT_PRE_POST_PROTOCOL.md` |

---

## Rules

1. **Sequential execution required** - Each step must complete before the next begins
2. **Findings must be addressed** - Issues identified in any step must be resolved before proceeding
3. **No skipping steps** - All 6 steps are mandatory for every sprint
4. **Microsprint process is prescriptive** - Follow the methodology exactly as defined

---

## Complete AI Role Inventory

All AI roles available in `docs\framework\logic_bundles\AI_FUNCTIONS\`:

### Sprint Validation Roles (Steps 1-5 above)

| Role | Purpose | When Used |
|------|---------|-----------|
| Systems Integration Engineer | Wiring, configuration, init sequence validation | Step 1: Sprint Creation |
| DevOps Engineer | Migration safety, environment, rollback | Step 2: DevOps Readiness |
| Design Reviewer | Design standards, lessons learned | Step 3: Design Review |
| User Intent Validator | Expectation gap detection | Step 3: Design Review |
| Adversarial Process Auditor | Stress-test, find holes | Step 4: Adversarial Review |
| Guardian | Safety and compliance check | Step 5: Guardian Review |

### Creation Roles (Pre-Sprint Artifacts)

| Role | Purpose | When Used |
|------|---------|-----------|
| Block Author | Author new L1-L8 AIPL blocks | Before sprint - when new governance block needed |
| UX Researcher | Deep user research, mental models | Before feature design - informs requirements |

### Maintenance Roles (Post-Sprint / Ongoing)

| Role | Purpose | When Used |
|------|---------|-----------|
| Compliance Analyst | Correction logic, oscillation damping | Maintenance - tune bidirectional compliance loop |
| Threshold Optimizer | Decay threshold tuning | Post-deployment - tune based on telemetry |

---

## Role Usage Map

```
                    ┌───────────────────────────────────────────────────────────────┐
                    │                      LIFECYCLE PHASES                          │
                    ├─────────────┬─────────────┬─────────────┬─────────────────────┤
                    │  RESEARCH   │   CREATE    │  VALIDATE   │      MAINTAIN       │
                    │  (Before)   │  (Before)   │  (Sprint)   │      (Ongoing)      │
                    ├─────────────┼─────────────┼─────────────┼─────────────────────┤
UX Researcher ─────►│     ●       │             │             │                     │
                    │             │             │             │                     │
Block Author ──────►│             │      ●      │             │                     │
                    │             │             │             │                     │
SIE ───────────────►│             │             │      ●      │                     │
DevOps Engineer ───►│             │             │      ●      │                     │
Design Reviewer ───►│             │             │      ●      │                     │
User Intent ───────►│             │             │      ●      │                     │
Adversarial ───────►│             │             │      ●      │                     │
Guardian ──────────►│             │             │      ●      │                     │
                    │             │             │             │                     │
Compliance Analyst ►│             │             │             │          ●          │
Threshold Optimizer►│             │             │             │          ●          │
                    └─────────────┴─────────────┴─────────────┴─────────────────────┘
```

---

## Role Integration Examples

### Example 1: New Governance Block Needed

```
1. UX Researcher → Understand user need for new behavior
2. Block Author → Create new AIPL block with decay content
3. [Sprint Process Steps 1-6] → Validate sprint that seeds block
4. Deploy to production
5. Threshold Optimizer → Tune decay thresholds based on usage
```

### Example 2: Compliance Loop Optimization

```
1. Compliance Analyst → Analyze correction patterns, design damping
2. [Sprint Process Steps 1-6] → Validate sprint implementing changes
3. Deploy to production
4. Threshold Optimizer → Monitor convergence metrics
```

### Example 3: Standard Feature Sprint

```
1. [Optional] UX Researcher → If user behavior unclear
2. [Sprint Process Steps 1-6] → Standard validation pipeline (includes DevOps readiness at Step 2)
3. Deploy to production
4. [Optional] Threshold Optimizer → If decay blocks affected
```
