# TODO — Getting to QA and Prod

Checklist of everything to complete before this site is live in QA (Synology)
and Prod (AWS). Items are ordered so each unblocks the next. Detailed how-to
lives in `docs/` and `infra/terraform/`; this is the tracking list.

Legend: `[ ]` todo · `[x]` done · ⚠️ gotcha worth reading before you start.

---

## 0. Shared prerequisites

- [ ] AWS account with admin-capable credentials available locally
      (`aws configure` or `AWS_PROFILE`). Needed once for `terraform apply`.
- [ ] Terraform ≥ 1.10 and AWS CLI installed (`terraform version`, `aws --version`).
- [ ] A fine-grained GitHub **PAT** with *Variables: read/write* on this repo,
      for `GH_PROVISION_TOKEN` (lets Terraform write the deploy Variables).
- [ ] Decide DNS host. **Recommended: delegate `adamaurelio.com` DNS to Route 53**
      (the domain stays registered at Namecheap). This makes prod's ACM cert and
      QA's Let's Encrypt cert both validate/renew through one provider.

---

## 1. DNS delegation (Namecheap → Route 53)

> ⚠️ The Terraform looks up an **existing** Route 53 hosted zone — it does not
> create the zone or change your registrar. Do this first or `apply` fails.

- [ ] Create the Route 53 **hosted zone** for `adamaurelio.com` (AWS console or CLI).
- [ ] Copy the 4 NS records Route 53 assigns to the zone.
- [ ] In Namecheap → Domain List → **Manage → Nameservers → Custom DNS**, replace
      the nameservers with those 4 Route 53 NS values.
- [ ] Wait for propagation (minutes to ~48h). Confirm: `dig NS adamaurelio.com`
      returns the Route 53 nameservers.

---

## 2. Prod — AWS S3 + CloudFront  (`infra/terraform/`)

- [ ] ⚠️ Check whether a GitHub OIDC provider already exists in the AWS account
      (only one per account is allowed). If yes, set `create_oidc_provider = false`
      and `existing_oidc_provider_arn` in `terraform.tfvars`.
- [ ] `./infra/scripts/bootstrap-state.sh` — create the remote-state S3 bucket
      (once, admin creds; the S3 backend needs it before `init`).
- [ ] `cd infra/terraform && cp terraform.tfvars.example terraform.tfvars`
      (defaults already match this repo; set `manage_github_actions_config = true`).
- [ ] `terraform init` (wires the S3 backend)
- [ ] `terraform plan` — review the resources.
- [ ] `export GITHUB_TOKEN=<GH_PROVISION_TOKEN PAT>` then `terraform apply` —
      provisions bucket, ACM cert (+ DNS validation), CloudFront, OAC,
      security-headers policy, IAM OIDC roles (deploy + provision), alias records,
      and writes the deploy Variables back to the repo.
- [ ] Create the `production` GitHub **Environment** (Settings → Environments)
      with yourself as a **required reviewer** — gates the `infra.yml` apply.
- [ ] Add the **secret** `GH_PROVISION_TOKEN` (the PAT) in Settings → Secrets.
- [ ] Confirm the Variables exist: `S3_BUCKET`, `CLOUDFRONT_DISTRIBUTION_ID`,
      `AWS_DEPLOY_ROLE_ARN`, `AWS_PROVISION_ROLE_ARN`, `AWS_REGION`.
- [ ] Trigger the first deploy: merge to `main`, or run **Deploy to Production**
      from the Actions tab (`workflow_dispatch`). Thereafter provisioning runs
      from `infra.yml` (gated) and deploys from `deploy-prod.yml`.
- [ ] Verify prod:
  - [ ] `https://adamaurelio.com` loads; HTTP redirects to HTTPS; cert valid.
  - [ ] Deep-link refresh on `/resume` works (403/404 → index.html).
  - [ ] `curl -sI https://adamaurelio.com` shows all 6 security headers.
- [ ] Set an **AWS Budgets** alert (e.g. $5/mo) as a cost tripwire.

**Cert maintenance (prod):** none — the ACM cert auto-renews as long as its
Route 53 validation record stays in place. ✅

---

## 3. QA — Synology NAS  (`docs/QA_SYNOLOGY_SETUP.md`)

- [ ] Install **Container Manager** (Package Center); enable SSH if using the CLI.
- [ ] Get the repo onto the NAS (Git Server clone or copy the folder).
- [ ] `./scripts/nas-bootstrap.sh` — one command: generates the data-tier `.env`
      secrets, brings up the website (:8080) **and** the data tier (:3001), and
      health-checks both. (Or `sudo docker compose -f docker-compose.qa.yml up -d --build` for website-only.)
- [ ] Verify the HTTP build:
  - [ ] `http://<nas-ip>:8080` — all 5 routes load.
  - [ ] Deep-link refresh on `/resume` works.
  - [ ] `curl http://localhost:8080/health` → `healthy`.
- [ ] Add Task Scheduler timers (user `root`, every 5–10 min) for
      `scripts/qa-update.sh` and `scripts/data-tier-update.sh` so the NAS
      self-updates (both change-aware). See `docs/QA_SYNOLOGY_SETUP.md`.

### QA HTTPS + automated cert renewal

- [ ] Create `qa.adamaurelio.com` DNS record in Route 53 pointing at the NAS
      (use Synology **DDNS** if your home IP is dynamic, then CNAME to it).
- [ ] Choose a Let's Encrypt method:
  - [ ] **DNS-01 via Route 53 (recommended)** — `acme.sh --dns dns_aws`, no open
        ports, auto-renews via cron, deploys into DSM. Steps in
        `docs/QA_SYNOLOGY_SETUP.md` → *Automating renewal*.
        - [ ] Create a least-privilege AWS key scoped to the hosted zone's
              Route 53 record changes (do **not** reuse the prod deploy role).
  - [ ] **HTTP-01 via DSM built-in** — simpler, but requires ports 80+443
        forwarded to the NAS permanently (renewal breaks if that lapses).
- [ ] Reverse proxy: `https://qa.adamaurelio.com:443` → `http://localhost:8080`,
      attach the cert (Control Panel → Login Portal → Advanced → Reverse Proxy).
- [ ] Confirm auto-renewal works:
      `~/.acme.sh/acme.sh --renew -d qa.adamaurelio.com --force` (DNS-01 path).
- [ ] ⚠️ If opening ports to the NAS: keep DSM patched, enable firewall +
      auto-block.

> Namecheap note: Namecheap's DNS API *can* do DNS-01, but it's gated (20+
> domains, or $50 balance, or $50 spent in 2 yrs, + IP allowlist). Using Route 53
> sidesteps that — see the table in `docs/QA_SYNOLOGY_SETUP.md`.

---

## 4. Parity & housekeeping

- [ ] Run the parity check against live QA:
      `./scripts/qa-parity-check.ps1 -QaUrl https://qa.adamaurelio.com`
      (an empty diff = QA mirrors prod).
- [ ] ⚠️ Security headers are hand-maintained in **three** places — keep them in
      sync: `infra/response-headers-policy.json` (and the Terraform
      `cloudfront.tf` policy), `nginx.conf` (QA Docker), and the Web Station
      `.htaccess` if used.
- [ ] Commit the new `infra/terraform/` module + doc updates.
- [x] Terraform state is in a remote, locked S3 backend by default (created by
      `infra/scripts/bootstrap-state.sh`) — shared by local runs and CI. ✅
