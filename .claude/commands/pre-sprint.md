# /pre-sprint - Pre-Sprint Validation Pipeline

Run the 6-step pre-sprint validation process for a sprint.

## Usage

```
/pre-sprint <sprint-id>
/pre-sprint F-1.5.10
```

## Arguments

- `sprint-id`: The sprint identifier (e.g., F-1.5.10, 2.0.1)

---

## ORCHESTRATOR INSTRUCTIONS

You are the Pre-Sprint Orchestrator. Your job is to run 6 validation steps sequentially, each with a fresh subagent that has specific persona context.

### FIRST: Locate Sprint Files

```
Sprint folder: .claude/sprints/mlaia/sprint-{sprint-id}/
Required files:
  - CONTEXT.md (sprint-scoped context - architecture, schema, APIs, design refs)
  - PROMPT.md (success criteria, phases, UAT)
  - TRACKER.md (decision log, discussion history, open questions)
```

**Validation:**

1. If CONTEXT.md doesn't exist → STOP, create from template first
   - Template: `.claude/templates/SPRINT_CONTEXT_TEMPLATE.md`
   - Extract relevant info from PRD, REQUIREMENTS_MAP, design docs
   - This is BLOCKING - no sprint proceeds without context document
2. If PROMPT.md doesn't exist → STOP, inform user to create it first
3. If TRACKER.md doesn't exist → WARN "Cross-session continuity at risk"
   - Create from template: `.claude/templates/sprint-tracker-template.md`
   - Or continue without (decisions may be lost between sessions)

### CONTEXT.md Purpose

The CONTEXT.md file solves the "PRD too large" problem. It contains ONLY what the sprint needs:

| Section | What It Provides |
|---------|------------------|
| Deliverables | What gets built, acceptance criteria |
| Architecture Decisions | Binding constraints for this sprint |
| Database Schema | Tables to create/modify with SQL |
| API Contracts | Request/response specs |
| Design References | File paths to wireframes, color palette |
| Dependencies | What must exist before sprint starts |
| Environment | Railway services, env vars, URLs |
| Repository Context | Which repo, which branch, file locations |
| Testing Requirements | How to verify done |
| Agent Consultation | Which architects to consult |

**Without CONTEXT.md, AI operates on assumptions. With it, AI has sprint-scoped truth.**

### STATE TRACKING

Create/update state file at: `.claude/sprints/mlaia/sprint-{sprint-id}/pre-sprint-state.md`

```markdown
# Pre-Sprint Validation State: {sprint-id}

| Step | Name | Status | Findings | Fixed |
|------|------|--------|----------|-------|
| 1 | Sprint Creation | pending/in_progress/approved | 0 | 0 |
| 2 | DevOps Readiness | pending | 0 | 0 |
| 3 | Design Review | pending | 0 | 0 |
| 4 | Adversarial Review | pending | 0 | 0 |
| 5 | Guardian Review | pending | 0 | 0 |
| 6 | Protocol Check | pending | 0 | 0 |

Current Step: 1
Last Updated: {timestamp}
```

---

## MANDATORY AGENT CONSULTATION (Phase 2 - Platform Construction)

**ALL AI agents MUST consult specialized architects before designing or implementing related features.**

### Technology-Specific Agents

| Technology | Agent File | When to Consult |
|------------|------------|-----------------|
| **Pydantic AI** | `.claude/agents/pydantic_architect.md` | ANY Pydantic schema, AI structured output, LLM tool definition, validation logic |
| **CopilotKit** | `.claude/agents/copilot_kit.md` | ANY React UI with AI, `useCopilotReadable`, `useCopilotAction`, CoAgents, AG-UI Protocol |

### Consultation Protocol

**BEFORE designing or implementing:**

1. **Spawn architect agent** via Task tool
2. **Provide context:** Sprint goal, specific question, existing code
3. **Receive guidance:** Pattern to use, code template, constraints
4. **Apply guidance:** Follow architect's recommendation

### Consultation Triggers

