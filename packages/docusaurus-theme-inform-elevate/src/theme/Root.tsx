import React, { useEffect } from 'react';

// Import ELEVATE styles globally
import '@inform-elevate/elevate-core-ui/dist/elevate.css';
import '@inform-elevate/elevate-core-ui/dist/themes/light.css';
import '@inform-elevate/elevate-core-ui/dist/themes/dark.css';

export default function Root({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Set up initial ELEVATE theme class (default to light)
    // The actual color mode switching will be handled by Docusaurus's built-in system
    document.body.classList.add('elvt-theme-light');
    
    // Listen for changes to the data-theme attribute which Docusaurus manages
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'attributes' && mutation.attributeName === 'data-theme') {
          const theme = document.documentElement.getAttribute('data-theme');
          const body = document.body;
          
          if (theme === 'dark') {
            body.classList.add('elvt-theme-dark');
            body.classList.remove('elvt-theme-light');
          } else {
            body.classList.add('elvt-theme-light');
            body.classList.remove('elvt-theme-dark');
          }
        }
      });
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme']
    });

    return () => observer.disconnect();
  }, []);

  return <>{children}</>;
}