'use client'

import { motion, AnimatePresence } from 'framer-motion';
import { X, Github, ExternalLink, Download } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useState } from 'react';

interface Project {
  title: string;
  description: string;
  about: string;
  demoLink: string;
  imageUrl: string;
  codeRepo: string;
  downloadLink?: string;
  demoDownload?: string;
  type: string[];
  technologies: string[];
  status: string;
}

interface ProjectDetailPanelProps {
  project: Project | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function ProjectDetailPanel({ project, isOpen, onClose }: ProjectDetailPanelProps) {
  const [expandedImage, setExpandedImage] = useState<string | null>(null);

  // Prevent body scroll, hide footer, and set navbar background when panel is open
  useEffect(() => {
    const footer = document.querySelector('footer');
    const navbar = document.querySelector('nav') || document.querySelector('header');

    if (isOpen) {
      document.body.style.overflow = 'hidden';
      if (footer) {
        footer.style.display = 'none';
      }
      if (navbar) {
        navbar.classList.add('bg-white', 'shadow-sm');
      }
    } else {
      document.body.style.overflow = 'unset';
      if (footer) {
        footer.style.display = '';
      }
      if (navbar) {
        navbar.classList.remove('bg-white', 'shadow-sm');
      }
    }

    return () => {
      document.body.style.overflow = 'unset';
      if (footer) {
        footer.style.display = '';
      }
      if (navbar) {
        navbar.classList.remove('bg-white', 'shadow-sm');
      }
    };
  }, [isOpen]);

  if (!project) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop - click to close */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-40 backdrop-blur-sm"
            style={{ top: '64px' }} // Below header (h-16 = 64px)
          />

          {/* Slide-in Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed right-0 z-50 bg-white shadow-2xl overflow-y-auto
                       w-full md:w-3/5 lg:w-1/2 xl:w-2/5"
            style={{
              top: '64px', // Below header
              height: 'calc(100vh - 64px)'
            }}
          >
            {/* Close button */}
            <button
              onClick={onClose}
              className="sticky top-4 left-4 z-10 p-2 bg-white rounded-full shadow-lg hover:bg-slate-100 transition-colors border border-slate-200"
              aria-label="Close panel"
            >
              <X size={24} className="text-slate-700" />
            </button>

            {/* Content */}
            <div className="p-8">
              {/* Hero Image */}
              <div className="aspect-video w-full rounded-xl overflow-hidden mb-6 bg-slate-100">
                {project.imageUrl === "TODO" ? (
                  <div className="w-full h-full bg-linear-to-br from-slate-200 to-slate-300 flex items-center justify-center">
                    <span className="text-slate-500 text-2xl font-light">{project.title}</span>
                  </div>
                ) : (
                  <div
                    onClick={() => setExpandedImage(project.imageUrl)}
                    className="relative w-full h-full cursor-pointer group"
                  >
                    <Image
                      src={project.imageUrl}
                      alt={project.title}
                      width={800}
                      height={450}
                      className="w-full h-full object-contain object-center"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <span className="text-white text-sm font-medium bg-black/50 px-4 py-2 rounded-lg">
                        Click to expand
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Title */}
              <h2 className="text-3xl font-light text-slate-800 mb-4">
                {project.title}
              </h2>

              {/* Short Description */}
              <p className="text-lg text-slate-600 mb-6 leading-relaxed">
                {project.description}
              </p>

              {/* Tech Stack */}
              <div className="mb-8">
                <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wider mb-3">
                  Technologies
                </h3>
                <div className="flex flex-wrap gap-2">
                  {project.technologies.map((tech, index) => (
                    <span
                      key={index}
                      className="px-3 py-1.5 bg-slate-100 text-slate-700 rounded-full text-sm font-medium"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* Long Description */}
              {project.about && project.about !== "TODO" && (
                <div className="mb-8">
                  <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wider mb-3">
                    About This Project
                  </h3>
                  <p className="text-slate-600 leading-relaxed">
                    {project.about}
                  </p>
                </div>
              )}

              {/* Status Badge */}
              <div className="mb-8">
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                  project.status === 'prod' ? 'bg-green-100 text-green-700' :
                  project.status === 'dev' ? 'bg-blue-100 text-blue-700' :
                  'bg-yellow-100 text-yellow-700'
                }`}>
                  {project.status === 'prod' ? 'Production' :
                   project.status === 'dev' ? 'In Development' :
                   'Early Development'}
                </span>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 pt-4 border-t border-slate-200">
                {project.codeRepo && (
                  <a
                    href={project.codeRepo}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center gap-2 px-6 py-3 border-2 border-slate-300 rounded-xl hover:border-slate-400 hover:bg-slate-50 transition-all text-slate-700 font-medium"
                  >
                    <Github size={20} />
                    View Code
                  </a>
                )}

                {project.demoLink && project.demoLink !== "TODO" && (
                  <a
                    href={project.demoLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium"
                  >
                    <ExternalLink size={20} />
                    Live Demo
                  </a>
                )}

                {project.downloadLink && (
                  <a
                    href={project.downloadLink}
                    download
                    className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors font-medium"
                  >
                    <Download size={20} />
                    Download
                  </a>
                )}

                {project.demoDownload && (
                  <a
                    href={project.demoDownload}
                    download
                    className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors font-medium"
                  >
                    <Download size={20} />
                    Download
                  </a>
                )}
              </div>
            </div>
          </motion.div>

          {/* Image Lightbox Modal */}
          {expandedImage && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setExpandedImage(null)}
              className="fixed left-0 right-0 bg-black/90 z-60 flex items-center justify-center cursor-pointer"
              style={{ top: '64px', height: 'calc(100vh - 64px)' }}
            >
              {/* Close button */}
              <button
                onClick={() => setExpandedImage(null)}
                className="absolute top-6 right-6 p-3 bg-white/20 hover:bg-white/30 rounded-full transition-colors shadow-lg border-2 border-white/30"
                aria-label="Close image"
              >
                <X size={28} className="text-white" />
              </button>

              {/* Expanded Image */}
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ duration: 0.2 }}
                onClick={(e) => e.stopPropagation()}
                className="relative cursor-default"
                style={{ maxWidth: '80vw', maxHeight: '80%' }}
              >
                <Image
                  src={expandedImage}
                  alt="Expanded view"
                  width={1900}
                  height={870}
                  className="w-auto h-auto max-w-full max-h-full object-contain rounded-lg"
                />
              </motion.div>
            </motion.div>
          )}
        </>
      )}
    </AnimatePresence>
  );
}
