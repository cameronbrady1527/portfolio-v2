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
      className="max-w-5xl mx-auto mb-32"
    >
      <div className="text-center mb-16">
        <h2 className="text-4xl font-light text-slate-800 mb-4">Making Impact</h2>
        <p className="text-xl text-slate-600">
          Committed to serving communities and addressing critical needs
        </p>
      </div>

      <div className="space-y-24">
        {volunteerWork.map((work, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: index * 0.2 }}
            className={`flex flex-col ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} gap-8 items-center`}
          >
            {/* Image */}
            <div className="flex-1 w-full">
              <div className="relative h-80 rounded-2xl overflow-hidden shadow-2xl group">
                <div className="absolute inset-0 bg-linear-to-br from-slate-200 to-slate-300 flex items-center justify-center">
                  {work.imageSrc ? (
                    <Image
                      src={work.imageSrc}
                      alt={work.imageAlt}
                      fill
                      className={`object-cover transition-transform duration-500 group-hover:scale-110 ${work.imageClassName || ''}`}
                    />
                  ) : (
                    <p className="text-slate-500 text-sm">Photo: {work.imageAlt}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1">
              <div className="inline-block px-3 py-1 bg-blue-100 text-blue-700 text-sm font-medium rounded-full mb-4">
                {work.role}
              </div>
              {work.link ? (
                <a
                  href={work.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-3xl font-light text-slate-800 hover:text-blue-600 mb-4 block transition-colors"
                >
                  {work.title}
                </a>
              ) : (
                <h3 className="text-3xl font-light text-slate-800 mb-4">{work.title}</h3>
              )}
              <div className="h-1 w-20 bg-blue-500 rounded-full mb-6" />
              <p className="text-slate-600 leading-relaxed text-lg">{work.description}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};
