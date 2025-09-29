// ELEVATE Icon Registration Script - WORKS WITH ROOT.TSX INITIALIZATION
// This script works alongside Root.tsx ELEVATE initialization
// Only handles icon resolver registration, does not load ELEVATE components

console.log('🚀 ELEVATE Icon Registration Starting (compatible with Root.tsx)...');

// Enhanced icon map with all required icons
const ICON_MAP = {
  'mdi:plus': 'M19,13H13V19H11V13H5V11H11V5H13V11H19V13Z',
  'mdi:download': 'M5,20H19V18H5M19,9H15L13,7H9V9H5C3.89,9 3,9.89 3,11V17A2,2 0 0,0 5,19H9C9.83,19 10.54,18.5 10.84,17.82L12,15L13.16,17.82C13.46,18.5 14.17,19 15,19H19A2,2 0 0,0 21,17V11C21,9.89 20.11,9 19,9Z',
  'mdi:delete': 'M19,4H15.5L14.5,3H9.5L8.5,4H5V6H19M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19Z',
  'mdi:chevron-right': 'M8.59,16.58L13.17,12L8.59,7.41L10,6L16,12L10,18L8.59,16.58Z',
  'mdi:chevron-down': 'M7.41,8.58L12,13.17L16.59,8.58L18,10L12,16L6,10L7.41,8.58Z',
  'mdi:open-in-new': 'M14,3V5H17.59L7.76,14.83L9.17,16.24L19,6.41V10H21V3M19,19H5V5H12V3H5C3.89,3 3,3.9 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V12H19V19Z',
  'mdi:pencil': 'M20.71,7.04C21.1,6.65 21.1,6 20.71,5.63L18.37,3.29C18,2.9 17.35,2.9 16.96,3.29L15.12,5.12L18.87,8.87M3,17.25V21H6.75L17.81,9.93L14.06,6.18L3,17.25Z',
  'mdi:dots-vertical': 'M12,16A2,2 0 0,1 14,18A2,2 0 0,1 12,20A2,2 0 0,1 10,18A2,2 0 0,1 12,16M12,10A2,2 0 0,1 14,12A2,2 0 0,1 12,14A2,2 0 0,1 10,12A2,2 0 0,1 12,10M12,4A2,2 0 0,1 14,6A2,2 0 0,1 12,8A2,2 0 0,1 10,6A2,2 0 0,1 12,4Z',
};

// Create resolver function using local icon data
function createIconResolver() {
  return (iconName) => {
    const pathData = ICON_MAP[iconName];
    if (pathData) {
      const svgContent = `<svg viewBox="0 0 24 24" fill="currentColor"><path d="${pathData}"/></svg>`;
      console.log(`✅ Resolved icon: ${iconName}`);
      return `data:image/svg+xml,${encodeURIComponent(svgContent)}`;
    }
    console.warn(`❌ Unknown icon: ${iconName}`);
    return null;
  };
}

// Multi-stage registration with better timing
let registrationAttempts = 0;
const MAX_ATTEMPTS = 10;

async function attemptIconRegistration() {
  registrationAttempts++;

  try {
    console.log(`🔄 Registration attempt ${registrationAttempts}/${MAX_ATTEMPTS}`);

    // Check if ELEVATE is available
    if (!window.ElevateUI || typeof window.ElevateUI.registerIconLibrary !== 'function') {
      console.log('⏳ ElevateUI not ready yet...');

      if (registrationAttempts < MAX_ATTEMPTS) {
        setTimeout(attemptIconRegistration, 500 * registrationAttempts); // Exponential backoff
        return;
      } else {
        throw new Error('ElevateUI.registerIconLibrary not available after maximum attempts');
      }
    }

    // Register the icon library
    console.log('🔧 Registering ELEVATE icon resolver...');
    window.ElevateUI.registerIconLibrary('mdi', {
      resolver: createIconResolver(),
    });

    console.log('🎉 ELEVATE icon resolver registered successfully!');

    // Force refresh of any existing icons
    setTimeout(refreshExistingIcons, 100);

  } catch (error) {
    console.error(`❌ Icon registration attempt ${registrationAttempts} failed:`, error);

    if (registrationAttempts < MAX_ATTEMPTS) {
      setTimeout(attemptIconRegistration, 1000 * registrationAttempts);
    } else {
      console.warn('⚠️ Falling back to manual icon update approach');
      initFallbackIconHandler();
    }
  }
}

