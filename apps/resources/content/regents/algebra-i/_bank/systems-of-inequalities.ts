// Authored Regents problem-bank — Graphing Inequalities & Systems (AI-A.REI.12):
// the solution set of a linear inequality in two variables as a half-plane, and
// the solution of a SYSTEM of linear inequalities as the overlap of half-planes
// — testing whether a point is a solution, graphing an inequality/system, and
// reading a solution from the overlap. Real released Algebra I Regents questions
// mined from the official NYSED administrations (via JMAP), cited to the exam +
// question number. Every answer independently re-derived; signs verified against
// the source PDFs (boundary lines, solid-vs-dashed, and shaded side all checked).
// Every self-score rubric is transcribed verbatim from the official NYSED Rating
// Guide; the few whose specific Rating Guide is not yet publicly posted reuse the
// verbatim, administration-invariant NYSED graphing-system template (noted inline).
// SME-ratified.
//
// NOTE ON COVERAGE: A.REI.12 is a figure-heavy standard. The vast majority of its
// multiple-choice items present the inequality/system AS a graph (or use graphs as
// the four answer choices), which cannot be reproduced faithfully here (the figure
// renderer has no half-plane shading). We therefore include only the text-verifiable
// MC items and lean on the rich pool of constructed-response graphing items, whose
// systems are fully specified in text and whose model solutions are independently
// derived and verified by substitution.

import type { RegentsItem, RubricLevel } from "@/lib/regents/bank";

const ZERO = String.raw`A zero response is completely incorrect, irrelevant, or incoherent or is a correct response that was obtained by an obviously incorrect procedure.`;

// Administration-invariant NYSED 4-credit templates (used verbatim across many
// released items). Applied to items whose specific Rating Guide is not yet posted.
const STATE_A_POINT_4: RubricLevel[] = [
  { credits: 4, criteria: String.raw`The system of inequalities is graphed correctly and at least one is labeled, a correct point is stated, and a correct justification is given.` },
  { credits: 3, criteria: String.raw`Appropriate work is shown, but one computational, graphing, or labeling error is made. OR Appropriate work is shown, but the justification is missing or incorrect. OR One inequality is graphed incorrectly, but the system is used appropriately.` },
  { credits: 2, criteria: String.raw`The system of inequalities is graphed correctly and at least one is labeled, but no further correct work is shown. OR A correct point is stated and a correct justification is given, but no further correct work is shown.` },
  { credits: 1, criteria: String.raw`One inequality is graphed and labeled correctly, but no further correct work is shown. OR A correct point is stated, but no further correct work is shown.` },
  { credits: 0, criteria: ZERO },
];

const IS_IT_A_SOLUTION_NEGATIVE_4: RubricLevel[] = [
  { credits: 4, criteria: String.raw`The system of inequalities is graphed correctly and at least one is labeled, and a correct explanation indicating a negative response is written.` },
  { credits: 3, criteria: String.raw`Appropriate work is shown, but one computational, graphing, or labeling error is made. OR Appropriate work is shown, but the explanation is incomplete.` },
  { credits: 2, criteria: String.raw`Appropriate work is shown, but two or more computational, graphing, or labeling errors are made. OR The system of inequalities is graphed correctly and at least one is labeled, but no further correct work is shown. OR A correct explanation indicating a negative response is written, but no further correct work is shown.` },
  { credits: 1, criteria: String.raw`One inequality is graphed correctly, but no further correct work is shown. OR A correct explanation is written, but no further correct work is shown.` },
  { credits: 0, criteria: ZERO },
];

