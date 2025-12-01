"use client";

import { InfiniteMovingCards } from "@/components/ui/infinite-moving-cards";
import { Star, Quote } from "lucide-react";
import { motion } from "motion/react";

const TestimonialsSection = () => {
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
    },
    {
      quote: "I remember when you helped me practice with a math test that was really hard for me. I thought I was going to fail, but you showed my that I knew way more than I thought.",
      name: "Ethan D.",
      title: "Elementary School Student"
    }
  ];

  return (
    <section className="py-20 relative overflow-hidden">
      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-light text-slate-800 mb-4">Success Stories</h2>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            From confusion to confidence, see what students and parents say
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