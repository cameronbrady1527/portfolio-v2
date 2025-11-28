// components/FeaturedWork.tsx - Featured projects and research
'use client';

import Link from 'next/link';
import { useContext } from 'react';
import { motion } from 'motion/react';
import { Github, ExternalLink, BookOpen, ArrowRight } from 'lucide-react';

import { ProjectsContext } from '@/lib/utils';
import NavLink from '@/components/NavLink';

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
            className="flex items-center justify-between mb-12"
          >
            <h3 className="text-2xl font-semibold text-slate-800">Check These Out!</h3>
            <NavLink
              href="/projects"
              className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium group"
            >
              <motion.div
                className="flex items-center gap-2"
                initial="initial"
                whileHover="hover"
              >
                <span className="relative inline-block after:content-[''] after:absolute after:left-0 after:bottom-0
                                 after:w-full after:h-0.5 after:bg-blue-600 after:origin-right after:scale-x-0
                                 hover:after:origin-left hover:after:scale-x-100 after:transition-transform
                                 after:duration-300 after:ease-out">
                  All Projects
                </span>
                <motion.span
                  variants={{
                    initial: { x: 0 },
                    hover: {
                      x: [0, 8, 0],
                      transition: {
                        duration: 0.6,
                        ease: "easeInOut",
                        repeat: Infinity
                      }
                    }
                  }}
                  className="inline-block"
                >
                  <ArrowRight size={18} />
                </motion.span>
              </motion.div>
            </NavLink>
          </motion.div>

          <div className="space-y-24">
            {featuredProjects.map((project, index) => (
              <motion.div
                key={project.title}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.15 }}
                className={`flex flex-col ${index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'} gap-12 items-center`}
              >
                {/* Visual/Image Area */}
                <div className="flex-1 w-full">
                  <div className={`relative h-96 rounded-2xl overflow-hidden shadow-2xl group bg-linear-to-br ${
                    project.type.includes('ml')
                      ? 'from-purple-100 via-blue-100 to-indigo-100'
                      : 'from-blue-100 via-cyan-100 to-teal-100'
                  }`}>
                    {/* Placeholder for project screenshot - can be replaced with actual images */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center p-8">
                        <BookOpen className={`mx-auto mb-4 ${
                          project.type.includes('ml') ? 'text-purple-400' : 'text-blue-400'
                        }`} size={64} />
                        <p className="text-slate-500 text-sm">Project Preview</p>
                      </div>
                    </div>
                    <div className="absolute inset-0 bg-linear-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                </div>

                {/* Content Area */}
                <div className="flex-1">
                  <div className="inline-block px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-medium mb-4">
                    Featured
                  </div>

                  <h4 className="text-3xl font-light text-slate-800 mb-4">
                    {project.title}
                  </h4>

                  <div className={`h-1 w-20 rounded-full mb-6 ${
                    project.type.includes('ml') ? 'bg-purple-500' : 'bg-blue-500'
                  }`} />

                  <p className="text-slate-600 leading-relaxed text-lg mb-6">
                    {project.description}
                  </p>

                  <div className="flex flex-wrap gap-2 mb-6">
                    {project.technologies.map((tech, techIndex) => (
                      <span
                        key={techIndex}
                        className={`px-3 py-1.5 rounded-full text-sm font-medium ${
                          project.type.includes('ml')
                            ? 'bg-purple-50 text-purple-700 border border-purple-200'
                            : 'bg-blue-50 text-blue-700 border border-blue-200'
                        }`}
                      >
                        {tech}
                      </span>
                    ))}
                  </div>

                  <div className="flex gap-4">
                    {project.codeRepo && (
                      <a
                        href={project.codeRepo}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-5 py-2.5 border-2 border-slate-300 rounded-xl hover:border-slate-400 hover:bg-slate-50 transition-all text-sm font-medium"
                      >
                        <Github size={18} />
                        View Code
                      </a>
                    )}

                    {project.demoLink && (
                      <a
                        href={project.demoLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-white transition-all text-sm font-medium ${
                          project.type.includes('ml')
                            ? 'bg-purple-600 hover:bg-purple-700'
                            : 'bg-blue-600 hover:bg-blue-700'
                        }`}
                      >
                        <ExternalLink size={18} />
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