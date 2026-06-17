import type { ReactNode } from "react";

// Static teaching diagrams for the Triangles unit. Pure, presentational SVG
// (no hooks, no client JS) — the *interactive* tools live in
// @cameronbrady/math-components; these are the small, color-matched figures that
// sit beside the prose so a page is never a wall of text. The palette matches
// the interactive tools exactly so "the orange angle" means the same thing in a
// diagram, in the prose, and in the tool.
const A = "#b4540a"; // angle A — orange
const B = "#2563b4"; // angle B — blue
const C = "#7a3fb0"; // angle C — violet
const INK = "#16231c";
const MUTED = "#8a8676";

type Pt = [number, number];

const D2R = Math.PI / 180;
const on = (cx: number, cy: number, r: number, d: number): Pt => [
  +(cx + r * Math.cos(d * D2R)).toFixed(1),
  +(cy + r * Math.sin(d * D2R)).toFixed(1),
];
// Screen-angle (degrees) of the ray from f to t. SVG y points down.
const angTo = (f: Pt, t: Pt) => (Math.atan2(t[1] - f[1], t[0] - f[0]) * 180) / Math.PI;
// Signed shortest sweep from a0 to a1, in (−180, 180].
const shortDelta = (a0: number, a1: number) => {
  let d = a1 - a0;
  while (d <= -180) d += 360;
  while (d > 180) d -= 360;
  return d;
};

// Interior-angle wedge at vertex v, between the rays toward p and toward q,
// drawn as the minor (< 180°) sector — exactly the interior angle of a triangle.
function wedge(v: Pt, p: Pt, q: Pt, r: number): string {
  const a0 = angTo(v, p);
  const d = shortDelta(a0, angTo(v, q));
  const [x0, y0] = on(v[0], v[1], r, a0);
  const [x1, y1] = on(v[0], v[1], r, a0 + d);
  const sweep = d >= 0 ? 1 : 0;
  return `M ${v[0]} ${v[1]} L ${x0} ${y0} A ${r} ${r} 0 0 ${sweep} ${x1} ${y1} Z`;
}
// Where to drop a wedge's label: radius rr from the vertex, along the bisector.
function wedgeLabel(v: Pt, p: Pt, q: Pt, rr: number): Pt {
  const a0 = angTo(v, p);
  const d = shortDelta(a0, angTo(v, q));
  return on(v[0], v[1], rr, a0 + d / 2);
}

// Filled sector from a center, sweeping a0 -> a1 (increasing = clockwise on
// screen). Used by the angle-sum strip where the angles share one vertex.
function sector(cx: number, cy: number, r: number, a0: number, a1: number): string {
  const lo = a0;
  let hi = a1;
  if (hi < lo) hi += 360;
  const large = hi - lo > 180 ? 1 : 0;
  const [x0, y0] = on(cx, cy, r, lo);
  const [x1, y1] = on(cx, cy, r, hi);
  return `M ${cx} ${cy} L ${x0} ${y0} A ${r} ${r} 0 ${large} 1 ${x1} ${y1} Z`;
}
const midAng = (a0: number, a1: number) => {
  const lo = a0;
  let hi = a1;
  if (hi < lo) hi += 360;
  return (lo + hi) / 2;
};

// A short tick across the midpoint of segment p→q, marking equal lengths.
// `n` = which tick (0,1,2…) so a pair can carry matching double/triple ticks.
function ticks(p: Pt, q: Pt, count: number, color: string): ReactNode[] {
  const mx = (p[0] + q[0]) / 2;
  const my = (p[1] + q[1]) / 2;
  const len = Math.hypot(q[0] - p[0], q[1] - p[1]);
  const ux = (q[0] - p[0]) / len;
  const uy = (q[1] - p[1]) / len;
  const nx = -uy; // unit normal
  const ny = ux;
  const out: ReactNode[] = [];
  const spacing = 5;
  for (let i = 0; i < count; i++) {
    const off = (i - (count - 1) / 2) * spacing;
    const cxp = mx + ux * off;
    const cyp = my + uy * off;
    out.push(
      <line
        key={i}
        x1={cxp - nx * 6}
        y1={cyp - ny * 6}
        x2={cxp + nx * 6}
        y2={cyp + ny * 6}
        stroke={color}
        strokeWidth="2"
      />,
    );
  }
  return out;
}

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

