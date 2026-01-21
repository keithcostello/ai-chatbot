# ============================================================================
# steertrue-hook.ps1 - SteerTrue API Governance Injection with Boot Support
# ============================================================================
#
# SETUP INSTRUCTIONS:
# 1. Copy this file to: scripts/steertrue-hook.ps1
# 2. Update the API_URL and USER_ID defaults below for your environment
# 3. The file is gitignored - your changes won't be overwritten
#
# ENVIRONMENT OPTIONS:
# - Keith: https://steertrue-keith-keith-dev.up.railway.app / keith
# - Amy:   https://steertrue-amy-amy-dev.up.railway.app / amy
# - Dev:   https://steertrue-sandbox-dev-sandbox.up.railway.app / dev
#
# PURPOSE:
# Calls SteerTrue API endpoints to inject governance blocks as additionalContext.
# New sessions ALWAYS boot through 4 sections before normal operation.
#
# INTEGRATION:
# Runs alongside orchestrate-layers.ps1 - both hooks contribute to context.
#
# CREATED: 2025-12-18
# SPRINT: 1.R.16
# UPDATED: Sprint 1.R.39 - Simplified boot: always boot, no detection, "continue" gate
# ============================================================================

# TIMING DEBUG - log when PowerShell actually starts
$hookStartTime = Get-Date
$TIMING_LOG = "$env:TEMP\steertrue-timing.log"
Add-Content -Path $TIMING_LOG -Value "--- New hook run ---"
Add-Content -Path $TIMING_LOG -Value "[HOOK-TIMING] PowerShell started at: $($hookStartTime.ToString('HH:mm:ss.fff'))"
[Console]::Error.WriteLine("[HOOK-TIMING] PowerShell started at: $($hookStartTime.ToString('HH:mm:ss.fff'))")

# Configuration
$FALLBACK_FILE = "ai/bootstrap/MLAIA_BOOTSTRAP_4.3_full.aipl"
$SESSION_FILE = "$env:TEMP\steertrue-session.json"  # Shared with subagent hook

# =============================================================================
# >>> CONFIGURE THESE FOR YOUR ENVIRONMENT <<<
# =============================================================================
# Runtime config (can be overridden by environment variables)
$API_URL = if ($env:STEERTRUE_API_URL) { $env:STEERTRUE_API_URL } else { "https://steertrue-sandbox-dev-sandbox.up.railway.app" }
$USER_ID = if ($env:STEERTRUE_USER_ID) { $env:STEERTRUE_USER_ID } else { "dev" }
$TIMEOUT = if ($env:STEERTRUE_TIMEOUT) { [int]$env:STEERTRUE_TIMEOUT } else { 10 }
# =============================================================================

# ============================================================================
# Helper Functions
# ============================================================================

function Get-SessionState {
    # Read session state from file
    if (Test-Path $SESSION_FILE) {
        try {
            $sessionData = Get-Content $SESSION_FILE -Raw | ConvertFrom-Json
            return $sessionData
        } catch {
            # File corrupt - return null (new session)
            return $null
        }
    }
    return $null
}

function Save-SessionState {
    param([object]$state)
    $state | ConvertTo-Json -Depth 10 | Set-Content $SESSION_FILE -Force
}

function Test-NewSession {
    param([object]$sessionState)

    if ($null -eq $sessionState) { return $true }

    # BUG-3 FIX: If boot was active but incomplete and >1 hour old, treat as new
    if ($sessionState.boot_state -and $sessionState.boot_state.active -eq $true) {
        if ($sessionState.boot_state.section_completed -lt 4) {
            try {
                $updated = [DateTime]::Parse($sessionState.updated)
                $age = (Get-Date) - $updated
                if ($age.TotalHours -gt 1) {
                    Write-Error "[BUG-3 FIX] Stale incomplete boot detected (age: $($age.TotalHours)h) - treating as new session"
                    return $true
                }
            } catch {
                return $true
            }
        }
    }

    # Check if stale (>24 hours)
    if ($sessionState.updated) {
        try {
            $updated = [DateTime]::Parse($sessionState.updated)
            $age = (Get-Date) - $updated
            if ($age.TotalHours -gt 24) {
                return $true
            }
        } catch {
            return $true
        }
    }

    return $false
}

function Call-BootSection {
    param(
        [string]$sessionId,
        [int]$sectionNumber
    )

    try {
        # FIX US-5 (Sprint 1.R.38): Using curl.exe instead of Invoke-RestMethod for performance
        $endpoint = "$API_URL/api/v1/boot/$sessionId/section/$sectionNumber"
        $response = curl.exe -s --max-time $TIMEOUT -X POST -H "Content-Type: application/json" $endpoint 2>$null | ConvertFrom-Json
        return $response
    } catch {
        Write-Error "Boot section call failed: $_"
        return $null
    }
}

