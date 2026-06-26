// Authored Regents problem-bank — Linear Inequalities (AI-A.REI.3). Real released
// Next Generation Algebra I Regents questions, cited to the administration.
// Demonstrates NUMBER-LINE figures used as MC choices ("which graph"). Choice
// graphs transcribed from the source PDF (the ray direction / open dot is vector
// art, not text). Answers independently verified; SME-ratified.

import type { RegentsItem } from "@/lib/regents/bank";

const bank: RegentsItem[] = [
  {
    id: "ineq-mc-0126-q11",
    mode: "mc",
    standard: "AI-A.REI.3",
    topic: "Solving a linear inequality — graph the solution",
    examCitation: "regents-algI-0126-q11",
    part: "I",
    credits: 2,
    prompt: String.raw`Which graph represents the solution to the inequality $4 + 3x > 9 - 7x$?`,
    choices: ["Graph (1)", "Graph (2)", "Graph (3)", "Graph (4)"],
    choiceFigures: [
      { kind: "number-line", min: 0, max: 3, step: 0.5, ray: { at: 2, dir: "left", closed: false } },
      { kind: "number-line", min: 0, max: 3, step: 0.5, ray: { at: 2, dir: "right", closed: false } },
      { kind: "number-line", min: 0, max: 3, step: 0.5, ray: { at: 0.5, dir: "right", closed: false } },
      { kind: "number-line", min: 0, max: 3, step: 0.5, ray: { at: 0.5, dir: "left", closed: false } },
    ],
    answer: 2,
    explanation: String.raw`Solve: $4 + 3x > 9 - 7x$ gives $10x > 5$, so $x > \frac{1}{2}$. Because the inequality is strict, the endpoint at $\frac{1}{2}$ is an open circle and the graph is shaded to the right — graph (3).`,
  },
];

export default bank;