const triLine = { stroke: INK, strokeWidth: 2.5, strokeLinecap: "round" as const, fill: "none" } as const;

function angLabel(p: Pt, text: string, color: string) {
  return (
    <text x={p[0]} y={p[1] + 4} textAnchor="middle" fontSize="14" fontWeight="600" fill={color}>
      {text}
    </text>
  );
}

// ── Triangle interior angles (∠A 50°, ∠B 60°, ∠C 70°) ────────────────────────
export function TriangleAngles({ caption, className }: { caption?: ReactNode; className?: string }) {
  const Pa: Pt = [75, 165];
  const Pb: Pt = [245, 165];
  const Pc: Pt = [176, 45];
  const r = 26;
  return (
    <Figure
      width={320}
      height={210}
      label="A triangle whose three interior angles, 50, 60 and 70 degrees, add to 180 degrees."
      caption={caption}
      className={className}
    >
      <path d={wedge(Pa, Pb, Pc, r)} fill={A} fillOpacity="0.2" stroke={A} />
      <path d={wedge(Pb, Pc, Pa, r)} fill={B} fillOpacity="0.2" stroke={B} />
      <path d={wedge(Pc, Pa, Pb, r)} fill={C} fillOpacity="0.2" stroke={C} />
      <polygon points={`${Pa} ${Pb} ${Pc}`} {...triLine} />
      {angLabel(wedgeLabel(Pa, Pb, Pc, r + 16), "50°", A)}
      {angLabel(wedgeLabel(Pb, Pc, Pa, r + 16), "60°", B)}
      {angLabel(wedgeLabel(Pc, Pa, Pb, r + 18), "70°", C)}
      <text x={Pa[0] - 10} y={Pa[1] + 16} textAnchor="middle" fontSize="13" fontWeight="700" fill={INK}>A</text>
      <text x={Pb[0] + 12} y={Pb[1] + 16} textAnchor="middle" fontSize="13" fontWeight="700" fill={INK}>B</text>
      <text x={Pc[0]} y={Pc[1] - 12} textAnchor="middle" fontSize="13" fontWeight="700" fill={INK}>C</text>
    </Figure>
  );
}

// ── Angle-sum strip: the three angles, torn off and set side by side, fill a
// straight line (50° + 60° + 70° = 180°). ───────────────────────────────────
export function AngleSumStrip({ caption, className }: { caption?: ReactNode; className?: string }) {
  const V: Pt = [160, 150];
  const r = 92;
  // Upper half-plane is screen-angles 180°→360°. Lay the three wedges across it.
  const segs: { a0: number; a1: number; deg: number; color: string }[] = [
    { a0: 180, a1: 230, deg: 50, color: A },
    { a0: 230, a1: 290, deg: 60, color: B },
    { a0: 290, a1: 360, deg: 70, color: C },
  ];
  return (
    <Figure
      width={320}
      height={180}
      label="The triangle's three angles, placed side by side at one point, exactly fill a straight line: 50 plus 60 plus 70 equals 180 degrees."
      caption={caption}
      className={className}
    >
      {segs.map((s, i) => (
        <path
          key={i}
          d={sector(V[0], V[1], r, s.a0, s.a1)}
          fill={s.color}
          fillOpacity="0.2"
          stroke={s.color}
        />
      ))}
      {/* the straight line the three angles sit on */}
      <line x1={20} y1={V[1]} x2={300} y2={V[1]} {...triLine} />
      {segs.map((s, i) => {
        const [lx, ly] = on(V[0], V[1], r - 30, midAng(s.a0, s.a1));
        return (
          <text key={i} x={lx} y={ly + 4} textAnchor="middle" fontSize="14" fontWeight="600" fill={s.color}>
            {s.deg}°
          </text>
        );
      })}
      <text x={160} y={28} textAnchor="middle" fontSize="14" fontWeight="600" fill={INK}>
        50° + 60° + 70° = 180°
      </text>
    </Figure>
  );
}

