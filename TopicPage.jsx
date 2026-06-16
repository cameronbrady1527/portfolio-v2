import React, { useState, useMemo } from "react";
import { Lightbulb, Check, X, RotateCcw, ChevronDown, GraduationCap } from "lucide-react";

/*
  Prototype: a single student-facing topic page.
  Subject: Algebra I  ›  Quadratics  ›  Transformations of Parabolas
  Three pillars: Concept explainer · Interactive visualization · Practice set.
  On the real site this is the output of one MDX file + a small shared component library.
*/

const FONT_IMPORT = `
@import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600;9..144,700&family=Spline+Sans:wght@400;500;600&family=Spline+Sans+Mono:wght@400;500;600&display=swap');
`;

const COLORS = {
  bg: "#f7f5ef",
  ink: "#16231c",
  inkSoft: "#43564b",
  accent: "#1f8a5b",
  accentDeep: "#0f5e3c",
  line: "#d8d2c2",
  card: "#fffdf8",
};

/* ------------------------------- Visualization ------------------------------ */
function ParabolaExplorer() {
  const [a, setA] = useState(1);
  const [h, setH] = useState(0);
  const [k, setK] = useState(0);

  const W = 560, H = 460;
  const xMin = -9, xMax = 9, yMin = -7, yMax = 11;

  const toScreen = (x, y) => [
    ((x - xMin) / (xMax - xMin)) * W,
    H - ((y - yMin) / (yMax - yMin)) * H,
  ];

  const path = useMemo(() => {
    const pts = [];
    for (let x = xMin; x <= xMax; x += 0.05) {
      const y = a * (x - h) * (x - h) + k;
      if (y < yMin - 5 || y > yMax + 5) { pts.push(null); continue; }
      pts.push(toScreen(x, y));
    }
    let d = "", pen = false;
    for (const p of pts) {
      if (!p) { pen = false; continue; }
      d += `${pen ? "L" : "M"}${p[0].toFixed(1)} ${p[1].toFixed(1)} `;
      pen = true;
    }
    return d;
  }, [a, h, k]);

  const [vx, vy] = toScreen(h, k);
  const gridLines = [];
  for (let x = xMin; x <= xMax; x++) {
    const [sx] = toScreen(x, 0);
    gridLines.push(<line key={`v${x}`} x1={sx} y1={0} x2={sx} y2={H} stroke={x === 0 ? COLORS.ink : COLORS.line} strokeWidth={x === 0 ? 1.6 : 1} />);
  }
  for (let y = yMin; y <= yMax; y++) {
    const [, sy] = toScreen(0, y);
    gridLines.push(<line key={`hl${y}`} x1={0} y1={sy} x2={W} y2={sy} stroke={y === 0 ? COLORS.ink : COLORS.line} strokeWidth={y === 0 ? 1.6 : 1} />);
  }

  const fmt = (n) => (Number.isInteger(n) ? n : n.toFixed(1));
  const sign = (n) => (n >= 0 ? `− ${fmt(Math.abs(n))}` : `+ ${fmt(Math.abs(n))}`);
  const eq = `y = ${fmt(a)}(x ${h === 0 ? "" : sign(h)})² ${k >= 0 ? (k === 0 ? "" : `+ ${fmt(k)}`) : `− ${fmt(Math.abs(k))}`}`;

  const Slider = ({ label, value, set, min, max, step, desc }) => (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 4 }}>
        <span style={{ fontFamily: "'Spline Sans Mono', monospace", fontWeight: 600, color: COLORS.accentDeep }}>{label} = {fmt(value)}</span>
        <span style={{ fontSize: 12, color: COLORS.inkSoft }}>{desc}</span>
      </div>
      <input type="range" min={min} max={max} step={step} value={value} onChange={(e) => set(parseFloat(e.target.value))}
        style={{ width: "100%", accentColor: COLORS.accent }} />
    </div>
  );

  return (
    <div style={{ background: COLORS.card, border: `1px solid ${COLORS.line}`, borderRadius: 16, padding: 20, boxShadow: "0 1px 0 rgba(0,0,0,0.02), 0 18px 40px -28px rgba(15,94,60,0.45)" }}>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 24, alignItems: "stretch" }}>
        <div style={{ flex: "1 1 320px", minWidth: 280 }}>
          <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", height: "auto", borderRadius: 10, background: "#fffef9", border: `1px solid ${COLORS.line}` }}>
            {gridLines}
            <path d={path} fill="none" stroke={COLORS.accent} strokeWidth={3.5} strokeLinecap="round" />
            <circle cx={vx} cy={vy} r={6} fill={COLORS.accentDeep} stroke="#fffef9" strokeWidth={2} />
            <line x1={vx} y1={0} x2={vx} y2={H} stroke={COLORS.accentDeep} strokeWidth={1} strokeDasharray="4 4" opacity={0.5} />
          </svg>
        </div>
        <div style={{ flex: "1 1 220px", minWidth: 220, display: "flex", flexDirection: "column", gap: 18 }}>
          <div style={{ fontFamily: "'Spline Sans Mono', monospace", fontSize: 19, fontWeight: 600, color: COLORS.ink, background: "#eef4ee", padding: "12px 14px", borderRadius: 10, textAlign: "center" }}>
            {eq}
          </div>
          <Slider label="a" value={a} set={setA} min={-3} max={3} step={0.1} desc="stretch / flip" />
          <Slider label="h" value={h} set={setH} min={-6} max={6} step={1} desc="left / right" />
          <Slider label="k" value={k} set={setK} min={-6} max={6} step={1} desc="up / down" />
          <div style={{ fontSize: 13.5, color: COLORS.inkSoft, lineHeight: 1.6, borderTop: `1px solid ${COLORS.line}`, paddingTop: 12 }}>
            Vertex at <strong style={{ color: COLORS.ink }}>({fmt(h)}, {fmt(k)})</strong>. Drag <em>a</em> past zero to watch it flip and open downward.
          </div>
        </div>
      </div>
    </div>
  );
}

