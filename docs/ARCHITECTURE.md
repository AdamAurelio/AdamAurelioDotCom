# Architecture

AdamAurelio.com is a **static single-page application** — a React app compiled
by Vite into plain HTML/CSS/JS. There is no server and no database. This makes
it cheap, fast, and effectively infinitely scalable: a CDN serves files.

```
                       ┌──────────────────────────────────────────┐
   edit src/           │  DEV — local machine                     │
   ───────────────────▶│  npm run dev (Vite, HMR) :5173           │
                       │  or: docker compose -f docker-compose.dev │
                       └──────────────────────────────────────────┘
                                        │ open PR / push dev
                                        ▼
                       ┌──────────────────────────────────────────┐
   GitHub Actions CI   │  CI (ci.yml): lint · build · unit · e2e   │
   on PR / dev push    │  + data-tier job (API build, compose)     │
                       └──────────────────────────────────────────┘
                 merge to qa │                      │ merge to main
                             ▼                      ▼
   ┌─────────────────────────────────┐   ┌─────────────────────────────────────┐
   │  QA — Synology NAS (pull-based) │   │  PROD — AWS S3 + CloudFront         │
   │  qa-update.sh / data-tier-      │   │  provision: infra.yml (gated TF)    │
   │  update.sh on a timer rebuild   │   │  deploy:    deploy-prod.yml on merge│
   │  nginx :8080 (+ API :3001)      │   │  CloudFront ← OAC ← S3 (private)    │
   │  set up via nas-bootstrap.sh    │   │  ACM TLS · 403/404 → index.html     │
   └─────────────────────────────────┘   └─────────────────────────────────────┘
```

**Detailed per-environment diagrams** (editable drawio — open in the drawio
desktop app, [diagrams.net](https://app.diagrams.net), or the VS Code drawio
extension): [`diagrams/dev.drawio`](diagrams/dev.drawio),
[`diagrams/qa.drawio`](diagrams/qa.drawio),
[`diagrams/prod.drawio`](diagrams/prod.drawio). The end-to-end automation is in
[`AUTOMATION.md`](AUTOMATION.md).

## Stack

| Layer        | Choice                          | Why |
|--------------|---------------------------------|-----|
| UI           | React 19 + react-router-dom 7   | Existing components; SPA routing |
| Build        | Vite 6                          | Fast, maintained (CRA is EOL), small output |
| Styling      | Tailwind CSS v3                 | Utility CSS already used throughout |
| Dev serve    | Vite dev server                 | HMR, zero config |
| QA serve     | nginx in Docker                 | Mirrors a real static host on the NAS |
| Prod serve   | AWS S3 + CloudFront             | ~$0–2/mo, global CDN, scales automatically |
| CI/CD        | GitHub Actions                  | Lint/build/test gate; deploy on merge to `main`; gated Terraform provisioning (`infra.yml`) |
| Prod IaC     | Terraform (remote S3 state)     | One gated `terraform apply` provisions/self-heals the whole stack (ADR-0004/0007) |

## Repository layout

```
index.html              Vite HTML entry
vite.config.js          Build config (outputs to dist/)
tailwind.config.js      Tailwind v3 config
src/
  main.jsx              App bootstrap
  App.jsx               Routes
  components/           Layout, Header, Footer
  pages/                Home, Resume, Projects, About, Contact
  styles/index.css      Tailwind entry
public/                 Static assets copied as-is (favicon, manifest, robots)
Dockerfile              QA: multi-stage build → nginx
nginx.conf              QA: SPA fallback + caching + /health
docker-compose.qa.yml   QA: one nginx service on :8080
docker-compose.dev.yml  Dev: Vite dev server in a container (HMR)
scripts/                NAS agents: nas-bootstrap.sh, qa-update.sh,
                        data-tier-update.sh, lib/refresh-common.sh
nas_data_tier/          On-prem data tier (Postgres + Express API) + its
                        compose files and Dockerfile (ADR-0006)
infra/terraform/        IaC for the whole prod stack (ADR-0004/0007)
infra/scripts/          bootstrap-state.sh (one-time TF state bucket)
.github/workflows/      ci.yml, deploy-prod.yml, infra.yml
docs/diagrams/          Editable drawio diagrams per environment
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

| Branch | Environment | Trigger |
|--------|-------------|---------|
| `dev`  | local + CI  | day-to-day work; CI lints, builds, tests, validates the data tier |
| `qa`   | Synology    | NAS pulls + rebuilds via `qa-update.sh` / `data-tier-update.sh` (timer or by hand) — pull-based, ADR-0005 |
| `main` | AWS prod    | push → `deploy-prod.yml` deploys; changes under `infra/terraform/**` → `infra.yml` runs a gated `terraform apply` (ADR-0007) |

> The `qa` branch (not `qa-test`) is the one QA tracks — see ADR-0005.
