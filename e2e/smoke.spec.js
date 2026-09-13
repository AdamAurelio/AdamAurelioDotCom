import { test, expect } from "./fixtures.js";
import { routes } from "../src/routes.js";
import { expectNoA11yViolations, collectPageErrors } from "./a11y.js";

// Every page in the manifest: loads, renders a main landmark, throws no
// JavaScript errors, and passes the automated accessibility scan.
test.describe("smoke", () => {
  for (const { path } of routes) {
    test(`${path} loads clean and accessible`, async ({ page }) => {
      const errors = collectPageErrors(page);

      const res = await page.goto(path);
      expect(res?.status(), `HTTP status for ${path}`).toBeLessThan(400);

      const main = page.locator("main");
      await expect(main).toBeVisible();
      await expect(main).toHaveAttribute("data-app-ready", "true");
      // The route chunk is lazy; wait for the page's own heading before scanning.
      await expect(page.getByRole("heading", { level: 1 })).toBeVisible();

      expect(errors, `uncaught page errors on ${path}`).toEqual([]);
      await expectNoA11yViolations(page, path);
    });
  }

  test("deep-link refresh on /resume works (SPA history fallback)", async ({ page }) => {
    await page.goto("/resume");
    await page.reload(); // a real static host would 404 here without the fallback
    await expect(page).toHaveURL(/\/resume$/);
    await expect(page.locator("main")).toBeVisible();
  });

  test("an unknown URL renders the 404 page", async ({ page }) => {
    await page.goto("/definitely-not-a-page");
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(/lost the trail/i);
  });

  test("client-side navigation resets scroll and moves focus to main", async ({ page }) => {
    await page.goto("/");
    // The route chunk is lazy; the page has no height until it renders.
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    expect(await page.evaluate(() => window.scrollY)).toBeGreaterThan(0);

    await page.getByRole("navigation", { name: "Primary" }).getByRole("link", { name: "About" }).click();
    await expect(page).toHaveURL(/\/about$/);
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();

    expect(await page.evaluate(() => window.scrollY)).toBe(0);
    expect(await page.evaluate(() => document.activeElement?.id)).toBe("main");
  });

  test("the active nav link is marked with aria-current", async ({ page }) => {
    await page.goto("/projects");
    const primary = page.getByRole("navigation", { name: "Primary" });
    await expect(primary.locator('[aria-current="page"]')).toHaveText("Projects");
  });
});
