import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

/**
 * Automated accessibility scanning.
 *
 * A clean scan means "no machine-detectable violation" — automated rules find
 * roughly a third to a half of WCAG failures. It is a floor, never a WCAG 2.1
 * AA claim. Keyboard traversal, screen-reader announcement, and contrast on
 * real content stay manual (see docs/MODEL_CONFORMANCE.md #A11Y).
 */
export const WCAG_TAGS = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"];

/**
 * Rules this suite does not enforce. A disabled rule is a finding, not a fix:
 * every entry needs a reason and a review date. Empty is the correct state.
 */
export const DISABLED_RULES = [];

const describe = (violations) =>
  violations
    .map((v) => {
      const where = v.nodes
        .map((n) => n.target.join(" "))
        .slice(0, 5)
        .join("\n      ");
      return `  [${v.impact ?? "unknown"}] ${v.id} — ${v.help}\n    ${v.helpUrl}\n      ${where}`;
    })
    .join("\n");

/** Scan the current page and fail on any violation. `label` names the page in the report. */
export async function expectNoA11yViolations(page, label) {
  // Belt and braces with the reduced-motion fixture: never scan while a
  // transition is still blending colours.
  await page.evaluate(() =>
    Promise.all(document.getAnimations().map((a) => a.finished.catch(() => {})))
  );

  let builder = new AxeBuilder({ page }).withTags(WCAG_TAGS);
  if (DISABLED_RULES.length) builder = builder.disableRules(DISABLED_RULES.map((r) => r.id));

  const results = await builder.analyze();

  // A scan of a blank or unrendered page reports zero violations and looks
  // like a pass. If axe evaluated nothing, there was nothing to evaluate.
  if (results.violations.length === 0 && results.passes.length === 0) {
    throw new Error(
      `accessibility scan of "${label}" evaluated no rules at ${page.url()} — ` +
        "the page is empty or did not render, so zero violations proves nothing."
    );
  }

  if (results.violations.length > 0) {
    await test.info().attach(`axe-${label}.json`, {
      body: JSON.stringify(results.violations, null, 2),
      contentType: "application/json",
    });
  }

  expect(
    results.violations,
    `${results.violations.length} accessibility violation(s) on "${label}":\n` +
      `${describe(results.violations)}\n` +
      "(automated rules are a floor, not proof of WCAG 2.1 AA conformance)"
  ).toEqual([]);
}

/**
 * Collect uncaught page errors for the life of a page. The smoke suite asserts
 * the list is empty; the harness self-check proves the collector works.
 */
export function collectPageErrors(page) {
  const errors = [];
  page.on("pageerror", (err) => errors.push(err.message));
  return errors;
}
