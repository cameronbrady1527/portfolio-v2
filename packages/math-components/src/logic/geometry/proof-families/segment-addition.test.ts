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

/** Statements in authored (topological) order, each with its first reason. */
const canonical = (spec: ProofSpec): ProofArrangement => ({
  rows: spec.statements.map((s) => ({ statementId: s.id, reason: s.reasons[0] })),
});

const LEVELS: ScaffoldLevel[] = [1, 2, 3, 4];

describe("segment-addition family", () => {
  it("is registered", () => {
    expect(PROOF_FAMILIES).toContain("segment-addition");
  });

  it("is deterministic — same seed reproduces the same spec", () => {
    const a = generateProof("segment-addition", 3, mulberry32(7));
    const b = generateProof("segment-addition", 3, mulberry32(7));
    expect(JSON.stringify(a)).toBe(JSON.stringify(b));
  });

  it("emits a valid, goal-reaching DAG for every seed and level (property)", () => {
    for (const level of LEVELS) {
      for (let seed = 1; seed <= 60; seed++) {
        const spec = generateProof("segment-addition", level, mulberry32(seed));
        const verdict = gradeProof(spec, canonical(spec));
        expect(verdict.ok, `seed ${seed} level ${level}`).toBe(true);
        expect(verdict.reachesGoal, `seed ${seed} level ${level}`).toBe(true);
        expect(spec.statements.some((s) => s.goal)).toBe(true);
      }
    }
  });

  it("attaches a points-on-line figure whose ticked segments reference real points", () => {
    for (let seed = 1; seed <= 40; seed++) {
      const spec = generateProof("segment-addition", 2, mulberry32(seed));
      expect(spec.figure?.kind).toBe("points-on-line");
      if (spec.figure?.kind !== "points-on-line") continue;
      const labels = new Set(spec.figure.points.map((p) => p.label));
      for (const t of spec.figure.ticks ?? []) {
        expect(labels.has(t.a)).toBe(true);
        expect(labels.has(t.b)).toBe(true);
        expect(t.count).toBeGreaterThan(0);
      }
    }
  });

  it("every emitted reason has a display label", () => {
    for (const level of LEVELS) {
      for (let seed = 1; seed <= 30; seed++) {
        const spec = generateProof("segment-addition", level, mulberry32(seed));
        for (const s of spec.statements) {
          for (const r of s.reasons) expect(REASON_LABELS[r]).toBeTruthy();
        }
      }
    }
  });

  it("gates distractors by level — none at 1–2, present and rejected at 3–4", () => {
    for (let seed = 1; seed <= 40; seed++) {
      expect(generateProof("segment-addition", 1, mulberry32(seed)).distractors ?? []).toHaveLength(0);
      expect(generateProof("segment-addition", 2, mulberry32(seed)).distractors ?? []).toHaveLength(0);

      const spec = generateProof("segment-addition", 3, mulberry32(seed));
      expect((spec.distractors ?? []).length).toBeGreaterThan(0);
      for (const d of spec.distractors ?? []) {
        const verdict = gradeProof(spec, { rows: [{ statementId: d.id, reason: d.reason ?? "given" }] });
        expect(verdict.rows[0]).toMatchObject({ ok: false, problem: "distractor" });
      }
    }
  });

  it("varies its templates across seeds (build-up, break-down, midpoint chain)", () => {
    const proves = new Set<string>();
    for (let seed = 1; seed <= 60; seed++) {
      proves.add(generateProof("segment-addition", 4, mulberry32(seed)).proveText);
    }
    expect(proves.size).toBeGreaterThanOrEqual(3);
  });

  it("exercises the Segment Addition Postulate and equality/congruence properties", () => {
    const reasons = new Set<string>();
    for (let seed = 1; seed <= 60; seed++) {
      for (const s of generateProof("segment-addition", 4, mulberry32(seed)).statements) {
        for (const r of s.reasons) reasons.add(r);
      }
    }
    for (const r of ["seg-add", "def-congr-segments", "add-eq", "sub-eq", "subst", "def-midpoint", "transitive-congr"]) {
      expect(reasons.has(r), r).toBe(true);
    }
  });
});
