"use client";

import { useEffect, useMemo, useState } from "react";
import { Check, ChevronDown, Info, X } from "lucide-react";
import { Button, cn } from "@repo/ui";
import type {
  PreparedMcItem,
  PreparedRegentsItem,
  PreparedSelfScoreItem,
} from "@/lib/regents/prepare";
import {
  overallReadiness,
  type CreditAttempt,
  type ReadinessBand,
} from "@/lib/regents/readiness";
import {
  loadRegentsProgress,
  recordAttempt,
  saveRegentsProgress,
} from "@/lib/regents/store";

// localStorage namespace for Regents self-scored progress (mirrors the
// Foundations "resources:progress" key, kept separate since credit is partial).
const REGENTS_PROGRESS_KEY = "resources:regents";

// The Regents bank experience: real released items, one at a time. Multiple
// choice is auto-graded; constructed-response is ATTEMPT-GATED then SELF-SCORED
// against the official NYSED rubric beside an authored model solution — because
// show-your-work can't be auto-graded, and learning HOW points are awarded is
// the skill. Readiness is reported as a per-standard band + a projected exam
// level, never a pass/fail verdict. Math arrives pre-rendered to HTML from the
// server (no client KaTeX).

const BAND_LABEL: Record<ReadinessBand, string> = {
  "not-started": "Not started",
  developing: "Developing",
  approaching: "Approaching",
  proficient: "Proficient",
  mastery: "Mastery",
};

/** Render server-prepared math/prose HTML (trusted: authored, build-rendered). */
function Html({ html, className }: { html: string; className?: string }) {
  return <span className={className} dangerouslySetInnerHTML={{ __html: html }} />;
}

export interface SelfScoreProps {
  /** Bank items with math pre-rendered to HTML (see lib/regents/prepare). */
  items: PreparedRegentsItem[];
  className?: string;
}

