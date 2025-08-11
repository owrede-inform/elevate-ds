const { chromium } = require('playwright');

async function testGetStartedButton() {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();

  console.log('🚀 Testing "Get Started" button on homepage...');
  
  try {
    // Go to homepage
    await page.goto('http://localhost:3000/');
    await page.waitForLoadState('networkidle');
    await page.setViewportSize({ width: 1400, height: 800 });
    
    console.log('\n📊 Testing homepage "Get Started" button:');
    
    // Find the Get Started button
    const getStartedButton = page.locator('text="Get Started"').first();
    const buttonExists = await getStartedButton.isVisible();
    console.log(`Get Started button visible: ${buttonExists}`);
    
    if (buttonExists) {
      // Check the href attribute
      const href = await getStartedButton.getAttribute('href');
      console.log(`Get Started button href: ${href}`);
      
      // Click the button and verify it navigates correctly
      await getStartedButton.click();
      await page.waitForLoadState('networkidle');
      
      const currentUrl = page.url();
      console.log(`After clicking, current URL: ${currentUrl}`);
      
      // Verify we're on the overview page
      const isOnOverviewPage = currentUrl.includes('/docs/home/overview');
      console.log(`Successfully navigated to overview page: ${isOnOverviewPage}`);
      
      if (isOnOverviewPage) {
        // Check page title
        const pageTitle = await page.locator('h1').first().textContent();
        console.log(`Overview page title: "${pageTitle}"`);
      }
    }
    
    // Take screenshot
    await page.screenshot({ 
      path: 'get-started-button-test.png',
      fullPage: false 
    });
    console.log('\n📸 Screenshot saved: get-started-button-test.png');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await browser.close();
  }
}

// Wait for server then test
setTimeout(testGetStartedButton, 3000);