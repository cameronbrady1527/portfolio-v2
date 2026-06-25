// Figures for the Regents bank, rendered to STATIC SVG at build time (server-
// side, like the math) so the browser ships no figure-drawing JS. The first kind
// is a coordinate-plane "plot": axes + grid, lines and parabolas sampled as
// polylines, and labelled points. Extend the `Figure` union for future kinds
// (number line, scatter plot, table) — `figureToSvg` switches on `kind`.

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

export type Figure = {
  kind: "plot";
  /** Axes span −range..range on both axes (default 10). */
  range?: number;
  curves?: FigureCurve[];
  points?: FigurePoint[];
  /** Accessible description + visible caption. */
  caption?: string;
};

const SIZE = 300;
const PAD = 16;
const GRID = "#e7e2d4";
const AXIS = "#8a8676";
const INK = "#16231c";
const CURVE = ["#2563b4", "#b4540a", "#7c3aed"]; // blue, orange, violet — cycled

const evalCurve = (c: FigureCurve, x: number): number =>
  c.kind === "line" ? c.m * x + c.b : c.a * x * x + c.b * x + c.c;

function esc(s: string): string {
  return s.replace(/[&<>"]/g, (ch) =>
    ch === "&" ? "&amp;" : ch === "<" ? "&lt;" : ch === ">" ? "&gt;" : "&quot;",
  );
}

function renderPlot(fig: Figure): string {
  const R = fig.range ?? 10;
  const span = SIZE - 2 * PAD;
  const unit = span / (2 * R);
  const cx = PAD + R * unit;
  const cy = PAD + R * unit;
  const sx = (x: number) => +(cx + x * unit).toFixed(2);
  const sy = (y: number) => +(cy - y * unit).toFixed(2);

  const parts: string[] = [];

  // Light integer grid.
  for (let v = -R; v <= R; v++) {
    parts.push(
      `<line x1="${sx(v)}" y1="${PAD}" x2="${sx(v)}" y2="${SIZE - PAD}" stroke="${GRID}"/>`,
      `<line x1="${PAD}" y1="${sy(v)}" x2="${SIZE - PAD}" y2="${sy(v)}" stroke="${GRID}"/>`,
    );
  }
  // Axes.
  parts.push(
    `<line x1="${PAD}" y1="${sy(0)}" x2="${SIZE - PAD}" y2="${sy(0)}" stroke="${AXIS}" stroke-width="1.5"/>`,
    `<line x1="${sx(0)}" y1="${PAD}" x2="${sx(0)}" y2="${SIZE - PAD}" stroke="${AXIS}" stroke-width="1.5"/>`,
  );
  // A few axis numbers (multiples of 5) for scale.
  for (let v = -R; v <= R; v++) {
    if (v === 0 || v % 5 !== 0) continue;
    parts.push(
      `<text x="${sx(v)}" y="${sy(0) + 12}" fill="${AXIS}" font-size="8" text-anchor="middle">${v}</text>`,
      `<text x="${sx(0) - 5}" y="${sy(v) + 3}" fill="${AXIS}" font-size="8" text-anchor="end">${v}</text>`,
    );
  }

  // Curves — sampled as polylines, broken where they leave the viewport.
  (fig.curves ?? []).forEach((c, i) => {
    const color = CURVE[i % CURVE.length];
    let d = "";
    let penUp = true;
    const steps = 240;
    for (let k = 0; k <= steps; k++) {
      const x = -R + (2 * R * k) / steps;
      const y = evalCurve(c, x);
      if (y < -R || y > R) {
        penUp = true;
        continue;
      }
      d += `${penUp ? "M" : "L"}${sx(x)},${sy(y)}`;
      penUp = false;
    }
    if (d) {
      parts.push(
        `<path d="${d}" fill="none" stroke="${color}" stroke-width="2"/>`,
      );
    }
  });

  // Points (filled or open) with optional labels.
  for (const p of fig.points ?? []) {
    const fill = p.open ? "#fffdf7" : INK;
    parts.push(
      `<circle cx="${sx(p.x)}" cy="${sy(p.y)}" r="3.5" fill="${fill}" stroke="${INK}" stroke-width="1.5"/>`,
    );
    if (p.label) {
      parts.push(
        `<text x="${sx(p.x) + 6}" y="${sy(p.y) - 6}" fill="${INK}" font-size="9" font-weight="600">${esc(p.label)}</text>`,
      );
    }
  }

  const label = esc(fig.caption ?? "Coordinate-plane graph");
  const caption = fig.caption
    ? `<figcaption class="mt-1 text-xs text-muted-foreground">${esc(fig.caption)}</figcaption>`
    : "";
  return (
    `<figure class="my-2">` +
    `<svg viewBox="0 0 ${SIZE} ${SIZE}" role="img" aria-label="${label}" ` +
    `class="h-auto w-full max-w-[320px]" xmlns="http://www.w3.org/2000/svg">${parts.join("")}</svg>` +
    `${caption}</figure>`
  );
}

/** Render a figure to a trusted, self-contained SVG HTML string (server only). */
export function figureToSvg(figure: Figure): string {
  switch (figure.kind) {
    case "plot":
      return renderPlot(figure);
    default: {
      const never: never = figure.kind;
      throw new Error(`figureToSvg: unsupported figure kind ${String(never)}`);
    }
  }
}
