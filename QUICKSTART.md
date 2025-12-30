# Quick Start Guide

This guide will help you get your development environment up and running in minutes.

## Prerequisites Checklist

Before starting, make sure you have:

- [ ] Git installed
- [ ] Docker Desktop installed and running
- [ ] Python 3.11+ installed
- [ ] Node.js 18+ installed
- [ ] GitHub account with SSH key configured

## Quick Start (5 minutes)

### 1. Clone the Repository

```powershell
# Clone your private repo
git clone git@github.com:yourusername/AdamAurelioDotCom.git
cd AdamAurelioDotCom
```

### 2. Create Environment File

```powershell
# Copy the example file
Copy-Item .env.dev.example .env.dev

# Edit .env.dev with your preferred text editor
# The defaults will work for local development
```

### 3. Run Setup Script

```powershell
# Run the PowerShell setup script
.\scripts\setup-dev.ps1
```

### 4. Access Your Application

Open your browser and navigate to:

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **Admin Panel**: http://localhost:8000/admin
  - Username: `admin`
  - Password: `admin123`

## What the Setup Script Does

The setup script automatically:

1. ✅ Checks if all prerequisites are installed
2. ✅ Creates environment configuration
3. ✅ Builds and starts Docker containers
4. ✅ Creates PostgreSQL database
5. ✅ Runs database migrations
6. ✅ Creates admin superuser
7. ✅ Loads sample data
8. ✅ Installs frontend dependencies

## Common Commands

### Start the Development Environment

```powershell
docker-compose -f docker-compose.dev.yml up
```

### Stop the Development Environment

```powershell
docker-compose -f docker-compose.dev.yml down
```

### View Logs

```powershell
# All services
docker-compose -f docker-compose.dev.yml logs -f

# Specific service
docker-compose -f docker-compose.dev.yml logs -f backend
docker-compose -f docker-compose.dev.yml logs -f frontend
```

### Run Django Commands

```powershell
# Make migrations
docker-compose -f docker-compose.dev.yml exec backend python manage.py makemigrations

# Run migrations
docker-compose -f docker-compose.dev.yml exec backend python manage.py migrate

# Create superuser
docker-compose -f docker-compose.dev.yml exec backend python manage.py createsuperuser

# Django shell
docker-compose -f docker-compose.dev.yml exec backend python manage.py shell
```

### Run Frontend Commands

```powershell
# Install new package
cd frontend
npm install package-name
cd ..

# Run tests
cd frontend
npm test
cd ..
```

### Database Operations

```powershell
# Access PostgreSQL
docker-compose -f docker-compose.dev.yml exec db psql -U postgres -d adamaurelio_dev

# Backup database
docker-compose -f docker-compose.dev.yml exec db pg_dump -U postgres adamaurelio_dev > backup.sql

# Restore database
cat backup.sql | docker-compose -f docker-compose.dev.yml exec -T db psql -U postgres -d adamaurelio_dev
```

## Project Structure

```
AdamAurelioDotCom/
├── backend/                  # Django backend
│   ├── apps/                # Django applications
│   │   ├── core/           # Core functionality
│   │   ├── blog/           # Blog application
│   │   └── resume/         # Resume/Portfolio
│   ├── config/             # Django settings
│   │   └── settings/       # Environment-specific settings
│   ├── manage.py           # Django management script
│   ├── requirements.txt    # Python dependencies
│   └── Dockerfile         # Production Dockerfile
├── frontend/                # React frontend
│   ├── public/             # Static files
│   ├── src/                # React source code
│   ├── package.json        # Node dependencies
│   └── Dockerfile         # Production Dockerfile
├── scripts/                # Setup and utility scripts
├── nginx/                  # Nginx configuration
├── .github/workflows/      # CI/CD pipelines
├── docker-compose.dev.yml  # Development compose file
├── docker-compose.qa.yml   # QA compose file
├── docker-compose.prod.yml # Production compose file
└── SETUP_GUIDE.md         # Complete setup guide
```

## Development Workflow

### 1. Create a Feature Branch

```powershell
git checkout -b feature/your-feature-name
```

### 2. Make Changes

Edit your code in the `backend/` or `frontend/` directories. Changes will hot-reload automatically.

### 3. Test Your Changes

```powershell
# Backend tests
docker-compose -f docker-compose.dev.yml exec backend python manage.py test

# Frontend tests
cd frontend
npm test
cd ..
```

### 4. Commit and Push

```powershell
git add .
git commit -m "Your descriptive commit message"
git push origin feature/your-feature-name
```

### 5. Create Pull Request

Go to GitHub and create a Pull Request to the `qa` branch.

## Next Steps

1. ✅ Complete local development setup
2. ✅ Create your first feature branch
3. ✅ Make changes to the codebase
4. ✅ Test locally
5. ✅ Push to QA for testing
6. ✅ Deploy to production

For more detailed information, see:

- [SETUP_GUIDE.md](SETUP_GUIDE.md) - Complete setup and deployment guide
- [AWS_LIGHTSAIL_SETUP.md](docs/AWS_LIGHTSAIL_SETUP.md) - AWS Lightsail configuration
- [CLOUDFLARE_SETUP.md](docs/CLOUDFLARE_SETUP.md) - Cloudflare DNS and CDN setup
- [SYNOLOGY_SETUP.md](docs/SYNOLOGY_SETUP.md) - Synology NAS QA environment setup

## Troubleshooting

### Docker Issues

**Problem**: Docker containers won't start
```powershell
# Clean up and restart
docker-compose -f docker-compose.dev.yml down -v
docker-compose -f docker-compose.dev.yml up --build
```

**Problem**: Port already in use
```powershell
# Find process on port 3000
netstat -ano | findstr :3000
# Kill the process (replace PID)
taskkill /PID <PID> /F
```

### Database Issues

**Problem**: Database migrations fail
```powershell
# Reset database
docker-compose -f docker-compose.dev.yml down -v
docker-compose -f docker-compose.dev.yml up -d db
# Wait 10 seconds
docker-compose -f docker-compose.dev.yml exec backend python manage.py migrate
```

### Frontend Issues

**Problem**: React app won't start
```powershell
# Clear node_modules and reinstall
cd frontend
Remove-Item -Recurse -Force node_modules
npm install
cd ..
```

## Getting Help

If you encounter issues:

1. Check the [Troubleshooting](#troubleshooting) section
2. Review logs: `docker-compose -f docker-compose.dev.yml logs -f`
3. Restart containers: `docker-compose -f docker-compose.dev.yml restart`
4. Clean rebuild: `docker-compose -f docker-compose.dev.yml up --build`

Happy coding! 🚀
