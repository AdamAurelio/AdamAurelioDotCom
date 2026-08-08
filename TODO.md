# TODO — project tracker

Tracking list for this site. Detailed how-to lives in `docs/` and
`infra/terraform/`; this file tracks *state*, not instructions.

Legend: `[x]` done · `[ ]` todo · `[?]` **needs your confirmation** (done in the
real world, but not verifiable from the repo) · ⚠️ gotcha worth reading first.

_Last reconciled against the repo: 2026-08-08._

---

## Status at a glance

| Environment | State | Evidence |
|---|---|---|
| **Dev** | ✅ Working | `npm run dev`; lint + unit tests + build all green |
| **Prod** (AWS S3 + CloudFront) | ✅ **LIVE, auto-deploying** | `deploy-prod.yml` runs #6–#9 succeeded (latest 2026-08-04) |
| **QA** (Synology NAS) | ⬜ Not started | no evidence of a NAS bootstrap |

---

## 0–2. Prod — AWS S3 + CloudFront ✅ COMPLETE

Production provisioned and deploying itself. Every merge to `main` ships via
`deploy-prod.yml`; infra changes go through the gated `infra.yml` apply.

The following are **proven done** by the fact that `deploy-prod` reaches the AWS
upload step — its pre-flight guard fails the run unless the Terraform-written
repo Variables exist, and the ACM cert + CloudFront alias can't exist without a
delegated Route 53 zone:

- [x] AWS account with admin-capable credentials (used for the first apply).
- [x] Terraform ≥ 1.10 and AWS CLI installed.
- [x] DNS: Route 53 hosted zone for `adamaurelio.com` + NS delegated at Namecheap.
- [x] GitHub OIDC provider resolved (`create_oidc_provider` / existing ARN).
- [x] `./infra/scripts/bootstrap-state.sh` — remote-state S3 bucket created.
- [x] `infra/terraform/terraform.tfvars` created from the example.
- [x] `terraform init` / `plan` / `apply` — bucket, ACM cert (+ DNS validation),
      CloudFront, OAC, security-headers policy, IAM OIDC roles, alias records.
- [x] Deploy Variables present: `S3_BUCKET`, `CLOUDFRONT_DISTRIBUTION_ID`,
      `AWS_DEPLOY_ROLE_ARN`, `AWS_REGION` (the guard passes).
- [x] First production deploy triggered and succeeded.
- [x] Terraform state in a remote, locked S3 backend, shared by local runs + CI.
- [x] ⚠️ OIDC `sub` mismatch resolved — the deploy job intentionally declares
      **no** `environment:`, because that would rewrite the token subject to
      `repo:…:environment:<name>` and break `AssumeRole`
      (commit `0084fc4`). The human gate lives on `infra.yml`'s apply instead.

**Cert maintenance:** none — ACM auto-renews while its Route 53 validation
record stays in place. ✅

### Confirm these (can't be verified from the repo)

- [?] `production` GitHub **Environment** exists with you as a **required
      reviewer** — this is the approval gate on `infra.yml`'s apply. Worth
      double-checking, since the *deploy* job no longer references it.
- [?] `GH_PROVISION_TOKEN` secret present (needed for CI-side Terraform to write
      repo Variables), and the `AWS_PROVISION_ROLE_ARN` Variable exists.
- [?] Browser verification of prod:
  - [?] `https://adamaurelio.com` loads; HTTP → HTTPS; cert valid.
  - [?] Deep-link refresh on `/resume` works (403/404 → `index.html`).
  - [?] `curl -sI https://adamaurelio.com` shows all 6 security headers.
- [ ] Set an **AWS Budgets** alert (e.g. $5/mo) as a cost tripwire.

---

## 3. QA — Synology NAS  (`docs/QA_SYNOLOGY_SETUP.md`) ⬜ NOT STARTED

Optional. Prod does not depend on this.

