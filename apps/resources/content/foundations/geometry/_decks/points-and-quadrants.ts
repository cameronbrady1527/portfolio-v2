// Authored mastery deck for the "Points & Quadrants" skill.
//
// Regents/Honors-LEVEL items — identifying the quadrant of a point from its
// signs, the axis special case (no quadrant), sign-reasoning, and the quadrant
// of a reflected image. Quadrant answers are `numeric` (1–4); the axis and
// sign-reasoning items are multiple choice. They are the "Prove it" gate on the
// Skill Card.
//
// HONESTY NOTE: this worktree has no Regents PDFs, so every item is tagged
// `source: "authored"`. Do NOT fabricate exam citations.
//
// Every stated answer is verified by hand AND asserted grade()-correct in
// decks.test.ts (the math mandate). Edit answers only alongside that test.

import type { DeckItem } from "@/lib/foundations/decks";

const deck: DeckItem[] = [
  {
    id: "pq-q1",
    type: "numeric",
    prompt: "Which quadrant contains the point (4, 7)? Enter 1, 2, 3, or 4.",
    answer: 1, // (+, +)
    tolerance: 0,
    hints: ["Both coordinates are positive.", "(+, +) is Quadrant I."],
    explanation: "(4, 7) has positive x and y → Quadrant I.",
    difficulty: "core",
    source: "authored",
  },
  {
    id: "pq-q2",
    type: "numeric",
    prompt: "Which quadrant contains the point (-3, 5)? Enter 1, 2, 3, or 4.",
    answer: 2, // (-, +)
    tolerance: 0,
    hints: ["x is negative, y is positive.", "(−, +) is Quadrant II."],
    explanation: "(-3, 5) → Quadrant II.",
    difficulty: "core",
    source: "authored",
  },
  {
    id: "pq-q3",
    type: "numeric",
    prompt: "Which quadrant contains the point (-6, -2)? Enter 1, 2, 3, or 4.",
    answer: 3, // (-, -)
    tolerance: 0,
    hints: ["Both coordinates are negative.", "(−, −) is Quadrant III."],
    explanation: "(-6, -2) → Quadrant III.",
    difficulty: "core",
    source: "authored",
  },
  {
    id: "pq-q4",
    type: "numeric",
    prompt: "Which quadrant contains the point (8, -1)? Enter 1, 2, 3, or 4.",
    answer: 4, // (+, -)
    tolerance: 0,
    hints: ["x is positive, y is negative.", "(+, −) is Quadrant IV."],
    explanation: "(8, -1) → Quadrant IV.",
    difficulty: "core",
    source: "authored",
  },
  {
    id: "pq-q1b",
    type: "numeric",
    prompt: "Which quadrant contains the point (2, 9)? Enter 1, 2, 3, or 4.",
    answer: 1,
    tolerance: 0,
    hints: ["(+, +).", "Quadrant I."],
    explanation: "(2, 9) → Quadrant I.",
    difficulty: "core",
    source: "authored",
  },
  {
    id: "pq-q4b",
    type: "numeric",
    prompt: "Which quadrant contains the point (7, -3)? Enter 1, 2, 3, or 4.",
    answer: 4,
    tolerance: 0,
    hints: ["(+, −).", "Quadrant IV."],
    explanation: "(7, -3) → Quadrant IV.",
    difficulty: "core",
    source: "authored",
  },
  {
    id: "pq-signs-mc",
    type: "mc",
    prompt: "A point has a negative x-coordinate and a positive y-coordinate. Which quadrant is it in?",
    choices: ["Quadrant II", "Quadrant I", "Quadrant III", "Quadrant IV"],
    answer: 0, // (-, +) = II
    hints: ["Quadrants go counterclockwise from the top-right.", "(−, +) is the top-left."],
    explanation: "(−, +) is the top-left region → Quadrant II.",
    difficulty: "core",
    source: "authored",
  },
  {
    id: "pq-axis-mc",
    type: "mc",
    prompt: "Where does the point (0, 5) lie?",
    choices: ["On the y-axis (not in any quadrant)", "Quadrant I", "Quadrant II", "Quadrant IV"],
    answer: 0,
    hints: ["A quadrant needs both coordinates non-zero.", "x = 0 puts the point on the y-axis."],
    explanation: "x = 0, so (0, 5) sits on the y-axis — not in any quadrant.",
    difficulty: "stretch",
    source: "authored",
  },
  {
    id: "pq-reflect-x",
    type: "numeric",
    prompt: "The point (3, 6) is reflected over the x-axis. In which quadrant is its image? Enter 1, 2, 3, or 4.",
    answer: 4, // image (3, -6)
    tolerance: 0,
    hints: ["Reflecting over the x-axis flips y: (3, 6) → (3, -6).", "(+, −) is Quadrant IV."],
    explanation: "(3, 6) reflects to (3, -6) → Quadrant IV.",
    difficulty: "stretch",
    source: "authored",
  },
  {
    id: "pq-reflect-y",
    type: "numeric",
    prompt: "The point (5, 2) is reflected over the y-axis. In which quadrant is its image? Enter 1, 2, 3, or 4.",
    answer: 2, // image (-5, 2)
    tolerance: 0,
    hints: ["Reflecting over the y-axis flips x: (5, 2) → (-5, 2).", "(−, +) is Quadrant II."],
    explanation: "(5, 2) reflects to (-5, 2) → Quadrant II.",
    difficulty: "stretch",
    source: "authored",
  },
  {
    id: "pq-reflect-x2",
    type: "numeric",
    prompt: "The point (-2, 5) is reflected over the x-axis. In which quadrant is its image? Enter 1, 2, 3, or 4.",
    answer: 3, // image (-2, -5)
    tolerance: 0,
    hints: ["Flip y: (-2, 5) → (-2, -5).", "(−, −) is Quadrant III."],
    explanation: "(-2, 5) reflects to (-2, -5) → Quadrant III.",
    difficulty: "stretch",
    source: "authored",
  },
  {
    id: "pq-q3b",
    type: "numeric",
    prompt: "Which quadrant contains the point (-4, -8)? Enter 1, 2, 3, or 4.",
    answer: 3,
    tolerance: 0,
    hints: ["(−, −).", "Quadrant III."],
    explanation: "(-4, -8) → Quadrant III.",
    difficulty: "core",
    source: "authored",
  },
];

export default deck;
