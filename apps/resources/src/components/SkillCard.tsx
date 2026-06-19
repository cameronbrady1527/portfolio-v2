"use client";

import {
  Children,
  isValidElement,
  type ReactElement,
  type ReactNode,
} from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@repo/ui";
import { Drill } from "./Drill";
import { MasteryCheck } from "./MasteryCheck";
import { resolveGenerator } from "@/lib/foundations/generators";

export interface SkillStepProps {
  /** The step's short heading, e.g. "What & why" or "Try it together". */
  title: string;
  children: ReactNode;
}

/** One authored teaching step (1–3). Orchestrated and numbered by <SkillCard>. */
export function SkillStep({ children }: SkillStepProps) {
  return <div className="text-sm leading-relaxed [&>:first-child]:mt-0">{children}</div>;
}

export interface SkillCardProps {
  /** Generator registry key (see lib/foundations/generators). */
  skill: string;
  /** Student-facing skill name. */
  title: string;
  /** Difficulty handed to the generator for the practice drill. */
  level?: number;
  /** Authored steps 1–3 as <SkillStep> children. */
  children: ReactNode;
}

// The Skill Card walks a fixed five-step arc: the first three are authored
// teaching (What & why → I do → we do), step four is live practice off the
// seeded generator, and step five is the mastery check (filled in by a later
// slice). The fixed spine is the point — every Foundations skill feels the same,
// so students spend their attention on the math, not on re-learning the tool.
export function SkillCard({ skill, title, level = 1, children }: SkillCardProps) {
  const generator = resolveGenerator(skill);
  const steps = Children.toArray(children).filter(
    (c): c is ReactElement<SkillStepProps> => isValidElement(c),
  );

  return (
    <Card className="my-6 overflow-hidden">
      <CardHeader className="border-b border-border bg-muted/30">
        <p className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
          Skill
        </p>
        <CardTitle className="font-display text-xl font-semibold">
          {title}
        </CardTitle>
      </CardHeader>

      <CardContent className="flex flex-col gap-8 pt-6">
        <ol className="flex list-none flex-col gap-8">
          {/* Steps 1–3: authored teaching. */}
          {steps.map((step, i) => (
            <li key={i} className="flex gap-4">
              <StepBadge>{i + 1}</StepBadge>
              <div className="flex flex-1 flex-col gap-2">
                <h3 className="font-display text-base font-semibold text-foreground">
                  {step.props.title}
                </h3>
                {step}
              </div>
            </li>
          ))}

          {/* Step 4: live practice. */}
          <li className="flex gap-4">
            <StepBadge>{steps.length + 1}</StepBadge>
            <div className="flex flex-1 flex-col gap-3">
              <h3 className="font-display text-base font-semibold text-foreground">
                Practice until it&rsquo;s automatic
              </h3>
              <p className="text-sm text-muted-foreground">
                Fresh problems, one at a time. Build a streak — the goal is
                getting them right without stopping to think.
              </p>
              <Drill generator={generator} level={level} />
            </div>
          </li>

          {/* Step 5: Regents-level mastery check. */}
          <li className="flex gap-4">
            <StepBadge>{steps.length + 2}</StepBadge>
            <div className="flex flex-1 flex-col gap-3">
              <h3 className="font-display text-base font-semibold text-foreground">
                Prove it
              </h3>
              <p className="text-sm text-muted-foreground">
                Harder, applied problems at the level you&rsquo;ll meet on the
                Regents. Get them all right to earn this skill.
              </p>
              <MasteryCheck skill={skill} />
            </div>
          </li>
        </ol>
      </CardContent>
    </Card>
  );
}

function StepBadge({ children }: { children: ReactNode }) {
  return (
    <span
      aria-hidden
      className="flex size-7 shrink-0 items-center justify-center rounded-full bg-primary/10 font-mono text-sm font-semibold text-primary"
    >
      {children}
    </span>
  );
}
