# ADR-0007: CI-driven, gated production provisioning with remote state

**Date:** 2026-06-16
**Status:** Accepted
**Decision maker:** Adam Aurelio

## Context

[ADR-0004](0004-terraform-for-provisioning.md) codified production provisioning
as Terraform but left two things manual: `terraform apply` was run by a human
with **local state**, and the deploy pipeline (`deploy-prod.yml`) assumed the
infrastructure already existed (it reads `S3_BUCKET` / `CLOUDFRONT_DISTRIBUTION_ID`
from repo Variables and fails if they are unset). The goal now is a clean,
repeatable system where an un-provisioned environment **sets itself up** and the
whole lifecycle is automated — without giving CI unsupervised power to rewrite
IAM and CDN config.

## Decision

Run Terraform **in CI** via a new gated workflow (`.github/workflows/infra.yml`):

- **PRs** touching `infra/terraform/**` get static validation (`fmt`/`validate`,
  `init -backend=false` — no AWS, no gate).
- **Pushes to `main`** touching `infra/terraform/**`, and manual runs, perform
  `terraform apply` behind the **`production` GitHub Environment** (a required
  reviewer = one-click human gate).

State moves to a **remote S3 backend with native locking** (`use_lockfile`, no
DynamoDB), bootstrapped once by `infra/scripts/bootstrap-state.sh`. Provisioning
uses a **dedicated OIDC role** (`github-actions-adamaurelio-provision`) whose
trust is scoped to `environment:production`; the existing least-privilege deploy
role is unchanged. Terraform writes the deploy Variables back to the repo
(`manage_github_actions_config`), so deploy needs no manual wiring.

## Rationale

- `terraform apply` is idempotent — the same workflow that provisions also
  **self-heals** anything deleted, satisfying "auto-setup if not set up."
- Remote, locked state is the prerequisite for applying from CI safely.
- A separate, environment-scoped provision role keeps broad powers (CloudFront /
  ACM / Route 53 / IAM) off the deploy role and unusable without the reviewer gate.
- Content deploys never touch infra, so they stay fast and ungated; only infra
  changes (or first setup) hit the gate.

## Consequences

**Positive:** one merge (plus one approval) provisions or reconciles prod;
drift self-heals; no role can change infra without review; deploy config wires
itself.
**Negative / trade-offs:** a one-time human bootstrap remains unavoidable — the
state bucket and the provision role do not exist until an admin runs
`bootstrap-state.sh` and the first `terraform apply` locally (chicken-and-egg,
as ADR-0004 already anticipated). One repo secret is required: `GH_PROVISION_TOKEN`
(fine-grained PAT, Variables: read/write), because GitHub's built-in token cannot
manage repo Variables.

## Alternatives considered

- **Fully unattended apply on every push** — rejected: CI could silently alter
  IAM/CloudFront; the reviewer gate is cheap insurance for a personal account.
- **Keep provisioning manual (ADR-0004 status quo)** — rejected: does not meet
  the "self-setup" goal; deploy still fails on a fresh account.
- **S3 + DynamoDB lock** — superseded by native S3 locking (Terraform ≥ 1.10),
  one fewer resource to provision and pay for.

## Notes

Supersedes the "state local by default" and "deploy pipeline unchanged" notes in
ADR-0004 (which otherwise stands). [ADR-0005](0005-qa-on-synology-pull-based.md)
is unaffected — QA/the data tier remain pull-based; nothing pushes into the NAS.
