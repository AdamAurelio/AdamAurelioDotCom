import { trackEvent } from "../lib/analytics";
import { site } from "../content/site";

// Renders a clickable email address whose full "user@domain" string is never
// present as a contiguous, regex-harvestable literal in the shipped bundle.
// Joined via Array.join (not "+"/template literal) so the bundler can't
// constant-fold it back into one string. Defeats naive email scrapers while
// keeping a normal mailto: link for humans.
const EmailLink = () => {
  const address = [site.email.user, site.email.domain].join("@");

  return (
    <a
      href={`mailto:${address}`}
      onClick={() => trackEvent("contact_email_click")}
      className="text-teal-700 dark:text-teal-300 hover:underline"
    >
      {address}
    </a>
  );
};

export default EmailLink;
