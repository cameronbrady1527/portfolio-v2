// Pure content-index derivation. No filesystem, no Next, no React — just data
// transforms over scanned content entries, so it is fully unit-testable with
// fixtures. The fs adapter (load.ts) produces ContentEntry[]; everything a page
// needs (nav tree, breadcrumbs, slug resolution) is derived here.

export type TopicSlug = { subject: string; unit: string; topic: string };

/** One topic discovered in the content tree, with its frontmatter. */
export type ContentEntry = {
  slug: TopicSlug;
  title: string;
  order: number;
};

export type Crumb = { label: string; href?: string };

export type TopicNode = {
  slug: TopicSlug;
  title: string;
  order: number;
  href: string;
};
export type UnitNode = { slug: string; label: string; topics: TopicNode[] };
export type SubjectNode = { slug: string; label: string; units: UnitNode[] };
export type ContentIndex = { subjects: SubjectNode[] };

/** "linear-equations" -> "Linear Equations" */
export function humanize(slug: string): string {
  return slug
    .split("-")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

/** Canonical 3-level route for a topic. */
export function topicHref(slug: TopicSlug): string {
  return `/${slug.subject}/${slug.unit}/${slug.topic}`;
}

function toTopicNode(entry: ContentEntry): TopicNode {
  return { slug: entry.slug, title: entry.title, order: entry.order, href: topicHref(entry.slug) };
}

/** Look up a single topic's metadata by slug; null if it isn't in the tree. */
export function resolveTopic(entries: ContentEntry[], slug: TopicSlug): TopicNode | null {
  const match = entries.find(
    (e) => e.slug.subject === slug.subject && e.slug.unit === slug.unit && e.slug.topic === slug.topic,
  );
  return match ? toTopicNode(match) : null;
}

// Topics order by frontmatter `order`, then title as a stable tiebreak.
function byOrderThenTitle(a: TopicNode, b: TopicNode): number {
  return a.order - b.order || a.title.localeCompare(b.title);
}

/** Group flat entries into a subject -> unit -> topic tree (alpha subjects/units, ordered topics). */
export function buildIndex(entries: ContentEntry[]): ContentIndex {
  const subjects = new Map<string, Map<string, TopicNode[]>>();

  for (const entry of entries) {
    const { subject, unit } = entry.slug;
    if (!subjects.has(subject)) subjects.set(subject, new Map());
    const units = subjects.get(subject)!;
    if (!units.has(unit)) units.set(unit, []);
    units.get(unit)!.push(toTopicNode(entry));
  }

  return {
    subjects: [...subjects.entries()]
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([subjectSlug, units]) => ({
        slug: subjectSlug,
        label: humanize(subjectSlug),
        units: [...units.entries()]
          .sort(([a], [b]) => a.localeCompare(b))
          .map(([unitSlug, topics]) => ({
            slug: unitSlug,
            label: humanize(unitSlug),
            topics: [...topics].sort(byOrderThenTitle),
          })),
      })),
  };
}

/**
 * Breadcrumb trail for a topic: [Subject, Unit, Topic]. Subject/Unit are labels
 * only (no listing pages in v1); the final topic crumb links to itself.
 * Returns [] for an unknown topic.
 */
export function getBreadcrumbs(index: ContentIndex, slug: TopicSlug): Crumb[] {
  const subject = index.subjects.find((s) => s.slug === slug.subject);
  const unit = subject?.units.find((u) => u.slug === slug.unit);
  const topic = unit?.topics.find((t) => t.slug.topic === slug.topic);
  if (!subject || !unit || !topic) return [];
  return [
    { label: subject.label },
    { label: unit.label },
    { label: topic.title, href: topic.href },
  ];
}
