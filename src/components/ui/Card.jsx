/* eslint-disable react/prop-types */

// The one card surface: frosted glass with a sheen, and a soft spotlight that
// follows the pointer (.glass-card in src/styles/index.css). Options:
//   interactive  also lifts on hover — for cards that are, or contain, a link
//   accent       "teal" | "gold": a left rule, for list-like entries
//                (experience, values, community)
//   padding      override the default padding class
const accents = {
  teal: "border-l-4 border-l-teal-600 dark:border-l-teal-400 rounded-r-2xl",
  gold: "border-l-4 border-l-gold-500 rounded-r-2xl",
};

// Pointer position, relative to the card, for the spotlight gradient.
const trackPointer = (e) => {
  const el = e.currentTarget;
  const r = el.getBoundingClientRect();
  el.style.setProperty("--mx", `${e.clientX - r.left}px`);
  el.style.setProperty("--my", `${e.clientY - r.top}px`);
};

const Card = ({
  as: Tag = "div",
  interactive = false,
  accent,
  padding = "p-6 md:p-7",
  className = "",
  children,
}) => {
  const shape = accent ? accents[accent] : "rounded-2xl";
  const hover = interactive ? "hover:shadow-lg hover:-translate-y-0.5" : "";

  return (
    <Tag
      onPointerMove={trackPointer}
      className={`glass glass-card ${shape} ${hover} ${padding} ${className}`}
    >
      {children}
    </Tag>
  );
};

export default Card;
