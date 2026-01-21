# ============================================================================
# blocked-detector.ps1 - Auto-Recovery Hook for BLOCKED Events
# ============================================================================
#
# PURPOSE:
# Detects BLOCKED events in AI output and auto-injects recovery context
#
# TRIGGER:
# UserPromptSubmit hook - fires when user sends any message
#
# DETECTION:
# Looks for "event: BLOCKED" or "event:BLOCKED" in recent conversation
#
# RECOVERY:
# Reads CLAUDE.md, sprint CONTEXT.md, COMMON_MISTAKES.md and injects as context
#
# CREATED: 2026-01-21
# ============================================================================

$ErrorActionPreference = "SilentlyContinue"

# Read stdin (hook input)
$inputJson = [Console]::In.ReadToEnd()

try {
    $hookInput = $inputJson | ConvertFrom-Json
} catch {
    # If no valid JSON, output empty and exit
    Write-Output "{}"
    exit 0
}

# Check if conversation contains BLOCKED event
# The hook may receive conversation context - check for BLOCKED pattern
$conversationText = $hookInput.conversation | Out-String

# Also check the prompt itself for BLOCKED references
$promptText = $hookInput.prompt

$blockedDetected = $false

if ($conversationText -match "event:\s*BLOCKED" -or $promptText -match "BLOCKED" -or $promptText -match "blocked") {
    $blockedDetected = $true
}

if (-not $blockedDetected) {
    # No BLOCKED detected, return empty
    Write-Output "{}"
    exit 0
}

# BLOCKED detected - gather recovery context
$recoveryContext = @()
$recoveryContext += "=============================================="
$recoveryContext += "BLOCKED EVENT DETECTED - AUTO-RECOVERY CONTEXT"
$recoveryContext += "=============================================="
$recoveryContext += ""

# 1. Check for DATABASE/ENV related blocks
$currentDir = Get-Location

# Try to find and read relevant files
$filesToCheck = @(
    "CLAUDE.md",
    ".claude/sprints/ai-chatbot/sprint-S2.1/CONTEXT.md",
    ".claude/sprints/mlaia/sprint-S2.1/CONTEXT.md",
    "memory/ai/COMMON_MISTAKES.md"
)

foreach ($file in $filesToCheck) {
    $fullPath = Join-Path $currentDir $file
    if (Test-Path $fullPath) {
        $content = Get-Content $fullPath -Raw -ErrorAction SilentlyContinue
        if ($content) {
            # For COMMON_MISTAKES, only include relevant sections
            if ($file -match "COMMON_MISTAKES") {
                $relevantLines = $content -split "`n" | Where-Object {
                    $_ -match "DATABASE|Railway|ENV|URL|blocked|BLOCKED"
                } | Select-Object -First 20
                if ($relevantLines) {
                    $recoveryContext += "--- $file (relevant excerpts) ---"
                    $recoveryContext += $relevantLines -join "`n"
                    $recoveryContext += ""
                }
            }
            # For CONTEXT.md, include environment section
            elseif ($file -match "CONTEXT") {
                if ($content -match "## 7\. ENVIRONMENT([\s\S]*?)##") {
                    $recoveryContext += "--- $file (Environment Section) ---"
                    $recoveryContext += $matches[1].Trim()
                    $recoveryContext += ""
                }
                if ($content -match "## 6\. DEPENDENCIES([\s\S]*?)##") {
                    $recoveryContext += "--- $file (Dependencies Section) ---"
                    $recoveryContext += $matches[1].Trim()
                    $recoveryContext += ""
                }
            }
        }
    }
}

# 2. Try to get Railway variables if this looks like a DATABASE issue
if ($promptText -match "DATABASE|ENV|Railway|connection") {
    $recoveryContext += "--- Railway Variables Check ---"
    $recoveryContext += "Run: railway variables --service steertrue-chat-frontend | grep DATABASE"
    $recoveryContext += "Or: railway variables --service Postgres-x1A-"
    $recoveryContext += ""

    # Try to actually get them
    $railwayVars = railway variables --service steertrue-chat-frontend 2>&1 | Select-String "DATABASE"
    if ($railwayVars) {
        $recoveryContext += "Railway DATABASE vars found:"
        $recoveryContext += $railwayVars
        $recoveryContext += ""
    }
}

# 3. Add recovery instructions
$recoveryContext += "=============================================="
$recoveryContext += "RECOVERY ACTIONS:"
$recoveryContext += "1. Check if the blocked resource exists (don't assume)"
$recoveryContext += "2. Verify Railway service has required env vars"
$recoveryContext += "3. For DATABASE_URL: Copy from Railway to .env.local"
$recoveryContext += "4. For missing files: Check if path is correct for this repo"
$recoveryContext += "5. Escalate with evidence if cannot resolve"
$recoveryContext += "=============================================="

# Output as JSON with additionalContext
$output = @{
    additionalContext = ($recoveryContext -join "`n")
}

$output | ConvertTo-Json -Compress
