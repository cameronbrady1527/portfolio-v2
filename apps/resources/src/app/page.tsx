import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button, Card, CardHeader, CardTitle } from "@repo/ui";
import { getContentIndex } from "@/lib/content/load";

// The hub front door: hero + the full Subject -> Unit -> Topic tree as links,
// derived from the same content-index that powers the in-page nav. Adding a
// topic .mdx makes it appear here automatically — no registry edit.
export default function Home() {
  const { subjects } = getContentIndex();
  const firstTopic = subjects[0]?.units[0]?.topics[0];

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

        {firstTopic ? (
          <Button asChild>
            <Link href={firstTopic.href}>
              Start with {firstTopic.title}
              <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
        ) : null}
      </section>

      {subjects.length > 0 ? (
        <div className="mx-auto mt-24 flex w-full max-w-4xl flex-col gap-16">
          {subjects.map((subject) => (
            <section key={subject.slug} className="flex flex-col gap-6">
              <h2 className="font-display text-2xl font-semibold text-foreground">
                {subject.label}
              </h2>

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
          ))}
        </div>
      ) : null}
    </main>
  );
}
