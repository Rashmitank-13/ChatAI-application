# Git Repository Setup Guide

This guide will help you create Git repositories for the frontend and backend and share them.

## Option 1: Separate Repositories (Recommended)

### For Backend Repository

1. **Navigate to backend folder:**
   ```bash
   cd backend
   ```

2. **Initialize Git repository:**
   ```bash
   git init
   ```

3. **Add all files:**
   ```bash
   git add .
   ```

4. **Create initial commit:**
   ```bash
   git commit -m "Initial commit: ChatAI backend"
   ```

5. **Create repository on GitHub/GitLab:**
   - Go to GitHub.com or GitLab.com
   - Click "New repository"
   - Name it: `chatai-backend` (or any name you prefer)
   - **Don't** initialize with README, .gitignore, or license
   - Click "Create repository"

6. **Add remote and push:**
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/chatai-backend.git
   git branch -M main
   git push -u origin main
   ```
   (Replace `YOUR_USERNAME` with your GitHub/GitLab username)

### For Frontend Repository

1. **Navigate to frontend folder:**
   ```bash
   cd frontend
   ```

2. **Initialize Git repository:**
   ```bash
   git init
   ```

3. **Add all files:**
   ```bash
   git add .
   ```

4. **Create initial commit:**
   ```bash
   git commit -m "Initial commit: ChatAI frontend"
   ```

5. **Create repository on GitHub/GitLab:**
   - Go to GitHub.com or GitLab.com
   - Click "New repository"
   - Name it: `chatai-frontend` (or any name you prefer)
   - **Don't** initialize with README, .gitignore, or license
   - Click "Create repository"

6. **Add remote and push:**
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/chatai-frontend.git
   git branch -M main
   git push -u origin main
   ```

---

## Option 2: Single Monorepo (All in One)

If you prefer to keep everything in one repository:

1. **Navigate to project root:**
   ```bash
   cd G:\chatgpt
   ```

2. **Initialize Git repository:**
   ```bash
   git init
   ```

3. **Add all files:**
   ```bash
   git add .
   ```

4. **Create initial commit:**
   ```bash
   git commit -m "Initial commit: ChatAI application"
   ```

5. **Create repository on GitHub/GitLab:**
   - Go to GitHub.com or GitLab.com
   - Click "New repository"
   - Name it: `chatai` (or any name you prefer)
   - **Don't** initialize with README, .gitignore, or license
   - Click "Create repository"

6. **Add remote and push:**
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/chatai.git
   git branch -M main
   git push -u origin main
   ```

---

## Sharing the Repository

### Share via GitHub/GitLab URL:
Once pushed, share the repository URL:
- `https://github.com/YOUR_USERNAME/chatai-backend`
- `https://github.com/YOUR_USERNAME/chatai-frontend`

### Clone Instructions for Others:

**For Backend:**
```bash
git clone https://github.com/YOUR_USERNAME/chatai-backend.git
cd chatai-backend
npm install
npm start
```

**For Frontend:**
```bash
git clone https://github.com/YOUR_USERNAME/chatai-frontend.git
cd chatai-frontend
npm install
npm start
```

---

## Quick Setup Scripts

### Backend Setup (run in backend folder):
```bash
git init
git add .
git commit -m "Initial commit: ChatAI backend"
git remote add origin YOUR_BACKEND_REPO_URL
git branch -M main
git push -u origin main
```

### Frontend Setup (run in frontend folder):
```bash
git init
git add .
git commit -m "Initial commit: ChatAI frontend"
git remote add origin YOUR_FRONTEND_REPO_URL
git branch -M main
git push -u origin main
```

---

## Notes:

- Make sure you have Git installed: `git --version`
- Make sure you're logged into GitHub/GitLab via command line or use HTTPS with personal access token
- The `.gitignore` files are already configured to exclude `node_modules/` and other unnecessary files
- If you get authentication errors, you may need to set up SSH keys or use a personal access token

