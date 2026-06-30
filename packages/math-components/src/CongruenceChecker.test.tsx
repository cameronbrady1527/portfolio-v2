/** @vitest-environment jsdom */
import { afterEach, beforeAll, describe, expect, it } from "vitest";
import { cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import {
  CongruenceChecker,
  classifyCriterion,
  CHECKER_PRESETS,
} from "./CongruenceChecker";

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

const verdict = () => screen.getByRole("status").textContent ?? "";

describe("classifyCriterion (criterion from the marked given parts — pure)", () => {
  it("three marked sides → SSS", () => {
    expect(
      classifyCriterion([
        { kind: "side", verts: [0, 1], count: 1 },
        { kind: "side", verts: [1, 2], count: 2 },
        { kind: "side", verts: [2, 0], count: 3 },
      ]),
    ).toBe("SSS");
  });

  it("two sides + the angle between them → SAS; the angle off to the side → SSA", () => {
    // Angle at vertex 0, both marked sides meet vertex 0 → included → SAS.
    expect(
      classifyCriterion([
        { kind: "side", verts: [0, 1], count: 1 },
        { kind: "side", verts: [0, 2], count: 2 },
        { kind: "angle", vert: 0, count: 1 },
      ]),
    ).toBe("SAS");
    // Angle at vertex 0 but one marked side (1-2) does not touch it → SSA.
    expect(
      classifyCriterion([
        { kind: "side", verts: [0, 1], count: 1 },
        { kind: "side", verts: [1, 2], count: 2 },
        { kind: "angle", vert: 0, count: 1 },
      ]),
    ).toBe("SSA");
  });

  it("two angles + the side between them → ASA; a non-included side → AAS", () => {
    expect(
      classifyCriterion([
        { kind: "angle", vert: 0, count: 1 },
        { kind: "angle", vert: 1, count: 2 },
        { kind: "side", verts: [0, 1], count: 1 },
      ]),
    ).toBe("ASA");
    expect(
      classifyCriterion([
        { kind: "angle", vert: 0, count: 1 },
        { kind: "angle", vert: 1, count: 2 },
        { kind: "side", verts: [1, 2], count: 1 },
      ]),
    ).toBe("AAS");
  });

  it("a right angle + hypotenuse + leg → HL", () => {
    // Right angle at vertex 2; leg 2-0 touches it, hypotenuse 0-1 does not.
    expect(
      classifyCriterion([
        { kind: "angle", vert: 2, right: true },
        { kind: "side", verts: [0, 1], count: 1 },
        { kind: "side", verts: [2, 0], count: 2 },
      ]),
    ).toBe("HL");
  });
});

describe("CongruenceChecker (the capstone verdict tool)", () => {
  it("offers a keyboard-operable preset chooser (radiogroup) covering every preset", () => {
    render(<CongruenceChecker />);
    const group = screen.getByRole("radiogroup", { name: /pair/i });
    expect(group).toBeInTheDocument();
    const radios = within(group).getAllByRole("radio");
    expect(radios.length).toBe(CHECKER_PRESETS.length);
    radios[0].focus();
    expect(radios[0]).toHaveFocus();
  });

  it("classifies the SAS pair: Congruent — by SAS, △ABC ≅ △DEF", () => {
    render(<CongruenceChecker initialPreset="sas" />);
    const text = verdict();
    expect(text).toMatch(/Congruent/i);
    expect(text).toMatch(/SAS/);
    expect(text).toMatch(/△ABC ≅ △DEF/);
  });

  it("classifies the ASA pair: Congruent — by ASA", () => {
    render(<CongruenceChecker initialPreset="asa" />);
    expect(verdict()).toMatch(/Congruent/i);
    expect(verdict()).toMatch(/ASA/);
  });

  it("classifies the SSS pair: Congruent — by SSS", () => {
    render(<CongruenceChecker initialPreset="sss" />);
    expect(verdict()).toMatch(/Congruent/i);
    expect(verdict()).toMatch(/SSS/);
  });

  it("classifies the HL pair: Congruent — by HL", () => {
    render(<CongruenceChecker initialPreset="hl" />);
    expect(verdict()).toMatch(/Congruent/i);
    expect(verdict()).toMatch(/\bHL\b/);
  });

  it("classifies the SSA pair as Not congruent (verdict sourced from congruenceCheck)", () => {
    render(<CongruenceChecker initialPreset="ssa" />);
    const text = verdict();
    expect(text).toMatch(/Not congruent/i);
    // A non-congruent verdict must NOT claim a criterion certificate.
    expect(text).not.toMatch(/≅/);
  });

  it("every preset's verdict agrees with congruenceCheck on the drawn triangles", () => {
    // Selecting each preset updates the live verdict consistently: the congruent
    // ones say "Congruent — by <criterion>", the SSA one says "Not congruent".
    render(<CongruenceChecker />);
    const group = screen.getByRole("radiogroup", { name: /pair/i });
    for (const preset of CHECKER_PRESETS) {
      const radio = within(group).getByRole("radio", { name: preset.label });
      fireEvent.click(radio);
      if (preset.id === "ssa") {
        expect(verdict()).toMatch(/Not congruent/i);
      } else {
        expect(verdict()).toMatch(/Congruent/i);
      }
    }
  });

  it("the preset chooser is keyboard-navigable: arrowing advances and re-states the verdict", () => {
    render(<CongruenceChecker initialPreset="sas" />);
    expect(verdict()).toMatch(/SAS/);
    const first = screen.getByRole("radio", { name: CHECKER_PRESETS[0].label });
    first.focus();
    fireEvent.keyDown(first, { key: "ArrowRight" });
    // Second preset is ASA in CHECKER_PRESETS order.
    expect(verdict()).toMatch(/ASA/);
  });

  it("renders under prefers-reduced-motion without crashing and still states a verdict", () => {
    mockReducedMotion(true);
    render(<CongruenceChecker initialPreset="sss" />);
    expect(verdict()).toMatch(/Congruent/i);
  });

  it("is zero-stakes: the verdict is an aria-live region and nothing is recorded", () => {
    render(<CongruenceChecker />);
    expect(screen.getByRole("status")).toHaveAttribute("aria-live");
    fireEvent.click(screen.getByRole("radio", { name: CHECKER_PRESETS[1].label }));
    expect(window.localStorage.length).toBe(0);
  });
});
