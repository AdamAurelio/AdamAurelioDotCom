import { useState } from "react";
import { Link } from "react-router-dom";
import ThemeToggle from "./ThemeToggle";

const navLinks = [
  { to: "/about", label: "About" },
  { to: "/resume", label: "Resume" },
  { to: "/services", label: "Services" },
  { to: "/contact", label: "Contact" },
];

const desktopLinkClass =
  "relative inline-block text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors after:absolute after:left-0 after:-bottom-0.5 after:h-0.5 after:w-full after:origin-left after:scale-x-0 after:bg-blue-600 dark:after:bg-blue-400 after:transition-transform after:duration-300 hover:after:scale-x-100";

const mobileLinkClass =
  "block px-4 py-3 rounded-lg text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-800 font-medium transition-colors";

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="bg-white dark:bg-gray-900 shadow-md dark:shadow-gray-950/50 sticky top-0 z-50 transition-colors">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="text-2xl font-bold text-gray-900 dark:text-white">
            <Link
              to="/"
              className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              Adam Aurelio
            </Link>
          </div>

          <div className="flex items-center gap-2 md:gap-6">
            {/* Desktop nav */}
            <nav className="hidden md:block">
              <ul className="flex space-x-8">
                {navLinks.map(({ to, label }) => (
                  <li key={to}>
                    <Link to={to} className={desktopLinkClass}>
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            <ThemeToggle />

            {/* Hamburger (mobile only) */}
            <button
              type="button"
              onClick={() => setMenuOpen((open) => !open)}
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              className="md:hidden p-2 rounded-lg text-gray-600 hover:text-blue-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:text-blue-400 dark:hover:bg-gray-800 transition-colors"
            >
              {menuOpen ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M18 6 6 18M6 6l12 12" />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M3 6h18M3 12h18M3 18h18" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile dropdown menu — animates height (grid-rows) + opacity.
          `visible/invisible` (with the transition) keeps the collapsed links
          out of the tab order while still allowing a fade-out. */}
      <div
        className={`md:hidden grid overflow-hidden transition-[grid-template-rows,opacity,visibility] duration-300 ease-out ${
          menuOpen
            ? "grid-rows-[1fr] opacity-100 visible"
            : "grid-rows-[0fr] opacity-0 invisible"
        }`}
      >
        <div className="overflow-hidden">
          <nav
            id="mobile-menu"
            className="border-t border-gray-100 dark:border-gray-800 px-4 py-3"
          >
            <ul className="space-y-1">
              {navLinks.map(({ to, label }) => (
                <li key={to}>
                  <Link
                    to={to}
                    onClick={() => setMenuOpen(false)}
                    className={mobileLinkClass}
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
