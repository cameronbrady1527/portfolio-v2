// components/Navigation.tsx - Simplified navigation
'use client'
import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { usePathname } from 'next/navigation';
import { useNavigation } from '@/contexts/NavigationContext';

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { hoveredPath, setHoveredPath } = useNavigation();
  const pathname = usePathname();
  
  const navItems = [
    // { href: '/', label: 'Home' },
    { href: '/about', label: 'About' },
    { href: '/projects', label: 'Projects' },
    { href: '/services', label: 'Services' },
    { href: '/contact', label: 'Contact' }
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${
      isScrolled 
        ? 'bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm' 
        : 'bg-transparent'
    }`}>
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          <div
            className="flex items-center"
            onMouseEnter={() => setHoveredPath('/')}
            onMouseLeave={() => setHoveredPath(null)}
          >
            <Link
              href="/"
              className="text-xl font-semibold text-slate-800 hover:text-blue-600 transition-colors"
            >
              cameronbrady.dev
            </Link>
            <AnimatePresence>
              {hoveredPath && (
                <motion.span
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  transition={{ duration: 0.2 }}
                  className="text-base font-normal text-slate-400"
                >
                  {hoveredPath}
                </motion.span>
              )}
            </AnimatePresence>
          </div>
          
          {/* Desktop navigation */}
          <div className="hidden md:flex items-center space-x-3">
            {navItems.map((item) =>
              (
                <div
                  key={item.href}
                  onMouseEnter={() => setHoveredPath(item.href)}
                  onMouseLeave={() => setHoveredPath(null)}
                >
                  <Link
                    href={item.href}
                    className={`font-medium transition-colors ${
                      pathname === item.href
                        ? 'text-blue-600'
                        : 'text-slate-600 hover:text-slate-800'
                    }`}
                  >
                    <span className="relative inline-block after:content-[''] after:absolute after:left-0 after:bottom-0
                                   after:w-full after:h-0.5 after:bg-blue-600 after:origin-right after:scale-x-0
                                   hover:after:origin-left hover:after:scale-x-100 after:transition-transform
                                   after:duration-300 after:ease-out">
                      {item.label}
                    </span>
                  </Link>
                </div>
              )
            )}
          </div>
          
          {/* Mobile menu button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 text-slate-600 hover:text-slate-800"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
        
        {/* Mobile navigation */}
        {isOpen && (
          <div className="md:hidden border-t border-slate-200 bg-white/95 backdrop-blur-md">
            <div className="py-4 space-y-2">
              {navItems.map((item) =>(
                <div key={item.href} className="px-4 pt-2">
                  <a
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full px-4 py-2 bg-blue-600 text-white rounded-lg text-center font-medium hover:bg-blue-700 transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    {item.label}
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}