// components/WhatIDo.tsx - What I Do section with current focus
'use client'

import { motion } from 'motion/react';
import { Brain, Code, GraduationCap } from 'lucide-react';

export default function WhatIDo() {
  type Area = {
    icon: React.ComponentType<{ className?: string; size?: number; strokeWidth?: number }>;
    title: string;
    description: string;
    color: 'purple' | 'blue' | 'green';
    current: string;
  };

  const areas: Area[] = [
    {
      icon: Brain,
      title: 'AI Research',
      description: 'Machine learning systems for early detection of neurological disorders',
      color: 'purple',
      current: 'Alzheimer\'s Prevention ML Systems'
    },
    {
      icon: Code,
      title: 'Development',
      description: 'Building intelligent applications and research assistance tools',
      color: 'blue',
      current: 'Research Assistance AI'
    },
    {
      icon: GraduationCap,
      title: 'Teaching',
      description: 'Academic tutoring and curriculum development for students',
      color: 'green',
      current: 'Client Programs'
    }
  ];

  const colorClassesMap = {
    purple: {
      iconBg: 'bg-purple-100',
      iconText: 'text-purple-600',
      line: 'bg-purple-500',
      badgeBg: 'bg-purple-50',
      badgeBorder: 'border-purple-500',
      badgeText: 'text-purple-700',
      cardBorder: 'border-purple-200 hover:border-purple-300',
      cardShadow: 'hover:shadow-purple-100'
    },
    blue: {
      iconBg: 'bg-blue-100',
      iconText: 'text-blue-600',
      line: 'bg-blue-500',
      badgeBg: 'bg-blue-50',
      badgeBorder: 'border-blue-500',
      badgeText: 'text-blue-700',
      cardBorder: 'border-blue-200 hover:border-blue-300',
      cardShadow: 'hover:shadow-blue-100'
    },
    green: {
      iconBg: 'bg-green-100',
      iconText: 'text-green-600',
      line: 'bg-green-500',
      badgeBg: 'bg-green-50',
      badgeBorder: 'border-green-500',
      badgeText: 'text-green-700',
      cardBorder: 'border-green-200 hover:border-green-300',
      cardShadow: 'hover:shadow-green-100'
    }
  };

  return (
    <section className="py-20">
      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-light text-slate-800 mb-4">What I Do</h2>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Focused on three core areas where technology meets impact
          </p>
        </motion.div>

        <div className="max-w-5xl mx-auto space-y-12">
          {areas.map((area, index) => {
            const Icon = area.icon;
            const colorClasses = colorClassesMap[area.color];

            return (
              <motion.div
                key={area.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.15 }}
                className={`group bg-white rounded-2xl border-2 ${colorClasses.cardBorder} shadow-lg ${colorClasses.cardShadow} hover:shadow-2xl transition-all duration-300 p-8 md:p-10`}
              >
                <div className={`flex flex-col ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} items-center gap-8 md:gap-12`}>
                  {/* Icon */}
                  <div className="shrink-0">
                    <div className={`w-28 h-28 rounded-2xl ${colorClasses.iconBg} flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-md`}>
                      <Icon className={colorClasses.iconText} size={48} strokeWidth={1.5} />
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 text-center md:text-left">
                    <h3 className="text-3xl font-light text-slate-800 mb-4">
                      {area.title}
                    </h3>

                    <div className={`h-1 w-20 ${colorClasses.line} rounded-full mb-6 mx-auto md:mx-0`} />

                    <p className="text-lg text-slate-600 leading-relaxed mb-6">
                      {area.description}
                    </p>

                    {/* Currently Working On */}
                    <div className={`inline-block px-4 py-2 ${colorClasses.badgeBg} border-l-4 ${colorClasses.badgeBorder} rounded-r-lg shadow-sm`}>
                      <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">
                        Currently Working On
                      </p>
                      <p className={`text-sm font-medium ${colorClasses.badgeText}`}>
                        {area.current}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
