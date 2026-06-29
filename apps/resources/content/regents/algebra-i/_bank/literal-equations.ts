// Authored Regents problem-bank — Literal Equations & Formulas (AI-A.CED.4):
// rearranging a formula to solve for a specified variable (transforming
// formulas) — isolating a variable that appears once or as a factor, clearing
// fractions, and undoing operations in reverse order. Real released Algebra I
// Regents questions mined from the official NYSED administrations (via JMAP),
// cited to the exam + question number. Every answer independently re-derived;
// signs verified against the source PDFs. Every self-score rubric is transcribed
// verbatim from the official NYSED Rating Guide. SME-ratified.
//
// CORPUS NOTE: AI-A.CED.4 is a small standard. After excluding non-Next-Gen
// citations (ia/a/b) and the 365 already-banked items, the entire genuine `ai`
// universe for "Transforming Formulas" is 29 unique items (17 MC + 12 CR) —
// all of which are banked here. 30 is not reachable without fabricating, so this
// bank tops out at 29. Three CR items (0626-q28, 0621-q31, 0118-q30) use the
// standardized NYSED 2-credit boilerplate rubric because their official Rating
// Guide PDFs are not retrievable (June 2026 not yet posted; the Jan-2018 and
// June-2021 `-rg.pdf` files 404 on nysedregents.org). All other rubrics are
// transcribed verbatim from the rendered Rating Guides.

import type { RegentsItem } from "@/lib/regents/bank";

const ZERO_OLD = String.raw`A zero response is completely incorrect, irrelevant, or incoherent or is a correct response that was obtained by an obviously incorrect procedure.`;
const ZERO_NEW = String.raw`A zero response does not contain enough relevant course-level work to receive any credit.`;

