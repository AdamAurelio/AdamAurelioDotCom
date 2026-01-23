# AdamAurelio.com - Complete DevOps Setup

A full-stack web application with React frontend, Django backend, PostgreSQL database, and complete CI/CD pipeline for Dev, QA, and Production environments.

## 🚀 Quick Start

**Get your development environment running in 5 minutes:**

```powershell
# Clone the repository
git clone git@github.com:yourusername/AdamAurelioDotCom.git
cd AdamAurelioDotCom

# Copy environment file
Copy-Item .env.dev.example .env.dev

# Run setup script
.\scripts\setup-dev.ps1

# Access your application
# Frontend: http://localhost:3000
# Backend: http://localhost:8000
# Admin: http://localhost:8000/admin (admin/admin123)
```

For detailed instructions, see [QUICKSTART.md](QUICKSTART.md)

## 📋 Features

### Application Features

- ✅ Modern React frontend with responsive design
- ✅ Django REST API backend
- ✅ PostgreSQL database
- ✅ Blog management system
- ✅ Portfolio/Resume section
- ✅ Django admin panel
- ✅ RESTful API with documentation
- ✅ Image upload and management

### DevOps Features

- ✅ Multi-environment setup (Dev/QA/Prod)
- ✅ Docker containerization
- ✅ GitHub Actions CI/CD
- ✅ Automated testing
- ✅ Database migrations
- ✅ Static file management
- ✅ SSL/HTTPS support
- ✅ Cloudflare CDN integration
- ✅ Automated backups
- ✅ Health monitoring

## 🏗️ Architecture

### Tech Stack

- **Frontend**: React 19, Tailwind CSS 3+, PostCSS
- **Backend**: Django 4.2, Django REST Framework
- **Database**: PostgreSQL 15
- **Web Server**: Nginx
- **Container**: Docker & Docker Compose
- **CI/CD**: GitHub Actions
- **Cloud**: AWS Lightsail (Production)
- **CDN/DNS**: Cloudflare
- **SSL**: Let's Encrypt (Certbot)

### Frontend Features

- ✅ Tailwind CSS utility-first styling
- ✅ Responsive design (mobile-first)
- ✅ Modern component architecture
- ✅ Optimized production builds
- ✅ Hot module replacement (HMR)

### Environments

| Environment     | Location      | Purpose                | Access           |
| --------------- | ------------- | ---------------------- | ---------------- |
| **Development** | Local Machine | Development & testing  | localhost:3000   |
| **QA**          | Synology NAS  | Pre-production testing | synology-ip:3001 |
| **Production**  | AWS Lightsail | Live site              | adamaurelio.com  |

## 📁 Project Structure

