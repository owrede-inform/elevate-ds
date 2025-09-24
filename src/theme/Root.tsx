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

// Import Shoelace styles and icon setup (required peer dependency)
import '@shoelace-style/shoelace/dist/themes/light.css';
import { setBasePath } from '@shoelace-style/shoelace/dist/utilities/base-path.js';

// Import ELEVATE web components and core styles
import '@inform-elevate/elevate-core-ui';
import '@inform-elevate/elevate-core-ui/dist/elevate.css';
// Import light theme as default - dark theme handled via CSS overrides
import '@inform-elevate/elevate-core-ui/dist/themes/light.css';

// Import ELEVATE icons
import * as elevateIcons from '@inform-elevate/elevate-icons';

// Import ELEVATE IconRegistry and internal MDI icons that are already included
import { IconRegistry, iconRegistry } from '@inform-elevate/elevate-core-ui/dist/components/icon/icon-registry.js';
import { InternalIcons } from '@inform-elevate/elevate-core-ui/dist/components/icon/internal-icons.js';

// Import ALL MDI icons from @mdi/js (7,447+ icons)
import * as mdi from '@mdi/js';

// Helper function to create corrected icons with fill="white" for CSS masks
const createCorrectedIcon = (originalIcon: string) => {
  if (originalIcon.startsWith('data:image/svg+xml,')) {
    const decoded = decodeURIComponent(originalIcon.substring(originalIcon.indexOf(',') + 1));
    const corrected = decoded.replace(/fill="black"/g, 'fill="white"').replace(/fill="#000"/g, 'fill="white"');
    return `data:image/svg+xml,${encodeURIComponent(corrected)}`;
  }
  return originalIcon;
};

// Create MDI icon name mapper - converts kebab-case to camelCase for @mdi/js lookup
const createMdiNameMapper = () => {
  const nameMap = new Map<string, string>();
  
  // Get all available MDI icons and create name mappings
  Object.keys(mdi).forEach(mdiExportName => {
    if (mdiExportName.startsWith('mdi')) {
      // Convert mdiIconName to icon-name format
      const iconName = mdiExportName
        .replace(/^mdi/, '') // Remove 'mdi' prefix
        .replace(/([A-Z])/g, '-$1') // Add hyphens before capital letters
        .toLowerCase() // Convert to lowercase
        .replace(/^-/, ''); // Remove leading hyphen
      
      nameMap.set(iconName, mdiExportName);
    }
  });
  
  return nameMap;
};

// Create the name mapper
const mdiNameMap = createMdiNameMapper();

// SSR-safe icon registration - only run in browser
if (typeof window !== 'undefined') {
  try {
    // Get the icon registry instance (try both imports)
    const registry = IconRegistry || iconRegistry;

    // Check if registry has the expected API
    if (registry && typeof registry.registerIcons === 'function') {
      // Register ELEVATE icons with corrected fill colors
      registry.registerIcons({
        'home': createCorrectedIcon(elevateIcons.elvtHome),
        'check': createCorrectedIcon(elevateIcons.elvtCheck),
        'cancel': createCorrectedIcon(elevateIcons.elvtCancel),
        'chevron-right': createCorrectedIcon(elevateIcons.elvtChevronRight)
      });
      console.log('🚀 ELEVATE icons registered successfully');
    }

    // Try to register MDI icons if registerResolver exists
    if (registry && typeof registry.registerResolver === 'function') {
      registry.registerResolver('mdi', (iconName: string) => {
        // Try direct lookup first (for exact matches like 'settings', 'home')
        let mdiExportName = `mdi${iconName.charAt(0).toUpperCase()}${iconName.slice(1).replace(/-([a-z])/g, (_, letter) => letter.toUpperCase())}`;
        let pathData = (mdi as any)[mdiExportName];

        // If not found, try the name mapper
        if (!pathData && mdiNameMap.has(iconName)) {
          mdiExportName = mdiNameMap.get(iconName)!;
          pathData = (mdi as any)[mdiExportName];
        }

        if (pathData) {
          // Return properly formatted SVG data URL with white fill for CSS masking
          return `data:image/svg+xml,${encodeURIComponent(
            `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="${pathData}" fill="white"/>
            </svg>`
          )}`;
        }

        return null;
      });
      console.log('🚀 MDI icon resolver registered successfully');
    } else {
      console.log('⚠️ IconRegistry.registerResolver not available in this version', { registry, IconRegistry, iconRegistry });
    }
  } catch (error) {
    console.warn('Icon registration failed:', error);
  }
}

// Import framework context
import { FrameworkProvider } from '../contexts/FrameworkContext';

export default function Root({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Only run in browser environment
    if (typeof window === 'undefined') return;

    try {
      // Set Shoelace base path for icons and assets
      setBasePath('/node_modules/@shoelace-style/shoelace/dist/');
      console.log('✅ Root setup complete');
    } catch (error) {
      console.warn('Root setup warning:', error);
    }

    // Apply theme classes to ELEVATE components when theme changes
    const applyThemeToComponents = () => {
      const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
      const themeClass = isDark ? 'elvt-theme-dark' : 'elvt-theme-light';
      
      // Apply theme class to all ELEVATE components
      const elevateComponents = document.querySelectorAll('[class*="elvt-"], elvt-card, elvt-button, elvt-input, elvt-stack');
      elevateComponents.forEach((component) => {
        // Remove existing theme classes
        component.classList.remove('elvt-theme-light', 'elvt-theme-dark');
        // Add current theme class
        component.classList.add(themeClass);
        
        // No manual style forcing needed - ELEVATE tokens handle this automatically
      });
      
      console.log(`Applied ${themeClass} to ${elevateComponents.length} ELEVATE components`);
    };

    // Apply theme classes immediately
    applyThemeToComponents();

    // Watch for theme changes
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'attributes' && mutation.attributeName === 'data-theme') {
          // Apply theme classes to components
          applyThemeToComponents();
          
          // Trigger a reflow to ensure CSS variables are picked up by shadow DOM
          document.body.offsetHeight; // Force reflow
          
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
            const elevateComponents = element.querySelectorAll?.('[class*="elvt-"], elvt-card, elvt-button, elvt-input, elvt-stack');
            if (elevateComponents?.length > 0) {
              applyThemeToComponents();
            }
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