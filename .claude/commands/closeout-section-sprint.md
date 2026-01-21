# Section Sprint Closeout Command

Execute section sprint closeout process for an entire sprint section (e.g., Sprint 1.5 containing micro-sprints 1.5.1-1.5.4).

## Usage

```
/closeout-section-sprint <section-id>
```

Example: `/closeout-section-sprint 1.5`

## When to Use

Use this command when:
- All micro-sprints in a section are COMPLETE
- Each micro-sprint has been closed via `/closeout-sprint`
- Ready to validate the entire section before moving to next section

## Process

Load and execute `docs/framework/logic_bundles/L4_9_section_sprint_closeout.aipl`:

### Phase 1: Micro-Sprint Verification
- Read `docs/design/mlaia-core/project/sprints/SPRINT_{{section-id}}_PLAN.md`
- Verify all micro-sprints show COMPLETE
- Collect grades from each micro-sprint closeout
- Calculate section average grade

### Phase 2: Exit Criteria Validation
- Extract exit criteria from section plan
- Verify each criterion has evidence
- All exit criteria must pass (100%)

### Phase 3: Regression Testing (MANDATORY)
- Run full test suite: `cd steertrue && python -m pytest --tb=short -q`
- Categorize results: PASSED, FAILED, ERRORS, SKIPPED
- **BLOCKING:** FAILED count must be 0
- Document expected ERRORS (e.g., DB tests without DATABASE_URL)

### Phase 4: Integration Testing
- Verify deployment is current
- Run integration tests from SPRINT_{{section-id}}_PLAN.md Human UAT section
- Verify response structure and headers
- Document curl output for each test

### Phase 5: Technical Debt Review
- Check LESSONS_LEARNED.aipl TECHNICAL_DEBT_TRACKER
- Verify all debt items have deadlines
- Document carried-forward debt

### Phase 6: Section Human UAT
- Generate `SPRINT_{{section-id}}_CLOSEOUT.md`
- Present summary to human
- **STOP** - Await human response
- Record: SECTION UAT APPROVED or REWORK: issue

### Phase 7: Documentation
- Update SPRINT_{{section-id}}_PLAN.md status to COMPLETE
- Mark all exit criteria [x]
- Update LESSONS_LEARNED.aipl with section patterns
- **Update SPRINT_HISTORY.md** (see Section Tracking below)

### Section Tracking

**On section closeout, update `docs/design/mlaia-core/project/sprints/SPRINT_HISTORY.md`:**

1. Read SPRINT_HISTORY.md
2. Add row to "Section Sprints" table:

   ```markdown
   | [section-id] | [goal] | [start-date] | [YYYY-MM-DD] | [micro-sprint-count] | [avg-grade] |
   ```

3. Calculate:
   - Start date: earliest micro-sprint start in this section
   - End date: current date
   - Micro-sprint count: number of micro-sprints in section
   - Avg grade: weighted average of micro-sprint grades

### Phase 8: Retrospective
- Summarize issues across all micro-sprints
- Verify patterns captured in LESSONS_LEARNED.aipl
- Calculate section metrics

## Output

Creates: `docs/design/mlaia-core/project/sprints/SPRINT_{{section-id}}_CLOSEOUT.md`

## Blocking Conditions

Section cannot close if:
- Any micro-sprint not COMPLETE
- Any exit criterion not met
- Regression tests have FAILED status (ERRORS may be acceptable)
- Integration tests fail on deployed endpoint
- Section Human UAT not APPROVED

## Differences from /closeout-sprint

| Aspect | /closeout-sprint (L4_8) | /closeout-section-sprint (L4_9) |
|--------|-------------------------|----------------------------------|
| Scope | Single micro-sprint | Entire section |
| Regression | Not required | MANDATORY |
| Integration | Per-feature | Full section on deployed endpoint |
| Tech Debt | May defer | Must document all |
| Grade | Individual | Weighted average |

## Example Workflow

```
# 1. Close each micro-sprint first
/closeout-sprint 1.5.1
/closeout-sprint 1.5.2
/closeout-sprint 1.5.3
/closeout-sprint 1.5.4

# 2. Close entire section
/closeout-section-sprint 1.5

# 3. Ready for next section
# Can now start Sprint 1.6
```
