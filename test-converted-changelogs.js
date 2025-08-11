const { chromium } = require('playwright');

async function testConvertedChangelogs() {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();
  
  console.log('🧪 Testing converted changelog JSON files...\n');
  
  try {
    // Test badge component (should now show changelog data)
    console.log('📋 Testing badge component changelog...');
    await page.goto('http://localhost:3000/docs/components/badge');
    await page.waitForLoadState('networkidle');
    
    // Wait for ComponentChangelog to load
    await page.waitForTimeout(5000);
    
    // Check for version entries (should have them now)
    const versionEntries = page.locator('.versionEntry');
    const entryCount = await versionEntries.count();
    console.log(`✅ Badge version entries: ${entryCount}`);
    
    if (entryCount > 0) {
      const firstVersion = await versionEntries.first().locator('.versionNumber').textContent();
      console.log(`✅ Badge latest version: ${firstVersion}`);
      
      // Expand first version to see changes
      await versionEntries.first().locator('.versionHeader').click();
      await page.waitForTimeout(1000);
      
      const changes = page.locator('.change');
      const changeCount = await changes.count();
      console.log(`✅ Badge changes in version: ${changeCount}`);
      
      if (changeCount > 0) {
        const firstChangeTitle = await changes.first().locator('.changeTitle').textContent();
        console.log(`✅ First badge change: "${firstChangeTitle}"`);
      }
    } else {
      // Check if still showing "no changelog"
      const noChangelog = page.locator('.noChangelog');
      const hasNoChangelog = await noChangelog.isVisible();
      console.log(`❌ Still showing "no changelog": ${hasNoChangelog}`);
      
      if (hasNoChangelog) {
        const messageText = await noChangelog.textContent();
        console.log(`❌ Message: "${messageText}"`);
      }
    }
    
    console.log('\n📋 Testing a few more components...');
    
    // Test avatar component
    await page.goto('http://localhost:3000/docs/components/avatar');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);
    
    const avatarEntries = await page.locator('.versionEntry').count();
    console.log(`✅ Avatar version entries: ${avatarEntries}`);
    
    // Test card component
    await page.goto('http://localhost:3000/docs/components/card');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);
    
    const cardEntries = await page.locator('.versionEntry').count();
    console.log(`✅ Card version entries: ${cardEntries}`);
    
    console.log('\n🎉 Changelog conversion test completed!');
    
  } catch (error) {
    console.error('❌ Test error:', error.message);
  } finally {
    console.log('\n⏸️ Browser staying open for manual inspection...');
    await page.waitForTimeout(15000);
    await browser.close();
  }
}

testConvertedChangelogs();