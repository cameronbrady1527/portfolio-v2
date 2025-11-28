"use client";

import { motion } from 'framer-motion';
import { Brain } from 'lucide-react';

export const ResearchHighlight = () => {
  return (
    <div className="mb-32 -mx-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="relative bg-linear-to-br from-purple-100 via-blue-50 to-indigo-100 py-20 px-6 overflow-hidden"
      >
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-200 rounded-full blur-3xl opacity-20" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-200 rounded-full blur-3xl opacity-20" />

        <div className="max-w-4xl mx-auto relative z-10">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-20 h-20 bg-white/80 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-lg">
              <Brain className="h-10 w-10 text-purple-600" />
            </div>
            <div>
              <h2 className="text-4xl font-light text-slate-800 mb-1">Current Research</h2>
              <p className="text-lg text-purple-700 font-medium">AI for Early Disease Detection</p>
            </div>
          </div>

          <div className="space-y-4">
            <p className="text-slate-700 leading-relaxed text-lg">
              Developing machine learning systems for early detection of Alzheimer's disease using
              vocal biomarker analysis. This work combines deep learning, signal processing, and
              medical research to identify neurological disorders years before traditional diagnosis.
            </p>

            <div className="border-l-4 border-purple-400 pl-6 py-2">
              <p className="text-slate-600 leading-relaxed italic">
                Goal: Transform early intervention and improve quality of life for millions of patients
                through accessible, non-invasive screening technology.
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
