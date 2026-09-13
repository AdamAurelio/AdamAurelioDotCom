/* eslint-disable react/prop-types */
import Reveal from "../Reveal";

// A titled block within a page: mono kicker, serif h2, then content. Reveals on
// scroll. `align="center"` for full-width marketing sections.
const Section = ({
  kicker,
  title,
  align = "left",
  className = "mb-16",
  titleClassName = "text-3xl",
  children,
}) => {
  const centered = align === "center" ? "text-center" : "";

  return (
    <Reveal as="section" className={className}>
      {kicker && <p className={`kicker mb-2 ${centered}`}>{kicker}</p>}
      {title && (
        <h2
          className={`${titleClassName} font-bold text-navy-900 dark:text-white mb-5 ${centered}`}
        >
          {title}
        </h2>
      )}
      {children}
    </Reveal>
  );
};

export default Section;
