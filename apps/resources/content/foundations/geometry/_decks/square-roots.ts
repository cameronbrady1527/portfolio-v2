// Authored mastery deck for the "Square Roots" skill.
//
// Regents/Honors-LEVEL items — exact roots of perfect squares, estimating a
// non-perfect root between consecutive integers (a recurring Regents form), and
// a Pythagorean application. Answers are `numeric`. They are the "Prove it" gate
// on the Skill Card.
//
// HONESTY NOTE: this worktree has no Regents PDFs, so every item is tagged
// `source: "authored"`. Do NOT fabricate exam citations.
//
// Every stated answer is verified by hand AND asserted grade()-correct in
// decks.test.ts (the math mandate). Edit answers only alongside that test.

import type { DeckItem } from "@/lib/foundations/decks";

const deck: DeckItem[] = [
  {
    id: "sr-perfect-49",
    type: "numeric",
    prompt: "√49 = ?",
    answer: 7, // 7² = 49
    tolerance: 0,
    hints: ["What number times itself is 49?", "7 × 7 = 49."],
    explanation: "√49 = 7, because 7² = 49.",
    difficulty: "core",
    source: "authored",
  },
  {
    id: "sr-perfect-64",
    type: "numeric",
    prompt: "√64 = ?",
    answer: 8, // 8²
    tolerance: 0,
    hints: ["8 × 8 = 64."],
    explanation: "√64 = 8.",
    difficulty: "core",
    source: "authored",
  },
  {
    id: "sr-perfect-100",
    type: "numeric",
    prompt: "√100 = ?",
    answer: 10, // 10²
    tolerance: 0,
    hints: ["10 × 10 = 100."],
    explanation: "√100 = 10.",
    difficulty: "core",
    source: "authored",
  },
  {
    id: "sr-perfect-36",
    type: "numeric",
    prompt: "√36 = ?",
    answer: 6, // 6²
    tolerance: 0,
    hints: ["6 × 6 = 36."],
    explanation: "√36 = 6.",
    difficulty: "core",
    source: "authored",
  },
  {
    id: "sr-perfect-144",
    type: "numeric",
    prompt: "√144 = ?",
    answer: 12, // 12²
    tolerance: 0,
    hints: ["12 × 12 = 144."],
    explanation: "√144 = 12.",
    difficulty: "core",
    source: "authored",
  },
  {
    id: "sr-perfect-225",
    type: "numeric",
    prompt: "√225 = ?",
    answer: 15, // 15²
    tolerance: 0,
    hints: ["15 × 15 = 225."],
    explanation: "√225 = 15.",
    difficulty: "stretch",
    source: "authored",
  },
  {
    id: "sr-estimate-20",
    type: "numeric",
    prompt: "√20 lies between which two consecutive whole numbers? Enter the smaller one.",
    answer: 4, // 16 < 20 < 25
    tolerance: 0,
    hints: ["Nearest perfect squares: 16 and 25.", "4² = 16 < 20 < 25 = 5²."],
    explanation: "16 < 20 < 25, so √20 is between 4 and 5; the smaller is 4.",
    difficulty: "core",
    source: "authored",
  },
  {
    id: "sr-estimate-30",
    type: "numeric",
    prompt: "√30 lies between which two consecutive whole numbers? Enter the smaller one.",
    answer: 5, // 25 < 30 < 36
    tolerance: 0,
    hints: ["Nearest perfect squares: 25 and 36.", "5² = 25 < 30 < 36 = 6²."],
    explanation: "25 < 30 < 36, so √30 is between 5 and 6; the smaller is 5.",
    difficulty: "stretch",
    source: "authored",
  },
  {
    id: "sr-estimate-50",
    type: "numeric",
    prompt: "√50 lies between which two consecutive whole numbers? Enter the smaller one.",
    answer: 7, // 49 < 50 < 64
    tolerance: 0,
    hints: ["Nearest perfect squares: 49 and 64.", "7² = 49 < 50 < 64 = 8²."],
    explanation: "49 < 50 < 64, so √50 is between 7 and 8; the smaller is 7.",
    difficulty: "stretch",
    source: "authored",
  },
  {
    id: "sr-estimate-90",
    type: "numeric",
    prompt: "√90 lies between which two consecutive whole numbers? Enter the smaller one.",
    answer: 9, // 81 < 90 < 100
    tolerance: 0,
    hints: ["Nearest perfect squares: 81 and 100.", "9² = 81 < 90 < 100 = 10²."],
    explanation: "81 < 90 < 100, so √90 is between 9 and 10; the smaller is 9.",
    difficulty: "stretch",
    source: "authored",
  },
  {
    id: "sr-pythagorean",
    type: "numeric",
    prompt:
      "A right triangle has legs 6 and 8. The hypotenuse is √(6² + 8²). What is the hypotenuse?",
    answer: 10, // √(36+64) = √100 = 10
    tolerance: 0,
    hints: ["6² + 8² = 36 + 64 = 100.", "√100 = 10."],
    explanation: "√(36 + 64) = √100 = 10.",
    difficulty: "stretch",
    source: "authored",
  },
  {
    id: "sr-perfect-81",
    type: "numeric",
    prompt: "√81 = ?",
    answer: 9, // 9²
    tolerance: 0,
    hints: ["9 × 9 = 81."],
    explanation: "√81 = 9.",
    difficulty: "core",
    source: "authored",
  },
];

export default deck;
