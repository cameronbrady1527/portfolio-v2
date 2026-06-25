// Typed registry + validator for the Regents problem-bank. Parallel to
// lib/foundations/decks.ts: items live as authored code under
// content/regents/<course>/_bank/<topic>.ts and are validated at module load so
// an authoring mistake fails the build LOUD (never a silently-wrong exam item).
//
// Items come in two delivery modes:
//   - "mc"         — Part I multiple choice, auto-graded (chosen index == answer).
//   - "self-score" — Parts II–IV constructed-response: the student works it, then
//                    self-scores against the OFFICIAL rubric beside an authored
//                    model solution (we cannot auto-grade show-your-work).
//
// Provenance is first-class: every item cites its real NYSED administration
// (`regents-algI-<MMYY>-qNN`); the plain-English `topic` is the primary label and
// the `standard` code is secondary "exam info" (per the agreed code-exposure UX).

import solvingQuadratics from "../../../content/regents/algebra-i/_bank/solving-quadratics";

/** A single credit level of an official constructed-response rubric. */
export interface RubricLevel {
  /** Credits awarded at this level (high → low in the array). */
  credits: number;
  /** What earns this level, transcribed from the NYSED Rating Guide. */
  criteria: string;
}

interface RegentsItemBase {
  id: string;
  /** Next Gen standard code, e.g. "AI-A.REI.4". Secondary display. */
  standard: string;
  /** Plain-English topic label — the PRIMARY student-facing label. */
  topic: string;
  /** NYSED citation, e.g. "regents-algI-0624-q33". */
  examCitation: string;
  part: "I" | "II" | "III" | "IV";
  /** The item's credit value (2 for MC/short, 4 medium, 6 long). */
  credits: number;
  prompt: string;
}

/** Auto-graded multiple-choice item (Part I). */
export type RegentsMcItem = RegentsItemBase & {
  mode: "mc";
  choices: string[];
  /** Index of the correct choice. */
  answer: number;
  explanation: string;
};

/** Self-scored constructed-response item (Parts II–IV). */
export type RegentsSelfScoreItem = RegentsItemBase & {
  mode: "self-score";
  /** The final answer, shown at the head of the model solution. */
  answerSummary: string;
  /** An authored, clean worked solution (better than scanned handwriting). */
  modelSolution: string;
  /** Official credit levels from the Rating Guide, highest first. */
  rubric: RubricLevel[];
};

export type RegentsItem = RegentsMcItem | RegentsSelfScoreItem;

const CITATION = /^regents-[a-zA-Z0-9]+-[a-zA-Z0-9]+-q\d+$/;

function ok(cond: boolean, where: string, msg: string): void {
  if (!cond) throw new Error(`Malformed ${where}: ${msg}.`);
}

/**
 * Validate a raw bank for a topic slug, throwing a descriptive (slug + item)
 * error on any malformed item or empty bank. Returns the bank unchanged.
 */
export function validateBank(items: unknown, slug: string): RegentsItem[] {
  if (!Array.isArray(items) || items.length === 0) {
    throw new Error(
      `Regents bank "${slug}" is empty or not an array — author at least one item.`,
    );
  }
  items.forEach((raw, i) => {
    const where = `item ${i} in bank "${slug}"`;
    const it = raw as Partial<RegentsItem> & Record<string, unknown>;
    ok(typeof it.id === "string" && it.id.trim() !== "", where, "missing id");
    ok(typeof it.standard === "string" && !!it.standard, where, "missing standard");
    ok(typeof it.topic === "string" && !!it.topic, where, "missing topic label");
    ok(
      typeof it.examCitation === "string" && CITATION.test(it.examCitation),
      where,
      `examCitation must look like "regents-algI-0624-q33" (got ${String(it.examCitation)})`,
    );
    ok(["I", "II", "III", "IV"].includes(it.part as string), where, "bad part");
    ok(typeof it.credits === "number" && it.credits > 0, where, "credits must be > 0");
    ok(typeof it.prompt === "string" && !!it.prompt, where, "missing prompt");
    if (it.mode === "mc") {
      ok(Array.isArray(it.choices) && it.choices.length >= 2, where, "mc needs choices");
      ok(
        typeof it.answer === "number" &&
          it.answer >= 0 &&
          it.answer < (it.choices as unknown[]).length,
        where,
        "mc answer index out of range",
      );
      ok(typeof it.explanation === "string" && !!it.explanation, where, "mc needs explanation");
    } else if (it.mode === "self-score") {
      ok(typeof it.answerSummary === "string" && !!it.answerSummary, where, "needs answerSummary");
      ok(typeof it.modelSolution === "string" && !!it.modelSolution, where, "needs modelSolution");
      ok(
        Array.isArray(it.rubric) &&
          it.rubric.length >= 2 &&
          it.rubric.every(
            (l) => typeof l.credits === "number" && typeof l.criteria === "string",
          ),
        where,
        "needs a rubric (credit levels with criteria)",
      );
      ok(
        (it.rubric as RubricLevel[])[0].credits === it.credits,
        where,
        "top rubric level must equal the item's credits",
      );
    } else {
      throw new Error(`Malformed ${where}: mode must be "mc" or "self-score".`);
    }
  });
  return items as RegentsItem[];
}

export type RegentsBankMeta = {
  slug: string;
  /** Plain-English bank title. */
  title: string;
  course: "algebra-i";
  /** The primary standard this bank targets, e.g. "AI-A.REI.4". */
  standard: string;
};

// Validated at module load so an authoring mistake breaks the build immediately.
const BANKS: Record<string, RegentsItem[]> = {
  "solving-quadratics": validateBank(solvingQuadratics, "solving-quadratics"),
};

/** Resolve a bank's validated items, failing loud if none is registered. */
export function resolveBank(slug: string): RegentsItem[] {
  const bank = BANKS[slug];
  if (!bank) {
    const known = Object.keys(BANKS).join(", ") || "(none)";
    throw new Error(
      `No Regents bank registered for slug "${slug}". Known banks: ${known}.`,
    );
  }
  return bank;
}
