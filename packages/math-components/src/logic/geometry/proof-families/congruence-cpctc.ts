/**
 * The `congruence-cpctc` proof family — the meatiest of the Proofs unit.
 *
 * A student proves two triangles congruent by a criterion the GIVENS force
 * (SSS / SAS / ASA), then concludes a pair of corresponding parts congruent by
 * CPCTC. The generator is pure and seeded: a given `(level, rng)` reproduces the
 * same proof, and the STRUCTURE varies in ways that actually change the DAG —
 *
 *   • the CRITERION (SSS vs SAS vs ASA), which changes the congruence row's
 *     reason AND which prerequisite rows exist,
 *   • the given / prove split and the derivation flavour (e.g. an included angle
 *     handed directly vs. derived from a pair of right angles), and
 *   • the GOAL (a corresponding angle vs a corresponding segment).
 *
 * Everything the figure shows is derived from the same description the proof
 * text reads, so the two can never disagree: the marked parts are exactly the
 * givens, the criterion is exactly what those marks justify, and the goal part
 * is the one left unmarked. Correspondence is positional throughout — triangle 1
 * vertex i ↔ triangle 2 vertex i — so `△(labels1) ≅ △(labels2)` and every part
 * name follow one rule, machine-checkable rather than eyeballed.
 *
 * SME note: each criterion's DAG is authored and hand-verified below; the only
 * randomisation is the label sextet, the triangle shape, and which eligible part
 * becomes the goal. See the property test for the exhaustive per-criterion check.
 */
import type {
  ProofDistractor,
  ProofFamily,
  ProofSpec,
  ProofStatement,
  ReasonId,
  TriangleFigureMark,
} from "../proof";
import { triangleFromSSS } from "../triangle";

/** Integer in [lo, hi] from the seeded stream. */
function pick(rng: () => number, lo: number, hi: number): number {
  return lo + Math.floor(rng() * (hi - lo + 1));
}
function choose<T>(rng: () => number, xs: readonly T[]): T {
  return xs[Math.floor(rng() * xs.length)];
}

/** The three criteria whose givens this family can present. */
type Crit = "SSS" | "SAS" | "ASA";
const CRIT_REASON: Record<Crit, ReasonId> = { SSS: "sss", SAS: "sas", ASA: "asa" };

/** Distinct six-letter label sets — [triangle1, triangle2], positional
 *  correspondence (index i of the first ↔ index i of the second). */
const LABEL_SEXTETS: [[string, string, string], [string, string, string]][] = [
  [["A", "B", "C"], ["D", "E", "F"]],
  [["P", "Q", "R"], ["X", "Y", "Z"]],
  [["J", "K", "L"], ["M", "N", "O"]],
  [["R", "S", "T"], ["U", "V", "W"]],
  [["A", "B", "C"], ["X", "Y", "Z"]],
];

/** Scalene, valid triangle shapes [ |01|, |12|, |20| ] — distinct sides so tick
 *  counts read cleanly and no accidental within-triangle congruence appears. */
const SCALENE_SHAPES: [number, number, number][] = [
  [6, 5, 8],
  [7, 6, 9],
  [5, 7, 8],
  [8, 6, 7],
];

/** A right triangle with the right angle at vertex 1 (legs |01|,|12|; hyp |20|). */
const RIGHT_SHAPE: [number, number, number] = [4, 3, 5];

/** Canonical side index-pairs, named clockwise: 01, 12, 20. */
const SIDE_PAIRS: [number, number][] = [
  [0, 1],
  [1, 2],
  [2, 0],
];

// Plain-unicode part names — the canonical `text` form (used for figure-highlight
// matching + screen-reader labels), e.g. "AB ≅ DE", "∠C ≅ ∠F", "△ABC ≅ △DEF".
// The parallel `…Tex` builders below produce the `$…$` display form.
const tri = (l: [string, string, string]) => `△${l[0]}${l[1]}${l[2]}`;
const ang = (l: [string, string, string], i: number) => `∠${l[i]}`;
const side = (l: [string, string, string], i: number, j: number) => `${l[i]}${l[j]}`;

