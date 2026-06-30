/** @vitest-environment jsdom */
import { afterEach, beforeAll, describe, expect, it } from "vitest";
import { cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { CPCTC } from "./CPCTC";

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
  delete (window as unknown as { matchMedia?: unknown }).matchMedia;
});

/** Force `prefers-reduced-motion: reduce` for the hook under test. */
function mockReducedMotion(reduce: boolean) {
  (window as unknown as { matchMedia: (q: string) => MediaQueryList }).matchMedia =
    () =>
      ({
        matches: reduce,
        media: "(prefers-reduced-motion: reduce)",
        onchange: null,
        addEventListener: () => {},
        removeEventListener: () => {},
        addListener: () => {},
        removeListener: () => {},
        dispatchEvent: () => false,
      }) as unknown as MediaQueryList;
}

const status = () => screen.getByRole("status").textContent ?? "";

describe("CPCTC (reading a congruence statement's correspondence)", () => {
  it("offers a keyboard-operable part chooser (radiogroup) covering all 3 angles and 3 sides", () => {
    render(<CPCTC />);
    const group = screen.getByRole("radiogroup", { name: /choose a part/i });
    expect(group).toBeInTheDocument();
    for (const name of ["∠A", "∠B", "∠C", "AB", "BC", "CA"]) {
      const radio = within(group).getByRole("radio", { name });
      expect(radio).toBeInTheDocument();
    }
    // Roving tabindex: at least one radio is focusable.
    const radios = within(group).getAllByRole("radio");
    radios[0].focus();
    expect(radios[0]).toHaveFocus();
  });

  it("states the machine-sourced equality for a side: AB corresponds to DE", () => {
    render(<CPCTC />);
    fireEvent.click(screen.getByRole("radio", { name: "AB" }));
    const text = status();
    expect(text).toMatch(/≅/);
    // △ABC ≅ △DEF ⇒ A↔D, B↔E, so side AB ↔ DE — never AC/DF by position.
    expect(text).toMatch(/AB/);
    expect(text).toMatch(/DE/);
  });

  it("states the machine-sourced equality for an angle: ∠A corresponds to ∠D", () => {
    render(<CPCTC />);
    fireEvent.click(screen.getByRole("radio", { name: "∠A" }));
    const text = status();
    expect(text).toMatch(/≅/);
    expect(text).toMatch(/∠A/);
    expect(text).toMatch(/∠D/);
  });

  it("maps every part through the correspondence: ∠B↔∠E, ∠C↔∠F, BC↔EF, CA↔FD", () => {
    render(<CPCTC />);
    const cases: [string, RegExp][] = [
      ["∠B", /∠E/],
      ["∠C", /∠F/],
      ["BC", /EF/],
      ["CA", /(FD|DF)/],
    ];
    for (const [part, partner] of cases) {
      fireEvent.click(screen.getByRole("radio", { name: part }));
      expect(status()).toMatch(partner);
    }
  });

  it("the partner is read from the correspondence, not screen position: a different pose keeps AB↔DE", () => {
    // Re-pose the second triangle (different rotation / no reflection). The
    // correspondence is sourced from congruenceCheck, so AB still pairs with DE.
    render(<CPCTC rotateDeg={40} reflect={false} />);
    fireEvent.click(screen.getByRole("radio", { name: "AB" }));
    const text = status();
    expect(text).toMatch(/AB/);
    expect(text).toMatch(/DE/);
  });

  it("the part chooser is keyboard-navigable: arrowing from AB advances to BC and re-states the pair", () => {
    render(<CPCTC initialPart="AB" />);
    expect(status()).toMatch(/DE/);
    const ab = screen.getByRole("radio", { name: "AB" });
    ab.focus();
    fireEvent.keyDown(ab, { key: "ArrowRight" });
    // Options are ordered ∠A,∠B,∠C,AB,BC,CA → ArrowRight from AB lands on BC.
    expect(status()).toMatch(/BC/);
    expect(status()).toMatch(/EF/);
  });

  it("renders a static highlight under prefers-reduced-motion (no crash, partner still stated)", () => {
    mockReducedMotion(true);
    render(<CPCTC />);
    fireEvent.click(screen.getByRole("radio", { name: "BC" }));
    expect(status()).toMatch(/EF/);
  });

  it("is zero-stakes: the readout is an aria-live region and nothing is recorded", () => {
    render(<CPCTC />);
    expect(screen.getByRole("status")).toHaveAttribute("aria-live");
    fireEvent.click(screen.getByRole("radio", { name: "∠C" }));
    expect(window.localStorage.length).toBe(0);
  });
});
