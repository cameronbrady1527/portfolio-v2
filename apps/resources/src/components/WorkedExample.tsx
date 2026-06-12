"use client";

import {
  Children,
  isValidElement,
  useReducer,
  type ReactElement,
  type ReactNode,
} from "react";
import { ChevronDown } from "lucide-react";
import { Button, Card, CardContent, CardHeader, CardTitle } from "@repo/ui";
import { canReveal, init, reduce } from "@/lib/worked-example";
import type { PracticeQuestion } from "@/lib/practice/grade";
import { SelfCheck } from "./SelfCheck";

export interface StepProps {
  /** Optional self-check gating the next reveal (zero-stakes, never recorded). */
  check?: PracticeQuestion;
  children: ReactNode;
}

/** One step of a worked example. Rendering is orchestrated by <WorkedExample>. */
export function Step({ children }: StepProps) {
  return <div className="text-sm leading-relaxed">{children}</div>;
}

export interface WorkedExampleProps {
  title: string;
  children: ReactNode;
}

export function WorkedExample({ title, children }: WorkedExampleProps) {
  const steps = Children.toArray(children).filter(
    (c): c is ReactElement<StepProps> => isValidElement(c),
  );
  const [state, dispatch] = useReducer(
    reduce,
    steps.map((s) => ({ gated: s.props.check !== undefined })),
    init,
  );

  return (
    <Card className="my-6">
      <CardHeader>
        <CardTitle className="text-base font-medium">
          Worked example: {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <ol className="flex list-none flex-col gap-4">
          {steps.slice(0, state.revealed).map((step, i) => (
            <li key={i} className="flex flex-col gap-3">
              <div className="flex gap-3">
                <span aria-hidden="true" className="font-mono text-sm text-muted-foreground">
                  {i + 1}.
                </span>
                {step}
              </div>
              {step.props.check && i === state.revealed - 1 && i < steps.length - 1 && (
                <SelfCheck
                  question={step.props.check}
                  label="Before the next step:"
                  onResult={(r) => dispatch({ type: "answer", correct: r.correct })}
                  className="ml-7"
                />
              )}
            </li>
          ))}
        </ol>

        {state.revealed < steps.length && (
          <Button
            size="sm"
            className="self-start"
            disabled={!canReveal(state)}
            onClick={() => dispatch({ type: "reveal" })}
          >
            <ChevronDown aria-hidden="true" /> Next step
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
