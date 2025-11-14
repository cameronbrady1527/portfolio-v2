"use client";

import { useContext } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { AboutContext } from '@/lib/utils';

export const VolunteerSection = () => {
  const aboutData = useContext(AboutContext);
  const { volunteerWork } = aboutData;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="max-w-6xl mx-auto mb-32"
    >
      <div className="text-center mb-12">
        <h2 className="text-4xl font-light text-slate-800 mb-4">Making Impact</h2>
        <p className="text-xl text-slate-600">
          Committed to serving communities and addressing critical needs
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {volunteerWork.map((work, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="group"
          >
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl overflow-hidden shadow-xl border border-slate-200 hover:shadow-2xl transition-all">
              <div className="relative h-64 bg-linear-to-br from-slate-200 to-slate-300 flex items-center justify-center">
                {work.imageSrc ? (
                  <Image
                    src={work.imageSrc}
                    alt={work.imageAlt}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <p className="text-slate-500 text-sm">Photo: {work.imageAlt}</p>
                )}
              </div>

              <div className="p-6">
                <h3 className="text-2xl font-semibold text-slate-800 mb-2">{work.title}</h3>
                <p className="text-sm font-medium text-blue-600 mb-3">{work.role}</p>
                <p className="text-slate-600 leading-relaxed">{work.description}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};
