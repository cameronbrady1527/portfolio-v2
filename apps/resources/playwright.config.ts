import { defineConfig } from "@playwright/test";

/**
 * Smoke-level end-to-end config. Its job is narrow: guard against the "black
 * box" class of regression — that the interactive figures actually render on the
 * warm-paper canvas (see docs/component-ux-standard.md §4).
 *
 * Browser: the bundled Chromium (no `channel`), so CI just needs
 * `pnpm exec playwright install chromium` — no system Chrome required.
 * Server: reuses a dev server if one is already running on the port; otherwise
 * boots one. In CI it builds and serves the production output.
 */
const BASE_URL = process.env.BASE_URL ?? "http://localhost:3000";

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: "list",
  use: {
    baseURL: BASE_URL,
    browserName: "chromium",
    trace: "off",
  },
  webServer: {
    command: process.env.CI ? "pnpm build && pnpm start" : "pnpm dev",
    url: BASE_URL,
    reuseExistingServer: true,
    timeout: 180_000,
  },
});
