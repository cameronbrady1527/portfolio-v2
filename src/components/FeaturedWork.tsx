// components/FeaturedWork.tsx - Featured projects and research
'use client'
import Link from 'next/link'
import { Github, ExternalLink, BookOpen, ArrowRight } from 'lucide-react'

// Temporary static data - will be replaced with Supabase later
const featuredProjects = [
  {
    id: 1,
    title: "Parkinson's Detection via Vocal Biomarkers",
    description: "Machine learning system for early Parkinson's disease detection using vocal pattern analysis. Achieved 92% accuracy using ensemble methods.",
    category: "ml",
    tech_stack: ["Python", "TensorFlow", "Scikit-learn", "Signal Processing"],
    github_url: "https://github.com/cameronbrady1527/parkinsons-detection",
    featured: true
  },
  {
    id: 2, 
    title: "Neural Network Visualization Platform",
    description: "Interactive web application for visualizing neural network architectures and training processes. Built for educational purposes.",
    category: "fullstack",
    tech_stack: ["React", "D3.js", "Node.js", "MongoDB"],
    live_url: "https://neural-viz.cameronbrady.dev",
    github_url: "https://github.com/cameronbrady1527/neural-viz",
    featured: true
  }
];

export default function FeaturedWork() {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-light text-slate-800 mb-4">Featured Work</h2>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Highlights from my research and technical projects
          </p>
        </div>
        
        {/* Featured Projects */}
        <div className="mb-20">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-2xl font-semibold text-slate-800">Technical Projects</h3>
            <Link 
              href="/projects"
              className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
            >
              View All Projects <ArrowRight size={16} />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {featuredProjects.map((project) => (
              <div key={project.id} className="group bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      project.category === 'ml' 
                        ? 'bg-purple-100 text-purple-700'
                        : 'bg-blue-100 text-blue-700'
                    }`}>
                      {project.category === 'ml' ? 'Machine Learning' : 'Full Stack'}
                    </span>
                    
                    <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded text-xs font-medium">
                      Featured
                    </span>
                  </div>
                  
                  <h4 className="text-xl font-semibold text-slate-800 mb-3 group-hover:text-blue-600 transition-colors">
                    {project.title}
                  </h4>
                  
                  <p className="text-slate-600 mb-4">
                    {project.description}
                  </p>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.tech_stack.slice(0, 3).map((tech, index) => (
                      <span key={index} className="px-2 py-1 bg-slate-100 text-slate-600 rounded text-sm">
                        {tech}
                      </span>
                    ))}
                    {project.tech_stack.length > 3 && (
                      <span className="px-2 py-1 bg-slate-100 text-slate-500 rounded text-sm">
                        +{project.tech_stack.length - 3} more
                      </span>
                    )}
                  </div>
                  
                  <div className="flex gap-3">
                    {project.github_url && (
                      <a 
                        href={project.github_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors text-sm font-medium"
                      >
                        <Github size={16} />
                        Code
                      </a>
                    )}
                    
                    {project.live_url && (
                      <a 
                        href={project.live_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                      >
                        <ExternalLink size={16} />
                        Live Demo
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}