// Parallel LaTeX-token builders (no `$` delimiters — those are added by the
// callers when composing a display string). Congruence relates OBJECTS drawn in
// their object notation: triangles (△), angles (∠), segments (overline). CPCTC
// conclusions and given clauses are all object-congruences, so segments here are
// always the `\overline{…}` object form.
const triTex = (l: [string, string, string]) => `\\triangle ${l[0]}${l[1]}${l[2]}`;
const angTex = (l: [string, string, string], i: number) => `\\angle ${l[i]}`;
const segTex = (s: string) => `\\overline{${s}}`;
/** A `$…$` display string for `objA ≅ objB`, given each side's LaTeX token. */
const congrTex = (a: string, b: string) => `$${a} \\cong ${b}$`;

/** A congruent pair of sides, named on both triangles by an index-pair. */
function sidePairName(
  l1: [string, string, string],
  l2: [string, string, string],
  ij: [number, number],
): { s1: string; s2: string } {
  return { s1: side(l1, ij[0], ij[1]), s2: side(l2, ij[0], ij[1]) };
}

/**
 * The congruence-cpctc family. Picks a criterion, a label sextet, and a triangle
 * shape, then assembles the criterion's authored DAG plus a CPCTC conclusion of
 * a randomly-chosen eligible corresponding part (angle or segment).
 */
