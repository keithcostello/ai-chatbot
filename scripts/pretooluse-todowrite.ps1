# ============================================================================
# pretooluse-todowrite.ps1 - TodoWrite Enforcement Hook
# ============================================================================
#
# PURPOSE:
# PreToolUse hook that enforces TodoWrite for multi-step tasks
#
# TRIGGERS:
# - Tool: Write, Edit, Bash (code execution)
# - Condition: Task appears to have 3+ steps
#
# ENFORCEMENT:
# - Checks if TodoWrite was used in recent context
# - If multi-step work detected without TodoWrite: WARNING (not block)
# - Reminds AI to use TodoWrite for visibility
#
# CREATED: 2026-01-15 (Automation P1.7)
# ============================================================================

# Read stdin JSON input from Claude Code
$inputRaw = $input | Out-String
$inputJson = $inputRaw | ConvertFrom-Json

$tool_name = if ($inputJson.tool_name) { $inputJson.tool_name } else { "" }
$tool_input = if ($inputJson.tool_input) { $inputJson.tool_input } else { @{} }

# Only process Write, Edit, Bash tools
$trackedTools = @("Write", "Edit", "Bash")
if ($tool_name -notin $trackedTools) {
    # Not a tracked tool - allow without output
    exit 0
}

# Check if this looks like multi-step work
# Heuristics:
# - Write with >100 lines of code
# - Edit with significant changes
# - Bash with complex commands (&&, ;, |)

$isMultiStep = $false
$reason = ""

switch ($tool_name) {
    "Write" {
        if ($tool_input.content) {
            $lineCount = ($tool_input.content -split "`n").Count
            if ($lineCount -gt 100) {
                $isMultiStep = $true
                $reason = "Large file write ($lineCount lines) suggests multi-step task"
            }
        }
    }
    "Edit" {
        if ($tool_input.old_string -and $tool_input.new_string) {
            $oldLines = ($tool_input.old_string -split "`n").Count
            $newLines = ($tool_input.new_string -split "`n").Count
            if ($oldLines -gt 20 -or $newLines -gt 20) {
                $isMultiStep = $true
                $reason = "Significant edit suggests multi-step task"
            }
        }
    }
    "Bash" {
        if ($tool_input.command) {
            # Check for command chaining operators
            if ($tool_input.command -match '&&|;|\|') {
                $isMultiStep = $true
                $reason = "Command chaining detected - likely multi-step workflow"
            }
        }
    }
}

# If multi-step detected, add reminder to context
if ($isMultiStep) {
    $reminder = @"
TODOWRITE REMINDER

$reason

Consider using TodoWrite tool to track progress:
- Makes work visible to user
- Helps track completion
- Enables resumption if interrupted

Example:
```
TodoWrite with items:
1. [Task description] - status: in_progress
2. [Next task] - status: pending
3. [Final task] - status: pending
```

This is a suggestion, not a blocker. Proceed with tool use.
"@

    # Return warning via additionalContext (non-blocking)
    $output = @{
        hookSpecificOutput = @{
            hookEventName = "PreToolUse"
            permissionDecision = "allow"
            permissionDecisionReason = "TodoWrite reminder issued"
            additionalContext = $reminder
        }
    } | ConvertTo-Json -Depth 10

    Write-Output $output
    exit 0
}

# Not multi-step or no detection - allow silently
exit 0
