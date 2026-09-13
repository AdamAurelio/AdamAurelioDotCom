/* eslint-disable react/prop-types */
import Reveal from "../Reveal";

// The top of an inner page: kicker, h1, and a one-paragraph lede. Rendered
// visible immediately (no scroll reveal) because it is always above the fold
// and is the page's Largest Contentful Paint candidate.
const PageHeader = ({ kicker, title, lede, align = "left", className = "mb-14", children }) => {
  const centered = align === "center" ? "text-center" : "";

  return (
    <Reveal as="header" immediate className={`${className} ${centered}`}>
      {kicker && <p className="kicker mb-2">{kicker}</p>}
      <h1 className="text-4xl md:text-5xl font-bold text-navy-900 dark:text-white mb-4">
        {title}
      </h1>
      {lede && (
        <p className="text-lg text-navy-600 dark:text-navy-300 leading-relaxed">{lede}</p>
      )}
      {children}
    </Reveal>
  );
};

export default PageHeader;
