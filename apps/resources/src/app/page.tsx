import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button, Card, CardHeader, CardTitle } from "@repo/ui";
import { getContentIndex } from "@/lib/content/load";
import { subjectHref } from "@/lib/content/derive";
import type { SubjectNode } from "@/lib/content/derive";

// The hub front door. Subjects render in content-index order (driven by each
// subject's _meta.json `order`), so the lead subject is whichever sorts first —
// today that's Geometry, the flagship interactive track. Adding a topic .mdx
// makes it appear here automatically — no registry.
export default function Home() {
  const { subjects } = getContentIndex();
  const [lead, ...rest] = subjects;
  const leadHref = lead ? subjectHref(lead.slug) : undefined;

  return (
    <main className="graph-paper w-full flex-1 px-6 py-24">
      <section className="mx-auto flex w-full max-w-3xl flex-col items-center gap-8 text-center">
        <span className="font-mono text-xs uppercase tracking-[0.2em] text-primary">
          Math Resources Hub
        </span>

        <h1 className="font-display text-5xl font-semibold leading-tight text-foreground sm:text-6xl">
          Editorial-quality math,
          <br />
          one clean page at a time.
        </h1>

        <p className="max-w-xl text-base leading-relaxed text-muted-foreground">
          A growing library of worked examples, references, and interactive
          tools — set on warm paper, drawn on a familiar grid.
        </p>

        {lead && leadHref ? (
          <Button asChild>
            <Link href={leadHref}>
              Explore {lead.label}
              <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
        ) : null}
      </section>

      {/* Featured lead subject, then the rest of the tree below. */}
      {lead ? (
        <div className="mx-auto mt-24 w-full max-w-4xl">
          <SubjectSection subject={lead} featured />
        </div>
      ) : null}

      {rest.length > 0 ? (
        <div className="mx-auto mt-24 flex w-full max-w-4xl flex-col gap-16">
          {rest.map((subject) => (
            <SubjectSection key={subject.slug} subject={subject} />
          ))}
        </div>
      ) : null}
    </main>
  );
}

// One subject rendered as a heading + its unit/topic grids. The `featured`
// variant adds a primary eyebrow and the subject description to give the lead
// subject more presence above the fold.
function SubjectSection({
  subject,
  featured = false,
}: {
  subject: SubjectNode;
  featured?: boolean;
}) {
  return (
    <section className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        {featured ? (
          <span className="font-mono text-xs uppercase tracking-[0.2em] text-primary">
            Featured
          </span>
        ) : null}
        <h2 className="font-display text-2xl font-semibold text-foreground">
          <Link
            href={subjectHref(subject.slug)}
            className="transition-colors hover:text-primary"
          >
            {subject.label}
          </Link>
        </h2>
        {featured && subject.description ? (
          <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">
            {subject.description}
          </p>
        ) : null}
      </div>

      {subject.units.map((unit) => (
        <div key={unit.slug} className="flex flex-col gap-4">
          <span className="font-mono text-xs uppercase tracking-[0.15em] text-muted-foreground">
            {unit.label}
          </span>

          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {unit.topics.map((topic) => (
              <li key={topic.href}>
                <Link href={topic.href} className="group block h-full">
                  <Card className="h-full transition-colors group-hover:border-primary">
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between font-display text-lg text-foreground">
                        {topic.title}
                        <ArrowRight className="h-4 w-4 -translate-x-1 text-primary opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100" />
                      </CardTitle>
                    </CardHeader>
                  </Card>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </section>
  );
}