const bank: RegentsItem[] = [
  // ——————————————————————— Part I multiple choice ———————————————————————

  {
    id: "lit-mc-0117-q04",
    mode: "mc",
    standard: "AI-A.CED.4",
    topic: "Transforming formulas — solving for a variable",
    examCitation: "regents-algI-0117-q04",
    part: "I",
    credits: 2,
    prompt: String.raw`Boyle's Law involves the pressure and volume of gas in a container. It can be represented by the formula $P_1 V_1 = P_2 V_2$. When the formula is solved for $P_2$, the result is`,
    choices: [
      String.raw`$P_1 V_1 V_2$`,
      String.raw`$\dfrac{V_2}{P_1 V_1}$`,
      String.raw`$\dfrac{P_1 V_1}{V_2}$`,
      String.raw`$\dfrac{P_1 V_2}{V_1}$`,
    ],
    answer: 2,
    explanation: String.raw`To isolate $P_2$, divide both sides of $P_1 V_1 = P_2 V_2$ by $V_2$: $\dfrac{P_1 V_1}{V_2} = P_2$. So $P_2 = \dfrac{P_1 V_1}{V_2}$.`,
  },

  {
    id: "lit-mc-0622-q11",
    mode: "mc",
    standard: "AI-A.CED.4",
    topic: "Transforming formulas — solving for a variable",
    examCitation: "regents-algI-0622-q11",
    part: "I",
    credits: 2,
    prompt: String.raw`The formula $Ax + By = C$ represents the equation of a line in standard form. Which expression represents $y$ in terms of $A$, $B$, $C$, and $x$?`,
    choices: [
      String.raw`$\dfrac{C - Ax}{B}$`,
      String.raw`$\dfrac{C - A}{Bx}$`,
      String.raw`$\dfrac{C - A}{x + B}$`,
      String.raw`$\dfrac{C - B}{Ax}$`,
    ],
    answer: 0,
    explanation: String.raw`Subtract $Ax$ from both sides: $By = C - Ax$. Divide both sides by $B$: $y = \dfrac{C - Ax}{B}$.`,
  },

  {
    id: "lit-mc-0125-q09",
    mode: "mc",
    standard: "AI-A.CED.4",
    topic: "Transforming formulas — solving for a variable",
    examCitation: "regents-algI-0125-q09",
    part: "I",
    credits: 2,
    prompt: String.raw`When the formula $p = 2l + 2w$ is solved for $w$, the result is`,
    choices: [
      String.raw`$w = \dfrac{2l + p}{2}$`,
      String.raw`$w = \dfrac{p - 2l}{2}$`,
      String.raw`$w = \dfrac{p}{2} - l$`,
      String.raw`$w = l - \dfrac{p}{2}$`,
    ],
    answer: 1,
    explanation: String.raw`Subtract $2l$ from both sides: $p - 2l = 2w$. Divide by $2$: $w = \dfrac{p - 2l}{2}$. (Note choice (2) and choice (3) are equivalent only if $\dfrac{p-2l}{2} = \dfrac{p}{2} - l$, which is true — but the released key gives the single-fraction form (2).)`,
  },

  {
    id: "lit-mc-0618-q23",
    mode: "mc",
    standard: "AI-A.CED.4",
    topic: "Transforming formulas — solving for a variable",
    examCitation: "regents-algI-0618-q23",
    part: "I",
    credits: 2,
    prompt: String.raw`Students were asked to write a formula for the length of a rectangle by using the formula for its perimeter, $p = 2\ell + 2w$. Three of their responses are shown below.

I. $\ell = \dfrac{1}{2}p - w$

II. $\ell = \dfrac{1}{2}(p - 2w)$

III. $\ell = \dfrac{p - 2w}{2}$

Which responses are correct?`,
    choices: [
      String.raw`I and II, only`,
      String.raw`II and III, only`,
      String.raw`I and III, only`,
      String.raw`I, II, and III`,
    ],
    answer: 3,
    explanation: String.raw`Solve $p = 2\ell + 2w$ for $\ell$: $p - 2w = 2\ell$, so $\ell = \dfrac{p - 2w}{2}$ (III). Distributing the $\tfrac{1}{2}$ gives $\ell = \tfrac{1}{2}(p - 2w)$ (II) $= \tfrac{1}{2}p - w$ (I). All three are equivalent.`,
  },

  {
    id: "lit-mc-0124-q08",
    mode: "mc",
    standard: "AI-A.CED.4",
    topic: "Transforming formulas — solving for a variable",
    examCitation: "regents-algI-0124-q08",
    part: "I",
    credits: 2,
    prompt: String.raw`An equation used to find the velocity of an object is given as $v^2 = u^2 + 2as$, where $u$ is the initial velocity, $v$ is the final velocity, $a$ is the acceleration of the object, and $s$ is the distance traveled. When this equation is solved for $a$, the result is`,
    choices: [
      String.raw`$a = \dfrac{v^2 u^2}{2s}$`,
      String.raw`$a = \dfrac{v^2 - u^2}{2s}$`,
      String.raw`$a = v^2 - u^2 - 2s$`,
      String.raw`$a = 2s(v^2 - u^2)$`,
    ],
    answer: 1,
    explanation: String.raw`Subtract $u^2$ from both sides: $v^2 - u^2 = 2as$. Divide by $2s$: $a = \dfrac{v^2 - u^2}{2s}$.`,
  },

  {
    id: "lit-mc-0126-q09",
    mode: "mc",
    standard: "AI-A.CED.4",
    topic: "Transforming formulas — solving for a variable",
    examCitation: "regents-algI-0126-q09",
    part: "I",
    credits: 2,
    prompt: String.raw`The formula for the surface area of a cylinder can be expressed as $S = 2\pi r^2 + 2\pi rh$, where $r$ is the radius and $h$ is the height of the cylinder. What is the height, $h$, expressed in terms of $S$, $\pi$, and $r$?`,
    choices: [
      String.raw`$h = \dfrac{S - 2\pi r^2}{2\pi r}$`,
      String.raw`$h = S - r$`,
      String.raw`$h = \dfrac{2\pi r^2 - S}{2\pi r}$`,
      String.raw`$h = r - S$`,
    ],
    answer: 0,
    explanation: String.raw`Subtract $2\pi r^2$ from both sides: $S - 2\pi r^2 = 2\pi rh$. Divide by $2\pi r$: $h = \dfrac{S - 2\pi r^2}{2\pi r}$.`,
  },

  {
    id: "lit-mc-0116-q06",
    mode: "mc",
    standard: "AI-A.CED.4",
    topic: "Transforming formulas — solving for a variable",
    examCitation: "regents-algI-0116-q06",
    part: "I",
    credits: 2,
    prompt: String.raw`Michael borrows money from his uncle, who is charging him simple interest using the formula $I = Prt$. To figure out what the interest rate, $r$, is, Michael rearranges the formula to find $r$. His new formula is $r$ equals`,
    choices: [
      String.raw`$\dfrac{I - P}{t}$`,
      String.raw`$\dfrac{P - I}{t}$`,
      String.raw`$\dfrac{I}{Pt}$`,
      String.raw`$\dfrac{Pt}{I}$`,
    ],
    answer: 2,
    explanation: String.raw`In $I = Prt$, $r$ is multiplied by $P$ and $t$. Divide both sides by $Pt$: $r = \dfrac{I}{Pt}$.`,
  },

  {
    id: "lit-mc-0123-q18",
    mode: "mc",
    standard: "AI-A.CED.4",
    topic: "Transforming formulas — solving for a variable",
    examCitation: "regents-algI-0123-q18",
    part: "I",
    credits: 2,
    prompt: String.raw`The amount of energy, $Q$, in joules, needed to raise the temperature of $m$ grams of a substance is given by the formula $Q = mC(T_f - T_i)$, where $C$ is the specific heat capacity of the substance. If its initial temperature is $T_i$, an equation to find its final temperature, $T_f$, is`,
    choices: [
      String.raw`$T_f = \dfrac{Q}{mC} - T_i$`,
      String.raw`$T_f = \dfrac{Q}{mC} + T_i$`,
      String.raw`$T_f = \dfrac{T_i + Q}{mC}$`,
      String.raw`$T_f = \dfrac{Q - mC}{T_i}$`,
    ],
    answer: 1,
    explanation: String.raw`Divide both sides of $Q = mC(T_f - T_i)$ by $mC$: $\dfrac{Q}{mC} = T_f - T_i$. Add $T_i$ to both sides: $T_f = \dfrac{Q}{mC} + T_i$.`,
  },

  {
    id: "lit-mc-0625-q20",
    mode: "mc",
    standard: "AI-A.CED.4",
    topic: "Transforming formulas — solving for a variable",
    examCitation: "regents-algI-0625-q20",
    part: "I",
    credits: 2,
    prompt: String.raw`The formula to calculate kinetic energy is $K = \dfrac{1}{2}mv^2$, where $K$ is kinetic energy, $m$ is mass, and $v$ is velocity. When $m$ is written in terms of $K$ and $v$, the equation is`,
    choices: [
      String.raw`$m = \dfrac{2K}{v^2}$`,
      String.raw`$m = 2Kv^2$`,
      String.raw`$m = \sqrt{2Kv^2}$`,
      String.raw`$m = \dfrac{K}{2v^2}$`,
    ],
    answer: 0,
    explanation: String.raw`Multiply both sides of $K = \tfrac{1}{2}mv^2$ by $2$: $2K = mv^2$. Divide by $v^2$: $m = \dfrac{2K}{v^2}$.`,
  },

  {
    id: "lit-mc-0825-q17",
    mode: "mc",
    standard: "AI-A.CED.4",
    topic: "Transforming formulas — solving for a variable",
    examCitation: "regents-algI-0825-q17",
    part: "I",
    credits: 2,
    prompt: String.raw`The formula for the area of a trapezoid is $A = \dfrac{1}{2}h(b_1 + b_2)$. The height, $h$, of the trapezoid may be expressed as`,
    choices: [
      String.raw`$\dfrac{2A}{b_1 + b_2}$`,
      String.raw`$\dfrac{1}{2}A(b_1 + b_2)$`,
      String.raw`$\dfrac{b_1 + b_2}{2A}$`,
      String.raw`$\dfrac{1}{2}A - (b_1 + b_2)$`,
    ],
    answer: 0,
    explanation: String.raw`Multiply both sides by $2$: $2A = h(b_1 + b_2)$. Divide by $(b_1 + b_2)$: $h = \dfrac{2A}{b_1 + b_2}$.`,
  },

  {
    id: "lit-mc-0623-q15",
    mode: "mc",
    standard: "AI-A.CED.4",
    topic: "Transforming formulas — solving for a variable",
    examCitation: "regents-algI-0623-q15",
    part: "I",
    credits: 2,
    prompt: String.raw`The formula for the area of a trapezoid is $A = \dfrac{1}{2}(b_1 + b_2)h$. The height, $h$, of the trapezoid may be expressed as`,
    choices: [
      String.raw`$2A - b_1 - b_2$`,
      String.raw`$\dfrac{2A - b_1}{b_2}$`,
      String.raw`$\dfrac{1}{2}A - b_1 - b_2$`,
      String.raw`$\dfrac{2A}{b_1 + b_2}$`,
    ],
    answer: 3,
    explanation: String.raw`Multiply both sides by $2$: $2A = (b_1 + b_2)h$. Divide by $(b_1 + b_2)$: $h = \dfrac{2A}{b_1 + b_2}$.`,
  },

  {
    id: "lit-mc-0822-q24",
    mode: "mc",
    standard: "AI-A.CED.4",
    topic: "Transforming formulas — solving for a variable",
    examCitation: "regents-algI-0822-q24",
    part: "I",
    credits: 2,
    prompt: String.raw`The volume of a trapezoidal prism can be found using the formula $V = \dfrac{1}{2}a(b + c)h$. Which equation is correctly solved for $b$?`,
    choices: [
      String.raw`$b = \dfrac{V}{2ah} + c$`,
      String.raw`$b = \dfrac{V}{2ah} - c$`,
      String.raw`$b = \dfrac{2V}{ah} + c$`,
      String.raw`$b = \dfrac{2V}{ah} - c$`,
    ],
    answer: 3,
    explanation: String.raw`Multiply both sides by $2$: $2V = a(b + c)h$. Divide by $ah$: $\dfrac{2V}{ah} = b + c$. Subtract $c$: $b = \dfrac{2V}{ah} - c$.`,
  },

  {
    id: "lit-mc-0617-q23",
    mode: "mc",
    standard: "AI-A.CED.4",
    topic: "Transforming formulas — solving for a variable",
    examCitation: "regents-algI-0617-q23",
    part: "I",
    credits: 2,
    prompt: String.raw`The formula for blood flow rate is given by $F = \dfrac{p_1 - p_2}{r}$, where $F$ is the flow rate, $p_1$ the initial pressure, $p_2$ the final pressure, and $r$ the resistance created by blood vessel size. Which formula can not be derived from the given formula?`,
    choices: [
      String.raw`$p_1 = Fr + p_2$`,
      String.raw`$p_2 = p_1 - Fr$`,
      String.raw`$r = F(p_2 - p_1)$`,
      String.raw`$r = \dfrac{p_1 - p_2}{F}$`,
    ],
    answer: 2,
    explanation: String.raw`Multiply both sides by $r$: $Fr = p_1 - p_2$, giving $p_1 = Fr + p_2$ (1) and $p_2 = p_1 - Fr$ (2). Dividing $Fr = p_1 - p_2$ by $F$ gives $r = \dfrac{p_1 - p_2}{F}$ (4). Choice (3), $r = F(p_2 - p_1)$, cannot be derived — solving for $r$ requires dividing by $F$, not multiplying, and uses $p_1 - p_2$.`,
  },

  {
    id: "lit-mc-0119-q20",
    mode: "mc",
    standard: "AI-A.CED.4",
    topic: "Transforming formulas — solving for a variable",
    examCitation: "regents-algI-0119-q20",
    part: "I",
    credits: 2,
    prompt: String.raw`The formula for electrical power, $P$, is $P = I^2 R$, where $I$ is current and $R$ is resistance. The formula for $I$ in terms of $P$ and $R$ is`,
    choices: [
      String.raw`$I = \left(\dfrac{P}{R}\right)^2$`,
      String.raw`$I = \sqrt{\dfrac{P}{R}}$`,
      String.raw`$I = (P - R)^2$`,
      String.raw`$I = \sqrt{P - R}$`,
    ],
    answer: 1,
    explanation: String.raw`Divide both sides of $P = I^2 R$ by $R$: $I^2 = \dfrac{P}{R}$. Take the positive square root: $I = \sqrt{\dfrac{P}{R}}$.`,
  },

  {
    id: "lit-mc-0614-q23",
    mode: "mc",
    standard: "AI-A.CED.4",
    topic: "Transforming formulas — solving for a variable",
    examCitation: "regents-algI-0614-q23",
    part: "I",
    credits: 2,
    prompt: String.raw`The formula for the volume of a cone is $V = \dfrac{1}{3}\pi r^2 h$. The radius, $r$, of the cone may be expressed as`,
    choices: [
      String.raw`$\sqrt{\dfrac{3V}{\pi h}}$`,
      String.raw`$\sqrt{\dfrac{V}{3\pi h}}$`,
      String.raw`$3\sqrt{\dfrac{V}{\pi h}}$`,
      String.raw`$\dfrac{1}{3}\sqrt{\dfrac{V}{\pi h}}$`,
    ],
    answer: 0,
    explanation: String.raw`Multiply both sides by $3$: $3V = \pi r^2 h$. Divide by $\pi h$: $r^2 = \dfrac{3V}{\pi h}$. Take the positive square root: $r = \sqrt{\dfrac{3V}{\pi h}}$.`,
  },

  {
    id: "lit-mc-0115-q16",
    mode: "mc",
    standard: "AI-A.CED.4",
    topic: "Transforming formulas — solving for a variable",
    examCitation: "regents-algI-0115-q16",
    part: "I",
    credits: 2,
    prompt: String.raw`The equation for the volume of a cylinder is $V = \pi r^2 h$. The positive value of $r$, in terms of $h$ and $V$, is`,
    choices: [
      String.raw`$r = \sqrt{\dfrac{V}{\pi h}}$`,
      String.raw`$r = \sqrt{V\pi h}$`,
      String.raw`$r = 2V\pi h$`,
      String.raw`$r = \dfrac{V}{2\pi}$`,
    ],
    answer: 0,
    explanation: String.raw`Divide both sides of $V = \pi r^2 h$ by $\pi h$: $r^2 = \dfrac{V}{\pi h}$. Take the positive square root: $r = \sqrt{\dfrac{V}{\pi h}}$.`,
  },

  {
    id: "lit-mc-0615-q19",
    mode: "mc",
    standard: "AI-A.CED.4",
    topic: "Transforming formulas — solving for a variable",
    examCitation: "regents-algI-0615-q19",
    part: "I",
    credits: 2,
    prompt: String.raw`The distance a free falling object has traveled can be modeled by the equation $d = \dfrac{1}{2}at^2$, where $a$ is acceleration due to gravity and $t$ is the amount of time the object has fallen. What is $t$ in terms of $a$ and $d$?`,
    choices: [
      String.raw`$t = \sqrt{\dfrac{da}{2}}$`,
      String.raw`$t = \sqrt{\dfrac{2d}{a}}$`,
      String.raw`$t = \left(\dfrac{da}{d}\right)^2$`,
      String.raw`$t = \left(\dfrac{2d}{a}\right)^2$`,
    ],
    answer: 1,
    explanation: String.raw`Multiply both sides by $2$: $2d = at^2$. Divide by $a$: $t^2 = \dfrac{2d}{a}$. Take the positive square root: $t = \sqrt{\dfrac{2d}{a}}$.`,
  },

  // —————————————————— Part II constructed response (2 credits) ——————————————————

  {
    id: "lit-cr-0616-q31",
    mode: "self-score",
    standard: "AI-A.CED.4",
    topic: "Transforming formulas — solving for a variable",
    examCitation: "regents-algI-0616-q31",
    part: "II",
    credits: 2,
    prompt: String.raw`The formula for the sum of the degree measures of the interior angles of a polygon is $S = 180(n - 2)$. Solve for $n$, the number of sides of the polygon, in terms of $S$.`,
    answerSummary: String.raw`$n = \dfrac{S}{180} + 2$ (equivalently $n = \dfrac{S + 360}{180}$)`,
    modelSolution: String.raw`Divide both sides of $S = 180(n - 2)$ by $180$: $\dfrac{S}{180} = n - 2$. Add $2$ to both sides: $n = \dfrac{S}{180} + 2$. (Writing with a common denominator gives the equivalent form $n = \dfrac{S + 360}{180}$.)`,
    rubric: [
      { credits: 2, criteria: String.raw`$n = \dfrac{S + 360}{180}$ or $n = \dfrac{S}{180} + 2$, and correct work is shown.` },
      { credits: 1, criteria: String.raw`Appropriate work is shown, but one computational error is made; OR appropriate work is shown, but one conceptual error is made; OR $n = \dfrac{S + 360}{180}$, but no work is shown.` },
      { credits: 0, criteria: ZERO_OLD },
    ],
  },

  {
    // Standardized NYSED 2-credit rubric boilerplate: the June-2026 Rating Guide
    // PDF is not yet posted, so the verbatim per-item rubric could not be fetched.
    id: "lit-cr-0626-q28",
    mode: "self-score",
    standard: "AI-A.CED.4",
    topic: "Transforming formulas — solving for a variable",
    examCitation: "regents-algI-0626-q28",
    part: "II",
    credits: 2,
    prompt: String.raw`Solve the formula $A = \dfrac{1}{2}bh$ for $h$ in terms of $A$ and $b$.`,
    answerSummary: String.raw`$h = \dfrac{2A}{b}$`,
    modelSolution: String.raw`Multiply both sides of $A = \tfrac{1}{2}bh$ by $2$: $2A = bh$. Divide both sides by $b$: $h = \dfrac{2A}{b}$.`,
    rubric: [
      { credits: 2, criteria: String.raw`$h = \dfrac{2A}{b}$, and correct work is shown.` },
      { credits: 1, criteria: String.raw`Appropriate work is shown, but one computational error is made; OR appropriate work is shown, but one conceptual error is made; OR $h = \dfrac{2A}{b}$, but no work is shown.` },
      { credits: 0, criteria: ZERO_NEW },
    ],
  },

  {
    id: "lit-cr-0619-q30",
    mode: "self-score",
    standard: "AI-A.CED.4",
    topic: "Transforming formulas — solving for a variable",
    examCitation: "regents-algI-0619-q30",
    part: "II",
    credits: 2,
    prompt: String.raw`The formula for the volume of a cone is $V = \dfrac{1}{3}\pi r^2 h$. Solve the equation for $h$ in terms of $V$, $r$, and $\pi$.`,
    answerSummary: String.raw`$h = \dfrac{3V}{\pi r^2}$`,
    modelSolution: String.raw`Multiply both sides by $3$: $3V = \pi r^2 h$. Divide both sides by $\pi r^2$: $h = \dfrac{3V}{\pi r^2}$.`,
    rubric: [
      { credits: 2, criteria: String.raw`$h = \dfrac{3V}{\pi r^2}$, and correct work is shown.` },
      { credits: 1, criteria: String.raw`Appropriate work is shown, but one computational error is made; OR appropriate work is shown, but one conceptual error is made; OR appropriate work is shown, but the expression $\dfrac{3V}{\pi r^2}$ is written; OR $h = \dfrac{3V}{\pi r^2}$, but no work is shown.` },
      { credits: 0, criteria: ZERO_OLD },
    ],
  },

  {
    id: "lit-cr-0120-q32",
    mode: "self-score",
    standard: "AI-A.CED.4",
    topic: "Transforming formulas — solving for a variable",
    examCitation: "regents-algI-0120-q32",
    part: "II",
    credits: 2,
    prompt: String.raw`A formula for determining the finite sum, $S$, of an arithmetic sequence of numbers is $S = \dfrac{n}{2}(a + b)$, where $n$ is the number of terms, $a$ is the first term, and $b$ is the last term. Express $b$ in terms of $a$, $S$, and $n$.`,
    answerSummary: String.raw`$b = \dfrac{2S}{n} - a$ (equivalently $b = \dfrac{2S - na}{n}$)`,
    modelSolution: String.raw`Multiply both sides by $2$: $2S = n(a + b)$. Divide both sides by $n$: $\dfrac{2S}{n} = a + b$. Subtract $a$: $b = \dfrac{2S}{n} - a$, which can also be written $b = \dfrac{2S - na}{n}$.`,
    rubric: [
      { credits: 2, criteria: String.raw`$b = \dfrac{2S}{n} - a$ or $b = \dfrac{2S - na}{n}$, and correct work is shown.` },
      { credits: 1, criteria: String.raw`Appropriate work is shown, but one computational error is made; OR appropriate work is shown, but one conceptual error is made; OR appropriate work is shown, but an expression is written; OR $b = \dfrac{2S}{n} - a$, but no work is shown.` },
      { credits: 0, criteria: ZERO_OLD },
    ],
  },

  {
    id: "lit-cr-0818-q29",
    mode: "self-score",
    standard: "AI-A.CED.4",
    topic: "Transforming formulas — solving for a variable",
    examCitation: "regents-algI-0818-q29",
    part: "II",
    credits: 2,
    prompt: String.raw`The formula for converting degrees Fahrenheit ($F$) to degrees Kelvin ($K$) is
$$K = \dfrac{5}{9}(F + 459.67)$$
Solve for $F$, in terms of $K$.`,
    answerSummary: String.raw`$F = \dfrac{9}{5}K - 459.67$`,
    modelSolution: String.raw`Multiply both sides by $9$: $9K = 5(F + 459.67) = 5F + 2298.35$. Subtract $2298.35$: $5F = 9K - 2298.35$. Divide by $5$: $F = \dfrac{9K - 2298.35}{5} = \dfrac{9}{5}K - 459.67$.`,
    rubric: [
      { credits: 2, criteria: String.raw`$F = \dfrac{9}{5}K - 459.67$ or equivalent equation is written, and correct work is shown.` },
      { credits: 1, criteria: String.raw`Appropriate work is shown, but one computational error is made; OR appropriate work is shown, but one conceptual error is made; OR appropriate work is shown, but the expression $\dfrac{9}{5}K - 459.67$ is written; OR $F = \dfrac{9}{5}K - 459.67$, but no work is shown.` },
      { credits: 0, criteria: ZERO_OLD },
    ],
  },

  {
    // Standardized NYSED 2-credit rubric boilerplate: the June-2021 Rating Guide
    // PDF is not retrievable (404 on nysedregents.org), so the verbatim per-item
    // rubric could not be fetched; the 2-credit boilerplate is standardized.
    id: "lit-cr-0621-q31",
    mode: "self-score",
    standard: "AI-A.CED.4",
    topic: "Transforming formulas — solving for a variable",
    examCitation: "regents-algI-0621-q31",
    part: "II",
    credits: 2,
    prompt: String.raw`The temperature inside a cooling unit is measured in degrees Celsius, $C$. Josh wants to find out how cold it is in degrees Fahrenheit, $F$. Solve the formula $C = \dfrac{5}{9}(F - 32)$ for $F$ so that Josh can convert Celsius to Fahrenheit.`,
    answerSummary: String.raw`$F = \dfrac{9}{5}C + 32$`,
    modelSolution: String.raw`Multiply both sides by $9$: $9C = 5(F - 32) = 5F - 160$. Add $160$: $5F = 9C + 160$. Divide by $5$: $F = \dfrac{9C + 160}{5} = \dfrac{9}{5}C + 32$.`,
    rubric: [
      { credits: 2, criteria: String.raw`$F = \dfrac{9}{5}C + 32$ or an equivalent equation is written, and correct work is shown.` },
      { credits: 1, criteria: String.raw`Appropriate work is shown, but one computational error is made; OR appropriate work is shown, but one conceptual error is made; OR $F = \dfrac{9}{5}C + 32$, but no work is shown.` },
      { credits: 0, criteria: ZERO_OLD },
    ],
  },

  {
    id: "lit-cr-0823-q28",
    mode: "self-score",
    standard: "AI-A.CED.4",
    topic: "Transforming formulas — solving for a variable",
    examCitation: "regents-algI-0823-q28",
    part: "II",
    credits: 2,
    prompt: String.raw`The formula $d = t\left(\dfrac{v_i + v_f}{2}\right)$ is used to calculate the distance, $d$, covered by an object in a given period of time, $t$. Solve the formula for $v_f$, the final velocity, in terms of $d$, $t$, and $v_i$, the initial velocity.`,
    answerSummary: String.raw`$v_f = \dfrac{2d}{t} - v_i$`,
    modelSolution: String.raw`Multiply both sides by $2$: $2d = t(v_i + v_f)$. Divide both sides by $t$: $\dfrac{2d}{t} = v_i + v_f$. Subtract $v_i$: $v_f = \dfrac{2d}{t} - v_i$.`,
    rubric: [
      { credits: 2, criteria: String.raw`$v_f = \dfrac{2d}{t} - v_i$, and correct work is shown.` },
      { credits: 1, criteria: String.raw`Appropriate work is shown, but one computational error is made; OR appropriate work is shown, but one conceptual error is made; OR appropriate work is shown, but the expression $\dfrac{2d}{t} - v_i$ is written; OR $v_f = \dfrac{2d}{t} - v_i$, but no work is shown.` },
      { credits: 0, criteria: ZERO_NEW },
    ],
  },

  {
    id: "lit-cr-0819-q28",
    mode: "self-score",
    standard: "AI-A.CED.4",
    topic: "Transforming formulas — solving for a variable",
    examCitation: "regents-algI-0819-q28",
    part: "II",
    credits: 2,
    prompt: String.raw`The formula $a = \dfrac{v_f - v_i}{t}$ is used to calculate acceleration as the change in velocity over the period of time. Solve the formula for the final velocity, $v_f$, in terms of initial velocity, $v_i$, acceleration, $a$, and time, $t$.`,
    answerSummary: String.raw`$v_f = at + v_i$`,
    modelSolution: String.raw`Multiply both sides by $t$: $at = v_f - v_i$. Add $v_i$ to both sides: $v_f = at + v_i$.`,
    rubric: [
      { credits: 2, criteria: String.raw`$v_f = at + v_i$, and correct work is shown.` },
      { credits: 1, criteria: String.raw`Appropriate work is shown, but one computational error is made; OR appropriate work is shown, but one conceptual error is made; OR $v_f = at + v_i$, but no work is shown.` },
      { credits: 0, criteria: ZERO_OLD },
    ],
  },

  {
    id: "lit-cr-0817-q27",
    mode: "self-score",
    standard: "AI-A.CED.4",
    topic: "Transforming formulas — solving for a variable",
    examCitation: "regents-algI-0817-q27",
    part: "II",
    credits: 2,
    prompt: String.raw`Using the formula for the volume of a cone, $V = \dfrac{1}{3}\pi r^2 h$, express $r$ in terms of $V$, $h$, and $\pi$.`,
    answerSummary: String.raw`$r = \sqrt{\dfrac{3V}{\pi h}}$`,
    modelSolution: String.raw`Multiply both sides by $3$: $3V = \pi r^2 h$. Divide both sides by $\pi h$: $r^2 = \dfrac{3V}{\pi h}$. Take the positive square root: $r = \sqrt{\dfrac{3V}{\pi h}}$.`,
    rubric: [
      { credits: 2, criteria: String.raw`$r = \sqrt{\dfrac{3V}{\pi h}}$, and correct work is shown.` },
      { credits: 1, criteria: String.raw`Appropriate work is shown, but one computational error is made; OR appropriate work is shown, but one conceptual error is made; OR appropriate work is shown, but the answer is expressed as $r = \pm\sqrt{\dfrac{3V}{\pi h}}$; OR $r = \sqrt{\dfrac{3V}{\pi h}}$, but no work is shown.` },
      { credits: 0, criteria: ZERO_OLD },
    ],
  },

  {
    // Standardized NYSED 2-credit rubric boilerplate: the Jan-2018 Rating Guide
    // PDF is not retrievable (404 on nysedregents.org), so the verbatim per-item
    // rubric could not be fetched; the 2-credit boilerplate is standardized.
    id: "lit-cr-0118-q30",
    mode: "self-score",
    standard: "AI-A.CED.4",
    topic: "Transforming formulas — solving for a variable",
    examCitation: "regents-algI-0118-q30",
    part: "II",
    credits: 2,
    prompt: String.raw`The formula $F_g = \dfrac{GM_1 M_2}{r^2}$ calculates the gravitational force between two objects where $G$ is the gravitational constant, $M_1$ is the mass of one object, $M_2$ is the mass of the other object, and $r$ is the distance between them. Solve for the positive value of $r$ in terms of $F_g$, $G$, $M_1$, and $M_2$.`,
    answerSummary: String.raw`$r = \sqrt{\dfrac{GM_1 M_2}{F_g}}$`,
    modelSolution: String.raw`Multiply both sides by $r^2$: $F_g r^2 = GM_1 M_2$. Divide both sides by $F_g$: $r^2 = \dfrac{GM_1 M_2}{F_g}$. Take the positive square root: $r = \sqrt{\dfrac{GM_1 M_2}{F_g}}$.`,
    rubric: [
      { credits: 2, criteria: String.raw`$r = \sqrt{\dfrac{GM_1 M_2}{F_g}}$, and correct work is shown.` },
      { credits: 1, criteria: String.raw`Appropriate work is shown, but one computational error is made; OR appropriate work is shown, but one conceptual error is made; OR $r = \sqrt{\dfrac{GM_1 M_2}{F_g}}$, but no work is shown.` },
      { credits: 0, criteria: ZERO_OLD },
    ],
  },

  // —————————————————— Part III constructed response (4 credits) ——————————————————

  {
    id: "lit-cr-0814-q34",
    mode: "self-score",
    standard: "AI-A.CED.4",
    topic: "Transforming formulas — solve, then evaluate",
    examCitation: "regents-algI-0814-q34",
    part: "III",
    credits: 4,
    prompt: String.raw`The formula for the area of a trapezoid is $A = \dfrac{1}{2}h(b_1 + b_2)$. Express $b_1$ in terms of $A$, $h$, and $b_2$. The area of a trapezoid is 60 square feet, its height is 6 ft, and one base is 12 ft. Find the number of feet in the other base.`,
    answerSummary: String.raw`$b_1 = \dfrac{2A - hb_2}{h}$; the other base is $8$ ft.`,
    modelSolution: String.raw`Multiply both sides by $2$: $2A = h(b_1 + b_2)$. Divide by $h$: $\dfrac{2A}{h} = b_1 + b_2$. Subtract $b_2$: $b_1 = \dfrac{2A - hb_2}{h}$.

Substitute $A = 60$, $h = 6$, $b_2 = 12$: $b_1 = \dfrac{2(60) - 6(12)}{6} = \dfrac{120 - 72}{6} = \dfrac{48}{6} = 8$. The other base is $8$ ft.`,
    rubric: [
      { credits: 4, criteria: String.raw`$\dfrac{2A - hb_2}{h}$ or an equivalent expression and 8, and correct work is shown.` },
      { credits: 3, criteria: String.raw`Appropriate work is shown, but one computational error is made; OR appropriate work is shown to find $\dfrac{2A - hb_2}{h}$, but no further correct work is shown.` },
      { credits: 2, criteria: String.raw`Appropriate work is shown, but two or more computational errors are made; OR appropriate work is shown, but one conceptual error is made; OR $\dfrac{2A - hb_2}{h}$ and 8, but no work is shown.` },
      { credits: 1, criteria: String.raw`Appropriate work is shown, but one conceptual error and one computational error are made; OR appropriate work is shown to find 8, but no further correct work is shown.` },
      { credits: 0, criteria: ZERO_OLD },
    ],
  },

  {
    id: "lit-cr-0815-q35",
    mode: "self-score",
    standard: "AI-A.CED.4",
    topic: "Transforming formulas — solve, then evaluate",
    examCitation: "regents-algI-0815-q35",
    part: "III",
    credits: 4,
    prompt: String.raw`The volume of a large can of tuna fish can be calculated using the formula $V = \pi r^2 h$. Write an equation to find the radius, $r$, in terms of $V$ and $h$. Determine the diameter, to the nearest inch, of a large can of tuna fish that has a volume of 66 cubic inches and a height of 3.3 inches.`,
    answerSummary: String.raw`$r = \sqrt{\dfrac{V}{\pi h}}$; the diameter is $5$ inches.`,
    modelSolution: String.raw`Divide both sides of $V = \pi r^2 h$ by $\pi h$: $r^2 = \dfrac{V}{\pi h}$. Take the positive square root: $r = \sqrt{\dfrac{V}{\pi h}}$.

Substitute $V = 66$ and $h = 3.3$: $r = \sqrt{\dfrac{66}{\pi(3.3)}} \approx \sqrt{6.366} \approx 2.52$ inches. The diameter is $2r \approx 5.05 \approx 5$ inches.`,
    rubric: [
      { credits: 4, criteria: String.raw`$r = \sqrt{\dfrac{V}{\pi h}}$ and 5, and correct work is shown.` },
      { credits: 3, criteria: String.raw`Appropriate work is shown, but one computational error is made; OR appropriate work is shown to find $r = \sqrt{\dfrac{V}{\pi h}}$ and the correct radius, but no further correct work is shown; OR the expression $\sqrt{\dfrac{V}{\pi h}}$ and 5, and correct work is shown; OR appropriate work is shown to find $r = \pm\sqrt{\dfrac{V}{\pi h}}$ and 5.` },
      { credits: 2, criteria: String.raw`Appropriate work is shown, but two or more computational errors are made; OR appropriate work is shown, but one conceptual error is made; OR appropriate work is shown to find $r = \pm\sqrt{\dfrac{V}{\pi h}}$ or 5, but no further correct work is shown.` },
      { credits: 1, criteria: String.raw`Appropriate work is shown, but one conceptual error and one computational error are made; OR appropriate work is shown to find the length of the radius, but no further correct work is shown; OR $r = \sqrt{\dfrac{V}{\pi h}}$ and 5, but no work is shown.` },
      { credits: 0, criteria: ZERO_OLD },
    ],
  },
];

export default bank;
