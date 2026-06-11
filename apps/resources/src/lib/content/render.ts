// Maps a topic slug to its compiled MDX module. The dynamic import uses a
// stable relative base (../../../content) so the bundler builds a context of
// all content/**/*.mdx — adding a new .mdx requires no registry edit here.
import type { TopicSlug } from "./derive";
import type { ComponentType } from "react";
import type { GrapherSpec } from "@/components/GrapherTypes";
import type { PracticeQuestion } from "@cameronbrady/math-components/logic";

// A compiled topic .mdx: the prose (default) plus optional typed named exports
// the TopicPage shell renders in its dedicated pillar slots.
export type TopicModule = {
  default: ComponentType;
  grapher?: { spec: GrapherSpec };
  practice?: PracticeQuestion[];
};

export function importTopicContent(slug: TopicSlug): Promise<TopicModule> {
  return import(`../../../content/${slug.subject}/${slug.unit}/${slug.topic}.mdx`);
}
