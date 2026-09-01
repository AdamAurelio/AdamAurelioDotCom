import { useEffect, useRef } from "react";
import { useLocation } from "react-router";
import { init, trackPageview } from "../lib/analytics";

/**
 * Route-change page view tracking. Renders nothing.
 *
 * A single-page app only ever requests one HTML document, so server- and
 * CDN-side logs see one hit no matter how many routes the visitor reads. Every
 * navigation after the first is a client-side render, which is why this has to
 * happen in React rather than in CloudFront logs.
 *
 * Must be mounted inside <BrowserRouter> for useLocation() to resolve.
 */
const Analytics = () => {
  const { pathname, search } = useLocation();
  const lastSent = useRef(null);

  useEffect(() => {
    init();
  }, []);

  useEffect(() => {
    // `search` is included because it changes what was viewed, but no hash —
    // fragments are in-page anchors, not distinct pages.
    const path = `${pathname}${search}`;

    // StrictMode intentionally double-invokes effects in development, which
    // would report every page twice and make the debug output untrustworthy.
    // Only *consecutive* duplicates are dropped, so leaving a page and coming
    // back still counts as a second view.
    if (lastSent.current === path) return;
    lastSent.current = path;

    trackPageview(path);
  }, [pathname, search]);

  return null;
};

export default Analytics;