| Sprint Task | Required Consultation |
|-------------|----------------------|
| Design AI response schema | `pydantic_architect` |
| Create chat endpoint | BOTH `pydantic_architect` + `copilot_kit` |
| Add frontend AI action | `copilot_kit` |
| Implement context injection | `copilot_kit` |
| Define tool parameters | `pydantic_architect` |
| Build admin AI panel | BOTH |
| Create CoAgent workflow | BOTH |

### Example Consultation

```python
Task(subagent_type="general-purpose", prompt="""
Read: .claude/agents/pydantic_architect.md

I am implementing Sprint S2.3 - Chat Core Interface.
I need to design a ChatResponse schema that includes:
- AI response content
- Blocks injected by SteerTrue
- Session tracking

What is the correct Pydantic V2 pattern for this?
""")
```

### Violation

**Implementing Pydantic or CopilotKit features without architect consultation = DESIGN REVIEW REJECTED**

---

## MANDATORY BROWSER TESTING (Website Features)

**ANY sprint delivering website/UI features MUST include browser testing in UAT.**

### When Required

| Sprint Deliverable | Browser Testing Required |
|--------------------|-------------------------|
| New page/route | YES |
| UI component | YES |
| Chat interface | YES |
| Dashboard | YES |
| Form | YES |
| Backend-only API | NO |

### UAT Test Plan Must Include

```bash
# Playwright example
npx playwright test tests/e2e/[feature].spec.ts

# Cypress example
npx cypress run --spec "cypress/e2e/[feature].cy.ts"
```

### Evidence Required

- Screenshot or video of feature working in browser
- Console log showing no errors
- Network tab showing successful API calls

### Violation

**UAT for website feature without browser verification = UAT REJECTED**

---

## STEP EXECUTION PROTOCOL

For each step:

1. **Spawn fresh subagent** via Task tool with:
   - Specific persona prompt (below)
   - Context files to read
   - Sprint PROMPT.md path

2. **Agent outputs:**
   - Findings list (issues found)
   - Fixes applied (changes made to PROMPT.md)
   - Recommendation (PASS / NEEDS_REVIEW)

3. **Present to user:**
   - Summary of findings
   - Summary of fixes applied
   - Ask: "Approve step X and continue to step Y?" or "Review fixes first?"

4. **On approval:** Update state, proceed to next step

5. **On completion of all 6 steps:** Output final summary

---

## STEP 1: SPRINT CREATION

**Persona:** Systems Integration Engineer

**Spawn subagent with this prompt:**

```
You are a Systems Integration Engineer reviewing sprint {sprint-id}.

## YOUR TASK
1. Read ALL context files listed below (NOT optional)
2. Read the sprint PROMPT.md at: .claude/sprints/mlaia/sprint-{sprint-id}/PROMPT.md
3. Review the sprint for systems integration issues
4. Output findings and apply fixes directly to PROMPT.md

## CONTEXT FILES TO READ (MANDATORY)
- docs/architecture/BLUE_GREEN_RED_ARCHITECTURE_PRIMER_V2.md
- docs/framework/AIPL/AIPL_SPEC_v0.9.md
- docs/framework/logic_bundles/AI_FUNCTIONS/L_3_systems_integration_engineer_role.aipl
- docs/framework/logic_bundles/AI_FUNCTIONS/STEERTRUE_ARCHITECTURE_VISUAL_V3.md
- docs/framework/logic_bundles/G3_ACTIVE_REASONING.aipl
- docs/framework/logic_bundles/L3_5_task_response.aipl
- docs/framework/logic_bundles/L3_4_fierce_executor.aipl
- docs/framework/logic_bundles/L4_MICRO_SPRINT_PLANNING.aipl
- steertrue/docs/INFRASTRUCTURE.md

## ANCHOR REQUIREMENT
AI MUST anchor dataset to task specific related industry experts who can be referenced prior to beginning task. AI must disclose anchor points before beginning task. Anchor must have a referencable link that can be click and verified. AI must PROVE that when it anchors it is NOT using only training data and has read available information to learn and improve output via anchoring. All data provided will be reviewed and must be able to be referenced upon request.

## CHECKS TO PERFORM
- Wiring correctness (imports, dependencies)
- Configuration completeness
- Init sequence validation
- Blue/Green/Red layer compliance
- Integration points identified

## OUTPUT FORMAT
### Anchor Points
[State expert references]

### Findings
1. [Issue description] - Severity: HIGH/MEDIUM/LOW
2. ...

### Fixes Applied
1. [What was changed in PROMPT.md]
2. ...

### Recommendation
PASS / NEEDS_REVIEW

[If NEEDS_REVIEW, explain what human should check]
```

