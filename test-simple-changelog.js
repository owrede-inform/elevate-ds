const { chromium } = require('playwright');

async function testSimpleChangelog() {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();
  
  console.log('🧪 Testing simplified changelog message...\n');
  
  try {
    // Test a component without changelog data
    console.log('📋 Testing avatar component (should show simple "No changelog entries")...');
    await page.goto('http://localhost:3000/docs/components/avatar');
    await page.waitForLoadState('networkidle');
    
    // Wait for ComponentChangelog to load
    await page.waitForTimeout(3000);
    
    // Check for the simplified message
    const noChangelogMessage = page.locator('.noChangelog');
    const messageVisible = await noChangelogMessage.isVisible();
    console.log(`✅ Simple message visible: ${messageVisible}`);
    
    if (messageVisible) {
      const messageText = await noChangelogMessage.textContent();
      console.log(`✅ Message text: "${messageText}"`);
      
      // Should be just the simple text
      const isSimple = messageText.includes('No changelog entries for this component.');
      console.log(`✅ Message is simple and clean: ${isSimple}`);
    }
    
    console.log('\n📋 Testing button component (should show actual changelog)...');
    await page.goto('http://localhost:3000/docs/components/button');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);
    
    const versionEntries = page.locator('.versionEntry');
    const entryCount = await versionEntries.count();
    console.log(`✅ Button version entries: ${entryCount}`);
    
    const buttonNoChangelog = page.locator('.noChangelog');
    const buttonHasNoMessage = await buttonNoChangelog.isVisible();
    console.log(`✅ Button shows no "no changelog" message: ${!buttonHasNoMessage}`);
    
  } catch (error) {
    console.error('❌ Test error:', error.message);
  } finally {
    console.log('\n⏸️ Browser staying open for inspection...');
    await page.waitForTimeout(15000);
    await browser.close();
  }
}

testSimpleChangelog();