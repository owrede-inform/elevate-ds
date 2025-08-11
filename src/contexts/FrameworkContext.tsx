/**
 * Framework Context
 * Global state management for framework preference with localStorage persistence
 */

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type Framework = 'webcomponent' | 'react' | 'angular' | 'vue' | 'svelte' | 'html';

export interface FrameworkContextType {
  selectedFramework: Framework;
  setSelectedFramework: (framework: Framework) => void;
  availableFrameworks: readonly Framework[];
}

const STORAGE_KEY = 'elevate-ds-framework-preference';
const DEFAULT_FRAMEWORK: Framework = 'webcomponent';

export const AVAILABLE_FRAMEWORKS: readonly Framework[] = [
  'webcomponent',
  'react', 
  'angular',
  'vue',
  'svelte',
  'html'
] as const;

export const FRAMEWORK_LABELS: Record<Framework, string> = {
  webcomponent: 'Web Components',
  react: 'React',
  angular: 'Angular', 
  vue: 'Vue',
  svelte: 'Svelte',
  html: 'HTML'
};

const FrameworkContext = createContext<FrameworkContextType | undefined>(undefined);

/**
 * Custom hook to use framework context
 */
export function useFramework(): FrameworkContextType {
  const context = useContext(FrameworkContext);
  if (context === undefined) {
    throw new Error('useFramework must be used within a FrameworkProvider');
  }
  return context;
}

/**
 * Load framework preference from localStorage
 */
function loadFrameworkPreference(): Framework {
  if (typeof window === 'undefined') {
    return DEFAULT_FRAMEWORK;
  }
  
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored && AVAILABLE_FRAMEWORKS.includes(stored as Framework)) {
      return stored as Framework;
    }
  } catch (error) {
    console.warn('Failed to load framework preference:', error);
  }
  
  return DEFAULT_FRAMEWORK;
}

/**
 * Save framework preference to localStorage
 */
function saveFrameworkPreference(framework: Framework): void {
  if (typeof window === 'undefined') {
    return;
  }
  
  try {
    localStorage.setItem(STORAGE_KEY, framework);
  } catch (error) {
    console.warn('Failed to save framework preference:', error);
  }
}

interface FrameworkProviderProps {
  children: ReactNode;
}

/**
 * Framework Provider Component
 */
export function FrameworkProvider({ children }: FrameworkProviderProps) {
  const [selectedFramework, setSelectedFrameworkState] = useState<Framework>(DEFAULT_FRAMEWORK);
  const [isInitialized, setIsInitialized] = useState(false);
  
  // Load preference on mount
  useEffect(() => {
    const savedFramework = loadFrameworkPreference();
    setSelectedFrameworkState(savedFramework);
    setIsInitialized(true);
  }, []);
  
  // Save preference when it changes
  const setSelectedFramework = (framework: Framework) => {
    setSelectedFrameworkState(framework);
    saveFrameworkPreference(framework);
  };
  
  // Don't render until initialized to prevent hydration mismatches
  if (!isInitialized) {
    return null;
  }
  
  const contextValue: FrameworkContextType = {
    selectedFramework,
    setSelectedFramework,
    availableFrameworks: AVAILABLE_FRAMEWORKS,
  };
  
  return (
    <FrameworkContext.Provider value={contextValue}>
      {children}
    </FrameworkContext.Provider>
  );
}