// Refresh existing icons after registration
function refreshExistingIcons() {
  const iconElements = document.querySelectorAll('elvt-icon[icon^="mdi:"]');
  console.log(`🔄 Refreshing ${iconElements.length} existing icons`);

  iconElements.forEach(iconEl => {
    // Force re-render by updating the icon attribute
    const iconName = iconEl.getAttribute('icon');
    iconEl.removeAttribute('icon');
    setTimeout(() => {
      iconEl.setAttribute('icon', iconName);
      console.log(`🔄 Refreshed icon: ${iconName}`);
    }, 10);
  });
}

// Fallback manual icon handler for when registerIconLibrary fails
function initFallbackIconHandler() {
  console.log('🛠️ Initializing fallback icon handler...');

  const updateIcons = () => {
    const iconElements = document.querySelectorAll('elvt-icon[icon^="mdi:"]');
    console.log(`🔍 Fallback: Found ${iconElements.length} elvt-icon elements`);

    iconElements.forEach(iconEl => {
      const iconName = iconEl.getAttribute('icon');
      const pathData = ICON_MAP[iconName];

      if (pathData && iconEl.shadowRoot) {
        // Update shadow DOM directly
        const svgContent = `<svg viewBox="0 0 24 24" fill="currentColor" style="width: 100%; height: 100%;"><path d="${pathData}"/></svg>`;

        // Clear existing content and add new SVG
        iconEl.shadowRoot.innerHTML = `
          <style>:host { display: inline-block; width: 1em; height: 1em; }</style>
          ${svgContent}
        `;

        console.log(`✅ Fallback updated icon: ${iconName}`);
      }
    });
  };

  // Update icons immediately and on DOM changes
  updateIcons();

  // Watch for new icons
  const observer = new MutationObserver(() => {
    setTimeout(updateIcons, 100);
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ['icon']
  });

  console.log('🎯 Fallback icon handler initialized');
}

// Initialize the icon system with proper timing
function initializeIconSystem() {
  console.log('🎬 Initializing ELEVATE icon system...');

  // Since ELEVATE is loaded via script tag, we need to wait for it to be available
  const checkElevateReady = () => {
    if (typeof customElements !== 'undefined' && window.ElevateUI) {
      console.log('✅ ELEVATE UI library detected');

      customElements.whenDefined('elvt-icon').then(() => {
        console.log('✅ elvt-icon element defined');

        // Additional wait for full initialization
        setTimeout(() => {
          attemptIconRegistration();
        }, 100);
      }).catch(error => {
        console.error('❌ Failed waiting for elvt-icon:', error);
        setTimeout(attemptIconRegistration, 2000);
      });
    } else {
      console.log('⏳ Waiting for ELEVATE UI library to load...');
      setTimeout(checkElevateReady, 200);
    }
  };

  checkElevateReady();
}

// Start the initialization process
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    setTimeout(initializeIconSystem, 500); // Allow some time for scripts to load
  });
} else {
  // DOM already loaded, but wait a bit for scripts
  setTimeout(initializeIconSystem, 500);
}

// Also listen for custom events that might indicate ELEVATE is ready
window.addEventListener('elevate-ready', () => {
  console.log('🎉 Received elevate-ready event');
  attemptIconRegistration();
});

// Debug helpers for console testing
window.elevateIconDebug = {
  registerIcons: attemptIconRegistration,
  refreshIcons: refreshExistingIcons,
  iconMap: ICON_MAP,
  createResolver: createIconResolver
};