/** @vitest-environment jsdom */
import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { CongruenceCriteria } from "./CongruenceCriteria";
import { solutionCount } from "./logic";

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
  vi.restoreAllMocks();
});

const setMatchMedia = (reduce: boolean) => {
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    configurable: true,
    value: (query: string) => ({
      matches: reduce && query.includes("reduce"),
      media: query,
      addEventListener: () => {},
      removeEventListener: () => {},
      addListener: () => {},
      removeListener: () => {},
      dispatchEvent: () => false,
    }),
  });
};

describe("CongruenceCriteria (rigid criteria inquiry)", () => {
  it("offers a keyboard-operable part-set switcher with SSS and SAS", () => {
    render(<CongruenceCriteria />);
    const group = screen.getByRole("radiogroup", { name: /part set/i });
    expect(group).toBeInTheDocument();
    const sss = within(group).getByRole("radio", { name: /sss/i });
    const sas = within(group).getByRole("radio", { name: /sas/i });
    expect(sss).toBeInTheDocument();
    expect(sas).toBeInTheDocument();
    sss.focus();
    expect(sss).toHaveFocus();
  });

  it("starts in the inquiry beat with non-judgmental feedback and no verdict yet", () => {
    render(<CongruenceCriteria />);
    const status = screen.getByRole("status");
    // Non-judgmental: speaks about not being able to make a different one.
    expect(status.textContent ?? "").toMatch(/won't budge|different/i);
    // No consolidation verdict word before the student asks.
    expect(status.textContent ?? "").not.toMatch(/valid congruence/i);
  });

  it("a flex attempt leaves the triangle unchanged (rigid) and stays non-judgmental", () => {
    const { container } = render(<CongruenceCriteria />);
    const sig = () =>
      container.querySelector("[data-cbmc-triangle]")?.getAttribute("data-cbmc-triangle");
    const before = sig();
    fireEvent.click(screen.getByRole("button", { name: /different one|flex|budge/i }));
    // The determined triangle is unchanged by the nudge.
    expect(sig()).toBe(before);
    // Still no verdict — only inquiry feedback.
    expect(screen.getByRole("status").textContent ?? "").not.toMatch(/valid congruence/i);
  });

  it("the consolidation names the criterion using solutionCount, not a hardcode", () => {
    const { container } = render(<CongruenceCriteria />);
    // The determinacy the component renders must equal what the pure core says.
    const det = container
      .querySelector("[data-cbmc-determinacy]")
      ?.getAttribute("data-cbmc-determinacy");
    expect(det).toBe(solutionCount("SSS", { sides: [6, 5, 7] }).kind); // "unique"

    fireEvent.click(screen.getByRole("button", { name: /name it/i }));
    const status = screen.getByRole("status").textContent ?? "";
    expect(status).toMatch(/SSS/);
    // unique determinacy => valid shortcut wording.
    expect(status).toMatch(/valid congruence/i);
  });

  it("switching to SAS updates the part-set and its consolidation", () => {
    const { container } = render(<CongruenceCriteria />);
    fireEvent.click(screen.getByRole("radio", { name: /sas/i }));
    const det = container
      .querySelector("[data-cbmc-determinacy]")
      ?.getAttribute("data-cbmc-determinacy");
    expect(det).toBe(solutionCount("SAS", { sides: [6, 5], includedAngle: 55 }).kind);

    fireEvent.click(screen.getByRole("button", { name: /name it/i }));
    expect(screen.getByRole("status").textContent ?? "").toMatch(/SAS/);
  });

  it("the live readout is an aria-live region so changes are announced", () => {
    render(<CongruenceCriteria />);
    expect(screen.getByRole("status")).toHaveAttribute("aria-live");
  });

  it("renders (and the consolidation works) under prefers-reduced-motion", () => {
    setMatchMedia(true);
    render(<CongruenceCriteria />);
    expect(screen.getByRole("radiogroup", { name: /part set/i })).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: /name it/i }));
    expect(screen.getByRole("status").textContent ?? "").toMatch(/valid congruence/i);
  });

  it("records nothing — zero-stakes", () => {
    render(<CongruenceCriteria />);
    expect(window.localStorage.length).toBe(0);
  });
});

