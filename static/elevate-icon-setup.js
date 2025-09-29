// ELEVATE Icon Setup - Based on Storybook patterns
// This script sets up the MDI icon library resolver as shown in icon.stories.ts

console.log('🎯 ELEVATE Icon Setup - Registering MDI Library');

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
  'dots-vertical': 'M12,16A2,2 0 0,1 14,18A2,2 0 0,1 12,20A2,2 0 0,1 10,18A2,2 0 0,1 12,16M12,10A2,2 0 0,1 14,12A2,2 0 0,1 12,14A2,2 0 0,1 10,12A2,2 0 0,1 12,10M12,4A2,2 0 0,1 14,6A2,2 0 0,1 12,8A2,2 0 0,1 10,6A2,2 0 0,1 12,4Z'
};

// Create MDI resolver function (matches Storybook RegistryResolver pattern)
function createMDIResolver() {
  return (name) => {
    console.log(`🔍 MDI Resolver called for: "${name}"`);
    const pathData = MDI_ICONS[name];
    if (pathData) {
      // Return as IconDetail object (matches Storybook pattern)
      const iconDetail = {
        path: pathData,
        width: 24,
        height: 24
      };
      console.log(`✅ MDI resolved "${name}" ->`, iconDetail);
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
      console.log('⏳ Waiting for ELEVATE elvt-icon component...');
      return false;
    }

    // Find the global icon registry
    const testIcon = document.querySelector('elvt-icon');
    if (!testIcon) {
      console.log('⏳ Waiting for first elvt-icon element...');
      return false;
    }

    // Access the global icon registry
    if (!testIcon.registry) {
      console.log('⏳ Waiting for icon registry...');
      return false;
    }

    console.log('🎯 Found ELEVATE icon registry, setting up MDI resolver...');

    try {
      // Register MDI resolver (matches Storybook pattern)
      testIcon.registry.registerResolver('mdi', createMDIResolver());
      console.log('🎉 MDI resolver registered successfully!');

      // Log registry status
      const iconElements = document.querySelectorAll('elvt-icon[icon^="mdi:"]');
      console.log(`📊 Found ${iconElements.length} MDI icons to resolve`);

      // Force refresh existing icons after registration
      setTimeout(() => {
        const iconsToRefresh = document.querySelectorAll('elvt-icon[icon^="mdi:"]');
        console.log(`🔄 Manually refreshing ${iconsToRefresh.length} icons after resolver registration`);

        iconsToRefresh.forEach((icon, index) => {
          const iconName = icon.getAttribute('icon');
          console.log(`🔄 Refreshing icon ${index + 1}: "${iconName}"`);

          // Force re-render by temporarily changing and restoring the attribute
          const originalIcon = iconName;
          icon.setAttribute('icon', '');
          setTimeout(() => {
            icon.setAttribute('icon', originalIcon);
            console.log(`♻️ Restored icon: "${originalIcon}"`);

            // Enhanced Shadow DOM debugging - check immediately after resolution
            setTimeout(() => {
              console.log(`🔍 DETAILED SHADOW DOM ANALYSIS for "${originalIcon}"`);

              if (icon.shadowRoot) {
                const shadowHTML = icon.shadowRoot.innerHTML;
                const svgElements = icon.shadowRoot.querySelectorAll('svg');
                const pathElements = icon.shadowRoot.querySelectorAll('path');
                const allElements = icon.shadowRoot.querySelectorAll('*');

                console.log(`📊 Shadow DOM Stats:`);
                console.log(`   - HTML length: ${shadowHTML.length} characters`);
                console.log(`   - Total elements: ${allElements.length}`);
                console.log(`   - SVG elements: ${svgElements.length}`);
                console.log(`   - Path elements: ${pathElements.length}`);

                if (shadowHTML.length > 0) {
                  console.log(`📄 Full Shadow DOM Content:`);
                  console.log(shadowHTML);
                }

                if (svgElements.length > 0) {
                  svgElements.forEach((svg, i) => {
                    console.log(`🎨 SVG ${i + 1} details:`);
                    console.log(`   - Outer HTML: ${svg.outerHTML}`);
                    console.log(`   - Computed styles:`, window.getComputedStyle(svg));
                    console.log(`   - Visibility: ${window.getComputedStyle(svg).visibility}`);
                    console.log(`   - Display: ${window.getComputedStyle(svg).display}`);
                    console.log(`   - Width: ${window.getComputedStyle(svg).width}`);
                    console.log(`   - Height: ${window.getComputedStyle(svg).height}`);
                  });
                } else {
                  console.warn(`⚠️ No SVG found in shadow DOM for "${originalIcon}"`);
                  console.warn(`⚠️ This suggests the IconDetail is not being converted to SVG`);
                }
              } else {
                console.warn(`⚠️ No shadow root found for "${originalIcon}"`);
              }

              // Also check the icon element itself
              console.log(`🔍 Icon element analysis:`);
              console.log(`   - Tag name: ${icon.tagName}`);
              console.log(`   - Icon attribute: ${icon.getAttribute('icon')}`);
              console.log(`   - All attributes:`, Array.from(icon.attributes).map(attr => `${attr.name}="${attr.value}"`));
              console.log(`   - Computed styles:`, window.getComputedStyle(icon));
              console.log(`   - Is connected: ${icon.isConnected}`);
              console.log(`   - ClientWidth: ${icon.clientWidth}px`);
              console.log(`   - ClientHeight: ${icon.clientHeight}px`);
            }, 200);
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
      console.log('✅ ELEVATE MDI icon setup completed successfully');
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
      console.log(`🧪 Registry methods:`, Object.getOwnPropertyNames(testIcon.registry));

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
      console.log(`🔄 Processing: ${originalIcon}`);

      // Try different refresh strategies
      icon.setAttribute('icon', '');
      setTimeout(() => {
        icon.setAttribute('icon', originalIcon);
        console.log(`♻️ Restored: ${originalIcon}`);
      }, 50 * (index + 1));
    });
  }
};