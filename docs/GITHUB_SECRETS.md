# GitHub Secrets Configuration Guide

This guide explains how to configure all the necessary GitHub Secrets for your CI/CD pipeline.

## Overview

GitHub Secrets are used to securely store sensitive information like passwords, API tokens, and SSH keys that your GitHub Actions workflows need to deploy your application.

## Access GitHub Secrets

1. Go to your GitHub repository
2. Click **Settings** tab
3. Click **Secrets and variables** → **Actions**
4. Click **New repository secret**

## Required Secrets

### Development/Testing Secrets

These secrets are used for CI/CD testing:

| Secret Name       | Description                       | How to Generate |
| ----------------- | --------------------------------- | --------------- |
| _(None required)_ | Tests run in isolated environment | N/A             |

### QA Environment Secrets (Synology NAS)

| Secret Name        | Description                          | How to Generate                                |
| ------------------ | ------------------------------------ | ---------------------------------------------- |
| `SYNOLOGY_HOST`    | Your Synology IP address or hostname | Find in Synology DSM → Control Panel → Network |
| `SYNOLOGY_USER`    | SSH username (recommend `deploy`)    | Created in Synology user management            |
| `SYNOLOGY_SSH_KEY` | Private SSH key for authentication   | `ssh-keygen -t ed25519` (see below)            |
| `QA_ENV_FILE`      | Complete contents of `.env.qa` file  | Copy from your `.env.qa` file                  |

### Production Environment Secrets (AWS Lightsail)

| Secret Name     | Description                           | How to Generate                            |
| --------------- | ------------------------------------- | ------------------------------------------ |
| `AWS_HOST`      | Your Lightsail static IP address      | AWS Lightsail → Networking tab             |
| `AWS_USER`      | SSH username (usually `ubuntu`)       | Default for Ubuntu on Lightsail            |
| `AWS_SSH_KEY`   | Private SSH key for Lightsail         | Downloaded from AWS Lightsail account page |
| `PROD_ENV_FILE` | Complete contents of `.env.prod` file | Copy from your `.env.prod` file            |
| `PROD_DB_USER`  | Production database username          | From `.env.prod` (usually `postgres`)      |
| `PROD_DB_NAME`  | Production database name              | From `.env.prod`                           |

### Optional Secrets

| Secret Name            | Description                         | When to Use                          |
| ---------------------- | ----------------------------------- | ------------------------------------ |
| `SLACK_WEBHOOK`        | Slack webhook URL for notifications | If you want deployment notifications |
| `CLOUDFLARE_API_TOKEN` | Cloudflare API token                | For automated DNS management         |
| `CLOUDFLARE_ZONE_ID`   | Cloudflare Zone ID                  | For automated DNS management         |
| `SENTRY_DSN`           | Sentry error tracking DSN           | If using Sentry for error monitoring |

## Detailed Setup Instructions

### 1. Generate SSH Key for Synology

On your **local machine** (not on Synology):

```powershell
# Generate SSH key pair
ssh-keygen -t ed25519 -C "github-actions-qa" -f synology-qa-key

# This creates two files:
# - synology-qa-key (private key)
# - synology-qa-key.pub (public key)
```

**Add Public Key to Synology**:

```powershell
# Copy public key content
Get-Content synology-qa-key.pub

# SSH to Synology
ssh admin@your-synology-ip

# Add public key
mkdir -p ~/.ssh
chmod 700 ~/.ssh
nano ~/.ssh/authorized_keys
# Paste the public key, save and exit
chmod 600 ~/.ssh/authorized_keys
```

**Add Private Key to GitHub Secrets**:

```powershell
# Copy private key content
Get-Content synology-qa-key

# Go to GitHub → Settings → Secrets → Actions
# Name: SYNOLOGY_SSH_KEY
# Value: Paste the entire private key (including BEGIN and END lines)
```

### 2. Get AWS Lightsail SSH Key

**Download from AWS Lightsail**:

