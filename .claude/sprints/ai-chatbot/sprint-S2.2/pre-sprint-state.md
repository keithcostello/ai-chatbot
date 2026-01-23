# Pre-Sprint Validation State: S2.2

| Step | Name | Status | Findings | Fixed |
|------|------|--------|----------|-------|
| 1 | Sprint Creation | APPROVED | 12 | 12 |
| 1.25 | Feature Expectations Research | COMPLETE | 21 gaps | 10 stories |
| 1.5 | User Story Review | VALIDATED | 26 stories | 0 |
| 2 | DevOps Readiness | APPROVED | 8 | 8 |
| 3 | Design Review | APPROVED | 11 | 11 |
| 4 | Adversarial Review | APPROVED | 14 | 14 |
| 5 | Guardian Review | PASS | 5 | 0 |
| 6 | Protocol Check | PASS | 0 | 0 |

Current Step: COMPLETE - All steps APPROVED
Last Updated: 2026-01-22

**NOTE:** Process updated - Step 1.25 now runs BEFORE Step 1.5 so user stories include researched features.

## Step 1.5 Decisions (User Story Review)

**Stories Validated:** 26 total
- Must Have: 8 (C5-C9, UX-1, UX-3, ERR-1)
- Should Have: 11 (UX-2,4-8, ERR-2,4, R-1,4,8)
- Could Have: 7 (R-2,3,5,6,7, ERR-3,5)

**Technical Decisions Confirmed:**
| # | Decision | Value |
|---|----------|-------|
| 1 | Pagination | 50 messages |
| 2 | Sort order | updated_at desc |
| 3 | Timestamp format | Relative with hover |
| 4 | Delete behavior | Soft delete |
| 5 | Regenerate | Replace original |
| 6 | Stop generation | Preserve partial |

## Architecture Decision (RESOLVED)

**Decision:** Option 1 - Phased approach with Python microservice

| Phase | Description |
|-------|-------------|
| Skeleton (Phase 2) | Anthropic SDK directly in Next.js API route |
| Governance (Phase 3A) | Add SteerTrue /api/v1/analyze integration |
| Flesh (Phase 3B) | Python FastAPI microservice with Pydantic AI |

**Rationale:** Walking skeleton methodology - prove end-to-end first, add complexity as flesh.

**Fallback:** If Python integration fails, skeleton remains functional.

---

## Step 1.5 Decisions (User Story Review)

| # | Question | Decision |
|---|----------|----------|
| Q1 | Ownership | Own only. Design for future shared/team |
| Q2 | Auto-Title | Basic auto-title + rename capability |
| Q3 | Pagination | 15 messages per page |
| Q4 | Sort Order | Default: updated_at. User can toggle asc/desc. Also allow created_at with asc/desc |
| Q5 | Walking Skeleton | MANDATORY |
| Q6 | Chat Container | `steertrue-chat-dev-sandbox.up.railway.app` |
| Q7 | Error Handling | Fully baked - no fallbacks |

---

## Step 1.75 Decisions (Feature Expectations Research)

**14 gaps identified, 9 added to S2.2 scope:**

### Added to S2.2 (9 features):
1. Typing/loading indicator during AI response
2. Timestamps on messages
3. Copy message button
4. Retry failed message button
5. User-friendly error display
6. Enter to send / Shift+Enter newline
7. Edit user message
8. Delete message
9. Regenerate AI response

### Deferred to S2.5 with documentation (5 accessibility items):
1. Keyboard navigation (WCAG 2.1.1 Level A)
2. Screen reader / ARIA (WCAG 4.1.2 Level A)
3. Focus indicators (WCAG 2.4.7 Level AA)
4. Color contrast 4.5:1 (WCAG 1.4.3 Level AA)
5. Touch targets 24x24px (WCAG 2.5.8 Level AA)

---

## Summary of Remaining Findings (for awareness)

1. No health check endpoint for ai-chatbot service
2. Streaming verification requires video/GIF evidence
3. Two chat endpoints (/api/chat vs /api/copilot) - clarify usage
4. Authorization check for conversation access needed
