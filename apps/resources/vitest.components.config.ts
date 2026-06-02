import { defineConfig } from "vitest/config";
import { fileURLToPath } from "node:url";

/**
 * Companion Vitest config for React component tests (*.test.tsx).
 *
 * The base `vitest.config.ts` (owned by the lead / shared) only collects
 * `src/**​/*.{test,spec}.ts` in a node env. This config is additive: it
 * collects `.tsx` component tests so they can be run without touching the
 * shared config. Each component test declares its own
 * `/** @vitest-environment jsdom *​/` docblock.
 *
 * Run with: pnpm --filter resources test:components
 */
export default defineConfig({
  // Vite 8 uses oxc for transforms; enable the automatic JSX runtime so
  // `.tsx` component tests are lowered before the SSR transform runs.
  oxc: {
    jsx: {
      runtime: "automatic",
    },
  },
  // Bypass the app's Tailwind v4 PostCSS config during tests with an inline
  // empty PostCSS pipeline. Component tests assert on DOM/behaviour, not styles,
  // and mafs imports its own core.css which we let through harmlessly.
  css: {
    postcss: { plugins: [] },
  },
  test: {
    environment: "node",
    include: ["src/**/*.{test,spec}.tsx"],
  },
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
});
