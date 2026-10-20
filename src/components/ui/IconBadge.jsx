/* eslint-disable react/prop-types */
import Icon from "./Icon";

// An icon on a soft tinted tile — the visual anchor for cards and list items.
// Tones are named by role, like ButtonLink variants: teal for work, gold for the
// human side (community, values).
const tones = {
  teal: "bg-teal-100 text-teal-700 dark:bg-teal-400/15 dark:text-teal-300",
  gold: "bg-gold-100 text-gold-700 dark:bg-gold-400/15 dark:text-gold-300",
};

const sizes = {
  md: { box: "h-11 w-11 rounded-xl", icon: "h-5 w-5" },
  lg: { box: "h-14 w-14 rounded-2xl", icon: "h-7 w-7" },
};

const IconBadge = ({ name, tone = "teal", size = "md", className = "" }) => {
  const s = sizes[size] ?? sizes.md;
  return (
    <span
      className={`inline-flex shrink-0 items-center justify-center ${s.box} ${tones[tone] ?? tones.teal} ${className}`}
    >
      <Icon name={name} className={s.icon} />
    </span>
  );
};

export default IconBadge;
