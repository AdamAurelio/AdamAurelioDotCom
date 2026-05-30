# AdamAurelio.com

Personal website and resume for Adam Aurelio — a static React single-page app
built with Vite and Tailwind CSS. No server, no database: it compiles to plain
static files served from a CDN, so it's fast, cheap, and scales automatically.

## Quick start

```bash
npm install
npm run dev        # http://localhost:5173
```

| Command           | Purpose                                  |
|-------------------|------------------------------------------|
| `npm run dev`     | Local dev server with hot reload          |
| `npm run build`   | Production build → `dist/`                |
| `npm run preview` | Preview the built output locally          |
| `npm run lint`    | ESLint (same gate CI enforces)            |

## Environments

| Env  | Where            | How                                                    |
|------|------------------|--------------------------------------------------------|
| Dev  | Local machine    | `npm run dev` — see [docs/DEV_SETUP.md](docs/DEV_SETUP.md) |
| QA   | Synology NAS     | Docker + nginx — see [docs/QA_SYNOLOGY_SETUP.md](docs/QA_SYNOLOGY_SETUP.md) |
| Prod | AWS S3+CloudFront| Auto-deploy on `main` — see [docs/PROD_AWS_SETUP.md](docs/PROD_AWS_SETUP.md) |

## Documentation

- [Architecture](docs/ARCHITECTURE.md) — stack, layout, branch/deploy flow, growth path
- [Dev setup](docs/DEV_SETUP.md)
- [QA setup (Synology)](docs/QA_SYNOLOGY_SETUP.md)
- [Prod setup (AWS)](docs/PROD_AWS_SETUP.md)
- [Infra provisioning](infra/README.md) — one-time AWS S3 + CloudFront setup

## Tech stack

React 19 · React Router 7 · Vite 6 · Tailwind CSS v3 · nginx (QA) · AWS S3 +
CloudFront (prod) · GitHub Actions (CI/CD).
