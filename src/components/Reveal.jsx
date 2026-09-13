/* eslint-disable react/prop-types */
import { useEffect, useRef, useState } from "react";

const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/**
 * Fades + slides its children in when they scroll into view. No dependencies;
 * animates only opacity/transform. If the user prefers reduced motion, content
 * renders visible immediately.
 *
 * Props:
 *  - as: element/tag to render (default "div")
 *  - delay: ms transition delay, for staggering siblings
 *  - immediate: render visible from the first paint, with no animation. Use
 *    for anything above the fold: a hero or page header that starts at
 *    opacity 0 delays Largest Contentful Paint and reads as a blank page in
 *    a throttled background tab. The reveal is for content the visitor
 *    scrolls to, not content they land on.
 *  - className: extra classes for the rendered element
 */
const Reveal = ({
  children,
  className = "",
  delay = 0,
  immediate = false,
  as: Tag = "div",
}) => {
  const ref = useRef(null);
  const [shown, setShown] = useState(() => immediate || prefersReducedMotion());

  useEffect(() => {
    if (shown) return;
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -10% 0px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [shown]);

  if (immediate) {
    return (
      <Tag ref={ref} className={className}>
        {children}
      </Tag>
    );
  }

  return (
    <Tag
      ref={ref}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
      className={`transform-gpu transition-[opacity,transform] duration-500 ease-out motion-reduce:transition-none ${
        shown ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"
      } ${className}`}
    >
      {children}
    </Tag>
  );
};

export default Reveal;
