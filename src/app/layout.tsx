// app/layout.tsx - Updated root layout
import './globals.css'
import { Inter, JetBrains_Mono } from 'next/font/google'
import type { Metadata } from 'next'
import { Toaster } from "sonner"
import { Github, Linkedin } from 'lucide-react'
import Link from 'next/link'

import Navigation from '@/components/Navigation'
import { NavigationProvider } from '@/contexts/NavigationContext'

// const inter = Inter({ subsets: ['latin'] })
const jetbrainsMono = JetBrains_Mono({ subsets: ['latin'] });

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
      <body className={`${jetbrainsMono.className} antialiased bg-slate-50 relative`}>
        {/* Global grid pattern */}
        <div
          className="fixed inset-0 opacity-30 pointer-events-none"
          style={{
            backgroundImage: `
              linear-gradient(to right, rgb(148 163 184 / 0.5) 1px, transparent 1px),
              linear-gradient(to bottom, rgb(148 163 184 / 0.5) 1px, transparent 1px)
            `,
            backgroundSize: '80px 80px',
            zIndex: 5
          }}
        />
        <NavigationProvider>
          <Navigation />
          <main className="min-h-screen relative">
            {children}
            <Toaster position="top-right" />
          </main>
          <footer className="bg-white border-t border-slate-200 py-8 relative" style={{ zIndex: 20 }}>
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
        </NavigationProvider>
      </body>
    </html>
  )
}
