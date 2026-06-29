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

  // ——— Correlation coefficient: strength & direction (AI-S.ID.8) ———
  {
    id: "stat-mc-0617-q14",
    mode: "mc",
    standard: "AI-S.ID.8",
    topic: "Correlation coefficient — strength of fit",
    examCitation: "regents-algI-0617-q14",
    part: "I",
    credits: 2,
    prompt:
      "Bella found the line of best fit for her data and used the correlation coefficient to judge the strength of the linear fit. Which correlation coefficient represents the strongest linear relationship?",
    choices: ["0.9", "0.5", "−0.3", "−0.8"],
    answer: 0,
    explanation:
      "Strength depends on how close the coefficient is to ±1 — that is, its absolute value. |0.9| = 0.9 is the largest, so 0.9 is the strongest fit. (The sign only tells direction, not strength.)",
  },
  {
    id: "stat-mc-0117-q03",
    mode: "mc",
    standard: "AI-S.ID.8",
    topic: "Correlation coefficient — interpret strength & direction",
    examCitation: "regents-algI-0117-q03",
    part: "I",
    credits: 2,
    prompt:
      "Analysis of a statistical study shows a linear relationship with a correlation coefficient of −0.524. Which statement best summarizes this result?",
    choices: [
      "There is a strong positive correlation between the variables.",
      "There is a strong negative correlation between the variables.",
      "There is a moderate positive correlation between the variables.",
      "There is a moderate negative correlation between the variables.",
    ],
    answer: 3,
    explanation:
      "The negative sign means the variables move in opposite directions (negative). |−0.524| is roughly halfway to 1, which is moderate — not strong. So: moderate negative correlation.",
  },
  {
    id: "stat-mc-0817-q22",
    mode: "mc",
    standard: "AI-S.ID.8",
    topic: "Correlation coefficient — read regression output",
    examCitation: "regents-algI-0817-q22",
    part: "I",
    credits: 2,
    prompt: String.raw`A linear regression produced the results below.
$$a = -1.15786,\quad b = 139.317,\quad r = -0.896558,\quad r^2 = 0.803816$$
Which phrase best describes the relationship between $x$ and $y$?`,
    choices: [
      "strong negative correlation",
      "strong positive correlation",
      "weak negative correlation",
      "weak positive correlation",
    ],
    answer: 0,
    explanation: String.raw`The correlation coefficient is $r = -0.8966$. Its sign is negative (so the relationship is negative), and $|r| \approx 0.9$ is close to $1$, which is strong. So: strong negative correlation.`,
  },

  // ——— Correlation vs. causation (AI-S.ID.9) ———
  {
    id: "stat-mc-0622-q01",
    mode: "mc",
    standard: "AI-S.ID.9",
    topic: "Correlation vs. causation",
    examCitation: "regents-algI-0622-q01",
    part: "I",
    credits: 2,
    prompt: "Which correlation shows a causal relationship?",
    choices: [
      "The more minutes an athlete is on the playing field, the more goals he scores.",
      "The more gasoline that you purchase at the pump, the more you pay.",
      "The longer a shopper stays at the mall, the more purchases she makes.",
      "As the price of a gift increases, the size of the gift box increases.",
    ],
    answer: 1,
    explanation:
      "Causation means one variable directly *makes* the other change. Buying more gasoline directly causes you to pay more — the amount sets the price. The others are merely correlated: more field time or mall time doesn't by itself cause goals or purchases, and box size doesn't depend on price.",
  },
  {
    id: "stat-mc-0817-q08",
    mode: "mc",
    standard: "AI-S.ID.9",
    topic: "Correlation vs. causation",
    examCitation: "regents-algI-0817-q08",
    part: "I",
    credits: 2,
    prompt: "Which situation does not describe a causal relationship?",
    choices: [
      "The higher the volume on a radio, the louder the sound will be.",
      "The faster a student types a research paper, the more pages the paper will have.",
      "The shorter the distance driven, the less gasoline that will be used.",
      "The slower the pace of a runner, the longer it will take the runner to finish the race.",
    ],
    answer: 1,
    explanation:
      "Typing faster does not cause a paper to have more pages — the length depends on the content, not the typing speed. The other three are genuine cause-and-effect: volume → loudness, distance → gas used, pace → finish time.",
  },
  {
    id: "stat-mc-0117-q13",
    mode: "mc",
    standard: "AI-S.ID.9",
    topic: "Correlation vs. causation — direction & cause",
    examCitation: "regents-algI-0117-q13",
    part: "I",
    credits: 2,
    prompt:
      "What type of relationship exists between the number of pages printed on a printer and the amount of ink used by that printer?",
    choices: [
      "positive correlation, but not causal",
      "positive correlation, and causal",
      "negative correlation, but not causal",
      "negative correlation, and causal",
    ],
    answer: 1,
    explanation:
      "More pages printed means more ink used, so the two rise together — a positive correlation. And printing the pages is what *uses* the ink, so it is also causal: positive correlation, and causal.",
  },
  {
    id: "stat-mc-0626-q08",
    mode: "mc",
    standard: "AI-S.ID.9",
    topic: "Correlation vs. causation — direction & cause",
    examCitation: "regents-algI-0626-q08",
    part: "I",
    credits: 2,
    prompt:
      "When a bicyclist increases the pressure on the brakes, the speed of the bicycle decreases. This relationship can best be described as a",
    choices: [
      "negative correlation and causal relationship",
      "negative correlation and non-causal relationship",
      "positive correlation and causal relationship",
      "positive correlation and non-causal relationship",
    ],
    answer: 0,
    explanation:
      "As brake pressure goes up, speed goes down — the variables move in opposite directions, so the correlation is negative. Braking is what *causes* the slowing, so it is also causal: negative correlation and causal.",
  },

  // ——— Correlation coefficient from data (AI-S.ID.8) ———
  {
    id: "stat-mc-0816-q06",
    mode: "mc",
    standard: "AI-S.ID.8",
    topic: "Correlation coefficient — estimate from data",
    examCitation: "regents-algI-0816-q06",
    part: "I",
    credits: 2,
    prompt:
      "The table below shows 6 students' overall averages and their averages in their math class. If a linear model is applied to these data, which statement best describes the correlation coefficient?",
    figure: {
      kind: "table",
      headers: ["Overall Student Average", 92, 98, 84, 80, 75, 82],
      rows: [["Math Class Average", 91, 95, 85, 85, 75, 78]],
    },
    choices: ["It is close to −1.", "It is close to 1.", "It is close to 0.", "It is close to 0.5."],
    answer: 1,
    explanation:
      "The two averages rise together almost in lockstep (higher overall average ↔ higher math average), a strong positive linear pattern. So the correlation coefficient is positive and near +1; computing it gives r ≈ 0.92, which is close to 1.",
  },
  {
    id: "stat-mc-0822-q23",
    mode: "mc",
    standard: "AI-S.ID.8",
    topic: "Correlation coefficient — compute from data",
    examCitation: "regents-algI-0822-q23",
    part: "I",
    credits: 2,
    prompt:
      "The table below shows the time, in hours, spent by students on electronic devices and their math test scores. The data collected model a linear regression. What is the correlation coefficient, to the nearest hundredth, for these data?",
    figure: {
      kind: "table",
      headers: ["Time on an Electronic Device (hours)", "Math Test Score"],
      rows: [
        [3, 85],
        [1, 99],
        [4, 81],
        [0, 98],
        [3, 90],
        [7, 65],
        [5, 78],
        [2, 90],
      ],
    },
    choices: ["−0.98", "−0.95", "0.98", "0.95"],
    answer: 0,
    explanation:
      "More device time goes with lower scores — a strong negative trend. Running linear regression on the eight points gives r ≈ −0.98: negative (sign) and very close to −1 (strong).",
  },
  {
    id: "stat-mc-0825-q12",
    mode: "mc",
    standard: "AI-S.ID.8",
    topic: "Correlation coefficient — strength from data",
    examCitation: "regents-algI-0825-q12",
    part: "I",
    credits: 2,
    prompt:
      "Fred recorded the number of minutes he read each day, from Monday through Friday. His results are shown in the table. What is the correlation coefficient, to the nearest thousandth, and strength of the linear model of these data?",
    figure: {
      kind: "table",
      headers: ["Day", "Number of Minutes Read"],
      rows: [
        [1, 12],
        [2, 16],
        [3, 19],
        [4, 27],
        [5, 29],
      ],
    },
    choices: ["0.984 and strong", "0.968 and strong", "0.984 and weak", "0.968 and weak"],
    answer: 0,
    explanation:
      "Minutes read climb steadily with the day, a strong positive trend. Linear regression gives r ≈ 0.984; because |r| is very close to 1, the linear fit is strong.",
  },

  // ——— Comparing center & spread of two data sets (AI-S.ID.2) ———
  {
    id: "stat-mc-0622-q14",
    mode: "mc",
    standard: "AI-S.ID.2",
    topic: "Comparing data sets — median & IQR",
    examCitation: "regents-algI-0622-q14",
    part: "I",
    credits: 2,
    prompt:
      "Donna and Andrew compared their math final exam scores from grade 8 through grade 12. Their scores are shown below. Which statement about their final exam scores is correct?",
    figure: {
      kind: "table",
      headers: ["Grade", "Donna", "Andrew"],
      rows: [
        ["8th", 90, 78],
        ["9th", 92, 96],
        ["10th", 87, 87],
        ["11th", 94, 94],
        ["12th", 95, 93],
      ],
    },
    choices: [
      "Andrew has a higher mean than Donna.",
      "Donna and Andrew have the same median.",
      "Andrew has a larger interquartile range than Donna.",
      "The 3rd quartile for Donna is greater than the 3rd quartile for Andrew.",
    ],
    answer: 2,
    explanation:
      "Sort each set. Donna {87, 90, 92, 94, 95}: Q1 = 88.5, Q3 = 94.5, so IQR = 6. Andrew {78, 87, 93, 94, 96}: Q1 = 82.5, Q3 = 95, so IQR = 12.5. Andrew's interquartile range is larger. (Donna's mean 91.6 is actually higher, the medians differ — 92 vs 93 — and Andrew's Q3 is higher, ruling out the others.)",
  },
  {
    id: "stat-mc-0614-q19",
    mode: "mc",
    standard: "AI-S.ID.2",
    topic: "Comparing data sets — mean",
    examCitation: "regents-algI-0614-q19",
    part: "I",
    credits: 2,
    prompt: String.raw`Christopher looked at his quiz scores shown below for the first and second semester of his Algebra class.
Semester $1$: $78, 91, 88, 83, 94$
Semester $2$: $91, 96, 80, 77, 88, 85, 92$
Which statement about Christopher's performance is correct?`,
    choices: [
      "The interquartile range for semester 1 is greater than the interquartile range for semester 2.",
      "The median score for semester 1 is greater than the median score for semester 2.",
      "The mean score for semester 2 is greater than the mean score for semester 1.",
      "The third quartile for semester 2 is greater than the third quartile for semester 1.",
    ],
    answer: 2,
    explanation:
      "Semester 1 mean = (78+91+88+83+94)/5 = 86.8. Semester 2 mean = (91+96+80+77+88+85+92)/7 = 87. Since 87 > 86.8, the mean for semester 2 is greater. (Both medians are 88 and both IQRs work out to 12, ruling out the others.)",
  },
  {
    id: "stat-mc-0625-q04",
    mode: "mc",
    standard: "AI-S.ID.2",
    topic: "Comparing data sets — mean & standard deviation",
    examCitation: "regents-algI-0625-q04",
    part: "I",
    credits: 2,
    prompt:
      "The geometry test scores for Andrea and Joe are shown in the table below. Which statement about their test scores is correct?",
    figure: {
      kind: "table",
      headers: ["Andrea", "Joe"],
      rows: [
        [82, 91],
        [87, 78],
        [90, 94],
        [84, 67],
      ],
    },
    choices: [
      "Both the mean and standard deviation of Andrea's test scores are higher than Joe's.",
      "Both the mean and standard deviation of Joe's test scores are higher than Andrea's.",
      "The mean of Andrea's test scores is higher than Joe's, but Joe's standard deviation is higher than Andrea's.",
      "The mean of Joe's test scores is higher than Andrea's, but Andrea's standard deviation is higher than Joe's.",
    ],
    answer: 2,
    explanation:
      "Andrea: mean = 85.75, standard deviation ≈ 3.0 (scores tightly clustered). Joe: mean = 82.5, standard deviation ≈ 10.8 (scores spread from 67 to 94). So Andrea's mean is higher, but Joe's scores are far more spread out — Joe's standard deviation is higher.",
  },
  {
    id: "stat-mc-0815-q19",
    mode: "mc",
    standard: "AI-S.ID.2",
    topic: "Comparing data sets — mean & standard deviation",
    examCitation: "regents-algI-0815-q19",
    part: "I",
    credits: 2,
    prompt: String.raw`The two sets of data below represent the number of runs scored by two different youth baseball teams over the course of a season.
Team A: $4, 8, 5, 12, 3, 9, 5, 2$
Team B: $5, 9, 11, 4, 6, 11, 2, 7$
Which set of statements about the mean and standard deviation is true?`,
    choices: [
      "mean A < mean B; standard deviation A > standard deviation B",
      "mean A > mean B; standard deviation A < standard deviation B",
      "mean A < mean B; standard deviation A < standard deviation B",
      "mean A > mean B; standard deviation A > standard deviation B",
    ],
    answer: 0,
    explanation:
      "Mean A = 48/8 = 6; mean B = 55/8 = 6.875, so mean A < mean B. The standard deviations are σ_A ≈ 3.16 and σ_B ≈ 3.06, so standard deviation A > standard deviation B.",
  },
  {
    id: "stat-mc-0619-q22",
    mode: "mc",
    standard: "AI-S.ID.2",
    topic: "Population standard deviation",
    examCitation: "regents-algI-0619-q22",
    part: "I",
    credits: 2,
    prompt: String.raw`The following are the heights, in inches, of the players on the opening-night roster of the 2015–2016 New York Knicks:
$$84,\ 80,\ 87,\ 75,\ 77,\ 79,\ 80,\ 74,\ 76,\ 80,\ 80,\ 82,\ 82$$
The population standard deviation of these data is approximately`,
    choices: ["3.5", "13", "79.7", "80"],
    answer: 0,
    explanation:
      "Entering the 13 heights into a calculator's 1-Var Stats gives a population standard deviation σ ≈ 3.5. (79.7 is the mean and 13 is the count, not the spread.)",
  },
  {
    id: "stat-mc-0125-q20",
    mode: "mc",
    standard: "AI-S.ID.2",
    topic: "Interquartile range",
    examCitation: "regents-algI-0125-q20",
    part: "I",
    credits: 2,
    prompt:
      "The table below shows the highest temperatures recorded in August for several years in one town. The interquartile range of these data is",
    figure: {
      kind: "table",
      headers: ["Year", "Temperature (°F)"],
      rows: [
        [1990, 86],
        [1991, 78],
        [1992, 84],
        [1993, 95],
        [1994, 81],
        [1995, 77],
        [1996, 88],
        [1997, 93],
      ],
    },
    choices: ["7", "10", "11", "18"],
    answer: 2,
    explanation:
      "Sort the temperatures: 77, 78, 81, 84, 86, 88, 93, 95. The lower half {77, 78, 81, 84} has median Q1 = 79.5; the upper half {86, 88, 93, 95} has median Q3 = 90.5. IQR = 90.5 − 79.5 = 11.",
  },

  // ——— Spread, outliers & shape (AI-S.ID.3) ———
  {
    id: "stat-mc-0617-q15",
    mode: "mc",
    standard: "AI-S.ID.3",
    topic: "Outliers & spread",
    examCitation: "regents-algI-0617-q15",
    part: "I",
    credits: 2,
    prompt: String.raw`The heights, in inches, of 12 students are listed below.
$$61, 67, 72, 62, 65, 59, 60, 79, 60, 61, 64, 63$$
Which statement best describes the spread of these data?`,
    choices: [
      "The set of data is evenly spread.",
      "The median of the data is 59.5.",
      "The set of data is skewed because 59 is the only value below 60.",
      "79 is an outlier, which would affect the standard deviation of these data.",
    ],
    answer: 3,
    explanation:
      "Sorted: 59, 60, 60, 61, 61, 62, 63, 64, 65, 67, 72, 79. Q1 = 60.5 and Q3 = 66, so IQR = 5.5 and the upper fence is Q3 + 1.5·IQR = 66 + 8.25 = 74.25. Since 79 > 74.25 it is an outlier, and that single far-off value inflates the standard deviation. (The median is actually 62.5, not 59.5.)",
  },
  {
    id: "stat-mc-0118-q16",
    mode: "mc",
    standard: "AI-S.ID.3",
    topic: "Outliers, center & spread",
    examCitation: "regents-algI-0118-q16",
    part: "I",
    credits: 2,
    prompt:
      "The 15 members of the French Club sold candy bars to help fund their trip to Quebec. The numbers of candy bars each member sold are listed below. When referring to the data, which statement is false?",
    figure: {
      kind: "table",
      headers: ["Number of Candy Bars Sold"],
      rows: [
        [0],
        [35],
        [38],
        [41],
        [43],
        [45],
        [50],
        [53],
        [53],
        [55],
        [68],
        [68],
        [68],
        [72],
        [120],
      ],
    },
    choices: [
      "The mode is the best measure of central tendency for the data.",
      "The data have two outliers.",
      "The median is 53.",
      "The range is 120.",
    ],
    answer: 0,
    explanation:
      "Q1 = 41 and Q3 = 68, so IQR = 27 and the fences are 41 − 40.5 = 0.5 and 68 + 40.5 = 108.5; both 0 and 120 fall outside, so there are two outliers (true), the middle value is 53 (true), and the range is 120 − 0 = 120 (true). The mode is 68 — near the high end, not central — so calling the mode the best measure of center is the false statement.",
  },

  // ——— Correlation vs. causation, from a study (AI-S.ID.9) ———
  {
    id: "stat-mc-0818-q21",
    mode: "mc",
    standard: "AI-S.ID.9",
    topic: "Correlation vs. causation — interpreting a study",
    examCitation: "regents-algI-0818-q21",
    part: "I",
    credits: 2,
    prompt:
      "The data obtained from a random sample of track athletes showed that as the foot size of the athlete decreased, the average running speed decreased. Which statement is best supported by the data?",
    choices: [
      "Smaller foot sizes cause track athletes to run slower.",
      "The sample of track athletes shows a causal relationship between foot size and running speed.",
      "The sample of track athletes shows a correlation between foot size and running speed.",
      "There is no correlation between foot size and running speed in track athletes.",
    ],
    answer: 2,
    explanation:
      "The two measurements move together (smaller foot ↔ slower speed), so the data show a correlation. But an observed association does not establish that foot size *causes* the speed difference, so the only claim the data support is that a correlation exists.",
  },

  // ——— Constructed response: correlation coefficient (AI-S.ID.8) ———
  {
    id: "stat-cr-0118-q31",
    mode: "self-score",
    standard: "AI-S.ID.8",
    topic: "Correlation coefficient & its meaning",
    examCitation: "regents-algI-0118-q31",
    part: "II",
    credits: 2,
    prompt:
      "At Mountain Lakes High School, the mathematics and physics scores of nine students were compared as shown in the table below. State the correlation coefficient, to the nearest hundredth, for the line of best fit for these data. Explain what the correlation coefficient means with regard to the context of this situation.",
    figure: {
      kind: "table",
      headers: ["Mathematics", 55, 93, 89, 60, 90, 45, 64, 76, 89],
      rows: [["Physics", 66, 89, 94, 52, 84, 56, 66, 73, 92]],
    },
    answerSummary: String.raw`$r \approx 0.92$ — a strong positive correlation between mathematics and physics scores.`,
    modelSolution: String.raw`Enter the nine $(\text{math}, \text{physics})$ pairs into a graphing calculator and run linear regression (with diagnostics on). The correlation coefficient is $r \approx 0.92$. Because $r$ is positive and very close to $1$, there is a strong positive correlation: students who scored higher in mathematics tended to score higher in physics as well.`,
    rubric: [
      { credits: 2, criteria: String.raw`$0.92$, and a correct explanation in context is written.` },
      {
        credits: 1,
        criteria: String.raw`Appropriate work is shown, but one computational error is made; OR appropriate work is shown, but one conceptual error is made; OR $0.92$, but the explanation is missing or incorrect.`,
      },
      {
        credits: 0,
        criteria:
          "A zero response is completely incorrect, irrelevant, or incoherent or is a correct response that was obtained by an obviously incorrect procedure.",
      },
    ],
  },

  // ——— Constructed response: comparing spread (AI-S.ID.2) ———
  {
    id: "stat-cr-0818-q31",
    mode: "self-score",
    standard: "AI-S.ID.2",
    topic: "Comparing spread from summary statistics",
    examCitation: "regents-algI-0818-q31",
    part: "II",
    credits: 2,
    prompt:
      "The students in Mrs. Lankford's 4th and 6th period Algebra classes took the same test. The results of the scores are shown in the table below. Based on these data, which class has the larger spread of test scores? Explain how you arrived at your answer.",
    figure: {
      kind: "table",
      headers: ["", "Mean (x̄)", "SD (σx)", "n", "Min", "Q1", "Med", "Q3", "Max"],
      rows: [
        ["4th Period", 77.75, 10.79, 20, 58, 69, 76.5, 87.5, 96],
        ["6th Period", 78.4, 9.83, 20, 59, 71.5, 78, 88, 96],
      ],
    },
    answerSummary: String.raw`The 4th period class — its standard deviation and interquartile range are both larger.`,
    modelSolution: String.raw`Spread is measured by the standard deviation and the interquartile range. For 4th period, $\sigma_x = 10.79$ and $\text{IQR} = Q_3 - Q_1 = 87.5 - 69 = 18.5$. For 6th period, $\sigma_x = 9.83$ and $\text{IQR} = 88 - 71.5 = 16.5$. Both measures of spread are larger for 4th period, so the 4th period class has the larger spread of test scores.`,
    rubric: [
      { credits: 2, criteria: String.raw`4th, and a correct explanation is written.` },
      {
        credits: 1,
        criteria: String.raw`Appropriate work is shown, but one conceptual error is made; OR 4th, but the explanation is incomplete.`,
      },
      {
        credits: 0,
        criteria:
          "4th, but no explanation is written; OR a zero response is completely incorrect, irrelevant, or incoherent or is a correct response that was obtained by an obviously incorrect procedure.",
      },
    ],
  },
  {
    id: "stat-cr-0119-q31",
    mode: "self-score",
    standard: "AI-S.ID.2",
    topic: "Comparing variability of two data sets",
    examCitation: "regents-algI-0119-q31",
    part: "II",
    credits: 2,
    prompt: String.raw`Santina is considering a vacation and has obtained high-temperature data from the last two weeks for Miami and Los Angeles.
Miami: $76, 75, 83, 73, 60, 66, 76, 81, 83, 85, 83, 87, 80, 80$
Los Angeles: $74, 63, 65, 67, 65, 65, 65, 62, 62, 72, 69, 64, 64, 61$
Which location has less variability in temperatures? Explain how you arrived at your answer.`,
    answerSummary: String.raw`Los Angeles — its spread (standard deviation, range, and IQR) is smaller.`,
    modelSolution: String.raw`Use a calculator's 1-Var Stats on each list. Miami has standard deviation $\sigma \approx 7.2$ and range $87 - 60 = 27$; Los Angeles has $\sigma \approx 3.6$ and range $74 - 61 = 13$. Every measure of spread is smaller for Los Angeles, so Los Angeles has less variability in temperatures.`,
    rubric: [
      { credits: 2, criteria: String.raw`Los Angeles, and a correct explanation is written.` },
      {
        credits: 1,
        criteria: String.raw`One conceptual error is made; OR Los Angeles, but the explanation is incomplete.`,
      },
      {
        credits: 0,
        criteria:
          "Los Angeles, but the explanation is missing or incorrect; OR a zero response is completely incorrect, irrelevant, or incoherent or is a correct response that was obtained by an obviously incorrect procedure.",
      },
    ],
  },
  {
    id: "stat-cr-0822-q28",
    mode: "self-score",
    standard: "AI-S.ID.2",
    topic: "Interquartile range",
    examCitation: "regents-algI-0822-q28",
    part: "II",
    credits: 2,
    prompt: String.raw`The ages of the last 16 United States presidents on their first inauguration day are shown below.
$$51, 54, 51, 60, 62, 43, 55, 56, 61, 52, 69, 64, 46, 54, 47, 70$$
Determine the interquartile range for this set of data.`,
    answerSummary: String.raw`$\text{IQR} = 10.5$`,
    modelSolution: String.raw`Sort the 16 ages: $43, 46, 47, 51, 51, 52, 54, 54, 55, 56, 60, 61, 62, 64, 69, 70$. The lower eight values have median $Q_1 = \tfrac{51+51}{2} = 51$; the upper eight have median $Q_3 = \tfrac{61+62}{2} = 61.5$. The interquartile range is $Q_3 - Q_1 = 61.5 - 51 = 10.5$.`,
    rubric: [
      { credits: 2, criteria: String.raw`$10.5$, and correct work is shown.` },
      {
        credits: 1,
        criteria: String.raw`Appropriate work is shown, but one computational error is made; OR appropriate work is shown, but one conceptual error is made; OR $10.5$, but no work is shown.`,
      },
      {
        credits: 0,
        criteria:
          "A zero response is completely incorrect, irrelevant, or incoherent or is a correct response that was obtained by an obviously incorrect procedure.",
      },
    ],
  },

  // ——— Constructed response: two-way frequency tables (AI-S.ID.5) ———
  {
    id: "stat-cr-0617-q29",
    mode: "self-score",
    standard: "AI-S.ID.5",
    topic: "Completing a two-way frequency table",
    examCitation: "regents-algI-0617-q29",
    part: "II",
    credits: 2,
    prompt:
      "A survey of 100 students was taken. It was found that 60 students watched sports, and 34 of these students did not like pop music. Of the students who did not watch sports, 70% liked pop music. Complete the two-way frequency table below.",
    figure: {
      kind: "table",
      headers: ["", "Watch Sports", "Don't Watch Sports", "Total"],
      rows: [
        ["Like Pop", "", "", ""],
        ["Don't Like Pop", "", "", ""],
        ["Total", "", "", 100],
      ],
      caption: "Complete the missing entries.",
    },
    answerSummary: String.raw`Like Pop: $26, 28, 54$; Don't Like Pop: $34, 12, 46$; column totals $60, 40, 100$.`,
    modelSolution: String.raw`Of $100$ students, $60$ watch sports, so $100 - 60 = 40$ do not. Among the $60$ who watch sports, $34$ do not like pop, so $60 - 34 = 26$ do like pop. Among the $40$ who do not watch sports, $70\%$ like pop: $0.70 \times 40 = 28$ like pop and $40 - 28 = 12$ do not. The row totals are $26 + 28 = 54$ (like pop) and $34 + 12 = 46$ (don't like pop).`,
    solutionFigure: {
      kind: "table",
      headers: ["", "Watch Sports", "Don't Watch Sports", "Total"],
      rows: [
        ["Like Pop", 26, 28, 54],
        ["Don't Like Pop", 34, 12, 46],
        ["Total", 60, 40, 100],
      ],
    },
    rubric: [
      { credits: 2, criteria: "The frequency table is completed correctly." },
      {
        credits: 1,
        criteria:
          "Appropriate work is shown, but one computational error is made; OR appropriate work is shown, but one conceptual error is made.",
      },
      {
        credits: 0,
        criteria:
          "Only the given information of 100, 60, and 34 is written in the table; OR a zero response is completely incorrect, irrelevant, or incoherent or is a correct response that was obtained by an obviously incorrect procedure.",
      },
    ],
  },
  {
    id: "stat-cr-0116-q30",
    mode: "self-score",
    standard: "AI-S.ID.5",
    topic: "Two-way table — making a prediction",
    examCitation: "regents-algI-0116-q30",
    part: "II",
    credits: 2,
    prompt:
      "A statistics class surveyed some students during one lunch period to obtain opinions about television programming preferences. The results of the survey are summarized in the table below. Based on the sample, predict how many of the school's 351 males would prefer comedy. Justify your answer.",
    figure: {
      kind: "table",
      headers: ["", "Comedy", "Drama"],
      rows: [
        ["Male", 70, 35],
        ["Female", 48, 42],
      ],
      caption: "Programming Preferences",
    },
    answerSummary: String.raw`About $234$ males.`,
    modelSolution: String.raw`In the sample, $70$ of the $70 + 35 = 105$ males preferred comedy, a relative frequency of $\tfrac{70}{105} = \tfrac{2}{3}$. Applying this rate to all $351$ males: $\tfrac{2}{3} \times 351 = 234$. About $234$ of the school's males would be predicted to prefer comedy.`,
    rubric: [
      { credits: 2, criteria: String.raw`$234$, and a correct justification is given.` },
      {
        credits: 1,
        criteria: String.raw`Appropriate work is shown, but one computational error is made; OR appropriate work is shown, but one conceptual error is made; OR appropriate work is shown to find $\tfrac{2}{3}$ or an equivalent fraction, but no further correct work is shown; OR $234$, but no justification is given.`,
      },
      {
        credits: 0,
        criteria:
          "A zero response is completely incorrect, irrelevant, or incoherent or is a correct response that was obtained by an obviously incorrect procedure.",
      },
    ],
  },
  {
    id: "stat-cr-0624-q28",
    mode: "self-score",
    standard: "AI-S.ID.5",
    topic: "Completing a two-way frequency table",
    examCitation: "regents-algI-0624-q28",
    part: "II",
    credits: 2,
    prompt: String.raw`A survey of 150 students was taken. It was determined that $\tfrac{2}{3}$ of the students play video games. Of the students that play video games, 85 also use social media. Of the students that do not play video games, 20% do not use social media. Complete the two-way frequency table below.`,
    figure: {
      kind: "table",
      headers: ["", "Play Video Games", "Do Not Play Video Games", "Total"],
      rows: [
        ["Social Media", "", "", ""],
        ["No Social Media", "", "", ""],
        ["Total", "", "", ""],
      ],
      caption: "Complete the missing entries.",
    },
    answerSummary: String.raw`Social Media: $85, 40, 125$; No Social Media: $15, 10, 25$; column totals $100, 50, 150$.`,
    modelSolution: String.raw`$\tfrac{2}{3} \times 150 = 100$ students play video games, so $150 - 100 = 50$ do not. Of the $100$ who play, $85$ use social media, so $100 - 85 = 15$ do not. Of the $50$ who do not play, $20\%$ do not use social media: $0.20 \times 50 = 10$ no social media and $50 - 10 = 40$ use social media. Row totals: social media $85 + 40 = 125$; no social media $15 + 10 = 25$.`,
    solutionFigure: {
      kind: "table",
      headers: ["", "Play Video Games", "Do Not Play Video Games", "Total"],
      rows: [
        ["Social Media", 85, 40, 125],
        ["No Social Media", 15, 10, 25],
        ["Total", 100, 50, 150],
      ],
    },
    rubric: [
      { credits: 2, criteria: "The frequency table is completed correctly." },
      {
        credits: 1,
        criteria:
          "Appropriate work is shown, but one computational error is made; OR appropriate work is shown, but one conceptual error is made; OR either 100 or 10 is written correctly in the table, and no further correct work is shown.",
      },
      {
        credits: 0,
        criteria:
          "Only the given information of 150 and 85 is written in the table; OR a zero response does not contain enough relevant course-level work to receive any credit, does not satisfy the criteria for one or more credits, or is a correct response that was obtained by an obviously incorrect procedure.",
      },
    ],
  },

  // ——— Constructed response: interpret slope & intercept in context (AI-S.ID.7) ———
  {
    id: "stat-cr-0118-q34",
    mode: "self-score",
    standard: "AI-S.ID.7",
    topic: "Interpreting slope & y-intercept of a linear model",
    examCitation: "regents-algI-0118-q34",
    part: "III",
    credits: 4,
    prompt:
      "Omar has a piece of rope. He ties a knot in the rope and measures the new length of the rope. He then repeats this process several times. Some of the data collected are listed in the table below. State, to the nearest tenth, the linear regression equation that approximates the length, y, of the rope after tying x knots. Explain what the y-intercept means in the context of the problem. Explain what the slope means in the context of the problem.",
    figure: {
      kind: "table",
      headers: ["Number of Knots", 4, 5, 6, 7, 8],
      rows: [["Length of Rope (cm)", 64, 58, 49, 39, 31]],
    },
    answerSummary: String.raw`$y = -8.5x + 99.2$. The y-intercept $99.2$ is the length of the rope with no knots; the slope $-8.5$ is the decrease in length (cm) per knot tied.`,
    modelSolution: String.raw`Running linear regression on the five $(\text{knots}, \text{length})$ points gives $y = -8.5x + 99.2$ (values to the nearest tenth).

The y-intercept, $99.2$, is the value of $y$ when $x = 0$ — the length of the rope before any knots are tied (about $99.2$ cm).

The slope, $-8.5$, is the change in length per additional knot: each knot tied shortens the rope by about $8.5$ cm.`,
    solutionFigure: {
      kind: "scatter",
      points: [
        [4, 64],
        [5, 58],
        [6, 49],
        [7, 39],
        [8, 31],
      ],
      xRange: [0, 9],
      yRange: [0, 110],
      fit: { m: -8.5, b: 99.2 },
      xLabel: "Number of knots",
      yLabel: "Length (cm)",
      caption: "Length drops about 8.5 cm per knot; the line meets the y-axis near 99.2 cm (no knots).",
    },
    rubric: [
      {
        credits: 4,
        criteria: String.raw`$y = -8.5x + 99.2$, and two correct explanations in context are written.`,
      },
      {
        credits: 3,
        criteria: String.raw`Appropriate work is shown, but one computational error is made; OR appropriate work is shown, but one explanation is missing or incorrect; OR appropriate work is shown, but the equation is not written in terms of $x$ and $y$.`,
      },
      {
        credits: 2,
        criteria: String.raw`Appropriate work is shown, but two or more computational errors are made; OR $y = -8.5x + 99.2$ is stated, but no further correct work is shown; OR two correct explanations are written, but the equation is missing or incorrect.`,
      },
      {
        credits: 1,
        criteria: String.raw`One correct explanation is written, but no further correct work is shown; OR the expression $-8.5x + 99.2$ is written, but no further correct work is shown.`,
      },
      {
        credits: 0,
        criteria:
          "A zero response is completely incorrect, irrelevant, or incoherent or is a correct response that was obtained by an obviously incorrect procedure.",
      },
    ],
  },
];

export default bank;
