"use client";

import { Fraunces } from "next/font/google";
import { motion, useReducedMotion } from "motion/react";

/**
 * "What I bring" — authored prose + a clean definition list.
 * No icon-bubbles, no pill clouds. Each capability reads as a sentence-like
 * run of comma-separated terms — a person describing what they do, not a matrix.
 * The Fraunces serif is scoped to the About page only.
 */

const fraunces = Fraunces({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  display: "swap",
});

type Entry = {
  term: string;
  detail: string;
};

const ENTRIES: Entry[] = [
  {
    term: "Subjects I teach",
    detail:
      "Geometry, Algebra I & II, Pre-Calculus, Calculus (AB/BC), Statistics, and Regents prep — alongside Computer Science: AP CSA & CSP, Python, Java, and the web.",
  },
  {
    term: "In the classroom",
    detail:
      "Differentiated instruction; IEP & 504 accommodations; scaffolding; curriculum and assessment design; data-driven lesson planning; classroom management; and culturally responsive teaching.",
  },
  {
    term: "Building & engineering",
    detail:
      "TypeScript, React, Next.js, Python, SQL, MDX, and Tailwind; testing with Vitest and Playwright; Git — plus some machine learning (TensorFlow, PyTorch) carried over from research projects.",
  },
  {
    term: "Tools I reach for",
    detail: "Vercel, PostgreSQL, Supabase, and Google Workspace.",
  },
];

export const SkillsSection = () => {
  const reduce = useReducedMotion();

  // Constant initial/target (SSR-stable); only the transition reacts to the
  // reduced-motion preference. Per-item stagger via delay, dropped when reduced.
  const rise = (i: number) => ({
    initial: { opacity: 0, y: 14 },
    whileInView: { opacity: 1, y: 0 },
    transition: reduce
      ? { duration: 0 }
      : { duration: 0.55, ease: [0.22, 1, 0.36, 1] as const, delay: i * 0.06 },
  });

  return (
    <section
      aria-labelledby="skills-heading"
      className="mx-auto max-w-3xl py-20 sm:py-28"
    >
      <header className="mb-14 sm:mb-16">
        <h2
          id="skills-heading"
          className={`${fraunces.className} text-3xl font-semibold leading-tight tracking-tight text-slate-800 sm:text-5xl`}
        >
          What I bring
        </h2>
        <p className="mt-5 max-w-xl text-lg leading-relaxed text-slate-600">
          A teacher first, and an engineer who builds for the classroom. The
          short version of what I can do:
        </p>
      </header>

      <dl className="divide-y divide-slate-200 border-y border-slate-200">
        {ENTRIES.map((entry, i) => (
          <motion.div
            key={entry.term}
            viewport={{ once: true, margin: "-60px" }}
            {...rise(i)}
            className="py-8 sm:grid sm:grid-cols-[11rem_1fr] sm:gap-x-10 sm:py-10"
          >
            <dt
              className={`${fraunces.className} mb-3 text-lg font-medium text-slate-800 sm:mb-0 sm:pt-0.5`}
            >
              {entry.term}
            </dt>
            <dd className="text-lg leading-relaxed text-slate-600 sm:text-xl sm:leading-relaxed">
              {entry.detail}
            </dd>
          </motion.div>
        ))}
      </dl>

      <p className="mt-10 max-w-xl text-base italic leading-relaxed text-slate-500">
        The thread through all of it: when I find a gap in what someone
        understands, I build the thing that closes it.
      </p>
    </section>
  );
};
