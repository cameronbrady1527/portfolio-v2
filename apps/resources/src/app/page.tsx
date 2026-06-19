import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button, Card, CardHeader, CardTitle, CardDescription } from "@repo/ui";
import { getContentIndex } from "@/lib/content/load";
import { unitHref } from "@/lib/content/derive";

// The hub front door: a "start here" on-ramp to the Foundations track, then the
// full Subject -> Unit -> Topic tree as links, all derived from the content
// index. Adding a topic .mdx makes it appear here automatically — no registry.
export default function Home() {
  const { subjects } = getContentIndex();

  // Foundations is the deliberate starting point. Feature its first unit as the
  // "start here" on-ramp, and list the remaining subjects below.
  const foundations = subjects.find((s) => s.slug === "foundations");
  const startHereUnit = foundations?.units[0];
  const startHereHref = startHereUnit
    ? unitHref(foundations!.slug, startHereUnit.slug)
    : undefined;
  const otherSubjects = subjects.filter((s) => s.slug !== "foundations");

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

        {startHereHref ? (
          <Button asChild>
            <Link href={startHereHref}>
              Start here
              <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
        ) : null}
      </section>

      {/* Start-here on-ramp: the Foundations track. */}
      {startHereUnit && startHereHref ? (
        <div className="mx-auto mt-20 w-full max-w-4xl">
          <Link href={startHereHref} className="group block">
            <Card className="border-primary/40 bg-card/80 transition-colors group-hover:border-primary">
              <CardHeader className="gap-2">
                <span className="font-mono text-xs uppercase tracking-[0.2em] text-primary">
                  Start here
                </span>
                <CardTitle className="flex items-center justify-between gap-3 font-display text-2xl text-foreground">
                  {startHereUnit.label}
                  <ArrowRight className="h-5 w-5 shrink-0 -translate-x-1 text-primary opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100" />
                </CardTitle>
                {startHereUnit.description ? (
                  <CardDescription className="max-w-2xl text-sm leading-relaxed">
                    {startHereUnit.description}
                  </CardDescription>
                ) : null}
              </CardHeader>
            </Card>
          </Link>
        </div>
      ) : null}

      {otherSubjects.length > 0 ? (
        <div className="mx-auto mt-24 flex w-full max-w-4xl flex-col gap-16">
          {otherSubjects.map((subject) => (
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
