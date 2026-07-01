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

const reasonBank = () => screen.getByRole("group", { name: /reason tiles/i });
const statementBank = () => screen.getByRole("group", { name: /statement tiles/i });
const clickReason = (r: ReasonId) =>
  fireEvent.click(within(reasonBank()).getByRole("button", { name: REASON_LABELS[r] }));
const seatedCount = (c: HTMLElement) =>
  c.querySelector("[data-cbmc-seated-count]")?.getAttribute("data-cbmc-seated-count");
const highlightAttr = (c: HTMLElement) =>
  c.querySelector("[data-cbmc-highlight]")?.getAttribute("data-cbmc-highlight");
const isComplete = (c: HTMLElement) =>
  c.querySelector("[data-cbmc-proof-complete]")?.getAttribute("data-cbmc-proof-complete");

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
