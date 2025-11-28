"use client";

import { useContext } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { AboutContext } from '@/lib/utils';

export const PersonalInterestsSection = () => {
  const aboutData = useContext(AboutContext);
  const { personalInterests } = aboutData;

  const heights = ['h-64', 'h-80', 'h-72']; // Varying heights for masonry effect

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

      <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
        {personalInterests.map((interest, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            className="break-inside-avoid mb-6"
          >
            <div className="group cursor-default">
              <div className={`relative ${heights[index % heights.length]} bg-linear-to-br from-${interest.gradientFrom} to-${interest.gradientTo} rounded-2xl overflow-hidden`}>
                {interest.imageSrc ? (
                  <Image
                    src={interest.imageSrc}
                    alt={interest.imageAlt}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <p className="text-slate-600 text-sm">Photo: {interest.imageAlt}</p>
                  </div>
                )}
                <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                  <h3 className="text-xl font-semibold mb-2">{interest.title}</h3>
                  <p className="text-white/90 text-sm">{interest.description}</p>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};
