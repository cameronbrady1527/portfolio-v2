/** @vitest-environment jsdom */
import { beforeEach, describe, expect, it } from "vitest";
import {
  emptyProofsProgress,
  loadProofsProgress,
  markComfortable,
  normalizeProofsProgress,
  recordFamilyResult,
  resetFamily,
  saveProofsProgress,
  type FamilyProgress,
} from "./store";

const fam: FamilyProgress = {
  familyId: "vertical-angles",
  level: 2,
  completions: 1,
  comfortable: false,
};
const KEY = "test:proofs";

beforeEach(() => localStorage.clear());

describe("recordFamilyResult", () => {
  it("adds a family and overwrites it by family id", () => {
    let p = recordFamilyResult(emptyProofsProgress(), fam);
    expect(p.families["vertical-angles"].level).toBe(2);
    p = recordFamilyResult(p, { ...fam, level: 3, completions: 0 });
    expect(p.families["vertical-angles"].level).toBe(3);
    expect(p.families["vertical-angles"].completions).toBe(0);
    expect(Object.keys(p.families)).toHaveLength(1);
  });
});

describe("markComfortable", () => {
  it("sets comfortable, preserving existing fade state", () => {
    const p = markComfortable(recordFamilyResult(emptyProofsProgress(), fam), "vertical-angles");
    expect(p.families["vertical-angles"].comfortable).toBe(true);
    expect(p.families["vertical-angles"].level).toBe(2);
  });

  it("creates a default entry for an unseen family", () => {
    const p = markComfortable(emptyProofsProgress(), "isosceles");
    expect(p.families.isosceles.comfortable).toBe(true);
    expect(p.families.isosceles.level).toBe(4);
  });
});

describe("resetFamily", () => {
  it("drops one family's state and leaves others", () => {
    let p = recordFamilyResult(emptyProofsProgress(), fam);
    p = recordFamilyResult(p, { familyId: "isosceles", level: 1, completions: 0, comfortable: false });
    p = resetFamily(p, "vertical-angles");
    expect(p.families["vertical-angles"]).toBeUndefined();
    expect(p.families.isosceles).toBeDefined();
  });

  it("is a no-op for an unknown family", () => {
    const p = recordFamilyResult(emptyProofsProgress(), fam);
    expect(resetFamily(p, "nope")).toBe(p);
  });
});

describe("normalizeProofsProgress", () => {
  it("returns empty for corrupt or wrong-version data", () => {
    expect(normalizeProofsProgress(null).families).toEqual({});
    expect(normalizeProofsProgress({ version: 99, families: {} }).families).toEqual({});
  });

  it("drops malformed families but keeps the valid ones", () => {
    const p = normalizeProofsProgress({
      version: 1,
      families: {
        "vertical-angles": fam,
        badLevel: { familyId: "badLevel", level: 5, completions: 0, comfortable: false },
        badShape: { familyId: "badShape", level: 2 },
        mismatched: { familyId: "other", level: 1, completions: 0, comfortable: false },
      },
    });
    expect(Object.keys(p.families)).toEqual(["vertical-angles"]);
  });
});

describe("localStorage round-trip", () => {
  it("loads empty for a missing key, then saves and reloads", () => {
    expect(loadProofsProgress(KEY).families).toEqual({});
    saveProofsProgress(KEY, recordFamilyResult(emptyProofsProgress(), fam));
    expect(loadProofsProgress(KEY).families["vertical-angles"]).toEqual(fam);
  });

  it("recovers (empty) from corrupt JSON in storage", () => {
    localStorage.setItem(KEY, "{not json");
    expect(loadProofsProgress(KEY).families).toEqual({});
  });

  it("persists a comfortable flag across a reload (remount)", () => {
    saveProofsProgress(KEY, markComfortable(emptyProofsProgress(), "vertical-angles"));
    // Simulate a fresh mount: read the store back from scratch.
    const reloaded = loadProofsProgress(KEY);
    expect(reloaded.families["vertical-angles"].comfortable).toBe(true);
  });
});
