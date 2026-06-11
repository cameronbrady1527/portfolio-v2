import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription } from "@repo/ui";

// One child of a landing page: a unit (on a subject page) or a topic (on a
// unit page). `meta` is a small label like "3 topics".
export type ContentIndexItem = {
  href: string;
  title: string;
  description?: string;
  meta?: string;
};

// Shared listing for subject/unit landing pages: a responsive grid of linked
// cards. Mirrors the home page's topic tree so the hub feels consistent.
export function ContentIndexList({ items }: { items: ContentIndexItem[] }) {
  return (
    <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((item) => (
        <li key={item.href}>
          <Link href={item.href} className="group block h-full">
            <Card className="h-full transition-colors group-hover:border-primary">
              <CardHeader>
                <CardTitle className="flex items-center justify-between gap-2 font-display text-lg text-foreground">
                  {item.title}
                  <ArrowRight className="h-4 w-4 shrink-0 -translate-x-1 text-primary opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100" />
                </CardTitle>
                {item.description ? (
                  <CardDescription>{item.description}</CardDescription>
                ) : null}
                {item.meta ? (
                  <span className="font-mono text-xs uppercase tracking-[0.15em] text-muted-foreground">
                    {item.meta}
                  </span>
                ) : null}
              </CardHeader>
            </Card>
          </Link>
        </li>
      ))}
    </ul>
  );
}
