import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getContentIndex } from "@/lib/content/load";
import { getBreadcrumbs, resolveSubject, unitHref } from "@/lib/content/derive";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { ContentIndexList } from "@/components/ContentIndexList";

type Params = Promise<{ subject: string }>;

export function generateStaticParams() {
  return getContentIndex().subjects.map((s) => ({ subject: s.slug }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { subject } = await params;
  const node = resolveSubject(getContentIndex(), subject);
  if (!node) return {};
  return {
    title: node.label,
    description: node.description,
    openGraph: {
      title: node.label,
      description: node.description,
      url: `/${node.slug}`,
      siteName: "Math Resources Hub",
      type: "website",
    },
  };
}

const pluralize = (n: number, word: string) => `${n} ${word}${n === 1 ? "" : "s"}`;

export default async function SubjectPage({ params }: { params: Params }) {
  const { subject } = await params;
  const index = getContentIndex();
  const node = resolveSubject(index, subject);
  if (!node) notFound();

  const crumbs = getBreadcrumbs(index, { subject });
  const items = node.units.map((unit) => ({
    href: unitHref(node.slug, unit.slug),
    title: unit.label,
    description: unit.description,
    meta: pluralize(unit.topics.length, "topic"),
  }));

  return (
    <div className="w-full">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6 py-10">
        <Breadcrumbs crumbs={crumbs} />
        <header className="flex flex-col gap-3">
          <h1 className="font-display text-4xl font-semibold leading-tight text-foreground sm:text-5xl">
            {node.label}
          </h1>
          {node.intro ?? node.description ? (
            <p className="max-w-2xl text-base leading-relaxed text-muted-foreground">
              {node.intro ?? node.description}
            </p>
          ) : null}
        </header>
        <ContentIndexList items={items} />
      </div>
    </div>
  );
}
