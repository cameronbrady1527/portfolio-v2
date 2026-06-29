// Authored Regents problem-bank — Linear vs. Exponential models (AI-F.LE.1).
// Real released Next Generation Algebra I Regents questions, cited to the
// administration. Demonstrates FIGURE CHOICES: the four options are data tables.
// Answers independently verified; SME-ratified.

import type { RegentsItem } from "@/lib/regents/bank";

const bank: RegentsItem[] = [
  {
    id: "func-mc-0126-q13",
    mode: "mc",
    standard: "AI-F.LE.1",
    topic: "Linear vs. exponential — choose the model",
    examCitation: "regents-algI-0126-q13",
    part: "I",
    credits: 2,
    prompt: "Which table of values best models an exponential decay function?",
    choices: ["Table (1)", "Table (2)", "Table (3)", "Table (4)"],
    choiceFigures: [
      {
        kind: "table",
        headers: ["x", "f(x)"],
        rows: [
          [-2, 7],
          [-1, 4],
          [0, 1],
          [1, -2],
          [2, -5],
          [3, -8],
        ],
      },
      {
        kind: "table",
        headers: ["m", "f(m)"],
        rows: [
          [0, 200],
          [1, 180],
          [2, 162],
          [3, 146],
          [4, 131],
          [5, 118],
        ],
      },
      {
        kind: "table",
        headers: ["n", "f(n)"],
        rows: [
          [0, 200],
          [0.5, 210],
          [1, 220],
          [1.5, 231],
          [2, 242],
          [2.5, 254],
        ],
      },
      {
        kind: "table",
        headers: ["p", "f(p)"],
        rows: [
          [-3, -2],
          [-2, -5],
          [-1, -6],
          [0, -5],
          [1, -2],
          [2, 3],
        ],
      },
    ],
    answer: 1,
    explanation:
      "Exponential decay multiplies by a constant ratio less than 1. In Table (2), each f-value is 0.9 times the one before (200 → 180 → 162 → …). Table (1) is linear (it subtracts 3 each time), Table (3) increases (growth), and Table (4) is not monotonic.",
  },
  {
    id: "func-mc-0624-q7",
    mode: "mc",
    standard: "AI-F.LE.1",
    topic: "Identify the model from a situation",
    examCitation: "regents-algI-0624-q7",
    part: "I",
    credits: 2,
    prompt:
      "On an island, a rare breed of rabbit doubled its population each month for two years. Which type of function best models the increase in population at the end of the two years?",
    choices: [
      "linear growth",
      "linear decay",
      "exponential growth",
      "exponential decay",
    ],
    answer: 2,
    explanation:
      "Doubling each month means multiplying by a constant ratio (2), and the population increases — that is exponential growth.",
  },
  {
    id: "func-mc-0625-q3",
    mode: "mc",
    standard: "AI-F.LE.1",
    topic: "Identify the model from a situation",
    examCitation: "regents-algI-0625-q3",
    part: "I",
    credits: 2,
    prompt: "Which scenario represents an exponential relationship?",
    choices: [
      "Kirsten's New Year's resolution is to lose one pound each week.",
      "Sarah wants to increase her grade by 5 points each quarter.",
      String.raw`Tommy wants to reduce his spending by \$50 each month.`,
      "Dylan hopes to grow his business by 5% each month.",
    ],
    answer: 3,
    explanation:
      "Growing by 5% each month multiplies by a constant ratio (1.05), which is exponential. The other scenarios change by a constant amount each step, which is linear.",
  },
  {
    id: "func-mc-0125-q13",
    mode: "mc",
    standard: "AI-F.LE.1",
    topic: "Identify the model from a table",
    examCitation: "regents-algI-0125-q13",
    part: "I",
    credits: 2,
    prompt: "Based on the table of values below, this function can best be described as",
    figure: {
      kind: "table",
      headers: ["x", "f(x)"],
      rows: [
        [1, 0.125],
        [2, 0.25],
        [3, 0.5],
        [4, 1],
        [5, 2],
      ],
    },
    choices: ["linear", "quadratic", "exponential", "absolute value"],
    answer: 2,
    explanation:
      "Each f-value is double the one before it (×2) — a constant ratio — so the function is exponential.",
  },

  // ——— Classify a situation: constant difference (linear) vs constant factor (exponential) ———
  {
    id: "func-mc-0617-q21",
    mode: "mc",
    standard: "AI-F.LE.1",
    topic: "Linear vs. exponential — the defining difference",
    examCitation: "regents-algI-0617-q21",
    part: "I",
    credits: 2,
    prompt: "One characteristic of all linear functions is that they change by",
    choices: [
      "equal factors over equal intervals",
      "unequal factors over equal intervals",
      "equal differences over equal intervals",
      "unequal differences over equal intervals",
    ],
    answer: 2,
    explanation:
      "A linear function adds the same amount each step — equal differences over equal intervals. (An exponential function instead multiplies by the same factor each step — equal factors.)",
  },
  {
    id: "func-mc-0824-q02",
    mode: "mc",
    standard: "AI-F.LE.1",
    topic: "Identify the model from a situation",
    examCitation: "regents-algI-0824-q02",
    part: "I",
    credits: 2,
    prompt: "Which situation can be modeled by a linear function?",
    choices: [
      "A printer can print one page every three seconds.",
      "A bank account earns 0.5% interest each year, compounded annually.",
      "The number of cells in an organism doubles every four days.",
      "The attendance at a professional sports team's games decreases by 1.5% each year.",
    ],
    answer: 0,
    explanation:
      "Printing one page every three seconds adds pages at a constant rate — a constant difference, so it's linear. The other three change by a constant percentage or factor (compounding, doubling, −1.5% per year), which is exponential.",
  },
  {
    id: "func-mc-0822-q13",
    mode: "mc",
    standard: "AI-F.LE.1",
    topic: "Identify the model from a situation",
    examCitation: "regents-algI-0822-q13",
    part: "I",
    credits: 2,
    prompt: "Which situation could be modeled by a linear function?",
    choices: [
      "The value of a car depreciates by 7% annually.",
      String.raw`A gym charges a \$50 initial fee and then \$30 monthly.`,
      "The number of bacteria in a lab doubles weekly.",
      "The amount of money in a bank account increases by 0.1% monthly.",
    ],
    answer: 1,
    explanation: String.raw`Adding \$30 every month onto a starting \$50 is a constant rate of change — linear ($y = 50 + 30x$). Depreciating by 7%, doubling, and growing 0.1% monthly all multiply by a constant factor, which is exponential.`,
  },
  {
    id: "func-mc-0618-q14",
    mode: "mc",
    standard: "AI-F.LE.1",
    topic: "Identify the model from a situation — which is not linear",
    examCitation: "regents-algI-0618-q14",
    part: "I",
    credits: 2,
    prompt: "Which situation is not a linear function?",
    choices: [
      String.raw`A gym charges a membership fee of \$10.00 down and \$10.00 per month.`,
      String.raw`A cab company charges \$2.50 initially and \$3.00 per mile.`,
      String.raw`A restaurant employee earns \$12.50 per hour.`,
      String.raw`A \$12,000 car depreciates 15% per year.`,
    ],
    answer: 3,
    explanation:
      "A 15% yearly depreciation multiplies the value by 0.85 each year — a constant factor, which is exponential, not linear. The other three add a fixed amount per unit (per month, per mile, per hour), so they are linear.",
  },
  {
    id: "func-mc-0123-q08",
    mode: "mc",
    standard: "AI-F.LE.1",
    topic: "Identify the model from a description",
    examCitation: "regents-algI-0123-q08",
    part: "I",
    credits: 2,
    prompt:
      "Three friends tracked the text messages they received each hour. Emily's count increased by 8 each hour. Jessica's count doubled every hour. Chris received 3 messages the first hour, 10 the second, none the third, and 15 the last. Whose messages are best classified as a linear function?",
    choices: ["Emily, only", "Jessica, only", "Emily and Chris", "Jessica and Chris"],
    answer: 0,
    explanation:
      "Linear means a constant difference each step. Emily adds 8 every hour — linear. Jessica doubles (constant factor) — exponential. Chris's counts (3, 10, 0, 15) change by different amounts — neither. So only Emily's is linear.",
  },

  // ——— More situation classification (AI-F.LE.1) ———
  {
    id: "func-mc-0619-q11",
    mode: "mc",
    standard: "AI-F.LE.1",
    topic: "Identify the model from a situation",
    examCitation: "regents-algI-0619-q11",
    part: "I",
    credits: 2,
    prompt: "Which situation can be modeled by a linear function?",
    choices: [
      "The population of bacteria triples every day.",
      "The value of a cell phone depreciates at a rate of 3.5% each year.",
      "An amusement park allows 50 people to enter every 30 minutes.",
      "A baseball tournament eliminates half of the teams after each round.",
    ],
    answer: 2,
    explanation:
      "Letting 50 people in every 30 minutes adds people at a constant rate — a constant difference, so it's linear. Tripling, depreciating by 3.5%, and halving each round all multiply by a constant factor, which is exponential.",
  },
  {
    id: "func-mc-0117-q11",
    mode: "mc",
    standard: "AI-F.LE.1",
    topic: "Identify the model from a situation — exponential growth",
    examCitation: "regents-algI-0117-q11",
    part: "I",
    credits: 2,
    prompt: "Which scenario represents exponential growth?",
    choices: [
      "A water tank is filled at a rate of 2 gallons/minute.",
      "A vine grows 6 inches every week.",
      "A species of fly doubles its population every month during the summer.",
      "A car increases its distance from a garage as it travels at a constant speed of 25 miles per hour.",
    ],
    answer: 2,
    explanation:
      "Doubling the population every month multiplies by a constant factor (2), which is exponential growth. The other three change by a constant amount per unit of time — that's linear.",
  },
  {
    id: "func-mc-0124-q05",
    mode: "mc",
    standard: "AI-F.LE.1",
    topic: "Identify the model from a situation — exponential growth",
    examCitation: "regents-algI-0124-q05",
    part: "I",
    credits: 2,
    prompt: "Which situation represents exponential growth?",
    choices: [
      String.raw`Aidan adds \$10 to a jar each week.`,
      "A pine tree grows 1.5 feet per year.",
      String.raw`Ella earns \$20 per hour babysitting.`,
      "The number of people majoring in computer science doubles every 5 years.",
    ],
    answer: 3,
    explanation:
      "Doubling every 5 years multiplies by a constant factor (2) — exponential growth. Adding \\$10 each week, growing 1.5 ft per year, and earning \\$20 per hour all add a constant amount, which is linear.",
  },
  {
    id: "func-mc-0116-q23",
    mode: "mc",
    standard: "AI-F.LE.1",
    topic: "Linear vs. exponential — equal differences over equal intervals",
    examCitation: "regents-algI-0116-q23",
    part: "I",
    credits: 2,
    prompt:
      "Grisham is considering the three situations below. I. For the first 28 days, a sunflower grows at a rate of 3.5 cm per day. II. The value of a car depreciates at a rate of 15% per year after it is purchased. III. The amount of bacteria in a culture triples every two days during an experiment. Which of the statements describes a situation with an equal difference over an equal interval?",
    choices: ["I, only", "II, only", "I and III", "II and III"],
    answer: 0,
    explanation:
      "An equal difference over an equal interval means adding the same amount each step — that is the linear situation. The sunflower adds 3.5 cm every day (I). The car (×0.85 each year) and the bacteria (×3 every two days) change by an equal factor, not an equal difference. So I, only.",
  },
  {
    id: "func-mc-0818-q23",
    mode: "mc",
    standard: "AI-F.LE.1",
    topic: "Identify the model from a situation — which are exponential",
    examCitation: "regents-algI-0818-q23",
    part: "I",
    credits: 2,
    prompt:
      "Which of the three situations given below is best modeled by an exponential function? I. A bacteria culture doubles in size every day. II. A plant grows by 1 inch every 4 days. III. The population of a town declines by 5% every 3 years.",
    choices: ["I, only", "II, only", "I and II", "I and III"],
    answer: 3,
    explanation:
      "Exponential means a constant factor each step. Doubling (×2) is exponential (I), and declining by 5% (×0.95) is exponential (III). Growing 1 inch every 4 days adds a constant amount, so II is linear. The answer is I and III.",
  },
  {
    id: "func-mc-0621-q17",
    mode: "mc",
    standard: "AI-F.LE.1",
    topic: "Identify the model from a situation",
    examCitation: "regents-algI-0621-q17",
    part: "I",
    credits: 2,
    prompt: String.raw`Eric deposits \$500 in a bank account that pays 3.5% interest, compounded yearly. Which type of function should he use to determine how much money he will have in the account at the end of 10 years?`,
    choices: ["linear", "quadratic", "absolute value", "exponential"],
    answer: 3,
    explanation:
      "Interest compounded yearly multiplies the balance by a constant factor (1.035) each year, so the account grows exponentially.",
  },

  // ——— Identify the model from a table (AI-F.LE.1) ———
  {
    id: "func-mc-0123-q16",
    mode: "mc",
    standard: "AI-F.LE.1",
    topic: "Identify the model from a table",
    examCitation: "regents-algI-0123-q16",
    part: "I",
    credits: 2,
    prompt:
      "Thirty-two teams are participating in a basketball tournament. Only the winning teams in each round advance to the next round, as shown in the table below. Which function type best models the relationship between the number of rounds completed and the number of teams remaining?",
    figure: {
      kind: "table",
      headers: ["Rounds, x", "Teams, f(x)"],
      rows: [
        [0, 32],
        [1, 16],
        [2, 8],
        [3, 4],
        [4, 2],
        [5, 1],
      ],
    },
    choices: ["absolute value", "exponential", "linear", "quadratic"],
    answer: 1,
    explanation:
      "Each round the number of teams is multiplied by one-half (32 → 16 → 8 → 4 → …) — a constant ratio — so the model is exponential.",
  },
  {
    id: "func-mc-0619-q06",
    mode: "mc",
    standard: "AI-F.LE.1",
    topic: "Identify the model from a table",
    examCitation: "regents-algI-0619-q06",
    part: "I",
    credits: 2,
    prompt: "The function f is shown in the table below. Which type of function best models the given data?",
    figure: {
      kind: "table",
      headers: ["x", "f(x)"],
      rows: [
        [0, 1],
        [1, 3],
        [2, 9],
        [3, 27],
      ],
    },
    choices: [
      "exponential growth function",
      "exponential decay function",
      "linear function with positive rate of change",
      "linear function with negative rate of change",
    ],
    answer: 0,
    explanation:
      "Each f-value is three times the one before it (1 → 3 → 9 → 27) — a constant ratio greater than 1 — so it is an exponential growth function.",
  },
  {
    id: "func-mc-0614-q06",
    mode: "mc",
    standard: "AI-F.LE.1",
    topic: "Identify the model from a table",
    examCitation: "regents-algI-0614-q06",
    part: "I",
    credits: 2,
    prompt:
      "The table below shows the average yearly balance in a savings account where interest is compounded annually. No money is deposited or withdrawn after the initial amount is deposited. Which type of function best models the given data?",
    figure: {
      kind: "table",
      headers: ["Year", "Balance ($)"],
      rows: [
        [0, 380.0],
        [10, 562.49],
        [20, 832.63],
        [30, 1232.49],
        [40, 1824.39],
        [50, 2700.54],
      ],
    },
    choices: [
      "linear function with a negative rate of change",
      "linear function with a positive rate of change",
      "exponential decay function",
      "exponential growth function",
    ],
    answer: 3,
    explanation:
      "Each 10-year balance is about 1.48 times the previous one (562.49 / 380 ≈ 1.48, 832.63 / 562.49 ≈ 1.48, …) — a constant ratio greater than 1 — so it is an exponential growth function.",
  },

  // ——— Construct a function from a table or description (AI-F.LE.2) ———
  {
    id: "func-mc-0817-q14",
    mode: "mc",
    standard: "AI-F.LE.2",
    topic: "Write a function from a description",
    examCitation: "regents-algI-0817-q14",
    part: "I",
    credits: 2,
    prompt:
      "If a population of 100 cells triples every hour, which function represents p(t), the population after t hours?",
    choices: [
      String.raw`$p(t) = 3(100)^t$`,
      String.raw`$p(t) = 100(3)^t$`,
      String.raw`$p(t) = 3t + 100$`,
      String.raw`$p(t) = 100t + 3$`,
    ],
    answer: 1,
    explanation:
      "Tripling each hour is exponential: start at the initial value 100 and multiply by the growth factor 3 once per hour, giving $p(t) = 100(3)^t$.",
  },
  {
    id: "func-mc-0116-q16",
    mode: "mc",
    standard: "AI-F.LE.2",
    topic: "Write a function from a table",
    examCitation: "regents-algI-0116-q16",
    part: "I",
    credits: 2,
    prompt: "Which function is shown in the table below?",
    figure: {
      kind: "table",
      headers: ["x", "f(x)"],
      rows: [
        [-2, "1/9"],
        [-1, "1/3"],
        [0, 1],
        [1, 3],
        [2, 9],
        [3, 27],
      ],
    },
    choices: [
      String.raw`$f(x) = 3x$`,
      String.raw`$f(x) = x + 3$`,
      String.raw`$f(x) = -x^3$`,
      String.raw`$f(x) = 3^x$`,
    ],
    answer: 3,
    explanation:
      "Each f-value is 3 times the one before it (a constant ratio), and $f(0) = 1$. That is the exponential $f(x) = 3^x$: $3^{-2} = \\tfrac19$, $3^0 = 1$, $3^3 = 27$.",
  },

  // ——— Constructed-response (self-score) — classify & explain (AI-F.LE.1) ———
  {
    id: "lve-cr-0618-q26",
    mode: "self-score",
    standard: "AI-F.LE.1",
    topic: "Linear vs. exponential — classify from a table and justify",
    examCitation: "regents-algI-0618-q26",
    part: "II",
    credits: 2,
    prompt: String.raw`Caleb claims that the ordered pairs shown in the table below are from a nonlinear function. State whether Caleb is correct. Explain your reasoning.`,
    figure: {
      kind: "table",
      headers: ["x", "f(x)"],
      rows: [
        [0, 2],
        [1, 4],
        [2, 8],
        [3, 16],
      ],
    },
    answerSummary: "Yes, Caleb is correct — the function is nonlinear.",
    modelSolution:
      "The x-values increase by 1 each time, but the f(x)-values do not increase by a constant amount: they go +2, then +4, then +8. Because there is no constant rate of change, the function is not linear, so Caleb is correct. (Each output is in fact double the previous one — a constant ratio of 2 — so it is exponential.)",
    rubric: [
      {
        credits: 2,
        criteria: "A correct explanation indicating a positive response (Yes, the function is nonlinear) is written.",
      },
      {
        credits: 1,
        criteria:
          "Appropriate work is shown, but one computational error is made; OR appropriate work is shown, but one conceptual error is made; OR \"Yes,\" but the explanation is incomplete.",
      },
      {
        credits: 0,
        criteria:
          "\"Yes,\" but no explanation or an incorrect explanation is written; OR a response that is completely incorrect, irrelevant, or incoherent, or is a correct response obtained by an obviously incorrect procedure.",
      },
    ],
  },
  {
    id: "lve-cr-0116-q25",
    mode: "self-score",
    standard: "AI-F.LE.1",
    topic: "Linear vs. exponential — classify from a table and justify",
    examCitation: "regents-algI-0116-q25",
    part: "II",
    credits: 2,
    prompt: String.raw`The function $t(x)$ is shown in the table below. Determine whether $t(x)$ is linear or exponential. Explain your answer.`,
    figure: {
      kind: "table",
      headers: ["x", "t(x)"],
      rows: [
        [-3, 10],
        [-1, 7.5],
        [1, 5],
        [3, 2.5],
        [5, 0],
      ],
    },
    answerSummary: "Linear.",
    modelSolution:
      "From each row to the next, x increases by 2 and t(x) decreases by 2.5 (10 → 7.5 → 5 → 2.5 → 0). The rate of change is constant (−2.5 for every increase of 2 in x, i.e. −1.25 per unit), so t(x) is linear. An exponential function would change by a constant ratio, not a constant difference.",
    rubric: [
      { credits: 2, criteria: "Linear, and a correct explanation is given." },
      {
        credits: 1,
        criteria:
          "Appropriate work is shown, but one computational error is made; OR appropriate work is shown, but one conceptual error is made; OR Linear, but an incomplete explanation is given.",
      },
      {
        credits: 0,
        criteria:
          "Linear, but no explanation or an incorrect explanation is given; OR a response that is completely incorrect, irrelevant, or incoherent, or is a correct response obtained by an obviously incorrect procedure.",
      },
    ],
  },
  {
    id: "lve-cr-0815-q27",
    mode: "self-score",
    standard: "AI-F.LE.1",
    topic: "Linear vs. exponential — choose the better model and justify",
    examCitation: "regents-algI-0815-q27",
    part: "II",
    credits: 2,
    prompt: String.raw`Rachel and Marc were given the information shown in the table below about the bacteria growing in a Petri dish in their biology class. Rachel wants to model this information with a linear function. Marc wants to use an exponential function. Which model is the better choice? Explain why you chose this model.`,
    figure: {
      kind: "table",
      headers: ["Hours, x", "Bacteria, B(x)"],
      rows: [
        [1, 220],
        [2, 280],
        [3, 350],
        [4, 440],
        [5, 550],
        [6, 690],
        [7, 860],
        [8, 1070],
        [9, 1340],
        [10, 1680],
      ],
    },
    answerSummary: "Marc's exponential model is the better choice.",
    modelSolution:
      "The differences between consecutive counts are not constant (280 − 220 = 60, 350 − 280 = 70, 440 − 350 = 90, …), so the bacteria do not grow at a constant rate and a linear model does not fit. The ratios are nearly constant (280/220 ≈ 1.27, 350/280 ≈ 1.25, 440/350 ≈ 1.26, …), so the population grows by an approximately constant factor. An exponential function — Marc's choice — is the better model.",
    rubric: [
      { credits: 2, criteria: "Marc or exponential, and a correct explanation is written." },
      {
        credits: 1,
        criteria:
          "One conceptual error is made, such as stating \"exponential because it has a better correlation coefficient.\" [You cannot compare correlation coefficients of different types of equations.] OR Marc or exponential, but the explanation is incomplete.",
      },
      {
        credits: 0,
        criteria:
          "Marc or exponential, but no explanation is written; OR a response that is completely incorrect, irrelevant, or incoherent, or is a correct response obtained by an obviously incorrect procedure.",
      },
    ],
  },
  {
    id: "lve-cr-0119-q26",
    mode: "self-score",
    standard: "AI-F.LE.1",
    topic: "Linear vs. exponential — classify from a table and justify",
    examCitation: "regents-algI-0119-q26",
    part: "II",
    credits: 2,
    prompt: String.raw`The number of people who attended a school's last six basketball games increased as the team neared the state sectional games. The table below shows the data. State the type of function that best fits the given data. Justify your choice of a function type.`,
    figure: {
      kind: "table",
      headers: ["Game", "Attendance"],
      rows: [
        [13, 348],
        [14, 435],
        [15, 522],
        [16, 609],
        [17, 696],
        [18, 783],
      ],
    },
    answerSummary: "Linear.",
    modelSolution:
      "Each game the attendance increases by exactly 87 (435 − 348 = 87, 522 − 435 = 87, 609 − 522 = 87, …, 783 − 696 = 87). A constant difference over equal intervals is a constant rate of change, so a linear function best fits the data.",
    rubric: [
      { credits: 2, criteria: "Linear function is stated and a correct justification is given." },
      {
        credits: 1,
        criteria:
          "One conceptual error is made, but an appropriate justification is given; OR Linear function is stated, but the justification is missing or incorrect.",
      },
      {
        credits: 0,
        criteria:
          "A response that is completely incorrect, irrelevant, or incoherent, or is a correct response obtained by an obviously incorrect procedure.",
      },
    ],
  },
  {
    id: "lve-cr-0822-q26",
    mode: "self-score",
    standard: "AI-F.LE.1",
    topic: "Linear vs. exponential — choose the better model and justify",
    examCitation: "regents-algI-0822-q26",
    part: "II",
    credits: 2,
    prompt: String.raw`The table below shows the value of a particular car over time. Determine whether a linear or exponential function is more appropriate for modeling this data. Explain your choice.`,
    figure: {
      kind: "table",
      headers: ["Time (years)", "Value ($)"],
      rows: [
        [0, 20000],
        [5, 10550],
        [10, 5570],
        [15, 2940],
        [20, 1550],
      ],
    },
    answerSummary: "Exponential.",
    modelSolution:
      "The value does not drop by a constant amount each 5-year period (20000 → 10550 is −9450, but 10550 → 5570 is −4980), so it is not linear. Instead each value is about 0.53 times the one before it (10550/20000 ≈ 0.53, 5570/10550 ≈ 0.53, 2940/5570 ≈ 0.53, …) — a constant ratio. A constant factor over equal intervals means an exponential function is more appropriate.",
    rubric: [
      { credits: 2, criteria: "Exponential, and a correct explanation is written." },
      {
        credits: 1,
        criteria:
          "Appropriate work is shown, but one conceptual error is made; OR Exponential, but an incomplete explanation is written.",
      },
      {
        credits: 0,
        criteria:
          "Exponential, but the explanation is missing or incorrect; OR a response that is completely incorrect, irrelevant, or incoherent, or is a correct response obtained by an obviously incorrect procedure.",
      },
    ],
  },

  // ——— Constructed-response (self-score) — construct a function (AI-F.LE.2) ———
  {
    id: "lve-cr-0815-q25",
    mode: "self-score",
    standard: "AI-F.LE.2",
    topic: "Write a linear function from a table",
    examCitation: "regents-algI-0815-q25",
    part: "II",
    credits: 2,
    prompt: String.raw`Each day Toni records the height of a plant for her science lab. Her data are shown in the table below. The plant continues to grow at a constant daily rate. Write an equation to represent $h(n)$, the height of the plant on the $n$th day.`,
    figure: {
      kind: "table",
      headers: ["Day, n", "Height (cm)"],
      rows: [
        [1, 3.0],
        [2, 4.5],
        [3, 6.0],
        [4, 7.5],
        [5, 9.0],
      ],
    },
    answerSummary: String.raw`$h(n) = 1.5(n - 1) + 3$ (equivalently $h(n) = 1.5n + 1.5$).`,
    modelSolution:
      "On day 1 the height is 3 cm, and each day it grows 1.5 cm (4.5 − 3 = 6 − 4.5 = 1.5). Starting from day 1, after (n − 1) more days the height is h(n) = 1.5(n − 1) + 3, which simplifies to h(n) = 1.5n + 1.5. Check: h(4) = 1.5(4) + 1.5 = 7.5 cm. ✓",
    rubric: [
      { credits: 2, criteria: String.raw`$h(n) = 1.5(n - 1) + 3$ or an equivalent equation is written.` },
      {
        credits: 1,
        criteria: String.raw`Appropriate work is shown, but one computational error is made; OR appropriate work is shown, but one conceptual error is made; OR an appropriate equation is written, but not in terms of $h(n)$ and $n$; OR $1.5(n - 1) + 3$ or an equivalent expression is written.`,
      },
      {
        credits: 0,
        criteria:
          "A response that is completely incorrect, irrelevant, or incoherent, or is a correct response obtained by an obviously incorrect procedure.",
      },
    ],
  },
  {
    id: "lve-cr-0117-q35",
    mode: "self-score",
    standard: "AI-F.LE.2",
    topic: "Write a linear function from a table and interpret it",
    examCitation: "regents-algI-0117-q35",
    part: "IV",
    credits: 4,
    prompt: String.raw`Tanya is making homemade greeting cards. The data table below represents the amount she spends, in dollars, $f(x)$, in terms of the number of cards she makes, $x$. Write a linear function, $f(x)$, that represents the data. Explain what the slope and $y$-intercept of $f(x)$ mean in the given context.`,
    figure: {
      kind: "table",
      headers: ["x (cards)", "f(x) ($)"],
      rows: [
        [4, 7.5],
        [6, 9.0],
        [9, 11.25],
        [10, 12.0],
      ],
    },
    answerSummary: String.raw`$f(x) = 0.75x + 4.50$. The slope, 0.75, is the cost per card (75¢ each); the $y$-intercept, 4.50, is the fixed start-up cost (\$4.50).`,
    modelSolution:
      "Slope = (9.00 − 7.50) / (6 − 4) = 1.50 / 2 = 0.75 dollars per card. Using f(4) = 7.50: 7.50 = 0.75(4) + b → 7.50 = 3.00 + b → b = 4.50. So f(x) = 0.75x + 4.50. The slope, 0.75, means each card costs \\$0.75 to make; the y-intercept, 4.50, means Tanya had \\$4.50 in fixed start-up costs (the amount spent when x = 0 cards).",
    rubric: [
      { credits: 4, criteria: String.raw`$f(x) = .75x + 4.5$, and correct explanations are written.` },
      {
        credits: 3,
        criteria: String.raw`Appropriate work is shown, but one computational error is made; OR appropriate work is shown, but one explanation is missing or incorrect; OR appropriate work is shown, but the equation is not written in terms of $f(x)$; OR appropriate work is shown, but the explanations are incomplete.`,
      },
      {
        credits: 2,
        criteria: String.raw`Appropriate work is shown, but two or more computational errors are made; OR appropriate work is shown, but one conceptual error is made; OR a correct equation in terms of $f(x)$ is written, but no further correct work is shown; OR correct explanations are written, but the equation is missing or incorrect.`,
      },
      {
        credits: 1,
        criteria: String.raw`Appropriate work is shown, but one conceptual error and one computational error are made; OR the expression $.75x + 4.5$ is written, but no further correct work is shown.`,
      },
      {
        credits: 0,
        criteria:
          "A response that is completely incorrect, irrelevant, or incoherent, or is a correct response obtained by an obviously incorrect procedure.",
      },
    ],
  },
  {
    id: "lve-cr-0623-q27",
    mode: "self-score",
    standard: "AI-F.LE.1",
    topic: "Linear vs. exponential — classify a growth pattern and justify",
    examCitation: "regents-algI-0623-q27",
    part: "II",
    credits: 2,
    prompt:
      "Breanna creates a pattern of blocks in her art class. The number of blocks in each successive pattern is shown in the table below. A friend tells her that the number of blocks in the pattern is increasing exponentially. Is her friend correct? Explain your reasoning.",
    figure: {
      kind: "table",
      headers: ["Pattern", "Number of blocks"],
      rows: [
        ["I", 4],
        ["II", 6],
        ["III", 8],
        ["IV", 10],
      ],
    },
    answerSummary: "No — the friend is incorrect; the pattern increases linearly.",
    modelSolution:
      "From one pattern to the next the number of blocks increases by the same amount each time: 6 − 4 = 2, 8 − 6 = 2, 10 − 8 = 2. Because it grows by a constant amount (a constant difference), not by a constant factor, the pattern is linear, not exponential. The friend is not correct.",
    rubric: [
      { credits: 2, criteria: "A correct explanation indicating a negative response is written." },
      {
        credits: 1,
        criteria:
          "Appropriate work is shown, but one computational error is made; OR appropriate work is shown, but one conceptual error is made; OR an incomplete explanation is written.",
      },
      {
        credits: 0,
        criteria:
          "No, but no explanation is written; OR a zero response does not contain enough relevant course-level work to receive any credit, does not satisfy the criteria for one or more credits, or is a correct response that was obtained by an obviously incorrect procedure.",
      },
    ],
  },
  {
    id: "lve-cr-0816-q27",
    mode: "self-score",
    standard: "AI-F.LE.1",
    topic: "Linear vs. exponential — choose the model for a pattern",
    examCitation: "regents-algI-0816-q27",
    part: "II",
    credits: 2,
    prompt:
      "Consider the pattern of squares shown below. The number of squares in each successive pattern is given in the table. Which type of model, linear or exponential, should be used to determine how many squares are in the nth pattern? Explain your answer.",
    figure: {
      kind: "table",
      headers: ["Pattern, n", "Number of squares"],
      rows: [
        [1, 2],
        [2, 4],
        [3, 8],
      ],
    },
    answerSummary: "Exponential.",
    modelSolution:
      "The number of squares does not increase by a constant amount (4 − 2 = 2, but 8 − 4 = 4), so the pattern is not linear. Instead each pattern has twice as many squares as the one before it (2 → 4 → 8), a constant ratio of 2. A constant factor means an exponential model should be used.",
    rubric: [
      { credits: 2, criteria: "Exponential, and a correct explanation is written." },
      {
        credits: 1,
        criteria: "One conceptual error is made; OR Exponential, but the explanation is incomplete.",
      },
      {
        credits: 0,
        criteria:
          "Exponential, but the explanation is missing or incorrect; OR a response that is completely incorrect, irrelevant, or incoherent, or is a correct response that was obtained by an obviously incorrect procedure.",
      },
    ],
  },
  {
    id: "lve-cr-0115-q32",
    mode: "self-score",
    standard: "AI-F.LE.2",
    topic: "Write an exponential function from a graph",
    examCitation: "regents-algI-0115-q32",
    part: "II",
    credits: 2,
    prompt:
      "The graph of an exponential function is shown below; it passes through the plotted points. Write an exponential equation for the graph. Explain how you determined the equation.",
    figure: {
      kind: "scatter",
      points: [
        [2, 1],
        [3, 2],
        [4, 4],
        [5, 8],
      ],
      xRange: [-1, 6],
      yRange: [-1, 9],
    },
    answerSummary: String.raw`$y = 0.25(2)^x$ (equivalently $y = \tfrac14 \cdot 2^x$).`,
    modelSolution:
      "Each time x increases by 1, y doubles (1 → 2 → 4 → 8), so the base is 2 and the function is y = a(2)^x. Using the point (2, 1): 1 = a(2)^2 = 4a, so a = 0.25. Therefore y = 0.25(2)^x. Check (4, 4): 0.25(2)^4 = 0.25(16) = 4. ✓",
    rubric: [
      {
        credits: 2,
        criteria: String.raw`$y = 0.25(2)^x$ or an equivalent equation is written, and a correct explanation is given.`,
      },
      {
        credits: 1,
        criteria: String.raw`Appropriate work is shown, but one conceptual error is made; OR a correct equation is written, but no further correct work is shown; OR the expression $0.25(2)^x$ is written and a correct explanation is given.`,
      },
      {
        credits: 0,
        criteria:
          "A response that is completely incorrect, irrelevant, or incoherent, or is a correct response that was obtained by an obviously incorrect procedure.",
      },
    ],
  },
];

export default bank;
