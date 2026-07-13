# Development Setup (Local Machine)

Run the site on your personal computer with hot reload.

## Prerequisites

- **Node.js 20 LTS** (includes npm). Check with `node -v` → should print `v20.x`.
  Install from <https://nodejs.org> or via a version manager (nvm / fnm).
- **Git**.

## First-time setup

```bash
git clone git@github.com:AdamAurelio/AdamAurelioDotCom.git
cd AdamAurelioDotCom
npm install
```

## Run the dev server

```bash
npm run dev
```

Vite serves the app at **http://localhost:5173** (it opens automatically) with
hot-module reload — edits to anything under `src/` show instantly.

Routes to try: `/`, `/resume`, `/projects`, `/about`, `/contact`.

### Or run it in a container (no local Node)

```bash
docker compose -f docker-compose.dev.yml up      # http://localhost:5173, HMR on
# or: npm run docker:dev
```

Native `npm run dev` stays the fastest path; the container is for parity and
zero-setup onboarding. See [`AUTOMATION.md`](AUTOMATION.md) for the full
per-environment command map.

## Useful commands

| Command           | What it does                                          |
|-------------------|-------------------------------------------------------|
| `npm run dev`     | Dev server with HMR at :5173                          |
| `npm run build`   | Production build → `dist/`                            |
| `npm run preview` | Serve the built `dist/` locally to sanity-check it    |
| `npm run lint`    | ESLint — same check CI runs (catches casing/import bugs) |

## Editing content

- **Resume:** `src/pages/Resume.jsx`
- **Home/landing:** `src/pages/Home.jsx`
- **Nav links:** `src/components/Header.jsx`
- **Footer / social links:** `src/components/Footer.jsx`
- The reference text for the resume lives at `docs/Resume Text.md`.

## Workflow

1. Branch off `dev`, make changes, `npm run dev` to verify.
2. `npm run lint && npm run build` before pushing (CI runs the same).
3. Open a PR into `dev`. CI lints + builds automatically.
4. Promote to QA (Synology) and then `main` (AWS prod) — see the other docs.

> **Note on filenames:** components/pages use **PascalCase** matching their
> imports (`Header.jsx`, `Home.jsx`). Linux (CI, Docker, deploy) is
> case-sensitive, so keep new files consistent or the build breaks there even if
> it works on Windows/macOS.
