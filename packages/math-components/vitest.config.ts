import { defineConfig } from "vitest/config";

export default defineConfig({
  // Vitest's transformer (oxc) needs the automatic JSX runtime to lower the
  // .tsx component tests that arrive with the Grapher in a later slice.
  oxc: {
    jsx: {
      runtime: "automatic",
    },
  },
  test: {
    // Pure logic runs in node; tests that need a DOM (the progress adapter,
    // and the Grapher) opt into jsdom via a per-file
    // `/** @vitest-environment jsdom */` docblock.
    environment: "node",
    include: ["src/**/*.{test,spec}.{ts,tsx}"],
  },
});
