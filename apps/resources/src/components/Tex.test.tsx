/** @vitest-environment jsdom */
import { afterEach, describe, expect, it } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { MathText } from "./Tex";

afterEach(cleanup);

describe("MathText", () => {
  it("renders plain prose unchanged (no $ delimiters)", () => {
    render(<MathText>addition property of equality</MathText>);
    expect(
      screen.getByText("addition property of equality"),
    ).toBeInTheDocument();
  });

  it("renders inline $…$ segments as KaTeX, leaving prose around them", () => {
    const { container } = render(
      <MathText>{String.raw`Solve $x^2 - 1 = 0$ now`}</MathText>,
    );
    // Prose on both sides survives.
    expect(container.textContent).toContain("Solve");
    expect(container.textContent).toContain("now");
    // The math segment became KaTeX markup.
    expect(container.querySelector(".katex")).not.toBeNull();
  });
});
