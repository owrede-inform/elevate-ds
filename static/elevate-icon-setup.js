// ELEVATE Icon Setup - Based on Storybook patterns
// This script sets up the MDI icon library resolver as shown in icon.stories.ts

// console.log('🎯 ELEVATE Icon Setup - Registering MDI Library');

// Icon paths from Material Design Icons
// Based on icon.stories.ts import patterns
const MDI_ICONS = {
  'plus': 'M19,13H13V19H11V13H5V11H11V5H13V11H19V13Z',
  'download': 'M5,20H19V18H5M19,9H15L13,7H9V9H5C3.89,9 3,9.89 3,11V17A2,2 0 0,0 5,19H9C9.83,19 10.54,18.5 10.84,17.82L12,15L13.16,17.82C13.46,18.5 14.17,19 15,19H19A2,2 0 0,0 21,17V11C21,9.89 20.11,9 19,9Z',
  'delete': 'M19,4H15.5L14.5,3H9.5L8.5,4H5V6H19M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19Z',
  'chevron-right': 'M8.59,16.58L13.17,12L8.59,7.41L10,6L16,12L10,18L8.59,16.58Z',
  'chevron-down': 'M7.41,8.58L12,13.17L16.59,8.58L18,10L12,16L6,10L7.41,8.58Z',
  'open-in-new': 'M14,3V5H17.59L7.76,14.83L9.17,16.24L19,6.41V10H21V3M19,19H5V5H12V3H5C3.89,3 3,3.9 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V12H19V19Z',
  'pencil': 'M20.71,7.04C21.1,6.65 21.1,6 20.71,5.63L18.37,3.29C18,2.9 17.35,2.9 16.96,3.29L15.12,5.12L18.87,8.87M3,17.25V21H6.75L17.81,9.93L14.06,6.18L3,17.25Z',
  'dots-vertical': 'M12,16A2,2 0 0,1 14,18A2,2 0 0,1 12,20A2,2 0 0,1 10,18A2,2 0 0,1 12,16M12,10A2,2 0 0,1 14,12A2,2 0 0,1 12,14A2,2 0 0,1 10,12A2,2 0 0,1 12,10M12,4A2,2 0 0,1 14,6A2,2 0 0,1 12,8A2,2 0 0,1 10,6A2,2 0 0,1 12,4Z',
  // File dropzone icons
  'cloud-upload-outline': 'M14,14H10V20H14V14M12,13L16,17H13V23H11V17H8L12,13M19.35,10.04C18.67,6.59 15.64,4 12,4C9.11,4 6.6,5.64 5.35,8.04C2.34,8.36 0,10.91 0,14A6,6 0 0,0 6,20V18A4,4 0 0,1 2,14C2,11.95 3.53,10.24 5.56,10.03C6.24,7.64 8.79,6 11.99,6C14.73,6 17.06,7.66 17.56,10.03C19.53,10.24 21,11.95 21,14A4,4 0 0,1 17,18V20A6,6 0 0,0 23,14C23,10.91 20.66,8.36 17.65,8.04L19.35,10.04Z',
  'cloud-upload': 'M14,14H10V20H14V14M12,13L16,17H13V23H11V17H8L12,13M19.35,10.04C18.67,6.59 15.64,4 12,4C9.11,4 6.6,5.64 5.35,8.04C2.34,8.36 0,10.91 0,14C0,17.31 2.69,20 6,20V18C3.79,18 2,16.21 2,14C2,11.95 3.53,10.24 5.56,10.03C6.24,7.64 8.79,6 11.99,6C14.73,6 17.06,7.66 17.56,10.03C19.47,10.24 21,11.95 21,14C21,16.21 19.21,18 17,18V20C20.31,20 23,17.31 23,14C23,10.91 20.66,8.36 17.65,8.04L19.35,10.04Z',
  'target': 'M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20A8,8 0 0,0 20,12A8,8 0 0,0 12,4M12,6A6,6 0 0,1 18,12A6,6 0 0,1 12,18A6,6 0 0,1 6,12A6,6 0 0,1 12,6M12,8A4,4 0 0,0 8,12A4,4 0 0,0 12,16A4,4 0 0,0 16,12A4,4 0 0,0 12,8M12,10A2,2 0 0,1 14,12A2,2 0 0,1 12,14A2,2 0 0,1 10,12A2,2 0 0,1 12,10Z',
  'alert-circle-outline': 'M11,15H13V17H11V15M11,7H13V13H11V7M12,2C6.47,2 2,6.5 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4A8,8 0 0,1 20,12A8,8 0 0,1 12,20Z',
  'cloud-off-outline': 'M21.8,13C21.86,12.69 21.9,12.37 21.9,12.04C21.9,9.9 20.85,8.07 19.17,6.96L20.59,5.54L22,7L20.59,8.41L22,9.82L20.59,11.23L22,12.64L20.59,14.05L19.17,12.63C19.69,13.28 20,14.1 20,15C20,17.21 18.21,19 16,19H6.83L8.83,21H16C19.31,21 22,18.31 22,15C22,14.85 21.97,14.71 21.95,14.57C21.75,13.95 21.38,13.42 20.88,13.05L21.8,13M2.39,1.73L1.11,3L3.28,5.17C2.53,5.8 2,6.79 2,7.91C2,9.8 3.7,11.5 5.59,11.5H16.17L18.73,14.06C18.5,14.67 18.12,15.2 17.61,15.59L16,14H6C4.9,14 4,13.11 4,12S4.9,10 6,10H7.73L2.39,4.64V1.73M6,10A2,2 0 0,1 8,8V10H6M6,8A2,2 0 0,0 4,10H6V8Z',
  // Additional commonly used icons
  'file-document-outline': 'M6,2A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2H6M6,4H13V9H18V20H6V4Z',
  'image-multiple': 'M22,16V4A2,2 0 0,0 20,2H8A2,2 0 0,0 6,4V16A2,2 0 0,0 8,18H20A2,2 0 0,0 22,16M20,16H8V4H20V16M2,6V20A2,2 0 0,0 4,22H18V20H4V6H2M10,9L12.5,12.5L15,10L18,14H10L12.5,12.5Z',
  'table-large': 'M4,3H20A1,1 0 0,1 21,4V20A1,1 0 0,1 20,21H4A1,1 0 0,1 3,20V4A1,1 0 0,1 4,3M5,5V19H19V5H5M7,7H9V9H7V7M11,7H13V9H11V7M15,7H17V9H15V7M7,11H9V13H7V11M11,11H13V13H11V11M15,11H17V13H15V11M7,15H9V17H7V15M11,15H13V17H11V15M15,15H17V17H15V15Z',
  'check-circle': 'M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M11,16.5L18,9.5L16.59,8.09L11,13.67L7.41,10.09L6,11.5L11,16.5Z',
  'folder-upload': 'M10,4H4C2.89,4 2,4.89 2,6V18A2,2 0 0,0 4,20H20A2,2 0 0,0 22,18V8C22,6.89 21.1,6 20,6H12L10,4M14,13H16V9H18L15,6L12,9H14V13Z',
  'folder-outline': 'M10,4H4C2.89,4 2,4.89 2,6V18A2,2 0 0,0 4,20H20A2,2 0 0,0 22,18V8C22,6.89 21.1,6 20,6H12L10,4M4,6H10L12,8H20V18H4V6Z',
  'file-outline': 'M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z',
  'help-circle-outline': 'M11,18H13V16H11V18M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,20C7.59,20 4,16.41 4,12C4,7.59 7.59,4 12,4C16.41,4 20,7.59 20,12C20,16.41 16.41,20 12,20M12,6A4,4 0 0,0 8,10H10A2,2 0 0,1 12,8A2,2 0 0,1 14,10C14,12 11,11.75 11,15H13C13,12.75 16,12.5 16,10A4,4 0 0,0 12,6Z',
  'file-question-outline': 'M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20M13,12H12V14H13V12M13,15H12A3,3 0 0,1 9,12A3,3 0 0,1 12,9A3,3 0 0,1 15,12C15,13 14,13.5 13,15Z'
};

