/** @vitest-environment jsdom */
import { afterEach, beforeAll, describe, expect, it } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { Midsegment } from "./Midsegment";

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

describe("Midsegment (the segment joining two midpoints is parallel and half the base)", () => {
  it("exposes three keyboard-operable SAS sliders (Side AB, Side AC, included angle)", () => {
    render(<Midsegment />);
    for (const name of [/side ab/i, /side ac/i, /included angle/i]) {
      const slider = screen.getByRole("slider", { name });
      expect(slider).toHaveAttribute("type", "range");
      slider.focus();
      expect(slider).toHaveFocus();
    }
  });

  it("reports the midsegment as half the base, with machine-sourced numbers", () => {
    // sideB = |AB| = 8 → midsegment parallel to AB has length 4.0.
    render(<Midsegment sideB={8} sideC={6} includedAngleDeg={55} />);
    const text = status();
    expect(text).toMatch(/4\.0/); // midsegment length
    expect(text).toMatch(/8\.0/); // base |AB|
    expect(text).toMatch(/parallel/i);
  });

  it("updates the readout live when the base slider changes", () => {
    render(<Midsegment sideB={8} sideC={6} includedAngleDeg={55} />);
    expect(status()).toMatch(/4\.0/);
    fireEvent.change(screen.getByRole("slider", { name: /side ab/i }), {
      target: { value: "10" },
    });
    const text = status();
    // |AB| = 10 → midsegment = 5.0.
    expect(text).toMatch(/5\.0/);
    expect(text).toMatch(/10\.0/);
  });

  it("offers a side switcher (radiogroup) to choose which midsegment is shown", () => {
    render(<Midsegment />);
    const group = screen.getByRole("radiogroup", { name: /which midsegment/i });
    expect(group).toBeInTheDocument();
    for (const name of [/AB/i, /BC/i, /CA/i]) {
      expect(screen.getByRole("radio", { name })).toBeInTheDocument();
    }
  });

  it("switches the lens to another side and re-sources the readout from that side", () => {
    // Right triangle: A=(0,0), B=(8,0), C swept by 90° at distance 6 → C=(~0,6).
    // |BC| = hypot(8,6) = 10 → its midsegment = 5.0.
    render(<Midsegment sideB={8} sideC={6} includedAngleDeg={90} />);
    fireEvent.click(screen.getByRole("radio", { name: /BC/i }));
    const text = status();
    expect(text).toMatch(/5\.0/);
    expect(text).toMatch(/10\.0/);
  });

  it("offers a 'Show why' demonstration that toggles a dismiss control", () => {
    render(<Midsegment />);
    const show = screen.getByRole("button", { name: /show why/i });
    fireEvent.click(show);
    expect(
      screen.getByRole("button", { name: /reset and hide/i }),
    ).toBeInTheDocument();
  });

  it("the readout is an aria-live region and records nothing — zero-stakes", () => {
    render(<Midsegment />);
    expect(screen.getByRole("status")).toHaveAttribute("aria-live");
    expect(window.localStorage.length).toBe(0);
  });
});
