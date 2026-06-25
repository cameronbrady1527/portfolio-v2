// Authored Regents problem-bank — Systems of Equations. Covers linear-quadratic
// systems (AI-A.REI.7) and linear systems (AI-A.REI.6), the way the exam groups
// them. Every item is a REAL released Next Generation Algebra I Regents question,
// cited to its NYSED administration; answers independently solved & verified;
// model solutions authored; rubrics transcribed from the official Rating Guides.
//
// Items here are the algebraically-solved ones (no graph required) — figure-based
// "graph the system" items are deferred until the bank supports figures.
//
// Math is inline LaTeX ($…$); a literal dollar sign (currency) is written `\$`.
// Use String.raw so backslashes survive the TypeScript string.

import type { RegentsItem, RubricLevel } from "@/lib/regents/bank";

// Shared 4-credit rubric for "solve the linear-quadratic system algebraically".
const LINEAR_QUADRATIC_RUBRIC: RubricLevel[] = [
  { credits: 4, criteria: "Both solution pairs, with correct algebraic work (the two expressions for y set equal and the resulting quadratic solved)." },
  { credits: 3, criteria: "One computational or factoring error; OR both x-values are found but no further correct work; OR one complete (x, y) pair is found but no further work." },
  { credits: 2, criteria: "Two or more errors; OR one conceptual error; OR the resulting quadratic is factored correctly but no further correct work is shown." },
  { credits: 1, criteria: "A correct first step (the two expressions for y set equal to each other) is shown, but no further correct work." },
  { credits: 0, criteria: "A response with no relevant course-level work." },
];

