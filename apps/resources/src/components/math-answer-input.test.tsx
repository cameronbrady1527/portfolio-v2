/** @vitest-environment jsdom */
import { afterEach, describe, expect, it } from "vitest";
import { cleanup, render } from "@testing-library/react";
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { MathAnswerInput } from "./MathAnswerInput";

afterEach(cleanup);

// Design guard — mobile keyboards: a math answer can be NEGATIVE ("−7"), so an
// input must never force a numeric/decimal mobile keypad (iOS hides the minus
// sign there) or use type="number". Typed answers go through <MathAnswerInput>,
// which locks inputMode="text" (the full keyboard). This test scans the source
// and fails the build if a numeric keypad reappears anywhere, so the bug can't
// silently come back. See MathAnswerInput.tsx.

const SRC = join(import.meta.dirname, "..");
// The canonical component documents the forbidden patterns in its comment; skip
// it (and tests, which describe the rule).
const ALLOW = new Set(["MathAnswerInput.tsx"]);

function tsxFiles(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) return tsxFiles(p);
    return name.endsWith(".tsx") &&
      !name.endsWith(".test.tsx") &&
      !ALLOW.has(name)
      ? [p]
      : [];
  });
}

describe("mobile keyboard guard", () => {
  it("no input forces a numeric/decimal keypad — use <MathAnswerInput>", () => {
    const offenders: string[] = [];
    for (const file of tsxFiles(SRC)) {
      readFileSync(file, "utf8")
        .split("\n")
        .forEach((line, i) => {
          const numericKeypad =
            line.includes("inputMode") && /numeric|decimal/.test(line);
          const typeNumber = /type\s*=\s*["']number["']/.test(line);
          if (numericKeypad || typeNumber) {
            offenders.push(`${file.replace(SRC, "src")}:${i + 1}  ${line.trim()}`);
          }
        });
    }
    expect(
      offenders,
      `A numeric mobile keypad hides the minus sign — students can't type negative answers.\n` +
        `Use <MathAnswerInput> (inputMode="text") instead of these:\n${offenders.join("\n")}`,
    ).toEqual([]);
  });
});

describe("MathAnswerInput", () => {
  it("renders a full-keyboard text input (minus sign reachable on mobile)", () => {
    const { getByRole } = render(<MathAnswerInput aria-label="answer" />);
    const el = getByRole("textbox");
    expect(el.getAttribute("type")).toBe("text");
    expect(el.getAttribute("inputmode")).toBe("text");
  });

  it("cannot be narrowed to a numeric keypad by a usage site", () => {
    // Even if a caller passes a numeric keypad, the locked safe keyboard wins —
    // the negative sign stays reachable on mobile.
    const { getByRole } = render(
      <MathAnswerInput aria-label="answer" inputMode="numeric" type="number" />,
    );
    const el = getByRole("textbox");
    expect(el.getAttribute("inputmode")).toBe("text");
    expect(el.getAttribute("type")).toBe("text");
  });

  it("still forwards value, disabled, and className", () => {
    const { getByRole } = render(
      <MathAnswerInput aria-label="a" value="−7" readOnly disabled className="w-44" />,
    );
    const el = getByRole("textbox") as HTMLInputElement;
    expect(el.value).toBe("−7");
    expect(el.disabled).toBe(true);
    expect(el.className).toContain("w-44");
  });
});
