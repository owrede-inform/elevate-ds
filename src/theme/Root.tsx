import React, { useEffect } from 'react';

// SSR polyfills for browser globals
import '../ssr-polyfill.js';

// TypeScript declaration for ELEVATE UI global
declare global {
  interface Window {
    ElevateUI?: {
      setIconLibrary: (name: string, config: { resolver: (name: string) => string }) => void;
    };
  }
}

// Import ELEVATE web components and core styles only
import '@inform-elevate/elevate-core-ui';
import '@inform-elevate/elevate-core-ui/dist/elevate.css';
// Import light theme as default - dark theme handled via CSS overrides
import '@inform-elevate/elevate-core-ui/dist/themes/light.css';

// Import framework context
import { FrameworkProvider } from '../contexts/FrameworkContext';

export default function Root({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Configure icon library for ELEVATE components
    const configureIcons = () => {
      if (typeof window === 'undefined') return;

      // Enhanced configuration approach
      const iconConfig = {
        resolver: (name: string) => {
          if (!name || typeof name !== 'string') {
            console.warn('Invalid icon name provided:', name);
            return '';
          }
          const iconName = name.replace('mdi:', '');
          const url = `https://cdn.jsdelivr.net/npm/@mdi/svg@latest/svg/${iconName}.svg`;
          console.log(`Resolving icon ${name} to ${url}`);
          return url;
        }
      };

      // Approach 1: Global ElevateUI configuration
      if ((window as any).ElevateUI?.setIconLibrary) {
        (window as any).ElevateUI.setIconLibrary('mdi', iconConfig);
        console.log('ElevateUI icon library configured');
      }

      // Approach 2: Direct element configuration
      const configureElement = (element: any) => {
        if (element.setIconLibrary) {
          element.setIconLibrary('mdi', iconConfig);
        } else if (element.iconLibraries) {
          element.iconLibraries = { ...element.iconLibraries, mdi: iconConfig };
        }
      };

      // Configure existing elements
      document.querySelectorAll('elvt-icon').forEach(configureElement);

      // Configure new elements as they're added
      const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          mutation.addedNodes.forEach((node) => {
            if (node.nodeType === Node.ELEMENT_NODE) {
              const element = node as Element;
              if (element.tagName === 'ELVT-ICON') {
                configureElement(element);
              }
              element.querySelectorAll?.('elvt-icon').forEach(configureElement);
            }
          });
        });
      });

      observer.observe(document.body, { childList: true, subtree: true });

      // Approach 3: Global fallback configuration
      (window as any).ElevateIconResolver = (name: string) => {
        if (!name || typeof name !== 'string') {
          console.warn('Invalid icon name provided to fallback resolver:', name);
          return '';
        }
        const iconName = name.replace('mdi:', '');
        return `https://cdn.jsdelivr.net/npm/@mdi/svg@latest/svg/${iconName}.svg`;
      };

      return () => observer.disconnect();
    };

    // Configure icons when components are ready
    const initializeIcons = async () => {
      try {
        // Wait for both elvt-icon and elvt-button to be defined
        await Promise.all([
          customElements.whenDefined('elvt-icon').catch(() => {}),
          customElements.whenDefined('elvt-button').catch(() => {})
        ]);
        
        // Additional delay to ensure components are fully initialized
        setTimeout(() => {
          configureIcons();
          
          // Skip force refresh - let components initialize naturally
          console.log('Icon configuration completed');
        }, 250);
      } catch (error) {
        console.warn('Error initializing icons:', error);
        // Still configure icons even if there's an error
        configureIcons();
      }
    };

    initializeIcons();

    // Force a re-render of ELEVATE components when theme changes
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'attributes' && mutation.attributeName === 'data-theme') {
          // Trigger a reflow to ensure CSS variables are picked up by shadow DOM
          document.body.offsetHeight; // Force reflow
          
          // Dispatch a custom event that ELEVATE components can listen to
          window.dispatchEvent(new CustomEvent('theme-changed', {
            detail: { theme: document.documentElement.getAttribute('data-theme') }
          }));
        }
      });
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme']
    });

    return () => observer.disconnect();
  }, []);

  return (
    <FrameworkProvider>
      {children}
    </FrameworkProvider>
  );
}