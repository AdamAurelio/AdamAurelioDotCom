# Getting Started — what you provide & first-time setup

Most of this project sets itself up. This page covers the parts that **can't** be
automated — the accounts, credentials, and one-time bootstrap that only you can
do — and the exact order to do them in. Once these are done, every environment is
self-provisioning and self-deploying (see [`AUTOMATION.md`](AUTOMATION.md)).

---

## What only you can provide

These are the inputs automation cannot create for you:

| You provide | Why it's needed | Used by |
|---|---|---|
| **AWS account + admin credentials**, configured in the AWS CLI | The very first provisioning run mints the state bucket and the CI roles — they don't exist yet, so CI can't do it | One-time prod bootstrap |
| **A Route 53 public hosted zone** for `adamaurelio.com`, with your registrar's (Namecheap) **NS records delegated** to it | Terraform *looks up* this zone (it doesn't create it) to validate the ACM cert and add the alias records | `terraform apply` |
| **GitHub repo admin access** | To create the `production` environment, add the reviewer gate, and store config | Prod CI/CD |
| **`GH_PROVISION_TOKEN`** — a fine-grained GitHub PAT with **Variables: read/write** on this repo | Lets Terraform write the deploy Variables back to the repo; GitHub's built-in token can't | Infra workflow |
| **(Optional) A Synology NAS** with Container Manager + the repo on it | Hosts QA and the on-prem data tier | QA / data tier |

Everything else — the data-tier secrets (`POSTGRES_PASSWORD`, `API_KEY`), all the
repo Variables, the IAM roles, the state bucket — is **generated for you**.

## Tools to install (your machine)

| Tool | Version | For |
|---|---|---|
| Node.js | 20 LTS | dev, builds |
| Docker Desktop | current | dev/QA containers |
| Terraform | ≥ 1.10 | prod provisioning (needs native S3 state locking) |
| AWS CLI | v2 | bootstrap + apply |
| Git | current | everything |
| `gh` (optional) | current | scripting GitHub config |

`openssl` is only needed on the NAS (Git Bash ships it on Windows).

---

## 1. See it running (dev — 60 seconds)

```bash
npm install
npm run dev                                  # http://localhost:5173
# or, no local Node:
docker compose -f docker-compose.dev.yml up  # same URL
```

No accounts or secrets required. This is enough to develop the site.

---

## 2. Production (AWS) — one-time bootstrap

This is the only manual AWS work. After it, prod runs itself.

**Before you start, confirm the two prerequisites:**

```bash
aws sts get-caller-identity          # must succeed with an admin identity
aws route53 list-hosted-zones --query "HostedZones[?Name=='adamaurelio.com.']"
#   ^ must return a zone. If empty, create the hosted zone and point Namecheap's
#     NS records at it FIRST — Terraform looks the zone up, it won't create it.
```

**Step 1 — Create the Terraform state bucket** (idempotent):

```bash
./infra/scripts/bootstrap-state.sh
```

**Step 2 — First apply (local, admin creds).** This creates the whole stack
*including the CI provision role* and writes the deploy Variables to the repo:

```bash
cd infra/terraform
cp terraform.tfvars.example terraform.tfvars      # defaults already match this repo
# In terraform.tfvars, set:  manage_github_actions_config = true
export GITHUB_TOKEN=<your GH_PROVISION_TOKEN PAT>  # so Terraform can write repo Variables
terraform init
terraform apply                                    # review the plan, type yes
```

> The defaults (`domain_name`, `bucket_name = adamaurelio-com-prod`,
> `aws_region = us-east-1`, `github_repo`) already match this project — you can
> apply as-is. If a GitHub OIDC provider already exists in your AWS account, set
> `create_oidc_provider = false` and pass `existing_oidc_provider_arn` (only one
> is allowed per account).

**Step 3 — Finish the GitHub side** (the part the token can't gate):

1. **Settings → Environments → New environment → `production`**, and add
   **yourself as a Required reviewer**. This approval is the gate on every future
   `terraform apply` in CI.
2. **Settings → Secrets and variables → Actions → Secrets → New secret:**
   `GH_PROVISION_TOKEN` = your fine-grained PAT (Variables: read/write).
   *(The Variables — `S3_BUCKET`, `CLOUDFRONT_DISTRIBUTION_ID`,
   `AWS_DEPLOY_ROLE_ARN`, `AWS_PROVISION_ROLE_ARN`, `AWS_REGION` — were written
   by Step 2; confirm they're present.)*

**Verify:**

```bash
terraform output                 # website_url, role ARNs, etc.
# After DNS propagates (minutes to a couple hours on first setup):
curl -sI https://adamaurelio.com | grep -i content-security-policy
```

**From here on it's automatic:** merge to `main` → `deploy-prod.yml` builds and
ships the site; edit `infra/terraform/**` and merge → `infra.yml` runs a
**gated** `terraform apply` (your one-click approval). Full lifecycle in
[`AUTOMATION.md`](AUTOMATION.md).

---

## 3. QA + data tier (Synology NAS) — optional

**Prerequisites:** Container Manager installed (Package Center), SSH enabled, the
repo present on the NAS, `openssl` available.

```bash
# On the NAS, from the repo root:
./scripts/nas-bootstrap.sh
```

This generates `nas_data_tier/.env` with fresh secrets (first run only), brings
up the website (`:8080`) and the data tier (`:3001`), and health-checks both.

**Make it self-updating** — add two Synology Task Scheduler entries (user `root`,
every 5–10 min) so the NAS pulls and rebuilds itself when code moves:

```
.../scripts/qa-update.sh         >> /var/log/qa-update.log 2>&1
.../scripts/data-tier-update.sh  >> /var/log/data-tier-update.log 2>&1
```

Details (HTTPS via reverse proxy, the parity check, separate checkouts per
branch) are in [`QA_SYNOLOGY_SETUP.md`](QA_SYNOLOGY_SETUP.md).

---

## Setup checklist

```
Prod (AWS)
  [ ] AWS account + admin creds configured (aws sts get-caller-identity works)
  [ ] Route 53 hosted zone for the domain exists (NS delegated at registrar)
  [ ] terraform >=1.10, aws cli v2 installed
  [ ] ./infra/scripts/bootstrap-state.sh run
  [ ] terraform apply (first, local) succeeded
  [ ] GitHub: production environment created + yourself as required reviewer
  [ ] GitHub: GH_PROVISION_TOKEN secret added
  [ ] Variables present (S3_BUCKET, CLOUDFRONT_DISTRIBUTION_ID, *_ROLE_ARN, AWS_REGION)
  [ ] https://adamaurelio.com loads over HTTPS

QA + data tier (NAS, optional)
  [ ] Container Manager + SSH + repo on the NAS
  [ ] ./scripts/nas-bootstrap.sh run (both stacks healthy)
  [ ] Task Scheduler timers for qa-update.sh and data-tier-update.sh
```

If you get stuck on any AWS step, the narrated walkthrough is in
[`HOW_TO_SETUP.md`](HOW_TO_SETUP.md) and the resource-by-resource reference in
[`../infra/README.md`](../infra/README.md).
