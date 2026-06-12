import { mkdirSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { loadSupportEntryMeta } from "./support";
import { loadContentEntries } from "./load";

describe("support-content library", () => {
  it("resolves a known refresher slug to its title", () => {
    const meta = loadSupportEntryMeta("refreshers", "ratios", "<Refresher id=\"ratios\">");
    expect(meta.title).toBe("Ratios and proportions");
  });

  it("fails loudly on an unknown slug, naming the slug, requester, and available entries", () => {
    expect(() =>
      loadSupportEntryMeta("refreshers", "raitos", '<Refresher id="raitos">'),
    ).toThrowError(/Unknown refreshers slug "raitos".*<Refresher id="raitos">.*ratios/);
  });

  it("resolves a glossary slug to its term title and subject", () => {
    const meta = loadSupportEntryMeta("glossary", "preimage", '<Term id="preimage">');
    expect(meta.title).toBe("preimage");
    expect(meta.subject).toBe("geometry");
  });

  it("never lets underscore-prefixed library dirs appear in the topic index", () => {
    // Plant a topic-shaped file inside the library: it must still be ignored.
    const fixtureDir = join(process.cwd(), "content", "_refreshers", "fixture-unit");
    mkdirSync(fixtureDir, { recursive: true });
    writeFileSync(join(fixtureDir, "fixture-topic.mdx"), "---\ntitle: Nope\n---\n");

    const subjects = loadContentEntries().map((e) => e.slug.subject);
    expect(subjects.some((s) => s.startsWith("_"))).toBe(false);
  });
});

afterEach(() => {
  rmSync(join(process.cwd(), "content", "_refreshers", "fixture-unit"), {
    recursive: true,
    force: true,
  });
});