// ── Exterior angle (120° = 70° + 50°) ────────────────────────────────────────
export function ExteriorAngleFig({ caption, className }: { caption?: ReactNode; className?: string }) {
  const Pa: Pt = [147, 68];
  const Pb: Pt = [70, 160];
  const Pc: Pt = [200, 160];
  const Pd: Pt = [285, 160]; // BC extended beyond C
  const r = 24;
  return (
    <Figure
      width={320}
      height={210}
      label="A triangle with side BC extended past C. The exterior angle of 120 degrees equals the sum of the two remote interior angles, 70 and 50 degrees."
      caption={caption}
      className={className}
    >
      {/* remote interior angles, colour-matched to the sum */}
      <path d={wedge(Pa, Pb, Pc, r)} fill={A} fillOpacity="0.2" stroke={A} />
      <path d={wedge(Pb, Pc, Pa, r)} fill={B} fillOpacity="0.2" stroke={B} />
      {/* the exterior angle ∠ACD, between CA and the extension CD */}
      <path d={wedge(Pc, Pa, Pd, r)} fill={C} fillOpacity="0.2" stroke={C} />

      <polygon points={`${Pa} ${Pb} ${Pc}`} {...triLine} />
      {/* the extension, dashed past C */}
      <line x1={Pc[0]} y1={Pc[1]} x2={Pd[0]} y2={Pd[1]} stroke={INK} strokeWidth="2" strokeDasharray="6 5" strokeLinecap="round" />

      {angLabel(wedgeLabel(Pa, Pb, Pc, r + 16), "70°", A)}
      {angLabel(wedgeLabel(Pb, Pc, Pa, r + 16), "50°", B)}
      {angLabel(wedgeLabel(Pc, Pa, Pd, r + 18), "120°", C)}
      <text x={Pa[0]} y={Pa[1] - 12} textAnchor="middle" fontSize="13" fontWeight="700" fill={INK}>A</text>
      <text x={Pb[0] - 10} y={Pb[1] + 16} textAnchor="middle" fontSize="13" fontWeight="700" fill={INK}>B</text>
      <text x={Pc[0] - 2} y={Pc[1] + 18} textAnchor="middle" fontSize="13" fontWeight="700" fill={INK}>C</text>
      <text x={Pd[0]} y={Pd[1] + 16} textAnchor="middle" fontSize="13" fontWeight="700" fill={MUTED}>D</text>
      <text x={160} y={196} textAnchor="middle" fontSize="14" fontWeight="600" fill={INK}>
        120° = 70° + 50°
      </text>
    </Figure>
  );
}

