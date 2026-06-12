"use client";

import { useState, type ReactNode } from "react";
import { Eye } from "lucide-react";
import { Button, Card, CardContent, cn } from "@repo/ui";

export interface PredictThenCheckProps {
  /** The prediction question posed before the reveal. */
  prompt: string;
  choices: string[];
  /** The reveal: an interactive, a figure, or prose. */
  children: ReactNode;
  className?: string;
}

// unanswered → predicted → revealed, with a soft skip (unanswered → revealed,
// no prediction). Commit-before-see is the pedagogy: the surprise of being
// right or wrong is what makes the idea stick. Nothing is recorded.
type Phase =
  | { name: "unanswered" }
  | { name: "revealed"; prediction?: string };

export function PredictThenCheck({
  prompt,
  choices,
  children,
  className,
}: PredictThenCheckProps) {
  const [choice, setChoice] = useState("");
  const [phase, setPhase] = useState<Phase>({ name: "unanswered" });

  if (phase.name === "revealed") {
    return (
      <div className={cn("my-6 flex flex-col gap-3", className)}>
        {phase.prediction !== undefined ? (
          <p className="text-sm font-medium text-foreground" role="status">
            You predicted: {phase.prediction}
          </p>
        ) : (
          <p className="text-sm text-muted-foreground" role="status">
            No prediction — see for yourself:
          </p>
        )}
        {children}
      </div>
    );
  }

  return (
    <Card className={cn("my-6", className)}>
      <CardContent className="flex flex-col gap-3 pt-6">
        <p className="text-sm font-medium text-foreground">
          Make a prediction: {prompt}
        </p>
        <fieldset className="flex flex-col gap-2" aria-label={prompt}>
          {choices.map((c, i) => (
            <label
              key={i}
              className="flex cursor-pointer items-center gap-3 rounded-md border border-border p-3 text-sm has-[:checked]:border-primary has-[:focus-visible]:ring-[3px] has-[:focus-visible]:ring-ring/50"
            >
              <input
                type="radio"
                name={`predict-${prompt}`}
                value={c}
                checked={choice === c}
                onChange={() => setChoice(c)}
                className="accent-primary"
              />
              {c}
            </label>
          ))}
        </fieldset>
        <div className="flex items-center gap-4">
          <Button
            size="sm"
            disabled={choice === ""}
            onClick={() => setPhase({ name: "revealed", prediction: choice })}
          >
            <Eye aria-hidden="true" /> Lock in my prediction
          </Button>
          <button
            type="button"
            className="text-xs text-muted-foreground underline-offset-2 hover:underline focus-visible:ring-[3px] focus-visible:ring-ring/50"
            onClick={() => setPhase({ name: "revealed" })}
          >
            Skip to the answer
          </button>
        </div>
      </CardContent>
    </Card>
  );
}
