// Figures for the Regents bank, rendered to STATIC HTML/SVG at build time
// (server-side, like the math) so the browser ships no figure-drawing JS.
// Kinds: "plot" (coordinate plane with lines/parabolas/points), "scatter" (a
// scatter plot with an optional best-fit line over arbitrary ranges), and
// "table" (a data table). Extend the `Figure` union and switch in figureToHtml.

export type FigurePoint = {
  x: number;
  y: number;
  label?: string;
  /** Open (hollow) circle — e.g. an excluded endpoint. Defaults to filled. */
  open?: boolean;
};

export type FigureCurve =
  | { kind: "line"; m: number; b: number } // y = m·x + b
  | { kind: "parabola"; a: number; b: number; c: number }; // y = a·x² + b·x + c

export type PlotFigure = {
  kind: "plot";
  /** Axes span −range..range on both axes (default 10). */
  range?: number;
  curves?: FigureCurve[];
  points?: FigurePoint[];
  caption?: string;
};

export type ScatterFigure = {
  kind: "scatter";
  points: [number, number][];
  xRange: [number, number];
  yRange: [number, number];
  /** Optional best-fit line y = m·x + b. */
  fit?: { m: number; b: number };
  xLabel?: string;
  yLabel?: string;
  caption?: string;
};

export type TableFigure = {
  kind: "table";
  headers: (string | number)[];
  rows: (string | number)[][];
  caption?: string;
};

export type Figure = PlotFigure | ScatterFigure | TableFigure;

const SIZE = 300;
const PAD = 16;
const GRID = "#e7e2d4";
const AXIS = "#8a8676";
const INK = "#16231c";
const FIT = "#b4540a";
const DOT = "#2563b4";
const CURVE = ["#2563b4", "#b4540a", "#7c3aed"]; // blue, orange, violet — cycled

const evalCurve = (c: FigureCurve, x: number): number =>
  c.kind === "line" ? c.m * x + c.b : c.a * x * x + c.b * x + c.c;

