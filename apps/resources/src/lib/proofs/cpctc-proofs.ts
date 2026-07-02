import type { ProofSpec } from "@cameronbrady/math-components";

/**
 * The three worked CPCTC proofs embedded on the congruence page, as fixed specs
 * for a live (figureless) <ProofBuilder fixed>. Each is the classic two-step
 * move — prove a triangle congruence by a criterion, then harvest a part with
 * CPCTC — and matches the narrative + PredictThenCheck that precede it:
 *   • sss → isosceles base angles,
 *   • sas → the diagonals of a quadrilateral that bisect each other,
 *   • asa → opposite sides of a parallelogram.
 *
 * Plain `text` stays unicode (screen-reader labels); `tex` carries the
 * Regents-faithful `$…$` display (congruence draws objects with \overline /
 * \angle / \triangle; the reflexive segment is the same segment on both sides).
 * `level: 1` — statements are given in order and the student supplies each reason.
 */
export const CPCTC_PROOFS: Record<string, ProofSpec> = {
  // Proof 1 — SSS, then CPCTC (isosceles base angles).
  "sss-isosceles": {
    givenText:
      "$\\overline{AB} \\cong \\overline{CB}$, and $M$ is the midpoint of $\\overline{AC}$",
    proveText: "$\\angle A \\cong \\angle C$",
    level: 1,
    statements: [
      { id: "g1", text: "AB ≅ CB", tex: "$\\overline{AB} \\cong \\overline{CB}$", reasons: ["given"], deps: [[]], given: true },
      { id: "g2", text: "M is the midpoint of AC", tex: "$M$ is the midpoint of $\\overline{AC}$", reasons: ["given"], deps: [[]], given: true },
      { id: "s1", text: "AM ≅ CM", tex: "$\\overline{AM} \\cong \\overline{CM}$", reasons: ["def-midpoint"], deps: [["g2"]] },
      { id: "s2", text: "BM ≅ BM", tex: "$\\overline{BM} \\cong \\overline{BM}$", reasons: ["reflexive-congr"], deps: [[]] },
      { id: "s3", text: "△ABM ≅ △CBM", tex: "$\\triangle ABM \\cong \\triangle CBM$", reasons: ["sss"], deps: [["g1", "s1", "s2"]] },
      { id: "s4", text: "∠A ≅ ∠C", tex: "$\\angle A \\cong \\angle C$", reasons: ["cpctc"], deps: [["s3"]], goal: true },
    ],
  },

  // Proof 2 — SAS, then CPCTC (diagonals bisecting each other).
  "sas-bisect": {
    givenText:
      "$\\overline{AC}$ and $\\overline{BD}$ bisect each other at $E$",
    proveText: "$\\overline{AB} \\cong \\overline{CD}$",
    level: 1,
    statements: [
      { id: "g", text: "AC and BD bisect each other at E", tex: "$\\overline{AC}$ and $\\overline{BD}$ bisect each other at $E$", reasons: ["given"], deps: [[]], given: true },
      { id: "s1", text: "AE ≅ CE", tex: "$\\overline{AE} \\cong \\overline{CE}$", reasons: ["def-seg-bisector"], deps: [["g"]] },
      { id: "s2", text: "BE ≅ DE", tex: "$\\overline{BE} \\cong \\overline{DE}$", reasons: ["def-seg-bisector"], deps: [["g"]] },
      { id: "s3", text: "∠AEB ≅ ∠CED", tex: "$\\angle AEB \\cong \\angle CED$", reasons: ["vertical-angles"], deps: [["g"]] },
      { id: "s4", text: "△AEB ≅ △CED", tex: "$\\triangle AEB \\cong \\triangle CED$", reasons: ["sas"], deps: [["s1", "s2", "s3"]] },
      { id: "s5", text: "AB ≅ CD", tex: "$\\overline{AB} \\cong \\overline{CD}$", reasons: ["cpctc"], deps: [["s4"]], goal: true },
    ],
  },

  // Proof 3 — ASA, then CPCTC (opposite sides of a parallelogram).
  "asa-parallelogram": {
    givenText:
      "$\\overline{AB} \\parallel \\overline{CD}$, and $\\overline{AD} \\parallel \\overline{BC}$",
    proveText: "$\\overline{AB} \\cong \\overline{CD}$",
    level: 1,
    statements: [
      { id: "g1", text: "AB ∥ CD", tex: "$\\overline{AB} \\parallel \\overline{CD}$", reasons: ["given"], deps: [[]], given: true },
      { id: "g2", text: "AD ∥ BC", tex: "$\\overline{AD} \\parallel \\overline{BC}$", reasons: ["given"], deps: [[]], given: true },
      { id: "s1", text: "∠BAC ≅ ∠DCA", tex: "$\\angle BAC \\cong \\angle DCA$", reasons: ["alt-interior-angles"], deps: [["g1"]] },
      { id: "s2", text: "AC ≅ AC", tex: "$\\overline{AC} \\cong \\overline{AC}$", reasons: ["reflexive-congr"], deps: [[]] },
      { id: "s3", text: "∠BCA ≅ ∠DAC", tex: "$\\angle BCA \\cong \\angle DAC$", reasons: ["alt-interior-angles"], deps: [["g2"]] },
      { id: "s4", text: "△ABC ≅ △CDA", tex: "$\\triangle ABC \\cong \\triangle CDA$", reasons: ["asa"], deps: [["s1", "s2", "s3"]] },
      { id: "s5", text: "AB ≅ CD", tex: "$\\overline{AB} \\cong \\overline{CD}$", reasons: ["cpctc"], deps: [["s4"]], goal: true },
    ],
  },
};
