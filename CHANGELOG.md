# Changelog

All notable changes to **AdamAurelio.com** are documented here.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0/).

> Production deploys continuously: every merge to `main` ships via
> `.github/workflows/deploy-prod.yml`. Version headings below mark notable
> milestones rather than discrete published releases.

---

## [Unreleased]

> _Developed with AI coding assistance (Anthropic Claude / Claude Code). All
> AI-generated code and docs are reviewed to the same standard as hand-written
> work before commit — per the ADAM model's AI-assistant standard._

### Fixed
- **Printed résumé dropped its name, contact line, and summary** — the print
  stylesheet hid every `<header>` to remove the site chrome, which also hid the
  résumé's own header (and each page's title). The site header and footer
  already hide themselves with `print:hidden`, so the rule now only targets
  `.skip-link` and `.no-print`.
- **Nightly data-tier backup ran once, then never again (2026-10-18)** —
  `data-tier-backup.sh` replaced the EXIT trap that `rc_acquire_lock` installs to
  release its lock, then cleared it, so the lock directory outlived every run
  that reached the dump. Each later run exited 0 with "Another run is in progress":
  Task Scheduler reported success while no dump was written.
  - `refresh-common.sh` gains `rc_release_lock`; the backup script's own traps
    call it, on success and on every failure path.
  - Removes a malformed `# shellcheck disable=… --` directive that stopped
    shellcheck from parsing `refresh-common.sh` at all.
  - A NAS that already ran the old script holds a stale lock: remove it once
    with `sudo rmdir /tmp/data-tier-backup.lock`.
  - `docs/AUTOMATION.md` now covers marking both checkouts `safe.directory`.
    The tasks run as root against user-owned checkouts, which Git refuses
    ("dubious ownership"), while `sudo` runs by hand pass — so it only showed in
    the task logs.
- **NAS self-update agents failed silently under Task Scheduler (2026-09-13)** —
  a scheduled task runs with a bare `/usr/bin:/bin:/usr/sbin:/sbin`, which holds
  neither the Git Server package's `git` nor Container Manager's `docker`, so
  both agents died on their first `git` call. Because Task Scheduler discards
  output, the failure was invisible: the QA mirror went a month without fetching
  while still serving a stale build and reporting `healthy`.
  - `rc_ensure_path()` in `scripts/lib/refresh-common.sh` now prepends the DSM
    package directories (Container Manager, Git Server under any `/volume*`,
    Entware) at source time. Idempotent, and it never shadows a binary that
    already resolves.
  - `rc_require()` reports a missing command by name along with the PATH it
    searched, instead of a bare "command not found" in an unread log.
  - `rc_detect_compose()` now separates "docker is missing" from "the daemon is
    unreachable", the latter naming the user and pointing at root. Previously a
    permissions failure surfaced as the misleading "neither 'docker compose' nor
    'docker-compose' is available" — or worse, as a cheerful "Nothing to do",
    since `rc_compose_running()` deliberately treats an errored `ps` as running.
  - `docs/QA_SYNOLOGY_SETUP.md` gains a "confirm the timer is actually running"
    step (check `FETCH_HEAD` freshness) and explains why the log redirect in the
    task's command matters.

### Changed
- **Friendlier, more visual site (2026-10-20)** — every page reads in a warmer,
  plainer voice with roughly half the words, and icons do more of the talking.
  - `Icon` / `IconBadge` in `src/components/ui/` render Lucide line icons from
    one data file (`icons.js`, ISC — see `NOTICE`); content files name icons,
    pages place them. A unit test fails if content names an icon that
    doesn't exist.
  - Home: icon cards for "What I do", role chips, and "Life outside the code"
    as icon tiles. About: a "My path" timeline replaces three paragraphs.
    Projects, How I Work, and Contact: icon cards with one-line copy.
  - Résumé: same vetted wording (a test checks every line still renders), now
    with an at-a-glance stats strip, skill chips, a career timeline, and icon
    cards for education and community. The skills data is now arrays of items.
  - No new claims: the Projects KPI card drops its unmeasured "instead of
    month-end spreadsheets" outcome.

