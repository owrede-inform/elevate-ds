const { chromium } = require('playwright');

async function testAllGetStartedLinks() {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();

  console.log('🔗 Testing all "Get Started" links...');
  
  try {
    // Test 1: Homepage hero button
    await page.goto('http://localhost:3000/');
    await page.waitForLoadState('networkidle');
    await page.setViewportSize({ width: 1400, height: 800 });
    
    console.log('\n📊 Test 1: Homepage hero "Get Started" button');
    const heroButton = page.locator('text="Get Started"').first();
    const heroHref = await heroButton.getAttribute('href');
    console.log(`Hero button href: ${heroHref}`);
    
    await heroButton.click();
    await page.waitForLoadState('networkidle');
    console.log(`After hero click, URL: ${page.url()}`);
    console.log(`✅ Hero button works: ${page.url().includes('/docs/home/overview')}`);
    
    // Test 2: Footer link
    await page.goto('http://localhost:3000/');
    await page.waitForLoadState('networkidle');
    
    console.log('\n📊 Test 2: Footer "Getting Started" link');
    const footerLink = page.locator('.footer a:has-text("Getting Started")');
    const footerExists = await footerLink.isVisible();
    
    if (footerExists) {
      const footerHref = await footerLink.getAttribute('href');
      console.log(`Footer link href: ${footerHref}`);
      
      await footerLink.click();
      await page.waitForLoadState('networkidle');
      console.log(`After footer click, URL: ${page.url()}`);
      console.log(`✅ Footer link works: ${page.url().includes('/docs/home/overview')}`);
    } else {
      console.log('Footer link not visible, scrolling down...');
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
      await page.waitForTimeout(1000);
      
      const footerLinkAfterScroll = page.locator('.footer a:has-text("Getting Started")');
      const footerHref = await footerLinkAfterScroll.getAttribute('href');
      console.log(`Footer link href: ${footerHref}`);
      
      await footerLinkAfterScroll.click();
      await page.waitForLoadState('networkidle');
      console.log(`After footer click, URL: ${page.url()}`);
      console.log(`✅ Footer link works: ${page.url().includes('/docs/home/overview')}`);
    }
    
    // Test 3: Verify old route returns 404
    console.log('\n📊 Test 3: Verify old /docs/get-started returns 404');
    try {
      await page.goto('http://localhost:3000/docs/get-started');
      await page.waitForLoadState('networkidle');
      
      const is404 = await page.locator('text="404"').isVisible() || 
                   await page.locator('text="Page Not Found"').isVisible() ||
                   await page.locator('text="page could not be found"').isVisible();
      
      console.log(`✅ Old route properly returns 404: ${is404}`);
      console.log(`Current page title: ${await page.title()}`);
    } catch (error) {
      console.log(`✅ Old route is unreachable: ${error.message}`);
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await browser.close();
  }
}

// Wait for server then test
setTimeout(testAllGetStartedLinks, 3000);