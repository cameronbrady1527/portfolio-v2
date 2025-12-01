"use client";

import { useContext } from 'react';
import { motion } from 'framer-motion';
import { GraduationCap, Brain, Code, Stethoscope, Lightbulb, Briefcase, Heart, BookOpen, TreePine, Zap, LucideIcon } from 'lucide-react';
import { AboutContext } from '@/lib/utils';

// Icon mapping function
const getIcon = (iconName: string, className: string = "h-6 w-6") => {
  const icons: Record<string, LucideIcon> = {
    Heart,
    GraduationCap,
    TreePine,
    Zap,
    Brain,
    Code,
    Stethoscope,
    Lightbulb,
    Briefcase,
    BookOpen
  };

  const IconComponent = icons[iconName];
  return IconComponent ? <IconComponent className={className} /> : null;
};

export const JourneyTimeline = () => {
  const aboutData = useContext(AboutContext);
  const { journeyTimeline } = aboutData;

  return (
    <div className="max-w-5xl mx-auto mb-32">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-16"
      >
        <h2 className="text-4xl font-light text-slate-800 mb-4">The Journey</h2>
        <p className="text-xl text-slate-600">
          From high school volunteer to multi-faceted professional
        </p>
      </motion.div>

      <div className="relative">
        {/* Timeline line */}
        <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-linear-to-b from-red-300 via-purple-300 to-orange-300 hidden lg:block" />

        <div className="space-y-16">
          {journeyTimeline.map((event, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className={`flex items-center ${
                index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'
              } flex-col`}
            >
              {/* Content Card */}
              <div className="flex-1 lg:mx-8 mb-8 lg:mb-0">
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-slate-200 hover:shadow-2xl transition-shadow relative" style={{ zIndex: 20 }}>
                  <div className={`inline-block bg-linear-to-r ${event.color} text-white px-4 py-2 rounded-full text-sm font-semibold mb-4`}>
                    {event.year}
                  </div>
                  <p className="text-sm text-slate-500 uppercase tracking-wider mb-2">{event.period}</p>
                  <h3 className="text-2xl font-semibold text-slate-800 mb-3">{event.title}</h3>
                  <p className="text-slate-600 text-lg leading-relaxed">{event.description}</p>
                </div>
              </div>

              {/* Center Icon */}
              <div className="shrink-0 w-20 h-20 bg-white border-4 border-blue-200 rounded-full flex items-center justify-center z-10 shadow-lg">
                <div className={`text-transparent bg-linear-to-r ${event.color} bg-clip-text`}>
                  {getIcon(event.iconName)}
                </div>
              </div>

              <div className="flex-1 lg:mx-8" />
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};
