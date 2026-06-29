import { describe, expect, it } from "vitest";
import { bankSlugs, resolveBank } from "./bank";
import { STANDARD_LABELS, standardLabel } from "./standards";

describe("standardLabel", () => {
  it("returns the friendly label for a known code", () => {
    expect(standardLabel("AI-A.REI.3")).toBe("Linear inequalities");
  });

  it("falls back to the code itself when unmapped", () => {
    expect(standardLabel("AI-X.YZ.9")).toBe("AI-X.YZ.9");
  });

  it("has a friendly label for every standard used in any bank", () => {
    const used = new Set<string>();
    for (const slug of bankSlugs) {
      for (const item of resolveBank(slug)) used.add(item.standard);
    }
    for (const code of used) {
      expect(STANDARD_LABELS, `missing label for ${code}`).toHaveProperty(code);
    }
  });
});
