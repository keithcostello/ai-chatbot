# BUG-014: Messages Not Auto-Loading After Refresh

**Reported:** 2026-01-23
**Sprint:** S2.2
**Phase:** 5
**Severity:** HIGH
**Status:** FIXED (commit 5d5371a)

---

## Summary

Message persistence to database works correctly. However, after page refresh, messages are NOT automatically visible. User must click on conversation in sidebar to load messages.

**Exit Criteria Violation:** PROMPT.md Phase 5 states:
> Exit Criteria: Refresh page, same messages visible

Current behavior: Refresh page → empty chat state → must click conversation → messages load

---

## Evidence

### agent-browser UAT results:

1. Sent message "UAT Test: Message persistence check"
2. AI responded with SteerTrue governance header
3. Refreshed page
4. **FAIL:** Empty chat state shown with "Click New Chat to start a conversation"
5. Clicked conversation in sidebar → Messages loaded successfully

### Screenshots

- `evidence/uat-phase5-message-sent.png` - Message sent, AI responded
- `evidence/uat-phase5-after-refresh.png` - After refresh + click: 11 conversations, messages loaded

---

## Root Cause Hypothesis

Chat page does not auto-select the most recent conversation on load. The `currentConversationId` state starts as null, so no messages are loaded.

---

## Required Fix

Two options:

### Option A: Auto-select most recent conversation (RECOMMENDED)
```typescript
// In chat page useEffect
useEffect(() => {
  if (conversations.length > 0 && !currentConversationId) {
    // Auto-select most recent conversation
    setCurrentConversationId(conversations[0].id);
  }
}, [conversations, currentConversationId]);
```

### Option B: URL-based conversation routing
Use URL params: `/chat?conversation=uuid` to track current conversation.
On refresh, URL preserves conversation ID.

---

## Verification

After fix:
1. Open /chat
2. Send message
3. **Refresh page (no manual clicks)**
4. Messages MUST be visible immediately

---

## Mandatory Review

Per user instructions:
> "all bugs related to copilot are required to be reviewed with copilot_kit.md"

DEV MUST check copilot_kit.md for:
- How CopilotKit handles conversation state
- Whether there's built-in conversation persistence
- Proper way to restore conversation state on mount

---

**Filed by:** Orchestrator
**Assigned to:** DEV
**Review Required:** copilot_kit.md
