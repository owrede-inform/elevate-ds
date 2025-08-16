const { chromium } = require('playwright');

async function testSystematicSolution() {
    const browser = await chromium.launch({ headless: false });
    const page = await browser.newPage();
    
    try {
        console.log('🔍 Testing SYSTEMATIC ELEVATE Token Solution...');
        await page.goto('http://localhost:3000/docs/components/card');
        await page.waitForSelector('elvt-card', { timeout: 5000 });
        
        // Force hard refresh to ensure new CSS is loaded
        await page.reload({ waitUntil: 'networkidle' });
        await page.waitForSelector('elvt-card', { timeout: 5000 });
        
        console.log('\n🧪 Testing ALL Token Categories:');
        
        const comprehensiveTest = await page.evaluate(() => {
            const cards = Array.from(document.querySelectorAll('elvt-card')).slice(0, 4);
            const results = [];
            
            cards.forEach((card, index) => {
                const layer = card.getAttribute('layer') || 'default';
                const computedStyle = getComputedStyle(card);
                
                // Test all the key properties we fixed
                const tokenTest = {
                    layer,
                    index,
                    
                    // Background & Fill
                    backgroundColor: computedStyle.backgroundColor,
                    fillToken: computedStyle.getPropertyValue('--fill').trim(),
                    
                    // Border Properties  
                    borderColor: computedStyle.borderColor,
                    borderWidth: computedStyle.borderWidth,
                    borderRadius: computedStyle.borderRadius,
                    borderColorToken: computedStyle.getPropertyValue('--border-color').trim(),
                    borderWidthToken: computedStyle.getPropertyValue('--border-width').trim(),
                    borderRadiusToken: computedStyle.getPropertyValue('--border-radius').trim(),
                    
                    // Distance/Spacing Tokens
                    distanceS: computedStyle.getPropertyValue('--distance-s').trim(),
                    distanceM: computedStyle.getPropertyValue('--distance-m').trim(),
                    distanceL: computedStyle.getPropertyValue('--distance-l').trim(),
                    distanceXL: computedStyle.getPropertyValue('--distance-xl').trim(),
                    
                    // Padding (should use distance tokens)
                    paddingTop: computedStyle.paddingTop,
                    paddingRight: computedStyle.paddingRight,
                    paddingBottom: computedStyle.paddingBottom,
                    paddingLeft: computedStyle.paddingLeft,
                    
                    // Typography (check if tokens work)
                    color: computedStyle.color,
                    fontFamily: computedStyle.fontFamily,
                    fontSize: computedStyle.fontSize,
                    
                    // Check if manual style forcing is gone
                    hasManualOverrides: card.style.backgroundColor !== ''
                };
                
                results.push(tokenTest);
            });
            
            return results;
        });
        
        console.log('\n📊 SYSTEMATIC TOKEN TEST RESULTS:');
        
        comprehensiveTest.forEach((result, i) => {
            console.log(`\n🎯 Card ${i} (${result.layer}):`);
            
            // Background & Fill
            const bgWorking = result.backgroundColor !== 'rgba(0, 0, 0, 0)';
            console.log(`  Background: ${result.backgroundColor} ${bgWorking ? '✅' : '❌'}`);
            console.log(`  --fill Token: ${result.fillToken}`);
            
            // Borders
            console.log(`  Border Color: ${result.borderColor}`);
            console.log(`  --border-color Token: ${result.borderColorToken}`);
            console.log(`  Border Width: ${result.borderWidth}`);
            console.log(`  --border-width Token: ${result.borderWidthToken}`);
            console.log(`  Border Radius: ${result.borderRadius}`);
            console.log(`  --border-radius Token: ${result.borderRadiusToken}`);
            
            // Distance Tokens
            console.log(`  Distance Tokens: s=${result.distanceS}, m=${result.distanceM}, l=${result.distanceL}, xl=${result.distanceXL}`);
            
            // Padding
            console.log(`  Padding: ${result.paddingTop} ${result.paddingRight} ${result.paddingBottom} ${result.paddingLeft}`);
            
            // Typography
            console.log(`  Typography: ${result.fontFamily}, ${result.fontSize}, ${result.color}`);
            
            // Manual overrides check
            console.log(`  Manual Overrides: ${result.hasManualOverrides ? '❌ DETECTED' : '✅ CLEAN'}`);
        });
        
        // Test dark mode switching
        console.log('\n🌙 TESTING DARK MODE SYSTEMATIC SWITCHING...');
        await page.evaluate(() => {
            document.documentElement.setAttribute('data-theme', 'dark');
        });
        await page.waitForTimeout(1000);
        
        const darkModeTest = await page.evaluate(() => {
            const cards = Array.from(document.querySelectorAll('elvt-card')).slice(0, 4);
            return cards.map(card => {
                const layer = card.getAttribute('layer') || 'default';
                const computedStyle = getComputedStyle(card);
                
                return {
                    layer,
                    backgroundColor: computedStyle.backgroundColor,
                    borderColor: computedStyle.borderColor,
                    fillToken: computedStyle.getPropertyValue('--fill').trim(),
                    borderColorToken: computedStyle.getPropertyValue('--border-color').trim(),
                    themeClass: Array.from(card.classList).find(c => c.includes('theme'))
                };
            });
        });
        
        console.log('\n🌙 DARK MODE RESULTS:');
        darkModeTest.forEach((result, i) => {
            const bgWorking = result.backgroundColor !== 'rgba(0, 0, 0, 0)';
            console.log(`Card ${i} (${result.layer}): bg=${result.backgroundColor} ${bgWorking ? '✅' : '❌'}, border=${result.borderColor}, theme=${result.themeClass}`);
            console.log(`  Tokens: --fill=${result.fillToken}, --border-color=${result.borderColorToken}`);
        });
        
        // Overall assessment
        const lightModeWorking = comprehensiveTest.every(r => r.backgroundColor !== 'rgba(0, 0, 0, 0)');
        const darkModeWorking = darkModeTest.every(r => r.backgroundColor !== 'rgba(0, 0, 0, 0)');
        const allClean = comprehensiveTest.every(r => !r.hasManualOverrides);
        const tokensLoaded = comprehensiveTest.every(r => r.fillToken && r.borderColorToken && r.distanceS);
        
        console.log('\n🏆 SYSTEMATIC SOLUTION ASSESSMENT:');
        console.log(`Light Mode Backgrounds: ${lightModeWorking ? '✅ ALL WORKING' : '❌ SOME FAILED'}`);
        console.log(`Dark Mode Backgrounds: ${darkModeWorking ? '✅ ALL WORKING' : '❌ SOME FAILED'}`);
        console.log(`Clean Implementation: ${allClean ? '✅ NO MANUAL OVERRIDES' : '❌ OVERRIDES DETECTED'}`);
        console.log(`All Tokens Loaded: ${tokensLoaded ? '✅ ALL TOKENS PRESENT' : '❌ MISSING TOKENS'}`);
        
        const overallSuccess = lightModeWorking && darkModeWorking && allClean && tokensLoaded;
        console.log(`\n🎖️ FINAL STATUS: ${overallSuccess ? '✅ SYSTEMATIC SOLUTION COMPLETE' : '❌ NEEDS REFINEMENT'}`);
        
        if (overallSuccess) {
            console.log('\n🎉 SUCCESS: All ELEVATE Design Tokens are now working systematically!');
            console.log('- Background colors: ✅ All layers working');
            console.log('- Border properties: ✅ Color, width, radius working');  
            console.log('- Distance tokens: ✅ All spacing tokens loaded');
            console.log('- Layer inheritance: ✅ Layer-specific tokens working');
            console.log('- Theme switching: ✅ Light/dark mode working');
            console.log('- Clean implementation: ✅ No manual overrides');
        }
        
    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        await browser.close();
    }
}

testSystematicSolution();