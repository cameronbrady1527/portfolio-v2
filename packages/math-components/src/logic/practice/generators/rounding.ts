import type { Problem, ProblemGenerator } from "./types";

/** Integer in [lo, hi] drawn from the seeded stream. */
function pick(rng: () => number, lo: number, hi: number): number {
  return lo + Math.floor(rng() * (hi - lo + 1));
}

// Place value by level: nearest ten, then hundred, then thousand.
function placeFor(level: number): { p: number; word: string } {
  if (level <= 1) return { p: 10, word: "ten" };
  if (level === 2) return { p: 100, word: "hundred" };
  return { p: 1000, word: "thousand" };
}

// Real-world "round up" contexts — each carries EXACTLY two numbers (capacity,
// then total) so the situation is unambiguous: you always need a whole extra
// container for the leftover.
const CONTEXTS: ((cap: number, total: number) => string)[] = [
  (cap, total) =>
    `A bus holds ${cap} students. ${total} students are going on a field trip. How many buses are needed?`,
  (cap, total) =>
    `Each van seats ${cap} people. ${total} people need a ride. How many vans are needed?`,
  (cap, total) =>
    `Each box fits ${cap} books. There are ${total} books to pack. How many boxes are needed?`,
  (cap, total) =>
    `Each table seats ${cap} guests. ${total} guests are coming. How many tables are needed?`,
  (cap, total) =>
    `One crate holds ${cap} bottles. ${total} bottles must be shipped. How many crates are needed?`,
];

function placeValueProblem(level: number, rng: () => number): Problem {
  const { p, word } = placeFor(level);
  // mult·p + r keeps numbers in a sensible range per place (≈ up to 50·p):
  // nearest ten → ≲ 500, hundred → ≲ 5000, thousand → ≲ 50000.
  const mult = pick(rng, 2, 49);
  // Remainder drives the rounding; never 0 (already rounded) and never exactly
  // half (an avoidable tie), so the "look at the next digit" rule is unambiguous.
  let r = pick(rng, 1, p - 1);
  if (r === p / 2) r += 1;
  const n = mult * p + r;
  const answer = Math.round(n / p) * p;

  return {
    id: `rounding:round-${n}-${p}`,
    type: "numeric",
    prompt: `Round ${n} to the nearest ${word}.`,
    answer,
    tolerance: 0,
    hints: [
      `Look at the digit just to the right of the ${word} place.`,
      "5 or more rounds up; 4 or less rounds down. The digits after it become 0.",
    ],
    explanation: `${n} rounded to the nearest ${word} is ${answer}.`,
  };
}

function roundUpProblem(rng: () => number): Problem {
  const cap = pick(rng, 4, 12);
  const q = pick(rng, 2, 9);
  const r = pick(rng, 1, cap - 1); // a genuine leftover → one more needed
  const total = cap * q + r;
  const answer = q + 1;
  const context = CONTEXTS[pick(rng, 0, CONTEXTS.length - 1)];

  return {
    id: `rounding:up-${total}-${cap}`,
    type: "numeric",
    prompt: context(cap, total),
    answer,
    tolerance: 0,
    hints: [
      "Divide to see how many full groups you get — then handle the leftover.",
      "Any leftover at all means you need one more, so round the quotient UP.",
    ],
    explanation: `${total} ÷ ${cap} = ${q} with ${r} left over, and the leftover still needs its own — so ${answer} are needed.`,
  };
}

/**
 * Rounding fluency: place-value rounding (nearest ten / hundred / thousand) and
 * the real-world "round up" / ceiling case the Regents leans on (how many
 * buses, boxes, …). Emits a `numeric` question with a whole-number answer, so
 * `grade()` checks it with tolerance 0. Pure and seeded.
 */
export const rounding: ProblemGenerator = (level, rng): Problem => {
  // ~40% real-world ceiling problems, the rest place-value rounding.
  const isRoundUp = rng() < 0.4;
  return isRoundUp ? roundUpProblem(rng) : placeValueProblem(level, rng);
};
