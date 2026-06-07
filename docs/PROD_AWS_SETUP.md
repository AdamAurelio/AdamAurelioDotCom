# Production Setup (AWS S3 + CloudFront)

Production is a static site on **S3** behind the **CloudFront** CDN — the
cheapest way to host a resume site on AWS while keeping room to grow.

**Cost:** ~$0.50–2/month for personal traffic. S3 stores a few MB; CloudFront's
first 1 TB/month transfer is free tier. (Route 53, if used for DNS, adds
$0.50/mo per hosted zone.)

## One-time provisioning

The full step-by-step (bucket, ACM cert, CloudFront, OAC, IAM/OIDC role) lives
in **[`infra/README.md`](../infra/README.md)**. Do that once. Summary:

1. Private S3 bucket (e.g. `adamaurelio-com-prod`), public access blocked.
2. ACM certificate in **us-east-1** for `adamaurelio.com` + `www`.
3. CloudFront distribution with:
   - the S3 bucket as origin via **Origin Access Control**,
   - HTTP→HTTPS redirect, default root object `index.html`,
   - **custom error responses** 403→`/index.html` (200) and 404→`/index.html`
     (200) so client-side routing works.
4. DNS pointing the domain at the CloudFront distribution.
5. An IAM role for GitHub OIDC with permission to write the bucket and create
   CloudFront invalidations.

> **Why ACM and not Let's Encrypt?** CloudFront only serves certificates that
> live in **ACM (us-east-1)** — you can't point it at a Let's Encrypt cert. You
> *can* import an external cert into ACM, but **ACM can't auto-renew imported
> certs**, so you'd have to manually re-import every ~60–90 days. The ACM-issued
> public cert above is free and auto-renews on its own, as long as its DNS
> validation CNAME stays in place. (QA on the Synology NAS is the opposite case —
> there Let's Encrypt *is* the right tool; see `QA_SYNOLOGY_SETUP.md`.)

## GitHub configuration

Settings → Secrets and variables → Actions:

**Secret**
- `AWS_ROLE_ARN` — the OIDC IAM role ARN.

**Variables**
- `AWS_REGION` — e.g. `us-east-1`
- `S3_BUCKET` — e.g. `adamaurelio-com-prod`
- `CLOUDFRONT_DISTRIBUTION_ID` — e.g. `EXXXXXXXXXXXXX`

Then create a **`production`** environment (Settings → Environments) — optional
approvals can be added here.

## Deploying

Deployment is automatic: **merge to `main`** and
`.github/workflows/deploy-prod.yml` runs:

1. `npm ci && npm run build`
2. Assume the AWS role via OIDC (no stored keys).
3. `aws s3 sync dist/ s3://$S3_BUCKET --delete` — long-cache fingerprinted
   assets, `no-cache` on `index.html`.
4. `aws cloudfront create-invalidation --paths "/*"`.

You can also trigger it manually from the Actions tab (`workflow_dispatch`).

## Verifying production

- https://adamaurelio.com loads over HTTPS (valid cert, HTTP redirects to HTTPS).
- Deep-link refresh (reload on `/resume`) works (CloudFront error-response rule).
- After a deploy, a hard refresh shows the new content (index.html is not cached;
  invalidation clears the CDN).

## Cost controls

- Stay on CloudFront's default price class or restrict to North America/Europe
  (`PriceClass_100`) to cap edge locations.
- Set an **AWS Budgets** alert (e.g. $5/mo) for peace of mind.
- No always-on compute or database = nothing accrues hourly charges.

## Rolling back

Re-run the workflow on a previous commit (Actions → Run workflow on a tag/SHA),
or revert the offending commit on `main` to trigger a fresh deploy.
