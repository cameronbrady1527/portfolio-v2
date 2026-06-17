// The pure heart of a fluency drill: a (state, event) => state machine that owns
// the streak, the running counts, and the "fluent" judgement. No DOM, no timers
// — the Drill component is a thin shell that dispatches events into this and
// renders the result, which is exactly what makes the drill logic unit-testable.

/** How many consecutive correct answers signal fluency, by default. */
export const DEFAULT_FLUENCY_THRESHOLD = 5;

export type FluencyState = {
  /** Consecutive correct answers right now; resets to 0 on a miss. */
  streak: number;
  /** Total answers attempted this session. */
  attempts: number;
  /** Total correct this session (accuracy = correct / attempts). */
  correct: number;
  /** Consecutive-correct run that counts as fluent. */
  threshold: number;
  /** True once the streak has reached the threshold; latched for the session. */
  fluent: boolean;
};

export type FluencyEvent =
  | { type: "correct" }
  | { type: "incorrect" }
  | { type: "reset" };

/** A fresh drill state. `threshold` is the consecutive-correct run for fluency. */
export function initFluency(
  threshold: number = DEFAULT_FLUENCY_THRESHOLD,
): FluencyState {
  return { streak: 0, attempts: 0, correct: 0, threshold, fluent: false };
}

export function fluencyReducer(
  state: FluencyState,
  event: FluencyEvent,
): FluencyState {
  switch (event.type) {
    case "correct": {
      const streak = state.streak + 1;
      return {
        ...state,
        streak,
        attempts: state.attempts + 1,
        correct: state.correct + 1,
        // Reaching the threshold is an achievement: once fluent, stay fluent
        // for the session even if a later miss breaks the streak.
        fluent: state.fluent || streak >= state.threshold,
      };
    }
    case "incorrect":
      return {
        ...state,
        streak: 0,
        attempts: state.attempts + 1,
      };
    case "reset":
      return initFluency(state.threshold);
  }
}