function esc(s: string): string {
  return s.replace(/[&<>"]/g, (ch) =>
    ch === "&" ? "&amp;" : ch === "<" ? "&lt;" : ch === ">" ? "&gt;" : "&quot;",
  );
}

const fmt = (n: number): string =>
  Number.isInteger(n) ? String(n) : String(+n.toFixed(1));

function svg(inner: string, label: string, caption?: string, w = SIZE, h = SIZE): string {
  const cap = caption
    ? `<figcaption class="mt-1 text-xs text-muted-foreground">${esc(caption)}</figcaption>`
    : "";
  return (
    `<figure class="my-2">` +
    `<svg viewBox="0 0 ${w} ${h}" role="img" aria-label="${esc(label)}" ` +
    `class="h-auto w-full max-w-[340px]" xmlns="http://www.w3.org/2000/svg">${inner}</svg>` +
    `${cap}</figure>`
  );
}

// Sample y = f(x) over [x0,x1] into an SVG path, broken where it leaves [y0,y1].
function sampledPath(
  f: (x: number) => number,
  x0: number,
  x1: number,
  y0: number,
  y1: number,
  sx: (x: number) => number,
  sy: (y: number) => number,
): string {
  let d = "";
  let penUp = true;
  const steps = 240;
  for (let k = 0; k <= steps; k++) {
    const x = x0 + ((x1 - x0) * k) / steps;
    const y = f(x);
    if (y < y0 || y > y1) {
      penUp = true;
      continue;
    }
    d += `${penUp ? "M" : "L"}${+sx(x).toFixed(2)},${+sy(y).toFixed(2)}`;
    penUp = false;
  }
  return d;
}

function renderPlot(fig: PlotFigure): string {
  const R = fig.range ?? 10;
  const span = SIZE - 2 * PAD;
  const unit = span / (2 * R);
  const cx = PAD + R * unit;
  const cy = PAD + R * unit;
  const sx = (x: number) => +(cx + x * unit).toFixed(2);
  const sy = (y: number) => +(cy - y * unit).toFixed(2);
  const parts: string[] = [];

  for (let v = -R; v <= R; v++) {
    parts.push(
      `<line x1="${sx(v)}" y1="${PAD}" x2="${sx(v)}" y2="${SIZE - PAD}" stroke="${GRID}"/>`,
      `<line x1="${PAD}" y1="${sy(v)}" x2="${SIZE - PAD}" y2="${sy(v)}" stroke="${GRID}"/>`,
    );
  }
  parts.push(
    `<line x1="${PAD}" y1="${sy(0)}" x2="${SIZE - PAD}" y2="${sy(0)}" stroke="${AXIS}" stroke-width="1.5"/>`,
    `<line x1="${sx(0)}" y1="${PAD}" x2="${sx(0)}" y2="${SIZE - PAD}" stroke="${AXIS}" stroke-width="1.5"/>`,
  );
  for (let v = -R; v <= R; v++) {
    if (v === 0 || v % 5 !== 0) continue;
    parts.push(
      `<text x="${sx(v)}" y="${sy(0) + 12}" fill="${AXIS}" font-size="8" text-anchor="middle">${v}</text>`,
      `<text x="${sx(0) - 5}" y="${sy(v) + 3}" fill="${AXIS}" font-size="8" text-anchor="end">${v}</text>`,
    );
  }
  (fig.curves ?? []).forEach((c, i) => {
    const d = sampledPath((x) => evalCurve(c, x), -R, R, -R, R, sx, sy);
    if (d) parts.push(`<path d="${d}" fill="none" stroke="${CURVE[i % CURVE.length]}" stroke-width="2"/>`);
  });
  for (const p of fig.points ?? []) {
    parts.push(
      `<circle cx="${sx(p.x)}" cy="${sy(p.y)}" r="3.5" fill="${p.open ? "#fffdf7" : INK}" stroke="${INK}" stroke-width="1.5"/>`,
    );
    if (p.label) {
      parts.push(
        `<text x="${sx(p.x) + 6}" y="${sy(p.y) - 6}" fill="${INK}" font-size="9" font-weight="600">${esc(p.label)}</text>`,
      );
    }
  }
  return svg(parts.join(""), fig.caption ?? "Coordinate-plane graph", fig.caption);
}

function renderScatter(fig: ScatterFigure): string {
  const W = 320;
  const H = 240;
  const padL = 42;
  const padR = 12;
  const padT = 12;
  const padB = 30;
  const pw = W - padL - padR;
  const ph = H - padT - padB;
  const [x0, x1] = fig.xRange;
  const [y0, y1] = fig.yRange;
  const sx = (x: number) => +(padL + ((x - x0) / (x1 - x0)) * pw).toFixed(2);
  const sy = (y: number) => +(padT + ((y1 - y) / (y1 - y0)) * ph).toFixed(2);
  const parts: string[] = [
    `<rect x="${padL}" y="${padT}" width="${pw}" height="${ph}" fill="none" stroke="${AXIS}"/>`,
  ];
  for (const xv of [x0, (x0 + x1) / 2, x1]) {
    parts.push(
      `<line x1="${sx(xv)}" y1="${padT + ph}" x2="${sx(xv)}" y2="${padT + ph + 3}" stroke="${AXIS}"/>`,
      `<text x="${sx(xv)}" y="${padT + ph + 13}" fill="${AXIS}" font-size="8" text-anchor="middle">${fmt(xv)}</text>`,
    );
  }
  for (const yv of [y0, (y0 + y1) / 2, y1]) {
    parts.push(
      `<line x1="${padL - 3}" y1="${sy(yv)}" x2="${padL}" y2="${sy(yv)}" stroke="${AXIS}"/>`,
      `<text x="${padL - 5}" y="${sy(yv) + 3}" fill="${AXIS}" font-size="8" text-anchor="end">${fmt(yv)}</text>`,
    );
  }
  if (fig.fit) {
    const { m, b } = fig.fit;
    const d = sampledPath((x) => m * x + b, x0, x1, y0, y1, sx, sy);
    if (d) parts.push(`<path d="${d}" fill="none" stroke="${FIT}" stroke-width="2"/>`);
  }
  for (const [px, py] of fig.points) {
    parts.push(`<circle cx="${sx(px)}" cy="${sy(py)}" r="3" fill="${DOT}"/>`);
  }
  if (fig.xLabel) {
    parts.push(
      `<text x="${padL + pw / 2}" y="${H - 2}" fill="${INK}" font-size="9" text-anchor="middle">${esc(fig.xLabel)}</text>`,
    );
  }
  if (fig.yLabel) {
    parts.push(
      `<text x="10" y="${padT + ph / 2}" fill="${INK}" font-size="9" text-anchor="middle" transform="rotate(-90 10 ${padT + ph / 2})">${esc(fig.yLabel)}</text>`,
    );
  }
  return svg(parts.join(""), fig.caption ?? "Scatter plot", fig.caption, W, H);
}

function renderTable(fig: TableFigure): string {
  const th = fig.headers
    .map(
      (h) =>
        `<th class="border border-border px-2 py-1 text-left font-semibold">${esc(String(h))}</th>`,
    )
    .join("");
  const body = fig.rows
    .map(
      (row) =>
        `<tr>${row
          .map((c) => `<td class="border border-border px-2 py-1">${esc(String(c))}</td>`)
          .join("")}</tr>`,
    )
    .join("");
  const cap = fig.caption
    ? `<figcaption class="mt-1 text-xs text-muted-foreground">${esc(fig.caption)}</figcaption>`
    : "";
  return (
    `<figure class="my-2 overflow-x-auto">` +
    `<table class="border-collapse text-sm"><thead><tr>${th}</tr></thead><tbody>${body}</tbody></table>` +
    `${cap}</figure>`
  );
}

/** Render a figure to a trusted, self-contained HTML string (server only). */
export function figureToHtml(figure: Figure): string {
  switch (figure.kind) {
    case "plot":
      return renderPlot(figure);
    case "scatter":
      return renderScatter(figure);
    case "table":
      return renderTable(figure);
    default: {
      const never: never = figure;
      throw new Error(`figureToHtml: unsupported figure ${JSON.stringify(never)}`);
    }
  }
}
