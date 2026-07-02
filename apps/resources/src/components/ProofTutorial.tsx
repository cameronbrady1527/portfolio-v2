"use client";

import { useEffect, useState } from "react";
import {
  loadProofsProgress,
  markTutorialSeen,
  PROOFS_PROGRESS_KEY,
  saveProofsProgress,
} from "@/lib/proofs/store";

// A brief "how to use the builder" intro. Shown expanded on a student's FIRST
// encounter (do-it or skip); once dismissed it collapses to a quiet toggle that
// stays available on every page, so it never nags but is always re-openable.
// The "seen" flag lives in the proofs store (global, not per-family).

const STEPS = [
  "Read the Given and Prove at the top — that's what you're starting from and where you're headed.",
  "Each row needs a reason. Pick the tile that justifies the statement; a row only locks in when it genuinely follows from the ones above it.",
  "Higher up, you'll also order the statements: click a statement tile, then its reason.",
  "Click an angle or part in the figure to find it in the proof — or click a proof line to light it up in the figure.",
  "Get a few right and the support fades, until you're building the whole proof unaided, the Regents way.",
];

export interface ProofTutorialProps {
  className?: string;
}

export function ProofTutorial({ className }: ProofTutorialProps) {
  // `null` until hydrated (SSR renders nothing to avoid a flash + mismatch).
  const [seen, setSeen] = useState<boolean | null>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const wasSeen = loadProofsProgress(PROOFS_PROGRESS_KEY).tutorialSeen === true;
    setSeen(wasSeen);
    setOpen(!wasSeen); // auto-open only on the first encounter
  }, []);

  const dismiss = () => {
    saveProofsProgress(PROOFS_PROGRESS_KEY, markTutorialSeen(loadProofsProgress(PROOFS_PROGRESS_KEY)));
    setSeen(true);
    setOpen(false);
  };

  if (seen === null) return null; // pre-hydration

  return (
    <div className={["cbmc-proof-tutorial", className].filter(Boolean).join(" ")}>
      <button
        type="button"
        className="cbmc-proof-tutorial-toggle"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
      >
        <span aria-hidden="true">{open ? "▾" : "▸"}</span> How to use this builder
      </button>
      {open ? (
        <div className="cbmc-proof-tutorial-body">
          <ol>
            {STEPS.map((s, i) => (
              <li key={i}>{s}</li>
            ))}
          </ol>
          {!seen ? (
            <button type="button" className="cbmc-btn cbmc-btn-primary" onClick={dismiss}>
              Got it — let's go
            </button>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
