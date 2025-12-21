# Docker Setup Guide

Complete Docker setup for Doctor Assistant (Backend + Frontend)

## 📁 Project Structure

```
Doctor-Assistant/
├── backend/
│   ├── Dockerfile
│   ├── .dockerignore
│   └── app/
├── frontend/
│   ├── Dockerfile
│   ├── .dockerignore
│   ├── nginx.conf
│   └── src/
├── docker-compose.yml
└── .env (create this)
```

## 🚀 Quick Start

### 1. Create Environment File

Create a `.env` file in the root directory:

```env
# LLM API Keys (at least one required)
OPENAI_API_KEY=your_openai_key_here
GROQ_API_KEY=your_groq_key_here

# Optional
LLM_TEMPERATURE=0.7
```

### 2. Build and Run

```bash
# Build and start all services
docker-compose up --build

# Or run in detached mode (background)
docker-compose up -d --build
```

### 3. Access the Application

- **Frontend**: http://localhost
- **Backend API**: http://localhost:8000
- **API Documentation**: http://localhost:8000/docs
- **Health Check**: http://localhost:8000/health

## 📋 Available Commands

### Start Services
```bash
docker-compose up              # Start in foreground
docker-compose up -d           # Start in background
docker-compose up --build      # Rebuild and start
```

### Stop Services
```bash
docker-compose down            # Stop and remove containers
docker-compose stop            # Stop containers (keep them)
docker-compose restart         # Restart containers
```

### View Logs
```bash
docker-compose logs            # All services
docker-compose logs backend    # Backend only
docker-compose logs frontend   # Frontend only
docker-compose logs -f         # Follow logs (live)
```

### Rebuild Specific Service
```bash
docker-compose build backend   # Rebuild backend
docker-compose build frontend  # Rebuild frontend
docker-compose up --build backend  # Rebuild and restart backend
```

### Execute Commands in Containers
```bash
# Run migration in backend
docker-compose exec backend python run_migration.py

# Access backend shell
docker-compose exec backend bash

# Access frontend shell
docker-compose exec frontend sh
```

## 🔧 Configuration

### Backend Configuration

The backend container:
- Runs on port **8000**
- Uses SQLite database (persisted in `./backend/medical.db`)
- Stores PDF reports in `./backend/reports/`
- Stores RAG index in `./backend/data/rag_index/`
- ML models are mounted read-only from `./backend/app/ml_models/`

### Frontend Configuration

The frontend container:
- Runs on port **80** (nginx)
- Serves built React app
- Configured for SPA routing (React Router)
- Includes gzip compression
- Security headers enabled

### Environment Variables

Edit `docker-compose.yml` to add more environment variables:

```yaml
environment:
  - OPENAI_API_KEY=${OPENAI_API_KEY}
  - GROQ_API_KEY=${GROQ_API_KEY}
  - CUSTOM_VAR=value
```

## 📦 Volumes

Data persistence is handled via Docker volumes:

- **Database**: `./backend/medical.db` → `/app/medical.db`
- **Reports**: `./backend/reports/` → `/app/reports`
- **RAG Index**: `./backend/data/` → `/app/data`
- **ML Models**: `./backend/app/ml_models/` → `/app/app/ml_models` (read-only)

## 🏥 Health Checks

Both services include health checks:

- **Backend**: Checks `/health` endpoint every 30s
- **Frontend**: Checks nginx health endpoint every 30s

View health status:
```bash
docker-compose ps
```

## 🐛 Troubleshooting

### Backend won't start

1. **Check logs**:
   ```bash
   docker-compose logs backend
   ```

2. **Verify environment variables**:
   ```bash
   docker-compose exec backend env | grep API_KEY
   ```

3. **Check database permissions**:
   ```bash
   ls -la backend/medical.db
   ```

4. **Run migration manually**:
   ```bash
   docker-compose exec backend python run_migration.py
   ```

### Frontend shows blank page

1. **Check nginx logs**:
   ```bash
   docker-compose logs frontend
   ```

