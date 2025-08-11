const { chromium } = require('playwright');

async function testHomepageLinks() {
  console.log('🔗 Testing homepage links with useBaseUrl...');
  
  // Test the build output to simulate production behavior
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();
  
  try {
    // Check if local server is running, if not, assume build was created
    await page.goto('http://localhost:3000/');
    await page.waitForLoadState('networkidle');
    
    console.log('\n📋 Checking homepage navigation buttons:');
    
    // Check Get Started button
    const getStartedBtn = page.locator('text="Get Started"');
    const getStartedVisible = await getStartedBtn.isVisible();
    console.log(`✅ Get Started button visible: ${getStartedVisible}`);
    
    if (getStartedVisible) {
      const getStartedHref = await getStartedBtn.getAttribute('href');
      console.log(`Get Started href: ${getStartedHref}`);
      // In development, useBaseUrl should return the original path
      const isCorrect = getStartedHref === '/docs/home/overview';
      console.log(`✅ Get Started link correct for development: ${isCorrect}`);
    }
    
    // Check View Components button
    const componentsBtn = page.locator('text="View Components"');
    const componentsVisible = await componentsBtn.isVisible();
    console.log(`✅ View Components button visible: ${componentsVisible}`);
    
    if (componentsVisible) {
      const componentsHref = await componentsBtn.getAttribute('href');
      console.log(`View Components href: ${componentsHref}`);
      const isCorrect = componentsHref === '/docs/components';
      console.log(`✅ View Components link correct for development: ${isCorrect}`);
    }
    
    // Check Design Guidelines button
    const guidelinesBtn = page.locator('text="Design Guidelines"');
    const guidelinesVisible = await guidelinesBtn.isVisible();
    console.log(`✅ Design Guidelines button visible: ${guidelinesVisible}`);
    
    if (guidelinesVisible) {
      const guidelinesHref = await guidelinesBtn.getAttribute('href');
      console.log(`Design Guidelines href: ${guidelinesHref}`);
      const isCorrect = guidelinesHref === '/docs/guidelines';
      console.log(`✅ Design Guidelines link correct for development: ${isCorrect}`);
    }
    
    console.log('\n🎯 Testing navigation:');
    // Test actual navigation
    if (getStartedVisible) {
      await getStartedBtn.click();
      await page.waitForLoadState('networkidle');
      const finalUrl = page.url();
      console.log(`After clicking Get Started, navigated to: ${finalUrl}`);
      const navigationWorked = finalUrl.includes('/docs/home/overview');
      console.log(`✅ Get Started navigation worked: ${navigationWorked}`);
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await browser.close();
  }
}

// Note: useBaseUrl will automatically add the baseUrl in production builds
console.log('📝 Note: In development, useBaseUrl returns original paths.');
console.log('📝 In production builds, useBaseUrl will prefix with /elevate-ds/ automatically.');

testHomepageLinks();