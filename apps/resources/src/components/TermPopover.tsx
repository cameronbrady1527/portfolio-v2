"use client";

import {
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";

export interface TermPopoverProps {
  /** The canonical term (the trigger's accessible name). */
  term: string;
  /** Display text override (e.g. an inflected form); defaults to the term. */
  label?: ReactNode;
  /** The definition content: plain language first, formal second. */
  children: ReactNode;
}

const PANEL_WIDTH = 288; // w-72
const GAP = 8;

// A click/keyboard disclosure — deliberately not hover-only, so touch and
// keyboard users are first-class. Escape and outside interaction close it.
//
// The definition panel is rendered in a portal on document.body rather than
// inline. The trigger lives inside MDX prose (a <p>), and the definition itself
// is MDX (which emits <p>), so rendering the panel inline would nest <p> in <p>
// — invalid HTML and a React hydration error. Portaling also frees the panel
// from any overflow-clipping ancestor.
export function TermPopover({ term, label, children }: TermPopoverProps) {
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState<{ top: number; left: number } | null>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const panelId = useId();

  // Position the portaled panel just below the trigger, clamped to the viewport.
  useLayoutEffect(() => {
    if (!open) return;
    const place = () => {
      const r = triggerRef.current?.getBoundingClientRect();
      if (!r) return;
      const left = Math.min(
        Math.max(GAP, r.left),
        window.innerWidth - PANEL_WIDTH - GAP,
      );
      setPos({ top: r.bottom + GAP, left });
    };
    place();
    window.addEventListener("scroll", place, true);
    window.addEventListener("resize", place);
    return () => {
      window.removeEventListener("scroll", place, true);
      window.removeEventListener("resize", place);
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    const onPointerDown = (e: PointerEvent) => {
      const t = e.target as Node;
      if (
        !triggerRef.current?.contains(t) &&
        !panelRef.current?.contains(t)
      ) {
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
    <span className="relative inline-block">
      <button
        ref={triggerRef}
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        aria-label={term}
        onClick={() => setOpen((o) => !o)}
        className="cursor-pointer rounded-sm underline decoration-dotted decoration-primary underline-offset-4 focus-visible:ring-[3px] focus-visible:ring-ring/50"
      >
        {label ?? term}
      </button>
      {open &&
        pos &&
        createPortal(
          <div
            ref={panelRef}
            id={panelId}
            role="note"
            aria-label={`Definition of ${term}`}
            style={{ position: "fixed", top: pos.top, left: pos.left, width: PANEL_WIDTH }}
            className="z-50 rounded-md border border-border bg-popover p-4 text-sm leading-relaxed text-popover-foreground shadow-md"
          >
            {children}
          </div>,
          document.body,
        )}
    </span>
  );
}
