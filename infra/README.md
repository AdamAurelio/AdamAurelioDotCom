# Infrastructure — AWS S3 + CloudFront (Production)

One-time provisioning for the cheapest viable production hosting of a static
site. After this is set up, every push to `main` auto-deploys via
`.github/workflows/deploy-prod.yml`.

> **Automated path (recommended):** everything below is codified as Terraform in
> [`terraform/`](terraform/) — one `terraform apply` provisions the whole stack
> (and can even set the GitHub Actions variables). State lives in a remote S3
> backend created once by [`scripts/bootstrap-state.sh`](scripts/bootstrap-state.sh),
> and after a one-time bootstrap, `apply` runs in a **gated CI workflow**
> (`.github/workflows/infra.yml`). The full lifecycle is in
> [`../docs/AUTOMATION.md`](../docs/AUTOMATION.md); the decision in
> [ADR-0007](../docs/adr/0007-ci-driven-gated-provisioning.md). Use the manual
> console steps below only if you prefer clicking through, or to understand what
> each resource is. The two produce the same result.

**Expected cost:** ~$0.50–2/month for a personal-traffic resume site. The S3
storage is a few MB; CloudFront's first 1 TB/month of transfer is in the
perpetual free tier. The only guaranteed charge is the Route 53 hosted zone
($0.50/mo) if you use Route 53 for DNS.

---

## Architecture

```
Browser ──HTTPS──▶ CloudFront (CDN, ACM cert) ──OAC──▶ S3 bucket (private, static files)
                        │
                        └─ 403/404 → /index.html (SPA history fallback)
```

The S3 bucket stays **private**. CloudFront reaches it through an Origin Access
Control (OAC); the public never hits S3 directly.

---

## 1. Create the S3 bucket

1. S3 → Create bucket. Name it e.g. `adamaurelio-com-prod`.
2. Keep **Block all public access ON** (CloudFront uses OAC, not public access).
3. Leave static website hosting **off** — CloudFront serves the files.

## 2. Request an ACM certificate (must be in us-east-1)

CloudFront only uses certs from **us-east-1**, regardless of your bucket region.

1. ACM (N. Virginia / us-east-1) → Request public certificate.
2. Domains: `adamaurelio.com` and `www.adamaurelio.com`.
3. Validate via DNS (add the CNAME records ACM gives you to your DNS provider).

## 3. Create the CloudFront distribution

1. Origin: the S3 bucket. Choose **Origin access control settings (recommended)**
   and create an OAC. CloudFront will show a bucket policy to copy into the
   bucket (Permissions → Bucket policy).
2. Viewer protocol policy: **Redirect HTTP to HTTPS**.
3. Default root object: `index.html`.
4. Alternate domain names (CNAMEs): `adamaurelio.com`, `www.adamaurelio.com`.
5. Custom SSL certificate: the ACM cert from step 2.
6. **Custom error responses** (this is what makes client-side routing work):
   | HTTP error code | Response page path | HTTP response code |
   |-----------------|--------------------|--------------------|
   | 403             | /index.html        | 200                |
   | 404             | /index.html        | 200                |

## 4. DNS

