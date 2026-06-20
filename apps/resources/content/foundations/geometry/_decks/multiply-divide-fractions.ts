// Authored mastery deck for the "Multiplying & Dividing Fractions" skill.
//
// Regents/Honors-LEVEL items — multiply across, divide by the reciprocal,
// "of" as multiplication, area as a product of fractional sides, and "how many
// scoops fit" as division. Answers are `expression` strings, so grade() accepts
// any equivalent form. They are the "Prove it" gate on the Skill Card.
//
// HONESTY NOTE: this worktree has no Regents PDFs, so every item is tagged
// `source: "authored"`. Do NOT fabricate exam citations.
//
// Every stated answer is verified by hand AND asserted grade()-correct in
// decks.test.ts (the math mandate). Edit answers only alongside that test.

import type { DeckItem } from "@/lib/foundations/decks";

const deck: DeckItem[] = [
  {
    id: "mdf2-mult-basic",
    type: "expression",
    prompt: "1/2 × 1/3 = ?",
    answer: "1/6", // 1·1 / 2·3
    hints: ["Multiply straight across.", "1×1 = 1 over 2×3 = 6."],
    explanation: "1/2 × 1/3 = 1/6.",
    difficulty: "core",
    source: "authored",
  },
  {
    id: "mdf2-mult-simplify",
    type: "expression",
    prompt: "2/3 × 3/4 = ?",
    answer: "1/2", // 6/12 = 1/2
    hints: ["2×3 = 6 over 3×4 = 12.", "6/12 simplifies to 1/2."],
    explanation: "2/3 × 3/4 = 6/12 = 1/2.",
    difficulty: "core",
    source: "authored",
  },
  {
    id: "mdf2-mult-simplify2",
    type: "expression",
    prompt: "2/5 × 5/6 = ?",
    answer: "1/3", // 10/30 = 1/3
    hints: ["2×5 = 10 over 5×6 = 30.", "10/30 simplifies to 1/3."],
    explanation: "2/5 × 5/6 = 10/30 = 1/3.",
    difficulty: "core",
    source: "authored",
  },
  {
    id: "mdf2-div-basic",
    type: "expression",
    prompt: "1/2 ÷ 1/4 = ?",
    answer: "2", // 1/2 × 4/1 = 4/2 = 2
    hints: ["Dividing by 1/4 is multiplying by 4/1.", "1/2 × 4 = 4/2 = 2."],
    explanation: "1/2 ÷ 1/4 = 1/2 × 4/1 = 4/2 = 2.",
    difficulty: "core",
    source: "authored",
  },
  {
    id: "mdf2-div-result",
    type: "expression",
    prompt: "3/4 ÷ 1/2 = ?",
    answer: "3/2", // 3/4 × 2/1 = 6/4 = 3/2
    hints: ["Multiply by the reciprocal 2/1.", "3/4 × 2 = 6/4 = 3/2."],
    explanation: "3/4 ÷ 1/2 = 3/4 × 2/1 = 6/4 = 3/2.",
    difficulty: "core",
    source: "authored",
  },
  {
    id: "mdf2-div-reciprocal",
    type: "expression",
    prompt: "2/3 ÷ 4/5 = ?",
    answer: "5/6", // 2/3 × 5/4 = 10/12 = 5/6
    hints: ["Flip the second fraction: ÷ 4/5 → × 5/4.", "2/3 × 5/4 = 10/12 = 5/6."],
    explanation: "2/3 ÷ 4/5 = 2/3 × 5/4 = 10/12 = 5/6.",
    difficulty: "stretch",
    source: "authored",
  },
  {
    id: "mdf2-mult-small",
    type: "expression",
    prompt: "3/8 × 4/9 = ?",
    answer: "1/6", // 12/72 = 1/6
    hints: ["3×4 = 12 over 8×9 = 72.", "12/72 simplifies to 1/6."],
    explanation: "3/8 × 4/9 = 12/72 = 1/6.",
    difficulty: "stretch",
    source: "authored",
  },
  {
    id: "mdf2-div-whole",
    type: "expression",
    prompt: "5/6 ÷ 5/12 = ?",
    answer: "2", // 5/6 × 12/5 = 60/30 = 2
    hints: ["× the reciprocal 12/5.", "5/6 × 12/5 = 60/30 = 2."],
    explanation: "5/6 ÷ 5/12 = 5/6 × 12/5 = 60/30 = 2.",
    difficulty: "stretch",
    source: "authored",
  },
  {
    id: "mdf2-of-as-times",
    type: "expression",
    prompt: "What is 2/3 of 3/5?",
    answer: "2/5", // 2/3 × 3/5 = 6/15 = 2/5
    hints: ["'of' means multiply.", "2/3 × 3/5 = 6/15 = 2/5."],
    explanation: "2/3 of 3/5 = 2/3 × 3/5 = 6/15 = 2/5.",
    difficulty: "stretch",
    source: "authored",
  },
  {
    id: "mdf2-word-area",
    type: "expression",
    prompt: "A rectangle is 3/4 m wide and 2/3 m tall. What is its area, in square meters?",
    answer: "1/2", // 3/4 × 2/3 = 6/12 = 1/2
    hints: ["Area = width × height.", "3/4 × 2/3 = 6/12 = 1/2."],
    explanation: "Area = 3/4 × 2/3 = 6/12 = 1/2 m².",
    difficulty: "stretch",
    source: "authored",
  },
  {
    id: "mdf2-word-scoops",
    type: "expression",
    prompt: "How many 1/4-cup scoops are in 3/2 cups of flour?",
    answer: "6", // 3/2 ÷ 1/4 = 3/2 × 4 = 12/2 = 6
    hints: ["This is 3/2 ÷ 1/4.", "3/2 × 4 = 12/2 = 6 scoops."],
    explanation: "3/2 ÷ 1/4 = 3/2 × 4/1 = 12/2 = 6 scoops.",
    difficulty: "stretch",
    source: "authored",
  },
  {
    id: "mdf2-mult-thirds",
    type: "expression",
    prompt: "3/5 × 1/2 = ?",
    answer: "3/10", // 3/10
    hints: ["3×1 = 3 over 5×2 = 10.", "Already in lowest terms: 3/10."],
    explanation: "3/5 × 1/2 = 3/10.",
    difficulty: "core",
    source: "authored",
  },
];

export default deck;
