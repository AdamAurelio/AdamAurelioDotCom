# Synology NAS QA Environment Setup

Complete guide for setting up your QA environment on Synology NAS.

## Prerequisites

- [ ] Synology NAS with DSM 7.0+
- [ ] Docker package installed on Synology
- [ ] SSH access enabled
- [ ] GitHub repository access
- [ ] At least 20GB free space

## Step 1: Prepare Synology NAS

### 1.1 Enable SSH

1. Open **Control Panel** → **Terminal & SNMP**
2. Enable **SSH service**
3. Set port to **22** (or custom port)
4. Click **Apply**

### 1.2 Install Docker

1. Open **Package Center**
2. Search for **"Docker"**
3. Click **Install**
4. Wait for installation to complete

### 1.3 Create Shared Folder

1. Open **Control Panel** → **Shared Folder**
2. Click **Create** → **Create shared folder**
3. Name: `docker`
4. Location: Choose volume with enough space
5. Click **OK**

### 1.4 Create User for Deployment

1. Open **Control Panel** → **User & Group**
2. Click **Create** → **Create user**
3. Name: `deploy`
4. Set a strong password
5. Grant permissions:
   - Read/Write to `docker` folder
   - Administrator privileges

## Step 2: SSH Configuration

### 2.1 Connect via SSH

```powershell
# From Windows PowerShell
ssh admin@your-synology-ip

# Or use PuTTY with:
# Host: your-synology-ip
# Port: 22
# Username: admin
```

### 2.2 Create SSH Key for GitHub Actions

On your **local machine** (not Synology):

```powershell
# Generate SSH key pair
ssh-keygen -t ed25519 -C "github-actions-qa" -f synology-qa-key

# This creates:
# - synology-qa-key (private key - add to GitHub Secrets)
# - synology-qa-key.pub (public key - add to Synology)
```

### 2.3 Add Public Key to Synology

```powershell
# Copy public key content
Get-Content synology-qa-key.pub

# SSH to Synology
ssh admin@your-synology-ip

# Add public key
mkdir -p ~/.ssh
chmod 700 ~/.ssh
nano ~/.ssh/authorized_keys
# Paste the public key
chmod 600 ~/.ssh/authorized_keys
```

### 2.4 Test SSH Key Authentication

```powershell
# From local machine
ssh -i synology-qa-key admin@your-synology-ip
```

## Step 3: Set Up Project Directory

### 3.1 Create Project Structure

```bash
# SSH into Synology as admin
ssh admin@your-synology-ip

# Create directory structure
sudo mkdir -p /volume1/docker/adamaurelio-qa
sudo chown -R deploy:users /volume1/docker/adamaurelio-qa
cd /volume1/docker/adamaurelio-qa

# Create subdirectories
mkdir -p logs backups
```

### 3.2 Set Permissions

```bash
# Set proper permissions
sudo chown -R deploy:users /volume1/docker/adamaurelio-qa
sudo chmod -R 755 /volume1/docker/adamaurelio-qa
```

## Step 4: Configure Docker

### 4.1 Add User to Docker Group

```bash
# Add deploy user to docker group
sudo synogroup --add docker deploy
sudo synogroup --member docker deploy

# Verify
groups deploy
```

### 4.2 Configure Docker Daemon (Optional)

```bash
# Edit Docker daemon config
sudo nano /var/packages/Docker/etc/dockerd.json

# Add these settings:
{
  "log-driver": "json-file",
  "log-opts": {
    "max-size": "10m",
    "max-file": "3"
  }
}

# Restart Docker
sudo synoservicectl --restart pkgctl-Docker
```

## Step 5: Configure GitHub Actions

### 5.1 Add Secrets to GitHub

Go to your repository → **Settings** → **Secrets and variables** → **Actions**

Add these secrets:

| Secret Name        | Value                                 |
| ------------------ | ------------------------------------- |
| `SYNOLOGY_HOST`    | Your Synology IP or hostname          |
| `SYNOLOGY_USER`    | `deploy`                              |
| `SYNOLOGY_SSH_KEY` | Private key content (synology-qa-key) |
| `QA_ENV_FILE`      | Complete `.env.qa` file contents      |

### 5.2 Configure GitHub Container Registry Access

On Synology:

