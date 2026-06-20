import type { Problem, ProblemGenerator } from "./types";

/** Integer in [lo, hi] drawn from the seeded stream. */
function pick(rng: () => number, lo: number, hi: number): number {
  return lo + Math.floor(rng() * (hi - lo + 1));
}

/**
 * Midpoint of a segment. The midpoint is chosen first and the endpoints placed
 * symmetrically around it, so the midpoint coordinates are always whole numbers.
 * Asks for one coordinate of the midpoint (the average of that coordinate on the
 * two endpoints). Emits a `numeric` question graded with tolerance 0. Pure and
 * seeded.
 */
export const midpoint: ProblemGenerator = (level, rng): Problem => {
  const mag = level <= 1 ? 4 : level === 2 ? 6 : 9;
  const mx = pick(rng, -mag, mag);
  const my = pick(rng, -mag, mag);
  const dx = pick(rng, 1, mag);
  const dy = pick(rng, 1, mag);

  const x1 = mx - dx;
  const y1 = my - dy;
  const x2 = mx + dx;
  const y2 = my + dy;

  const askX = rng() < 0.5;
  const axis = askX ? "x" : "y";
  const answer = askX ? mx : my;
  const c1 = askX ? x1 : y1;
  const c2 = askX ? x2 : y2;

  return {
    id: `midpoint:${axis}-${x1}.${y1}-${x2}.${y2}`,
    type: "numeric",
    prompt: `What is the ${axis}-coordinate of the midpoint of (${x1}, ${y1}) and (${x2}, ${y2})?`,
    answer,
    tolerance: 0,
    hints: [
      `The midpoint coordinate is the average of the two ${axis}-values.`,
      `(${c1} + ${c2}) ÷ 2 = ${answer}.`,
    ],
    explanation: `The ${axis}-coordinate of the midpoint is (${c1} + ${c2}) ÷ 2 = ${answer}.`,
  };
};
