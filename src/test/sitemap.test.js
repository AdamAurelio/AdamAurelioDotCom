import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { routes, navRoutes } from "../routes";

// The route manifest (src/routes.js) feeds the router, the header, and the
// sitemap generator. The generator writes public/sitemap.xml at build time,
// but that file is also committed, so this test keeps the committed copy honest:
// add a route without regenerating the sitemap and it fails.

const read = (...parts) => readFileSync(resolve(process.cwd(), ...parts), "utf8");

const sitemapPaths = () => {
  const xml = read("public", "sitemap.xml");
  return [...xml.matchAll(/<loc>https:\/\/adamaurelio\.com([^<]*)<\/loc>/g)].map(
    (m) => m[1] || "/"
  );
};

describe("route manifest", () => {
  it("has unique, absolute paths", () => {
    const paths = routes.map((r) => r.path);
    expect(new Set(paths).size).toBe(paths.length);
    expect(paths.every((p) => p.startsWith("/"))).toBe(true);
  });

  it("lists only nav-flagged routes in navigation", () => {
    expect(navRoutes.every((r) => r.nav)).toBe(true);
    expect(navRoutes.map((r) => r.path)).not.toContain("/");
  });
});

describe("sitemap.xml", () => {
  it("covers every route in the manifest", () => {
    const listed = sitemapPaths();
    const missing = routes.map((r) => r.path).filter((p) => !listed.includes(p));
    expect(missing, `routes missing from sitemap: ${missing.join(", ")}`).toEqual([]);
  });

  it("lists no URL the router cannot serve", () => {
    const known = routes.map((r) => r.path);
    const extra = sitemapPaths().filter((p) => !known.includes(p));
    expect(extra, `sitemap lists unroutable URLs: ${extra.join(", ")}`).toEqual([]);
  });
});