```bash
# Log into GitHub Container Registry
echo "YOUR_GITHUB_TOKEN" | docker login ghcr.io -u YOUR_GITHUB_USERNAME --password-stdin

# Verify login
docker pull hello-world
```

## Step 6: Initial Deployment

### 6.1 Clone Repository

```bash
cd /volume1/docker/adamaurelio-qa

# Clone repository
git clone https://github.com/yourusername/AdamAurelioDotCom.git .

# Or if using deploy user with SSH key
sudo -u deploy git clone git@github.com:yourusername/AdamAurelioDotCom.git .
```

### 6.2 Create Environment File

```bash
# Create .env.qa
nano .env.qa

# Paste your QA environment variables
# See .env.qa.example for reference
```

### 6.3 Pull Docker Images

```bash
# Pull images
docker compose -f docker-compose.qa.yml pull
```

### 6.4 Start Services

```bash
# Start all services
docker compose -f docker-compose.qa.yml up -d

# Check status
docker compose -f docker-compose.qa.yml ps

# View logs
docker compose -f docker-compose.qa.yml logs -f
```

### 6.5 Run Initial Setup

```bash
# Run migrations
docker compose -f docker-compose.qa.yml exec backend python manage.py migrate

# Create superuser
docker compose -f docker-compose.qa.yml exec backend python manage.py createsuperuser

# Collect static files
docker compose -f docker-compose.qa.yml exec backend python manage.py collectstatic --noinput
```

## Step 7: Configure Networking

### 7.1 Configure Firewall (if enabled)

1. Open **Control Panel** → **Security** → **Firewall**
2. Select your network interface
3. Click **Edit Rules**
4. Add rules:
   - Allow port **3001** (Frontend)
   - Allow port **8001** (Backend)
   - Allow port **5433** (PostgreSQL - optional, only if needed)

### 7.2 Configure Reverse Proxy (Optional)

If you want to use proper hostnames:

1. Open **Control Panel** → **Login Portal** → **Advanced**
2. Click **Reverse Proxy**
3. Click **Create**

**Frontend:**

- Source:
  - Protocol: HTTP
  - Hostname: qa.adamaurelio.local
  - Port: 80
- Destination:
  - Protocol: HTTP
  - Hostname: localhost
  - Port: 3001

**Backend:**

- Source:
  - Protocol: HTTP
  - Hostname: api-qa.adamaurelio.local
  - Port: 80
- Destination:
  - Protocol: HTTP
  - Hostname: localhost
  - Port: 8001

## Step 8: Testing and Verification

### 8.1 Test Frontend

Open browser and go to:

```
http://your-synology-ip:3001
```

### 8.2 Test Backend

```bash
curl http://your-synology-ip:8001/health/
curl http://your-synology-ip:8001/api/
```

### 8.3 Test Admin Panel

```
http://your-synology-ip:8001/admin/
```

## Step 9: Set Up Automated Backups

### 9.1 Create Backup Script

```bash
# Create backup script
nano /volume1/docker/adamaurelio-qa/scripts/backup-qa.sh
```

```bash
#!/bin/bash
BACKUP_DIR="/volume1/docker/adamaurelio-qa/backups"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)

# Create backup directory if it doesn't exist
mkdir -p $BACKUP_DIR

# Backup database
docker compose -f /volume1/docker/adamaurelio-qa/docker-compose.qa.yml exec -T db \
    pg_dump -U postgres adamaurelio_qa > $BACKUP_DIR/qa_backup_$TIMESTAMP.sql

# Compress backup
gzip $BACKUP_DIR/qa_backup_$TIMESTAMP.sql

# Keep only last 14 days of backups
find $BACKUP_DIR -name "qa_backup_*.sql.gz" -mtime +14 -delete

echo "Backup completed: qa_backup_$TIMESTAMP.sql.gz"
```

### 9.2 Make Script Executable

```bash
chmod +x /volume1/docker/adamaurelio-qa/scripts/backup-qa.sh
```

### 9.3 Schedule Backup Task

1. Open **Control Panel** → **Task Scheduler**
2. Click **Create** → **Scheduled Task** → **User-defined script**
3. General:
   - Task: `QA Database Backup`
   - User: `deploy`
4. Schedule:
   - Run on: Daily
   - Time: 2:00 AM
