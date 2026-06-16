/** @vitest-environment jsdom */
// Public-API smoke test for the main entry.
//
// Imports by PACKAGE NAME so it exercises the published `exports` map against
// the built dist. jsdom because importing the main entry pulls in the Grapher
// (and mafs). Requires a build first (the package `test` script runs tsup).
import { describe, expect, it } from "vitest";
import { Grapher, SequenceBuilder, SymmetryExplorer, TriangleLab, slider, choose } from "@cameronbrady/math-components";

describe("public API — main entry", () => {
  it("exposes the Grapher component", () => {
    expect(typeof Grapher).toBe("function");
  });

  it("exposes the SequenceBuilder component", () => {
    expect(typeof SequenceBuilder).toBe("function");
  });

  it("exposes the SymmetryExplorer component", () => {
    expect(typeof SymmetryExplorer).toBe("function");
  });

  it("exposes the TriangleLab component", () => {
    expect(typeof TriangleLab).toBe("function");
  });

  it("exposes the spec DSL, producing the expected control descriptors", () => {
    expect(slider(3, -8, 8, { label: "Shift x" })).toMatchObject({
      control: "slider",
      value: 3,
      min: -8,
      max: 8,
      step: 1,
      label: "Shift x",
    });
    expect(choose("x", ["x", "y"], "Axis")).toMatchObject({
      control: "choose",
      value: "x",
      options: ["x", "y"],
      label: "Axis",
    });
  });
});
