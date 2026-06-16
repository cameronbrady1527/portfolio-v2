import type { MDXComponents } from "mdx/types";
import { Refresher } from "@/components/Refresher";
import { Step, WorkedExample } from "@/components/WorkedExample";
import { PredictThenCheck } from "@/components/PredictThenCheck";
import { Term } from "@/components/Term";
import { AngleCrossing, TransversalPattern, Takeaway } from "@/components/AngleDiagrams";

// Required by @next/mdx in the App Router. Topic prose inherits the global
// typographic styles from globals.css; per-element overrides can be added here.
// Support components are registered globally so topic authors use them as
// bare tags with zero import boilerplate (same-night authoring).
export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    Refresher,
    WorkedExample,
    Step,
    PredictThenCheck,
    Term,
    AngleCrossing,
    TransversalPattern,
    Takeaway,
    ...components,
  };
}
