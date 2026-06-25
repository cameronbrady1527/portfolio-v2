import { describe, expect, it } from "vitest";
import {
  standardReadiness,
  projectedLevel,
  overallReadiness,
  type CreditAttempt,
} from "./readiness";

// A small set of self-scored attempts: each item earns 0..max credits.
const attempts: CreditAttempt[] = [
  { itemId: "a", standard: "AI-A.REI.4", earned: 4, max: 4 },
  { itemId: "b", standard: "AI-A.REI.4", earned: 3, max: 4 },
  { itemId: "c", standard: "AI-A.REI.4", earned: 2, max: 2 },
  { itemId: "d", standard: "AI-A.REI.1", earned: 0, max: 2 },
];

describe("standardReadiness", () => {
  it("aggregates earned/max credits for a standard into a fraction and band", () => {
    const r = standardReadiness(attempts, "AI-A.REI.4");
    expect(r.earned).toBe(9); // 4 + 3 + 2
    expect(r.max).toBe(10); // 4 + 4 + 2
    expect(r.fraction).toBeCloseTo(0.9, 5);
    expect(r.band).toBe("mastery"); // 0.9 ≥ 0.85
    expect(r.itemCount).toBe(3);
  });

  it("reports not-started when there are no attempts for the standard", () => {
    const r = standardReadiness(attempts, "AI-F.IF.6");
    expect(r.band).toBe("not-started");
    expect(r.max).toBe(0);
    expect(r.itemCount).toBe(0);
  });

  it("places the band at the right credit-fraction cutoffs (0.5 / 0.65 / 0.85)", () => {
    const at = (earned: number, max: number): CreditAttempt[] => [
      { itemId: "x", standard: "S", earned, max },
    ];
    expect(standardReadiness(at(3, 10), "S").band).toBe("developing"); // 0.30
    expect(standardReadiness(at(5, 10), "S").band).toBe("approaching"); // 0.50
    expect(standardReadiness(at(7, 10), "S").band).toBe("proficient"); // 0.70
    expect(standardReadiness(at(9, 10), "S").band).toBe("mastery"); // 0.90
  });
});

describe("projectedLevel", () => {
  const at = (earned: number, max: number): CreditAttempt[] => [
    { itemId: "x", standard: "S", earned, max },
  ];

  it("maps the overall credit fraction to a level 1–5", () => {
    expect(projectedLevel([])).toBe(1); // nothing attempted
    expect(projectedLevel(at(2, 10))).toBe(1); // 0.20
    expect(projectedLevel(at(5, 10))).toBe(2); // 0.50
    expect(projectedLevel(at(68, 100))).toBe(3); // 0.68 — proficient/pass
    expect(projectedLevel(at(75, 100))).toBe(4); // 0.75
    expect(projectedLevel(at(9, 10))).toBe(5); // 0.90 — mastery
  });
});

describe("overallReadiness", () => {
  it("rolls attempts up into an overall projection + per-standard breakdown", () => {
    const o = overallReadiness(attempts);
    expect(o.earned).toBe(9); // 4+3+2+0
    expect(o.max).toBe(12); // 4+4+2+2
    expect(o.fraction).toBeCloseTo(0.75, 5);
    expect(o.level).toBe(4); // 0.75
    // one summary per distinct standard, sorted
    expect(o.byStandard.map((s) => s.standard)).toEqual([
      "AI-A.REI.1",
      "AI-A.REI.4",
    ]);
    expect(o.byStandard[0].band).toBe("developing"); // REI.1: 0/2
    expect(o.byStandard[1].band).toBe("mastery"); // REI.4: 9/10
  });
});
