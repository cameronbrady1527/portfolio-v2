// Authored mastery deck for the "Adding & Subtracting Fractions" skill.
//
// Regents/Honors-LEVEL items — like and unlike denominators, results that
// simplify or come out improper, and real-world contexts (pizza eaten, tank
// remaining, recipe amounts). Answers are `expression` strings, so grade()
// accepts any equivalent form (3/4, 6/8, 0.75) — fine for computation. They are
// the "Prove it" gate on the Skill Card.
//
// HONESTY NOTE: this worktree has no Regents PDFs, so every item is tagged
// `source: "authored"`. Do NOT fabricate exam citations.
//
// Every stated answer is verified by hand AND asserted grade()-correct in
// decks.test.ts (the math mandate). Edit answers only alongside that test.

import type { DeckItem } from "@/lib/foundations/decks";

const deck: DeckItem[] = [
  {
    id: "asf-like-add",
    type: "expression",
    prompt: "1/5 + 2/5 = ?",
    answer: "3/5", // same bottom: 1+2 over 5
    hints: ["Same denominator — add the tops, keep the bottom.", "1 + 2 = 3, over 5."],
    explanation: "1/5 + 2/5 = 3/5.",
    difficulty: "core",
    source: "authored",
  },
  {
    id: "asf-like-sub",
    type: "expression",
    prompt: "5/6 − 1/6 = ?",
    answer: "2/3", // 4/6 simplifies to 2/3
    hints: ["Subtract the tops over 6: 5 − 1 = 4.", "4/6 simplifies to 2/3."],
    explanation: "5/6 − 1/6 = 4/6 = 2/3.",
    difficulty: "core",
    source: "authored",
  },
  {
    id: "asf-unlike-halves-quarters",
    type: "expression",
    prompt: "1/2 + 1/4 = ?",
    answer: "3/4", // 2/4 + 1/4
    hints: ["Rewrite 1/2 as 2/4.", "2/4 + 1/4 = 3/4."],
    explanation: "1/2 + 1/4 = 2/4 + 1/4 = 3/4.",
    difficulty: "core",
    source: "authored",
  },
  {
    id: "asf-unlike-thirds-quarters",
    type: "expression",
    prompt: "2/3 + 1/4 = ?",
    answer: "11/12", // 8/12 + 3/12
    hints: ["Common denominator 12.", "8/12 + 3/12 = 11/12."],
    explanation: "2/3 + 1/4 = 8/12 + 3/12 = 11/12.",
    difficulty: "core",
    source: "authored",
  },
  {
    id: "asf-unlike-sub",
    type: "expression",
    prompt: "3/4 − 1/3 = ?",
    answer: "5/12", // 9/12 − 4/12
    hints: ["Common denominator 12.", "9/12 − 4/12 = 5/12."],
    explanation: "3/4 − 1/3 = 9/12 − 4/12 = 5/12.",
    difficulty: "core",
    source: "authored",
  },
  {
    id: "asf-eighths-sub",
    type: "expression",
    prompt: "7/8 − 1/2 = ?",
    answer: "3/8", // 7/8 − 4/8
    hints: ["Rewrite 1/2 as 4/8.", "7/8 − 4/8 = 3/8."],
    explanation: "7/8 − 1/2 = 7/8 − 4/8 = 3/8.",
    difficulty: "core",
    source: "authored",
  },
  {
    id: "asf-thirds-sixths",
    type: "expression",
    prompt: "2/3 + 1/6 = ?",
    answer: "5/6", // 4/6 + 1/6
    hints: ["Rewrite 2/3 as 4/6.", "4/6 + 1/6 = 5/6."],
    explanation: "2/3 + 1/6 = 4/6 + 1/6 = 5/6.",
    difficulty: "core",
    source: "authored",
  },
  {
    id: "asf-improper-result",
    type: "expression",
    prompt: "3/4 + 3/4 = ?",
    answer: "3/2", // 6/4 = 3/2 (improper)
    hints: ["Same bottom: 3 + 3 = 6, over 4.", "6/4 simplifies to 3/2 (more than one whole)."],
    explanation: "3/4 + 3/4 = 6/4 = 3/2.",
    difficulty: "stretch",
    source: "authored",
  },
  {
    id: "asf-unlike-sixths-quarters",
    type: "expression",
    prompt: "5/6 − 1/4 = ?",
    answer: "7/12", // 10/12 − 3/12
    hints: ["Common denominator 12.", "10/12 − 3/12 = 7/12."],
    explanation: "5/6 − 1/4 = 10/12 − 3/12 = 7/12.",
    difficulty: "stretch",
    source: "authored",
  },
  {
    id: "asf-word-pizza",
    type: "expression",
    prompt: "You eat 1/4 of a pizza, then 3/8 more. What fraction of the pizza have you eaten?",
    answer: "5/8", // 2/8 + 3/8
    hints: ["Rewrite 1/4 as 2/8.", "2/8 + 3/8 = 5/8."],
    explanation: "1/4 + 3/8 = 2/8 + 3/8 = 5/8 of the pizza.",
    difficulty: "stretch",
    source: "authored",
  },
  {
    id: "asf-word-tank",
    type: "expression",
    prompt: "3/5 of a tank of gas has been used. What fraction of the tank remains?",
    answer: "2/5", // 1 − 3/5 = 5/5 − 3/5
    hints: ["A full tank is 5/5.", "5/5 − 3/5 = 2/5."],
    explanation: "1 − 3/5 = 5/5 − 3/5 = 2/5 of the tank remains.",
    difficulty: "stretch",
    source: "authored",
  },
  {
    id: "asf-word-recipe",
    type: "expression",
    prompt: "A recipe needs 2/3 cup of sugar. You accidentally add 1/6 cup extra. How much sugar is in the bowl, in cups?",
    answer: "5/6", // 4/6 + 1/6
    hints: ["Rewrite 2/3 as 4/6.", "4/6 + 1/6 = 5/6."],
    explanation: "2/3 + 1/6 = 4/6 + 1/6 = 5/6 cup.",
    difficulty: "stretch",
    source: "authored",
  },
];

export default deck;