function Call-Analyze {
    param(
        [string]$message,
        [string]$sessionId
    )

    $requestBody = @{
        message = $message
        user_id = $USER_ID
        source = "claude-code"
        project = "mlaia"
        metadata = @{}
    }

    if ($sessionId) {
        $requestBody.session_id = $sessionId
    }

    $requestJson = $requestBody | ConvertTo-Json -Compress -Depth 10
    $endpoint = "$API_URL/api/v1/analyze"

    try {
        # FIX US-5 (Sprint 1.R.38): Using curl.exe with temp file instead of Invoke-RestMethod
        # Temp file approach avoids PowerShell string escaping issues with complex JSON
        $tempFile = [System.IO.Path]::GetTempFileName()
        $requestJson | Out-File -FilePath $tempFile -Encoding UTF8
        $response = curl.exe -s --max-time $TIMEOUT -X POST -H "Content-Type: application/json" -d "@$tempFile" $endpoint 2>$null | ConvertFrom-Json
        Remove-Item $tempFile -ErrorAction SilentlyContinue
        return $response
    } catch {
        Write-Error "Analyze call failed: $_"
        return $null
    }
}

function Format-HookOutput {
    param(
        [string]$content,
        [bool]$displayToUser = $false
    )

    # Log total execution time before returning
    $hookEndTime = Get-Date
    $totalDuration = ($hookEndTime - $hookStartTime).TotalMilliseconds
    Add-Content -Path $TIMING_LOG -Value "[HOOK-TIMING] Hook complete at: $($hookEndTime.ToString('HH:mm:ss.fff')) (total: ${totalDuration}ms)"
    [Console]::Error.WriteLine("[HOOK-TIMING] Hook complete at: $($hookEndTime.ToString('HH:mm:ss.fff')) (total: ${totalDuration}ms)")

    # Write timing to visible file for debugging
    $VISIBLE_TIMING = "$env:TEMP\steertrue-last-call.txt"
    "Hook completed: $($hookEndTime.ToString('yyyy-MM-dd HH:mm:ss.fff')) | Duration: ${totalDuration}ms" | Set-Content $VISIBLE_TIMING -Force

    if ($displayToUser) {
        $displayDirective = @"
DISPLAY THE FOLLOWING TO USER (do not modify, do not summarize):

$content

After displaying the above content, wait for user to type "continue".
"@
        $finalContent = $displayDirective
    } else {
        $finalContent = $content
    }

    $output = @{
        hookSpecificOutput = @{
            hookEventName = "UserPromptSubmit"
            additionalContext = $finalContent
        }
    } | ConvertTo-Json -Depth 10

    Write-Output $output
}

# ============================================================================
# Input Processing
# ============================================================================

# Read stdin JSON input from Claude Code
$stdinStartTime = Get-Date
Add-Content -Path $TIMING_LOG -Value "[HOOK-TIMING] Starting stdin read at: $($stdinStartTime.ToString('HH:mm:ss.fff'))"
[Console]::Error.WriteLine("[HOOK-TIMING] Starting stdin read at: $($stdinStartTime.ToString('HH:mm:ss.fff'))")
$inputRaw = $input | Out-String
$stdinEndTime = Get-Date
$stdinDuration = ($stdinEndTime - $stdinStartTime).TotalMilliseconds
Add-Content -Path $TIMING_LOG -Value "[HOOK-TIMING] stdin read complete at: $($stdinEndTime.ToString('HH:mm:ss.fff')) (took ${stdinDuration}ms)"
[Console]::Error.WriteLine("[HOOK-TIMING] stdin read complete at: $($stdinEndTime.ToString('HH:mm:ss.fff')) (took ${stdinDuration}ms)")

$inputJson = $inputRaw | ConvertFrom-Json

$prompt = if ($inputJson.prompt) { $inputJson.prompt } else { "" }
$cwd = if ($inputJson.cwd) { $inputJson.cwd } else { $PWD.Path }

# ============================================================================
# Session State Management
# ============================================================================

# Get current session state
$sessionState = Get-SessionState
$isNewSession = Test-NewSession -sessionState $sessionState

# Get or create session ID
if ($inputJson.session_id) {
    $session_id = $inputJson.session_id
} elseif ($sessionState -and $sessionState.session_id) {
    $session_id = $sessionState.session_id
} else {
    # Generate new session ID
    $session_id = [System.Guid]::NewGuid().ToString()
}

# ============================================================================
# Boot Flow Decision (Sprint 1.R.39 - SIMPLIFIED: Always boot new sessions)
# ============================================================================

$bootMode = $false
$bootSectionNumber = 1

