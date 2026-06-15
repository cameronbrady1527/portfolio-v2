/**
 * Tokenizer for school-math expressions and equations.
 *
 * Substrate-free: no React, no DOM. Turns a raw string into a flat token
 * stream the parser consumes. Identifiers are single letters, so "xy"
 * tokenizes as two identifiers — the parser then reads that as x·y (implicit
 * multiplication), which is what a student means by "xy".
 */

export type TokenType =
  | "number"
  | "ident"
  | "plus"
  | "minus"
  | "star"
  | "slash"
  | "caret"
  | "lparen"
  | "rparen"
  | "eq";

export type Token = {
  type: TokenType;
  /** The exact source text of this token (number text or the variable letter). */
  value: string;
  /** Index in the source where this token starts — for error messages. */
  pos: number;
};

/** Thrown when the input contains a character the grammar does not allow. */
export class TokenizeError extends Error {
  constructor(
    message: string,
    readonly pos: number,
  ) {
    super(message);
    this.name = "TokenizeError";
  }
}

const SINGLE: Record<string, TokenType> = {
  "+": "plus",
  "-": "minus",
  "*": "star",
  "/": "slash",
  "^": "caret",
  "(": "lparen",
  ")": "rparen",
  "=": "eq",
};

function isDigit(ch: string): boolean {
  return ch >= "0" && ch <= "9";
}

function isLetter(ch: string): boolean {
  return (ch >= "a" && ch <= "z") || (ch >= "A" && ch <= "Z");
}

/**
 * Tokenize a math expression/equation string.
 *
 * Accepts: digits with at most one decimal point, single ASCII letters as
 * variables, the operators + - * / ^, parentheses, and a single = for
 * equations. Whitespace is ignored. Anything else throws TokenizeError.
 */
export function tokenize(input: string): Token[] {
  const tokens: Token[] = [];
  let i = 0;
  while (i < input.length) {
    const ch = input[i]!;

    if (ch === " " || ch === "\t" || ch === "\n" || ch === "\r") {
      i += 1;
      continue;
    }

    if (SINGLE[ch]) {
      tokens.push({ type: SINGLE[ch], value: ch, pos: i });
      i += 1;
      continue;
    }

    if (isDigit(ch) || ch === ".") {
      const start = i;
      let seenDot = false;
      while (i < input.length && (isDigit(input[i]!) || input[i] === ".")) {
        if (input[i] === ".") {
          if (seenDot) {
            throw new TokenizeError(
              `A number can have only one decimal point`,
              i,
            );
          }
          seenDot = true;
        }
        i += 1;
      }
      const text = input.slice(start, i);
      if (text === ".") {
        throw new TokenizeError(`A lone "." is not a number`, start);
      }
      tokens.push({ type: "number", value: text, pos: start });
      continue;
    }

    if (isLetter(ch)) {
      // Each letter is its own variable token, so "xy" becomes x·y.
      tokens.push({ type: "ident", value: ch, pos: i });
      i += 1;
      continue;
    }

    throw new TokenizeError(`Unexpected character "${ch}"`, i);
  }
  return tokens;
}
