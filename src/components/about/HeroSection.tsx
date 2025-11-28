"use client";

import { motion } from 'framer-motion';

export const HeroSection = () => {
  return (
    <div className="relative min-h-screen flex items-center justify-center">
      {/* Floating background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-200 rounded-full blur-3xl opacity-20 animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-200 rounded-full blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <h1 className="text-5xl md:text-6xl font-light text-slate-800 mb-6">
            Building Solutions, Serving Communities
          </h1>
          <p className="text-2xl text-slate-600 max-w-4xl mx-auto leading-relaxed">
            Software engineer, educator, nonprofit founder, and researcher. Combining technical expertise
            with a passion for making meaningful impact in healthcare, education, and community development.
          </p>
        </motion.div>
      </div>
    </div>
  );
};