if ($isNewSession) {
    # SC-02: Every new session ALWAYS boots through 4 sections - no detection
    $bootMode = $true
    $bootSectionNumber = 1

    Write-Error "[Sprint 1.R.39] New session detected - ALWAYS boot (no detection)"

    # Initialize session state with boot active
    $timestamp = (Get-Date -Format "o")
    $sessionState = @{
        session_id = $session_id
        boot_state = @{
            active = $true
            section_completed = 0
            started = $timestamp
        }
        updated = $timestamp
    }
    Save-SessionState -state $sessionState

} else {
    # Existing session - check if boot is in progress
    if ($sessionState.boot_state -and $sessionState.boot_state.active -eq $true) {
        # SC-03: Boot gate - only "continue" advances sections
        $trimmedPrompt = $prompt.Trim()

        if ($trimmedPrompt -ine "continue") {
            # REJECT: Non-"continue" input during boot
            $gateMessage = @"
# BOOT SEQUENCE IN PROGRESS

You are currently in the SteerTrue boot sequence.

Current progress: Section $($sessionState.boot_state.section_completed) of 4 completed

To proceed to the next section, type exactly:

    continue

All other input is blocked until boot completes.
"@
            Format-HookOutput -content $gateMessage -displayToUser $true
            exit 0
        }

        # User typed "continue" - proceed with boot
        $bootMode = $true

        # GET SECTION FROM DATABASE (authoritative source)
        try {
            $stateUrl = "$API_URL/api/v1/boot/$session_id/state"
            $dbState = curl.exe -s --max-time $TIMEOUT -X GET $stateUrl 2>$null | ConvertFrom-Json
            $bootSectionNumber = $dbState.current_section
            Write-Error "[DATABASE] Got section from database: $bootSectionNumber"
        } catch {
            # Fallback to local if API fails (degraded mode)
            $bootSectionNumber = $sessionState.boot_state.section_completed + 1
            Write-Error "[FALLBACK] Database query failed, using local: $bootSectionNumber"
        }

        # Check if boot complete
        if ($bootSectionNumber -gt 4) {
            $bootMode = $false
            $sessionState.boot_state.active = $false
        }
    }
}

# ============================================================================
# API Call Execution
# ============================================================================

