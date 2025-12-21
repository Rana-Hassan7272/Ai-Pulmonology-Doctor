# CI/CD Pipeline Setup Guide

This guide explains how to use GitHub Actions to build Docker images automatically, avoiding large local builds.

## 🔄 Workflow Overview

```
Your Laptop (Code Changes)
    │
    │ git push
    ▼
GitHub Repository
    │
    │ GitHub Actions (Automatic)
    ▼
Docker Images Built on GitHub
    │
    │ docker push
    ▼
Docker Hub (Registry)
    │
    │ docker pull
    ▼
Your Server/VPS
```

## 📋 Prerequisites

1. **GitHub Account** - For repository hosting
2. **Docker Hub Account** - For image registry
3. **Server/VPS** - For deployment (optional)

## 🚀 Setup Instructions

### Step 1: Create Docker Hub Account

1. Go to https://hub.docker.com/
2. Sign up for a free account
3. Note your username (e.g., `yourusername`)

### Step 2: Create Docker Hub Access Token

1. Login to Docker Hub
2. Go to **Account Settings** → **Security**
3. Click **New Access Token**
4. Name it: `github-actions`
5. Set permissions: **Read & Write**
6. **Copy the token** (you'll need it in Step 3)

### Step 3: Configure GitHub Secrets

1. Go to your GitHub repository
2. Click **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**
4. Add these secrets:

   **Secret 1:**
   - Name: `DOCKER_HUB_USERNAME`
   - Value: Your Docker Hub username (e.g., `yourusername`)

   **Secret 2:**
   - Name: `DOCKER_HUB_TOKEN`
   - Value: The access token you created in Step 2

### Step 4: Push Code to GitHub

```bash
# Initialize git (if not already done)
git init

# Add remote (replace with your repo URL)
git remote add origin https://github.com/yourusername/Doctor-Assistant.git

# Add all files
git add .

# Commit
git commit -m "Initial commit with CI/CD setup"

# Push to main branch
git push -u origin main
```

### Step 5: Verify GitHub Actions

1. Go to your GitHub repository
2. Click **Actions** tab
3. You should see "Build and Push Docker Images" workflow
4. Click on it to see the build progress
5. Wait for both jobs to complete (Backend & Frontend)

### Step 6: Verify Docker Hub Images

1. Go to https://hub.docker.com/
2. You should see:
   - `yourusername/doctor-assistant-backend:latest`
   - `yourusername/doctor-assistant-frontend:latest`

## 🖥️ Deploying to Your Server

### Option A: Using docker-compose.prod.yml

1. **On your server**, create a directory:
```bash
mkdir doctor-assistant
cd doctor-assistant
```

2. **Create `.env` file**:
```bash
nano .env
```

Add:
```env
DOCKER_HUB_USERNAME=yourusername
OPENAI_API_KEY=your_key
GROQ_API_KEY=your_key
```

3. **Create `docker-compose.prod.yml`** (copy from repository)

4. **Pull and run**:
```bash
docker-compose -f docker-compose.prod.yml pull
docker-compose -f docker-compose.prod.yml up -d
```

### Option B: Manual Docker Pull

```bash
# Pull images
docker pull yourusername/doctor-assistant-backend:latest
docker pull yourusername/doctor-assistant-frontend:latest

# Run backend
docker run -d \
  --name doctor-assistant-backend \
  -p 8000:8000 \
  -e OPENAI_API_KEY=your_key \
  -e GROQ_API_KEY=your_key \
  -v $(pwd)/medical.db:/app/medical.db \
  yourusername/doctor-assistant-backend:latest

# Run frontend
docker run -d \
  --name doctor-assistant-frontend \
  -p 80:80 \
  yourusername/doctor-assistant-frontend:latest
```

## 🔄 Workflow Triggers

The CI/CD pipeline runs automatically when:

1. **Push to main/master branch** - Any code changes
2. **Pull Request** - When PR is created/updated
3. **Manual trigger** - Click "Run workflow" in GitHub Actions

## 📝 Updating Images

### After Code Changes

1. **Make changes** to your code
2. **Commit and push**:
```bash
git add .
git commit -m "Your changes"
git push origin main
```

3. **GitHub Actions automatically**:
   - Builds new images
   - Pushes to Docker Hub
   - Tags with latest + commit SHA

4. **On your server**, pull updates:
```bash
docker-compose -f docker-compose.prod.yml pull
docker-compose -f docker-compose.prod.yml up -d
```

## 🎯 Image Tags

Images are tagged with:
- `latest` - Always points to the most recent build
- `{commit-sha}` - Specific commit (e.g., `abc123def`)

Example:
- `yourusername/doctor-assistant-backend:latest`
- `yourusername/doctor-assistant-backend:abc123def`

## 🔍 Monitoring Builds

### GitHub Actions

1. Go to repository → **Actions** tab
2. Click on a workflow run
3. See real-time logs for each step
4. Green checkmark = success, Red X = failure

### Docker Hub

1. Go to https://hub.docker.com/
2. Click on your repository
3. See all image tags and build history

## 🐛 Troubleshooting

### Build Fails on GitHub

1. **Check Actions logs**:
   - Go to Actions → Failed workflow → Click on failed job
   - Read error messages

2. **Common issues**:
   - Missing secrets (DOCKER_HUB_USERNAME, DOCKER_HUB_TOKEN)
   - Dockerfile syntax errors
   - Build timeout (increase if needed)

### Can't Pull Images

1. **Verify Docker Hub login**:
```bash
docker login
```

2. **Check image exists**:
```bash
docker pull yourusername/doctor-assistant-backend:latest
```

3. **Verify permissions** - Make sure token has Read access

### Images Not Updating

1. **Clear Docker cache**:
```bash
docker system prune -a
```

2. **Force pull**:
```bash
docker-compose -f docker-compose.prod.yml pull --no-cache
```

## 💡 Best Practices

1. **Use specific tags for production**:
   - Instead of `latest`, use commit SHA
   - Example: `yourusername/doctor-assistant-backend:abc123def`

2. **Test before deploying**:
   - Test locally first
   - Use PR workflow to test builds

3. **Monitor build times**:
   - First build: ~10-15 minutes
   - Subsequent builds: ~5-8 minutes (with cache)

4. **Keep secrets secure**:
   - Never commit secrets to git
   - Use GitHub Secrets only
   - Rotate tokens regularly

## 📊 Build Status Badge

Add to your README.md:

```markdown
![Docker Build](https://github.com/yourusername/Doctor-Assistant/workflows/Build%20and%20Push%20Docker%20Images/badge.svg)
```

## 🎓 Advanced: Multi-Environment

For staging/production environments:

1. **Create separate workflows**:
   - `.github/workflows/docker-build-staging.yml`
   - `.github/workflows/docker-build-prod.yml`

2. **Use different Docker Hub repositories**:
   - `yourusername/doctor-assistant-backend-staging`
   - `yourusername/doctor-assistant-backend-prod`

3. **Deploy based on branch**:
   - `develop` → staging
   - `main` → production

---

**Benefits of This Approach:**
- ✅ No local disk space used for builds
- ✅ Automatic builds on every push
- ✅ Consistent builds (same environment)
- ✅ Easy deployment (just pull images)
- ✅ Version control (tagged with commit SHA)

---

**Ready to deploy! 🚀**