Point the domain at the CloudFront distribution domain
(`dxxxxxxxxxxxxx.cloudfront.net`):
- **Route 53:** A/AAAA **alias** records → CloudFront distribution.
- **Other registrar / Cloudflare:** CNAME `www` → distribution domain; for the
  apex use an ALIAS/ANAME (or Cloudflare's CNAME flattening).

## 5. CI/CD IAM role (GitHub OIDC — no stored access keys)

1. IAM → Identity providers → Add provider → OpenID Connect:
   - Provider URL: `https://token.actions.githubusercontent.com`
   - Audience: `sts.amazonaws.com`
2. Create a role trusted by that provider, restricted to this repo, e.g. the
   trust condition:
   `token.actions.githubusercontent.com:sub = repo:AdamAurelio/AdamAurelioDotCom:ref:refs/heads/main`
3. Attach a least-privilege policy:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "S3Deploy",
      "Effect": "Allow",
      "Action": ["s3:ListBucket", "s3:PutObject", "s3:DeleteObject"],
      "Resource": [
        "arn:aws:s3:::adamaurelio-com-prod",
        "arn:aws:s3:::adamaurelio-com-prod/*"
      ]
    },
    {
      "Sid": "CloudFrontInvalidate",
      "Effect": "Allow",
      "Action": "cloudfront:CreateInvalidation",
      "Resource": "*"
    }
  ]
}
```

## 7. Security headers (CloudFront Response Headers Policy)

> **Why this is its own step:** production is S3 + CloudFront and **never uses
> `nginx.conf`** — that file only applies to the QA Docker container. Security
> headers in production must be attached at CloudFront via a **Response Headers
> Policy**, or the live site ships none. This is the primary technical security
> control for a static site, so don't skip it. The header values below must stay
> in sync with `nginx.conf` (QA validates the same set).

### Header set

| Header | Value |
|--------|-------|
| `Content-Security-Policy` | `default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self'; connect-src 'self'; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'none'; upgrade-insecure-requests` |
| `Strict-Transport-Security` | `max-age=63072000; includeSubDomains; preload` |
| `X-Frame-Options` | `DENY` |
| `X-Content-Type-Options` | `nosniff` |
| `Referrer-Policy` | `strict-origin-when-cross-origin` |
| `Permissions-Policy` | `camera=(), microphone=(), geolocation=(), interest-cohort=()` |

> **`connect-src 'self'`** is correct while the site is purely static. When the
> serverless API is added, widen it to the API origin (e.g.
> `connect-src 'self' https://api.adamaurelio.com`).

### Console steps
1. CloudFront → **Policies** → **Response headers** → **Create response headers policy**.
2. Under **Security headers**, enable Strict-Transport-Security (2 years,
   includeSubDomains, preload), X-Content-Type-Options (nosniff),
   X-Frame-Options (`DENY`), and Referrer-Policy (`strict-origin-when-cross-origin`).
3. Under **Custom headers**, add `Content-Security-Policy` and
   `Permissions-Policy` with the values above.
4. Attach the policy to the distribution's **default behavior**
   (Behaviors → Edit → Response headers policy).

### CLI alternative
```bash
aws cloudfront create-response-headers-policy \
  --response-headers-policy-config file://infra/response-headers-policy.json
# then attach its Id to the distribution's default cache behavior
# (ResponseHeadersPolicyId) via: aws cloudfront update-distribution ...
```
Verify after deploy: `curl -sI https://adamaurelio.com` should show every header above.

## 6. GitHub configuration

In the repo: Settings → Secrets and variables → Actions.

**Secrets:**
| Name                 | Value                                                     |
|----------------------|-----------------------------------------------------------|
| `GH_PROVISION_TOKEN` | Fine-grained PAT (*Variables: read/write*) for `infra.yml`|

**Variables:** (role ARNs are not secrets)
| Name                        | Value                                  |
|-----------------------------|----------------------------------------|
| `AWS_REGION`                | Bucket region, e.g. `us-east-1`        |
| `S3_BUCKET`                 | `adamaurelio-com-prod`                  |
| `CLOUDFRONT_DISTRIBUTION_ID`| `EXXXXXXXXXXXXX`                        |
| `AWS_DEPLOY_ROLE_ARN`       | Deploy role ARN (from step 5)          |
| `AWS_PROVISION_ROLE_ARN`    | Provision role ARN (gated apply)       |

Then create the `production` environment (Settings → Environments) with yourself
as a **required reviewer** — that approval gates the Infra workflow's apply.

---

## 8. Monitoring & alerts (`monitoring.tf`)

> **Off by default.** `enable_monitoring` is `false`, so this file applies
> nothing — the account stays empty until you opt in. Everything below describes
> what you get when you set it to `true`.

Deliberately narrow: there is no server to watch, so this answers two questions
only — *is the edge erroring?* and *is the bill moving?*

