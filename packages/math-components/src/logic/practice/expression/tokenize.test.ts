import { describe, expect, it } from "vitest";
import { tokenize, TokenizeError } from "./tokenize";

const types = (s: string) => tokenize(s).map((t) => t.type);
const values = (s: string) => tokenize(s).map((t) => t.value);

describe("tokenize", () => {
  it("splits a coefficient and a variable: 2x", () => {
    expect(types("2x")).toEqual(["number", "ident"]);
    expect(values("2x")).toEqual(["2", "x"]);
  });

  it("reads each operator and paren", () => {
    expect(types("+-*/^()=")).toEqual([
      "plus",
      "minus",
      "star",
      "slash",
      "caret",
      "lparen",
      "rparen",
      "eq",
    ]);
  });

  it("reads a decimal number as one token", () => {
    expect(values("3.5")).toEqual(["3.5"]);
    expect(values(".5")).toEqual([".5"]);
  });

  it("ignores whitespace", () => {
    expect(values("  2 x +\t1 ")).toEqual(["2", "x", "+", "1"]);
  });

  it("treats each letter as its own variable so xy is x and y", () => {
    expect(types("xy")).toEqual(["ident", "ident"]);
    expect(values("xy")).toEqual(["x", "y"]);
  });

  it("rejects a number with two decimal points", () => {
    expect(() => tokenize("3.5.1")).toThrow(TokenizeError);
  });

  it("rejects an unexpected character", () => {
    expect(() => tokenize("2 & 3")).toThrow(TokenizeError);
  });

  it("rejects a lone decimal point", () => {
    expect(() => tokenize(".")).toThrow(TokenizeError);
  });
});
