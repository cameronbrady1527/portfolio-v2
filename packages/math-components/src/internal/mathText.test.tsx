/** @vitest-environment jsdom */
import { describe, expect, it } from "vitest";
import { render } from "@testing-library/react";
import { MathText } from "./mathText";

describe("MathText", () => {
  it("renders a string with no `$` entirely as prose (statement fallback)", () => {
    const { container } = render(<MathText source="Points A, B, C are collinear" />);
    expect(container.textContent).toBe("Points A, B, C are collinear");
    // No KaTeX output when there is no math span.
    expect(container.querySelector(".katex")).toBeNull();
  });

  it("renders a `$…$` span as KaTeX", () => {
    const { container } = render(<MathText source="$\\overline{AB} \\cong \\overline{CD}$" />);
    expect(container.querySelector(".katex")).not.toBeNull();
  });

  it("interleaves prose and math across multiple `$…$` spans", () => {
    const { container } = render(
      <MathText source="Given $\\angle 1$ and $\\angle 2$ are supplementary" />,
    );
    // Two math spans → two KaTeX renders; the prose survives in textContent.
    expect(container.querySelectorAll(".katex").length).toBe(2);
    expect(container.textContent).toContain("Given ");
    expect(container.textContent).toContain(" and ");
    expect(container.textContent).toContain(" are supplementary");
  });

  it("hides itself from the a11y tree when ariaHidden is set (labeled tiles)", () => {
    const { container } = render(<MathText source="$x = 6$" ariaHidden />);
    expect(container.firstElementChild?.getAttribute("aria-hidden")).toBe("true");
  });

  it("does not set aria-hidden by default (readable given/prove/caption)", () => {
    const { container } = render(<MathText source="$x = 6$" />);
    expect(container.firstElementChild?.getAttribute("aria-hidden")).toBeNull();
  });

  it("does not throw on malformed LaTeX — renders instead of crashing", () => {
    expect(() => render(<MathText source="$\\frac{$" />)).not.toThrow();
  });
});
