const { chromium } = require('playwright');

async function testBreadcrumbs() {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();

  console.log('🍞 Testing breadcrumb navigation...');
  
  try {
    // Test button component page
    await page.goto('http://localhost:3000/docs/components/button');
    await page.waitForLoadState('networkidle');
    await page.setViewportSize({ width: 1400, height: 800 });
    
    console.log('\n📊 Testing /docs/components/button breadcrumbs:');
    
    // Check breadcrumb structure
    const breadcrumbs = page.locator('.breadcrumbs');
    const breadcrumbItems = page.locator('.breadcrumbs__item');
    const itemCount = await breadcrumbItems.count();
    
    console.log(`Found ${itemCount} breadcrumb items:`);
    
    if (itemCount > 0) {
      for (let i = 0; i < itemCount; i++) {
        const item = breadcrumbItems.nth(i);
        const link = item.locator('.breadcrumbs__link');
        const text = await item.textContent();
        const href = await link.getAttribute('href').catch(() => 'no-link');
        console.log(`  Item ${i}: "${text.trim()}" -> ${href}`);
      }
    }
    
    // Take screenshot
    await page.screenshot({ 
      path: 'breadcrumbs-button-component.png',
      fullPage: false 
    });
    console.log('📸 Screenshot saved: breadcrumbs-button-component.png');
    
    // Test if we have a sidebar structure issue
    console.log('\n📁 Checking sidebar structure:');
    const sidebarItems = page.locator('.theme-doc-sidebar-item-link');
    const sidebarCount = await sidebarItems.count();
    console.log(`Found ${sidebarCount} sidebar items`);
    
    // Look for Components category in sidebar
    const componentsCategory = page.locator('.theme-doc-sidebar-item-category', { hasText: 'Components' });
    const hasCategoryVisible = await componentsCategory.isVisible();
    console.log(`Components category in sidebar: ${hasCategoryVisible}`);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await browser.close();
  }
}

// Wait for server to start then test
setTimeout(testBreadcrumbs, 5000);