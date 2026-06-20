import type { ReactNode } from "react";

// Static teaching diagram for the Foundations (Unit 0) coordinate-plane cards.
// Pure, presentational SVG (no hooks, no client JS) — like NumberLine and
// FractionBar, the small color-matched figure that sits beside the prose so the
// plane becomes something a student can *see*: axes, a light integer grid,
// optional faint quadrant labels, plotted points, and an optional segment
// joining the first two.
const POINT = "#b4540a"; // plotted points — orange (matches the number-line jump)
const SEG = "#2563b4"; // a connecting segment — blue
const INK = "#16231c";
const GRID = "#e7e2d4";
const MUTED = "#8a8676";

export interface GridPoint {
  x: number;
  y: number;
  /** Optional label; defaults to "(x, y)". Pass "" to hide. */
  label?: ReactNode;
}

export function CoordinateGrid({
  points = [],
  segment = false,
  range = 6,
  showQuadrants = false,
  caption,
  className,
}: {
  points?: GridPoint[];
  /** Draw a segment between the first two points. */
  segment?: boolean;
  /** Grid spans −range..range on both axes. */
  range?: number;
  /** Faint I–IV labels in the corners. */
  showQuadrants?: boolean;
  caption?: ReactNode;
  className?: string;
}) {
  const SIZE = 300;
  const pad = 18;
  const span = SIZE - 2 * pad;
  const unit = span / (2 * range);
  const cx = pad + range * unit;
  const cy = pad + range * unit;
  const sx = (x: number) => cx + x * unit;
  const sy = (y: number) => cy - y * unit;

  const lines: number[] = [];
  for (let v = -range; v <= range; v++) lines.push(v);

  const describe = points
    .map((p) => `(${p.x}, ${p.y})`)
    .join(segment ? " to " : ", ");

  return (
    <figure className={`my-6 flex flex-col items-center gap-2 ${className ?? ""}`}>
      <svg
        viewBox={`0 0 ${SIZE} ${SIZE}`}
        role="img"
        aria-label={`Coordinate grid with ${points.length === 1 ? "the point" : "points"} ${describe}.`}
        className="w-full max-w-sm rounded-lg border border-border bg-card"
      >
        {/* light integer grid */}
        {lines.map((v) => (
          <g key={`g${v}`}>
            <line x1={sx(v)} y1={pad} x2={sx(v)} y2={SIZE - pad} stroke={GRID} strokeWidth="1" />
            <line x1={pad} y1={sy(v)} x2={SIZE - pad} y2={sy(v)} stroke={GRID} strokeWidth="1" />
          </g>
        ))}

        {/* faint quadrant numerals */}
        {showQuadrants
          ? (
              [
                { t: "I", x: range / 2, y: range / 2 },
                { t: "II", x: -range / 2, y: range / 2 },
                { t: "III", x: -range / 2, y: -range / 2 },
                { t: "IV", x: range / 2, y: -range / 2 },
              ] as const
            ).map((q) => (
              <text
                key={q.t}
                x={sx(q.x)}
                y={sy(q.y)}
                textAnchor="middle"
                fontSize="13"
                fontWeight="700"
                fill={MUTED}
                opacity="0.5"
              >
                {q.t}
              </text>
            ))
          : null}

        {/* axes */}
        <line x1={pad} y1={cy} x2={SIZE - pad} y2={cy} stroke={INK} strokeWidth="1.75" />
        <line x1={cx} y1={pad} x2={cx} y2={SIZE - pad} stroke={INK} strokeWidth="1.75" />

        {/* optional segment between the first two points */}
        {segment && points.length >= 2 ? (
          <line
            x1={sx(points[0].x)}
            y1={sy(points[0].y)}
            x2={sx(points[1].x)}
            y2={sy(points[1].y)}
            stroke={SEG}
            strokeWidth="2.5"
            strokeLinecap="round"
          />
        ) : null}

        {/* points + labels */}
        {points.map((p, i) => (
          <g key={i}>
            <circle cx={sx(p.x)} cy={sy(p.y)} r="4.5" fill={POINT} stroke="#fff" strokeWidth="1.5" />
            <text
              x={sx(p.x) + (p.x < 0 ? -8 : 8)}
              y={sy(p.y) - 8}
              textAnchor={p.x < 0 ? "end" : "start"}
              fontSize="12"
              fontWeight="700"
              fill={POINT}
            >
              {p.label ?? `(${p.x}, ${p.y})`}
            </text>
          </g>
        ))}
      </svg>
      {caption && (
        <figcaption className="max-w-sm text-center text-sm text-muted-foreground">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
