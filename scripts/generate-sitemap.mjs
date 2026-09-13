// Emits public/sitemap.xml, which Vite copies into dist/ on build.
//
// Runs as `prebuild`, so the sitemap cannot go stale relative to a release.
// Output is deterministic — deliberately no <lastmod>. A timestamp regenerated
// on every build produces a diff on every build while telling search engines
// nothing true about when the content actually changed, and Google ignores
// lastmod it judges to be auto-stamped. Reintroduce it only if it is wired to
// real per-page modification dates.
//
// The route list comes from src/routes.js — the same manifest the router and
// the header read — so a page cannot exist without being in the sitemap. The
// catch-all 404 route is not in the manifest on purpose: it is not a page
// worth indexing.

import { writeFileSync, mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { routes } from "../src/routes.js";

const BASE_URL = "https://adamaurelio.com";

const urls = routes
  .map(
    ({ path, priority, changefreq }) => `  <url>
    <loc>${BASE_URL}${path}</loc>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`
  )
  .join("\n");

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`;

const outPath = resolve(
  dirname(fileURLToPath(import.meta.url)),
  "..",
  "public",
  "sitemap.xml"
);

mkdirSync(dirname(outPath), { recursive: true });
writeFileSync(outPath, sitemap, "utf8");

console.log(`sitemap: ${routes.length} routes → ${outPath}`);
