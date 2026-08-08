# Status & tracking

Where things stand, and where work is tracked. This file is deliberately short —
it points at the real sources rather than duplicating them (the previous version
drifted badly out of date precisely because it restated the runbook).

_Last reconciled against the repo: 2026-08-08._

---

## Status at a glance

| Environment | State | Evidence |
|---|---|---|
| **Dev** | ✅ Working | `npm run dev`; lint + unit tests + build green |
| **Prod** (AWS S3 + CloudFront) | ✅ **LIVE, auto-deploying** | `deploy-prod.yml` runs #6–#9 succeeded (latest 2026-08-04) |
| **QA** (Synology NAS) | ⬜ Not started | optional; prod does not depend on it |

---

## Where work is tracked

| What | Where |
|---|---|
| **Open work** — features, bugs, chores | **GitHub Issues**, on the repo's **Projects** board |
| **How to set up an environment** | [`docs/GETTING_STARTED.md`](docs/GETTING_STARTED.md) — the from-scratch runbook |
| **Narrated walkthrough** | [`docs/HOW_TO_SETUP.md`](docs/HOW_TO_SETUP.md) |
| **How the automation works** | [`docs/AUTOMATION.md`](docs/AUTOMATION.md) |
| **What changed, when** | [`CHANGELOG.md`](CHANGELOG.md) |

Rule of thumb: **instructions live in `docs/`, work items live on the board.**
If you're about to add a checkbox here, it probably wants to be an issue.

---

## Production — notes worth keeping

- ⚠️ **Don't add `environment:` to the deploy job** in `deploy-prod.yml`. The
  deploy role's OIDC trust policy expects
  `sub = repo:…:ref:refs/heads/main`; declaring an environment rewrites the
  token subject to `repo:…:environment:<name>` and breaks `AssumeRole`
  (learned the hard way — commit `0084fc4`). The human-approval gate belongs on
  `infra.yml`'s apply job instead.
- ⚠️ **Security headers are hand-maintained in three places** — keep them in
  sync: `infra/response-headers-policy.json` (+ the Terraform `cloudfront.tf`
  policy), `nginx.conf` (QA Docker), and any Web Station `.htaccess`.
- **Cert maintenance:** none. ACM auto-renews while its Route 53 validation
  record stays in place.

---

## QA — Synology NAS (not started, optional)

Tracked here rather than on the board because it's one sequential setup pass,
not ongoing work. Full instructions: [`docs/QA_SYNOLOGY_SETUP.md`](docs/QA_SYNOLOGY_SETUP.md).

- [ ] Install **Container Manager** (Package Center); enable SSH if using the CLI.
- [ ] Get the repo onto the NAS (Git Server clone or copy the folder).
- [ ] `./scripts/nas-bootstrap.sh` — generates data-tier `.env` secrets, brings
      up the website (:8080) and the data tier (:3001), health-checks both.
- [ ] Verify: all 6 routes load · deep-link refresh on `/resume` works ·
      `curl http://localhost:8080/health` → `healthy`.
- [ ] Task Scheduler timers (user `root`, every 5–10 min) for
      `scripts/qa-update.sh` and `scripts/data-tier-update.sh`.
- [ ] HTTPS: `qa.adamaurelio.com` in Route 53 → NAS (Synology **DDNS** if your
      IP is dynamic), Let's Encrypt via **DNS-01 / Route 53** (no open ports,
      auto-renews), reverse proxy `:443` → `http://localhost:8080`.
  - [ ] Use a least-privilege AWS key scoped to that zone's records — do **not**
        reuse the prod deploy role.
- [ ] Run the parity check: `./scripts/qa-parity-check.ps1 -QaUrl https://qa.adamaurelio.com`
      (empty diff = QA mirrors prod).
