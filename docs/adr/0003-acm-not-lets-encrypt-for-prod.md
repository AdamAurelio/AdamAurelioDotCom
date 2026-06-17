# ADR-0003: ACM (not Let's Encrypt) for the production certificate

**Date:** 2026-05-31
**Status:** Accepted
**Decision maker:** Adam Aurelio

## Context

Production TLS terminates at CloudFront (see [ADR-0002](0002-s3-cloudfront-hosting.md)).
A certificate and an automated renewal story are required for `adamaurelio.com`
and `www`.

## Decision

Use a **public AWS Certificate Manager (ACM) certificate in us-east-1**, validated
by DNS. CloudFront references the ACM cert directly.

## Rationale

- CloudFront only serves certificates from **ACM in us-east-1** — it cannot point
  at a Let's Encrypt cert.
- ACM-issued public certs are free and **auto-renew on their own** as long as the
  DNS validation record stays in place — no renewal automation to build or babysit.
- Importing an external cert into ACM is possible but **ACM cannot auto-renew
  imported certs**, forcing a manual re-import every ~60–90 days.

## Consequences

**Positive:** zero-touch renewal; no ACME client, no open ports, no cron.
**Negative / trade-offs:** the cert must live in us-east-1 regardless of bucket
region; validation depends on the Route 53 record persisting.

## Alternatives considered

- **Let's Encrypt imported into ACM** — rejected: no auto-renew for imported
  certs; recurring manual toil.
- **Let's Encrypt at an origin server** — N/A: there is no origin server; the
  edge is CloudFront.

## Notes

QA on the Synology NAS is the opposite case — there **Let's Encrypt is** the right
tool (DNS-01 via Route 53). See [`QA_SYNOLOGY_SETUP.md`](../QA_SYNOLOGY_SETUP.md).