2. **Verify build**:
   ```bash
   docker-compose exec frontend ls -la /usr/share/nginx/html
   ```

3. **Check API connection**:
   - Open browser console
   - Check for CORS errors
   - Verify backend is running

### Port already in use

If ports 80 or 8000 are already in use:

1. **Stop conflicting services**, or
2. **Change ports in docker-compose.yml**:
   ```yaml
   ports:
     - "8080:8000"  # Backend on 8080
     - "3000:80"    # Frontend on 3000
   ```

### Database locked error

SQLite can have locking issues. Solutions:

1. **Stop all containers**:
   ```bash
   docker-compose down
   ```

2. **Check for stale processes**:
   ```bash
   lsof backend/medical.db
   ```

3. **Restart**:
   ```bash
   docker-compose up -d
   ```

## 🔒 Production Considerations

### Security

1. **Update CORS origins** in `backend/app/main.py`:
   ```python
   allow_origins=[
       "https://your-production-domain.com",
   ]
   ```

2. **Use environment variables** for all secrets
3. **Enable HTTPS** (use reverse proxy like Traefik/Nginx)
4. **Set resource limits** in docker-compose.yml:
   ```yaml
   deploy:
     resources:
       limits:
         cpus: '2'
         memory: 4G
   ```

### Performance

1. **Use production database** (PostgreSQL/MySQL instead of SQLite)
2. **Enable caching** (Redis)
3. **Use CDN** for frontend static assets
4. **Scale services**:
   ```bash
   docker-compose up --scale backend=3
   ```

### Monitoring

Add monitoring services to docker-compose.yml:
- Prometheus for metrics
- Grafana for dashboards
- ELK stack for logs

## 📤 Deployment

### Option 1: CI/CD Pipeline (Recommended)

**No local builds needed!** Use GitHub Actions to build images automatically.

See `CI_CD_SETUP.md` for complete instructions.

**Quick setup:**
1. Configure GitHub Secrets (DOCKER_HUB_USERNAME, DOCKER_HUB_TOKEN)
2. Push code to GitHub
3. Images automatically built and pushed to Docker Hub
4. Pull on server: `docker-compose -f docker-compose.prod.yml pull`

### Option 2: Manual Build and Push

```bash
# Tag images
docker tag doctor-assistant-backend:latest your-registry/doctor-assistant-backend:latest
docker tag doctor-assistant-frontend:latest your-registry/doctor-assistant-frontend:latest

# Push to registry
docker push your-registry/doctor-assistant-backend:latest
docker push your-registry/doctor-assistant-frontend:latest
```

### Deploy to Cloud

**Railway/Render/Fly.io:**
- Connect GitHub repository
- Set environment variables
- Deploy automatically

**AWS/GCP/Azure:**
- Push images to container registry
- Deploy using ECS/Cloud Run/Container Apps
- Configure load balancer and domain

## 📝 Development Workflow

### Local Development with Docker

1. **Make code changes** in your editor
2. **Rebuild affected service**:
   ```bash
   docker-compose build backend
   docker-compose up -d backend
   ```

3. **View logs**:
   ```bash
   docker-compose logs -f backend
   ```

### Hot Reload (Development)

For development, mount source code as volumes:

```yaml
volumes:
  - ./backend:/app
  - ./frontend:/app
```

Then use development servers instead of production builds.

## ✅ Verification Checklist

After setup, verify:

- [ ] Backend health check: `curl http://localhost:8000/health`
- [ ] Frontend loads: http://localhost
- [ ] API docs accessible: http://localhost:8000/docs
- [ ] Database persists after restart
- [ ] Reports directory exists and writable
- [ ] ML models load correctly
- [ ] CORS works (frontend can call backend)

## 🆘 Support

If you encounter issues:

1. Check logs: `docker-compose logs`
2. Verify environment: `docker-compose config`
3. Test health endpoints
4. Check Docker resources (CPU/Memory)
5. Review this guide's troubleshooting section

---

**Happy Dockerizing! 🐳**

