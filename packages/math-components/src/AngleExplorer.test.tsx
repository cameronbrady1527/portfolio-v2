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

describe("AngleExplorer", () => {
  it("exposes a keyboard-operable transversal-angle slider", () => {
    render(<AngleExplorer />);
    const slider = screen.getByRole("slider", { name: /transversal angle/i });
    expect(slider).toBeInTheDocument();
    expect(slider).toHaveAttribute("type", "range");
  });

  it("reports a vertical-angle pair and its measure from the pure module", () => {
    render(<AngleExplorer line1Dir={0} line2Dir={0} transversalDir={70} />);
    const status = screen.getByRole("status");
    expect(status.textContent ?? "").toMatch(/vertical/i);
    // θ = 70 for a 0° line crossed by a 70° transversal.
    expect(status.textContent ?? "").toContain("70");
  });

  it("the live readout has aria-live so changes are announced", () => {
    render(<AngleExplorer />);
    const status = screen.getByRole("status");
    expect(status).toHaveAttribute("aria-live");
  });

  it("the slider is keyboard-reachable (a focusable native range)", () => {
    render(<AngleExplorer />);
    const slider = screen.getByRole("slider", { name: /transversal angle/i });
    slider.focus();
    expect(slider).toHaveFocus();
  });

  it("updating the slider changes the reported measures", () => {
    render(<AngleExplorer line1Dir={0} line2Dir={0} transversalDir={70} />);
    const status = () => screen.getByRole("status").textContent ?? "";
    expect(status()).toContain("70°");

    const slider = screen.getByRole("slider", { name: /transversal angle/i });
    fireEvent.change(slider, { target: { value: "120" } });
    // θ = 120 for a 0° line crossed by a 120° transversal.
    expect(status()).toContain("120°");
    expect(status()).not.toContain("70°");
    expect(status()).toMatch(/vertical/i);
  });

  it("renders pattern-coded angle marks, not color-only", () => {
    const { container } = render(
      <AngleExplorer line1Dir={0} line2Dir={0} transversalDir={70} />,
    );
    // Angle marks must carry a non-color encoding (a pattern class / data attr),
    // so the highlighted vertical pair is distinguishable without color.
    expect(container.querySelector("[data-cbmc-angle-pattern]")).toBeTruthy();
  });

  it("exposes a keyboard-operable parallel/non-parallel switch", () => {
    render(<AngleExplorer />);
    const toggle = screen.getByRole("switch", { name: /parallel/i });
    expect(toggle).toBeInTheDocument();
    toggle.focus();
    expect(toggle).toHaveFocus();
  });

  it("reveals a second-line slider only in non-parallel mode", () => {
    render(<AngleExplorer />);
    // Parallel by default: the second line is slaved, so no independent slider.
    expect(
      screen.queryByRole("slider", { name: /second line/i }),
    ).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole("switch", { name: /parallel/i }));
    const second = screen.getByRole("slider", { name: /second line/i });
    expect(second).toBeInTheDocument();
    expect(second).toHaveAttribute("type", "range");
    second.focus();
    expect(second).toHaveFocus();
  });

  it("flips the parallel-line verdict live when the switch toggles", () => {
    render(<AngleExplorer line1Dir={0} line2Dir={40} transversalDir={70} />);
    const status = () => screen.getByRole("status").textContent ?? "";

    // Parallel by default → corresponding/alternate angles ARE equal.
    expect(status()).toMatch(/equal/i);
    expect(status()).not.toMatch(/not equal|aren't equal|are not equal/i);

    // Flip to non-parallel: line2 (40°) ≠ line1 (0°), so they are NOT equal.
    fireEvent.click(screen.getByRole("switch", { name: /parallel/i }));
    expect(status()).toMatch(/not equal|aren't equal|are not equal/i);
  });

  it("offers a keyboard-operable lens selector including a linear-pairs lens", () => {
    render(<AngleExplorer />);
    const group = screen.getByRole("radiogroup", { name: /lens/i });
    expect(group).toBeInTheDocument();
    const linear = screen.getByRole("radio", { name: /linear pair/i });
    expect(linear).toBeInTheDocument();
    linear.focus();
    expect(linear).toHaveFocus();
  });

  it("the readout reflects the active lens when linear-pairs is selected", () => {
    render(<AngleExplorer line1Dir={0} line2Dir={0} transversalDir={70} />);
    const status = () => screen.getByRole("status").textContent ?? "";

    // Vertical lens by default.
    expect(status()).toMatch(/vertical/i);

    fireEvent.click(screen.getByRole("radio", { name: /linear pair/i }));
    // The linear-pairs lens: adjacent angles summing to 180°, from the module.
    expect(status()).toMatch(/linear pair/i);
    expect(status()).toContain("180");
    // θ = 70 → the adjacent angle is 110; both measures are surfaced.
    expect(status()).toContain("70°");
    expect(status()).toContain("110°");
  });

  it("keeps the linear-pair lens summing to 180 as the transversal moves", () => {
    render(<AngleExplorer line1Dir={0} line2Dir={0} transversalDir={70} />);
    fireEvent.click(screen.getByRole("radio", { name: /linear pair/i }));
    const status = () => screen.getByRole("status").textContent ?? "";

    fireEvent.change(
      screen.getByRole("slider", { name: /transversal angle/i }),
      { target: { value: "120" } },
    );
    // θ = 120 → adjacent angle 60; the pair still sums to a straight angle.
    expect(status()).toMatch(/linear pair/i);
    expect(status()).toContain("120°");
    expect(status()).toContain("60°");
    expect(status()).toContain("180");
  });

  it("returns to the vertical-angles readout when that lens is reselected", () => {
    render(<AngleExplorer line1Dir={0} line2Dir={0} transversalDir={70} />);
    const status = () => screen.getByRole("status").textContent ?? "";
    fireEvent.click(screen.getByRole("radio", { name: /linear pair/i }));
    expect(status()).toMatch(/linear pair/i);
    fireEvent.click(screen.getByRole("radio", { name: /vertical/i }));
    expect(status()).toMatch(/vertical/i);
    expect(status()).not.toMatch(/linear pair/i);
  });
});
