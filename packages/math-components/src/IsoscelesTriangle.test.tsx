/** @vitest-environment jsdom */
import { afterEach, beforeAll, describe, expect, it } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { IsoscelesTriangle } from "./IsoscelesTriangle";

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

/** Pull the two base-angle measures (∠B and ∠C) out of the readout's degree
 *  values, ignoring the apex measure — we assert they equal EACH OTHER, never a
 *  hardcoded number. The screen-reader sentence names them explicitly. */
function baseAngles(): number[] {
  const text = status();
  // "...base angles are equal: ∠B = ∠C = <n>°, with apex angle ∠A = <m>°..."
  const m = text.match(/∠B\s*=\s*∠C\s*=\s*(\d+)°/);
  expect(m, `expected a "∠B = ∠C = n°" reading in: ${text}`).not.toBeNull();
  const v = Number(m![1]);
  return [v, v];
}

describe("IsoscelesTriangle (base angles theorem: equal legs ⇒ equal base angles)", () => {
  it("exposes the two keyboard-operable sliders (equal side length, apex angle)", () => {
    render(<IsoscelesTriangle />);
    for (const name of [/equal side length/i, /apex angle/i]) {
      const slider = screen.getByRole("slider", { name });
      expect(slider).toHaveAttribute("type", "range");
      slider.focus();
      expect(slider).toHaveFocus();
    }
  });

  it("reports the base angles as EQUAL to each other (∠B = ∠C), machine-sourced", () => {
    render(<IsoscelesTriangle apexAngleDeg={40} />);
    const [b, c] = baseAngles();
    expect(b).toBe(c);
    // Sanity: with a 40° apex the base angles are each 70°.
    expect(b).toBe(70);
  });

  it("keeps the base angles equal across several apex settings (the invariant)", () => {
    for (const apex of [20, 70, 110, 150]) {
      render(<IsoscelesTriangle apexAngleDeg={apex} />);
      const [b, c] = baseAngles();
      expect(b).toBe(c); // the theorem holds at every apex
      cleanup();
    }
  });

  it("changing the apex angle changes the base-angle value but keeps ∠B = ∠C", () => {
    render(<IsoscelesTriangle apexAngleDeg={40} />);
    const before = baseAngles()[0];
    fireEvent.change(screen.getByRole("slider", { name: /apex angle/i }), {
      target: { value: "100" },
    });
    const [b, c] = baseAngles();
    expect(b).toBe(c); // still equal
    expect(b).not.toBe(before); // but a different value (100° apex ⇒ 40° base angles)
    expect(b).toBe(40);
  });

  it("offers a proof reveal that toggles a dismiss control", () => {
    render(<IsoscelesTriangle />);
    const reveal = screen.getByRole("button", { name: /show why/i });
    fireEvent.click(reveal);
    expect(
      screen.getByRole("button", { name: /reset and hide the proof/i }),
    ).toBeInTheDocument();
  });

  it("the readout is an aria-live region and records nothing — zero-stakes", () => {
    render(<IsoscelesTriangle />);
    expect(screen.getByRole("status")).toHaveAttribute("aria-live");
    expect(window.localStorage.length).toBe(0);
  });
});
