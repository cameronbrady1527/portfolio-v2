/**
 * `what-is-a-proof` — the simplest on-ramp to the two-column form.
 *
 * An ALGEBRAIC proof with NO figure: given a linear equation, prove `x = k`,
 * justified line-by-line by the Properties of Equality. This is where a student
 * first meets the two-column shape — statement on the left, a reason on the
 * right, each step following from the ones above — before any diagram is in
 * play, so the `figure` field is deliberately absent from the spec.
 *
 * Structural variation across seeds keeps it from being memorised:
 *   • the equation (coefficients, constant, integer solution),
 *   • the number of steps (1-step, 2-step, and a distribute-first 3-step),
 *   • which Properties of Equality appear (add / sub / mul / div / distributive).
 *
 * Pure and seeded like every other {@link ProofFamily}: a given seed always
 * reproduces the same proof. Solutions are kept integer so every line is clean.
 */
import type { ProofDistractor, ProofFamily, ProofStatement } from "../proof";

/** Integer in [lo, hi] from the seeded stream. */
function pick(rng: () => number, lo: number, hi: number): number {
  return lo + Math.floor(rng() * (hi - lo + 1));
}
function choose<T>(rng: () => number, xs: readonly T[]): T {
  return xs[Math.floor(rng() * xs.length)];
}

/** The structural forms this family draws from — the variation axis for both the
 *  step count and which properties appear. */
const FORMS = [
  "one-step-div", // a·x = b            → x = k              (Division)
  "one-step-mul", // x / a = b          → x = k              (Multiplication)
  "one-step-sub", // x + b = c          → x = k              (Subtraction)
  "one-step-add", // x - b = c          → x = k              (Addition)
  "two-step-sub", // a·x + b = c        → a·x = … → x = k    (Subtraction, Division)
  "two-step-add", // a·x - b = c        → a·x = … → x = k    (Addition, Division)
  "distribute-add", // a(x + b) = c     → distribute → …     (Distributive, Subtraction, Division)
  "distribute-sub", // a(x - b) = c     → distribute → …     (Distributive, Addition, Division)
] as const;

/** One built form: the DAG (Given → … → goal) plus its Given/Prove header text. */
interface Built {
  givenText: string;
  proveText: string;
  statements: ProofStatement[];
  distractors: ProofDistractor[];
}

/** Build the chosen form's statements + distractors. Every branch re-derives the
 *  solution `k` so the printed equation and the proved value always agree. */
