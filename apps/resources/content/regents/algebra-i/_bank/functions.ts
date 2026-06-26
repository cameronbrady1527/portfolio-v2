// Authored Regents problem-bank — Functions: function notation/evaluation
// (AI-F.IF.2) and transforming a function's graph (AI-F.BF.3). Real released
// Next Generation Algebra I Regents questions, cited to the administration.
// Answers independently verified; SME-ratified. Math is inline LaTeX (String.raw).

import type { RegentsItem } from "@/lib/regents/bank";

const bank: RegentsItem[] = [
  {
    id: "func-mc-0126-q14",
    mode: "mc",
    standard: "AI-F.IF.2",
    topic: "Function notation — evaluate",
    examCitation: "regents-algI-0126-q14",
    part: "I",
    credits: 2,
    prompt: String.raw`If $f(x) = |x + 1| + 5$, what is the value of $f(3)$?`,
    choices: [String.raw`$9$`, String.raw`$7$`, String.raw`$3$`, String.raw`$10$`],
    answer: 0,
    explanation: String.raw`Substitute $x = 3$: $f(3) = |3 + 1| + 5 = |4| + 5 = 4 + 5 = 9$.`,
  },
  {
    id: "func-cr-0624-q26",
    mode: "self-score",
    standard: "AI-F.IF.2",
    topic: "Function notation — evaluate",
    examCitation: "regents-algI-0624-q26",
    part: "II",
    credits: 2,
    prompt: String.raw`Given $g(x) = x^3 + 2x^2 - x$, evaluate $g(-3)$.`,
    answerSummary: String.raw`$g(-3) = -6$`,
    modelSolution: String.raw`Substitute $x = -3$: $g(-3) = (-3)^3 + 2(-3)^2 - (-3) = -27 + 2(9) + 3 = -27 + 18 + 3 = -6$.`,
    rubric: [
      { credits: 2, criteria: String.raw`$-6$, with correct work shown.` },
      { credits: 1, criteria: "Appropriate work, but one computational error; OR one conceptual error; OR the correct answer with no work shown." },
      { credits: 0, criteria: "A response with no relevant course-level work." },
    ],
  },
  {
    id: "func-mc-0126-q15",
    mode: "mc",
    standard: "AI-F.BF.3",
    topic: "Transforming a function's graph",
    examCitation: "regents-algI-0126-q15",
    part: "I",
    credits: 2,
    prompt: String.raw`Isabella wants to shift the graph of the function $f(x) = (x + 5)^2 - 2$ left 3 units. Which function represents the shifted graph?`,
    choices: [
      String.raw`$g(x) = (x + 2)^2 - 2$`,
      String.raw`$g(x) = (x + 8)^2 - 2$`,
      String.raw`$g(x) = (x + 5)^2 - 5$`,
      String.raw`$g(x) = (x + 5)^2 + 1$`,
    ],
    answer: 1,
    explanation: String.raw`Shifting left 3 replaces $x$ with $x + 3$: $f(x + 3) = ((x + 3) + 5)^2 - 2 = (x + 8)^2 - 2$.`,
  },
];

export default bank;
