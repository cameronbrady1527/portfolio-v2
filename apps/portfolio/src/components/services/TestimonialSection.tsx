"use client";

import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ChevronLeft, ChevronRight } from "lucide-react";

type Testimonial = {
  quote: string;
  name: string;
  title: string;
  span?: number; // column-span units, default 1
};

const testimonials: Testimonial[] = [
  {
    quote:
      "Cam was an excellent tutor who provided clear and in-depth explanations of complex CS concepts. He was patient and used language I could understand in his lessons. Thanks to his guidance, I gained a deeper understanding of coding and he helped increase my skills significantly in Java, Python, and CS fundamentals.",
    name: "Brady K.",
    title: "High School Senior, AP Computer Science",
  },
  {
    quote:
      "Working with Cam on Algebra II and Physics H was incredibly helpful. He patiently broke down complex topics, boosted my confidence, and made algebra and physics a lot less stressful and more understandable with great support.",
    name: "Cooper C.",
    title: "Junior, Algebra II Honors & Physics Honors",
  },
  {
    quote:
      "I remember when you helped me practice with a math test that was really hard for me. I thought I was going to fail, but you showed my that I knew way more than I thought.",
    name: "Ethan D.",
    title: "Elementary School Student",
  },
  {
    quote:
      "Cameron supported me through farm business management when I had stopped handing in work and even when I had missed a test. I was struggling with some family issues and also some bad mental health challenges. He reached out time and time again and was very supportive, encouraging, and kind. Other professors and TAs made me feel more stressed, which was the opposite of what I needed in my situation. In the end, I ended up completing the class with a great grade, learned a lot because of typed up lessons and extended time to learn the material, and did not end up taking a leave, which I thought I would do. Cameron was able to connect with me and integrated his comments and emails to a motivation I had shared with him, which was that I would use the material at the family farm after school.",
    name: "Anonymous",
    title: "Cornell Junior, Farm Business Management Student",
    span: 2,
  },
  {
    quote:
      "Cameron has the ability to make complex topics fun and understandable, leading to a huge improvement in my son's grades and self-esteem.",
    name: "Caryn C.",
    title: "Parent",
  },
];

/**
 * Returns cards visible from startIndex, greedily filling up to `capacity`
 * columns. Stops before a card that would overflow. Wraps around the array.
 */
function getVisibleItems(
  items: Testimonial[],
  startIndex: number,
  capacity: number
): Array<Testimonial & { effectiveSpan: number }> {
  const result: Array<Testimonial & { effectiveSpan: number }> = [];
  let used = 0;
  const n = items.length;
  for (let offset = 0; offset < n; offset++) {
    const item = items[(startIndex + offset) % n];
    const span = Math.min(item.span ?? 1, capacity);
    if (used + span > capacity) break;
    result.push({ ...item, effectiveSpan: span });
    used += span;
  }
  return result;
}


const TestimonialsSection = () => {
  const [capacity, setCapacity] = useState(1);
  const [startIndex, setStartIndex] = useState(0);
  const [direction, setDirection] = useState(1);

  useEffect(() => {
    const update = () => {
      const w = window.innerWidth;
      const next = w >= 1024 ? 3 : w >= 768 ? 2 : 1;
      setCapacity((prev) => {
        if (prev !== next) setStartIndex(0);
        return next;
      });
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const n = testimonials.length;
  const visibleItems = getVisibleItems(testimonials, startIndex, capacity);

  const goTo = (rawIndex: number, dir: number) => {
    setDirection(dir);
    setStartIndex(((rawIndex % n) + n) % n);
  };

  // Exit sets position:absolute immediately (non-animatable properties apply
  // instantly), popping the old grid out of flow so the entering grid sets the
  // container height. Both play simultaneously → true slide.
  const variants = {
    enter: (dir: number) => ({
      x: dir > 0 ? "100%" : "-100%",
    }),
    center: {
      x: 0,
    },
    exit: (dir: number) => ({
      position: "absolute" as const,
      top: 0,
      left: 0,
      right: 0,
      x: dir > 0 ? "-30%" : "30%",
      opacity: 0,
    }),
  };

  return (
    <section className="py-20 relative overflow-hidden">
      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-light text-slate-800 mb-4">
            Success Stories
          </h2>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            From confusion to confidence, see what students and parents say
          </p>
        </motion.div>

        {/* Card grid — overflow-hidden clips the sliding enter/exit */}
        <div className="relative overflow-hidden">
          <AnimatePresence custom={direction}>
            <motion.div
              key={startIndex}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="flex gap-6"
            >
              {visibleItems.map((item, index) => (
                <div
                  key={`${startIndex}-${index}`}
                  style={{ flex: item.effectiveSpan }}
                  className={`min-w-0 rounded-xl border bg-white p-6 flex flex-col transition-shadow duration-300 ${
                    index === 0
                      ? "border-blue-200 shadow-lg"
                      : "border-slate-200 shadow-md hover:shadow-lg"
                  }`}
                >
                  {/* Blue quote icon */}
                  <svg
                    className="w-8 h-8 text-blue-500 mb-4 shrink-0"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                  </svg>

                  {/* Quote text */}
                  <p className="text-base leading-relaxed text-slate-700 flex-1">
                    {item.quote}
                  </p>

                  {/* Divider + attribution */}
                  <div className="mt-5 pt-4 border-t border-slate-100">
                    <p className="text-sm font-semibold text-slate-900">
                      {item.name}
                    </p>
                    <p className="text-sm text-slate-500">{item.title}</p>
                  </div>
                </div>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-center gap-4 mt-10">
          <button
            onClick={() => goTo(startIndex - 1, -1)}
            aria-label="Previous"
            className="rounded-full border border-slate-200 bg-white shadow-sm hover:shadow-md p-2 transition"
          >
            <ChevronLeft className="w-5 h-5 text-slate-600" />
          </button>

          <div className="flex items-center gap-2">
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i, i > startIndex ? 1 : -1)}
                aria-label={`Go to card ${i + 1}`}
                className={`rounded-full transition-all duration-200 ${
                  i === startIndex
                    ? "bg-blue-500 w-3 h-3"
                    : "bg-slate-300 hover:bg-slate-400 w-2 h-2"
                }`}
              />
            ))}
          </div>

          <button
            onClick={() => goTo(startIndex + 1, 1)}
            aria-label="Next"
            className="rounded-full border border-slate-200 bg-white shadow-sm hover:shadow-md p-2 transition"
          >
            <ChevronRight className="w-5 h-5 text-slate-600" />
          </button>
        </div>
      </div>
    </section>
  );
};

export { TestimonialsSection };
