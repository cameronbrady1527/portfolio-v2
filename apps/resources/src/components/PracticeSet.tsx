"use client";

import { useEffect, useMemo, useState } from "react";
import { Check, Lightbulb, X } from "lucide-react";
import { Button, Card, CardContent, CardHeader, CardTitle, cn } from "@repo/ui";
import {
  grade,
  getTopic,
  loadProgress,
  recordAnswer,
  saveProgress,
  type PracticeQuestion,
  type Progress,
} from "@cameronbrady/math-components/logic";
import { useTopicSlug } from "@/lib/topic-context";

// The hub's localStorage namespace. The package's progress adapter is
// key-agnostic; the hub owns and passes this key to preserve existing data.
const RESOURCES_PROGRESS_KEY = "resources:progress";

export interface PracticeSetProps {
  questions: PracticeQuestion[];
  topic?: string; // defaults to useTopicSlug(); explicit override allowed
  className?: string;
}

// Per-question UI state, distinct from the persisted answer record. The
// response is the chosen index (mc) or the entered string (numeric).
type QuestionUiState = {
  response: string;
  hintsShown: number;
  result?: { correct: boolean };
};

function freshUi(): QuestionUiState {
  return { response: "", hintsShown: 0 };
}

export function PracticeSet({ questions, topic, className }: PracticeSetProps) {
  const contextSlug = useTopicSlug();
  const slug = topic ?? contextSlug;

  const [ui, setUi] = useState<Record<string, QuestionUiState>>(() =>
    Object.fromEntries(questions.map((q) => [q.id, freshUi()])),
  );

  // Restore answered state from storage on mount (refresh-safe).
  useEffect(() => {
    if (!slug) return;
    const progress = loadProgress(RESOURCES_PROGRESS_KEY);
    const stored = getTopic(progress, slug);
    setUi((prev) => {
      const next = { ...prev };
      for (const q of questions) {
        const record = stored.answers[q.id];
        if (record) {
          next[q.id] = {
            ...(next[q.id] ?? freshUi()),
            result: { correct: record.correct },
          };
        }
      }
      return next;
    });
    // questions identity is stable for a given mounted set; slug drives reload.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

  const score = useMemo(() => {
    const answered = questions.filter((q) => ui[q.id]?.result);
    return {
      correct: answered.filter((q) => ui[q.id]?.result?.correct).length,
      answered: answered.length,
      total: questions.length,
    };
  }, [questions, ui]);

  const getState = (id: string) => ui[id] ?? freshUi();

  const setResponse = (id: string, response: string) =>
    setUi((prev) => ({
      ...prev,
      [id]: { ...getStateFrom(prev, id), response },
    }));

  const revealHint = (id: string) =>
    setUi((prev) => {
      const s = getStateFrom(prev, id);
      return { ...prev, [id]: { ...s, hintsShown: s.hintsShown + 1 } };
    });

  const check = (question: PracticeQuestion) => {
    const state = getState(question.id);
    // mc/numeric grade on a number; expression/equation grade on the raw text.
    let response: number | string;
    if (question.type === "mc") {
      response = Number.parseInt(state.response, 10);
    } else if (question.type === "numeric") {
      response = Number.parseFloat(state.response);
    } else {
      response = state.response;
    }
    if (typeof response === "number" && Number.isNaN(response)) return;
    if (typeof response === "string" && response.trim() === "") return;

    const result = grade(question, response);

    setUi((prev) => ({
      ...prev,
      [question.id]: { ...getStateFrom(prev, question.id), result },
    }));

    // Persist this answer (and completion) under the topic slug.
    if (slug) {
      const progress: Progress = loadProgress(RESOURCES_PROGRESS_KEY);
      const next = recordAnswer(
        progress,
        slug,
        question.id,
        result.correct,
        questions.length,
      );
      saveProgress(RESOURCES_PROGRESS_KEY, next);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)}>
      <div className="flex items-center justify-between">
        <h2 className="font-display text-2xl font-semibold text-foreground">
          Practice
        </h2>
        <p
          className="font-mono text-sm text-muted-foreground"
          aria-live="polite"
          data-testid="practice-score"
        >
          Score: {score.correct}/{score.total}
        </p>
      </div>

      <ol className="flex list-none flex-col gap-6">
        {questions.map((question, i) => (
          <li key={question.id}>
            <QuestionCard
              question={question}
              index={i}
              state={getState(question.id)}
              onResponse={(r) => setResponse(question.id, r)}
              onRevealHint={() => revealHint(question.id)}
              onCheck={() => check(question)}
            />
          </li>
        ))}
      </ol>
    </div>
  );
}

function getStateFrom(
  map: Record<string, QuestionUiState>,
  id: string,
): QuestionUiState {
  return map[id] ?? freshUi();
}

function QuestionCard({
  question,
  index,
  state,
  onResponse,
  onRevealHint,
  onCheck,
}: {
  question: PracticeQuestion;
  index: number;
  state: QuestionUiState;
  onResponse: (response: string) => void;
  onRevealHint: () => void;
  onCheck: () => void;
}) {
  const answered = state.result !== undefined;
  const correct = state.result?.correct === true;
  const hasMoreHints = state.hintsShown < question.hints.length;
  const radioName = `q-${question.id}`;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base font-medium">
          <span className="mr-2 font-mono text-muted-foreground">
            {index + 1}.
          </span>
          {question.prompt}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        {question.type === "mc" ? (
          <fieldset
            className="flex flex-col gap-2"
            disabled={answered}
            aria-label={question.prompt}
          >
            {question.choices.map((choice, ci) => (
              <label
                key={ci}
                className="flex cursor-pointer items-center gap-3 rounded-md border border-border p-3 text-sm has-[:checked]:border-primary has-[:focus-visible]:ring-[3px] has-[:focus-visible]:ring-ring/50"
              >
                <input
                  type="radio"
                  name={radioName}
                  value={ci}
                  checked={Number.parseInt(state.response, 10) === ci}
                  onChange={(e) => onResponse(e.target.value)}
                  className="size-4 accent-primary"
                />
                <span>{choice}</span>
              </label>
            ))}
          </fieldset>
        ) : question.type === "numeric" ? (
          <div className="flex items-center gap-2">
            <label
              htmlFor={`input-${question.id}`}
              className="text-sm text-muted-foreground"
            >
              Answer
            </label>
            <input
              id={`input-${question.id}`}
              type="text"
              inputMode="text"
              autoComplete="off"
              disabled={answered}
              value={state.response}
              onChange={(e) => onResponse(e.target.value)}
              className="w-32 rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:opacity-50"
            />
            {question.unit ? (
              <span className="text-sm text-muted-foreground">
                {question.unit}
              </span>
            ) : null}
          </div>
        ) : (
          // expression | equation: free-form input, judged by equivalence.
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor={`input-${question.id}`}
              className="text-sm text-muted-foreground"
            >
              Your answer
            </label>
            <input
              id={`input-${question.id}`}
              type="text"
              inputMode="text"
              autoComplete="off"
              autoCapitalize="off"
              spellCheck={false}
              disabled={answered}
              value={state.response}
              onChange={(e) => onResponse(e.target.value)}
              placeholder={
                question.type === "equation" ? "e.g. y = 2x + 1" : "e.g. 2x + 3"
              }
              className="w-full max-w-sm rounded-md border border-border bg-background px-3 py-2 font-mono text-sm outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:opacity-50"
            />
            <p className="text-xs text-muted-foreground">
              Any equivalent form is accepted. Use <code>^</code> for powers and{" "}
              <code>*</code> for multiply (or just write <code>2x</code>).
            </p>
          </div>
        )}

        {/* Progressive hints — one at a time. */}
        {state.hintsShown > 0 ? (
          <ul className="flex flex-col gap-1 rounded-md bg-muted/40 p-3 text-sm text-muted-foreground">
            {question.hints.slice(0, state.hintsShown).map((hint, hi) => (
              <li key={hi} className="flex items-start gap-2">
                <Lightbulb aria-hidden className="mt-0.5 size-4 shrink-0" />
                <span>{hint}</span>
              </li>
            ))}
          </ul>
        ) : null}

        <div className="flex flex-wrap items-center gap-2">
          {!answered ? (
            <>
              <Button type="button" onClick={onCheck}>
                Check
              </Button>
              {hasMoreHints ? (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={onRevealHint}
                >
                  <Lightbulb aria-hidden />
                  {state.hintsShown === 0 ? "Show a hint" : "Another hint"}
                </Button>
              ) : null}
            </>
          ) : null}
        </div>

        {/* Color-independent feedback: icon + explicit text label. */}
        {answered ? (
          <div className="flex flex-col gap-2" data-testid="feedback">
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
              <span>{correct ? "Correct" : "Incorrect"}</span>
            </p>
            <p className="text-sm text-muted-foreground">
              <span className="font-medium text-foreground">Explanation: </span>
              {question.explanation}
            </p>
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}
