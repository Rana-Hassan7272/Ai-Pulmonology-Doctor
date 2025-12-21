# 🚀 Quick Start: CI/CD Setup (5 Minutes)

## What This Does

Instead of building Docker images locally (which uses 30GB+), GitHub Actions builds them automatically and pushes to Docker Hub.

## Setup Steps

### 1. Create Docker Hub Account (2 min)
- Go to https://hub.docker.com/signup
- Create account, note your username

### 2. Create Access Token (1 min)
- Docker Hub → Account Settings → Security → New Access Token
- Name: `github-actions`
- Permissions: Read & Write
- **Copy the token**

### 3. Add GitHub Secrets (1 min)
- GitHub repo → Settings → Secrets and variables → Actions
- Add secret: `DOCKER_HUB_USERNAME` = your Docker Hub username
- Add secret: `DOCKER_HUB_TOKEN` = the token you copied

### 4. Push Code (1 min)
```bash
git add .
git commit -m "Add CI/CD pipeline"
git push origin main
```

### 5. Watch It Build
- Go to GitHub → Actions tab
- Watch the workflow build both images
- Check Docker Hub to see your images

## Deploy on Server

```bash
# Create .env file
echo "DOCKER_HUB_USERNAME=yourusername" > .env
echo "OPENAI_API_KEY=your_key" >> .env
echo "GROQ_API_KEY=your_key" >> .env

# Pull and run
docker-compose -f docker-compose.prod.yml pull
docker-compose -f docker-compose.prod.yml up -d
```

## That's It! 🎉

Every time you push code:
1. GitHub builds images automatically
2. Images pushed to Docker Hub
3. Pull on server to update

**No more 30GB local builds!**

See `CI_CD_SETUP.md` for detailed instructions.

