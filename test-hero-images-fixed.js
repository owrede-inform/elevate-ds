const { chromium } = require('playwright');

async function testHeroImagesFixed() {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();

  console.log('🖼️ Testing hero image loading with fixed selectors...');
  
  try {
    // Test homepage hero
    await page.goto('http://localhost:3000/');
    await page.waitForLoadState('networkidle');
    await page.setViewportSize({ width: 1400, height: 800 });
    
    console.log('\n📊 Testing homepage hero image:');
    
    // Wait for hero to load
    await page.waitForTimeout(3000);
    
    // Try different selectors for hero
    const heroSelectors = ['.customHero', '[class*="customHero"]', 'header.hero', '.hero'];
    
    let heroElement = null;
    for (const selector of heroSelectors) {
      try {
        heroElement = await page.locator(selector).first();
        const isVisible = await heroElement.isVisible();
        if (isVisible) {
          console.log(`✅ Found hero with selector: ${selector}`);
          break;
        }
      } catch (e) {
        console.log(`❌ Selector ${selector} not found`);
      }
    }
    
    if (heroElement) {
      // Get background image
      const backgroundImage = await heroElement.evaluate((el) => {
        const style = window.getComputedStyle(el);
        return style.backgroundImage;
      });
      
      console.log(`Background image CSS: ${backgroundImage}`);
      
      // Check if it has a proper background
      const hasBackground = backgroundImage && backgroundImage !== 'none' && !backgroundImage.includes('linear-gradient');
      console.log(`Has background image: ${hasBackground}`);
      
      if (hasBackground) {
        // Extract URL from CSS
        const urlMatch = backgroundImage.match(/url\(["']?([^"']*)["']?\)/);
        if (urlMatch) {
          const imageUrl = urlMatch[1];
          console.log(`Image URL: ${imageUrl}`);
          
          // Check if URL looks correct (should include base path in production)
          const isRelativePath = !imageUrl.startsWith('http') && !imageUrl.startsWith('/');
          const hasCorrectPath = imageUrl.includes('hero-backgrounds') || imageUrl.includes('hero-');
          
          console.log(`✅ Image URL structure correct: ${hasCorrectPath}`);
          console.log(`✅ Using proper relative/base path: ${!imageUrl.startsWith('/')}`);
        }
      } else {
        console.log('Using fallback gradient background (normal for dev)');
      }
    }
    
    // Check hero content elements
    const titleElement = page.locator('h1', { hasText: 'ELEVATE Design System' });
    const titleVisible = await titleElement.isVisible();
    console.log(`✅ Hero title visible: ${titleVisible}`);
    
    const getStartedButton = page.locator('text="Get Started"');
    const buttonVisible = await getStartedButton.isVisible();
    console.log(`✅ Get Started button visible: ${buttonVisible}`);
    
    if (buttonVisible) {
      const buttonHref = await getStartedButton.getAttribute('href');
      console.log(`Get Started button links to: ${buttonHref}`);
      const hasCorrectLink = buttonHref === '/docs/home/overview';
      console.log(`✅ Get Started link correct: ${hasCorrectLink}`);
    }
    
    // Test button functionality
    await getStartedButton.click();
    await page.waitForLoadState('networkidle');
    
    const finalUrl = page.url();
    console.log(`After click, navigated to: ${finalUrl}`);
    const navigationWorked = finalUrl.includes('/docs/home/overview');
    console.log(`✅ Navigation worked: ${navigationWorked}`);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await browser.close();
  }
}

// Wait for server to start then test
setTimeout(testHeroImagesFixed, 3000);