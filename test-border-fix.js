const { chromium } = require('playwright');

async function testBorderFix() {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  
  await page.goto('http://localhost:3000/docs/home/get-started');
  await page.waitForSelector('.navbar');
  
  console.log('=== TESTING BORDER FIXES ===');
  
  // Light mode
  const lightValues = await page.evaluate(() => {
    const navbar = document.querySelector('.navbar');
    const sidebar = document.querySelector('.theme-doc-sidebar-container');
    const footer = document.querySelector('.footer');
    
    const navbarStyle = navbar ? getComputedStyle(navbar) : null;
    const sidebarStyle = sidebar ? getComputedStyle(sidebar) : null;
    const footerStyle = footer ? getComputedStyle(footer) : null;
    
    return {
      navbarBorder: navbarStyle ? navbarStyle.borderBottomColor : 'not found',
      sidebarBorder: sidebarStyle ? sidebarStyle.borderRightColor : 'not found',
      footerBorder: footerStyle ? footerStyle.borderTopColor : 'not found'
    };
  });
  
  console.log('Light Mode Border Colors:');
  console.log('Navbar bottom border:', lightValues.navbarBorder);
  console.log('Sidebar right border:', lightValues.sidebarBorder);
  console.log('Footer top border:', lightValues.footerBorder);
  
  // Switch to dark mode
  await page.click('[class*="colorModeToggle"]');
  await page.waitForTimeout(1000);
  
  const darkValues = await page.evaluate(() => {
    const navbar = document.querySelector('.navbar');
    const sidebar = document.querySelector('.theme-doc-sidebar-container');
    const footer = document.querySelector('.footer');
    
    const navbarStyle = navbar ? getComputedStyle(navbar) : null;
    const sidebarStyle = sidebar ? getComputedStyle(sidebar) : null;
    const footerStyle = footer ? getComputedStyle(footer) : null;
    
    return {
      navbarBorder: navbarStyle ? navbarStyle.borderBottomColor : 'not found',
      sidebarBorder: sidebarStyle ? sidebarStyle.borderRightColor : 'not found',
      footerBorder: footerStyle ? footerStyle.borderTopColor : 'not found'
    };
  });
  
  console.log('\nDark Mode Border Colors:');
  console.log('Navbar bottom border:', darkValues.navbarBorder);
  console.log('Sidebar right border:', darkValues.sidebarBorder);
  console.log('Footer top border:', darkValues.footerBorder);
  
  console.log('\n=== COMPARISON ===');
  console.log('Expected Light Mode: rgb(190, 195, 205) - gray-200 (more subtle)');
  console.log('Expected Dark Mode: rgb(61, 66, 83) - gray-800 (appropriate for dark theme)');
  console.log('Previous issue: rgb(163, 170, 180) - gray-300 (too strong for both modes)');
  
  // Take screenshots for visual comparison
  await page.screenshot({ path: 'border-fix-dark-mode.png', fullPage: true });
  
  // Switch back to light mode
  await page.click('[class*="colorModeToggle"]');
  await page.waitForTimeout(1000);
  await page.screenshot({ path: 'border-fix-light-mode.png', fullPage: true });
  
  console.log('\nScreenshots saved: border-fix-light-mode.png and border-fix-dark-mode.png');
  
  await browser.close();
}

testBorderFix().catch(console.error);