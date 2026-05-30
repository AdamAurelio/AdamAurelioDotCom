# Infrastructure — AWS S3 + CloudFront (Production)

One-time provisioning for the cheapest viable production hosting of a static
site. After this is set up, every push to `main` auto-deploys via
`.github/workflows/deploy-prod.yml`.

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

## 6. GitHub configuration

In the repo: Settings → Secrets and variables → Actions.

**Secrets:**
| Name           | Value                                              |
|----------------|----------------------------------------------------|
| `AWS_ROLE_ARN` | ARN of the IAM role from step 5                    |

**Variables:**
| Name                        | Value                                  |
|-----------------------------|----------------------------------------|
| `AWS_REGION`                | Bucket region, e.g. `us-east-1`        |
| `S3_BUCKET`                 | `adamaurelio-com-prod`                  |
| `CLOUDFRONT_DISTRIBUTION_ID`| `EXXXXXXXXXXXXX`                        |

Then create the `production` environment (Settings → Environments) so the
deploy job can attach to it.

---

## Future: adding dynamic features without an always-on server

When you need a contact form, blog, or API, stay serverless to keep costs near
zero: **API Gateway + Lambda** (pay-per-request) with **DynamoDB** for storage.
The React app calls the API over HTTPS; the static hosting above is unchanged.
This avoids reintroducing an always-on VM/container or a managed database.
