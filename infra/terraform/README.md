# Production provisioning — Terraform

This module codifies the **entire** one-time AWS setup that
[`../README.md`](../README.md) describes as console clicks: the private S3
bucket, the ACM certificate (with DNS validation), CloudFront + OAC + SPA error
responses + security-headers policy, the Route 53 alias records, and the GitHub
OIDC roles the workflows assume — a least-privilege **deploy** role and a
broader, gated **provision** role.

After a one-time bootstrap, provisioning runs **in CI**: changes under
`infra/terraform/**` (or a manual run) trigger
[`.github/workflows/infra.yml`](../../.github/workflows/infra.yml), which does a
`terraform apply` behind the `production` Environment's required reviewer. Deploys
(`deploy-prod.yml`) are unchanged. `apply` is idempotent, so it both provisions
and self-heals. Full lifecycle: [`../../docs/AUTOMATION.md`](../../docs/AUTOMATION.md);
decision: [ADR-0007](../../docs/adr/0007-ci-driven-gated-provisioning.md).

## What it does *not* do

- **Register the domain** or create the Route 53 **hosted zone.** The zone must
  already exist (your registrar's NS records point at it); Terraform looks it up.
  With DNS in Route 53, cert validation and the alias records are fully automatic.
- **Build/upload the site.** That's the deploy workflow's job.

## Prerequisites

- [Terraform](https://developer.hashicorp.com/terraform/install) ≥ 1.10
  (native S3 state locking).
- AWS CLI configured with credentials that can create the resources above
  (run locally once — `aws configure` or `AWS_PROFILE=...`). OIDC handles CI; this
  initial apply needs real admin-ish creds.
- A Route 53 hosted zone for the domain.
- The remote-state bucket — create it once with
  [`../scripts/bootstrap-state.sh`](../scripts/bootstrap-state.sh) before the
  first `terraform init` (the S3 backend can't store state in a bucket that
  doesn't exist yet).

## Apply

```bash
./infra/scripts/bootstrap-state.sh             # once: create the state bucket
cd infra/terraform
cp terraform.tfvars.example terraform.tfvars   # edit if defaults don't fit
terraform init                                 # configures the S3 backend
terraform plan      # review
terraform apply
```

The certificate validation + CloudFront rollout takes a few minutes on first
apply; Terraform waits for the cert and prints the outputs when done.

## Wire up GitHub (two options)

The workflows read repo **Variables** (role ARNs are not secrets) plus one
**Secret**. Either:

**A — let Terraform do it.** Set `manage_github_actions_config = true` in
`terraform.tfvars`, export the PAT, and apply:

```bash
export GITHUB_TOKEN=<fine-grained PAT, Variables: read/write>
terraform apply
```

**B — copy them yourself.** Run `terraform output github_actions_config` /
`terraform output provision_role_arn` and set them in **Settings → Secrets and
variables → Actions**:

| Kind     | Name                         |
|----------|------------------------------|
| Variable | `AWS_REGION`                 |
| Variable | `S3_BUCKET`                  |
| Variable | `CLOUDFRONT_DISTRIBUTION_ID` |
| Variable | `AWS_DEPLOY_ROLE_ARN`        |
| Variable | `AWS_PROVISION_ROLE_ARN`     |
| Secret   | `GH_PROVISION_TOKEN` (the PAT above, for `infra.yml`) |

Then create the `production` environment (Settings → Environments) with yourself
as a **required reviewer** — that approval gates the Infra workflow's apply.

## First deploy

Push to `main` (or run the workflow manually from the Actions tab). Verify per
[`../../docs/PROD_AWS_SETUP.md`](../../docs/PROD_AWS_SETUP.md):
`curl -sI https://adamaurelio.com` should show every security header, and
deep-link refresh on `/resume` should work.

## State

State lives in a **remote S3 backend with native locking** (`versions.tf`), so
the same state is shared by local runs and the CI `infra.yml` apply. Create the
bucket once with [`../scripts/bootstrap-state.sh`](../scripts/bootstrap-state.sh)
(versioned + encrypted + private); `terraform init` then wires it up. If you are
migrating from an older local-state checkout, run `terraform init -migrate-state`.

## Notes & gotchas

- **OIDC provider is one-per-account.** If you (or another stack) already created
  `token.actions.githubusercontent.com`, set `create_oidc_provider = false` and
  pass `existing_oidc_provider_arn`, or the apply fails with EntityAlreadyExists.
- **Adopting existing resources?** If you already built any of this by hand,
  `terraform import` each resource before applying so Terraform manages rather
  than duplicates it.
- **Header parity.** The security headers here mirror `nginx.conf` (QA) and
  `infra/response-headers-policy.json`. Change all three together.
- **`terraform destroy`** tears prod down — the S3 bucket must be empty first
  (the deploy workflow fills it), so empty it before destroying.
