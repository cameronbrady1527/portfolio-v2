"use client";

import { motion } from 'framer-motion';
import NavLink from '@/components/NavLink';
import { Briefcase, Mail, ArrowRight } from 'lucide-react';

export default function ProjectsCTA() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="max-w-5xl mx-auto mt-20"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Services CTA */}
        <div className="bg-white border-2 border-blue-200 rounded-2xl p-8 shadow-lg hover:shadow-xl hover:border-blue-300 transition-all">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <Briefcase className="text-blue-600" size={24} />
            </div>
            <h3 className="text-2xl font-light text-slate-800">My Services</h3>
          </div>
          <p className="text-slate-600 mb-6 leading-relaxed">
            Interested in working together? Explore my software development, tutoring, research, and consulting services.
          </p>
          <NavLink
            href="/services"
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium group"
          >
            <motion.div
              className="flex items-center gap-2"
              initial="initial"
              whileHover="hover"
            >
              <span className="relative inline-block after:content-[''] after:absolute after:left-0 after:bottom-0 after:w-full after:h-0.5 after:bg-blue-600 after:origin-right after:scale-x-0 hover:after:origin-left hover:after:scale-x-100 after:transition-transform after:duration-300 after:ease-out">
                View Services
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

        {/* Contact CTA */}
        <div className="bg-white border-2 border-slate-200 rounded-2xl p-8 shadow-lg hover:shadow-xl hover:border-slate-300 transition-all">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center">
              <Mail className="text-slate-600" size={24} />
            </div>
            <h3 className="text-2xl font-light text-slate-800">Get In Touch</h3>
          </div>
          <p className="text-slate-600 mb-6 leading-relaxed">
            Have a project in mind or want to collaborate? Let&apos;s discuss how we can work together.
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
                Contact Me
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
}
