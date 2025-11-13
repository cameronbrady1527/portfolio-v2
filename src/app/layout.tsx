// app/layout.tsx - Updated root layout
import './globals.css'
import { Inter } from 'next/font/google'
import type { Metadata } from 'next'
import { Toaster } from "sonner"
import { Github, Linkedin } from 'lucide-react'
import Link from 'next/link'

import Navigation from '@/components/Navigation'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Cameron Brady - ML Researcher & Future Neurosurgeon',
  description: 'Machine Learning Researcher focused on computational neuroscience and early detection of neurological disorders. Bridging AI research with clinical medicine.',
  keywords: ['machine learning', 'neuroscience', 'research', 'developer', 'AI', 'medical'],
  authors: [{ name: 'Cameron Brady' }],
  icons: {
    icon: '/brain-favicon.svg',
  },
  openGraph: {
    title: 'Cameron Brady - ML Researcher & Future Neurosurgeon',
    description: 'Bridging AI research with clinical medicine to advance neurological disorder detection',
    url: 'https://cameronbrady.dev',
    siteName: 'Cameron Brady Portfolio',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.className} antialiased bg-slate-50`}>
        <Navigation />
        <main className="min-h-screen">
          {children}
          <Toaster position="top-right" />
        </main>
        <footer className="bg-white border-t border-slate-200 py-8">
          <div className="container mx-auto px-6">
            <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
              <p className="text-slate-600">
                © 2025 Cameron Brady
              </p>
              <div className="flex gap-4">
                <Link
                  href="https://www.linkedin.com/in/cameron-brady-5770431b5/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-600 hover:text-blue-600 transition-colors"
                  aria-label="LinkedIn"
                >
                  <Linkedin size={24} />
                </Link>
                <Link
                  href="https://github.com/cameronbrady1527"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-600 hover:text-slate-900 transition-colors"
                  aria-label="GitHub"
                >
                  <Github size={24} />
                </Link>
              </div>
            </div>
          </div>
        </footer>
      </body>
    </html>
  )
}
