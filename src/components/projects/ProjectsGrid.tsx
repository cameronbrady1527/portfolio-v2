// components/ProjectsGrid.tsx - Projects grid with filtering
'use client'

/* -------------------------------------------------------------------------- */
/*                            External Dependencies                           */
/* -------------------------------------------------------------------------- */
import { useState, useContext } from 'react'
import { Github, ExternalLink, Filter } from 'lucide-react'

/* -------------------------------------------------------------------------- */
/*                            Internal Dependencies                           */
/* -------------------------------------------------------------------------- */
import { ProjectsContext } from '@/lib/utils'
import Image from 'next/image'

/* -------------------------------------------------------------------------- */
/*                                   Types                                    */
/* -------------------------------------------------------------------------- */
type ProjectCategory = 'project' | 'ml' | 'ai' | 'research' | 'cornell'

/* -------------------------------------------------------------------------- */
/*                                 Component                                  */
/* -------------------------------------------------------------------------- */
export default function ProjectsGrid() {
  const [selectedCategory, setSelectedCategory] = useState<ProjectCategory>('project');
  
  // Load project data
  const allProjects = useContext(ProjectsContext);

  const categories = [
    // { id: 'all', label: 'All Projects', count: allProjects.length },
    { id: 'project', label: 'All', count: allProjects.filter(p => p.type.includes('project')).length },
    { id: 'ml', label: 'ML', count: allProjects.filter(p => p.type.includes('ml')).length },
    { id: 'ai', label: 'AI', count: allProjects.filter(p => p.type.includes('ai')).length },
    { id: 'research', label: 'Research', count: allProjects.filter(p => p.type.includes('research')).length },
    { id: 'cornell', label: 'Cornell Project', count: allProjects.filter(p => p.type.includes('cornell')).length },
  ];
  
  const filteredProjects = selectedCategory === 'project' 
    ? allProjects 
    : allProjects.filter(project => project.type.includes(selectedCategory));
  
  return (
    <div className="lg:w-3/5 sm:w-5/5 md:w-4/5 mx-auto">
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
      <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-8">
        {filteredProjects.map((project) => (
          <div key={project.title} className="group bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            {/* Project image */}
            <div className="aspect-video overflow-hidden bg-slate-100">
              <div className="w-full h-full bg-linear-to-br from-slate-200 to-slate-300 flex items-center justify-center">
                {project.imageUrl === "TODO" 
                  ? <span className="text-slate-500 text-xl">{project.title}</span> 
                  : <Image src={project.imageUrl} alt={project.title} />
                }
                {/* <span className="text-slate-500 text-2xl">{project.title}</span> */}
              </div>
            </div>
            
            <div className="p-6">
              {/* Category and featured badges */}
              {/* <div className="flex items-center justify-between mb-3">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getCategoryColor(project.category)}`}>
                  {getCategoryLabel(project.category)}
                </span>
                
                {project.featured && (
                  <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded text-xs font-medium">
                    Featured
                  </span>
                )}
              </div> */}
              {project.imageUrl !== 'TODO' && 
                <h3 className="text-xl font-semibold text-slate-800 mb-3 group-hover:text-blue-600 transition-colors">
                {project.title}
                </h3>
              }
              
              
              <p className="text-slate-600 mb-4 line-clamp-3">
                {project.description}
              </p>
              
              {/* Tech stack */}
              <div className="flex flex-wrap gap-2 mb-4">
                {project.technologies.map((tech, index) => (
                  <span 
                    key={index}
                    className="px-2 py-1 bg-slate-100 text-slate-600 rounded text-sm"
                  >
                    {tech}
                  </span>
                ))}
                {/* {project.technologies.length > 4 && (
                  <span className="px-2 py-1 bg-slate-100 text-slate-500 rounded text-sm">
                    +{project.technologies.length - 4} more
                  </span>
                )} */}
              </div>
              
              {/* Actions */}
              <div className="flex gap-3">
                {project.codeRepo && (
                  <a 
                    href={project.codeRepo}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors text-sm font-medium"
                  >
                    <Github size={16} />
                    Code
                  </a>
                )}
                
                {project.demoLink !== 'TODO' && (
                  <a 
                    href={project.demoLink}
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