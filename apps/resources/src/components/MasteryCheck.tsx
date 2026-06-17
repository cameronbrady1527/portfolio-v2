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
import { resolveDeck, type DeckItem } from "@/lib/foundations/decks";

// The hub's localStorage namespace (same key PracticeSet writes under).
const RESOURCES_PROGRESS_KEY = "resources:progress";

export interface MasteryCheckProps {
  /** Skill slug — the deck registry key AND the mastery slug. */
  skill: string;
  className?: string;
}

// Pass bar: EVERY deck item answered correctly (in any order, with retries).
// These are the harder "prove it" items, so the bar is full mastery — but the
// check is zero-pressure: nothing locks, wrong answers are immediately
// re-answerable, and the drill (step 4) stays the low-stakes warm-up.

type ItemUi = { response: string; result?: { correct: boolean } };

function freshItem(): ItemUi {
  return { response: "" };
}

export function MasteryCheck({ skill, className }: MasteryCheckProps) {
  const deck = useMemo(() => resolveDeck(skill), [skill]);

  const [ui, setUi] = useState<Record<string, ItemUi>>(() =>
    Object.fromEntries(deck.map((q) => [q.id, freshItem()])),
  );
  const [mastered, setMastered] = useState(false);

  // Reflect any already-earned ✓ on mount (refresh-safe).
  useEffect(() => {
    setMastered(isMastered(loadProgress(RESOURCES_PROGRESS_KEY), skill));
  }, [skill]);

  const correctCount = deck.filter(
    (q) => ui[q.id]?.result?.correct === true,
  ).length;

  function setResponse(id: string, response: string) {
    setUi((prev) => ({
      ...prev,
      [id]: { ...(prev[id] ?? freshItem()), response },
    }));
  }

  function reset(id: string) {
    setUi((prev) => ({ ...prev, [id]: freshItem() }));
  }

  function check(question: DeckItem) {
    const state = ui[question.id] ?? freshItem();
    let response: number | string;
    if (question.type === "mc") response = Number.parseInt(state.response, 10);
    else if (question.type === "numeric")
      response = Number.parseFloat(state.response);
    else response = state.response;
    if (typeof response === "number" && Number.isNaN(response)) return;
    if (typeof response === "string" && response.trim() === "") return;

    const result = grade(question, response);
    const nextUi = {
      ...ui,
      [question.id]: { ...state, result },
    };
    setUi(nextUi);

    // If this was the final missing piece, record mastery.
    const nowAll = deck.every((q) => nextUi[q.id]?.result?.correct === true);
    if (nowAll) {
      const progress = loadProgress(RESOURCES_PROGRESS_KEY);
      saveProgress(RESOURCES_PROGRESS_KEY, recordMastery(progress, skill));
      setMastered(true);
    }
  }

  return (
    <section
      aria-label="Mastery check"
      className={cn("flex flex-col gap-4", className)}
    >
      <p
        data-testid="mastery-status"
        role="status"
        aria-live="polite"
        className={cn(
          "flex items-center gap-2 rounded-md border px-3 py-2.5 text-sm font-medium",
          mastered
            ? "border-emerald-300 bg-emerald-50 text-emerald-800"
            : "border-border bg-muted/20 text-muted-foreground",
        )}
      >
        {mastered ? (
          <>
            <BadgeCheck aria-hidden className="size-4 shrink-0" />
            <span>Mastered — you can revisit these any time.</span>
          </>
        ) : (
          <span>
            Answer all {deck.length} correctly to earn mastery ({correctCount}/
            {deck.length}).
          </span>
        )}
      </p>

      <ol className="flex list-none flex-col gap-4">
        {deck.map((question, i) => (
          <li key={question.id}>
            <MasteryItem
              question={question}
              index={i}
              state={ui[question.id] ?? freshItem()}
              onResponse={(r) => setResponse(question.id, r)}
              onCheck={() => check(question)}
              onRetry={() => reset(question.id)}
            />
          </li>
        ))}
      </ol>
    </section>
  );
}

function MasteryItem({
  question,
  index,
  state,
  onResponse,
  onCheck,
  onRetry,
}: {
  question: DeckItem;
  index: number;
  state: ItemUi;
  onResponse: (response: string) => void;
  onCheck: () => void;
  onRetry: () => void;
}) {
  const answered = state.result !== undefined;
  const correct = state.result?.correct === true;
  const inputId = `mastery-${question.id}`;
  const label = `Answer to ${question.prompt}`;

  return (
    <div className="flex flex-col gap-3 rounded-lg border border-border bg-card p-4">
      <p className="text-sm font-medium text-foreground">
        <span className="mr-2 font-mono text-muted-foreground">
          {index + 1}.
        </span>
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
          disabled={answered && correct}
          aria-label={label}
        >
          {question.choices.map((choice, ci) => (
            <label
              key={ci}
              className="flex cursor-pointer items-center gap-3 rounded-md border border-border p-2.5 text-sm has-[:checked]:border-primary"
            >
              <input
                type="radio"
                name={inputId}
                value={ci}
                checked={Number.parseInt(state.response, 10) === ci}
                onChange={(e) => onResponse(e.target.value)}
                className="size-4 accent-primary"
              />
              <span>{choice}</span>
            </label>
          ))}
        </fieldset>
      ) : (
        <div className="flex flex-wrap items-center gap-2">
          <label htmlFor={inputId} className="sr-only">
            {label}
          </label>
          <input
            id={inputId}
            type="text"
            inputMode={question.type === "numeric" ? "text" : undefined}
            autoComplete="off"
            disabled={answered && correct}
            value={state.response}
            onChange={(e) => onResponse(e.target.value)}
            placeholder="Your answer"
            className="w-44 rounded-md border border-border bg-background px-3 py-2 font-mono text-sm outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:opacity-60"
          />
          {"unit" in question && question.unit ? (
            <span className="text-sm text-muted-foreground">
              {question.unit}
            </span>
          ) : null}
        </div>
      )}

      <div className="flex flex-wrap items-center gap-2">
        {!correct ? (
          <Button type="button" size="sm" onClick={onCheck}>
            Check
          </Button>
        ) : null}
        {answered && !correct ? (
          <Button type="button" size="sm" variant="outline" onClick={onRetry}>
            Try again
          </Button>
        ) : null}
      </div>

      {/* Color-independent feedback: icon + explicit text. */}
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
    </div>
  );
}
