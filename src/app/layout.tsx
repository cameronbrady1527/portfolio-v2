// app/layout.tsx - Updated root layout
import './globals.css'
import { Inter } from 'next/font/google'
import Navigation from '@/components/Navigation'
import type { Metadata } from 'next'
import { Toaster } from "sonner";

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
        <footer className="bg-white border-t border-slate-200 py-12">
          <div className="container mx-auto px-6 text-center">
            <p className="text-slate-600">
              © 2025 Cameron Brady. Built with Next.js and hosted on Vercel.
            </p>
          </div>
        </footer>
      </body>
    </html>
  )
}
