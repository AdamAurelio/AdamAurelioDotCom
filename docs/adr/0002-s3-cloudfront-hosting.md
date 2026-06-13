# ADR-0002: Host production on S3 + CloudFront

**Date:** 2026-05-29
**Status:** Accepted
**Decision maker:** Adam Aurelio

## Context

Following [ADR-0001](0001-static-spa-no-backend.md), production needs only to
serve a folder of static files over HTTPS, globally, cheaply. The site is a
client-routed SPA, so the host must also serve `index.html` for unknown paths.

## Decision

Serve production from a **private S3 bucket behind CloudFront**, with the bucket
reachable only via an Origin Access Control (OAC). CloudFront terminates TLS,
redirects HTTP→HTTPS, and uses custom error responses (403/404 → `/index.html`,
200) for SPA history fallback.

## Rationale

- Cost is ~$0.50–2/mo; CloudFront's first 1 TB/month transfer is free tier.
- Global edge caching — fast everywhere, scales automatically, no servers.
- Private bucket + OAC keeps S3 off the public internet (no public-bucket risk).
- Security headers attach at the edge via a CloudFront Response Headers Policy,
  kept in parity with the QA `nginx.conf`.

## Consequences

**Positive:** near-zero cost, no runtime to operate, strong cache story.
**Negative / trade-offs:** SPA fallback is expressed as CloudFront error-response
rules (different mechanism than nginx `try_files`); cache invalidation is needed
on deploy for `index.html`.

## Alternatives considered

- **S3 static website hosting (no CloudFront)** — rejected: no TLS for custom
  domains, no edge cache, public bucket.
- **Netlify/Vercel/GitHub Pages** — viable, but S3+CloudFront keeps everything in
  one AWS account with full control and a clean serverless growth path.
