# AWS Lightsail Production Setup

Complete guide for setting up AWS Lightsail as your production environment.

## Prerequisites

- [ ] AWS Account
- [ ] Domain name (e.g., adamaurelio.com)
- [ ] Cloudflare account (for DNS)
- [ ] GitHub repository with your code

## Step 1: Create Lightsail Instance

### 1.1 Log into AWS Lightsail

Navigate to https://lightsail.aws.amazon.com/

### 1.2 Create Instance

1. Click **"Create instance"**
2. **Instance location**: Choose closest to your users (e.g., US East - Ohio)
3. **Pick your instance image**:
   - Platform: **Linux/Unix**
   - Blueprint: **OS Only** → **Ubuntu 22.04 LTS**

4. **Choose your instance plan**:
   - Recommended: **$10/month** (2 GB RAM, 1 vCPU, 60 GB SSD, 3 TB transfer)
   - Or **$20/month** for more resources

5. **Name your instance**: `adamaurelio-prod`

6. Click **"Create instance"**

### 1.3 Wait for Instance to Start

Wait 1-2 minutes for the instance to be in "Running" state.

## Step 2: Configure Networking

### 2.1 Create Static IP

1. Go to **Networking** tab in your instance
2. Click **"Create static IP"**
3. Name it: `adamaurelio-static-ip`
4. Click **"Create"**

### 2.2 Configure Firewall

1. Go to **Networking** tab
2. Under **IPv4 Firewall**, add these rules:

| Application | Protocol | Port | Allow from |
|-------------|----------|------|------------|
| SSH | TCP | 22 | Your IP only |
| HTTP | TCP | 80 | Anywhere |
| HTTPS | TCP | 443 | Anywhere |

3. **Delete the default rule** that allows SSH from anywhere

## Step 3: Connect and Configure Server

### 3.1 Download SSH Key

1. Go to **Account** page
2. Click **SSH keys** tab
3. Download the default SSH key for your region
4. Save it as `lightsail-key.pem` in a secure location

### 3.2 SSH into Your Instance

```powershell
# Windows PowerShell
ssh -i C:\path\to\lightsail-key.pem ubuntu@YOUR-STATIC-IP

# Or use the browser-based SSH (click "Connect using SSH" button)
```

### 3.3 Update System

```bash
sudo apt update && sudo apt upgrade -y
```

### 3.4 Install Docker

```bash
# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Add ubuntu user to docker group
sudo usermod -aG docker ubuntu

# Install Docker Compose plugin
sudo apt install docker-compose-plugin -y

# Verify installation
docker --version
docker compose version

# Log out and back in for group changes to take effect
exit
```

### 3.5 Install Nginx

```bash
sudo apt install nginx -y
sudo systemctl enable nginx
sudo systemctl start nginx
```

### 3.6 Install Certbot (for SSL)

```bash
sudo apt install certbot python3-certbot-nginx -y
```

## Step 4: Set Up Project Directory

### 4.1 Create Project Directory

```bash
sudo mkdir -p /opt/adamaurelio
sudo chown ubuntu:ubuntu /opt/adamaurelio
cd /opt/adamaurelio
```

### 4.2 Create Subdirectories

```bash
mkdir -p backups nginx/conf.d logs
```

## Step 5: Configure GitHub Access

### 5.1 Generate SSH Key on Server

```bash
ssh-keygen -t ed25519 -C "your-email@example.com"
# Press Enter for default location
# Press Enter twice for no passphrase

# Display public key
cat ~/.ssh/id_ed25519.pub
```

### 5.2 Add SSH Key to GitHub

1. Copy the output from the command above
2. Go to GitHub → Settings → SSH and GPG keys
3. Click **"New SSH key"**
4. Paste the key and save

### 5.3 Test GitHub Connection

```bash
ssh -T git@github.com
# You should see: "Hi username! You've successfully authenticated..."
```

## Step 6: Configure Nginx

### 6.1 Create Nginx Configuration

```bash
sudo nano /etc/nginx/sites-available/adamaurelio.com
```

Paste the following configuration:

```nginx
server {
    listen 80;
    listen [::]:80;
    server_name adamaurelio.com www.adamaurelio.com api.adamaurelio.com;
    
    location /.well-known/acme-challenge/ {
        root /var/www/certbot;
    }
    
    location / {
        return 301 https://$server_name$request_uri;
    }
}

server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name adamaurelio.com www.adamaurelio.com;

    ssl_certificate /etc/letsencrypt/live/adamaurelio.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/adamaurelio.com/privkey.pem;
    
    location / {
        proxy_pass http://localhost:80;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}

server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name api.adamaurelio.com;

    ssl_certificate /etc/letsencrypt/live/adamaurelio.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/adamaurelio.com/privkey.pem;
    
    location / {
        proxy_pass http://localhost:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

### 6.2 Enable Site

```bash
sudo ln -s /etc/nginx/sites-available/adamaurelio.com /etc/nginx/sites-enabled/
sudo rm /etc/nginx/sites-enabled/default
sudo nginx -t
```

## Step 7: Set Up SSL Certificates

### 7.1 Configure Cloudflare DNS (Do This First!)

Before running Certbot, make sure:
1. Your domain points to your Lightsail IP in Cloudflare
2. SSL/TLS mode in Cloudflare is set to **"Full (strict)"**
3. Proxy is **DISABLED** (orange cloud icon should be gray) temporarily

### 7.2 Run Certbot

```bash
sudo certbot --nginx -d adamaurelio.com -d www.adamaurelio.com -d api.adamaurelio.com

