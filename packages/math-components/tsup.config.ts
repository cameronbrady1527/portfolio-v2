import { defineConfig } from "tsup";

export default defineConfig({
  entry: {
    index: "src/index.ts",
    "logic/index": "src/logic/index.ts",
  },
  format: ["esm", "cjs"],
  dts: true,
  sourcemap: true,
  clean: true,
  treeshake: true,
  // react/react-dom are peers — never bundle them.
  external: ["react", "react-dom"],
  // Ship the self-contained stylesheet verbatim as ./dist/styles.css. It is
  // hand-authored, scoped CSS (no Tailwind build step), so a copy is faithful.
  onSuccess: "cp src/styles.css dist/styles.css",
});