```
AdamAurelioDotCom/
├── adamaurelio/               # React Frontend (Tailwind CSS)
│   ├── src/
│   │   ├── components/       # Reusable components
│   │   │   ├── Header.js     # Navigation with Tailwind
│   │   │   ├── Footer.js     # Footer component
│   │   │   ├── Blog.js       # Blog container
│   │   │   ├── BlogList.js   # Blog listing
│   │   │   ├── BlogPost.js   # Blog post card
│   │   │   └── Resume.js     # Resume component
│   │   ├── pages/            # Page components
│   │   │   ├── Home.js       # Landing page
│   │   │   ├── About.js      # About page
│   │   │   ├── Resume.js     # Full resume page
│   │   │   ├── Services.js   # Services page
│   │   │   ├── Contact.js    # Contact page
│   │   │   └── Admin.js      # Admin dashboard
│   │   ├── styles/
│   │   │   └── index.css     # Tailwind directives
│   │   ├── App.js
│   │   └── index.js
│   ├── public/
│   ├── tailwind.config.js    # Tailwind configuration
│   ├── postcss.config.js     # PostCSS config
│   ├── package.json
│   ├── Dockerfile
│   └── Dockerfile.dev
├── backend/                   # Django Backend
│   ├── apps/                 # Django applications
│   │   ├── core/            # Core functionality
│   │   ├── blog/            # Blog app
│   │   └── resume/          # Resume/Portfolio
│   ├── config/              # Django settings
│   │   └── settings/        # Environment-specific settings
│   ├── manage.py
│   ├── requirements.txt
│   └── Dockerfile
├── scripts/                  # Setup and utility scripts
│   ├── setup-dev.sh         # Bash setup script
│   └── setup-dev.ps1        # PowerShell setup script
├── nginx/                    # Nginx configuration
│   └── conf.d/
├── docs/                     # Documentation
│   ├── AWS_LIGHTSAIL_SETUP.md
│   ├── CLOUDFLARE_SETUP.md
│   └── SYNOLOGY_SETUP.md
├── .github/workflows/        # CI/CD pipelines
│   ├── ci-dev.yml
│   ├── deploy-qa.yml
│   └── deploy-prod.yml
├── docker-compose.dev.yml    # Development compose
├── docker-compose.qa.yml     # QA compose
├── docker-compose.prod.yml   # Production compose
├── .env.dev.example         # Dev environment template
├── .env.qa.example          # QA environment template
├── .env.prod.example        # Prod environment template
├── SETUP_GUIDE.md           # Complete setup guide
├── QUICKSTART.md            # Quick start guide
└── README.md                # This file
```

## 🛠️ Setup Guides

### Development Environment

**Platform**: Windows/Mac/Linux  
**Time**: 5-10 minutes  
**Guide**: [QUICKSTART.md](QUICKSTART.md)

### QA Environment (Synology NAS)

**Platform**: Synology DSM 7.0+  
**Time**: 30-60 minutes  
**Guide**: [docs/SYNOLOGY_SETUP.md](docs/SYNOLOGY_SETUP.md)

### Production Environment (AWS Lightsail)

**Platform**: AWS Lightsail  
**Time**: 60-90 minutes  
**Guide**: [docs/AWS_LIGHTSAIL_SETUP.md](docs/AWS_LIGHTSAIL_SETUP.md)

### Cloudflare CDN & DNS

**Platform**: Cloudflare  
**Time**: 20-30 minutes  
**Guide**: [docs/CLOUDFLARE_SETUP.md](docs/CLOUDFLARE_SETUP.md)

## 🔄 Development Workflow

### 1. Create Feature Branch

```powershell
git checkout -b feature/your-feature-name
```

### 2. Develop Locally

- Frontend: http://localhost:3000 (hot reload)
- Backend: http://localhost:8000 (auto restart)
- Make your changes

### 3. Test Your Changes

```powershell
# Run backend tests
docker-compose -f docker-compose.dev.yml exec backend python manage.py test

# Run frontend tests
cd frontend
npm test
cd ..
```

### 4. Push to QA

```powershell
# Merge to qa branch
git checkout qa
git merge feature/your-feature-name
git push origin qa

# GitHub Actions automatically deploys to Synology NAS
# Access at: http://synology-ip:3001
```

### 5. Deploy to Production

```powershell
# After QA testing, merge to main
git checkout main
git merge qa
git push origin main

# GitHub Actions automatically deploys to AWS Lightsail
# Live at: https://adamaurelio.com
```

## 🚢 Deployment Pipeline

### Branch Strategy

```
main (production) → AWS Lightsail
  ↑
  qa (testing) → Synology NAS
  ↑
  feature/* (development) → Local
```

### Automated CI/CD

**On Pull Request**:

- ✅ Run linting
- ✅ Run tests
- ✅ Build verification
- ✅ Security scanning

**On Push to `qa` branch**:

- ✅ Build Docker images
- ✅ Push to GitHub Container Registry
- ✅ Deploy to Synology NAS
- ✅ Run migrations
- ✅ Health checks

**On Push to `main` branch**:

