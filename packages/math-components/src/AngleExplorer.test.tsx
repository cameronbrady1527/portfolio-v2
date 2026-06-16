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
});