/* -------------------------------- Practice ---------------------------------- */
const QUESTIONS = [
  {
    q: "Starting from y = x², the graph of y = (x − 3)² is shifted…",
    options: ["right 3", "left 3", "up 3", "down 3"],
    answer: 0,
    hint: "Inside the parentheses moves the graph horizontally — and it moves the opposite way from the sign you see.",
  },
  {
    q: "Where is the vertex of  y = 2(x + 1)² − 4 ?",
    options: ["(1, −4)", "(−1, −4)", "(−1, 4)", "(1, 4)"],
    answer: 1,
    hint: "Vertex form is a(x − h)² + k with vertex (h, k). Notice (x + 1) means h is −1.",
  },
  {
    q: "Which value of a makes the parabola open downward AND narrower than y = x²?",
    options: ["a = −2", "a = −0.5", "a = 0.5", "a = 2"],
    answer: 0,
    hint: "Negative a flips it down; |a| greater than 1 makes it narrower.",
  },
];

function PracticeSet() {
  const [picks, setPicks] = useState({});
  const [revealed, setRevealed] = useState({});
  const [hints, setHints] = useState({});

  const score = QUESTIONS.reduce((s, q, i) => s + (revealed[i] && picks[i] === q.answer ? 1 : 0), 0);
  const allDone = QUESTIONS.every((_, i) => revealed[i]);

  const reset = () => { setPicks({}); setRevealed({}); setHints({}); };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
      {QUESTIONS.map((q, i) => {
        const picked = picks[i];
        const isRevealed = revealed[i];
        return (
          <div key={i} style={{ background: COLORS.card, border: `1px solid ${COLORS.line}`, borderRadius: 14, padding: 18 }}>
            <div style={{ display: "flex", gap: 10, marginBottom: 12 }}>
              <span style={{ fontFamily: "'Spline Sans Mono', monospace", fontWeight: 600, color: COLORS.accent }}>{String(i + 1).padStart(2, "0")}</span>
              <span style={{ fontWeight: 500, fontSize: 16 }}>{q.q}</span>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 12 }}>
              {q.options.map((opt, j) => {
                const correct = isRevealed && j === q.answer;
                const wrongPick = isRevealed && j === picked && j !== q.answer;
                const selected = picked === j && !isRevealed;
                return (
                  <button key={j} disabled={isRevealed}
                    onClick={() => setPicks({ ...picks, [i]: j })}
                    style={{
                      textAlign: "left", padding: "10px 12px", borderRadius: 9, cursor: isRevealed ? "default" : "pointer",
                      fontFamily: "'Spline Sans Mono', monospace", fontSize: 14.5,
                      border: `1.5px solid ${correct ? COLORS.accent : wrongPick ? "#c0432f" : selected ? COLORS.accentDeep : COLORS.line}`,
                      background: correct ? "#e6f2ea" : wrongPick ? "#f8e7e3" : selected ? "#eef4ee" : "#fffef9",
                      color: COLORS.ink, display: "flex", alignItems: "center", justifyContent: "space-between",
                    }}>
                    {opt}
                    {correct && <Check size={16} color={COLORS.accent} />}
                    {wrongPick && <X size={16} color="#c0432f" />}
                  </button>
                );
              })}
            </div>
            <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
              <button onClick={() => setRevealed({ ...revealed, [i]: true })} disabled={picked === undefined || isRevealed}
                style={{ padding: "7px 16px", borderRadius: 8, border: "none", cursor: picked === undefined || isRevealed ? "default" : "pointer",
                  background: picked === undefined || isRevealed ? "#d8d2c2" : COLORS.accent, color: "#fff", fontWeight: 600, fontSize: 14 }}>
                Check
              </button>
              <button onClick={() => setHints({ ...hints, [i]: !hints[i] })}
                style={{ padding: "7px 12px", borderRadius: 8, border: `1px solid ${COLORS.line}`, background: "transparent", cursor: "pointer",
                  color: COLORS.inkSoft, fontSize: 14, display: "flex", alignItems: "center", gap: 6 }}>
                <Lightbulb size={15} /> Hint
              </button>
              {isRevealed && (
                <span style={{ fontSize: 14, fontWeight: 600, color: picked === q.answer ? COLORS.accent : "#c0432f" }}>
                  {picked === q.answer ? "Nice — that's it." : "Not quite — check the hint."}
                </span>
              )}
            </div>
            {hints[i] && (
              <div style={{ marginTop: 10, fontSize: 14, color: COLORS.inkSoft, background: "#fdf8e9", border: "1px solid #efe3bf", borderRadius: 8, padding: "10px 12px", lineHeight: 1.55 }}>
                {q.hint}
              </div>
            )}
          </div>
        );
      })}
      {allDone && (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: "#eef4ee", borderRadius: 12, padding: "14px 18px" }}>
          <span style={{ fontFamily: "'Fraunces', serif", fontSize: 20, fontWeight: 600, color: COLORS.accentDeep }}>
            You scored {score} / {QUESTIONS.length}
          </span>
          <button onClick={reset} style={{ display: "flex", alignItems: "center", gap: 6, background: "transparent", border: `1px solid ${COLORS.accentDeep}`, color: COLORS.accentDeep, padding: "7px 14px", borderRadius: 8, cursor: "pointer", fontWeight: 600 }}>
            <RotateCcw size={15} /> Try again
          </button>
        </div>
      )}
    </div>
  );
}

