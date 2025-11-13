// components/FeaturedWork.tsx - Featured projects and research
'use client';

import Link from 'next/link';
import { useContext } from 'react';
import { motion } from 'motion/react';
import { Github, ExternalLink, BookOpen, ArrowRight } from 'lucide-react';

import { ProjectsContext } from '@/lib/utils';

export default function FeaturedWork() {
  const allProjects = useContext(ProjectsContext);

  const featuredProjects = allProjects.slice(0, 4);

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto w-9/10 px-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-light text-slate-800 mb-4">Featured Work</h2>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Highlights from my research and technical projects
          </p>
        </motion.div>
        
        {/* Featured Projects */}
        <div className="mb-20">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex items-center justify-between mb-8"
          >
            <h3 className="text-2xl font-semibold text-slate-800">Check These Out!</h3>
            <Link 
              href="/projects"
              className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium group"
            >
              <span className="relative inline-block after:content-[''] after:absolute after:left-0 after:bottom-0
                               after:w-full after:h-0.5 after:bg-blue-600 after:origin-right after:scale-x-0
                               hover:after:origin-left hover:after:scale-x-100 after:transition-transform
                               after:duration-300 after:ease-out">
                All Projects
              </span>
              <motion.span
                animate={{ x: [0, 8, 0] }}
                transition={{
                  duration: 1.0,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="inline-block"
              >
                <ArrowRight size={18} />
              </motion.span>
            </Link>
          </motion.div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {featuredProjects.map((project, index) => (
              <motion.div 
                key={project.title} 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                <div className="p-6">
                  {/* <div className="flex items-center justify-between mb-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      project.type.includes('ml')
                        ? 'bg-purple-100 text-purple-700'
                        : 'bg-blue-100 text-blue-700'
                    }`}>
                      {project.type.includes('ml') ? 'Machine Learning' : 'Full Stack'}
                    </span>
                    
                    <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded text-xs font-medium">
                      Featured
                    </span>
                  </div> */}
                  
                  <h4 className="text-xl font-semibold text-slate-800 mb-3 group-hover:text-blue-600 transition-colors">
                    {project.title}
                  </h4>
                  
                  <p className="text-slate-600 mb-4">
                    {project.description}
                  </p>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.technologies.map((tech, index) => (
                      <span key={index} className="px-2 py-1 bg-slate-100 text-slate-600 rounded text-sm">
                        {tech}
                      </span>
                    ))}
                  </div>
                  
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
                    
                    {project.demoLink && (
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
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}