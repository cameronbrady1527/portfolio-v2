import type { ReactNode } from "react";

// Static teaching diagram for the Foundations (Unit 0) signed-numbers card.
// Pure, presentational SVG (no hooks, no client JS) — like AngleDiagrams and
// TriangleDiagrams, this is the small, color-matched figure that sits beside
// the prose so the concrete idea ("move along the line") becomes something a
// student can *see*. A signed add/sub is drawn as one directional jump: an arc
// from the start value to the landing value, bending right for a positive step
// and left for a negative one. The palette matches the geometry diagrams so the
// "orange jump" means the same thing everywhere.
const JUMP = "#b4540a"; // the directional jump — orange (matches angle A)
const START = "#2563b4"; // the starting point — blue (matches angle B)
const LAND = "#7a3fb0"; // the landing point — violet (matches angle C)
const INK = "#16231c";
const MUTED = "#8a8676";

// Render an integer the way students read it: −3, not -3.
const fmt = (n: number) => (n < 0 ? `−${Math.abs(n)}` : `${n}`);

export function NumberLine({
  start,
  delta,
  min,
  max,
  label,
  caption,
  className,
}: {
  /** Where the jump begins. */
  start: number;
  /** The signed step: positive jumps right, negative jumps left. */
  delta: number;
  /** Optional left end of the drawn line (auto-fit with padding otherwise). */
  min?: number;
  /** Optional right end of the drawn line (auto-fit with padding otherwise). */
  max?: number;
  /** Verbal expression shown under the line, e.g. "5 + (−8) = −3". */
  label?: ReactNode;
  caption?: ReactNode;
  className?: string;
}) {
  const end = start + delta;

  // Auto-fit a tidy integer range around the jump, with one unit of breathing
  // room on each side, unless the author pins min/max.
  const lo = min ?? Math.min(start, end) - 1;
  const hi = max ?? Math.max(start, end) + 1;
  const span = Math.max(1, hi - lo);

  const W = 320;
  const H = 150;
  const padX = 28;
  const axisY = 96;
  const x = (v: number) => padX + ((v - lo) / span) * (W - 2 * padX);

  const xs = x(start);
  const xe = x(end);
  const dir = delta >= 0 ? "right" : "left";
  const arcUp = axisY - 44; // apex height of the jump arc

  // The jump: a quadratic arc rising off the axis from start → end. An arrowhead
  // at the landing end shows the direction of travel.
  const jumpPath = `M ${xs} ${axisY - 6} Q ${(xs + xe) / 2} ${arcUp} ${xe} ${axisY - 6}`;
  // Arrowhead at the landing point, pointing along the direction of travel.
  const headSize = 7;
  const headSign = delta >= 0 ? 1 : -1;
  const head = `M ${xe} ${axisY - 4} l ${-headSign * headSize} ${-headSize} l ${headSign * (headSize + 4)} ${headSize - 2} Z`;

  const tickEvery = span > 16 ? 2 : 1;
  const ticks: number[] = [];
  for (let v = Math.ceil(lo); v <= Math.floor(hi); v += tickEvery) ticks.push(v);

  return (
    <figure className={`my-6 flex flex-col items-center gap-2 ${className ?? ""}`}>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        role="img"
        aria-label={
          label && typeof label === "string"
            ? `Number line: ${label}. Start at ${fmt(start)}, move ${dir} ${Math.abs(delta)}, land on ${fmt(end)}.`
            : `Number line: start at ${fmt(start)}, move ${dir} ${Math.abs(delta)}, land on ${fmt(end)}.`
        }
        className="w-full max-w-md rounded-lg border border-border bg-card"
      >
        {/* the axis */}
        <line
          x1={padX - 8}
          y1={axisY}
          x2={W - padX + 8}
          y2={axisY}
          stroke={INK}
          strokeWidth="2"
          strokeLinecap="round"
        />

        {/* tick marks + labels */}
        {ticks.map((v) => {
          const tx = x(v);
          const isZero = v === 0;
          return (
            <g key={v}>
              <line
                x1={tx}
                y1={axisY - (isZero ? 7 : 5)}
                x2={tx}
                y2={axisY + (isZero ? 7 : 5)}
                stroke={isZero ? INK : MUTED}
                strokeWidth={isZero ? 2 : 1.5}
              />
              <text
                x={tx}
                y={axisY + 22}
                textAnchor="middle"
                fontSize="12"
                fontWeight={isZero ? 700 : 500}
                fill={isZero ? INK : MUTED}
              >
                {fmt(v)}
              </text>
            </g>
          );
        })}

        {/* the directional jump */}
        <path d={jumpPath} fill="none" stroke={JUMP} strokeWidth="2.5" strokeLinecap="round" />
        <path d={head} fill={JUMP} stroke={JUMP} strokeWidth="1" strokeLinejoin="round" />
        <text
          x={(xs + xe) / 2}
          y={arcUp - 6}
          textAnchor="middle"
          fontSize="13"
          fontWeight="700"
          fill={JUMP}
        >
          {delta >= 0 ? "+" : "−"}
          {Math.abs(delta)}
        </text>

        {/* start point */}
        <circle cx={xs} cy={axisY} r="4.5" fill={START} stroke="#fff" strokeWidth="1.5" />
        {/* landing point */}
        <circle cx={xe} cy={axisY} r="4.5" fill={LAND} stroke="#fff" strokeWidth="1.5" />

        <text x={xs} y={axisY + 40} textAnchor="middle" fontSize="11" fontWeight="700" fill={START}>
          start {fmt(start)}
        </text>
        <text x={xe} y={axisY + 40} textAnchor="middle" fontSize="11" fontWeight="700" fill={LAND}>
          land {fmt(end)}
        </text>

        {label && (
          <text x={W / 2} y={24} textAnchor="middle" fontSize="14" fontWeight="600" fill={INK}>
            {label}
          </text>
        )}
      </svg>
      {caption && (
        <figcaption className="max-w-md text-center text-sm text-muted-foreground">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
