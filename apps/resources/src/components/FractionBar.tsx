import type { ReactNode } from "react";

// Static teaching diagram for the Foundations (Unit 0) fractions cards.
// Pure, presentational SVG (no hooks, no client JS) — like NumberLine and the
// geometry diagrams, the small color-matched figure that sits beside the prose
// so a fraction becomes something a student can *see*. Each fraction is one bar
// of the SAME total width, cut into `den` equal parts with `num` shaded. When
// two fractions are equivalent their shaded portions line up exactly — the
// dashed guide makes that equality visible at a glance.
const FILL = "#b4540a"; // shaded part — orange (matches the number-line jump)
const INK = "#16231c";
const MUTED = "#8a8676";
const CELL = "#fff";

export interface FractionBarFraction {
  num: number;
  den: number;
  /** Optional override label; defaults to "num/den". */
  label?: ReactNode;
}

export function FractionBar({
  fractions,
  guide = true,
  caption,
  className,
}: {
  /** One or more fractions, drawn as stacked equal-width bars. */
  fractions: FractionBarFraction[];
  /** Draw the dashed vertical line at the first fraction's shaded edge. */
  guide?: boolean;
  caption?: ReactNode;
  className?: string;
}) {
  const W = 340;
  const labelW = 52;
  const padX = 12;
  const padTop = 14;
  const barH = 34;
  const gap = 16;
  const barX0 = padX + labelW;
  const barW = W - barX0 - padX;
  const H = padTop * 2 + fractions.length * barH + (fractions.length - 1) * gap;

  const first = fractions[0];
  const guideX = first ? barX0 + (first.num / first.den) * barW : 0;

  const describe = fractions
    .map((f) => `${f.num} out of ${f.den}`)
    .join(", equal to ");

  return (
    <figure className={`my-6 flex flex-col items-center gap-2 ${className ?? ""}`}>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        role="img"
        aria-label={`Fraction bars: ${describe}.`}
        className="w-full max-w-md rounded-lg border border-border bg-card"
      >
        {fractions.map((f, r) => {
          const y = padTop + r * (barH + gap);
          const cellW = barW / f.den;
          const cells = Array.from({ length: f.den }, (_, i) => i);
          return (
            <g key={r}>
              {/* label, e.g. 2/3 */}
              <text
                x={padX + labelW - 12}
                y={y + barH / 2 + 5}
                textAnchor="end"
                fontSize="15"
                fontWeight="700"
                fill={INK}
              >
                {f.label ?? `${f.num}/${f.den}`}
              </text>

              {/* the cells: first `num` shaded, the rest empty */}
              {cells.map((i) => (
                <rect
                  key={i}
                  x={barX0 + i * cellW}
                  y={y}
                  width={cellW}
                  height={barH}
                  fill={i < f.num ? FILL : CELL}
                  stroke={MUTED}
                  strokeWidth="1"
                />
              ))}

              {/* outer border, drawn last so it sits cleanly on top */}
              <rect
                x={barX0}
                y={y}
                width={barW}
                height={barH}
                fill="none"
                stroke={INK}
                strokeWidth="1.5"
              />
            </g>
          );
        })}

        {/* the equality guide: a dashed line at the first bar's shaded edge */}
        {guide && fractions.length > 1 ? (
          <line
            x1={guideX}
            y1={padTop - 6}
            x2={guideX}
            y2={H - padTop + 6}
            stroke={FILL}
            strokeWidth="1.5"
            strokeDasharray="4 3"
          />
        ) : null}
      </svg>
      {caption && (
        <figcaption className="max-w-md text-center text-sm text-muted-foreground">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
