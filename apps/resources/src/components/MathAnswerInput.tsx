"use client";

import { forwardRef } from "react";
import { cn } from "@repo/ui";

// The single, shared text box for typed math answers across every interactive
// component (Drill, MasteryCheck, PracticeSet, SelfCheck, …).
//
// WHY THIS EXISTS — mobile keyboards: a math answer can be NEGATIVE (−7), a
// decimal (3.5), or a fraction (1/2). On iOS, `inputMode="numeric"` and
// `inputMode="decimal"` show a digits-only keypad with NO minus sign, so a
// student literally cannot type a negative answer. The fix is the full keyboard
// (`inputMode="text"`), which keeps every character — digits, "−", ".", "/" —
// reachable. These keyboard attributes are LOCKED here (applied after the caller's
// props) so no usage site can accidentally narrow them back to a numeric keypad.
// A guard test (math-answer-input.test.tsx) fails the build if a numeric keypad
// reappears anywhere in the components. Do not add `inputMode="numeric"`,
// `inputMode="decimal"`, or `type="number"` to answer inputs — use this instead.
export const MathAnswerInput = forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(function MathAnswerInput({ className, ...props }, ref) {
  return (
    <input
      ref={ref}
      className={cn(
        "rounded-md border border-border bg-background px-3 py-2 font-mono outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:opacity-60",
        className,
      )}
      {...props}
      // Locked AFTER the caller's props so a usage site cannot override the
      // mobile keyboard back to a numeric keypad (which hides the minus sign).
      type="text"
      inputMode="text"
      autoComplete="off"
      autoCapitalize="off"
      spellCheck={false}
    />
  );
});