// ── Midsegment (parallel to the base, half its length) ───────────────────────
export function MidsegmentFig({ caption, className }: { caption?: ReactNode; className?: string }) {
  const Pa: Pt = [150, 45];
  const Pb: Pt = [60, 175];
  const Pc: Pt = [260, 175];
  const M: Pt = [(Pa[0] + Pb[0]) / 2, (Pa[1] + Pb[1]) / 2]; // midpoint AB → (105,110)
  const N: Pt = [(Pa[0] + Pc[0]) / 2, (Pa[1] + Pc[1]) / 2]; // midpoint AC → (205,110)
  const chevron = (cxp: number, y: number, color: string) => (
    <polyline points={`${cxp - 5},${y - 5} ${cxp + 5},${y} ${cxp - 5},${y + 5}`} fill="none" stroke={color} strokeWidth="2" />
  );
  return (
    <Figure
      width={320}
      height={210}
      label="A triangle with the midpoints of two sides joined. The midsegment is parallel to the base and half its length."
      caption={caption}
      className={className}
    >
      <polygon points={`${Pa} ${Pb} ${Pc}`} {...triLine} />
      {/* the midsegment */}
      <line x1={M[0]} y1={M[1]} x2={N[0]} y2={N[1]} stroke={C} strokeWidth="3" strokeLinecap="round" />
      {/* equal-half tick marks on the two cut sides */}
      {ticks(Pa, M, 1, A)}
      {ticks(M, Pb, 1, A)}
      {ticks(Pa, N, 2, B)}
      {ticks(N, Pc, 2, B)}
      {/* parallel chevrons: one on the midsegment, one on the base */}
      {chevron(M[0] + 50, M[1], C)}
      {chevron(Pb[0] + 100, Pb[1], C)}
      {/* points */}
      <circle cx={M[0]} cy={M[1]} r="3" fill={INK} />
      <circle cx={N[0]} cy={N[1]} r="3" fill={INK} />
      <text x={Pa[0]} y={Pa[1] - 12} textAnchor="middle" fontSize="13" fontWeight="700" fill={INK}>A</text>
      <text x={Pb[0] - 10} y={Pb[1] + 16} textAnchor="middle" fontSize="13" fontWeight="700" fill={INK}>B</text>
      <text x={Pc[0] + 10} y={Pc[1] + 16} textAnchor="middle" fontSize="13" fontWeight="700" fill={INK}>C</text>
      <text x={M[0] - 14} y={M[1] + 4} textAnchor="middle" fontSize="13" fontWeight="700" fill={C}>M</text>
      <text x={N[0] + 14} y={N[1] + 4} textAnchor="middle" fontSize="13" fontWeight="700" fill={C}>N</text>
      <text x={160} y={M[1] - 8} textAnchor="middle" fontSize="13" fontWeight="600" fill={C}>MN = ½ · BC</text>
    </Figure>
  );
}

