// Public-API smoke test for the /logic subpath.
//
// Imports by PACKAGE NAME (not relative source) so it exercises the published
// `exports` map against the built dist — guarding the entry points. Runs in the
// default NODE environment: that the pure logic loads and works here, with no
// DOM, is itself the React/logic boundary check. Requires a build first (the
// package `test` script runs tsup before vitest).
import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import {
  reflect,
  dilate,
  stretch,
  translate,
  rotate,
  triangleFromSAS,
  triangleAngles,
  roundAnglesToSum,
  applyTransform,
  transversalAngles,
  grade,
  emptyProgress,
  recordAnswer,
  getTopic,
  loadProgress,
} from "@cameronbrady/math-components/logic";

describe("/logic — resolves and computes", () => {
  it("exposes the geometry transforms", () => {
    expect(applyTransform(
      { type: "point", at: { x: 3, y: 2 } },
      "reflection",
      { kind: "axis", axis: "x" },
    )).toEqual({ type: "point", at: { x: 3, y: -2 } });

    expect(reflect({ type: "point", at: { x: 1, y: 0 } }, { kind: "axis", axis: "y" }))
      .toEqual({ type: "point", at: { x: -1, y: 0 } });
    expect(translate({ type: "point", at: { x: 1, y: 1 } }, 3, -2))
      .toEqual({ type: "point", at: { x: 4, y: -1 } });
    expect(dilate({ type: "point", at: { x: 2, y: 3 } }, { about: { x: 0, y: 0 }, factor: 2 }))
      .toEqual({ type: "point", at: { x: 4, y: 6 }, label: undefined });
    expect(stretch({ type: "point", at: { x: 2, y: 3 } }, { axis: "x", factor: 3 }))
      .toEqual({ type: "point", at: { x: 6, y: 3 }, label: undefined });
    expect(rotate({ type: "point", at: { x: 1, y: 0 } }, 90, { x: 0, y: 0 }))
      .toEqual({ type: "point", at: { x: 0, y: 1 } });
  });

  it("exposes the transversal-angles classifier", () => {
    const r = transversalAngles({ line1Dir: 0, line2Dir: 0, transversalDir: 70 });
    expect(r.angles[1].measure).toBeCloseTo(70, 9);
    expect(r.parallel).toBe(true);
    expect(r.pairs.some((p) => p.relationship === "vertical" && p.equal)).toBe(true);
  });

  it("exposes the triangle module (SAS + angle sum invariance)", () => {
    const tri = triangleFromSAS(5, 7, 40);
    const [a, b, c] = roundAnglesToSum(triangleAngles(tri));
    expect(a + b + c).toBe(180);
    expect(a).toBe(40);
  });

  it("exposes grading + a key-agnostic progress core/adapter", () => {
    expect(grade(
      { id: "n1", type: "numeric", prompt: "", answer: 5, tolerance: 0.1, hints: [], explanation: "" },
      5,
    )).toEqual({ correct: true });

    const p = recordAnswer(emptyProgress(), "slug", "q1", true, 1);
    expect(getTopic(p, "slug").best).toEqual({ correct: 1, total: 1 });
    // The adapter takes a caller-supplied key (no hardcoded namespace). With no
    // DOM/storage it degrades to empty progress rather than throwing.
    expect(loadProgress("any:key")).toEqual(emptyProgress());
  });
});

describe("/logic — React/mafs boundary", () => {
  it("the built /logic bundle imports neither react nor mafs", () => {
    for (const file of ["dist/logic/index.js", "dist/logic/index.cjs"]) {
      const code = readFileSync(file, "utf8");
      expect(code).not.toMatch(/["']react["']/);
      expect(code).not.toMatch(/["']mafs["']/);
    }
  });
});