**Cost: $0 at this scale.** AWS gives you the first two Budgets free, the two
alarms sit inside CloudWatch's 10-alarm free tier, and SNS covers 1,000 email
notifications a month. Note also that `monthly_budget_usd` is a *notification
threshold*, not a spending commitment or a cap — it means "tell me if spend
approaches this", and it neither reserves nor charges anything.

| Resource | Fires when |
|----------|-----------|
| `adamaurelio-cloudfront-5xx` | 5xx rate > `cloudfront_5xx_threshold_percent` (default 1%) for 2×5 min. Usually an S3 origin or OAC problem. |
| `adamaurelio-cloudfront-4xx` | 4xx rate > `cloudfront_4xx_threshold_percent` (default 25%) for 3×5 min. Usually a broken deploy leaving assets missing. |
| `adamaurelio-monthly` budget | Spend passes 80% actual, or is forecast to pass 100%, of `monthly_budget_usd` (default $5). |

All three publish to the `adamaurelio-alerts` SNS topic. Everything lives in
us-east-1 — CloudFront only publishes metrics there, and Budgets only notifies
SNS topics there — via the `aws.us_east_1` aliased provider, so this stays
correct even if `aws_region` changes.

**To turn it on, enable it and set an address:**

```hcl
# terraform.tfvars
enable_monitoring = true
alert_email       = "you@example.com"
```

```bash
npm run tf:apply
```

AWS then emails a confirmation link. **Until it is clicked the subscription
stays `PendingConfirmation` and every alert is silently discarded** — the
`alerts_subscription_state` output repeats this after each apply.

There is intentionally no uptime/synthetic check. S3 + CloudFront failing
wholesale is an AWS-wide event, and a canary would cost more than it would ever
catch here.

---

## 9. Google Search Console

For a site whose job is to be found by name, *which queries surface you* is
worth more than a pageview count — and nothing but Search Console reports it.

**1. Verify the domain.** In Search Console choose **Domain** (not URL prefix)
and copy the TXT token it offers, then:

```hcl
# terraform.tfvars — the value only, without the "google-site-verification=" prefix
google_site_verification = "abc123def456..."
```

```bash
npm run tf:apply
```

Domain verification is preferred over the HTML-file and meta-tag methods: it
covers the apex and every subdomain at once, and no deploy can overwrite it.

> Route 53 permits only one TXT record set per name. If the apex ever needs
> other TXT values (SPF, DMARC), add them to `records` in `dns.tf` rather than
> creating a second resource.

**2. Submit the sitemap.** `public/sitemap.xml` is generated by
`npm run sitemap`, which runs automatically as `prebuild`, so it cannot go stale
relative to a release. `src/test/sitemap.test.js` fails the build if a route
exists in `src/App.jsx` but not in the sitemap. Submit `sitemap.xml` in Search
Console once; Google re-fetches it on its own thereafter.

Both files are deployed with a 1-day cache rather than the 1-year immutable TTL
used for fingerprinted assets — see the sync step in `deploy-prod.yml`.

---

## 10. Error monitoring (Sentry)

Wired in `src/lib/monitoring.js`, off unless a DSN is configured.

Set the `SENTRY_DSN` **repo Variable** (not a Secret — a DSN is designed to ship
inside the client bundle, so storing it as a secret would imply a
confidentiality it does not have). `deploy-prod.yml` passes it as
`VITE_SENTRY_DSN`, along with the commit SHA as `VITE_RELEASE`.

> ⚠ **Setting the DSN alone is not enough.** The site ships `connect-src 'self'`,
> so Sentry's ingest requests are blocked by CSP until its origin is added in
> **all four** places the policy is declared — §7 above lists them. Symptom: a
> clean console locally, and nothing ever arriving in Sentry from production.

The SDK is fetched only after an error actually occurs, so a healthy visit
downloads none of its ~147 kB. With no DSN configured the chunk is not even
emitted.

---

## Future: adding dynamic features without an always-on server

When you need a contact form, blog, or API, stay serverless to keep costs near
zero: **API Gateway + Lambda** (pay-per-request) with **DynamoDB** for storage.
The React app calls the API over HTTPS; the static hosting above is unchanged.
This avoids reintroducing an always-on VM/container or a managed database.
