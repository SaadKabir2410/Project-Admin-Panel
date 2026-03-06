# reset.ps1
# This script automatically stages, commits, and pushes changes to the remote repository.

# Set location to the directory where the script is located
Set-Location $PSScriptRoot

Write-Host "Starting auto-push process..." -ForegroundColor Cyan

# Add all changes
git add .

# Commit changes with timestamp
$timestamp = Get-Date -Format 'yyyy-MM-dd HH:mm:ss'
git commit -m "Auto-update $timestamp"

# Get current branch name
$branch = git branch --show-current
if ([string]::IsNullOrEmpty($branch)) {
    $branch = "main"
}

Write-Host "Pushing changes to branch: $branch" -ForegroundColor Yellow

# Push to the current branch
git push origin $branch

Write-Host "Successfully pushed changes!" -ForegroundColor Green