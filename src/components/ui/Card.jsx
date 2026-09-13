/* eslint-disable react/prop-types */

// The one card surface. Options:
//   interactive  lifts on hover — for cards that are, or contain, a link
//   accent       "teal" | "gold": a left rule instead of a full border, for
//                list-like entries (experience, values, community)
//   padding      override the default padding class
const accents = {
  teal: "border-l-4 border-teal-600 dark:border-teal-400 rounded-r-lg",
  gold: "border-l-4 border-gold-500 rounded-r-lg",
};

const Card = ({
  as: Tag = "div",
  interactive = false,
  accent,
  padding = "p-6 md:p-7",
  className = "",
  children,
}) => {
  const border = accent
    ? accents[accent]
    : "border border-navy-200 dark:border-navy-700 rounded-xl";
  const hover = interactive
    ? "shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all"
    : "";

  return (
    <Tag className={`bg-navy-50 dark:bg-navy-800 ${border} ${hover} ${padding} ${className}`}>
      {children}
    </Tag>
  );
};

export default Card;
