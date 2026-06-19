import type { MDXComponents } from "mdx/types";
import { Refresher } from "@/components/Refresher";
import { Step, WorkedExample } from "@/components/WorkedExample";
import { PredictThenCheck } from "@/components/PredictThenCheck";
import { SkillCard, SkillStep } from "@/components/SkillCard";
import { Term } from "@/components/Term";
import { AngleCrossing, TransversalPattern, Takeaway } from "@/components/AngleDiagrams";
import { NumberLine } from "@/components/NumberLine";
import { FractionBar } from "@/components/FractionBar";
import {
  TriangleAngles,
  AngleSumStrip,
  ExteriorAngleFig,
  MidsegmentFig,
  TriangleInequalityFig,
  IsoscelesFig,
} from "@/components/TriangleDiagrams";

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
    SkillCard,
    SkillStep,
    Term,
    AngleCrossing,
    TransversalPattern,
    Takeaway,
    NumberLine,
    FractionBar,
    TriangleAngles,
    AngleSumStrip,
    ExteriorAngleFig,
    MidsegmentFig,
    TriangleInequalityFig,
    IsoscelesFig,
    ...components,
  };
}
