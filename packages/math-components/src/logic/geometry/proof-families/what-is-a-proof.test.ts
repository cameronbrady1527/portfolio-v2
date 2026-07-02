import { describe, expect, it } from "vitest";
import {
  gradeProof,
  generateProof,
  PROOF_FAMILIES,
  REASON_LABELS,
  type ProofArrangement,
  type ProofSpec,
  type ScaffoldLevel,
} from "../proof";
import { mulberry32 } from "../../random";

const LEVELS: ScaffoldLevel[] = [1, 2, 3, 4];

/** Statements in authored (topological) order, each with its first acceptable
 *  reason — the canonical answer key a valid family must grade as ok. */
const canonical = (spec: ProofSpec): ProofArrangement => ({
  rows: spec.statements.map((s) => ({ statementId: s.id, reason: s.reasons[0] })),
});

describe("generateProof — what-is-a-proof family", () => {
  it("registers the family", () => {
    expect(PROOF_FAMILIES).toContain("what-is-a-proof");
  });

  it("is deterministic — the same seed reproduces the same spec", () => {
    const a = generateProof("what-is-a-proof", 3, mulberry32(2024));
    const b = generateProof("what-is-a-proof", 3, mulberry32(2024));
    expect(JSON.stringify(a)).toBe(JSON.stringify(b));
  });

  it("is a figureless, algebraic proof — the figure field is absent", () => {
    for (let seed = 1; seed <= 40; seed++) {
      for (const level of LEVELS) {
        const spec = generateProof("what-is-a-proof", level, mulberry32(seed));
        expect(spec.figure, `seed ${seed} level ${level}`).toBeUndefined();
      }
    }
  });

  it("emits a valid, goal-reaching DAG for every seed and level (property)", () => {
    for (const level of LEVELS) {
      for (let seed = 1; seed <= 60; seed++) {
        const spec = generateProof("what-is-a-proof", level, mulberry32(seed));
        const verdict = gradeProof(spec, canonical(spec));
        expect(verdict.ok, `seed ${seed} level ${level}`).toBe(true);
        expect(spec.statements.some((s) => s.goal), `seed ${seed} level ${level} has a goal`).toBe(true);
      }
    }
  });

  it("proves exactly one goal, and it is the last authored statement", () => {
    for (let seed = 1; seed <= 60; seed++) {
      const spec = generateProof("what-is-a-proof", 4, mulberry32(seed));
      const goals = spec.statements.filter((s) => s.goal);
      expect(goals, `seed ${seed}`).toHaveLength(1);
      expect(spec.statements[spec.statements.length - 1].goal, `seed ${seed}`).toBe(true);
      // The Given is the single root and comes first.
      expect(spec.statements[0].given).toBe(true);
      expect(spec.statements[0].deps).toEqual([[]]);
    }
  });

  it("uses only labelled Properties of Equality (and the distributive property)", () => {
    const allowed = new Set(["given", "add-eq", "sub-eq", "mul-eq", "div-eq", "distrib"]);
    for (let seed = 1; seed <= 60; seed++) {
      const spec = generateProof("what-is-a-proof", 4, mulberry32(seed));
      for (const s of spec.statements) {
        for (const r of s.reasons) {
          expect(REASON_LABELS[r], `seed ${seed} reason ${r} labelled`).toBeTruthy();
          expect(allowed.has(r), `seed ${seed} reason ${r} in the equality bank`).toBe(true);
        }
      }
    }
  });

  it("varies structurally — step counts and reason sets both differ across seeds", () => {
    const stepCounts = new Set<number>();
    const reasonSignatures = new Set<string>();
    const givens = new Set<string>();
    for (let seed = 1; seed <= 80; seed++) {
      const spec = generateProof("what-is-a-proof", 1, mulberry32(seed));
      // step count = non-given statements (1 to 3 across the forms).
      stepCounts.add(spec.statements.filter((s) => !s.given).length);
      reasonSignatures.add(spec.statements.map((s) => s.reasons[0]).join(">"));
      givens.add(spec.givenText);
    }
    // one-step, two-step and distribute-first all appear.
    expect(stepCounts).toEqual(new Set([1, 2, 3]));
    // Distinct reason chains (division/mul/add/sub/distribute paths) show up.
    expect(reasonSignatures.size).toBeGreaterThan(4);
    // Coefficients/constants vary, so the equations vary.
    expect(givens.size).toBeGreaterThan(20);
  });

  it("gates distractors by level — none at 1–2, present and rejected at 3–4", () => {
    for (let seed = 1; seed <= 40; seed++) {
      expect(generateProof("what-is-a-proof", 1, mulberry32(seed)).distractors ?? []).toHaveLength(0);
      expect(generateProof("what-is-a-proof", 2, mulberry32(seed)).distractors ?? []).toHaveLength(0);

      for (const level of [3, 4] as ScaffoldLevel[]) {
        const spec = generateProof("what-is-a-proof", level, mulberry32(seed));
        expect((spec.distractors ?? []).length, `seed ${seed} level ${level}`).toBeGreaterThan(0);
        // A distractor id is never a real statement id, and never the goal's text.
        const stmtIds = new Set(spec.statements.map((s) => s.id));
        const stmtTexts = new Set(spec.statements.map((s) => s.text));
        for (const d of spec.distractors ?? []) {
          expect(stmtIds.has(d.id)).toBe(false);
          expect(stmtTexts.has(d.text), `distractor "${d.text}" duplicates a real line`).toBe(false);
          // Placing it is graded as a distractor fault, never as ok.
          const verdict = gradeProof(spec, { rows: [{ statementId: d.id, reason: d.reason ?? "given" }] });
          expect(verdict.rows[0]).toMatchObject({ ok: false, problem: "distractor" });
        }
      }
    }
  });

  it("a canonical build reaches and completes the goal at every level", () => {
    for (const level of LEVELS) {
      for (let seed = 1; seed <= 30; seed++) {
        const spec = generateProof("what-is-a-proof", level, mulberry32(seed));
        const verdict = gradeProof(spec, canonical(spec));
        expect(verdict.reachesGoal, `seed ${seed} level ${level}`).toBe(true);
        expect(verdict.complete).toBe(true);
      }
    }
  });
});
