# ADR-0004: Terraform for production provisioning

**Date:** 2026-06-13
**Status:** Accepted
**Decision maker:** Adam Aurelio

## Context

The production stack (bucket, ACM cert, CloudFront + OAC, security-headers
policy, IAM OIDC role, Route 53 records) was originally a manual AWS-console
walkthrough documented in `infra/README.md`. Manual provisioning is
non-reproducible, error-prone, and undocumented as state.

## Decision

Codify the entire one-time provisioning as a **Terraform module** under
[`infra/terraform/`](../../infra/terraform/). One `terraform apply` replaces the
console walkthrough; the manual steps remain as reference/fallback.

## Rationale

- Reproducible and destroyable infrastructure; the config *is* the documentation.
- Route 53 DNS makes ACM validation and alias records fully automatic.
- Optional GitHub provider can set the repo's Actions secret/variables too,
  automating even the wiring step.
- Aligns with the ADAM model's IaC / "reproducible from Git" expectation.

## Consequences

**Positive:** one-command provisioning; drift is visible; easy teardown/rebuild.
**Negative / trade-offs:** introduces Terraform as a tool to install; state must
live somewhere (local by default, S3 backend optional); the first `apply` needs
admin-grade AWS credentials run locally once.

## Alternatives considered

- **Manual console (status quo)** — kept only as documented fallback; not
  reproducible.
- **AWS CDK / CloudFormation** — viable; Terraform chosen for the cleanest HCL and
  the largest example base for this exact S3+CloudFront pattern.

## Notes

The deploy pipeline (`deploy-prod.yml`) is unchanged — Terraform replaces
*provisioning*, not *deployment*.