// Create MDI resolver function (matches Storybook RegistryResolver pattern)
function createMDIResolver() {
  return (name) => {
    // console.log(`🔍 MDI Resolver called for: "${name}"`);
    const pathData = MDI_ICONS[name];
    if (pathData) {
      // Return as IconDetail object (matches Storybook pattern)
      const iconDetail = {
        path: pathData,
        width: 24,
        height: 24
      };
      // console.log(`✅ MDI resolved "${name}" ->`, iconDetail);
      return iconDetail;
    }
    console.warn(`❌ MDI icon not found: "${name}" - Available icons:`, Object.keys(MDI_ICONS));
    return undefined;
  };
}

// Setup icon registry (matches Storybook RegistryResolver story pattern)
function setupMDIRegistry() {
  // Wait for ELEVATE to load
  const checkElevate = () => {
    if (!window.customElements || !window.customElements.get('elvt-icon')) {
      // console.log('⏳ Waiting for ELEVATE elvt-icon component...');
      return false;
    }

    // Find the global icon registry
    const testIcon = document.querySelector('elvt-icon');
    if (!testIcon) {
      // console.log('⏳ Waiting for first elvt-icon element...');
      return false;
    }

    // Access the global icon registry
    if (!testIcon.registry) {
      // console.log('⏳ Waiting for icon registry...');
      return false;
    }

    // console.log('🎯 Found ELEVATE icon registry, setting up MDI resolver...');

    try {
      // Register MDI resolver (matches Storybook pattern)
      testIcon.registry.registerResolver('mdi', createMDIResolver());
      console.log('✅ ELEVATE MDI icon resolver registered successfully');

      // Force refresh existing icons after registration
      setTimeout(() => {
        const iconsToRefresh = document.querySelectorAll('elvt-icon[icon^="mdi:"]');
        // console.log(`🔄 Manually refreshing ${iconsToRefresh.length} icons after resolver registration`);

        iconsToRefresh.forEach((icon, index) => {
          const iconName = icon.getAttribute('icon');
          // console.log(`🔄 Refreshing icon ${index + 1}: "${iconName}"`);

          // Force re-render by temporarily changing and restoring the attribute
          const originalIcon = iconName;
          icon.setAttribute('icon', '');
          setTimeout(() => {
            icon.setAttribute('icon', originalIcon);
            // console.log(`♻️ Restored icon: "${originalIcon}"`);

            // Icons refresh automatically after resolver registration
          }, 10 * (index + 1));
        });
      }, 500);

      return true;
    } catch (error) {
      console.error('❌ Failed to register MDI resolver:', error);
      return false;
    }
  };

  // Try to set up the registry
  let attempts = 0;
  const maxAttempts = 50; // 5 seconds max

  const trySetup = () => {
    attempts++;

    if (checkElevate()) {
      // console.log('✅ ELEVATE MDI icon setup completed successfully');
      return;
    }

    if (attempts >= maxAttempts) {
      console.warn('⚠️ ELEVATE MDI icon setup timeout - icons may not display');
      return;
    }

    setTimeout(trySetup, 100);
  };

  trySetup();
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', setupMDIRegistry);
} else {
  setupMDIRegistry();
}

