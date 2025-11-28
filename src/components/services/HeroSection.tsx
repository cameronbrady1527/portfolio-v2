"use client";

import { TypewriterEffect } from "@/components/ui/typewriter-effect";
import Image from "next/image";

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
      <div className="container mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center relative z-10">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-full"
        >
          <TypewriterEffect words={words} className="mt-8 text-center justify-center lg:text-left lg:justify-start text-xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl" />
          <p className="text-lg sm:text-xl text-slate-600 mt-6 mb-8 leading-relaxed text-center lg:text-left">
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
          <div className="bg-white/70 backdrop-blur-sm border border-slate-200 rounded-xl p-8 flex flex-col items-center justify-center shadow-lg relative" style={{ zIndex: 20 }}>
            <div className="text-center">
              <div className="relative w-40 h-40 sm:w-48 sm:h-48 mx-auto mb-6">
                <Image
                  src="/cameron-brady.png"
                  alt="Cameron Brady"
                  fill
                  className="rounded-full object-cover"
                  priority
                />
              </div>
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