const { chromium } = require('playwright');

async function testDirectFix() {
    const browser = await chromium.launch({ headless: false });
    const page = await browser.newPage();
    
    try {
        console.log('🧪 Testing Direct CSS Fix...');
        await page.goto('http://localhost:3000/docs/components/card');
        await page.waitForSelector('elvt-card', { timeout: 5000 });
        
        // Force hard refresh to clear cache
        await page.reload({ waitUntil: 'networkidle' });
        await page.waitForSelector('elvt-card', { timeout: 5000 });
        
        // Test different CSS approaches directly in the browser
        const directTest = await page.evaluate(() => {
            const card = document.querySelector('elvt-card[layer="elevated"]');
            const results = {};
            
            // Test 1: Check current state
            results.before = {
                backgroundColor: getComputedStyle(card).backgroundColor,
                fillToken: getComputedStyle(card).getPropertyValue('--fill')
            };
            
            // Test 2: Add our CSS rule directly to the page
            const style = document.createElement('style');
            style.textContent = `
                main elvt-card:not(.doc-header-section):not(.color-swatch) {
                    background-color: unset !important;
                }
            `;
            document.head.appendChild(style);
            card.offsetHeight; // Force reflow
            
            results.afterUnset = {
                backgroundColor: getComputedStyle(card).backgroundColor,
                fillToken: getComputedStyle(card).getPropertyValue('--fill')
            };
            
            // Test 3: Try with initial
            style.textContent = `
                main elvt-card:not(.doc-header-section):not(.color-swatch) {
                    background-color: initial !important;
                }
            `;
            card.offsetHeight;
            
            results.afterInitial = {
                backgroundColor: getComputedStyle(card).backgroundColor,
                fillToken: getComputedStyle(card).getPropertyValue('--fill')
            };
            
            // Test 4: Try forcing the var(--fill) directly
            style.textContent = `
                main elvt-card:not(.doc-header-section):not(.color-swatch) {
                    background-color: var(--fill) !important;
                }
            `;
            card.offsetHeight;
            
            results.afterVarFill = {
                backgroundColor: getComputedStyle(card).backgroundColor,
                fillToken: getComputedStyle(card).getPropertyValue('--fill')
            };
            
            // Test 5: Try the exact token value
            const fillValue = getComputedStyle(card).getPropertyValue('--fill').trim();
            style.textContent = `
                main elvt-card:not(.doc-header-section):not(.color-swatch) {
                    background-color: ${fillValue} !important;
                }
            `;
            card.offsetHeight;
            
            results.afterDirectValue = {
                backgroundColor: getComputedStyle(card).backgroundColor,
                fillToken: getComputedStyle(card).getPropertyValue('--fill'),
                directValue: fillValue
            };
            
            return results;
        });
        
        console.log('📊 Direct CSS Test Results:');
        Object.entries(directTest).forEach(([test, result]) => {
            console.log(`${test}:`);
            console.log(`  Background: ${result.backgroundColor}`);
            console.log(`  --fill Token: ${result.fillToken}`);
            if (result.directValue) console.log(`  Direct Value Used: ${result.directValue}`);
            
            const isWorking = result.backgroundColor !== 'rgba(0, 0, 0, 0)';
            console.log(`  Status: ${isWorking ? '✅ WORKING' : '❌ TRANSPARENT'}`);
        });
        
        // Find which test worked
        const workingTests = Object.entries(directTest).filter(([_, result]) => 
            result.backgroundColor !== 'rgba(0, 0, 0, 0)'
        );
        
        console.log(`\n🎯 Working Solutions: ${workingTests.length > 0 ? workingTests.map(([name]) => name).join(', ') : 'None'}`);
        
        if (workingTests.length > 0) {
            console.log('\n✅ SOLUTION FOUND! Using the working approach...');
        } else {
            console.log('\n❌ No direct CSS approach worked. The issue may be deeper in Shadow DOM.');
        }
        
    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        await browser.close();
    }
}

testDirectFix();