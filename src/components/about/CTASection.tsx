"use client";

import { motion } from 'framer-motion';
import NavLink from '@/components/NavLink';

export const CTASection = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="max-w-4xl mx-auto"
    >
      <div className="bg-linear-to-br from-blue-600 to-purple-600 rounded-2xl p-12 text-center shadow-2xl">
        <h2 className="text-3xl font-semibold text-white mb-4">
          Let's Work Together
        </h2>
        <p className="text-blue-100 mb-8 text-lg leading-relaxed">
          Whether you're looking for software development, tutoring services, research collaboration,
          or nonprofit consulting—I'd love to hear from you and explore how we can create impact together.
        </p>
        <NavLink
          href="/contact"
          className="inline-flex items-center gap-2 px-8 py-4 bg-white text-blue-600 rounded-lg hover:bg-blue-50 transition-colors font-semibold text-lg shadow-lg hover:shadow-xl hover:scale-105 transition-all"
        >
          Get In Touch
        </NavLink>
      </div>
    </motion.div>
  );
};
