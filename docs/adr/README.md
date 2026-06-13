# Architecture Decision Records (ADRs)

Short documents capturing **significant** technical decisions: the context, the
choice, and the consequences — so the "why" survives. Per the ADAM model's
Development Standards §4.

## Convention

- One file per decision: `NNNN-kebab-title.md` (zero-padded sequence).
- Use [`_template.md`](_template.md) as the starting point.
- Status flows: `Proposed → Accepted → (later) Superseded by ADR-XXXX`.
- ADRs are immutable once Accepted — to change a decision, add a new ADR that
  supersedes the old one rather than editing history.

## Index

| ADR | Title | Status |
|-----|-------|--------|
| [0001](0001-static-spa-no-backend.md) | Static SPA, no backend or database | Accepted |
| [0002](0002-s3-cloudfront-hosting.md) | Host production on S3 + CloudFront | Accepted |
| [0003](0003-acm-not-lets-encrypt-for-prod.md) | ACM (not Let's Encrypt) for the production cert | Accepted |
| [0004](0004-terraform-for-provisioning.md) | Terraform for production provisioning | Accepted |
| [0005](0005-qa-on-synology-pull-based.md) | QA on Synology, pull-based (not a push pipeline) | Accepted |
