/** @vitest-environment jsdom */
import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { ProofBuilder } from "./ProofBuilder";
import { buildIntersectingLines } from "./internal/proof-figure";
import {
  generateProof,
  mulberry32,
  REASON_LABELS,
  type ProofSpec,
  type ReasonId,
} from "./logic";

beforeAll(() => {
  if (!("ResizeObserver" in globalThis)) {
    class RO {
      observe() {}
      unobserve() {}
      disconnect() {}
    }
    (globalThis as unknown as { ResizeObserver: typeof RO }).ResizeObserver = RO;
  }
});

afterEach(() => {
  cleanup();
  window.localStorage.clear();
  vi.restoreAllMocks();
  delete (window as unknown as { matchMedia?: unknown }).matchMedia;
});

const setMatchMedia = (reduce: boolean) => {
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    configurable: true,
    value: (query: string) => ({
      matches: reduce && query.includes("reduce"),
      media: query,
      addEventListener: () => {},
      removeEventListener: () => {},
      addListener: () => {},
      removeListener: () => {},
      dispatchEvent: () => false,
    }),
  });
};

const SEED = 20250701; // must match ProofBuilder's DEFAULT_SEED
const spec = (): ProofSpec => generateProof("vertical-angles", 1, mulberry32(SEED));
const specL2 = (): ProofSpec => generateProof("vertical-angles", 2, mulberry32(SEED));
const specL3 = (): ProofSpec => generateProof("vertical-angles", 3, mulberry32(SEED));
const specL4 = (): ProofSpec => generateProof("vertical-angles", 4, mulberry32(SEED));

const reasonBank = () => screen.getByRole("group", { name: /reason tiles/i });
const statementBank = () => screen.getByRole("group", { name: /statement tiles/i });
const clickReason = (r: ReasonId) =>
  fireEvent.click(within(reasonBank()).getByRole("button", { name: REASON_LABELS[r] }));
const clickStatement = (text: string) =>
  fireEvent.click(within(statementBank()).getByRole("button", { name: text }));
const attr = (c: HTMLElement, name: string) =>
  c.querySelector(`[${name}]`)?.getAttribute(name);
const seatedCount = (c: HTMLElement) => attr(c, "data-cbmc-seated-count");
const highlightAttr = (c: HTMLElement) => attr(c, "data-cbmc-highlight");
const isComplete = (c: HTMLElement) => attr(c, "data-cbmc-proof-complete");

