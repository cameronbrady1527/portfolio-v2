// Authored mastery deck for the "Simplifying Expressions" skill.
//
// Regents/Honors-LEVEL items — combining like terms and the distributive
// property. To grade rigorously (the expression engine would accept an
// UN-simplified equivalent), items ask for a SPECIFIC number — the coefficient
// of x or the constant term — or use multiple choice. They are the "Prove it"
// gate on the Skill Card.
//
// HONESTY NOTE: this worktree has no Regents PDFs, so every item is tagged
// `source: "authored"`. Do NOT fabricate exam citations.
//
// Every stated answer is verified by hand AND asserted grade()-correct in
// decks.test.ts (the math mandate). Edit answers only alongside that test.

import type { DeckItem } from "@/lib/foundations/decks";

const deck: DeckItem[] = [
  {
    id: "se-combine-coeff",
    type: "numeric",
    prompt: "Simplify 3x + 5 + 2x. What is the coefficient of x?",
    answer: 5, // 3x + 2x = 5x
    tolerance: 0,
    hints: ["Add only the x-terms.", "3x + 2x = 5x."],
    explanation: "3x + 5 + 2x = 5x + 5; the coefficient of x is 5.",
    difficulty: "core",
    source: "authored",
  },
  {
    id: "se-combine-const",
    type: "numeric",
    prompt: "Simplify 4x + 7 + x - 3. What is the constant term?",
    answer: 4, // 7 - 3
    tolerance: 0,
    hints: ["Combine the plain numbers.", "7 - 3 = 4."],
    explanation: "4x + 7 + x - 3 = 5x + 4; the constant term is 4.",
    difficulty: "core",
    source: "authored",
  },
  {
    id: "se-combine-coeff2",
    type: "numeric",
    prompt: "Simplify 7x - 2x + 9. What is the coefficient of x?",
    answer: 5, // 7x - 2x = 5x
    tolerance: 0,
    hints: ["7x - 2x.", "= 5x."],
    explanation: "7x - 2x + 9 = 5x + 9; the coefficient of x is 5.",
    difficulty: "core",
    source: "authored",
  },
  {
    id: "se-combine-coeff-negative",
    type: "numeric",
    prompt: "Simplify 5x - 8x + 2. What is the coefficient of x?",
    answer: -3, // 5x - 8x = -3x
    tolerance: 0,
    hints: ["5x - 8x.", "= -3x."],
    explanation: "5x - 8x + 2 = -3x + 2; the coefficient of x is -3.",
    difficulty: "stretch",
    source: "authored",
  },
  {
    id: "se-const-combine",
    type: "numeric",
    prompt: "Simplify 6 + 2x + 3 + x. What is the constant term?",
    answer: 9, // 6 + 3
    tolerance: 0,
    hints: ["Add the plain numbers: 6 + 3.", "= 9."],
    explanation: "6 + 2x + 3 + x = 3x + 9; the constant term is 9.",
    difficulty: "core",
    source: "authored",
  },
  {
    id: "se-distribute-coeff",
    type: "numeric",
    prompt: "Expand 3(2x + 4). What is the coefficient of x?",
    answer: 6, // 3 × 2x
    tolerance: 0,
    hints: ["Multiply the 3 by the 2x term.", "3 × 2 = 6."],
    explanation: "3(2x + 4) = 6x + 12; the coefficient of x is 6.",
    difficulty: "core",
    source: "authored",
  },
  {
    id: "se-distribute-const",
    type: "numeric",
    prompt: "Expand 5(x + 3). What is the constant term?",
    answer: 15, // 5 × 3
    tolerance: 0,
    hints: ["Multiply the 5 by the 3.", "5 × 3 = 15."],
    explanation: "5(x + 3) = 5x + 15; the constant term is 15.",
    difficulty: "core",
    source: "authored",
  },
  {
    id: "se-distribute-const-negative",
    type: "numeric",
    prompt: "Expand 4(x - 2). What is the constant term?",
    answer: -8, // 4 × (-2)
    tolerance: 0,
    hints: ["The 4 multiplies the -2.", "4 × (-2) = -8."],
    explanation: "4(x - 2) = 4x - 8; the constant term is -8.",
    difficulty: "stretch",
    source: "authored",
  },
  {
    id: "se-distribute-coeff2",
    type: "numeric",
    prompt: "Expand 6(3x - 1). What is the coefficient of x?",
    answer: 18, // 6 × 3
    tolerance: 0,
    hints: ["6 multiplies the 3x.", "6 × 3 = 18."],
    explanation: "6(3x - 1) = 18x - 6; the coefficient of x is 18.",
    difficulty: "stretch",
    source: "authored",
  },
  {
    id: "se-distribute-combine-coeff",
    type: "numeric",
    prompt: "Simplify 2(x + 3) + 4x. What is the coefficient of x?",
    answer: 6, // 2x + 4x
    tolerance: 0,
    hints: ["Distribute first: 2(x + 3) = 2x + 6.", "2x + 4x = 6x."],
    explanation: "2(x + 3) + 4x = 2x + 6 + 4x = 6x + 6; the coefficient of x is 6.",
    difficulty: "stretch",
    source: "authored",
  },
  {
    id: "se-distribute-combine-const",
    type: "numeric",
    prompt: "Simplify 3(x + 2) + 5. What is the constant term?",
    answer: 11, // 6 + 5
    tolerance: 0,
    hints: ["Distribute: 3(x + 2) = 3x + 6.", "6 + 5 = 11."],
    explanation: "3(x + 2) + 5 = 3x + 6 + 5 = 3x + 11; the constant term is 11.",
    difficulty: "stretch",
    source: "authored",
  },
  {
    id: "se-distribute-mc",
    type: "mc",
    prompt: "Which expression is equivalent to 2(x + 5)?",
    choices: ["2x + 10", "2x + 5", "x + 10", "2x + 7"],
    answer: 0, // 2x + 10
    hints: ["Distribute the 2 to BOTH terms inside.", "2·x and 2·5."],
    explanation: "2(x + 5) = 2x + 10 — the 2 multiplies both the x and the 5.",
    difficulty: "core",
    source: "authored",
  },
];

export default deck;
