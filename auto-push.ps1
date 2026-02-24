# auto-push.ps1
# Change directory to your project folder
cd "G:\KABIR\React\Admin-Panel-Dashboard\Admin-Dashboard"

# Add all changes
git add .

# Commit changes with timestamp
git commit -m "Auto-update $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')"

# Push to main branch
git push origin main