1. Log into AWS Lightsail
2. Click account menu (top right)
3. Click **Account** → **Account** tab
4. Go to **SSH keys** section
5. Download the SSH key for your region
6. Save as `lightsail-key.pem`

**Add to GitHub Secrets**:

```powershell
# Copy private key content
Get-Content C:\path\to\lightsail-key.pem

# Go to GitHub → Settings → Secrets → Actions
# Name: AWS_SSH_KEY
# Value: Paste the entire private key
```

### 3. Create Environment Files

**For QA (`.env.qa`)**:

```env
DJANGO_ENV=qa
DJANGO_SECRET_KEY=generate-a-long-random-string-here
DEBUG=False

DB_NAME=adamaurelio_qa
DB_USER=postgres
DB_PASSWORD=strong-qa-password-here
DB_HOST=db
DB_PORT=5432

QA_HOST=your-synology-ip
REACT_APP_API_URL=http://your-synology-ip:8001
REACT_APP_ENV=qa
```

**For Production (`.env.prod`)**:

```env
DJANGO_ENV=production
DJANGO_SECRET_KEY=generate-a-very-long-random-string-minimum-50-chars
DEBUG=False

DB_NAME=adamaurelio_prod
DB_USER=postgres
DB_PASSWORD=very-strong-production-password
DB_HOST=db
DB_PORT=5432

AWS_HOST=your-lightsail-static-ip
DOMAIN=adamaurelio.com

REACT_APP_API_URL=https://api.adamaurelio.com
REACT_APP_ENV=production

EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_HOST_USER=your-email@gmail.com
EMAIL_HOST_PASSWORD=your-app-specific-password
DEFAULT_FROM_EMAIL=noreply@adamaurelio.com
```

**Generate Django Secret Key**:

```python
# Run in Python
import secrets
print(secrets.token_urlsafe(50))
```

**Add Environment Files to GitHub Secrets**:

1. Copy the **entire contents** of `.env.qa`
2. Go to GitHub → Settings → Secrets → Actions
3. Create secret named `QA_ENV_FILE`
4. Paste the entire file contents
5. Repeat for `.env.prod` → `PROD_ENV_FILE`

### 4. Optional: Slack Notifications

**Create Slack Webhook**:

1. Go to https://api.slack.com/apps
2. Create a new app
3. Enable Incoming Webhooks
4. Create webhook for your channel
5. Copy webhook URL

**Add to GitHub Secrets**:

- Name: `SLACK_WEBHOOK`
- Value: Paste webhook URL

### 5. Optional: Cloudflare API Integration

**Create API Token**:

1. Log into Cloudflare
2. Go to **My Profile** → **API Tokens**
3. Click **Create Token**
4. Use template: **"Edit zone DNS"**
5. Select your zone (domain)
6. Create token and copy it

**Get Zone ID**:

1. Go to your domain in Cloudflare
2. Scroll down on Overview page
3. Copy **Zone ID** from right sidebar

**Add to GitHub Secrets**:

- Name: `CLOUDFLARE_API_TOKEN`, Value: Your API token
- Name: `CLOUDFLARE_ZONE_ID`, Value: Your Zone ID

## Verify Secrets

After adding all secrets, verify them:

1. Go to GitHub → Settings → Secrets → Actions
2. You should see (secret values are hidden):

### Minimum Required Secrets:

```
✓ SYNOLOGY_HOST
✓ SYNOLOGY_USER
✓ SYNOLOGY_SSH_KEY
✓ QA_ENV_FILE
✓ AWS_HOST
✓ AWS_USER
✓ AWS_SSH_KEY
✓ PROD_ENV_FILE
✓ PROD_DB_USER
✓ PROD_DB_NAME
```

## Testing Secrets

### Test QA Deployment

1. Create a test commit on `qa` branch:

```powershell
git checkout qa
echo "test" > test.txt
git add test.txt
git commit -m "Test QA deployment"
git push origin qa
```

