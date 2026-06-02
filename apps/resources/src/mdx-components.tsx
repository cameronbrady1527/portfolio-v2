import type { MDXComponents } from "mdx/types";

// Required by @next/mdx in the App Router. Topic prose inherits the global
// typographic styles from globals.css; per-element overrides can be added here.
export function useMDXComponents(components: MDXComponents): MDXComponents {
  return { ...components };
}
