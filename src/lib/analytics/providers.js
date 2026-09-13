// Analytics adapters. Each provider implements the same optional-method shape:
//
//   { name, init?(), pageview?({path,title}), event?(name, props), error?({...}) }
//
// Only `debug` and `none` exist today — both are entirely local, so neither
// requires a CSP change, a vendor account, or a consent banner. Adding a real
// backend is additive; see the worked example at the bottom of this file.

/** No-op sink. The production default until a backend is chosen. */
const none = {
  name: "none",
};

/**
 * Development sink. Prints every hit and keeps the last 100 in memory at
 * `window.__analytics` so a dev can inspect what *would* have been sent:
 *
 *   __analytics.hits         // everything recorded this session
 *   __analytics.pageviews    // just the page views
 *   __analytics.clear()
 *
 * Nothing touches the network, so this is safe to leave on permanently in dev.
 */
const debug = {
  name: "debug",

  init() {
    const hits = [];

    window.__analytics = {
      hits,
      get pageviews() {
        return hits.filter((h) => h.type === "pageview");
      },
      get events() {
        return hits.filter((h) => h.type === "event");
      },
      clear() {
        hits.length = 0;
      },
    };

    this._record = (type, payload) => {
      const hit = { type, at: new Date().toISOString(), ...payload };
      hits.push(hit);
      if (hits.length > 100) hits.shift();
      return hit;
    };

    console.info(
      "%c[analytics]%c debug provider active — no data leaves the browser. Inspect with __analytics",
      "color:#0d9488;font-weight:bold",
      "color:inherit"
    );
  },

  pageview({ path, title }) {
    this._record("pageview", { path, title });
    console.info(`%c[analytics] pageview%c ${path}`, "color:#0d9488", "color:inherit");
  },

  event(name, props) {
    this._record("event", { name, props });
    console.info(
      `%c[analytics] event%c ${name}`,
      "color:#7c3aed",
      "color:inherit",
      Object.keys(props).length ? props : ""
    );
  },

  error({ message, componentStack }) {
    this._record("error", { message, componentStack });
    console.info(`%c[analytics] error%c ${message}`, "color:#dc2626", "color:inherit");
  },
};

export const providers = { none, debug };

// ── Adding a real backend ────────────────────────────────────────────────────
// Two things are required, in this order:
//
// 1. Widen the CSP in ALL FOUR places it is declared, or the tag is blocked:
//      nginx.conf                             (QA)
//      infra/terraform/cloudfront.tf          (prod, authoritative)
//      infra/response-headers-policy.json     (prod, console/CLI path)
//      infra/README.md §7                     (the documented copy)
//
// 2. Register an adapter here and set VITE_ANALYTICS_PROVIDER to its name.
//
// Sketch for a script-tag vendor (PostHog, Plausible, GoatCounter all fit this):
//
//   const vendor = {
//     name: "vendor",
//     init() {
//       const s = document.createElement("script");
//       s.src = import.meta.env.VITE_ANALYTICS_SRC;
//       s.dataset.site = import.meta.env.VITE_ANALYTICS_SITE_ID;
//       s.defer = true;
//       document.head.appendChild(s);
//     },
//     pageview({ path }) { window.vendorQueue?.push(["pageview", { path }]); },
//     event(name, props) { window.vendorQueue?.push(["event", name, props]); },
//   };
//
// Also update SECURITY.md — the asset table asserts "Personal data (PII)
// processed: None" and "Backend / database: None". A cookieless provider keeps
// that broadly true, but the table should name the processor either way.