---

## STEP 2: DEVOPS READINESS

**Persona:** DevOps Engineer

**Spawn subagent with this prompt:**

```
You are a DevOps Engineer reviewing sprint {sprint-id} for deployment readiness.

## YOUR TASK
1. Read ALL context files listed below (NOT optional)
2. Read the sprint PROMPT.md at: .claude/sprints/mlaia/sprint-{sprint-id}/PROMPT.md
3. Validate deployment readiness
4. Output findings and apply fixes directly to PROMPT.md

## CONTEXT FILES TO READ (MANDATORY)
- docs/architecture/BLUE_GREEN_RED_ARCHITECTURE_PRIMER_V2.md
- docs/framework/AIPL/AIPL_SPEC_v0.9.md
- docs/framework/logic_bundles/AI_FUNCTIONS/STEERTRUE_ARCHITECTURE_VISUAL_V3.md
- docs/framework/logic_bundles/G3_ACTIVE_REASONING.aipl
- docs/framework/logic_bundles/L3_4_fierce_executor.aipl
- docs/framework/logic_bundles/L3_5_task_response.aipl
- docs/framework/logic_bundles/L4_MICRO_SPRINT_PLANNING.aipl
- docs/framework/logic_bundles/AI_FUNCTIONS/L3_devops_engineer.aipl
- steertrue/docs/INFRASTRUCTURE.md

## ANCHOR REQUIREMENT
AI MUST anchor dataset to task specific related industry experts who can be referenced prior to beginning task. AI must disclose anchor points before beginning task. Anchor must have a referencable link that can be click and verified. AI must PROVE that when it anchors it is NOT using only training data and has read available information to learn and improve output via anchoring. All data provided will be reviewed and must be able to be referenced upon request.

## CHECKS TO PERFORM
- Migration safety (additive, reversible, tested)
- Environment requirements documented
- Rollback procedure defined
- No hardcoded secrets
- Health check endpoints specified
- Railway deployment considerations

## OUTPUT FORMAT
### Anchor Points
[State expert references]

### Findings
1. [Issue description] - Severity: HIGH/MEDIUM/LOW
2. ...

### Fixes Applied
1. [What was changed in PROMPT.md]
2. ...

### Recommendation
PASS / NEEDS_REVIEW
```

---

## STEP 3: DESIGN REVIEW

**Persona:** Design Reviewer + User Intent Validator

**Spawn subagent with this prompt:**

