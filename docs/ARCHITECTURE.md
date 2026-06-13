# Architecture

AdamAurelio.com is a **static single-page application** — a React app compiled
by Vite into plain HTML/CSS/JS. There is no server and no database. This makes
it cheap, fast, and effectively infinitely scalable: a CDN serves files.

```
                       ┌──────────────────────────────────────────┐
   git push dev        │  DEV  — local machine                    │
   ───────────────────▶│  Vite dev server (npm run dev) :5173     │
                       │  Instant hot-module reload               │
                       └──────────────────────────────────────────┘
                                        │ open PR / merge
                                        ▼
                       ┌──────────────────────────────────────────┐
   GitHub Actions CI   │  CI (.github/workflows/ci.yml)           │
   on PR / dev push    │  npm ci → npm run lint → npm run build    │
                       └──────────────────────────────────────────┘
                          │ merge to qa-test               │ merge to main
                          ▼                                ▼
   ┌─────────────────────────────────┐   ┌─────────────────────────────────────┐
   │  QA — Synology NAS              │   │  PROD — AWS S3 + CloudFront         │
   │  Docker: nginx serves /dist     │   │  S3 (private) ← OAC ← CloudFront CDN │
   │  http://<nas-ip>:8080           │   │  ACM TLS · SPA 403/404 → index.html │
   │  docker compose -f \            │   │  Auto-deploy via deploy-prod.yml     │
   │    docker-compose.qa.yml up -d  │   │  https://adamaurelio.com            │
   └─────────────────────────────────┘   └─────────────────────────────────────┘
```

## Stack

| Layer        | Choice                          | Why |
|--------------|---------------------------------|-----|
| UI           | React 19 + react-router-dom 7   | Existing components; SPA routing |
| Build        | Vite 6                          | Fast, maintained (CRA is EOL), small output |
| Styling      | Tailwind CSS v3                 | Utility CSS already used throughout |
| Dev serve    | Vite dev server                 | HMR, zero config |
| QA serve     | nginx in Docker                 | Mirrors a real static host on the NAS |
| Prod serve   | AWS S3 + CloudFront             | ~$0–2/mo, global CDN, scales automatically |
| CI/CD        | GitHub Actions                  | Lint/build gate + deploy on merge to main |

## Repository layout

```
index.html              Vite HTML entry
vite.config.js          Build config (outputs to dist/)
tailwind.config.js      Tailwind v3 config
src/
  main.jsx              App bootstrap
  App.jsx               Routes
  components/           Layout, Header, Footer
  pages/                Home, Resume, About, Services, Contact
  styles/index.css      Tailwind entry
public/                 Static assets copied as-is (favicon, manifest, robots)
Dockerfile              QA: multi-stage build → nginx
nginx.conf              QA: SPA fallback + caching + /health
docker-compose.qa.yml   QA: one nginx service on :8080
infra/README.md         One-time AWS provisioning
.github/workflows/      ci.yml, deploy-prod.yml
docs/                   This documentation
```

## Why no backend right now

A resume is static content; it needs no runtime server or database. Removing the
previously scaffolded Django/PostgreSQL/Express stack eliminated the only
recurring cost driver (an always-on VM) and a large maintenance surface.

## Adding dynamic features later

When a contact form, blog, or API is actually needed, add it **serverlessly** so
the cost stays near zero and the static hosting is untouched:

- **API Gateway + AWS Lambda** for endpoints (pay per request).
- **DynamoDB** or **SES** (email) for storage/sending.
- The React app calls the HTTPS API; `dist/` continues to ship to S3/CloudFront.

This is the documented growth path — see `infra/README.md`.

**On-prem alternative — keep the data at home.** If you'd rather your data live on
the Synology NAS than in the cloud, run an API + PostgreSQL on the NAS and expose
only the API over HTTPS via a reverse proxy (the DB port is never exposed). The
static site is unchanged; it just calls `https://api.adamaurelio.com`. Opt-in and
fully reversible — see [`PROD_NAS_DATA_TIER.md`](PROD_NAS_DATA_TIER.md) and
[ADR-0006](adr/0006-optional-on-prem-data-tier.md).

## Branch / deploy flow

| Branch     | Environment | Trigger                                   |
|------------|-------------|-------------------------------------------|
| `dev`      | local + CI  | day-to-day work; CI lints & builds        |
| `qa-test`  | Synology    | manual `docker compose` pull/up on the NAS|
| `main`     | AWS prod    | push → `deploy-prod.yml` auto-deploys     |
