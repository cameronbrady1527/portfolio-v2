import Link from "next/link";
import type { ContentIndex, Crumb, TopicSlug } from "@/lib/content/derive";
import { Grapher } from "@/components/Grapher";
import type { GrapherSpec } from "@/components/GrapherTypes";
import { PracticeSet } from "@/components/PracticeSet";
import { TopicProvider } from "@/lib/topic-context";
import type { PracticeQuestion } from "@/lib/practice/grade";

// The repeatable three-pillar topic page, in fixed order:
//   breadcrumb -> title -> concept prose -> Grapher slot -> PracticeSet slot
//   -> collapsible teacher section -> footer.
// Grapher/PracticeSet are placeholders this slice (#7/#8 fill them).
export function TopicPage({
  slug,
  title,
  crumbs,
  index,
  grapher,
  practice,
  children,
}: {
  slug: TopicSlug;
  title: string;
  crumbs: Crumb[];
  index: ContentIndex;
  grapher?: { spec: GrapherSpec };
  practice?: PracticeQuestion[];
  children: React.ReactNode;
}) {
  const subject = index.subjects.find((s) => s.slug === slug.subject);
  const topicSlug = `${slug.subject}/${slug.unit}/${slug.topic}`;

  return (
    <div className="min-h-screen w-full">
      <div className="mx-auto flex w-full max-w-6xl gap-10 px-6 py-10">
        {/* Auto-derived nav for the current subject. */}
        <aside className="hidden w-56 shrink-0 lg:block">
          <nav aria-label="Topics" className="sticky top-10 flex flex-col gap-4 text-sm">
            {subject?.units.map((unit) => (
              <div key={unit.slug} className="flex flex-col gap-1">
                <span className="font-mono text-xs uppercase tracking-[0.15em] text-muted-foreground">
                  {unit.label}
                </span>
                <ul className="flex flex-col gap-1">
                  {unit.topics.map((t) => {
                    const current = t.slug.topic === slug.topic && unit.slug === slug.unit;
                    return (
                      <li key={t.href}>
                        <Link
                          href={t.href}
                          aria-current={current ? "page" : undefined}
                          className={
                            current
                              ? "font-medium text-primary"
                              : "text-foreground/80 hover:text-primary"
                          }
                        >
                          {t.title}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </nav>
        </aside>

        <article className="flex min-w-0 flex-1 flex-col gap-8">
          {/* Pillar 0: breadcrumb */}
          <nav aria-label="Breadcrumb">
            <ol className="flex flex-wrap items-center gap-2 font-mono text-xs uppercase tracking-[0.15em] text-muted-foreground">
              {crumbs.map((crumb, i) => (
                <li key={`${crumb.label}-${i}`} className="flex items-center gap-2">
                  {i > 0 && <span aria-hidden className="text-border">/</span>}
                  {crumb.href && i < crumbs.length - 1 ? (
                    <Link href={crumb.href} className="hover:text-primary">
                      {crumb.label}
                    </Link>
                  ) : (
                    <span className={i === crumbs.length - 1 ? "text-foreground" : undefined}>
                      {crumb.label}
                    </span>
                  )}
                </li>
              ))}
            </ol>
          </nav>

          {/* Pillar 1: title */}
          <h1 className="font-display text-4xl font-semibold leading-tight text-foreground sm:text-5xl">
            {title}
          </h1>

          {/* Pillar 2: concept prose (MDX) */}
          <section className="topic-prose flex flex-col gap-4 text-base leading-relaxed text-foreground">
            {children}
          </section>

          {/* Pillar 3: interactive figure */}
          {grapher && (
            <section aria-label="Interactive figure">
              <Grapher spec={grapher.spec} />
            </section>
          )}

          {/* Pillar 4: practice */}
          {practice && practice.length > 0 && (
            <section aria-label="Practice">
              <TopicProvider slug={topicSlug}>
                <PracticeSet questions={practice} />
              </TopicProvider>
            </section>
          )}

          {/* Pillar 5: collapsible teacher section */}
          <details className="rounded-lg border border-border bg-card p-4">
            <summary className="cursor-pointer font-mono text-xs uppercase tracking-[0.15em] text-muted-foreground">
              For teachers
            </summary>
            <div className="mt-3 flex flex-col gap-2 text-sm text-muted-foreground">
              <p>Standard, common misconceptions, and suggested use will live here.</p>
            </div>
          </details>

          {/* Pillar 6: footer */}
          <footer className="mt-4 border-t border-border pt-4 font-mono text-xs text-muted-foreground">
            Math Resources Hub
          </footer>
        </article>
      </div>
    </div>
  );
}