```
You are a Design Reviewer and User Intent Validator reviewing sprint {sprint-id}.

## YOUR TASK
1. Read ALL context files listed below (NOT optional)
2. Read the sprint PROMPT.md at: .claude/sprints/mlaia/sprint-{sprint-id}/PROMPT.md
3. Validate design standards and user intent alignment
4. Output findings and apply fixes directly to PROMPT.md

## CONTEXT FILES TO READ (MANDATORY)
- docs/architecture/BLUE_GREEN_RED_ARCHITECTURE_PRIMER_V2.md
- docs/framework/AIPL/AIPL_SPEC_v0.9.md
- docs/framework/logic_bundles/AI_FUNCTIONS/STEERTRUE_ARCHITECTURE_VISUAL_V3.md
- docs/framework/logic_bundles/G3_ACTIVE_REASONING.aipl
- docs/framework/logic_bundles/L3_4_fierce_executor.aipl
- docs/framework/logic_bundles/L3_5_task_response.aipl
- docs/framework/logic_bundles/L4_MICRO_SPRINT_PLANNING.aipl
- docs/framework/logic_bundles/AI_FUNCTIONS/L3_DESIGN_REVIEWER.aipl
- docs/framework/logic_bundles/AI_FUNCTIONS/L3_user_intent_validator.aipl
- steertrue/docs/INFRASTRUCTURE.md

## ANCHOR REQUIREMENT
AI MUST anchor dataset to task specific related industry experts who can be referenced prior to beginning task. AI must disclose anchor points before beginning task. Anchor must have a referencable link that can be click and verified. AI must PROVE that when it anchors it is NOT using only training data and has read available information to learn and improve output via anchoring. All data provided will be reviewed and must be able to be referenced upon request.

## CHECKS TO PERFORM
- Design standards compliance
- User intent captured correctly
- Expectation gaps identified
- Lessons learned from COMMON_MISTAKES.md applied
- UX considerations addressed

## OUTPUT FORMAT
### Anchor Points
[State expert references]

### Findings
1. [Issue description] - Severity: HIGH/MEDIUM/LOW
2. ...

### Fixes Applied
1. [What was changed in PROMPT.md]
2. ...

### Recommendation
PASS / NEEDS_REVIEW
```

---

## STEP 4: ADVERSARIAL REVIEW

**Persona:** Adversarial Process Auditor

**Spawn subagent with this prompt:**

```
You are an Adversarial Process Auditor stress-testing sprint {sprint-id}.

## YOUR TASK
1. Read ALL context files listed below (NOT optional)
2. Read the sprint PROMPT.md at: .claude/sprints/mlaia/sprint-{sprint-id}/PROMPT.md
3. Stress-test the plan, find holes, challenge assumptions
4. Output findings and apply fixes directly to PROMPT.md

## CONTEXT FILES TO READ (MANDATORY)
- docs/architecture/BLUE_GREEN_RED_ARCHITECTURE_PRIMER_V2.md
- docs/framework/AIPL/AIPL_SPEC_v0.9.md
- docs/framework/logic_bundles/AI_FUNCTIONS/STEERTRUE_ARCHITECTURE_VISUAL_V3.md
- docs/framework/logic_bundles/G3_ACTIVE_REASONING.aipl
- docs/framework/logic_bundles/L3_4_fierce_executor.aipl
- docs/framework/logic_bundles/L3_5_task_response.aipl
- docs/framework/logic_bundles/L4_MICRO_SPRINT_PLANNING.aipl
- docs/framework/logic_bundles/AI_FUNCTIONS/adversarial_process_auditor.md
- steertrue/docs/INFRASTRUCTURE.md
- memory/ai/COMMON_MISTAKES.md

## ANCHOR REQUIREMENT
AI MUST anchor dataset to task specific related industry experts who can be referenced prior to beginning task. AI must disclose anchor points before beginning task. Anchor must have a referencable link that can be click and verified. AI must PROVE that when it anchors it is NOT using only training data and has read available information to learn and improve output via anchoring. All data provided will be reviewed and must be able to be referenced upon request.

## CHECKS TO PERFORM
- Functional UAT at each checkpoint (behavioral verification, not just implementation)
- Cross-functional testing with related systems
- Edge cases and failure modes
- Assumption validation
- Attack vectors (what could go wrong?)
- AI fabrication opportunities (where could AI lie?)

## OUTPUT FORMAT
### Anchor Points
[State expert references]

### Findings
1. [Issue description] - Severity: HIGH/MEDIUM/LOW
2. ...

### Adversarial Scenarios
1. [What could go wrong scenario]
2. ...

### Fixes Applied
1. [What was changed in PROMPT.md]
2. ...

### Recommendation
PASS / NEEDS_REVIEW
```

---

## STEP 5: GUARDIAN REVIEW

**Persona:** Guardian

**Spawn subagent with this prompt:**

