// Authored mastery deck for the "Substituting into a Formula" skill.
//
// Regents/Honors-LEVEL items — the exam spine: plug values into an expression or
// a real formula and evaluate. Linear and two-variable expressions (with
// negatives), squares, and the geometry/science formulas that recur (area,
// perimeter, triangle area, Pythagorean, distance, temperature). Answers are
// `numeric`. They are the "Prove it" gate on the Skill Card.
//
// HONESTY NOTE: this worktree has no Regents PDFs, so every item is tagged
// `source: "authored"`. Do NOT fabricate exam citations.
//
// Every stated answer is verified by hand AND asserted grade()-correct in
// decks.test.ts (the math mandate). Edit answers only alongside that test.

import type { DeckItem } from "@/lib/foundations/decks";

const deck: DeckItem[] = [
  {
    id: "sf-linear",
    type: "numeric",
    prompt: "Evaluate 3x + 2 when x = 5.",
    answer: 17, // 15 + 2
    tolerance: 0,
    hints: ["Replace x with 5: 3(5) + 2.", "15 + 2 = 17."],
    explanation: "3(5) + 2 = 15 + 2 = 17.",
    difficulty: "core",
    source: "authored",
  },
  {
    id: "sf-linear-negative",
    type: "numeric",
    prompt: "Evaluate 4x - 1 when x = -3.",
    answer: -13, // 4(-3) - 1 = -12 - 1
    tolerance: 0,
    hints: ["Keep the negative in parentheses: 4(-3) - 1.", "-12 - 1 = -13."],
    explanation: "4(-3) - 1 = -12 - 1 = -13.",
    difficulty: "core",
    source: "authored",
  },
  {
    id: "sf-two-variable",
    type: "numeric",
    prompt: "Evaluate 2x + 3y when x = 4 and y = -2.",
    answer: 2, // 8 + (-6)
    tolerance: 0,
    hints: ["2(4) + 3(-2).", "8 + (-6) = 2."],
    explanation: "2(4) + 3(-2) = 8 - 6 = 2.",
    difficulty: "core",
    source: "authored",
  },
  {
    id: "sf-two-variable-negative",
    type: "numeric",
    prompt: "Evaluate 5x - 2y when x = -1 and y = 4.",
    answer: -13, // -5 - 8
    tolerance: 0,
    hints: ["5(-1) - 2(4).", "-5 - 8 = -13."],
    explanation: "5(-1) - 2(4) = -5 - 8 = -13.",
    difficulty: "stretch",
    source: "authored",
  },
  {
    id: "sf-square",
    type: "numeric",
    prompt: "Evaluate x² + 1 when x = -5.",
    answer: 26, // 25 + 1
    tolerance: 0,
    hints: ["(-5)² = 25 (a negative squared is positive).", "25 + 1 = 26."],
    explanation: "(-5)² + 1 = 25 + 1 = 26.",
    difficulty: "stretch",
    source: "authored",
  },
  {
    id: "sf-area-rectangle",
    type: "numeric",
    prompt: "Use A = lw to find the area of a rectangle with length 8 and width 5.",
    answer: 40, // 8 × 5
    tolerance: 0,
    hints: ["A = l × w.", "8 × 5 = 40."],
    explanation: "A = lw = 8 × 5 = 40.",
    difficulty: "core",
    source: "authored",
  },
  {
    id: "sf-perimeter-rectangle",
    type: "numeric",
    prompt: "Use P = 2(l + w) to find the perimeter of a rectangle with l = 7 and w = 3.",
    answer: 20, // 2 × 10
    tolerance: 0,
    hints: ["Inside the parentheses first: 7 + 3 = 10.", "2 × 10 = 20."],
    explanation: "P = 2(7 + 3) = 2 × 10 = 20.",
    difficulty: "core",
    source: "authored",
  },
  {
    id: "sf-triangle-area",
    type: "numeric",
    prompt: "Use A = ½bh to find the area of a triangle with base b = 6 and height h = 9.",
    answer: 27, // ½ × 54
    tolerance: 0,
    hints: ["Multiply the base and height first: 6 × 9 = 54.", "Half of 54 is 27."],
    explanation: "A = ½ × 6 × 9 = ½ × 54 = 27.",
    difficulty: "stretch",
    source: "authored",
  },
  {
    id: "sf-pythagorean",
    type: "numeric",
    prompt: "Use c² = a² + b² to find c when a = 3 and b = 4.",
    answer: 5, // c² = 9 + 16 = 25, c = 5
    tolerance: 0,
    hints: ["c² = 3² + 4² = 9 + 16 = 25.", "c = √25 = 5."],
    explanation: "c² = 9 + 16 = 25, so c = 5.",
    difficulty: "stretch",
    source: "authored",
  },
  {
    id: "sf-distance-rate-time",
    type: "numeric",
    prompt: "Use d = rt to find the distance when r = 60 and t = 3.",
    answer: 180, // 60 × 3
    tolerance: 0,
    hints: ["Distance = rate × time.", "60 × 3 = 180."],
    explanation: "d = rt = 60 × 3 = 180.",
    difficulty: "core",
    source: "authored",
  },
  {
    id: "sf-temperature",
    type: "numeric",
    prompt: "Use F = (9/5)C + 32 to convert C = 20 to degrees Fahrenheit.",
    answer: 68, // (9/5)(20) + 32 = 36 + 32
    tolerance: 0,
    hints: ["(9/5) × 20 = 36.", "36 + 32 = 68."],
    explanation: "F = (9/5)(20) + 32 = 36 + 32 = 68.",
    difficulty: "stretch",
    source: "authored",
  },
  {
    id: "sf-area-square",
    type: "numeric",
    prompt: "Use A = s² to find the area of a square with side s = 7.",
    answer: 49, // 7²
    tolerance: 0,
    hints: ["A = s × s.", "7² = 49."],
    explanation: "A = s² = 7² = 49.",
    difficulty: "core",
    source: "authored",
  },
];

export default deck;
