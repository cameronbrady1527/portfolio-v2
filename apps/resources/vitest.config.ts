import { defineConfig } from "vitest/config";
import { fileURLToPath } from "node:url";

export default defineConfig({
  // Vitest's transformer (oxc) needs the automatic JSX runtime to lower the
  // .tsx component tests.
  oxc: {
    jsx: {
      runtime: "automatic",
    },
  },
  // Component tests assert on DOM/behaviour, not styles — bypass the app's
  // Tailwind v4 PostCSS pipeline (and let mafs' core.css through harmlessly).
  css: {
    postcss: { plugins: [] },
  },
  test: {
    // Pure modules run in node; .tsx component tests opt into jsdom via a
    // per-file `/** @vitest-environment jsdom */` docblock.
    environment: "node",
    include: ["src/**/*.{test,spec}.{ts,tsx}"],
  },
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
});
