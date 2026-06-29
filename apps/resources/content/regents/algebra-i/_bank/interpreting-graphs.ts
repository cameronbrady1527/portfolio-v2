// Authored Regents problem-bank — Interpreting Graphs (AI-F.IF.4 / F.IF.B.4):
// reading a graph for what it MEANS — relating a graph to the event it models
// (speed/distance over time), and identifying key features (intervals where a
// function increases/decreases/is constant, positive/negative, maximum/minimum,
// intercepts) from a graph. The graph is GIVEN; the choices interpret it. Real
// released Algebra I Regents questions mined from the official NYSED
// administrations (via JMAP), cited to the exam + question number. Each given
// graph is reproduced faithfully from a rendered source page (the new framed /
// polyline plot figures). Every answer independently re-derived. Every self-score
// rubric is transcribed verbatim from the official NYSED Rating Guide. SME-ratified.

import type { RegentsItem } from "@/lib/regents/bank";

const bank: RegentsItem[] = [
  // ——————————————————————— Part I multiple choice ———————————————————————

  {
    id: "ifg-mc-0615-q02",
    mode: "mc",
    standard: "AI-F.IF.4",
    topic: "Relating graphs to events — speed over time",
    examCitation: "regents-algI-0615-q02",
    part: "I",
    credits: 2,
    prompt: String.raw`The graph below represents a jogger's speed during her 20-minute jog around her neighborhood. Which statement best describes what the jogger was doing during the $9$–$12$ minute interval of her jog?`,
    figure: {
      kind: "plot",
      xRange: [0, 20],
      yRange: [0, 8],
      xLabel: "Time (in minutes)",
      yLabel: "Speed (miles per hour)",
      curves: [
        {
          kind: "polyline",
          points: [
            [0, 0], [2, 3], [5, 3], [7, 5], [8, 5], [9, 6],
            [12, 6], [14, 4], [16, 4], [18, 8], [19, 8], [20, 0],
          ],
        },
      ],
    },
    choices: [
      String.raw`She was standing still.`,
      String.raw`She was increasing her speed.`,
      String.raw`She was decreasing her speed.`,
      String.raw`She was jogging at a constant rate.`,
    ],
    answer: 3,
    explanation: String.raw`Over the $9$–$12$ minute interval the graph is a horizontal segment at $6$ miles per hour — the speed does not change. A constant (unchanging) speed means she was jogging at a constant rate. "Standing still" would be a speed of $0$, which the graph never shows in that interval.`,
  },

  {
    id: "ifg-mc-0124-q01",
    mode: "mc",
    standard: "AI-F.IF.4",
    topic: "Relating graphs to events — speed over time",
    examCitation: "regents-algI-0124-q01",
    part: "I",
    credits: 2,
    prompt: String.raw`The graph below represents a dog walker's speed during his 30-minute walk around the neighborhood. Which statement best describes what the dog walker was doing during the $12$–$18$ minute interval of his walk?`,
    figure: {
      kind: "plot",
      xRange: [0, 30],
      yRange: [0, 5],
      xLabel: "Time (minutes)",
      yLabel: "Speed (miles per hour)",
      curves: [
        {
          kind: "polyline",
          points: [
            [0, 0], [2, 2], [4, 2], [6, 0], [10, 0], [12, 1.5],
            [18, 1.5], [22, 3], [24, 3], [30, 0],
          ],
        },
      ],
    },
    choices: [
      String.raw`He was walking at a constant rate.`,
      String.raw`He was increasing his speed.`,
      String.raw`He was decreasing his speed.`,
      String.raw`He was standing still.`,
    ],
    answer: 0,
    explanation: String.raw`Over the $12$–$18$ minute interval the graph is a horizontal segment at $1.5$ miles per hour — the speed stays the same, so he was walking at a constant rate. "Standing still" would be a speed of $0$, which the graph does not show during that interval.`,
  },

  {
    id: "ifg-mc-0614-q09",
    mode: "mc",
    standard: "AI-F.IF.4",
    topic: "Key features from a graph — decreasing interval",
    examCitation: "regents-algI-0614-q09",
    part: "I",
    credits: 2,
    prompt: String.raw`A ball is thrown into the air from the edge of a $48$-foot-high cliff so that it eventually lands on the ground. The graph below shows the height, $y$, of the ball from the ground after $x$ seconds. For which interval is the ball's height always decreasing?`,
    figure: {
      kind: "plot",
      xRange: [0, 6],
      yRange: [0, 192],
      xLabel: "Time (in seconds)",
      yLabel: "Height (in feet)",
      curves: [{ kind: "parabola", a: -16, b: 80, c: 48 }],
    },
    choices: [
      String.raw`$0 \le x \le 2.5$`,
      String.raw`$0 < x < 5.5$`,
      String.raw`$2.5 < x < 5.5$`,
      String.raw`$x \ge 2$`,
    ],
    answer: 2,
    explanation: String.raw`The path is a downward parabola whose vertex (highest point) is at about $(2.5,\,148)$. The height rises up to the vertex at $x = 2.5$ seconds, then falls until the ball lands ($y = 0$) at about $x = 5.5$ seconds. So the height is always decreasing on $2.5 < x < 5.5$. On $0 \le x \le 2.5$ it is increasing, and the other intervals mix rising and falling.`,
  },

  {
    id: "ifg-mc-0625-q02",
    mode: "mc",
    standard: "AI-F.IF.4",
    topic: "Key features from a graph — increasing interval",
    examCitation: "regents-algI-0625-q02",
    part: "I",
    credits: 2,
    prompt: String.raw`A parabola is graphed on the set of axes below. Over which interval is the parabola only increasing?`,
    figure: {
      kind: "plot",
      range: 10,
      curves: [{ kind: "parabola", a: 3, b: -18, c: 24 }],
    },
    choices: [
      String.raw`$[1, 4]$`,
      String.raw`$[3, \infty)$`,
      String.raw`$(-\infty, 3]$`,
      String.raw`$[-1, 1]$`,
    ],
    answer: 1,
    explanation: String.raw`This upward parabola has its vertex (lowest point) at $(3, -3)$, so its axis of symmetry is $x = 3$. A parabola that opens up decreases to the left of its vertex and increases to the right of it. Therefore it is increasing for every $x \ge 3$, that is, on $[3, \infty)$.`,
  },

  {
    id: "ifg-mc-0126-q01",
    mode: "mc",
    standard: "AI-F.IF.4",
    topic: "Key features from a graph — axis of symmetry and vertex",
    examCitation: "regents-algI-0126-q01",
    part: "I",
    credits: 2,
    prompt: String.raw`A parabola is graphed on the set of axes below. What are the equation of the axis of symmetry and the coordinates of the vertex of this parabola?`,
    figure: {
      kind: "plot",
      range: 10,
      curves: [{ kind: "parabola", a: 1, b: -6, c: 5 }],
    },
    choices: [
      String.raw`$x = 3$ and $(3, -4)$`,
      String.raw`$y = 3$ and $(3, -4)$`,
      String.raw`$x = -4$ and $(-4, 3)$`,
      String.raw`$y = -4$ and $(-4, 3)$`,
    ],
    answer: 0,
    explanation: String.raw`The lowest point of this upward parabola is the vertex, at $(3, -4)$. The axis of symmetry is the vertical line that passes through the vertex, so its equation is $x = 3$. (The axis of symmetry of a vertical parabola is always a vertical line $x = \dots$, never $y = \dots$.)`,
  },

  {
    id: "ifg-mc-0124-q13",
    mode: "mc",
    standard: "AI-F.IF.4",
    topic: "Key features from a graph — axis of symmetry",
    examCitation: "regents-algI-0124-q13",
    part: "I",
    credits: 2,
    prompt: String.raw`The function $f(x)$ is graphed on the set of axes below. What is the equation of the axis of symmetry for $f(x)$?`,
    figure: {
      kind: "plot",
      range: 10,
      curves: [{ kind: "parabola", a: 1, b: 2, c: -1 }],
    },
    choices: [
      String.raw`$x = -1$`,
      String.raw`$x = -3$`,
      String.raw`$y = -1$`,
      String.raw`$y = -3$`,
    ],
    answer: 0,
    explanation: String.raw`The turning point (vertex) of the parabola is at $(-1, -2)$. The axis of symmetry is the vertical line through the vertex, so its equation is $x = -1$. An axis of symmetry of a vertical parabola is a vertical line of the form $x = \dots$, so the choices $y = \dots$ cannot be correct.`,
  },

  {
    id: "ifg-mc-0823-q15",
    mode: "mc",
    standard: "AI-F.IF.4",
    topic: "Key features from a graph — zeros and factorization",
    examCitation: "regents-algI-0823-q15",
    part: "I",
    credits: 2,
    prompt: String.raw`The function $f$ is graphed on the set of axes below. What is a possible factorization of this function?`,
    figure: {
      kind: "plot",
      range: 10,
      curves: [{ kind: "parabola", a: 1, b: -2, c: -3 }],
    },
    choices: [
      String.raw`$(x - 1)(x + 3)$`,
      String.raw`$(x + 1)(x - 3)$`,
      String.raw`$(x + 1)(x - 4)$`,
      String.raw`$(x - 1)(x + 4)$`,
    ],
    answer: 1,
    explanation: String.raw`The graph crosses the $x$-axis at $x = -1$ and $x = 3$; these are the zeros of $f$. A factor $(x - r)$ produces the zero $x = r$, so the zero $-1$ comes from $(x + 1)$ and the zero $3$ comes from $(x - 3)$. Hence a factorization is $(x + 1)(x - 3)$.`,
  },

  {
    id: "ifg-mc-0115-q09",
    mode: "mc",
    standard: "AI-F.IF.4",
    topic: "Key features from a graph — y-intercept",
    examCitation: "regents-algI-0115-q09",
    part: "I",
    credits: 2,
    prompt: String.raw`Which function has the same $y$-intercept as the graph below?`,
    figure: {
      kind: "plot",
      range: 10,
      curves: [{ kind: "line", m: 2, b: -3 }],
    },
    choices: [
      String.raw`$y = \dfrac{12 - 6x}{4}$`,
      String.raw`$27 + 3y = 6x$`,
      String.raw`$6y + x = 18$`,
      String.raw`$y + 3 = 6x$`,
    ],
    answer: 3,
    explanation: String.raw`The line crosses the $y$-axis at $(0, -3)$, so its $y$-intercept is $-3$. Setting $x = 0$ in each choice: $y + 3 = 6(0)$ gives $y = -3$ — a match. The other choices give $y$-intercepts of $3$, $-9$, and $3$, respectively.`,
  },

  {
    id: "ifg-mc-0116-q22",
    mode: "mc",
    standard: "AI-F.IF.4",
    topic: "Key features from a graph — minimum value",
    examCitation: "regents-algI-0116-q22",
    part: "I",
    credits: 2,
    prompt: String.raw`The graph representing a function is shown below. Which function has a minimum that is *less* than the one shown in the graph?`,
    figure: {
      kind: "plot",
      range: 10,
      curves: [{ kind: "parabola", a: 1.5, b: -6, c: 0 }],
    },
    choices: [
      String.raw`$y = x^2 - 6x + 7$`,
      String.raw`$y = |x + 3| - 6$`,
      String.raw`$y = x^2 - 2x - 10$`,
      String.raw`$y = |x - 8| + 2$`,
    ],
    answer: 2,
    explanation: String.raw`The lowest point of the graph is its minimum, $y = -6$. Find the minimum of each choice: $x^2 - 6x + 7$ has vertex value $-2$; $|x + 3| - 6$ has minimum $-6$; $x^2 - 2x - 10$ has vertex value $-11$; $|x - 8| + 2$ has minimum $2$. Only $-11$ is less than $-6$, so the answer is $y = x^2 - 2x - 10$.`,
  },

  {
    id: "ifg-mc-0617-q16",
    mode: "mc",
    standard: "AI-F.IF.4",
    topic: "Key features from a graph — vertex/maximum and equation",
    examCitation: "regents-algI-0617-q16",
    part: "I",
    credits: 2,
    prompt: String.raw`The graph of a quadratic function is shown below. An equation that represents the function could be`,
    figure: {
      kind: "plot",
      xRange: [0, 25],
      yRange: [0, 25],
      xLabel: "x",
      yLabel: "y",
      curves: [{ kind: "parabola", a: -0.5, b: 15, c: -87.5 }],
    },
    choices: [
      String.raw`$q(x) = \dfrac{1}{2}(x + 15)^2 - 25$`,
      String.raw`$q(x) = -\dfrac{1}{2}(x + 15)^2 - 25$`,
      String.raw`$q(x) = -\dfrac{1}{2}(x - 15)^2 + 25$`,
      String.raw`$q(x) = -\dfrac{1}{3}(x - 15)^2 + 25$`,
    ],
    answer: 2,
    explanation: String.raw`The parabola opens downward, so its leading coefficient is negative — this eliminates choice (1). Its highest point (vertex) is at $(15, 25)$, so in vertex form $a(x - h)^2 + k$ we need $h = 15$ and $k = 25$, eliminating choice (2). The graph crosses the $x$-axis at about $x = 8$ and $x = 22$ (a half-width of about $7$), which matches $a = -\tfrac{1}{2}$ rather than the narrower $-\tfrac{1}{3}$. So $q(x) = -\dfrac{1}{2}(x - 15)^2 + 25$.`,
  },

  {
    id: "ifg-mc-0618-q18",
    mode: "mc",
    standard: "AI-F.IF.4",
    topic: "Key features from a graph — zeros of a cubic",
    examCitation: "regents-algI-0618-q18",
    part: "I",
    credits: 2,
    prompt: String.raw`A cubic function is graphed on the set of axes below. Which function could represent this graph?`,
    figure: {
      kind: "plot",
      range: 10,
      curves: [
        {
          kind: "polyline",
          points: [
            [-3.7, -8.88], [-3.5, -5.62], [-3.3, -2.97], [-3.1, -0.86], [-2.9, 0.74], [-2.7, 1.89], [-2.5, 2.63], [-2.3, 3.0], [-2.1, 3.07], [-1.9, 2.87], [-1.7, 2.46], [-1.5, 1.87], [-1.3, 1.17], [-1.1, 0.4], [-0.9, -0.4], [-0.7, -1.17], [-0.5, -1.88], [-0.3, -2.46], [-0.1, -2.87], [0.1, -3.07], [0.3, -3.0], [0.5, -2.62], [0.7, -1.89], [0.9, -0.74], [1.1, 0.86], [1.3, 2.97], [1.5, 5.63], [1.7, 8.88],
          ],
        },
      ],
    },
    choices: [
      String.raw`$f(x) = (x - 3)(x - 1)(x + 1)$`,
      String.raw`$g(x) = (x + 3)(x + 1)(x - 1)$`,
      String.raw`$h(x) = (x - 3)(x - 1)(x + 3)$`,
      String.raw`$k(x) = (x + 3)(x + 1)(x - 3)$`,
    ],
    answer: 1,
    explanation: String.raw`The graph crosses the $x$-axis at $x = -3$, $x = -1$, and $x = 1$, so these are the three zeros. A factor $(x - r)$ produces the zero $r$, so the zeros $-3,\,-1,\,1$ come from $(x + 3)(x + 1)(x - 1)$. The other choices produce a different set of zeros (for example, choice (1) gives $3,\,1,\,-1$).`,
  },

  {
    id: "ifg-mc-0619-q08",
    mode: "mc",
    standard: "AI-F.IF.4",
    topic: "Key features from a graph — zeros of a polynomial",
    examCitation: "regents-algI-0619-q08",
    part: "I",
    credits: 2,
    prompt: String.raw`A polynomial function is graphed below. Which function could represent this graph?`,
    figure: {
      kind: "plot",
      range: 10,
      curves: [
        {
          kind: "polyline",
          points: [
            [-2.55, -8.88], [-2.35, -5.1], [-2.15, -1.96], [-1.95, 0.58], [-1.75, 2.58], [-1.55, 4.07], [-1.35, 5.12], [-1.15, 5.76], [-0.95, 6.04], [-0.75, 6.02], [-0.55, 5.73], [-0.35, 5.23], [-0.15, 4.57], [0.05, 3.8], [0.25, 2.95], [0.45, 2.09], [0.65, 1.25], [0.85, 0.49], [1.05, -0.14], [1.25, -0.61], [1.45, -0.85], [1.65, -0.83], [1.85, -0.49], [2.05, 0.21], [2.25, 1.33], [2.45, 2.9], [2.65, 4.99],
          ],
        },
      ],
    },
    choices: [
      String.raw`$f(x) = (x + 1)(x^2 + 2)$`,
      String.raw`$f(x) = (x - 1)(x^2 - 2)$`,
      String.raw`$f(x) = (x - 1)(x^2 - 4)$`,
      String.raw`$f(x) = (x + 1)(x^2 + 4)$`,
    ],
    answer: 2,
    explanation: String.raw`The graph crosses the $x$-axis at $x = -2$, $x = 1$, and $x = 2$ — three real zeros. Since $x^2 - 4 = (x - 2)(x + 2)$ contributes the zeros $\pm 2$ and $(x - 1)$ contributes $1$, the function is $(x - 1)(x^2 - 4)$. The factors $x^2 + 2$ and $x^2 + 4$ have no real zeros, and $x^2 - 2$ gives zeros $\pm\sqrt{2} \approx \pm 1.41$, not $\pm 2$.`,
  },

  {
    id: "ifg-mc-0817-q07",
    mode: "mc",
    standard: "AI-F.IF.4",
    topic: "Key features from a graph — zeros and a double root",
    examCitation: "regents-algI-0817-q07",
    part: "I",
    credits: 2,
    prompt: String.raw`Wenona sketched the polynomial $P(x)$ as shown on the axes below. Which equation could represent $P(x)$?`,
    figure: {
      kind: "plot",
      range: 10,
      curves: [
        {
          kind: "polyline",
          points: [
            [-1.65, -8.66], [-1.45, -5.36], [-1.25, -2.64], [-1.05, -0.47], [-0.85, 1.22], [-0.65, 2.46], [-0.45, 3.3], [-0.25, 3.8], [-0.05, 3.99], [0.15, 3.94], [0.35, 3.68], [0.55, 3.26], [0.75, 2.73], [0.95, 2.15], [1.15, 1.55], [1.35, 0.99], [1.55, 0.52], [1.75, 0.17], [1.95, 0.01], [2.15, 0.07], [2.35, 0.41], [2.55, 1.07], [2.75, 2.11], [2.95, 3.56], [3.15, 5.49], [3.35, 7.93],
          ],
        },
      ],
    },
    choices: [
      String.raw`$P(x) = (x + 1)(x - 2)^2$`,
      String.raw`$P(x) = (x - 1)(x + 2)^2$`,
      String.raw`$P(x) = (x + 1)(x - 2)$`,
      String.raw`$P(x) = (x - 1)(x + 2)$`,
    ],
    answer: 0,
    explanation: String.raw`The graph crosses the $x$-axis at $x = -1$ and is *tangent* to it (just touches and turns around) at $x = 2$. A point where the graph touches without crossing comes from a repeated (squared) factor, so $x = 2$ gives $(x - 2)^2$, while the crossing at $-1$ gives $(x + 1)$. Hence $P(x) = (x + 1)(x - 2)^2$.`,
  },

  {
    id: "ifg-mc-0815-q04",
    mode: "mc",
    standard: "AI-F.IF.4",
    topic: "Key features from a graph — zeros of a polynomial",
    examCitation: "regents-algI-0815-q04",
    part: "I",
    credits: 2,
    prompt: String.raw`The graph of $f(x)$ is shown below. Which function could represent the graph of $f(x)$?`,
    figure: {
      kind: "plot",
      range: 10,
      curves: [
        {
          kind: "polyline",
          points: [
            [-4.65, -9.73], [-4.45, -6.01], [-4.25, -2.95], [-4.05, -0.52], [-3.85, 1.35], [-3.65, 2.69], [-3.45, 3.55], [-3.25, 3.98], [-3.05, 4.04], [-2.85, 3.76], [-2.65, 3.2], [-2.45, 2.41], [-2.25, 1.42], [-2.05, 0.3], [-1.85, -0.92], [-1.65, -2.18], [-1.45, -3.44], [-1.25, -4.64], [-1.05, -5.75], [-0.85, -6.7], [-0.65, -7.46], [-0.45, -7.98], [-0.25, -8.2], [-0.05, -8.09], [0.15, -7.58], [0.35, -6.64], [0.55, -5.22], [0.75, -3.27], [0.95, -0.73], [1.15, 2.43], [1.35, 6.27], [1.45, 8.46],
          ],
        },
      ],
    },
    choices: [
      String.raw`$f(x) = (x + 2)(x^2 + 3x - 4)$`,
      String.raw`$f(x) = (x - 2)(x^2 + 3x - 4)$`,
      String.raw`$f(x) = (x + 2)(x^2 + 3x + 4)$`,
      String.raw`$f(x) = (x - 2)(x^2 + 3x + 4)$`,
    ],
    answer: 0,
    explanation: String.raw`The graph crosses the $x$-axis at $x = -4$, $x = -2$, and $x = 1$. Factoring $x^2 + 3x - 4 = (x + 4)(x - 1)$ gives zeros $-4$ and $1$, and $(x + 2)$ gives $-2$, so $f(x) = (x + 2)(x^2 + 3x - 4)$ has exactly those three zeros. The quadratic $x^2 + 3x + 4$ has no real zeros (its discriminant is negative), so choices with that factor cannot match.`,
  },

  // ———————————————— Constructed-response (self-score) ————————————————

  {
    id: "ifg-cr-0125-q25",
    mode: "self-score",
    standard: "AI-F.IF.4",
    topic: "Relating graphs to events — constant speed interval",
    examCitation: "regents-algI-0125-q25",
    part: "II",
    credits: 2,
    prompt: String.raw`The graph below models Sally's drive to the store. State an interval when Sally is traveling at a constant speed. Explain your reasoning.`,
    figure: {
      kind: "plot",
      xRange: [0, 10],
      yRange: [0, 55],
      xLabel: "Time (in minutes)",
      yLabel: "Speed (miles per hour)",
      curves: [
        {
          kind: "polyline",
          points: [[0, 0], [5, 35], [9, 35], [10, 0]],
        },
      ],
    },
    answerSummary: String.raw`$5 \le t \le 9$ minutes (any subset is acceptable), because the speed stays at $35$ miles per hour.`,
    modelSolution: String.raw`Sally travels at a constant speed wherever the graph is a horizontal segment — the speed is not changing. From $5$ to $9$ minutes the graph is flat at $35$ miles per hour, so her speed is constant over that interval. (Any subset of $5$ to $9$ minutes is also acceptable.)`,
    rubric: [
      { credits: 2, criteria: "5 to 9 or any subset of this interval, and a correct explanation is written." },
      { credits: 1, criteria: "One conceptual error is made; OR a correct interval is stated, but the explanation is missing, incomplete, or incorrect; OR a correct explanation is written, but no further correct work is shown." },
      { credits: 0, criteria: "A zero response does not contain enough relevant course-level work to receive any credit, does not satisfy the criteria for one or more credits, or is a correct response that was obtained by an obviously incorrect procedure." },
    ],
  },

  {
    id: "ifg-cr-0622-q33",
    mode: "self-score",
    standard: "AI-F.IF.4",
    topic: "Key features from a graph — zeros, increasing intervals, maximum",
    examCitation: "regents-algI-0622-q33",
    part: "III",
    credits: 4,
    prompt: String.raw`The graph below models the height of Sam's kite over a period of time. Explain what the zeros of the graph represent in the context of the situation. State the time intervals over which the height of the kite is increasing. State the maximum height, in feet, that the kite reaches.`,
    figure: {
      kind: "plot",
      xRange: [0, 3],
      yRange: [0, 60],
      xLabel: "Time (in minutes)",
      yLabel: "Height (in feet)",
      curves: [
        {
          kind: "polyline",
          points: [[0, 0], [0.5, 18], [1, 12], [2, 60], [3, 0]],
        },
      ],
    },
    answerSummary: String.raw`The zeros are the times when the kite's height is $0$ feet. The height is increasing on $0 \le t \le \tfrac{1}{2}$ and $1 \le t \le 2$. The maximum height is $60$ feet.`,
    modelSolution: String.raw`A zero of the graph is a time $t$ where the height is $0$ — when the kite is on the ground (at the start, $t = 0$, and at the end, $t = 3$). The height is increasing wherever the graph rises as you read left to right: from $0$ to $\tfrac{1}{2}$ minute and from $1$ to $2$ minutes. The highest point the graph reaches is $60$ feet, so the maximum height of the kite is $60$ feet.`,
    rubric: [
      { credits: 4, criteria: "A correct explanation is written, 0 to ½ and 1 to 2, and 60." },
      { credits: 3, criteria: "Appropriate work is shown, but the explanation is missing, incomplete, or incorrect; OR appropriate work is shown, but only one correct interval is stated." },
      { credits: 2, criteria: "Both intervals are stated correctly, but no further correct work is shown." },
      { credits: 1, criteria: "A correct explanation is written, but no further correct work is shown; OR only one correct interval is stated, but no further correct work is shown; OR 60, but no further correct work is shown." },
      { credits: 0, criteria: "A zero response is completely incorrect, irrelevant, or incoherent or is a correct response that was obtained by an obviously incorrect procedure." },
    ],
  },

  {
    id: "ifg-cr-0617-q34",
    mode: "self-score",
    standard: "AI-F.IF.4",
    topic: "Relating graphs to events — city interval and average speed",
    examCitation: "regents-algI-0617-q34",
    part: "III",
    credits: 4,
    prompt: String.raw`The graph below models Craig's trip to visit his friend in another state. In the course of his travels, he encountered both highway and city driving. Based on the graph, during which interval did Craig most likely drive in the city? Explain your reasoning. Explain what might have happened in the interval between $B$ and $C$. Determine Craig's average speed, to the nearest tenth of a mile per hour, for his entire trip.`,
    figure: {
      kind: "plot",
      xRange: [0, 7],
      yRange: [0, 260],
      xLabel: "Hours",
      yLabel: "Miles Traveled",
      curves: [
        {
          kind: "polyline",
          points: [[0, 0], [1, 110], [2, 110], [4, 200], [7, 230]],
        },
      ],
      points: [
        { x: 0, y: 0, label: "A" },
        { x: 1, y: 110, label: "B" },
        { x: 2, y: 110, label: "C" },
        { x: 4, y: 200, label: "D" },
        { x: 7, y: 230, label: "E" },
      ],
    },
    answerSummary: String.raw`City driving: interval $D$ to $E$ (his speed was slowest there). Between $B$ and $C$ he most likely stopped (a rest stop), since the distance traveled stays constant. Average speed $= \dfrac{230}{7} \approx 32.9$ miles per hour.`,
    modelSolution: String.raw`City driving is slower than highway driving, so it corresponds to the least-steep rising part of the graph: the interval $D$ to $E$, where the line rises only $30$ miles over $3$ hours ($10$ mph). From $B$ to $C$ the graph is horizontal — the distance traveled does not change — so Craig was not moving; he most likely stopped at a rest stop. For the entire trip he traveled $230$ miles in $7$ hours, so his average speed is $\dfrac{230 - 0}{7 - 0} = \dfrac{230}{7} \approx 32.9$ miles per hour.`,
    rubric: [
      { credits: 4, criteria: "D to E with a correct explanation is written, a correct explanation for interval B to C is written, and 32.9." },
      { credits: 3, criteria: "Appropriate work is shown, but one explanation is missing or incorrect." },
      { credits: 2, criteria: "D to E and 32.9 are stated, but no further correct work is shown." },
      { credits: 1, criteria: "D to E or 32.9 is stated, but no further correct work is shown." },
      { credits: 0, criteria: "A zero response is completely incorrect, irrelevant, or incoherent or is a correct response that was obtained by an obviously incorrect procedure." },
    ],
  },

  {
    id: "ifg-cr-0123-q33",
    mode: "self-score",
    standard: "AI-F.IF.4",
    topic: "Key features from a graph — constant interval, maximum, average rate of change",
    examCitation: "regents-algI-0123-q33",
    part: "III",
    credits: 4,
    prompt: String.raw`Anessa is studying the changes in population in a town. The graph below shows the population over $50$ years. State the entire interval during which the population remained constant. State the maximum population of the town over the $50$-year period. Determine the average rate of change from year $30$ to year $40$. Explain what your average rate of change means from year $30$ to year $40$ in the context of the problem.`,
    figure: {
      kind: "plot",
      xRange: [0, 50],
      yRange: [0, 11],
      xLabel: "Years",
      yLabel: "Population (in thousands)",
      curves: [
        {
          kind: "polyline",
          points: [[0, 1], [5, 2], [10, 4], [15, 8], [20, 10], [30, 10], [40, 4], [50, 6]],
        },
      ],
    },
    answerSummary: String.raw`Constant interval: year $20$ to year $30$. Maximum population: $10{,}000$. Average rate of change from year $30$ to year $40$ is $-600$ people per year — the population decreased by about $600$ people each year over that interval.`,
    modelSolution: String.raw`The population is constant where the graph is horizontal: from year $20$ to year $30$ it stays at $10$ thousand. The highest point the graph reaches is $10$ thousand, so the maximum population is $10{,}000$. From year $30$ to year $40$ the population goes from $10{,}000$ to $4{,}000$, so the average rate of change is $\dfrac{4000 - 10000}{40 - 30} = \dfrac{-6000}{10} = -600$ people per year. This means that, on average, the population decreased by $600$ people each year between year $30$ and year $40$.`,
    rubric: [
      { credits: 4, criteria: "20 to 30, 10,000, −600, and a correct explanation in context is written." },
      { credits: 3, criteria: "Appropriate work is shown, but one computational error is made." },
      { credits: 2, criteria: "Only 20 to 30 and 10,000 are stated, but no further correct work is shown; OR −600, and a correct explanation in context is written, but no further correct work is shown." },
      { credits: 1, criteria: "Either 20 to 30, 10,000, or −600 is stated, but no further correct work is shown; OR an appropriate explanation in context is written, but no further correct work is shown." },
      { credits: 0, criteria: "A zero response does not contain enough relevant course-level work to receive any credit, does not satisfy the criteria for one or more credits, or is a correct response that was obtained by an obviously incorrect procedure." },
    ],
  },

  {
    id: "ifg-cr-0822-q33",
    mode: "self-score",
    standard: "AI-F.IF.4",
    topic: "Relating graphs to events — fastest interval and average speed",
    examCitation: "regents-algI-0822-q33",
    part: "III",
    credits: 4,
    prompt: String.raw`Thomas took a $140$-mile bus trip to visit his grandparents. His trip is outlined on the graph below. Explain what might have happened in the interval between $D$ and $E$. State the interval in which the bus traveled the fastest. State how many miles per hour the bus was traveling during this interval. What was the average rate of speed, in miles per hour, for Thomas' entire bus trip?`,
    figure: {
      kind: "plot",
      xRange: [0, 4.5],
      yRange: [0, 150],
      xLabel: "Hours",
      yLabel: "Miles",
      curves: [
        {
          kind: "polyline",
          points: [[0, 0], [0.5, 20], [1, 20], [2.5, 110], [3, 110], [4, 140]],
        },
      ],
      points: [
        { x: 0, y: 0, label: "A" },
        { x: 0.5, y: 20, label: "B" },
        { x: 1, y: 20, label: "C" },
        { x: 2.5, y: 110, label: "D" },
        { x: 3, y: 110, label: "E" },
        { x: 4, y: 140, label: "F" },
      ],
    },
    answerSummary: String.raw`Between $D$ and $E$ the graph is horizontal, so the bus stopped (the distance did not change). The bus traveled fastest in interval $C$ to $D$, at $60$ miles per hour. The average rate of speed for the entire trip was $35$ miles per hour.`,
    modelSolution: String.raw`From $D$ to $E$ the graph is a horizontal segment — the miles traveled stay the same — so the bus was not moving; it most likely stopped. The bus is fastest on the steepest rising segment, $C$ to $D$: it rises from $20$ to $110$ miles ($90$ miles) over $1$ to $2.5$ hours ($1.5$ hours), a rate of $\dfrac{90}{1.5} = 60$ miles per hour. For the whole trip, $140$ miles in $4$ hours gives an average rate of $\dfrac{140}{4} = 35$ miles per hour.`,
    rubric: [
      { credits: 4, criteria: "A correct explanation is written, C to D, 60, and 35." },
      { credits: 3, criteria: "Appropriate work is shown, but one computational error is made; OR appropriate work is shown, but the explanation is missing or incorrect." },
      { credits: 2, criteria: "Both 60 and 35 are stated, but no further correct work is shown." },
      { credits: 1, criteria: "C to D, but no further correct work is shown; OR either 60 or 35 is stated, but no further correct work is shown." },
      { credits: 0, criteria: "A zero response is completely incorrect, irrelevant, or incoherent or is a correct response that was obtained by an obviously incorrect procedure." },
    ],
  },

  {
    id: "ifg-cr-0815-q28",
    mode: "self-score",
    standard: "AI-F.IF.4",
    topic: "Relating graphs to events — sketch a distance graph",
    examCitation: "regents-algI-0815-q28",
    part: "II",
    credits: 2,
    prompt: String.raw`A driver leaves home for a business trip and drives at a constant speed of $60$ miles per hour for $2$ hours. Her car gets a flat tire, and she spends $30$ minutes changing the tire. She resumes driving and drives at $30$ miles per hour for the remaining one hour until she reaches her destination. On a set of axes (distance from home versus time), draw a graph that models the driver's distance from home.`,
    figure: {
      kind: "plot",
      xRange: [0, 5],
      yRange: [0, 300],
      xLabel: "Time (hours)",
      yLabel: "Distance from home (miles)",
    },
    answerSummary: String.raw`A piecewise graph: rising from $(0,0)$ to $(2,120)$, flat from $(2,120)$ to $(2.5,120)$, then rising from $(2.5,120)$ to $(3.5,150)$.`,
    modelSolution: String.raw`Build the graph segment by segment. For the first $2$ hours she covers $60 \times 2 = 120$ miles, so the graph rises in a straight line from $(0, 0)$ to $(2, 120)$. While changing the tire for $30$ minutes she does not move, so the distance stays at $120$: a horizontal segment from $(2, 120)$ to $(2.5, 120)$. For the last hour at $30$ mph she covers another $30$ miles, ending at $120 + 30 = 150$ miles: a straight segment from $(2.5, 120)$ to $(3.5, 150)$.`,
    solutionFigure: {
      kind: "plot",
      xRange: [0, 5],
      yRange: [0, 300],
      xLabel: "Time (hours)",
      yLabel: "Distance from home (miles)",
      curves: [
        { kind: "polyline", points: [[0, 0], [2, 120], [2.5, 120], [3.5, 150]] },
      ],
    },
    rubric: [
      { credits: 2, criteria: "A correct graph is drawn." },
      { credits: 1, criteria: "Appropriate work is shown, but one graphing error is made; OR appropriate work is shown, but one conceptual error is made." },
      { credits: 0, criteria: "A zero response is completely incorrect, irrelevant, or incoherent or is a correct response that was obtained by an obviously incorrect procedure." },
    ],
  },
];

export default bank;