describe("ProofBuilder — Level 1 (reason-only)", () => {
  it("renders a two-column table, a Given/Prove header, and a reason bank", () => {
    render(<ProofBuilder />);
    expect(screen.getByRole("columnheader", { name: /statements/i })).toBeInTheDocument();
    expect(screen.getByRole("columnheader", { name: /reasons/i })).toBeInTheDocument();
    expect(screen.getByText(/Given:/)).toBeInTheDocument();
    expect(screen.getByText(/Prove:/)).toBeInTheDocument();
    expect(reasonBank()).toBeInTheDocument();
  });

  it("a correct reason seats the active row (count advances)", () => {
    const { container } = render(<ProofBuilder />);
    const s = spec();
    expect(seatedCount(container)).toBe("0");
    // Row 1 is the Given; its only reason is "given".
    clickReason(s.statements[0].reasons[0]);
    expect(seatedCount(container)).toBe("1");
  });

  it("a wrong reason nudges and does NOT seat", () => {
    const { container } = render(<ProofBuilder />);
    const s = spec();
    // The given row (reasons: ["given"]) with a plausible-but-wrong reason.
    const wrong: ReasonId = "linear-pair-supp";
    expect(s.statements[0].reasons).not.toContain(wrong);
    clickReason(wrong);
    expect(seatedCount(container)).toBe("0");
    expect(screen.getByRole("status").textContent ?? "").toMatch(/doesn't justify/i);
  });

  it("filling every row in order completes the proof", () => {
    const { container } = render(<ProofBuilder />);
    const s = spec();
    for (const st of s.statements) clickReason(st.reasons[0]);
    expect(isComplete(container)).toBe("true");
    expect(screen.getByRole("status").textContent ?? "").toMatch(/built the whole proof/i);
  });
});

describe("ProofBuilder — Level 2 (Parsons order + pair)", () => {
  const placeStep = (spc: ProofSpec, id: string) => {
    const st = spc.statements.find((s) => s.id === id)!;
    fireEvent.click(within(statementBank()).getByRole("button", { name: st.text }));
    fireEvent.click(within(reasonBank()).getByRole("button", { name: REASON_LABELS[st.reasons[0]] }));
  };

  it("shows shuffled statement AND reason banks", () => {
    render(<ProofBuilder level={2} />);
    expect(statementBank()).toBeInTheDocument();
    expect(reasonBank()).toBeInTheDocument();
  });

  it("accepts a valid ALTERNATIVE ordering (s2 before s1) and completes", () => {
    const { container } = render(<ProofBuilder level={2} />);
    const s = specL2();
    // g, then s2 before s1 (both depend only on g), then the rest.
    for (const id of ["g", "s2", "s1", "s3", "s4", "s5"]) placeStep(s, id);
    expect(isComplete(container)).toBe("true");
  });

  it("nudges a premature statement (placed before its supports) without seating", () => {
    const { container } = render(<ProofBuilder level={2} />);
    const s = specL2();
    // s3 depends on s1 AND s2 — placing it first must be refused.
    placeStep(s, "s3");
    expect(seatedCount(container)).toBe("0");
    expect(screen.getByRole("status").textContent ?? "").toMatch(/not yet/i);
  });
});

describe("ProofBuilder — coordinated figure highlighting", () => {
  it("selecting a proof row highlights the angles it cites", () => {
    const { container } = render(<ProofBuilder />);
    const s = spec();
    const goal = s.statements.find((st) => st.goal)!; // e.g. "∠a ≅ ∠c"
    const nums = (goal.text.match(/∠\s*(\d+)/g) ?? []).map((t) => t.replace(/\D/g, ""));
    fireEvent.click(screen.getByRole("button", { name: new RegExp(`Statement.*${goal.text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}`) }));
    const hl = highlightAttr(container) ?? "";
    for (const n of nums) expect(hl.split(",")).toContain(n);
  });

  it("the figure builder renders four labelled, correctly-related regions", () => {
    const s = spec();
    if (!s.figure || s.figure.kind !== "intersecting-lines") throw new Error("no figure");
    const geom = buildIntersectingLines(s.figure);
    // Four regions keyed by the spec's angle numbers, and two crossing lines.
    expect(geom.regions.map((r) => r.label)).toEqual(s.figure.rayLabels);
    expect(geom.lines).toHaveLength(2);
    // Opposite regions are the VERTICAL pair — equal spans (vertical angles are
    // congruent), and they are exactly the two angles the proof proves equal.
    const span = (i: number) => geom.regions[i].a1 - geom.regions[i].a0;
    expect(span(0)).toBeCloseTo(span(2), 6);
    expect(span(1)).toBeCloseTo(span(3), 6);
    // Adjacent regions are a linear pair — their spans sum to a straight angle.
    expect(span(0) + span(1)).toBeCloseTo(180, 6);
  });
});

describe("ProofBuilder — Level 3 (distractors)", () => {
  it("rejects a placed distractor without seating and nudges", () => {
    const { container } = render(<ProofBuilder level={3} />);
    const s = specL3();
    const d = s.distractors![0]; // a plausible-but-wrong statement tile
    expect(d).toBeTruthy();
    clickStatement(d.text);
    clickReason(d.reason!);
    expect(seatedCount(container)).toBe("0");
    expect(screen.getByRole("status").textContent ?? "").toMatch(/isn't part of this proof/i);
  });

  it("keeps the coordinated highlight ON at Level 3", () => {
    const { container } = render(<ProofBuilder level={3} />);
    expect(attr(container, "data-cbmc-level")).toBe("3");
    // Picking a statement tile lights up the angles it cites (highlight ON).
    const s = specL3();
    const cited = s.statements[1]; // "m∠a + m∠shared = 180°" — cites two angles
    clickStatement(cited.text);
    expect(highlightAttr(container) ?? "").not.toBe("");
  });
});

describe("ProofBuilder — Level 4 (mastery: holistic Submit)", () => {
  const placeL4 = (spc: ProofSpec, id: string, reason?: ReasonId) => {
    const st = spc.statements.find((s) => s.id === id)!;
    clickStatement(st.text);
    clickReason(reason ?? st.reasons[0]);
  };

  it("turns the coordinated figure highlight OFF", () => {
    const { container } = render(<ProofBuilder level={4} />);
    expect(attr(container, "data-cbmc-level")).toBe("4");
    // No clickable angle regions at Level 4.
    expect(screen.queryByRole("button", { name: /Angle \d/i })).toBeNull();
    // Picking a statement does not light up the figure.
    const s = specL4();
    clickStatement(s.statements[0].text);
    expect(highlightAttr(container)).toBe("");
  });

  it("seats every row locally, then Submit flags the wrong row and retry recovers", () => {
    const { container } = render(<ProofBuilder level={4} />);
    const s = specL4();
    // Assemble the whole proof, but give the goal row a wrong reason.
    placeL4(s, "g");
    placeL4(s, "s1");
    placeL4(s, "s2");
    placeL4(s, "s3");
    placeL4(s, "s4");
    placeL4(s, "s5", "given"); // wrong reason for the goal row
    // All six slots are filled but nothing is graded yet.
    expect(seatedCount(container)).toBe("6");
    expect(isComplete(container)).toBe("false");
    // Submit → one whole-DAG verdict; the goal row (index 5) is flagged.
    fireEvent.click(screen.getByRole("button", { name: /submit proof/i }));
    expect(attr(container, "data-cbmc-submitted")).toBe("true");
    expect(attr(container, "data-cbmc-wrong-rows")).toBe("5");
    expect(isComplete(container)).toBe("false");
    // Retry keeps the sound prefix and clears from the first wrong row.
    fireEvent.click(screen.getByRole("button", { name: /try again/i }));
    expect(seatedCount(container)).toBe("5");
    // Re-place the goal row correctly and submit → clean pass → comfortable.
    placeL4(s, "s5");
    fireEvent.click(screen.getByRole("button", { name: /submit proof/i }));
    expect(isComplete(container)).toBe("true");
    expect(attr(container, "data-cbmc-comfortable")).toBe("true");
  });

  it("a clean Submit sets comfortable and emits it to the host", () => {
    const onProgressChange = vi.fn();
    const { container } = render(
      <ProofBuilder level={4} onProgressChange={onProgressChange} />,
    );
    const s = specL4();
    for (const id of ["g", "s1", "s2", "s3", "s4", "s5"]) placeL4(s, id);
    fireEvent.click(screen.getByRole("button", { name: /submit proof/i }));
    expect(isComplete(container)).toBe("true");
    expect(onProgressChange).toHaveBeenCalledWith(
      expect.objectContaining({ comfortable: true }),
    );
  });
});

describe("ProofBuilder — adaptive fade + persistence", () => {
  it("advances the level after the required clean completions", () => {
    const { container } = render(<ProofBuilder />); // starts at Level 1
    const reasonSeq = spec().statements.map((s) => s.reasons[0]); // seed-invariant
    const complete = () => reasonSeq.forEach((r) => clickReason(r));

    complete(); // proof #1
    expect(attr(container, "data-cbmc-level")).toBe("1");
    expect(attr(container, "data-cbmc-completions")).toBe("1");

    fireEvent.click(screen.getByRole("button", { name: /next proof/i }));
    complete(); // proof #2 — same reason ids regardless of seed
    expect(attr(container, "data-cbmc-completions")).toBe("2");
    expect(attr(container, "data-cbmc-level")).toBe("1");

    // The next proof fades one level (two clean completions banked).
    fireEvent.click(screen.getByRole("button", { name: /next proof/i }));
    expect(attr(container, "data-cbmc-level")).toBe("2");
  });

  it("hydrates a comfortable flag across a remount and surfaces it", () => {
    const first = render(<ProofBuilder />);
    expect(attr(first.container, "data-cbmc-comfortable")).toBe("false");
    first.unmount();
    // Remount as if hydrated from a persisted store.
    const { container } = render(<ProofBuilder level={4} initialComfortable />);
    expect(attr(container, "data-cbmc-comfortable")).toBe("true");
    expect(screen.getByText(/comfortable with this proof/i)).toBeInTheDocument();
  });

  it("Start over clears fade state and notifies the host", () => {
    const onStartOver = vi.fn();
    const { container } = render(
      <ProofBuilder level={4} initialComfortable onStartOver={onStartOver} />,
    );
    expect(attr(container, "data-cbmc-comfortable")).toBe("true");
    fireEvent.click(screen.getByRole("button", { name: /start over/i }));
    expect(attr(container, "data-cbmc-comfortable")).toBe("false");
    expect(attr(container, "data-cbmc-level")).toBe("4"); // back to starting level
    expect(onStartOver).toHaveBeenCalled();
  });
});

describe("ProofBuilder — a11y / robustness", () => {
  it("reason tiles are real buttons (keyboard/tap operable, no drag needed)", () => {
    render(<ProofBuilder />);
    const tiles = within(reasonBank()).getAllByRole("button");
    expect(tiles.length).toBeGreaterThan(0);
    tiles[0].focus();
    expect(tiles[0]).toHaveFocus();
  });

  it("works under prefers-reduced-motion: wrong still refused, correct still seats", () => {
    setMatchMedia(true);
    const { container } = render(<ProofBuilder />);
    const s = spec();
    clickReason("linear-pair-supp"); // wrong for the Given row
    expect(seatedCount(container)).toBe("0");
    clickReason(s.statements[0].reasons[0]); // correct
    expect(seatedCount(container)).toBe("1");
  });

  it("Start over clears the proof", () => {
    const { container } = render(<ProofBuilder />);
    const s = spec();
    clickReason(s.statements[0].reasons[0]);
    expect(seatedCount(container)).toBe("1");
    fireEvent.click(screen.getByRole("button", { name: /start over/i }));
    expect(seatedCount(container)).toBe("0");
  });

  it("records nothing — zero-stakes", () => {
    render(<ProofBuilder />);
    expect(window.localStorage.length).toBe(0);
  });
});

// --- triangle-pair figure (congruence-cpctc) ---
import { buildTrianglePair } from "./internal/proof-figure";
import { congruenceCheck } from "./logic";

const lettersAttr = (c: HTMLElement) =>
  c.querySelector("[data-cbmc-highlight-letters]")?.getAttribute("data-cbmc-highlight-letters");

describe("ProofBuilder — triangle-pair figure (congruence-cpctc)", () => {
  it("renders the congruence-cpctc proof with a Given/Prove header", () => {
    render(<ProofBuilder familyId="congruence-cpctc" seed={7} />);
    expect(screen.getByText(/Given:/)).toBeInTheDocument();
    // The proof is about triangles (a △…≅△… congruence row is present).
    expect(screen.getByRole("button", { name: /△/ })).toBeInTheDocument();
  });

  it("focusing a proof row highlights the vertex letters it cites", () => {
    const { container } = render(<ProofBuilder familyId="congruence-cpctc" seed={7} />);
    const s = generateProof("congruence-cpctc", 1, mulberry32(7));
    const goal = s.statements.find((st) => st.goal)!; // e.g. "∠C ≅ ∠F"
    const letters = Array.from(new Set(goal.text.match(/[A-Z]/g) ?? []));
    fireEvent.click(
      screen.getByRole("button", {
        name: new RegExp(`Statement.*${goal.text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}`),
      }),
    );
    const hl = (lettersAttr(container) ?? "").split(",");
    for (const l of letters) expect(hl).toContain(l);
  });

  it("builds two genuinely congruent triangles from the spec figure", () => {
    const s = generateProof("congruence-cpctc", 3, mulberry32(7));
    if (s.figure?.kind !== "triangle-pair") throw new Error("expected triangle-pair figure");
    const geom = buildTrianglePair(s.figure);
    expect(congruenceCheck(geom.triangles[0].verts, geom.triangles[1].verts).congruent).toBe(true);
  });
});
