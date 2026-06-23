// Authored mastery deck for the "Powers & Exponents" skill.
//
// Regents/Honors-LEVEL items — evaluating squares and cubes, negative bases
// (even vs odd exponents), powers of ten, and larger powers, plus the classic
// "2⁴ is not 2×4" misconception as multiple choice. Answers are `numeric`. They
// are the "Prove it" gate on the Skill Card.
//
// HONESTY NOTE: this worktree has no Regents PDFs, so every item is tagged
// `source: "authored"`. Do NOT fabricate exam citations.
//
// Every stated answer is verified by hand AND asserted grade()-correct in
// decks.test.ts (the math mandate). Edit answers only alongside that test.

import type { DeckItem } from "@/lib/foundations/decks";

const deck: DeckItem[] = [
  {
    id: "pe-square-6",
    type: "numeric",
    prompt: "Evaluate 6².",
    answer: 36, // 6 × 6
    tolerance: 0,
    hints: ["6 × 6.", "= 36."],
    explanation: "6² = 6 × 6 = 36.",
    difficulty: "core",
    source: "authored",
  },
  {
    id: "pe-cube-4",
    type: "numeric",
    prompt: "Evaluate 4³.",
    answer: 64, // 4 × 4 × 4
    tolerance: 0,
    hints: ["4 × 4 × 4.", "16 × 4 = 64."],
    explanation: "4³ = 4 × 4 × 4 = 64.",
    difficulty: "core",
    source: "authored",
  },
  {
    id: "pe-square-12",
    type: "numeric",
    prompt: "Evaluate 12².",
    answer: 144, // 12 × 12
    tolerance: 0,
    hints: ["12 × 12.", "= 144."],
    explanation: "12² = 144.",
    difficulty: "core",
    source: "authored",
  },
  {
    id: "pe-cube-3",
    type: "numeric",
    prompt: "Evaluate 3⁴.",
    answer: 81, // 3×3×3×3
    tolerance: 0,
    hints: ["3 × 3 × 3 × 3.", "9 × 9 = 81."],
    explanation: "3⁴ = 81.",
    difficulty: "core",
    source: "authored",
  },
  {
    id: "pe-base2-5",
    type: "numeric",
    prompt: "Evaluate 2⁵.",
    answer: 32, // 2×2×2×2×2
    tolerance: 0,
    hints: ["Double five times: 2, 4, 8, 16, 32.", "2⁵ = 32."],
    explanation: "2⁵ = 32.",
    difficulty: "core",
    source: "authored",
  },
  {
    id: "pe-power-of-ten",
    type: "numeric",
    prompt: "Evaluate 10³.",
    answer: 1000, // 10 × 10 × 10
    tolerance: 0,
    hints: ["A power of ten is 1 followed by that many zeros.", "10³ = 1000."],
    explanation: "10³ = 1000 (three zeros).",
    difficulty: "core",
    source: "authored",
  },
  {
    id: "pe-neg-even",
    type: "numeric",
    prompt: "Evaluate (−3)².",
    answer: 9, // (-3)(-3)
    tolerance: 0,
    hints: ["(−3) × (−3).", "A negative times a negative is positive: 9."],
    explanation: "(−3)² = (−3)(−3) = 9 (even power → positive).",
    difficulty: "core",
    source: "authored",
  },
  {
    id: "pe-neg-odd",
    type: "numeric",
    prompt: "Evaluate (−2)³.",
    answer: -8, // (-2)(-2)(-2)
    tolerance: 0,
    hints: ["(−2)(−2)(−2).", "Odd power of a negative stays negative: −8."],
    explanation: "(−2)³ = −8 (odd power → negative).",
    difficulty: "stretch",
    source: "authored",
  },
  {
    id: "pe-neg-even-4",
    type: "numeric",
    prompt: "Evaluate (−2)⁴.",
    answer: 16, // 2^4 = 16, even power positive
    tolerance: 0,
    hints: ["Four factors of −2.", "Even number of negatives → positive: 16."],
    explanation: "(−2)⁴ = 16.",
    difficulty: "stretch",
    source: "authored",
  },
  {
    id: "pe-cube-neg-4",
    type: "numeric",
    prompt: "Evaluate (−4)³.",
    answer: -64, // (-4)(-4)(-4)
    tolerance: 0,
    hints: ["(−4)(−4)(−4).", "Odd power → negative: −64."],
    explanation: "(−4)³ = −64.",
    difficulty: "stretch",
    source: "authored",
  },
  {
    id: "pe-base5-4",
    type: "numeric",
    prompt: "Evaluate 5⁴.",
    answer: 625, // 25 × 25
    tolerance: 0,
    hints: ["5² = 25, then 25².", "25 × 25 = 625."],
    explanation: "5⁴ = 25 × 25 = 625.",
    difficulty: "stretch",
    source: "authored",
  },
  {
    id: "pe-meaning-mc",
    type: "mc",
    prompt: "Which is equal to 2⁴?",
    choices: ["16", "8", "12", "6"],
    answer: 0, // 2×2×2×2 = 16
    hints: ["An exponent is repeated multiplication, not multiplication by the exponent.", "2 × 2 × 2 × 2."],
    explanation: "2⁴ = 2 × 2 × 2 × 2 = 16 (not 2 × 4 = 8).",
    difficulty: "core",
    source: "authored",
  },
];

export default deck;
