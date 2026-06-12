import type { ReactNode } from "react";
import { loadSupportEntryMeta } from "@/lib/content/support";
import { importGlossaryEntry } from "@/lib/content/render";
import { TermPopover } from "./TermPopover";

export interface TermProps {
  /** Slug of a glossary entry in content/_glossary/. */
  id: string;
  /** Display text (e.g. an inflected form); defaults to the entry's title. */
  children?: ReactNode;
}

// Server component: resolves the glossary entry by slug (failing the build
// loudly on a bad id) and hands the rendered definition to the client popover.
export async function Term({ id, children }: TermProps) {
  const meta = loadSupportEntryMeta("glossary", id, `<Term id="${id}">`);
  const entry = await importGlossaryEntry(id);
  const Definition = entry.default;
  return (
    <TermPopover term={meta.title} label={children}>
      <Definition />
    </TermPopover>
  );
}
