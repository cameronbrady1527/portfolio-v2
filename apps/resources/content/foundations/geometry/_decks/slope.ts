// Authored mastery deck for the "Slope" skill.
//
// Regents/Honors-LEVEL items — slope = rise/run = Δy/Δx through two points.
// Integer and zero slopes are `numeric`; fractional slopes (in lowest terms)
// are `expression` (graded by value, so any equal form counts — exactly right
// for "find the slope"). The two special cases that have NO number to type —
// a vertical line (undefined slope) and the sign of a falling line — are `mc`,
// per the rule that a "what is it" judgement belongs in multiple choice. These
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
    id: "sl-pos-int-origin",
    type: "numeric",
    prompt: "Find the slope of the line through (0, 0) and (1, 3).",
    answer: 3, // (3 − 0)/(1 − 0)
    tolerance: 0,
    hints: ["Slope = rise / run.", "Δy = 3, Δx = 1 → 3/1 = 3."],
    explanation: "slope = (3 − 0)/(1 − 0) = 3.",
    difficulty: "core",
    source: "authored",
  },
  {
    id: "sl-pos-int-run",
    type: "numeric",
    prompt: "Find the slope of the line through (1, 2) and (4, 8).",
    answer: 2, // (8 − 2)/(4 − 1) = 6/3
    tolerance: 0,
    hints: ["Δy = 8 − 2 = 6, Δx = 4 − 1 = 3.", "6/3 = 2."],
    explanation: "slope = (8 − 2)/(4 − 1) = 6/3 = 2.",
    difficulty: "core",
    source: "authored",
  },
  {
    id: "sl-neg-int",
    type: "numeric",
    prompt: "Find the slope of the line through (0, 5) and (2, 1).",
    answer: -2, // (1 − 5)/(2 − 0) = −4/2
    tolerance: 0,
    hints: ["The line falls, so the slope is negative.", "Δy = 1 − 5 = −4, Δx = 2 → −4/2 = −2."],
    explanation: "slope = (1 − 5)/(2 − 0) = −4/2 = −2.",
    difficulty: "core",
    source: "authored",
  },
  {
    id: "sl-zero-horizontal",
    type: "numeric",
    prompt: "Find the slope of the line through (-3, 4) and (5, 4).",
    answer: 0, // same y → flat line
    tolerance: 0,
    hints: ["Both points have the same y-value — the line is horizontal.", "Δy = 0, so slope = 0/8 = 0."],
    explanation: "Same y, so Δy = 0 and slope = 0/8 = 0 (a horizontal line).",
    difficulty: "core",
    source: "authored",
  },
  {
    id: "sl-half",
    type: "expression",
    prompt: "Find the slope of the line through (0, 0) and (4, 2).",
    answer: "1/2", // 2/4 reduced
    hints: ["Δy = 2, Δx = 4.", "2/4 in lowest terms is 1/2."],
    explanation: "slope = (2 − 0)/(4 − 0) = 2/4 = 1/2.",
    difficulty: "core",
    source: "authored",
  },
  {
    id: "sl-undefined-vertical",
    type: "mc",
    prompt: "Find the slope of the line through (2, -1) and (2, 6).",
    choices: ["Undefined (the line is vertical)", "0", "7", "1"],
    answer: 0, // same x → Δx = 0 → division by zero → undefined
    hints: [
      "Both points share the same x-value — what kind of line is that?",
      "Δx = 2 − 2 = 0, and you cannot divide by zero.",
    ],
    explanation: "Same x, so Δx = 0. Slope = Δy/0 is undefined — the line is vertical.",
    difficulty: "core",
    source: "authored",
  },
  {
    id: "sl-two-thirds",
    type: "expression",
    prompt: "Find the slope of the line through (1, 1) and (4, 3).",
    answer: "2/3", // (3 − 1)/(4 − 1)
    hints: ["Δy = 3 − 1 = 2, Δx = 4 − 1 = 3.", "2/3 is already in lowest terms."],
    explanation: "slope = (3 − 1)/(4 − 1) = 2/3.",
    difficulty: "stretch",
    source: "authored",
  },
  {
    id: "sl-neg-three-quarters",
    type: "expression",
    prompt: "Find the slope of the line through (0, 3) and (4, 0).",
    answer: "-3/4", // (0 − 3)/(4 − 0)
    hints: ["The line falls left to right → negative slope.", "Δy = 0 − 3 = −3, Δx = 4 → −3/4."],
    explanation: "slope = (0 − 3)/(4 − 0) = −3/4.",
    difficulty: "stretch",
    source: "authored",
  },
  {
    id: "sl-three-halves-neg-coords",
    type: "expression",
    prompt: "Find the slope of the line through (-2, -3) and (0, 0).",
    answer: "3/2", // (0 − (−3))/(0 − (−2)) = 3/2
    hints: ["Subtract carefully with the negatives.", "Δy = 0 − (−3) = 3, Δx = 0 − (−2) = 2 → 3/2."],
    explanation: "slope = (0 − (−3))/(0 − (−2)) = 3/2.",
    difficulty: "stretch",
    source: "authored",
  },
  {
    id: "sl-neg-int-negs",
    type: "numeric",
    prompt: "Find the slope of the line through (-1, 4) and (1, -2).",
    answer: -3, // (−2 − 4)/(1 − (−1)) = −6/2
    tolerance: 0,
    hints: ["Δy = −2 − 4 = −6, Δx = 1 − (−1) = 2.", "−6/2 = −3."],
    explanation: "slope = (−2 − 4)/(1 − (−1)) = −6/2 = −3.",
    difficulty: "stretch",
    source: "authored",
  },
  {
    id: "sl-falling-concept",
    type: "mc",
    prompt: "A line goes downhill as you read it from left to right. Its slope is —",
    choices: ["Negative", "Positive", "Zero", "Undefined"],
    answer: 0, // falling left-to-right → negative
    hints: ["Rising left-to-right is positive; flat is zero.", "Falling means y decreases as x increases → Δy/Δx < 0."],
    explanation: "Falling left to right means y decreases as x increases, so the slope is negative.",
    difficulty: "stretch",
    source: "authored",
  },
  {
    id: "sl-two-fifths",
    type: "expression",
    prompt: "Find the slope of the line through (0, 0) and (5, 2).",
    answer: "2/5", // already lowest terms
    hints: ["Δy = 2, Δx = 5.", "2/5 is already in lowest terms."],
    explanation: "slope = (2 − 0)/(5 − 0) = 2/5.",
    difficulty: "stretch",
    source: "authored",
  },
];

export default deck;
