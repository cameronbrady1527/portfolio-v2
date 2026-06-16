/** @vitest-environment jsdom */
import { afterEach, beforeAll, describe, expect, it } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { TransversalAngles } from "./TransversalAngles";

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

describe("TransversalAngles (parallel lines & a transversal)", () => {
  it("exposes a keyboard-operable parallel/non-parallel switch", () => {
    render(<TransversalAngles />);
    const toggle = screen.getByRole("switch", { name: /two lines/i });
    expect(toggle).toBeInTheDocument();
    toggle.focus();
    expect(toggle).toHaveFocus();
  });

  it("exposes a keyboard-operable transversal-angle slider", () => {
    render(<TransversalAngles />);
    const slider = screen.getByRole("slider", { name: /transversal angle/i });
    expect(slider).toHaveAttribute("type", "range");
    slider.focus();
    expect(slider).toHaveFocus();
  });

  it("offers a view selector with all four parallel-line relationships", () => {
    render(<TransversalAngles />);
    expect(screen.getByRole("radiogroup", { name: /angle relationship/i })).toBeInTheDocument();
    for (const name of [/corresponding/i, /alt\. interior/i, /alt\. exterior/i, /co-interior/i]) {
      expect(screen.getByRole("radio", { name })).toBeInTheDocument();
    }
  });

  it("corresponding angles are EQUAL when the lines are parallel — verdict from the module", () => {
    render(<TransversalAngles transversalDir={115} />);
    const text = status();
    expect(text).toMatch(/corresponding/i);
    expect(text).toContain("115°");
    expect(text).toMatch(/equal/i);
    expect(text).not.toMatch(/not equal/i);
    expect(text).toMatch(/because the lines are parallel/i);
  });

  it("breaks the equality live when the lines are toggled non-parallel", () => {
    render(<TransversalAngles transversalDir={115} secondLineDir={22} />);
    fireEvent.click(screen.getByRole("switch", { name: /two lines/i }));
    const text = status();
    // θ2 = 115 − 22 = 93, so corresponding 115° ≠ 93°.
    expect(text).toContain("93°");
    expect(text).toMatch(/not equal/i);
    expect(text).toMatch(/not parallel/i);
  });

  it("co-interior angles are SUPPLEMENTARY (sum 180°) when parallel", () => {
    render(<TransversalAngles transversalDir={115} />);
    fireEvent.click(screen.getByRole("radio", { name: /co-interior/i }));
    const text = status();
    expect(text).toMatch(/co-interior/i);
    expect(text).toContain("180°");
    expect(text).toMatch(/supplementary/i);
    expect(text).not.toMatch(/not supplementary/i);
  });

  it("the readout is an aria-live region; records nothing — zero-stakes", () => {
    render(<TransversalAngles />);
    expect(screen.getByRole("status")).toHaveAttribute("aria-live");
    expect(window.localStorage.length).toBe(0);
  });
});
