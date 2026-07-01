import { describe, expect, it } from "vitest";
import {
  gradeProof,
  generateProof,
  PROOF_FAMILIES,
  REASON_LABELS,
  type ProofSpec,
  type ProofArrangement,
  type ScaffoldLevel,
} from "./proof";
import { mulberry32 } from "../random";

/** Canonical arrangement: statements in authored (topological) order, each with
 *  its first acceptable reason. A valid family must grade this as ok. */
const canonical = (spec: ProofSpec): ProofArrangement => ({
  rows: spec.statements.map((s) => ({ statementId: s.id, reason: s.reasons[0] })),
});

/** A tiny but complete two-column proof, used to exercise the grader directly.
 *  Given: B is the midpoint of AC.  Prove: AB ≅ CB.
 *   g. B is the midpoint of AC        — given
 *   1. AB ≅ CB                        — def. of midpoint   (deps: g) [goal] */
const midpointSpec: ProofSpec = {
  givenText: "B is the midpoint of $\\overline{AC}$",
  proveText: "$\\overline{AB} \\cong \\overline{CB}$",
  level: 1,
  statements: [
    { id: "g", text: "B is the midpoint of AC", reasons: ["given"], deps: [[]], given: true },
    { id: "1", text: "AB ≅ CB", reasons: ["def-midpoint"], deps: [["g"]], goal: true },
  ],
};

/** Given: AC and BD bisect each other at E.  Prove: AB ≅ CD.
 *   g1. AE ≅ CE        — def. of segment bisector        (root)
 *   g2. BE ≅ DE        — def. of segment bisector        (root)
 *   v.  ∠AEB ≅ ∠CED    — vertical angles                 (root)
 *   t.  △AEB ≅ △CED    — SAS               (deps: g1, g2, v)
 *   1.  AB ≅ CD        — CPCTC             (deps: t) [goal]
 *  g1/g2/v are mutually independent, so any order among them is valid. */
const sasSpec: ProofSpec = {
  givenText: "$\\overline{AC}$ and $\\overline{BD}$ bisect each other at $E$",
  proveText: "$\\overline{AB} \\cong \\overline{CD}$",
  level: 1,
  statements: [
    { id: "g1", text: "AE ≅ CE", reasons: ["def-seg-bisector"], deps: [[]], given: true },
    { id: "g2", text: "BE ≅ DE", reasons: ["def-seg-bisector"], deps: [[]], given: true },
    { id: "v", text: "∠AEB ≅ ∠CED", reasons: ["vertical-angles"], deps: [[]] },
    { id: "t", text: "△AEB ≅ △CED", reasons: ["sas"], deps: [["g1", "g2", "v"]] },
    { id: "1", text: "AB ≅ CD", reasons: ["cpctc"], deps: [["t"]], goal: true },
  ],
};

const inOrder = (...rows: [string, string][]): ProofArrangement => ({
  rows: rows.map(([statementId, reason]) => ({ statementId, reason: reason as never })),
});

