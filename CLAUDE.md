# AdamAurelio.com — assistant instructions

Personal website and résumé: a static React 19 + Vite + Tailwind SPA, no backend,
deployed to S3/CloudFront. Small by design; keep it that way.

## Standards this repo follows

The engineering process lives in the sibling workspace `../agentic_engineering/`
(ADAM). This project adopts its **standards**, not its enterprise ceremony. See
[`docs/MODEL_CONFORMANCE.md`](docs/MODEL_CONFORMANCE.md) for what applies and what is
consciously waived.

- **Frontend rules:** `../agentic_engineering/standards/frontend-standards.md`
  (§3 style, §4–5 structure & components, §8 errors, §9 accessibility, §11 performance,
  §12 testing).
- **React practice:** `../agentic_engineering/skills/react/SKILL.md` — semantic HTML,
  labeled interactive elements, stable keys, honest dependency arrays, behaviour tests.
  Ignore the server-state (TanStack Query) guidance: this site has no server state.
- **Verification:** the *idea* of `standards/verification-loop.md` — the reviewer is not
  the builder. Before opening a PR, run a review in a fresh context (`/code-review` or a
  subagent) that did not write the change. No findings ledger, no gate roles.

## Where things live

| Need                     | File                                                              |
| ------------------------ | ----------------------------------------------------------------- |
| Add or reorder a page    | `src/routes.js` (manifest) + `src/pages/index.js` (lazy component) |
| Site name, links, email  | `src/content/site.js` — never inline a URL or address elsewhere   |
| Résumé / project text    | `src/content/*.js` — pages are templates over these               |
| Shared UI                | `src/components/ui/` — `ButtonLink`, `Card`, `Section`, `PageHeader`, `Container` |
| Site chrome              | `src/components/Layout.jsx` (skip link, scroll/focus reset), `Header.jsx`, `Footer.jsx` |
| Analytics / monitoring   | `src/lib/analytics/`, `src/lib/monitoring.js` — both off by default, CSP-gated |
| Decisions                | `docs/adr/` — one file per significant decision                   |

## Gates (same as CI — all must pass before a PR)

```bash
npm run lint        # ESLint incl. react-hooks + jsx-a11y, zero warnings
npm run test:unit   # Vitest + Testing Library
npm run build       # regenerates public/sitemap.xml from the manifest first
npm run test:e2e    # Playwright: every route loads, no JS errors, axe clean,
                    # plus the @harness self-check that proves the suite can fail
```

`npm audit --omit=dev --audit-level=high` blocks in CI on production dependencies.

## Rules of the road

- **Above-the-fold content renders visible.** Use `<Reveal immediate>` / `PageHeader`
  for anything the visitor lands on; scroll-reveal is for content they scroll to.
- **Accessibility is part of done.** Real `<button>`/`<a>`, labels on icons, one `<h1>`
  per page, visible focus (global `:focus-visible` in `src/styles/index.css`). The axe
  scan fails on *any* violation across all four WCAG 2.x A/AA tag sets; a disabled rule is
  a finding that needs a reason and a review date in `e2e/a11y.js`.
- **No secrets, no PII, no third-party scripts** without widening the CSP in all four
  places named in `src/lib/analytics/providers.js`.
- **Security headers are hand-maintained in three places** — keep `infra/`,
  `nginx.conf`, and Terraform in sync (see `TODO.md` §4).
- **Record decisions.** New dependency, new page type, new hosting behaviour → an ADR.
  Update `CHANGELOG.md` under *Unreleased*.
- **Branches:** work on `develop`; `main` auto-deploys to production on merge.

## Growth path

The résumé is one section of a personal site, not the whole site. Long-form content
(notes, ideas, essays) needs a build-time prerender or Astro decision **recorded as an
ADR before the first long-form page is added** — a client-rendered SPA serves crawlers
an empty shell. See `docs/ARCHITECTURE.md` → *Adding dynamic features later*.
