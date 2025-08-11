const { chromium } = require('playwright');

async function testChangelogFix() {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();
  
  console.log('🧪 Testing ComponentChangelog fix for missing JSON files...\n');
  
  try {
    // Test components that should show "No Changelog Available"
    const componentsToTest = [
      'avatar',
      'input', 
      'card'
    ];
    
    for (const componentName of componentsToTest) {
      console.log(`\n📋 Testing ${componentName} component (should show "No Changelog Available")...`);
      
      await page.goto(`http://localhost:3000/docs/components/${componentName}`);
      await page.waitForLoadState('networkidle');
      
      // Wait for ComponentChangelog to load and process
      await page.waitForTimeout(5000);
      
      // Check for the "No Changelog Available" message
      const noChangelogMessage = page.locator('.noChangelog');
      const messageVisible = await noChangelogMessage.isVisible();
      console.log(`  ✅ "No Changelog Available" message visible: ${messageVisible}`);
      
      if (messageVisible) {
        const messageTitle = await noChangelogMessage.locator('h4').textContent();
        console.log(`  ✅ Message title: "${messageTitle}"`);
        
        // Check for component name in message
        const messageText = await noChangelogMessage.textContent();
        const hasComponentName = messageText.includes(`elvt-${componentName}`);
        console.log(`  ✅ Component name (elvt-${componentName}) mentioned: ${hasComponentName}`);
      } else {
        // Check if there's still an error message
        const errorMessage = page.locator('.error');
        const errorVisible = await errorMessage.isVisible();
        console.log(`  ❌ Error message visible: ${errorVisible}`);
        
        if (errorVisible) {
          const errorText = await errorMessage.textContent();
          console.log(`  ❌ Error text: "${errorText}"`);
        }
      }
    }
    
    console.log('\n📋 Testing button component (should show actual changelog data)...');
    await page.goto('http://localhost:3000/docs/components/button');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(5000);
    
    // Check for version entries (should have them for button)
    const versionEntries = page.locator('.versionEntry');
    const entryCount = await versionEntries.count();
    console.log(`  ✅ Button version entries count: ${entryCount}`);
    
    if (entryCount > 0) {
      console.log('  ✅ Button changelog loaded successfully!');
    } else {
      // Check for any error messages
      const errorMessage = page.locator('.error');
      const errorVisible = await errorMessage.isVisible();
      if (errorVisible) {
        const errorText = await errorMessage.textContent();
        console.log(`  ❌ Button error: "${errorText}"`);
      }
    }
    
    console.log('\n🎉 ComponentChangelog fix test completed!');
    
  } catch (error) {
    console.error('❌ Test error:', error.message);
  } finally {
    console.log('\n⏸️ Browser will stay open for 10 seconds for manual inspection...');
    await page.waitForTimeout(10000);
    await browser.close();
  }
}

testChangelogFix();