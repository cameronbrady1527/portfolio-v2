// components/HeroSection.tsx - Simplified hero section
'use client'
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ChevronDown, ArrowRight } from 'lucide-react';

export default function HeroSection() {
  const [currentRole, setCurrentRole] = useState(0);
  const [showScrollIndicator, setShowScrollIndicator] = useState(true);

  const roles = [
    'Academic Tutor',
    'Fullstack Developer',
    'Machine Learning Researcher',
    'Computational Neuroscientist', 
  ];
  
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentRole((prev) => (prev + 1) % roles.length)
    }, 3000);
    
    return () => clearInterval(interval)
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollIndicator(window.scrollY < 50);
    }

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  return (
    <section className="min-h-screen flex items-center justify-center relative overflow-hidden pt-16">
      {/* Subtle background gradient */}
      <div className="absolute inset-0 bg-linear-to-br from-slate-50 via-blue-50 to-indigo-50" />
      
      {/* Floating elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-200 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-200 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>
      
      <div className="container mx-auto px-6 text-center relative z-10">
        <div className="max-w-4xl mx-auto">
          {/* Main heading */}
          <h1 className="text-5xl md:text-7xl font-light text-slate-800 mb-6">
            Cameron Brady
          </h1>
          
          {/* Animated role */}
          <div className="text-2xl md:text-3xl text-slate-600 mb-8 h-16 flex items-center justify-center">
            <span className="font-light transition-all duration-500 ease-in-out">
              {roles[currentRole]}
            </span>
          </div>
          
          {/* Value proposition */}
          <p className="text-lg md:text-xl text-slate-600 mb-12 max-w-3xl mx-auto leading-relaxed">
            Bridging cutting-edge AI research with clinical medicine to advance 
            early detection of neurological disorders and improve patient outcomes.
          </p>
          
          {/* Call-to-action buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Link 
              href="/projects"
              className="px-8 py-4 border-2 border-slate-300 text-slate-700 rounded-lg hover:border-slate-400 hover:bg-slate-50 transition-colors duration-200 text-lg font-medium"
            >
              Projects!
            </Link>
            <Link 
              href="/services"
              className="px-8 py-4 border-2 border-slate-300 text-slate-700 rounded-lg hover:border-slate-400 hover:bg-slate-50 transition-colors duration-200 text-lg font-medium"
            >
              Tutoring!
            </Link>
          </div>
          
          {/* Current focus */}
          <div className="max-w-2xl mx-auto p-6 bg-white/70 backdrop-blur-sm rounded-xl border border-slate-200">
            <p className="text-sm text-slate-500 uppercase tracking-wider mb-2">Currently Working On</p>
            <p className="text-slate-700 font-medium">
              Alzheimer's Prevention ML Systems, Research Assistance AI, & Client Programs 
            </p>
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