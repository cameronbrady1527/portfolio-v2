"use client";

import { motion } from 'framer-motion';
import { Brain, Sparkles } from 'lucide-react';

export const ResearchHighlight = () => {
  return (
    <div className="mb-32">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="relative"
      >
        {/* Spotlight glow effect */}
        <div className="absolute -inset-4 bg-linear-to-r from-purple-600/20 via-blue-600/20 to-indigo-600/20 rounded-3xl blur-2xl" />

        {/* Main container */}
        <div className="relative bg-white/90 backdrop-blur-xl rounded-2xl border border-white/40 shadow-2xl overflow-hidden">
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-linear-to-br from-purple-50/80 via-blue-50/60 to-indigo-50/80" />

          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-purple-300/30 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-300/30 rounded-full blur-3xl" />

          {/* Content */}
          <div className="relative z-10 px-8 py-12 sm:px-12 sm:py-16">
            <div className="max-w-4xl mx-auto">
              {/* Header */}
              <div className="flex items-start gap-4 mb-8">
                <div className="shrink-0 w-16 h-16 bg-linear-to-br from-purple-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <Brain className="h-8 w-8 text-white" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="h-5 w-5 text-purple-600" />
                    <span className="text-sm font-semibold text-purple-600 uppercase tracking-wider">Research Spotlight</span>
                  </div>
                  <h2 className="text-3xl sm:text-4xl font-light text-slate-800 mb-2">Current Research</h2>
                  <p className="text-lg text-purple-700 font-medium">AI for Early Disease Detection</p>
                </div>
              </div>

              {/* Body */}
              <div className="space-y-6">
                <p className="text-slate-700 leading-relaxed text-lg">
                  Developing machine learning systems for early detection of Alzheimer&apos;s disease using
                  bioinformatics data accessed through Alzheimer&apos;s Disease Neuroimaging Initiative (ADNI).
                  This work combines deep learning, signal processing, and medical research to identify
                  neurological disorders years before traditional diagnosis. Current work focuses on
                  leveraging data from the <a href="https://www.alz.org/us-pointer/home.asp" className="text-blue-600 hover:text-blue-700 font-medium underline decoration-blue-600/0 hover:decoration-blue-600 underline-offset-2 decoration-2 transition-all duration-300">Alzheimer&apos;s Association U.S. Study to Protect Brain Health
                  Through Lifestyle Intervention to Reduce Risk (U.S. POINTER)</a>.
                </p>

                <div className="bg-white/60 backdrop-blur-sm border-l-4 border-purple-500 rounded-r-xl pl-6 pr-6 py-4 shadow-sm">
                  <p className="text-slate-700 leading-relaxed font-medium">
                    <span className="text-purple-700 font-semibold">Goal:</span> Transform early intervention and improve quality of life for millions of patients
                    through accessible, non-invasive screening technology.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