try {
    if ($bootMode) {
        # Boot flow
        Write-Error "Boot mode: calling section $bootSectionNumber (session_id: $session_id)"

        $bootResponse = Call-BootSection -sessionId $session_id -sectionNumber $bootSectionNumber

        if ($null -eq $bootResponse) {
            # Boot call failed - fall back to analyze with L1/L2 guaranteed
            Write-Error "Boot call failed - falling back to analyze"
            $analyzeResponse = Call-Analyze -message $prompt -sessionId $session_id

            if ($null -eq $analyzeResponse) {
                throw "Both boot and analyze calls failed"
            }

            # Process analyze response
            $system_prompt = if ($analyzeResponse.system_prompt) { $analyzeResponse.system_prompt } else { "" }
            $blocks_injected = if ($analyzeResponse.blocks_injected) { $analyzeResponse.blocks_injected } else { @() }
            $total_tokens = if ($analyzeResponse.total_tokens) { $analyzeResponse.total_tokens } else { 0 }

            # Update session state
            $sessionState.boot_state.active = $false
            $sessionState.session_id = if ($analyzeResponse.session_id) { $analyzeResponse.session_id } else { $session_id }
            $sessionState.updated = (Get-Date -Format "o")
            Save-SessionState -state $sessionState

            # Build output
            if (-not $system_prompt -or $system_prompt.Trim() -eq "") {
                Format-HookOutput -content ""
                exit 0
            }

            $blocksStr = ($blocks_injected -join ", ")
            $metadataHeader = "[SteerTrue: $blocksStr | $total_tokens tokens]`n`n"
            Format-HookOutput -content ($metadataHeader + $system_prompt)
            exit 0
        }

        # Boot call succeeded - process boot response
        $bootContent = $bootResponse.content
        $isFinal = $bootResponse.is_final

        # Update boot state
        $sessionState.boot_state.section_completed = $bootSectionNumber
        if ($isFinal) {
            $sessionState.boot_state.active = $false
        }
        $sessionState.updated = (Get-Date -Format "o")
        Save-SessionState -state $sessionState

        # V4 VERIFICATION: Confirm local file actually saved
        $verifyLocal = Get-SessionState
        if ($verifyLocal.boot_state.section_completed -ne $bootSectionNumber) {
            Write-Error "[V4 FAIL] Local file verification failed: expected section_completed=$bootSectionNumber, got $($verifyLocal.boot_state.section_completed)"
        } else {
            Write-Error "[V4 PASS] Local file verified: section_completed=$bootSectionNumber"
        }

        # SYNC with database (BUG-1 FIX - Sprint 1.R.38)
        # V5 FIX: Capture response and verify success (previous code used | Out-Null which hid failures)
        $completeUrl = "$API_URL/api/v1/boot/$session_id/complete-section/$bootSectionNumber"
        $syncSuccess = $false
        try {
            $completeResponse = curl.exe -s --max-time $TIMEOUT -X POST $completeUrl 2>&1
            $curlExit = $LASTEXITCODE

            if ($curlExit -ne 0) {
                Write-Error "[V5 FAIL] curl exit code: $curlExit - sync failed for section $bootSectionNumber"
            } elseif (-not $completeResponse) {
                Write-Error "[V5 FAIL] Empty response from complete-section/$bootSectionNumber"
            } else {
                # Parse response to verify success
                try {
                    $syncResult = $completeResponse | ConvertFrom-Json
                    if ($syncResult.section_completed -eq $bootSectionNumber) {
                        Write-Error "[V5 PASS] Synced section $bootSectionNumber to database (next: $($syncResult.next_section))"
                        $syncSuccess = $true
                    } else {
                        Write-Error "[V5 FAIL] Unexpected response: $completeResponse"
                    }
                } catch {
                    Write-Error "[V5 FAIL] Invalid JSON response: $completeResponse"
                }
            }
        } catch {
            Write-Error "[V5 FAIL] Sync call exception: $_"
        }

        if (-not $syncSuccess) {
            Write-Error "[V5 ALERT] Database sync failed - alignment will be broken"
        }

        # V4 VERIFICATION: Confirm database actually updated
        try {
            $stateUrl = "$API_URL/api/v1/boot/$session_id/state"
            $verifyState = curl.exe -s --max-time $TIMEOUT -X GET $stateUrl 2>$null | ConvertFrom-Json
            $expectedSection = if ($bootSectionNumber -lt 4) { $bootSectionNumber + 1 } else { 4 }
            if ($verifyState.current_section -ne $expectedSection) {
                Write-Error "[V4 FAIL] Database verification failed: expected current_section=$expectedSection, got $($verifyState.current_section)"
                # Do NOT hide this error - user must see database sync failed
            } else {
                Write-Error "[V4 PASS] Database verified: current_section=$expectedSection, completed_sections=$($verifyState.completed_sections -join ',')"
            }
        } catch {
            Write-Error "[V4 FAIL] Database verification call failed: $_"
        }

        # Build boot section header
        $sectionHeader = "# BOOT SECTION $bootSectionNumber/$($bootResponse.total_sections): $($bootResponse.section_name)`n`n"
        $sectionHeader += "Layers: $($bootResponse.layers -join ', ')`n"
        $sectionHeader += "Blocks: $($bootResponse.blocks_included -join ', ')`n`n"

        Format-HookOutput -content ($sectionHeader + $bootContent) -displayToUser $true
        exit 0

    } else {
        # Standard analyze flow
        $analyzeResponse = Call-Analyze -message $prompt -sessionId $session_id

        if ($null -eq $analyzeResponse) {
            throw "Analyze call failed"
        }

        # Extract system_prompt and metadata
        $system_prompt = if ($analyzeResponse.system_prompt) { $analyzeResponse.system_prompt } else { "" }
        $blocks_injected = if ($analyzeResponse.blocks_injected) { $analyzeResponse.blocks_injected } else { @() }
        $total_tokens = if ($analyzeResponse.total_tokens) { $analyzeResponse.total_tokens } else { 0 }
        $response_session_id = if ($analyzeResponse.session_id) { $analyzeResponse.session_id } else { $null }

        # Persist session_id
        if ($response_session_id) {
            $sessionState.session_id = $response_session_id
            $sessionState.updated = (Get-Date -Format "o")
            Save-SessionState -state $sessionState
        }

        # If API returns empty system_prompt (continuation request), return empty context
        if (-not $system_prompt -or $system_prompt.Trim() -eq "") {
            Format-HookOutput -content ""
            exit 0
        }

        # Build metadata header for AI visibility
        $blocksStr = ($blocks_injected -join ", ")
        $metadataHeader = "[SteerTrue: $blocksStr | $total_tokens tokens]`n`n"

        # Success - return header + system_prompt as additionalContext
        Format-HookOutput -content ($metadataHeader + $system_prompt)
        exit 0
    }

} catch {
    # API call failed - fall back to local AIPL
    Write-Error "SteerTrue API unavailable: $_ - Falling back to local AIPL"

    # Construct fallback file path using cwd from Claude Code
    $fallbackPath = Join-Path $cwd $FALLBACK_FILE

    # Check if fallback file exists
    if (-not (Test-Path $fallbackPath)) {
        Write-Error "CRITICAL: Fallback file not found at $fallbackPath"
        # Return empty context - don't block Claude Code
        Format-HookOutput -content ""
        exit 0
    }

    # Read fallback file
    $fallbackContent = Get-Content -Path $fallbackPath -Raw

    # Return fallback content as additionalContext
    Format-HookOutput -content $fallbackContent
    exit 0
}