export function SelfScore({ items, className }: SelfScoreProps) {
  const total = items.length;

  const [index, setIndex] = useState(0);
  const [attempts, setAttempts] = useState<Record<string, CreditAttempt>>({});
  const [revealed, setRevealed] = useState<Record<string, boolean>>({});
  const [mcChoice, setMcChoice] = useState<Record<string, number>>({});
  const [showInfo, setShowInfo] = useState(false);

  const item = items[index];
  const attempt = attempts[item.id];
  const readiness = useMemo(
    () => overallReadiness(Object.values(attempts)),
    [attempts],
  );

  // Hydrate this bank's recorded attempts from localStorage on mount, so
  // readiness survives a reload. Filtered to THIS widget's items (the store may
  // hold other banks too). Runs client-side only — never during SSR.
  const itemIds = useMemo(() => new Set(items.map((i) => i.id)), [items]);
  useEffect(() => {
    const stored = loadRegentsProgress(REGENTS_PROGRESS_KEY).attempts;
    const mine = Object.values(stored).filter((a) => itemIds.has(a.itemId));
    if (mine.length > 0) {
      setAttempts(Object.fromEntries(mine.map((a) => [a.itemId, a])));
    }
  }, [itemIds]);

  function record(earned: number) {
    const next: CreditAttempt = {
      itemId: item.id,
      standard: item.standard,
      earned,
      max: item.credits,
    };
    setAttempts((a) => ({ ...a, [item.id]: next }));
    saveRegentsProgress(
      REGENTS_PROGRESS_KEY,
      recordAttempt(loadRegentsProgress(REGENTS_PROGRESS_KEY), next),
    );
  }

  // Clear THIS bank's recorded attempts (so the set can be practiced again),
  // leaving any other bank's stored progress intact.
  function reset() {
    setAttempts({});
    setRevealed({});
    setMcChoice({});
    const stored = loadRegentsProgress(REGENTS_PROGRESS_KEY);
    const kept = Object.fromEntries(
      Object.entries(stored.attempts).filter(([id]) => !itemIds.has(id)),
    );
    saveRegentsProgress(REGENTS_PROGRESS_KEY, { ...stored, attempts: kept });
  }

  return (
    <section
      aria-label="Regents practice"
      className={cn("flex flex-col gap-4", className)}
    >
      {/* Progress + topic. Topic label is primary; the standard code is secondary. */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="text-sm text-muted-foreground">
          Question {index + 1} of {total}
        </span>
        <span aria-hidden className="flex items-center gap-1.5">
          {items.map((it, i) => (
            <span
              key={it.id}
              className={cn(
                "size-2 rounded-full",
                attempts[it.id]
                  ? attempts[it.id].earned === it.credits
                    ? "bg-emerald-600"
                    : "bg-amber-500"
                  : i === index
                    ? "bg-primary"
                    : "bg-border",
              )}
            />
          ))}
        </span>
      </div>

      <article className="flex flex-col gap-3 rounded-lg border border-border bg-card p-4">
        <header className="flex flex-col gap-1">
          <h2 className="text-sm font-semibold text-foreground">{item.topic}</h2>
          <button
            type="button"
            onClick={() => setShowInfo((s) => !s)}
            aria-expanded={showInfo}
            className="flex w-fit items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
          >
            <Info aria-hidden className="size-3.5" />
            Exam info
            <ChevronDown
              aria-hidden
              className={cn("size-3.5 transition-transform", showInfo && "rotate-180")}
            />
          </button>
          {showInfo ? (
            <p className="text-xs text-muted-foreground">
              {item.standard} · Part {item.part} · {item.credits}{" "}
              {item.credits === 1 ? "credit" : "credits"} ·{" "}
              <span className="font-mono">{item.examCitation}</span>
            </p>
          ) : null}
        </header>

        <Html className="text-sm text-foreground" html={item.promptHtml} />

        {item.mode === "mc" ? (
          <McBody
            item={item}
            choice={mcChoice[item.id]}
            answered={attempt !== undefined}
            correct={attempt ? attempt.earned === item.credits : false}
            onChoose={(ci) => setMcChoice((m) => ({ ...m, [item.id]: ci }))}
            onCheck={() =>
              record(mcChoice[item.id] === item.answer ? item.credits : 0)
            }
          />
        ) : (
          <SelfScoreBody
            item={item}
            revealed={revealed[item.id] === true || attempt !== undefined}
            earned={attempt?.earned}
            onReveal={() => setRevealed((r) => ({ ...r, [item.id]: true }))}
            onScore={record}
          />
        )}
      </article>

      {/* Navigation */}
      <div className="flex items-center justify-between gap-2">
        <Button
          type="button"
          size="sm"
          variant="outline"
          disabled={index === 0}
          onClick={() => setIndex((i) => Math.max(0, i - 1))}
        >
          Previous
        </Button>
        <Button
          type="button"
          size="sm"
          variant="outline"
          disabled={index === total - 1}
          onClick={() => setIndex((i) => Math.min(total - 1, i + 1))}
        >
          Next
        </Button>
      </div>

      <ReadinessPanel
        readiness={readiness}
        answered={Object.keys(attempts).length}
        onReset={reset}
      />
    </section>
  );
}

function McBody({
  item,
  choice,
  answered,
  correct,
  onChoose,
  onCheck,
}: {
  item: PreparedMcItem;
  choice: number | undefined;
  answered: boolean;
  /** Derived from the recorded attempt (earned === credits), so it survives a
   * reload where the chosen index isn't restored. */
  correct: boolean;
  onChoose: (ci: number) => void;
  onCheck: () => void;
}) {
  return (
    <div className="flex flex-col gap-3">
      <fieldset
        className="flex flex-col gap-2"
        disabled={answered}
        aria-label="Answer choices"
      >
        {item.choicesHtml.map((c, ci) => (
          <label
            key={ci}
            className={cn(
              "flex cursor-pointer items-center gap-3 rounded-md border border-border p-2.5 text-sm has-[:checked]:border-primary",
              answered && ci === item.answer && "border-emerald-500 bg-emerald-50",
              answered && ci === choice && ci !== item.answer && "border-rose-400 bg-rose-50",
            )}
          >
            <input
              type="radio"
              name={`ss-${item.id}`}
              value={ci}
              checked={choice === ci}
              onChange={() => onChoose(ci)}
              className="size-4 accent-primary"
            />
            <Html html={c} />
            {answered && ci === item.answer ? (
              <span className="sr-only"> (correct answer)</span>
            ) : null}
            {answered && ci === choice && ci !== item.answer ? (
              <span className="sr-only"> (your answer)</span>
            ) : null}
          </label>
        ))}
      </fieldset>

      {!answered ? (
        <Button
          type="button"
          size="sm"
          disabled={choice === undefined}
          onClick={onCheck}
          className="w-fit"
        >
          Check
        </Button>
      ) : (
        <div className="flex flex-col gap-1.5" data-testid="mc-feedback">
          <p
            role="status"
            className={cn(
              "flex items-center gap-2 text-sm font-medium",
              correct ? "text-emerald-700" : "text-rose-700",
            )}
          >
            {correct ? <Check aria-hidden className="size-4" /> : <X aria-hidden className="size-4" />}
            <span>{correct ? "Correct" : "Not quite"}</span>
          </p>
          <Html className="text-sm text-muted-foreground" html={item.explanationHtml} />
        </div>
      )}
    </div>
  );
}

function SelfScoreBody({
  item,
  revealed,
  earned,
  onReveal,
  onScore,
}: {
  item: PreparedSelfScoreItem;
  revealed: boolean;
  earned: number | undefined;
  onReveal: () => void;
  onScore: (credits: number) => void;
}) {
  if (!revealed) {
    return (
      <div className="flex flex-col gap-2">
        <p className="text-xs text-muted-foreground">
          Work it out on paper first — this is a show-your-work question. When
          you&apos;re done, reveal the rubric and model solution to score yourself.
        </p>
        <Button type="button" size="sm" variant="outline" onClick={onReveal} className="w-fit">
          Reveal rubric &amp; solution
        </Button>
      </div>
    );
  }

  return (
    <div
      className="flex flex-col gap-4"
      data-testid="self-score-reveal"
      role="group"
      aria-label="Rubric and model solution"
    >
      {/* Model solution */}
      <div className="rounded-md border border-border bg-muted/20 p-3">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Model solution
        </p>
        <Html
          className="mt-1 block overflow-x-auto text-sm font-medium text-foreground"
          html={item.answerSummaryHtml}
        />
        <Html
          className="mt-1 block overflow-x-auto text-sm text-muted-foreground"
          html={item.modelSolutionHtml}
        />
      </div>

      {/* Official rubric */}
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Official rubric ({item.credits}-credit)
        </p>
        <ul className="mt-1.5 flex flex-col gap-1.5">
          {item.rubric.map((level) => (
            <li key={level.credits} className="flex gap-2 text-sm">
              <span className="mt-0.5 shrink-0 rounded bg-muted px-1.5 font-mono text-xs font-semibold text-foreground">
                {level.credits}
              </span>
              <Html className="min-w-0 text-muted-foreground" html={level.criteriaHtml} />
            </li>
          ))}
        </ul>
      </div>

      {/* Self-score */}
      <div className="flex flex-col gap-2">
        <p id={`score-label-${item.id}`} className="text-sm font-medium text-foreground">
          How many credits did your work earn?
        </p>
        <div
          role="group"
          aria-labelledby={`score-label-${item.id}`}
          className="flex flex-wrap gap-2"
        >
          {Array.from({ length: item.credits + 1 }, (_, c) => (
            <button
              key={c}
              type="button"
              onClick={() => onScore(c)}
              aria-pressed={earned === c}
              aria-label={`${c} of ${item.credits} credits`}
              className={cn(
                "size-10 rounded-md border text-sm font-semibold",
                earned === c
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-background text-foreground hover:border-primary",
              )}
            >
              {c}
            </button>
          ))}
        </div>
        {earned !== undefined ? (
          <p role="status" className="text-sm text-muted-foreground" data-testid="self-score-recorded">
            Recorded {earned} of {item.credits}. Be honest — the rubric is how a
            real scorer would award it.
          </p>
        ) : null}
      </div>
    </div>
  );
}

function ReadinessPanel({
  readiness,
  answered,
  onReset,
}: {
  readiness: ReturnType<typeof overallReadiness>;
  answered: number;
  onReset: () => void;
}) {
  if (answered === 0) {
    return (
      <p className="rounded-md border border-dashed border-border px-3 py-2.5 text-sm text-muted-foreground">
        Answer some questions to see your projected Regents readiness.
      </p>
    );
  }
  return (
    <div
      data-testid="readiness"
      className="flex flex-col gap-3 rounded-md border border-border bg-muted/20 p-3"
    >
      <div className="flex items-center justify-between gap-3">
        <span className="text-sm font-medium text-foreground">
          Projected performance level
        </span>
        <span className="flex items-baseline gap-1">
          <span className="text-2xl font-bold text-primary">{readiness.level}</span>
          <span className="text-xs text-muted-foreground">/ 5</span>
        </span>
      </div>
      <p className="text-xs text-muted-foreground">
        A practice projection from {readiness.earned} of {readiness.max} credits
        self-scored so far — not an official score.
      </p>
      <ul className="flex flex-col gap-1">
        {readiness.byStandard.map((s) => (
          <li key={s.standard} className="flex items-center justify-between gap-2 text-sm">
            <span className="font-mono text-xs text-muted-foreground">{s.standard}</span>
            <span
              className={cn(
                "rounded-full px-2 py-0.5 text-xs font-medium",
                s.band === "mastery" && "bg-emerald-100 text-emerald-800",
                s.band === "proficient" && "bg-sky-100 text-sky-800",
                s.band === "approaching" && "bg-amber-100 text-amber-800",
                s.band === "developing" && "bg-rose-100 text-rose-800",
                s.band === "not-started" && "bg-muted text-muted-foreground",
              )}
            >
              {BAND_LABEL[s.band]}
            </span>
          </li>
        ))}
      </ul>
      <button
        type="button"
        onClick={onReset}
        className="w-fit text-xs text-muted-foreground underline-offset-2 hover:text-foreground hover:underline"
      >
        Start over
      </button>
    </div>
  );
}
