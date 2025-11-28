// app/projects/page.tsx - Projects page
import { Metadata } from 'next';
import ProjectsGrid from '@/components/projects/ProjectsGrid';

export const metadata: Metadata = {
  title: 'Projects - Cameron Brady',
  description: 'Technical projects spanning machine learning, full-stack development, and computational neuroscience research.',
}

export default function ProjectsPage() {
  return (
    <div className="pt-20 pb-16 min-h-screen bg-linear-to-br from-slate-50 via-blue-50 to-indigo-50 relative">
      {/* Floating background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-200 rounded-full blur-3xl opacity-20 animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-200 rounded-full blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-light text-slate-800 mb-4">
            Technical Projects
          </h1>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            A collection of projects spanning machine learning research, full-stack development,
            and computational tools for neuroscience applications.
          </p>
        </div>

        <ProjectsGrid />
      </div>
    </div>
  )
}