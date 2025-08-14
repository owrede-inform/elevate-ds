const { chromium } = require('playwright');

async function debugChangelog() {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();
  
  console.log('🐛 Debugging ComponentChangelog...\n');
  
  try {
    // Test the avatar component (should show "No Changelog Available")
    console.log('📋 Testing avatar component (should have no changelog)...');
    await page.goto('http://localhost:3000/docs/components/avatar');
    await page.waitForLoadState('networkidle');
    
    // Wait for React components to initialize
    await page.waitForTimeout(5000);
    
    // Check console logs
    console.log('\n📝 Console logs:');
    page.on('console', msg => console.log('CONSOLE:', msg.text()));
    
    // Check for various changelog states
    const changelogSection = page.locator('h2', { hasText: 'Changelog' });
    console.log(`✅ Changelog heading visible: ${await changelogSection.isVisible()}`);
    
    // Check for loading state
    const loading = page.locator('.loading');
    console.log(`🔄 Loading state visible: ${await loading.isVisible()}`);
    
    // Check for error state  
    const error = page.locator('.error');
    console.log(`❌ Error state visible: ${await error.isVisible()}`);
    
    // Check for no changelog state
    const noChangelog = page.locator('.noChangelog');
    console.log(`📝 No changelog state visible: ${await noChangelog.isVisible()}`);
    
    // Check for actual changelog content
    const versionEntries = page.locator('.versionEntry');
    console.log(`📊 Version entries found: ${await versionEntries.count()}`);
    
    // Check if ComponentChangelog component is rendered at all
    const changelogComponent = page.locator('[data-testid="component-changelog"], .changelog');
    console.log(`🧩 ComponentChangelog rendered: ${await changelogComponent.isVisible()}`);
    
    // Get the full HTML around the changelog section to debug
    const changelogHTML = await page.locator('h2:has-text("Changelog")').locator('..').innerHTML();
    console.log('\n📄 Changelog section HTML:');
    console.log(changelogHTML.substring(0, 1000) + '...');
    
    // Wait a bit longer to see if anything loads
    await page.waitForTimeout(3000);
    
    console.log('\n🔍 Final state check:');
    console.log(`Loading: ${await loading.isVisible()}`);
    console.log(`Error: ${await error.isVisible()}`);
    console.log(`No changelog: ${await noChangelog.isVisible()}`);
    console.log(`Version entries: ${await versionEntries.count()}`);
    
  } catch (error) {
    console.error('❌ Error during debugging:', error.message);
  } finally {
    // Keep browser open for manual inspection
    console.log('\n🔍 Browser will stay open for manual inspection...');
    // await browser.close();
  }
}

debugChangelog();