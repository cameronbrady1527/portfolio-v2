"use client";

import { motion } from 'framer-motion';
import { Brain } from 'lucide-react';

export const ResearchHighlight = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="max-w-4xl mx-auto mb-32"
    >
      <div className="bg-linear-to-br from-purple-50 to-blue-50 rounded-2xl p-10 shadow-xl border border-purple-200">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center">
            <Brain className="h-8 w-8 text-purple-600" />
          </div>
          <div>
            <h2 className="text-3xl font-light text-slate-800">Current Research</h2>
            <p className="text-slate-600">AI for Early Disease Detection</p>
          </div>
        </div>

        <p className="text-slate-600 leading-relaxed text-lg mb-4">
          Developing machine learning systems for early detection of Alzheimer's disease using
          vocal biomarker analysis. This work combines deep learning, signal processing, and
          medical research to identify neurological disorders years before traditional diagnosis.
        </p>

        <p className="text-slate-600 leading-relaxed">
          Goal: Transform early intervention and improve quality of life for millions of patients
          through accessible, non-invasive screening technology.
        </p>
      </div>
    </motion.div>
  );
};
