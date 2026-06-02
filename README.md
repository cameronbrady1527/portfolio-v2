# Cameron Brady Portfolio

Personal portfolio website for Cameron Brady — educator, academic tutor, nonprofit founder, and fullstack freelance developer. It showcases tutoring services, freelance work, technical projects, and the story behind them.

Live at [cameronbrady.dev](https://cameronbrady.dev).

## Setup

1. Clone the repository

2. Install dependencies (this project uses [pnpm](https://pnpm.io/)):
   ```bash
   pnpm install
   ```

3. Set up environment variables. Create a `.env.local` file with:
   ```
   RESEND_API_KEY=your_resend_api_key
   ```

4. Run the development server:
   ```bash
   pnpm dev
   ```

5. Open [http://localhost:3000](http://localhost:3000)

## Pages

- **Home** — Animated hero with rotating roles, featured work, and quick contact
- **About** — Journey timeline, professional experience, volunteer work, and personal interests
- **Projects** — Filterable showcase of technical, ML, and AI projects with detail panels
- **Services** — Academic tutoring offering with subjects grid, approach, pricing, and testimonials
- **Contact** — Variant-aware contact form (tutoring / portfolio / general inquiries)

## Features

- **Animated Hero Section** — Text-flip effect cycling through roles (Academic Tutor, Educator, Fullstack Developer)
- **Variant-Aware Contact Form** — Tailored validation, notification, and confirmation emails per inquiry type
- **Project Showcase** — Filterable grid with detail panels, live demos, and source links
- **Responsive Design** — Mobile-first layout with smooth animations
- **Modern UI Components** — Custom components built on Radix UI primitives with Framer Motion and Three.js visuals

## Tech Stack

- **Framework:** Next.js 15 (App Router, Turbopack)
- **Language:** TypeScript
- **UI/Styling:** Tailwind CSS v4, Radix UI primitives
- **Animations:** Framer Motion / Motion, react-type-animation
- **3D / Visuals:** Three.js, React Three Fiber, Cobe
- **Forms:** React Hook Form + Zod validation
- **Email:** Resend + React Email
- **Notifications:** Sonner
- **Icons:** Lucide React, Tabler Icons

> Note: Page content currently lives as static data in `src/components/AppData/`. Supabase is installed for a planned data/admin layer (`src/db/`, `src/components/admin/`), but those modules are not yet wired up.

## Build

```bash
pnpm build
pnpm start
```

## Deployment

Optimized for deployment on Vercel.
