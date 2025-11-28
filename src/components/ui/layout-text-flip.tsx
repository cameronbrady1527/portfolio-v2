"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";

export const LayoutTextFlip = ({
  text = "Cameron Brady",
  words = ["A", "B", "C"],
  duration = 3000
}: {
  text: string;
  words: string[];
  duration?: number;
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % words.length);
    }, duration);

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      {/* <motion.span
        layoutId="subtext"
        className="text-2xl font-bold tracking-tight drop-shadow-lg md:text-4xl"
      >
        {text}
      </motion.span> */}

      <motion.span
        layout
        className="relative w-fit px-1 py-2 text-4xl font-light tracking-tight text-slate-800 sm:text-5xl sm:px-2 md:text-6xl md:px-4 lg:text-7xl xl:text-8xl mb-8"
      >
        <AnimatePresence mode="popLayout">
          <motion.span
            key={currentIndex}
            initial={{ y: -40, filter: "blur(10px)" }}
            animate={{
              y: 0,
              filter: "blur(0px)"
            }}
            exit={{ y: 50, filter: "blur(10px)", opacity: 0 }}
            transition={{
              duration: 0.5
            }}
            className={cn("inline-block whitespace-nowrap text-slate-600")}
          >
            {words[currentIndex]}
          </motion.span>
        </AnimatePresence>
      </motion.span>
    </>
  );
}