const { chromium } = require('playwright');

async function testBreadcrumbsFinal() {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();

  console.log('🍞 Final breadcrumb test after sidebar restructure...');
  
  try {
    // Test button component page
    await page.goto('http://localhost:3000/docs/components/button');
    await page.waitForLoadState('networkidle');
    await page.setViewportSize({ width: 1400, height: 800 });
    
    console.log('\n📊 Testing /docs/components/button breadcrumbs:');
    
    // Check breadcrumb structure
    const breadcrumbItems = page.locator('.breadcrumbs__item');
    const itemCount = await breadcrumbItems.count();
    
    console.log(`Found ${itemCount} breadcrumb items:`);
    
    if (itemCount > 0) {
      for (let i = 0; i < itemCount; i++) {
        const item = breadcrumbItems.nth(i);
        const link = item.locator('.breadcrumbs__link');
        const text = await item.textContent();
        const href = await link.getAttribute('href').catch(() => 'no-link');
        console.log(`  ${i + 1}. "${text.trim()}" -> ${href}`);
      }
    }
    
    // Test a few other component pages
    const testPages = [
      '/docs/components/input',
      '/docs/components/card',
    ];
    
    for (const testPage of testPages) {
      await page.goto(`http://localhost:3000${testPage}`);
      await page.waitForLoadState('networkidle');
      
      const breadcrumbs = page.locator('.breadcrumbs__item');
      const count = await breadcrumbs.count();
      const lastItem = breadcrumbs.last();
      const pageTitle = await lastItem.textContent();
      
      console.log(`${testPage}: ${count} items, last = "${pageTitle.trim()}"`);
    }
    
    // Take final screenshot
    await page.goto('http://localhost:3000/docs/components/button');
    await page.waitForLoadState('networkidle');
    await page.screenshot({ 
      path: 'breadcrumbs-fixed-final.png',
      fullPage: false 
    });
    console.log('\n📸 Final screenshot saved: breadcrumbs-fixed-final.png');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await browser.close();
  }
}

// Wait for server to start then test
setTimeout(testBreadcrumbsFinal, 8000);