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
  /** Short summary from frontmatter; used for metadata / OpenGraph. */
  description?: string;
  /** Optional grouping label within a unit (e.g. a Foundations strand). */
  strand?: string;
};

export type Crumb = { label: string; href?: string };

export type TopicNode = {
  slug: TopicSlug;
  title: string;
  order: number;
  href: string;
  description?: string;
  strand?: string;
};

/** A unit's topics grouped under a strand label (null = ungrouped). */
export type StrandGroup = { strand: string | null; topics: TopicNode[] };
export type UnitNode = {
  slug: string;
  label: string;
  description?: string;
  intro?: string;
  topics: TopicNode[];
};
export type SubjectNode = {
  slug: string;
  label: string;
  description?: string;
  intro?: string;
  units: UnitNode[];
};
export type ContentIndex = { subjects: SubjectNode[] };

/** Optional editorial overrides for a subject or unit (the `_meta` seam). */
export type NodeMeta = { label?: string; description?: string; intro?: string; order?: number };
/**
 * Optional per-subject / per-unit metadata folded into the index. Subjects are
 * keyed by subject slug; units by `"<subject>/<unit>"`. Entirely optional —
 * absent metadata yields humanized labels and alphabetical order (no-registry
 * authoring stays intact).
 */
export type ContentMeta = {
  subjects?: Record<string, NodeMeta>;
  units?: Record<string, NodeMeta>;
};

// Subjects/units without an explicit meta order sort after ordered ones, then
// alphabetically among themselves.
const ORDER_DEFAULT = Number.MAX_SAFE_INTEGER;

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

/** Canonical route for a subject landing page. */
export function subjectHref(subject: string): string {
  return `/${subject}`;
}

/** Canonical route for a unit landing page. */
export function unitHref(subject: string, unit: string): string {
  return `/${subject}/${unit}`;
}

function toTopicNode(entry: ContentEntry): TopicNode {
  return {
    slug: entry.slug,
    title: entry.title,
    order: entry.order,
    href: topicHref(entry.slug),
    description: entry.description,
    strand: entry.strand,
  };
}

/** Look up a subject node in the index by slug; null if absent. */
export function resolveSubject(index: ContentIndex, subjectSlug: string): SubjectNode | null {
  return index.subjects.find((s) => s.slug === subjectSlug) ?? null;
}

/** Look up a unit node in the index by subject + unit slug; null if absent. */
export function resolveUnit(
  index: ContentIndex,
  subjectSlug: string,
  unitSlug: string,
): UnitNode | null {
  const subject = resolveSubject(index, subjectSlug);
  return subject?.units.find((u) => u.slug === unitSlug) ?? null;
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

/**
 * Group a unit's topics into ordered strand sections. Topics carrying a `strand`
 * are bucketed under it; topics without one fall into a single ungrouped bucket
 * (strand: null) that always sorts LAST. Within a section, topics keep their
 * `order` sort. Sections themselves order by the smallest `order` among their
 * topics — so authors sequence strands the same way they sequence topics, with
 * no separate registry. A unit with no strands yields one ungrouped section,
 * which renders identically to a flat list.
 */
export function groupTopicsByStrand(topics: TopicNode[]): StrandGroup[] {
  const buckets = new Map<string | null, TopicNode[]>();
  for (const topic of topics) {
    const key = topic.strand ?? null;
    if (!buckets.has(key)) buckets.set(key, []);
    buckets.get(key)!.push(topic);
  }

  const groups: StrandGroup[] = [...buckets.entries()].map(([strand, ts]) => ({
    strand,
    topics: [...ts].sort(byOrderThenTitle),
  }));

  const groupOrder = (g: StrandGroup) =>
    g.strand === null
      ? Number.MAX_SAFE_INTEGER
      : Math.min(...g.topics.map((t) => t.order));

  return groups.sort(
    (a, b) =>
      groupOrder(a) - groupOrder(b) ||
      (a.strand ?? "￿").localeCompare(b.strand ?? "￿"),
  );
}

/**
 * Group flat entries into a subject -> unit -> topic tree. Labels and ordering
 * come from optional `_meta` (see ContentMeta); absent meta falls back to
 * humanized labels and alphabetical subject/unit order. Topics always order by
 * their frontmatter `order`.
 */
export function buildIndex(entries: ContentEntry[], meta: ContentMeta = {}): ContentIndex {
  const subjects = new Map<string, Map<string, TopicNode[]>>();

  for (const entry of entries) {
    const { subject, unit } = entry.slug;
    if (!subjects.has(subject)) subjects.set(subject, new Map());
    const units = subjects.get(subject)!;
    if (!units.has(unit)) units.set(unit, []);
    units.get(unit)!.push(toTopicNode(entry));
  }

  const subjectOrder = (slug: string) => meta.subjects?.[slug]?.order ?? ORDER_DEFAULT;
  const unitOrder = (subject: string, unit: string) =>
    meta.units?.[`${subject}/${unit}`]?.order ?? ORDER_DEFAULT;

  const subjectNodes: SubjectNode[] = [...subjects.entries()].map(([subjectSlug, units]) => {
    const sMeta = meta.subjects?.[subjectSlug];

    const unitNodes: UnitNode[] = [...units.entries()]
      .map(([unitSlug, topics]) => {
        const uMeta = meta.units?.[`${subjectSlug}/${unitSlug}`];
        return {
          slug: unitSlug,
          label: uMeta?.label ?? humanize(unitSlug),
          description: uMeta?.description,
          intro: uMeta?.intro,
          topics: [...topics].sort(byOrderThenTitle),
        };
      })
      .sort(
        (a, b) =>
          unitOrder(subjectSlug, a.slug) - unitOrder(subjectSlug, b.slug) ||
          a.label.localeCompare(b.label),
      );

    return {
      slug: subjectSlug,
      label: sMeta?.label ?? humanize(subjectSlug),
      description: sMeta?.description,
      intro: sMeta?.intro,
      units: unitNodes,
    };
  });

  subjectNodes.sort(
    (a, b) => subjectOrder(a.slug) - subjectOrder(b.slug) || a.label.localeCompare(b.label),
  );

  return { subjects: subjectNodes };
}

/** A location anywhere in the content tree: a subject, a unit, or a topic. */
export type ContentLocation = { subject: string; unit?: string; topic?: string };

/**
 * Breadcrumb trail for any level of the tree. Every crumb (including the leaf)
 * carries the href of its landing page; the Breadcrumbs component decides not
 * to link the current (leaf) crumb. Returns [] if any segment is unknown.
 *
 *   { subject }                 -> [Subject]
 *   { subject, unit }           -> [Subject, Unit]
 *   { subject, unit, topic }    -> [Subject, Unit, Topic]
 */
export function getBreadcrumbs(index: ContentIndex, location: ContentLocation): Crumb[] {
  const subject = resolveSubject(index, location.subject);
  if (!subject) return [];
  const crumbs: Crumb[] = [{ label: subject.label, href: subjectHref(subject.slug) }];

  if (location.unit === undefined) return crumbs;
  const unit = subject.units.find((u) => u.slug === location.unit);
  if (!unit) return [];
  crumbs.push({ label: unit.label, href: unitHref(subject.slug, unit.slug) });

  if (location.topic === undefined) return crumbs;
  const topic = unit.topics.find((t) => t.slug.topic === location.topic);
  if (!topic) return [];
  crumbs.push({ label: topic.title, href: topic.href });

  return crumbs;
}
