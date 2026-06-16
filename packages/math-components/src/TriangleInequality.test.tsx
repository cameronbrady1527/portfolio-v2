/** @vitest-environment jsdom */
import { afterEach, beforeAll, describe, expect, it } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { TriangleInequality } from "./TriangleInequality";

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

describe("TriangleInequality (do three lengths close into a triangle?)", () => {
  it("exposes three keyboard-operable side-length sliders (a, b, c)", () => {
    render(<TriangleInequality />);
    for (const name of [/side a/i, /side b/i, /side c/i]) {
      const slider = screen.getByRole("slider", { name });
      expect(slider).toHaveAttribute("type", "range");
      slider.focus();
      expect(slider).toHaveFocus();
    }
  });

  it("reports a triangle when the two shorter sides exceed the longest — verdict from the module", () => {
    render(<TriangleInequality a={3} b={4} c={5} />);
    const text = status();
    // 3 + 4 = 7 > 5
    expect(text).toMatch(/7\b/);
    expect(text).toMatch(/triangle/i);
    expect(text).not.toMatch(/no triangle|cannot/i);
  });

  it("reports NO triangle when the longest side is at least the sum of the others", () => {
    render(<TriangleInequality a={2} b={3} c={9} />);
    const text = status();
    // 2 + 3 = 5, not greater than 9; short by 4.
    expect(text).toMatch(/5\b/);
    expect(text).toMatch(/cannot|no triangle/i);
    expect(text).toMatch(/4\b/); // the shortfall
  });

  it("flips the verdict live when a slider makes the sticks reach", () => {
    render(<TriangleInequality a={2} b={3} c={9} />);
    expect(status()).toMatch(/cannot|no triangle/i);
    // Grow side a until it closes: a=7,b=3,c=9 → 7+3=10 > 9.
    fireEvent.change(screen.getByRole("slider", { name: /side a/i }), {
      target: { value: "7" },
    });
    const text = status();
    expect(text).toMatch(/triangle/i);
    expect(text).not.toMatch(/no triangle|cannot/i);
  });

  it("offers a fold demonstration that toggles a dismiss control", () => {
    render(<TriangleInequality a={3} b={4} c={5} />);
    const fold = screen.getByRole("button", { name: /fold the sides up/i });
    fireEvent.click(fold);
    expect(
      screen.getByRole("button", { name: /reset and hide the fold/i }),
    ).toBeInTheDocument();
  });

  it("the readout is an aria-live region and records nothing — zero-stakes", () => {
    render(<TriangleInequality />);
    expect(screen.getByRole("status")).toHaveAttribute("aria-live");
    expect(window.localStorage.length).toBe(0);
  });
});
