// Thin filesystem adapter: scans the content tree and reads frontmatter, then
// hands flat entries to the pure derivation in derive.ts. Build-time / server
// only (imports node:fs) — never import this from a client component.
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import matter from "gray-matter";
import {
  buildIndex,
  humanize,
  type ContentEntry,
  type ContentIndex,
  type ContentMeta,
  type NodeMeta,
} from "./derive";

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

// Read an optional `_meta.json` (subject- or unit-level). Absent or malformed
// files are the normal case and silently yield no overrides — never throw.
function readNodeMeta(path: string): NodeMeta | undefined {
  try {
    const data = JSON.parse(readFileSync(path, "utf8"));
    const meta: NodeMeta = {
      label: typeof data.label === "string" ? data.label : undefined,
      description: typeof data.description === "string" ? data.description : undefined,
      intro: typeof data.intro === "string" ? data.intro : undefined,
      order: typeof data.order === "number" ? data.order : undefined,
    };
    return meta;
  } catch {
    return undefined;
  }
}

/** Scan the tree for optional `_meta.json` overrides on subjects and units. */
export function loadContentMeta(): ContentMeta {
  const subjects: Record<string, NodeMeta> = {};
  const units: Record<string, NodeMeta> = {};
  for (const subject of subdirs(CONTENT_DIR)) {
    const sMeta = readNodeMeta(join(CONTENT_DIR, subject, "_meta.json"));
    if (sMeta) subjects[subject] = sMeta;
    for (const unit of subdirs(join(CONTENT_DIR, subject))) {
      const uMeta = readNodeMeta(join(CONTENT_DIR, subject, unit, "_meta.json"));
      if (uMeta) units[`${subject}/${unit}`] = uMeta;
    }
  }
  return { subjects, units };
}

/** The derived index for the whole site (nav, breadcrumbs, resolution). */
export function getContentIndex(): ContentIndex {
  return buildIndex(loadContentEntries(), loadContentMeta());
}
