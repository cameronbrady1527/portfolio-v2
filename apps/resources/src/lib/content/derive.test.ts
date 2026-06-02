import { describe, it, expect } from "vitest";
import {
  buildIndex,
  resolveTopic,
  getBreadcrumbs,
  humanize,
  topicHref,
  type ContentEntry,
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
});
