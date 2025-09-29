// ELEVATE Icon Registration Script - DEPRECATED
// This file is no longer needed since icon registration is handled in Root.tsx
// Keeping for reference but disabled to prevent console spam

// console.log('🚀 ELEVATE Icon Registration Starting...');

// Function to register icons properly
async function registerElevateIcons() {
  try {
    // console.log('📦 Importing ELEVATE components...');

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

    // Function to update icon elements
    const updateIcons = () => {
      const iconElements = document.querySelectorAll('elvt-icon[icon^="mdi:"]');
      console.log(`🔍 Found ${iconElements.length} elvt-icon elements`);

      iconElements.forEach(iconEl => {
        const iconName = iconEl.getAttribute('icon');
        const pathData = iconMap[iconName];

        if (pathData) {
          const svgContent = `<svg viewBox="0 0 24 24" fill="currentColor"><path d="${pathData}"/></svg>`;

          // Try to set the icon data directly
          if (iconEl.src) {
            iconEl.src = `data:image/svg+xml,${encodeURIComponent(svgContent)}`;
          } else if (iconEl.innerHTML !== undefined) {
            iconEl.innerHTML = svgContent;
          }

          console.log(`✅ Set icon: ${iconName}`);
        } else {
          console.warn(`❌ Unknown icon: ${iconName}`);
        }
      });
    };

    // Update icons immediately
    updateIcons();

    // Update icons when DOM changes
    const observer = new MutationObserver(() => {
      setTimeout(updateIcons, 100);
    });
    observer.observe(document.body, { childList: true, subtree: true });

    console.log('🎉 ELEVATE icon registration complete!');

  } catch (error) {
    console.error('❌ ELEVATE icon registration failed:', error);
  }
}

// Start registration when DOM is ready - DISABLED
// if (document.readyState === 'loading') {
//   document.addEventListener('DOMContentLoaded', registerElevateIcons);
// } else {
//   registerElevateIcons();
// }