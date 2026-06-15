import { test, expect } from "@playwright/test";

/**
 * The regression that motivated this guard: mafs paints its plane with an
 * opaque black background unless we wire its theme vars, so the figure rendered
 * as a black box on the warm-paper page and the dark preimage was invisible.
 * A unit test can't catch it — only the rendered result can. This is the single
 * assertion that would have caught it.
 */

// --cbmc-paper-bg (#f7f5ef) as the browser reports it.
const PAPER = "rgb(247, 245, 239)";
const BLACK = "rgb(0, 0, 0)";

// One Grapher topic and the two bespoke widgets — all render through .MafsView.
const ROUTES = [
  "/geometry/transformations/dilations",
  "/geometry/transformations/sequences",
  "/geometry/transformations/symmetry",
];

for (const route of ROUTES) {
  test(`figure renders on the paper canvas, not a black box: ${route}`, async ({
    page,
  }) => {
    await page.goto(route);

    const view = page.locator(".MafsView").first();
    await expect(view).toBeVisible();

    // The canvas is paper, not the mafs default black.
    const bg = await view.evaluate(
      (el) => getComputedStyle(el).backgroundColor,
    );
    expect(bg).not.toBe(BLACK);
    expect(bg).toBe(PAPER);

    // And the figure actually drew geometry (polygon / segment / path).
    const shapes = await view.locator("svg polygon, svg path, svg line").count();
    expect(shapes).toBeGreaterThan(0);
  });
}
