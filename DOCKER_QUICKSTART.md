# Docker Quick Start Guide

## 🚀 Get Started in 3 Steps

### Step 1: Create Environment File
```bash
cp .env.example .env
# Edit .env and add your API keys
```

### Step 2: Build and Run
```bash
docker-compose up --build
```

### Step 3: Access Application
- **Frontend**: http://localhost
- **Backend API**: http://localhost:8000
- **API Docs**: http://localhost:8000/docs

## 📝 Common Commands

```bash
# Start services
docker-compose up -d

# Stop services
docker-compose down

# View logs
docker-compose logs -f

# Rebuild after code changes
docker-compose up --build

# Run migration
docker-compose exec backend python run_migration.py
```

## ✅ Verify Setup

```bash
# Check backend health
curl http://localhost:8000/health

# Check frontend
curl http://localhost/health

# View running containers
docker-compose ps
```

That's it! Your application is now running in Docker. 🎉

