const { chromium } = require('playwright');

async function investigateTokenSystem() {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  
  await page.goto('http://localhost:3000/docs/home/get-started');
  await page.waitForSelector('.navbar');
  
  console.log('=== INVESTIGATING ELEVATE TOKEN SYSTEM ===\n');
  
  // Check what CSS files are loaded and in what order
  const cssFiles = await page.evaluate(() => {
    const links = Array.from(document.querySelectorAll('link[rel="stylesheet"]'));
    return links.map(link => ({
      href: link.href,
      media: link.media || 'all'
    }));
  });
  
  console.log('Loaded CSS files:');
  cssFiles.forEach((file, index) => {
    console.log(`${index + 1}. ${file.href} (media: ${file.media})`);
  });
  
  // Light mode analysis
  console.log('\n=== LIGHT MODE TOKEN DEFINITIONS ===');
  
  const lightModeTokens = await page.evaluate(() => {
    const root = document.documentElement;
    const computed = getComputedStyle(root);
    
    // Get all ELEVATE tokens related to borders and layout
    const tokens = {};
    for (let i = 0; i < computed.length; i++) {
      const prop = computed.item(i);
      if (prop.includes('--elvt-') && (prop.includes('border') || prop.includes('layout'))) {
        tokens[prop] = computed.getPropertyValue(prop).trim();
      }
    }
    
    return tokens;
  });
  
  console.log('ELEVATE border/layout tokens in LIGHT mode:');
  Object.entries(lightModeTokens).sort().forEach(([token, value]) => {
    console.log(`${token}: ${value}`);
  });
  
  // Switch to dark mode
  await page.click('[class*="colorModeToggle"]');
  await page.waitForTimeout(1000);
  
  console.log('\n=== DARK MODE TOKEN DEFINITIONS ===');
  
  const darkModeTokens = await page.evaluate(() => {
    const root = document.documentElement;
    const computed = getComputedStyle(root);
    
    // Get all ELEVATE tokens related to borders and layout
    const tokens = {};
    for (let i = 0; i < computed.length; i++) {
      const prop = computed.item(i);
      if (prop.includes('--elvt-') && (prop.includes('border') || prop.includes('layout'))) {
        tokens[prop] = computed.getPropertyValue(prop).trim();
      }
    }
    
    return tokens;
  });
  
  console.log('ELEVATE border/layout tokens in DARK mode:');
  Object.entries(darkModeTokens).sort().forEach(([token, value]) => {
    console.log(`${token}: ${value}`);
  });
  
  // Compare the tokens between modes
  console.log('\n=== TOKEN COMPARISON ===');
  
  const allTokens = new Set([...Object.keys(lightModeTokens), ...Object.keys(darkModeTokens)]);
  
  allTokens.forEach(token => {
    const lightValue = lightModeTokens[token] || 'undefined';
    const darkValue = darkModeTokens[token] || 'undefined';
    
    if (lightValue !== darkValue) {
      console.log(`✅ ${token}:`);
      console.log(`   Light: ${lightValue}`);
      console.log(`   Dark:  ${darkValue}`);
    } else {
      console.log(`❌ ${token}: ${lightValue} (SAME IN BOTH MODES - PROBLEM!)`);
    }
  });
  
  // Check if ELEVATE CSS is properly loaded with theme variants
  console.log('\n=== CSS THEME ANALYSIS ===');
  
  const themeInfo = await page.evaluate(() => {
    // Check if there are specific theme-related CSS rules
    const stylesheets = Array.from(document.styleSheets);
    let lightThemeRules = 0;
    let darkThemeRules = 0;
    let elvtTokenRules = 0;
    
    stylesheets.forEach(sheet => {
      try {
        const rules = Array.from(sheet.cssRules || []);
        rules.forEach(rule => {
          if (rule.cssText) {
            if (rule.cssText.includes('[data-theme="dark"]') || rule.cssText.includes('.dark')) {
              darkThemeRules++;
            }
            if (rule.cssText.includes(':root') || rule.cssText.includes('[data-theme="light"]')) {
              lightThemeRules++;
            }
            if (rule.cssText.includes('--elvt-')) {
              elvtTokenRules++;
            }
          }
        });
      } catch (e) {
        // Cross-origin stylesheet or other access issue
      }
    });
    
    return {
      lightThemeRules,
      darkThemeRules,
      elvtTokenRules,
      totalStylesheets: stylesheets.length
    };
  });
  
  console.log(`Found ${themeInfo.totalStylesheets} stylesheets`);
  console.log(`Light theme rules: ${themeInfo.lightThemeRules}`);
  console.log(`Dark theme rules: ${themeInfo.darkThemeRules}`);
  console.log(`ELEVATE token rules: ${themeInfo.elvtTokenRules}`);
  
  await browser.close();
}

investigateTokenSystem().catch(console.error);