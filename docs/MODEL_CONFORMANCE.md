# ADAM Model Conformance — AdamAurelio.com

A living gap analysis of this project against the
**[agentic_engineering](../../agentic_engineering/)** workspace (ADAM, BHE SDS v1) —
specifically [`standards/frontend-standards.md`](../../agentic_engineering/standards/frontend-standards.md)
and [`skills/react/SKILL.md`](../../agentic_engineering/skills/react/SKILL.md). It mirrors what the model's *existing-project-analysis* agent
produces: each applicable standard, its status, and the action to close it.

**Stack is intentionally unchanged** (React + Vite + Tailwind → S3/CloudFront).
This tracks *process/quality* conformance, not a stack rewrite.

**Last reviewed:** 2026-09-12 · **Review cycle:** on significant architecture
change, otherwise quarterly. _(2026-09-12: site-foundation pass — content layer,
route manifest, UI primitives, lazy routes, a11y gate tightened, jsx-a11y lint,
harness self-check, repo `CLAUDE.md`. 2026-06-16: CI-driven gated provisioning +
remote state, NAS self-update agents, dev container, drawio diagram set.)_

The day-to-day version of this document is the repo's [`CLAUDE.md`](../CLAUDE.md):
what to follow, where things live, and the gates.

---

## Scope: what applies vs. what doesn't

The model is an enterprise, Oracle/PL/SQL-leaning SDLC. Much of it is **N/A by
design** for a public, static, no-auth, no-database, no-PII personal SPA. The
project's [`SECURITY.md`](../SECURITY.md) already maps this (data class = PUBLIC,
stateless, minimized attack surface). The items below are scored only against the
**applicable** subset.

**Correctly N/A (do not build):** audit columns / BIU triggers, row-level
security, SSO/OIDC *application* auth, separation of duties, email templates,
DBMS_SCHEDULER jobs, PL/SQL package APIs, encryption-at-rest, SOX/HIPAA,
penetration testing, two-person CAB approval.

Legend: 🟢 strong · 🟡 partial · 🔴 gap · ⚪ N/A-by-design · ✅ done this cycle

---

## Scorecard

