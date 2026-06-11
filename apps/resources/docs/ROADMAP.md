# Math Resources Hub — Roadmap

A living document for **resources.cameronbrady.dev**. The hub is meant to grow
continuously — more subjects, more grade bands, more interactives, and an
open contributor path. This roadmap tracks *where we're headed* and *how far
along each piece is*, lightly.

**Status legend:** ✅ done · 🟡 in progress · ⬜ planned · 💭 idea / backlog

> Last reviewed: 2026-06-11

---

## North star

A student- and teacher-facing library of editorial-quality math (and CS/ML)
resources. Every topic is a clean, accessible page combining a concept
explainer, an interactive figure, and practice. Authoring is file-based and
same-night-fast. The interactive components are good enough to open-source.
Navigation is effortless for everyone — including students with special needs,
for whom virtual manipulatives are a first-class feature, not an afterthought.

### Near-term focus

1. **🔱 Open-source the component library (HIGH PRIORITY).** Extract the
   interactive components into a published, installable package. Now a public
   commitment in the README — see Epic 4.
2. **Fill out 9–10 content** so the new landing pages and `_meta` intros have
   real material to show.

---

## Where v1 landed ✅

- Turborepo monorepo: `apps/resources` + `apps/portfolio` + `@repo/ui`.
- File-based content pipeline: `content/<subject>/<unit>/<topic>.mdx` → static
  3-level pages, **no registry** (drop a file, it appears in nav + home).
- The repeatable three-pillar `TopicPage`: prose → `<Grapher>` → `<PracticeSet>`
  → teacher section (placeholder) → footer.
- `<Grapher>` (reflection / translation / rotation, controls-first, a11y caption)
  and `<PracticeSet>` (MC + numeric, hints, score, localStorage progress).
- Home page: hero + the full Subject→Unit→Topic tree as links.
- One subject live: **Geometry → Transformations →** Reflections, Translations,
  Rotations. Cookieless analytics + per-topic OpenGraph. 87 unit tests.

---

## Grade-band rollout (the phasing spine)

Depth-first by grade. Flesh out a band before widening. (`+` = college **and**
enrichment / advanced.)

| Phase | Band   | Status |
|-------|--------|--------|
| 1     | 9–10   | 🟡 current |
| 2     | 9–12   | ⬜ |
| 3     | 9–12+  | ⬜ |
| 4     | 6–12+  | ⬜ |
| 5     | 3–12+  | ⬜ |

---

## Subjects

The target subject set (more may be added as material accumulates):

| Subject | Status |
|---------|--------|
| Proofs | ⬜ |
| Geometry | 🟡 (Transformations unit) |
| Algebra | ⬜ |
| Algebra II + Trig | ⬜ |
| Pre-calculus | ⬜ |
| Calculus | ⬜ |
| Statistics | ⬜ |
| AI / ML / CS (algorithms + math) | ⬜ |
| Discrete Math | ⬜ |

---

## Epics

### 1. Navigation & wayfinding ✅  *(shipped 2026-06-11, PRD #19)*

The hub now navigates up, down, sideways, and out.

- ✅ **Subject & unit landing pages** at `/<subject>` and `/<subject>/<unit>`
  (auto-index, SSG, 404 on unknown), plus an optional `_meta` seam for editorial
  intros/labels/order.
- ✅ **Linkable breadcrumbs.** A level-aware `getBreadcrumbs` now links every
  ancestor crumb to its landing page.
- ✅ **Upstream access from any page** via a shared global header + breadcrumb
  strip.
- ✅ **Cross-domain link out:** resources → cameronbrady.dev (header + footer).
- ✅ **Cross-domain link in:** cameronbrady.dev → resources (nav + footer).
- ✅ Shared header/footer chrome across all hub pages.

### 2. Discovery & browse ⬜

- ⬜ Subject landing pages (shared with Nav epic).
- 💭 Search across topics.
- 💭 Tags / filters: difficulty, grade band, standard, topic type.
- 💭 "Continue where you left off" — surface existing localStorage progress.
- 💭 **Visited indicator** — a small green dot on resources the user has opened
  before (progress store already tracks per-topic state; fun, low-stakes).

### 3. Teacher layer ⬜

