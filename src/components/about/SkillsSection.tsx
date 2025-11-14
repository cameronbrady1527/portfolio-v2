"use client";

import { motion } from 'framer-motion';
import { Brain, Code, Zap, BookOpen } from 'lucide-react';

export const SkillsSection = () => {
  const skillCategories = [
    {
      icon: <Brain className="text-purple-600 h-5 w-5" />,
      title: "Machine Learning",
      skills: ['Deep Learning', 'Computer Vision', 'NLP', 'Signal Processing']
    },
    {
      icon: <Code className="text-blue-600 h-5 w-5" />,
      title: "Development",
      skills: ['Python', 'TypeScript', 'React', 'Next.js', 'Node.js', 'SQL']
    },
    {
      icon: <Zap className="text-green-600 h-5 w-5" />,
      title: "Tools & Frameworks",
      skills: ['TensorFlow', 'PyTorch', 'Pandas', 'PostgreSQL']
    },
    {
      icon: <BookOpen className="text-orange-600 h-5 w-5" />,
      title: "Teaching & Leadership",
      skills: ['Curriculum Design', 'Data Analytics', 'Team Leadership', 'Mentoring']
    }
  ];

  const skillColors: Record<number, string> = {
    0: 'purple',
    1: 'blue',
    2: 'green',
    3: 'orange'
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="max-w-5xl mx-auto mb-32"
    >
      <div className="text-center mb-12">
        <h2 className="text-4xl font-light text-slate-800 mb-4">Technical Skills</h2>
      </div>

      <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-10 shadow-xl border border-slate-200">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {skillCategories.map((category, index) => (
            <div key={index}>
              <div className="flex items-center gap-2 mb-3">
                {category.icon}
                <h3 className="font-semibold text-slate-700">{category.title}</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {category.skills.map((skill) => (
                  <span
                    key={skill}
                    className={`px-2 py-1 bg-${skillColors[index]}-100 text-${skillColors[index]}-700 rounded text-xs font-medium`}
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};
