// Authored Regents problem-bank — Polynomial Operations (AI-A.APR.1): adding and
// subtracting polynomials. Real released Next Generation Algebra I Regents
// questions, cited to the administration. Answers independently verified;
// SME-ratified. Math is inline LaTeX (String.raw so backslashes survive).

import type { RegentsItem } from "@/lib/regents/bank";

const bank: RegentsItem[] = [
  {
    id: "poly-mc-0624-q4",
    mode: "mc",
    standard: "AI-A.APR.1",
    topic: "Adding & subtracting polynomials",
    examCitation: "regents-algI-0624-q4",
    part: "I",
    credits: 2,
    prompt: String.raw`The expression $-2(x^2 - 2x + 1) + (3x^2 + 3x - 5)$ is equivalent to`,
    choices: [
      String.raw`$x^2 + x - 4$`,
      String.raw`$x^2 - x - 7$`,
      String.raw`$x^2 + 7x - 4$`,
      String.raw`$x^2 + 7x - 7$`,
    ],
    answer: 3,
    explanation: String.raw`Distribute the $-2$ to get $-2x^2 + 4x - 2$, then add $3x^2 + 3x - 5$: $(-2+3)x^2 + (4+3)x + (-2-5) = x^2 + 7x - 7$.`,
  },
  {
    id: "poly-mc-0824-q3",
    mode: "mc",
    standard: "AI-A.APR.1",
    topic: "Adding & subtracting polynomials",
    examCitation: "regents-algI-0824-q3",
    part: "I",
    credits: 2,
    prompt: String.raw`Which expression is equivalent to $3(x^2 - 2x + 3) - (4x^2 + 3x - 1)$?`,
    choices: [
      String.raw`$-x^2 + x + 2$`,
      String.raw`$-x^2 - 8x + 7$`,
      String.raw`$-x^2 - 3x + 8$`,
      String.raw`$-x^2 - 9x + 10$`,
    ],
    answer: 3,
    explanation: String.raw`Distribute to get $3x^2 - 6x + 9$ and $-4x^2 - 3x + 1$, then combine: $(3-4)x^2 + (-6-3)x + (9+1) = -x^2 - 9x + 10$.`,
  },
  {
    id: "poly-mc-0125-q6",
    mode: "mc",
    standard: "AI-A.APR.1",
    topic: "Adding & subtracting polynomials",
    examCitation: "regents-algI-0125-q6",
    part: "I",
    credits: 2,
    prompt: String.raw`Which expression is equivalent to $(5x^2 - 2x + 4) - (3x^2 + 3x - 1)$?`,
    choices: [
      String.raw`$2x^2 + x + 3$`,
      String.raw`$2x^2 - 5x + 5$`,
      String.raw`$2x^4 + x^2 + 3$`,
      String.raw`$2x^4 - 5x^2 + 5$`,
    ],
    answer: 1,
    explanation: String.raw`Subtract term by term: $(5-3)x^2 + (-2-3)x + (4+1) = 2x^2 - 5x + 5$. Subtracting does not change the exponents, so the $x^4$ options are traps.`,
  },
  {
    id: "poly-mc-0625-q6",
    mode: "mc",
    standard: "AI-A.APR.1",
    topic: "Adding & subtracting polynomials",
    examCitation: "regents-algI-0625-q6",
    part: "I",
    credits: 2,
    prompt: String.raw`The expression $(-3x^2 + 9) - (7x^2 - 5x + 4)$ is equivalent to`,
    choices: [
      String.raw`$-10x^2 + 5x + 5$`,
      String.raw`$-10x^2 + 5x + 13$`,
      String.raw`$-10x^2 - 5x + 5$`,
      String.raw`$-10x^2 - 5x + 13$`,
    ],
    answer: 0,
    explanation: String.raw`Distribute the subtraction: $-3x^2 + 9 - 7x^2 + 5x - 4 = -10x^2 + 5x + 5$.`,
  },
  {
    id: "poly-mc-0126-q22",
    mode: "mc",
    standard: "AI-A.APR.1",
    topic: "Adding & subtracting polynomials",
    examCitation: "regents-algI-0126-q22",
    part: "I",
    credits: 2,
    prompt: String.raw`When $2x^2 - 3x + 4$ is subtracted from $x^2 + 2x - 5$, the result is`,
    choices: [
      String.raw`$x^2 - 5x + 9$`,
      String.raw`$x^2 - x + 1$`,
      String.raw`$-x^2 + 5x - 9$`,
      String.raw`$-x^2 - x - 1$`,
    ],
    answer: 2,
    explanation: String.raw`"Subtracted from" means $(x^2 + 2x - 5) - (2x^2 - 3x + 4) = x^2 + 2x - 5 - 2x^2 + 3x - 4 = -x^2 + 5x - 9$.`,
  },
];

export default bank;
