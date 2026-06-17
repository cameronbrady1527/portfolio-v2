"use client";

import { useEffect, useReducer, useState } from "react";
import { Check, Sparkles, X } from "lucide-react";
import { Button, cn } from "@repo/ui";
import {
  DEFAULT_FLUENCY_THRESHOLD,
  fluencyReducer,
  grade,
  initFluency,
  mulberry32,
  type Problem,
  type ProblemGenerator,
} from "@cameronbrady/math-components/logic";

export interface DrillProps {
  /** The pure generator that produces each fresh problem. */
  generator: ProblemGenerator;
  /** Difficulty level handed to the generator (1 = easiest). */
  level?: number;
  /** Consecutive correct answers that count as fluent. */
  fluencyThreshold?: number;
  /** Test/authoring seam: a fixed seed makes the sequence reproducible. When
   *  omitted, each visit reseeds for variety (after mount, hydration-safe). */
  seed?: number;
  className?: string;
}

// A stable default seed renders the same first problem on the server and on the
// first client paint (no hydration mismatch); when no explicit seed is given we
// reseed on mount for session-to-session variety.
const DEFAULT_SEED = 0x1f2e3d4c;

type Round = { rng: () => number; problem: Problem };

function firstRound(generator: ProblemGenerator, level: number, seed: number): Round {
  const rng = mulberry32(seed);
  return { rng, problem: generator(level, rng) };
}

type Outcome = { correct: boolean; answer: number | string } | null;

export function Drill({
  generator,
  level = 1,
  fluencyThreshold = DEFAULT_FLUENCY_THRESHOLD,
  seed,
  className,
}: DrillProps) {
  const [round, setRound] = useState<Round>(() =>
    firstRound(generator, level, seed ?? DEFAULT_SEED),
  );
  const [input, setInput] = useState("");
  const [outcome, setOutcome] = useState<Outcome>(null);
  const [fluency, dispatch] = useReducer(fluencyReducer, fluencyThreshold, initFluency);

  // Reseed for variety once mounted (skipped when a seed is pinned).
  useEffect(() => {
    if (seed !== undefined) return;
    setRound(firstRound(generator, level, (Math.random() * 2 ** 32) >>> 0));
    setInput("");
    setOutcome(null);
    // Run once on mount; generator/level are stable for a mounted drill.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { problem } = round;
  const answered = outcome !== null;
  const accuracy =
    fluency.attempts === 0
      ? 0
      : Math.round((fluency.correct / fluency.attempts) * 100);

  function check() {
    if (answered || input.trim() === "") return;
    const response =
      problem.type === "numeric" ? Number.parseFloat(input) : input;
    if (typeof response === "number" && Number.isNaN(response)) return;
    const result = grade(problem, response);
    setOutcome({ correct: result.correct, answer: problem.answer });
    dispatch({ type: result.correct ? "correct" : "incorrect" });
  }

  function next() {
    setInput("");
    setOutcome(null);
    setRound((r) => ({ rng: r.rng, problem: generator(level, r.rng) }));
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (answered) next();
    else check();
  }

  return (
    <section
      aria-label="Practice drill"
      className={cn(
        "flex flex-col gap-5 rounded-lg border border-border bg-card p-5",
        className,
      )}
    >
      {/* Live stats: streak, accuracy, fluency. Color-independent. */}
      <div
        className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm"
        aria-live="polite"
      >
        <span className="flex items-baseline gap-1.5">
          <span className="text-muted-foreground">Streak</span>
          <span
            data-testid="drill-streak"
            className="font-mono text-base font-semibold text-foreground"
          >
            {fluency.streak}
          </span>
          <span className="text-muted-foreground">/ {fluency.threshold}</span>
        </span>
        <span className="flex items-baseline gap-1.5">
          <span className="text-muted-foreground">Accuracy</span>
          <span className="font-mono text-base font-semibold text-foreground">
            {accuracy}%
          </span>
          <span className="text-muted-foreground">
            ({fluency.correct}/{fluency.attempts})
          </span>
        </span>
        {fluency.fluent ? (
          <span className="flex items-center gap-1.5 font-medium text-emerald-700">
            <Sparkles aria-hidden className="size-4" />
            Fluent
          </span>
        ) : null}
      </div>

      {/* One problem at a time — never overwhelm. */}
      <form onSubmit={onSubmit} className="flex flex-col gap-4">
        <p
          data-testid="drill-prompt"
          className="font-mono text-3xl font-semibold tracking-tight text-foreground"
        >
          {problem.prompt}
        </p>

        <div className="flex flex-wrap items-center gap-2">
          <label htmlFor="drill-answer" className="sr-only">
            Your answer
          </label>
          <input
            id="drill-answer"
            type="text"
            inputMode="numeric"
            autoComplete="off"
            autoFocus
            disabled={answered}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your answer"
            className="w-44 rounded-md border border-border bg-background px-3 py-2 font-mono text-base outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:opacity-60"
          />
          {!answered ? (
            <Button type="submit" disabled={input.trim() === ""}>
              Check
            </Button>
          ) : (
            <Button type="submit" autoFocus>
              Next problem
            </Button>
          )}
        </div>
      </form>

      {/* Instant, color-independent feedback + the worked result. */}
      {answered ? (
        <div className="flex flex-col gap-1" role="status">
          <p
            className={cn(
              "flex items-center gap-2 text-sm font-semibold",
              outcome.correct ? "text-emerald-700" : "text-rose-700",
            )}
          >
            {outcome.correct ? (
              <Check aria-hidden className="size-4" />
            ) : (
              <X aria-hidden className="size-4" />
            )}
            <span>{outcome.correct ? "Correct" : "Not quite"}</span>
          </p>
          <p className="text-sm text-muted-foreground">{problem.explanation}</p>
        </div>
      ) : null}
    </section>
  );
}
