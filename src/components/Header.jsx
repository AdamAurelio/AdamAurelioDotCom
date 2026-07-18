import { useState } from "react";
import { Link } from "react-router-dom";
import ThemeToggle from "./ThemeToggle";

const navLinks = [
  { to: "/about", label: "About" },
  { to: "/resume", label: "Résumé" },
  { to: "/how-i-work", label: "How I Work" },
  { to: "/contact", label: "Contact" },
];

// NOTE: verify this GitHub username points at your real profile before shipping.
const GITHUB_URL = "https://github.com/adamaurelio";

const desktopLinkClass =
  "relative inline-block text-navy-700 dark:text-navy-300 hover:text-teal-700 dark:hover:text-teal-300 font-medium transition-colors after:absolute after:left-0 after:-bottom-0.5 after:h-0.5 after:w-full after:origin-left after:scale-x-0 after:bg-gold-500 dark:after:bg-gold-400 after:transition-transform after:duration-300 hover:after:scale-x-100";

const mobileLinkClass =
  "block px-4 py-3 rounded-lg text-navy-700 dark:text-navy-300 hover:text-teal-700 dark:hover:text-teal-300 hover:bg-navy-100 dark:hover:bg-navy-800 font-medium transition-colors";

const iconBtnClass =
  "p-2 rounded-lg text-navy-600 hover:text-teal-700 hover:bg-navy-100 dark:text-navy-300 dark:hover:text-teal-300 dark:hover:bg-navy-800 transition-colors";

const GitHubIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5"
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-hidden="true"
  >
    <path d="M12 .5C5.73.5.5 5.73.5 12a11.5 11.5 0 0 0 7.86 10.92c.58.1.79-.25.79-.56v-2c-3.2.7-3.88-1.37-3.88-1.37-.53-1.34-1.29-1.7-1.29-1.7-1.05-.72.08-.7.08-.7 1.16.08 1.77 1.2 1.77 1.2 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.29 1.19-3.1-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.18 1.18a11 11 0 0 1 5.8 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.81 1.19 1.84 1.19 3.1 0 4.42-2.69 5.39-5.25 5.68.41.35.78 1.05.78 2.12v3.15c0 .31.21.66.8.55A11.5 11.5 0 0 0 23.5 12C23.5 5.73 18.27.5 12 .5Z" />
  </svg>
);

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="print:hidden bg-navy-50/90 dark:bg-navy-950/90 backdrop-blur border-b border-navy-200 dark:border-navy-800 sticky top-0 z-50 transition-colors">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="font-serif text-2xl font-bold text-navy-900 dark:text-white">
            <Link
              to="/"
              className="hover:text-teal-700 dark:hover:text-teal-300 transition-colors"
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

            <a
              href={GITHUB_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub profile"
              className={iconBtnClass}
            >
              <GitHubIcon />
            </a>

            <ThemeToggle />

            {/* Hamburger (mobile only) */}
            <button
              type="button"
              onClick={() => setMenuOpen((open) => !open)}
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              className="md:hidden p-2 rounded-lg text-navy-600 hover:text-teal-700 hover:bg-navy-100 dark:text-navy-300 dark:hover:text-teal-300 dark:hover:bg-navy-800 transition-colors"
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

      {/* Mobile dropdown menu — animates height (grid-rows) + opacity. */}
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
            className="border-t border-navy-200 dark:border-navy-800 px-4 py-3"
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
              <li>
                <a
                  href={GITHUB_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setMenuOpen(false)}
                  className={mobileLinkClass}
                >
                  GitHub
                </a>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
