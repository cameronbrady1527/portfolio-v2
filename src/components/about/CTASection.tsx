"use client";

import { motion } from 'framer-motion';
import NavLink from '@/components/NavLink';
import { Mail, FolderOpen, ArrowRight } from 'lucide-react';

export const CTASection = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="max-w-5xl mx-auto"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Contact CTA */}
        <div className="bg-white border-2 border-blue-200 rounded-2xl p-8 shadow-lg hover:shadow-xl hover:border-blue-300 transition-all">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <Mail className="text-blue-600" size={24} />
            </div>
            <h3 className="text-2xl font-light text-slate-800">Let&apos;s Connect</h3>
          </div>
          <p className="text-slate-600 mb-6 leading-relaxed">
            Looking for software development, tutoring, research collaboration, or nonprofit consulting? Let&apos;s explore how we can work together.
          </p>
          <NavLink
            href="/contact"
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium group"
          >
            <motion.div
              className="flex items-center gap-2"
              initial="initial"
              whileHover="hover"
            >
              <span className="relative inline-block after:content-[''] after:absolute after:left-0 after:bottom-0 after:w-full after:h-0.5 after:bg-blue-600 after:origin-right after:scale-x-0 hover:after:origin-left hover:after:scale-x-100 after:transition-transform after:duration-300 after:ease-out">
                Get In Touch
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
        </div>

        {/* Projects CTA */}
        <div className="bg-white border-2 border-slate-200 rounded-2xl p-8 shadow-lg hover:shadow-xl hover:border-slate-300 transition-all">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center">
              <FolderOpen className="text-slate-600" size={24} />
            </div>
            <h3 className="text-2xl font-light text-slate-800">View My Work</h3>
          </div>
          <p className="text-slate-600 mb-6 leading-relaxed">
            Explore my portfolio of projects spanning AI research, full-stack development, and machine learning systems.
          </p>
          <NavLink
            href="/projects"
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium group"
          >
            <motion.div
              className="flex items-center gap-2"
              initial="initial"
              whileHover="hover"
            >
              <span className="relative inline-block after:content-[''] after:absolute after:left-0 after:bottom-0 after:w-full after:h-0.5 after:bg-blue-600 after:origin-right after:scale-x-0 hover:after:origin-left hover:after:scale-x-100 after:transition-transform after:duration-300 after:ease-out">
                Browse Projects
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
        </div>
      </div>
    </motion.div>
  );
};
