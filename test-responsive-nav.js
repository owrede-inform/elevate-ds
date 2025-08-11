const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    // Navigate to the local development server
    await page.goto('http://localhost:3000/docs/home/');
    
    // Wait for page to load
    await page.waitForLoadState('networkidle');
    
    // Test different viewport sizes
    const viewports = [
      { width: 1400, height: 800, name: 'desktop' },
      { width: 1100, height: 800, name: 'below-1180px' },
      { width: 900, height: 800, name: 'mobile' }
    ];
    
    for (const viewport of viewports) {
      console.log(`Testing viewport: ${viewport.width}x${viewport.height} (${viewport.name})`);
      
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      await page.waitForTimeout(500); // Wait for resize
      
      // Take screenshot
      await page.screenshot({ 
        path: `sample-data/test/navbar-${viewport.name}-${viewport.width}px.png`,
        fullPage: false 
      });
      
      // Skip HTML debug for cleaner output
      
      // Debug navbar structure first
      const navbarStructure = await page.evaluate(() => {
        const navbar = document.querySelector('.navbar');
        if (navbar) {
          const leftItems = navbar.querySelector('.navbar__items--left');
          return {
            hasLeftItems: !!leftItems,
            leftItemsHTML: leftItems?.innerHTML || 'No left items container',
            navbarItems: Array.from(navbar.querySelectorAll('.navbar__item')).map(el => ({
              text: el.textContent?.trim(),
              className: el.className,
              parent: el.parentElement?.className
            }))
          };
        }
        return null;
      });
      console.log(`  Navbar structure:`, navbarStructure);
      
      // Try different selectors to find navbar items
      const selectors = [
        '.navbar__items--left .navbar__item',
        '.navbar__items--left a',
        '.navbar__item',
        '.navbar a[href^="/docs"]',
        '.navbar__link'
      ];
      
      for (const selector of selectors) {
        const items = await page.locator(selector).all();
        console.log(`  Selector "${selector}": ${items.length} items found`);
        if (items.length > 0) {
          for (let i = 0; i < Math.min(items.length, 3); i++) {
            const isVisible = await items[i].isVisible();
            const text = await items[i].textContent();
            console.log(`    Item ${i} (${text?.trim()}): ${isVisible ? 'VISIBLE' : 'HIDDEN'}`);
          }
        }
      }
      
      const responsiveNav = await page.locator('[class*="responsiveNav"]').first();
      const responsiveNavVisible = await responsiveNav.isVisible();
      console.log(`  Responsive nav: ${responsiveNavVisible ? 'VISIBLE' : 'HIDDEN'}`);
      
      // Check if ResponsiveNavigation component exists in DOM
      const responsiveNavExists = await page.locator('[class*="responsiveNav"]').count();
      console.log(`  ResponsiveNav components in DOM: ${responsiveNavExists}`);
      
      if (responsiveNavExists > 0) {
        // Debug positioning
        const boundingBox = await responsiveNav.boundingBox();
        console.log(`    Bounding box:`, boundingBox);
        
        const styles = await responsiveNav.evaluate(el => {
          const computed = window.getComputedStyle(el);
          return {
            position: computed.position,
            display: computed.display,
            opacity: computed.opacity
          };
        });
        console.log(`    ResponsiveNav styles:`, styles);
      }
      
      if (responsiveNavExists > 0) {
        // Check sidebar container
        const sidebarContainer = await page.locator('.theme-doc-sidebar-container').first();
        const sidebarExists = await sidebarContainer.count();
        console.log(`    Sidebar container exists: ${sidebarExists > 0}`);
        
        if (sidebarExists > 0) {
          const sidebarBox = await sidebarContainer.boundingBox();
          console.log(`    Sidebar bounding box:`, sidebarBox);
          
          // Check navbar height for reference
          const navbar = await page.locator('.navbar').first();
          const navbarBox = await navbar.boundingBox();
          console.log(`    Navbar bounding box:`, navbarBox);
        }
      }
      
      console.log('---');
    }
    
  } catch (error) {
    console.error('Error during testing:', error);
  } finally {
    await browser.close();
  }
})();