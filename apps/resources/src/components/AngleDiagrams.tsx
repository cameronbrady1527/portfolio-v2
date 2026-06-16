import type { ReactNode } from "react";

// Static teaching diagrams for the geometry topic pages. These are pure,
// presentational SVG (no hooks, no client JS) — the *interactive* tools live in
// @cameronbrady/math-components; these are the small, color-matched figures that
// sit beside the prose so a page is never a wall of text. The palette matches
// the interactive tools exactly so "the orange angle" means the same thing in
// the diagram and in the tool.
const A = "#b4540a"; // angle A — orange
const B = "#2563b4"; // angle B — blue
const C = "#7a3fb0"; // angle C — violet
const INK = "#16231c";
const MUTED = "#8a8676";

const D2R = Math.PI / 180;
const on = (cx: number, cy: number, r: number, d: number): [number, number] => [
  +(cx + r * Math.cos(d * D2R)).toFixed(1),
  +(cy + r * Math.sin(d * D2R)).toFixed(1),
];

// Filled sector from center (cx,cy), radius r, sweeping a0 -> a1 (screen degrees,
// clockwise = increasing). Used to shade an angle.
function sector(cx: number, cy: number, r: number, a0: number, a1: number): string {
  const lo = a0;
  let hi = a1;
  if (hi < lo) hi += 360;
  const large = hi - lo > 180 ? 1 : 0;
  const [x0, y0] = on(cx, cy, r, lo);
  const [x1, y1] = on(cx, cy, r, hi);
  return `M ${cx} ${cy} L ${x0} ${y0} A ${r} ${r} 0 ${large} 1 ${x1} ${y1} Z`;
}
const mid = (a0: number, a1: number) => {
  const lo = a0;
  let hi = a1;
  if (hi < lo) hi += 360;
  return (lo + hi) / 2;
};

