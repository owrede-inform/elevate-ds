import React, { useEffect } from 'react';

// SSR polyfills for browser globals
import '../ssr-polyfill.js';

// TypeScript declaration for ELEVATE UI global
declare global {
  interface Window {
    ElevateUI?: {
      setIconLibrary: (name: string, config: { resolver: (name: string) => string }) => void;
    };
    IconRegistry?: any;
  }
}

// Import Shoelace styles (safe to import at module level)
import '@shoelace-style/shoelace/dist/themes/light.css';

// Helper function to create corrected icons with fill="white" for CSS masks
const createCorrectedIcon = (originalIcon: string) => {
  if (originalIcon.startsWith('data:image/svg+xml,')) {
    const decoded = decodeURIComponent(originalIcon.substring(originalIcon.indexOf(',') + 1));
    const corrected = decoded.replace(/fill="black"/g, 'fill="white"').replace(/fill="#000"/g, 'fill="white"');
    return `data:image/svg+xml,${encodeURIComponent(corrected)}`;
  }
  return originalIcon;
};

// Import framework context
import { FrameworkProvider } from '../contexts/FrameworkContext';

export default function Root({ children }: { children: React.ReactNode }) {
  // console.log('🚀 Root component mounted - TESTING IF THIS RUNS');

  useEffect(() => {
    // console.log('🚀 Root useEffect triggered');

    // Only run in browser environment - critical for SSR compatibility
    if (typeof window === 'undefined' || typeof document === 'undefined') {
      // console.log('❌ Window/document undefined, skipping ELEVATE initialization');
      return;
    }

    // console.log('✅ Browser environment detected, starting ELEVATE initialization');

    // ELEVATE library needs to be loaded via dynamic import since static script loading
    // in docusaurus.config.ts was causing conflicts. Production build needs this.

    const loadElevateLibrary = async () => {
      try {
        // Load ELEVATE core UI library from local node_modules instead of CDN
        if (typeof window !== 'undefined' && !window.ElevateUI) {
          console.log('🚀 Loading ELEVATE Core UI library from local package...');

          // Import ELEVATE elements from local package (try index.js first)
          await import('@inform-elevate/elevate-core-ui/dist/index.js');

          console.log('✅ ELEVATE Core UI library loaded successfully from local package');

          // Wait a bit for the library to fully initialize
          setTimeout(() => {
            console.log('🔍 ElevateUI available:', typeof window.ElevateUI);
            console.log('🔍 Custom elements registry:', window.customElements ? 'available' : 'not available');
          }, 500);
        }
      } catch (error) {
        console.error('❌ Failed to load ELEVATE Core UI library:', error);
      }
    };

    // Load ELEVATE library first, then initialize everything else
    loadElevateLibrary();

    // Check if ELEVATE components are available and apply theme classes
    const initializeElevateTheme = () => {
      // Only proceed if we're in browser environment
      if (typeof window === 'undefined' || typeof document === 'undefined') return;

      // Wait for potential ELEVATE initialization from static script
      setTimeout(() => {
        const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
        const themeClass = isDark ? 'elvt-theme-dark' : 'elvt-theme-light';

        // Apply ELEVATE theme class to document element
        document.documentElement.classList.remove('elvt-theme-light', 'elvt-theme-dark');
        document.documentElement.classList.add(themeClass);

        // Apply theme class to all ELEVATE components
        const elevateComponents = document.querySelectorAll('[class*="elvt-"], elvt-card, elvt-button, elvt-input, elvt-stack, elvt-badge');
        elevateComponents.forEach((component) => {
          component.classList.remove('elvt-theme-light', 'elvt-theme-dark');
          component.classList.add(themeClass);
        });

        // console.log(`🎨 THEME APPLICATION: Applied ${themeClass} to ${elevateComponents.length} ELEVATE components`);
      }, 600); // Give time for ELEVATE static script to load
    };

    // Initialize theme handling
    const timer = setTimeout(initializeElevateTheme, 100);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // Only run in browser environment
    if (typeof window === 'undefined') return;

    // Apply theme classes to ELEVATE components when theme changes
    const applyThemeToComponents = () => {
      const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
      const themeClass = isDark ? 'elvt-theme-dark' : 'elvt-theme-light';

      // CRITICAL FIX: Apply ELEVATE theme class to document element so CSS variables are available
      document.documentElement.classList.remove('elvt-theme-light', 'elvt-theme-dark');
      document.documentElement.classList.add(themeClass);
      // console.log(`🔥 CRITICAL FIX: Applied ${themeClass} to document.documentElement`);

      // Apply theme class to all ELEVATE components
      const elevateComponents = document.querySelectorAll('[class*="elvt-"], elvt-card, elvt-button, elvt-input, elvt-stack, elvt-badge');
      elevateComponents.forEach((component) => {
        // Remove existing theme classes
        component.classList.remove('elvt-theme-light', 'elvt-theme-dark');
        // Add current theme class
        component.classList.add(themeClass);

        // No manual style forcing needed - ELEVATE tokens handle this automatically
      });

      // console.log(`Applied ${themeClass} to ${elevateComponents.length} ELEVATE components`);
    };

    // Let Docusaurus handle sidebar layout naturally

    // Apply theme classes immediately
    applyThemeToComponents();

    // Watch for theme changes
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'attributes' && mutation.attributeName === 'data-theme') {
          // Apply theme classes to components
          applyThemeToComponents();

          // CSS variables will be picked up naturally by shadow DOM

          // Dispatch a custom event that ELEVATE components can listen to
          window.dispatchEvent(new CustomEvent('theme-changed', {
            detail: { theme: document.documentElement.getAttribute('data-theme') }
          }));
        }
      });
    });

    // Watch for new ELEVATE components being added
    const componentObserver = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            const element = node as Element;
            if (element.tagName?.startsWith('ELVT-') || element.classList?.contains('elvt-')) {
              applyThemeToComponents();
            }
            // Check for ELEVATE components in added subtrees
            const elevateComponents = element.querySelectorAll?.('[class*="elvt-"], elvt-card, elvt-button, elvt-input, elvt-stack, elvt-badge');
            if (elevateComponents?.length > 0) {
              applyThemeToComponents();
            }
            // Sidebar layout handled by Docusaurus automatically
          }
        });
      });
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme']
    });

    componentObserver.observe(document.body, {
      childList: true,
      subtree: true
    });

    return () => {
      observer.disconnect();
      componentObserver.disconnect();
    };
  }, []);

  return (
    <FrameworkProvider>
      {children}
    </FrameworkProvider>
  );
}