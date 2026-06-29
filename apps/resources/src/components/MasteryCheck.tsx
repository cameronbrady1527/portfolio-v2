"use client";

import { useEffect, useMemo, useState } from "react";
import { BadgeCheck, Check, X } from "lucide-react";
import { Button, cn } from "@repo/ui";
import {
  grade,
  isMastered,
  loadProgress,
  recordMastery,
  saveProgress,
} from "@cameronbrady/math-components/logic";
import { resolveDeck } from "@/lib/foundations/decks";
import { MathAnswerInput } from "./MathAnswerInput";

// The hub's localStorage namespace (same key PracticeSet writes under).
const RESOURCES_PROGRESS_KEY = "resources:progress";

// One short, focused proof set — not the whole bank. The deck is the pool; a
// check draws this many, shown ONE AT A TIME so the "prove it" step never reads
// as an intimidating wall (the same "don't overwhelm" spine as the drill).
const MASTERY_COUNT = 8;

export interface MasteryCheckProps {
  /** Skill slug — the deck registry key AND the mastery slug. */
  skill: string;
  className?: string;
}

// Pass bar: clear every item in the set (advancing only on a correct answer).
// Zero-pressure — a miss just re-asks the same item, nothing locks, and the
// drill (step 4) stays the low-stakes warm-up.

export function MasteryCheck({ skill, className }: MasteryCheckProps) {
  const deck = useMemo(() => resolveDeck(skill), [skill]);
  const items = useMemo(
    () => deck.slice(0, Math.min(MASTERY_COUNT, deck.length)),
    [deck],
  );
  const total = items.length;

  const [current, setCurrent] = useState(0);
  const [response, setResponse] = useState("");
  const [outcome, setOutcome] = useState<{ correct: boolean } | null>(null);
  const [mastered, setMastered] = useState(false);

  // Reflect any already-earned ✓ on mount (refresh-safe).
  useEffect(() => {
    setMastered(isMastered(loadProgress(RESOURCES_PROGRESS_KEY), skill));
  }, [skill]);

  const question = items[current];
  const answered = outcome !== null;
  const correct = outcome?.correct === true;
  const isLast = current === total - 1;
  // Items before the active one are all cleared (you only advance on correct).
  const cleared = mastered ? total : current;

  function check() {
    if (answered) return;
    let value: number | string;
    if (question.type === "mc") value = Number.parseInt(response, 10);
    else if (question.type === "numeric") value = Number.parseFloat(response);
    else value = response;
    if (typeof value === "number" && Number.isNaN(value)) return;
    if (typeof value === "string" && value.trim() === "") return;

    const result = grade(question, value);
    setOutcome({ correct: result.correct });

    // Mastery is earned the moment the final item is cleared.
    if (result.correct && isLast) {
      const progress = loadProgress(RESOURCES_PROGRESS_KEY);
      saveProgress(RESOURCES_PROGRESS_KEY, recordMastery(progress, skill));
      setMastered(true);
    }
  }

  function next() {
    setCurrent((c) => Math.min(c + 1, total - 1));
    setResponse("");
    setOutcome(null);
  }

  function tryAgain() {
    setResponse("");
    setOutcome(null);
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!answered) check();
    else if (correct && !isLast) next();
    else if (!correct) tryAgain();
  }

  return (
    <section
      aria-label="Mastery check"
      className={cn("flex flex-col gap-4", className)}
    >
      {/* Status + progress: dots show the scope without listing every item. */}
      <div
        data-testid="mastery-status"
        role="status"
        aria-live="polite"
        className={cn(
          "flex flex-wrap items-center justify-between gap-3 rounded-md border px-3 py-2.5 text-sm font-medium",
          mastered
            ? "border-emerald-300 bg-emerald-50 text-emerald-800"
            : "border-border bg-muted/20 text-muted-foreground",
        )}
      >
        {mastered ? (
          <span className="flex items-center gap-2">
            <BadgeCheck aria-hidden className="size-4 shrink-0" />
            Mastered — you can revisit these any time.
          </span>
        ) : (
          <span>
            Question {current + 1} of {total}
          </span>
        )}
        <span aria-hidden className="flex items-center gap-1.5">
          {items.map((item, i) => (
            <span
              key={item.id}
              className={cn(
                "size-2 rounded-full",
                i < cleared
                  ? "bg-emerald-600"
                  : i === current && !mastered
                    ? "bg-primary"
                    : "bg-border",
              )}
            />
          ))}
        </span>
      </div>

      {/* The active item — one at a time. */}
      {mastered ? null : (
        <form
          onSubmit={onSubmit}
          className="flex flex-col gap-3 rounded-lg border border-border bg-card p-4"
        >
          <p className="text-sm font-medium text-foreground">
            {question.prompt}
            {question.difficulty === "stretch" ? (
              <span className="ml-2 rounded-full bg-muted px-2 py-0.5 align-middle font-mono text-[0.65rem] uppercase tracking-wide text-muted-foreground">
                stretch
              </span>
            ) : null}
          </p>

          {question.type === "mc" ? (
            <fieldset
              className="flex flex-col gap-2"
              disabled={correct}
              aria-label={`Answer to ${question.prompt}`}
            >
              {question.choices.map((choice, ci) => (
                <label
                  key={ci}
                  className="flex cursor-pointer items-center gap-3 rounded-md border border-border p-2.5 text-sm has-[:checked]:border-primary"
                >
                  <input
                    type="radio"
                    name={`mastery-${question.id}`}
                    value={ci}
                    checked={Number.parseInt(response, 10) === ci}
                    onChange={(e) => setResponse(e.target.value)}
                    className="size-4 accent-primary"
                  />
                  <span>{choice}</span>
                </label>
              ))}
            </fieldset>
          ) : (
            <div className="flex flex-wrap items-center gap-2">
              <label htmlFor={`mastery-${question.id}`} className="sr-only">
                {`Answer to ${question.prompt}`}
              </label>
              <MathAnswerInput
                id={`mastery-${question.id}`}
                disabled={correct}
                value={response}
                onChange={(e) => setResponse(e.target.value)}
                placeholder="Your answer"
                className="w-44 text-sm"
              />
              {"unit" in question && question.unit ? (
                <span className="text-sm text-muted-foreground">
                  {question.unit}
                </span>
              ) : null}
            </div>
          )}

          <div className="flex flex-wrap items-center gap-2">
            {!answered ? (
              <Button type="submit" size="sm">
                Check
              </Button>
            ) : correct && !isLast ? (
              <Button type="submit" size="sm">
                Next question
              </Button>
            ) : !correct ? (
              <Button type="submit" size="sm" variant="outline">
                Try again
              </Button>
            ) : null}
          </div>

          {/* Color-independent feedback: icon + explicit text. A miss does NOT
              reveal the answer — the retry has to be earned. */}
          {answered ? (
            <div className="flex flex-col gap-1.5" data-testid="mastery-feedback">
              <p
                role="status"
                className={cn(
                  "flex items-center gap-2 text-sm font-medium",
                  correct ? "text-emerald-700" : "text-rose-700",
                )}
              >
                {correct ? (
                  <Check aria-hidden className="size-4" />
                ) : (
                  <X aria-hidden className="size-4" />
                )}
                <span>{correct ? "Correct" : "Not yet — try again"}</span>
              </p>
              {correct ? (
                <p className="text-sm text-muted-foreground">
                  {question.explanation}
                </p>
              ) : null}
            </div>
          ) : null}
        </form>
      )}
    </section>
  );
}
