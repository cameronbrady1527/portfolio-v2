"use client";

import { FeaturesSectionDemo } from "@/components/ui/features-section";
import { motion } from "motion/react";

const ApproachSection = () => (
  <section className="py-20 relative overflow-hidden">
    {/* Subtle background gradient matching hero section */}
    <div className="absolute inset-0 bg-linear-to-br from-slate-50 via-blue-50 to-indigo-50" />

    {/* Floating elements for depth */}
    <div className="absolute inset-0 opacity-10">
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-200 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-200 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
    </div>

    <div className="container mx-auto px-6 relative z-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-16"
      >
        <h2 className="text-4xl font-light text-slate-800 mb-4">My Teaching Approach</h2>
        <p className="text-xl text-slate-600 max-w-2xl mx-auto">
          My philosophy centers on detective work. I pay close attention to how you learn,
          identifying knowledge gaps that might be invisible to you.
        </p>
      </motion.div>

      <FeaturesSectionDemo />
    </div>
  </section>
);

export { ApproachSection };