2. Go to **Actions** tab in GitHub
3. Watch the `Deploy to QA` workflow
4. Check for errors

### Test Production Deployment

1. Create a test commit on `main` branch:

```powershell
git checkout main
git merge qa
git push origin main
```

2. Go to **Actions** tab in GitHub
3. Watch the `Deploy to Production` workflow
4. Check for errors

## Security Best Practices

### Do's ✅

- ✅ Use strong, unique passwords
- ✅ Generate new SSH keys for each environment
- ✅ Rotate secrets periodically
- ✅ Use different secrets for QA and Production
- ✅ Keep secret values secure (never commit to Git)
- ✅ Use GitHub Environments for additional protection

### Don'ts ❌

- ❌ Don't use the same password across environments
- ❌ Don't commit `.env` files to Git
- ❌ Don't share secrets in plain text
- ❌ Don't use weak or default passwords
- ❌ Don't reuse SSH keys
- ❌ Don't log secrets in workflows

## Troubleshooting

### Secret Not Working

**Problem**: Deployment fails with authentication error

**Solution**:

1. Verify secret name matches exactly (case-sensitive)
2. Check for extra spaces or line breaks
3. Regenerate SSH keys if needed
4. Test SSH connection manually

### SSH Authentication Fails

**Problem**: `Permission denied (publickey)`

**Solution**:

1. Verify public key is in `~/.ssh/authorized_keys`
2. Check file permissions:
   ```bash
   chmod 700 ~/.ssh
   chmod 600 ~/.ssh/authorized_keys
   ```
3. Test connection:
   ```bash
   ssh -i private-key user@host
   ```

### Environment File Issues

**Problem**: Application fails with "Environment variable not set"

**Solution**:

1. Verify secret contains complete file contents
2. Check for special characters that need escaping
3. Verify environment variable names match in application
4. Check for Windows vs Unix line endings

### GitHub Actions Can't Access Secrets

**Problem**: Workflow shows "secret is not available"

**Solution**:

1. Verify secret exists in repository settings
2. Check secret name in workflow file matches
3. Verify you have admin access to repository
4. Check GitHub branch protection rules

## Updating Secrets

To update a secret:

1. Go to GitHub → Settings → Secrets → Actions
2. Click on secret name
3. Click **Update secret**
4. Enter new value
5. Click **Update secret**

Changes take effect immediately on next workflow run.

## Deleting Secrets

To delete a secret:

1. Go to GitHub → Settings → Secrets → Actions
2. Click on secret name
3. Click **Remove secret**
4. Confirm deletion

**Warning**: Workflows using this secret will fail.

## Backup Secrets

**Important**: Keep a secure backup of all secrets!

1. Use a password manager (1Password, LastPass, Bitwarden)
2. Store in encrypted file on secure drive
3. Document what each secret is for
4. Keep SSH keys in secure location

**Never**:

- Store secrets in plain text
- Email secrets
- Commit secrets to Git
- Share secrets via messaging apps

## Summary Checklist

Before deploying, verify you have:

### Synology/QA:

- [ ] `SYNOLOGY_HOST` - Your Synology IP
- [ ] `SYNOLOGY_USER` - SSH username
- [ ] `SYNOLOGY_SSH_KEY` - Private SSH key
- [ ] `QA_ENV_FILE` - Complete .env.qa contents

### AWS/Production:

- [ ] `AWS_HOST` - Lightsail static IP
- [ ] `AWS_USER` - SSH username (ubuntu)
- [ ] `AWS_SSH_KEY` - Lightsail private key
- [ ] `PROD_ENV_FILE` - Complete .env.prod contents
- [ ] `PROD_DB_USER` - Database username
- [ ] `PROD_DB_NAME` - Database name

### Optional:

- [ ] `SLACK_WEBHOOK` - For notifications
- [ ] `CLOUDFLARE_API_TOKEN` - For DNS automation
- [ ] `CLOUDFLARE_ZONE_ID` - For DNS automation

All secrets configured? You're ready to deploy! 🚀
