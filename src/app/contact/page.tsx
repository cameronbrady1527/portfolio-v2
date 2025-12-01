// app/contact/page.tsx - Contact page
'use client'

import { ContactForm } from '@/components/ui/contact-form'
import { Accordion } from '@/components/ui/accordion'
import { Mail, MapPin, Linkedin, Github, Clock, Phone } from 'lucide-react'
import { motion } from 'framer-motion'

export default function ContactPage() {
  return (
    <div className="pt-20 pb-16 min-h-screen bg-linear-to-br from-slate-50 via-blue-50 to-indigo-50 relative">
      {/* Floating background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-200 rounded-full blur-3xl opacity-20 animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-200 rounded-full blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <h1 className="text-4xl md:text-5xl font-light text-slate-800 mb-4">
              Let&apos;s Connect
            </h1>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Need someone to build your web app idea? Looking for a tutor?
              Want to chat or collaborate on a project? I&apos;d love to hear from you.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Contact Information Sidebar */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="space-y-6"
            >
              {/* Contact Details */}
              <div className="bg-white rounded-xl p-6 border border-slate-200 relative" style={{ zIndex: 20 }}>
                <h3 className="text-lg font-semibold text-slate-800 mb-4">Contact Information</h3>

                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Mail className="text-blue-600 mt-1 shrink-0" size={20} />
                    <div>
                      <p className="text-sm text-slate-500 mb-1">Email</p>
                      <a
                        href="mailto:cameronbrady1527@gmail.com"
                        className="text-slate-700 hover:text-blue-600 transition-colors"
                      >
                        cameronbrady1527@gmail.com
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Phone className="text-blue-600 mt-1 shrink-0" size={20} />
                    <div>
                      <p className="text-sm text-slate-500 mb-1">Phone</p>
                      <a
                        href="tel:+18452643972"
                        className="text-slate-700 hover:text-blue-600 transition-colors"
                      >
                        (845) 264-3972
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <MapPin className="text-blue-600 mt-1 shrink-0" size={20} />
                    <div>
                      <p className="text-sm text-slate-500 mb-1">Location</p>
                      <span className="text-slate-700">New York, NY</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Clock className="text-blue-600 mt-1 shrink-0" size={20} />
                    <div>
                      <p className="text-sm text-slate-500 mb-1">Response Time</p>
                      <span className="text-slate-700">Within 24 hours</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Social Links */}
              <div className="bg-white rounded-xl p-6 border border-slate-200 relative" style={{ zIndex: 20 }}>
                <h3 className="text-lg font-semibold text-slate-800 mb-4">Connect With Me</h3>
                <div className="space-y-3">
                  <a
                    href="https://www.linkedin.com/in/cameron-brady-5770431b5/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors group"
                  >
                    <Linkedin size={20} className="text-blue-600 group-hover:scale-110 transition-transform" />
                    <span className="text-slate-700">LinkedIn</span>
                  </a>
                  <a
                    href="https://github.com/cameronbrady1527"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors group"
                  >
                    <Github size={20} className="text-slate-700 group-hover:scale-110 transition-transform" />
                    <span className="text-slate-700">GitHub</span>
                  </a>
                </div>
              </div>

              {/* Office Hours / Availability */}
              <div className="bg-blue-50 rounded-xl p-6 border border-blue-100 relative" style={{ zIndex: 20 }}>
                <h3 className="text-lg font-semibold text-slate-800 mb-3">Availability</h3>
                <p className="text-sm text-slate-600 mb-3">
                  I&apos;m currently available for:
                </p>
                <ul className="text-sm text-slate-700 space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 mt-1">•</span>
                    <span>Research collaborations</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 mt-1">•</span>
                    <span>Consulting projects</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 mt-1">•</span>
                    <span>Academic tutoring</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 mt-1">•</span>
                    <span>Freelance development</span>
                  </li>
                </ul>
              </div>
            </motion.div>

            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="lg:col-span-2"
            >
              <ContactForm
                variant="portfolio"
                title="Send Me a Message"
                subtitle="Fill out the form below and I'll get back to you within 24 hours"
                showCard={true}
                submitText="Send Message"
              />
            </motion.div>
          </div>

          {/* FAQ Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mt-16"
          >
            <h2 className="text-2xl font-semibold text-slate-800 mb-8 text-center">
              Frequently Asked Questions
            </h2>

            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden relative p-6" style={{ zIndex: 20 }}>
              <Accordion
                items={[
                  {
                    question: "What types of projects do you work on?",
                    answer: "I specialize in machine learning applications, particularly in healthcare and neuroscience. I'm also available for web development, data analysis, and academic tutoring."
                  },
                  {
                    question: "What's your typical response time?",
                    answer: "I aim to respond to all inquiries within 24 hours. For urgent matters, please indicate that in your message."
                  },
                  {
                    question: "Do you offer consulting services?",
                    answer: "Yes, I'm available for consulting on AI/ML projects, particularly those related to healthcare applications, data analysis, and research methodology."
                  }
                ]}
                defaultOpen={0}
              />
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
