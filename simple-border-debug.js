const { chromium } = require('playwright');

async function simpleBorderDebug() {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  
  // Navigate to get-started page
  await page.goto('http://localhost:3000/docs/home/get-started');
  await page.waitForSelector('.navbar');
  
  console.log('=== LIGHT MODE TOKEN ANALYSIS ===');
  
  const lightTokens = await page.evaluate(() => {
    const root = document.documentElement;
    const computed = getComputedStyle(root);
    
    return {
      borderDefault: computed.getPropertyValue('--elvt-alias-layout-border-default').trim(),
      borderMuted: computed.getPropertyValue('--elvt-alias-layout-border-muted').trim(),
      gray200: computed.getPropertyValue('--elvt-primitives-color-gray-200').trim(),
      gray300: computed.getPropertyValue('--elvt-primitives-color-gray-300').trim(),
      gray400: computed.getPropertyValue('--elvt-primitives-color-gray-400').trim(),
      gray500: computed.getPropertyValue('--elvt-primitives-color-gray-500').trim()
    };
  });
  
  console.log('Light Mode ELEVATE Tokens:');
  console.log('--elvt-alias-layout-border-default:', lightTokens.borderDefault);
  console.log('--elvt-alias-layout-border-muted:', lightTokens.borderMuted);
  console.log('--elvt-primitives-color-gray-200:', lightTokens.gray200);
  console.log('--elvt-primitives-color-gray-300:', lightTokens.gray300);
  console.log('--elvt-primitives-color-gray-400:', lightTokens.gray400);
  console.log('--elvt-primitives-color-gray-500:', lightTokens.gray500);
  
  // Switch to dark mode
  await page.click('[class*="colorModeToggle"]');
  await page.waitForTimeout(1000);
  
  console.log('\n=== DARK MODE TOKEN ANALYSIS ===');
  
  const darkTokens = await page.evaluate(() => {
    const root = document.documentElement;
    const computed = getComputedStyle(root);
    
    return {
      borderDefault: computed.getPropertyValue('--elvt-alias-layout-border-default').trim(),
      borderMuted: computed.getPropertyValue('--elvt-alias-layout-border-muted').trim(),
      gray600: computed.getPropertyValue('--elvt-primitives-color-gray-600').trim(),
      gray700: computed.getPropertyValue('--elvt-primitives-color-gray-700').trim(),
      gray800: computed.getPropertyValue('--elvt-primitives-color-gray-800').trim(),
      gray900: computed.getPropertyValue('--elvt-primitives-color-gray-900').trim()
    };
  });
  
  console.log('Dark Mode ELEVATE Tokens:');
  console.log('--elvt-alias-layout-border-default:', darkTokens.borderDefault);
  console.log('--elvt-alias-layout-border-muted:', darkTokens.borderMuted);
  console.log('--elvt-primitives-color-gray-600:', darkTokens.gray600);
  console.log('--elvt-primitives-color-gray-700:', darkTokens.gray700);
  console.log('--elvt-primitives-color-gray-800:', darkTokens.gray800);
  console.log('--elvt-primitives-color-gray-900:', darkTokens.gray900);
  
  console.log('\n=== ANALYSIS ===');
  console.log('Light mode: rgb(163, 170, 180) = gray-300 - This is quite strong for a border');
  console.log('For comparison:');
  console.log('- gray-200 would be lighter/more subtle');  
  console.log('- gray-400 would be darker/stronger');
  console.log('\nRecommendation: Consider using --elvt-primitives-color-gray-200 for more subtle borders');
  
  await browser.close();
}

simpleBorderDebug().catch(console.error);