- [ ] Install **Container Manager** (Package Center); enable SSH if using the CLI.
- [ ] Get the repo onto the NAS (Git Server clone or copy the folder).
- [ ] `./scripts/nas-bootstrap.sh` — generates the data-tier `.env` secrets,
      brings up the website (:8080) **and** the data tier (:3001), health-checks
      both. (Or `docker compose -f docker-compose.qa.yml up -d --build` for
      website-only.)
- [ ] Verify the HTTP build:
  - [ ] `http://<nas-ip>:8080` — all 6 routes load.
  - [ ] Deep-link refresh on `/resume` works.
  - [ ] `curl http://localhost:8080/health` → `healthy`.
- [ ] Add Task Scheduler timers (user `root`, every 5–10 min) for
      `scripts/qa-update.sh` and `scripts/data-tier-update.sh` so the NAS
      self-updates (both change-aware).

### QA HTTPS + automated cert renewal

- [ ] Create `qa.adamaurelio.com` DNS record in Route 53 pointing at the NAS
      (use Synology **DDNS** if your home IP is dynamic, then CNAME to it).
- [ ] Choose a Let's Encrypt method:
  - [ ] **DNS-01 via Route 53 (recommended)** — `acme.sh --dns dns_aws`, no open
        ports, auto-renews via cron, deploys into DSM.
        - [ ] Create a least-privilege AWS key scoped to that hosted zone's
              record changes (do **not** reuse the prod deploy role).
  - [ ] **HTTP-01 via DSM built-in** — simpler, but needs ports 80+443 forwarded
        permanently (renewal breaks if that lapses).
- [ ] Reverse proxy `https://qa.adamaurelio.com:443` → `http://localhost:8080`,
      attach the cert (Control Panel → Login Portal → Advanced → Reverse Proxy).
- [ ] Confirm auto-renewal: `~/.acme.sh/acme.sh --renew -d qa.adamaurelio.com --force`.
- [ ] ⚠️ If opening ports to the NAS: keep DSM patched, enable firewall + auto-block.

> Namecheap note: its DNS API *can* do DNS-01, but it's gated (20+ domains, or
> $50 balance, or $50 spent in 2 yrs, + IP allowlist). Route 53 sidesteps that.

---

## 4. Site & code backlog

Open items found in the current codebase.

- [ ] **Verify the GitHub profile URL before it ships.** `Header.jsx` carries a
      literal `NOTE: verify this GitHub username points at your real profile`.
      `https://github.com/adamaurelio` is hardcoded in **three** places —
      `src/components/Header.jsx`, `src/components/Footer.jsx`,
      `src/pages/Contact.jsx`. Verify it resolves, then hoist it into one shared
      constant so it can't drift.
- [ ] **CI doesn't gate the branch you actually work on.** `ci.yml` triggers on
      pushes to `dev` and PRs into `dev`/`main`, but recent work merges from
      `develop`. Direct pushes to `main` (e.g. `500e010`) reach production with
      no CI run at all. Add `develop` to the triggers.
- [ ] ⚠️ **Security headers are hand-maintained in three places** — keep in sync:
      `infra/response-headers-policy.json` (+ the Terraform `cloudfront.tf`
      policy), `nginx.conf` (QA Docker), and any Web Station `.htaccess`.
- [ ] Run the QA parity check once QA exists:
      `./scripts/qa-parity-check.ps1 -QaUrl https://qa.adamaurelio.com`
      (empty diff = QA mirrors prod).
- [ ] Résumé content: confirm CompTIA cert expiry wording (site says *valid
      through 2029*; `docs/Resume Text.md` still says 2026 — the source doc is
      the stale one).

---

## 5. Ideas / not scheduled

- [ ] Writing or blog section (the site is structured to grow into it).
- [ ] Add unit/component tests for the newer pages (`HowIWork`, `Projects`,
      `About`, `Contact`) — currently only `App` and `ErrorBoundary` are covered.
- [ ] Open-graph preview image per page (currently all routes share `profile.jpg`).
