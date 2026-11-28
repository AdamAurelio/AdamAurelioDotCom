/* eslint-disable react/prop-types */
import Icon from "./Icon";

// An icon on a soft tinted tile — the visual anchor for cards and list items.
// Tones are named by role, like ButtonLink variants: teal for work, gold for the
// human side (community, values). Teal tiles carry a glass finish (.badge-teal).
const tones = {
  teal: "badge-teal bg-teal-100 text-teal-700 dark:bg-teal-400/15 dark:text-teal-300",
  gold: "bg-gold-100 text-gold-700 dark:bg-gold-400/15 dark:text-gold-300",
};

const sizes = {
  md: { box: "h-11 w-11", radius: "rounded-xl", icon: "h-5 w-5" },
  lg: { box: "h-14 w-14", radius: "rounded-2xl", icon: "h-7 w-7" },
};

// shape="arch": a tall window-shaped tile (.badge-arch), for the faith/family
// items on Home. It brings its own radius and gold glass.
const IconBadge = ({
  name,
  tone = "teal",
  size = "md",
  shape = "tile",
  draw = false,
  className = "",
}) => {
  const s = sizes[size] ?? sizes.md;
  const box = shape === "arch" ? "h-[4.4rem] w-14 badge-arch" : `${s.box} ${s.radius}`;
  return (
    <span
      className={`inline-flex shrink-0 items-center justify-center ${box} ${tones[tone] ?? tones.teal} ${className}`}
    >
      <Icon name={name} className={s.icon} draw={draw} />
    </span>
  );
};

export default IconBadge;
