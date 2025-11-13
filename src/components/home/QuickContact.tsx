// components/QuickContact.tsx - Contact section for home page
"use client";

import { Mail, Phone, MapPin, Linkedin, Github, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';
import Link from 'next/link';

export default function QuickContact() {
  return (
    <section className="py-20 bg-slate-100">
      <div className="container mx-auto px-6">
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
              className="bg-white rounded-xl p-8 border border-slate-200"
            >
              <h3 className="text-xl font-semibold text-slate-800 mb-6">Contact Information</h3>
              
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
              
              <div className="border-t border-slate-200 pt-6 mt-6">
                <h4 className="font-medium text-slate-700 mb-4">Connect With Me</h4>
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
            </motion.div>
            
            {/* Quick contact form */}
            <motion.div 
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white rounded-xl p-8 border border-slate-200"
            >
              <h3 className="text-xl font-semibold text-slate-800 mb-6">Send a Message</h3>
              
              <form className="space-y-4">
                <div>
                  <input
                    type="text"
                    placeholder="Your Name"
                    className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <input
                    type="email"
                    placeholder="Your Email"
                    className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <textarea
                    placeholder="Your Message"
                    rows={4}
                    className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  />
                </div>
                
                <button
                  type="submit"
                  className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  Send Message
                </button>
              </form>
              
              <div className="mt-6 pt-6 border-t border-slate-200">
                <Link 
                  href="/contact"
                  className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
                >
                  <span className="relative inline-block after:content-[''] after:absolute after:left-0 after:bottom-0
                               after:w-full after:h-0.5 after:bg-blue-600 after:origin-right after:scale-x-0
                               hover:after:origin-left hover:after:scale-x-100 after:transition-transform
                               after:duration-300 after:ease-out">
                    View Full Contact Page
                  </span>
                  <motion.span
                    animate={{ x: [0, 8, 0] }}
                    transition={{
                      duration: 1.0,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                    className="inline-block"
                  >
                    <ArrowRight size={16} />
                  </motion.span>
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}