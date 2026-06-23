import type { Problem, ProblemGenerator } from "./types";

// Pythagorean triples (a, b, c) with a² + b² = c² — used so diagonal distances
// come out to whole numbers.
const TRIPLES: [number, number, number][] = [
  [3, 4, 5],
  [6, 8, 10],
  [5, 12, 13],
  [9, 12, 15],
  [8, 15, 17],
  [12, 16, 20],
  [7, 24, 25],
];

/** Integer in [lo, hi] drawn from the seeded stream. */
function pick(rng: () => number, lo: number, hi: number): number {
  return lo + Math.floor(rng() * (hi - lo + 1));
}
const sign = (rng: () => number) => (rng() < 0.5 ? 1 : -1);

/**
 * Distance on the coordinate plane. Level 1 is axis-aligned (distance is a
 * simple difference); levels 2–3 use Pythagorean triples so the diagonal
 * distance is a whole number (the distance formula = the Pythagorean theorem on
 * the grid). Emits a `numeric` question graded with tolerance 0. Pure and seeded.
 */
export const distanceOnPlane: ProblemGenerator = (level, rng): Problem => {
  const x1 = pick(rng, -5, 5);
  const y1 = pick(rng, -5, 5);

  let dx: number;
  let dy: number;
  let answer: number;

  if (level <= 1) {
    // Axis-aligned: one leg is zero.
    const d = pick(rng, 2, 10);
    if (rng() < 0.5) {
      dx = d * sign(rng);
      dy = 0;
    } else {
      dx = 0;
      dy = d * sign(rng);
    }
    answer = d;
  } else {
    const pool = level === 2 ? TRIPLES.slice(0, 3) : TRIPLES;
    const [a, b, c] = pool[pick(rng, 0, pool.length - 1)];
    dx = a * sign(rng);
    dy = b * sign(rng);
    answer = c;
  }

  const x2 = x1 + dx;
  const y2 = y1 + dy;

  return {
    id: `distance-plane:${x1}.${y1}-${x2}.${y2}`,
    type: "numeric",
    prompt: `Find the distance between (${x1}, ${y1}) and (${x2}, ${y2}).`,
    answer,
    tolerance: 0,
    hints: [
      "Find the horizontal change and the vertical change between the points.",
      "Distance = √(Δx² + Δy²) — the Pythagorean theorem with those changes as legs.",
    ],
    explanation: `Δx = ${x2 - x1}, Δy = ${y2 - y1}; distance = √(${(x2 - x1) ** 2} + ${(y2 - y1) ** 2}) = ${answer}.`,
  };
};
