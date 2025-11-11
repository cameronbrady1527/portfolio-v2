// app/projects/page.tsx - Projects page
import { Metadata } from 'next';
import ProjectsGrid from '@/components/ProjectsGrid';

export const metadata: Metadata = {
  title: 'Projects - Cameron Brady',
  description: 'Technical projects spanning machine learning, full-stack development, and computational neuroscience research.',
}

export default function ProjectsPage() {
  return (
    <div className="pt-20 pb-16 min-h-screen bg-slate-50">
      <div className="container mx-auto px-6">
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