const bank: RegentsItem[] = [
  // ---- Linear-quadratic systems (AI-A.REI.7) ----
  {
    id: "sys-cr-0824-q34",
    mode: "self-score",
    standard: "AI-A.REI.7",
    topic: "Systems — linear-quadratic (solve algebraically)",
    examCitation: "regents-algI-0824-q34",
    part: "III",
    credits: 4,
    prompt: String.raw`Solve the system of equations algebraically for all values of $x$ and $y$: $y = x^2 + 4x - 1$ and $y = 2x + 7$.`,
    answerSummary: String.raw`$(-4, -1)$ and $(2, 11)$`,
    modelSolution: String.raw`Set the expressions for $y$ equal: $x^2 + 4x - 1 = 2x + 7$, so $x^2 + 2x - 8 = 0$ and $(x + 4)(x - 2) = 0$, giving $x = -4$ or $x = 2$. Then $y = 2x + 7$ gives $y = -1$ at $x = -4$ and $y = 11$ at $x = 2$: the solutions are $(-4, -1)$ and $(2, 11)$.`,
    rubric: LINEAR_QUADRATIC_RUBRIC,
  },
  {
    id: "sys-cr-0125-q34",
    mode: "self-score",
    standard: "AI-A.REI.7",
    topic: "Systems — linear-quadratic (solve algebraically)",
    examCitation: "regents-algI-0125-q34",
    part: "III",
    credits: 4,
    prompt: String.raw`Solve the system of equations algebraically for all values of $x$ and $y$: $y = x^2 - 7x + 12$ and $y = 2x - 6$.`,
    answerSummary: String.raw`$(3, 0)$ and $(6, 6)$`,
    modelSolution: String.raw`Set them equal: $x^2 - 7x + 12 = 2x - 6$, so $x^2 - 9x + 18 = 0$ and $(x - 3)(x - 6) = 0$, giving $x = 3$ or $x = 6$. Then $y = 2x - 6$ gives $y = 0$ at $x = 3$ and $y = 6$ at $x = 6$: the solutions are $(3, 0)$ and $(6, 6)$.`,
    rubric: LINEAR_QUADRATIC_RUBRIC,
  },
  {
    id: "sys-cr-0625-q34",
    mode: "self-score",
    standard: "AI-A.REI.7",
    topic: "Systems — linear-quadratic (solve algebraically)",
    examCitation: "regents-algI-0625-q34",
    part: "III",
    credits: 4,
    prompt: String.raw`Solve the system of equations algebraically for all values of $x$ and $y$: $y = x^2 + 9x + 4$ and $y - 2x = -6$.`,
    answerSummary: String.raw`$(-2, -10)$ and $(-5, -16)$`,
    modelSolution: String.raw`Rewrite the line as $y = 2x - 6$, then set equal: $x^2 + 9x + 4 = 2x - 6$, so $x^2 + 7x + 10 = 0$ and $(x + 2)(x + 5) = 0$, giving $x = -2$ or $x = -5$. Then $y = 2x - 6$ gives $y = -10$ at $x = -2$ and $y = -16$ at $x = -5$: the solutions are $(-2, -10)$ and $(-5, -16)$.`,
    rubric: LINEAR_QUADRATIC_RUBRIC,
  },

  {
    id: "sys-cr-0624-q31",
    mode: "self-score",
    standard: "AI-A.REI.7",
    topic: "Systems — graph a linear-quadratic system",
    examCitation: "regents-algI-0624-q31",
    part: "III",
    credits: 4,
    prompt: String.raw`Graph the system $y = x^2 - 3x - 6$ and $y = x - 1$ on a set of axes, and state the coordinates of all solutions.`,
    answerSummary: String.raw`$(-1, -2)$ and $(5, 4)$`,
    modelSolution: String.raw`The parabola and line meet where $x^2 - 3x - 6 = x - 1$, i.e. $x^2 - 4x - 5 = 0$, so $(x - 5)(x + 1) = 0$ and $x = 5$ or $x = -1$. Using $y = x - 1$, the intersection points are $(5, 4)$ and $(-1, -2)$ — the solutions, shown below.`,
    figure: {
      kind: "plot",
      range: 10,
      curves: [
        { kind: "parabola", a: 1, b: -3, c: -6 },
        { kind: "line", m: 1, b: -1 },
      ],
      points: [
        { x: -1, y: -2, label: "(-1, -2)" },
        { x: 5, y: 4, label: "(5, 4)" },
      ],
      caption: "y = x² − 3x − 6 (blue) meets y = x − 1 (orange) at (−1, −2) and (5, 4).",
    },
    rubric: [
      { credits: 4, criteria: String.raw`Correct graphs are drawn, and $(-1, -2)$ and $(5, 4)$ are stated.` },
      { credits: 3, criteria: "One graphing error; OR only one point's coordinates are stated correctly; OR the solutions are indicated on the graph but the coordinates are not stated." },
      { credits: 2, criteria: String.raw`Both equations are graphed correctly but no further work; OR $(-1, -2)$ and $(5, 4)$ are stated, but a method other than graphing is used.` },
      { credits: 1, criteria: String.raw`One equation is graphed correctly but no further work; OR $(-1, -2)$ and $(5, 4)$ are stated with no work shown.` },
      { credits: 0, criteria: "A response with no relevant course-level work." },
    ],
  },

  // ---- Linear systems (AI-A.REI.6) ----
  {
    id: "sys-mc-0126-q10",
    mode: "mc",
    standard: "AI-A.REI.6",
    topic: "Systems — the substitution method",
    examCitation: "regents-algI-0126-q10",
    part: "I",
    credits: 2,
    prompt: String.raw`When solving the system $3x - y = 10$ and $2x + 5y = 1$ algebraically, Mason used the substitution method. Which equation could he have used?`,
    choices: [
      String.raw`$2(3x - 10) + 5x = 1$`,
      String.raw`$2(-3x + 10) + 5x = 1$`,
      String.raw`$2x + 5(3x - 10) = 1$`,
      String.raw`$2x + 5(-3x + 10) = 1$`,
    ],
    answer: 2,
    explanation: String.raw`Solve $3x - y = 10$ for $y$: $y = 3x - 10$. Substitute into $2x + 5y = 1$: $2x + 5(3x - 10) = 1$.`,
  },
  {
    id: "sys-cr-0125-q31",
    mode: "self-score",
    standard: "AI-A.REI.6",
    topic: "Systems — linear word problem",
    examCitation: "regents-algI-0125-q31",
    part: "III",
    credits: 4,
    prompt: String.raw`Alex had \$1.70 in nickels and dimes on his desk; there were 25 coins in all. Write a system of equations to determine the number of nickels, $n$, and dimes, $d$, then solve it algebraically to find how many of each he had.`,
    answerSummary: String.raw`$16$ nickels and $9$ dimes`,
    modelSolution: String.raw`System: $n + d = 25$ and $0.05n + 0.10d = 1.70$. Substitute $d = 25 - n$: $0.05n + 0.10(25 - n) = 1.70$, so $0.05n + 2.5 - 0.10n = 1.70$ and $-0.05n = -0.80$, giving $n = 16$ and $d = 9$.`,
    rubric: [
      { credits: 4, criteria: String.raw`$n + d = 25$ and $0.05n + 0.10d = 1.70$, with $n = 16$ and $d = 9$, and correct algebraic work.` },
      { credits: 3, criteria: "One computational error; OR only one of n = 16 or d = 9 is found; OR one equation is written incorrectly but the system is solved appropriately." },
      { credits: 2, criteria: "Two or more computational errors; OR a correct system is written but no further correct work is shown." },
      { credits: 1, criteria: "One equation is written correctly but no further correct work; OR n = 16 and d = 9 are found by a method other than algebraic; OR the answer is given with no work." },
      { credits: 0, criteria: "A response with no relevant course-level work." },
    ],
  },
  {
    id: "sys-cr-0824-q35",
    mode: "self-score",
    standard: "AI-A.REI.6",
    topic: "Systems — linear word problem",
    examCitation: "regents-algI-0824-q35",
    part: "IV",
    credits: 6,
    prompt: String.raw`At a movie theater, admission prices stay the same in May and June. In May, Jen saw 2 matinees and 3 regular shows and spent \$38.50. In June, she saw 6 matinees and 1 regular show and spent \$47.50. Write a system of equations for the cost $m$ of a matinee ticket and $r$ of a regular ticket. Jen said she spent \$5.75 on each matinee and \$9 on each regular show — is she correct? Justify your answer. Then use your system to algebraically determine the actual cost of each ticket.`,
    answerSummary: String.raw`Matinee \$6.50, regular \$8.50 — Jen is not correct.`,
    modelSolution: String.raw`Let $m$ and $r$ be the matinee and regular costs. System: $2m + 3r = 38.50$ and $6m + r = 47.50$. Jen's guess (\$5.75, \$9) satisfies May ($2(5.75) + 3(9) = 38.50$) but not June ($6(5.75) + 9 = 43.50 \ne 47.50$), so she is not correct. From the second equation $r = 47.50 - 6m$; substituting, $2m + 3(47.50 - 6m) = 38.50$, so $-16m = -104$ and $m = 6.50$, giving $r = 8.50$.`,
    rubric: [
      { credits: 6, criteria: "A correct system is written, a correct justification that Jen is incorrect is given, and correct algebraic work finds m = 6.50 and r = 8.50." },
      { credits: 5, criteria: "One computational error; OR only one of m = 6.50 or r = 8.50 is found; OR one equation is written incorrectly but used appropriately; OR a non-algebraic method is used to find the costs." },
      { credits: 4, criteria: "Two or more computational errors; OR a correct system is written and solved but no justification; OR a correct system and justification but the system is not solved." },
      { credits: 3, criteria: "A correct system is written but the justification is incomplete and no further correct work is shown." },
      { credits: 2, criteria: "A correct system is written but no further correct work; OR a correct justification is given but no further correct work." },
      { credits: 1, criteria: "One correct equation is written, but no further correct work." },
      { credits: 0, criteria: "A response with no relevant course-level work." },
    ],
  },
];

export default bank;
