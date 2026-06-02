// Maps a topic slug to its compiled MDX module. The dynamic import uses a
// stable relative base (../../../content) so the bundler builds a context of
// all content/**/*.mdx — adding a new .mdx requires no registry edit here.
import type { TopicSlug } from "./derive";
import type { ComponentType } from "react";

type MDXModule = { default: ComponentType };

export function importTopicContent(slug: TopicSlug): Promise<MDXModule> {
  return import(`../../../content/${slug.subject}/${slug.unit}/${slug.topic}.mdx`);
}
