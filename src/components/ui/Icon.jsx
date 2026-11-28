/* eslint-disable react/prop-types */
import { createElement } from "react";
import { icons } from "./icons";

// A Lucide line icon by name (see ./icons.js). Always decorative: every icon on
// the site sits beside text that already says what it means, so it is hidden
// from assistive tech. Size and colour come from className; the stroke follows
// currentColor. An unknown name renders nothing rather than a broken shape.
//
// `draw` normalises every stroke to pathLength=1 so the icon can draw in like
// ink when its Reveal block arrives (see .ico-draw in src/styles/index.css).
const Icon = ({ name, className = "h-5 w-5", draw = false }) => {
  const shapes = icons[name];
  if (!shapes) return null;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      className={draw ? `ico-draw ${className}` : className}
    >
      {/* Static data that never reorders, so the index is a stable key. */}
      {shapes.map(([tag, attrs], i) => createElement(tag, { key: i, ...attrs, ...(draw && { pathLength: 1 }) }))}
    </svg>
  );
};

export default Icon;
