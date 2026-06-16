import { useEffect, useState } from "react";

/**
 * Tracks the user's `prefers-reduced-motion` setting (live). Every animated tool
 * reads this to offer a static, assembled fallback instead of motion. SSR-safe:
 * returns false until mounted, then reflects (and follows changes to) the query.
 */
export function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
      return;
    }
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const on = () => setReduced(mq.matches);
    on();
    mq.addEventListener?.("change", on);
    return () => mq.removeEventListener?.("change", on);
  }, []);
  return reduced;
}
