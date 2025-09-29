// ELEVATE Icon Registration Script - PROPER RESOLVER APPROACH
// This registers a proper icon resolver with ELEVATE's registry system
// to prevent blob URL 404 errors on GitHub Pages

console.log('🚀 ELEVATE Icon Registration Starting...');

// Function to register icons using proper ELEVATE resolver API
async function registerElevateIcons() {
  try {
    // Import ELEVATE components
    await import('https://unpkg.com/@inform-elevate/elevate-core-ui@latest/dist/elevate.js');
    console.log('✅ ELEVATE components imported');

    // Import MDI icons
    const mdi = await import('https://unpkg.com/@mdi/js@latest');
    console.log('✅ MDI icons imported');

    // Wait for elvt-icon to be defined
    await customElements.whenDefined('elvt-icon');
    console.log('✅ elvt-icon ready');

    // Define icon data mapping
    const iconMap = {
      'mdi:plus': mdi.mdiPlus,
      'mdi:download': mdi.mdiDownload,
      'mdi:delete': mdi.mdiDelete,
      'mdi:chevron-right': mdi.mdiChevronRight,
      'mdi:chevron-down': mdi.mdiChevronDown,
      'mdi:open-in-new': mdi.mdiOpenInNew,
      'mdi:pencil': mdi.mdiPencil,
      'mdi:dots-vertical': mdi.mdiDotsVertical,
    };

    // Register proper icon resolver with ELEVATE
    if (window.ElevateUI && window.ElevateUI.registerIconLibrary) {
      console.log('🔧 Registering ELEVATE icon resolver...');

      window.ElevateUI.registerIconLibrary('mdi', {
        resolver: (iconName) => {
          const pathData = iconMap[iconName];
          if (pathData) {
            const svgContent = `<svg viewBox="0 0 24 24" fill="currentColor"><path d="${pathData}"/></svg>`;
            console.log(`✅ Resolved icon: ${iconName}`);
            return `data:image/svg+xml,${encodeURIComponent(svgContent)}`;
          }
          console.warn(`❌ Unknown icon: ${iconName}`);
          return null;
        },
      });

      console.log('🎉 ELEVATE icon resolver registered!');
    } else {
      console.warn('⚠️ ElevateUI.registerIconLibrary not available, falling back to manual update');

      // Fallback: Manual icon update approach
      const updateIcons = () => {
        const iconElements = document.querySelectorAll('elvt-icon[icon^="mdi:"]');
        console.log(`🔍 Found ${iconElements.length} elvt-icon elements`);

        iconElements.forEach(iconEl => {
          const iconName = iconEl.getAttribute('icon');
          const pathData = iconMap[iconName];

          if (pathData) {
            const svgContent = `<svg viewBox="0 0 24 24" fill="currentColor"><path d="${pathData}"/></svg>`;

            // Force update the icon content
            if (iconEl.src) {
              iconEl.src = `data:image/svg+xml,${encodeURIComponent(svgContent)}`;
            } else {
              iconEl.innerHTML = svgContent;
            }

            console.log(`✅ Set icon: ${iconName}`);
          } else {
            console.warn(`❌ Unknown icon: ${iconName}`);
          }
        });
      };

      // Update icons immediately and on DOM changes
      updateIcons();
      const observer = new MutationObserver(() => setTimeout(updateIcons, 100));
      observer.observe(document.body, { childList: true, subtree: true });
    }

  } catch (error) {
    console.error('❌ ELEVATE icon registration failed:', error);
  }
}

// Start registration when DOM is ready - REACTIVATED
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', registerElevateIcons);
} else {
  registerElevateIcons();
}