"use client";

import { useContext } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { AboutContext } from '@/lib/utils';

export const PersonalInterestsSection = () => {
  const aboutData = useContext(AboutContext);
  const { personalInterests } = aboutData;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="max-w-5xl mx-auto mb-32"
    >
      <div className="text-center mb-12">
        <h2 className="text-4xl font-light text-slate-800 mb-4">Beyond Work</h2>
        <p className="text-xl text-slate-600">
          Staying active, engaged, and inspired
        </p>
      </div>

      <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-10 shadow-xl border border-slate-200">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {personalInterests.map((interest, index) => (
            <div key={index} className="text-center">
              <div className={`relative h-48 bg-linear-to-br from-${interest.gradientFrom} to-${interest.gradientTo} rounded-xl mb-4 flex items-center justify-center overflow-hidden`}>
                {interest.imageSrc ? (
                  <Image
                    src={interest.imageSrc}
                    alt={interest.imageAlt}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <p className="text-slate-600 text-sm">Photo: {interest.imageAlt}</p>
                )}
              </div>
              <h3 className="text-xl font-semibold text-slate-800 mb-2">{interest.title}</h3>
              <p className="text-slate-600">{interest.description}</p>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};
