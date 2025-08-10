import React, { useEffect } from 'react';

// SSR polyfills for browser globals
import '../ssr-polyfill.js';

// Import ELEVATE web components and core styles only
import '@inform-elevate/elevate-core-ui';
import '@inform-elevate/elevate-core-ui/dist/elevate.css';
// Import light theme as default - dark theme handled via CSS overrides
import '@inform-elevate/elevate-core-ui/dist/themes/light.css';

export default function Root({ children }: { children: React.ReactNode }) {
  useEffect(() => {
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

  return <>{children}</>;
}