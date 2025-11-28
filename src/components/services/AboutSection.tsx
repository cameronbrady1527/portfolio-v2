"use client";

import { motion } from "framer-motion";
import { GraduationCap, Users, Award, Heart } from "lucide-react";

const AboutSection = () => {
  const timelineEvents = [
    {
      year: "2018",
      title: "Teaching Journey Begins", 
      description: "Started tutoring classmates in Geometry and Algebra II Honors",
      icon: <Heart className="h-6 w-6" />,
      color: "from-pink-500 to-red-500"
    },
    {
      year: "2020-2024", 
      title: "Cornell University",
      description: "Multidisciplinary degree: Computer Science, Applied Economics, Agricultural Sciences",
      icon: <GraduationCap className="h-6 w-6" />,
      color: "from-blue-500 to-purple-500"
    },
    {
      year: "2022-2024",
      title: "Head Teaching Assistant", 
      description: "Developed curricula, exams, and labs for upper-level business courses",
      icon: <Users className="h-6 w-6" />,
      color: "from-green-500 to-teal-500"
    },
    {
      year: "2024-Present",
      title: "Professional Educator",
      description: "K-12 substitute teacher + certified tutor on multiple platforms",
      icon: <Award className="h-6 w-6" />,
      color: "from-orange-500 to-yellow-500"
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
          <h2 className="text-4xl font-light text-slate-800 mb-4">Committed to Educating</h2>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            From helping high school friends to teaching at Cornell to working with K-12 students,
            my passion for education has shaped everything I do.
          </p>
        </motion.div>

        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-linear-to-b from-blue-300 to-indigo-300 hidden lg:block"></div>

          <div className="space-y-12">
            {timelineEvents.map((event, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className={`flex items-center ${
                  index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'
                } flex-col lg:text-left text-center`}
              >
                <div className="flex-1 lg:mx-8">
                  <div className="inline-block bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-semibold mb-4">
                    {event.year}
                  </div>
                  <h3 className="text-2xl font-semibold text-slate-800 mb-2">{event.title}</h3>
                  <p className="text-slate-600 text-lg">{event.description}</p>
                </div>

                {/* Center icon */}
                <div className="shrink-0 w-16 h-16 bg-white border-4 border-blue-200 rounded-full flex items-center justify-center mb-4 lg:mb-0 z-10 shadow-lg">
                  <div className="text-blue-600">
                    {event.icon}
                  </div>
                </div>

                <div className="flex-1 lg:mx-8"></div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export { AboutSection };