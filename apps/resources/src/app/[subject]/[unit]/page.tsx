import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getContentIndex } from "@/lib/content/load";
import { getBreadcrumbs, resolveUnit } from "@/lib/content/derive";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { ContentIndexList } from "@/components/ContentIndexList";

type Params = Promise<{ subject: string; unit: string }>;

export function generateStaticParams() {
  return getContentIndex().subjects.flatMap((s) =>
    s.units.map((u) => ({ subject: s.slug, unit: u.slug })),
  );
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { subject, unit } = await params;
  const node = resolveUnit(getContentIndex(), subject, unit);
  if (!node) return {};
  return {
    title: node.label,
    description: node.description,
    openGraph: {
      title: node.label,
      description: node.description,
      url: `/${subject}/${node.slug}`,
      siteName: "Math Resources Hub",
      type: "website",
    },
  };
}

export default async function UnitPage({ params }: { params: Params }) {
  const { subject, unit } = await params;
  const index = getContentIndex();
  const node = resolveUnit(index, subject, unit);
  if (!node) notFound();

  const crumbs = getBreadcrumbs(index, { subject, unit });
  const items = node.topics.map((topic) => ({
    href: topic.href,
    title: topic.title,
    description: topic.description,
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
