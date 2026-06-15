import type { ReactNode } from "react";
import { loadSupportEntryMeta } from "@/lib/content/support";
import { importRefresherEntry } from "@/lib/content/render";
import { SelfCheck } from "./SelfCheck";

export interface RefresherProps {
  /** Slug of a library entry in content/_refreshers/. */
  id?: string;
  /** Panel title; defaults to the library entry's frontmatter title. */
  title?: string;
  /** Escape hatch: bespoke inline content. Wins over `id`. */
  children?: ReactNode;
}

// Server component. Collapsed by default (<details> is natively keyboard
// accessible); resolves library entries by slug, failing the build loudly on
// a bad id via the support loader.
export async function Refresher({ id, title, children }: RefresherProps) {
  let heading = title;
  let body: ReactNode = children;
  let check: ReactNode = null;

  if (children == null) {
    if (!id) {
      throw new Error(
        "<Refresher> needs an id (library entry) or inline children.",
      );
    }
    const meta = loadSupportEntryMeta(
      "refreshers",
      id,
      `<Refresher id="${id}">`,
    );
    heading ??= meta.title;
    const entry = await importRefresherEntry(id);
    const Prose = entry.default;
    body = <Prose />;
    if (entry.check) {
      check = <SelfCheck question={entry.check} className="mt-4" />;
    }
  }

  return (
    <details
      data-testid="refresher"
      className="group my-6 rounded-md border border-border bg-card"
    >
      <summary className="cursor-pointer list-none p-4 text-sm font-medium text-foreground focus-visible:ring-[3px] focus-visible:ring-ring/50 [&::-webkit-details-marker]:hidden">
        <span aria-hidden="true" className="mr-2 inline-block transition-transform group-open:rotate-90">
          ▸
        </span>
        Need a refresher? {heading}
      </summary>
      <div className="border-t border-border p-4 text-sm leading-relaxed">
        {body}
        {check}
      </div>
    </details>
  );
}