- ✅ Build production images
- ✅ Deploy to AWS Lightsail
- ✅ Run migrations
- ✅ Backup database
- ✅ Health checks
- ✅ Smoke tests
- ✅ Create release tag

## 📊 Monitoring & Maintenance

### Health Checks

```powershell
# Development
curl http://localhost:8000/health/

# QA
curl http://synology-ip:8001/health/

# Production
curl https://api.adamaurelio.com/health/
```

### View Logs

```powershell
# Development
docker-compose -f docker-compose.dev.yml logs -f

# QA (SSH to Synology)
docker-compose -f docker-compose.qa.yml logs -f

# Production (SSH to Lightsail)
docker-compose -f docker-compose.prod.yml logs -f
```

### Database Backups

**Development**:

```powershell
docker-compose -f docker-compose.dev.yml exec db pg_dump -U postgres adamaurelio_dev > backup.sql
```

**Production** (automated daily at 2 AM):

```bash
# Manual backup
/opt/adamaurelio/scripts/backup.sh
```

## 🔒 Security

### Implemented Security Features

- ✅ HTTPS with Let's Encrypt
- ✅ Cloudflare DDoS protection
- ✅ Django security middleware
- ✅ CORS configuration
- ✅ SQL injection protection (Django ORM)
- ✅ XSS protection
- ✅ CSRF protection
- ✅ Secure session cookies
- ✅ Rate limiting (Cloudflare)
- ✅ Security headers

### Secret Management

- Environment variables for sensitive data
- GitHub Secrets for CI/CD
- No secrets in code or Git history
- `.gitignore` configured properly

## 💰 Cost Breakdown

### Monthly Costs

| Service           | Plan              | Cost                     |
| ----------------- | ----------------- | ------------------------ |
| **AWS Lightsail** | 2GB instance      | $10-20/month             |
| **Cloudflare**    | Free plan         | $0/month                 |
| **Domain**        | Annual fee        | ~$1/month                |
| **Synology NAS**  | One-time hardware | $2-5/month (electricity) |
| **Total**         |                   | **~$13-26/month**        |

### One-Time Costs

- Synology NAS: $300-$1000+ (hardware)
- Domain registration: $10-15/year

## 📖 Documentation

- [SETUP_GUIDE.md](SETUP_GUIDE.md) - Complete setup guide
- [QUICKSTART.md](QUICKSTART.md) - Quick start guide
- [docs/AWS_LIGHTSAIL_SETUP.md](docs/AWS_LIGHTSAIL_SETUP.md) - AWS Lightsail setup
- [docs/CLOUDFLARE_SETUP.md](docs/CLOUDFLARE_SETUP.md) - Cloudflare setup
- [docs/SYNOLOGY_SETUP.md](docs/SYNOLOGY_SETUP.md) - Synology NAS setup

## 🐛 Troubleshooting

### Common Issues

**Database connection fails**:

```powershell
docker-compose -f docker-compose.dev.yml down -v
docker-compose -f docker-compose.dev.yml up -d
```

**Port already in use**:

```powershell
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

**Docker build fails**:

```powershell
docker system prune -a
docker-compose -f docker-compose.dev.yml build --no-cache
```

For more troubleshooting, see [SETUP_GUIDE.md](SETUP_GUIDE.md#troubleshooting)

## 🤝 Contributing

This is a personal project, but feel free to fork and adapt for your own use!

## 📝 License

This project is private and proprietary.

## 👨‍💻 Author

**Adam Aurelio**

- Website: https://adamaurelio.com
- GitHub: [@yourusername](https://github.com/yourusername)

## 🙏 Acknowledgments

- Django & Django REST Framework
- React & Create React App
- Docker & Docker Compose
- AWS Lightsail
- Cloudflare
- GitHub Actions
- Synology DSM

---

**Ready to get started?** Follow the [Quick Start Guide](QUICKSTART.md) to set up your development environment in 5 minutes! 🚀
