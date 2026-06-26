// Authored Regents problem-bank — Solving Quadratic Equations (AI-A.REI.4),
// plus the sibling "justify a solving step" items (AI-A.REI.1).
//
// Every item is a REAL released Next Generation Algebra I Regents question, cited
// to its NYSED administration. Answers were independently solved & verified;
// model solutions are authored (clean, typeset) rather than scanned student work;
// rubrics are transcribed from the official NYSED Rating Guides. SME-ratified.
//
// Math is written as inline LaTeX ($…$), rendered by <MathText> (KaTeX) — the
// same authoring convention as the .mdx content. Use String.raw so backslashes
// survive the TypeScript string. Do not edit prompts/answers without re-checking
// the source PDF in /tmp/regents/exams (decoded text in /tmp/regents/decoded-*.txt).

import type { RegentsItem, RubricLevel } from "@/lib/regents/bank";

// The shared 4-credit rubric for "solve with the quadratic formula" items.
const QUADRATIC_FORMULA_RUBRIC: RubricLevel[] = [
  { credits: 4, criteria: "Correct answer in simplest radical form, with correct work using the quadratic formula." },
  { credits: 3, criteria: "Appropriate work, but ONE computational or simplification error; OR only one solution is stated." },
  { credits: 2, criteria: String.raw`Two or more errors; OR work reaches $\dfrac{-b \pm \sqrt{b^2 - 4ac}}{2a}$ with no further work; OR the correct answer by a method OTHER than the quadratic formula.` },
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
    prompt: String.raw`Use the quadratic formula to solve the equation $3x^2 - 10x + 5 = 0$. Express the answer in simplest radical form.`,
    answerSummary: String.raw`$x = \dfrac{5 \pm \sqrt{10}}{3}$`,
    modelSolution: String.raw`With $a = 3$, $b = -10$, $c = 5$, the discriminant is $b^2 - 4ac = 100 - 60 = 40$. So $x = \dfrac{10 \pm \sqrt{40}}{6} = \dfrac{10 \pm 2\sqrt{10}}{6} = \dfrac{5 \pm \sqrt{10}}{3}$.`,
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
    prompt: String.raw`Use the method of completing the square to determine the exact values of $x$ for the equation $x^2 + 10x - 30 = 0$.`,
    answerSummary: String.raw`$x = -5 \pm \sqrt{55}$`,
    modelSolution: String.raw`$x^2 + 10x = 30$. Add $\left(\tfrac{10}{2}\right)^2 = 25$ to both sides: $x^2 + 10x + 25 = 55$, so $(x + 5)^2 = 55$. Then $x + 5 = \pm\sqrt{55}$, giving $x = -5 \pm \sqrt{55}$.`,
    rubric: [
      { credits: 2, criteria: String.raw`$x = -5 \pm \sqrt{55}$, with correct work (completing the square).` },
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
    prompt: String.raw`Using the quadratic formula, solve $x^2 + 4x - 3 = 0$.`,
    answerSummary: String.raw`$x = -2 \pm \sqrt{7}$`,
    modelSolution: String.raw`With $a = 1$, $b = 4$, $c = -3$, the discriminant is $16 + 12 = 28$. So $x = \dfrac{-4 \pm \sqrt{28}}{2} = \dfrac{-4 \pm 2\sqrt{7}}{2} = -2 \pm \sqrt{7}$.`,
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
    prompt: String.raw`Using the quadratic formula, solve $6x^2 + 2x - 1 = 0$. Express the answer in simplest radical form.`,
    answerSummary: String.raw`$x = \dfrac{-1 \pm \sqrt{7}}{6}$`,
    modelSolution: String.raw`With $a = 6$, $b = 2$, $c = -1$, the discriminant is $4 + 24 = 28$. So $x = \dfrac{-2 \pm \sqrt{28}}{12} = \dfrac{-2 \pm 2\sqrt{7}}{12} = \dfrac{-1 \pm \sqrt{7}}{6}$.`,
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
    prompt: String.raw`Use the quadratic formula to solve $2x^2 - 4x - 3 = 0$, and express the answer in simplest radical form.`,
    answerSummary: String.raw`$x = \dfrac{2 \pm \sqrt{10}}{2}$`,
    modelSolution: String.raw`With $a = 2$, $b = -4$, $c = -3$, the discriminant is $16 + 24 = 40$. So $x = \dfrac{4 \pm \sqrt{40}}{4} = \dfrac{4 \pm 2\sqrt{10}}{4} = \dfrac{2 \pm \sqrt{10}}{2}$.`,
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
    prompt: String.raw`Which equation has the same solutions as $x^2 + 6x - 18 = 0$?`,
    choices: [
      String.raw`$(x + 3)^2 = 24$`,
      String.raw`$(x + 3)^2 = 27$`,
      String.raw`$(x + 6)^2 = 24$`,
      String.raw`$(x + 6)^2 = 27$`,
    ],
    answer: 1,
    explanation: String.raw`$x^2 + 6x = 18$; add $\left(\tfrac{6}{2}\right)^2 = 9$ to both sides to get $(x + 3)^2 = 27$.`,
  },
  {
    id: "sq-mc-0625-q11",
    mode: "mc",
    standard: "AI-A.REI.4",
    topic: "Solving quadratics — completing the square",
    examCitation: "regents-algI-0625-q11",
    part: "I",
    credits: 2,
    prompt: String.raw`Which equation is equivalent to $x^2 - 6x = 27$?`,
    choices: [
      String.raw`$(x - 3)^2 = 27 - 9$`,
      String.raw`$(x - 3)^2 = 27 + 9$`,
      String.raw`$(x - 3)^2 = 27 + 36$`,
      String.raw`$(x - 3)^2 = 27 - 36$`,
    ],
    answer: 1,
    explanation: String.raw`Add $\left(\tfrac{6}{2}\right)^2 = 9$ to BOTH sides to complete the square, giving $(x - 3)^2 = 27 + 9$.`,
  },
  {
    id: "sq-mc-0126-q23",
    mode: "mc",
    standard: "AI-A.REI.4",
    topic: "Solving quadratics — completing the square",
    examCitation: "regents-algI-0126-q23",
    part: "I",
    credits: 2,
    prompt: String.raw`Which equation has the same solution as $x^2 - 6x = 24$?`,
    choices: [
      String.raw`$(x - 3)^2 = 24$`,
      String.raw`$(x - 6)^2 = 24$`,
      String.raw`$(x - 3)^2 = 33$`,
      String.raw`$(x - 6)^2 = 60$`,
    ],
    answer: 2,
    explanation: String.raw`Add $\left(\tfrac{6}{2}\right)^2 = 9$ to both sides: $(x - 3)^2 = 24 + 9 = 33$.`,
  },
  {
    id: "sq-mc-0126-q17",
    mode: "mc",
    standard: "AI-A.REI.4",
    topic: "Solving quadratics — in context",
    examCitation: "regents-algI-0126-q17",
    part: "I",
    credits: 2,
    prompt: String.raw`The point $(x, -6)$ lies on the graph of a parabola whose equation is $y = -x^2 - x + 6$. The value of $x$ can be`,
    choices: [
      String.raw`$-3$ or $2$`,
      String.raw`$-4$ or $3$`,
      String.raw`$3$, only`,
      String.raw`$-4$, only`,
    ],
    answer: 1,
    explanation: String.raw`Set $-6 = -x^2 - x + 6$, which gives $x^2 + x - 12 = 0$, then $(x + 4)(x - 3) = 0$, so $x = -4$ or $3$.`,
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
    prompt: String.raw`When solving the equation $4x^2 - 16 = 0$, Laura wrote $4x^2 = 16$ as her first step. Which property justifies Laura's first step?`,
    choices: [
      "distributive property of multiplication over addition",
      "multiplication property of equality",
      "commutative property of addition",
      "addition property of equality",
    ],
    answer: 3,
    explanation: String.raw`She added $16$ to both sides — the addition property of equality.`,
  },
  {
    id: "sq-mc-0625-q8",
    mode: "mc",
    standard: "AI-A.REI.1",
    topic: "Justifying a solving step",
    examCitation: "regents-algI-0625-q8",
    part: "I",
    credits: 2,
    prompt: String.raw`Chloe is solving the equation $x^2 + 5x = 3x + 3$. Her first step gives $x^2 + 2x - 3 = 0$. Which property justifies this step?`,
    choices: [
      "the zero product property",
      "the commutative property",
      "the distributive property",
      "the subtraction property of equality",
    ],
    answer: 3,
    explanation: String.raw`She subtracted $3x + 3$ from both sides — the subtraction property of equality.`,
  },
  {
    id: "sq-mc-0125-q14",
    mode: "mc",
    standard: "AI-A.REI.1",
    topic: "Justifying a solving step",
    examCitation: "regents-algI-0125-q14",
    part: "I",
    credits: 2,
    prompt: String.raw`Stephanie is solving the equation $x^2 - 12 = 7x - 8$. Her first step gives $x^2 - 4 = 7x$. Which property justifies her first step?`,
    choices: [
      "associative property",
      "commutative property",
      "distributive property",
      "addition property of equality",
    ],
    answer: 3,
    explanation: String.raw`She added $8$ to both sides — the addition property of equality.`,
  },
];

export default bank;
