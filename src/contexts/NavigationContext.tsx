'use client'
import { createContext, useContext, useState, ReactNode } from 'react';

interface NavigationContextType {
  hoveredPath: string | null;
  setHoveredPath: (path: string | null) => void;
}

const NavigationContext = createContext<NavigationContextType | undefined>(undefined);

export function NavigationProvider({ children }: { children: ReactNode }) {
  const [hoveredPath, setHoveredPath] = useState<string | null>(null);

  return (
    <NavigationContext.Provider value={{ hoveredPath, setHoveredPath }}>
      {children}
    </NavigationContext.Provider>
  );
}

export function useNavigation() {
  const context = useContext(NavigationContext);
  if (!context) {
    throw new Error('useNavigation must be used within NavigationProvider');
  }
  return context;
}
