// Authored Regents problem-bank — Statistics (linear regression / line of best
// fit, AI-S.ID.6). Real released Next Generation Algebra I Regents questions,
// cited to the administration. Regression equations & correlation coefficients
// are the official Rating-Guide values; model solutions authored; the data is
// shown as a `table` figure (given) and visualized as a `scatter` figure with
// the line of best fit (answer). SME-ratified.

import type { RegentsItem } from "@/lib/regents/bank";

const bank: RegentsItem[] = [
  {
    id: "stat-cr-0624-q32",
    mode: "self-score",
    standard: "AI-S.ID.6",
    topic: "Linear regression & correlation",
    examCitation: "regents-algI-0624-q32",
    part: "III",
    credits: 4,
    prompt:
      "The table below shows the amount of money a popular movie earned, in millions of dollars, during its first six weeks in theaters. Write the linear regression equation for this data set, rounding all values to the nearest hundredth. State the correlation coefficient to the nearest hundredth, and state what it indicates about the linear fit of the data.",
    figure: {
      kind: "table",
      headers: ["Week (x)", 1, 2, 3, 4, 5, 6],
      rows: [["Dollars earned, in millions (y)", 185, 150, 90, 50, 25, 5]],
    },
    answerSummary: String.raw`$y = -37.57x + 215.67$; $r = -0.98$ — a strong (negative) linear fit.`,
    modelSolution: String.raw`Linear regression on the six data points gives $y = -37.57x + 215.67$. The correlation coefficient is $r = -0.98$; because it is very close to $-1$, the data has a strong negative linear relationship — the earnings fall in a nearly straight line. The scatter plot with the line of best fit:`,
    solutionFigure: {
      kind: "scatter",
      points: [
        [1, 185],
        [2, 150],
        [3, 90],
        [4, 50],
        [5, 25],
        [6, 5],
      ],
      xRange: [0, 7],
      yRange: [0, 220],
      fit: { m: -37.57, b: 215.67 },
      xLabel: "Week",
      yLabel: "Dollars (millions)",
      caption: "The data fall in a strong negative linear trend (r = −0.98).",
    },
    rubric: [
      { credits: 4, criteria: String.raw`$y = -37.57x + 215.67$, $-0.98$, and "strong" is stated.` },
      { credits: 3, criteria: String.raw`Appropriate work, but one rounding error; OR the expression $-37.57x + 215.67$ is written (not as an equation); OR the full calculator display with incorrect a, b, r is written and used appropriately.` },
      { credits: 2, criteria: String.raw`$y = -37.57x + 215.67$ is written, but no further correct work is shown.` },
      { credits: 1, criteria: String.raw`$-0.98$ is stated, but no further correct work is shown.` },
      { credits: 0, criteria: "A response with no relevant course-level work." },
    ],
  },
  {
    id: "stat-cr-0125-q32",
    mode: "self-score",
    standard: "AI-S.ID.6",
    topic: "Linear regression & correlation",
    examCitation: "regents-algI-0125-q32",
    part: "III",
    credits: 4,
    prompt:
      "The table below shows the average heart rate, x, and Calories burned, y, for seven members of an Olympic rowing team during a one-hour workout. Write the linear regression equation that models these data, rounding all values to the nearest tenth. State the correlation coefficient, rounded to the nearest tenth, and state what it suggests about the linear fit of these data.",
    figure: {
      kind: "table",
      headers: ["Heart rate (x)", 135, 147, 150, 144, 146, 153, 143],
      rows: [["Calories burned (y)", 725, 812, 866, 761, 825, 863, 737]],
    },
    answerSummary: String.raw`$y = 9.1x - 527.6$; $r = 0.9$ — a strong (positive) linear fit.`,
    modelSolution: String.raw`Linear regression gives $y = 9.1x - 527.6$, with correlation coefficient $r = 0.9$. Because $r$ is close to $1$, the data has a strong positive linear relationship — more Calories are burned at higher heart rates. The scatter plot with the line of best fit:`,
    solutionFigure: {
      kind: "scatter",
      points: [
        [135, 725],
        [147, 812],
        [150, 866],
        [144, 761],
        [146, 825],
        [153, 863],
        [143, 737],
      ],
      xRange: [130, 155],
      yRange: [700, 880],
      fit: { m: 9.1, b: -527.6 },
      xLabel: "Heart rate",
      yLabel: "Calories",
      caption: "The data rise in a strong positive linear trend (r = 0.9).",
    },
    rubric: [
      { credits: 4, criteria: String.raw`$y = 9.1x - 527.6$, $0.9$, and "strong" is stated.` },
      { credits: 3, criteria: String.raw`Appropriate work, but one rounding error; OR the expression $9.1x - 527.6$ is written (not as an equation); OR the full calculator display with incorrect a, b, r is written and used appropriately.` },
      { credits: 2, criteria: String.raw`$y = 9.1x - 527.6$ is written, but no further correct work is shown.` },
      { credits: 1, criteria: String.raw`$0.9$ is stated, but no further correct work is shown.` },
      { credits: 0, criteria: "A response with no relevant course-level work." },
    ],
  },
  {
    id: "stat-mc-0126-q18",
    mode: "mc",
    standard: "AI-S.ID.5",
    topic: "Two-way frequency tables",
    examCitation: "regents-algI-0126-q18",
    part: "I",
    credits: 2,
    prompt:
      "The two-way frequency table below summarizes concession-stand sales for a football game. Of the people making a purchase at the concession stand, what is the relative frequency of them buying pizza and a water?",
    figure: {
      kind: "table",
      headers: ["", "Soda", "Water", "Coffee", "Total"],
      rows: [
        ["Hot dogs", 50, 62, 46, 158],
        ["Pizza", 120, 58, 4, 182],
        ["No food", 30, 20, 10, 60],
        ["Total", 200, 140, 60, 400],
      ],
      caption: "Concession Stand Sales",
    },
    choices: ["0.58", "0.35", "0.455", "0.145"],
    answer: 3,
    explanation:
      "Pizza-and-water is the Pizza row, Water column: 58 people, out of 400 total purchases. 58 / 400 = 0.145. The other choices are the marginal totals (140/400, 182/400).",
  },
];

export default bank;
