# Fix Git PATH Issue on Windows

If Git is installed but PowerShell can't find it, try these solutions:

## Solution 1: Restart PowerShell (Easiest)

1. **Close ALL PowerShell windows completely**
2. **Open a NEW PowerShell window** (as Administrator if possible)
3. **Try again:**
   ```powershell
   git --version
   ```

## Solution 2: Refresh Environment Variables

In your current PowerShell window, run:

```powershell
$env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path","User")
```

Then try:
```powershell
git --version
```

## Solution 3: Find Git Installation Path

1. **Check if Git is installed in default location:**
   ```powershell
   Test-Path "C:\Program Files\Git\bin\git.exe"
   ```

2. **If it returns `True`, add it to PATH manually:**
   ```powershell
   $env:Path += ";C:\Program Files\Git\bin"
   git --version
   ```

## Solution 4: Use Full Path to Git

You can use Git directly with full path:

```powershell
& "C:\Program Files\Git\bin\git.exe" --version
```

If this works, you can create an alias:
```powershell
Set-Alias git "C:\Program Files\Git\bin\git.exe"
git --version
```

## Solution 5: Reinstall Git with Correct PATH Option

If nothing works, reinstall Git:

1. **Uninstall Git** from Control Panel → Programs
2. **Download Git again:** https://git-scm.com/download/win
3. **During installation**, when you see "Adjusting your PATH environment":
   - **Select: "Git from the command line and also from 3rd-party software"**
   - This is the most important step!
4. **Complete installation**
5. **Restart your computer** (or at least restart PowerShell)

## Solution 6: Check Git Installation Location

Git might be installed in a different location. Check:

```powershell
Get-ChildItem "C:\Program Files" -Filter "git.exe" -Recurse -ErrorAction SilentlyContinue
Get-ChildItem "C:\Program Files (x86)" -Filter "git.exe" -Recurse -ErrorAction SilentlyContinue
```

This will show where Git is actually installed.

## Quick Test Commands

Run these to diagnose:

```powershell
# Check if Git exists in common locations
Test-Path "C:\Program Files\Git\bin\git.exe"
Test-Path "C:\Program Files (x86)\Git\bin\git.exe"
Test-Path "$env:LOCALAPPDATA\Programs\Git\bin\git.exe"

# Check current PATH
$env:Path -split ';' | Select-String -Pattern "git" -CaseSensitive
```

## Permanent Fix (Add to PATH Permanently)

If Solution 3 works temporarily, make it permanent:

1. **Open System Properties:**
   - Press `Win + R`
   - Type: `sysdm.cpl`
   - Press Enter

2. **Go to Advanced tab** → Click **Environment Variables**

3. **Under "System variables"**, find and select **Path** → Click **Edit**

4. **Click New** → Add: `C:\Program Files\Git\bin`

5. **Click OK** on all windows

6. **Restart PowerShell**

---

## Recommended: Use Git Bash Instead

If PowerShell continues to have issues, you can use **Git Bash** (comes with Git installation):

1. **Search for "Git Bash"** in Windows Start menu
2. **Open Git Bash**
3. **Use Git commands normally:**
   ```bash
   git --version
   git init
   ```

Git Bash is a terminal that comes with Git and always has Git in its PATH.

