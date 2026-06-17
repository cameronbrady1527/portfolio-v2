/**
 * Equivalence checking by numeric sampling — the machine-checkable core of the
 * expression/equation question types.
 *
 * Why sampling, not symbolic algebra: this package ships lean (no CAS
 * dependency), and for the polynomial/rational expressions of school algebra,
 * evaluating both sides at many random points is both correct to overwhelming
 * probability AND free of the false-negatives that incomplete symbolic
 * simplifiers produce. Sampling is deterministic here (fixed-seed PRNG) so a
 * given answer always grades the same way.
 *
 * Two expressions are equivalent iff they agree (within tolerance) at every
 * sampled point where both are defined.
 *
 * Two EQUATIONS are equivalent iff their differences (left − right) are nonzero
 * scalar multiples of each other — so "2x = 4", "x = 2", "x − 2 = 0" and
 * "0 = 2 − x" all match, as do "y = 2x + 1" and "2y = 4x + 2". This is the
 * "same line / same solution set up to rescaling" notion. It is a *sufficient*
 * condition for equal solution sets (proportional differences always share a
 * zero set) and is exact for the linear and standard-form answers this targets;
 * it intentionally does NOT try to equate solution sets that coincide only by
 * accident (e.g. x and x³ both vanishing at 0).
 */
import type { Equation, Node } from "./ast";
import { evaluate, type Bindings } from "./evaluate";
import { mulberry32 } from "../../random";

const TRIALS = 32;
const MIN_VALID_POINTS = 6;
// Relative+absolute closeness; loose enough for float drift in algebraically
// equal forms ((x+1)(x−1) vs x²−1), tight enough to reject genuine differences.
const TOL = 1e-9;

function close(a: number, b: number): boolean {
  return Math.abs(a - b) <= TOL * Math.max(1, Math.abs(a), Math.abs(b));
}

/** Collect the free variables appearing in an AST. */
export function freeVars(node: Node, into: Set<string> = new Set()): Set<string> {
  switch (node.kind) {
    case "num":
      return into;
    case "var":
      into.add(node.name);
      return into;
    case "neg":
      return freeVars(node.operand, into);
    default:
      freeVars(node.left, into);
      freeVars(node.right, into);
      return into;
  }
}

function sampleBindings(vars: string[], rand: () => number): Bindings {
  const b: Bindings = {};
  for (const v of vars) {
    // Spread over roughly [-10, 10], biased away from 0 to dodge poles and the
    // trivial agreement at the origin.
    const r = rand() * 2 - 1; // [-1, 1]
    const mag = 1 + rand() * 9; // [1, 10]
    b[v] = r >= 0 ? mag : -mag;
  }
  return b;
}

function finite(x: number): boolean {
  return Number.isFinite(x);
}

/**
 * True iff expressions `a` and `b` are numerically equivalent. Samples over the
 * union of their free variables (plus any explicitly declared ones).
 */
export function expressionsEquivalent(
  a: Node,
  b: Node,
  declaredVars: string[] = [],
): boolean {
  const vars = [
    ...new Set([...declaredVars, ...freeVars(a), ...freeVars(b)]),
  ];
  const rand = mulberry32(0x5f3759df);
  let valid = 0;
  for (let i = 0; i < TRIALS; i++) {
    const bindings = sampleBindings(vars, rand);
    const va = evaluate(a, bindings);
    const vb = evaluate(b, bindings);
    if (!finite(va) || !finite(vb)) continue; // undefined here — skip
    valid += 1;
    if (!close(va, vb)) return false;
  }
  // Constants (no variables) produce one trivially-valid "point" — accept it.
  if (vars.length === 0) return valid > 0;
  return valid >= MIN_VALID_POINTS;
}

/** Build the difference node (left − right) for an equation. */
function difference(eq: Equation): Node {
  return { kind: "sub", left: eq.left, right: eq.right };
}

/**
 * True iff equations `a` and `b` have the same solution set up to rescaling —
 * i.e. their differences are nonzero scalar multiples. See the file header.
 */
export function equationsEquivalent(
  a: Equation,
  b: Equation,
  declaredVars: string[] = [],
): boolean {
  const da = difference(a);
  const db = difference(b);
  const vars = [
    ...new Set([...declaredVars, ...freeVars(da), ...freeVars(db)]),
  ];
  const rand = mulberry32(0x9e3779b9);

  const points: { va: number; vb: number }[] = [];
  for (let i = 0; i < TRIALS; i++) {
    const bindings = sampleBindings(vars, rand);
    const va = evaluate(da, bindings);
    const vb = evaluate(db, bindings);
    if (finite(va) && finite(vb)) points.push({ va, vb });
  }
  if (vars.length > 0 && points.length < MIN_VALID_POINTS) return false;
  if (points.length === 0) return false;

  // Establish the scale c from the first point where db is meaningfully nonzero.
  let c: number | null = null;
  for (const { va, vb } of points) {
    if (Math.abs(vb) > 1e-6) {
      c = va / vb;
      break;
    }
  }

  if (c === null) {
    // db ≡ 0 (equation b is degenerate, e.g. "x = x"); equivalent only if
    // da ≡ 0 as well.
    return points.every((p) => close(p.va, 0));
  }
  if (!finite(c) || Math.abs(c) < 1e-9) return false; // c must be nonzero

  return points.every((p) => close(p.va, c! * p.vb));
}
