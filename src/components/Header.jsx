/* eslint-disable react/prop-types */
import { useState } from "react";
import { Link, NavLink } from "react-router";
import ThemeToggle from "./ThemeToggle";
import Container from "./ui/Container";
import { navRoutes } from "../routes";
import { site } from "../content/site";

// Desktop links: an animated gold underline on hover, held open on the active
// route. NavLink sets aria-current="page" on the active link for us.
const desktopLinkClass = ({ isActive }) =>
  [
    "relative inline-block font-medium transition-colors",
    "after:absolute after:left-0 after:-bottom-0.5 after:h-0.5 after:w-full after:origin-left after:bg-gold-500 dark:after:bg-gold-400 after:transition-transform after:duration-300",
    isActive
      ? "text-teal-700 dark:text-teal-300 after:scale-x-100"
      : "text-navy-700 dark:text-navy-300 hover:text-teal-700 dark:hover:text-teal-300 after:scale-x-0 hover:after:scale-x-100",
  ].join(" ");

const mobileLinkClass = ({ isActive }) =>
  [
    "block px-4 py-3 rounded-lg font-medium transition-colors",
    isActive
      ? "text-teal-700 dark:text-teal-300 bg-navy-100 dark:bg-navy-800"
      : "text-navy-700 dark:text-navy-300 hover:text-teal-700 dark:hover:text-teal-300 hover:bg-navy-100 dark:hover:bg-navy-800",
  ].join(" ");

const iconBtnClass =
  "p-2 rounded-lg text-navy-600 hover:text-teal-700 hover:bg-navy-100 dark:text-navy-300 dark:hover:text-teal-300 dark:hover:bg-navy-800 transition-colors";

// The GitHub mark is a trademark of GitHub, Inc., used unmodified to link to a
// profile as their brand guidelines allow. The menu/close icons further down are
// Lucide (ISC) path data. Both are attributed in NOTICE.
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

const MenuIcon = ({ open }) => (
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
    {open ? <path d="M18 6 6 18M6 6l12 12" /> : <path d="M3 6h18M3 12h18M3 18h18" />}
  </svg>
);

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="print:hidden bg-navy-50/90 dark:bg-navy-950/90 backdrop-blur border-b border-navy-200 dark:border-navy-800 sticky top-0 z-50 transition-colors">
      <Container>
        <div className="flex items-center justify-between h-16">
          <div className="font-serif text-2xl font-bold text-navy-900 dark:text-white">
            <Link
              to="/"
              className="hover:text-teal-700 dark:hover:text-teal-300 transition-colors"
            >
              {site.name}
            </Link>
          </div>

          <div className="flex items-center gap-2 md:gap-6">
            {/* Desktop nav */}
            <nav className="hidden md:block" aria-label="Primary">
              <ul className="flex space-x-8">
                {navRoutes.map(({ path, label }) => (
                  <li key={path}>
                    <NavLink to={path} className={desktopLinkClass}>
                      {label}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </nav>

            <a
              href={site.links.github}
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
              className={`md:hidden ${iconBtnClass}`}
            >
              <MenuIcon open={menuOpen} />
            </button>
          </div>
        </div>
      </Container>

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
            aria-label="Primary, mobile"
            className="border-t border-navy-200 dark:border-navy-800 px-4 py-3"
          >
            <ul className="space-y-1">
              {navRoutes.map(({ path, label }) => (
                <li key={path}>
                  <NavLink to={path} onClick={closeMenu} className={mobileLinkClass}>
                    {label}
                  </NavLink>
                </li>
              ))}
              <li>
                <a
                  href={site.links.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={closeMenu}
                  className={mobileLinkClass({ isActive: false })}
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
