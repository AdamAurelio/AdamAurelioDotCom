import { test as base, expect } from "@playwright/test";

/**
 * Shared test fixture: every page runs with `prefers-reduced-motion: reduce`.
 *
 * Why: the scroll-reveal fades run 500 ms. An axe scan or assertion taken
 * mid-fade sees blended colours and elements at opacity 0 — contrast failures
 * that do not exist at rest. Reduced motion renders every element in its
 * final state on first paint, which is also exactly what a visitor who asked
 * for reduced motion gets, so it is a legitimate state to verify.
 *
 * Applied via page.emulateMedia because the `reducedMotion` context option
 * in playwright.config.js / test.use() did not reach the page in this
 * Playwright version (verified 2026-09-12, @playwright/test 1.60).
 */
export const test = base.extend({
  page: async ({ page }, use) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await use(page);
  },
});

export { expect };
