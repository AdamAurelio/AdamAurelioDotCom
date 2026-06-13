# Production provisioning — Terraform

This module codifies the **entire** one-time AWS setup that
[`../README.md`](../README.md) describes as console clicks: the private S3
bucket, the ACM certificate (with DNS validation), CloudFront + OAC + SPA error
responses + security-headers policy, the Route 53 alias records, and the GitHub
OIDC role the deploy workflow assumes.

After one `terraform apply`, every push to `main` keeps deploying via
`.github/workflows/deploy-prod.yml` exactly as before — this only replaces the
manual provisioning, not the deploy.

## What it does *not* do

- **Register the domain** or create the Route 53 **hosted zone.** The zone must
  already exist (your registrar's NS records point at it); Terraform looks it up.
  With DNS in Route 53, cert validation and the alias records are fully automatic.
- **Build/upload the site.** That's the deploy workflow's job.

## Prerequisites

- [Terraform](https://developer.hashicorp.com/terraform/install) ≥ 1.5
- AWS CLI configured with credentials that can create the resources above
  (run locally once — `aws configure` or `AWS_PROFILE=...`). OIDC handles CI; this
  initial apply needs real admin-ish creds.
- A Route 53 hosted zone for the domain.

## Apply

```bash
cd infra/terraform
cp terraform.tfvars.example terraform.tfvars   # edit if defaults don't fit
terraform init
terraform plan      # review
terraform apply
```

The certificate validation + CloudFront rollout takes a few minutes on first
apply; Terraform waits for the cert and prints the outputs when done.

## Wire up GitHub (two options)

The deploy workflow needs one secret and three variables. Either:

**A — let Terraform do it.** Set `manage_github_actions_config = true` in
`terraform.tfvars`, export a token, and re-apply:

```bash
export GITHUB_TOKEN=ghp_xxx   # repo scope
terraform apply
```

**B — copy them yourself.** Run `terraform output github_actions_config` and put
the values in **Settings → Secrets and variables → Actions**:

| Kind     | Name                         |
|----------|------------------------------|
| Secret   | `AWS_ROLE_ARN`               |
| Variable | `AWS_REGION`                 |
| Variable | `S3_BUCKET`                  |
| Variable | `CLOUDFRONT_DISTRIBUTION_ID` |

Then create the `production` environment (Settings → Environments) so the deploy
job can attach to it.

## First deploy

Push to `main` (or run the workflow manually from the Actions tab). Verify per
[`../../docs/PROD_AWS_SETUP.md`](../../docs/PROD_AWS_SETUP.md):
`curl -sI https://adamaurelio.com` should show every security header, and
deep-link refresh on `/resume` should work.

## State

State is **local** by default (gitignored) — fine for a solo site. To share or
lock it, create a state bucket once and uncomment the `backend "s3"` block in
`versions.tf`, then `terraform init -migrate-state`.

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
