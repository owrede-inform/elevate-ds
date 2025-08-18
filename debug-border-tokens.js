const { chromium } = require('playwright');

async function debugBorderTokens() {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  
  // Navigate to localhost (make sure dev server is running) - use a docs page to ensure sidebar is present
  await page.goto('http://localhost:3000/docs/home/get-started');
  
  console.log('=== LIGHT MODE ANALYSIS ===');
  
  // Wait for elements to load
  await page.waitForSelector('.navbar');
  
  // Get the computed values in light mode
  const lightModeValues = await page.evaluate(() => {
    const root = document.documentElement;
    const navbar = document.querySelector('.navbar');
    const sidebar = document.querySelector('.theme-doc-sidebar-container');
    
    if (!navbar) {
      console.log('Navbar not found');
      return null;
    }
    
    const computedRoot = getComputedStyle(root);
    const computedNavbar = getComputedStyle(navbar);
    const computedSidebar = sidebar ? getComputedStyle(sidebar) : null;
    
    return {
      // ELEVATE token values
      aliasLayoutBorderDefault: computedRoot.getPropertyValue('--elvt-alias-layout-border-default').trim(),
      aliasLayoutBorderMuted: computedRoot.getPropertyValue('--elvt-alias-layout-border-muted').trim(),
      // Primitive token values for reference
      primitiveGray300: computedRoot.getPropertyValue('--elvt-primitives-color-gray-300').trim(),
      primitiveGray400: computedRoot.getPropertyValue('--elvt-primitives-color-gray-400').trim(),
      
      // Actual computed border colors
      navbarBorderColor: computedNavbar.borderBottomColor,
      sidebarBorderColor: computedSidebar ? computedSidebar.borderRightColor : 'sidebar not found',
      
      // Check what CSS property is being used
      navbarBorderBottom: computedNavbar.borderBottom,
      sidebarBorderRight: computedSidebar ? computedSidebar.borderRight : 'sidebar not found'
    };
  });
  
  console.log('Light Mode Values:');
  console.log('--elvt-alias-layout-border-default:', lightModeValues.aliasLayoutBorderDefault);
  console.log('--elvt-alias-layout-border-muted:', lightModeValues.aliasLayoutBorderMuted);
  console.log('--elvt-primitives-color-gray-300:', lightModeValues.primitiveGray300);
  console.log('--elvt-primitives-color-gray-400:', lightModeValues.primitiveGray400);
  console.log('');
  console.log('Computed navbar border-bottom-color:', lightModeValues.navbarBorderColor);
  console.log('Computed sidebar border-right-color:', lightModeValues.sidebarBorderColor);
  console.log('Full navbar border-bottom:', lightModeValues.navbarBorderBottom);
  console.log('Full sidebar border-right:', lightModeValues.sidebarBorderRight);
  
  // Switch to dark mode
  await page.click('[class*="colorModeToggle"]');
  await page.waitForTimeout(500); // Wait for theme switch
  
  console.log('\n=== DARK MODE ANALYSIS ===');
  
  // Get the computed values in dark mode
  const darkModeValues = await page.evaluate(() => {
    const root = document.documentElement;
    const navbar = document.querySelector('.navbar');
    const sidebar = document.querySelector('.theme-doc-sidebar-container');
    
    const computedRoot = getComputedStyle(root);
    const computedNavbar = getComputedStyle(navbar);
    const computedSidebar = getComputedStyle(sidebar);
    
    return {
      // ELEVATE token values
      aliasLayoutBorderDefault: computedRoot.getPropertyValue('--elvt-alias-layout-border-default').trim(),
      aliasLayoutBorderMuted: computedRoot.getPropertyValue('--elvt-alias-layout-border-muted').trim(),
      // Primitive token values for reference
      primitiveGray300: computedRoot.getPropertyValue('--elvt-primitives-color-gray-300').trim(),
      primitiveGray600: computedRoot.getPropertyValue('--elvt-primitives-color-gray-600').trim(),
      primitiveGray700: computedRoot.getPropertyValue('--elvt-primitives-color-gray-700').trim(),
      
      // Actual computed border colors
      navbarBorderColor: computedNavbar.borderBottomColor,
      sidebarBorderColor: computedSidebar ? computedSidebar.borderRightColor : 'sidebar not found',
      
      // Check what CSS property is being used
      navbarBorderBottom: computedNavbar.borderBottom,
      sidebarBorderRight: computedSidebar ? computedSidebar.borderRight : 'sidebar not found'
    };
  });
  
  console.log('Dark Mode Values:');
  console.log('--elvt-alias-layout-border-default:', darkModeValues.aliasLayoutBorderDefault);
  console.log('--elvt-alias-layout-border-muted:', darkModeValues.aliasLayoutBorderMuted);
  console.log('--elvt-primitives-color-gray-300:', darkModeValues.primitiveGray300);
  console.log('--elvt-primitives-color-gray-600:', darkModeValues.primitiveGray600);
  console.log('--elvt-primitives-color-gray-700:', darkModeValues.primitiveGray700);
  console.log('');
  console.log('Computed navbar border-bottom-color:', darkModeValues.navbarBorderColor);
  console.log('Computed sidebar border-right-color:', darkModeValues.sidebarBorderColor);
  console.log('Full navbar border-bottom:', darkModeValues.navbarBorderBottom);
  console.log('Full sidebar border-right:', darkModeValues.sidebarBorderRight);
  
  // Also check what ELEVATE defines these tokens as by looking at all CSS custom properties
  console.log('\n=== ELEVATE TOKEN DEFINITION ANALYSIS ===');
  
  const tokenDefinitions = await page.evaluate(() => {
    const root = document.documentElement;
    const computedRoot = getComputedStyle(root);
    
    // Get all custom properties
    const allProperties = {};
    for (let i = 0; i < computedRoot.length; i++) {
      const prop = computedRoot.item(i);
      if (prop.startsWith('--elvt-')) {
        allProperties[prop] = computedRoot.getPropertyValue(prop).trim();
      }
    }
    
    return allProperties;
  });
  
  // Filter for border-related tokens
  const borderTokens = Object.entries(tokenDefinitions).filter(([key]) => 
    key.includes('border') || key.includes('gray')
  );
  
  console.log('ELEVATE Border and Gray Tokens:');
  borderTokens.forEach(([token, value]) => {
    console.log(`${token}: ${value}`);
  });
  
  console.log('\n=== COMPARISON ===');
  console.log('Light mode --elvt-alias-layout-border-default should map to a subtle border');
  console.log('Dark mode --elvt-alias-layout-border-default should map to a subtle border');
  console.log('Are the computed values too strong? Check the RGB values above.');
  
  await browser.close();
}

debugBorderTokens().catch(console.error);