// Post-build fixup: copy the hand-authored, scoped stylesheet to
// ./dist/styles.css verbatim. (The "use client" directive on the Grapher
// output is handled at build time by esbuild-plugin-preserve-directives.)
import { copyFileSync } from "node:fs";

copyFileSync("src/styles.css", "dist/styles.css");
