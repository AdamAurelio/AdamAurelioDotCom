// The single route manifest. Everything that needs to know "what pages exist"
// reads this file: the router (src/App.jsx), the header navigation
// (src/components/Header.jsx), and the sitemap generator
// (scripts/generate-sitemap.mjs). Add a page here and it appears in all three.
//
// Deliberately plain JS with no JSX and no Vite-only imports, so Node can
// import it directly from the sitemap script at build time.
//
//   path        absolute URL path
//   label       human name, used in navigation
//   nav         true → shown in the header; false → reachable but unlisted
//   priority /  sitemap hints. changefreq is a suggestion to crawlers, not a
//   changefreq  promise, so keep it honest.

export const routes = [
  { path: "/", label: "Home", nav: false, priority: "1.0", changefreq: "monthly" },
  { path: "/about", label: "About", nav: true, priority: "0.7", changefreq: "yearly" },
  { path: "/resume", label: "Résumé", nav: true, priority: "0.9", changefreq: "monthly" },
  { path: "/projects", label: "Projects", nav: true, priority: "0.8", changefreq: "monthly" },
  { path: "/how-i-work", label: "How I Work", nav: true, priority: "0.7", changefreq: "yearly" },
  { path: "/contact", label: "Contact", nav: true, priority: "0.6", changefreq: "yearly" },
];

/** Routes listed in the header, in display order. */
export const navRoutes = routes.filter((r) => r.nav);