describe("CongruenceCriteria (SSA / AAA / HL — page 4 failure modes)", () => {
  const sig = (c: HTMLElement) =>
    c.querySelector("[data-cbmc-triangle]")?.getAttribute("data-cbmc-triangle");
  const det = (c: HTMLElement) =>
    c.querySelector("[data-cbmc-determinacy]")?.getAttribute("data-cbmc-determinacy");
  const count = (c: HTMLElement) =>
    c.querySelector("[data-cbmc-solution-count]")?.getAttribute("data-cbmc-solution-count");
  const setSlider = (name: RegExp, value: number) =>
    fireEvent.change(screen.getByRole("slider", { name }), {
      target: { value: String(value) },
    });

  it("SSA exposes a swinging-side slider and, at its ambiguous default, two distinct triangles", () => {
    const { container } = render(
      <CongruenceCriteria criteria={["HL", "SSA", "AAA"]} initialCriterion="SSA" />,
    );
    // The slider is keyboard-operable and the verdict is machine-sourced.
    expect(screen.getByRole("slider", { name: /swinging side/i })).toBeInTheDocument();
    expect(det(container)).toBe(
      solutionCount("SSA", { angle: 30, adjacent: 6, opposite: 4 }).kind, // "ambiguous"
    );
    expect(det(container)).toBe("ambiguous");
    expect(count(container)).toBe("2");

    // A segmented toggle flips between the two solutions, and the two are
    // genuinely different triangles (different third side).
    const toggle = screen.getByRole("radiogroup", { name: /which triangle/i });
    const solA = sig(container);
    fireEvent.click(within(toggle).getByRole("radio", { name: /solution 2/i }));
    const solB = sig(container);
    expect(solA).toBeTruthy();
    expect(solB).toBeTruthy();
    expect(solA).not.toBe(solB);
  });

  it("SSA walks the 0 → 1 → 2 regime, with exactly one triangle at the right-angle boundary", () => {
    const { container } = render(
      <CongruenceCriteria criteria={["SSA"]} initialCriterion="SSA" />,
    );
    // Below the altitude (3): the swinging side can't reach → impossible.
    setSlider(/swinging side/i, 2);
    expect(det(container)).toBe("impossible");
    expect(count(container)).toBe("0");

    // Exactly at the altitude (6·sin30° = 3): a single right-angled triangle —
    // the HL case. The verdict matches the core evaluated AT the true boundary.
    const altitude = 6 * Math.sin((30 * Math.PI) / 180);
    setSlider(/swinging side/i, 3);
    expect(det(container)).toBe(
      solutionCount("SSA", { angle: 30, adjacent: 6, opposite: altitude }).kind, // "unique"
    );
    expect(det(container)).toBe("unique");
    expect(count(container)).toBe("1");
    expect(
      container
        .querySelector("[data-cbmc-right-angle]")
        ?.getAttribute("data-cbmc-right-angle"),
    ).toBe("true");

    // Above the altitude: two triangles again.
    setSlider(/swinging side/i, 4.5);
    expect(det(container)).toBe("ambiguous");
    expect(count(container)).toBe("2");
  });

  it("SSA's consolidation names it NOT a valid criterion, sourced from solutionCount", () => {
    render(<CongruenceCriteria criteria={["SSA"]} initialCriterion="SSA" />);
    fireEvent.click(screen.getByRole("button", { name: /name it/i }));
    expect(screen.getByRole("status").textContent ?? "").toMatch(/SSA/);
    expect(screen.getByRole("status").textContent ?? "").toMatch(
      /NOT a valid congruence criterion/i,
    );
  });

  it("AAA scales through a similarity family — same verdict, different sizes", () => {
    const { container } = render(
      <CongruenceCriteria criteria={["AAA"]} initialCriterion="AAA" />,
    );
    expect(det(container)).toBe(
      solutionCount("AAA", { angles: [50, 60, 70] }).kind, // "continuous"
    );
    expect(det(container)).toBe("continuous");

    setSlider(/triangle size/i, 4);
    const small = sig(container);
    setSlider(/triangle size/i, 8);
    const big = sig(container);
    // The shape is the same (still continuous) but the size genuinely changed.
    expect(det(container)).toBe("continuous");
    expect(small).toBeTruthy();
    expect(big).toBeTruthy();
    expect(small).not.toBe(big);

    fireEvent.click(screen.getByRole("button", { name: /name it/i }));
    expect(screen.getByRole("status").textContent ?? "").toMatch(
      /AAA is NOT a congruence criterion/i,
    );
  });

  it("HL resolves as a rigid, valid criterion (nudge springs back; verdict valid)", () => {
    const { container } = render(
      <CongruenceCriteria criteria={["HL", "SSA", "AAA"]} initialCriterion="HL" />,
    );
    expect(det(container)).toBe(solutionCount("HL", { hypotenuse: 8, leg: 5 }).kind); // unique
    const before = sig(container);
    fireEvent.click(screen.getByRole("button", { name: /different one/i }));
    expect(sig(container)).toBe(before); // rigid — unchanged
    fireEvent.click(screen.getByRole("button", { name: /name it/i }));
    expect(screen.getByRole("status").textContent ?? "").toMatch(/HL/);
    expect(screen.getByRole("status").textContent ?? "").toMatch(/valid congruence shortcut/i);
  });

  it("switching among HL / SSA / AAA re-seeds each mode's controls", () => {
    const { container } = render(
      <CongruenceCriteria criteria={["HL", "SSA", "AAA"]} initialCriterion="HL" />,
    );
    // HL is rigid — no slider.
    expect(screen.queryByRole("slider")).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole("radio", { name: /ssa/i }));
    expect(screen.getByRole("slider", { name: /swinging side/i })).toBeInTheDocument();
    expect(det(container)).toBe("ambiguous");
    fireEvent.click(screen.getByRole("radio", { name: /aaa/i }));
    expect(screen.getByRole("slider", { name: /triangle size/i })).toBeInTheDocument();
    expect(det(container)).toBe("continuous");
  });
});
