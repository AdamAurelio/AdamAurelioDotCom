// Provider-agnostic analytics facade.
//
// The site ships under `script-src 'self'; connect-src 'self'` (nginx.conf and
// infra/terraform/cloudfront.tf must stay in sync — see infra/README.md §7), so
// no third-party tag can load until that policy is widened deliberately. This
// module exists so that stays a one-line config change rather than a refactor:
// pages call a stable `track*` interface, and adopting a backend means adding an
// adapter in ./providers.js and setting VITE_ANALYTICS_PROVIDER.
//
// Defaults are chosen so nothing leaves the browser by accident: `debug` in dev
// (console only — no network, no CSP change, no account) and `none` in prod.

import { providers } from "./providers";

const DEFAULT_PROVIDER = import.meta.env.DEV ? "debug" : "none";
const OPT_OUT_KEY = "analytics:opt-out";
const FORCE_KEY = "analytics:force";

let provider = null;
let started = false;

/**
 * Honour the user's stated preference before collecting anything.
 *
 * Covers the two browser-level signals (DNT, Global Privacy Control) plus a
 * local override so opting out is testable from the console:
 *   localStorage.setItem("analytics:opt-out", "1")
 *
 * A developer whose own browser sends GPC/DNT would otherwise never see their
 * own instrumentation fire, so dev builds honour an explicit opt-in:
 *   localStorage.setItem("analytics:force", "1")
 * It is deliberately gated on import.meta.env.DEV — in a production build this
 * branch is compiled out, so a visitor's stated preference is never overridable.
 */
export const isOptedOut = () => {
  if (typeof window === "undefined") return true;

  try {
    if (import.meta.env.DEV && window.localStorage.getItem(FORCE_KEY) === "1") {
      return false;
    }
  } catch {
    // Fall through to the signal checks below.
  }

  if (window.navigator?.globalPrivacyControl === true) return true;
  if (window.navigator?.doNotTrack === "1" || window.doNotTrack === "1") return true;

  try {
    return window.localStorage.getItem(OPT_OUT_KEY) === "1";
  } catch {
    // Storage can throw in private mode or when cookies are blocked. A browser
    // hostile enough to throw here gets the privacy-preserving answer.
    return true;
  }
};

/** Resolve the configured adapter, falling back to `none` if the name is unknown. */
const resolveProvider = () => {
  const name = import.meta.env.VITE_ANALYTICS_PROVIDER || DEFAULT_PROVIDER;
  const found = providers[name];

  if (!found) {
    console.warn(
      `[analytics] Unknown provider "${name}". Known: ${Object.keys(providers).join(", ")}. Falling back to "none".`
    );
    return providers.none;
  }

  return found;
};

/**
 * Start analytics. Idempotent — safe under React StrictMode's double-invoke.
 * Returns the active provider name so callers/tests can assert on it.
 */
export const init = () => {
  if (started) return provider?.name ?? "none";
  started = true;

  provider = isOptedOut() ? providers.none : resolveProvider();
  provider.init?.();

  return provider.name;
};

/** Record a page view. `path` is the route path, not a full URL. */
export const trackPageview = (path, meta = {}) => {
  if (!started) init();
  provider?.pageview?.({ path, title: document?.title, ...meta });
};

/**
 * Record a named event.
 *
 * Keep `props` free of anything identifying — SECURITY.md classifies this site
 * as PUBLIC with no PII processed, and that claim should survive analytics.
 */
export const trackEvent = (name, props = {}) => {
  if (!started) init();
  provider?.event?.(name, props);
};

/**
 * Report a caught UI error. Wired from ErrorBoundary's componentDidCatch.
 * Only the message and component stack travel — never the raw error object,
 * which can carry internals.
 */
export const trackError = (error, info = {}) => {
  if (!started) init();
  provider?.error?.({
    message: error?.message ?? String(error),
    componentStack: info?.componentStack,
  });
};

/** Test seam: drop state so each test can init() a fresh provider. */
export const __reset = () => {
  provider = null;
  started = false;
};
