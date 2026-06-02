// Thin filesystem adapter: scans the content tree and reads frontmatter, then
// hands flat entries to the pure derivation in derive.ts. Build-time / server
// only (imports node:fs) — never import this from a client component.
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import matter from "gray-matter";
import { buildIndex, humanize, type ContentEntry, type ContentIndex } from "./derive";

// content/<subject>/<unit>/<topic>.mdx, relative to the app root (cwd at build).
const CONTENT_DIR = join(process.cwd(), "content");

function subdirs(dir: string): string[] {
  try {
    return readdirSync(dir, { withFileTypes: true })
      .filter((d) => d.isDirectory())
      .map((d) => d.name);
  } catch {
    return [];
  }
}

function mdxFiles(dir: string): string[] {
  try {
    return readdirSync(dir, { withFileTypes: true })
      .filter((d) => d.isFile() && d.name.endsWith(".mdx"))
      .map((d) => d.name);
  } catch {
    return [];
  }
}

/** Scan content/<subject>/<unit>/<topic>.mdx, reading title/order from frontmatter. */
export function loadContentEntries(): ContentEntry[] {
  const entries: ContentEntry[] = [];
  for (const subject of subdirs(CONTENT_DIR)) {
    for (const unit of subdirs(join(CONTENT_DIR, subject))) {
      for (const file of mdxFiles(join(CONTENT_DIR, subject, unit))) {
        const topic = file.replace(/\.mdx$/, "");
        const raw = readFileSync(join(CONTENT_DIR, subject, unit, file), "utf8");
        const { data } = matter(raw);
        entries.push({
          slug: { subject, unit, topic },
          title: typeof data.title === "string" ? data.title : humanize(topic),
          order: typeof data.order === "number" ? data.order : 0,
          description:
            typeof data.description === "string" ? data.description : undefined,
        });
      }
    }
  }
  return entries;
}

/** The derived index for the whole site (nav, breadcrumbs, resolution). */
export function getContentIndex(): ContentIndex {
  return buildIndex(loadContentEntries());
}