- **Résumé synced to the 2026 master résumé (2026-10-18)** — `src/content/resume.js`
  now mirrors `Adam_Aurelio_Resume_2026.docx` (the October 12 revision): new
  summary (10+ years), four skill groups (JavaScript, React, Node.js, ORDS, and
  the Copilot tools are no longer listed there), regrouped experience bullets,
  and community roles marked *former* ("Coach" → "Former Head Coach"). The
  revision dropped claims still awaiting evidence, so the site drops them too:
  - The ~80% provisioning, ~32 hours/week, and 3-weeks-to-under-5-days figures
    are removed from the résumé; the 3-week figure is also removed from the
    Projects access-governance card.
  - "Architected" → "Developed". The "central builder" and "adopted across the
    enterprise" wording is removed from the résumé, Home, About, and Projects;
    the Home card, About story, and both Projects blurbs are rewritten from the
    résumé's bullets.
  - Certifications no longer carry a "valid through 2029" date.
  - Home and About say ten-plus years, matching the résumé.
  - Internal project names in the docx (the access-manager, tax, solution-design,
    and safety applications) are replaced with generic descriptions on the
    public site; whether they may be shared externally is still unconfirmed.
  - The Projects "UiPath Center of Excellence" card describes the CoE's CI/CD
    and deployment work instead of founding the RPA practice.
  - `docs/Resume Text.md` — a stale pre-2026 copy that carried a phone number —
    is removed; `DEV_SETUP.md` and `HOW_TO_SETUP.md` point at
    `src/content/resume.js`.
- **Site foundation pass (2026-09-12)** — restructured so the résumé is one
  section of a personal site that can grow, without changing the stack:
  - **Content layer** — all page text moved to `src/content/*.js`; pages are
    templates over data. Site identity (name, links, email parts) lives once in
    `src/content/site.js`.
  - **Route manifest** — `src/routes.js` feeds the router, the header nav, and
    the sitemap generator (previously three hand-kept copies). `src/pages/index.js`
    maps paths to lazy-loaded page chunks.
  - **UI primitives** — `src/components/ui/`: `ButtonLink`, `Card`, `Section`,
    `PageHeader`, `Container`, replacing ~10 repeated button/card class strings.
  - **Route-level code splitting** — each page is its own chunk; the shell is
    ≈79 kB gzip (was 88 kB for everything).
  - **Home CTA** — "See my work" now goes to Projects (the work showcase) and
    reads "See my projects"; the résumé keeps its own nav entry. The "Beyond the
    code" band is a warm gold-paper surface in light mode so the page no longer
    ends in two stacked navy blocks.
  - **Repo `CLAUDE.md`** — points at the `agentic_engineering` standards this
    project adopts and the gates it runs; `docs/MODEL_CONFORMANCE.md` refreshed
    against the consolidated workspace path.
  - **README** — React Router version corrected to 8.

### Added
- **Accessibility** — "Skip to content" link; one global `:focus-visible` ring;
  scroll reset + focus moved to `<main>` on client-side navigation (a SPA gets
  neither for free); `aria-current="page"` on the active nav link;
  `eslint-plugin-jsx-a11y` in the lint gate.
- **Tests** — behaviour tests for Header, ThemeToggle, Layout, ButtonLink, and
  the manifest ↔ pages ↔ sitemap contract (16 → 31 unit tests). E2E now scans
  **every** route with axe across all WCAG 2.x A/AA tag sets and fails on any
  violation (was: home only, critical only), asserts no uncaught page errors,
  and includes an `@harness` self-check that proves the error collector and
  the scan can fail — a green run is only evidence if it could have gone red.
- **Above-the-fold rendering** — `<Reveal immediate>` / `PageHeader` render
  hero content visible at first paint instead of gating it on an
  IntersectionObserver and a 500 ms fade (better LCP; no blank page in a
  throttled tab).

### Fixed
- **CI never ran on the working branch** — `ci.yml` triggered on `dev`, but
  the branch is `develop`. Pushes to `develop` now lint, build, test, and audit.
- **Projects analytics label** — the outbound "View source" click passed
  `project.title` (undefined); now `project.name`.
- **Stale "verify this GitHub username" notes** and mixed-case GitHub URLs —
  one value in `site.js`.
- **CI secret-scanning step** — added a least-privilege `permissions:` block
  (`contents: read`, `pull-requests: read`) to `.github/workflows/ci.yml`.
  Without it, `gitleaks-action` 403'd on `GET /pulls/{n}/commits` when
  enumerating a PR's commits, failing the `build` job on every pull request.

