"use client";

import { useState } from "react";
import { Check } from "lucide-react";
import { Button, cn } from "@repo/ui";
import { grade, type PracticeQuestion } from "@cameronbrady/math-components/logic";
import { MathAnswerInput } from "./MathAnswerInput";

export interface SelfCheckProps {
  /** Lead-in label before the prompt. */
  label?: string;
  /** Notified after each graded attempt; the check itself records nothing. */
  onResult?: (result: { correct: boolean }) => void;
  question: PracticeQuestion;
  className?: string;
}

// A zero-stakes self-check (refreshers, worked-example gates): it grades with the
// pure grade() and records nothing — no progress imports, no storage. A
// student asking for help is never being measured.
export function SelfCheck({
  question,
  label = "Try it:",
  onResult,
  className,
}: SelfCheckProps) {
  const [response, setResponse] = useState("");
  const [result, setResult] = useState<{ correct: boolean } | undefined>();

  const solved = result?.correct === true;

  const check = () => {
    const parsed =
      question.type === "mc"
        ? Number.parseInt(response, 10)
        : Number.parseFloat(response);
    if (Number.isNaN(parsed)) return;
    const graded = grade(question, parsed);
    setResult(graded);
    onResult?.(graded);
  };

  return (
    <div className={cn("flex flex-col gap-3", className)}>
      <p className="text-sm font-medium text-foreground">
        {label} {question.prompt}
      </p>

      {question.type === "mc" ? (
        <fieldset
          className="flex flex-col gap-2"
          disabled={solved}
          aria-label={question.prompt}
        >
          {question.choices.map((choice, ci) => (
            <label
              key={ci}
              className="flex cursor-pointer items-center gap-3 rounded-md border border-border p-3 text-sm has-[:checked]:border-primary has-[:focus-visible]:ring-[3px] has-[:focus-visible]:ring-ring/50"
            >
              <input
                type="radio"
                name={`selfcheck-${question.id}`}
                value={ci}
                checked={response === String(ci)}
                onChange={() => setResponse(String(ci))}
                className="accent-primary"
              />
              {choice}
            </label>
          ))}
        </fieldset>
      ) : (
        <MathAnswerInput
          value={response}
          disabled={solved}
          onChange={(e) => setResponse(e.target.value)}
          aria-label={question.prompt}
          className="w-40 text-sm"
        />
      )}

      {!solved && (
        <Button onClick={check} className="self-start" size="sm">
          <Check aria-hidden="true" /> Check
        </Button>
      )}

      <div role="status" className="text-sm">
        {result &&
          (result.correct ? (
            <p className="text-primary">
              <span className="font-semibold">That&apos;s it! </span>
              {question.explanation}
            </p>
          ) : (
            <p className="text-muted-foreground">
              <span className="font-semibold">Not quite — try again. </span>
              {question.hints[0]}
            </p>
          ))}
      </div>
    </div>
  );
}
