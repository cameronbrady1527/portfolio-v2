/** @vitest-environment jsdom */
import { afterEach, beforeAll, describe, expect, it } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom/vitest";
import { SymmetryExplorer } from "./SymmetryExplorer";

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

const rectangle = {
  type: "polygon",
  vertices: [
    { x: 0, y: 0 },
    { x: 4, y: 0 },
    { x: 4, y: 2 },
    { x: 0, y: 2 },
  ],
  label: "RECT",
} as const;

describe("SymmetryExplorer", () => {
  it("verdicts proposals against the pure check and counts unique finds", async () => {
    const user = userEvent.setup();
    render(<SymmetryExplorer polygon={rectangle} />);

    // A rectangle is NOT carried onto itself by 90°…
    await user.click(screen.getByRole("button", { name: "Rotate 90°" }));
    const status = () => screen.getByRole("status").textContent ?? "";
    expect(status()).toContain("Not a symmetry");
    expect(status()).toContain("Found 0 of 3");

    // …but 180° works.
    await user.click(screen.getByRole("button", { name: "Rotate 180°" }));
    expect(status()).toContain("carries the shape onto itself");
    expect(status()).toContain("Found 1 of 3");

    // Re-finding the same symmetry never double-counts.
    await user.click(screen.getByRole("button", { name: "Rotate 180°" }));
    expect(status()).toContain("Found 1 of 3");

    // The two midpoint axes complete the set.
    await user.click(screen.getByRole("button", { name: "Reflect across the 0° axis" }));
    await user.click(screen.getByRole("button", { name: "Reflect across the 90° axis" }));
    expect(status()).toContain("Found 3 of 3");
    expect(status()).toContain("all of them");

    expect(window.localStorage.length).toBe(0);
  });
});
