"use client";

import { useEffect, useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { cn } from "@repo/ui";
import { countMastered, loadProgress } from "@cameronbrady/math-components/logic";

const RESOURCES_PROGRESS_KEY = "resources:progress";

// A light, anonymous "N of M skills mastered" read off local progress. Renders a
// stable "0 of M" on the server / first paint (mastery lives only in
// localStorage), then fills in after mount — no hydration mismatch, nothing
// gated. `slugs` are the per-skill mastery keys (the SkillCard `skill` slugs).
export function MasteryProgress({
  slugs,
  className,
}: {
  slugs: string[];
  className?: string;
}) {
  const total = slugs.length;
  const [mastered, setMastered] = useState(0);

  useEffect(() => {
    setMastered(countMastered(loadProgress(RESOURCES_PROGRESS_KEY), slugs));
    // slugs are stable for a given landing render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (total === 0) return null;

  return (
    <p
      aria-live="polite"
      className={cn(
        "inline-flex items-center gap-2 rounded-full border border-border bg-muted/30 px-3 py-1 font-mono text-xs uppercase tracking-wider text-muted-foreground",
        className,
      )}
    >
      <CheckCircle2
        aria-hidden
        className={cn("size-4", mastered > 0 && "text-emerald-700")}
      />
      {mastered} of {total} skills mastered
    </p>
  );
}
