# Sprint S2.2 Human UAT Tests

**Deployment URL:** https://steertrue-chat-dev-sandbox.up.railway.app
**Test Tool:** agent-browser (mandatory)
**Branch:** dev-sprint-S2.2

---

## Pre-requisites

1. agent-browser installed: `npm install -g agent-browser && agent-browser install`
2. Test user account exists (from S2.1)
3. Deployment is live and healthy

---

## Test Cases

### UAT-1: Login and Access Chat Page

**Steps:**
1. `agent-browser open https://steertrue-chat-dev-sandbox.up.railway.app/login`
2. `agent-browser snapshot --interactive` (get element refs)
3. Fill email field with test user email
4. Fill password field with test user password
5. Click login button
6. Verify redirect to dashboard or chat page
7. `agent-browser screenshot evidence/uat-1-login-success.png`

**Pass Criteria:**
- Login form loads
- After login, user is redirected (not stuck on login)
- Session cookie is set

---

### UAT-2: Navigate to Chat and See Empty State

**Steps:**
1. After login, navigate to `/chat`
2. `agent-browser open https://steertrue-chat-dev-sandbox.up.railway.app/chat`
3. `agent-browser snapshot --interactive`
4. `agent-browser screenshot evidence/uat-2-chat-page.png`

**Pass Criteria:**
- Chat page loads without errors
- Sidebar visible (forest green background #2d4a3e)
- Chat area visible (cream background #f8f4ed)
- Message input box visible

---

### UAT-3: Send Message and Receive AI Response

**Steps:**
1. On chat page, find message input field
2. `agent-browser fill @[input-ref] "Hello, what is SteerTrue?"`
3. `agent-browser click @[send-button-ref]`
4. Wait for response to stream in (5-10 seconds)
5. `agent-browser screenshot evidence/uat-3-chat-response.png`

**Pass Criteria:**
- User message appears in chat
- AI response streams in (not instant, shows streaming behavior)
- Response contains meaningful content (not error message)

---

### UAT-4: Conversation Persistence After Refresh

**Steps:**
1. After UAT-3, note the conversation content
2. `agent-browser url` (save current URL)
3. Refresh the page: `agent-browser open [same-url]`
4. `agent-browser snapshot --interactive`
5. `agent-browser screenshot evidence/uat-4-persistence.png`

**Pass Criteria:**
- After refresh, previous messages still visible
- User message and AI response both persist
- No "starting fresh" - conversation maintained

---

### UAT-5: Create New Conversation

**Steps:**
1. On chat page, find "New Chat" button in sidebar
2. `agent-browser click @[new-chat-ref]`
3. Verify chat area clears
4. `agent-browser screenshot evidence/uat-5-new-conversation.png`

**Pass Criteria:**
- Clicking "New Chat" creates fresh conversation
- Chat area is empty (no previous messages)
- Old conversation visible in sidebar list

---

### UAT-6: Conversation List Shows Previous Conversations

**Steps:**
1. After UAT-5, sidebar should show at least 2 conversations
2. `agent-browser snapshot --interactive`
3. `agent-browser screenshot evidence/uat-6-conversation-list.png`

**Pass Criteria:**
- Multiple conversations visible in sidebar
- Each shows title and/or timestamp
- User can see conversation history

---

### UAT-7: Switch Between Conversations

**Steps:**
1. Click on previous conversation in sidebar
2. Verify messages from that conversation load
3. `agent-browser screenshot evidence/uat-7-switch-conversation.png`

**Pass Criteria:**
- Clicking conversation loads its messages
- Different conversations have different content
- Switch is seamless (no full page reload)

---

### UAT-8: Unauthenticated Access Blocked

**Steps:**
1. Open new incognito/fresh browser
2. `agent-browser open https://steertrue-chat-dev-sandbox.up.railway.app/chat`
3. `agent-browser screenshot evidence/uat-8-auth-required.png`

**Pass Criteria:**
- Unauthenticated user cannot access /chat
- Redirected to login page
- No chat content exposed

---

### UAT-9: API Returns 401 Without Auth

**Steps (CLI verification):**
```bash
curl -s https://steertrue-chat-dev-sandbox.up.railway.app/api/conversations
```

**Pass Criteria:**
- Response is 401 Unauthorized
- Error message: "Not authenticated"
- No data leaked

---

### UAT-10: Design Colors Match Spec

**Steps:**
1. On chat page after login
2. Inspect sidebar background color
3. Inspect chat area background color
4. `agent-browser screenshot evidence/uat-10-design.png`

**Pass Criteria:**
- Sidebar: forest green (#2d4a3e)
- Chat area: cream (#f8f4ed)
- User messages: turtle green accent (#5d8a6b)
- Visual matches CONTEXT.md Section 7

---

## Evidence Requirements

All screenshots saved to `.claude/sprints/ai-chatbot/sprint-S2.2/evidence/`

| Test | Screenshot |
|------|------------|
| UAT-1 | uat-1-login-success.png |
| UAT-2 | uat-2-chat-page.png |
| UAT-3 | uat-3-chat-response.png |
| UAT-4 | uat-4-persistence.png |
| UAT-5 | uat-5-new-conversation.png |
| UAT-6 | uat-6-conversation-list.png |
| UAT-7 | uat-7-switch-conversation.png |
| UAT-8 | uat-8-auth-required.png |
| UAT-10 | uat-10-design.png |

---

## Human Verification Checklist

After agent-browser execution, human must verify:

- [ ] UAT-1: Can I log in?
- [ ] UAT-2: Does the chat page load?
- [ ] UAT-3: Does AI respond to my message?
- [ ] UAT-4: Do messages persist after refresh?
- [ ] UAT-5: Can I start a new conversation?
- [ ] UAT-6: Are previous conversations listed?
- [ ] UAT-7: Can I switch between conversations?
- [ ] UAT-8: Is the chat page protected?
- [ ] UAT-9: Does API require auth?
- [ ] UAT-10: Do colors match design?

---

**NOTE:** These tests are designed to be human-verifiable. Agent-browser provides automation, but human must confirm visual results and real functionality.
