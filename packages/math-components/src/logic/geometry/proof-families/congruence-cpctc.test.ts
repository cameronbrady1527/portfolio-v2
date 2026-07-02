import { describe, expect, it } from "vitest";
import {
  gradeProof,
  generateProof,
  PROOF_FAMILIES,
  type ProofArrangement,
  type ProofSpec,
  type ScaffoldLevel,
  type TriangleFigureMark,
} from "../proof";
import { congruenceCpctc } from "./congruence-cpctc";
import { buildTrianglePair } from "../../../internal/proof-figure";
import { congruenceCheck } from "../congruence";
import { triangleAngles } from "../triangle";
import { mulberry32 } from "../../random";

/** Canonical arrangement: statements in authored (topological) order, each with
 *  its first acceptable reason. A valid family grades this ok. */
const canonical = (spec: ProofSpec): ProofArrangement => ({
  rows: spec.statements.map((s) => ({ statementId: s.id, reason: s.reasons[0] })),
});

/** The criterion reason on a generated spec (the △≅△ row's reason). */
const critReasonOf = (spec: ProofSpec) =>
  spec.statements.find((s) => ["sss", "sas", "asa"].includes(s.reasons[0]))?.reasons[0];

const LEVELS: ScaffoldLevel[] = [1, 2, 3, 4];

describe("congruence-cpctc — registration & determinism", () => {
  it("is registered as a proof family", () => {
    expect(PROOF_FAMILIES).toContain("congruence-cpctc");
  });

  it("is deterministic — the same seed reproduces the same spec", () => {
    const a = generateProof("congruence-cpctc", 3, mulberry32(99));
    const b = generateProof("congruence-cpctc", 3, mulberry32(99));
    expect(JSON.stringify(a)).toBe(JSON.stringify(b));
  });
});

describe("congruence-cpctc — valid DAG reaching the goal (property)", () => {
  it("every seed and level grades ok under canonical order and reaches the goal", () => {
    for (const level of LEVELS) {
      for (let seed = 1; seed <= 120; seed++) {
        const spec = generateProof("congruence-cpctc", level, mulberry32(seed));
        const verdict = gradeProof(spec, canonical(spec));
        expect(verdict.ok, `seed ${seed} level ${level}`).toBe(true);
        expect(verdict.reachesGoal, `seed ${seed} level ${level}`).toBe(true);
        expect(spec.statements.some((s) => s.goal)).toBe(true);
        // The goal is concluded by CPCTC.
        const goal = spec.statements.find((s) => s.goal)!;
        expect(goal.reasons).toContain("cpctc");
      }
    }
  });

  it("the congruence row's reason matches the criterion its givens force", () => {
    // Over many seeds all three criteria appear, and each instance grades ok.
    const seen = new Set<string>();
    for (let seed = 1; seed <= 120; seed++) {
      const spec = generateProof("congruence-cpctc", 4, mulberry32(seed));
      const crit = critReasonOf(spec);
      expect(crit, `seed ${seed} has a criterion row`).toBeTruthy();
      seen.add(crit!);
      expect(gradeProof(spec, canonical(spec)).ok).toBe(true);
    }
    expect([...seen].sort()).toEqual(["asa", "sas", "sss"]);
  });

  it("varies the goal between a corresponding angle and a corresponding segment", () => {
    let angleGoals = 0;
    let segmentGoals = 0;
    for (let seed = 1; seed <= 120; seed++) {
      const spec = generateProof("congruence-cpctc", 2, mulberry32(seed));
      const goal = spec.statements.find((s) => s.goal)!;
      if (goal.text.includes("∠")) angleGoals++;
      else segmentGoals++;
    }
    expect(angleGoals).toBeGreaterThan(0);
    expect(segmentGoals).toBeGreaterThan(0);
  });
});

