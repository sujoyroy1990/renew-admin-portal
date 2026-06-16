# 🚀 Preview Auto-Start Setup

## What's Configured

Your workspace now automatically manages the preview server in 3 ways:

### 1. **VS Code Auto-Start (On Workspace Open)**
- The preview server starts automatically when you open the workspace
- Location: `.vscode/tasks.json` - `Preview site` task with `runOn: folderOpen`
- The server runs silently in the background (no popup window)

### 2. **Git Hooks Auto-Start (After Pull/Sync)**
- After any `git pull`, `git merge`, or `git checkout`:
  - Git hook checks if preview is running
  - If not running → automatically starts it
  - If running → shows confirmation message
- Hooks updated:
  - `.git/hooks/post-checkout`
  - `.git/hooks/post-merge`

### 3. **File Auto-Refresh (On Code Changes)**
- Optional: Run the `Watch & Auto-Restart Preview` task
- Automatically restarts preview when you modify:
  - `js/` folder
  - `css/` folder
  - `index.html`
- Command: `Ctrl+Shift+B` → Select "Watch & Auto-Restart Preview"

---

## How to Use

### Start Preview Manually
```bash
Ctrl+Shift+B  # Open task menu
# Select "Preview site"
```

### Watch & Auto-Restart (Advanced)
```bash
Ctrl+Shift+B  # Open task menu
# Select "Watch & Auto-Restart Preview"
# Now it will auto-restart when you save changes
```

### Check if Preview is Running
```bash
lsof -i :8000
# Should show: python3 listening on port 8000
```

### Stop Preview
```bash
lsof -i :8000  # Get process ID
kill -9 <PID>  # Stop it

# Or use VS Code: Ctrl+Shift+B → Terminate Tasks
```

### View Logs
```bash
tail -f /tmp/preview.log
```

---

## What Changed

| File | Change |
|------|--------|
| `.vscode/tasks.json` | Added `isBackground: true` & `runOptions: folderOpen` |
| `.vscode/settings.json` | Created with auto-save & task runner settings |
| `.git/hooks/post-checkout` | Added preview auto-start after git checkout/pull |
| `.git/hooks/post-merge` | Added preview auto-start after git merge |

---

## No More Manual Requests! 

✅ Workspace opens → Preview starts  
✅ You pull code → Preview starts  
✅ Files save → Auto-refreshes (optional)  

**Result:** Your preview is always ready. Just edit your code! 🎉
