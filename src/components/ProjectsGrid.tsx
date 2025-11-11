// components/ProjectsGrid.tsx - Projects grid with filtering
'use client'
import { useState } from 'react'
import { Github, ExternalLink, Filter } from 'lucide-react'

// Temporary static data - replace with Supabase later
const allProjects = [
  {
    id: 1,
    title: "Parkinson's Detection via Vocal Biomarkers",
    description: "Machine learning system for early Parkinson's disease detection using vocal pattern analysis. Achieved 92% accuracy using ensemble methods including Random Forest, SVM, and Neural Networks.",
    category: "ml",
    tech_stack: ["Python", "TensorFlow", "Scikit-learn", "Signal Processing", "Pandas", "NumPy"],
    github_url: "https://github.com/cameronbrady1527/parkinsons-detection",
    featured: true,
    image_url: "/api/placeholder/400/250"
  },
  {
    id: 2,
    title: "Neural Network Visualization Platform",
    description: "Interactive web application for visualizing neural network architectures and training processes. Built for educational purposes with real-time parameter adjustment.",
    category: "fullstack",
    tech_stack: ["React", "D3.js", "Node.js", "MongoDB", "Express", "Socket.io"],
    live_url: "https://neural-viz.cameronbrady.dev",
    github_url: "https://github.com/cameronbrady1527/neural-viz",
    featured: true,
    image_url: "/api/placeholder/400/250"
  },
  {
    id: 3,
    title: "EEG Signal Analysis Toolkit",
    description: "Python toolkit for preprocessing and analyzing EEG signals with focus on neurological disorder detection. Includes artifact removal and feature extraction.",
    category: "research",
    tech_stack: ["Python", "MNE", "SciPy", "Matplotlib", "Jupyter"],
    github_url: "https://github.com/cameronbrady1527/eeg-toolkit",
    featured: false,
    image_url: "/api/placeholder/400/250"
  },
  {
    id: 4,
    title: "Medical Image Segmentation",
    description: "Deep learning model for brain tumor segmentation in MRI scans using U-Net architecture. Achieved state-of-the-art performance on BraTS dataset.",
    category: "ml",
    tech_stack: ["Python", "PyTorch", "MONAI", "DICOM", "OpenCV"],
    github_url: "https://github.com/cameronbrady1527/brain-segmentation",
    featured: false,
    image_url: "/api/placeholder/400/250"
  },
  {
    id: 5,
    title: "Research Portfolio Website",
    description: "This very website! Built with Next.js 15, TypeScript, and Tailwind CSS. Features a clean design optimized for showcasing research and technical work.",
    category: "fullstack",
    tech_stack: ["Next.js", "TypeScript", "Tailwind CSS", "Vercel"],
    live_url: "https://cameronbrady.dev",
    github_url: "https://github.com/cameronbrady1527/portfolio",
    featured: false,
    image_url: "/api/placeholder/400/250"
  }
]

type ProjectCategory = 'all' | 'ml' | 'fullstack' | 'research'

export default function ProjectsGrid() {
  const [selectedCategory, setSelectedCategory] = useState<ProjectCategory>('all')
  
  const categories = [
    { id: 'all', label: 'All Projects', count: allProjects.length },
    { id: 'ml', label: 'Machine Learning', count: allProjects.filter(p => p.category === 'ml').length },
    { id: 'fullstack', label: 'Full Stack', count: allProjects.filter(p => p.category === 'fullstack').length },
    { id: 'research', label: 'Research Tools', count: allProjects.filter(p => p.category === 'research').length },
  ]
  
  const filteredProjects = selectedCategory === 'all' 
    ? allProjects 
    : allProjects.filter(project => project.category === selectedCategory)
  
  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'ml': return 'bg-purple-100 text-purple-700'
      case 'research': return 'bg-green-100 text-green-700'
      case 'fullstack': return 'bg-blue-100 text-blue-700'
      default: return 'bg-slate-100 text-slate-700'
    }
  }
  
  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'ml': return 'Machine Learning'
      case 'research': return 'Research'
      case 'fullstack': return 'Full Stack'
      default: return category
    }
  }
  
  return (
    <div>
      {/* Filter tabs */}
      <div className="flex flex-wrap gap-2 mb-8">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => setSelectedCategory(category.id as ProjectCategory)}
            className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
              selectedCategory === category.id
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
            }`}
          >
            {category.label} ({category.count})
          </button>
        ))}
      </div>
      
      {/* Projects grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredProjects.map((project) => (
          <div key={project.id} className="group bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            {/* Project image */}
            <div className="aspect-video overflow-hidden bg-slate-100">
              <div className="w-full h-full bg-linear-to-br from-slate-200 to-slate-300 flex items-center justify-center">
                <span className="text-slate-500 text-sm">Project Image</span>
              </div>
            </div>
            
            <div className="p-6">
              {/* Category and featured badges */}
              <div className="flex items-center justify-between mb-3">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getCategoryColor(project.category)}`}>
                  {getCategoryLabel(project.category)}
                </span>
                
                {project.featured && (
                  <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded text-xs font-medium">
                    Featured
                  </span>
                )}
              </div>
              
              <h3 className="text-xl font-semibold text-slate-800 mb-3 group-hover:text-blue-600 transition-colors">
                {project.title}
              </h3>
              
              <p className="text-slate-600 mb-4 line-clamp-3">
                {project.description}
              </p>
              
              {/* Tech stack */}
              <div className="flex flex-wrap gap-2 mb-4">
                {project.tech_stack.slice(0, 4).map((tech, index) => (
                  <span 
                    key={index}
                    className="px-2 py-1 bg-slate-100 text-slate-600 rounded text-sm"
                  >
                    {tech}
                  </span>
                ))}
                {project.tech_stack.length > 4 && (
                  <span className="px-2 py-1 bg-slate-100 text-slate-500 rounded text-sm">
                    +{project.tech_stack.length - 4} more
                  </span>
                )}
              </div>
              
              {/* Actions */}
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
      
      {filteredProjects.length === 0 && (
        <div className="text-center py-12">
          <p className="text-slate-500 text-lg">No projects found in this category.</p>
        </div>
      )}
    </div>
  )
}