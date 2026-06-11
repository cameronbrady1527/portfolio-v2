import { describe, it, expect } from "vitest";
import {
  buildIndex,
  resolveTopic,
  resolveSubject,
  resolveUnit,
  getBreadcrumbs,
  humanize,
  topicHref,
  subjectHref,
  unitHref,
  type ContentEntry,
  type ContentMeta,
} from "./derive";

// Fixture tree (intentionally out of order to prove ordering is by frontmatter):
//   geometry / transformations / { rotations(3), reflections(1), translations(2) }
//   algebra  / linear-equations / { slope-intercept(1) }
const fixture: ContentEntry[] = [
  { slug: { subject: "geometry", unit: "transformations", topic: "rotations" }, title: "Rotations", order: 3 },
  { slug: { subject: "geometry", unit: "transformations", topic: "reflections" }, title: "Reflections", order: 1 },
  { slug: { subject: "geometry", unit: "transformations", topic: "translations" }, title: "Translations", order: 2 },
  { slug: { subject: "algebra", unit: "linear-equations", topic: "slope-intercept" }, title: "Slope-Intercept Form", order: 1 },
];

describe("humanize", () => {
  it("title-cases a single-word slug", () => {
    expect(humanize("transformations")).toBe("Transformations");
  });
  it("title-cases a hyphenated slug", () => {
    expect(humanize("linear-equations")).toBe("Linear Equations");
  });
});

describe("topicHref", () => {
  it("builds a 3-level absolute path", () => {
    expect(topicHref({ subject: "geometry", unit: "transformations", topic: "reflections" })).toBe(
      "/geometry/transformations/reflections",
    );
  });
});

describe("subjectHref / unitHref", () => {
  it("builds a 1-level subject path", () => {
    expect(subjectHref("geometry")).toBe("/geometry");
  });
  it("builds a 2-level unit path", () => {
    expect(unitHref("geometry", "transformations")).toBe("/geometry/transformations");
  });
});

describe("resolveTopic", () => {
  it("returns metadata for a known slug", () => {
    const topic = resolveTopic(fixture, { subject: "geometry", unit: "transformations", topic: "reflections" });
    expect(topic).not.toBeNull();
    expect(topic!.title).toBe("Reflections");
    expect(topic!.href).toBe("/geometry/transformations/reflections");
  });
  it("returns null for a missing slug", () => {
    expect(resolveTopic(fixture, { subject: "geometry", unit: "transformations", topic: "dilations" })).toBeNull();
    expect(resolveTopic(fixture, { subject: "nope", unit: "nope", topic: "nope" })).toBeNull();
  });
});

describe("resolveSubject / resolveUnit", () => {
  const index = buildIndex(fixture);

  it("returns the subject node for a known subject slug", () => {
    const subject = resolveSubject(index, "geometry");
    expect(subject).not.toBeNull();
    expect(subject!.label).toBe("Geometry");
    expect(subject!.units.map((u) => u.slug)).toEqual(["transformations"]);
  });

  it("returns null for an unknown subject slug", () => {
    expect(resolveSubject(index, "chemistry")).toBeNull();
  });

  it("returns the unit node for a known subject/unit pair", () => {
    const unit = resolveUnit(index, "geometry", "transformations");
    expect(unit).not.toBeNull();
    expect(unit!.label).toBe("Transformations");
    expect(unit!.topics).toHaveLength(3);
  });

  it("returns null for an unknown unit (or unknown subject)", () => {
    expect(resolveUnit(index, "geometry", "circles")).toBeNull();
    expect(resolveUnit(index, "chemistry", "transformations")).toBeNull();
  });
});

describe("buildIndex (nav derivation + ordering)", () => {
  const index = buildIndex(fixture);

  it("groups into subjects -> units -> topics with humanized labels", () => {
    const subjects = index.subjects.map((s) => s.label);
    expect(subjects).toContain("Geometry");
    expect(subjects).toContain("Algebra");

    const geometry = index.subjects.find((s) => s.slug === "geometry")!;
    expect(geometry.units.map((u) => u.label)).toEqual(["Transformations"]);
  });

  it("orders topics within a unit by frontmatter `order`", () => {
    const geometry = index.subjects.find((s) => s.slug === "geometry")!;
    const unit = geometry.units.find((u) => u.slug === "transformations")!;
    expect(unit.topics.map((t) => t.title)).toEqual(["Reflections", "Translations", "Rotations"]);
  });

  it("does not invent topics that were not in the entries", () => {
    const geometry = index.subjects.find((s) => s.slug === "geometry")!;
    const unit = geometry.units.find((u) => u.slug === "transformations")!;
    expect(unit.topics).toHaveLength(3);
  });
});

