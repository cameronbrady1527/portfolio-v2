"use client";

import { InfiniteMovingCards } from "@/components/ui/infinite-moving-cards";
import { motion } from "motion/react";

const TestimonialsSection = () => {
  const testimonials = [
    {
      quote: "Cam was an excellent tutor who provided clear and in-depth explanations of complex CS concepts. He was patient and used language I could understand in his lessons. Thanks to his guidance, I gained a deeper understanding of coding and he helped increase my skills significantly in Java, Python, and CS fundamentals.",
      name: "Brady K.",
      title: "High School Senior, AP Computer Science"
    },
    {
      quote: "I remember when you helped me practice with a math test that was really hard for me. I thought I was going to fail, but you showed my that I knew way more than I thought.",
      name: "Ethan D.",
      title: "Elementary School Student"
    },
    {
      quote: "Working with Cam on Algebra II and Physics H was incredibly helpful. He patiently broke down complex topics, boosted my confidence, and made algebra and physics a lot less stressful and more understandable with great support.",
      name: "Cooper C.", 
      title: "Junior, Algebra II Honors & Physics Honors"
    },
    {
      quote: "Cameron has the ability to make complex topics fun and understandable, leading to a huge improvement in my son's grades and self-esteem.",
      name: "Caryn C.",
      title: "Parent"
    },
    {
      quote: "Cameron's computer science tutoring got me into my dream college program. His explanations made complex algorithms finally click.",
      name: "David K.",
      title: "High School Graduate"
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