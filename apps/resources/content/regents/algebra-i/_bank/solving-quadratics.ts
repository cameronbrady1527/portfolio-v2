// Authored Regents problem-bank — Solving Quadratic Equations (AI-A.REI.4),
// plus the sibling "justify a solving step" items (AI-A.REI.1).
//
// Every item is a REAL released Next Generation Algebra I Regents question, cited
// to its NYSED administration. Answers were independently solved & verified;
// model solutions are authored (clean, typeset) rather than scanned student work;
// rubrics are transcribed from the official NYSED Rating Guides. SME-ratified.
//
// Provenance is the point — do not edit prompts/answers without re-checking the
// source PDF in /tmp/regents/exams (decoded text in /tmp/regents/decoded-*.txt).

import type { RegentsItem, RubricLevel } from "@/lib/regents/bank";

// The shared 4-credit rubric for "solve with the quadratic formula" items.
const QUADRATIC_FORMULA_RUBRIC: RubricLevel[] = [
  { credits: 4, criteria: "Correct answer in simplest radical form, with correct work using the quadratic formula." },
  { credits: 3, criteria: "Appropriate work, but ONE computational or simplification error; OR only one solution is stated." },
  { credits: 2, criteria: "Two or more errors; OR work reaches (−b ± √discriminant)/2a with no further work; OR the correct answer by a method OTHER than the quadratic formula." },
  { credits: 1, criteria: "A correct substitution into the quadratic formula, but no further correct work; OR the final answer with no work shown." },
  { credits: 0, criteria: "A response with no relevant course-level work." },
];

