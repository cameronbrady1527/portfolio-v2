"use client";

import { Fraunces } from "next/font/google";
import { motion, useReducedMotion } from "motion/react";

/**
 * "The Journey" — an editorial, prose-forward narrative.
 *
 * Quiet small-caps year markers sit in the margin; the prose carries the weight.
 * Beat index 5 is the PIVOT — lifted out of the reading column into a wider
 * wash panel ("the turning point") so the eye lands there. The Fraunces serif
 * is scoped to this page only (the rest of the site stays in JetBrains Mono).
 */

const fraunces = Fraunces({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  display: "swap",
});

type Beat = {
  marker: string; // small-caps margin lead-in
  lede: string; // short bold opener
  body: string;
};

const BEATS: Beat[] = [
  {
    marker: "In the beginning",
    lede: "Raised to help.",
    body: "Service was the default in my house; both of my grandmothers spent their lives in education. I learned early that people are more than the behavior they show you — there’s a story underneath.",
  },
  {
    marker: "Since 2014",
    lede: "Service shaped me.",
    body: "I helped grow Sparrow’s Nest from cooking for a few families into a charity feeding households across the Hudson Valley during cancer treatment. On the Appalachia Service Project, rebuilding homes in West Virginia and Virginia, I learned I could lead.",
  },
  {
    marker: "Then I made things",
    lede: "I built something.",
    body: "With my close friend Matt Beck I co-founded The Clover Project, a community farm in Hyde Park, NY, run like a real 501(c)(3) to get fresh, healthy food to people who couldn’t afford it.",
  },
  {
    marker: "Cornell",
    lede: "Cornell taught me to think.",
    body: "An interdisciplinary degree — computer science, applied economics & management, agricultural science — built on the idea that real problems are messy and need a holistic, systems view to solve in a way that lasts.",
  },
  {
    marker: "The hard part",
    lede: "The market had other plans.",
    body: "I graduated into a brutal market: hundreds of applications, many for jobs I didn’t believe in. To get by I picked up software work at Astral and started substitute teaching.",
  },
  // index 5 — THE PIVOT, rendered as the wash interstitial below.
  {
    marker: "The turning point",
    lede: "The turn.",
    body: "The classroom caught me off guard. I loved working with kids — immediately and completely. I applied to NYC Teaching Fellows and Teach for America, got into both, and chose the Fellows. I’m now earning my M.S.T. at Pace while teaching full-time.",
  },
  {
    marker: "Why public schools",
    lede: "Why public schools.",
    body: "They’re the closest thing we have to a promise that every kid gets a real education, regardless of what they can pay. Public education is how a society builds critical thinking — and that’s what a free, fair democracy runs on.",
  },
  {
    marker: "What’s next",
    lede: "What’s next.",
    body: "When I find a gap in what my students understand, I build something to fix it and put it online for free. That’s grown into Math Resources — open tools for my students and anyone learning math, anywhere.",
  },
];

export const JourneyTimeline = () => {
  const reduce = useReducedMotion();

  // Keep `initial`/`whileInView` constant so server and client hydrate to the
  // same markup; only the transition reacts to the reduced-motion preference
  // (duration 0 = an instant snap, no perceptible animation).
  const rise = {
    initial: { opacity: 0, y: 18 },
    whileInView: { opacity: 1, y: 0 },
    transition: reduce
      ? { duration: 0 }
      : { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const },
  };

  const fade = {
    initial: { opacity: 0, y: 24 },
    whileInView: { opacity: 1, y: 0 },
    transition: reduce
      ? { duration: 0 }
      : { duration: 0.8, ease: [0.22, 1, 0.36, 1] as const },
  };

  const renderBeat = (beat: Beat) => (
    <motion.article
      key={beat.lede}
      viewport={{ once: true, margin: "-80px" }}
      {...rise}
      className="sm:grid sm:grid-cols-[8rem_1fr] sm:gap-x-10"
    >
      <h3 className="mb-2 text-xs font-medium uppercase tracking-[0.2em] text-slate-400 sm:mb-0 sm:pt-1.5 sm:text-right">
        {beat.marker}
      </h3>
      <p className="text-lg leading-relaxed text-slate-600 sm:text-xl sm:leading-relaxed">
        <span className="font-semibold text-slate-800">{beat.lede}</span>{" "}
        {beat.body}
      </p>
    </motion.article>
  );

  const before = BEATS.slice(0, 5);
  const after = BEATS.slice(6);

  return (
    <section
      aria-labelledby="journey-heading"
      className="mx-auto max-w-5xl pt-24 pb-16 sm:pt-32"
    >
      {/* Masthead */}
      <header className="mx-auto mb-16 max-w-3xl sm:mb-20">
        <p className="mb-4 text-xs font-medium uppercase tracking-[0.22em] text-slate-400">
          About
        </p>
        <h2
          id="journey-heading"
          className={`${fraunces.className} text-4xl font-semibold leading-[1.05] tracking-tight text-slate-800 sm:text-6xl`}
        >
          The Journey
        </h2>
        <p
          className={`${fraunces.className} mt-5 max-w-xl text-lg italic leading-relaxed text-slate-500 sm:text-xl`}
        >
          A long way around to a classroom — by way of farms, food banks, and a
          degree in messy problems.
        </p>
        <div className="mt-8 h-px w-24 bg-linear-to-r from-red-400 via-purple-400 to-orange-400" />
      </header>

      {/* Act one — before the classroom */}
      <div className="mx-auto max-w-3xl space-y-14 sm:space-y-16">
        {before.map(renderBeat)}
      </div>

      {/* The turning point — wider wash panel that breaks the reading column */}
      <motion.aside
        viewport={{ once: true, margin: "-80px" }}
        {...fade}
        aria-label="The turning point"
        className="relative my-16 overflow-hidden rounded-3xl border border-slate-200/70 bg-linear-to-br from-red-50 via-purple-50 to-orange-50 sm:my-20"
      >
        <span
          aria-hidden
          className="absolute left-0 top-0 h-full w-[3px] bg-linear-to-b from-red-500 via-purple-500 to-orange-500"
        />
        <div className="mx-auto max-w-3xl px-6 py-14 text-center sm:px-10 sm:py-20">
          <p className="mb-6 text-xs font-semibold uppercase tracking-[0.3em] text-purple-600">
            The turning point
          </p>
          <blockquote>
            <p
              className={`${fraunces.className} text-2xl font-medium leading-[1.2] tracking-tight text-slate-800 sm:text-[2.5rem] sm:leading-[1.12]`}
            >
              The classroom caught me off guard. I loved working with kids —
              immediately and completely.
            </p>
          </blockquote>
          <p className="mx-auto mt-7 max-w-xl text-base leading-relaxed text-slate-600 sm:text-lg">
            I applied to NYC Teaching Fellows and Teach for America, got into
            both, and chose the Fellows. I’m now earning my M.S.T. at Pace while
            teaching full-time.
          </p>
        </div>
      </motion.aside>

      {/* Act two — in the classroom & beyond */}
      <div className="mx-auto max-w-3xl space-y-14 sm:space-y-16">
        {after.map(renderBeat)}
      </div>
    </section>
  );
};
