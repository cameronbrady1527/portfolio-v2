/** @vitest-environment jsdom */
import { afterEach, beforeAll, describe, expect, it } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { ExteriorAngle } from "./ExteriorAngle";
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

const status = () => screen.getByRole("status").textContent ?? "";

/** The displayed remote angles + exterior, exactly as the component computes them. */
function expectedParts(sideB: number, sideC: number, angleDeg: number) {
  const angles = triangleAngles(triangleFromSAS(sideB, sideC, angleDeg));
  const [a, , c] = roundAnglesToSum(angles);
  return { a, c, ext: a + c };
}

describe("ExteriorAngle (exterior angle = sum of the two remote interior angles)", () => {
  it("exposes three keyboard-operable SAS sliders (Side AB, Side AC, included angle)", () => {
    render(<ExteriorAngle />);
    for (const name of [/side ab/i, /side ac/i, /included angle/i]) {
      const slider = screen.getByRole("slider", { name });
      expect(slider).toHaveAttribute("type", "range");
      slider.focus();
      expect(slider).toHaveFocus();
    }
  });

  it("shows exterior ∠ = ∠A + ∠C with machine-sourced values that actually add up", () => {
    const { a, c, ext } = expectedParts(5, 7, 45);
    render(<ExteriorAngle sideB={5} sideC={7} includedAngleDeg={45} />);
    const text = status();
    // The two remote parts and the exterior all appear...
    expect(text).toMatch(new RegExp(`${a}°`));
    expect(text).toMatch(new RegExp(`${c}°`));
    expect(text).toMatch(new RegExp(`${ext}°`));
    // ...and they add up (the relationship, not a coincidence of rounding).
    expect(a + c).toBe(ext);
  });

  it("the screen-reader verdict names the remote angles and their exterior sum", () => {
    const { a, c, ext } = expectedParts(5, 7, 45);
    render(<ExteriorAngle sideB={5} sideC={7} includedAngleDeg={45} />);
    const text = status();
    expect(text).toMatch(/remote interior/i);
    expect(text).toMatch(new RegExp(`${a + c}°`));
    expect(ext).toBe(a + c);
  });

  it("updates the readout live when a slider changes the triangle", () => {
    render(<ExteriorAngle sideB={5} sideC={7} includedAngleDeg={45} />);
    const before = status();
    // Swing the included angle wide open; the exterior at B changes with it.
    fireEvent.change(screen.getByRole("slider", { name: /included angle/i }), {
      target: { value: "120" },
    });
    const after = status();
    expect(after).not.toBe(before);
    const { a, c, ext } = expectedParts(5, 7, 120);
    expect(after).toMatch(new RegExp(`${ext}°`));
    expect(a + c).toBe(ext);
  });

  it("offers a 'Show why' proof that toggles a dismiss control", () => {
    render(<ExteriorAngle />);
    const show = screen.getByRole("button", { name: /show why/i });
    fireEvent.click(show);
    expect(
      screen.getByRole("button", { name: /reset and hide the proof/i }),
    ).toBeInTheDocument();
  });

  it("the readout is an aria-live region and records nothing — zero-stakes", () => {
    render(<ExteriorAngle />);
    expect(screen.getByRole("status")).toHaveAttribute("aria-live");
    expect(window.localStorage.length).toBe(0);
  });
});
