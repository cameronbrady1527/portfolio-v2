// Authored mastery deck for the "Solving Linear Equations" skill.
//
// Regents/Honors-LEVEL items — one-step, two-step, and multi-step equations
// (distribution, variables on both sides), plus the word/geometry settings the
// exam leans on (a number puzzle, a rectangle's width from its perimeter,
// complementary angles). Answers are `numeric` (the value of x). They are the
// "Prove it" gate on the Skill Card.
//
// HONESTY NOTE: this worktree has no Regents PDFs, so every item is tagged
// `source: "authored"`. Do NOT fabricate exam citations.
//
// Every stated answer is verified by hand AND asserted grade()-correct in
// decks.test.ts (the math mandate). Edit answers only alongside that test.

import type { DeckItem } from "@/lib/foundations/decks";

const deck: DeckItem[] = [
  {
    id: "sle-one-step-add",
    type: "numeric",
    prompt: "Solve for x:  x + 7 = 12",
    answer: 5, // subtract 7
    tolerance: 0,
    hints: ["Undo + 7 by subtracting 7 from both sides.", "x = 12 - 7 = 5."],
    explanation: "x + 7 = 12 → x = 5.",
    difficulty: "core",
    source: "authored",
  },
  {
    id: "sle-one-step-sub",
    type: "numeric",
    prompt: "Solve for x:  x - 6 = -2",
    answer: 4, // add 6
    tolerance: 0,
    hints: ["Undo - 6 by adding 6 to both sides.", "x = -2 + 6 = 4."],
    explanation: "x - 6 = -2 → x = 4.",
    difficulty: "core",
    source: "authored",
  },
  {
    id: "sle-one-step-mult",
    type: "numeric",
    prompt: "Solve for x:  4x = 28",
    answer: 7, // divide by 4
    tolerance: 0,
    hints: ["Undo × 4 by dividing both sides by 4.", "x = 28 ÷ 4 = 7."],
    explanation: "4x = 28 → x = 7.",
    difficulty: "core",
    source: "authored",
  },
  {
    id: "sle-two-step",
    type: "numeric",
    prompt: "Solve for x:  3x + 5 = 20",
    answer: 5, // subtract 5, divide 3
    tolerance: 0,
    hints: ["Subtract 5: 3x = 15.", "Divide by 3: x = 5."],
    explanation: "3x + 5 = 20 → 3x = 15 → x = 5.",
    difficulty: "core",
    source: "authored",
  },
  {
    id: "sle-two-step-negative",
    type: "numeric",
    prompt: "Solve for x:  2x - 9 = -3",
    answer: 3, // add 9, divide 2
    tolerance: 0,
    hints: ["Add 9: 2x = 6.", "Divide by 2: x = 3."],
    explanation: "2x - 9 = -3 → 2x = 6 → x = 3.",
    difficulty: "core",
    source: "authored",
  },
  {
    id: "sle-two-step-fraction",
    type: "numeric",
    prompt: "Solve for x:  x/2 + 3 = 8",
    answer: 10, // subtract 3, multiply 2
    tolerance: 0,
    hints: ["Subtract 3: x/2 = 5.", "Multiply by 2: x = 10."],
    explanation: "x/2 + 3 = 8 → x/2 = 5 → x = 10.",
    difficulty: "stretch",
    source: "authored",
  },
  {
    id: "sle-negative-solution",
    type: "numeric",
    prompt: "Solve for x:  3x + 11 = 2",
    answer: -3, // subtract 11, divide 3
    tolerance: 0,
    hints: ["Subtract 11: 3x = -9.", "Divide by 3: x = -3."],
    explanation: "3x + 11 = 2 → 3x = -9 → x = -3.",
    difficulty: "stretch",
    source: "authored",
  },
  {
    id: "sle-distribute",
    type: "numeric",
    prompt: "Solve for x:  2(x + 4) = 18",
    answer: 5, // distribute or divide first
    tolerance: 0,
    hints: ["Divide both sides by 2: x + 4 = 9.", "Subtract 4: x = 5."],
    explanation: "2(x + 4) = 18 → x + 4 = 9 → x = 5.",
    difficulty: "stretch",
    source: "authored",
  },
  {
    id: "sle-both-sides",
    type: "numeric",
    prompt: "Solve for x:  5x + 2 = 3x + 10",
    answer: 4, // 2x = 8
    tolerance: 0,
    hints: ["Subtract 3x from both sides: 2x + 2 = 10.", "2x = 8, so x = 4."],
    explanation: "5x + 2 = 3x + 10 → 2x = 8 → x = 4.",
    difficulty: "stretch",
    source: "authored",
  },
  {
    id: "sle-word-number",
    type: "numeric",
    prompt: "Three more than twice a number is 17. What is the number?",
    answer: 7, // 2n + 3 = 17
    tolerance: 0,
    hints: ["Write it as 2n + 3 = 17.", "2n = 14, so n = 7."],
    explanation: "2n + 3 = 17 → 2n = 14 → n = 7.",
    difficulty: "stretch",
    source: "authored",
  },
  {
    id: "sle-word-perimeter",
    type: "numeric",
    prompt:
      "A rectangle's perimeter is 30 and its length is 9. Using 2(9) + 2w = 30, find the width w.",
    answer: 6, // 18 + 2w = 30
    tolerance: 0,
    hints: ["18 + 2w = 30, so 2w = 12.", "w = 6."],
    explanation: "2(9) + 2w = 30 → 18 + 2w = 30 → 2w = 12 → w = 6.",
    difficulty: "stretch",
    source: "authored",
  },
  {
    id: "sle-word-angles",
    type: "numeric",
    prompt:
      "Two complementary angles measure x and 2x, so x + 2x = 90. Solve for x.",
    answer: 30, // 3x = 90
    tolerance: 0,
    hints: ["x + 2x = 3x.", "3x = 90, so x = 30."],
    explanation: "x + 2x = 90 → 3x = 90 → x = 30.",
    difficulty: "core",
    source: "authored",
  },
];

export default deck;