5. Task Settings:
   - User-defined script:
     ```bash
     /volume1/docker/adamaurelio-qa/scripts/backup-qa.sh
     ```
6. Click **OK**

## Step 10: Monitoring and Maintenance

### 10.1 Monitor Container Status

```bash
# Check running containers
docker ps

# Check container stats
docker stats

# View logs
docker compose -f docker-compose.qa.yml logs -f backend
```

### 10.2 View Application Logs

```bash
# Backend logs
docker compose -f docker-compose.qa.yml logs -f backend

# Database logs
docker compose -f docker-compose.qa.yml logs -f db

# All services
docker compose -f docker-compose.qa.yml logs -f
```

### 10.3 Set Up Log Rotation

Synology Docker automatically handles log rotation, but you can configure it:

1. Open **Docker** app
2. Go to **Container** tab
3. Select your container
4. Click **Edit** → **Advanced Settings**
5. Configure logging

## Step 11: Troubleshooting

### Problem: Containers Won't Start

```bash
# Check Docker status
sudo synoservicectl --status pkgctl-Docker

# Restart Docker
sudo synoservicectl --restart pkgctl-Docker

# Check container logs
docker compose -f docker-compose.qa.yml logs
```

### Problem: Permission Denied

```bash
# Fix permissions
sudo chown -R deploy:users /volume1/docker/adamaurelio-qa
sudo chmod -R 755 /volume1/docker/adamaurelio-qa
```

### Problem: Out of Disk Space

```bash
# Check disk usage
df -h

# Clean up Docker
docker system prune -a
docker volume prune

# Remove old images
docker image prune -a
```

### Problem: Database Connection Issues

```bash
# Check database container
docker compose -f docker-compose.qa.yml ps db

# Check database logs
docker compose -f docker-compose.qa.yml logs db

# Restart database
docker compose -f docker-compose.qa.yml restart db
```

### Problem: GitHub Actions Deployment Fails

1. Check SSH key is correct in GitHub Secrets
2. Verify `deploy` user has permissions
3. Check Synology is reachable from internet (if deploying from GitHub)
4. Review GitHub Actions logs

## Maintenance Commands

### Update Application

```bash
cd /volume1/docker/adamaurelio-qa

# Pull latest code
git pull origin qa

# Pull latest images
docker compose -f docker-compose.qa.yml pull

# Restart services
docker compose -f docker-compose.qa.yml up -d

# Run migrations if needed
docker compose -f docker-compose.qa.yml exec backend python manage.py migrate
```

### View Resource Usage

```bash
# Container stats
docker stats

# Disk usage
docker system df

# Synology resource monitor
# Open Resource Monitor app in DSM
```

### Clean Up

```bash
# Stop all containers
docker compose -f docker-compose.qa.yml down

# Remove volumes (WARNING: deletes data)
docker compose -f docker-compose.qa.yml down -v

# Clean up unused Docker resources
docker system prune -a --volumes
```

## Security Best Practices

1. ✅ Use SSH keys instead of passwords
2. ✅ Keep DSM and Docker updated
3. ✅ Use strong passwords
4. ✅ Enable firewall
5. ✅ Regular backups
6. ✅ Monitor logs for suspicious activity
7. ✅ Limit SSH access to specific IPs if possible

## Performance Optimization

### 1. Enable SSD Cache (if available)

1. Open **Storage Manager**
2. Go to **SSD Cache**
3. Create cache for Docker volume

### 2. Allocate More Resources

1. Open **Docker** app
2. Go to **Settings**
3. Adjust CPU and memory limits

### 3. Use Docker Volumes

Already configured in docker-compose.qa.yml for better performance.

## Cost Summary

- **Synology NAS**: One-time hardware cost ($300-$1000+)
- **No ongoing hosting fees**
- **Power consumption**: ~10-30W (approx $2-5/month)
- **Total ongoing cost**: ~$2-5/month

## Next Steps

1. ✅ Complete Synology setup
2. ✅ Test deployment from GitHub Actions
3. ✅ Configure automated backups
4. ✅ Set up monitoring
5. ✅ Test QA environment thoroughly
6. ✅ Document QA testing procedures

Your QA environment on Synology NAS is ready! 🏠