export const congruenceCpctc: ProofFamily = (level, rng) => {
  const criterion = choose(rng, ["SSS", "SAS", "ASA"] as const);
  const [l1, l2] = choose(rng, LABEL_SEXTETS);

  // A pair of right angles (→ all-right-angles-congr) is a second way to hand SAS
  // its included angle; use it sometimes so the prerequisite rows genuinely vary.
  const useRightAngle = criterion === "SAS" && pick(rng, 0, 1) === 1;
  const shape: [number, number, number] = useRightAngle
    ? RIGHT_SHAPE
    : choose(rng, SCALENE_SHAPES);

  const statements: ProofStatement[] = [];
  const marks: TriangleFigureMark[] = [];
  const givenPartsTex: string[] = []; // parallel `$…$` display clauses

  // The ids the △≅△ row depends on (its established parts).
  const congrDeps: string[] = [];

  if (criterion === "SSS") {
    // All three corresponding sides given congruent.
    SIDE_PAIRS.forEach((ij, k) => {
      const { s1, s2 } = sidePairName(l1, l2, ij);
      const id = `g${k + 1}`;
      statements.push({
        id,
        text: `${s1} ≅ ${s2}`,
        tex: congrTex(segTex(s1), segTex(s2)),
        reasons: ["given"],
        deps: [[]],
        given: true,
      });
      congrDeps.push(id);
      givenPartsTex.push(congrTex(segTex(s1), segTex(s2)));
      marks.push({ kind: "side", tri: 0, at: s1, count: k + 1 });
      marks.push({ kind: "side", tri: 1, at: s2, count: k + 1 });
    });
  } else if (criterion === "SAS") {
    // Two sides (01, 12) and their included angle (at vertex 1).
    const sideA = sidePairName(l1, l2, [0, 1]); // e.g. AB ↔ DE
    const sideB = sidePairName(l1, l2, [1, 2]); // e.g. BC ↔ EF
    statements.push({
      id: "g1",
      text: `${sideA.s1} ≅ ${sideA.s2}`,
      tex: congrTex(segTex(sideA.s1), segTex(sideA.s2)),
      reasons: ["given"],
      deps: [[]],
      given: true,
    });
    congrDeps.push("g1");
    givenPartsTex.push(congrTex(segTex(sideA.s1), segTex(sideA.s2)));
    marks.push({ kind: "side", tri: 0, at: sideA.s1, count: 1 });
    marks.push({ kind: "side", tri: 1, at: sideA.s2, count: 1 });

    // The included angle: handed directly, or derived from a pair of right angles.
    const aName1 = ang(l1, 1);
    const aName2 = ang(l2, 1);
    if (useRightAngle) {
      statements.push({
        id: "gRA",
        text: `${aName1} and ${aName2} are right angles`,
        tex: `$${angTex(l1, 1)}$ and $${angTex(l2, 1)}$ are right angles`,
        reasons: ["given"],
        deps: [[]],
        given: true,
      });
      statements.push({
        id: "rA",
        text: `${aName1} ≅ ${aName2}`,
        tex: congrTex(angTex(l1, 1), angTex(l2, 1)),
        reasons: ["all-right-angles-congr"],
        deps: [["gRA"]],
      });
      congrDeps.push("rA");
      givenPartsTex.push(`$${angTex(l1, 1)}$ and $${angTex(l2, 1)}$ are right angles`);
      marks.push({ kind: "right", tri: 0, at: l1[1] });
      marks.push({ kind: "right", tri: 1, at: l2[1] });
    } else {
      statements.push({
        id: "g2",
        text: `${aName1} ≅ ${aName2}`,
        tex: congrTex(angTex(l1, 1), angTex(l2, 1)),
        reasons: ["given"],
        deps: [[]],
        given: true,
      });
      congrDeps.push("g2");
      givenPartsTex.push(congrTex(angTex(l1, 1), angTex(l2, 1)));
      marks.push({ kind: "angle", tri: 0, at: l1[1], count: 1 });
      marks.push({ kind: "angle", tri: 1, at: l2[1], count: 1 });
    }

    statements.push({
      id: "g3",
      text: `${sideB.s1} ≅ ${sideB.s2}`,
      tex: congrTex(segTex(sideB.s1), segTex(sideB.s2)),
      reasons: ["given"],
      deps: [[]],
      given: true,
    });
    congrDeps.push("g3");
    givenPartsTex.push(congrTex(segTex(sideB.s1), segTex(sideB.s2)));
    marks.push({ kind: "side", tri: 0, at: sideB.s1, count: 2 });
    marks.push({ kind: "side", tri: 1, at: sideB.s2, count: 2 });
  } else {
    // ASA: two angles (at 0 and 1) and their included side (01).
    const angleA1 = ang(l1, 0);
    const angleA2 = ang(l2, 0);
    const angleB1 = ang(l1, 1);
    const angleB2 = ang(l2, 1);
    const inc = sidePairName(l1, l2, [0, 1]);
    statements.push({
      id: "g1",
      text: `${angleA1} ≅ ${angleA2}`,
      tex: congrTex(angTex(l1, 0), angTex(l2, 0)),
      reasons: ["given"],
      deps: [[]],
      given: true,
    });
    statements.push({
      id: "g2",
      text: `${inc.s1} ≅ ${inc.s2}`,
      tex: congrTex(segTex(inc.s1), segTex(inc.s2)),
      reasons: ["given"],
      deps: [[]],
      given: true,
    });
    statements.push({
      id: "g3",
      text: `${angleB1} ≅ ${angleB2}`,
      tex: congrTex(angTex(l1, 1), angTex(l2, 1)),
      reasons: ["given"],
      deps: [[]],
      given: true,
    });
    congrDeps.push("g1", "g2", "g3");    givenPartsTex.push(
      congrTex(angTex(l1, 0), angTex(l2, 0)),
      congrTex(segTex(inc.s1), segTex(inc.s2)),
      congrTex(angTex(l1, 1), angTex(l2, 1)),
    );
    marks.push({ kind: "angle", tri: 0, at: l1[0], count: 1 });
    marks.push({ kind: "angle", tri: 1, at: l2[0], count: 1 });
    marks.push({ kind: "side", tri: 0, at: inc.s1, count: 1 });
    marks.push({ kind: "side", tri: 1, at: inc.s2, count: 1 });
    marks.push({ kind: "angle", tri: 0, at: l1[1], count: 2 });
    marks.push({ kind: "angle", tri: 1, at: l2[1], count: 2 });
  }

  // ── The congruence row ──────────────────────────────────────────────────────
  statements.push({
    id: "cong",
    text: `${tri(l1)} ≅ ${tri(l2)}`,
    tex: congrTex(triTex(l1), triTex(l2)),
    reasons: [CRIT_REASON[criterion]],
    deps: [congrDeps],
  });

  // ── The CPCTC goal: a corresponding part NOT among the givens ───────────────
  type GoalOpt = { type: "angle"; i: number } | { type: "side"; ij: [number, number] };
  let eligible: GoalOpt[];
  if (criterion === "SSS") {
    // Sides all given → any corresponding ANGLE is a fresh conclusion.
    eligible = [
      { type: "angle", i: 0 },
      { type: "angle", i: 1 },
      { type: "angle", i: 2 },
    ];
  } else if (criterion === "SAS") {
    // Given sides 01,12 and ∠1. Fresh: side 20, and angles 0 & 2.
    eligible = [
      { type: "side", ij: [2, 0] },
      { type: "angle", i: 0 },
      { type: "angle", i: 2 },
    ];
  } else {
    // ASA. Given ∠0, ∠1, side 01. Fresh: sides 12 & 20, and angle 2.
    eligible = [
      { type: "side", ij: [1, 2] },
      { type: "side", ij: [2, 0] },
      { type: "angle", i: 2 },
    ];
  }
  const goal = choose(rng, eligible);

  let proveText: string;
  let goalText: string;
  let goalTex: string;
  if (goal.type === "angle") {
    goalText = `${ang(l1, goal.i)} ≅ ${ang(l2, goal.i)}`;
    goalTex = congrTex(angTex(l1, goal.i), angTex(l2, goal.i));
    proveText = goalTex;
  } else {
    const { s1, s2 } = sidePairName(l1, l2, goal.ij);
    goalText = `${s1} ≅ ${s2}`;
    goalTex = congrTex(segTex(s1), segTex(s2));
    proveText = goalTex;
  }
  statements.push({
    id: "goal",
    text: goalText,
    tex: goalTex,
    reasons: ["cpctc"],
    deps: [["cong"]],
    goal: true,
  });

  // ── Distractors — plausible but never-made statements, gated to level ≥ 3 ────
  const distractors: ProofDistractor[] =
    level >= 3
      ? [
          // A wrong-correspondence CPCTC conclusion (right idea, wrong partner):
          // the goal part paired with a NON-corresponding part of the other
          // triangle (an angle at the next vertex, or a shifted, different side).
          {
            id: "d1",
            text:
              goal.type === "angle"
                ? `${ang(l1, goal.i)} ≅ ${ang(l2, (goal.i + 1) % 3)}`
                : `${side(l1, goal.ij[0], goal.ij[1])} ≅ ${side(l2, (goal.ij[0] + 1) % 3, (goal.ij[1] + 1) % 3)}`,
            tex:
              goal.type === "angle"
                ? congrTex(angTex(l1, goal.i), angTex(l2, (goal.i + 1) % 3))
                : congrTex(
                    segTex(side(l1, goal.ij[0], goal.ij[1])),
                    segTex(side(l2, (goal.ij[0] + 1) % 3, (goal.ij[1] + 1) % 3)),
                  ),
            reason: "cpctc",
          },
          // A triangle-congruence claim under a scrambled correspondence.
          {
            id: "d2",
            text: `${tri(l1)} ≅ △${l2[1]}${l2[2]}${l2[0]}`,
            tex: `$${triTex(l1)} \\cong \\triangle ${l2[1]}${l2[2]}${l2[0]}$`,
            reason: CRIT_REASON[criterion],
          },
        ]
      : [];

  const spec: ProofSpec = {
    figure: { kind: "triangle-pair", labels: [l1, l2], sides: shape, marks },
    givenText: joinClauses(givenPartsTex),
    proveText,
    statements,
    distractors,
    level,
  };
  return spec;
};

/** Join given clauses into an English list ("A, B, and C"). */
function joinClauses(parts: string[]): string {
  if (parts.length <= 1) return parts.join("");
  if (parts.length === 2) return `${parts[0]} and ${parts[1]}`;
  return `${parts.slice(0, -1).join(", ")}, and ${parts[parts.length - 1]}`;
}

/** Exported for tests/tooling: the concrete congruent triangle coordinates a
 *  spec's `sides` produce (both triangles are this shape, rigidly). */
export function trianglePairShape(sides: [number, number, number]) {
  return triangleFromSSS(sides[0], sides[1], sides[2]);
}
