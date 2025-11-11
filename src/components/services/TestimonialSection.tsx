"use client";

import { InfiniteMovingCards } from "@/components/ui/infinite-moving-cards";
import { Star, Quote } from "lucide-react";
import { motion } from "motion/react";

const TestimonialsSection = () => {
  // Placeholder testimonials based on your success stories
  const testimonials = [
    {
      quote: "Cameron helped me go from getting every calculus problem wrong to approaching tests with confidence. His diagnostic approach revealed gaps I didn't even know I had.",
      name: "Sarah M.",
      title: "High School Senior, AP Calculus"
    },
    {
      quote: "The way Cameron connects concepts I already knew to solve new problems was amazing. I finally understood how algebra actually works!",
      name: "Michael R.", 
      title: "Sophomore, Algebra II Honors"
    },
    {
      quote: "My daughter's math anxiety completely disappeared after working with Cameron. He's patient and really understands how kids learn.",
      name: "Jennifer L.",
      title: "Parent"
    },
    {
      quote: "Cameron's computer science tutoring got me into my dream college program. His explanations made complex algorithms finally click.",
      name: "David K.",
      title: "High School Graduate"
    }
    // Add more as you collect real testimonials
  ];

  return (
    <section className="py-20 relative overflow-hidden">
      {/* Subtle background gradient matching hero section */}
      <div className="absolute inset-0 bg-linear-to-br from-slate-50 via-blue-50 to-indigo-50" />

      {/* Floating elements for depth */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-200 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-200 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-light text-slate-800 mb-4">Success Stories</h2>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            From confusion to confidence—see what students and parents say
          </p>
        </motion.div>

        <InfiniteMovingCards
          items={testimonials.map(testimonial => ({
            quote: testimonial.quote,
            name: testimonial.name,
            title: testimonial.title
          }))}
          direction="right"
          speed="normal"
          pauseOnHover={true}
        />
      </div>
    </section>
  );
};

export { TestimonialsSection };