const bank: RegentsItem[] = [
  // ---- Constructed-response (self-score) ----
  {
    id: "sq-cr-0624-q33",
    mode: "self-score",
    standard: "AI-A.REI.4",
    topic: "Solving quadratics — quadratic formula",
    examCitation: "regents-algI-0624-q33",
    part: "III",
    credits: 4,
    prompt:
      "Use the quadratic formula to solve the equation 3x² − 10x + 5 = 0. Express the answer in simplest radical form.",
    answerSummary: "x = (5 ± √10)/3",
    modelSolution:
      "With a = 3, b = −10, c = 5: x = (10 ± √(100 − 60))/6 = (10 ± √40)/6 = (10 ± 2√10)/6 = (5 ± √10)/3.",
    rubric: QUADRATIC_FORMULA_RUBRIC,
  },
  {
    id: "sq-cr-0624-q29",
    mode: "self-score",
    standard: "AI-A.REI.4",
    topic: "Solving quadratics — completing the square",
    examCitation: "regents-algI-0624-q29",
    part: "II",
    credits: 2,
    prompt:
      "Use the method of completing the square to determine the exact values of x for the equation x² + 10x − 30 = 0.",
    answerSummary: "x = −5 ± √55",
    modelSolution:
      "x² + 10x = 30. Add (10/2)² = 25 to both sides: x² + 10x + 25 = 55, so (x + 5)² = 55. Then x + 5 = ±√55, giving x = −5 ± √55.",
    rubric: [
      { credits: 2, criteria: "x = −5 ± √55, with correct work (completing the square)." },
      { credits: 1, criteria: "One computational error; OR one conceptual error; OR only one solution stated; OR the correct answer by a method OTHER than completing the square; OR the correct answer with no work." },
      { credits: 0, criteria: "A response with no relevant course-level work." },
    ],
  },
  {
    id: "sq-cr-0125-q33",
    mode: "self-score",
    standard: "AI-A.REI.4",
    topic: "Solving quadratics — quadratic formula",
    examCitation: "regents-algI-0125-q33",
    part: "III",
    credits: 4,
    prompt: "Using the quadratic formula, solve x² + 4x − 3 = 0.",
    answerSummary: "x = −2 ± √7",
    modelSolution:
      "With a = 1, b = 4, c = −3: x = (−4 ± √(16 + 12))/2 = (−4 ± √28)/2 = (−4 ± 2√7)/2 = −2 ± √7.",
    rubric: QUADRATIC_FORMULA_RUBRIC,
  },
  {
    id: "sq-cr-0625-q32",
    mode: "self-score",
    standard: "AI-A.REI.4",
    topic: "Solving quadratics — quadratic formula",
    examCitation: "regents-algI-0625-q32",
    part: "III",
    credits: 4,
    prompt:
      "Using the quadratic formula, solve 6x² + 2x − 1 = 0. Express the answer in simplest radical form.",
    answerSummary: "x = (−1 ± √7)/6",
    modelSolution:
      "With a = 6, b = 2, c = −1: x = (−2 ± √(4 + 24))/12 = (−2 ± √28)/12 = (−2 ± 2√7)/12 = (−1 ± √7)/6.",
    rubric: QUADRATIC_FORMULA_RUBRIC,
  },
  {
    id: "sq-cr-0126-q32",
    mode: "self-score",
    standard: "AI-A.REI.4",
    topic: "Solving quadratics — quadratic formula",
    examCitation: "regents-algI-0126-q32",
    part: "III",
    credits: 4,
    prompt:
      "Use the quadratic formula to solve 2x² − 4x − 3 = 0, and express the answer in simplest radical form.",
    answerSummary: "x = (2 ± √10)/2",
    modelSolution:
      "With a = 2, b = −4, c = −3: x = (4 ± √(16 + 24))/4 = (4 ± √40)/4 = (4 ± 2√10)/4 = (2 ± √10)/2.",
    rubric: QUADRATIC_FORMULA_RUBRIC,
  },

  // ---- Multiple choice (auto-graded) — AI-A.REI.4 ----
  {
    id: "sq-mc-0824-q8",
    mode: "mc",
    standard: "AI-A.REI.4",
    topic: "Solving quadratics — completing the square",
    examCitation: "regents-algI-0824-q8",
    part: "I",
    credits: 2,
    prompt: "Which equation has the same solutions as x² + 6x − 18 = 0?",
    choices: ["(x + 3)² = 24", "(x + 3)² = 27", "(x + 6)² = 24", "(x + 6)² = 27"],
    answer: 1,
    explanation:
      "x² + 6x = 18; add (6/2)² = 9 to both sides → (x + 3)² = 27.",
  },
  {
    id: "sq-mc-0625-q11",
    mode: "mc",
    standard: "AI-A.REI.4",
    topic: "Solving quadratics — completing the square",
    examCitation: "regents-algI-0625-q11",
    part: "I",
    credits: 2,
    prompt: "Which equation is equivalent to x² − 6x = 27?",
    choices: ["(x − 3)² = 27 − 9", "(x − 3)² = 27 + 9", "(x − 3)² = 27 + 36", "(x − 3)² = 27 − 36"],
    answer: 1,
    explanation:
      "Add (6/2)² = 9 to BOTH sides to complete the square → (x − 3)² = 27 + 9.",
  },
  {
    id: "sq-mc-0126-q23",
    mode: "mc",
    standard: "AI-A.REI.4",
    topic: "Solving quadratics — completing the square",
    examCitation: "regents-algI-0126-q23",
    part: "I",
    credits: 2,
    prompt: "Which equation has the same solution as x² − 6x = 24?",
    choices: ["(x − 3)² = 24", "(x − 6)² = 24", "(x − 3)² = 33", "(x − 6)² = 60"],
    answer: 2,
    explanation: "Add (6/2)² = 9 to both sides → (x − 3)² = 24 + 9 = 33.",
  },
  {
    id: "sq-mc-0126-q17",
    mode: "mc",
    standard: "AI-A.REI.4",
    topic: "Solving quadratics — in context",
    examCitation: "regents-algI-0126-q17",
    part: "I",
    credits: 2,
    prompt:
      "The point (x, −6) lies on the graph of a parabola whose equation is y = −x² − x + 6. The value of x can be",
    choices: ["−3 or 2", "−4 or 3", "3, only", "−4, only"],
    answer: 1,
    explanation:
      "Set −6 = −x² − x + 6 → x² + x − 12 = 0 → (x + 4)(x − 3) = 0 → x = −4 or 3.",
  },

  // ---- Multiple choice — sibling skill: justify a solving step (AI-A.REI.1) ----
  {
    id: "sq-mc-0824-q6",
    mode: "mc",
    standard: "AI-A.REI.1",
    topic: "Justifying a solving step",
    examCitation: "regents-algI-0824-q6",
    part: "I",
    credits: 2,
    prompt:
      "When solving the equation 4x² − 16 = 0, Laura wrote 4x² = 16 as her first step. Which property justifies Laura's first step?",
    choices: [
      "distributive property of multiplication over addition",
      "multiplication property of equality",
      "commutative property of addition",
      "addition property of equality",
    ],
    answer: 3,
    explanation: "She added 16 to both sides — the addition property of equality.",
  },
  {
    id: "sq-mc-0625-q8",
    mode: "mc",
    standard: "AI-A.REI.1",
    topic: "Justifying a solving step",
    examCitation: "regents-algI-0625-q8",
    part: "I",
    credits: 2,
    prompt:
      "Chloe is solving the equation x² + 5x = 3x + 3. Her first step gives x² + 2x − 3 = 0. Which property justifies this step?",
    choices: [
      "the zero product property",
      "the commutative property",
      "the distributive property",
      "the subtraction property of equality",
    ],
    answer: 3,
    explanation:
      "She subtracted 3x + 3 from both sides — the subtraction property of equality.",
  },
  {
    id: "sq-mc-0125-q14",
    mode: "mc",
    standard: "AI-A.REI.1",
    topic: "Justifying a solving step",
    examCitation: "regents-algI-0125-q14",
    part: "I",
    credits: 2,
    prompt:
      "Stephanie is solving the equation x² − 12 = 7x − 8. Her first step gives x² − 4 = 7x. Which property justifies her first step?",
    choices: [
      "associative property",
      "commutative property",
      "distributive property",
      "addition property of equality",
    ],
    answer: 3,
    explanation: "She added 8 to both sides — the addition property of equality.",
  },
];

export default bank;
