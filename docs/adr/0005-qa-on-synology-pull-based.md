# ADR-0005: QA on Synology, pull-based (not a push pipeline)

**Date:** 2026-06-13
**Status:** Accepted
**Decision maker:** Adam Aurelio

## Context

QA is a production-style serve of the built site on a Synology NAS (Docker +
nginx), used as a dress rehearsal before AWS. The NAS sits behind a home router's
NAT with no inbound access. A natural question is whether GitHub Actions should
"deploy to QA" the way it deploys to prod.

## Decision

QA is **pull-based and developer-initiated**, not a push pipeline. The NAS pulls
code and rebuilds (`scripts/qa-update.sh`); GitHub never pushes to it. QA tracks
the **`qa`** branch. Promotion is a single command (optionally a Synology
Scheduled Task running the same change-aware script on a timer).

## Rationale

- A cloud runner cannot reach a NAT'd home NAS to push a deploy.
- A self-hosted runner on a (likely public) repo is a code-execution risk from
  forked PRs and is extra surface to maintain — explicitly rejected.
- Pull-based inverts the trust direction (NAS reaches out); no inbound exposure.
- QA is a deliberate verification gate; developer-initiated promotion fits that
  intent, while the optional timer covers hands-off freshness.

## Consequences

**Positive:** no inbound ports, no runner to maintain, no GitHub attack surface;
QA stays a conscious gate.
**Negative / trade-offs:** not a true "push to deploy" pipeline; QA bytes are a
rebuild on the NAS, not the exact CI artifact (accepted — see
[`MODEL_CONFORMANCE.md`](../MODEL_CONFORMANCE.md) #ARTIFACT).

## Alternatives considered

- **Self-hosted GitHub runner on the NAS** — rejected: maintenance + forked-PR
  code-execution risk on home hardware.
- **Manual `docker compose` only** — kept as the underlying mechanism;
  `qa-update.sh` just removes the friction and enables the optional timer.

## Notes

Docs historically referenced a `qa-test` branch; the actual branch is **`qa`**.
