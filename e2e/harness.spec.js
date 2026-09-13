import { test, expect } from "./fixtures.js";
import { expectNoA11yViolations, collectPageErrors } from "./a11y.js";

/**
 * Harness self-check — proves the suite itself is capable of failing.
 *
 * A green run is only evidence if it could have gone red. Each test here plants
 * a defect the smoke suite claims to catch and asserts that it is caught. If any
 * of these fail, no other result in the run means anything: fix the harness
 * first, and never skip one of these to get a run green.
 *
 * Pattern borrowed from agentic_engineering/templates/web-playwright.
 */
test.describe("harness self-check @harness", () => {
  test("the page-error collector actually captures errors", async ({ page }) => {
    const errors = collectPageErrors(page);
    await page.goto("/");

    await page.evaluate(() => {
      setTimeout(() => {
        throw new Error("harness-self-check-probe");
      }, 0);
    });

    await expect
      .poll(() => errors.join("|"), {
        message:
          'a deliberately thrown page error was not captured, so "no JavaScript errors" proves nothing',
        timeout: 5_000,
      })
      .toContain("harness-self-check-probe");
  });

  test("the accessibility scan actually reports a violation", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();

    // An image with no alt text is a violation axe is certain to detect.
    await page.evaluate(() => {
      const img = document.createElement("img");
      img.id = "harness-a11y-probe";
      img.src = "data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==";
      document.querySelector("main")?.appendChild(img);
    });

    await expect(
      expectNoA11yViolations(page, "harness-probe"),
      "an image with no alt text did not fail the scan — the accessibility suite is not enforcing anything"
    ).rejects.toThrow(/image-alt/i);
  });
});
