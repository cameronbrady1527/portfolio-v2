"use client";

import { BentoGrid, BentoGridItem } from "@/components/ui/bento-grid";
import { Calculator, Code, BookOpen, TrendingUp, FlaskConical } from "lucide-react";
import { motion } from "motion/react";

const SubjectsSection = () => {
  const subjects = [
    {
      title: "Mathematics K-12",
      description: "Elementary through AP Calculus AB/BC & Statistics",
      icon: <Calculator className="h-8 w-8 text-blue-500" />,
      content: ["Algebra I & II", "Geometry", "Pre-Calculus", "Calculus AB/BC", "Statistics", "All Honor & AP levels"],
      className: "md:col-span-2"
    },
    {
      title: "Computer Science",
      description: "Programming & Web Development",
      icon: <Code className="h-8 w-8 text-green-500" />,
      content: ["Python, Java, JavaScript/TypeScript", "HTML/CSS", "Web Development", "CS 1 & 2", "Data Structures & Algorithms", "Discrete Structures", "Machine Learning"],
      className: "md:col-span-1"
    },
    {
      title: "Sciences",
      description: "Physics, Biology, & K-5 Sciences",
      icon: <FlaskConical className="h-8 w-8 text-red-500" />,
      content: ["AP Physics 1, 2, & C", "AP Biology", "K-5 Sciences"],
      className: "md:col-span-1"
    },
    {
      title: "Elementary & Middle School",
      description: "All core subjects + study skills",
      icon: <BookOpen className="h-8 w-8 text-yellow-500" />,
      content: ["All core subjects", "Reading & Writing", "Math, Science, & Social Studies", "Study skills", "Test preparation"],
      className: "md:col-span-1"
    },
    {
      title: "Entrepreneurship & Business Fundamentals",
      description: "Introductory undergraduate courses",
      icon: <TrendingUp className="h-8 w-8 text-purple-500" />,
      content: ["Introductory Macro & Microeconomics", "Business Fundamentals", "Entrepreneurial Strategy & Marketing", "Farm Business Management", "Applied Economics & Management"],
      className: "md:col-span-1"
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
          <h2 className="text-4xl font-light text-slate-800 mb-4">Subjects & Services</h2>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">Find exactly what you need to succeed</p>
        </motion.div>

        <BentoGrid className="max-w-5xl mx-auto">
          {subjects.map((subject, i) => (
            <BentoGridItem 
              key={i}
              title={subject.title}
              description={subject.description}
              className={subject.className}
              icon={subject.icon}
              content={
                <div className="mt-4">
                  <ul className="text-sm space-y-2">
                    {subject.content.map((item, idx) => (
                      <li key={idx} className="flex items-center text-slate-600">
                        <div className="h-2 w-2 bg-current rounded-full mr-3 opacity-50" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              }
            />
          ))}
        </BentoGrid>
      </div>
    </section>
  );
};

export { SubjectsSection };