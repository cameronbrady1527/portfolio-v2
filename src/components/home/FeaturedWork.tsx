// components/FeaturedWork.tsx - Featured projects and research
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useContext, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Github, ExternalLink, BookOpen, ArrowRight, X, Download } from 'lucide-react';

import { ProjectsContext } from '@/lib/utils';
import NavLink from '@/components/NavLink';

export default function FeaturedWork() {
  const allProjects = useContext(ProjectsContext);
  const [expandedImage, setExpandedImage] = useState<string | null>(null);

  const featuredProjects = allProjects.slice(0, 4);

  // Prevent body scroll when image is expanded
  useEffect(() => {
    if (expandedImage) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [expandedImage]);

  return (
    <section className="py-20">
      <div className="container mx-auto w-9/10 px-6 relative z-10">
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
                        repeat: 1
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
                  <div
                    onClick={() => setExpandedImage(project.imageUrl)}
                    className="relative rounded-2xl overflow-hidden shadow-2xl group bg-slate-100 cursor-pointer"
                  >
                    <Image
                      src={project.imageUrl}
                      alt={project.title}
                      width={1900}
                      height={870}
                      className="w-full h-auto object-contain object-center"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <span className="text-white text-sm font-medium bg-black/50 px-4 py-2 rounded-lg">
                        Click to expand
                      </span>
                    </div>
                  </div>
                </div>

                {/* Content Area */}
                <div className="flex-1">
                  <h4 className="text-3xl font-light text-slate-800 mb-4">
                    {project.title}
                  </h4>

                  <div className="h-1 w-20 rounded-full mb-6 bg-blue-500" />

                  <p className="text-slate-600 leading-relaxed text-lg mb-6">
                    {project.description}
                  </p>

                  <div className="flex flex-wrap gap-2 mb-6">
                    {project.technologies.map((tech, techIndex) => (
                      <span
                        key={techIndex}
                        className="px-3 py-1.5 rounded-full text-sm font-medium bg-blue-50 text-blue-700 border border-blue-200"
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
                        className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-white transition-all text-sm font-medium bg-blue-600 hover:bg-blue-700"
                      >
                        <ExternalLink size={18} />
                        Live Demo
                      </a>
                    )}

                    {project.downloadLink && (
                      <a
                        href={project.downloadLink}
                        download
                        className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-white transition-all text-sm font-medium bg-green-600 hover:bg-green-700"
                      >
                        <Download size={18} />
                        Download Project
                      </a>
                    )}

                    {project.demoDownload && (
                      <a
                        href={project.demoDownload}
                        download
                        className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-white transition-all text-sm font-medium bg-green-600 hover:bg-green-700"
                      >
                        <Download size={18} />
                        Download Demo
                      </a>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Image Lightbox Modal */}
      <AnimatePresence>
        {expandedImage && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setExpandedImage(null)}
              className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4 cursor-pointer"
            >
              {/* Close button */}
              <button
                onClick={() => setExpandedImage(null)}
                className="absolute top-6 right-6 p-3 bg-white/10 hover:bg-white/20 rounded-full transition-colors z-10"
                aria-label="Close image"
              >
                <X size={24} className="text-white" />
              </button>

              {/* Expanded Image */}
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ duration: 0.2 }}
                onClick={(e) => e.stopPropagation()}
                className="relative max-w-7xl max-h-[90vh] w-full"
              >
                <Image
                  src={expandedImage}
                  alt="Expanded view"
                  width={1900}
                  height={870}
                  className="w-full h-auto object-contain rounded-lg"
                />
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </section>
  )
}