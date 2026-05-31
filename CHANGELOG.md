# Changelog

All notable changes to **AdamAurelio.com** are documented here.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0/).

> Production deploys continuously: every merge to `main` ships via
> `.github/workflows/deploy-prod.yml`. Version headings below mark notable
> milestones rather than discrete published releases.

---

## [Unreleased]

### Added
- **Subtle motion** — scroll/entrance reveals (`Reveal`) and an animated stats
  count-up (`CountUp`) on Home, section reveals on Resume, and an animated nav
  underline. CSS/IntersectionObserver only (no animation library, ~0.5 KB),
  and fully disabled under `prefers-reduced-motion`.
- **Profile photo** on the Home hero and Resume header, optimized from the 2 MB
  source to a 32 KB 512×512 JPEG (`public/profile.jpg`).
- **Light/dark mode toggle** in the header — respects system preference on first
  visit, persists the choice to `localStorage`, and applies the theme before
  first paint to avoid a flash. The pre-paint init (`public/theme-init.js`) is a
  same-origin script so it satisfies the strict `script-src 'self'` CSP.
- **`SECURITY.md`** — data classification (PUBLIC) and a mapping of the site
  against the OWASP Top 10 / ISO 27001 control set, plus vulnerability reporting.
- **CloudFront Response Headers Policy** documented in `infra/README.md` §7 with
  a ready-to-apply `infra/response-headers-policy.json` (CSP, HSTS,
  X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy).
- **`docs/HOW_TO_SETUP.md`** — guided, step-by-step setup walkthrough for the
  Dev, QA, and Prod environments with explanations.
- **CI security scanning** — `npm audit --audit-level=high` (dependency
  vulnerabilities) and `gitleaks` (committed-secret detection) in `ci.yml`.

### Changed
- Updated the Resume page to the 2026 resume: title **Software Engineer II**,
  10+ years summary, reorganized Core Skills, themed accomplishment groups with
  quantified results, condensed earlier role, and certifications valid through
  2029. (Phone number intentionally omitted from the public site.)
- Home hero tagline now renders as **one line on `xl`+ screens or three stacked
  lines below — never two**, to avoid an awkward two-line wrap.
- `nginx.conf` (QA) now emits the full security-header set so QA mirrors the
  production CloudFront headers.

### Removed
- Dead leftover directories from the old Django/Express/PostgreSQL stack:
  `backend/`, `frontend/`, `Docker/`, `nginx/`, `scripts/` (all empty skeletons).
- Stale `.env` and `.env.dev` files that referenced the removed backend stack.

### Security
- Resume privacy pass: generalized employer-internal security/IAM/compliance
  system details on the public Resume page (kept impact and metrics, removed
  specifics like the internal provisioning platform). Obfuscated the contact
  email (`EmailLink`) so it isn't a scrapeable literal in the shipped bundle.
- Added Content-Security-Policy, HSTS, and related response headers (QA via
  nginx; production via CloudFront policy) — the primary technical control for a
  static site.
- Added dependency and secret scanning to the CI pipeline.
- Classified the asset as **PUBLIC** and recorded the control assessment in
  `SECURITY.md`.

---

## [1.0.0] - 2026-05-29

Baseline after migrating to a static single-page application.

### Added
- React Router routes (`/`, `/resume`, `/about`, `/services`, `/contact`).
- QA environment: Docker multi-stage build serving the static `dist/` behind
  nginx (`Dockerfile`, `nginx.conf`, `docker-compose.qa.yml`).
- Production environment: AWS S3 + CloudFront with auto-deploy on push to `main`
  via GitHub Actions using OIDC (no stored AWS keys).
- CI workflow (lint + build) on PRs and pushes to `dev`.
- Project documentation under `docs/` (architecture, environment setups) and
  one-time AWS provisioning under `infra/`.

### Changed
- Migrated the build tool from Create React App (end-of-life) to **Vite 6**.
- Moved the application to the repository root and standardized component/page
  filenames to PascalCase (required for case-sensitive Linux build/deploy).

### Removed
- The previously scaffolded Django backend, Express server, and PostgreSQL —
  unused and the only recurring cost driver.

---

[Unreleased]: https://github.com/AdamAurelio/AdamAurelioDotCom/compare/main...dev