// Debug helpers for console testing
window.elevateIconDebug = {
  mdiIcons: MDI_ICONS,
  createResolver: createMDIResolver,
  setupRegistry: setupMDIRegistry,

  // Test the resolver directly
  testResolver: (iconName) => {
    const resolver = createMDIResolver();
    console.log(`🧪 Testing resolver for "${iconName}"`);
    const result = resolver(iconName);
    console.log(`🧪 Resolver returned:`, result);
    return result;
  },

  // Test the registry directly
  testRegistry: () => {
    const testIcon = document.querySelector('elvt-icon');
    if (testIcon && testIcon.registry) {
      console.log(`🧪 Registry object:`, testIcon.registry);
      // console.log(`🧪 Registry methods:`, Object.getOwnPropertyNames(testIcon.registry));

      // Test if the resolver is properly registered
      try {
        const resolver = testIcon.registry.getResolver('mdi');
        console.log(`🧪 Retrieved MDI resolver:`, resolver);
        if (resolver) {
          const testResult = resolver('plus');
          console.log(`🧪 Direct resolver test result:`, testResult);
        }
      } catch (error) {
        console.log(`🧪 Error getting resolver:`, error);
      }
    } else {
      console.warn(`🧪 No icon registry found`);
    }
  },

  // Force re-process all icons
  forceRefresh: () => {
    const icons = document.querySelectorAll('elvt-icon[icon^="mdi:"]');
    console.log(`🔄 Force refreshing ${icons.length} icons`);
    icons.forEach((icon, index) => {
      const originalIcon = icon.getAttribute('icon');
      // console.log(`🔄 Processing: ${originalIcon}`);

      // Try different refresh strategies
      icon.setAttribute('icon', '');
      setTimeout(() => {
        icon.setAttribute('icon', originalIcon);
        // console.log(`♻️ Restored: ${originalIcon}`);
      }, 50 * (index + 1));
    });
  }
};