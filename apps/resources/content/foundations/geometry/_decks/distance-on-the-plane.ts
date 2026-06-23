// Authored mastery deck for the "Distance on the Coordinate Plane" skill.
//
// Regents/Honors-LEVEL items — horizontal and vertical distances (a simple
// difference) and diagonal distances via Pythagorean triples (so answers stay
// whole). The distance formula is the Pythagorean theorem on the grid. Answers
// are `numeric`. They are the "Prove it" gate on the Skill Card.
//
// HONESTY NOTE: this worktree has no Regents PDFs, so every item is tagged
// `source: "authored"`. Do NOT fabricate exam citations.
//
// Every stated answer is verified by hand AND asserted grade()-correct in
// decks.test.ts (the math mandate). Edit answers only alongside that test.

import type { DeckItem } from "@/lib/foundations/decks";

const deck: DeckItem[] = [
  {
    id: "dp-horizontal",
    type: "numeric",
    prompt: "Find the distance between (1, 2) and (6, 2).",
    answer: 5, // same y → |6 - 1|
    tolerance: 0,
    hints: ["Same y-value — the points are on a horizontal line.", "Distance = |6 − 1| = 5."],
    explanation: "Same y, so distance = |6 − 1| = 5.",
    difficulty: "core",
    source: "authored",
  },
  {
    id: "dp-vertical",
    type: "numeric",
    prompt: "Find the distance between (3, -1) and (3, 7).",
    answer: 8, // same x → |7 - (-1)|
    tolerance: 0,
    hints: ["Same x-value — a vertical line.", "Distance = |7 − (−1)| = 8."],
    explanation: "Same x, so distance = |7 − (−1)| = 8.",
    difficulty: "core",
    source: "authored",
  },
  {
    id: "dp-horizontal-neg",
    type: "numeric",
    prompt: "Find the distance between (-5, 4) and (3, 4).",
    answer: 8, // |3 - (-5)|
    tolerance: 0,
    hints: ["Same y. Count the horizontal gap.", "|3 − (−5)| = 8."],
    explanation: "Same y, so distance = |3 − (−5)| = 8.",
    difficulty: "core",
    source: "authored",
  },
  {
    id: "dp-vertical-neg",
    type: "numeric",
    prompt: "Find the distance between (2, -6) and (2, 2).",
    answer: 8, // |2 - (-6)|
    tolerance: 0,
    hints: ["Same x — vertical.", "|2 − (−6)| = 8."],
    explanation: "Same x, so distance = |2 − (−6)| = 8.",
    difficulty: "core",
    source: "authored",
  },
  {
    id: "dp-345-origin",
    type: "numeric",
    prompt: "Find the distance between (0, 0) and (3, 4).",
    answer: 5, // √(9 + 16)
    tolerance: 0,
    hints: ["Δx = 3, Δy = 4.", "√(3² + 4²) = √25 = 5."],
    explanation: "√(3² + 4²) = √(9 + 16) = √25 = 5.",
    difficulty: "core",
    source: "authored",
  },
  {
    id: "dp-345-shifted",
    type: "numeric",
    prompt: "Find the distance between (1, 2) and (4, 6).",
    answer: 5, // Δ(3, 4)
    tolerance: 0,
    hints: ["Δx = 3, Δy = 4.", "√(9 + 16) = 5."],
    explanation: "Δx = 3, Δy = 4 → √(9 + 16) = 5.",
    difficulty: "stretch",
    source: "authored",
  },
  {
    id: "dp-345-negative",
    type: "numeric",
    prompt: "Find the distance between (-1, -1) and (2, 3).",
    answer: 5, // Δ(3, 4)
    tolerance: 0,
    hints: ["Δx = 2 − (−1) = 3, Δy = 3 − (−1) = 4.", "√(9 + 16) = 5."],
    explanation: "Δx = 3, Δy = 4 → √25 = 5.",
    difficulty: "stretch",
    source: "authored",
  },
  {
    id: "dp-6810",
    type: "numeric",
    prompt: "Find the distance between (-2, -3) and (4, 5).",
    answer: 10, // Δ(6, 8)
    tolerance: 0,
    hints: ["Δx = 6, Δy = 8.", "√(36 + 64) = √100 = 10."],
    explanation: "Δx = 6, Δy = 8 → √(36 + 64) = 10.",
    difficulty: "stretch",
    source: "authored",
  },
  {
    id: "dp-861-10",
    type: "numeric",
    prompt: "Find the distance between (0, 0) and (8, 6).",
    answer: 10, // √(64 + 36)
    tolerance: 0,
    hints: ["Δx = 8, Δy = 6.", "√(64 + 36) = √100 = 10."],
    explanation: "√(8² + 6²) = √100 = 10.",
    difficulty: "stretch",
    source: "authored",
  },
  {
    id: "dp-51213",
    type: "numeric",
    prompt: "Find the distance between (0, 0) and (5, 12).",
    answer: 13, // √(25 + 144)
    tolerance: 0,
    hints: ["Δx = 5, Δy = 12.", "√(25 + 144) = √169 = 13."],
    explanation: "√(5² + 12²) = √169 = 13.",
    difficulty: "stretch",
    source: "authored",
  },
  {
    id: "dp-72425",
    type: "numeric",
    prompt: "Find the distance between (0, 0) and (7, 24).",
    answer: 25, // √(49 + 576)
    tolerance: 0,
    hints: ["Δx = 7, Δy = 24.", "√(49 + 576) = √625 = 25."],
    explanation: "√(7² + 24²) = √625 = 25.",
    difficulty: "stretch",
    source: "authored",
  },
  {
    id: "dp-81517",
    type: "numeric",
    prompt: "Find the distance between (1, 1) and (9, 16).",
    answer: 17, // Δ(8, 15)
    tolerance: 0,
    hints: ["Δx = 8, Δy = 15.", "√(64 + 225) = √289 = 17."],
    explanation: "Δx = 8, Δy = 15 → √289 = 17.",
    difficulty: "stretch",
    source: "authored",
  },
];

export default deck;
