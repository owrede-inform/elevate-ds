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
  useEffect(() => {
    // Only run in browser environment
    if (typeof window === 'undefined') return;

    // Initialize ELEVATE components asynchronously
    const initializeElevate = async () => {
      try {
        // Import basic utilities first
        const { setBasePath } = await import('@shoelace-style/shoelace/dist/utilities/base-path.js');

        // Set Shoelace base path for icons and assets
        setBasePath('/node_modules/@shoelace-style/shoelace/dist/');

        // Try importing ELEVATE packages using specific export paths that work
        let IconRegistry = null;
        let iconRegistry = null;
        let mdi = null;

        try {
          // Import icon registry from specific path
          const registryModule = await import('@inform-elevate/elevate-core-ui/dist/components/icon/icon-registry.js');
          IconRegistry = registryModule.IconRegistry;
          iconRegistry = registryModule.iconRegistry;
          console.log('✅ ELEVATE icon registry imported successfully');
        } catch (error) {
          console.warn('ELEVATE icon registry import failed:', error);
        }

        try {
          // Import MDI icons
          const mdiModule = await import('@mdi/js');
          mdi = mdiModule.default || mdiModule;
          console.log('✅ MDI icons imported successfully');
        } catch (error) {
          console.warn('MDI icons import failed:', error);
        }

        // Try importing ELEVATE styles using specific paths
        try {
          await Promise.all([
            import('@inform-elevate/elevate-core-ui/dist/elevate.css').catch(e => console.warn('ELEVATE CSS import failed:', e)),
            import('@inform-elevate/elevate-core-ui/dist/themes/light.css').catch(e => console.warn('ELEVATE theme CSS import failed:', e))
          ]);
          console.log('✅ ELEVATE styles imported successfully');
        } catch (error) {
          console.warn('ELEVATE styles import failed:', error);
        }

        // Set up icon registry if available
        const registry = IconRegistry || iconRegistry;

        if (registry && mdi) {
          try {
            // Create MDI icon name mapper
            const createMdiNameMapper = () => {
              const nameMap = new Map<string, string>();
              Object.keys(mdi).forEach(mdiExportName => {
                if (mdiExportName.startsWith('mdi')) {
                  const iconName = mdiExportName
                    .replace(/^mdi/, '')
                    .replace(/([A-Z])/g, '-$1')
                    .toLowerCase()
                    .replace(/^-/, '');
                  nameMap.set(iconName, mdiExportName);
                }
              });
              return nameMap;
            };

            const mdiNameMap = createMdiNameMapper();

            // Register MDI icon resolver
            if (typeof registry.registerResolver === 'function') {
              registry.registerResolver('mdi', (iconName: string) => {
                let mdiExportName = `mdi${iconName.charAt(0).toUpperCase()}${iconName.slice(1).replace(/-([a-z])/g, (_, letter) => letter.toUpperCase())}`;
                let pathData = (mdi as any)[mdiExportName];

                if (!pathData && mdiNameMap.has(iconName)) {
                  mdiExportName = mdiNameMap.get(iconName)!;
                  pathData = (mdi as any)[mdiExportName];
                }

                if (pathData) {
                  return `data:image/svg+xml,${encodeURIComponent(
                    `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="${pathData}" fill="white"/>
                    </svg>`
                  )}`;
                }

                return null;
              });
              console.log('🚀 MDI icon resolver registered successfully');
            }
          } catch (error) {
            console.warn('Icon registration failed:', error);
          }
        } else {
          console.log('ℹ️ Icon registration skipped (registry or MDI not available)');
        }

        console.log('✅ ELEVATE Root setup complete');
      } catch (error) {
        console.warn('ELEVATE initialization warning:', error);
      }
    };

    // Initialize ELEVATE after a small delay to ensure Docusaurus is ready
    const timer = setTimeout(initializeElevate, 100);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // Only run in browser environment
    if (typeof window === 'undefined') return;

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

    // Handle sidebar margin for main wrapper
    const updateSidebarMargin = () => {
      const mainWrapper = document.querySelector('.main-wrapper');
      const sidebarContainer = document.querySelector('.theme-doc-sidebar-container');

      if (mainWrapper) {
        // Only apply margin if sidebar exists AND is positioned outside main content
        // In Docusaurus doc pages, sidebar is inside main wrapper, so no extra margin needed
        const isDocPage = document.querySelector('.docRoot_p297, .docMainContainer_bWxl');

        if (sidebarContainer && !isDocPage) {
          // Only for non-doc pages that have external sidebars
          mainWrapper.classList.add('with-sidebar');
        } else {
          // For doc pages or pages without sidebars, remove margin
          mainWrapper.classList.remove('with-sidebar');
        }
      }
    };

    // Apply sidebar margin immediately on page load
    updateSidebarMargin();

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
            // Check for sidebar changes (navigation between pages)
            if (element.classList?.contains('theme-doc-sidebar-container') ||
                element.classList?.contains('main-wrapper') ||
                element.querySelector?.('.theme-doc-sidebar-container') ||
                element.querySelector?.('.main-wrapper')) {
              updateSidebarMargin();
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