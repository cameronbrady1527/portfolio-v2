# Cameron Brady Portfolio

Personal portfolio website showcasing my work as an ML researcher, future neurosurgeon, and academic tutor.

## Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env.local` file with:
   ```
   RESEND_API_KEY=your_resend_api_key
   SUPABASE_URL=your_supabase_url
   SUPABASE_ANON_KEY=your_supabase_key
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000)

## Features

- **Animated Hero Section** - Typewriter effect showcasing multiple roles
- **Project Showcase** - Highlighting ML research and technical projects
- **Services Page** - Academic tutoring services with subject grid and testimonials
- **Contact Form** - Email integration via Resend API
- **Responsive Design** - Mobile-first approach with smooth animations
- **Modern UI Components** - Custom components built with Radix UI and Framer Motion

## Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Styling:** Tailwind CSS v4
- **Animations:** Framer Motion
- **Email:** Resend API
- **Database:** Supabase
- **Forms:** React Hook Form + Zod validation
- **Icons:** Lucide React

## Build

```bash
npm run build
npm start
```

## Deployment

Optimized for deployment on Vercel.
