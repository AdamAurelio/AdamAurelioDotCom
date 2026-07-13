import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const routes = ["/", "/resume", "/projects", "/about", "/contact"];

test.describe("smoke", () => {
  for (const path of routes) {
    test(`loads ${path} with a main landmark`, async ({ page }) => {
      const res = await page.goto(path);
      expect(res?.status(), `HTTP status for ${path}`).toBeLessThan(400);
      await expect(page.locator("main")).toBeVisible();
    });
  }

  test("deep-link refresh on /resume works (SPA history fallback)", async ({
    page,
  }) => {
    await page.goto("/resume");
    await page.reload(); // a real static host would 404 here without the fallback
    await expect(page).toHaveURL(/\/resume$/);
    await expect(page.locator("main")).toBeVisible();
  });

  // Accessibility gate. Scoped to critical-only for now so it doesn't block on
  // pre-existing 'serious' debt (e.g. contrast); tighten to include 'serious'
  // once the a11y pass in docs/MODEL_CONFORMANCE.md (#A11Y) is done.
  test("home has no critical accessibility violations", async ({ page }) => {
    await page.goto("/");
    const { violations } = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa"])
      .analyze();
    const critical = violations.filter((v) => v.impact === "critical");
    expect(critical, JSON.stringify(critical, null, 2)).toEqual([]);
  });
});
