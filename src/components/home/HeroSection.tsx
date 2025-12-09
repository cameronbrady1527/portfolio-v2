// components/HeroSection.tsx
'use client'
import { useState, useEffect } from 'react';
import { ChevronDown, ArrowRight } from 'lucide-react';
import { motion } from "motion/react";

import { LayoutTextFlip } from '@/components/ui/layout-text-flip';
import NavLink from '@/components/NavLink';

export default function HeroSection() {
  const [showScrollIndicator, setShowScrollIndicator] = useState(true);

  const roles = [
    'Academic Tutor',
    'Fullstack Developer',
    'ML Researcher',
  ];

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollIndicator(window.scrollY < 50);
    }

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  return (
    <section className="min-h-screen flex items-center justify-center relative overflow-hidden pt-16">
      <div className="container mx-auto px-6 text-center relative z-10">
        <div className="max-w-4xl mx-auto">
          {/* Main heading */}
          {/* <h1 className="text-5xl md:text-7xl font-light text-slate-800 mb-6">
            Cameron Brady
          </h1> */}
          
          {/* Animated role */}
          {/* <div className="text-2xl md:text-3xl text-slate-600 mb-8 h-16 flex items-center justify-center">
            <span className="font-light transition-all duration-500 ease-in-out">
              {roles[currentRole]}
            </span>
          </div> */}

          {/* Animated role */}
          <motion.div className="relative mx-4 mb-4 flex flex-col items-center justify-center gap-4 text-center sm:mx-0 sm:mb-0 sm:flex-row">
            <LayoutTextFlip 
              text="Cameron Brady"
              words={roles}
            />
          </motion.div>
          
          {/* Value proposition */}
          <p className="text-lg md:text-xl text-slate-600 mb-12 max-w-3xl mx-auto leading-relaxed">
            Software engineer, educator, nonprofit founder, and researcher. Combining technical expertise
            with a passion for making meaningful impact in healthcare, education, and community development.
          </p>

          {/* CTA links */}
          <div className="flex flex-col sm:flex-row gap-8 justify-center items-center">
            <NavLink
              href="/projects"
              className="group relative text-slate-700 hover:text-slate-900 transition-colors"
            >
              <motion.div
                className="flex items-center gap-3"
                initial="initial"
                whileHover="hover"
              >
                <span className="text-2xl font-light relative inline-block after:content-[''] after:absolute after:left-0 after:bottom-0
                                 after:w-full after:h-0.5 after:bg-slate-700 after:origin-right after:scale-x-0
                                 hover:after:origin-left hover:after:scale-x-100 after:transition-transform after:duration-300 after:ease-out">
                  View Projects
                </span>
                <motion.span
                  variants={{
                    initial: { x: 0 },
                    hover: {
                      x: [0, 5, 0],
                      transition: {
                        duration: 0.6,
                        ease: "easeInOut",
                        repeat: 1
                      }
                    }
                  }}
                  className="inline-block"
                >
                  <ArrowRight size={24} className="text-slate-500" />
                </motion.span>
              </motion.div>
            </NavLink>

            <NavLink
              href="/services"
              className="group relative text-slate-700 hover:text-slate-900 transition-colors"
            >
              <motion.div
                className="flex items-center gap-3"
                initial="initial"
                whileHover="hover"
              >
                <span className="text-2xl font-light relative inline-block after:content-[''] after:absolute after:left-0 after:bottom-0
                                 after:w-full after:h-0.5 after:bg-slate-700 after:origin-right after:scale-x-0
                                 hover:after:origin-left hover:after:scale-x-100 after:transition-transform after:duration-300 after:ease-out">
                  Tutoring Services
                </span>
                <motion.span
                  variants={{
                    initial: { x: 0 },
                    hover: {
                      x: [0, 5, 0],
                      transition: {
                        duration: 0.6,
                        ease: "easeInOut",
                        repeat: 1
                      }
                    }
                  }}
                  className="inline-block"
                >
                  <ArrowRight size={24} className="text-slate-500" />
                </motion.span>
              </motion.div>
            </NavLink>
          </div>
        </div>
      </div>
      
      {/* Scroll indicator */}
      <div className={`absolute bottom-4 left-1/2 transform -translate-x-1/2 animate-bounce transition-opacity duration-500 ${showScrollIndicator ? 'opacity-100'
        : 'opacity-0 pointer-events-none'}`}>
        <ChevronDown size={24} className="text-slate-400" />
      </div>
    </section>
  );
}