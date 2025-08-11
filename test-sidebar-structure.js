const { chromium } = require('playwright');

async function testSidebarStructure() {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();

  console.log('📋 Testing sidebar structure after changes...');
  
  try {
    // Test 1: Components page
    console.log('\n📊 Test 1: Components page sidebar');
    await page.goto('http://localhost:3000/docs/components/button');
    await page.waitForLoadState('networkidle');
    await page.setViewportSize({ width: 1400, height: 800 });
    
    const sidebarItems = page.locator('.theme-doc-sidebar-item-link');
    const itemCount = await sidebarItems.count();
    console.log(`Sidebar items count: ${itemCount}`);
    
    // Check first few items
    if (itemCount > 0) {
      for (let i = 0; i < Math.min(10, itemCount); i++) {
        const item = sidebarItems.nth(i);
        const text = await item.textContent();
        console.log(`  Item ${i + 1}: "${text}"`);
      }
    }
    
    // Check breadcrumbs
    const breadcrumbItems = page.locator('.breadcrumbs__item');
    const breadcrumbCount = await breadcrumbItems.count();
    console.log(`\nBreadcrumb items: ${breadcrumbCount}`);
    
    for (let i = 0; i < breadcrumbCount; i++) {
      const item = breadcrumbItems.nth(i);
      const text = await item.textContent();
      console.log(`  Breadcrumb ${i + 1}: "${text.trim()}"`);
    }
    
    // Test 2: Home page
    console.log('\n📊 Test 2: Home page sidebar');
    await page.goto('http://localhost:3000/docs/home/overview');
    await page.waitForLoadState('networkidle');
    
    const homeSidebarItems = page.locator('.theme-doc-sidebar-item-link');
    const homeItemCount = await homeSidebarItems.count();
    console.log(`Home sidebar items count: ${homeItemCount}`);
    
    if (homeItemCount > 0) {
      for (let i = 0; i < Math.min(10, homeItemCount); i++) {
        const item = homeSidebarItems.nth(i);
        const text = await item.textContent();
        console.log(`  Home item ${i + 1}: "${text}"`);
      }
    }
    
    // Take screenshots
    await page.goto('http://localhost:3000/docs/components/button');
    await page.waitForLoadState('networkidle');
    await page.screenshot({ 
      path: 'sidebar-components-test.png',
      fullPage: false 
    });
    
    await page.goto('http://localhost:3000/docs/home/overview');
    await page.waitForLoadState('networkidle');
    await page.screenshot({ 
      path: 'sidebar-home-test.png',
      fullPage: false 
    });
    
    console.log('\n📸 Screenshots saved: sidebar-components-test.png, sidebar-home-test.png');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await browser.close();
  }
}

// Wait for server then test
setTimeout(testSidebarStructure, 3000);