# Follow the prompts:
# - Enter your email
# - Agree to Terms of Service
# - Choose to redirect HTTP to HTTPS
```

### 7.3 Test Auto-Renewal

```bash
sudo certbot renew --dry-run
```

### 7.4 Re-enable Cloudflare Proxy

After certificates are issued, go back to Cloudflare and enable proxy (orange cloud).

## Step 8: Configure GitHub Actions Secrets

Go to your GitHub repository → Settings → Secrets and variables → Actions

Add these secrets:

| Secret Name | Value |
|-------------|-------|
| `AWS_HOST` | Your Lightsail static IP |
| `AWS_USER` | `ubuntu` |
| `AWS_SSH_KEY` | Contents of your lightsail-key.pem file |
| `PROD_ENV_FILE` | Contents of your .env.prod file |
| `PROD_DB_USER` | `postgres` |
| `PROD_DB_NAME` | `adamaurelio_prod` |

## Step 9: Initial Deployment

### 9.1 Clone Repository

```bash
cd /opt/adamaurelio
git clone git@github.com:yourusername/AdamAurelioDotCom.git .
```

### 9.2 Create Environment File

```bash
nano .env.prod
```

Paste your production configuration (see .env.prod.example).

### 9.3 Log into GitHub Container Registry

```bash
echo "YOUR_GITHUB_TOKEN" | docker login ghcr.io -u YOUR_GITHUB_USERNAME --password-stdin
```

### 9.4 Start Services

```bash
docker compose -f docker-compose.prod.yml up -d
```

### 9.5 Run Migrations

```bash
docker compose -f docker-compose.prod.yml exec backend python manage.py migrate
docker compose -f docker-compose.prod.yml exec backend python manage.py createsuperuser
docker compose -f docker-compose.prod.yml exec backend python manage.py collectstatic --noinput
```

## Step 10: Verify Deployment

### 10.1 Check Services

```bash
docker compose -f docker-compose.prod.yml ps
```

All services should be "Up" and "healthy".

### 10.2 Check Logs

```bash
docker compose -f docker-compose.prod.yml logs -f
```

### 10.3 Test Endpoints

```bash
curl https://adamaurelio.com
curl https://api.adamaurelio.com/health/
```

## Step 11: Set Up Monitoring (Optional but Recommended)

### 11.1 Create Lightsail Alarms

1. Go to your instance in Lightsail
2. Click **Metrics** tab
3. Create alarms for:
   - CPU utilization > 80%
   - Network out > 2 TB (approaching limit)
   - Disk usage > 80%

### 11.2 Set Up Log Monitoring

```bash
# View application logs
docker compose -f docker-compose.prod.yml logs -f backend

# View nginx logs
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

## Step 12: Set Up Automated Backups

### 12.1 Create Backup Script

```bash
nano /opt/adamaurelio/scripts/backup.sh
```

```bash
#!/bin/bash
BACKUP_DIR="/opt/adamaurelio/backups"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)

# Backup database
docker compose -f /opt/adamaurelio/docker-compose.prod.yml exec -T db \
    pg_dump -U postgres adamaurelio_prod > $BACKUP_DIR/db_backup_$TIMESTAMP.sql

# Keep only last 7 days of backups
find $BACKUP_DIR -name "db_backup_*.sql" -mtime +7 -delete
```

### 12.2 Make Script Executable

```bash
chmod +x /opt/adamaurelio/scripts/backup.sh
```

### 12.3 Add to Crontab

```bash
crontab -e

# Add this line (runs daily at 2 AM):
0 2 * * * /opt/adamaurelio/scripts/backup.sh
```

## Maintenance Commands

### View Logs

```bash
docker compose -f docker-compose.prod.yml logs -f
```

### Restart Services

```bash
docker compose -f docker-compose.prod.yml restart
```

### Update Application

```bash
cd /opt/adamaurelio
git pull origin main
docker compose -f docker-compose.prod.yml pull
docker compose -f docker-compose.prod.yml up -d
```

### Database Backup

```bash
docker compose -f docker-compose.prod.yml exec db \
    pg_dump -U postgres adamaurelio_prod > backup_$(date +%Y%m%d).sql
```

### Database Restore

```bash
cat backup_YYYYMMDD.sql | docker compose -f docker-compose.prod.yml exec -T db \
    psql -U postgres -d adamaurelio_prod
```

## Cost Optimization

### Current Costs
- Lightsail instance: $10-20/month
- Data transfer: Included (3 TB/month)
- Static IP: Free (when attached)
- **Total**: ~$10-20/month

### Tips to Reduce Costs
1. Use Cloudflare (free) for CDN and DDoS protection
2. Optimize images before uploading
3. Enable gzip compression
4. Use browser caching
5. Monitor data transfer usage

## Security Best Practices

1. ✅ Keep system updated: `sudo apt update && sudo apt upgrade`
2. ✅ Use strong passwords
3. ✅ Enable firewall (UFW)
4. ✅ Regular backups
5. ✅ Monitor logs for suspicious activity
6. ✅ Use SSH keys only (disable password auth)
7. ✅ Keep Docker images updated

## Next Steps

- [ ] Set up monitoring alerts
- [ ] Configure automated backups
- [ ] Set up CDN with Cloudflare
- [ ] Configure email service
- [ ] Set up error tracking (e.g., Sentry)
- [ ] Configure log aggregation

Your production environment is now live! 🚀
