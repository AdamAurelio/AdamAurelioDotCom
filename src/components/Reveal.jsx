/* eslint-disable react/prop-types */
import { useEffect, useRef, useState } from "react";

const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/**
 * Reveals its children when they scroll into view. No dependencies; animates
 * only opacity/transform. If the user prefers reduced motion, content renders
 * in its final state immediately.
 *
 * Once shown, the element carries the `is-revealed` class, which the motion
 * in src/styles/index.css keys off (masked headings, staggered cells, icons
 * drawing in, meter numbers, the highlighter).
 *
 * Props:
 *  - as: element/tag to render (default "div")
 *  - delay: ms transition delay, for staggering siblings
 *  - immediate: render visible from the first paint, with no animation. Use
 *    for anything above the fold: a hero or page header that starts at
 *    opacity 0 delays Largest Contentful Paint and reads as a blank page in
 *    a throttled background tab. The reveal is for content the visitor
 *    scrolls to, not content they land on.
 *  - shell: the block itself does not fade; its `.reveal-cell` / `.reveal-tail`
 *    children (and any masked heading inside) arrive one at a time instead.
 *    Give each cell `style={{ "--i": index }}` to set its place in the queue.
 *  - className: extra classes for the rendered element
 */
const Reveal = ({
  children,
  className = "",
  delay = 0,
  immediate = false,
  shell = false,
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

  const state = shown ? "is-revealed" : "";

  if (immediate || shell) {
    return (
      <Tag ref={ref} data-reveal="" className={`${state} ${className}`}>
        {children}
      </Tag>
    );
  }

  return (
    <Tag
      ref={ref}
      data-reveal=""
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
      className={`transform-gpu transition-[opacity,transform] duration-700 ease-[cubic-bezier(.22,1,.36,1)] motion-reduce:transition-none ${
        shown ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
      } ${state} ${className}`}
    >
      {children}
    </Tag>
  );
};

export default Reveal;
