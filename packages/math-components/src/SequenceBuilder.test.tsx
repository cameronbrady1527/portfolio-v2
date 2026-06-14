/** @vitest-environment jsdom */
import { afterEach, beforeAll, describe, expect, it } from "vitest";
import { cleanup, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom/vitest";
import { SequenceBuilder, type SequencePuzzle } from "./SequenceBuilder";

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
});

// Solution: translate ⟨3, 0⟩ THEN rotate 90° about the origin.
// (1,1)(3,1)(1,2) → (4,1)(6,1)(4,2) → (−1,4)(−1,6)(−2,4)
const puzzle: SequencePuzzle = {
  preimage: {
    type: "polygon",
    vertices: [
      { x: 1, y: 1 },
      { x: 3, y: 1 },
      { x: 1, y: 2 },
    ],
    label: "ABC",
  },
  target: {
    type: "polygon",
    vertices: [
      { x: -1, y: 4 },
      { x: -1, y: 6 },
      { x: -2, y: 4 },
    ],
    label: "Target",
  },
  palette: [
    { id: "t", label: "Translate by ⟨3, 0⟩", step: { kind: "translation", by: { dx: 3, dy: 0 } } },
    { id: "r", label: "Rotate 90° about the origin", step: { kind: "rotation", about: { x: 0, y: 0 }, angle: 90 } },
    { id: "f", label: "Reflect over the y-axis", step: { kind: "reflection", over: { kind: "axis", axis: "y" } } },
  ],
};

describe("SequenceBuilder", () => {
  it("solves when the assembled sequence carries the figure onto the target", async () => {
    const user = userEvent.setup();
    render(<SequenceBuilder puzzle={puzzle} />);

    await user.click(screen.getByRole("button", { name: "Add: Translate by ⟨3, 0⟩" }));
    await user.click(screen.getByRole("button", { name: "Add: Rotate 90° about the origin" }));
    await user.click(screen.getByRole("button", { name: "Test my sequence" }));

    const verdict = screen.getByRole("status");
    expect(within(verdict).getByText(/Solved/)).toBeInTheDocument();
    expect(window.localStorage.length).toBe(0);
  });

  it("rejects the right moves in the wrong order; reordering fixes it", async () => {
    const user = userEvent.setup();
    render(<SequenceBuilder puzzle={puzzle} />);

    // Wrong order: rotate first, then translate.
    await user.click(screen.getByRole("button", { name: "Add: Rotate 90° about the origin" }));
    await user.click(screen.getByRole("button", { name: "Add: Translate by ⟨3, 0⟩" }));
    await user.click(screen.getByRole("button", { name: "Test my sequence" }));
    expect(within(screen.getByRole("status")).getByText(/Not yet/)).toBeInTheDocument();

    // Fix by moving the translation up, then retest.
    await user.click(screen.getByRole("button", { name: "Move up: step 2" }));
    await user.click(screen.getByRole("button", { name: "Test my sequence" }));
    expect(within(screen.getByRole("status")).getByText(/Solved/)).toBeInTheDocument();

    expect(window.localStorage.length).toBe(0);
  });
});
