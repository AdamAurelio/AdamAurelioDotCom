/* eslint-disable react/prop-types */
import { Link } from "react-router";
import OutboundLink from "../OutboundLink";

// Every call-to-action on the site. Pass `to` for an internal route (client-side
// navigation) or `href` for an external URL (opens in a new tab and records an
// outbound-click event via OutboundLink).
//
// Variants are named by role, not color, so a palette change happens here once.
const variants = {
  // The main action on a light surface.
  primary:
    "bg-teal-700 text-white hover:bg-teal-800 shadow-sm hover:shadow-md",
  // The quieter sibling of primary.
  secondary:
    "bg-navy-100 text-navy-800 hover:bg-navy-200 dark:bg-navy-800 dark:text-navy-100 dark:hover:bg-navy-700",
  // Warm accent — used on the "human" sections (community, contact).
  gold: "bg-gold-700 text-white hover:bg-gold-800 shadow-sm",
  // Outlined, for a secondary action beside a filled button.
  outline:
    "border-2 border-navy-400 text-navy-800 hover:bg-navy-100 dark:border-navy-500 dark:text-navy-100 dark:hover:bg-navy-800",
  // Outlined for use on a dark (navy) band regardless of theme.
  outlineOnDark:
    "border-2 border-navy-300 text-navy-100 hover:bg-navy-100 hover:text-navy-900",
};

const base =
  "inline-block px-8 py-3 rounded-lg font-semibold transition-colors text-center";

const ButtonLink = ({ to, href, variant = "primary", className = "", children, ...rest }) => {
  const classes = `${base} ${variants[variant] ?? variants.primary} ${className}`;

  if (href) {
    return (
      <OutboundLink href={href} className={classes} {...rest}>
        {children}
      </OutboundLink>
    );
  }

  return (
    <Link to={to} className={classes} {...rest}>
      {children}
    </Link>
  );
};

export default ButtonLink;
