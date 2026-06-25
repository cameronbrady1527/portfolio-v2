// SERVER/build-time: turn a bank's authored items (LaTeX in `$…$`) into items
// whose math fields are pre-rendered HTML, so the interactive client component
// ships ZERO KaTeX. Mirrors the .mdx content's build-time math rendering.

import { resolveBank } from "./bank";
import { texToHtml } from "../tex-to-html";

interface PreparedBase {
  id: string;
  standard: string;
  topic: string;
  examCitation: string;
  part: "I" | "II" | "III" | "IV";
  credits: number;
  /** Prompt rendered to HTML (prose + math). */
  promptHtml: string;
}

export type PreparedMcItem = PreparedBase & {
  mode: "mc";
  choicesHtml: string[];
  answer: number;
  explanationHtml: string;
};

export type PreparedSelfScoreItem = PreparedBase & {
  mode: "self-score";
  answerSummaryHtml: string;
  modelSolutionHtml: string;
  rubric: { credits: number; criteriaHtml: string }[];
};

export type PreparedRegentsItem = PreparedMcItem | PreparedSelfScoreItem;

/** Resolve a bank and pre-render every item's math to HTML (server only). */
export function prepareBank(slug: string): PreparedRegentsItem[] {
  return resolveBank(slug).map((item): PreparedRegentsItem => {
    const base: PreparedBase = {
      id: item.id,
      standard: item.standard,
      topic: item.topic,
      examCitation: item.examCitation,
      part: item.part,
      credits: item.credits,
      promptHtml: texToHtml(item.prompt),
    };
    if (item.mode === "mc") {
      return {
        ...base,
        mode: "mc",
        choicesHtml: item.choices.map(texToHtml),
        answer: item.answer,
        explanationHtml: texToHtml(item.explanation),
      };
    }
    return {
      ...base,
      mode: "self-score",
      answerSummaryHtml: texToHtml(item.answerSummary),
      modelSolutionHtml: texToHtml(item.modelSolution),
      rubric: item.rubric.map((l) => ({
        credits: l.credits,
        criteriaHtml: texToHtml(l.criteria),
      })),
    };
  });
}
