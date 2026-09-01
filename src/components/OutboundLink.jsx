/* eslint-disable react/prop-types */
import { trackEvent } from "../lib/analytics";

/** Hostname only — never the full URL's path or query, which can carry context. */
const hostOf = (href) => {
  try {
    return new URL(href).hostname;
  } catch {
    return "unknown";
  }
};

/**
 * External link that records the click before handing off to the browser.
 *
 * Clicks that leave the site are invisible to page-view tracking — the visitor
 * is simply gone — so they have to be captured at the click. Centralised here
 * so every outbound link keeps the same `rel="noopener noreferrer"` hardening
 * and reports the same event shape.
 *
 * Navigation is never blocked or delayed: the handler is synchronous and the
 * default action is untouched, so an analytics failure can't break the link.
 */
const OutboundLink = ({ href, event = "outbound_link", label, children, ...rest }) => {
  const handleClick = () => {
    trackEvent(event, { host: hostOf(href), ...(label ? { label } : {}) });
  };

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onClick={handleClick}
      {...rest}
    >
      {children}
    </a>
  );
};

export default OutboundLink;
