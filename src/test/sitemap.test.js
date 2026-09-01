import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

// The sitemap's route list lives in scripts/generate-sitemap.mjs, separate from
// the router in src/App.jsx. That duplication is the price of keeping App.jsx
// readable, so this test is the thing that keeps the two honest: add a page to
// the router without adding it to the sitemap and this fails.

const read = (...parts) => readFileSync(resolve(process.cwd(), ...parts), "utf8");

const routerPaths = () => {
  const app = read("src", "App.jsx");
  return [...app.matchAll(/<Route\s+path="([^"]+)"/g)]
    .map((m) => m[1])
    // The catch-all is not a page.
    .filter((p) => p !== "*")
    // Child routes are declared relative to the layout route ("resume"), while
    // the layout route itself is already absolute ("/").
    .map((p) => (p.startsWith("/") ? p : `/${p}`));
};

const sitemapPaths = () => {
  const xml = read("public", "sitemap.xml");
  return [...xml.matchAll(/<loc>https:\/\/adamaurelio\.com([^<]*)<\/loc>/g)].map(
    (m) => m[1] || "/"
  );
};

describe("sitemap.xml", () => {
  it("covers every route the router renders", () => {
    const missing = routerPaths().filter((p) => !sitemapPaths().includes(p));
    expect(missing, `routes missing from sitemap: ${missing.join(", ")}`).toEqual([]);
  });

  it("lists no URL the router cannot serve", () => {
    const known = [...routerPaths(), "/"];
    const extra = sitemapPaths().filter((p) => !known.includes(p));
    expect(extra, `sitemap lists unroutable URLs: ${extra.join(", ")}`).toEqual([]);
  });
});
