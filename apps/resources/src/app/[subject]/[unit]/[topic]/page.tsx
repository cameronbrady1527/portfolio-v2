import type { Metadata } from "next";
import { notFound } from "next/navigation";
import "katex/dist/katex.min.css";
import { loadContentEntries } from "@/lib/content/load";
import { buildIndex, getBreadcrumbs, resolveTopic, type TopicSlug } from "@/lib/content/derive";
import { importTopicContent } from "@/lib/content/render";
import { TopicPage } from "@/components/TopicPage";

type Params = Promise<TopicSlug>;

export function generateStaticParams() {
  const index = buildIndex(loadContentEntries());
  return index.subjects.flatMap((s) =>
    s.units.flatMap((u) =>
      u.topics.map((t) => ({ subject: s.slug, unit: u.slug, topic: t.slug.topic })),
    ),
  );
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const slug = await params;
  const topic = resolveTopic(loadContentEntries(), slug);
  if (!topic) return {};
  const description = topic.description;
  return {
    title: topic.title,
    description,
    openGraph: {
      title: topic.title,
      description,
      url: topic.href,
      siteName: "Math Resources Hub",
      type: "article",
    },
    twitter: {
      card: "summary",
      title: topic.title,
      description,
    },
  };
}

export default async function Page({ params }: { params: Params }) {
  const slug = await params;
  const entries = loadContentEntries();
  const topic = resolveTopic(entries, slug);
  if (!topic) notFound();

  const index = buildIndex(entries);
  const crumbs = getBreadcrumbs(index, slug);
  const { default: Content, grapher, practice } = await importTopicContent(slug);

  return (
    <TopicPage
      slug={slug}
      title={topic.title}
      crumbs={crumbs}
      index={index}
      grapher={grapher}
      practice={practice}
    >
      <Content />
    </TopicPage>
  );
}
