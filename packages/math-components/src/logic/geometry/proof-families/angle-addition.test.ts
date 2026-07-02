import { describe, expect, it } from "vitest";
import {
  gradeProof,
  generateProof,
  PROOF_FAMILIES,
  REASON_LABELS,
  type ProofSpec,
  type ProofArrangement,
  type ScaffoldLevel,
} from "../proof";
import { mulberry32 } from "../../random";

const canonical = (spec: ProofSpec): ProofArrangement => ({
  rows: spec.statements.map((s) => ({ statementId: s.id, reason: s.reasons[0] })),
});

const LEVELS: ScaffoldLevel[] = [1, 2, 3, 4];

describe("angle-addition family", () => {
  it("is registered", () => {
    expect(PROOF_FAMILIES).toContain("angle-addition");
  });

  it("is deterministic — same seed reproduces the same spec", () => {
    const a = generateProof("angle-addition", 3, mulberry32(11));
    const b = generateProof("angle-addition", 3, mulberry32(11));
    expect(JSON.stringify(a)).toBe(JSON.stringify(b));
  });

  it("emits a valid, goal-reaching DAG for every seed and level (property)", () => {
    for (const level of LEVELS) {
      for (let seed = 1; seed <= 60; seed++) {
        const spec = generateProof("angle-addition", level, mulberry32(seed));
        const verdict = gradeProof(spec, canonical(spec));
        expect(verdict.ok, `seed ${seed} level ${level}`).toBe(true);
        expect(verdict.reachesGoal, `seed ${seed} level ${level}`).toBe(true);
        expect(spec.statements.some((s) => s.goal)).toBe(true);
      }
    }
  });

  it("attaches a rays-from-point figure whose marks reference real rays at the vertex", () => {
    for (let seed = 1; seed <= 40; seed++) {
      const spec = generateProof("angle-addition", 2, mulberry32(seed));
      expect(spec.figure?.kind).toBe("rays-from-point");
      if (spec.figure?.kind !== "rays-from-point") continue;
      const labels = new Set(spec.figure.rays.map((r) => r.label));
      for (const m of spec.figure.arcs ?? []) {
        expect(labels.has(m.a)).toBe(true);
        expect(labels.has(m.b)).toBe(true);
      }
      for (const m of spec.figure.rightAngles ?? []) {
        expect(labels.has(m.a)).toBe(true);
        expect(labels.has(m.b)).toBe(true);
      }
    }
  });

  it("every emitted reason has a display label", () => {
    for (const level of LEVELS) {
      for (let seed = 1; seed <= 30; seed++) {
        const spec = generateProof("angle-addition", level, mulberry32(seed));
        for (const s of spec.statements) {
          for (const r of s.reasons) expect(REASON_LABELS[r]).toBeTruthy();
        }
      }
    }
  });

  it("gates distractors by level — none at 1–2, present and rejected at 3–4", () => {
    for (let seed = 1; seed <= 40; seed++) {
      expect(generateProof("angle-addition", 1, mulberry32(seed)).distractors ?? []).toHaveLength(0);
      expect(generateProof("angle-addition", 2, mulberry32(seed)).distractors ?? []).toHaveLength(0);

      const spec = generateProof("angle-addition", 3, mulberry32(seed));
      expect((spec.distractors ?? []).length).toBeGreaterThan(0);
      for (const d of spec.distractors ?? []) {
        const verdict = gradeProof(spec, { rows: [{ statementId: d.id, reason: d.reason ?? "given" }] });
        expect(verdict.rows[0]).toMatchObject({ ok: false, problem: "distractor" });
      }
    }
  });

  it("varies its templates across seeds", () => {
    const proves = new Set<string>();
    for (let seed = 1; seed <= 60; seed++) {
      proves.add(generateProof("angle-addition", 4, mulberry32(seed)).proveText);
    }
    expect(proves.size).toBeGreaterThanOrEqual(3);
  });

  it("exercises the Angle Addition Postulate and its neighbouring reasons", () => {
    const reasons = new Set<string>();
    for (let seed = 1; seed <= 80; seed++) {
      for (const s of generateProof("angle-addition", 4, mulberry32(seed)).statements) {
        for (const r of s.reasons) reasons.add(r);
      }
    }
    for (const r of [
      "angle-add",
      "def-congr-angles",
      "add-eq",
      "sub-eq",
      "subst",
      "def-perp",
      "def-right-angle",
      "all-right-angles-congr",
      "def-angle-bisector",
      "transitive-congr",
    ]) {
      expect(reasons.has(r), r).toBe(true);
    }
  });
});
