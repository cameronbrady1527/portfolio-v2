// Authored mastery deck for the "Equivalent Fractions" skill.
//
// Regents/Honors-LEVEL items — fill-in-the-blank equivalence (find the missing
// numerator or denominator), simplifying to lowest terms (asked as a specific
// number so grading is exact), recognizing equivalents, and rewriting over a
// common denominator to compare. They are the "Prove it" gate on the Skill Card.
//
// HONESTY NOTE: this worktree has no Regents PDFs, so every item is tagged
// `source: "authored"`. Genuinely exam-sourced items (tagged
// `regents-<exam>-q<n>`) can be appended later by someone working from the
// official PDFs — do NOT fabricate citations.
//
// Every stated answer is verified by hand AND asserted grade()-correct in
// decks.test.ts (the math mandate). Edit answers only alongside that test.

import type { DeckItem } from "@/lib/foundations/decks";

const deck: DeckItem[] = [
  {
    id: "ef-fill-denom-half",
    type: "numeric",
    prompt: "Find the missing number:  1/2 = 5/?",
    answer: 10, // 1/2 = 5/10 (×5 top and bottom)
    tolerance: 0,
    hints: ["The top went from 1 to 5 — that's ×5.", "Do the same to the bottom: 2 × 5 = 10."],
    explanation: "1/2 = 5/10: multiply the top and bottom by 5.",
    difficulty: "core",
    source: "authored",
  },
  {
    id: "ef-fill-num-thirds",
    type: "numeric",
    prompt: "Find the missing number:  2/3 = ?/12",
    answer: 8, // 2/3 = 8/12 (×4)
    tolerance: 0,
    hints: ["The bottom went from 3 to 12 — that's ×4.", "Do the same to the top: 2 × 4 = 8."],
    explanation: "2/3 = 8/12: multiply the top and bottom by 4.",
    difficulty: "core",
    source: "authored",
  },
  {
    id: "ef-fill-num-quarters",
    type: "numeric",
    prompt: "Find the missing number:  3/4 = ?/20",
    answer: 15, // 3/4 = 15/20 (×5)
    tolerance: 0,
    hints: ["4 × 5 = 20, so the factor is 5.", "3 × 5 = 15."],
    explanation: "3/4 = 15/20: multiply the top and bottom by 5.",
    difficulty: "core",
    source: "authored",
  },
  {
    id: "ef-fill-denom-fifths",
    type: "numeric",
    prompt: "Find the missing number:  4/5 = 16/?",
    answer: 20, // 4/5 = 16/20 (×4)
    tolerance: 0,
    hints: ["The top went from 4 to 16 — that's ×4.", "5 × 4 = 20."],
    explanation: "4/5 = 16/20: multiply the top and bottom by 4.",
    difficulty: "core",
    source: "authored",
  },
  {
    id: "ef-fill-num-sixths",
    type: "numeric",
    prompt: "Find the missing number:  5/6 = ?/18",
    answer: 15, // 5/6 = 15/18 (×3)
    tolerance: 0,
    hints: ["6 × 3 = 18, so the factor is 3.", "5 × 3 = 15."],
    explanation: "5/6 = 15/18: multiply the top and bottom by 3.",
    difficulty: "core",
    source: "authored",
  },
  {
    id: "ef-fill-denom-eighths",
    type: "numeric",
    prompt: "Find the missing number:  3/8 = 9/?",
    answer: 24, // 3/8 = 9/24 (×3)
    tolerance: 0,
    hints: ["The top went from 3 to 9 — that's ×3.", "8 × 3 = 24."],
    explanation: "3/8 = 9/24: multiply the top and bottom by 3.",
    difficulty: "stretch",
    source: "authored",
  },
  {
    id: "ef-which-equiv-mc",
    type: "mc",
    prompt: "Which fraction is equivalent to 2/5?",
    choices: ["4/10", "3/8", "5/2", "2/10"],
    answer: 0, // 2/5 = 4/10
    hints: ["Scale 2/5 by the same factor on top and bottom.", "2/5 × (2/2) = 4/10."],
    explanation: "2/5 = 4/10 (×2). The others are not equal: 2/10 = 1/5, and 5/2 is its reciprocal.",
    difficulty: "core",
    source: "authored",
  },
  {
    id: "ef-which-half-mc",
    type: "mc",
    prompt: "Which of these equals 1/2?",
    choices: ["3/6", "2/5", "4/9", "5/12"],
    answer: 0, // 3/6 = 1/2
    hints: ["A fraction equals 1/2 when the bottom is double the top.", "3 × 2 = 6."],
    explanation: "3/6 = 1/2 because 6 is double 3. None of the others have the bottom equal to twice the top.",
    difficulty: "core",
    source: "authored",
  },
  {
    id: "ef-simplify-num-8-12",
    type: "numeric",
    prompt: "Write 8/12 in lowest terms. What is its numerator?",
    answer: 2, // 8/12 = 2/3 (÷4)
    tolerance: 0,
    hints: ["The greatest common factor of 8 and 12 is 4.", "8 ÷ 4 = 2 and 12 ÷ 4 = 3, so 8/12 = 2/3."],
    explanation: "8/12 = 2/3 (divide top and bottom by 4); the numerator is 2.",
    difficulty: "stretch",
    source: "authored",
  },
  {
    id: "ef-simplify-den-9-15",
    type: "numeric",
    prompt: "Write 9/15 in lowest terms. What is its denominator?",
    answer: 5, // 9/15 = 3/5 (÷3)
    tolerance: 0,
    hints: ["The greatest common factor of 9 and 15 is 3.", "9 ÷ 3 = 3 and 15 ÷ 3 = 5, so 9/15 = 3/5."],
    explanation: "9/15 = 3/5 (divide top and bottom by 3); the denominator is 5.",
    difficulty: "stretch",
    source: "authored",
  },
  {
    id: "ef-simplify-applied",
    type: "numeric",
    prompt:
      "18 of 24 seats are filled. Written in lowest terms, what is the numerator of the fraction of filled seats?",
    answer: 3, // 18/24 = 3/4 (÷6)
    tolerance: 0,
    hints: ["Filled = 18/24. The greatest common factor of 18 and 24 is 6.", "18 ÷ 6 = 3 and 24 ÷ 6 = 4, so 18/24 = 3/4."],
    explanation: "18/24 = 3/4 (divide top and bottom by 6); the numerator is 3.",
    difficulty: "stretch",
    source: "authored",
  },
  {
    id: "ef-common-denominator",
    type: "numeric",
    prompt:
      "To compare 2/3 and 3/4, rewrite both with denominator 12. What is the numerator of 2/3?",
    answer: 8, // 2/3 = 8/12
    tolerance: 0,
    hints: ["3 × 4 = 12, so scale 2/3 by 4.", "2 × 4 = 8, giving 8/12."],
    explanation: "2/3 = 8/12 (×4). (For comparison, 3/4 = 9/12, so 3/4 is larger.)",
    difficulty: "stretch",
    source: "authored",
  },
];

export default deck;
