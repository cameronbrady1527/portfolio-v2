// Authored Regents problem-bank — Linear vs. Exponential models (AI-F.LE.1).
// Real released Next Generation Algebra I Regents questions, cited to the
// administration. Demonstrates FIGURE CHOICES: the four options are data tables.
// Answers independently verified; SME-ratified.

import type { RegentsItem } from "@/lib/regents/bank";

const bank: RegentsItem[] = [
  {
    id: "func-mc-0126-q13",
    mode: "mc",
    standard: "AI-F.LE.1",
    topic: "Linear vs. exponential — choose the model",
    examCitation: "regents-algI-0126-q13",
    part: "I",
    credits: 2,
    prompt: "Which table of values best models an exponential decay function?",
    choices: ["Table (1)", "Table (2)", "Table (3)", "Table (4)"],
    choiceFigures: [
      {
        kind: "table",
        headers: ["x", "f(x)"],
        rows: [
          [-2, 7],
          [-1, 4],
          [0, 1],
          [1, -2],
          [2, -5],
          [3, -8],
        ],
      },
      {
        kind: "table",
        headers: ["m", "f(m)"],
        rows: [
          [0, 200],
          [1, 180],
          [2, 162],
          [3, 146],
          [4, 131],
          [5, 118],
        ],
      },
      {
        kind: "table",
        headers: ["n", "f(n)"],
        rows: [
          [0, 200],
          [0.5, 210],
          [1, 220],
          [1.5, 231],
          [2, 242],
          [2.5, 254],
        ],
      },
      {
        kind: "table",
        headers: ["p", "f(p)"],
        rows: [
          [-3, -2],
          [-2, -5],
          [-1, -6],
          [0, -5],
          [1, -2],
          [2, 3],
        ],
      },
    ],
    answer: 1,
    explanation:
      "Exponential decay multiplies by a constant ratio less than 1. In Table (2), each f-value is 0.9 times the one before (200 → 180 → 162 → …). Table (1) is linear (it subtracts 3 each time), Table (3) increases (growth), and Table (4) is not monotonic.",
  },
];

export default bank;
