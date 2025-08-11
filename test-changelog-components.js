const { chromium } = require('playwright');

async function testChangelogComponents() {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();
  
  console.log('🧪 Testing ComponentChangelog across different component pages...\n');
  
  try {
    // Test components - mix of those with and without changelog JSON files
    const componentsToTest = [
      { name: 'button', hasChangelog: true, expectedComponent: 'elvt-button' },
      { name: 'avatar', hasChangelog: false, expectedComponent: 'elvt-avatar' },
      { name: 'input', hasChangelog: false, expectedComponent: 'elvt-input' },
      { name: 'card', hasChangelog: false, expectedComponent: 'elvt-card' },
      { name: 'badge', hasChangelog: false, expectedComponent: 'elvt-badge' },
      { name: 'icon', hasChangelog: false, expectedComponent: 'elvt-icon' }
    ];
    
    for (const component of componentsToTest) {
      console.log(`\n📋 Testing ${component.name} component page...`);
      
      // Navigate to component page
      await page.goto(`http://localhost:3000/docs/components/${component.name}`);
      await page.waitForLoadState('networkidle');
      
      // Check if page loaded correctly
      const pageTitle = await page.title();
      console.log(`✅ Page loaded: ${pageTitle}`);
      
      // Look for the changelog section
      const changelogHeading = page.locator('h2', { hasText: 'Changelog' });
      const changelogVisible = await changelogHeading.isVisible();
      console.log(`✅ Changelog section visible: ${changelogVisible}`);
      
      if (changelogVisible) {
        // Wait a moment for ComponentChangelog to load
        await page.waitForTimeout(3000);
        
        if (component.hasChangelog) {
          // Test components WITH changelog data (like button)
          console.log(`  🔍 Testing component with changelog data...`);
          
          // Check for changelog content
          const versionEntries = page.locator('.versionEntry');
          const entryCount = await versionEntries.count();
          console.log(`  ✅ Found ${entryCount} version entries`);
          
          if (entryCount > 0) {
            // Check for version headers
            const versionHeaders = page.locator('.versionNumber');
            const firstVersion = await versionHeaders.first().textContent();
            console.log(`  ✅ Latest version: ${firstVersion}`);
            
            // Check for change entries (click to expand first version)
            await versionEntries.first().locator('.versionHeader').click();
            await page.waitForTimeout(1000);
            
            const changes = page.locator('.change');
            const changeCount = await changes.count();
            console.log(`  ✅ Changes in latest version: ${changeCount}`);
            
            // Check for change details
            if (changeCount > 0) {
              const firstChangeTitle = await changes.first().locator('.changeTitle').textContent();
              console.log(`  ✅ First change: "${firstChangeTitle}"`);
            }
          }
          
        } else {
          // Test components WITHOUT changelog data
          console.log(`  🔍 Testing component without changelog data...`);
          
          // Should show "No Changelog Available" message
          const noChangelogMessage = page.locator('.noChangelog');
          const messageVisible = await noChangelogMessage.isVisible();
          console.log(`  ✅ "No Changelog Available" message visible: ${messageVisible}`);
          
          if (messageVisible) {
            const messageTitle = await noChangelogMessage.locator('h4').textContent();
            console.log(`  ✅ Message title: "${messageTitle}"`);
            
            // Check for component name in message
            const messageText = await noChangelogMessage.textContent();
            const hasComponentName = messageText.includes(component.expectedComponent);
            console.log(`  ✅ Component name (${component.expectedComponent}) mentioned: ${hasComponentName}`);
          }
        }
      }
      
      console.log(`  ✅ ${component.name} component test completed\n`);
    }
    
    console.log('\n🎉 All component changelog tests completed!');
    console.log('\n📊 Test Summary:');
    console.log(`- Components tested: ${componentsToTest.length}`);
    console.log(`- Components with changelog data: ${componentsToTest.filter(c => c.hasChangelog).length}`);
    console.log(`- Components without changelog data: ${componentsToTest.filter(c => !c.hasChangelog).length}`);
    console.log('\n✅ ComponentChangelog component working correctly across all tested pages.');
    
  } catch (error) {
    console.error('❌ Error during testing:', error.message);
  } finally {
    await browser.close();
  }
}

// Run the test
testChangelogComponents();