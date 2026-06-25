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
  {
    id: "func-mc-0624-q7",
    mode: "mc",
    standard: "AI-F.LE.1",
    topic: "Identify the model from a situation",
    examCitation: "regents-algI-0624-q7",
    part: "I",
    credits: 2,
    prompt:
      "On an island, a rare breed of rabbit doubled its population each month for two years. Which type of function best models the increase in population at the end of the two years?",
    choices: [
      "linear growth",
      "linear decay",
      "exponential growth",
      "exponential decay",
    ],
    answer: 2,
    explanation:
      "Doubling each month means multiplying by a constant ratio (2), and the population increases — that is exponential growth.",
  },
  {
    id: "func-mc-0625-q3",
    mode: "mc",
    standard: "AI-F.LE.1",
    topic: "Identify the model from a situation",
    examCitation: "regents-algI-0625-q3",
    part: "I",
    credits: 2,
    prompt: "Which scenario represents an exponential relationship?",
    choices: [
      "Kirsten's New Year's resolution is to lose one pound each week.",
      "Sarah wants to increase her grade by 5 points each quarter.",
      String.raw`Tommy wants to reduce his spending by \$50 each month.`,
      "Dylan hopes to grow his business by 5% each month.",
    ],
    answer: 3,
    explanation:
      "Growing by 5% each month multiplies by a constant ratio (1.05), which is exponential. The other scenarios change by a constant amount each step, which is linear.",
  },
  {
    id: "func-mc-0125-q13",
    mode: "mc",
    standard: "AI-F.LE.1",
    topic: "Identify the model from a table",
    examCitation: "regents-algI-0125-q13",
    part: "I",
    credits: 2,
    prompt: "Based on the table of values below, this function can best be described as",
    figure: {
      kind: "table",
      headers: ["x", "f(x)"],
      rows: [
        [1, 0.125],
        [2, 0.25],
        [3, 0.5],
        [4, 1],
        [5, 2],
      ],
    },
    choices: ["linear", "quadratic", "exponential", "absolute value"],
    answer: 2,
    explanation:
      "Each f-value is double the one before it (×2) — a constant ratio — so the function is exponential.",
  },
];

export default bank;
