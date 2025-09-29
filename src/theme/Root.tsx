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

    // Initialize ELEVATE components asynchronously - browser-only
    const initializeElevate = async () => {
      // console.log('🔧 Starting ELEVATE initialization...');
      try {
        // Import ELEVATE Core UI components first to register web components
        // console.log('📦 Attempting ELEVATE Core UI import...');
        let elevateModule: any;
        try {
          // Use webpack magic comment for better chunk handling
          elevateModule = await import(
            /* webpackChunkName: "elevate-core-ui" */
            /* webpackMode: "lazy" */
            '@inform-elevate/elevate-core-ui'
          );
          // console.log('✅ ELEVATE Core UI components imported successfully', elevateModule);
        } catch (error) {
          console.error('❌ ELEVATE Core UI import failed:', error);
          // Don't throw in SSR/build environment, gracefully degrade
          if (typeof window !== 'undefined') {
            console.warn('🚨 ELEVATE icons will not work without elevate-core-ui');
          }
          return; // Exit early if core UI can't load
        }

        // Wait a moment for components to register
        // console.log('⏳ Waiting for component registration...');
        await new Promise(resolve => setTimeout(resolve, 500)); // Increased timeout
        // console.log('✅ Component registration wait complete');

        // Import ELEVATE icons - this is needed for MDI icon support
        let elevateIconsModule: any;
        try {
          // console.log('📦 Importing ELEVATE icons package...');
          elevateIconsModule = await import(
            /* webpackChunkName: "elevate-icons" */
            /* webpackMode: "lazy" */
            '@inform-elevate/elevate-icons'
          );
          // console.log('✅ ELEVATE icons imported successfully', elevateIconsModule);
        } catch (error) {
          console.error('❌ ELEVATE icons import failed:', error);
          // Non-critical error - icons can still work without this package
        }

        // Set up MDI icon resolver
        try {
          // Import MDI icons
          const mdi = await import(
            /* webpackChunkName: "mdi-icons" */
            /* webpackMode: "lazy" */
            '@mdi/js'
          );

          // Use the global iconRegistry from ELEVATE Core UI
          const globalIconRegistry = elevateModule.iconRegistry;
          if (globalIconRegistry && typeof globalIconRegistry.registerResolver === 'function') {
            // Register MDI resolver
            globalIconRegistry.registerResolver('mdi', (name: string) => {
              // Convert mdi:plus to mdiPlus format
              const mdiExportName = `mdi${name.charAt(0).toUpperCase()}${name.slice(1).replace(/-([a-z])/g, (_, letter) => letter.toUpperCase())}`;
              const iconData = (mdi as any)[mdiExportName];

              if (iconData) {
                // CRITICAL: Wrap path data in proper SVG structure
                const svgData = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="${iconData}" /></svg>`;
                return {
                  svg: svgData,
                  width: 24,
                  height: 24
                };
              }
              return undefined;
            });

            // Make registry globally available
            (window as any).iconRegistry = globalIconRegistry;
            // Note: elevateModule.iconRegistry is read-only, so we only use window.iconRegistry

            // CRITICAL: Prevent registry loss through property override
            const ensureRegistryPersistence = () => {
              const iconElements = document.querySelectorAll('elvt-icon');
              iconElements.forEach((iconEl: any) => {
                // Override registry property to prevent loss during DOM manipulation
                if (!iconEl._registryOverridden) {
                  Object.defineProperty(iconEl, 'registry', {
                    get: () => globalIconRegistry,
                    set: () => {}, // Ignore attempts to overwrite
                    enumerable: true,
                    configurable: false
                  });
                  iconEl._registryOverridden = true;

                  // Trigger re-render if icon already set
                  if (iconEl.icon) {
                    const currentIcon = iconEl.icon;
                    iconEl.icon = '';
                    setTimeout(() => {
                      iconEl.icon = currentIcon;
                      if (typeof iconEl.requestUpdate === 'function') {
                        iconEl.requestUpdate();
                      }
                    }, 10);
                  }
                }
              });
            };

            // Apply immediately and watch for new icons
            ensureRegistryPersistence();

            const iconObserver = new MutationObserver(() => {
              ensureRegistryPersistence();
            });

            iconObserver.observe(document.body, {
              childList: true,
              subtree: true
            });

            console.log('✅ ELEVATE MDI icon resolver setup complete');
          }
        } catch (error) {
          console.error('❌ Error setting up MDI resolver:', error);
        }

        // Debug: Check if elvt-icon is registered
        // const elvtIconDefined = !!window.customElements.get('elvt-icon');
        // console.log('🔍 elvt-icon custom element defined:', elvtIconDefined);

        // Check if we have global icon registry
        // console.log('🔍 Window.IconRegistry available:', !!(window as any).IconRegistry);
        // console.log('🔍 Window.iconRegistry available:', !!(window as any).iconRegistry);

        // console.log('✅ ELEVATE Root setup complete');

        // CRITICAL: Apply theme classes immediately after ELEVATE initialization
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

          // Theme classes applied - no forced reflow needed

          // console.log(`🎨 IMMEDIATE THEME APPLICATION: Applied ${themeClass} to ${elevateComponents.length} ELEVATE components`);
        }, 50);

      } catch (error) {
        console.error('❌ ELEVATE initialization failed:', error);
        console.error('❌ Error details:', {
          name: error.name,
          message: error.message,
          stack: error.stack
        });
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