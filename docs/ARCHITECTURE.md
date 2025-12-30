# System Architecture

```
┌─────────────────────────────────────────────────────────────────────────┐
│                           DEVELOPMENT ENVIRONMENT                       │
│                              (Local Machine)                            │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  ┌──────────────┐       ┌──────────────┐      ┌──────────────┐          │
│  │   React      │       │   Django     │      │  PostgreSQL  │          │
│  │  Frontend    │─────▶│   Backend    │─────▶│   Database   │          │
│  │ :3000        │       │   :8000      │      │   :5432      │          │
│  └──────────────┘       └──────────────┘      └──────────────┘          │
│                                                                         │
│  Access: http://localhost:3000                                          │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    │ git push origin qa
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                        GITHUB ACTIONS CI/CD                             │
│                                                                         │
│  ┌────────────────────────────────────────────────────────────────┐     │
│  │  1. Run Tests & Linting                                        │     │
│  │  2. Build Docker Images                                        │     │
│  │  3. Push to GitHub Container Registry                          │     │
│  │  4. Deploy to Environment                                      │     │
│  │  5. Run Migrations                                             │     │
│  │  6. Health Checks                                              │     │
│  └────────────────────────────────────────────────────────────────┘     │
└─────────────────────────────────────────────────────────────────────────┘
                │                                    │
                │ Deploy on push to 'qa'             │ Deploy on push to 'main'
                ▼                                    ▼
┌───────────────────────────────────┐   ┌────────────────────────────────────┐
│     QA ENVIRONMENT                │   │    PRODUCTION ENVIRONMENT          │
│    (Synology NAS)                 │   │    (AWS Lightsail)                 │
├───────────────────────────────────┤   ├────────────────────────────────────┤
│                                   │   │                                    │
│  ┌─────────────────────────────┐  │   │  ┌──────────────────────────────┐  │
│  │  Docker Containers          │  │   │  │  Cloudflare CDN/DNS          │  │
│  │  ┌────────┐  ┌────────┐     │  │   │  │  - DDoS Protection           │  │
│  │  │ React  │  │Django  │     │  │   │  │  - SSL/TLS                   │  │
│  │  │ :3001  │  │ :8001  │     │  │   │  │  - Caching                   │  │
│  │  └────────┘  └────────┘     │  │   │  └──────────────────────────────┘  │
│  │       │          │          │  │   │              │                     │
│  │       └──────────┴─────┐    │  │   │              ▼                     │
│  │  ┌────────────────────┐│    │  │   │  ┌──────────────────────────────┐  │
│  │  │   PostgreSQL       ││    │  │   │  │  Nginx Reverse Proxy         │  │
│  │  │   :5433            ││    │  │   │  │  - HTTPS (Let's Encrypt)     │  │
│  │  └────────────────────┘     │  │   │  │  - Static file serving       │  │
│  └─────────────────────────────┘  │   │  └──────────────────────────────┘  │
│                                   │   │              │                     │
│  Access:                          │   │              ▼                     │
│  http://synology-ip:3001          │   │  ┌──────────────────────────────┐  │
│                                   │   │  │  Docker Containers           │  │
└───────────────────────────────────┘   │  │  ┌────────┐  ┌────────┐      │  │
                                        │  │  │ React  │  │Django  │      │  │
                                        │  │  │ :80    │  │ :8000  │      │  │
                                        │  │  └────────┘  └────────┘      │  │
                                        │  │       │          │           │  │
                                        │  │       └──────────┴─────┐     │  │
                                        │  │  ┌────────────────────┐│     │  │
                                        │  │  │   PostgreSQL       ││     │  │
                                        │  │  │                    ││     │  │
                                        │  │  └────────────────────┘      │  │
                                        │  └──────────────────────────────┘  │
                                        │                                    │
                                        │  Access:                           │
                                        │  https://adamaurelio.com           │
                                        │  https://api.adamaurelio.com       │
                                        │                                    │
                                        └────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────┐
│                         DATA FLOW                                       │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  User Request → Cloudflare → Nginx → Docker Containers                  │
│                    │           │           │                            │
│                    │           │           └──▶ Frontend (React)        │
│                    │           │                      │                 │
│                    │           │                      ▼                 │
│                    │           └──────────────▶ Backend (Django)        │
│                    │                                  │                 │
│                    │                                  ▼                 │
│                    │                           PostgreSQL DB            │
│                    │                                                    │
│                    └──▶ Static Assets (Cached)                          │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────┐
│                      DEPLOYMENT WORKFLOW                                │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  1. Developer → Commits to feature branch                               │
│                      │                                                  │
│                      ▼                                                  │
│  2. Creates PR → QA Branch                                              │
│                      │                                                  │
│                      ▼                                                  │
│  3. GitHub Actions → Run Tests                                          │
│                      │                                                  │
│                      ▼                                                  │
│  4. Merge to QA → Auto Deploy to Synology                               │
│                      │                                                  │
│                      ▼                                                  │
│  5. QA Testing → Verify on Synology                                     │
│                      │                                                  │
│                      ▼                                                  │
│  6. Create PR → Main Branch                                             │
│                      │                                                  │
│                      ▼                                                  │
│  7. Merge to Main → Auto Deploy to AWS Lightsail                        │
│                      │                                                  │
│                      ▼                                                  │
│  8. Production Live → https://adamaurelio.com                           │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────┐
│                    TECHNOLOGY STACK                                     │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  Frontend:        React 18, React Router                                │
│  Backend:         Django 4.2, Django REST Framework                     │
│  Database:        PostgreSQL 15                                         │
│  Web Server:      Nginx, Gunicorn                                       │
│  Containerization: Docker, Docker Compose                               │
│  CI/CD:           GitHub Actions                                        │
│  CDN/DNS:         Cloudflare                                            │
│  SSL:             Let's Encrypt (Certbot)                               │
│  Hosting:         AWS Lightsail (Prod), Synology NAS (QA)               │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────┐
│                        SECURITY LAYERS                                  │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  Layer 1: Cloudflare                                                    │
│           - DDoS Protection                                             │
│           - WAF (Web Application Firewall)                              │
│           - Bot Management                                              │
│           - SSL/TLS Encryption                                          │
│                                                                         │
│  Layer 2: Nginx                                                         │
│           - Rate Limiting                                               │
│           - Security Headers                                            │
│           - Request Filtering                                           │
│                                                                         │
│  Layer 3: Django                                                        │
│           - CSRF Protection                                             │
│           - XSS Prevention                                              │
│           - SQL Injection Prevention                                    │
│           - Authentication & Authorization                              │
│                                                                         │
│  Layer 4: Database                                                      │
│           - User Permissions                                            │
│           - Encrypted Connections                                       │
│           - Backup & Recovery                                           │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────┐
│                      BACKUP STRATEGY                                    │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  Development:  Manual backups (as needed)                               │
│  QA:           Daily automated backups (2 AM)                           │
│                Retention: 14 days                                       │
│  Production:   Daily automated backups (2 AM)                           │
│                Retention: 7 days (local), 30 days (offsite)             │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────┐
│                      COST BREAKDOWN                                     │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  Development:    $0/month (local)                                       │
│  QA:             ~$2-5/month (Synology electricity)                     │
│  Production:     $10-20/month (AWS Lightsail)                           │
│  Cloudflare:     $0/month (Free plan)                                   │
│  Domain:         ~$1/month ($12/year)                                   │
│  ────────────────────────────────────────────                           │
│  Total:          ~$13-26/month                                          │
│                                                                         │
│  One-time costs:                                                        │
│  Synology NAS:   $300-$1000 (hardware)                                  │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

## Key Benefits

### Professional Infrastructure

✅ Industry-standard DevOps practices  
✅ Automated testing and deployment  
✅ Multiple environments for safe testing  
✅ Production-grade security

### Cost-Effective

✅ Under $30/month operating cost  
✅ Free CDN and DDoS protection  
✅ No vendor lock-in  
✅ Scalable as you grow

### Developer-Friendly

✅ Hot reload in development  
✅ Comprehensive documentation  
✅ Automated setup scripts  
✅ Easy to maintain and update

### Production-Ready

✅ HTTPS everywhere  
✅ Cloudflare CDN  
✅ Automated backups  
✅ Health monitoring  
✅ Zero-downtime deployments
