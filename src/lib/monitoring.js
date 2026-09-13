// Error monitoring (Sentry), kept separate from src/lib/analytics.
//
// The two answer different questions and deserve different rules. Analytics is
// behavioural — who read what — and is suppressed by DNT/GPC. This is
// operational: it exists so a render error on someone's browser doesn't stay
// invisible. Crash reports here are not used to build a profile of anyone, so
// they honour an *explicit* opt-out but not the browser's tracking signals —
// otherwise the errors that matter most (including the author's own, since this
// project's browser sends GPC) would be the ones never reported.
//
// ── Why the SDK is loaded lazily ─────────────────────────────────────────────
// @sentry/browser is ~147 kB gzipped, against ~88 kB for this entire site.
// Loading that for every visitor to insure against an error most of them will
// never hit is a bad trade on a site whose pitch is that it's small and fast.
//
// So nothing is loaded up front. This module installs two tiny native listeners
// and only fetches the SDK once something has actually gone wrong — at which
// point the visitor is already having a bad time and a background fetch is the
// least of it. A healthy visit costs zero bytes.
//
// The cost is that the SDK is absent for the first few hundred milliseconds of
// an error, so events are queued and flushed once it initialises. What is lost
// versus eager loading is Sentry's own breadcrumb trail (clicks, fetches, and
// console output from *before* the error), since it wasn't there to record it.
// For a static six-page site the stack and the URL are nearly the whole story.
//
// ⚠ CSP: Sentry posts to https://<org>.ingest.<region>.sentry.io. The site ships
// `connect-src 'self'`, so reports are BLOCKED until that origin is added in all
// four places the policy is declared:
//     nginx.conf                          (QA)
//     infra/terraform/cloudfront.tf       (prod, authoritative)
//     infra/response-headers-policy.json  (prod, console/CLI path)
//     infra/README.md §7                  (the documented copy)
// Nothing is widened up front, because granting an origin nothing talks to is
// permission without purpose.

const DSN = import.meta.env.VITE_SENTRY_DSN;
const OPT_OUT_KEY = "analytics:opt-out";

let sentry = null;
let loading = null;
let queue = [];
let installed = false;

const hasExplicitOptOut = () => {
  try {
    return window.localStorage.getItem(OPT_OUT_KEY) === "1";
  } catch {
    return false;
  }
};

const enabled = () => Boolean(DSN) && !hasExplicitOptOut();

/** Fetch + init the SDK exactly once, then drain anything reported meanwhile. */
const load = () => {
  // Deliberately tests the build-time constant directly rather than enabled().
  // Vite substitutes DSN at build time, so with none configured Rollup folds
  // this to `if (true) return` and tree-shakes the dynamic import below — the
  // 147 kB chunk is never even emitted. Routing this through a helper function
  // would hide that from static analysis and ship the chunk to every deploy.
  if (!DSN) return Promise.resolve(null);
  if (loading) return loading;

  loading = import("@sentry/browser")
    .then((Sentry) => {
      Sentry.init({
        dsn: DSN,
        // Ties an event to the commit that produced it.
        release: import.meta.env.VITE_RELEASE,
        environment: import.meta.env.MODE,
        // No IP address, no cookies. SECURITY.md classifies this site as
        // processing no personal data and that should stay true.
        sendDefaultPii: false,
        // Deliberately no tracing or replay: both cost bytes and collect far
        // more than the question warrants. vite.config.js strips the unused
        // tracing paths from the chunk via __SENTRY_TRACING__.
        tracesSampleRate: 0,
      });

      sentry = Sentry;

      queue.forEach(({ error, info }) =>
        Sentry.captureException(error, {
          contexts: { react: { componentStack: info?.componentStack } },
        })
      );
      queue = [];

      return Sentry;
    })
    .catch((err) => {
      // Monitoring must never take the app down with it.
      console.warn("[monitoring] Sentry failed to load:", err);
      queue = [];
      return null;
    });

  return loading;
};

/**
 * Report an error. Triggers the SDK fetch on first use.
 *
 * Called from ErrorBoundary for render errors, and from the global listeners
 * below for everything a boundary cannot see.
 */
export const reportError = (error, info = {}) => {
  if (!enabled() || !error) return;

  if (sentry) {
    sentry.captureException(error, {
      contexts: { react: { componentStack: info?.componentStack } },
    });
    return;
  }

  // Cap the queue: a render loop throwing every frame must not grow unbounded
  // while the chunk is in flight.
  if (queue.length < 10) queue.push({ error, info });
  load();
};

/**
 * Install global handlers. A React error boundary only ever sees errors thrown
 * during render — never one from an event handler, a timeout, or an await — so
 * these two listeners cover the majority of what actually breaks in practice.
 */
export const initMonitoring = () => {
  if (installed || !enabled()) return;
  installed = true;

  window.addEventListener("error", (event) => {
    reportError(event.error ?? new Error(event.message));
  });

  window.addEventListener("unhandledrejection", (event) => {
    const reason = event.reason;
    reportError(reason instanceof Error ? reason : new Error(String(reason)));
  });
};

/** Test seam. */
export const __reset = () => {
  sentry = null;
  loading = null;
  queue = [];
  installed = false;
};
