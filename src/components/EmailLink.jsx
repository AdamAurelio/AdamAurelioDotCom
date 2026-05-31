// Renders a clickable email address whose full "user@domain" string is never
// present as a contiguous, regex-harvestable literal in the shipped bundle.
// Joined via Array.join (not "+"/template literal) so the bundler can't
// constant-fold it back into one string. Defeats naive email scrapers while
// keeping a normal mailto: link for humans.
const EmailLink = () => {
  const user = "adam.aurelio";
  const domain = "gmail.com";
  const address = [user, domain].join("@");

  return (
    <a
      href={`mailto:${address}`}
      className="text-blue-600 dark:text-blue-400 hover:underline"
    >
      {address}
    </a>
  );
};

export default EmailLink;
