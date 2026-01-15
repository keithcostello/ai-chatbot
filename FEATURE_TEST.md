# Feature Test: Collapsible Right Panel with Block Settings

## Feature Overview

**Feature:** Collapsible Right Panel with Block Settings Display
**Branch:** `chat-panel-1.0.0`
**Deployment URL:** https://steertrue-chat-dev-sandbox.up.railway.app

This feature adds a collapsible right panel to the chat interface that displays detailed block settings for the active SteerTrue governance block (Strategic Partner block).

## Components

### RightPanel.tsx
**Location:** `components/panels/RightPanel.tsx`

A reusable collapsible panel component that provides:
- Toggle button for open/close state
- Smooth transition animations
- Fixed width (320px) when open
- Zero width when collapsed
- Support for custom title and default state

**Props:**
- `children`: React.ReactNode - Content to display in the panel
- `title`: string - Panel header title
- `defaultOpen`: boolean (optional) - Initial open/close state (default: true)

### BlockSettingsPanel.tsx
**Location:** `components/panels/BlockSettingsPanel.tsx`

Displays comprehensive block settings for the Strategic Partner governance block:
- Block metadata (layer, ID, name, version)
- Block description
- Trigger keywords
- Decay settings (enabled status, preset)
- Identity configuration (role, scope, is/isNot lists)
- Constraints (must/prohibited lists)

## How to Test

### 1. Access the Application
Navigate to: https://steertrue-chat-dev-sandbox.up.railway.app

### 2. Verify Right Panel is Visible
- **Expected:** Right panel should be visible on the right side of the chat interface
- **Panel Title:** Should display "Block Settings" or similar
- **Initial State:** Panel should be open by default

### 3. Test Toggle Functionality
- **Locate Toggle Button:** Look for a button on the left edge of the panel (positioned at `-left-8`)
- **Click to Close:**
  - Click the toggle button
  - Panel should smoothly collapse to zero width
  - Toggle button icon should change from '›' to '‹'
- **Click to Open:**
  - Click the toggle button again
  - Panel should smoothly expand to 320px width
  - Toggle button icon should change from '‹' to '›'

### 4. Verify Block Settings Display
When panel is open, verify the following sections are visible:

#### Block Header Section
- **Layer Badge:** Blue badge showing "L3" (Strategic Partner layer)
- **Block ID:** Display of full block ID
- **Block Name:** "Strategic Partner"
- **Description:** Text describing block purpose
- **Version:** Version number (e.g., "Version 1.0")

#### Triggers Section
- **Header:** "TRIGGERS" label
- **Trigger Tags:** Multiple tags showing trigger keywords
- **Expected Triggers:** May include keywords like "strategic", "partner", "evidence", etc.
- **Styling:** Each trigger should appear as a pill/badge with border

#### Decay Settings Section
- **Header:** "DECAY" label
- **Enabled Status:** Shows "Yes" or "No"
- **Preset:** Shows decay preset name (e.g., "standard", "slow", "fast")

#### Identity Panel Section
- **Role:** Display of block role
- **Scope:** Display of block scope
- **Is List:** Positive identity attributes
- **Is Not List:** Negative identity attributes (things the block is NOT)

#### Constraints Panel Section
- **Must List:** Required behaviors/actions
- **Prohibited List:** Forbidden behaviors/actions

### 5. Test Responsive Behavior
- **Panel Width:** When open, panel should maintain 320px width
- **Content Scrolling:** If content exceeds panel height, should scroll vertically
- **Animation:** Transitions should be smooth (300ms duration)

### 6. Test Edge Cases
- **Missing Block Data:** If strategic partner block data is unavailable, should display "Block data unavailable" message
- **Long Content:** Test scrolling with extensive constraint lists
- **Rapid Toggling:** Click toggle button multiple times quickly - should handle gracefully

## Known Limitations

### 1. Read-Only Display
- **Current State:** Panel displays block settings in read-only mode
- **No Editing:** Users cannot modify block settings through the UI
- **Impact:** Settings are for information/reference only

### 2. Fixed Width
- **Width:** Panel has fixed width of 320px (80 in Tailwind units)
- **No Resizing:** Cannot be dragged to resize
- **Impact:** May not accommodate very long text without scrolling

### 3. Single Block Display
- **Current Implementation:** Only displays the Strategic Partner block
- **No Block Switching:** Cannot switch between different blocks in the UI
- **Impact:** Limited to viewing one block's settings at a time

### 4. Static Data
- **Data Source:** Block data is imported from static file (`@/data/strategicPartnerBlock`)
- **No Dynamic Updates:** Changes to block settings require code changes and redeployment
- **Impact:** Not connected to live SteerTrue API/database

### 5. Mobile Support
- **Desktop-Focused:** Designed primarily for desktop viewport
- **Mobile Behavior:** May need additional responsive design work for small screens
- **Toggle Button Position:** Fixed positioning may not be optimal on mobile

## Success Criteria

✅ Right panel renders on page load
✅ Toggle button opens and closes panel smoothly
✅ All block settings sections are visible and properly formatted
✅ Panel maintains fixed width when open
✅ Content scrolls vertically when exceeding panel height
✅ Styling matches dark theme of application (zinc-900 background)
✅ Toggle button is accessible and visible in both states

## Future Enhancements (Not in Current Scope)

- Dynamic block data fetching from API
- Block settings editing capability
- Block switching/selection UI
- Resizable panel width
- Mobile-optimized layout
- Persistent panel state (remember open/close across sessions)
- Multiple panel support (stack or tab interface)
