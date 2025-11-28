// components/WhatIDo.tsx - What I Do section with current focus
'use client'

import { motion } from 'motion/react';
import { Brain, Code, GraduationCap } from 'lucide-react';

export default function WhatIDo() {
  const areas = [
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

        <div className="max-w-5xl mx-auto space-y-16">
          {areas.map((area, index) => {
            const Icon = area.icon;
            return (
              <motion.div
                key={area.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.15 }}
                className={`flex flex-col ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} items-center gap-12`}
              >
                {/* Icon */}
                <div className="flex-shrink-0">
                  <div className={`w-32 h-32 rounded-3xl bg-${area.color}-100 flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className={`text-${area.color}-600`} size={56} />
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 text-center md:text-left">
                  <h3 className="text-3xl font-light text-slate-800 mb-4">
                    {area.title}
                  </h3>

                  <div className={`h-1 w-20 bg-${area.color}-500 rounded-full mb-6 ${index % 2 === 0 ? 'md:mx-0 mx-auto' : 'md:mx-0 mx-auto md:ml-auto'}`} />

                  <p className="text-lg text-slate-600 leading-relaxed mb-6">
                    {area.description}
                  </p>

                  {/* Currently Working On */}
                  <div className={`inline-block px-4 py-2 bg-${area.color}-50 border-l-4 border-${area.color}-500 rounded-r-lg`}>
                    <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">
                      Currently Working On
                    </p>
                    <p className={`text-sm font-medium text-${area.color}-700`}>
                      {area.current}
                    </p>
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
