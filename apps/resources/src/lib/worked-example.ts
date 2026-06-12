// Pure reveal/gating state for the Worked-Example Stepper. No DOM, no side
// effects — the component dispatches, this module decides.

export type WorkedStepSpec = {
  /** A gated step carries a self-check that must be attempted before the next reveal. */
  gated: boolean;
};

export type WorkedExampleState = {
  steps: { gated: boolean; attempts: number }[];
  /** Number of steps currently visible; the first is always shown. */
  revealed: number;
};

export type WorkedExampleAction =
  | { type: "reveal" }
  | { type: "answer"; correct: boolean };

export function init(specs: WorkedStepSpec[]): WorkedExampleState {
  return {
    steps: specs.map((s) => ({ gated: s.gated, attempts: 0 })),
    revealed: specs.length > 0 ? 1 : 0,
  };
}

/** The next step may be revealed once the last visible step's gate (if any) was attempted. */
export function canReveal(state: WorkedExampleState): boolean {
  if (state.revealed >= state.steps.length) return false;
  const current = state.steps[state.revealed - 1];
  return !current.gated || current.attempts > 0;
}

export function reduce(
  state: WorkedExampleState,
  action: WorkedExampleAction,
): WorkedExampleState {
  switch (action.type) {
    case "reveal":
      return canReveal(state) ? { ...state, revealed: state.revealed + 1 } : state;
    case "answer": {
      // An attempt — right or wrong — satisfies the gate; feedback, never a lock.
      const steps = state.steps.map((s, i) =>
        i === state.revealed - 1 ? { ...s, attempts: s.attempts + 1 } : s,
      );
      return { ...state, steps };
    }
  }
}
