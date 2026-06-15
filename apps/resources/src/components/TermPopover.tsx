"use client";

import { useEffect, useId, useRef, useState, type ReactNode } from "react";

export interface TermPopoverProps {
  /** The canonical term (the trigger's accessible name). */
  term: string;
  /** Display text override (e.g. an inflected form); defaults to the term. */
  label?: ReactNode;
  /** The definition content: plain language first, formal second. */
  children: ReactNode;
}

// A click/keyboard disclosure — deliberately not hover-only, so touch and
// keyboard users are first-class. Escape and outside interaction close it.
export function TermPopover({ term, label, children }: TermPopoverProps) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLSpanElement>(null);
  const panelId = useId();

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    const onPointerDown = (e: PointerEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("pointerdown", onPointerDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("pointerdown", onPointerDown);
    };
  }, [open]);

  return (
    <span ref={rootRef} className="relative inline-block">
      <button
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        aria-label={term}
        onClick={() => setOpen((o) => !o)}
        className="cursor-pointer rounded-sm underline decoration-dotted decoration-primary underline-offset-4 focus-visible:ring-[3px] focus-visible:ring-ring/50"
      >
        {label ?? term}
      </button>
      {open && (
        <span
          id={panelId}
          role="note"
          aria-label={`Definition of ${term}`}
          className="absolute left-0 top-full z-10 mt-2 block w-72 rounded-md border border-border bg-popover p-4 text-sm leading-relaxed text-popover-foreground shadow-md"
        >
          {children}
        </span>
      )}
    </span>
  );
}
