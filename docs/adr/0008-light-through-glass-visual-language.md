# ADR-0008: "Light through glass" visual language

**Date:** 2026-11-27
**Status:** Accepted
**Decision maker:** Adam Aurelio

## Context

The site's look was flat cards, a blurred glow behind the portrait, and one
fade-up for every block. A design mockup ("Design Lab", reviewed side by side
with the live site) proposed a single idea instead: light through glass.
That means frosted glass and gold for polish, arches and Roman numerals for
faith, Des Moines contour lines and rolling hills for Iowa, and a live clock
and status light for the engineer. The site must stay static, CSP-strict
(`script-src 'self'`), dependency-light, and pass axe on every route.

## Decision

Adopt the mockup's proposed look and motion site-wide, built from CSS custom
properties and keyframes in `src/styles/index.css`, plus a few small
components (`BrandMark`, `Odometer`, `LocalTime`). No animation library.

## Rationale

- Pure CSS motion keyed off `Reveal`'s `is-revealed` class honours
  `prefers-reduced-motion` in one place and needs no script for print.
- The glass degrades to solid surfaces under `prefers-reduced-transparency`
  or without `backdrop-filter` support.
- The contour data (~114 KB, compresses well) is a static `public/` image,
  not JS, so it stays out of the bundle and is cached separately.
- The CSP needs no change: the film grain is a `data:` SVG (`img-src data:`
  is already allowed) and React's style attributes use the CSSOM.

## Consequences

**Positive:** a distinctive, personal look; the hero stays visible from the
first frame (LCP rule); motion is opt-out by OS setting.
**Negative / trade-offs:** more hand-written CSS to maintain. `backdrop-filter`
costs some paint time on low-end devices. The footer overlaps the last 4rem
of `<main>` (Layout pads it), so a page must not place content flush with
its bottom edge.

## Alternatives considered

- **Keep the current flat look** — rejected; the mockup comparison favoured
  the proposal.
- **Framer Motion / GSAP** — rejected; a runtime dependency for effects CSS
  already does.
