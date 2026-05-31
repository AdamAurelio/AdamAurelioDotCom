# Security Policy & Posture

This records the security posture of **AdamAurelio.com** and maps it to the
ISO 27001 / OWASP control set used in my professional work, so my personal
development process stays consistent with it.

> **Scope note:** This is a personal website and is **not** part of any
> corporate Information Security Management System (ISMS). The mapping below
> applies that same engineering discipline voluntarily; it is not a formal
> compliance attestation.

**Last reviewed:** 2026-05-31 · **Review cycle:** on each significant
architecture change (e.g. adding a backend/database), otherwise annually.

---

## Asset & data classification

| Property | Value |
|----------|-------|
| Asset type | Public, static single-page website (React + Vite → S3/CloudFront) |
| Data classification | **PUBLIC** — only published resume/marketing content |
| User accounts / authentication | None |
| User input / forms | None (no data is submitted or stored) |
| Personal data (PII) processed | None |
| Secrets shipped to the browser | None |
| Backend / database | None (static only) |

Because the asset is PUBLIC and stateless, the highest-risk control families in
the enterprise checklist — access control, encryption at rest, SQL injection,
audit trails, secrets in code — **do not apply by design**. The security
strategy is *minimized attack surface*: there is nothing server-side to attack.

---

## Control mapping (OWASP 2021 / ISO 27001 Annex A)

| Control | Applicability | Status / Implementation |
|---------|---------------|-------------------------|
| A01 Broken Access Control | N/A | No auth or protected resources |
| A02 Cryptographic Failures — in transit | Applies | HTTPS enforced (CloudFront HTTP→HTTPS redirect, ACM cert); **HSTS** via response-headers policy |
| A02 — at rest | N/A | Only public data |
| A03 Injection — XSS | Applies (XSS only) | React auto-escapes JSX; no `dangerouslySetInnerHTML`; CSP as defense-in-depth |
| A03 Injection — SQL | N/A | No database or dynamic queries |
| A04 Insecure Design | Applies | Deliberate no-backend / no-secrets design = minimal attack surface |
| A05 Security Misconfiguration | Applies | Security headers (CSP, HSTS, X-Frame-Options `DENY`, nosniff, Referrer-Policy, Permissions-Policy) — prod via CloudFront Response Headers Policy, QA via `nginx.conf` |
| A06 Vulnerable/Outdated Components | Applies | `npm audit --audit-level=high` in CI |
| A07 Identification/Auth Failures | N/A | No authentication |
| A08 Software/Data Integrity | Applies | All code in Git; PR-reviewed; CI gate; deploy via **GitHub OIDC** (no stored AWS keys); secret scanning (gitleaks) in CI |
| A09 Logging/Monitoring | Partial | Low risk (static/public). Optional: enable CloudFront access logs + an AWS Budgets alert |
| A10 SSRF | N/A | No server-side request issuance |
| ISO A.12.3 Backup/Recovery | Applies | Fully reproducible from Git; S3 versioning optional |
| ISO A.14 Secure Development | Applies | `.env*` gitignored; secret + dependency scanning in CI; documented SDLC in `docs/` |
| ISO 5.x Information Classification | Applies | Classified **PUBLIC** (this document) |

---

## Security headers

The canonical header set and how to apply it are documented in
[`infra/README.md` §7](infra/README.md) (production / CloudFront) and mirrored in
[`nginx.conf`](nginx.conf) (QA). The two **must stay in sync** — QA exists to
validate the exact headers before they reach production. Verify with:

```bash
curl -sI https://adamaurelio.com
```

---

## When a backend/database is added (future)

The static design is what keeps most controls N/A. Introducing the planned
serverless API + database (see `docs/ARCHITECTURE.md`) **re-activates** them, and
they should be designed in from the first endpoint — not retrofitted:

- **Auth & access control** (A01/A07) on any non-public endpoint
- **Input validation** server-side (A03) on every parameter
- **Secrets** in AWS Secrets Manager / KMS — never in client code or env files
- **Audit logging** of data modifications (A09 / ISO A.12.4)
- **Encryption at rest** for any non-public data (A02)
- **`connect-src`** in the CSP widened to the API origin only
- Run the full security review checklist against the new tier before launch.

---

## Reporting a vulnerability

Found a security issue? Email **adam.aurelio@gmail.com** with details and steps
to reproduce. As a personal project there is no formal SLA, but reports are
appreciated and will be addressed on a best-effort basis.
