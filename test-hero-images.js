const { chromium } = require('playwright');

async function testHeroImages() {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();

  console.log('🖼️ Testing hero image loading after baseUrl fixes...');
  
  try {
    // Test homepage hero
    await page.goto('http://localhost:3000/');
    await page.waitForLoadState('networkidle');
    await page.setViewportSize({ width: 1400, height: 800 });
    
    console.log('\n📊 Testing homepage hero image:');
    
    // Wait a bit for the image to load
    await page.waitForTimeout(3000);
    
    // Check if hero section exists
    const heroSection = page.locator('.customHero');
    const heroExists = await heroSection.isVisible();
    console.log(`Hero section visible: ${heroExists}`);
    
    if (heroExists) {
      // Get the computed background image style
      const backgroundImage = await heroSection.evaluate((el) => {
        const style = window.getComputedStyle(el);
        return style.backgroundImage;
      });
      
      console.log(`Background image CSS: ${backgroundImage}`);
      
      // Check if it's not just "none"
      const hasBackground = backgroundImage && backgroundImage !== 'none';
      console.log(`Has background image: ${hasBackground}`);
      
      if (hasBackground) {
        // Extract URL from CSS
        const urlMatch = backgroundImage.match(/url\("?([^"]*)"?\)/);
        if (urlMatch) {
          const imageUrl = urlMatch[1];
          console.log(`Image URL: ${imageUrl}`);
          
          // Test if the image actually loads
          try {
            const response = await page.goto(imageUrl);
            const status = response?.status();
            console.log(`Image response status: ${status}`);
            console.log(`✅ Image loads successfully: ${status === 200}`);
          } catch (error) {
            console.log(`❌ Image failed to load: ${error.message}`);
          }
        }
      }
    }
    
    // Check for any console errors
    page.on('console', (msg) => {
      if (msg.type() === 'error' || msg.type() === 'warning') {
        console.log(`Console ${msg.type()}: ${msg.text()}`);
      }
    });
    
    // Take screenshot
    await page.screenshot({ 
      path: 'hero-image-test.png',
      fullPage: false 
    });
    console.log('\n📸 Screenshot saved: hero-image-test.png');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await browser.close();
  }
}

// Wait for server to start then test
setTimeout(testHeroImages, 5000);