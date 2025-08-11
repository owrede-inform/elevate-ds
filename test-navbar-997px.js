const { chromium } = require('playwright');

async function testNavbar997px() {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();

  console.log('🚀 Testing navbar at 997px breakpoint...');
  
  try {
    await page.goto('http://localhost:3000/docs/home/');
    await page.waitForLoadState('networkidle');
    
    // Test multiple breakpoints around 997px
    const breakpoints = [1000, 997, 996, 995, 990];
    
    for (const width of breakpoints) {
      await page.setViewportSize({ width, height: 800 });
      await page.waitForTimeout(500);
      
      console.log(`\n📊 Testing at ${width}px viewport:`);
      
      // Check navbar items visibility
      const navbarItems = page.locator('.navbar__items:not(.navbar__items--right) .navbar__item');
      const itemCount = await navbarItems.count();
      
      if (itemCount > 0) {
        const firstItem = navbarItems.first();
        const isVisible = await firstItem.isVisible();
        const text = await firstItem.textContent();
        console.log(`  First item "${text}" - Visible: ${isVisible}`);
      }
      
      // Check ResponsiveNavigation component
      const responsiveNav = page.locator('[class*="responsiveNav"]');
      const isResponsiveVisible = await responsiveNav.isVisible();
      console.log(`  ResponsiveNavigation visible: ${isResponsiveVisible}`);
      
      // Check if burger menu is present
      const burgerMenu = page.locator('.navbar__toggle');
      const isBurgerVisible = await burgerMenu.isVisible();
      console.log(`  Burger menu visible: ${isBurgerVisible}`);
    }
    
    // Take screenshot for visual verification at 997px
    await page.setViewportSize({ width: 997, height: 800 });
    await page.waitForTimeout(500);
    await page.screenshot({ 
      path: 'navbar-997px-test.png',
      fullPage: false 
    });
    console.log('📸 Screenshot saved: navbar-997px-test.png');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await browser.close();
  }
}

testNavbar997px();