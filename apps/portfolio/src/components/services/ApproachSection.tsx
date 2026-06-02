"use client";

import { FeaturesSectionDemo } from "@/components/ui/features-section";
import { motion } from "motion/react";

const ApproachSection = () => (
  <section className="py-20 relative overflow-hidden">
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