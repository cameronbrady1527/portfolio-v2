"use client";

import { useContext } from 'react';
import { motion } from 'framer-motion';
import { GraduationCap, Brain, Code, Briefcase, BookOpen, TreePine, LucideIcon } from 'lucide-react';
import { AboutContext } from '@/lib/utils';

// Icon mapping function
const getIcon = (iconName: string, className: string = "h-5 w-5") => {
  const icons: Record<string, LucideIcon> = {
    Code,
    Briefcase,
    BookOpen,
    GraduationCap,
    TreePine,
    Brain
  };

  const IconComponent = icons[iconName];
  return IconComponent ? <IconComponent className={className} /> : null;
};

export const ExperienceSection = () => {
  const aboutData = useContext(AboutContext);
  const { experiences } = aboutData;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="max-w-6xl mx-auto mb-32"
    >
      <div className="text-center mb-12">
        <h2 className="text-4xl font-light text-slate-800 mb-4">Professional Experience</h2>
        <p className="text-xl text-slate-600">
          Diverse roles spanning software engineering, education, and nonprofit consulting
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {experiences.map((exp, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.05 }}
          >
            <div className="h-full bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-slate-200 hover:shadow-xl transition-all">
              <div className={`inline-flex items-center justify-center w-12 h-12 bg-${exp.color}-100 rounded-lg mb-4`}>
                <div className={`text-${exp.color}-600`}>
                  {getIcon(exp.iconName)}
                </div>
              </div>
              <h3 className="text-lg font-semibold text-slate-800 mb-1">{exp.title}</h3>
              <p className="text-sm font-medium text-slate-600 mb-2">{exp.company}</p>
              <p className="text-xs text-slate-500 mb-3">{exp.period}</p>
              <p className="text-sm text-slate-600 leading-relaxed">{exp.description}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};
