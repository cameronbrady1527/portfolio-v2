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
