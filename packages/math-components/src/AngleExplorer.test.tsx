/** @vitest-environment jsdom */
import { afterEach, beforeAll, describe, expect, it } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { AngleExplorer } from "./AngleExplorer";

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

describe("AngleExplorer (intersecting lines)", () => {
  it("exposes a keyboard-operable angle-between-the-lines slider", () => {
    render(<AngleExplorer />);
    const slider = screen.getByRole("slider", { name: /angle between the lines/i });
    expect(slider).toBeInTheDocument();
    expect(slider).toHaveAttribute("type", "range");
  });

  it("reports a vertical-angle pair and its measure from the pure module", () => {
    render(<AngleExplorer line1Dir={0} line2Dir={70} />);
    const status = screen.getByRole("status");
    expect(status.textContent ?? "").toMatch(/vertical/i);
    // θ = 70 for a 0° line crossed by a line at 70°.
    expect(status.textContent ?? "").toContain("70");
  });

  it("the live readout has aria-live so changes are announced", () => {
    render(<AngleExplorer />);
    const status = screen.getByRole("status");
    expect(status).toHaveAttribute("aria-live");
  });

  it("the slider is keyboard-reachable (a focusable native range)", () => {
    render(<AngleExplorer />);
    const slider = screen.getByRole("slider", { name: /angle between the lines/i });
    slider.focus();
    expect(slider).toHaveFocus();
  });

  it("updating the slider changes the reported measures", () => {
    render(<AngleExplorer line1Dir={0} line2Dir={70} />);
    const status = () => screen.getByRole("status").textContent ?? "";
    expect(status()).toContain("70°");

    const slider = screen.getByRole("slider", { name: /angle between the lines/i });
    fireEvent.change(slider, { target: { value: "120" } });
    // θ = 120 for a 0° line crossed by a line at 120°.
    expect(status()).toContain("120°");
    expect(status()).not.toContain("70°");
    expect(status()).toMatch(/vertical/i);
  });

  it("renders pattern-coded angle marks, not color-only", () => {
    const { container } = render(<AngleExplorer line1Dir={0} line2Dir={70} />);
    // Angle marks must carry a non-color encoding (a pattern class / data attr),
    // so the highlighted vertical pair is distinguishable without color.
    expect(container.querySelector("[data-cbmc-angle-pattern]")).toBeTruthy();
  });

  it("does NOT offer a parallel toggle or a second-line slider (single crossing)", () => {
    render(<AngleExplorer />);
    // The parallel concept belongs to the separate transversal tool, where a
    // second line is actually drawn — not to this one-crossing figure.
    expect(screen.queryByRole("switch", { name: /parallel/i })).not.toBeInTheDocument();
    expect(
      screen.queryByRole("slider", { name: /second line/i }),
    ).not.toBeInTheDocument();
  });

  it("offers a keyboard-operable view selector including a linear-pairs view", () => {
    render(<AngleExplorer />);
    const group = screen.getByRole("radiogroup", { name: /angle relationship/i });
    expect(group).toBeInTheDocument();
    const linear = screen.getByRole("radio", { name: /linear pair/i });
    expect(linear).toBeInTheDocument();
    linear.focus();
    expect(linear).toHaveFocus();
  });

  it("the readout reflects the active view when linear-pairs is selected", () => {
    render(<AngleExplorer line1Dir={0} line2Dir={70} />);
    const status = () => screen.getByRole("status").textContent ?? "";

    // Vertical view by default.
    expect(status()).toMatch(/vertical/i);

    fireEvent.click(screen.getByRole("radio", { name: /linear pair/i }));
    // The linear-pairs view: adjacent angles summing to 180°, from the module.
    expect(status()).toMatch(/linear pair/i);
    expect(status()).toContain("180");
    // θ = 70 → the adjacent angle is 110; both measures are surfaced.
    expect(status()).toContain("70°");
    expect(status()).toContain("110°");
  });

  it("keeps the linear-pair view summing to 180 as the line rotates", () => {
    render(<AngleExplorer line1Dir={0} line2Dir={70} />);
    fireEvent.click(screen.getByRole("radio", { name: /linear pair/i }));
    const status = () => screen.getByRole("status").textContent ?? "";

    fireEvent.change(
      screen.getByRole("slider", { name: /angle between the lines/i }),
      { target: { value: "120" } },
    );
    // θ = 120 → adjacent angle 60; the pair still sums to a straight angle.
    expect(status()).toMatch(/linear pair/i);
    expect(status()).toContain("120°");
    expect(status()).toContain("60°");
    expect(status()).toContain("180");
  });

  it("returns to the vertical-angles readout when that view is reselected", () => {
    render(<AngleExplorer line1Dir={0} line2Dir={70} />);
    const status = () => screen.getByRole("status").textContent ?? "";
    fireEvent.click(screen.getByRole("radio", { name: /linear pair/i }));
    expect(status()).toMatch(/linear pair/i);
    fireEvent.click(screen.getByRole("radio", { name: /vertical/i }));
    expect(status()).toMatch(/vertical/i);
    expect(status()).not.toMatch(/linear pair/i);
  });

  it("records nothing — zero-stakes", () => {
    render(<AngleExplorer />);
    expect(window.localStorage.length).toBe(0);
  });
});
