"use client";

import { TypewriterEffect } from "@/components/ui/typewriter-effect";

import { MapPin, Globe, GraduationCap } from "lucide-react";
import { motion } from "motion/react";

const HeroSection = () => {
  const words = [
    { text: "Cornell-Educated", className: "text-slate-800" },
    { text: "Tutor", className: "text-blue-600" },
    { text: "|", className: "text-slate-400" },
    { text: "Math,", className: "text-slate-800" },
    { text: "Computer", className: "text-slate-800" },
    { text: "Science,", className: "text-slate-800" },
    { text: "&", className: "text-slate-400" },
    { text: "Beyond", className: "text-slate-800" }
  ];

  // const dockItems = [
  //   { title: "Cornell Graduate", icon: <GraduationCap className="h-4 w-4" /> },
  //   { title: "Dutchess County", icon: <MapPin className="h-4 w-4" /> },
  //   { title: "Virtual Worldwide", icon: <Globe className="h-4 w-4" /> },
  // ];

  return (
    <section className="min-h-screen flex items-center justify-center relative overflow-hidden pt-16 pb-12">
      {/* Subtle background gradient matching main site */}
      <div className="absolute inset-0 bg-linear-to-br from-slate-50 via-blue-50 to-indigo-50" />

      {/* Floating elements for depth */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-200 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-200 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      <div className="container mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center relative z-10">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-full"
        >
          <TypewriterEffect words={words} className="text-left justify-start" />
          <p className="text-lg sm:text-xl text-slate-600 mt-6 mb-8 leading-relaxed">
            Helping K-12 and college students master challenging concepts and build lasting confidence
          </p>

          {/* <FloatingDock items={dockItems} /> */}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative"
        >
          {/* Clean card matching main site aesthetic */}
          <div className="bg-white/70 backdrop-blur-sm border border-slate-200 rounded-xl p-8 h-96 flex items-center justify-center shadow-lg">
            <div className="text-center">
              <GraduationCap className="h-24 w-24 mx-auto mb-4 text-blue-600" />
              <h3 className="text-2xl font-semibold text-slate-800 mb-2">6+ Years Experience</h3>
              <p className="text-slate-600">Transforming student confidence since 2018</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export { HeroSection };