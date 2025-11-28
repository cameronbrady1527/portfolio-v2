// components/QuickContact.tsx - Contact section for home page
"use client";

import { useState } from 'react';
import { Mail, Phone, MapPin, Linkedin, Github, ArrowRight, CheckCircle2 } from 'lucide-react';
import { motion } from 'motion/react';
import Link from 'next/link';
import NavLink from '@/components/NavLink';

export default function QuickContact() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          message: formData.message,
          formVariant: 'general'
        }),
      });

      if (response.ok) {
        setSubmitStatus('success');
        setFormData({ firstName: '', lastName: '', email: '', message: '' });
        setTimeout(() => setSubmitStatus('idle'), 5000);
      } else {
        setSubmitStatus('error');
      }
    } catch (error) {
      console.error('Form submission error:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <section className="py-20">
      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-light text-slate-800 mb-4">Get In Touch</h2>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Interested in collaboration, research opportunities, or discussing AI applications in healthcare?
          </p>
        </motion.div>

        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Contact info */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="bg-white rounded-xl p-6 border border-slate-200 relative"
              style={{ zIndex: 20 }}
            >
              <h3 className="text-xl font-semibold text-slate-800 mb-4">Contact Information</h3>
              
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Mail className="text-blue-600" size={20} />
                  <span className="text-slate-600"><a href="mailto:cameronbrady1527@gmail.com">cameronbrady1527@gmail.com</a></span>
                </div>
                
                <div className="flex items-center gap-3">
                  <MapPin className="text-blue-600" size={20} />
                  <span className="text-slate-600">New York, NY</span>
                </div>
              </div>
              
              <div className="border-t border-slate-200 pt-4 mt-4">
                <h4 className="font-medium text-slate-700 mb-3">Connect With Me</h4>
                <div className="flex gap-4">
                  <a
                    href="https://www.linkedin.com/in/cameron-brady-5770431b5/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors"
                  >
                    <Linkedin size={20} className="text-slate-600" />
                  </a>
                  <a
                    href="https://github.com/cameronbrady1527"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors"
                  >
                    <Github size={20} className="text-slate-600" />
                  </a>
                </div>
              </div>

              <div className="border-t-2 border-slate-300 pt-6 mt-8">
                <h3 className="text-xl font-semibold text-slate-800 mb-4">Interested in Hiring Me?</h3>
                <NavLink
                  href="/resume.pdf"
                  openInNewTab
                  className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
                >
                  <motion.div
                    className="flex items-center gap-2"
                    initial="initial"
                    whileHover="hover"
                  >
                    <span className="relative inline-block after:content-[''] after:absolute after:left-0 after:bottom-0
                                 after:w-full after:h-0.5 after:bg-blue-600 after:origin-right after:scale-x-0
                                 hover:after:origin-left hover:after:scale-x-100 after:transition-transform
                                 after:duration-300 after:ease-out">
                      View Resume
                    </span>
                    <motion.span
                      variants={{
                        initial: { x: 0 },
                        hover: {
                          x: [0, 8, 0],
                          transition: {
                            duration: 0.6,
                            ease: "easeInOut",
                            repeat: 1
                          }
                        }
                      }}
                      className="inline-block"
                    >
                      <ArrowRight size={16} />
                    </motion.span>
                  </motion.div>
                </NavLink>
              </div>

              <div className="border-t border-slate-200 pt-4 mt-4">
                <h4 className="font-medium text-slate-700 mb-3">Not Sure Yet?</h4>
                <NavLink
                  href="/about"
                  className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
                >
                  <motion.div
                    className="flex items-center gap-2"
                    initial="initial"
                    whileHover="hover"
                  >
                    <span className="relative inline-block after:content-[''] after:absolute after:left-0 after:bottom-0
                                 after:w-full after:h-0.5 after:bg-blue-600 after:origin-right after:scale-x-0
                                 hover:after:origin-left hover:after:scale-x-100 after:transition-transform
                                 after:duration-300 after:ease-out">
                      Learn More About Me
                    </span>
                    <motion.span
                      variants={{
                        initial: { x: 0 },
                        hover: {
                          x: [0, 8, 0],
                          transition: {
                            duration: 0.6,
                            ease: "easeInOut",
                            repeat: 1
                          }
                        }
                      }}
                      className="inline-block"
                    >
                      <ArrowRight size={16} />
                    </motion.span>
                  </motion.div>
                </NavLink>
              </div>
            </motion.div>
            
            {/* Quick contact form */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white rounded-xl p-8 border border-slate-200 relative"
              style={{ zIndex: 20 }}
            >
              <h3 className="text-xl font-semibold text-slate-800 mb-6">Send a Message</h3>

              {submitStatus === 'success' ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-8"
                >
                  <CheckCircle2 className="mx-auto text-green-600 mb-4" size={48} />
                  <h4 className="text-lg font-semibold text-slate-800 mb-2">Message Sent!</h4>
                  <p className="text-slate-600">Thank you for reaching out. I'll get back to you soon.</p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      placeholder="First Name"
                      required
                      className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    />
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      placeholder="Last Name"
                      required
                      className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    />
                  </div>

                  <div>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Your Email"
                      required
                      className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    />
                  </div>

                  <div>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Your Message"
                      rows={4}
                      required
                      className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none transition-all"
                    />
                  </div>

                  {submitStatus === 'error' && (
                    <p className="text-sm text-red-600">
                      Something went wrong. Please try again or email me directly.
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? 'Sending...' : 'Send Message'}
                  </button>
                </form>
              )}
              
              <div className="mt-6 pt-6 border-t border-slate-200">
                <NavLink
                  href="/contact"
                  className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
                >
                  <motion.div
                    className="flex items-center gap-2"
                    initial="initial"
                    whileHover="hover"
                  >
                    <span className="relative inline-block after:content-[''] after:absolute after:left-0 after:bottom-0
                                 after:w-full after:h-0.5 after:bg-blue-600 after:origin-right after:scale-x-0
                                 hover:after:origin-left hover:after:scale-x-100 after:transition-transform
                                 after:duration-300 after:ease-out">
                      View Full Contact Page
                    </span>
                    <motion.span
                      variants={{
                        initial: { x: 0 },
                        hover: {
                          x: [0, 8, 0],
                          transition: {
                            duration: 0.6,
                            ease: "easeInOut",
                            repeat: 1
                          }
                        }
                      }}
                      className="inline-block"
                    >
                      <ArrowRight size={16} />
                    </motion.span>
                  </motion.div>
                </NavLink>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}