describe("congruence-cpctc — distractors", () => {
  it("gates distractors by level — none at 1–2, present and rejected at 3–4", () => {
    for (let seed = 1; seed <= 40; seed++) {
      expect(generateProof("congruence-cpctc", 1, mulberry32(seed)).distractors ?? []).toHaveLength(0);
      expect(generateProof("congruence-cpctc", 2, mulberry32(seed)).distractors ?? []).toHaveLength(0);

      for (const level of [3, 4] as ScaffoldLevel[]) {
        const spec = generateProof("congruence-cpctc", level, mulberry32(seed));
        const distractors = spec.distractors ?? [];
        expect(distractors.length).toBeGreaterThan(0);
        // Each distractor, placed, is rejected as a distractor (never a real id).
        for (const d of distractors) {
          const verdict = gradeProof(spec, { rows: [{ statementId: d.id, reason: d.reason ?? "cpctc" }] });
          expect(verdict.rows[0]).toMatchObject({ ok: false, problem: "distractor" });
          // A distractor's text is never one the proof actually makes.
          expect(spec.statements.some((s) => s.text === d.text)).toBe(false);
        }
      }
    }
  });
});

describe("congruence-cpctc — figure matches the math", () => {
  it("carries a triangle-pair figure whose two triangles are actually congruent", () => {
    for (let seed = 1; seed <= 60; seed++) {
      const spec = generateProof("congruence-cpctc", 3, mulberry32(seed));
      expect(spec.figure?.kind).toBe("triangle-pair");
      if (spec.figure?.kind !== "triangle-pair") continue;
      const geom = buildTrianglePair(spec.figure);
      const t1 = geom.triangles[0].verts;
      const t2 = geom.triangles[1].verts;
      expect(congruenceCheck(t1, t2).congruent).toBe(true);
    }
  });

  it("marks every given part on BOTH triangles with matching counts", () => {
    for (let seed = 1; seed <= 60; seed++) {
      const spec = generateProof("congruence-cpctc", 3, mulberry32(seed));
      if (spec.figure?.kind !== "triangle-pair") continue;
      const marks = spec.figure.marks;
      // Every non-right mark on triangle 0 has a mirror on triangle 1 with the
      // same kind + count (they mark a CONGRUENT pair).
      const on = (tri: 0 | 1) => marks.filter((m) => m.tri === tri);
      expect(on(0).length).toBe(on(1).length);
      for (const m of on(0)) {
        const partner = on(1).find(
          (p) => p.kind === m.kind && (m.kind === "right" || (p as { count: number }).count === (m as { count: number }).count),
        );
        expect(partner, `partner for ${JSON.stringify(m)}`).toBeTruthy();
      }
    }
  });

  it("places an exact right angle wherever a right-angle mark is drawn", () => {
    let checked = 0;
    for (let seed = 1; seed <= 200; seed++) {
      const spec = generateProof("congruence-cpctc", 2, mulberry32(seed));
      if (spec.figure?.kind !== "triangle-pair") continue;
      const rights = spec.figure.marks.filter(
        (m): m is Extract<TriangleFigureMark, { kind: "right" }> => m.kind === "right",
      );
      if (rights.length === 0) continue;
      const geom = buildTrianglePair(spec.figure);
      for (const r of rights) {
        const t = geom.triangles[r.tri];
        const i = t.labels.indexOf(r.at);
        const angs = triangleAngles(t.verts);
        expect(Math.abs(angs[i] - 90)).toBeLessThan(1e-6);
        checked++;
      }
    }
    expect(checked).toBeGreaterThan(0); // the right-angle variant does occur
  });
});

/** Direct-use sanity: the exported family behaves like the registry route. */
describe("congruence-cpctc — direct family export", () => {
  it("matches generateProof for the same seed/level", () => {
    const viaFamily = congruenceCpctc(3, mulberry32(7));
    const viaRegistry = generateProof("congruence-cpctc", 3, mulberry32(7));
    expect(JSON.stringify(viaFamily)).toBe(JSON.stringify(viaRegistry));
  });
});