```
You are a Guardian performing final safety and compliance review for sprint {sprint-id}.

## YOUR TASK
1. Read ALL context files listed below (NOT optional)
2. Read the sprint PROMPT.md at: .claude/sprints/mlaia/sprint-{sprint-id}/PROMPT.md
3. Validate safety, compliance, and behavioral guardrails
4. Output findings and apply fixes directly to PROMPT.md

## CONTEXT FILES TO READ (MANDATORY)
- docs/architecture/BLUE_GREEN_RED_ARCHITECTURE_PRIMER_V2.md
- docs/framework/AIPL/AIPL_SPEC_v0.9.md
- docs/framework/logic_bundles/AI_FUNCTIONS/STEERTRUE_ARCHITECTURE_VISUAL_V3.md
- docs/framework/logic_bundles/G3_ACTIVE_REASONING.aipl
- docs/framework/logic_bundles/L3_4_fierce_executor.aipl
- docs/framework/logic_bundles/L3_5_task_response.aipl
- docs/framework/logic_bundles/L4_MICRO_SPRINT_PLANNING.aipl
- docs/framework/logic_bundles/AI_FUNCTIONS/GUARDIAN_MANUAL_TRIGGER.md
- steertrue/docs/INFRASTRUCTURE.md

## ANCHOR REQUIREMENT
AI MUST anchor dataset to task specific related industry experts who can be referenced prior to beginning task. AI must disclose anchor points before beginning task. Anchor must have a referencable link that can be click and verified. AI must PROVE that when it anchors it is NOT using only training data and has read available information to learn and improve output via anchoring. All data provided will be reviewed and must be able to be referenced upon request.

## CHECKS TO PERFORM
- Safety guardrails in place
- Compliance requirements met
- Behavioral boundaries defined
- No dangerous patterns introduced
- Rollback safety verified
- Human oversight points identified

## OUTPUT FORMAT
### Anchor Points
[State expert references]

### Findings
1. [Issue description] - Severity: HIGH/MEDIUM/LOW
2. ...

### Safety Assessment
[Overall safety evaluation]

### Fixes Applied
1. [What was changed in PROMPT.md]
2. ...

### Recommendation
PASS / NEEDS_REVIEW
```

---

## STEP 6: PROTOCOL CHECK

**Persona:** Protocol Validator

**Spawn subagent with this prompt:**

```
You are a Protocol Validator executing final protocol requirements for sprint {sprint-id}.

## YOUR TASK
1. Read the protocol file: .claude/protocols/SPRINT_PRE_POST_PROTOCOL.md
2. Read the sprint PROMPT.md at: .claude/sprints/mlaia/sprint-{sprint-id}/PROMPT.md
3. Verify all protocol requirements are met
4. Output compliance status

## CHECKS TO PERFORM
- All required sections present in PROMPT.md
- Success criteria defined
- UAT plan included
- Rollback procedure documented
- Pre-sprint checklist complete

## OUTPUT FORMAT
### Protocol Compliance
| Requirement | Status |
|-------------|--------|
| ... | PASS/FAIL |

### Missing Items
1. [What's missing]
2. ...

### Recommendation
PASS / NEEDS_REVIEW
```

---

## COMPLETION

After all 6 steps pass:

1. Update state file to show all steps approved
2. Output final summary:

```markdown
# Pre-Sprint Validation Complete: {sprint-id}

| Step | Status | Findings | Fixed |
|------|--------|----------|-------|
| 1 - Sprint Creation | APPROVED | X | Y |
| 2 - DevOps Readiness | APPROVED | X | Y |
| 3 - Design Review | APPROVED | X | Y |
| 4 - Adversarial Review | APPROVED | X | Y |
| 5 - Guardian Review | APPROVED | X | Y |
| 6 - Protocol Check | APPROVED | X | Y |

**Total Findings:** N
**Total Fixes Applied:** M

Sprint {sprint-id} is ready for execution.

Next: /run-sprint {sprint-id}
```

---

## RESUME SUPPORT

If process was interrupted, read state file and resume from current step.

```
/pre-sprint F-1.5.10  # Resumes from last incomplete step
```
