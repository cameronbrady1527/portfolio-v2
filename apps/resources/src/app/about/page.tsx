import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@repo/ui";

export const metadata: Metadata = {
  title: "About",
  description:
    "Why math is worth your mind — and how this hub helps you own your learning through curiosity, reasoning, and the quiet rigor of geometry.",
};

// Editorial About page: the "why" behind the hub. Student-facing, warm, and
// strictly non-partisan. Matches the home page's serif/warm-paper aesthetic —
// graph-paper hero, max-w prose columns, mono eyebrow labels.
export default function AboutPage() {
  return (
    <main className="w-full flex-1">
      <section className="graph-paper w-full px-6 py-24">
        <div className="mx-auto flex w-full max-w-3xl flex-col items-center gap-8 text-center">
          <span className="font-mono text-xs uppercase tracking-[0.2em] text-primary">
            About the Hub
          </span>

          <h1 className="font-display text-4xl font-semibold leading-tight text-foreground sm:text-5xl">
            Math is worth your mind.
          </h1>

          <p className="max-w-xl text-base leading-relaxed text-muted-foreground">
            This hub exists to help you understand <em>why</em> math matters —
            not just how to push symbols around. It is a supplemental companion
            for your lessons and your own curiosity, built to make ideas clear
            and worth thinking about.
          </p>
        </div>
      </section>

      <div className="mx-auto flex w-full max-w-3xl flex-col gap-20 px-6 py-20">
        <section className="flex flex-col gap-4">
          <span className="font-mono text-xs uppercase tracking-[0.15em] text-muted-foreground">
            Why math matters
          </span>
          <h2 className="font-display text-2xl font-semibold leading-snug text-foreground">
            Learning math is learning to think for yourself.
          </h2>
          <div className="flex flex-col gap-4 text-base leading-relaxed text-muted-foreground">
            <p>
              Underneath every formula is a more durable skill: reasoning from
              evidence, following an argument to its conclusion, and knowing the
              difference between a claim and a proof. Math is one of the best
              places to practice that, because it asks you to be honest about
              what actually follows from what.
            </p>
            <p>
              That habit travels well. Someone who can reason carefully — weigh
              what they are told, spot a leap in logic, and decide what they
              actually believe — is harder to mislead and better equipped to
              take part in the world as a capable, informed person. Clear
              thinking is the quiet foundation of independent thinking.
            </p>
          </div>
        </section>

        <section className="flex flex-col gap-4">
          <span className="font-mono text-xs uppercase tracking-[0.15em] text-muted-foreground">
            Why geometry &amp; proofs
          </span>
          <h2 className="font-display text-2xl font-semibold leading-snug text-foreground">
            Geometry is where the reasoning becomes visible.
          </h2>
          <div className="flex flex-col gap-4 text-base leading-relaxed text-muted-foreground">
            <p>
              Geometry is the on-ramp to high-school math, and for most people
              it is the first real encounter with a <strong>proof</strong> — a
              chain of statements where each step has to earn its place. That is
              a genuinely powerful thing to learn: how to build an argument that
              holds, and how to recognize one that doesn&apos;t.
            </p>
            <p>
              It is also a study of relationships. You learn to see how one
              shape relates to another, to move between a picture and an idea,
              and to carry abstractions and connections from one problem to the
              next. Those connections are the part that stays with you long
              after the specific theorems fade.
            </p>
          </div>
        </section>

        <section className="flex flex-col gap-4">
          <span className="font-mono text-xs uppercase tracking-[0.15em] text-muted-foreground">
            How we teach
          </span>
          <h2 className="font-display text-2xl font-semibold leading-snug text-foreground">
            Curiosity over compliance.
          </h2>
          <div className="flex flex-col gap-4 text-base leading-relaxed text-muted-foreground">
            <p>
              The aim here is to help you <em>own</em> your learning. Pages
              favor discovery and inquiry — a chance to notice a pattern, try a
              tool, and reach the idea yourself — because what you figure out
              tends to stick better than what you are simply handed. The reward
              we care about is your own curiosity, not a checkmark.
            </p>
            <p>
              So this is deliberately a supplemental tool, not an AI tutor. It
              won&apos;t do the thinking for you or replace a teacher. It is a
              clean, trustworthy reference for your lessons and your
              self-directed practice — there when you want to explore, and quiet
              when you don&apos;t.
            </p>
          </div>
        </section>

        <section className="flex flex-col items-start gap-4 border-t border-border pt-12">
          <p className="text-base leading-relaxed text-muted-foreground">
            The best way to see what this is about is to follow your own
            curiosity into a topic.
          </p>
          <Button asChild>
            <Link href="/geometry/transformations/reflections">
              Start with Reflections
              <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
          <Link
            href="/"
            className="font-mono text-xs uppercase tracking-[0.15em] text-muted-foreground transition-colors hover:text-primary"
          >
            Or browse the full topic tree →
          </Link>
        </section>
      </div>
    </main>
  );
}
