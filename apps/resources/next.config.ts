import type { NextConfig } from "next";
import createMDX from "@next/mdx";

const nextConfig: NextConfig = {
  transpilePackages: ["@repo/ui"],
  // .mdx is imported (not routed) from content/, but registering the extension
  // keeps @next/mdx's loader/pipeline aligned with docs.
  pageExtensions: ["ts", "tsx", "md", "mdx"],
};

const withMDX = createMDX({
  // Plugins are given by string name (not function refs) so they resolve inside
  // Turbopack's worker. remark-frontmatter parses/strips the `---` block;
  // remark-math + rehype-katex render `$…$` / `$$…$$` to KaTeX at build time.
  options: {
    remarkPlugins: [["remark-frontmatter"], ["remark-math"]],
    rehypePlugins: [["rehype-katex"]],
  },
});

export default withMDX(nextConfig);
