/* eslint-disable react/prop-types */

// Horizontal page rhythm: one gutter, one set of widths. Pages pick a width by
// name instead of repeating max-w/px classes.
const widths = {
  narrow: "max-w-2xl", // contact
  prose: "max-w-3xl", // long-form reading: about, how-i-work
  content: "max-w-5xl", // résumé sheet
  wide: "max-w-6xl", // project grid
  full: "max-w-7xl", // home, header/footer
};

const Container = ({ width = "full", as: Tag = "div", className = "", children }) => (
  <Tag className={`${widths[width] ?? widths.full} mx-auto px-4 md:px-8 ${className}`}>
    {children}
  </Tag>
);

export default Container;
