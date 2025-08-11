const { chromium } = require('playwright');

async function testButtonChangelog() {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();
  
  console.log('🧪 Testing Button ComponentChangelog specifically...\n');
  
  try {
    // Enable console logging
    page.on('console', msg => {
      if (msg.type() === 'error') {
        console.log('CONSOLE ERROR:', msg.text());
      } else if (msg.text().includes('changelog') || msg.text().includes('component')) {
        console.log('CONSOLE:', msg.text());
      }
    });
    
    // Navigate to button component page
    console.log('📋 Loading button component page...');
    await page.goto('http://localhost:3000/docs/components/button');
    await page.waitForLoadState('networkidle');
    
    // Wait for React to initialize
    await page.waitForTimeout(3000);
    
    console.log('✅ Page loaded successfully');
    
    // Check if changelog section exists
    const changelogHeading = page.locator('h2:has-text("Changelog")');
    const headingVisible = await changelogHeading.isVisible();
    console.log(`✅ Changelog heading visible: ${headingVisible}`);
    
    // Check specifically for ComponentChangelog elements
    const changelogContainer = page.locator('.changelog');
    const containerVisible = await changelogContainer.isVisible();
    console.log(`✅ Changelog container visible: ${containerVisible}`);
    
    // Check for loading state
    const loadingElement = page.locator('.loading');
    const isLoading = await loadingElement.isVisible();
    console.log(`🔄 Loading state: ${isLoading}`);
    
    // Check for error state
    const errorElement = page.locator('.error');
    const hasError = await errorElement.isVisible();
    console.log(`❌ Error state: ${hasError}`);
    
    if (hasError) {
      const errorText = await errorElement.textContent();
      console.log(`❌ Error message: ${errorText}`);
    }
    
    // Check for no changelog state
    const noChangelogElement = page.locator('.noChangelog');
    const hasNoChangelog = await noChangelogElement.isVisible();
    console.log(`📝 No changelog state: ${hasNoChangelog}`);
    
    // Check for version entries (should have them for button)
    const versionEntries = page.locator('.versionEntry');
    const entryCount = await versionEntries.count();
    console.log(`📊 Version entries count: ${entryCount}`);
    
    if (entryCount > 0) {
      console.log('✅ Found version entries - changelog data loaded successfully!');
      
      // Get first version details
      const firstVersion = await versionEntries.first().locator('.versionNumber').textContent();
      console.log(`📌 Latest version: ${firstVersion}`);
      
      // Click to expand
      await versionEntries.first().locator('.versionHeader').click();
      await page.waitForTimeout(1000);
      
      const changes = page.locator('.change');
      const changeCount = await changes.count();
      console.log(`📝 Changes in latest version: ${changeCount}`);
      
    } else {
      console.log('⚠️ No version entries found');
      
      // Check if it's still loading or if there's actually no data
      await page.waitForTimeout(2000);
      const finalEntryCount = await versionEntries.count();
      console.log(`📊 Final version entries count: ${finalEntryCount}`);
    }
    
    // Check the network tab for any failed requests
    console.log('\n🌐 Checking for network errors...');
    
    // Manual check - try to fetch the changelog directly
    const response = await page.evaluate(async () => {
      try {
        const res = await fetch('/component-changelogs/elvt-button-changes.json');
        return {
          ok: res.ok,
          status: res.status,
          statusText: res.statusText,
          url: res.url
        };
      } catch (error) {
        return {
          error: error.message
        };
      }
    });
    
    console.log('📡 Direct fetch result:', response);
    
  } catch (error) {
    console.error('❌ Test error:', error.message);
  } finally {
    console.log('\n⏸️ Browser will stay open for 10 seconds for manual inspection...');
    await page.waitForTimeout(10000);
    await browser.close();
  }
}

testButtonChangelog();