describe("buildIndex (_meta merge)", () => {
  const meta: ContentMeta = {
    subjects: {
      geometry: { label: "Geometry & Space", description: "Shapes and motion.", order: 1 },
      // algebra intentionally has no meta -> falls back to humanize + default order
    },
    units: {
      "geometry/transformations": { label: "Rigid Motions" },
    },
  };

  it("uses a meta label override instead of the humanized slug", () => {
    const index = buildIndex(fixture, meta);
    const geometry = index.subjects.find((s) => s.slug === "geometry")!;
    expect(geometry.label).toBe("Geometry & Space");
  });

  it("surfaces meta description on the subject node", () => {
    const index = buildIndex(fixture, meta);
    const geometry = index.subjects.find((s) => s.slug === "geometry")!;
    expect(geometry.description).toBe("Shapes and motion.");
  });

  it("applies a meta label override to a unit", () => {
    const index = buildIndex(fixture, meta);
    const geometry = index.subjects.find((s) => s.slug === "geometry")!;
    expect(geometry.units.find((u) => u.slug === "transformations")!.label).toBe("Rigid Motions");
  });

  it("orders subjects by meta order ahead of unordered (alphabetical) ones", () => {
    // Alphabetically Algebra precedes Geometry; meta gives geometry order 1,
    // algebra no order, so geometry should now sort first.
    const index = buildIndex(fixture, meta);
    expect(index.subjects.map((s) => s.slug)).toEqual(["geometry", "algebra"]);
  });

  it("falls back to humanized labels and alphabetical order when meta is absent", () => {
    const index = buildIndex(fixture);
    expect(index.subjects.map((s) => s.label)).toEqual(["Algebra", "Geometry"]);
    const geometry = index.subjects.find((s) => s.slug === "geometry")!;
    expect(geometry.description).toBeUndefined();
  });
});

describe("getBreadcrumbs", () => {
  const index = buildIndex(fixture);

  it("derives Geometry / Transformations / Reflections", () => {
    const crumbs = getBreadcrumbs(index, { subject: "geometry", unit: "transformations", topic: "reflections" });
    expect(crumbs.map((c) => c.label)).toEqual(["Geometry", "Transformations", "Reflections"]);
  });

  it("makes the final (current topic) crumb link to its own href", () => {
    const crumbs = getBreadcrumbs(index, { subject: "geometry", unit: "transformations", topic: "reflections" });
    expect(crumbs[crumbs.length - 1].href).toBe("/geometry/transformations/reflections");
  });

  it("returns an empty array for an unknown topic", () => {
    expect(getBreadcrumbs(index, { subject: "x", unit: "y", topic: "z" })).toEqual([]);
  });

  it("links the ancestor (subject, unit) crumbs to their landing pages", () => {
    const crumbs = getBreadcrumbs(index, { subject: "geometry", unit: "transformations", topic: "reflections" });
    expect(crumbs[0]).toMatchObject({ label: "Geometry", href: "/geometry" });
    expect(crumbs[1]).toMatchObject({ label: "Transformations", href: "/geometry/transformations" });
  });

  it("derives a subject-level trail (single crumb) linking to the subject page", () => {
    const crumbs = getBreadcrumbs(index, { subject: "geometry" });
    expect(crumbs.map((c) => c.label)).toEqual(["Geometry"]);
    expect(crumbs[0].href).toBe("/geometry");
  });

  it("derives a unit-level trail with the subject crumb linked", () => {
    const crumbs = getBreadcrumbs(index, { subject: "geometry", unit: "transformations" });
    expect(crumbs.map((c) => c.label)).toEqual(["Geometry", "Transformations"]);
    expect(crumbs[0].href).toBe("/geometry");
    expect(crumbs[1].href).toBe("/geometry/transformations");
  });

  it("returns an empty array for an unknown subject or unit", () => {
    expect(getBreadcrumbs(index, { subject: "chemistry" })).toEqual([]);
    expect(getBreadcrumbs(index, { subject: "geometry", unit: "circles" })).toEqual([]);
  });
});
