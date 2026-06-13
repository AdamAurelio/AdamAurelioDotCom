# ADR-0006: Optional on-prem data tier (NAS-hosted API + database)

**Date:** 2026-06-13
**Status:** Accepted
**Decision maker:** Adam Aurelio
**Amends:** [ADR-0001](0001-static-spa-no-backend.md)

## Context

[ADR-0001](0001-static-spa-no-backend.md) made the site a pure static SPA with no
backend or database. A new goal is the *option* to back dynamic content with data
that stays **on-premise** (Synology NAS) rather than in the cloud. A static site
cannot query a database directly — a browser can't open DB connections, and a key
shipped in a public bundle isn't secret — so an API tier is unavoidable.

## Decision

Add an **opt-in** data tier where **both the API and the database run on the NAS**.
The browser calls `https://api.adamaurelio.com` over HTTPS through a **Synology
reverse proxy** (port 443 only); the API (Node/Express) talks to **PostgreSQL** on
the internal Docker network. The database port is never exposed. Auth is an
**API key** (with the public-SPA caveat below). Full guide:
[`PROD_NAS_DATA_TIER.md`](../PROD_NAS_DATA_TIER.md).

The static-tier hosting (S3 + CloudFront) and the no-backend default are
unchanged; the data tier lives **outside** this repo and is disabled by default.

## Rationale

- Keeps the user's data physically local while the global static site stays on a
  CDN.
- Exposing only an HTTPS API (not the DB) minimizes attack surface; reverse proxy
  + Let's Encrypt reuse the QA DNS-01 mechanism already in place.
- API + DB co-located on the NAS avoids a cloud→home tunnel back into the LAN.

## Consequences

**Positive:** data stays on-prem; DB unreachable from the internet; fully
reversible to the ADR-0001 posture.
**Negative / trade-offs:**
- **Availability** — prod dynamic features now depend on home NAS/internet uptime;
  the SPA must degrade gracefully (Frontend §1/§8).
- **Re-activates controls** ADR-0001 made N/A: auth (A01/A07), input validation
  (A03), logging, and a data-classification change beyond PUBLIC — update
  `SECURITY.md` when enabling.
- **Auth caveat** — an API key in a public SPA is not secret; private data needs
  real user auth (OIDC) or owner-only tooling, not the public bundle.
- **Backups** become the owner's responsibility (was previously stateless).
- CSP `connect-src` must widen to the API origin across all three parity surfaces.

## Alternatives considered

- **Cloud API (Lambda/API GW) reaching back to the NAS DB** — rejected: needs a
  tunnel/VPN into the home LAN; fragile (dynamic IP/NAT) and partly defeats
  "keep data local."
- **Managed cloud DB (DynamoDB/RDS)** — rejected for this goal: data would live in
  the cloud, which is exactly what this decision avoids. Remains the documented
  path if on-prem availability becomes a problem.
- **Zero-exposed-port tunnel (Cloudflare/Tailscale)** instead of the 443 reverse
  proxy — viable and noted in the guide; reverse proxy chosen for simplicity.
