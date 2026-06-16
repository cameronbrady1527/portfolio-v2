/** @vitest-environment jsdom */
import { afterEach, beforeAll, describe, expect, it } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom/vitest";
import { TriangleLab } from "./TriangleLab";
import { roundAnglesToSum, triangleAngles, triangleFromSAS } from "./logic";

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

const sumFromReadout = (text: string): number => {
  // "∠A + ∠B + ∠C = 53° + 67° + 60° = 180°" → parse every integer°, drop the
  // final 180 total, sum the three parts.
  const nums = (text.match(/-?\d+(?:\.\d+)?(?=°)/g) ?? []).map(Number);
  return nums.slice(0, 3).reduce((s, n) => s + n, 0);
};

describe("TriangleLab", () => {
  it("reports the angle sum from the pure module and it equals 180°", () => {
    render(<TriangleLab sideB={5} sideC={7} includedAngleDeg={40} />);
    const readout = screen.getByRole("status");
    const text = readout.textContent ?? "";
    expect(text).toContain("180°");
    expect(sumFromReadout(text)).toBe(180);

    // The three reported angles match the pure module (sum-preserving rounding).
    const angles = roundAnglesToSum(triangleAngles(triangleFromSAS(5, 7, 40)));
    for (const a of angles) {
      expect(text).toContain(`${a}°`);
    }
  });

  it("keeps the sum at 180° after a slider reshapes the triangle", async () => {
    const user = userEvent.setup();
    render(<TriangleLab sideB={5} sideC={7} includedAngleDeg={40} />);
    const angleSlider = screen.getByLabelText(/included angle/i);

    // Keyboard-operable: focus and drive with arrow keys.
    angleSlider.focus();
    expect(angleSlider).toHaveFocus();
    await user.keyboard("{ArrowRight}{ArrowRight}{ArrowRight}");

    const text = screen.getByRole("status").textContent ?? "";
    expect(sumFromReadout(text)).toBe(180);
  });

  it("exposes three keyboard-operable sliders for the SAS parameters", () => {
    render(<TriangleLab sideB={5} sideC={7} includedAngleDeg={40} />);
    expect(screen.getByLabelText(/side ab/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/side ac/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/included angle/i)).toBeInTheDocument();
  });

  it("records nothing — zero-stakes", () => {
    render(<TriangleLab sideB={5} sideC={7} includedAngleDeg={40} />);
    expect(window.localStorage.length).toBe(0);
  });
});
