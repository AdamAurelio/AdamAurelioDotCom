<!--
  Frontend-adapted checklist (ADAM model: Dev Std §7.2 / closing-the-loop Phase 8).
  Delete rows that genuinely don't apply, but prefer ticking over deleting.
-->

## What & why

<!-- One or two sentences: what this changes and the reason. Link any issue/ADR. -->

## Checklist

**Quality gates (same as CI)**
- [ ] `npm run lint` passes
- [ ] `npm run build` passes
- [ ] `npm run test:unit` passes (added/updated tests for the change)
- [ ] E2E smoke still passes if routing/layout changed (`npm run test:e2e`)

**Frontend standards**
- [ ] Accessibility considered (keyboard, focus, `alt`/`aria`, contrast)
- [ ] Loading/empty/error states handled where relevant; no silent failures
- [ ] No secrets or PII added to client code

**Serving layer / infra (if touched)**
- [ ] Security headers kept in sync across `infra/response-headers-policy.json`
      (+ Terraform `cloudfront.tf`), `nginx.conf`, and any Web Station `.htaccess`
- [ ] QA parity check run if the serving layer changed
      (`./scripts/qa-parity-check.ps1`)

**Docs**
- [ ] ADR added under `docs/adr/` if this is a significant decision
- [ ] `CHANGELOG.md` updated
- [ ] `docs/MODEL_CONFORMANCE.md` ticked if this closes a tracked item

## Notes for the reviewer

<!-- Anything reviewers should focus on, or conscious trade-offs made. -->
