# Cameron Brady — Portfolio & Math Resources Hub

A small monorepo with two sibling sites:

- **Portfolio** → [cameronbrady.dev](https://cameronbrady.dev) — who I am and what I build (educator, tutor, nonprofit founder, fullstack developer).
- **Math Resources Hub** → [resources.cameronbrady.dev](https://resources.cameronbrady.dev) — a growing, open library of interactive math resources for students and teachers.

The portfolio is the personal site. The Hub is the part I'm most excited to open up — so most of this README is about it.

## The Math Resources Hub

Good math materials should be free, accessible, and something you can actually *touch*. Every topic in the Hub is one focused page: a plain-language explainer, an **interactive figure you can drag and adjust**, and **practice with hints and instant feedback** that quietly remembers where you left off.

It's built mobile-first, keyboard-operable, and screen-reader aware on purpose — the students who benefit most from virtual manipulatives are too often the ones underserved by the tools that already exist. No accounts, no clutter, and no tracking of minors.

It's also designed to grow: an author drops in a single file and a new topic shows up in the navigation automatically — same-night publishing, no database, no setup ritual.

## What's inside

| Path | What it is |
|------|------------|
| `apps/resources` | The Math Resources Hub (resources.cameronbrady.dev) |
| `apps/portfolio` | The personal portfolio site (cameronbrady.dev) |
| `packages/ui` | Shared design system — tokens + a few UI primitives both apps use |

Under the hood: a [Turborepo](https://turbo.build/) monorepo on Next.js 15 (App Router) and TypeScript, with Tailwind v4, file-based MDX content, and the math interactives built on [mafs](https://mafs.dev). 100+ unit tests and counting. See the [full roadmap](./apps/resources/docs/ROADMAP.md) for where it's headed.

## Where this is going: an open component library

The interactive pieces — the coordinate-plane **Grapher**, the **PracticeSet**, and the virtual manipulatives still to come — are being shaped into a standalone, installable package so any educator or developer can drop accessible math interactives into their *own* site. That's the real open-source goal here, and it's actively in progress. ⭐ Star or watch the repo to follow along.

## Contributing

This is a community-minded project, and there are two easy ways in — pick whichever fits.

**1. Components & ideas for components** *(most wanted)*

Got an idea for a manipulative or interactive — fraction bars, a number line, a geometry tool you wish existed? Or built one yourself?

- **Ideas:** [open an issue](https://github.com/cameronbrady1527/portfolio-v2/issues/new) describing what you'd want and who it helps. Not a GitHub person? The [contact form](https://cameronbrady.dev/contact) works just as well — teachers and students, this especially means you.
- **Code:** fork it, build your component, and open a pull request. The one ask: keep it accessible (keyboard + screen reader friendly).

**2. Everything else**

Spotted a typo, a clearer way to explain something, a bug, or want to suggest a whole new topic? Open an issue or a PR. Small fixes make great first contributions, and questions are always welcome.

## Getting started

This project uses [pnpm](https://pnpm.io/).

```bash
pnpm install      # install dependencies
pnpm dev          # run both apps
```

To run just one app: `pnpm --filter resources dev` (the Hub) or `pnpm --filter portfolio dev`.

The Hub needs no environment setup. The portfolio's contact form expects a `RESEND_API_KEY` in `apps/portfolio/.env.local`.

```bash
pnpm build        # build everything
```

The Hub's logic is covered by 100+ Vitest unit tests — run `pnpm vitest run` inside `apps/resources`.

## License

The code is released under the [MIT License](./LICENSE) — use it, learn from it, build on it. The lesson content itself (the explanations and practice problems) is © its authors; please ask before republishing it wholesale.
