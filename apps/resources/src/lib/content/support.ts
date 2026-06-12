// Thin filesystem adapter for the support-content libraries: the
// underscore-prefixed directories in content/ that hold reusable entries
// (refreshers, …) resolved by slug. Build-time / server only (imports
// node:fs) — never import this from a client component.
//
// Slug resolution fails loudly with a named error so a typo breaks the build,
// never a student's page.
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import matter from "gray-matter";
import { humanize } from "./derive";

const LIBRARY_DIRS = {
  refreshers: "_refreshers",
} as const;

export type SupportLibrary = keyof typeof LIBRARY_DIRS;

const CONTENT_DIR = join(process.cwd(), "content");

/** All entry slugs present in a library (alphabetical). */
export function listSupportSlugs(library: SupportLibrary): string[] {
  try {
    return readdirSync(join(CONTENT_DIR, LIBRARY_DIRS[library]), {
      withFileTypes: true,
    })
      .filter((d) => d.isFile() && d.name.endsWith(".mdx"))
      .map((d) => d.name.replace(/\.mdx$/, ""))
      .sort();
  } catch {
    return [];
  }
}

export type SupportEntryMeta = {
  slug: string;
  title: string;
};

/**
 * Read an entry's frontmatter meta, throwing a descriptive error (naming the
 * slug, the requester, and the available slugs) when the entry is missing.
 */
export function loadSupportEntryMeta(
  library: SupportLibrary,
  slug: string,
  requestedBy: string,
): SupportEntryMeta {
  const path = join(CONTENT_DIR, LIBRARY_DIRS[library], `${slug}.mdx`);
  let raw: string;
  try {
    raw = readFileSync(path, "utf8");
  } catch {
    const available = listSupportSlugs(library);
    throw new Error(
      `Unknown ${library} slug "${slug}" (requested by ${requestedBy}). ` +
        (available.length
          ? `Available slugs: ${available.join(", ")}`
          : `The ${LIBRARY_DIRS[library]} library has no entries yet.`),
    );
  }
  const { data } = matter(raw);
  return {
    slug,
    title: typeof data.title === "string" ? data.title : humanize(slug),
  };
}
