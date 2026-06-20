import type { Problem, ProblemGenerator } from "./types";

function gcd(a: number, b: number): number {
  while (b) [a, b] = [b, a % b];
  return a || 1;
}

/** Integer in [lo, hi] drawn from the seeded stream. */
function pick(rng: () => number, lo: number, hi: number): number {
  return lo + Math.floor(rng() * (hi - lo + 1));
}

// "Nice" percents per level, plus the question forms allowed and the largest
// whole used. Higher levels add trickier percents and the reversed questions.
function config(level: number): { ps: number[]; forms: ("A" | "B" | "C")[]; maxW: number } {
  if (level <= 1) return { ps: [10, 20, 25, 50], forms: ["A"], maxW: 100 };
  if (level === 2) return { ps: [10, 20, 25, 40, 50, 75], forms: ["A", "B"], maxW: 200 };
  return { ps: [5, 10, 15, 20, 25, 30, 40, 50, 60, 75, 80], forms: ["A", "B", "C"], maxW: 400 };
}

/**
 * Percent problems framed as the proportion part/whole = p/100. Builds a percent
 * p and a whole W so the part p·W/100 is a whole number, then asks for the part
 * ("what is p% of W"), the percent ("part is what percent of W"), or the whole
 * ("p% of what number is part"). Every answer is a whole number; emits a
 * `numeric` question graded with tolerance 0. Pure and seeded.
 */
export const percents: ProblemGenerator = (level, rng): Problem => {
  const { ps, forms, maxW } = config(level);
  const p = ps[pick(rng, 0, ps.length - 1)];
  const unit = 100 / gcd(p, 100); // W must be a multiple of this for a whole part
  const kMax = Math.max(2, Math.floor(maxW / unit));
  const whole = unit * pick(rng, 2, kMax);
  const part = (p * whole) / 100;
  const form = forms[pick(rng, 0, forms.length - 1)];

  if (form === "B") {
    return {
      id: `percents:B-${p}-${whole}`,
      type: "numeric",
      prompt: `${part} is what percent of ${whole}?`,
      answer: p,
      tolerance: 0,
      unit: "%",
      hints: [
        "Percent = part ÷ whole, then ×100.",
        `${part} ÷ ${whole} = ${part / whole}, and ×100 gives the percent.`,
      ],
      explanation: `${part}/${whole} = ${p}/100, so ${part} is ${p}% of ${whole}.`,
    };
  }

  if (form === "C") {
    return {
      id: `percents:C-${p}-${whole}`,
      type: "numeric",
      prompt: `${p}% of what number is ${part}?`,
      answer: whole,
      tolerance: 0,
      hints: [
        "Set up part/whole = p/100 and solve for the whole.",
        `${part} is ${p} per 100, so the whole is ${part} ÷ ${p / 100}.`,
      ],
      explanation: `${p}% of ${whole} is ${part}, because ${part}/${whole} = ${p}/100.`,
    };
  }

  return {
    id: `percents:A-${p}-${whole}`,
    type: "numeric",
    prompt: `What is ${p}% of ${whole}?`,
    answer: part,
    tolerance: 0,
    hints: [
      `${p}% means ${p} per 100 — multiply by ${p}/100.`,
      `${p}/100 of ${whole} = ${p} × ${whole} ÷ 100.`,
    ],
    explanation: `${p}% of ${whole} = (${p}/100) × ${whole} = ${part}.`,
  };
};
