# Feature Test: chat-panel-1.0.1

## Feature Summary
Interactive editing capability for block settings panel with resizable right panel.

## Test Environment
- **URL:** https://steertrue-chat-dev-sandbox.up.railway.app
- **Branch:** chat-panel-1.0.1
- **Commit:** f76c217

## Test Procedure

### 1. Resizable Panel
```
1. Open the chat page
2. Locate the drag handle between main content and right panel
3. Drag left → Panel shrinks (stops at ~280px)
4. Drag right → Panel grows (stops at ~480px)
5. Click collapse toggle (›) → Panel collapses
6. Click expand toggle (‹) → Panel expands
7. Refresh page → Width persists
```

### 2. Edit Identity Fields
```
1. Click in Role field → Type to edit
2. Click in Scope field → Type to edit
3. Click "Add" under Is section → Add new trait
4. Click X on any Is trait → Remove trait
5. Repeat for Is Not section
```

### 3. Edit Constraints
```
1. Click "Add" under Must section → Add constraint
2. Click X on any Must item → Remove constraint
3. Repeat for Prohibited section
```

### 4. Save Flow
```
1. Edit any field → "Unsaved changes" indicator appears
2. Click Save → Toast: "Settings saved"
3. Refresh page → Edited values persist
4. Check DevTools > Application > localStorage > block-settings
   → Should show version:1 and data object
```

### 5. Unsaved Changes Warning
```
1. Edit any field (don't save)
2. Try to close tab or navigate away
3. Browser shows "Leave site?" confirmation
```

### 6. Health Endpoint
```bash
curl https://steertrue-chat-dev-sandbox.up.railway.app/api/health
# Expected: {"status":"ok","timestamp":"..."}
```

## Reset Instructions
```javascript
// In browser DevTools console:
localStorage.removeItem('block-settings');
localStorage.removeItem('right-panel-width');
// Refresh page to return to defaults
```

## UAT Result
- **Status:** PASSED
- **Date:** 2026-01-15
- **Tester:** Human