function Figure({
  caption,
  children,
  width,
  height,
  label,
  className,
}: {
  caption?: ReactNode;
  children: ReactNode;
  width: number;
  height: number;
  label: string;
  className?: string;
}) {
  return (
    <figure className={`my-6 flex flex-col items-center gap-2 ${className ?? ""}`}>
      <svg
        viewBox={`0 0 ${width} ${height}`}
        role="img"
        aria-label={label}
        className="w-full max-w-md rounded-lg border border-border bg-card"
      >
        {children}
      </svg>
      {caption && (
        <figcaption className="max-w-md text-center text-sm text-muted-foreground">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}

// ── Two lines crossing ──────────────────────────────────────────────────────
// variant "vertical": the two vertical-angle pairs shaded in matching colors,
// each labelled with its measure. variant "linear": one adjacent (linear) pair
// highlighted, annotated as summing to 180°. variant "right": perpendicular,
// all four 90° with right-angle marks.
export function AngleCrossing({
  angle = 55,
  variant = "vertical",
  caption,
  className,
}: {
  angle?: number;
  variant?: "vertical" | "linear" | "right";
  caption?: ReactNode;
  className?: string;
}) {
  const theta = variant === "right" ? 90 : angle;
  const W = 320;
  const H = 200;
  const cx = 160;
  const cy = 100;
  const L = 142;
  const rA = 42;
  const rL = 70;
  const m1 = theta; // ∠1, ∠3
  const m2 = 180 - theta; // ∠2, ∠4

  const ux = Math.cos(theta * D2R);
  const uy = -Math.sin(theta * D2R);

  // sector screen-angle ranges
  const s1: [number, number] = [360 - theta, 360]; // upper-right, θ
  const s2: [number, number] = [180, 360 - theta]; // top, 180−θ
  const s3: [number, number] = [180 - theta, 180]; // lower-left, θ
  const s4: [number, number] = [0, 180 - theta]; // lower-right, 180−θ

  const lineStroke = { stroke: INK, strokeWidth: 2.5, strokeLinecap: "round" as const };

  const labelAt = (range: [number, number], text: string, fill: string) => {
    const [lx, ly] = on(cx, cy, rL, mid(range[0], range[1]));
    return (
      <text x={lx} y={ly + 4} textAnchor="middle" fontSize="15" fontWeight="600" fill={fill}>
        {text}
      </text>
    );
  };

  return (
    <Figure
      width={W}
      height={H}
      label={
        variant === "linear"
          ? `Two crossing lines; one angle of ${m1} degrees and its neighbor of ${m2} degrees add to 180 degrees.`
          : variant === "right"
            ? "Two perpendicular lines; all four angles are 90 degrees."
            : `Two crossing lines; opposite angles of ${m1} and ${m2} degrees are equal in pairs.`
      }
      caption={caption}
      className={className}
    >
      {variant === "linear" ? (
        <>
          <path d={sector(cx, cy, rA, s1[0], s1[1])} fill={A} fillOpacity="0.22" stroke={A} />
          <path d={sector(cx, cy, rA, s2[0], s2[1])} fill={C} fillOpacity="0.22" stroke={C} />
          <path d={sector(cx, cy, rA, s3[0], s3[1])} fill={MUTED} fillOpacity="0.08" />
          <path d={sector(cx, cy, rA, s4[0], s4[1])} fill={MUTED} fillOpacity="0.08" />
        </>
      ) : (
        <>
          <path d={sector(cx, cy, rA, s1[0], s1[1])} fill={A} fillOpacity="0.20" stroke={A} />
          <path d={sector(cx, cy, rA, s3[0], s3[1])} fill={A} fillOpacity="0.20" stroke={A} />
          <path d={sector(cx, cy, rA, s2[0], s2[1])} fill={B} fillOpacity="0.20" stroke={B} />
          <path d={sector(cx, cy, rA, s4[0], s4[1])} fill={B} fillOpacity="0.20" stroke={B} />
        </>
      )}

      {/* the two lines */}
      <line x1={cx - L} y1={cy} x2={cx + L} y2={cy} {...lineStroke} />
      <line x1={cx - L * ux} y1={cy - L * uy} x2={cx + L * ux} y2={cy + L * uy} {...lineStroke} />

      {/* right-angle marks for the perpendicular variant */}
      {variant === "right" &&
        (
          [
            [1, 0, 0, -1],
            [0, -1, -1, 0],
            [-1, 0, 0, 1],
            [0, 1, 1, 0],
          ] as const
        ).map(([u1x, u1y, u2x, u2y], i) => {
          const d = 16;
          return (
            <polyline
              key={i}
              points={`${cx + d * u1x},${cy + d * u1y} ${cx + d * (u1x + u2x)},${cy + d * (u1y + u2y)} ${cx + d * u2x},${cy + d * u2y}`}
              fill="none"
              stroke={INK}
              strokeWidth="1.5"
            />
          );
        })}

      {/* labels */}
      {variant === "linear" ? (
        <>
          {labelAt(s1, `${m1}°`, A)}
          {labelAt(s2, `${m2}°`, C)}
          <text x={cx} y={H - 12} textAnchor="middle" fontSize="14" fontWeight="600" fill={INK}>
            {m1}° + {m2}° = 180°
          </text>
        </>
      ) : variant === "right" ? (
        <>
          {labelAt(s1, "90°", A)}
          {labelAt(s2, "90°", B)}
          {labelAt(s3, "90°", A)}
          {labelAt(s4, "90°", B)}
        </>
      ) : (
        <>
          {labelAt(s1, `${m1}°`, A)}
          {labelAt(s3, `${m1}°`, A)}
          {labelAt(s2, `${m2}°`, B)}
          {labelAt(s4, `${m2}°`, B)}
        </>
      )}
    </Figure>
  );
}

// ── Two parallel lines cut by a transversal ─────────────────────────────────
// Highlights the pair named by `relationship` in the tool palette: equal pairs
// share a colour; the supplementary (same-side) pair uses two colours and a
// "= 180°" note. Chevrons mark the two lines parallel.
export function TransversalPattern({
  relationship = "corresponding",
  caption,
  className,
}: {
  relationship?: "corresponding" | "alternate-interior" | "same-side-interior";
  caption?: ReactNode;
  className?: string;
}) {
  const W = 320;
  const H = 250;
  const y1 = 80;
  const y2 = 170;
  const x0 = 24;
  const x1 = 296;
  // transversal at 65° to the horizontals, through (160, 125)
  const P1: [number, number] = [181, y1];
  const P2: [number, number] = [139, y2];
  const T0: [number, number] = [211, 16];
  const T1: [number, number] = [109, 234];
  const rA = 26;

  // sector ranges shared by both crossings (parallel ⇒ identical)
  const UR: [number, number] = [295, 360]; // upper-right, 65°
  const LR: [number, number] = [0, 115]; // lower-right, 115°
  const LL: [number, number] = [115, 180]; // lower-left, 65°

  type Mark = { p: [number, number]; range: [number, number]; deg: number; color: string };
  let marks: Mark[] = [];
  let note: string | null = null;
  if (relationship === "corresponding") {
    marks = [
      { p: P1, range: UR, deg: 65, color: A },
      { p: P2, range: UR, deg: 65, color: A },
    ];
  } else if (relationship === "alternate-interior") {
    marks = [
      { p: P1, range: LL, deg: 65, color: A }, // interior, left
      { p: P2, range: UR, deg: 65, color: A }, // interior, right
    ];
  } else {
    marks = [
      { p: P1, range: LR, deg: 115, color: B }, // interior, right
      { p: P2, range: UR, deg: 65, color: A }, // interior, right
    ];
    note = "115° + 65° = 180°";
  }

  const lineStroke = { stroke: INK, strokeWidth: 2.5, strokeLinecap: "round" as const };
  const chevron = (cxp: number, y: number) => (
    <polyline
      points={`${cxp - 5},${y - 5} ${cxp + 5},${y} ${cxp - 5},${y + 5}`}
      fill="none"
      stroke={MUTED}
      strokeWidth="2"
    />
  );

  return (
    <Figure
      width={W}
      height={H}
      label={`Two parallel lines cut by a transversal, showing ${relationship.replace("-", " ")} angles.`}
      caption={caption}
      className={className}
    >
      {marks.map((m, i) => (
        <path
          key={i}
          d={sector(m.p[0], m.p[1], rA, m.range[0], m.range[1])}
          fill={m.color}
          fillOpacity="0.22"
          stroke={m.color}
        />
      ))}

      {/* the two parallel lines + transversal */}
      <line x1={x0} y1={y1} x2={x1} y2={y1} {...lineStroke} />
      <line x1={x0} y1={y2} x2={x1} y2={y2} {...lineStroke} />
      <line x1={T0[0]} y1={T0[1]} x2={T1[0]} y2={T1[1]} stroke={INK} strokeWidth="2" strokeLinecap="round" />

      {chevron(70, y1)}
      {chevron(70, y2)}

      {marks.map((m, i) => {
        const [lx, ly] = on(m.p[0], m.p[1], rA + 16, mid(m.range[0], m.range[1]));
        return (
          <text key={i} x={lx} y={ly + 4} textAnchor="middle" fontSize="14" fontWeight="600" fill={m.color}>
            {m.deg}°
          </text>
        );
      })}

      {note && (
        <text x={W / 2} y={H - 12} textAnchor="middle" fontSize="14" fontWeight="600" fill={INK}>
          {note}
        </text>
      )}
    </Figure>
  );
}

// ── Spotlighted result ──────────────────────────────────────────────────────
// Breaks the wall of prose and gives the page a visual anchor for "the thing to
// remember". Reusable on every topic page.
export function Takeaway({ children }: { children: ReactNode }) {
  return (
    <div className="my-6 rounded-lg border border-primary/30 bg-primary/5 p-4">
      <p className="mb-1 font-mono text-xs uppercase tracking-[0.15em] text-primary">Key result</p>
      <div className="flex flex-col gap-2 text-foreground">{children}</div>
    </div>
  );
}
