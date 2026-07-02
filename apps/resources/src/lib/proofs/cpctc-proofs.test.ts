import { describe, expect, it } from "vitest";
import { gradeProof, REASON_LABELS, type ReasonId } from "@cameronbrady/math-components/logic";
import { CPCTC_PROOFS } from "./cpctc-proofs";

/** Canonical arrangement: statements in authored (topological) order, each with
 *  its first acceptable reason. Every embedded proof must grade ok this way. */
const canonical = (id: string) => {
  const spec = CPCTC_PROOFS[id];
  return { rows: spec.statements.map((s) => ({ statementId: s.id, reason: s.reasons[0] })) };
};

describe("CPCTC worked proofs (embedded fixed specs)", () => {
  const ids = Object.keys(CPCTC_PROOFS);

  it("exposes the three worked proofs", () => {
    expect(ids).toEqual(["sss-isosceles", "sas-bisect", "asa-parallelogram"]);
  });

  it.each(ids)("%s is a valid DAG that reaches its goal in canonical order", (id) => {
    const verdict = gradeProof(CPCTC_PROOFS[id], canonical(id));
    expect(verdict.ok).toBe(true);
    expect(verdict.reachesGoal).toBe(true);
    expect(verdict.complete).toBe(true);
  });

  it.each(ids)("%s concludes with CPCTC on the goal row", (id) => {
    const goal = CPCTC_PROOFS[id].statements.find((s) => s.goal)!;
    expect(goal.reasons).toContain("cpctc");
  });

  it.each(ids)("%s cites only reasons that exist in the reason bank", (id) => {
    for (const s of CPCTC_PROOFS[id].statements) {
      for (const r of s.reasons) expect(REASON_LABELS[r as ReasonId]).toBeTruthy();
    }
  });

  it.each(ids)("%s authors a `tex` display form for every statement", (id) => {
    for (const s of CPCTC_PROOFS[id].statements) expect(s.tex).toBeTruthy();
  });
});
