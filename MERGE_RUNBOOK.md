# Push & merge runbook (2026-06-11) — deliberately untracked scratch file

Run from any real terminal on this machine (NOT a remote-control session).
Delete this file when done.

## 1. Push all 15 branches

```bash
cd ~/projects/portfolio-v2
git push -u origin \
  slice/28-scaffold-math-components slice/29-logic-to-package \
  slice/30-grapher-to-package slice/31-publish-readiness \
  slice/39-dilation-stretch slice/40-transform-sequences \
  slice/41-sequence-builder slice/42-symmetry-explorer \
  slice/33-refresher-support-library slice/34-worked-example-stepper \
  slice/35-predict-then-check slice/36-term-glossary \
  slice/37-authoring-guide \
  docs/roadmap-student-topic-requests docs/geometry-component-plan
```

## 2. PRs

After the push, ask Claude to open all PRs (gh pr create is not blocked),
or open them yourself. Closes-links: #28 #29 #30 #31, #33 #34 #35 #36 #37,
#39 #40 #41 #42. Docs branches: no linked issue.

## 3. Review gates (SME math ratification)

- Track A: 6 refreshers (content/_refreshers/), 6 glossary defs
  (content/_glossary/), rotation worked example, reflection prediction.
- Track B: Dilations / Sequences / Symmetry topics (prose + practice),
  the builder puzzle solution, measurement labels.

## 4. Merge order (stacked — each PR shows only its own diff once its base lands)

- Package mega-stack, in order: #28 → #29 → #30 → #31 → #39 → #40 → #41 → #42
- Track A stack, in order:      #33 → #34 → #35 → #36 → #37
- Docs branches: any time.
- The two stacks are independent of each other; interleave freely.
- mdx-components.tsx + the 3 topic .mdx files differ between stacks —
  whichever stack merges second may need a trivial conflict resolution
  (keep both sides: Track A's registrations/embeds + Track B's imports).

## 5. After everything is on main

- Vercel auto-deploys resources.cameronbrady.dev (6-topic transformations unit).
- Enable Web Analytics toggle in the resources Vercel project (still pending).
- Follow-ups queued: retrofit Track A components into the 3 Track B topics;
  X4 expression input; npm publish via Changesets; Tier 2 PRD.
