import type { Metadata } from "next";
import {
  listSupportSlugs,
  loadSupportEntryMeta,
} from "@/lib/content/support";
import { importGlossaryEntry } from "@/lib/content/render";
import { humanize } from "@/lib/content/derive";

export const metadata: Metadata = {
  title: "Glossary",
  description:
    "Every term used across the hub, in plain language first and the formal definition second.",
};

// All glossary entries, grouped by subject. Entries are individual MDX files
// in content/_glossary — drop a file, it appears here and becomes available
// to <Term> in any topic.
export default async function GlossaryPage() {
  const slugs = listSupportSlugs("glossary");
  const entries = await Promise.all(
    slugs.map(async (slug) => {
      const meta = loadSupportEntryMeta("glossary", slug, "/glossary");
      const { default: Definition } = await importGlossaryEntry(slug);
      return { ...meta, subject: meta.subject ?? "general", Definition };
    }),
  );

  const subjects = [...new Set(entries.map((e) => e.subject))].sort();

  return (
    <div className="w-full">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6 py-10">
        <header className="flex flex-col gap-3">
          <h1 className="font-display text-4xl font-semibold leading-tight text-foreground sm:text-5xl">
            Glossary
          </h1>
          <p className="max-w-2xl text-base leading-relaxed text-muted-foreground">
            Every term used across the hub — in plain language first, with the
            formal definition alongside.
          </p>
        </header>

        {subjects.map((subject) => (
          <section key={subject} className="flex flex-col gap-4">
            <h2 className="font-display text-2xl font-semibold text-foreground">
              {humanize(subject)}
            </h2>
            <dl className="flex flex-col gap-6">
              {entries
                .filter((e) => e.subject === subject)
                .map(({ slug, title, Definition }) => (
                  <div key={slug} className="rounded-md border border-border bg-card p-5">
                    <dt className="mb-2 text-base font-semibold text-foreground">
                      {title}
                    </dt>
                    <dd className="text-sm leading-relaxed text-muted-foreground [&_p]:mb-2 [&_p:last-child]:mb-0">
                      <Definition />
                    </dd>
                  </div>
                ))}
            </dl>
          </section>
        ))}
      </div>
    </div>
  );
}