| Standard (model ref) | Status | Tracking item |
|---|---|---|
| Security posture & OWASP/ISO mapping (`security-checklist.md`) | 🟢 | — |
| Header/config parity + automated validation (Dev Std §6) | 🟢 | — |
| IaC / reproducibility (ISO A.12.3) | 🟢 | — (remote-state Terraform; gated CI apply, ADR-0007) |
| Env separation DEV→QA→PROD | 🟢 | — (each self-provisions; diagrams in `docs/diagrams/`) |
| Accessibility — WCAG 2.1 AA (Frontend §9) | 🟢 | [#A11Y](#a11y) — automated floor; manual checks remain |
| Frontend error handling / observability (Frontend §8) | 🟡 | [#OBS](#obs) |
| Performance — splitting/assets (Frontend §11) | 🟢 | [#PERF](#perf) |
| Type safety (Frontend §2) | 🔴 | [#TS](#ts) — **deferred by decision** |
| Automated testing (Frontend §12, Dev Std §3) | 🟢 | [#TEST](#test) |
| Immutable-artifact promotion (Frontend §13 / SDS) | 🔴 | [#ARTIFACT](#artifact) |
| ADRs (Dev Std §4) | 🟡 | [#ADR](#adr) |
| Pre-commit validation (Dev Std §6) | 🟡 | [#PRECOMMIT](#precommit) |
| PR template (Dev Std §7.2) | 🟡 | [#PR](#pr) |
| Approval gates (`approval-gates.md`) | 🟡 | [#GATES](#gates) |
| Closing the loop / monitoring (`closing-the-loop.md`) | 🔴 | [#MONITOR](#monitor) |
| AI-usage recorded in CHANGELOG (`security-checklist.md`) | 🟡 | [#AI](#ai) |

> **If the optional on-prem data tier is enabled**
> ([`PROD_NAS_DATA_TIER.md`](PROD_NAS_DATA_TIER.md) / [ADR-0006](adr/0006-optional-on-prem-data-tier.md)),
> Frontend §7 (centralized typed API client), §8 (error handling), and §1
> (graceful degradation) move from N/A to **applicable** — the guide builds them
> in (`src/lib/api.js`, the error boundary, loading/offline states).

---

## Action items

### <a id="test"></a>TEST — Automated testing (Frontend §12)
The model's top non-negotiable: tests as a CI merge/release gate.
- [x] Vitest + Testing Library scaffold with example unit/component tests ✅
- [x] Playwright E2E smoke (routes 200, deep-link refresh) + axe a11y scan ✅
- [x] Both wired into `ci.yml` as blocking steps ✅
- [x] Behaviour tests for the components with logic (Header, ThemeToggle,
      Layout scroll/focus, ButtonLink, route manifest ↔ pages ↔ sitemap) ✅
- [x] E2E covers every manifest route: loads, no JS errors, axe clean; plus a
      `@harness` self-check proving the error collector and the scan can fail
      (pattern from `templates/web-playwright/`) ✅
- [ ] Add a regression test for any future production defect
- Coverage target: behaviour on components with logic; page files are content
  and are not chased to 80% (conscious departure from the model).

### <a id="artifact"></a>ARTIFACT — Immutable promotion (Frontend §13 / SDS)
SDS wants the *same* build promoted DEV→QA→PROD; today prod rebuilds on the
runner and QA rebuilds on the NAS.
- [ ] Have `deploy-prod.yml` deploy the CI-built `dist` artifact instead of
      re-running `npm run build`
- [ ] Document QA-rebuilds-on-NAS as an accepted exception

### <a id="a11y"></a>A11Y — Accessibility (Frontend §9)
Good baseline already (semantic landmarks, `aria-*`, alt text).
- [x] "Skip to content" link (`Layout.jsx`) ✅
- [x] One global `:focus-visible` ring (gold, both themes) in `index.css` ✅
- [x] Focus moves to `<main>` and scroll resets on client-side navigation ✅
- [x] Active nav link carries `aria-current="page"` ✅
- [x] `eslint-plugin-jsx-a11y` in the lint gate ✅
- [x] axe scan on **every** route, all WCAG 2.x A/AA tags, fails on any
      violation (was: home only, critical only) ✅
- [ ] Manual checks, owner Adam, review quarterly: keyboard-only traversal,
      screen-reader announcement on route change, contrast on real content,
      200% zoom / reflow.

### <a id="obs"></a>OBS — Error handling & observability (Frontend §8)
- [x] Top-level React error boundary with a safe (no-stack-trace) fallback ✅
- [ ] Decide on a client telemetry sink (would widen CSP `connect-src`); until
      then the boundary logs locally — acceptable for a static site

### <a id="perf"></a>PERF — Performance (Frontend §11)
- [x] Route-level lazy loading (`src/pages/index.js`; shell ≈79 kB gzip, pages 1–4 kB) ✅
- [x] Above-the-fold content renders visible (`<Reveal immediate>`) so LCP is
      not gated on an IntersectionObserver + 500 ms fade ✅
- [x] `fetchpriority="high"` on the home hero image ✅
- [ ] Serve the profile image in a modern format (WebP/AVIF)
- [ ] Optional: a bundle-size budget check

### <a id="monitor"></a>MONITOR — Closing the loop (`closing-the-loop.md`)
- [ ] Prod uptime/synthetic check
- [ ] AWS Budgets alert (tracked as a GitHub issue)
- [ ] `docs/MONITORING.md` — success criteria + lessons learned per change

### <a id="adr"></a>ADR — Decision records (Dev Std §4)
- [x] `docs/adr/` created with template + records for the foundational
      decisions (no-backend, S3+CloudFront, ACM, Terraform, qa branch) ✅
- [x] ADR-0007 added for CI-driven gated provisioning + remote state ✅
- [ ] Add an ADR for each future significant decision

### <a id="precommit"></a>PRECOMMIT — Local validation (Dev Std §6)
- [x] husky + lint-staged: eslint on staged files pre-commit ✅

### <a id="pr"></a>PR — Pull-request template (Dev Std §7.2)
- [x] `.github/PULL_REQUEST_TEMPLATE.md` (frontend-adapted checklist) ✅

### <a id="gates"></a>GATES — Approval gates (`approval-gates.md`)
Two-person/CAB approval is impractical solo; the realization is a CI gate.
- [ ] Branch protection on `main` requiring the CI check before merge/deploy
- [x] PR flow is the gate; CHANGELOG records changes ✅
- [x] **Infra changes are gated** — the `production` GitHub Environment requires a
      reviewer before `infra.yml` runs `terraform apply` (ADR-0007) ✅

### <a id="ai"></a>AI — Assistant usage record (`security-checklist.md`)
- [x] CHANGELOG notes that the project is developed with AI assistance ✅

### <a id="ts"></a>TS — Type safety (Frontend §2) — **deferred by decision**
The model mandates a typed language. Deferred for now (owner decision,
2026-06-13). Lightest future path: JSDoc types + `checkJs`, then incremental
`.jsx`→`.tsx`. The content layer (`src/content/*.js`, 2026-09-12) is the first
place a type boundary will earn its keep — start there when it moves.

---

## Consciously waived (enterprise ceremony, solo personal project)

Recorded as decisions, not oversights:
- Formal requirements & design documents, separate test-report docs.
- Two-person / CAB production approval (impossible solo; see GATES).
- Operations runbook — covered by the `docs/*_SETUP.md` guides.
