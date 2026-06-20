// Authored mastery deck for the "Midpoint" skill.
//
// Regents/Honors-LEVEL items — the midpoint is the average of the endpoints'
// coordinates. Single-coordinate items are `numeric`; full-pair items are
// multiple choice (a coordinate pair isn't a single number to type). They are
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
    id: "mp-x",
    type: "numeric",
    prompt: "What is the x-coordinate of the midpoint of (2, 4) and (8, 10)?",
    answer: 5, // (2 + 8) / 2
    tolerance: 0,
    hints: ["Average the x-values.", "(2 + 8) ÷ 2 = 5."],
    explanation: "x-midpoint = (2 + 8) ÷ 2 = 5.",
    difficulty: "core",
    source: "authored",
  },
  {
    id: "mp-y",
    type: "numeric",
    prompt: "What is the y-coordinate of the midpoint of (2, 4) and (8, 10)?",
    answer: 7, // (4 + 10) / 2
    tolerance: 0,
    hints: ["Average the y-values.", "(4 + 10) ÷ 2 = 7."],
    explanation: "y-midpoint = (4 + 10) ÷ 2 = 7.",
    difficulty: "core",
    source: "authored",
  },
  {
    id: "mp-x-neg",
    type: "numeric",
    prompt: "What is the x-coordinate of the midpoint of (-4, 1) and (6, 9)?",
    answer: 1, // (-4 + 6) / 2
    tolerance: 0,
    hints: ["Average the x-values, watching the sign.", "(−4 + 6) ÷ 2 = 1."],
    explanation: "x-midpoint = (−4 + 6) ÷ 2 = 1.",
    difficulty: "core",
    source: "authored",
  },
  {
    id: "mp-y-neg",
    type: "numeric",
    prompt: "What is the y-coordinate of the midpoint of (3, -5) and (3, 11)?",
    answer: 3, // (-5 + 11) / 2
    tolerance: 0,
    hints: ["Average the y-values.", "(−5 + 11) ÷ 2 = 3."],
    explanation: "y-midpoint = (−5 + 11) ÷ 2 = 3.",
    difficulty: "core",
    source: "authored",
  },
  {
    id: "mp-x-both-neg",
    type: "numeric",
    prompt: "What is the x-coordinate of the midpoint of (-7, 2) and (1, 2)?",
    answer: -3, // (-7 + 1) / 2
    tolerance: 0,
    hints: ["(−7 + 1) ÷ 2.", "= −6 ÷ 2 = −3."],
    explanation: "x-midpoint = (−7 + 1) ÷ 2 = −3.",
    difficulty: "stretch",
    source: "authored",
  },
  {
    id: "mp-y-both-neg",
    type: "numeric",
    prompt: "What is the y-coordinate of the midpoint of (0, -8) and (0, -2)?",
    answer: -5, // (-8 + -2) / 2
    tolerance: 0,
    hints: ["(−8 + (−2)) ÷ 2.", "= −10 ÷ 2 = −5."],
    explanation: "y-midpoint = (−8 − 2) ÷ 2 = −5.",
    difficulty: "stretch",
    source: "authored",
  },
  {
    id: "mp-x-axis",
    type: "numeric",
    prompt: "What is the x-coordinate of the midpoint of (-5, 0) and (9, 0)?",
    answer: 2, // (-5 + 9) / 2
    tolerance: 0,
    hints: ["(−5 + 9) ÷ 2.", "= 4 ÷ 2 = 2."],
    explanation: "x-midpoint = (−5 + 9) ÷ 2 = 2.",
    difficulty: "core",
    source: "authored",
  },
  {
    id: "mp-y-large",
    type: "numeric",
    prompt: "What is the y-coordinate of the midpoint of (1, -3) and (7, 13)?",
    answer: 5, // (-3 + 13) / 2
    tolerance: 0,
    hints: ["(−3 + 13) ÷ 2.", "= 10 ÷ 2 = 5."],
    explanation: "y-midpoint = (−3 + 13) ÷ 2 = 5.",
    difficulty: "stretch",
    source: "authored",
  },
  {
    id: "mp-x-horizontal",
    type: "numeric",
    prompt: "What is the x-coordinate of the midpoint of (10, 5) and (4, 5)?",
    answer: 7, // (10 + 4) / 2
    tolerance: 0,
    hints: ["(10 + 4) ÷ 2.", "= 7."],
    explanation: "x-midpoint = (10 + 4) ÷ 2 = 7.",
    difficulty: "core",
    source: "authored",
  },
  {
    id: "mp-y-vertical-neg",
    type: "numeric",
    prompt: "What is the y-coordinate of the midpoint of (-6, -10) and (-6, 4)?",
    answer: -3, // (-10 + 4) / 2
    tolerance: 0,
    hints: ["(−10 + 4) ÷ 2.", "= −6 ÷ 2 = −3."],
    explanation: "y-midpoint = (−10 + 4) ÷ 2 = −3.",
    difficulty: "stretch",
    source: "authored",
  },
  {
    id: "mp-full-mc",
    type: "mc",
    prompt: "What is the midpoint of (2, 3) and (6, 9)?",
    choices: ["(4, 6)", "(8, 12)", "(2, 3)", "(4, 12)"],
    answer: 0, // ((2+6)/2, (3+9)/2)
    hints: ["Average the x's and the y's separately.", "((2+6)/2, (3+9)/2) = (4, 6)."],
    explanation: "Midpoint = ((2+6)/2, (3+9)/2) = (4, 6). The (8, 12) trap adds instead of averaging.",
    difficulty: "core",
    source: "authored",
  },
  {
    id: "mp-full-mc2",
    type: "mc",
    prompt: "What is the midpoint of (-2, 4) and (8, -2)?",
    choices: ["(3, 1)", "(6, 2)", "(3, 3)", "(5, 1)"],
    answer: 0, // ((-2+8)/2, (4+-2)/2)
    hints: ["((−2 + 8)/2, (4 + (−2))/2).", "= (3, 1)."],
    explanation: "Midpoint = ((−2+8)/2, (4−2)/2) = (3, 1).",
    difficulty: "stretch",
    source: "authored",
  },
];

export default deck;
