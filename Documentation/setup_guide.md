# Complete Setup Guide - AdamAurelio.com

## Overview

This guide will walk you through setting up a complete DevOps pipeline with three environments:

- **Development** (Local): For local development and testing
- **QA** (Synology NAS): For testing before production
- **Production** (AWS Lightsail): Live production environment

## Tech Stack

- **Frontend**: React 19 with Tailwind CSS 3+
- **Backend**: Django 4.2 (Python)
- **Database**: PostgreSQL 15
- **Styling**: Tailwind CSS, PostCSS, Autoprefixer
- **Containerization**: Docker & Docker Compose
- **CI/CD**: GitHub Actions
- **Cloud Provider**: AWS Lightsail
- **DNS/CDN**: Cloudflare
- **HTTPS**: Let's Encrypt (via Certbot)

## Frontend Architecture

The React frontend uses modern best practices:

- **Tailwind CSS**: Utility-first CSS framework for rapid development
- **Component Structure**: Reusable components with proper separation
- **Pages**: Home, About, Resume, Services, Contact, Admin
- **Responsive Design**: Mobile-first with md: and lg: breakpoints
- **Production Ready**: Optimized builds with CSS purging

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Initial Setup](#initial-setup)
3. [Development Environment Setup](#development-environment-setup)
4. [QA Environment Setup (Synology NAS)](#qa-environment-setup)
5. [Production Environment Setup (AWS Lightsail)](#production-environment-setup)
6. [Cloudflare Configuration](#cloudflare-configuration)
7. [CI/CD Pipeline](#cicd-pipeline)
8. [Troubleshooting](#troubleshooting)

---

## Prerequisites

### Required Software

- [ ] Git installed
- [ ] Docker Desktop installed (for Windows)
- [ ] Python 3.11+ installed
- [ ] Node.js 18+ and npm installed
- [ ] GitHub account with private repository access
- [ ] AWS account (for production)
- [ ] Cloudflare account (free plan works)
- [ ] SSH key for GitHub configured

### Required Accounts & Access

- [ ] GitHub Personal Access Token (for private repos)
- [ ] AWS Lightsail account credentials
- [ ] Cloudflare API token
- [ ] Synology NAS admin access
- [ ] Domain name registered (point to Cloudflare)

---

## Initial Setup

### 1. Clone the Repository

```bash
# Clone your private repository
git clone git@github.com:yourusername/AdamAurelioDotCom.git
cd AdamAurelioDotCom
```

### 2. Create Environment Files

The project uses different environment files for each environment:

#### Development (.env.dev)

```bash
# Copy the template
cp .env.dev.example .env.dev

# Edit with your local settings
```

#### QA (.env.qa)

```bash
# Copy the template
cp .env.qa.example .env.qa

# Edit with your Synology settings
```

#### Production (.env.prod)

```bash
# Copy the template
cp .env.prod.example .env.prod

# Edit with your AWS settings
```

---

## Development Environment Setup

### Step 1: Install Dependencies

```bash
# Navigate to project root
cd AdamAurelioDotCom

# Run the development setup script
./scripts/setup-dev.sh
```

This script will:

- Install Python dependencies
- Install Node.js dependencies
- Set up pre-commit hooks
- Create a local PostgreSQL database
- Run initial migrations
- Seed the database with test data

### Step 2: Start Development Environment

```bash
# Start all services with Docker Compose
docker-compose -f docker-compose.dev.yml up

# Or run the convenience script
./scripts/dev-start.sh
```

### Step 3: Access Development Environment

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **Django Admin**: http://localhost:8000/admin
- **PostgreSQL**: localhost:5432

### Step 4: Development Workflow

```bash
# Create a new feature branch
git checkout -b feature/your-feature-name

# Make your changes...

# Run tests
./scripts/run-tests.sh

# Commit and push
git add .
git commit -m "Your commit message"
git push origin feature/your-feature-name

# Create Pull Request on GitHub
```

---

## QA Environment Setup (Synology NAS)

### Step 1: Prepare Synology NAS

1. **Enable SSH on Synology**:
   - Control Panel → Terminal & SNMP → Enable SSH service

2. **Install Docker on Synology**:
   - Package Center → Search for "Docker" → Install

3. **Create Project Directory**:
   ```bash
   ssh admin@your-synology-ip
   sudo mkdir -p /volume1/docker/adamaurelio-qa
   cd /volume1/docker/adamaurelio-qa
   ```

### Step 2: Configure GitHub Actions for QA

The GitHub Actions workflow will automatically deploy to QA when you push to the `qa` branch.

**Required GitHub Secrets** (Settings → Secrets → Actions):

- `SYNOLOGY_HOST`: Your Synology IP or hostname
- `SYNOLOGY_USER`: SSH username (usually admin)
- `SYNOLOGY_SSH_KEY`: Private SSH key for authentication
- `QA_ENV_FILE`: Contents of your .env.qa file

### Step 3: Deploy to QA

```bash
# Merge your feature to qa branch
git checkout qa
git merge feature/your-feature-name
git push origin qa

# GitHub Actions will automatically deploy to Synology
```

### Step 4: Access QA Environment

- **Frontend**: http://your-synology-ip:3001
- **Backend API**: http://your-synology-ip:8001
- **Django Admin**: http://your-synology-ip:8001/admin

---

## Production Environment Setup (AWS Lightsail)

### Step 1: Create AWS Lightsail Instance

1. **Log in to AWS Lightsail Console**:
   - https://lightsail.aws.amazon.com/

2. **Create Instance**:
   - Click "Create instance"
   - Platform: Linux/Unix
   - Blueprint: OS Only → Ubuntu 22.04 LTS
   - Plan: Select based on your needs (recommend $10-20/month plan)
   - Name: adamaurelio-prod
   - Click "Create instance"

3. **Configure Networking**:
   - Go to Networking tab
   - Create static IP and attach to instance
   - Add firewall rules:
     - Application: HTTP (port 80)
     - Application: HTTPS (port 443)
     - Custom: PostgreSQL (port 5432) - **ONLY if needed, restrict to your IP**

### Step 2: Configure Lightsail Instance

```bash
# SSH into your Lightsail instance
ssh -i /path/to/your-key.pem ubuntu@your-static-ip

# Update system
sudo apt update && sudo apt upgrade -y

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker ubuntu

# Install Docker Compose
sudo apt install docker-compose-plugin -y

# Create project directory
sudo mkdir -p /opt/adamaurelio
sudo chown ubuntu:ubuntu /opt/adamaurelio
cd /opt/adamaurelio

# Install Nginx (reverse proxy)
sudo apt install nginx -y

# Install Certbot (for HTTPS)
sudo apt install certbot python3-certbot-nginx -y
```

### Step 3: Configure GitHub Actions for Production

**Additional GitHub Secrets for Production**:

- `AWS_HOST`: Your Lightsail static IP
- `AWS_USER`: ubuntu
- `AWS_SSH_KEY`: Private SSH key for Lightsail instance
- `PROD_ENV_FILE`: Contents of your .env.prod file

### Step 4: Deploy to Production

```bash
# Merge to main branch
git checkout main
git merge qa
git push origin main

# GitHub Actions will automatically deploy to AWS Lightsail
```

### Step 5: Configure Nginx Reverse Proxy

SSH into your Lightsail instance and create Nginx configuration:

```bash
sudo nano /etc/nginx/sites-available/adamaurelio.com
```

Add the configuration (see nginx.conf.example in docs/)

```bash
# Enable the site
sudo ln -s /etc/nginx/sites-available/adamaurelio.com /etc/nginx/sites-enabled/

# Test configuration
sudo nginx -t

# Reload Nginx
sudo systemctl reload nginx
```

### Step 6: Set Up HTTPS with Let's Encrypt

```bash
# Run Certbot
sudo certbot --nginx -d adamaurelio.com -d www.adamaurelio.com

# Follow prompts and choose to redirect HTTP to HTTPS

# Test auto-renewal
sudo certbot renew --dry-run
```

---

## Cloudflare Configuration

### Step 1: Add Domain to Cloudflare

1. Log in to Cloudflare Dashboard
2. Click "Add a Site"
3. Enter your domain (e.g., adamaurelio.com)
4. Select Free plan
5. Update nameservers at your domain registrar

### Step 2: Configure DNS Records

Add the following DNS records in Cloudflare:

| Type  | Name | Content           | Proxy Status |
| ----- | ---- | ----------------- | ------------ |
| A     | @    | Your-Lightsail-IP | Proxied ✓    |
| A     | www  | Your-Lightsail-IP | Proxied ✓    |
| CNAME | blog | adamaurelio.com   | Proxied ✓    |
| CNAME | api  | adamaurelio.com   | Proxied ✓    |

### Step 3: Configure SSL/TLS Settings

1. Go to SSL/TLS → Overview
2. Set encryption mode to "Full (strict)"
3. Go to SSL/TLS → Edge Certificates
4. Enable:
   - Always Use HTTPS
   - HTTP Strict Transport Security (HSTS)
   - Minimum TLS Version: 1.2

### Step 4: Configure Page Rules (Optional)

Create page rules for subdomains:

- `api.adamaurelio.com/*` → Disable Cache
- `blog.adamaurelio.com/*` → Cache Level: Standard

---

## CI/CD Pipeline

### GitHub Actions Workflow

The project includes three automated workflows:

1. **Development** (`.github/workflows/dev.yml`)
   - Runs on: Pull requests to `main` or `qa`
   - Actions: Linting, testing, build verification

2. **QA Deployment** (`.github/workflows/deploy-qa.yml`)
   - Runs on: Push to `qa` branch
   - Actions: Build, test, deploy to Synology NAS

3. **Production Deployment** (`.github/workflows/deploy-prod.yml`)
   - Runs on: Push to `main` branch
   - Actions: Build, test, deploy to AWS Lightsail

### Branch Strategy

```
main (production)
  ↑
  qa (testing)
  ↑
  feature/* (development)
```

### Deployment Flow

1. Create feature branch from `qa`
2. Develop and test locally
3. Push feature branch and create PR to `qa`
4. Merge to `qa` → Auto-deploys to Synology NAS
5. Test on QA environment
6. Create PR from `qa` to `main`
7. Merge to `main` → Auto-deploys to AWS Lightsail

---

## Troubleshooting

### Development Issues

**Database connection fails:**

```bash
# Reset the database
docker-compose -f docker-compose.dev.yml down -v
docker-compose -f docker-compose.dev.yml up -d db
./scripts/setup-db.sh
```

**Port already in use:**

```bash
# Find process using the port
netstat -ano | findstr :3000
# Kill the process (replace PID)
taskkill /PID <PID> /F
```

### QA Deployment Issues

**SSH connection fails:**

- Verify Synology SSH is enabled
- Check SSH key is added to GitHub Secrets
- Verify firewall rules allow SSH

**Docker container won't start:**

```bash
# SSH into Synology and check logs
ssh admin@synology-ip
cd /volume1/docker/adamaurelio-qa
docker-compose logs
```

### Production Issues

**Nginx returns 502 Bad Gateway:**

```bash
# Check if Docker containers are running
docker ps

# Check Nginx error logs
sudo tail -f /var/log/nginx/error.log

# Restart containers
cd /opt/adamaurelio
docker-compose restart
```

**HTTPS certificate issues:**

```bash
# Check certificate status
sudo certbot certificates

# Renew certificate
sudo certbot renew

# Reload Nginx
sudo systemctl reload nginx
```

### Database Migration Issues

```bash
# Development
docker-compose -f docker-compose.dev.yml exec backend python manage.py migrate

# QA (on Synology)
docker-compose exec backend python manage.py migrate

# Production (on Lightsail)
cd /opt/adamaurelio
docker-compose exec backend python manage.py migrate
```

---

## Next Steps

1. ✅ Complete initial setup
2. ✅ Configure all environment files
3. ✅ Test local development environment
4. ✅ Deploy to QA and verify
5. ✅ Deploy to Production
6. ✅ Configure Cloudflare DNS
7. ✅ Set up HTTPS certificates
8. ✅ Test complete deployment pipeline

For additional help, see:

- [Django Documentation](https://docs.djangoproject.com/)
- [React Documentation](https://react.dev/)
- [Docker Documentation](https://docs.docker.com/)
- [AWS Lightsail Documentation](https://aws.amazon.com/lightsail/documentation/)
- [Cloudflare Documentation](https://developers.cloudflare.com/)
