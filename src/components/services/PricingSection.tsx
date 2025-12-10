"use client";

// components/sections/PricingContactSection.tsx
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, MapPin, Globe, DollarSign, CheckCircle } from "lucide-react";
import { ContactForm } from "@/components/ui/contact-form";

const PricingContactSection = () => {
  const pricingFeatures = [
    "Single sessions available",
    "Weekly ongoing support", 
    "Intensive exam prep packages",
    "Custom learning plans",
    "Progress tracking"
  ];

  const availabilityItems = [
    {
      icon: <Clock className="h-5 w-5 text-blue-500" />,
      text: "Weekday evenings 4PM-9PM, flexible weekends"
    },
    {
      icon: <MapPin className="h-5 w-5 text-green-500" />,
      text: "In-person sessions in Dutchess County, NY"
    },
    {
      icon: <Globe className="h-5 w-5 text-purple-500" />,
      text: "Virtual sessions available worldwide"
    }
  ];

  return (
    <section className="py-20">
      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-xl text-gray-600">Clear pricing, flexible scheduling, and personalized support</p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Pricing Card */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Card className="h-full shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader className="text-center pb-4">
                <CardTitle className="flex items-center justify-center text-2xl">
                  <DollarSign className="h-6 w-6 mr-2 text-green-500" />
                  Pricing & Availability
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Session Options */}
                <div className="space-y-3">
                  <h4 className="font-semibold text-lg">Session Options:</h4>
                  {pricingFeatures.map((feature, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.1 }}
                      className="flex items-center space-x-3"
                    >
                      <CheckCircle className="h-5 w-5 text-green-500 shrink-0" />
                      <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                    </motion.div>
                  ))}
                </div>

                {/* Rates */}
                <div className="bg-linear-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg p-5 border border-blue-100 dark:border-blue-900/30">
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    Rates vary based on subject complexity and session type. Reach out and we&apos;ll find an arrangement that works for your needs and budget.
                  </p>
                </div>

                {/* Availability */}
                <div className="space-y-4 pt-4 border-t">
                  <h4 className="font-semibold text-lg">Availability:</h4>
                  {availabilityItems.map((item, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.1 }}
                      className="flex items-center space-x-3"
                    >
                      {item.icon}
                      <span className="text-gray-700 dark:text-gray-300">{item.text}</span>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="h-full"
          >
            <ContactForm
              variant="tutoring"
              title="Schedule Your First Session"
              subtitle="Let's discuss your goals and create a plan for success"
              endpoint="/api/contact"
              submitText="Send Message"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export { PricingContactSection };