const bank: RegentsItem[] = [
  // ——————————————————————— Part I multiple choice ———————————————————————

  {
    id: "soi-mc-0117-q16",
    mode: "mc",
    standard: "AI-A.REI.12",
    topic: "Systems of linear inequalities — testing a point",
    examCitation: "regents-algI-0117-q16",
    part: "I",
    credits: 2,
    prompt: String.raw`Which point is a solution to the system below?
$$2y < -12x + 4$$
$$y < -6x + 4$$`,
    choices: [
      String.raw`$\left(1, \tfrac{1}{2}\right)$`,
      String.raw`$(0, 6)$`,
      String.raw`$\left(-\tfrac{1}{2}, 5\right)$`,
      String.raw`$(-3, 2)$`,
    ],
    answer: 3,
    explanation: String.raw`A point solves the system only if it satisfies BOTH inequalities. Test $(-3, 2)$: in $2y < -12x + 4$, $2(2) = 4$ and $-12(-3) + 4 = 40$, and $4 < 40$ ✓; in $y < -6x + 4$, $-6(-3) + 4 = 22$, and $2 < 22$ ✓. Each other point fails at least one inequality, so $(-3, 2)$ is the only solution.`,
  },
  {
    id: "soi-mc-0118-q20",
    mode: "mc",
    standard: "AI-A.REI.12",
    topic: "Systems — equations vs. inequalities: number of solutions",
    examCitation: "regents-algI-0118-q20",
    part: "I",
    credits: 2,
    prompt: String.raw`First consider the system of equations $y = -\tfrac{1}{2}x + 1$ and $y = x - 5$. Then consider the system of inequalities $y > -\tfrac{1}{2}x + 1$ and $y < x - 5$. When comparing the number of solutions in each of these systems, which statement is true?`,
    choices: [
      String.raw`Both systems have an infinite number of solutions.`,
      String.raw`The system of equations has more solutions.`,
      String.raw`The system of inequalities has more solutions.`,
      String.raw`Both systems have only one solution.`,
    ],
    answer: 2,
    explanation: String.raw`The two lines are not parallel (slopes $-\tfrac{1}{2}$ and $1$), so they cross at exactly one point — the system of EQUATIONS has $1$ solution. The system of INEQUALITIES describes a whole region (every point above $y = -\tfrac{1}{2}x + 1$ AND below $y = x - 5$), which is an infinite set of points. Since infinitely many $>$ one, the system of inequalities has more solutions.`,
  },

  // —————————————————— Part II constructed-response (2 credits) ——————————————————

  {
    id: "soi-cr-0815-q26",
    mode: "self-score",
    standard: "AI-A.REI.12",
    topic: "Graphing a linear inequality (half-plane)",
    examCitation: "regents-algI-0815-q26",
    part: "II",
    credits: 2,
    prompt: String.raw`On the set of axes provided, graph the inequality $2x + y > 1$.`,
    answerSummary: String.raw`Dashed boundary line $y = -2x + 1$, with the region ABOVE the line shaded.`,
    modelSolution: String.raw`Solve for $y$: $2x + y > 1 \Rightarrow y > -2x + 1$. Graph the boundary line $y = -2x + 1$ (slope $-2$, $y$-intercept $1$) as a DASHED line, because the inequality is strict ($>$). Since $y$ is GREATER than the line, shade the half-plane ABOVE it. Check with a point not on the line, e.g. $(0, 5)$: $2(0) + 5 = 5 > 1$ ✓, so the side containing $(0,5)$ is correctly shaded.`,
    rubric: [
      { credits: 2, criteria: String.raw`The inequality is graphed correctly.` },
      { credits: 1, criteria: String.raw`Appropriate work is shown, but one computational or graphing error is made. OR Appropriate work is shown, but one conceptual error is made.` },
      { credits: 0, criteria: ZERO },
    ],
  },
  {
    id: "soi-cr-0117-q29",
    mode: "self-score",
    standard: "AI-A.REI.12",
    topic: "Graphing a linear inequality and stating a solution point",
    examCitation: "regents-algI-0117-q29",
    part: "II",
    credits: 2,
    prompt: String.raw`Graph the inequality $y > 2x - 5$ on the set of axes provided. State the coordinates of a point in its solution.`,
    answerSummary: String.raw`Dashed line $y = 2x - 5$, shaded above; e.g. $(0, 0)$ is in the solution.`,
    modelSolution: String.raw`Graph the boundary line $y = 2x - 5$ (slope $2$, $y$-intercept $-5$) as a DASHED line (strict $>$). Because $y$ is GREATER than the line, shade ABOVE it. Any point in the shaded region works; for example $(0, 0)$: $0 > 2(0) - 5 = -5$ ✓. State $(0, 0)$.`,
    rubric: [
      { credits: 2, criteria: String.raw`The inequality is graphed correctly, and correct coordinates are stated.` },
      { credits: 1, criteria: String.raw`Appropriate work is shown, but one graphing error is made. OR Appropriate work is shown, but one conceptual error is made. OR The inequality is graphed correctly, but the coordinates are missing or incorrect. OR The coordinates of a point in the solution set are stated and checked, but no graph is drawn.` },
      { credits: 0, criteria: ZERO },
    ],
  },
  {
    id: "soi-cr-0617-q30",
    mode: "self-score",
    standard: "AI-A.REI.12",
    topic: "Graphing a linear inequality (simplify first)",
    examCitation: "regents-algI-0617-q30",
    part: "II",
    credits: 2,
    prompt: String.raw`Graph the inequality $y + 4 < -2(x - 4)$ on the set of axes provided.`,
    answerSummary: String.raw`Dashed line $y = -2x + 4$, with the region BELOW shaded.`,
    modelSolution: String.raw`Simplify: $y + 4 < -2x + 8 \Rightarrow y < -2x + 4$. Graph the boundary line $y = -2x + 4$ (slope $-2$, $y$-intercept $4$) as a DASHED line (strict $<$), and shade the region BELOW it. Check $(0, 0)$: $0 < -2(0) + 4 = 4$ ✓, so the side with $(0,0)$ is shaded.`,
    rubric: [
      { credits: 2, criteria: String.raw`The inequality is graphed and shaded correctly.` },
      { credits: 1, criteria: String.raw`Appropriate work is shown, but one computational or graphing error is made. OR Appropriate work is shown, but one conceptual error is made.` },
      { credits: 0, criteria: String.raw`$y + 4 = -2(x - 4)$ is graphed correctly, but no further correct work is shown. OR ${ZERO}` },
    ],
  },

  // —————————————————— Part III constructed-response (4 credits) ——————————————————

  {
    id: "soi-cr-0816-q34",
    mode: "self-score",
    standard: "AI-A.REI.12",
    topic: "Diagnosing an error in graphing an inequality",
    examCitation: "regents-algI-0816-q34",
    part: "III",
    credits: 4,
    prompt: String.raw`Shawn incorrectly graphed the inequality $-x - 2y \ge 8$: he drew the correct boundary line but shaded the region ABOVE it. Explain Shawn's mistake, and describe the correct graph of the inequality.`,
    answerSummary: String.raw`Shawn did not reverse the inequality symbol when he divided by $-2$, so he shaded the wrong side. The correct graph is a SOLID line $y = -\tfrac{1}{2}x - 4$ with the region BELOW it shaded.`,
    modelSolution: String.raw`Solve for $y$: $-x - 2y \ge 8 \Rightarrow -2y \ge x + 8$. Dividing both sides by $-2$ REVERSES the inequality: $y \le -\tfrac{1}{2}x - 4$. The boundary line $y = -\tfrac{1}{2}x - 4$ (slope $-\tfrac{1}{2}$, $y$-intercept $-4$) is SOLID because of $\le$, and the solution is the region BELOW it. Shawn's mistake: he forgot to reverse the inequality symbol when dividing by the negative number $-2$, so he shaded ABOVE the line instead of below it. Check: $(0,0)$ gives $-0 - 2(0) = 0 \ge 8$, which is false, so $(0,0)$ should NOT be shaded — and $(0,0)$ lies above the line, confirming the solution is below.`,
    rubric: [
      { credits: 4, criteria: String.raw`A correct explanation is written and a correct graph is drawn.` },
      { credits: 3, criteria: String.raw`Appropriate work is shown, but one computational or graphing error is made. OR Appropriate work is shown, but the explanation is incomplete.` },
      { credits: 2, criteria: String.raw`Appropriate work is shown, but two or more computational or graphing errors are made. OR Appropriate work is shown, but one conceptual error is made. OR The explanation is incomplete and one graphing error is made. OR A correct explanation is written, but no graph is drawn. OR A correct graph is drawn, but no explanation is written.` },
      { credits: 1, criteria: String.raw`No explanation is written, and one graphing error is made. OR An incomplete explanation is written, and no graph is drawn.` },
      { credits: 0, criteria: ZERO },
    ],
  },
  {
    id: "soi-cr-0119-q35",
    mode: "self-score",
    standard: "AI-A.REI.12",
    topic: "Modeling a real-world constraint with a linear inequality",
    examCitation: "regents-algI-0119-q35",
    part: "III",
    credits: 4,
    prompt: String.raw`Myranda received a movie gift card for \$100 to her local theater. Matinee tickets cost \$7.50 each and evening tickets cost \$12.50 each. If $x$ represents the number of matinee tickets and $y$ the number of evening tickets she could purchase, write an inequality that represents all the possible ways Myranda could spend her gift card, and graph this inequality. What is the maximum number of matinee tickets Myranda could purchase with her gift card? Explain your answer.`,
    answerSummary: String.raw`$7.50x + 12.50y \le 100$; the maximum number of matinee tickets is $13$.`,
    modelSolution: String.raw`Total spent cannot exceed the \$100 card: $7.50x + 12.50y \le 100$ (with $x \ge 0$ and $y \ge 0$). Graph the boundary line $7.50x + 12.50y = 100$ as a SOLID line ($\le$) and shade BELOW it (toward the origin). The maximum number of matinee tickets occurs when she buys no evening tickets, $y = 0$: $7.50x \le 100 \Rightarrow x \le 13.\overline{3}$. Since $x$ must be a whole number, the maximum is $13$, because $7.50(13) = 97.50 \le 100$ while $7.50(14) = 105 > 100$.`,
    rubric: [
      { credits: 4, criteria: String.raw`$7.50x + 12.50y \le 100$ is stated and graphed correctly, $13$, and a correct explanation is written.` },
      { credits: 3, criteria: String.raw`Appropriate work is shown, but one computational or graphing error is made. OR Appropriate work is shown, but the explanation is missing or incorrect.` },
      { credits: 2, criteria: String.raw`Appropriate work is shown, but two or more computational or graphing errors are made. OR $7.50x + 12.50y \le 100$ is stated and graphed correctly, but no further correct work is shown. OR $13$, and a correct explanation is written, but no further correct work is shown.` },
      { credits: 1, criteria: String.raw`$7.50x + 12.50y \le 100$ is written, but no further correct work is shown. OR $13$ is stated, but no further correct work is shown.` },
      { credits: 0, criteria: ZERO },
    ],
  },
  {
    id: "soi-cr-0123-q36",
    mode: "self-score",
    standard: "AI-A.REI.12",
    topic: "Graphing a system of inequalities and stating a solution",
    examCitation: "regents-algI-0123-q36",
    part: "III",
    credits: 4,
    prompt: String.raw`Graph the following system of inequalities on the set of axes provided:
$$3y - 9 \le 12$$
$$y < -2x - 4$$
State the coordinates of a point that satisfies both inequalities. Justify your answer.`,
    answerSummary: String.raw`E.g. $(-3, 0)$ is in the solution set.`,
    modelSolution: String.raw`First inequality: $3y - 9 \le 12 \Rightarrow 3y \le 21 \Rightarrow y \le 7$ — a SOLID horizontal line $y = 7$ with everything below it shaded. Second inequality: $y < -2x - 4$ — a DASHED line $y = -2x - 4$ (slope $-2$, $y$-intercept $-4$) with the region below it shaded. The solution is the overlap. Pick a point in that overlap, e.g. $(-3, 0)$: $3(0) - 9 = -9 \le 12$ ✓ and $0 < -2(-3) - 4 = 2$ ✓.`,
    rubric: [
      { credits: 4, criteria: String.raw`Both inequalities are graphed correctly, and at least one is labeled, a correct point in the solution is stated, and a correct justification is given.` },
      { credits: 3, criteria: String.raw`Appropriate work is shown, but one computational, graphing, or labeling error is made. OR Appropriate work is shown, but the justification is missing or incorrect.` },
      { credits: 2, criteria: String.raw`Both inequalities are graphed correctly, and at least one is labeled, but no further correct work is shown. OR A correct point and justification are given, but no further correct work is shown.` },
      { credits: 1, criteria: String.raw`One inequality is graphed and labeled correctly, but no further correct work is shown. OR A correct point is stated, but no further correct work is shown. OR Both equations are graphed correctly, and at least one is labeled, but no further correct work is shown.` },
      { credits: 0, criteria: String.raw`A zero response does not contain enough relevant course-level work to receive any credit.` },
    ],
  },
  {
    id: "soi-cr-0624-q34",
    mode: "self-score",
    standard: "AI-A.REI.12",
    topic: "Graphing a system of inequalities and stating a solution",
    examCitation: "regents-algI-0624-q34",
    part: "III",
    credits: 4,
    prompt: String.raw`Graph the system of inequalities on the set of axes provided:
$$3y + 2x \le 15$$
$$y - x > 1$$
State the coordinates of a point in the solution to this system. Justify your answer.`,
    answerSummary: String.raw`E.g. $(-1, 1)$ is in the solution set.`,
    modelSolution: String.raw`First: $3y + 2x \le 15 \Rightarrow y \le -\tfrac{2}{3}x + 5$ — a SOLID line, shade BELOW. Second: $y - x > 1 \Rightarrow y > x + 1$ — a DASHED line $y = x + 1$, shade ABOVE. The solution is the overlap. Choose a point there, e.g. $(-1, 1)$: $3(1) + 2(-1) = 1 \le 15$ ✓ and $1 - (-1) = 2 > 1$ ✓.`,
    rubric: [
      { credits: 4, criteria: String.raw`The system of inequalities is graphed correctly and at least one is labeled, a correct point is stated, and a correct justification is given.` },
      { credits: 3, criteria: String.raw`Appropriate work is shown, but one computational, graphing, or labeling error is made. OR Appropriate work is shown, but the justification is missing or incorrect. OR One inequality is graphed incorrectly, but the system is used appropriately.` },
      { credits: 2, criteria: String.raw`The system of inequalities is graphed correctly and at least one is labeled, but no further correct work is shown. OR A correct point is stated and a correct justification is given, but no further correct work is shown.` },
      { credits: 1, criteria: String.raw`One inequality is graphed and labeled correctly, but no further correct work is shown. OR A correct point is stated, but no further correct work is shown. OR $3y + 2x = 15$ and $y - x = 1$ are graphed correctly and at least one is labeled, but no further correct work is shown.` },
      { credits: 0, criteria: ZERO },
    ],
  },
  {
    id: "soi-cr-0825-q33",
    mode: "self-score",
    standard: "AI-A.REI.12",
    topic: "Graphing a system of inequalities and stating a solution",
    examCitation: "regents-algI-0825-q33",
    part: "III",
    credits: 4,
    prompt: String.raw`Graph the following system of inequalities on the set of axes provided:
$$y \ge -\tfrac{1}{2}x - 3$$
$$y - 2x < 5$$
State the coordinates of a point that is in the solution to this system. Justify your answer.`,
    answerSummary: String.raw`E.g. $(0, 0)$ is in the solution set.`,
    modelSolution: String.raw`First: $y \ge -\tfrac{1}{2}x - 3$ — a SOLID line (slope $-\tfrac{1}{2}$, $y$-intercept $-3$), shade ABOVE. Second: $y - 2x < 5 \Rightarrow y < 2x + 5$ — a DASHED line $y = 2x + 5$, shade BELOW. The solution is the overlap. Choose a point there, e.g. $(0, 0)$: $0 \ge -\tfrac{1}{2}(0) - 3 = -3$ ✓ and $0 - 2(0) = 0 < 5$ ✓.`,
    rubric: STATE_A_POINT_4,
  },
  {
    id: "soi-cr-0626-q34",
    mode: "self-score",
    standard: "AI-A.REI.12",
    topic: "Graphing a system of inequalities and stating a solution",
    examCitation: "regents-algI-0626-q34",
    part: "III",
    credits: 4,
    prompt: String.raw`Graph the system of inequalities on the set of axes provided:
$$2y < x - 8$$
$$3x + y \ge 6$$
State the coordinates of a point that satisfies both inequalities. Justify your answer.`,
    answerSummary: String.raw`E.g. $(10, 0)$ satisfies both inequalities.`,
    modelSolution: String.raw`First: $2y < x - 8 \Rightarrow y < \tfrac{1}{2}x - 4$ — a DASHED line (slope $\tfrac{1}{2}$, $y$-intercept $-4$), shade BELOW. Second: $3x + y \ge 6 \Rightarrow y \ge -3x + 6$ — a SOLID line $y = -3x + 6$, shade ABOVE. The solution is the overlap. Choose a point there, e.g. $(10, 0)$: $2(0) = 0 < 10 - 8 = 2$ ✓ and $3(10) + 0 = 30 \ge 6$ ✓.`,
    rubric: STATE_A_POINT_4,
  },
  {
    id: "soi-cr-0823-q36",
    mode: "self-score",
    standard: "AI-A.REI.12",
    topic: "Graphing a system and testing a claimed solution",
    examCitation: "regents-algI-0823-q36",
    part: "III",
    credits: 4,
    prompt: String.raw`Graph the following system of inequalities on the set of axes provided:
$$-2y < 3x + 12$$
$$x \ge -3$$
Label the solution set $S$. Allison thinks that $(2, -9)$ is a solution to this system. Determine if Allison is correct. Justify your answer.`,
    answerSummary: String.raw`Allison is incorrect: $(2, -9)$ lies ON the dashed boundary of $-2y < 3x + 12$, so it is not in the solution set.`,
    modelSolution: String.raw`First: $-2y < 3x + 12$. Dividing by $-2$ reverses the symbol: $y > -\tfrac{3}{2}x - 6$ — a DASHED line, shade ABOVE. Second: $x \ge -3$ — a SOLID vertical line $x = -3$, shade to the RIGHT. Label the overlap $S$. Test $(2, -9)$ in the first inequality: $-2(-9) = 18$ and $3(2) + 12 = 18$, so $18 < 18$ is FALSE — the point sits exactly on the dashed (excluded) boundary. Therefore Allison is incorrect; $(2, -9)$ is not in the solution set.`,
    rubric: [
      { credits: 4, criteria: String.raw`The system of inequalities is graphed correctly and at least one is labeled, the solution set is labeled $S$, and a correct justification indicating a negative response is given.` },
      { credits: 3, criteria: String.raw`Appropriate work is shown, but one computational, graphing, or labeling error is made. OR Appropriate work is shown, but the solution set is not labeled $S$. OR Appropriate work is shown, but the justification is missing or incorrect. OR One inequality is graphed incorrectly, but the system is used appropriately.` },
      { credits: 2, criteria: String.raw`Both inequalities are graphed correctly, and at least one is labeled, but no further correct work is shown.` },
      { credits: 1, criteria: String.raw`One inequality is graphed and labeled correctly, but no further correct work is shown. OR A correct justification is given, but no further correct work is shown. OR $-2y = 3x + 12$ and $x = -3$ are graphed correctly, and at least one is labeled, but no further correct work is shown.` },
      { credits: 0, criteria: ZERO },
    ],
  },
  {
    id: "soi-cr-0824-q32",
    mode: "self-score",
    standard: "AI-A.REI.12",
    topic: "Graphing a system and testing a claimed solution",
    examCitation: "regents-algI-0824-q32",
    part: "III",
    credits: 4,
    prompt: String.raw`Graph the system of inequalities on the set of axes provided:
$$y > 3x - 4$$
$$x + 2y \le 6$$
Label the solution set $S$. Is the point $(2, 2)$ a solution to the system? Justify your answer.`,
    answerSummary: String.raw`No: $(2, 2)$ lies ON the dashed boundary $y = 3x - 4$, so it is not a solution.`,
    modelSolution: String.raw`First: $y > 3x - 4$ — a DASHED line (slope $3$, $y$-intercept $-4$), shade ABOVE. Second: $x + 2y \le 6 \Rightarrow y \le -\tfrac{1}{2}x + 3$ — a SOLID line, shade BELOW. Label the overlap $S$. Test $(2, 2)$ in the first inequality: $3(2) - 4 = 2$, so $2 > 2$ is FALSE (the point is on the dashed, excluded boundary). Therefore $(2, 2)$ is NOT a solution.`,
    rubric: [
      { credits: 4, criteria: String.raw`Both inequalities are graphed correctly and at least one is labeled, the solution is labeled $S$, and a correct justification indicating a negative response is given.` },
      { credits: 3, criteria: String.raw`Appropriate work is shown, but one computational, graphing, or labeling error is made. OR Appropriate work is shown, but the solution is not labeled $S$. OR Appropriate work is shown, but the justification is missing or incorrect. OR One inequality is graphed incorrectly, but the system is used appropriately.` },
      { credits: 2, criteria: String.raw`Both inequalities are graphed correctly with at least one labeled, but no further correct work is shown.` },
      { credits: 1, criteria: String.raw`A correct justification is given, but no further correct work is shown. OR One inequality is graphed and labeled correctly, but no further correct work is shown. OR $y = 3x - 4$ and $x + 2y = 6$ are graphed correctly, and at least one is labeled, but no further correct work is shown.` },
      { credits: 0, criteria: ZERO },
    ],
  },
  {
    id: "soi-cr-0124-q36",
    mode: "self-score",
    standard: "AI-A.REI.12",
    topic: "Graphing a system and testing a claimed solution",
    examCitation: "regents-algI-0124-q36",
    part: "III",
    credits: 4,
    prompt: String.raw`On the set of axes provided, graph the following system of inequalities:
$$2x - y > 4$$
$$x + 3y > 6$$
Label the solution set $S$. Is $(4, 2)$ a solution to this system? Justify your answer.`,
    answerSummary: String.raw`Yes: $(4, 2)$ satisfies both inequalities, so it lies in $S$.`,
    modelSolution: String.raw`First: $2x - y > 4 \Rightarrow y < 2x - 4$ — a DASHED line, shade BELOW. Second: $x + 3y > 6 \Rightarrow y > -\tfrac{1}{3}x + 2$ — a DASHED line, shade ABOVE. Label the overlap $S$. Test $(4, 2)$: $2(4) - 2 = 6 > 4$ ✓ and $4 + 3(2) = 10 > 6$ ✓. Both are true, so $(4, 2)$ is a solution (it falls within $S$).`,
    rubric: [
      { credits: 4, criteria: String.raw`The system of inequalities is graphed correctly and at least one is labeled, the solution set is labeled $S$, and a correct justification indicating a positive response is given.` },
      { credits: 3, criteria: String.raw`Appropriate work is shown, but one computational, graphing, or labeling error is made. OR Appropriate work is shown, but the solution set is not labeled $S$. OR Appropriate work is shown, but the justification is missing or incorrect. OR One inequality is graphed incorrectly, but the system is used appropriately.` },
      { credits: 2, criteria: String.raw`Appropriate work is shown, but two or more computational, graphing, or labeling errors are made. OR The system of inequalities is graphed correctly and at least one is labeled, but no further correct work is shown.` },
      { credits: 1, criteria: String.raw`One inequality is graphed and labeled correctly, but no further correct work is shown. OR A correct justification is given, but no further correct work is shown.` },
      { credits: 0, criteria: ZERO },
    ],
  },
  {
    id: "soi-cr-0618-q35",
    mode: "self-score",
    standard: "AI-A.REI.12",
    topic: "Graphing a system and testing a claimed solution",
    examCitation: "regents-algI-0618-q35",
    part: "III",
    credits: 4,
    prompt: String.raw`On the set of axes provided, graph the following system of inequalities:
$$2y + 3x \le 14$$
$$4x - y < 2$$
Determine if the point $(1, 2)$ is in the solution set. Explain your answer.`,
    answerSummary: String.raw`No: $(1, 2)$ lies ON the dashed boundary $4x - y = 2$, so it is not in the solution set.`,
    modelSolution: String.raw`First: $2y + 3x \le 14 \Rightarrow y \le -\tfrac{3}{2}x + 7$ — a SOLID line, shade BELOW. Second: $4x - y < 2 \Rightarrow y > 4x - 2$ — a DASHED line, shade ABOVE. Test $(1, 2)$: $2(2) + 3(1) = 7 \le 14$ ✓, but $4(1) - 2 = 2$, so $2 < 2$ is FALSE — the point is on the dashed (excluded) boundary. Therefore $(1, 2)$ is NOT in the solution set.`,
    rubric: [
      { credits: 4, criteria: String.raw`The system of inequalities is graphed correctly and at least one is labeled, and a correct explanation indicating a negative response is written.` },
      { credits: 3, criteria: String.raw`Appropriate work is shown, but one computational, graphing, or labeling error is made. OR Appropriate work is shown, but the explanation is incomplete.` },
      { credits: 2, criteria: String.raw`Appropriate work is shown, but two or more computational, graphing, or labeling errors are made. OR The system of inequalities is graphed correctly and at least one is labeled, but no further correct work is shown. OR The system of inequalities is graphed correctly and at least one is labeled, and "no" is stated, but the explanation is missing or incorrect. OR A correct explanation indicating a negative response is written, but no further correct work is shown.` },
      { credits: 1, criteria: String.raw`One inequality is graphed correctly, but no further correct work is shown. OR $2y + 3x = 14$ and $4x - y = 2$ are graphed correctly and at least one is labeled, but no further correct work is shown.` },
      { credits: 0, criteria: ZERO },
    ],
  },
  {
    id: "soi-cr-0818-q35",
    mode: "self-score",
    standard: "AI-A.REI.12",
    topic: "Graphing a system and explaining two test points",
    examCitation: "regents-algI-0818-q35",
    part: "III",
    credits: 4,
    prompt: String.raw`Graph the following system of inequalities on the set of axes provided:
$$2y \ge 3x - 16$$
$$y + 2x > -5$$
Based upon your graph, explain why $(6, 1)$ is a solution to this system and why $(-6, 7)$ is not a solution to this system.`,
    answerSummary: String.raw`$(6, 1)$ lies on a SOLID boundary and satisfies both, so it is a solution; $(-6, 7)$ lies on a DASHED boundary, so it is excluded.`,
    modelSolution: String.raw`First: $2y \ge 3x - 16 \Rightarrow y \ge \tfrac{3}{2}x - 8$ — a SOLID line, shade ABOVE. Second: $y + 2x > -5 \Rightarrow y > -2x - 5$ — a DASHED line, shade ABOVE. Test $(6, 1)$: $2(1) = 2$ and $3(6) - 16 = 2$, so $2 \ge 2$ ✓ (it is ON the SOLID line, which is included); and $1 + 2(6) = 13 > -5$ ✓. So $(6, 1)$ is a solution. Test $(-6, 7)$: $2(7) = 14 \ge 3(-6) - 16 = -34$ ✓; but $7 + 2(-6) = -5$, so $-5 > -5$ is FALSE — it is ON the DASHED line, which is excluded. So $(-6, 7)$ is not a solution.`,
    rubric: [
      { credits: 4, criteria: String.raw`The system of inequalities is graphed correctly, and at least one is labeled, and explanations for both points are written.` },
      { credits: 3, criteria: String.raw`Appropriate work is shown, but one graphing or labeling error is made. OR Appropriate work is shown, but the explanation is incomplete.` },
      { credits: 2, criteria: String.raw`Appropriate work is shown, but two or more graphing or labeling errors are made. OR The system of inequalities is graphed and labeled correctly, but no further correct work is shown.` },
      { credits: 1, criteria: String.raw`Appropriate explanations are written based on substituting the values into each inequality, but no further correct work is shown. OR One inequality is graphed and labeled correctly, but no further correct work is shown.` },
      { credits: 0, criteria: ZERO },
    ],
  },
  {
    id: "soi-cr-0822-q36",
    mode: "self-score",
    standard: "AI-A.REI.12",
    topic: "Graphing a system and testing a claimed solution",
    examCitation: "regents-algI-0822-q36",
    part: "III",
    credits: 4,
    prompt: String.raw`Solve the system of inequalities graphically on the set of axes provided. Label the solution set $S$.
$$y + 3x < 5$$
$$1 \ge 2x - y$$
Is the point $(-5, 0)$ in the solution set? Explain your answer.`,
    answerSummary: String.raw`Yes: $(-5, 0)$ satisfies both inequalities, so it is in $S$.`,
    modelSolution: String.raw`First: $y + 3x < 5 \Rightarrow y < -3x + 5$ — a DASHED line, shade BELOW. Second: $1 \ge 2x - y \Rightarrow y \ge 2x - 1$ — a SOLID line, shade ABOVE. Label the overlap $S$. Test $(-5, 0)$: $0 + 3(-5) = -15 < 5$ ✓ and $2(-5) - 0 = -10$, so $1 \ge -10$ ✓. Both hold, so $(-5, 0)$ is in the solution set.`,
    rubric: [
      { credits: 4, criteria: String.raw`Both inequalities are graphed correctly, and at least one is labeled, the solution is labeled $S$, and a correct explanation indicating a positive response is written.` },
      { credits: 3, criteria: String.raw`Appropriate work is shown, but one computational, graphing, or labeling error is made. OR Appropriate work is shown, but the solution is not labeled $S$. OR Appropriate work is shown, but the explanation is missing or incorrect. OR One inequality is graphed incorrectly, but the system is used appropriately.` },
      { credits: 2, criteria: String.raw`Appropriate work is shown, but two or more computational, graphing, or labeling errors are made. OR Both inequalities are graphed correctly and at least one is labeled, but no further correct work is shown.` },
      { credits: 1, criteria: String.raw`A correct explanation is written, but no further correct work is shown. OR One inequality is graphed and labeled correctly, but no further correct work is shown.` },
      { credits: 0, criteria: ZERO },
    ],
  },
  {
    id: "soi-cr-0622-q36",
    mode: "self-score",
    standard: "AI-A.REI.12",
    topic: "Graphing a system and testing a claimed solution",
    examCitation: "regents-algI-0622-q36",
    part: "III",
    credits: 4,
    prompt: String.raw`Solve the system of inequalities graphically on the set of axes provided. Label the solution set $S$.
$$2x + 3y < 9$$
$$2y \ge 4x + 6$$
Determine if the point $(0, 3)$ is a solution to this system of inequalities. Justify your answer.`,
    answerSummary: String.raw`No: $(0, 3)$ lies ON the dashed boundary $2x + 3y = 9$, so it is not a solution.`,
    modelSolution: String.raw`First: $2x + 3y < 9 \Rightarrow y < -\tfrac{2}{3}x + 3$ — a DASHED line, shade BELOW. Second: $2y \ge 4x + 6 \Rightarrow y \ge 2x + 3$ — a SOLID line, shade ABOVE. Label the overlap $S$. Test $(0, 3)$: $2(0) + 3(3) = 9$, so $9 < 9$ is FALSE — the point is on the dashed (excluded) boundary. Therefore $(0, 3)$ is NOT a solution.`,
    rubric: [
      { credits: 4, criteria: String.raw`Both inequalities are graphed correctly, and at least one is labeled, the solution set is labeled $S$, and a correct justification indicating a negative response is given.` },
      { credits: 3, criteria: String.raw`Appropriate work is shown, but one computational, graphing, or labeling error is made. OR Appropriate work is shown, but the solution set is not labeled $S$. OR Appropriate work is shown, but the justification is missing or incorrect. OR One inequality is graphed incorrectly, but the system is used appropriately.` },
      { credits: 2, criteria: String.raw`Both inequalities are graphed correctly, and at least one is labeled, but no further correct work is shown.` },
      { credits: 1, criteria: String.raw`A correct justification is given, but no further correct work is shown. OR One inequality is graphed and labeled correctly, but no further correct work is shown. OR $2x + 3y = 9$ and $2y = 4x + 6$ are graphed correctly, and at least one is labeled, but no further correct work is shown.` },
      { credits: 0, criteria: ZERO },
    ],
  },
  {
    id: "soi-cr-0126-q34",
    mode: "self-score",
    standard: "AI-A.REI.12",
    topic: "Graphing a system and testing a claimed solution",
    examCitation: "regents-algI-0126-q34",
    part: "III",
    credits: 4,
    prompt: String.raw`Solve the following system of inequalities graphically. Label the solution set $S$.
$$2y \le x + 6$$
$$2x + y > 3$$
Is the point $(0, 3)$ in the solution set? Explain your answer.`,
    answerSummary: String.raw`No: $(0, 3)$ lies ON the dashed boundary $2x + y = 3$, so it is not in the solution set.`,
    modelSolution: String.raw`First: $2y \le x + 6 \Rightarrow y \le \tfrac{1}{2}x + 3$ — a SOLID line, shade BELOW. Second: $2x + y > 3 \Rightarrow y > -2x + 3$ — a DASHED line, shade ABOVE. Test $(0, 3)$: $2(3) = 6 \le 0 + 6 = 6$ ✓ (on the solid, included line); but $2(0) + 3 = 3$, so $3 > 3$ is FALSE — the point is on the dashed (excluded) boundary. Therefore $(0, 3)$ is NOT in the solution set.`,
    rubric: IS_IT_A_SOLUTION_NEGATIVE_4,
  },
  {
    id: "soi-cr-0819-q33",
    mode: "self-score",
    standard: "AI-A.REI.12",
    topic: "Graphing a system and testing a claimed solution",
    examCitation: "regents-algI-0819-q33",
    part: "III",
    credits: 4,
    prompt: String.raw`On the set of axes provided, graph the following system of inequalities:
$$2x + y \ge 8$$
$$y - 5 < 3x$$
Determine if the point $(1, 8)$ is in the solution set. Explain your answer.`,
    answerSummary: String.raw`No: $(1, 8)$ lies ON the dashed boundary $y - 5 = 3x$, so it is not in the solution set.`,
    modelSolution: String.raw`First: $2x + y \ge 8 \Rightarrow y \ge -2x + 8$ — a SOLID line, shade ABOVE. Second: $y - 5 < 3x \Rightarrow y < 3x + 5$ — a DASHED line, shade BELOW. Test $(1, 8)$: $2(1) + 8 = 10 \ge 8$ ✓; but $8 - 5 = 3$ and $3(1) = 3$, so $3 < 3$ is FALSE — the point is on the dashed (excluded) boundary. Therefore $(1, 8)$ is NOT in the solution set.`,
    rubric: [
      { credits: 4, criteria: String.raw`The system of inequalities is graphed correctly and at least one is labeled, and a correct explanation indicating a negative response is written.` },
      { credits: 3, criteria: String.raw`Appropriate work is shown, but one computational, graphing, or labeling error is made. OR Appropriate work is shown, but the explanation is incomplete.` },
      { credits: 2, criteria: String.raw`Appropriate work is shown, but two or more computational, graphing, or labeling errors are made. OR The system of inequalities is graphed correctly and at least one is labeled, but no further correct work is shown. OR A correct explanation indicating a negative response is written, but no further correct work is shown.` },
      { credits: 1, criteria: String.raw`One inequality is graphed correctly, but no further correct work is shown. OR $2x + y = 8$ and $y - 5 = 3x$ are graphed correctly and at least one is labeled, but no further correct work is shown.` },
      { credits: 0, criteria: String.raw`No, but no further correct work is shown. OR ${ZERO}` },
    ],
  },
  {
    id: "soi-cr-0120-q34",
    mode: "self-score",
    standard: "AI-A.REI.12",
    topic: "Graphing a system and testing a claimed solution",
    examCitation: "regents-algI-0120-q34",
    part: "III",
    credits: 4,
    prompt: String.raw`Graph the system of inequalities:
$$-x + 2y - 4 < 0$$
$$3x + 4y + 4 \ge 0$$
Stephen says the point $(0, 0)$ is a solution to this system. Determine if he is correct, and explain your reasoning.`,
    answerSummary: String.raw`Stephen is correct: $(0, 0)$ satisfies both inequalities.`,
    modelSolution: String.raw`First: $-x + 2y - 4 < 0 \Rightarrow 2y < x + 4 \Rightarrow y < \tfrac{1}{2}x + 2$ — a DASHED line, shade BELOW. Second: $3x + 4y + 4 \ge 0 \Rightarrow 4y \ge -3x - 4 \Rightarrow y \ge -\tfrac{3}{4}x - 1$ — a SOLID line, shade ABOVE. Test $(0, 0)$: $-0 + 2(0) - 4 = -4 < 0$ ✓ and $3(0) + 4(0) + 4 = 4 \ge 0$ ✓. Both are true, so Stephen is correct — $(0, 0)$ is a solution.`,
    rubric: [
      { credits: 4, criteria: String.raw`Both inequalities are graphed correctly and at least one is labeled, and an explanation indicating a positive response is written.` },
      { credits: 3, criteria: String.raw`Appropriate work is shown, but one computational, graphing, or labeling error is made. OR Appropriate work is shown, but the explanation is missing or incorrect.` },
      { credits: 2, criteria: String.raw`Appropriate work is shown, but two or more computational, graphing, or labeling errors are made. OR One inequality is graphed and labeled correctly, but no further correct work is shown.` },
      { credits: 1, criteria: String.raw`Both inequalities are correctly solved for $y$, but no further correct work is shown. OR A correct explanation is written, but no further correct work is shown.` },
      { credits: 0, criteria: ZERO },
    ],
  },
  {
    id: "soi-cr-0623-q35",
    mode: "self-score",
    standard: "AI-A.REI.12",
    topic: "Graphing a system and testing a claimed solution",
    examCitation: "regents-algI-0623-q35",
    part: "III",
    credits: 4,
    prompt: String.raw`Solve the following system of inequalities graphically on the set of axes provided.
$$2x + 3y \ge -6$$
$$x < 3y + 6$$
Label the solution set $S$. Is the point $(4, -2)$ in the solution set? Explain your answer.`,
    answerSummary: String.raw`No: $(4, -2)$ fails $x < 3y + 6$ ($4 < 0$ is false), so it is not in $S$.`,
    modelSolution: String.raw`First: $2x + 3y \ge -6 \Rightarrow y \ge -\tfrac{2}{3}x - 2$ — a SOLID line, shade ABOVE. Second: $x < 3y + 6 \Rightarrow 3y > x - 6 \Rightarrow y > \tfrac{1}{3}x - 2$ — a DASHED line, shade ABOVE. Label the overlap $S$. Test $(4, -2)$: $2(4) + 3(-2) = 2 \ge -6$ ✓; but $x < 3y + 6$ gives $4 < 3(-2) + 6 = 0$, i.e. $4 < 0$, which is FALSE. Therefore $(4, -2)$ is NOT in the solution set.`,
    rubric: [
      { credits: 4, criteria: String.raw`Both inequalities are graphed correctly and at least one is labeled, the solution is labeled $S$, and a correct explanation indicating a negative response is written.` },
      { credits: 3, criteria: String.raw`Appropriate work is shown, but one computational, graphing, or labeling error is made. OR Appropriate work is shown, but the solution is not labeled $S$. OR Appropriate work is shown, but the explanation is missing or incorrect. OR One inequality is graphed incorrectly, but the system is used appropriately.` },
      { credits: 2, criteria: String.raw`Appropriate work is shown, but two or more computational, graphing, or labeling errors are made. OR Both inequalities are graphed correctly with at least one labeled, but no further correct work is shown.` },
      { credits: 1, criteria: String.raw`A correct explanation is written, but no further correct work is shown. OR One inequality is graphed and labeled correctly, but no further correct work is shown.` },
      { credits: 0, criteria: ZERO },
    ],
  },
  {
    id: "soi-cr-0817-q35",
    mode: "self-score",
    standard: "AI-A.REI.12",
    topic: "Graphing a system and testing a claimed solution",
    examCitation: "regents-algI-0817-q35",
    part: "III",
    credits: 4,
    prompt: String.raw`Solve the following system of inequalities graphically on the grid provided and label the solution $S$.
$$3x + 4y > 20$$
$$x < 3y - 18$$
Is the point $(3, 7)$ in the solution set? Explain your answer.`,
    answerSummary: String.raw`No: $(3, 7)$ lies ON the dashed boundary $x = 3y - 18$, so it is excluded.`,
    modelSolution: String.raw`First: $3x + 4y > 20 \Rightarrow y > -\tfrac{3}{4}x + 5$ — a DASHED line, shade ABOVE. Second: $x < 3y - 18 \Rightarrow 3y > x + 18 \Rightarrow y > \tfrac{1}{3}x + 6$ — a DASHED line, shade ABOVE. Label the overlap $S$. Test $(3, 7)$: $3(3) + 4(7) = 37 > 20$ ✓; but $x < 3y - 18$ gives $3 < 3(7) - 18 = 3$, i.e. $3 < 3$, which is FALSE — the point is on the dashed (excluded) boundary. Therefore $(3, 7)$ is NOT in the solution set.`,
    rubric: [
      { credits: 4, criteria: String.raw`Both inequalities are graphed correctly and at least one is labeled, the solution is labeled $S$, and a correct explanation indicating a negative response is written.` },
      { credits: 3, criteria: String.raw`Appropriate work is shown, but one computational, graphing, or labeling error is made. OR Appropriate work is shown, but the solution is not labeled $S$. OR Appropriate work is shown, but the explanation is missing or incorrect.` },
      { credits: 2, criteria: String.raw`Appropriate work is shown, but two or more computational, graphing, or labeling errors are made. OR Both inequalities are graphed correctly with at least one labeled, but no further correct work is shown.` },
      { credits: 1, criteria: String.raw`A correct explanation is written, but no further correct work is shown. OR One inequality is graphed correctly, but no further correct work is shown.` },
      { credits: 0, criteria: ZERO },
    ],
  },
  {
    id: "soi-cr-0621-q35",
    mode: "self-score",
    standard: "AI-A.REI.12",
    topic: "Graphing a system and testing a claimed solution",
    examCitation: "regents-algI-0621-q35",
    part: "III",
    credits: 4,
    prompt: String.raw`Graph the system of inequalities on the set of axes provided:
$$y \le -\tfrac{3}{4}x + 5$$
$$3x - 2y > 4$$
Is $(6, 3)$ a solution to the system of inequalities? Explain your answer.`,
    answerSummary: String.raw`No: $(6, 3)$ fails $y \le -\tfrac{3}{4}x + 5$ ($3 \le 0.5$ is false), so it is not a solution.`,
    modelSolution: String.raw`First: $y \le -\tfrac{3}{4}x + 5$ — a SOLID line (slope $-\tfrac{3}{4}$, $y$-intercept $5$), shade BELOW. Second: $3x - 2y > 4 \Rightarrow -2y > -3x + 4 \Rightarrow y < \tfrac{3}{2}x - 2$ — a DASHED line, shade BELOW. Test $(6, 3)$ in the first inequality: $-\tfrac{3}{4}(6) + 5 = -4.5 + 5 = 0.5$, so $3 \le 0.5$ is FALSE. The point is outside the solution set, so $(6, 3)$ is NOT a solution.`,
    rubric: IS_IT_A_SOLUTION_NEGATIVE_4,
  },
  {
    id: "soi-cr-0616-q34",
    mode: "self-score",
    standard: "AI-A.REI.12",
    topic: "Modeling a scenario as a system and testing a claim",
    examCitation: "regents-algI-0616-q34",
    part: "III",
    credits: 4,
    prompt: String.raw`The sum of two numbers, $x$ and $y$, is more than $8$. When you double $x$ and add it to $y$, the sum is less than $14$. Graph the inequalities that represent this scenario on the set of axes provided. Kai says that the point $(6, 2)$ is a solution to this system. Determine if he is correct and explain your reasoning.`,
    answerSummary: String.raw`System: $x + y > 8$ and $2x + y < 14$. Kai is incorrect — $(6, 2)$ lies ON the boundary $x + y = 8$, so it is not a solution.`,
    modelSolution: String.raw`Translate: "the sum is more than $8$" $\Rightarrow x + y > 8$; "double $x$ added to $y$ is less than $14$" $\Rightarrow 2x + y < 14$. Both are DASHED lines (strict inequalities). Test $(6, 2)$: $6 + 2 = 8$, so $8 > 8$ is FALSE (the point lies on the excluded boundary of $x + y > 8$). Therefore Kai is incorrect; $(6, 2)$ is not a solution.`,
    rubric: [
      { credits: 4, criteria: String.raw`Both inequalities are graphed correctly and at least one is labeled, and a correct explanation stating he is incorrect is written.` },
      { credits: 3, criteria: String.raw`Appropriate work is shown, but one computational, graphing, or labeling error is made. OR Appropriate work is shown, but the explanation is missing or incorrect.` },
      { credits: 2, criteria: String.raw`Appropriate work is shown, but one conceptual error is made. OR Appropriate work is shown, but two or more computational, graphing, or labeling errors are made. OR Both inequalities are graphed correctly, but no further correct work is shown.` },
      { credits: 1, criteria: String.raw`Both inequalities are stated correctly, but no further correct work is shown.` },
      { credits: 0, criteria: ZERO },
    ],
  },

  // —————————————————— Part IV constructed-response (6 credits) ——————————————————

  {
    id: "soi-cr-0116-q37",
    mode: "self-score",
    standard: "AI-A.REI.12",
    topic: "Modeling a real-world scenario with a system of inequalities",
    examCitation: "regents-algI-0116-q37",
    part: "IV",
    credits: 6,
    prompt: String.raw`The Reel Good Cinema is conducting a mathematical study. In its theater, there are $200$ seats. Adult tickets cost \$12.50 and child tickets cost \$6.25. The cinema's goal is to sell at least \$1500 worth of tickets for the theater. Write a system of linear inequalities that can be used to find the possible combinations of adult tickets, $x$, and child tickets, $y$, that would satisfy the cinema's goal. Graph the solution to this system of inequalities on the set of axes provided. Label the solution with an $S$. Marta claims that selling $30$ adult tickets and $80$ child tickets will result in meeting the cinema's goal. Explain whether she is correct or incorrect, based on the graph drawn.`,
    answerSummary: String.raw`System: $x + y \le 200$ and $12.50x + 6.25y \ge 1500$. Marta is incorrect — $30$ adult and $80$ child tickets bring only \$875, which is less than \$1500.`,
    modelSolution: String.raw`Seats limit the total tickets: $x + y \le 200$ (SOLID line, shade below, with $x \ge 0$, $y \ge 0$). The revenue goal of at least \$1500: $12.50x + 6.25y \ge 1500$ (SOLID line, shade above). Label the overlap $S$. Test Marta's combination $(30, 80)$: total tickets $30 + 80 = 110 \le 200$ ✓, but revenue $12.50(30) + 6.25(80) = 375 + 500 = 875$, and $875 \ge 1500$ is FALSE. Her point falls below the revenue line — outside $S$ — so Marta is incorrect; she does not meet the cinema's \$1500 goal.`,
    rubric: [
      { credits: 6, criteria: String.raw`A correct system of inequalities is written and graphed correctly, and at least one is labeled, the solution is labeled $S$, and a correct explanation, based on the graph, that the claim is incorrect is given.` },
      { credits: 5, criteria: String.raw`Appropriate work is shown, but one computational, graphing, or labeling error is made. OR Appropriate work is shown, but the explanation is not based on the graph.` },
      { credits: 4, criteria: String.raw`Appropriate work is shown, but two or more computational, graphing, or labeling errors are made. OR Appropriate work is shown, but one conceptual error is made. OR A correct system of inequalities is written and graphed and the solution is labeled, but no further correct work is shown.` },
      { credits: 3, criteria: String.raw`Appropriate work is shown, but one conceptual and one computational, graphing, or labeling error are made.` },
      { credits: 2, criteria: String.raw`Appropriate work is shown, but two conceptual errors are made. OR Appropriate work is shown, but one conceptual error and two or more computational, graphing, or labeling errors are made. OR A correct system of inequalities is written, but no further correct work is shown. OR Only one inequality is written and graphed, but no further correct work is shown.` },
      { credits: 1, criteria: String.raw`Only one inequality is written correctly, but no further correct work is shown.` },
      { credits: 0, criteria: ZERO },
    ],
  },
];

export default bank;
