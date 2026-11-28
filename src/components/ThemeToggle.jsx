/* eslint-disable react/prop-types */
import { useState } from "react";
import { flushSync } from "react-dom";

// Sun/moon icon paths below are from Lucide (ISC) — see NOTICE.

// Reads the theme the no-flash init script already applied to <html>.
const getInitialTheme = () =>
  document.documentElement.classList.contains("dark") ? "dark" : "light";

const applyTheme = (theme) => {
  document.documentElement.classList.toggle("dark", theme === "dark");
  try {
    localStorage.setItem("theme", theme);
  } catch (e) {
    /* ignore unavailable storage */
  }
};

const reducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const iconProps = {
  xmlns: "http://www.w3.org/2000/svg",
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: "2",
  strokeLinecap: "round",
  strokeLinejoin: "round",
  "aria-hidden": "true",
  focusable: "false",
};

/**
 * Light/dark switch. Where the browser supports View Transitions, the new
 * theme spreads out in a circle from the button; otherwise (and under reduced
 * motion) it switches at once. The DOM change happens synchronously inside
 * the transition callback so the browser snapshots the right "after" state.
 */
const ThemeToggle = ({ className = "" }) => {
  const [theme, setTheme] = useState(getInitialTheme);
  const isDark = theme === "dark";

  const toggle = (e) => {
    const next = isDark ? "light" : "dark";
    const commit = () => {
      applyTheme(next);
      flushSync(() => setTheme(next));
    };

    if (!document.startViewTransition || reducedMotion()) {
      commit();
      return;
    }

    const r = e.currentTarget.getBoundingClientRect();
    const x = r.left + r.width / 2;
    const y = r.top + r.height / 2;
    const radius = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
    const root = document.documentElement;
    root.classList.add("vt");
    const transition = document.startViewTransition(commit);
    transition.ready
      .then(() => {
        root.animate(
          { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`] },
          {
            duration: 700,
            easing: "cubic-bezier(.22,1,.36,1)",
            pseudoElement: "::view-transition-new(root)",
          }
        );
      })
      .catch(() => {
        /* transition skipped — the theme still changed */
      });
    transition.finished.catch(() => {}).finally(() => root.classList.remove("vt"));
  };

  const label = isDark ? "Switch to light mode" : "Switch to dark mode";

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={label}
      title={label}
      className={`relative inline-flex h-9 w-9 items-center justify-center rounded-lg text-navy-600 hover:text-teal-700 hover:bg-navy-100 dark:text-navy-300 dark:hover:text-teal-300 dark:hover:bg-navy-800 transition-colors ${className}`}
    >
      <svg {...iconProps} className="theme-ico moon h-5 w-5">
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
      </svg>
      <svg {...iconProps} className="theme-ico sun h-5 w-5">
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
      </svg>
    </button>
  );
};

export default ThemeToggle;
