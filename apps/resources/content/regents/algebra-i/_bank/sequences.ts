// Authored Regents problem-bank — Sequences: arithmetic and geometric sequences
// as functions (AI-F.IF.3), and their recursive and explicit rules (AI-F.BF.2).
// Arithmetic = a constant common DIFFERENCE (add each step); geometric = a
// constant common RATIO (multiply each step). Real released Algebra I Regents
// questions mined from the official NYSED administrations (via JMAP), cited to the
// exam + question number. Every answer independently re-derived. SME-ratified.

import type { RegentsItem } from "@/lib/regents/bank";

const bank: RegentsItem[] = [
  {
    id: "seq-mc-0622-q15",
    mode: "mc",
    standard: "AI-F.IF.3",
    topic: "Arithmetic sequence — common difference",
    examCitation: "regents-algI-0622-q15",
    part: "I",
    credits: 2,
    prompt: String.raw`The first term in an arithmetic sequence is $5$ and the fifth term is $17$. What is the common difference?`,
    choices: [String.raw`$2.4$`, String.raw`$12$`, String.raw`$3$`, String.raw`$4$`],
    answer: 2,
    explanation: String.raw`From the first term to the fifth term is $4$ steps: $a_5 = a_1 + 4d$, so $17 = 5 + 4d$, giving $4d = 12$ and $d = 3$.`,
  },

  // ── AI-F.IF.3 — recognize a sequence as a function; common difference / ratio; find a term ──
  {
    id: "seq-mc-0622-q23",
    mode: "mc",
    standard: "AI-F.IF.3",
    topic: "Arithmetic sequence — common difference",
    examCitation: "regents-algI-0622-q23",
    part: "I",
    credits: 2,
    prompt: String.raw`In an arithmetic sequence, the first term is $4$ and the third term is $-2$. What is the common difference?`,
    choices: [String.raw`$-1$`, String.raw`$-2$`, String.raw`$-3$`, String.raw`$-6$`],
    answer: 2,
    explanation: String.raw`From the first term to the third term is $2$ steps: $d = \dfrac{a_3 - a_1}{3 - 1} = \dfrac{-2 - 4}{2} = \dfrac{-6}{2} = -3$.`,
  },
  {
    id: "seq-mc-0619-q19",
    mode: "mc",
    standard: "AI-F.IF.3",
    topic: "Identify arithmetic sequences",
    examCitation: "regents-algI-0619-q19",
    part: "I",
    credits: 2,
    prompt: String.raw`Given the following three sequences:

I. $2, 4, 6, 8, 10, \ldots$

II. $2, 4, 8, 16, 32, \ldots$

III. $a,\ a + 2,\ a + 4,\ a + 6,\ a + 8, \ldots$

Which ones are arithmetic sequences?`,
    choices: ["I and II, only", "I and III, only", "II and III, only", "I, II, and III"],
    answer: 1,
    explanation: String.raw`A sequence is arithmetic when each term is found by adding a constant. I adds $2$ each step and III adds $2$ each step, so both are arithmetic. II multiplies by $2$ each step (geometric), so it is not. The answer is I and III, only.`,
  },
  {
    id: "seq-mc-0824-q19",
    mode: "mc",
    standard: "AI-F.IF.3",
    topic: "Geometric sequence — common ratio",
    examCitation: "regents-algI-0824-q19",
    part: "I",
    credits: 2,
    prompt: String.raw`A geometric sequence with a common ratio of $-3$ is`,
    choices: [
      String.raw`$-10, -7, -4, -1, \ldots$`,
      String.raw`$14, 11, 8, 5, \ldots$`,
      String.raw`$-2, -6, -18, -54, \ldots$`,
      String.raw`$4, -12, 36, -108, \ldots$`,
    ],
    answer: 3,
    explanation: String.raw`A common ratio of $-3$ means each term is the previous term times $-3$, which makes the signs alternate: $4,\ 4(-3) = -12,\ -12(-3) = 36,\ 36(-3) = -108$. Choices (1) and (2) are arithmetic, and (3) has ratio $3$, not $-3$.`,
  },
  {
    id: "seq-mc-0125-q3",
    mode: "mc",
    standard: "AI-F.IF.3",
    topic: "Geometric sequence — common ratio",
    examCitation: "regents-algI-0125-q3",
    part: "I",
    credits: 2,
    prompt: String.raw`A geometric sequence is shown below.

$\dfrac{1}{2},\ 2,\ 8,\ 32, \ldots$

What is the common ratio?`,
    choices: [String.raw`$\frac{1}{4}$`, String.raw`$-2$`, String.raw`$\frac{1}{2}$`, String.raw`$4$`],
    answer: 3,
    explanation: String.raw`Divide any term by the one before it: $r = 2 \div \dfrac{1}{2} = 4$. Check: $2 \cdot 4 = 8$ and $8 \cdot 4 = 32$.`,
  },
  {
    id: "seq-mc-0822-q2",
    mode: "mc",
    standard: "AI-F.IF.3",
    topic: "Geometric sequence — common ratio",
    examCitation: "regents-algI-0822-q2",
    part: "I",
    credits: 2,
    prompt: String.raw`If $x \neq 0$, then the common ratio of the sequence $x,\ 2x^2,\ 4x^3,\ 8x^4,\ 16x^5, \ldots$ is`,
    choices: [String.raw`$2x$`, String.raw`$2$`, String.raw`$x$`, String.raw`$\frac{1}{2}x$`],
    answer: 0,
    explanation: String.raw`Divide a term by the one before it: $r = \dfrac{2x^2}{x} = 2x$. Check: $2x^2 \cdot 2x = 4x^3$.`,
  },
  {
    id: "seq-mc-0624-q12",
    mode: "mc",
    standard: "AI-F.IF.3",
    topic: "Geometric sequence — common ratio",
    examCitation: "regents-algI-0624-q12",
    part: "I",
    credits: 2,
    prompt: String.raw`The third term in a sequence is $25$ and the fifth term is $625$. Which number could be the common ratio of the sequence?`,
    choices: [String.raw`$\frac{1}{5}$`, String.raw`$5$`, String.raw`$\frac{1}{25}$`, String.raw`$25$`],
    answer: 1,
    explanation: String.raw`Going from the third term to the fifth term is two multiplications: $a_5 = a_3 \cdot r^2$, so $625 = 25r^2$, giving $r^2 = 25$ and $r = \pm 5$. Of the choices, $5$ works.`,
  },
  {
    id: "seq-mc-0120-q23",
    mode: "mc",
    standard: "AI-F.IF.3",
    topic: "Recursive sequence — find a term",
    examCitation: "regents-algI-0120-q23",
    part: "I",
    credits: 2,
    prompt: String.raw`A recursively defined sequence is shown below.

$a_1 = 5$

$a_{n+1} = 2a_n - 7$

The value of $a_4$ is`,
    choices: [String.raw`$-9$`, String.raw`$-1$`, String.raw`$8$`, String.raw`$15$`],
    answer: 0,
    explanation: String.raw`$a_2 = 2(5) - 7 = 3$; $a_3 = 2(3) - 7 = -1$; $a_4 = 2(-1) - 7 = -9$.`,
  },
  {
    id: "seq-mc-0622-q24",
    mode: "mc",
    standard: "AI-F.IF.3",
    topic: "Recursive sequence — find a term",
    examCitation: "regents-algI-0622-q24",
    part: "I",
    credits: 2,
    prompt: String.raw`If a sequence is defined recursively as $a_1 = -3$ and $a_n = -3a_{n-1} - 2$, then $a_4$ is`,
    choices: [String.raw`$-107$`, String.raw`$-95$`, String.raw`$55$`, String.raw`$67$`],
    answer: 3,
    explanation: String.raw`$a_2 = -3(-3) - 2 = 7$; $a_3 = -3(7) - 2 = -23$; $a_4 = -3(-23) - 2 = 67$.`,
  },
  {
    id: "seq-mc-0819-q19",
    mode: "mc",
    standard: "AI-F.IF.3",
    topic: "Recursive sequence — find a term",
    examCitation: "regents-algI-0819-q19",
    part: "I",
    credits: 2,
    prompt: String.raw`If $a_1 = 6$ and $a_n = 3 + 2(a_{n-1})^2$, then $a_2$ equals`,
    choices: [String.raw`$75$`, String.raw`$147$`, String.raw`$180$`, String.raw`$900$`],
    answer: 0,
    explanation: String.raw`Substitute $a_1 = 6$: $a_2 = 3 + 2(6)^2 = 3 + 2(36) = 3 + 72 = 75$.`,
  },
  {
    id: "seq-mc-0618-q24",
    mode: "mc",
    standard: "AI-F.IF.3",
    topic: "Recursive sequence — find a term",
    examCitation: "regents-algI-0618-q24",
    part: "I",
    credits: 2,
    prompt: String.raw`If $a_n = n(a_{n-1})$ and $a_1 = 1$, what is the value of $a_5$?`,
    choices: [String.raw`$5$`, String.raw`$20$`, String.raw`$120$`, String.raw`$720$`],
    answer: 2,
    explanation: String.raw`$a_2 = 2(1) = 2$; $a_3 = 3(2) = 6$; $a_4 = 4(6) = 24$; $a_5 = 5(24) = 120$.`,
  },
  {
    id: "seq-mc-0115-q20",
    mode: "mc",
    standard: "AI-F.IF.3",
    topic: "Recursive sequence — find a term",
    examCitation: "regents-algI-0115-q20",
    part: "I",
    credits: 2,
    prompt: String.raw`If a sequence is defined recursively by $f(0) = 2$ and $f(n+1) = -2f(n) + 3$ for $n \geq 0$, then $f(2)$ is equal to`,
    choices: [String.raw`$1$`, String.raw`$-11$`, String.raw`$5$`, String.raw`$17$`],
    answer: 2,
    explanation: String.raw`$f(1) = -2f(0) + 3 = -2(2) + 3 = -1$; $f(2) = -2f(1) + 3 = -2(-1) + 3 = 5$.`,
  },
  {
    id: "seq-mc-0617-q18",
    mode: "mc",
    standard: "AI-F.IF.3",
    topic: "Recursive sequence — terms (range)",
    examCitation: "regents-algI-0617-q18",
    part: "I",
    credits: 2,
    prompt: String.raw`Given the function $f(n)$ defined by the following:

$f(1) = 2$

$f(n) = -5f(n-1) + 2$

Which set could represent the range of the function?`,
    choices: [
      String.raw`$\{2, 4, 6, 8, \ldots\}$`,
      String.raw`$\{2, -8, 42, -208, \ldots\}$`,
      String.raw`$\{-8, -42, -208, 1042, \ldots\}$`,
      String.raw`$\{-10, 50, -250, 1250, \ldots\}$`,
    ],
    answer: 1,
    explanation: String.raw`$f(1) = 2$; $f(2) = -5(2) + 2 = -8$; $f(3) = -5(-8) + 2 = 42$; $f(4) = -5(42) + 2 = -208$. The terms are $\{2, -8, 42, -208, \ldots\}$.`,
  },
  {
    id: "seq-mc-0123-q17",
    mode: "mc",
    standard: "AI-F.IF.3",
    topic: "Geometric sequence — find a term",
    examCitation: "regents-algI-0123-q17",
    part: "I",
    credits: 2,
    prompt: String.raw`In a geometric sequence, the first term is $4$ and the common ratio is $-3$. The fifth term of this sequence is`,
    choices: [String.raw`$324$`, String.raw`$108$`, String.raw`$-108$`, String.raw`$-324$`],
    answer: 0,
    explanation: String.raw`The fifth term is $a_5 = a_1 \cdot r^4 = 4 \cdot (-3)^4 = 4 \cdot 81 = 324$. The exponent $4$ is even, so the result is positive.`,
  },
  {
    id: "seq-mc-0124-q4",
    mode: "mc",
    standard: "AI-F.IF.3",
    topic: "Geometric sequence — find a term",
    examCitation: "regents-algI-0124-q4",
    part: "I",
    credits: 2,
    prompt: String.raw`The eleventh term of the sequence $3, 6, 12, 24, \ldots$ is`,
    choices: [String.raw`$-3072$`, String.raw`$6144$`, String.raw`$3072$`, String.raw`$-6144$`],
    answer: 2,
    explanation: String.raw`The sequence is geometric with $a_1 = 3$ and $r = 2$, so $a_n = 3 \cdot 2^{\,n-1}$. Then $a_{11} = 3 \cdot 2^{10} = 3 \cdot 1024 = 3072$.`,
  },

  // ── AI-F.BF.2 — write/identify recursive & explicit rules; translate between them ──
  {
    id: "seq-mc-0116-q18",
    mode: "mc",
    standard: "AI-F.BF.2",
    topic: "Write a recursive formula from a sequence",
    examCitation: "regents-algI-0116-q18",
    part: "I",
    credits: 2,
    prompt: String.raw`Which recursively defined function represents the sequence $3, 7, 15, 31, \ldots$?`,
    choices: [
      String.raw`$f(1) = 3,\ f(n+1) = 2f(n) + 3$`,
      String.raw`$f(1) = 3,\ f(n+1) = 2f(n) - 1$`,
      String.raw`$f(1) = 3,\ f(n+1) = 2f(n) + 1$`,
      String.raw`$f(1) = 3,\ f(n+1) = 3f(n) - 2$`,
    ],
    answer: 2,
    explanation: String.raw`Each term is twice the previous term plus $1$: $2(3) + 1 = 7$, $2(7) + 1 = 15$, $2(15) + 1 = 31$. So $f(n+1) = 2f(n) + 1$ with $f(1) = 3$.`,
  },
  {
    id: "seq-mc-0117-q8",
    mode: "mc",
    standard: "AI-F.BF.2",
    topic: "Write a recursive formula from a context",
    examCitation: "regents-algI-0117-q8",
    part: "I",
    credits: 2,
    prompt: String.raw`In 2014, the cost to mail a letter was $49$¢ for up to one ounce. Every additional ounce cost $21$¢. Which recursive function could be used to determine the cost of a $3$-ounce letter, in cents?`,
    choices: [
      String.raw`$a_1 = 49;\ a_n = a_{n-1} + 21$`,
      String.raw`$a_1 = 0;\ a_n = 49a_{n-1} + 21$`,
      String.raw`$a_1 = 21;\ a_n = a_{n-1} + 49$`,
      String.raw`$a_1 = 0;\ a_n = 21a_{n-1} + 49$`,
    ],
    answer: 0,
    explanation: String.raw`The first ounce costs $49$¢, so $a_1 = 49$. Each additional ounce adds $21$¢, so $a_n = a_{n-1} + 21$.`,
  },
  {
    id: "seq-mc-0123-q21",
    mode: "mc",
    standard: "AI-F.BF.2",
    topic: "Translate a recursive rule to a list of terms",
    examCitation: "regents-algI-0123-q21",
    part: "I",
    credits: 2,
    prompt: String.raw`Which representation yields the same outcome as the sequence defined recursively below?

$a_1 = 3$

$a_n = -4 + a_{n-1}$`,
    choices: [
      String.raw`$3, 7, 11, 15, 19, \ldots$`,
      String.raw`$3, -1, -5, -9, -13, \ldots$`,
      String.raw`$a_n = 4n - 1$`,
      String.raw`$a_n = 4 - n$`,
    ],
    answer: 1,
    explanation: String.raw`The rule adds $-4$ each step (common difference $-4$): $3,\ 3 - 4 = -1,\ -1 - 4 = -5,\ -5 - 4 = -9,\ -9 - 4 = -13$.`,
  },
  {
    id: "seq-mc-0119-q19",
    mode: "mc",
    standard: "AI-F.BF.2",
    topic: "Identify the recursive rule of a sequence",
    examCitation: "regents-algI-0119-q19",
    part: "I",
    credits: 2,
    prompt: String.raw`Which function could be used to represent the sequence $8, 20, 50, 125, 312.5, \ldots$, given that $a_1 = 8$?`,
    choices: [
      String.raw`$a_n = a_{n-1} + a_1$`,
      String.raw`$a_n = 2.5(a_{n-1})$`,
      String.raw`$a_n = a_1 + 1.5(a_{n-1})$`,
      String.raw`$a_n = a_1(a_{n-1})$`,
    ],
    answer: 1,
    explanation: String.raw`The sequence is geometric with ratio $r = \dfrac{20}{8} = 2.5$, so each term is $2.5$ times the previous one: $a_n = 2.5(a_{n-1})$.`,
  },
  {
    id: "seq-mc-0623-q21",
    mode: "mc",
    standard: "AI-F.BF.2",
    topic: "Write a recursive formula from a context",
    examCitation: "regents-algI-0623-q21",
    part: "I",
    credits: 2,
    prompt: String.raw`A father makes a deal with his son regarding his weekly allowance. The first year, he agrees to pay his son a weekly allowance of \$10. Every subsequent year, the allowance is recalculated by doubling the previous year's weekly allowance and then subtracting $8$. Which recursive formula could be used to calculate the son's weekly allowance in future years?`,
    choices: [
      String.raw`$a_n = 2n - 8$`,
      String.raw`$a_n = 2(n-1) - 8$`,
      String.raw`$a_1 = 10,\ a_{n+1} = 2a_n - 8$`,
      String.raw`$a_1 = 10,\ a_{n+1} = 2(a_n - 8)$`,
    ],
    answer: 2,
    explanation: String.raw`"Doubling the previous amount" is $2a_n$, and "then subtracting $8$" gives $2a_n - 8$. With the first-year amount $a_1 = 10$, the recursive rule is $a_{n+1} = 2a_n - 8$.`,
  },
  {
    id: "seq-mc-0823-q19",
    mode: "mc",
    standard: "AI-F.BF.2",
    topic: "Write a recursive formula from a context",
    examCitation: "regents-algI-0823-q19",
    part: "I",
    credits: 2,
    prompt: String.raw`Jack started a new fitness program. The first day he did $10$ push-ups. The program required him to increase the number of push-ups each day by doing $9$ less than twice the number from the previous day. Which recursive formula correctly models Jack's new program, where $n$ is the number of days and $a_n$ is the number of push-ups on the $n$th day?`,
    choices: [
      String.raw`$a_1 = 10,\ a_n = 2a_{n-1} - 9$`,
      String.raw`$a_1 = 10,\ a_n = 9 - 2a_{n-1}$`,
      String.raw`$a_1 = 10,\ a_n = 2(n-1) - 9$`,
      String.raw`$a_1 = 10,\ a_n = 9 - 2(n-1)$`,
    ],
    answer: 0,
    explanation: String.raw`"Twice the number from the previous day" is $2a_{n-1}$, and "$9$ less than" that is $2a_{n-1} - 9$. With $a_1 = 10$, the model is $a_n = 2a_{n-1} - 9$.`,
  },
  {
    id: "seq-mc-0816-q10",
    mode: "mc",
    standard: "AI-F.BF.2",
    topic: "Write an explicit formula for a sequence",
    examCitation: "regents-algI-0816-q10",
    part: "I",
    credits: 2,
    prompt: String.raw`Which function defines the sequence $-6, -10, -14, -18, \ldots$, where $f(6) = -26$?`,
    choices: [
      String.raw`$f(x) = -4x - 2$`,
      String.raw`$f(x) = 4x - 2$`,
      String.raw`$f(x) = -x + 32$`,
      String.raw`$f(x) = x - 26$`,
    ],
    answer: 0,
    explanation: String.raw`The common difference is $-4$, so $f(x) = -4x + b$. Since $f(1) = -6$, $-4(1) + b = -6$ gives $b = -2$. Check: $f(6) = -4(6) - 2 = -26$. So $f(x) = -4x - 2$.`,
  },
  {
    id: "seq-mc-0614-q21",
    mode: "mc",
    standard: "AI-F.BF.2",
    topic: "Match explicit & recursive rules to a context",
    examCitation: "regents-algI-0614-q21",
    part: "I",
    credits: 2,
    prompt: String.raw`A sunflower is $3$ inches tall at week $0$ and grows $2$ inches each week. Which function(s) shown below can be used to determine the height, $f(n)$, of the sunflower in $n$ weeks?

I. $f(n) = 2n + 3$

II. $f(n) = 2n + 3(n - 1)$

III. $f(n) = f(n - 1) + 2$ where $f(0) = 3$`,
    choices: ["I and II", "II, only", "III, only", "I and III"],
    answer: 3,
    explanation: String.raw`Explicit rule I gives $f(0) = 3$, $f(1) = 5$, $f(2) = 7, \ldots$ — correct. Recursive rule III starts at $f(0) = 3$ and adds $2$ each week — also correct. Rule II gives $f(1) = 2$, which is wrong. So I and III.`,
  },

  // ── Constructed-response (self-score against the official Rating Guide) ──
  {
    id: "seq-cr-0123-q28",
    mode: "self-score",
    standard: "AI-F.IF.3",
    topic: "Arithmetic sequence — determine the common difference",
    examCitation: "regents-algI-0123-q28",
    part: "II",
    credits: 2,
    prompt: String.raw`Determine the common difference of the arithmetic sequence in which $a_1 = 3$ and $a_4 = 15$.`,
    answerSummary: String.raw`$d = 4$`,
    modelSolution: String.raw`From the first term to the fourth term is $3$ steps: $a_4 = a_1 + 3d$, so $15 = 3 + 3d$. Then $3d = 12$ and $d = 4$.`,
    rubric: [
      { credits: 2, criteria: String.raw`$4$, and correct work is shown.` },
      { credits: 1, criteria: "Appropriate work is shown, but one computational error is made. OR Appropriate work is shown, but one conceptual error is made. OR 4, but no work is shown." },
      { credits: 0, criteria: "A zero response does not contain enough relevant course-level work to receive any credit, does not satisfy the criteria for one or more credits, or is a correct response that was obtained by an obviously incorrect procedure." },
    ],
  },
  {
    id: "seq-cr-0817-q26",
    mode: "self-score",
    standard: "AI-F.IF.3",
    topic: "Identify exponential (geometric) behavior",
    examCitation: "regents-algI-0817-q26",
    part: "II",
    credits: 2,
    prompt: String.raw`Determine and state whether the sequence $1, 3, 9, 27, \ldots$ displays exponential behavior. Explain how you arrived at your decision.`,
    answerSummary: String.raw`Yes — the sequence has a common ratio of $3$.`,
    modelSolution: String.raw`Yes. Each term is $3$ times the previous term: $3 \div 1 = 3$, $9 \div 3 = 3$, and $27 \div 9 = 3$. A constant common ratio means the sequence is geometric, which is exponential behavior.`,
    rubric: [
      { credits: 2, criteria: "A correct explanation indicating a positive response is written." },
      { credits: 1, criteria: "Appropriate work is shown, but one computational error is made. OR Appropriate work is shown, but one conceptual error is made. OR An incomplete explanation is written." },
      { credits: 0, criteria: "Yes, but no explanation is written. OR A zero response is completely incorrect, irrelevant, or incoherent or is a correct response that was obtained by an obviously incorrect procedure." },
    ],
  },
  {
    id: "seq-cr-0619-q31",
    mode: "self-score",
    standard: "AI-F.IF.3",
    topic: "Recursive sequence — state several terms",
    examCitation: "regents-algI-0619-q31",
    part: "II",
    credits: 2,
    prompt: String.raw`Given the recursive formula:

$a_1 = 3$

$a_n = 2(a_{n-1} + 1)$

State the values of $a_2$, $a_3$, and $a_4$ for the given recursive formula.`,
    answerSummary: String.raw`$a_2 = 8$, $a_3 = 18$, $a_4 = 38$`,
    modelSolution: String.raw`$a_2 = 2(a_1 + 1) = 2(3 + 1) = 8$; $a_3 = 2(a_2 + 1) = 2(8 + 1) = 18$; $a_4 = 2(a_3 + 1) = 2(18 + 1) = 38$.`,
    rubric: [
      { credits: 2, criteria: String.raw`$8, 18, 38$ are stated.` },
      { credits: 1, criteria: "Appropriate work is shown, but one computational error is made. OR Appropriate work is shown, but one conceptual error is made." },
      { credits: 0, criteria: "A zero response is completely incorrect, irrelevant, or incoherent or is a correct response that was obtained by an obviously incorrect procedure." },
    ],
  },
  {
    id: "seq-cr-0818-q32",
    mode: "self-score",
    standard: "AI-F.BF.2",
    topic: "Recursive sequence — write the first five terms",
    examCitation: "regents-algI-0818-q32",
    part: "II",
    credits: 2,
    prompt: String.raw`Write the first five terms of the recursive sequence defined below.

$a_1 = 0$

$a_n = 2(a_{n-1})^2 - 1$, for $n > 1$`,
    answerSummary: String.raw`$0, -1, 1, 1, 1$`,
    modelSolution: String.raw`$a_1 = 0$; $a_2 = 2(0)^2 - 1 = -1$; $a_3 = 2(-1)^2 - 1 = 1$; $a_4 = 2(1)^2 - 1 = 1$; $a_5 = 2(1)^2 - 1 = 1$.`,
    rubric: [
      { credits: 2, criteria: String.raw`$0, -1, 1, 1, 1$.` },
      { credits: 1, criteria: String.raw`Appropriate work is shown, but one computational error is made. OR Appropriate work is shown, but one conceptual error is made. OR The sequence is stated as $-1, 1, 1, 1, 1$.` },
      { credits: 0, criteria: "A zero response is completely incorrect, irrelevant, or incoherent or is a correct response that was obtained by an obviously incorrect procedure." },
    ],
  },
  {
    id: "seq-cr-0625-q28",
    mode: "self-score",
    standard: "AI-F.IF.3",
    topic: "Arithmetic sequence — find a term",
    examCitation: "regents-algI-0625-q28",
    part: "II",
    credits: 2,
    prompt: String.raw`The first and fourth terms in an arithmetic sequence are given below.

$-20,\ \square,\ \square,\ -2$

Determine the eighth term.`,
    answerSummary: String.raw`$a_8 = 22$`,
    modelSolution: String.raw`From the first term to the fourth term is $3$ steps: $d = \dfrac{a_4 - a_1}{4 - 1} = \dfrac{-2 - (-20)}{3} = \dfrac{18}{3} = 6$. Then $a_8 = a_1 + 7d = -20 + 7(6) = -20 + 42 = 22$.`,
    rubric: [
      { credits: 2, criteria: String.raw`$22$, and correct work is shown.` },
      { credits: 1, criteria: String.raw`Appropriate work is shown, but one computational error is made. OR Appropriate work is shown, but one conceptual error is made. OR The common difference of $6$ is stated, but no further correct work is shown. OR $22$, but no work is shown.` },
      { credits: 0, criteria: "A zero response does not contain enough relevant course-level work to receive any credit, does not satisfy the criteria for one or more credits, or is a correct response that was obtained by an obviously incorrect procedure." },
    ],
  },
  {
    id: "seq-cr-0823-q30",
    mode: "self-score",
    standard: "AI-F.IF.3",
    topic: "Arithmetic sequence — common difference & nth term",
    examCitation: "regents-algI-0823-q30",
    part: "II",
    credits: 2,
    prompt: String.raw`Determine the common difference of the arithmetic sequence in which $a_1 = 5$ and $a_5 = 17$. Determine the 21st term of this sequence.`,
    answerSummary: String.raw`$d = 3$; the 21st term is $65$.`,
    modelSolution: String.raw`$d = \dfrac{a_5 - a_1}{5 - 1} = \dfrac{17 - 5}{4} = 3$. Then $a_{21} = a_1 + (21 - 1)d = 5 + 20(3) = 65$.`,
    rubric: [
      { credits: 2, criteria: String.raw`$3$ and $65$, and correct work is shown.` },
      { credits: 1, criteria: String.raw`Appropriate work is shown, but one computational error is made. OR Appropriate work is shown, but one conceptual error is made. OR Appropriate work is shown to find $3$ or $65$. OR $3$ and $65$, but no work is shown.` },
      { credits: 0, criteria: "A zero response does not contain enough relevant course-level work to receive any credit, does not satisfy the criteria for one or more credits, or is a correct response that was obtained by an obviously incorrect procedure." },
    ],
  },
  {
    id: "seq-cr-0825-q29",
    mode: "self-score",
    standard: "AI-F.IF.3",
    topic: "Geometric sequence — find a term",
    examCitation: "regents-algI-0825-q29",
    part: "II",
    credits: 2,
    prompt: String.raw`Determine the 8th term of a geometric sequence whose first term is $5$ and whose common ratio is $3$.`,
    answerSummary: String.raw`$a_8 = 10{,}935$`,
    modelSolution: String.raw`Use $a_n = a_1 \cdot r^{\,n-1}$ with $a_1 = 5$ and $r = 3$: $a_8 = 5(3)^{7} = 5(2187) = 10{,}935$.`,
    rubric: [
      { credits: 2, criteria: String.raw`$10{,}935$, and correct work is shown.` },
      { credits: 1, criteria: String.raw`Appropriate work is shown, but one computational error is made. OR Appropriate work is shown, but one conceptual error is made. OR $a_n = 5(3)^{n-1}$ or the expression $5(3)^{n-1}$ is written, but no further correct work is shown. OR $10{,}935$, but no work is shown.` },
      { credits: 0, criteria: "A zero response does not contain enough relevant course-level work to receive any credit, does not satisfy the criteria for one or more credits, or is a correct response that was obtained by an obviously incorrect procedure." },
    ],
  },
];

export default bank;