### Added
- **Résumé & site content pass** — turned the site into a résumé-first personal
  site that can grow:
  - **Résumé** — a *Print / Save PDF* button with dedicated `@media print` styles
    (single-column, ink-friendly, reveal-animations forced visible); a *Selected
    Projects* section; skills rendered as scannable tag chips; and
    `Person` **JSON-LD** structured data for recruiters/search (email omitted so
    it stays out of a harvestable literal, per `EmailLink`).
  - **Per-route SEO** — new `Seo` component sets a distinct `<title>`,
    `<meta name="description">`, canonical URL, and Open Graph / Twitter tags per
    page via React 19 metadata hoisting; static `og:*` remain in `index.html` as
    the no-JS unfurl fallback.
  - **Real pages** — replaced the About / Services / Contact placeholder stubs:
    **About** (bio grounded in the résumé), **Contact** (email · LinkedIn ·
    location cards), and **Projects** (recast from *Services* — a work showcase).
  - **Navigation** — résumé-forward nav order; Home hero primary CTA now points
    to the résumé; footer gains an email + section links.
  - **404** — catch-all route with a friendly Not Found page.
- **Full-stack automation & self-setup CI/CD** across all three environments
  ([ADR-0007](docs/adr/0007-ci-driven-gated-provisioning.md),
  [`docs/AUTOMATION.md`](docs/AUTOMATION.md)):
  - **Prod** now provisions from CI — remote S3 Terraform state (native locking)
    + `infra/scripts/bootstrap-state.sh`, a dedicated environment-scoped
    *provision* OIDC role (deploy role stays least-privilege), and
    [`infra.yml`](.github/workflows/infra.yml) running a **gated, idempotent**
    `terraform apply` behind the `production` reviewer. Terraform self-writes the
    deploy Variables; `deploy-prod.yml` fails fast if infra is unprovisioned.
  - **QA + data tier (NAS)** — one-command `scripts/nas-bootstrap.sh` (generates
    data-tier secrets, brings up both stacks), the previously-missing
    `scripts/data-tier-update.sh` change-aware agent, and shared
    `scripts/lib/refresh-common.sh`. Reproducible API image (`package-lock.json`
    + `npm ci`). Stays pull-based (ADR-0005).
  - **Dev** — `docker-compose.dev.yml` for a one-command Vite HMR container.
  - **CI** — new data-tier job (API build + compose validation); npm script
    aliases; Terraform-aware `.gitignore`.
- **Operator setup guide** — [`docs/GETTING_STARTED.md`](docs/GETTING_STARTED.md):
  what only you can provide and the one-time bootstrap order.
- **Editable architecture diagrams** — [`docs/diagrams/`](docs/diagrams/)
  (`dev`, `qa`, `prod` as drawio), reversing the earlier decision to ship
  ASCII-only.
- **Optional on-prem data tier** docs — [`docs/PROD_NAS_DATA_TIER.md`](docs/PROD_NAS_DATA_TIER.md)
  and [ADR-0006](docs/adr/0006-optional-on-prem-data-tier.md): run an API +
  PostgreSQL on the Synology NAS so prod's data stays local. Covers the
  reverse-proxy setup, DNS-01 TLS, SPA wiring, CSP `connect-src` change, auth/CORS,
  graceful degradation, and backups. Opt-in; the static site is unchanged when off.
- **Automated tests** — Vitest (unit/component, incl. an `ErrorBoundary` and a
  layout-landmarks smoke test) and Playwright (E2E route smoke, SPA deep-link
  refresh, and an axe accessibility scan). Both wired into `ci.yml` as merge
  gates (Frontend Standards §12).
- **Top-level React error boundary** (`ErrorBoundary`) with a safe, recoverable
  fallback — no stack trace shown to users (Frontend Standards §8).
- **Pre-commit hook** — husky + lint-staged run ESLint on staged files before
  every commit.
- **`docs/MODEL_CONFORMANCE.md`** — living gap analysis against the ADAM agentic
  development model, plus **`docs/adr/`** Architecture Decision Records for the
  foundational decisions (static SPA, S3+CloudFront, ACM, Terraform, QA branch).
- **`.github/PULL_REQUEST_TEMPLATE.md`** — frontend-adapted review checklist.
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
- React Router routes (`/`, `/resume`, `/projects`, `/about`, `/contact`).
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
