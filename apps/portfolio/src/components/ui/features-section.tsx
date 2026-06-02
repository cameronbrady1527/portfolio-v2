"use client";

import { Search, Link2, Users, TrendingUp } from "lucide-react";
import React from "react";

export function FeaturesSectionDemo() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
      {grid.map((feature) => (
        <div
          key={feature.title}
          className="relative bg-white rounded-xl border border-slate-200 p-6 overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
        >
          <div className="mb-4 text-blue-600">
            {feature.icon}
          </div>
          <p className="text-lg font-semibold text-slate-800 mb-3 relative z-20">
            {feature.title}
          </p>
          <p className="text-slate-600 text-sm relative z-20">
            {feature.description}
          </p>
        </div>
      ))}
    </div>
  );
}

const grid = [
  {
    title: "Diagnostic-First Method",
    description:
      "I assess not just what you know, but how you think through problems. This reveals patterns that guide my instruction approach.",
    icon: <Search className="h-6 w-6" />
  },
  {
    title: "Connection-Based Learning",
    description:
      "Most students already have the knowledge they need to succeed. I help you connect concepts you know to problems you're facing.",
    icon: <Link2 className="h-6 w-6" />
  },
  {
    title: "Adaptive Instruction",
    description:
      "I tailor my teaching style to match how you learn best, whether it's visual, step-by-step, or hands-on problem solving.",
    icon: <Users className="h-6 w-6" />
  },
  {
    title: "Confidence Building",
    description:
      "Students transform from avoiding difficult problems to tackling them head-on through mastering fundamentals.",
    icon: <TrendingUp className="h-6 w-6" />
  }
];
