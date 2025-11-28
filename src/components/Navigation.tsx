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
    { href: '/', label: 'Home' },
    { href: '/about', label: 'About' },
    { href: '/projects', label: 'Projects' },
    { href: '/services', label: 'Services' },
    { href: '/contact', label: 'Contact' }
  ];

  // Find current page label
  const currentPage = navItems.find(item => item.href === pathname);
  const displayText = hoveredPath
    ? navItems.find(item => item.href === hoveredPath)?.label
    : currentPage?.label;

  // Format display text: lowercase, and just "/" for home
  const formattedDisplayText = displayText
    ? (displayText === 'Home' ? '/' : `/${displayText.toLowerCase()}`)
    : null;

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
          <div className="flex items-center">
            <Link
              href="/"
              className="text-xl font-semibold text-slate-800 hover:text-blue-600 transition-colors"
              onMouseEnter={() => setHoveredPath('/')}
              onMouseLeave={() => setHoveredPath(null)}
            >
              cameronbrady.dev
            </Link>
            <AnimatePresence mode="wait">
              {formattedDisplayText && (
                <motion.span
                  key={hoveredPath || pathname}
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 5 }}
                  transition={{ duration: 0.2 }}
                  className={`text-base font-medium ${
                    hoveredPath
                      ? 'text-blue-500'
                      : 'text-slate-600'
                  }`}
                >
                  {formattedDisplayText}
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
              {navItems.map((item) => (
                <div key={item.href} className="px-4">
                  <Link
                    href={item.href}
                    className={`block w-full px-4 py-3 rounded-lg text-center font-medium transition-colors ${
                      pathname === item.href
                        ? 'bg-blue-600 text-white'
                        : 'text-slate-700 hover:bg-slate-100'
                    }`}
                    onClick={() => setIsOpen(false)}
                  >
                    {item.label}
                  </Link>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}