/* --------------------------------- Page ------------------------------------ */
export default function TopicPage() {
  const [teacher, setTeacher] = useState(false);
  return (
    <div style={{ background: COLORS.bg, color: COLORS.ink, minHeight: "100vh", fontFamily: "'Spline Sans', sans-serif",
      backgroundImage: `linear-gradient(${COLORS.line} 1px, transparent 1px), linear-gradient(90deg, ${COLORS.line} 1px, transparent 1px)`,
      backgroundSize: "26px 26px", backgroundPosition: "center" }}>
      <style>{FONT_IMPORT}</style>
      <div style={{ maxWidth: 760, margin: "0 auto", padding: "48px 22px 80px" }}>

        <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13.5, color: COLORS.inkSoft, fontFamily: "'Spline Sans Mono', monospace", marginBottom: 18 }}>
          <span>Algebra I</span><span style={{ opacity: 0.5 }}>/</span><span>Quadratics</span><span style={{ opacity: 0.5 }}>/</span><span style={{ color: COLORS.accentDeep, fontWeight: 600 }}>Transformations of Parabolas</span>
        </div>

        <h1 style={{ fontFamily: "'Fraunces', serif", fontWeight: 600, fontSize: 44, lineHeight: 1.05, margin: "0 0 14px", letterSpacing: "-0.01em" }}>
          Transformations of Parabolas
        </h1>
        <p style={{ fontSize: 18, lineHeight: 1.6, color: COLORS.inkSoft, maxWidth: 620, margin: "0 0 8px" }}>
          Every parabola you'll meet this year is just <strong style={{ color: COLORS.ink }}>y = x²</strong> that's been slid around and stretched. The <em>vertex form</em> below has one job: it shows you exactly how.
        </p>

        <div style={{ fontFamily: "'Spline Sans Mono', monospace", fontSize: 22, fontWeight: 600, color: COLORS.accentDeep, margin: "26px 0", textAlign: "center" }}>
          y = a(x − h)² + k
        </div>

        <p style={{ fontSize: 16.5, lineHeight: 1.7, color: COLORS.inkSoft, margin: "0 0 30px" }}>
          <strong style={{ color: COLORS.ink }}>a</strong> stretches the curve and, when negative, flips it upside down. <strong style={{ color: COLORS.ink }}>h</strong> slides it left or right. <strong style={{ color: COLORS.ink }}>k</strong> slides it up or down. Move the sliders and watch the vertex — the point (h, k) — go exactly where the numbers say.
        </p>

        <ParabolaExplorer />

        <h2 style={{ fontFamily: "'Fraunces', serif", fontWeight: 600, fontSize: 28, margin: "52px 0 18px" }}>Check your understanding</h2>
        <PracticeSet />

        <button onClick={() => setTeacher(!teacher)}
          style={{ marginTop: 44, width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between",
            background: "transparent", border: `1px dashed ${COLORS.inkSoft}`, borderRadius: 12, padding: "14px 18px", cursor: "pointer", color: COLORS.inkSoft }}>
          <span style={{ display: "flex", alignItems: "center", gap: 9, fontWeight: 600, fontSize: 15 }}>
            <GraduationCap size={18} /> For teachers — standards, pacing & common misconceptions
          </span>
          <ChevronDown size={18} style={{ transform: teacher ? "rotate(180deg)" : "none", transition: "transform 0.2s" }} />
        </button>
        {teacher && (
          <div style={{ background: COLORS.card, border: `1px solid ${COLORS.line}`, borderRadius: 12, padding: 20, marginTop: 10, fontSize: 15, lineHeight: 1.7, color: COLORS.inkSoft }}>
            <strong style={{ color: COLORS.ink }}>Standard:</strong> NY-F.BF.3 (effects of transformations on graphs).<br />
            <strong style={{ color: COLORS.ink }}>Common misconception:</strong> students expect (x − 3) to shift <em>left</em>. The explorer is designed to confront that directly — have them predict before dragging h.<br />
            <strong style={{ color: COLORS.ink }}>Suggested use:</strong> 5-min warm-up projected on the board, then the practice set as an exit ticket.
          </div>
        )}

        <div style={{ marginTop: 50, paddingTop: 22, borderTop: `1px solid ${COLORS.line}`, fontFamily: "'Spline Sans Mono', monospace", fontSize: 13, color: COLORS.inkSoft, textAlign: "center" }}>
          resources.cameronbrady.dev
        </div>
      </div>
    </div>
  );
}