describe("gradeProof", () => {
  it("accepts a canonical, correctly-ordered proof as ok and goal-reaching", () => {
    const verdict = gradeProof(midpointSpec, inOrder(["g", "given"], ["1", "def-midpoint"]));
    expect(verdict.ok).toBe(true);
    expect(verdict.reachesGoal).toBe(true);
    expect(verdict.complete).toBe(true);
    expect(verdict.rows.every((r) => r.ok)).toBe(true);
  });

  it("accepts any valid topological order — independent steps may be swapped", () => {
    const orderA = inOrder(["g1", "def-seg-bisector"], ["g2", "def-seg-bisector"], ["v", "vertical-angles"], ["t", "sas"], ["1", "cpctc"]);
    const orderB = inOrder(["v", "vertical-angles"], ["g2", "def-seg-bisector"], ["g1", "def-seg-bisector"], ["t", "sas"], ["1", "cpctc"]);
    expect(gradeProof(sasSpec, orderA).ok).toBe(true);
    expect(gradeProof(sasSpec, orderB).ok).toBe(true);
  });

  it("rejects a premature row placed before its dependencies", () => {
    // t (the congruence) placed before its parts g1/g2/v are established.
    const bad = inOrder(["g1", "def-seg-bisector"], ["t", "sas"], ["g2", "def-seg-bisector"], ["v", "vertical-angles"], ["1", "cpctc"]);
    const verdict = gradeProof(sasSpec, bad);
    expect(verdict.ok).toBe(false);
    expect(verdict.rows[1]).toMatchObject({ index: 1, ok: false, problem: "premature" });
  });

  it("rejects a row whose chosen reason is not in the statement's acceptable set", () => {
    // "t" is justified by SAS, not SSS.
    const bad = inOrder(["g1", "def-seg-bisector"], ["g2", "def-seg-bisector"], ["v", "vertical-angles"], ["t", "sss"], ["1", "cpctc"]);
    const verdict = gradeProof(sasSpec, bad);
    expect(verdict.ok).toBe(false);
    expect(verdict.rows[3]).toMatchObject({ index: 3, ok: false, problem: "bad-reason" });
  });

  it("accepts EITHER reason when a step lists a reason set (subst or transitive)", () => {
    // m∠1+m∠2 = m∠2+m∠3 follows by substitution OR the transitive property.
    const spec: ProofSpec = {
      givenText: "…",
      proveText: "$m\\angle 1 = m\\angle 3$",
      level: 1,
      statements: [
        { id: "a", text: "m∠1 + m∠2 = 180", reasons: ["linear-pair-supp"], deps: [[]], given: true },
        { id: "b", text: "m∠2 + m∠3 = 180", reasons: ["linear-pair-supp"], deps: [[]], given: true },
        { id: "c", text: "m∠1 + m∠2 = m∠2 + m∠3", reasons: ["subst", "transitive-eq"], deps: [["a", "b"]] },
        { id: "d", text: "m∠1 = m∠3", reasons: ["sub-eq"], deps: [["c"]], goal: true },
      ],
    };
    const withSubst = inOrder(["a", "linear-pair-supp"], ["b", "linear-pair-supp"], ["c", "subst"], ["d", "sub-eq"]);
    const withTransitive = inOrder(["a", "linear-pair-supp"], ["b", "linear-pair-supp"], ["c", "transitive-eq"], ["d", "sub-eq"]);
    expect(gradeProof(spec, withSubst).ok).toBe(true);
    expect(gradeProof(spec, withTransitive).ok).toBe(true);
  });

  it("rejects an included distractor tile and reports an incomplete proof", () => {
    const withDistractor: ProofSpec = {
      ...midpointSpec,
      distractors: [{ id: "x", text: "AB ≅ AC", reason: "def-midpoint" }],
    };
    // Places the distractor and omits the goal entirely.
    const verdict = gradeProof(withDistractor, inOrder(["g", "given"], ["x", "def-midpoint"]));
    expect(verdict.rows[1]).toMatchObject({ index: 1, ok: false, problem: "distractor" });
    expect(verdict.reachesGoal).toBe(false);
    expect(verdict.complete).toBe(false);
    expect(verdict.ok).toBe(false);
  });

  it("supports alternative derivation paths — a step reachable via a OR b", () => {
    const spec: ProofSpec = {
      givenText: "…",
      proveText: "$P$",
      level: 1,
      statements: [
        { id: "a", text: "route A fact", reasons: ["given"], deps: [[]], given: true },
        { id: "b", text: "route B fact", reasons: ["given"], deps: [[]], given: true },
        { id: "p", text: "P", reasons: ["subst"], deps: [["a"], ["b"]], goal: true },
      ],
    };
    expect(gradeProof(spec, inOrder(["a", "given"], ["p", "subst"])).ok).toBe(true);
    expect(gradeProof(spec, inOrder(["b", "given"], ["p", "subst"])).ok).toBe(true);
    // Neither route present → the goal is premature.
    expect(gradeProof(spec, inOrder(["p", "subst"])).rows[0]).toMatchObject({ ok: false, problem: "premature" });
  });
});

describe("reason bank", () => {
  it("keeps Equality and Congruence properties as distinct labels", () => {
    expect(REASON_LABELS["reflexive-eq"]).toBe("Reflexive Property of Equality");
    expect(REASON_LABELS["reflexive-congr"]).toBe("Reflexive Property of Congruence");
    expect(REASON_LABELS["reflexive-eq"]).not.toBe(REASON_LABELS["reflexive-congr"]);
  });

  it("every acceptable reason a family emits has a display label", () => {
    for (let seed = 1; seed <= 20; seed++) {
      const spec = generateProof("vertical-angles", 4, mulberry32(seed));
      for (const s of spec.statements) {
        for (const r of s.reasons) expect(REASON_LABELS[r]).toBeTruthy();
      }
    }
  });
});

describe("generateProof — vertical-angles family", () => {
  it("registers the vertical-angles family", () => {
    expect(PROOF_FAMILIES).toContain("vertical-angles");
  });

  it("throws on an unknown family id", () => {
    expect(() => generateProof("no-such-family", 1, mulberry32(1))).toThrow();
  });

  it("is deterministic — the same seed reproduces the same spec", () => {
    const a = generateProof("vertical-angles", 2, mulberry32(2024));
    const b = generateProof("vertical-angles", 2, mulberry32(2024));
    expect(JSON.stringify(a)).toBe(JSON.stringify(b));
  });

  it("emits a valid, goal-reaching DAG for every seed and level (property)", () => {
    const levels: ScaffoldLevel[] = [1, 2, 3, 4];
    for (const level of levels) {
      for (let seed = 1; seed <= 40; seed++) {
        const spec = generateProof("vertical-angles", level, mulberry32(seed));
        const verdict = gradeProof(spec, canonical(spec));
        expect(verdict.ok, `seed ${seed} level ${level}`).toBe(true);
        expect(spec.statements.some((s) => s.goal)).toBe(true);
      }
    }
  });

  it("gates distractors by level — none at 1–2, present and genuinely wrong at 3–4", () => {
    for (let seed = 1; seed <= 20; seed++) {
      expect(generateProof("vertical-angles", 1, mulberry32(seed)).distractors ?? []).toHaveLength(0);
      expect(generateProof("vertical-angles", 2, mulberry32(seed)).distractors ?? []).toHaveLength(0);

      const spec = generateProof("vertical-angles", 3, mulberry32(seed));
      expect((spec.distractors ?? []).length).toBeGreaterThan(0);
      // Every distractor, when placed, is rejected as a distractor (not a real statement id).
      for (const d of spec.distractors ?? []) {
        const verdict = gradeProof(spec, { rows: [{ statementId: d.id, reason: d.reason ?? "given" }] });
        expect(verdict.rows[0]).toMatchObject({ ok: false, problem: "distractor" });
      }
    }
  });
});
