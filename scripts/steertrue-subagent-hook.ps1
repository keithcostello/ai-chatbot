# ============================================================================
# steertrue-subagent-hook.ps1 - SteerTrue Governance for Subagents
# ============================================================================
#
# SETUP INSTRUCTIONS:
# 1. Copy this file to: scripts/steertrue-subagent-hook.ps1
# 2. Update the API_URL and USER_ID defaults below for your environment
# 3. The file is gitignored - your changes won't be overwritten
#
# ENVIRONMENT OPTIONS:
# - Keith: https://steertrue-keith-keith-dev.up.railway.app / keith
# - Amy:   https://steertrue-amy-amy-dev.up.railway.app / amy
# - Dev:   https://steertrue-sandbox-dev-sandbox.up.railway.app / dev
#
# PURPOSE:
# Intercepts Task tool calls (subagent spawning) via PreToolUse hook and
# injects SteerTrue governance blocks into the subagent's prompt.
#
# HOW IT WORKS:
# 1. PreToolUse hook fires when Task tool is called
# 2. This script extracts the subagent's prompt from tool_input
# 3. Calls SteerTrue API /api/v1/analyze with that prompt
# 4. Returns updatedInput with governance blocks prepended to prompt
#
# CREATED: 2025-12-23
# ============================================================================

# Configuration
$SESSION_FILE = "$env:TEMP\steertrue-session.json"  # Shared with main hook

# =============================================================================
# >>> CONFIGURE THESE FOR YOUR ENVIRONMENT <<<
# =============================================================================
# Runtime config (can be overridden by environment variables)
$API_URL = if ($env:STEERTRUE_API_URL) { $env:STEERTRUE_API_URL } else { "https://steertrue-sandbox-dev-sandbox.up.railway.app" }
$USER_ID = if ($env:STEERTRUE_USER_ID) { $env:STEERTRUE_USER_ID } else { "dev" }
$TIMEOUT = if ($env:STEERTRUE_TIMEOUT) { [int]$env:STEERTRUE_TIMEOUT } else { 10 }
# =============================================================================

# ============================================================================
# Input Processing
# ============================================================================

# Read stdin JSON input from Claude Code
$inputRaw = $input | Out-String
$inputJson = $inputRaw | ConvertFrom-Json

$tool_name = if ($inputJson.tool_name) { $inputJson.tool_name } else { "" }
$tool_input = if ($inputJson.tool_input) { $inputJson.tool_input } else { @{} }

# Session management: Read from shared session file (written by main hook)
$session_id = $null
if ($inputJson.session_id) {
    $session_id = $inputJson.session_id
} elseif (Test-Path $SESSION_FILE) {
    try {
        $sessionData = Get-Content $SESSION_FILE -Raw | ConvertFrom-Json
        $session_id = $sessionData.session_id
    } catch {
        $session_id = $null
    }
}

# Only process Task tool calls
if ($tool_name -ne "Task") {
    # Not a Task call - exit without output (let normal flow proceed)
    exit 0
}

# Extract subagent prompt and all Task parameters
$subagent_prompt = if ($tool_input.prompt) { $tool_input.prompt } else { "" }
$subagent_type = if ($tool_input.subagent_type) { $tool_input.subagent_type } else { "unknown" }
$description = if ($tool_input.description) { $tool_input.description } else { "" }
# Optional fields - preserve if present
$model = $tool_input.model
$resume = $tool_input.resume
$run_in_background = $tool_input.run_in_background

# Skip if no prompt (shouldn't happen but be safe)
if (-not $subagent_prompt -or $subagent_prompt.Trim() -eq "") {
    exit 0
}

# ============================================================================
# API Call
# ============================================================================

try {
    # Build request body - use subagent prompt as message
    $requestBody = @{
        message = $subagent_prompt
        user_id = $USER_ID
        source = "claude-code-subagent"
        project = "mlaia"
        metadata = @{
            subagent_type = $subagent_type
            description = $description
        }
    }

    # Add session_id if provided (maintains decay state across subagents)
    if ($session_id) {
        $requestBody.session_id = $session_id
    }

    # Convert to JSON
    $requestJson = $requestBody | ConvertTo-Json -Compress -Depth 10

    # Call SteerTrue API
    $endpoint = "$API_URL/api/v1/analyze"
    $responseData = Invoke-RestMethod -Uri $endpoint -Method Post -Body $requestJson -ContentType "application/json" -TimeoutSec $TIMEOUT

    # Extract system_prompt and metadata
    $system_prompt = if ($responseData.system_prompt) { $responseData.system_prompt } else { "" }
    $blocks_injected = if ($responseData.blocks_injected) { $responseData.blocks_injected } else { @() }
    $total_tokens = if ($responseData.total_tokens) { $responseData.total_tokens } else { 0 }

    # If API returns empty system_prompt, don't modify
    if (-not $system_prompt -or $system_prompt.Trim() -eq "") {
        exit 0
    }

    # Build governance header
    $blocksStr = ($blocks_injected -join ", ")
    $governanceHeader = @"
# STEERTRUE GOVERNANCE INJECTION (Subagent: $subagent_type)
# Blocks: $blocksStr | Tokens: $total_tokens

$system_prompt

---
# END STEERTRUE GOVERNANCE
# Original task follows:

"@

    # Prepend governance to original prompt
    $modifiedPrompt = $governanceHeader + $subagent_prompt

    # Return updatedInput to modify the Task call
    $output = @{
        hookSpecificOutput = @{
            hookEventName = "PreToolUse"
            permissionDecision = "allow"
            permissionDecisionReason = "SteerTrue governance injected for subagent"
            updatedInput = @{
                prompt = $modifiedPrompt
                subagent_type = $subagent_type
                description = $description
            }
        }
    }

    # Add optional fields only if they were present in original input
    if ($model) { $output.hookSpecificOutput.updatedInput.model = $model }
    if ($resume) { $output.hookSpecificOutput.updatedInput.resume = $resume }
    if ($null -ne $run_in_background) { $output.hookSpecificOutput.updatedInput.run_in_background = $run_in_background }

    $outputJson = $output | ConvertTo-Json -Depth 10
    Write-Output $outputJson
    exit 0

} catch {
    # API call failed - let subagent proceed without governance
    # Log error but don't block subagent execution
    Write-Error "SteerTrue subagent hook API error: $_"
    exit 0
}