function build(form: (typeof FORMS)[number], rng: () => number): Built {
  // Distractors are only assembled at level >= 3 by the caller; each is a
  // plausible-but-wrong line the proof never makes (a wrong answer, or the
  // classic inverse-operation slip). They carry ids no statement uses, so the
  // grader rejects them as distractors on sight.
  switch (form) {
    case "one-step-div": {
      const a = pick(rng, 2, 9);
      const k = pick(rng, 1, 12);
      const b = a * k; // a·x = b, so x = b/a = k
      return {
        givenText: `$${a}x = ${b}$`,
        proveText: `$x = ${k}$`,
        statements: [
          { id: "g", text: `${a}x = ${b}`, tex: `$${a}x = ${b}$`, reasons: ["given"], deps: [[]], given: true },
          { id: "s1", text: `x = ${k}`, tex: `$x = ${k}$`, reasons: ["div-eq"], deps: [["g"]], goal: true },
        ],
        distractors: [
          { id: "d1", text: `x = ${b}`, tex: `$x = ${b}$`, reason: "div-eq" }, // forgot to divide
          { id: "d2", text: `x = ${b - a}`, tex: `$x = ${b - a}$`, reason: "sub-eq" }, // subtracted a instead
        ],
      };
    }
    case "one-step-mul": {
      const a = pick(rng, 2, 6);
      const b = pick(rng, 2, 12);
      const k = a * b; // x / a = b, so x = a·b = k
      return {
        givenText: `$\\dfrac{x}{${a}} = ${b}$`,
        proveText: `$x = ${k}$`,
        statements: [
          { id: "g", text: `x/${a} = ${b}`, tex: `$\\dfrac{x}{${a}} = ${b}$`, reasons: ["given"], deps: [[]], given: true },
          { id: "s1", text: `x = ${k}`, tex: `$x = ${k}$`, reasons: ["mul-eq"], deps: [["g"]], goal: true },
        ],
        distractors: [
          { id: "d1", text: `x = ${b}`, tex: `$x = ${b}$`, reason: "mul-eq" }, // forgot to multiply
          { id: "d2", text: `x = ${a + b}`, tex: `$x = ${a + b}$`, reason: "add-eq" }, // added a instead
        ],
      };
    }
    case "one-step-sub": {
      const b = pick(rng, 2, 15);
      const k = pick(rng, 1, 12);
      const c = k + b; // x + b = c, so x = c - b = k
      return {
        givenText: `$x + ${b} = ${c}$`,
        proveText: `$x = ${k}$`,
        statements: [
          { id: "g", text: `x + ${b} = ${c}`, tex: `$x + ${b} = ${c}$`, reasons: ["given"], deps: [[]], given: true },
          { id: "s1", text: `x = ${k}`, tex: `$x = ${k}$`, reasons: ["sub-eq"], deps: [["g"]], goal: true },
        ],
        distractors: [
          { id: "d1", text: `x = ${c + b}`, tex: `$x = ${c + b}$`, reason: "add-eq" }, // added instead of subtracting
          { id: "d2", text: `x = ${c}`, tex: `$x = ${c}$`, reason: "sub-eq" }, // dropped the b entirely
        ],
      };
    }
    case "one-step-add": {
      const b = pick(rng, 2, 15);
      const k = pick(rng, b + 1, b + 12); // keep the solution positive
      const c = k - b; // x - b = c, so x = c + b = k
      return {
        givenText: `$x - ${b} = ${c}$`,
        proveText: `$x = ${k}$`,
        statements: [
          { id: "g", text: `x - ${b} = ${c}`, tex: `$x - ${b} = ${c}$`, reasons: ["given"], deps: [[]], given: true },
          { id: "s1", text: `x = ${k}`, tex: `$x = ${k}$`, reasons: ["add-eq"], deps: [["g"]], goal: true },
        ],
        distractors: [
          { id: "d1", text: `x = ${c - b}`, tex: `$x = ${c - b}$`, reason: "sub-eq" }, // subtracted instead of adding
          { id: "d2", text: `x = ${c}`, tex: `$x = ${c}$`, reason: "add-eq" }, // dropped the b entirely
        ],
      };
    }
    case "two-step-sub": {
      const a = pick(rng, 2, 6);
      const k = pick(rng, 1, 9);
      const b = pick(rng, 1, 12);
      const c = a * k + b; // a·x + b = c → a·x = c - b = a·k → x = k
      return {
        givenText: `$${a}x + ${b} = ${c}$`,
        proveText: `$x = ${k}$`,
        statements: [
          { id: "g", text: `${a}x + ${b} = ${c}`, tex: `$${a}x + ${b} = ${c}$`, reasons: ["given"], deps: [[]], given: true },
          { id: "s1", text: `${a}x = ${a * k}`, tex: `$${a}x = ${a * k}$`, reasons: ["sub-eq"], deps: [["g"]] },
          { id: "s2", text: `x = ${k}`, tex: `$x = ${k}$`, reasons: ["div-eq"], deps: [["s1"]], goal: true },
        ],
        distractors: [
          { id: "d1", text: `${a}x = ${c + b}`, tex: `$${a}x = ${c + b}$`, reason: "add-eq" }, // added b instead of subtracting
          { id: "d2", text: `x = ${a * k - a}`, tex: `$x = ${a * k - a}$`, reason: "sub-eq" }, // subtracted a instead of dividing
        ],
      };
    }
    case "two-step-add": {
      const a = pick(rng, 2, 6);
      const k = pick(rng, 2, 9);
      const b = pick(rng, 1, a * k - 1); // keep c = a·k - b positive
      const c = a * k - b; // a·x - b = c → a·x = c + b = a·k → x = k
      return {
        givenText: `$${a}x - ${b} = ${c}$`,
        proveText: `$x = ${k}$`,
        statements: [
          { id: "g", text: `${a}x - ${b} = ${c}`, tex: `$${a}x - ${b} = ${c}$`, reasons: ["given"], deps: [[]], given: true },
          { id: "s1", text: `${a}x = ${a * k}`, tex: `$${a}x = ${a * k}$`, reasons: ["add-eq"], deps: [["g"]] },
          { id: "s2", text: `x = ${k}`, tex: `$x = ${k}$`, reasons: ["div-eq"], deps: [["s1"]], goal: true },
        ],
        distractors: [
          { id: "d1", text: `${a}x = ${c - b}`, tex: `$${a}x = ${c - b}$`, reason: "sub-eq" }, // subtracted b instead of adding
          { id: "d2", text: `x = ${a * k + a}`, tex: `$x = ${a * k + a}$`, reason: "add-eq" }, // added a instead of dividing
        ],
      };
    }
    case "distribute-add": {
      const a = pick(rng, 2, 5);
      const b = pick(rng, 1, 6);
      const k = pick(rng, 1, 8);
      const c = a * (k + b); // a(x + b) = c → a·x + a·b = c → a·x = a·k → x = k
      return {
        givenText: `$${a}(x + ${b}) = ${c}$`,
        proveText: `$x = ${k}$`,
        statements: [
          { id: "g", text: `${a}(x + ${b}) = ${c}`, tex: `$${a}(x + ${b}) = ${c}$`, reasons: ["given"], deps: [[]], given: true },
          { id: "s1", text: `${a}x + ${a * b} = ${c}`, tex: `$${a}x + ${a * b} = ${c}$`, reasons: ["distrib"], deps: [["g"]] },
          { id: "s2", text: `${a}x = ${a * k}`, tex: `$${a}x = ${a * k}$`, reasons: ["sub-eq"], deps: [["s1"]] },
          { id: "s3", text: `x = ${k}`, tex: `$x = ${k}$`, reasons: ["div-eq"], deps: [["s2"]], goal: true },
        ],
        distractors: [
          { id: "d1", text: `${a}x + ${b} = ${c}`, tex: `$${a}x + ${b} = ${c}$`, reason: "distrib" }, // only distributed to x
          { id: "d2", text: `${a}x = ${c + a * b}`, tex: `$${a}x = ${c + a * b}$`, reason: "add-eq" }, // added instead of subtracting
        ],
      };
    }
    case "distribute-sub": {
      const a = pick(rng, 2, 5);
      const b = pick(rng, 1, 6);
      const k = pick(rng, b + 1, b + 8); // keep c = a(k - b) positive
      const c = a * (k - b); // a(x - b) = c → a·x - a·b = c → a·x = a·k → x = k
      return {
        givenText: `$${a}(x - ${b}) = ${c}$`,
        proveText: `$x = ${k}$`,
        statements: [
          { id: "g", text: `${a}(x - ${b}) = ${c}`, tex: `$${a}(x - ${b}) = ${c}$`, reasons: ["given"], deps: [[]], given: true },
          { id: "s1", text: `${a}x - ${a * b} = ${c}`, tex: `$${a}x - ${a * b} = ${c}$`, reasons: ["distrib"], deps: [["g"]] },
          { id: "s2", text: `${a}x = ${a * k}`, tex: `$${a}x = ${a * k}$`, reasons: ["add-eq"], deps: [["s1"]] },
          { id: "s3", text: `x = ${k}`, tex: `$x = ${k}$`, reasons: ["div-eq"], deps: [["s2"]], goal: true },
        ],
        distractors: [
          { id: "d1", text: `${a}x - ${b} = ${c}`, tex: `$${a}x - ${b} = ${c}$`, reason: "distrib" }, // only distributed to x
          { id: "d2", text: `${a}x = ${c - a * b}`, tex: `$${a}x = ${c - a * b}$`, reason: "sub-eq" }, // subtracted instead of adding
        ],
      };
    }
  }
}

/**
 * Given a linear equation, prove `x = k` — a figureless algebraic two-column
 * proof. Each line is one Property of Equality; the number of lines and which
 * properties appear vary by seed (see {@link FORMS}). Distractors — a wrong
 * answer and the classic inverse-operation slip — appear only once the student
 * is past the guided levels.
 */
export const whatIsAProof: ProofFamily = (level, rng) => {
  const form = choose(rng, FORMS);
  const built = build(form, rng);
  const distractors: ProofDistractor[] = level >= 3 ? built.distractors : [];
  return {
    // No `figure` — this proof is pure algebra, the simplest setting for the form.
    givenText: built.givenText,
    proveText: built.proveText,
    statements: built.statements,
    distractors,
    level,
  };
};
