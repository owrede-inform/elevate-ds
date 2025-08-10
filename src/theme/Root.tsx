import React, { useEffect } from 'react';

// Import ELEVATE web components and styles globally
import '@inform-elevate/elevate-core-ui';
import '@inform-elevate/elevate-core-ui/dist/elevate.css';
import '@inform-elevate/elevate-core-ui/dist/themes/light.css';
import '@inform-elevate/elevate-core-ui/dist/themes/dark.css';

// Simple, stable theme class application
const applyThemeClasses = (isDark: boolean) => {
  if (typeof document === 'undefined') return;
  
  const html = document.documentElement;
  const body = document.body;
  
  // Remove all theme classes first
  html.classList.remove('elvt-theme-dark', 'elvt-theme-light', 'sl-theme-dark', 'sl-theme-light');
  body.classList.remove('elvt-theme-dark', 'elvt-theme-light', 'sl-theme-dark', 'sl-theme-light');
  
  // Add appropriate theme classes
  if (isDark) {
    html.classList.add('elvt-theme-dark', 'sl-theme-dark');
    body.classList.add('elvt-theme-dark', 'sl-theme-dark');
  } else {
    html.classList.add('elvt-theme-light', 'sl-theme-light');
    body.classList.add('elvt-theme-light', 'sl-theme-light');
  }
};

export default function Root({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Apply initial theme
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const isDark = currentTheme === 'dark';
    applyThemeClasses(isDark);
    
    // Re-trigger theme after a delay to refresh ELEVATE components
    // This gives components time to initialize and then refreshes their theme
    const refreshTimer = setTimeout(() => {
      applyThemeClasses(isDark);
    }, 500); // 500ms delay to allow component initialization
    
    // Additional refresh after longer delay as backup
    const backupRefreshTimer = setTimeout(() => {
      const latestTheme = document.documentElement.getAttribute('data-theme');
      applyThemeClasses(latestTheme === 'dark');
    }, 1500); // 1.5s delay for late-loading components
    
    // Listen for theme changes
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'attributes' && mutation.attributeName === 'data-theme') {
          const theme = document.documentElement.getAttribute('data-theme');
          applyThemeClasses(theme === 'dark');
        }
      });
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme']
    });

    return () => {
      observer.disconnect();
      clearTimeout(refreshTimer);
      clearTimeout(backupRefreshTimer);
    };
  }, []);

  return <>{children}</>;
}