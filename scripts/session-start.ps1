# ============================================================================
# session-start.ps1 - Enhanced SessionStart Hook
# ============================================================================
#
# PURPOSE:
# Runs on every Claude Code session start to load context and display state
#
# LOADS:
# 1. Git context (branch, status, recent commits)
# 2. Memory files (USER.md, WAITING_ON.md, COMMON_MISTAKES.md excerpts)
# 3. Active sprint context (if in sprint branch)
#
# CREATED: 2026-01-15 (Automation P1.5)
# UPDATED: 2026-01-16 - Added Repository Validation (M73)
# ============================================================================

$ErrorActionPreference = "Continue"

# ============================================================================
# Git Context
# ============================================================================

Write-Output "=== GIT CONTEXT ==="
Write-Output ""

# Current branch
$branch = git branch --show-current 2>&1
Write-Output "Branch: $branch"
Write-Output ""

# Git status
git status 2>&1
Write-Output ""

# Recent commits
Write-Output "Recent commits:"
git log --oneline -5 2>&1
Write-Output ""

# ============================================================================
# Repository Validation (Sprint chat-panel-1.1.0 lesson - M73)
# ============================================================================

$currentPath = (Get-Location).Path
$repoMismatch = $false

# Check WAITING_ON.md for active sprint with target project
if (Test-Path "memory\WAITING_ON.md") {
    $waitingContent = Get-Content "memory\WAITING_ON.md" -Raw

    # Extract target project path if specified
    if ($waitingContent -match '\*\*Target Project:\*\*\s*`?([^`\n]+)`?') {
        $targetProject = $matches[1].Trim()

        if ($targetProject -and $currentPath -notlike "*$targetProject*") {
            $repoMismatch = $true
            Write-Output "=== WARNING: REPOSITORY MISMATCH ==="
            Write-Output ""
            Write-Output "  Current:  $currentPath"
            Write-Output "  Expected: $targetProject"
            Write-Output ""
            Write-Output "  SPRINT WORK MAY BE IN WRONG REPOSITORY"
            Write-Output "  Check WAITING_ON.md for active sprint target"
            Write-Output ""
            Write-Output "==========================================="
            Write-Output ""
        }
    }

    # Also check for explicit repo field
    if ($waitingContent -match '\*\*Repository:\*\*\s*`?([^`\n]+)`?') {
        $expectedRepo = $matches[1].Trim()
        $currentRepoName = Split-Path $currentPath -Leaf

        if ($expectedRepo -and $currentRepoName -ne $expectedRepo -and -not $repoMismatch) {
            $repoMismatch = $true
            Write-Output "=== WARNING: REPOSITORY MISMATCH ==="
            Write-Output ""
            Write-Output "  Current repo:  $currentRepoName"
            Write-Output "  Expected repo: $expectedRepo"
            Write-Output ""
            Write-Output "  You may be in the wrong repository for active sprint"
            Write-Output ""
            Write-Output "==========================================="
            Write-Output ""
        }
    }
}

# ============================================================================
# Memory Files Context
# ============================================================================

Write-Output "=== MEMORY CONTEXT ==="
Write-Output ""

# USER.md - Performance bundles
if (Test-Path "memory\USER.md") {
    Write-Output "USER.md loaded - Performance bundles active:"
    $userContent = Get-Content "memory\USER.md" -Raw
    if ($userContent -match "Performance Bundles([\s\S]*?)##") {
        $matches[1] -split "`n" | Where-Object { $_ -match "\.aipl" } | ForEach-Object {
            Write-Output "  $_"
        }
    }
    Write-Output ""
}

# WAITING_ON.md - Current work
if (Test-Path "memory\WAITING_ON.md") {
    Write-Output "WAITING_ON.md - Current focus:"
    $waitingContent = Get-Content "memory\WAITING_ON.md" -Raw
    if ($waitingContent -match "## RIGHT NOW([\s\S]*?)##") {
        # Extract project and status lines
        $section = $matches[1]
        if ($section -match '\*\*Project:\*\* (.+)') {
            Write-Output "  Project: $($matches[1])"
        }
        if ($section -match '\*\*Status:\*\* (.+)') {
            Write-Output "  Status: $($matches[1])"
        }
    }
    Write-Output ""
}

# COMMON_MISTAKES.md - Count and recent
if (Test-Path "memory\ai\COMMON_MISTAKES.md") {
    $mistakesContent = Get-Content "memory\ai\COMMON_MISTAKES.md" -Raw
    $mistakeCount = ([regex]::Matches($mistakesContent, "### M\d+:")).Count
    Write-Output "COMMON_MISTAKES.md loaded - $mistakeCount patterns to avoid"

    # Show last 3 mistake patterns
    $lastMistakes = [regex]::Matches($mistakesContent, "### (M\d+: [^\n]+)") | Select-Object -Last 3
    if ($lastMistakes.Count -gt 0) {
        Write-Output "  Recent additions:"
        foreach ($match in $lastMistakes) {
            Write-Output "    - $($match.Groups[1].Value)"
        }
    }
    Write-Output ""
}

# ============================================================================
# Sprint Context (if in sprint branch)
# ============================================================================

if ($branch -match "dev-sprint-(.+)") {
    $sprintId = $matches[1]
    $sprintPath = ".claude\sprints\mlaia\sprint-$sprintId"

    if (Test-Path $sprintPath) {
        Write-Output "=== ACTIVE SPRINT: $sprintId ==="
        Write-Output ""

        # Read CONTEXT.md if exists
        $contextFile = "$sprintPath\CONTEXT.md"
        if (Test-Path $contextFile) {
            Write-Output "Sprint context loaded from CONTEXT.md"

            # Extract goal if present
            $contextContent = Get-Content $contextFile -Raw
            if ($contextContent -match '\*\*Goal:\*\* (.+)') {
                Write-Output "  Goal: $($matches[1])"
            }
            Write-Output ""
        }

        # Read agent-log.md last entry
        $agentLog = "$sprintPath\agent-log.md"
        if (Test-Path $agentLog) {
            $logContent = Get-Content $agentLog -Raw
            # Get last log entry (last table row before END OF LOG)
            if ($logContent -match '\| ([^\|]+) \| ([^\|]+) \| ([^\|]+) \| ([^\|]+) \| ([^\|]+) \|(?=[\s\S]*END OF LOG)') {
                Write-Output "Last agent action:"
                Write-Output "  Agent: $($matches[2].Trim())"
                Write-Output "  Trigger: $($matches[3].Trim())"
                Write-Output "  Result: $($matches[4].Trim())"
                Write-Output ""
            }
        }

        # State file if exists
        $stateFile = "$sprintPath\state.md"
        if (Test-Path $stateFile) {
            $stateContent = Get-Content $stateFile -Raw
            if ($stateContent -match 'current_phase: (\d+)') {
                Write-Output "  Current phase: $($matches[1])"
            }
            if ($stateContent -match 'status: ([^\n]+)') {
                Write-Output "  Status: $($matches[1])"
            }
            Write-Output ""
        }
    }
}

Write-Output "=== CONTEXT LOAD COMPLETE ==="

# Return empty JSON (SessionStart doesn't modify additionalContext)
$output = @{
    hookSpecificOutput = @{
        hookEventName = "SessionStart"
    }
} | ConvertTo-Json -Depth 10

Write-Output $output
