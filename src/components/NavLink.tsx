'use client'
import Link from 'next/link';
import { useNavigation } from '@/contexts/NavigationContext';
import { ReactNode } from 'react';

interface NavLinkProps {
  href: string;
  children: ReactNode;
  className?: string;
  openInNewTab?: boolean;
}

export default function NavLink({ href, children, className, openInNewTab }: NavLinkProps) {
  const { setHoveredPath } = useNavigation();

  const handleMouseEnter = () => setHoveredPath(href);
  const handleMouseLeave = () => setHoveredPath(null);

  // For /resume.pdf and other links that should open in new tab
  if (openInNewTab) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={className}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {children}
      </a>
    );
  }

  // For internal links
  return (
    <Link
      href={href}
      className={className}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {children}
    </Link>
  );
}
