import { defineConfig } from "tsup";
import { preserveDirectivesPlugin } from "esbuild-plugin-preserve-directives";

// Separate entries for the component (Grapher), the pure spec DSL
// (GrapherTypes: slider/choose), the barrel (index), and the framework-agnostic
// logic. Code-splitting keeps the Grapher's code in its own chunk; the
// preserve-directives plugin re-attaches the "use client" directive esbuild
// would otherwise strip — onto the Grapher chunk ONLY. That keeps index.js and
// the DSL server-importable, which the hub relies on (its MDX calls
// choose()/slider() at SSG/server time).
export default defineConfig({
  entry: {
    index: "src/index.ts",
    Grapher: "src/Grapher.tsx",
    GrapherTypes: "src/GrapherTypes.ts",
    "logic/index": "src/logic/index.ts",
  },
  format: ["esm", "cjs"],
  dts: true,
  sourcemap: true,
  clean: true,
  splitting: true,
  // react/react-dom are peers — never bundle them.
  external: ["react", "react-dom"],
  esbuildPlugins: [
    preserveDirectivesPlugin({
      directives: ["use client", "use strict"],
      include: /\.(js|ts|jsx|tsx)$/,
      exclude: /node_modules/,
    }),
  ],
  // Copy the hand-authored, scoped stylesheet to ./dist/styles.css verbatim.
  onSuccess: "node scripts/postbuild.mjs",
});
