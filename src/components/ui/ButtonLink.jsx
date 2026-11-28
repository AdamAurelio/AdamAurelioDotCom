/* eslint-disable react/prop-types */
import { Link } from "react-router";
import OutboundLink from "../OutboundLink";

// Every call-to-action on the site. Pass `to` for an internal route (client-side
// navigation) or `href` for an external URL (opens in a new tab and records an
// outbound-click event via OutboundLink).
//
// Variants are named by role, not color, so a palette change happens here once.
// On hover the darker fill (--btn-fill) sweeps in from the left (.btn-sweep in
// src/styles/index.css); the filled variants carry an arrow that nudges forward.
const variants = {
  // The main action on a light surface.
  primary: {
    classes: "bg-teal-700 text-white shadow-sm hover:shadow-md [--btn-fill:theme(colors.teal.800)]",
    arrow: true,
  },
  // The quieter sibling of primary: a glass pill.
  secondary: {
    classes:
      "glass !border-0 text-navy-800 dark:text-navy-100 [--btn-fill:var(--glass-bg-strong)]",
  },
  // Warm accent — used on the "human" sections (community, contact).
  gold: {
    classes: "bg-gold-700 text-white shadow-sm [--btn-fill:theme(colors.gold.800)]",
    arrow: true,
  },
  // Outlined, for a secondary action beside a filled button.
  outline: {
    classes:
      "border-2 border-navy-400 text-navy-800 dark:border-navy-500 dark:text-navy-100 [--btn-fill:theme(colors.navy.100)] dark:[--btn-fill:theme(colors.navy.800)]",
  },
  // Outlined for use on a dark (navy) band regardless of theme.
  outlineOnDark: {
    classes:
      "border-2 border-navy-300 text-navy-100 hover:text-navy-900 [--btn-fill:theme(colors.navy.100)]",
  },
};

const base =
  "btn-sweep inline-flex items-center justify-center gap-2 px-8 py-3 rounded-lg font-semibold text-center";

// Lucide arrow-right (ISC) — see NOTICE.
const Arrow = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="btn-arrow h-[1.1em] w-[1.1em]"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    focusable="false"
  >
    <path d="M5 12h14" />
    <path d="m12 5 7 7-7 7" />
  </svg>
);

const ButtonLink = ({ to, href, variant = "primary", className = "", children, ...rest }) => {
  const v = variants[variant] ?? variants.primary;
  const classes = `${base} ${v.classes} ${className}`;
  const content = (
    <>
      {children}
      {v.arrow && <Arrow />}
    </>
  );

  if (href) {
    return (
      <OutboundLink href={href} className={classes} {...rest}>
        {content}
      </OutboundLink>
    );
  }

  return (
    <Link to={to} className={classes} {...rest}>
      {content}
    </Link>
  );
};

export default ButtonLink;
