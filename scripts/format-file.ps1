param(
    [Parameter(Mandatory=$true)]
    [string]$FilePath
)

# Exit if file doesn't exist
if (-not (Test-Path $FilePath)) {
    exit 0
}

# Get file extension
$extension = [System.IO.Path]::GetExtension($FilePath).ToLower()

# Format based on file type
switch ($extension) {
    ".py" {
        # Try black (Python formatter)
        $blackPath = Get-Command black -ErrorAction SilentlyContinue
        if ($blackPath) {
            & black $FilePath 2>$null
        }
    }
    { $_ -in ".js", ".ts", ".jsx", ".tsx", ".json", ".md" } {
        # Try prettier (JS/TS/JSON/Markdown formatter)
        $prettierPath = Get-Command prettier -ErrorAction SilentlyContinue
        if ($prettierPath) {
            & prettier --write $FilePath 2>$null
        }
    }
}

# Exit silently (formatters not being installed is not an error)
exit 0
