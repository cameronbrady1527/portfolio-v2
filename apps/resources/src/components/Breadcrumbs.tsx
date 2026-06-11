import Link from "next/link";
import type { Crumb } from "@/lib/content/derive";

// Shared breadcrumb trail, rendered under the global header on every content
// page (subject, unit, topic). Each ancestor crumb with an href links to its
// landing page; the current (leaf) crumb renders as plain text.
export function Breadcrumbs({ crumbs }: { crumbs: Crumb[] }) {
  if (crumbs.length === 0) return null;
  return (
    <nav aria-label="Breadcrumb">
      <ol className="flex flex-wrap items-center gap-2 font-mono text-xs uppercase tracking-[0.15em] text-muted-foreground">
        {crumbs.map((crumb, i) => {
          const isLast = i === crumbs.length - 1;
          return (
            <li key={`${crumb.label}-${i}`} className="flex items-center gap-2">
              {i > 0 && <span aria-hidden className="text-border">/</span>}
              {crumb.href && !isLast ? (
                <Link href={crumb.href} className="hover:text-primary">
                  {crumb.label}
                </Link>
              ) : (
                <span className={isLast ? "text-foreground" : undefined}>
                  {crumb.label}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