// ── Triangle inequality: sticks that close vs. sticks that can't reach ────────
export function TriangleInequalityFig({
  variant = "closes",
  caption,
  className,
}: {
  variant?: "closes" | "fails";
  caption?: ReactNode;
  className?: string;
}) {
  if (variant === "fails") {
    // base 9, sticks 4 and 3 — 4 + 3 = 7 < 9, they cannot meet.
    const Pa: Pt = [70, 160];
    const Pb: Pt = [250, 160];
    const e1: Pt = [142.5, 126.2]; // free end of stick from A (length 4, tilted up)
    const e2: Pt = [195.6, 134.6]; // free end of stick from B (length 3, tilted up)
    return (
      <Figure
        width={320}
        height={206}
        label="A long base of 9 with two short sticks of 4 and 3 at its ends. Because 4 plus 3 is 7, less than 9, the sticks cannot meet and no triangle forms."
        caption={caption}
        className={className}
      >
        <line x1={Pa[0]} y1={Pa[1]} x2={Pb[0]} y2={Pb[1]} {...triLine} />
        <line x1={Pa[0]} y1={Pa[1]} x2={e1[0]} y2={e1[1]} stroke={A} strokeWidth="3" strokeLinecap="round" />
        <line x1={Pb[0]} y1={Pb[1]} x2={e2[0]} y2={e2[1]} stroke={B} strokeWidth="3" strokeLinecap="round" />
        {/* the gap the sticks can't close */}
        <line x1={e1[0]} y1={e1[1]} x2={e2[0]} y2={e2[1]} stroke={MUTED} strokeWidth="1.5" strokeDasharray="3 4" />
        <circle cx={e1[0]} cy={e1[1]} r="3.5" fill="none" stroke={A} strokeWidth="2" />
        <circle cx={e2[0]} cy={e2[1]} r="3.5" fill="none" stroke={B} strokeWidth="2" />
        <text x={160} y={199} textAnchor="middle" fontSize="14" fontWeight="600" fill={INK}>4 + 3 = 7 &lt; 9 — no triangle</text>
        <text x={105} y={142} textAnchor="middle" fontSize="13" fontWeight="700" fill={A}>4</text>
        <text x={228} y={146} textAnchor="middle" fontSize="13" fontWeight="700" fill={B}>3</text>
        <text x={160} y={177} textAnchor="middle" fontSize="13" fontWeight="700" fill={INK}>9</text>
      </Figure>
    );
  }
  // closes: sides 7 (base), 6, 5 — every pair sums to more than the third.
  const Pa: Pt = [90, 160];
  const Pb: Pt = [230, 160];
  const Pc: Pt = [176, 76];
  return (
    <Figure
      width={320}
      height={200}
      label="A triangle with sides 7, 6 and 5. Every pair of sides sums to more than the third, so it closes."
      caption={caption}
      className={className}
    >
      <line x1={Pa[0]} y1={Pa[1]} x2={Pb[0]} y2={Pb[1]} stroke={INK} strokeWidth="3" strokeLinecap="round" />
      <line x1={Pa[0]} y1={Pa[1]} x2={Pc[0]} y2={Pc[1]} stroke={A} strokeWidth="3" strokeLinecap="round" />
      <line x1={Pb[0]} y1={Pb[1]} x2={Pc[0]} y2={Pc[1]} stroke={B} strokeWidth="3" strokeLinecap="round" />
      <text x={160} y={176} textAnchor="middle" fontSize="13" fontWeight="700" fill={INK}>7</text>
      <text x={120} y={114} textAnchor="middle" fontSize="13" fontWeight="700" fill={A}>6</text>
      <text x={210} y={114} textAnchor="middle" fontSize="13" fontWeight="700" fill={B}>5</text>
      <text x={160} y={194} textAnchor="middle" fontSize="14" fontWeight="600" fill={INK}>6 + 5 = 11 &gt; 7 ✓</text>
    </Figure>
  );
}

// ── Isosceles: two equal legs, two equal base angles ─────────────────────────
export function IsoscelesFig({ caption, className }: { caption?: ReactNode; className?: string }) {
  const Pa: Pt = [160, 50]; // apex
  const Pb: Pt = [80, 175];
  const Pc: Pt = [240, 175];
  const r = 26;
  return (
    <Figure
      width={320}
      height={228}
      label="An isosceles triangle. The two equal legs carry matching tick marks, and the two base angles are equal."
      caption={caption}
      className={className}
    >
      {/* the two equal base angles, same colour = congruent */}
      <path d={wedge(Pb, Pc, Pa, r)} fill={B} fillOpacity="0.2" stroke={B} />
      <path d={wedge(Pc, Pa, Pb, r)} fill={B} fillOpacity="0.2" stroke={B} />
      <polygon points={`${Pa} ${Pb} ${Pc}`} {...triLine} />
      {/* matching ticks on the two equal legs */}
      {ticks(Pa, Pb, 1, A)}
      {ticks(Pa, Pc, 1, A)}
      {angLabel(wedgeLabel(Pb, Pc, Pa, r + 14), "∠B", B)}
      {angLabel(wedgeLabel(Pc, Pa, Pb, r + 14), "∠C", B)}
      <text x={Pa[0]} y={Pa[1] - 12} textAnchor="middle" fontSize="13" fontWeight="700" fill={INK}>A</text>
      <text x={Pb[0] - 14} y={Pb[1] + 6} textAnchor="middle" fontSize="13" fontWeight="700" fill={INK}>B</text>
      <text x={Pc[0] + 14} y={Pc[1] + 6} textAnchor="middle" fontSize="13" fontWeight="700" fill={INK}>C</text>
      <text x={160} y={214} textAnchor="middle" fontSize="13" fontWeight="600" fill={INK}>AB = AC ⟹ ∠B = ∠C</text>
    </Figure>
  );
}
