import React, { useEffect } from 'react';
import { useColorMode } from '@docusaurus/theme-common';

// Import ELEVATE styles globally
import '@inform-elevate/elevate-core-ui/dist/elevate.css';
import '@inform-elevate/elevate-core-ui/dist/themes/light.css';
import '@inform-elevate/elevate-core-ui/dist/themes/dark.css';

export default function Root({ children }: { children: React.ReactNode }) {
  const { colorMode } = useColorMode();

  useEffect(() => {
    // Apply ELEVATE theme class based on Docusaurus color mode
    const body = document.body;
    
    if (colorMode === 'dark') {
      body.classList.add('elvt-theme-dark');
      body.classList.remove('elvt-theme-light');
    } else {
      body.classList.add('elvt-theme-light');
      body.classList.remove('elvt-theme-dark');
    }
  }, [colorMode]);

  return <>{children}</>;
}