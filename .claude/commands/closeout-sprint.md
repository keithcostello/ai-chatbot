# Sprint Closeout Command

Execute sprint closeout process for the specified sprint.

## Usage

```
/closeout-sprint <sprint-id>
```

Example: `/closeout-sprint 1.3`

## Process

Load and execute `docs/framework/logic_bundles/L4_8_sprint_closeout.aipl`:

1. **Phase 1: Micro-Sprint Verification**
   - Read `docs/design/mlaia-core/project/sprints/SPRINT_{{sprint-id}}_PLAN.md`
   - Verify all micro-sprints show COMPLETE
   - Verify each micro-sprint has Human UAT APPROVED

2. **Phase 2: Success Criteria Validation**
   - Extract success criteria from sprint plan
   - Verify evidence for each criterion
   - Calculate pass rate (must be >= 85%)

3. **Phase 3: Integration Testing**
   - Run integration tests if available
   - Verify no regressions
   - Test API endpoints

4. **Phase 4: Feature Test Documentation**
   - Create `FEATURE_TEST.md` in sprint folder
   - Explain feature in plain language (what it does, why)
   - Step-by-step demo using existing blocks
   - Include undo instructions to revert test changes
   - **BLOCKING:** FEATURE_TEST.md must exist before merge gate

5. **Phase 5: Sprint Human UAT**
   - Generate `SPRINT_{{sprint-id}}_CLOSEOUT.md`
   - Present to human for validation
   - **STOP** - Await human response

6. **Phase 6: Documentation & Cleanup**
   - **Capture token usage** (if telemetry enabled, see below)
   - Update sprint plan status to COMPLETE
   - Update WAITING_ON.md
   - **Update SPRINT_HISTORY.md** (see Sprint Tracking below)
   - **Update PRODUCT_STATUS.md** (for rapid prototyping, see below)
   - **Update TECH_DEBT.md** (log any shortcuts taken, see below)
   - Merge branch (if approved)

## Token Usage Tracking

**Status:** No built-in CLI command for token counts. `/cost` only shows billing source.

**If OpenTelemetry enabled:**

```bash
# Before starting sprint session
export CLAUDE_CODE_ENABLE_TELEMETRY=1
export OTEL_METRICS_EXPORTER=console
```

Then `claude_code.token.usage` metrics will log to terminal.

**If telemetry not enabled:** Document "N/A" for tokens/cost fields.

**Future:** Track this as a feature request or find verified method.

## Sprint Tracking

**On sprint closeout, update `docs/design/mlaia-core/project/sprints/SPRINT_HISTORY.md`:**

1. Read SPRINT_HISTORY.md
2. Find sprint in "Active Sprints" table
3. Remove from "Active Sprints"
4. Add to "Completed Sprints" with:
   - Start time (from Active Sprints or state.md)
   - End time: current timestamp (YYYY-MM-DD HH:MM)
   - Duration: calculated from start/end
   - Grade: from closeout
   - **Tokens: from /cost output**
   - **Cost: from /cost output (USD)**

**If sprint not in Active Sprints:** Add directly to Completed Sprints with best-effort timestamps.

## Output

Creates: `docs/design/mlaia-core/project/sprints/SPRINT_{{sprint-id}}_CLOSEOUT.md`

## Product Status Update (Rapid Prototyping)

**During Phase 6, update `docs/design/mlaia-core/project/PRODUCT_STATUS.md`:**

1. Read PRODUCT_STATUS.md
2. Update "Feature Completion Status" table:
   - Mark completed feature as ✅ Complete (100%)
   - Update in-progress features with new %
3. Update "Test Coverage Tracking":
   - Add row with this sprint's coverage delta
   - Update "Current Total" coverage %
4. Update "Technical Debt Ledger" summary (link to TECH_DEBT.md)
5. Update "Sprint History" table with this sprint
6. Update "MVP Criteria Status" checkboxes if applicable
7. Update "Overall Product Health" metrics
8. Update "Next Actions" section

**Why:** PRODUCT_STATUS.md provides product-level view across all sprints for MVP gate decision.

## Technical Debt Update (Rapid Prototyping)

**During Phase 6, update `docs/design/mlaia-core/project/TECH_DEBT.md`:**

1. Read TECH_DEBT.md
2. DEV identifies any shortcuts taken during sprint:
   - Used in-memory cache instead of Redis?
   - Skipped pagination for simplicity?
   - Manual deploy instead of auto-deploy?
   - Basic auth instead of JWT?
3. For each shortcut, add entry using template in TECH_DEBT.md
4. PM assigns impact level (High/Medium/Low) and payback sprint
5. Update "Active Technical Debt" table
6. Update "Debt Metrics" section
7. Check "Debt Accumulation Limits" - if thresholds exceeded, flag for immediate payback

**Why:** Rapid prototyping requires speed tradeoffs. Logging debt prevents accumulation and ensures payback plan exists.

## Blocking Conditions

Sprint cannot close if:
- Any micro-sprint not COMPLETE
- Any micro-sprint missing Human UAT
- Success criteria < 85% pass rate
- Integration tests failing
- FEATURE_TEST.md not created
- Sprint Human UAT not APPROVED
