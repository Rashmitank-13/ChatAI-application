# How to Install Git on Windows

## Step 1: Download Git

1. Go to the official Git website: **https://git-scm.com/download/win**
2. The download will start automatically (it's about 50-60 MB)
3. Or you can click "Click here to download" if it doesn't start automatically

## Step 2: Install Git

1. **Run the installer** (Git-2.x.x-64-bit.exe)
2. **Follow the installation wizard:**
   - Click "Next" on the welcome screen
   - Choose installation location (default is fine) → Click "Next"
   - Select components (default selections are fine) → Click "Next"
   - Choose default editor (default is fine) → Click "Next"
   - Adjust PATH environment (choose "Git from the command line and also from 3rd-party software") → Click "Next"
   - Choose HTTPS transport backend (default is fine) → Click "Next"
   - Configure line ending conversions (default is fine) → Click "Next"
   - Configure terminal emulator (default is fine) → Click "Next"
   - Configure extra options (default is fine) → Click "Next"
   - Click "Install"
   - Wait for installation to complete
   - Click "Finish"

## Step 3: Verify Installation

1. **Close and reopen PowerShell** (or open a new PowerShell window)
2. **Test Git installation:**
   ```powershell
   git --version
   ```
   You should see something like: `git version 2.x.x.windows.x`

## Step 4: Configure Git (First Time Setup)

After installation, configure your name and email:

```powershell
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
```

Replace with your actual name and email.

## Alternative: Install via Package Manager

If you have **Chocolatey** installed, you can install Git using:

```powershell
choco install git
```

Or if you have **Winget** (Windows Package Manager):

```powershell
winget install --id Git.Git -e --source winget
```

---

## After Installation

Once Git is installed, you can proceed with creating your repositories using the commands in `GIT_SETUP.md`.

**Important:** After installing Git, you must:
1. Close your current PowerShell window
2. Open a new PowerShell window
3. Then run the git commands

This ensures the PATH environment variable is updated.

