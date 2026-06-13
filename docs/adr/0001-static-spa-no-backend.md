# ADR-0001: Static SPA, no backend or database

**Date:** 2026-05-29
**Status:** Accepted
**Decision maker:** Adam Aurelio

## Context

The site began as a scaffolded Django + Express + PostgreSQL stack. The actual
product is a personal résumé and portfolio — published, public content with no
user accounts, no forms that store data, and no dynamic per-user views. The
backend stack was unused but was the only component incurring recurring cost (an
always-on VM/DB) and the largest maintenance and security surface.

## Decision

Ship the site as a **static single-page application** (React compiled by Vite to
plain HTML/CSS/JS), with **no server and no database**. Remove the Django,
Express, and PostgreSQL scaffolding entirely.

## Rationale

- Résumé content is static; a runtime server adds cost and risk with no benefit.
- A static bundle is trivially cacheable on a CDN — fast and effectively
  infinitely scalable.
- Removing the backend eliminates the only hourly-billed resource and most of
  the OWASP/ISO control families (auth, SQLi, secrets, encryption-at-rest)
  become N/A by design — see [`SECURITY.md`](../../SECURITY.md).

## Consequences

**Positive:** ~$0–2/mo hosting; minimal attack surface; nothing to patch at
runtime; reproducible from Git.
**Negative / trade-offs:** dynamic features (contact form, blog, API) now require
a deliberate, separate addition.

## Alternatives considered

- **Keep the Django/Postgres stack** — rejected: ongoing cost and maintenance for
  capability the site doesn't use.
- **Server-rendered framework (Next.js/Remix)** — rejected: needs a runtime host;
  unnecessary for static content.

## Notes

The documented growth path is **serverless** (API Gateway + Lambda + DynamoDB/SES)
so the static hosting stays untouched when dynamic features are eventually needed
— see [`ARCHITECTURE.md`](../ARCHITECTURE.md) and [`SECURITY.md`](../../SECURITY.md).