Turn the placeholder "For teachers" section into authored, per-topic content.

- ⬜ **Frontmatter-driven teacher content** (schema decision: standards,
  misconceptions, suggested use).
- ⬜ **NYS standards** — hand-write the relevant standard text + link, brought
  in per topic as needed (no upfront dataset). Extensible to other states later.
- 💭 Links out to lesson plans / slides hosted elsewhere (user-provided URLs).
- 💭 Eventually host lesson materials on the subdomain itself.

### 4. Component library (interactives) 🟡  *(open-source packaging = 🔱 HIGH PRIORITY, next-up)*

- ✅ `<Grapher>`, `<PracticeSet>`.
- ⬜ **🔱 Open-source the component library** — *high priority, next-up.* Now a
  public commitment (see the README). Extract the educational components
  (`Grapher`, `PracticeSet` + their pure geometry / grading / progress logic)
  out of `apps/resources` into a publishable `packages/*` workspace and ship it
  to npm. Concrete steps:
  1. Extract components + pure deps into a new package (`apps/resources` becomes
     its first consumer).
  2. Make it publishable — `private: false`, a build (tsup → `dist` + types),
     real `exports`, and `peerDependencies` (react, mafs).
  3. Stabilize the public API (largely settled — interfaces were designed via
     `/design-an-interface`).
  4. Docs + runnable examples + a11y notes.
  5. Wire up Changesets → `npm publish` (scope e.g. `@cameronbrady/*`).
- ⬜ More practice types (expression / equation input).
- 💭 Number line, data table, function plotter, step-throughs.

### 5. Virtual manipulatives ⬜  *(accessibility-first feature)*

Interactive, hands-on math models (e.g. algebra tiles, fraction bars, base-ten
blocks, geoboard, number line). Strong learning benefit, **especially for
students with special needs** — so navigation to them must be exceptionally
accessible.

- ⬜ A **simple resource type** for manipulatives, reachable from **both** a
  dedicated top-level manipulatives section *and* inline within the matching
  subject/topic nav.
- ⬜ Build the manipulatives themselves (overlaps with Component library epic).
- A11y is a hard requirement here, not a nice-to-have.

### 6. Contribution & community ⬜

Two distinct paths by contributor type:

- ⬜ **Developers → GitHub.** Direct technical contributors to **GitHub issue
  forms** (request topics/components, report issues) and a fork + PR flow for
  dropping in their own components.
- ⬜ **Teachers → on-site form.** A **Resend-backed contribution form** modeled
  on the portfolio's contact form, but specific to this hub: request
  topics/subjects, suggest additions/tweaks, propose component ideas, give an
  ideal timeline.
- 💭 `CONTRIBUTING.md` + component-authoring guide (linked from both paths).

### 7. Data & persistence 💭  *(on the radar, deliberately deprioritized)*

- 💭 Store resources/content in a database instead of (or alongside) in-repo
  MDX. Significant complexity; **not a short-term priority.** Noted so we design
  the content-index seam without painting ourselves into a corner.

---

## Cross-cutting principles

- **Accessibility first** — keyboard-operable, color-independent feedback,
  screen-reader-friendly; manipulatives held to the highest bar.
- **File-based, no-registry authoring** — same-night publish stays sacred.
- **Minors-safe** — cookieless analytics, no GA, light SEO only.
- **One family, distinct identity** — shared `@repo/ui` token contract with the
  portfolio; warm-paper / graph-paper aesthetic.

---

## Decisions

- **Grade `+`** = college **and** enrichment / advanced.
- **Virtual manipulatives** = a simple resource type, accessible from *both* a
  top-level section and inline topic/subject nav.
- **Contribution** = split by contributor: developers → GitHub issue forms;
  teachers → a Resend-backed on-site form (like the portfolio contact form,
  hub-specific).
- **Standards** = hand-written text + link, brought in per topic as needed; no
  upfront dataset. NYS first.
- **Open-source packaging** = develop the components in-monorepo as a
  `packages/*` workspace; `apps/resources` is its first consumer; publish that
  package to npm with Changesets once the API stabilizes. Keep this single
  public repo as source of truth — split to a standalone repo only if the
  library grows its own contributor base (preserve history via `git subtree` /
  `filter-repo`).
