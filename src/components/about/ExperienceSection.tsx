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
      className="max-w-4xl mx-auto mb-32"
    >
      <div className="text-center mb-16">
        <h2 className="text-4xl font-light text-slate-800 mb-4">Professional Experience</h2>
        <p className="text-xl text-slate-600">
          Diverse roles spanning software engineering, education, and nonprofit consulting
        </p>
      </div>

      <div className="relative">
        {/* Timeline line */}
        <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-0.5 bg-slate-200" />

        <div className="space-y-12">
          {experiences.map((exp, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`relative flex items-center gap-8 ${
                index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
              }`}
            >
              {/* Timeline dot - simple circle, pulsating green if current */}
              <div className="absolute left-8 md:left-1/2 -ml-2 z-10">
                {exp.current ? (
                  <div className="relative flex h-4 w-4">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-4 w-4 bg-green-500 border-2 border-white shadow-lg"></span>
                  </div>
                ) : (
                  <div className="w-4 h-4 rounded-full bg-slate-400 border-2 border-white shadow-lg"></div>
                )}
              </div>

              {/* Content */}
              <div className={`flex-1 ${index % 2 === 0 ? 'md:text-right md:pr-12' : 'md:pl-12'} pl-20 md:pl-0`}>
                <div className={`inline-block ${index % 2 === 0 ? 'md:float-right' : ''}`}>
                  <h3 className="text-xl font-semibold text-slate-800 mb-1">{exp.title}</h3>
                  <p className="text-sm font-medium text-slate-600 mb-3">
                    {exp.company} <span className="text-slate-400">·</span> {exp.period}
                  </p>
                  <p className="text-sm text-slate-600 leading-relaxed max-w-md">{exp.description}</p>
                </div>
              </div>

              {/* Spacer for alternating layout */}
              <div className="flex-1 hidden md:block" />
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};
